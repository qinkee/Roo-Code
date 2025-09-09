import * as vscode from "vscode"
import { HistoryItem, RooCodeEventName } from "@roo-code/types"
import { ClineProvider } from "../core/webview/ClineProvider"
import { RedisSyncService } from "../services/RedisSyncService"
import { VoidBridge } from "./void-bridge"

/**
 * Bridge for task history synchronization between Roo-Code and void
 * Provides commands for void to access Roo-Code task history
 */
export class TaskHistoryBridge {
	private static currentUserId: string | undefined = undefined
	private static extensionContext: vscode.ExtensionContext | undefined = undefined
	private static redis = RedisSyncService.getInstance()

	/**
	 * Get storage key with user prefix
	 */
	private static getUserKey(baseKey: string, userId?: string): string {
		const id = userId || TaskHistoryBridge.currentUserId
		return id ? `user_${id}_${baseKey}` : baseKey
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
	 * Get task history for current or specific user
	 * @param forceRefresh If true, will read directly from storage without any caching
	 */
	static async getTaskHistory(
		context?: vscode.ExtensionContext | boolean,
		userIdOrForceRefresh?: string | boolean,
	): Promise<HistoryItem[]> {
		// Handle overloaded parameters
		let ctx: vscode.ExtensionContext | undefined
		let userId: string | undefined
		let forceRefresh = false

		if (typeof context === "boolean") {
			// Called as getTaskHistory(forceRefresh)
			ctx = TaskHistoryBridge.extensionContext
			forceRefresh = context
			userId = undefined
		} else if (typeof userIdOrForceRefresh === "boolean") {
			// Called as getTaskHistory(context, forceRefresh)
			ctx = context || TaskHistoryBridge.extensionContext
			forceRefresh = userIdOrForceRefresh
			userId = undefined
		} else {
			// Called as getTaskHistory(context?, userId?)
			ctx = context || TaskHistoryBridge.extensionContext
			userId = userIdOrForceRefresh
			forceRefresh = false
		}

		if (!ctx) {
			console.error("[TaskHistoryBridge] Extension context not available")
			return []
		}
		// Try user-specific key first
		const effectiveUserId = userId || TaskHistoryBridge.currentUserId
		console.log(
			`[TaskHistoryBridge] Getting task history - effectiveUserId: ${effectiveUserId}, currentUserId: ${TaskHistoryBridge.currentUserId}`,
		)

		if (effectiveUserId) {
			const userKey = TaskHistoryBridge.getUserKey("taskHistory", effectiveUserId)
			console.log(`[TaskHistoryBridge] Trying user-specific key: ${userKey}`)

			const userHistory = ctx.globalState.get(userKey) as HistoryItem[] | undefined
			if (userHistory && userHistory.length > 0) {
				console.log(`[TaskHistoryBridge] Retrieved ${userHistory.length} tasks for user ${effectiveUserId}`)
				return userHistory
			}

			console.log(`[TaskHistoryBridge] No user-specific history found, trying Redis...`)
			// Try to restore from Redis if local is empty
			const terminalNo = VoidBridge.getCurrentTerminalNo()
			const redisKey = terminalNo ? `roo:${effectiveUserId}:${terminalNo}:tasks` : `roo:${effectiveUserId}:tasks`
			const redisHistory = await TaskHistoryBridge.redis.get(redisKey)
			if (redisHistory && Array.isArray(redisHistory)) {
				// Save to local storage
				await ctx.globalState.update(userKey, redisHistory)
				console.log(
					`[TaskHistoryBridge] Restored ${redisHistory.length} tasks from Redis for user ${effectiveUserId}`,
				)
				return redisHistory
			}
		}

		// Fallback to general task history
		console.log(`[TaskHistoryBridge] Falling back to general storage...`)
		const generalHistory = (ctx.globalState.get("taskHistory") as HistoryItem[]) || []
		console.log(`[TaskHistoryBridge] Retrieved ${generalHistory.length} tasks from general storage`)
		return generalHistory
	}

	/**
	 * Update task history for current user
	 */
	static async updateTaskHistory(context?: vscode.ExtensionContext, history?: HistoryItem[]): Promise<void> {
		const ctx = context || TaskHistoryBridge.extensionContext
		if (!ctx) {
			console.error("[TaskHistoryBridge] Extension context not available")
			return
		}

		if (!history) {
			console.error("[TaskHistoryBridge] No history provided to update")
			return
		}

		console.log(
			`[TaskHistoryBridge] Updating task history with ${history.length} tasks for user ${TaskHistoryBridge.currentUserId || "unknown"}`,
		)

		// Always update general history for backward compatibility
		await ctx.globalState.update("taskHistory", history)

		// Also update user-specific history if user ID is available
		if (TaskHistoryBridge.currentUserId) {
			const userKey = TaskHistoryBridge.getUserKey("taskHistory")
			await ctx.globalState.update(userKey, history)
			console.log(
				`[TaskHistoryBridge] Updated task history for user ${TaskHistoryBridge.currentUserId}: ${history.length} tasks`,
			)

			// Async sync to Redis (only keep recent 50 tasks)
			const recentHistory = history.slice(0, 50)
			const terminalNo = VoidBridge.getCurrentTerminalNo()
			const redisKey = terminalNo ? `roo:${TaskHistoryBridge.currentUserId}:${terminalNo}:tasks` : `roo:${TaskHistoryBridge.currentUserId}:tasks`
			TaskHistoryBridge.redis.set(redisKey, recentHistory)
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
			async (data?: { userId?: string }): Promise<{ tasks: HistoryItem[]; activeTaskId?: string }> => {
				try {
					const taskHistory = await TaskHistoryBridge.getTaskHistory(context, data?.userId)
					const currentTaskId = provider.getCurrentCline()?.taskId

					console.log("[TaskHistoryBridge] Getting task history:", {
						userId: data?.userId || TaskHistoryBridge.currentUserId,
						totalTasks: taskHistory.length,
						activeTaskId: currentTaskId,
					})

					// Sort by timestamp (newest first)
					const sortedTasks = taskHistory.filter((item) => item.ts && item.task).sort((a, b) => b.ts - a.ts)

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

				// Get the task history BEFORE deletion to calculate the updated list
				const beforeHistory = await TaskHistoryBridge.getTaskHistory(context)
				console.log("[TaskHistoryBridge] Tasks before delete:", beforeHistory?.length ?? 0)

				// Delete the task
				await provider.deleteTaskWithId(taskId)

				// Manually filter out the deleted task to get the correct updated list
				const updatedHistory = beforeHistory.filter((task) => task.id !== taskId)
				console.log("[TaskHistoryBridge] Tasks after delete:", updatedHistory.length, "tasks")

				// Send the manually calculated updated list
				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: updatedHistory,
					activeTaskId: provider.getCurrentCline()?.taskId,
					userId: TaskHistoryBridge.currentUserId,
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
