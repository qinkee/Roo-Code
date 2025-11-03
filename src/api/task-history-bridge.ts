import * as vscode from "vscode"
import { HistoryItem, RooCodeEventName } from "@roo-code/types"
import { ClineProvider } from "../core/webview/ClineProvider"
import { RedisSyncService } from "../services/RedisSyncService"
import { VoidBridge } from "./void-bridge" // 需要获取terminalNo来区分不同终端

/**
 * Bridge for task history synchronization between Roo-Code and void
 * Provides commands for void to access Roo-Code task history
 */
export class TaskHistoryBridge {
	private static currentUserId: string | undefined = undefined
	private static extensionContext: vscode.ExtensionContext | undefined = undefined
	private static redis = RedisSyncService.getInstance()

	// 🔥 Simple cache to avoid repeated reads within short time window
	private static cache: {
		data: HistoryItem[]
		timestamp: number
		key: string // Storage key to detect user/terminal switches
	} | null = null
	private static CACHE_TTL = 1000 // 1 second cache TTL

	/**
	 * Get storage key with user and terminal prefix
	 * Format: user_{userId}_terminal_{terminalNo}_{baseKey}
	 */
	private static getUserTerminalKey(baseKey: string, userId?: string, terminalNo?: number): string {
		const id = userId || TaskHistoryBridge.currentUserId
		const terminal = terminalNo !== undefined ? terminalNo : VoidBridge.getCurrentTerminalNo()

		if (id && terminal !== undefined) {
			return `user_${id}_terminal_${terminal}_${baseKey}`
		} else if (id) {
			return `user_${id}_${baseKey}`
		}
		return baseKey
	}

	/**
	 * Get current storage key for caching
	 */
	private static getCurrentStorageKey(userId?: string, terminalNo?: number): string {
		return this.getUserTerminalKey("taskHistory", userId, terminalNo)
	}

	/**
	 * Set current user ID
	 */
	static setCurrentUserId(userId: string | undefined) {
		TaskHistoryBridge.currentUserId = userId
	}

	/**
	 * Get current user ID
	 */
	static getCurrentUserId(): string | undefined {
		return TaskHistoryBridge.currentUserId
	}

	/**
	 * Set extension context for static methods
	 */
	static setContext(context: vscode.ExtensionContext) {
		TaskHistoryBridge.extensionContext = context
	}

	/**
	 * Get task history for current or specific user and terminal
	 * @param context Extension context
	 * @param options Options for getting task history
	 */
	static async getTaskHistory(
		context?: vscode.ExtensionContext | boolean,
		options?: { userId?: string; terminalNo?: number; forceRefresh?: boolean } | string | boolean,
	): Promise<HistoryItem[]> {
		// Handle overloaded parameters
		let ctx: vscode.ExtensionContext | undefined
		let userId: string | undefined
		let terminalNo: number | undefined
		let forceRefresh = false

		if (typeof context === "boolean") {
			// Called as getTaskHistory(forceRefresh)
			ctx = TaskHistoryBridge.extensionContext
			forceRefresh = context
		} else if (typeof options === "boolean") {
			// Called as getTaskHistory(context, forceRefresh)
			ctx = context || TaskHistoryBridge.extensionContext
			forceRefresh = options
		} else if (typeof options === "string") {
			// Called as getTaskHistory(context?, userId?) - backward compatibility
			ctx = context || TaskHistoryBridge.extensionContext
			userId = options
		} else if (typeof options === "object" && options !== null) {
			// Called with options object
			ctx = (context as vscode.ExtensionContext | undefined) || TaskHistoryBridge.extensionContext
			userId = options.userId
			terminalNo = options.terminalNo
			forceRefresh = options.forceRefresh || false
		} else {
			// Called as getTaskHistory(context?)
			ctx = (context as vscode.ExtensionContext | undefined) || TaskHistoryBridge.extensionContext
		}

		if (!ctx) {
			console.error("[TaskHistoryBridge] Extension context not available")
			return []
		}

		// Try user+terminal specific key first
		const effectiveUserId = userId || TaskHistoryBridge.currentUserId
		const effectiveTerminalNo = terminalNo !== undefined ? terminalNo : VoidBridge.getCurrentTerminalNo()

		// 🔥 Check cache first (unless forceRefresh is true)
		const now = Date.now()
		const currentKey = TaskHistoryBridge.getCurrentStorageKey(effectiveUserId, effectiveTerminalNo)

		if (!forceRefresh &&
			TaskHistoryBridge.cache &&
			(now - TaskHistoryBridge.cache.timestamp < TaskHistoryBridge.CACHE_TTL) &&
			TaskHistoryBridge.cache.key === currentKey) {
			return TaskHistoryBridge.cache.data
		}

		if (effectiveUserId && effectiveTerminalNo !== undefined) {
			// Try user+terminal key first
			const userTerminalKey = TaskHistoryBridge.getUserTerminalKey(
				"taskHistory",
				effectiveUserId,
				effectiveTerminalNo,
			)

			const userTerminalHistory = ctx.globalState.get(userTerminalKey) as HistoryItem[] | undefined
			// IMPORTANT: Return even if empty array - empty means user deleted all tasks, not "no data"
			if (userTerminalHistory !== undefined) {
				// 🔥 Update cache before returning
				TaskHistoryBridge.cache = {
					data: userTerminalHistory,
					timestamp: now,
					key: currentKey
				}
				return userTerminalHistory
			}

			// If no local data, try to load from Redis once
			try {
				const redisKey = `roo:${effectiveUserId}:${effectiveTerminalNo}:tasks`
				const redisData = await TaskHistoryBridge.redis.get(redisKey)
				if (redisData && Array.isArray(redisData)) {
					// Save to local storage
					await ctx.globalState.update(userTerminalKey, redisData)
					// 🔥 Update cache before returning
					TaskHistoryBridge.cache = {
						data: redisData,
						timestamp: now,
						key: currentKey
					}
					return redisData
				}
			} catch (error) {
				console.warn(`[TaskHistoryBridge] Failed to load from Redis:`, error)
			}
		}

		if (effectiveUserId) {
			// Fallback to user-only key for backward compatibility
			const userKey = `user_${effectiveUserId}_taskHistory`

			const userHistory = ctx.globalState.get(userKey) as HistoryItem[] | undefined
			// IMPORTANT: Return even if empty array - empty means user deleted all tasks, not "no data"
			if (userHistory !== undefined) {
				// 🔥 Update cache before returning
				TaskHistoryBridge.cache = {
					data: userHistory,
					timestamp: now,
					key: currentKey
				}
				return userHistory
			}
		}

		// Fallback to general task history
		const generalHistory = (ctx.globalState.get("taskHistory") as HistoryItem[]) || []
		// 🔥 Update cache before returning
		TaskHistoryBridge.cache = {
			data: generalHistory,
			timestamp: now,
			key: currentKey
		}
		return generalHistory
	}

	/**
	 * Update task history for current user and terminal
	 * @param context - Extension context
	 * @param history - Task history to update
	 * @param immediate - Whether to sync to Redis immediately (default: false). Set to true for delete operations.
	 */
	static async updateTaskHistory(
		context?: vscode.ExtensionContext,
		history?: HistoryItem[],
		immediate: boolean = false,
	): Promise<void> {
		const ctx = context || TaskHistoryBridge.extensionContext
		if (!ctx) {
			console.error("[TaskHistoryBridge] Extension context not available")
			return
		}

		if (!history) {
			console.error("[TaskHistoryBridge] No history provided to update")
			return
		}

		const terminalNo = VoidBridge.getCurrentTerminalNo()
		console.log(
			`[TaskHistoryBridge] Updating task history with ${history.length} tasks for user ${TaskHistoryBridge.currentUserId || "unknown"} terminal ${terminalNo}`,
		)

		// Always update general history for backward compatibility
		await ctx.globalState.update("taskHistory", history)

		// Update user+terminal specific history if both are available
		if (TaskHistoryBridge.currentUserId && terminalNo !== undefined) {
			const userTerminalKey = TaskHistoryBridge.getUserTerminalKey("taskHistory")
			await ctx.globalState.update(userTerminalKey, history)
			console.log(
				`[TaskHistoryBridge] Updated task history for user ${TaskHistoryBridge.currentUserId} terminal ${terminalNo}: ${history.length} tasks`,
			)

			// Sync to Redis with terminal distinction (sync empty array too to represent user deletion)
			const recentHistory = history.slice(0, 50)
			const redisKey = `roo:${TaskHistoryBridge.currentUserId}:${terminalNo}:tasks`
			// Use immediate sync for delete operations to ensure Redis is updated right away
			TaskHistoryBridge.redis.set(redisKey, recentHistory, immediate)
			console.log(
				`[TaskHistoryBridge] ${immediate ? "Immediately synced" : "Queued sync for"} ${recentHistory.length} tasks to Redis key: ${redisKey}`,
			)
		} else if (TaskHistoryBridge.currentUserId) {
			// Fallback to user-only key if no terminal
			const userKey = `user_${TaskHistoryBridge.currentUserId}_taskHistory`
			await ctx.globalState.update(userKey, history)
			console.log(
				`[TaskHistoryBridge] Updated task history for user ${TaskHistoryBridge.currentUserId} (no terminal): ${history.length} tasks`,
			)
		} else {
			console.warn("[TaskHistoryBridge] No currentUserId available, only updated general history")
		}

		// 🔥 Update cache immediately after write (write-through cache strategy)
		const currentKey = TaskHistoryBridge.getCurrentStorageKey(TaskHistoryBridge.currentUserId, terminalNo)
		TaskHistoryBridge.cache = {
			data: history,
			timestamp: Date.now(),
			key: currentKey
		}
	}

	/**
	 * Filter out agent tasks - only sync user tasks to void
	 * Agent tasks are only visible in roo-code UI
	 */
	private static filterUserTasks(tasks: HistoryItem[]): HistoryItem[] {
		return tasks.filter((task) => task.source !== "agent")
	}

	/**
	 * Notify void about a newly created task
	 */
	static async notifyTaskCreated(historyItem: HistoryItem): Promise<void> {
		try {
			// Get current task history
			const taskHistory = await TaskHistoryBridge.getTaskHistory()

			// Find the new task in history (it should already be there from updateTaskHistory)
			const taskExists = taskHistory.some((t) => t.id === historyItem.id)
			if (!taskExists) {
				taskHistory.push(historyItem)
			}

			// Filter out agent tasks before sending to void
			const userTasks = TaskHistoryBridge.filterUserTasks(taskHistory)

			// Notify void about the updated task history
			await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
				tasks: userTasks,
				activeTaskId: historyItem.id,
				userId: TaskHistoryBridge.currentUserId,
				terminalNo: VoidBridge.getCurrentTerminalNo(),
			})
		} catch (error) {
			console.debug("[TaskHistoryBridge] Could not notify void about new task:", error)
		}
	}

	/**
	 * Register task history related commands
	 */
	static register(context: vscode.ExtensionContext, provider: ClineProvider) {

		// Store context for static methods
		TaskHistoryBridge.setContext(context)

		// Command to get task history
		const getTaskHistoryCommand = vscode.commands.registerCommand(
			"roo-cline.getTaskHistory",
			async (data?: {
				userId?: string
				terminalNo?: number
			}): Promise<{ tasks: HistoryItem[]; activeTaskId?: string }> => {
				try {
					// IMPORTANT: Directly read from the correct user-prefixed key in globalState
					// This ensures we get the latest data without cache issues
					const currentUserId = TaskHistoryBridge.currentUserId
					let taskHistory: HistoryItem[] = []

					if (currentUserId && provider.contextProxy) {
						// Build the user-prefixed key the same way ContextProxy does
						const userKey = `user_${currentUserId}_taskHistory`

						// Directly read from globalState to bypass any cache
						const userHistory = context.globalState.get(userKey) as HistoryItem[] | undefined
						if (userHistory) {
							taskHistory = userHistory
						} else {
							// Fallback to general storage
							const generalHistory = context.globalState.get("taskHistory") as HistoryItem[] | undefined
							taskHistory = generalHistory || []
						}
					} else {
						// No user context, use general storage
						const generalHistory = context.globalState.get("taskHistory") as HistoryItem[] | undefined
						taskHistory = generalHistory || []
					}

					const currentTaskId = provider.getCurrentCline()?.taskId

					// Sort by timestamp (newest first) and filter out agent tasks
					// Only sync user tasks to void, agent tasks are only visible in roo-code UI
					const sortedTasks = taskHistory
						.filter((item) => item.ts && item.task && item.source !== "agent")
						.sort((a, b) => b.ts - a.ts)

					return {
						tasks: sortedTasks,
						activeTaskId: currentTaskId,
					}
				} catch (error) {
					console.error("[TaskHistoryBridge] Error getting task history:", error)
					return { tasks: [], activeTaskId: undefined }
				}
			},
		)

		context.subscriptions.push(getTaskHistoryCommand)

		// Command to activate a specific task
		const activateTaskCommand = vscode.commands.registerCommand(
			"roo-cline.activateTask",
			async (taskId: string) => {
				try {
					await provider.showTaskWithId(taskId)

					// Notify void about the activation
					await vscode.commands.executeCommand("void.onTaskActivated", {
						taskId,
						previousTaskId: provider.getCurrentCline()?.taskId,
					})

					return { success: true }
				} catch (error) {
					console.error("[TaskHistoryBridge] Error activating task:", error)
					return { success: false, error: error instanceof Error ? error.message : String(error) }
				}
			},
		)

		context.subscriptions.push(activateTaskCommand)

		// Command to delete a task
		const deleteTaskCommand = vscode.commands.registerCommand("roo-cline.deleteTask", async (taskId: string) => {
			try {
				// Delete the task (this internally updates TaskHistoryBridge and contextProxy)
				await provider.deleteTaskWithId(taskId)

				// Get the updated task history AFTER deletion to ensure we have the latest state
				const updatedHistory = await TaskHistoryBridge.getTaskHistory(context)

				// Filter out agent tasks before sending to void
				const userTasks = TaskHistoryBridge.filterUserTasks(updatedHistory)

				// Send the updated list
				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: userTasks,
					activeTaskId: provider.getCurrentCline()?.taskId,
					userId: TaskHistoryBridge.currentUserId,
					terminalNo: VoidBridge.getCurrentTerminalNo(),
				})

				return { success: true }
			} catch (error) {
				console.error("[TaskHistoryBridge] Error deleting task:", error)
				return { success: false, error: error instanceof Error ? error.message : String(error) }
			}
		})

		context.subscriptions.push(deleteTaskCommand)

		// Command to update userId for tasks
		const updateTaskUserIdCommand = vscode.commands.registerCommand(
			"roo-cline.updateTaskUserId",
			async (pattern: string, userId: string) => {
				try {
					// Set current user ID
					TaskHistoryBridge.setCurrentUserId(userId)

					// Get all task history
					const taskHistory = await TaskHistoryBridge.getTaskHistory(context)

					// Filter out agent tasks before sending to void
					const userTasks = TaskHistoryBridge.filterUserTasks(taskHistory)

					// Notify void about the update
					await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
						tasks: userTasks,
						activeTaskId: provider.getCurrentCline()?.taskId,
						userId: userId,
						terminalNo: VoidBridge.getCurrentTerminalNo(),
					})

					return { success: true, updated: taskHistory.length }
				} catch (error) {
					console.error("[TaskHistoryBridge] Error updating task userId:", error)
					return { success: false, error: error instanceof Error ? error.message : String(error) }
				}
			},
		)

		context.subscriptions.push(updateTaskUserIdCommand)

		// Helper function to notify void when task history changes
		const notifyTaskHistoryUpdate = async () => {
			try {
				const taskHistory = await TaskHistoryBridge.getTaskHistory(context)
				const currentTaskId = provider.getCurrentCline()?.taskId

				// Filter out agent tasks before sending to void
				const userTasks = TaskHistoryBridge.filterUserTasks(taskHistory)

				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: userTasks,
					activeTaskId: currentTaskId,
					userId: TaskHistoryBridge.currentUserId,
					terminalNo: VoidBridge.getCurrentTerminalNo(),
				})
			} catch (error) {
				// Silently fail if void is not listening
				console.debug("[TaskHistoryBridge] Could not notify void about task history update:", error)
			}
		}

		// Listen to task events to notify void
		provider.on(RooCodeEventName.TaskCreated, () => {
			notifyTaskHistoryUpdate()
		})

		provider.on(RooCodeEventName.TaskCompleted, () => {
			notifyTaskHistoryUpdate()
		})

		provider.on(RooCodeEventName.TaskAborted, () => {
			notifyTaskHistoryUpdate()
		})
	}
}
