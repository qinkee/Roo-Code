import * as vscode from "vscode"
import { HistoryItem, RooCodeEventName } from "@roo-code/types"
import { ClineProvider } from "../core/webview/ClineProvider"

/**
 * Bridge for task history synchronization between Roo-Code and void
 * Provides commands for void to access Roo-Code task history
 */
export class TaskHistoryBridge {
	/**
	 * Register task history related commands
	 */
	static register(context: vscode.ExtensionContext, provider: ClineProvider) {
		// Command to get task history
		const getTaskHistoryCommand = vscode.commands.registerCommand(
			"roo-code.getTaskHistory",
			async (): Promise<{ tasks: HistoryItem[]; activeTaskId?: string }> => {
				try {
					const taskHistory = (context.globalState.get("taskHistory") as HistoryItem[]) || []
					const currentTaskId = provider.getCurrentCline()?.taskId

					console.log("[TaskHistoryBridge] Getting task history:", {
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
		const activateTaskCommand = vscode.commands.registerCommand("roo-code.activateTask", async (taskId: string) => {
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
		})

		context.subscriptions.push(activateTaskCommand)

		// Command to delete a task
		const deleteTaskCommand = vscode.commands.registerCommand("roo-code.deleteTask", async (taskId: string) => {
			try {
				console.log("[TaskHistoryBridge] Deleting task:", taskId)
				await provider.deleteTaskWithId(taskId)

				// Notify void about the update
				const taskHistory = (context.globalState.get("taskHistory") as HistoryItem[]) || []
				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: taskHistory,
					activeTaskId: provider.getCurrentCline()?.taskId,
				})

				return { success: true }
			} catch (error) {
				console.error("[TaskHistoryBridge] Error deleting task:", error)
				return { success: false, error: error instanceof Error ? error.message : String(error) }
			}
		})

		context.subscriptions.push(deleteTaskCommand)

		// Helper function to notify void when task history changes
		const notifyTaskHistoryUpdate = async () => {
			try {
				const taskHistory = (context.globalState.get("taskHistory") as HistoryItem[]) || []
				const currentTaskId = provider.getCurrentCline()?.taskId

				await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
					tasks: taskHistory,
					activeTaskId: currentTaskId,
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

		console.log("[TaskHistoryBridge] Task history bridge registered successfully")
	}
}
