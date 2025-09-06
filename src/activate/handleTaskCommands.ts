import * as vscode from "vscode"
import { ClineProvider } from "../core/webview/ClineProvider"
import { getModeBySlug, modes as DEFAULT_MODES } from "../shared/modes"
import { TaskHistoryBridge } from "../api/task-history-bridge"
import { t } from "../i18n"
import { ZeroWidthEncoder, MentionHelper, MentionParams } from "../utils/zeroWidthEncoder"

interface TaskExecutionParams {
	taskId?: string
	content: string
	metadata?: Record<string, any>
}

interface ModeTaskExecutionParams {
	modeId: string
	content: string
	config?: Record<string, any>
}

/**
 * Execute a task directly - create new or continue existing
 * Reuses ClineProvider.handleCodeAction logic for consistency
 */
export const executeTask = async (params: TaskExecutionParams | null | undefined) => {
	const visibleProvider = ClineProvider.getVisibleInstance()
	if (!visibleProvider) {
		vscode.window.showWarningMessage(t("common:errors.no_visible_instance"))
		return
	}

	if (!params?.content) {
		const content = await vscode.window.showInputBox({
			prompt: t("common:input.task_prompt"),
			placeHolder: t("common:input.task_placeholder"),
		})

		if (!content) {
			return
		}

		params = { content }
	}

	try {
		// 记录元数据（如果有，后续扩展用）
		if (params.metadata && Object.keys(params.metadata).length > 0) {
			console.log("[ExecuteTask] 收到元数据:", params.metadata)
			// 预留扩展点：未来可以根据元数据进行额外处理
		}

		if (params.taskId) {
			// Continue existing task with multi-round conversation
			const { historyItem } = await visibleProvider.getTaskWithId(params.taskId)
			if (historyItem) {
				// Restore the task from history
				const task = await visibleProvider.initClineWithHistoryItem(historyItem)

				// Wait for the task to be fully initialized
				await new Promise((resolve) => setTimeout(resolve, 200))

				// Auto-respond to the resume prompt with the new message
				// This simulates user clicking "Resume Task" and then typing the new message
				task.handleWebviewAskResponse("messageResponse", params.content)
			} else {
				vscode.window.showErrorMessage(`Task with ID ${params.taskId} not found`)
			}
		} else {
			// Create new task directly
			await visibleProvider.initClineWithTask(params.content)
		}
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to execute task: ${error}`)
	}
}

/**
 * Execute a task with a specific mode preset
 * Reuses existing mode switching and task creation logic
 */
export const executeTaskWithMode = async (params: ModeTaskExecutionParams | null | undefined) => {
	const visibleProvider = ClineProvider.getVisibleInstance()
	if (!visibleProvider) {
		vscode.window.showWarningMessage(t("common:errors.no_visible_instance"))
		return
	}

	if (!params?.modeId || !params?.content) {
		// Get mode selection
		const customModes = await visibleProvider.customModesManager.getCustomModes()
		const allModes = [...customModes, ...DEFAULT_MODES]

		const modeSelection = await vscode.window.showQuickPick(
			allModes.map((mode) => ({
				label: mode.name,
				description: mode.description,
				value: mode.slug,
			})),
			{
				placeHolder: "Select a mode for the task",
			},
		)

		if (!modeSelection) {
			return
		}

		const content = await vscode.window.showInputBox({
			prompt: t("common:input.task_prompt"),
			placeHolder: t("common:input.task_placeholder"),
		})

		if (!content) {
			return
		}

		params = {
			modeId: modeSelection.value,
			content,
		}
	}

	try {
		// 记录配置信息（如果有，后续扩展用）
		if (params.config && Object.keys(params.config).length > 0) {
			console.log("[ExecuteTaskWithMode] 收到配置:", params.config)
			// 预留扩展点：未来可以根据配置进行额外处理
		}

		// Verify mode exists
		const customModes = await visibleProvider.customModesManager.getCustomModes()
		const mode = getModeBySlug(params.modeId, customModes)

		if (!mode) {
			vscode.window.showErrorMessage(`Mode with ID ${params.modeId} not found`)
			return
		}

		// Switch to the specified mode
		await visibleProvider.updateGlobalState("mode", params.modeId)

		// Load the saved API config for this mode if it exists
		const savedConfigId = await visibleProvider.providerSettingsManager.getModeConfigId(params.modeId)
		if (savedConfigId) {
			const listApiConfig = await visibleProvider.providerSettingsManager.listConfig()
			const profile = listApiConfig.find(({ id }) => id === savedConfigId)

			if (profile?.name) {
				try {
					await visibleProvider.activateProviderProfile({ name: profile.name })
				} catch (error) {
					// Log but continue with default config
					console.warn(`Failed to activate profile for mode ${params.modeId}: ${error}`)
				}
			}
		}

		// Create and execute task with the mode's preset
		await visibleProvider.initClineWithTask(params.content)
	} catch (error) {
		vscode.window.showErrorMessage(`Failed to execute task with mode: ${error}`)
	}
}

/**
 * Helper function to list available tasks
 */
export const listTasks = async (): Promise<Array<{ id: string; label: string; description?: string }>> => {
	const taskHistory = (await TaskHistoryBridge.getTaskHistory()) ?? []
	return taskHistory.map((task) => ({
		id: task.id,
		label: task.task || "Untitled Task",
		description: new Date(task.ts).toLocaleString(),
	}))
}
