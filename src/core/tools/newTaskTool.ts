import delay from "delay"

import { RooCodeEventName } from "@roo-code/types"

import { ToolUse, AskApproval, HandleError, PushToolResult, RemoveClosingTag } from "../../shared/tools"
import { Task } from "../task/Task"
import { defaultModeSlug, getModeBySlug } from "../../shared/modes"
import { formatResponse } from "../prompts/responses"
import { t } from "../../i18n"

export async function newTaskTool(
	cline: Task,
	block: ToolUse,
	askApproval: AskApproval,
	handleError: HandleError,
	pushToolResult: PushToolResult,
	removeClosingTag: RemoveClosingTag,
) {
	const mode: string | undefined = block.params.mode
	const message: string | undefined = block.params.message

	// 🔥 添加调试日志
	const provider = cline.providerRef.deref()
	provider?.log(
		`[newTaskTool] Called with mode=${mode}, message=${message?.substring(0, 100)}..., partial=${block.partial}`,
	)
	provider?.log(`[newTaskTool] Is agent task: ${!!cline.agentTaskContext}`)

	try {
		if (block.partial) {
			const partialMessage = JSON.stringify({
				tool: "newTask",
				mode: removeClosingTag("mode", mode),
				content: removeClosingTag("message", message),
			})

			await cline.ask("tool", partialMessage, block.partial).catch(() => {})
			return
		} else {
			if (!mode) {
				cline.consecutiveMistakeCount++
				cline.recordToolError("new_task")
				pushToolResult(await cline.sayAndCreateMissingParamError("new_task", "mode"))
				return
			}

			if (!message) {
				cline.consecutiveMistakeCount++
				cline.recordToolError("new_task")
				pushToolResult(await cline.sayAndCreateMissingParamError("new_task", "message"))
				return
			}

			cline.consecutiveMistakeCount = 0
			// Un-escape one level of backslashes before '@' for hierarchical subtasks
			// Un-escape one level: \\@ -> \@ (removes one backslash for hierarchical subtasks)
			const unescapedMessage = message.replace(/\\\\@/g, "\\@")

			// Verify the mode exists
			const targetMode = getModeBySlug(mode, (await cline.providerRef.deref()?.getState())?.customModes)

			if (!targetMode) {
				pushToolResult(formatResponse.toolError(`Invalid mode: ${mode}`))
				return
			}

			const toolMessage = JSON.stringify({
				tool: "newTask",
				mode: targetMode.name,
				content: message,
			})

			provider?.log(`[newTaskTool] Calling askApproval...`)
			const didApprove = await askApproval("tool", toolMessage)
			provider?.log(`[newTaskTool] askApproval returned: ${didApprove}`)

			if (!didApprove) {
				provider?.log(`[newTaskTool] ❌ Approval denied, exiting`)
				return
			}

			if (!provider) {
				return
			}

			if (cline.enableCheckpoints) {
				cline.checkpointSave(true)
			}

			// Preserve the current mode so we can resume with it later.
			cline.pausedModeSlug = (await provider.getState()).mode ?? defaultModeSlug

			// Create new task instance first (this preserves parent's current mode in its history)
			// 🔥 如果父任务是智能体任务，子任务也应该继承 agentTaskContext
			const taskOptions: any = {
				startTask: true, // 🔥 确保子任务自动启动
			}
			if (cline.agentTaskContext) {
				taskOptions.agentTaskContext = cline.agentTaskContext
			}
			const newCline = await provider.initClineWithTask(unescapedMessage, undefined, cline, taskOptions)
			if (!newCline) {
				pushToolResult(t("tools:newTask.errors.policy_restriction"))
				return
			}

			// Now switch the newly created task to the desired mode
			await provider.handleModeSwitch(mode)

			// Delay to allow mode change to take effect
			await delay(500)

			cline.emit(RooCodeEventName.TaskSpawned, newCline.taskId)

			pushToolResult(`Successfully created new task in ${targetMode.name} mode with message: ${unescapedMessage}`)

			// Set the isPaused flag to true so the parent
			// task can wait for the sub-task to finish.
			cline.isPaused = true
			cline.emit(RooCodeEventName.TaskPaused)

			return
		}
	} catch (error) {
		await handleError("creating new task", error)
		return
	}
}
