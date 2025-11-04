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
	registerVoiceCommands,
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
		// Failed to register PostHogTelemetryClient
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
		const { streamId, question, sendId, recvId, senderTerminal, targetTerminal, chatType, conversationId } = data

		// 解析 question
		let questionData: any
		try {
			questionData = typeof question === "string" ? JSON.parse(question) : question
		} catch (e) {
			throw new Error("Invalid question format")
		}

		// 提取智能体ID - 优先从 question 中获取，如果没有则从 taskName 中提取
		let agentId = questionData.agentId

		if (!agentId) {
			const { taskName } = data
			if (taskName && taskName.startsWith("agent_")) {
				agentId = taskName.substring(6)
			}
		}

		if (!agentId) {
			throw new Error("Missing agentId in question and taskName")
		}

		// 提取消息内容 - IM桥接不经过A2AServer，直接使用content字段
		// questionData格式: { type: 'say_hi' | 'text', content: string, timestamp: number, agentId?: string }
		const message = questionData.content || JSON.stringify(questionData)

		// 获取智能体配置
		const a2aManager = A2AServerManager.getInstance()
		const agentConfig = await a2aManager.getAgentConfig(agentId)
		if (!agentConfig) {
			throw new Error(`Agent ${agentId} not found`)
		}

		// 响应时交换发送者/接收者
		const responseSendId = recvId
		const responseRecvId = sendId
		const responseSenderTerminal = targetTerminal
		const responseTargetTerminal = senderTerminal

		return {
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
	}

	/**
	 * 创建并执行智能体任务
	 */
	async function createAndExecuteAgentTask(taskParams: any, provider: ClineProvider) {
		const { agentId, agentConfig, message, streamId, conversationId, imMetadata } = taskParams

		// 🔥 关键修复：准备智能体专属的API配置，不修改全局provider配置
		// ✅ 每个智能体使用独立的API配置，互不干扰，也不影响用户本地配置
		outputChannel.appendLine(`[createAndExecuteAgentTask] 🎯 Preparing isolated API config for agent: ${agentId}`)

		let agentApiConfiguration: any

		if (agentConfig.apiConfig) {
			outputChannel.appendLine(
				`[createAndExecuteAgentTask] ✅ Using embedded API config: ${agentConfig.apiConfig.apiProvider} / ${agentConfig.apiConfig.apiModelId || agentConfig.apiConfig.openAiModelId || "N/A"}`,
			)
			// 直接使用智能体的嵌入式API配置（不修改全局provider配置）
			agentApiConfiguration = { ...agentConfig.apiConfig }
			outputChannel.appendLine(`[createAndExecuteAgentTask] ✅ Isolated API config prepared`)
		} else if (agentConfig.apiConfigId) {
			// 🔥 使用apiConfigId查找配置
			outputChannel.appendLine(`[createAndExecuteAgentTask] 🔍 Looking for API config ID: ${agentConfig.apiConfigId}`)
			const apiConfigs = provider.contextProxy.getValues().listApiConfigMeta || []
			const targetConfig = apiConfigs.find((config: any) => config.id === agentConfig.apiConfigId)
			if (!targetConfig) {
				// ❌ 找不到配置，抛出异常
				const errorMsg = `智能体配置错误：找不到API配置 (ID: ${agentConfig.apiConfigId})。请检查智能体配置或重新创建智能体。`
				outputChannel.appendLine(`[createAndExecuteAgentTask] ❌ ${errorMsg}`)
				throw new Error(errorMsg)
			}
			// 通过名称获取完整配置（不激活，不修改全局状态）
			const profileWithName = await provider.providerSettingsManager.getProfile({ name: targetConfig.name })
			if (!profileWithName) {
				const errorMsg = `智能体配置错误：无法读取API配置 "${targetConfig.name}"。请检查配置文件是否完整。`
				outputChannel.appendLine(`[createAndExecuteAgentTask] ❌ ${errorMsg}`)
				throw new Error(errorMsg)
			}
			// 移除name字段，只保留ProviderSettings
			const { name: _, ...fullConfig } = profileWithName
			agentApiConfiguration = { ...fullConfig }
			outputChannel.appendLine(`[createAndExecuteAgentTask] ✅ Isolated API config loaded: ${targetConfig.name}`)
		} else {
			// ❌ 智能体必须有API配置
			const errorMsg = `智能体配置错误：智能体 "${agentConfig.name}" 没有配置API。请编辑智能体并添加API配置。`
			outputChannel.appendLine(`[createAndExecuteAgentTask] ❌ ${errorMsg}`)
			throw new Error(errorMsg)
		}

		// 初始化或加载历史对话
		let apiHistory: any[] = []
		if (conversationId) {
			const storedHistory = await provider.getAgentConversationHistory(conversationId)
			if (storedHistory) {
				apiHistory = storedHistory
			}
		}

		// 🔥 关键修复：使用智能体专属的API配置创建Task
		// 不再通过initClineWithTask（它会使用provider的全局配置）
		// 而是直接创建Task实例，传入智能体的独立配置
		outputChannel.appendLine(`[createAndExecuteAgentTask] 📦 Creating isolated task with agent API config`)

		const state = await provider.getState()
		const { Task } = await import("./core/task/Task")

		// 配置智能体参数（在创建Task之前设置，因为某些配置需要在构造时使用）
		let modeConfig: any = undefined
		if (agentConfig.mode) {
			try {
				modeConfig = await provider.getModeConfig(agentConfig.mode)
			} catch (error) {
				outputChannel.appendLine(`[createAndExecuteAgentTask] ⚠️ Failed to get mode config: ${error}`)
			}
		}

		// 恢复历史对话（在创建Task之前准备好）
		// 注意：历史对话需要在Task启动后添加，所以这里先保存

		const task = new Task({
			provider,
			apiConfiguration: agentApiConfiguration,  // 🔥 使用智能体专属的API配置
			enableDiff: state.diffEnabled,
			enableCheckpoints: state.enableCheckpoints,
			fuzzyMatchThreshold: state.fuzzyMatchThreshold,
			consecutiveMistakeLimit: agentApiConfiguration.consecutiveMistakeLimit,
			task: message,
			images: [],
			experiments: state.experiments,
			rootTask: undefined,  // 根任务，addClineToStack会自动设置为自己
			parentTask: undefined,
			taskNumber: 1,
			enableTaskBridge: false,
			agentTaskContext: {
				agentId,
				streamId,
				mode: agentConfig.mode || "code",
				roleDescription: agentConfig.roleDescription,
				imMetadata,
			},
			startTask: false,  // 🔥 关键：延迟启动，先添加到池并设置配置
		})

		outputChannel.appendLine(`[createAndExecuteAgentTask] ✅ Task created with isolated config`)

		// 🔥 关键：添加到agentTaskPool（智能体任务池）
		// addClineToStack会：
		// 1. 检测agentTaskContext，添加到agentTaskPool而非clineStack
		// 2. 设置task.rootTask = task（因为是根任务）
		// 3. 创建新栈: agentTaskPool.set(taskId, [task])
		// 4. 异步执行performPreparationTasks
		outputChannel.appendLine(`[createAndExecuteAgentTask] 📦 Adding task to agentTaskPool`)
		await provider.addClineToStack(task)
		outputChannel.appendLine(`[createAndExecuteAgentTask] ✅ Task added to agentTaskPool`)

		// 设置额外的配置参数（在启动任务之前）
		if (agentConfig.allowedTools) {
			task.setAllowedTools(agentConfig.allowedTools)
		}

		if (modeConfig) {
			task.setModeConfig(modeConfig)
		}

		if (agentConfig.roleDescription) {
			task.setCustomInstructions(agentConfig.roleDescription)
		}

		// 恢复历史对话（在启动任务之前）
		if (apiHistory.length > 0) {
			for (const msg of apiHistory) {
				await task.addToApiConversationHistory(msg)
			}
		}

		// 🔥 手动启动任务（所有配置都设置完成后）
		// Task.startTask是private方法，需要通过Task.create或构造时startTask: true
		// 但我们需要在设置完配置后才启动，所以这里需要特殊处理
		outputChannel.appendLine(`[createAndExecuteAgentTask] 🚀 Starting task execution`)
		// 通过调用私有方法启动（使用类型断言）
		await (task as any).startTask(message, [])

		// 等待任务完成
		await new Promise<void>((resolve) => {
			const { RooCodeEventName } = require("@roo-code/types")

			const cleanup = () => {
				task.off(RooCodeEventName.TaskCompleted, onCompleted)
				task.off(RooCodeEventName.TaskAborted, onAborted)
				if (timeoutId) clearTimeout(timeoutId)
			}

			const onCompleted = () => {
				cleanup()
				resolve()
			}

			const onAborted = () => {
				cleanup()
				resolve()
			}

			task.on(RooCodeEventName.TaskCompleted, onCompleted)
			task.on(RooCodeEventName.TaskAborted, onAborted)

			const timeoutId = setTimeout(
				() => {
					cleanup()
					resolve()
				},
				10 * 60 * 1000,
			)
		})

		// 保存对话历史并发送结束事件
		const finalConversationId = conversationId || streamId
		await provider.saveAgentConversationHistory(finalConversationId, task.apiConversationHistory)

		llmService.imConnection.sendLLMEnd(
			streamId,
			finalConversationId,
			imMetadata.recvId,
			imMetadata.targetTerminal,
			imMetadata.chatType,
			imMetadata.sendId,
			imMetadata.senderTerminal,
		)

		return finalConversationId
	}

	// 🔥 注册LLM流式请求处理器 (必须在任何连接之前!)
	llmService.imConnection.onLLMStreamRequest(async (data: any) => {
		try {
			// 等待 provider 初始化
			let provider: ClineProvider | undefined
			let attempts = 0
			while (!provider && attempts < 50) {
				provider = (global as any).clineProvider
				if (!provider) {
					attempts++
					await new Promise((resolve) => setTimeout(resolve, 100))
				}
			}

			if (!provider) {
				throw new Error("Provider not initialized after 5 seconds")
			}

			// 准备任务参数
			const taskParams = await prepareAgentTask(data, provider)

			// 检查是否是 say_hi 消息
			outputChannel.appendLine(`[LLM] 🔍 Checking say_hi - taskParams.message: ${taskParams.message}`)
			let messageObj: any
			try {
				messageObj = JSON.parse(taskParams.message)
				outputChannel.appendLine(`[LLM] ✅ Parsed messageObj: ${JSON.stringify(messageObj)}`)
			} catch (e) {
				outputChannel.appendLine(`[LLM] ⚠️ Failed to parse message as JSON, treating as plain text`)
				messageObj = null
			}

			outputChannel.appendLine(
				`[LLM] 🔍 messageObj?.type: ${messageObj?.type}, isSayHi: ${messageObj?.type === "say_hi"}`,
			)

			// 处理 terminal 消息
			if (messageObj?.type === "terminal_input") {
				outputChannel.appendLine(`[LLM] 🖥️ Detected terminal_input message, delegating to LLMStreamService`)
				await llmService.handleTerminalMessage(data)
				return
			}

			if (messageObj?.type === "say_hi") {
				outputChannel.appendLine(`[LLM] 👋 Detected say_hi message, sending welcome message`)
				// 直接返回欢迎语
				const welcomeMessage =
					taskParams.agentConfig.welcomeMessage ||
					`你好！我是 ${taskParams.agentConfig.name}，很高兴为你服务！`

				llmService.imConnection.sendLLMChunk(
					taskParams.streamId,
					welcomeMessage,
					taskParams.imMetadata.recvId,
					taskParams.imMetadata.targetTerminal,
					taskParams.imMetadata.chatType,
					taskParams.imMetadata.sendId,
					taskParams.imMetadata.senderTerminal,
				)

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
					undefined,
				)
				return
			}

			// 创建并执行任务
			const conversationId = await createAndExecuteAgentTask(taskParams, provider)

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
		} catch (error: any) {
			outputChannel.appendLine(`[LLM] ❌ Error: ${error.message}`)
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
			} catch (sendError: any) {
				outputChannel.appendLine(`[LLM] ❌ Send error failed: ${sendError.message}`)
			}
		}
	})

	// 🔥 标记处理器已注册完成 - 防止竞态条件
	llmService.markHandlersRegistered()

	// 延迟初始化：检查tokenKey是否已设置
	setTimeout(async () => {
		const tokenManager = ImPlatformTokenManager.getInstance()
		outputChannel.appendLine(`[LLM] 🔍 Checking token... hasTokenKey: ${tokenManager.hasTokenKey()}`)

		if (tokenManager.hasTokenKey()) {
			try {
				outputChannel.appendLine(`[LLM] 🚀 Starting IM connection...`)
				await llmService.initialize()
				outputChannel.appendLine(`[LLM] ✅ IM connection established successfully`)
			} catch (error) {
				outputChannel.appendLine(`[LLM] ❌ Init failed: ${error}`)
			}
		} else {
			outputChannel.appendLine(`[LLM] ℹ️ No token found, skipping IM connection`)
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

	// Register voice assistant commands
	registerVoiceCommands(context)

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

		// 初始化A2A服务器管理器（不传存储服务，让它自己创建）
		const a2aServerManager = A2AServerManager.getInstance()
		await a2aServerManager.initialize(undefined, provider)

		// 确保provider正确设置，以便startAgentWithFullFlow方法能够访问API配置
		a2aServerManager.setProvider(provider)

		// 自动启动所有已发布的智能体（异步执行，不阻塞插件启动）
		a2aServerManager
			.startAllPublishedAgents()
			.then((result: any) => {

				// 已自动启动智能体，不显示提示消息以避免干扰用户
				// if (result.started > 0) {
				// 	vscode.window.showInformationMessage(`🤖 Started ${result.started} published agents automatically`)
				// }

				if (result.errors.length > 0) {
					result.errors.forEach((item: { agentId: string; error: any }) => {
						outputChannel.appendLine(`  - ${item.agentId}: ${item.error}`)
					})
				}
			})
			.catch((error: any) => {
			})

		// 添加到订阅中以便正确清理
		context.subscriptions.push({
			dispose: async () => {
				await a2aServerManager.destroy()
			},
		})

	} catch (error) {
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

		// Create a debounced reload function to prevent excessive reloads
		let reloadTimeout: NodeJS.Timeout | undefined
		const DEBOUNCE_DELAY = 1_000

		const debouncedReload = (uri: vscode.Uri) => {
			if (reloadTimeout) {
				clearTimeout(reloadTimeout)
			}

			reloadTimeout = setTimeout(() => {
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

	// === 🔥 扩展退出前的资源清理 ===
	try {
		// 1. 停止所有运行中的智能体
		const { A2AServerManager } = await import("./core/agent/A2AServerManager")
		const serverManager = A2AServerManager.getInstance()
		const runningAgents = serverManager.getRunningServers()

		if (runningAgents.length > 0) {
			outputChannel.appendLine(`[Extension] Stopping ${runningAgents.length} running agents...`)
			await serverManager.stopAllServers()
			outputChannel.appendLine(`[Extension] ✅ All agents stopped`)
		}
	} catch (error) {
		outputChannel.appendLine(`[Extension] ⚠️ Failed to stop agents: ${error}`)
	}

	try {
		// 2. 断开IM WebSocket连接（阻止自动重连）
		const llmService = (global as any).llmStreamService
		if (llmService?.imConnection) {
			outputChannel.appendLine(`[Extension] Disconnecting IM WebSocket...`)
			llmService.imConnection.disconnect(true) // 传入 true 阻止自动重连
			outputChannel.appendLine(`[Extension] ✅ IM WebSocket disconnected`)
		}
	} catch (error) {
		outputChannel.appendLine(`[Extension] ⚠️ Failed to disconnect IM: ${error}`)
	}

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
