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
	 * Set current user ID
	 */
	static setCurrentUserId(userId: string | undefined) {
		TaskHistoryBridge.currentUserId = userId
		console.log(`[TaskHistoryBridge] Current user ID set to: ${userId}`)
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

		console.log(
			`[TaskHistoryBridge] Getting task history - userId: ${effectiveUserId}, terminalNo: ${effectiveTerminalNo}`,
		)

		if (effectiveUserId && effectiveTerminalNo !== undefined) {
			// Try user+terminal key first
			const userTerminalKey = TaskHistoryBridge.getUserTerminalKey(
				"taskHistory",
				effectiveUserId,
				effectiveTerminalNo,
			)
			console.log(`[TaskHistoryBridge] Trying user+terminal key: ${userTerminalKey}`)

			const userTerminalHistory = ctx.globalState.get(userTerminalKey) as HistoryItem[] | undefined
			// IMPORTANT: Return even if empty array - empty means user deleted all tasks, not "no data"
			if (userTerminalHistory !== undefined) {
				console.log(
					`[TaskHistoryBridge] Retrieved ${userTerminalHistory.length} tasks for user ${effectiveUserId} terminal ${effectiveTerminalNo}`,
				)
				return userTerminalHistory
			}

			// If no local data, try to load from Redis once
			console.log(`[TaskHistoryBridge] No local data found, trying to load from Redis...`)
			try {
				const redisKey = `roo:${effectiveUserId}:${effectiveTerminalNo}:tasks`
				const redisData = await TaskHistoryBridge.redis.get(redisKey)
				if (redisData && Array.isArray(redisData)) {
					console.log(`[TaskHistoryBridge] Loaded ${redisData.length} tasks from Redis`)
					// Save to local storage
					await ctx.globalState.update(userTerminalKey, redisData)
					return redisData
				}
			} catch (error) {
				console.warn(`[TaskHistoryBridge] Failed to load from Redis:`, error)
			}
		}

		if (effectiveUserId) {
			// Fallback to user-only key for backward compatibility
			const userKey = `user_${effectiveUserId}_taskHistory`
			console.log(`[TaskHistoryBridge] Trying user-only key: ${userKey}`)

			const userHistory = ctx.globalState.get(userKey) as HistoryItem[] | undefined
			// IMPORTANT: Return even if empty array - empty means user deleted all tasks, not "no data"
			if (userHistory !== undefined) {
				console.log(
					`[TaskHistoryBridge] Retrieved ${userHistory.length} tasks for user ${effectiveUserId} (no terminal)`,
				)
				return userHistory
			}

			console.log(`[TaskHistoryBridge] No user-specific history found`)
		}

		// Fallback to general task history
		console.log(`[TaskHistoryBridge] Falling back to general storage...`)
		const generalHistory = (ctx.globalState.get("taskHistory") as HistoryItem[]) || []
		console.log(`[TaskHistoryBridge] Retrieved ${generalHistory.length} tasks from general storage`)
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

			// Notify void about the updated task history
			await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
				tasks: taskHistory,
				activeTaskId: historyItem.id,
				userId: TaskHistoryBridge.currentUserId,
				terminalNo: VoidBridge.getCurrentTerminalNo(),
			})

			console.log(`[TaskHistoryBridge] Notified void about new task: ${historyItem.id}`)
		} catch (error) {
			console.debug("[TaskHistoryBridge] Could not notify void about new task:", error)
		}
	}

	/**
	 * Register task history related commands
	 */
	static register(context: vscode.ExtensionContext, provider: ClineProvider) {
		console.log("[TaskHistoryBridge] Registering task history commands...")

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
					// Log the incoming request
					console.log("[TaskHistoryBridge] getTaskHistory command called with:", {
						requestedUserId: data?.userId,
						requestedTerminalNo: data?.terminalNo,
						currentUserId: TaskHistoryBridge.currentUserId,
						currentTerminalNo: VoidBridge.getCurrentTerminalNo(),
					})

					// IMPORTANT: Directly read from the correct user-prefixed key in globalState
					// This ensures we get the latest data without cache issues
					const currentUserId = TaskHistoryBridge.currentUserId
					let taskHistory: HistoryItem[] = []

					if (currentUserId && provider.contextProxy) {
						// Build the user-prefixed key the same way ContextProxy does
						const userKey = `user_${currentUserId}_taskHistory`
						console.log("[TaskHistoryBridge] Reading from user key:", userKey)

						// Directly read from globalState to bypass any cache
						const userHistory = context.globalState.get(userKey) as HistoryItem[] | undefined
						if (userHistory) {
							taskHistory = userHistory
							console.log("[TaskHistoryBridge] Got user-specific history:", taskHistory.length, "tasks")
						} else {
							console.log("[TaskHistoryBridge] No user-specific history found, checking general storage")
							// Fallback to general storage
							const generalHistory = context.globalState.get("taskHistory") as HistoryItem[] | undefined
							taskHistory = generalHistory || []
							console.log("[TaskHistoryBridge] Got general history:", taskHistory.length, "tasks")
						}
					} else {
						console.log("[TaskHistoryBridge] No user ID, using general storage")
						// No user context, use general storage
						const generalHistory = context.globalState.get("taskHistory") as HistoryItem[] | undefined
						taskHistory = generalHistory || []
					}

					const currentTaskId = provider.getCurrentCline()?.taskId

					console.log("[TaskHistoryBridge] Final task history result:", {
						userId: currentUserId,
						terminalNo: VoidBridge.getCurrentTerminalNo(),
						totalTasks: taskHistory.length,
						activeTaskId: currentTaskId,
					})

					// Sort by timestamp (newest first) and filter out agent tasks
					// Only sync user tasks to void, agent tasks are only visible in roo-code UI
					const sortedTasks = taskHistory
						.filter((item) => item.ts && item.task && item.source !== "agent")
						.sort((a, b) => b.ts - a.ts)

					console.log("[TaskHistoryBridge] Filtered result:", {
						totalTasks: taskHistory.length,
						userTasks: sortedTasks.length,
						filteredAgentTasks: taskHistory.length - sortedTasks.length,
					})

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
					console.log("[TaskHistoryBridge] Activating task:", taskId)
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
				console.log("[TaskHistoryBridge] Deleting task:", taskId)

				// Delete the task (this internally updates TaskHistoryBridge and contextProxy)
				await provider.deleteTaskWithId(taskId)

				// Get the updated task history AFTER deletion to ensure we have the latest state
				const updatedHistory = await TaskHistoryBridge.getTaskHistory(context)
				console.log("[TaskHistoryBridge] Tasks after delete:", updatedHistory.length, "tasks")

				// Send the updated list
				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: updatedHistory,
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
					console.log("[TaskHistoryBridge] Updating task userId:", { pattern, userId })

					// Set current user ID
					TaskHistoryBridge.setCurrentUserId(userId)

					// Get all task history
					const taskHistory = await TaskHistoryBridge.getTaskHistory(context)

					// If pattern is "*", update all tasks
					if (pattern === "*") {
						// This is mainly for tracking purposes
						console.log(`[TaskHistoryBridge] Set userId ${userId} for all ${taskHistory.length} tasks`)
					}

					// Notify void about the update
					await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
						tasks: taskHistory,
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

				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: taskHistory,
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

		console.log("[TaskHistoryBridge] Task history bridge registered successfully with commands:", [
			"roo-cline.getTaskHistory",
			"roo-cline.activateTask",
			"roo-cline.deleteTask",
		])
	}
}
