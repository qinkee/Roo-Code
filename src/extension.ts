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
	outputChannel.appendLine("[LLM] Creating LLM Stream Service (deferred connection)...")
	const llmService = new LLMStreamService(context, outputChannel)
	// Make it globally available for Task to use
	;(global as any).llmStreamService = llmService
	outputChannel.appendLine("[LLM] LLM Stream Service created and registered globally")

	// 注册LLM流式请求处理器
	llmService.imConnection.onLLMStreamRequest(async (data: any) => {
		outputChannel.appendLine(`[LLM] 🔍 Received LLM_STREAM_REQUEST - Full data: ${JSON.stringify(data)}`)
		// data 包含: streamId, question, sendId, recvId, senderTerminal, targetTerminal, chatType, taskName, timestamp
		try {
			const { streamId, question, sendId, recvId, senderTerminal, targetTerminal, chatType, taskName } = data
			outputChannel.appendLine(`[LLM] Processing request - streamId: ${streamId}, taskName: ${taskName}`)
			outputChannel.appendLine(
				`[LLM] 🔍 Incoming route VALUES - sendId: ${sendId} (type: ${typeof sendId}), recvId: ${recvId} (type: ${typeof recvId}), senderTerminal: ${senderTerminal} (type: ${typeof senderTerminal}), targetTerminal: ${targetTerminal} (type: ${typeof targetTerminal}), chatType: ${chatType}`,
			)

			// 响应时需要交换发送者和接收者的值
			// 响应消息: sendId字段填recvId的值, recvId字段填sendId的值
			const responseSendId = recvId // sendId 填原请求的 recvId
			const responseRecvId = sendId // recvId 填原请求的 sendId
			const responseSenderTerminal = targetTerminal // senderTerminal 填原请求的 targetTerminal
			const responseTargetTerminal = senderTerminal // targetTerminal 填原请求的 senderTerminal

			outputChannel.appendLine(
				`[LLM] 🎯 Response route VALUES - responseSendId: ${responseSendId} (原recvId=${recvId}), responseRecvId: ${responseRecvId} (原sendId=${sendId}), responseSenderTerminal: ${responseSenderTerminal} (原targetTerminal=${targetTerminal}), responseTargetTerminal: ${responseTargetTerminal} (原senderTerminal=${senderTerminal})`,
			)

			// 解析 question（它是一个JSON字符串）
			let questionData: any
			try {
				questionData = typeof question === "string" ? JSON.parse(question) : question
				outputChannel.appendLine(`[LLM] Parsed question: ${JSON.stringify(questionData)}`)
			} catch (e) {
				outputChannel.appendLine(`[LLM] Failed to parse question: ${e}`)
				// 发送错误响应
				llmService.imConnection.sendLLMError(
					streamId,
					"Invalid question format",
					responseRecvId,
					responseTargetTerminal,
					chatType,
					responseSendId,
					responseSenderTerminal,
				)
				return
			}

			// 从 taskName 中提取智能体ID (格式: agent_{agentId})
			const agentIdMatch = taskName?.match(/^agent_(.+)$/)
			if (!agentIdMatch) {
				outputChannel.appendLine(`[LLM] Invalid taskName format: ${taskName}`)
				llmService.imConnection.sendLLMError(
					streamId,
					"Invalid taskName format",
					responseRecvId,
					responseTargetTerminal,
					chatType,
					responseSendId,
					responseSenderTerminal,
				)
				return
			}

			const agentId = agentIdMatch[1]
			outputChannel.appendLine(`[LLM] Extracted agent ID: ${agentId}`)

			// 获取消息内容
			const message = questionData?.params?.message
			if (!message) {
				outputChannel.appendLine(`[LLM] No message in question data`)
				llmService.imConnection.sendLLMError(
					streamId,
					"No message provided",
					responseRecvId,
					responseTargetTerminal,
					chatType,
					responseSendId,
					responseSenderTerminal,
				)
				return
			}

			outputChannel.appendLine(`[LLM] User message: ${message}`)

			// 调用智能体的 A2A 服务器
			try {
				// 直接使用已在顶部导入的 A2AServerManager
				const a2aManager = A2AServerManager.getInstance()

				// 获取智能体的服务器状态（使用正确的方法名）
				const serverStatus = a2aManager.getServerStatus(agentId)
				if (!serverStatus || !serverStatus.url) {
					outputChannel.appendLine(`[LLM] Agent ${agentId} not running or no server URL`)
					llmService.imConnection.sendLLMError(
						streamId,
						`Agent ${agentId} is not running`,
						recvId,
						targetTerminal,
						chatType,
						sendId,
						senderTerminal,
					)
					return
				}

				outputChannel.appendLine(`[LLM] Calling agent at: ${serverStatus.url}/execute (SSE with stream=true)`)

				// 使用流式 SSE 请求
				const url = new URL(`${serverStatus.url}/execute`)
				const isHttps = url.protocol === "https:"
				const httpModule = isHttps ? require("https") : require("http")

				await new Promise<void>((resolve, reject) => {
					const requestData = JSON.stringify({
						method: "chat",
						params: { message: message },
						stream: true, // 关键：添加 stream 参数
					})

					const options = {
						hostname: url.hostname,
						port: url.port || (isHttps ? 443 : 80),
						path: url.pathname,
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Content-Length": Buffer.byteLength(requestData),
							Accept: "text/event-stream",
						},
					}

					const req = httpModule.request(options, (res: any) => {
						if (res.statusCode < 200 || res.statusCode >= 300) {
							let errorData = ""
							res.on("data", (chunk: any) => {
								errorData += chunk
							})
							res.on("end", () => {
								reject(new Error(`HTTP ${res.statusCode}: ${errorData}`))
							})
							return
						}

						outputChannel.appendLine(`[LLM] Connected to agent SSE stream`)
						let buffer = ""

						let currentEvent = ""
						res.on("data", (chunk: any) => {
							buffer += chunk.toString()
							const lines = buffer.split("\n")
							buffer = lines.pop() || ""

							for (const line of lines) {
								if (line.startsWith("event: ")) {
									currentEvent = line.slice(7).trim()
								} else if (line.startsWith("data: ")) {
									const data = line.slice(6).trim()

									if (data === "[DONE]") {
										outputChannel.appendLine(`[LLM] Stream done signal`)
										continue
									}

									try {
										const parsed = JSON.parse(data)

										// 根据事件类型处理
										if (currentEvent === "thinking" || currentEvent === "completion") {
											// thinking 和 completion 事件都包含 content
											if (parsed.content) {
												outputChannel.appendLine(
													`[LLM] [${currentEvent}] ${parsed.content.substring(0, 30)}...`,
												)
												llmService.imConnection.sendLLMChunk(
													streamId,
													parsed.content,
													responseRecvId,
													responseTargetTerminal,
													chatType,
													responseSendId,
													responseSenderTerminal,
												)
											}
										} else if (currentEvent === "error") {
											reject(new Error(parsed.error || parsed.message || "Stream error"))
										} else if (currentEvent === "done") {
											outputChannel.appendLine(`[LLM] Stream done event`)
										}
										// connected, start, api_start 等事件不需要转发
									} catch (e) {
										outputChannel.appendLine(`[LLM] Failed to parse SSE data: ${data}`)
									}
								}
							}
						})

						res.on("end", () => {
							outputChannel.appendLine(`[LLM] Stream ended`)
							llmService.imConnection.sendLLMEnd(
								streamId,
								responseRecvId,
								responseTargetTerminal,
								chatType,
								{
									name: taskName,
									id: agentId,
								},
								responseSendId,
								responseSenderTerminal,
							)
							resolve()
						})

						res.on("error", reject)
					})

					req.on("error", reject)
					req.write(requestData)
					req.end()
				})

				outputChannel.appendLine(`[LLM] Stream completed for streamId: ${streamId}`)
			} catch (error: any) {
				outputChannel.appendLine(`[LLM] Error calling agent: ${error.message}`)
				llmService.imConnection.sendLLMError(
					streamId,
					error.message || "Agent execution failed",
					recvId,
					targetTerminal,
					chatType,
					sendId,
					senderTerminal,
				)
			}
		} catch (error) {
			outputChannel.appendLine(`[LLM] Error processing LLM request: ${error}`)
		}
	})

	// 延迟初始化：检查tokenKey是否已设置
	setTimeout(async () => {
		const tokenManager = ImPlatformTokenManager.getInstance()
		if (tokenManager.hasTokenKey()) {
			outputChannel.appendLine("[LLM] TokenKey found, initializing IM connection...")
			try {
				await llmService.initialize()
				outputChannel.appendLine("[LLM] IM connection established successfully")
			} catch (error) {
				outputChannel.appendLine(`[LLM] Failed to initialize IM connection: ${error}`)
			}
		} else {
			outputChannel.appendLine("[LLM] TokenKey not found, skipping IM connection initialization")
			outputChannel.appendLine("[LLM] IM connection will be established when TokenKey is set")
		}
	}, 2000) // 等待2秒，让其他初始化完成

	// Initialize LLM Stream Target Manager
	const llmTargetManager = LLMStreamTargetManager.getInstance()
	await llmTargetManager.loadFromState(context)
	;(global as any).llmStreamTargetManager = llmTargetManager

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
