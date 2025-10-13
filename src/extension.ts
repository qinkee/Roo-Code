import * as vscode from "vscode"
import * as dotenvx from "@dotenvx/dotenvx"
import * as path from "path"

// Load environment variables from .env file
try {
	// Specify path to .env file in the project root directory
	const envPath = path.join(__dirname, "..", ".env")
	dotenvx.config({ path: envPath })
} catch (e) {
	// Silently handle environment loading errors
	console.warn("Failed to load environment variables:", e)
}

import { CloudService, UnifiedBridgeService } from "@roo-code/cloud"
import { TelemetryService, PostHogTelemetryClient } from "@roo-code/telemetry"

import "./utils/path" // Necessary to have access to String.prototype.toPosix.
import { createOutputChannelLogger, createDualLogger } from "./utils/outputChannelLogger"

import { Package } from "./shared/package"
import { formatLanguage } from "./shared/language"
import { ContextProxy } from "./core/config/ContextProxy"
import { ClineProvider } from "./core/webview/ClineProvider"
import { DIFF_VIEW_URI_SCHEME } from "./integrations/editor/DiffViewProvider"
import { TerminalRegistry } from "./integrations/terminal/TerminalRegistry"
import { McpServerManager } from "./services/mcp/McpServerManager"
import { CodeIndexManager } from "./services/code-index/manager"
import { MdmService } from "./services/mdm/MdmService"
import { migrateSettings } from "./utils/migrateSettings"
import { A2AServerManager } from "./core/agent/A2AServerManager"
import { autoImportSettings } from "./utils/autoImportSettings"
import { isRemoteControlEnabled } from "./utils/remoteControl"
import { API } from "./extension/api"
import { VoidBridge } from "./api/void-bridge"
import { TaskHistoryBridge } from "./api/task-history-bridge"
import { RedisSyncService } from "./services/RedisSyncService"

import {
	handleUri,
	registerCommands,
	registerCodeActions,
	registerTerminalActions,
	CodeActionProvider,
} from "./activate"
import { initializeI18n } from "./i18n"
import { LLMStreamService } from "./services/llm-stream-service"
import { LLMStreamTargetManager } from "./commands/llm-stream-target"
import { ImPlatformTokenManager } from "./services/im-platform/ImPlatformTokenManager"

/**
 * Built using https://github.com/microsoft/vscode-webview-ui-toolkit
 *
 * Inspired by:
 *  - https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/default/weather-webview
 *  - https://github.com/microsoft/vscode-webview-ui-toolkit-samples/tree/main/frameworks/hello-world-react-cra
 */

let outputChannel: vscode.OutputChannel
let extensionContext: vscode.ExtensionContext

// This method is called when your extension is activated.
// Your extension is activated the very first time the command is executed.
export async function activate(context: vscode.ExtensionContext) {
	extensionContext = context
	outputChannel = vscode.window.createOutputChannel(Package.outputChannel)
	context.subscriptions.push(outputChannel)
	outputChannel.appendLine(`${Package.name} extension activated - ${JSON.stringify(Package)}`)

	// Migrate old settings to new
	await migrateSettings(context, outputChannel)

	// Initialize telemetry service.
	const telemetryService = TelemetryService.createInstance()

	try {
		telemetryService.register(new PostHogTelemetryClient())
	} catch (error) {
		console.warn("Failed to register PostHogTelemetryClient:", error)
	}

	// Create logger for cloud services.
	const cloudLogger = createDualLogger(createOutputChannelLogger(outputChannel))

	// Initialize MDM service
	const mdmService = await MdmService.createInstance(cloudLogger)

	// Initialize i18n for internationalization support - default to Chinese
	const storedLanguage = context.globalState.get<string>("language")
	const defaultLanguage = "zh-CN" // Default to Chinese
	const systemLanguage = formatLanguage(vscode.env.language)

	// Use stored language if exists, otherwise use Chinese as default
	// Only fall back to system language if it's also Chinese
	const languageToUse = storedLanguage ?? (systemLanguage.startsWith("zh") ? systemLanguage : defaultLanguage)
	initializeI18n(languageToUse)

	// Initialize terminal shell execution handlers.
	TerminalRegistry.initialize()

	// Initialize Redis sync service
	const redisSync = RedisSyncService.getInstance()
	redisSync.startHealthCheck()
	outputChannel.appendLine("[Redis] Sync service initialized")

	// Initialize LLM Stream Service (without connecting yet)
	const llmService = new LLMStreamService(context, outputChannel)
	;(global as any).llmStreamService = llmService

	// 🔥 智能体任务执行辅助函数
	/**
	 * 准备智能体任务参数
	 */
	async function prepareAgentTask(data: any, provider: ClineProvider) {
		outputChannel.appendLine(`[Agent] === prepareAgentTask START ===`)
		outputChannel.appendLine(`[Agent] Raw data: ${JSON.stringify(data)}`)

		const { streamId, question, sendId, recvId, senderTerminal, targetTerminal, chatType, conversationId } = data
		outputChannel.appendLine(
			`[Agent] Extracted: streamId=${streamId}, sendId=${sendId}, recvId=${recvId}, conversationId=${conversationId}`,
		)

		// 解析 question
		let questionData: any
		try {
			questionData = typeof question === "string" ? JSON.parse(question) : question
			outputChannel.appendLine(`[Agent] Parsed question: ${JSON.stringify(questionData)}`)
		} catch (e) {
			outputChannel.appendLine(`[Agent] ❌ Failed to parse question: ${e}`)
			throw new Error("Invalid question format")
		}

		// 提取智能体ID - 优先从 question 中获取，如果没有则从 taskName 中提取
		let agentId = questionData.agentId

		if (!agentId) {
			// 从 taskName 中提取 agentId (格式: agent_xxx)
			const { taskName } = data
			if (taskName && taskName.startsWith("agent_")) {
				// 移除 "agent_" 前缀
				agentId = taskName.substring(6)
				outputChannel.appendLine(`[Agent] Extracted agentId from taskName: ${agentId}`)
			}
		}

		if (!agentId) {
			outputChannel.appendLine(`[Agent] ❌ Missing agentId in both question and taskName`)
			outputChannel.appendLine(`[Agent] question: ${JSON.stringify(questionData)}`)
			outputChannel.appendLine(`[Agent] taskName: ${data.taskName}`)
			throw new Error("Missing agentId in question and taskName")
		}

		outputChannel.appendLine(`[Agent] Agent ID: ${agentId}`)

		// 保持原始消息格式传递，让A2AServer处理
		// questionData 就是完整的消息对象 {type, content, timestamp}
		const message = JSON.stringify(questionData)
		outputChannel.appendLine(`[Agent] Message object: ${message}`)

		// 获取智能体配置
		outputChannel.appendLine(`[Agent] Getting agent config for ${agentId}...`)
		const a2aManager = A2AServerManager.getInstance()
		const agentConfig = await a2aManager.getAgentConfig(agentId)
		if (!agentConfig) {
			outputChannel.appendLine(`[Agent] ❌ Agent config not found for ${agentId}`)
			throw new Error(`Agent ${agentId} not found`)
		}
		outputChannel.appendLine(`[Agent] ✅ Agent config loaded: ${JSON.stringify(agentConfig)}`)
		outputChannel.appendLine(`[Agent] 🔍 welcomeMessage in config: ${agentConfig.welcomeMessage || "NOT FOUND"}`)

		// 响应时交换发送者/接收者
		const responseSendId = recvId
		const responseRecvId = sendId
		const responseSenderTerminal = targetTerminal
		const responseTargetTerminal = senderTerminal

		const result = {
			agentId,
			agentConfig,
			message,
			streamId,
			conversationId,
			imMetadata: {
				sendId: responseSendId,
				recvId: responseRecvId,
				senderTerminal: responseSenderTerminal,
				targetTerminal: responseTargetTerminal,
				chatType,
			},
		}

		outputChannel.appendLine(`[Agent] === prepareAgentTask END ===`)
		return result
	}

	/**
	 * 创建并执行智能体任务
	 */
	async function createAndExecuteAgentTask(taskParams: any, provider: ClineProvider) {
		outputChannel.appendLine(`[Agent] === createAndExecuteAgentTask START ===`)
		const { agentId, agentConfig, message, streamId, conversationId, imMetadata } = taskParams
		outputChannel.appendLine(
			`[Agent] AgentID: ${agentId}, StreamID: ${streamId}, ConversationID: ${conversationId}`,
		)

		// 初始化或加载历史对话
		let apiHistory: any[] = []
		if (conversationId) {
			outputChannel.appendLine(`[Agent] Loading conversation history for ${conversationId}...`)
			// 从 provider 加载历史对话
			const storedHistory = await provider.getAgentConversationHistory(conversationId)
			if (storedHistory) {
				apiHistory = storedHistory
				outputChannel.appendLine(
					`[Agent] ✅ Loaded ${apiHistory.length} messages for conversation ${conversationId}`,
				)
			} else {
				outputChannel.appendLine(`[Agent] No existing conversation history found`)
			}
		}

		// 创建任务（使用正确的 API）
		outputChannel.appendLine(`[Agent] Creating task with initClineWithTask...`)
		outputChannel.appendLine(`[Agent] Task message: ${message.substring(0, 100)}...`)
		outputChannel.appendLine(
			`[Agent] AgentTaskContext: ${JSON.stringify({
				agentId,
				streamId,
				mode: agentConfig.mode || "code",
				roleDescription: agentConfig.roleDescription ? "exists" : "none",
				imMetadata,
			})}`,
		)

		// 🔥 显式设置 startTask: true 确保任务自动启动
		const taskOptions: any = {
			agentTaskContext: {
				agentId,
				streamId,
				mode: agentConfig.mode || "code",
				roleDescription: agentConfig.roleDescription,
				imMetadata,
			},
			startTask: true, // 🔥 明确设置为 true
		}

		outputChannel.appendLine(`[Agent] Task options: ${JSON.stringify({ ...taskOptions, agentTaskContext: "..." })}`)

		const task = await provider.initClineWithTask(message, [], undefined, taskOptions)

		outputChannel.appendLine(`[Agent] ✅ Task created: taskId=${task.taskId}, instanceId=${task.instanceId}`)

		// 配置智能体参数
		outputChannel.appendLine(`[Agent] Configuring agent parameters...`)
		if (agentConfig.allowedTools) {
			outputChannel.appendLine(`[Agent] Setting allowed tools: ${agentConfig.allowedTools.join(", ")}`)
			task.setAllowedTools(agentConfig.allowedTools)
		}

		if (agentConfig.mode) {
			try {
				const modeConfig = await provider.getModeConfig(agentConfig.mode)
				if (modeConfig) {
					outputChannel.appendLine(`[Agent] ✅ Mode config loaded: ${modeConfig.slug}`)
					task.setModeConfig(modeConfig)
				}
				// 找不到就跳过，使用默认配置
			} catch (error) {
				outputChannel.appendLine(`[Agent] Mode config lookup failed (using defaults): ${error}`)
			}
		}

		if (agentConfig.roleDescription) {
			outputChannel.appendLine(
				`[Agent] Setting custom instructions: ${agentConfig.roleDescription.substring(0, 50)}...`,
			)
			task.setCustomInstructions(agentConfig.roleDescription)
		}

		// 恢复历史对话
		if (apiHistory.length > 0) {
			outputChannel.appendLine(`[Agent] Restoring ${apiHistory.length} conversation history messages...`)
			for (const msg of apiHistory) {
				await task.addToApiConversationHistory(msg)
			}
			outputChannel.appendLine(`[Agent] ✅ Conversation history restored`)
		}

		// 执行任务 - Task 创建后会自动启动
		// 等待任务完成（监听任务事件）
		outputChannel.appendLine(`[Agent] Waiting for task to complete...`)
		outputChannel.appendLine(`[Agent] Task should be auto-started by constructor (startTask=true)`)

		await new Promise<void>((resolve, reject) => {
			// 导入 RooCodeEventName
			const { RooCodeEventName } = require("@roo-code/types")

			// 监听任务完成事件
			const onCompleted = (...args: any[]) => {
				outputChannel.appendLine(
					`[Agent] 🎉 TaskCompleted event received for conversation ${conversationId || streamId}`,
				)
				outputChannel.appendLine(`[Agent] Event args: ${JSON.stringify(args)}`)
				cleanup()
				resolve()
			}

			// 监听任务中止事件
			const onAborted = (...args: any[]) => {
				outputChannel.appendLine(
					`[Agent] ⚠️ TaskAborted event received for conversation ${conversationId || streamId}`,
				)
				outputChannel.appendLine(`[Agent] Event args: ${JSON.stringify(args)}`)
				cleanup()
				resolve()
			}

			// 监听任务启动事件（用于调试）
			const onStarted = () => {
				outputChannel.appendLine(`[Agent] ✅ TaskStarted event received`)
			}

			// 清理监听器
			const cleanup = () => {
				task.off(RooCodeEventName.TaskStarted, onStarted)
				task.off(RooCodeEventName.TaskCompleted, onCompleted)
				task.off(RooCodeEventName.TaskAborted, onAborted)
				if (timeoutId) {
					clearTimeout(timeoutId)
				}
			}

			// 注册事件监听器
			outputChannel.appendLine(`[Agent] Registering event listeners...`)
			task.on(RooCodeEventName.TaskStarted, onStarted)
			task.on(RooCodeEventName.TaskCompleted, onCompleted)
			task.on(RooCodeEventName.TaskAborted, onAborted)

			// 超时保护 (10分钟)
			const timeoutId = setTimeout(
				() => {
					outputChannel.appendLine(
						`[Agent] ⏰ Task timeout (10 minutes) for conversation ${conversationId || streamId}`,
					)
					cleanup()
					resolve()
				},
				10 * 60 * 1000,
			)

			outputChannel.appendLine(`[Agent] Event listeners registered, waiting for task events...`)
		})

		// 保存对话历史
		outputChannel.appendLine(`[Agent] Saving conversation history...`)
		const finalHistory = task.apiConversationHistory
		await provider.saveAgentConversationHistory(conversationId || streamId, finalHistory)
		outputChannel.appendLine(`[Agent] ✅ Conversation history saved: ${finalHistory.length} messages`)

		// 🔥 发送 LLM_END 事件到 IM WebSocket
		outputChannel.appendLine(`[Agent] Sending LLM_END event...`)
		const finalConversationId = conversationId || streamId
		llmService.imConnection.sendLLMEnd(
			streamId,
			finalConversationId,
			imMetadata.recvId,
			imMetadata.targetTerminal,
			imMetadata.chatType,
			imMetadata.sendId,
			imMetadata.senderTerminal,
		)
		outputChannel.appendLine(`[Agent] ✅ LLM_END event sent with conversationId: ${finalConversationId}`)

		outputChannel.appendLine(`[Agent] === createAndExecuteAgentTask END ===`)

		return finalConversationId
	}

	// 🔥 注册LLM流式请求处理器 (必须在任何连接之前!)
	llmService.imConnection.onLLMStreamRequest(async (data: any) => {
		outputChannel.appendLine(`[LLM] ========== NEW REQUEST ==========`)
		outputChannel.appendLine(`[LLM] Received LLM_STREAM_REQUEST`)
		outputChannel.appendLine(`[LLM] Request data keys: ${Object.keys(data).join(", ")}`)

		try {
			// 延迟获取 provider（必须等待初始化完成）
			outputChannel.appendLine(`[LLM] Waiting for provider initialization...`)
			let provider: ClineProvider | undefined
			let attempts = 0
			const maxAttempts = 50 // 5 seconds max

			while (!provider && attempts < maxAttempts) {
				provider = (global as any).clineProvider
				if (!provider) {
					attempts++
					outputChannel.appendLine(`[LLM] Provider not ready, attempt ${attempts}/${maxAttempts}`)
					await new Promise((resolve) => setTimeout(resolve, 100))
				}
			}

			if (!provider) {
				throw new Error("Provider not initialized after 5 seconds")
			}

			outputChannel.appendLine(`[LLM] ✅ Provider found after ${attempts} attempts`)

			// 准备任务参数
			outputChannel.appendLine(`[LLM] Calling prepareAgentTask...`)
			const taskParams = await prepareAgentTask(data, provider)
			outputChannel.appendLine(`[LLM] ✅ prepareAgentTask completed`)

			// 检查是否是 say_hi 消息
			let messageObj: any
			try {
				messageObj = JSON.parse(taskParams.message)
			} catch (e) {
				messageObj = null
			}

			if (messageObj?.type === "say_hi") {
				// 直接返回欢迎语，不创建Task
				outputChannel.appendLine(`[LLM] Detected say_hi message, returning welcome message`)
				const welcomeMessage =
					taskParams.agentConfig.welcomeMessage ||
					`你好！我是 ${taskParams.agentConfig.name}，很高兴为你服务！`
				outputChannel.appendLine(`[LLM] 🔍 Sending welcomeMessage: "${welcomeMessage}"`)
				outputChannel.appendLine(
					`[LLM] 🔍 taskParams.agentConfig.welcomeMessage: "${taskParams.agentConfig.welcomeMessage}"`,
				)

				// 发送欢迎语消息
				llmService.imConnection.sendLLMChunk(
					taskParams.streamId,
					welcomeMessage,
					taskParams.imMetadata.recvId,
					taskParams.imMetadata.targetTerminal,
					taskParams.imMetadata.chatType,
					taskParams.imMetadata.sendId,
					taskParams.imMetadata.senderTerminal,
				)

				// 发送结束事件
				llmService.imConnection.sendLLMEnd(
					taskParams.streamId,
					taskParams.imMetadata.recvId,
					taskParams.imMetadata.targetTerminal,
					taskParams.imMetadata.chatType,
					{
						name: `agent_${taskParams.agentId}`,
						id: taskParams.agentId,
					},
					taskParams.imMetadata.sendId,
					taskParams.imMetadata.senderTerminal,
					null, // say_hi 不需要 conversationId
				)
				outputChannel.appendLine(`[LLM] ✅ Welcome message sent successfully`)
				return
			}

			// 创建并执行任务
			outputChannel.appendLine(`[LLM] Calling createAndExecuteAgentTask...`)
			const conversationId = await createAndExecuteAgentTask(taskParams, provider)
			outputChannel.appendLine(`[LLM] ✅ createAndExecuteAgentTask completed`)

			// 发送结束事件（带conversationId）
			outputChannel.appendLine(`[LLM] Sending LLM_END event...`)
			llmService.imConnection.sendLLMEnd(
				taskParams.streamId,
				taskParams.imMetadata.recvId,
				taskParams.imMetadata.targetTerminal,
				taskParams.imMetadata.chatType,
				{
					name: `agent_${taskParams.agentId}`,
					id: taskParams.agentId,
				},
				taskParams.imMetadata.sendId,
				taskParams.imMetadata.senderTerminal,
				conversationId,
			)
			outputChannel.appendLine(`[LLM] ✅ Request processing completed successfully`)
		} catch (error: any) {
			outputChannel.appendLine(`[LLM] ❌❌❌ Error processing LLM request ❌❌❌`)
			outputChannel.appendLine(`[LLM] Error message: ${error.message}`)
			outputChannel.appendLine(`[LLM] Error stack: ${error.stack}`)

			// 发送错误响应
			try {
				const { streamId, sendId, recvId, senderTerminal, targetTerminal, chatType } = data
				llmService.imConnection.sendLLMError(
					streamId,
					error.message || "Task execution failed",
					recvId,
					targetTerminal,
					chatType,
					sendId,
					senderTerminal,
				)
				outputChannel.appendLine(`[LLM] ✅ Error response sent to client`)
			} catch (sendError: any) {
				outputChannel.appendLine(`[LLM] ❌ Failed to send error response: ${sendError.message}`)
			}
		}

		outputChannel.appendLine(`[LLM] ========== REQUEST END ==========`)
	})

	// 🔥 标记处理器已注册完成 - 防止竞态条件
	llmService.markHandlersRegistered()

	// 延迟初始化：检查tokenKey是否已设置
	setTimeout(async () => {
		const tokenManager = ImPlatformTokenManager.getInstance()
		if (tokenManager.hasTokenKey()) {
			try {
				await llmService.initialize()
			} catch (error) {
				outputChannel.appendLine(`[LLM] ❌ Init failed: ${error}`)
			}
		}
	}, 2000)

	// Initialize LLM Stream Target Manager
	const llmTargetManager = LLMStreamTargetManager.getInstance()
	await llmTargetManager.loadFromState(context)
	;(global as any).llmStreamTargetManager = llmTargetManager

	// 🔥 添加诊断命令
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.diagnosticIMConnection", async () => {
			outputChannel.appendLine("========== IM CONNECTION DIAGNOSTIC ==========")
			outputChannel.appendLine(`[Diagnostic] Current time: ${new Date().toISOString()}`)

			// 检查 LLM 服务
			const llmService = (global as any).llmStreamService
			if (!llmService) {
				outputChannel.appendLine(`[Diagnostic] ❌ llmStreamService not found in global`)
			} else {
				outputChannel.appendLine(`[Diagnostic] ✅ llmStreamService found`)
				outputChannel.appendLine(`[Diagnostic] IM connection: ${llmService.imConnection ? "exists" : "null"}`)

				if (llmService.imConnection) {
					const ws = llmService.imConnection.ws
					outputChannel.appendLine(`[Diagnostic] WebSocket state: ${ws ? ws.readyState : "null"}`)
					outputChannel.appendLine(`[Diagnostic] Is connected: ${llmService.imConnection.isConnected}`)

					// WebSocket states: 0=CONNECTING, 1=OPEN, 2=CLOSING, 3=CLOSED
					if (ws) {
						const states = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"]
						outputChannel.appendLine(`[Diagnostic] WebSocket state name: ${states[ws.readyState]}`)
					}
				}
			}

			// 检查 Provider
			const provider = (global as any).clineProvider
			if (!provider) {
				outputChannel.appendLine(`[Diagnostic] ❌ clineProvider not found in global`)
			} else {
				outputChannel.appendLine(`[Diagnostic] ✅ clineProvider found`)
			}

			// 检查消息处理器
			if (llmService?.imConnection) {
				const handlers = llmService.imConnection.messageHandlers
				outputChannel.appendLine(`[Diagnostic] Message handlers registered: ${handlers ? handlers.size : 0}`)
				if (handlers) {
					outputChannel.appendLine(
						`[Diagnostic] Handler for cmd=10 (LLM_STREAM_REQUEST): ${handlers.has(10)}`,
					)
				}
			}

			outputChannel.appendLine("========== DIAGNOSTIC END ==========")
			vscode.window.showInformationMessage("IM Connection diagnostic complete. Check output panel.")
		}),
	)

	// Register test command for LLM streaming
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.testLLMStream", async () => {
			outputChannel.appendLine("[LLM] Test command triggered")

			// Get target user ID
			const targetUserId = await vscode.window.showInputBox({
				prompt: "Enter target user ID (leave empty for broadcast)",
				placeHolder: "e.g., 1",
			})

			// Get target terminal
			const targetTerminal = await vscode.window.showQuickPick(
				[
					{ label: "All Terminals", value: undefined },
					{ label: "0 - Web", value: "0" },
					{ label: "1 - App", value: "1" },
					{ label: "2 - PC", value: "2" },
					{ label: "3 - Cloud PC", value: "3" },
					{ label: "4 - Plugin", value: "4" },
					{ label: "5 - MCP", value: "5" },
					{ label: "6 - Roo-Code", value: "6" },
				],
				{ placeHolder: "Select target terminal" },
			)

			const question = await vscode.window.showInputBox({
				prompt: "Enter a test question for LLM",
				value: "Hello, this is a test message",
			})

			if (question) {
				const recvId = targetUserId ? parseInt(targetUserId) : undefined
				const terminal = targetTerminal?.value ? parseInt(targetTerminal.value) : undefined

				outputChannel.appendLine(`[LLM] Sending test question: ${question}`)
				outputChannel.appendLine(`[LLM] Target: recvId=${recvId}, terminal=${terminal}`)

				try {
					await llmService.streamLLMResponse(question, recvId, terminal)
					outputChannel.appendLine("[LLM] Test stream completed")
					vscode.window.showInformationMessage("LLM stream test completed")
				} catch (error) {
					outputChannel.appendLine(`[LLM] Test stream error: ${error}`)
					vscode.window.showErrorMessage(`LLM stream test failed: ${error}`)
				}
			}
		}),
	)

	// Register LLM stream target commands
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.setLLMStreamTarget", async () => {
			await llmTargetManager.setTarget(context)
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.showLLMStreamTarget", async () => {
			await llmTargetManager.showStatus()
		}),
	)

	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.clearLLMStreamTarget", async () => {
			await context.globalState.update("llmStreamTargetUserId", undefined)
			await context.globalState.update("llmStreamTargetTerminal", undefined)
			await llmTargetManager.loadFromState(context)
			vscode.window.showInformationMessage("LLM stream target cleared")
		}),
	)

	// Register command to manually initialize IM connection
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.initializeIMConnection", async () => {
			outputChannel.appendLine("[LLM] Manual IM connection initialization requested")

			const tokenManager = ImPlatformTokenManager.getInstance()
			if (!tokenManager.hasTokenKey()) {
				vscode.window.showErrorMessage("TokenKey not configured. Please set it in settings first.")
				await vscode.commands.executeCommand("workbench.action.openSettings", "roo-cline.imPlatformTokenKey")
				return
			}

			try {
				outputChannel.appendLine("[LLM] Initializing IM connection...")
				await llmService.initialize()
				outputChannel.appendLine("[LLM] IM connection established successfully")
				vscode.window.showInformationMessage("IM WebSocket connection established successfully")
			} catch (error) {
				outputChannel.appendLine(`[LLM] Failed to initialize IM connection: ${error}`)
				vscode.window.showErrorMessage(`Failed to connect to IM server: ${error}`)
			}
		}),
	)

	// Register void bridge for IM integration
	VoidBridge.register(context)

	// Get default commands from configuration.
	const defaultCommands = vscode.workspace.getConfiguration(Package.name).get<string[]>("allowedCommands") || []

	// Initialize global state if not already set.
	if (!context.globalState.get("allowedCommands")) {
		context.globalState.update("allowedCommands", defaultCommands)
	}

	const contextProxy = await ContextProxy.getInstance(context)

	// Initialize code index managers for all workspace folders
	const codeIndexManagers: CodeIndexManager[] = []
	if (vscode.workspace.workspaceFolders) {
		for (const folder of vscode.workspace.workspaceFolders) {
			const manager = CodeIndexManager.getInstance(context, folder.uri.fsPath)
			if (manager) {
				codeIndexManagers.push(manager)
				try {
					await manager.initialize(contextProxy)
				} catch (error) {
					outputChannel.appendLine(
						`[CodeIndexManager] Error during background CodeIndexManager configuration/indexing for ${folder.uri.fsPath}: ${error.message || error}`,
					)
				}
				context.subscriptions.push(manager)
			}
		}
	}

	// Initialize Roo Code Cloud service.
	const cloudService = await CloudService.createInstance(context, cloudLogger)

	try {
		if (cloudService.telemetryClient) {
			TelemetryService.instance.register(cloudService.telemetryClient)
		}
	} catch (error) {
		outputChannel.appendLine(
			`[CloudService] Failed to register TelemetryClient: ${error instanceof Error ? error.message : String(error)}`,
		)
	}

	const postStateListener = () => ClineProvider.getVisibleInstance()?.postStateToWebview()

	cloudService.on("auth-state-changed", postStateListener)
	cloudService.on("settings-updated", postStateListener)

	cloudService.on("user-info", async ({ userInfo }) => {
		postStateListener()

		const bridgeConfig = await cloudService.cloudAPI?.bridgeConfig().catch(() => undefined)

		if (!bridgeConfig) {
			outputChannel.appendLine("[CloudService] Failed to get bridge config")
			return
		}

		UnifiedBridgeService.handleRemoteControlState(
			userInfo,
			contextProxy.getValue("remoteControlEnabled"),
			{ ...bridgeConfig, provider },
			(message: string) => outputChannel.appendLine(message),
		)
	})

	// Add to subscriptions for proper cleanup on deactivate.
	context.subscriptions.push(cloudService)

	const provider = new ClineProvider(context, outputChannel, "sidebar", contextProxy, mdmService)
	TelemetryService.instance.setProvider(provider)

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(ClineProvider.sideBarId, provider, {
			webviewOptions: { retainContextWhenHidden: true },
		}),
	)

	// Auto-import configuration if specified in settings.
	try {
		await autoImportSettings(outputChannel, {
			providerSettingsManager: provider.providerSettingsManager,
			contextProxy: provider.contextProxy,
			customModesManager: provider.customModesManager,
		})
	} catch (error) {
		outputChannel.appendLine(
			`[AutoImport] Error during auto-import: ${error instanceof Error ? error.message : String(error)}`,
		)
	}

	registerCommands({ context, outputChannel, provider })

	// Set provider for VoidBridge
	VoidBridge.setProvider(provider)

	// Register task history bridge for void integration
	TaskHistoryBridge.register(context, provider)

	// 🔥 全局注册 provider 供智能体任务使用
	;(global as any).clineProvider = provider

	// SAFE INITIALIZATION: Initialize agent services safely
	outputChannel.appendLine("[SafeInit] Starting safe initialization of agent services...")

	// Set current user ID from VoidBridge for the existing AgentManager (safe initialization)
	try {
		const currentUserId = VoidBridge.getCurrentUserId() || "default"
		if (provider.agentManager) {
			provider.agentManager.setCurrentUserId(currentUserId)
			outputChannel.appendLine(`[AgentManager] Set current user ID: ${currentUserId}`)
		}
	} catch (error) {
		outputChannel.appendLine(
			`[AgentManager] Failed to set user ID: ${error instanceof Error ? error.message : "Unknown error"}`,
		)
	}

	// TEMPORARILY DISABLE AUTO-START to prevent crashes
	outputChannel.appendLine("[AgentAutoStart] Auto-start temporarily disabled for stability")

	// DISABLED - Add cleanup for auto-start service
	context.subscriptions.push({
		dispose: () => {
			outputChannel.appendLine("[AgentAutoStart] Cleanup disabled for safety")
		},
	})

	// DISABLED - Register agent auto-start management commands
	outputChannel.appendLine("[AgentAutoStart] Management commands disabled for safety")

	/* DISABLED FOR SAFETY - Register commands
	setTimeout(() => {
		// Command registration code disabled
	}, 5000)
	*/

	// Add keyboard shortcut support for adding files to context
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.addSelectedFilesToChat", async () => {
			// Get currently selected files in the explorer
			const selectedUris = await vscode.commands.executeCommand<vscode.Uri[]>(
				"resourceExplorer.selectedResources",
			)
			if (selectedUris && selectedUris.length > 0 && provider) {
				const filePaths = selectedUris.map((uri) => uri.fsPath)
				await provider.handleFilesDropped(filePaths)
			}
		}),
	)

	// Add a command to handle file drops (can be triggered from explorer context menu)
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.dropFiles", async (uri: vscode.Uri, uris: vscode.Uri[]) => {
			const files = uris ? uris.map((u) => u.fsPath) : uri ? [uri.fsPath] : []
			if (files.length > 0 && provider) {
				await provider.handleFilesDropped(files)
			}
		}),
	)

	/**
	 * We use the text document content provider API to show the left side for diff
	 * view by creating a virtual document for the original content. This makes it
	 * readonly so users know to edit the right side if they want to keep their changes.
	 *
	 * This API allows you to create readonly documents in VSCode from arbitrary
	 * sources, and works by claiming an uri-scheme for which your provider then
	 * returns text contents. The scheme must be provided when registering a
	 * provider and cannot change afterwards.
	 *
	 * Note how the provider doesn't create uris for virtual documents - its role
	 * is to provide contents given such an uri. In return, content providers are
	 * wired into the open document logic so that providers are always considered.
	 *
	 * https://code.visualstudio.com/api/extension-guides/virtual-documents
	 */
	const diffContentProvider = new (class implements vscode.TextDocumentContentProvider {
		provideTextDocumentContent(uri: vscode.Uri): string {
			return Buffer.from(uri.query, "base64").toString("utf-8")
		}
	})()

	context.subscriptions.push(
		vscode.workspace.registerTextDocumentContentProvider(DIFF_VIEW_URI_SCHEME, diffContentProvider),
	)

	context.subscriptions.push(vscode.window.registerUriHandler({ handleUri }))

	// Register code actions provider.
	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider({ pattern: "**/*" }, new CodeActionProvider(), {
			providedCodeActionKinds: CodeActionProvider.providedCodeActionKinds,
		}),
	)

	registerCodeActions(context)
	registerTerminalActions(context)

	// Allows other extensions to activate once Roo is ready.
	vscode.commands.executeCommand(`${Package.name}.activationCompleted`)

	// 🤖 Initialize A2A Server Manager and auto-start published agents
	try {
		outputChannel.appendLine("[A2AServerManager] Initializing A2A Server Manager...")

		// 初始化A2A服务器管理器（不传存储服务，让它自己创建）
		const a2aServerManager = A2AServerManager.getInstance()
		await a2aServerManager.initialize(undefined, provider)

		// 确保provider正确设置，以便startAgentWithFullFlow方法能够访问API配置
		a2aServerManager.setProvider(provider)

		// 自动启动所有已发布的智能体（异步执行，不阻塞插件启动）
		a2aServerManager
			.startAllPublishedAgents()
			.then((result: any) => {
				outputChannel.appendLine(
					`[A2AServerManager] ✅ Auto-startup completed: ${result.started}/${result.total} agents started`,
				)

				if (result.started > 0) {
					vscode.window.showInformationMessage(`🤖 Started ${result.started} published agents automatically`)
				}

				if (result.errors.length > 0) {
					outputChannel.appendLine(`[A2AServerManager] ❌ ${result.errors.length} agents failed to start:`)
					result.errors.forEach((item: { agentId: string; error: any }) => {
						outputChannel.appendLine(`  - ${item.agentId}: ${item.error}`)
					})
				}
			})
			.catch((error: any) => {
				outputChannel.appendLine(`[A2AServerManager] ❌ Auto-startup failed: ${error}`)
				console.error("A2A Server auto-startup failed:", error)
			})

		// 添加到订阅中以便正确清理
		context.subscriptions.push({
			dispose: async () => {
				await a2aServerManager.destroy()
			},
		})

		outputChannel.appendLine("[A2AServerManager] ✅ A2A Server Manager initialized successfully")
	} catch (error) {
		outputChannel.appendLine(`[A2AServerManager] ❌ Failed to initialize A2A Server Manager: ${error}`)
		console.error("A2A Server Manager initialization failed:", error)
	}

	// Implements the `RooCodeAPI` interface.
	const socketPath = process.env.ROO_CODE_IPC_SOCKET_PATH
	const enableLogging = typeof socketPath === "string"

	// Watch the core files and automatically reload the extension host.
	if (process.env.NODE_ENV === "development") {
		const watchPaths = [
			{ path: context.extensionPath, pattern: "**/*.ts" },
			{ path: path.join(context.extensionPath, "../packages/types"), pattern: "**/*.ts" },
			{ path: path.join(context.extensionPath, "../packages/telemetry"), pattern: "**/*.ts" },
			{ path: path.join(context.extensionPath, "node_modules/@roo-code/cloud"), pattern: "**/*" },
		]

		console.log(
			`♻️♻️♻️ Core auto-reloading: Watching for changes in ${watchPaths.map(({ path }) => path).join(", ")}`,
		)

		// Create a debounced reload function to prevent excessive reloads
		let reloadTimeout: NodeJS.Timeout | undefined
		const DEBOUNCE_DELAY = 1_000

		const debouncedReload = (uri: vscode.Uri) => {
			if (reloadTimeout) {
				clearTimeout(reloadTimeout)
			}

			console.log(`♻️ ${uri.fsPath} changed; scheduling reload...`)

			reloadTimeout = setTimeout(() => {
				console.log(`♻️ Reloading host after debounce delay...`)
				vscode.commands.executeCommand("workbench.action.reloadWindow")
			}, DEBOUNCE_DELAY)
		}

		watchPaths.forEach(({ path: watchPath, pattern }) => {
			const relPattern = new vscode.RelativePattern(vscode.Uri.file(watchPath), pattern)
			const watcher = vscode.workspace.createFileSystemWatcher(relPattern, false, false, false)

			// Listen to all change types to ensure symlinked file updates trigger reloads.
			watcher.onDidChange(debouncedReload)
			watcher.onDidCreate(debouncedReload)
			watcher.onDidDelete(debouncedReload)

			context.subscriptions.push(watcher)
		})

		// Clean up the timeout on deactivation
		context.subscriptions.push({
			dispose: () => {
				if (reloadTimeout) {
					clearTimeout(reloadTimeout)
				}
			},
		})
	}

	return new API(outputChannel, provider, socketPath, enableLogging)
}

// This method is called when your extension is deactivated.
export async function deactivate() {
	outputChannel.appendLine(`${Package.name} extension deactivated`)

	// Cleanup Redis connection
	const redisSync = RedisSyncService.getInstance()
	await redisSync.disconnect()
	outputChannel.appendLine("[Redis] Sync service disconnected")

	const bridgeService = UnifiedBridgeService.getInstance()

	if (bridgeService) {
		await bridgeService.disconnect()
	}

	await McpServerManager.cleanup(extensionContext)
	TelemetryService.instance.shutdown()
	TerminalRegistry.cleanup()
}
