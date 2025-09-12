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
				placeHolder: "e.g., 1"
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
					{ label: "6 - Roo-Code", value: "6" }
				],
				{ placeHolder: "Select target terminal" }
			)
			
			const question = await vscode.window.showInputBox({
				prompt: "Enter a test question for LLM",
				value: "Hello, this is a test message"
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
		})
	)
	
	// Register LLM stream target commands
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.setLLMStreamTarget", async () => {
			await llmTargetManager.setTarget(context)
		})
	)
	
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.showLLMStreamTarget", async () => {
			await llmTargetManager.showStatus()
		})
	)
	
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.clearLLMStreamTarget", async () => {
			await context.globalState.update('llmStreamTargetUserId', undefined)
			await context.globalState.update('llmStreamTargetTerminal', undefined)
			await llmTargetManager.loadFromState(context)
			vscode.window.showInformationMessage('LLM stream target cleared')
		})
	)
	
	// Register command to manually initialize IM connection
	context.subscriptions.push(
		vscode.commands.registerCommand("roo-cline.initializeIMConnection", async () => {
			outputChannel.appendLine("[LLM] Manual IM connection initialization requested")
			
			const tokenManager = ImPlatformTokenManager.getInstance()
			if (!tokenManager.hasTokenKey()) {
				vscode.window.showErrorMessage('TokenKey not configured. Please set it in settings first.')
				await vscode.commands.executeCommand('workbench.action.openSettings', 'roo-cline.imPlatformTokenKey')
				return
			}
			
			try {
				outputChannel.appendLine("[LLM] Initializing IM connection...")
				await llmService.initialize()
				outputChannel.appendLine("[LLM] IM connection established successfully")
				vscode.window.showInformationMessage('IM WebSocket connection established successfully')
			} catch (error) {
				outputChannel.appendLine(`[LLM] Failed to initialize IM connection: ${error}`)
				vscode.window.showErrorMessage(`Failed to connect to IM server: ${error}`)
			}
		})
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
