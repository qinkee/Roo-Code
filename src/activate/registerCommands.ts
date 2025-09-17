import * as vscode from "vscode"
import delay from "delay"

import type { CommandId } from "@roo-code/types"
import { TelemetryService } from "@roo-code/telemetry"

import { Package } from "../shared/package"
import { getCommand } from "../utils/commands"
import { ClineProvider } from "../core/webview/ClineProvider"
import { ContextProxy } from "../core/config/ContextProxy"
import { focusPanel } from "../utils/focusPanel"

import { registerHumanRelayCallback, unregisterHumanRelayCallback, handleHumanRelayResponse } from "./humanRelay"
import { handleNewTask } from "./handleTask"
import { executeTask, executeTaskWithMode } from "./handleTaskCommands"
import { CodeIndexManager } from "../services/code-index/manager"
import { importSettingsWithFeedback } from "../core/config/importExport"
import { MdmService } from "../services/mdm/MdmService"
import { ImPlatformTokenManager } from "../services/im-platform/ImPlatformTokenManager"
import { CloudPCNotificationService } from "../services/cloud-pc/CloudPCNotificationService"
import { t } from "../i18n"

/**
 * Helper to get the visible ClineProvider instance or log if not found.
 */
export function getVisibleProviderOrLog(outputChannel: vscode.OutputChannel): ClineProvider | undefined {
	const visibleProvider = ClineProvider.getVisibleInstance()
	if (!visibleProvider) {
		outputChannel.appendLine("Cannot find any visible Roo Code instances.")
		return undefined
	}
	return visibleProvider
}

// Store panel references in both modes
let sidebarPanel: vscode.WebviewView | undefined = undefined
let tabPanel: vscode.WebviewPanel | undefined = undefined

/**
 * Get the currently active panel
 * @returns WebviewPanel或WebviewView
 */
export function getPanel(): vscode.WebviewPanel | vscode.WebviewView | undefined {
	return tabPanel || sidebarPanel
}

/**
 * Set panel references
 */
export function setPanel(
	newPanel: vscode.WebviewPanel | vscode.WebviewView | undefined,
	type: "sidebar" | "tab",
): void {
	if (type === "sidebar") {
		sidebarPanel = newPanel as vscode.WebviewView
		tabPanel = undefined
	} else {
		tabPanel = newPanel as vscode.WebviewPanel
		sidebarPanel = undefined
	}
}

export type RegisterCommandOptions = {
	context: vscode.ExtensionContext
	outputChannel: vscode.OutputChannel
	provider: ClineProvider
}

export const registerCommands = (options: RegisterCommandOptions) => {
	const { context } = options

	for (const [id, callback] of Object.entries(getCommandsMap(options))) {
		const command = getCommand(id as CommandId)
		context.subscriptions.push(vscode.commands.registerCommand(command, callback))
	}
}

const getCommandsMap = ({ context, outputChannel, provider }: RegisterCommandOptions): Record<CommandId, any> => ({
	activationCompleted: () => {},
	accountButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("account")

		visibleProvider.postMessageToWebview({ type: "action", action: "accountButtonClicked" })
	},
	agentsButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("agents")

		visibleProvider.postMessageToWebview({ type: "action", action: "agentsButtonClicked" })
	},
	plusButtonClicked: async () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("plus")

		await visibleProvider.removeClineFromStack()
		await visibleProvider.postStateToWebview()
		await visibleProvider.postMessageToWebview({ type: "action", action: "chatButtonClicked" })
		// Send focusInput action immediately after chatButtonClicked
		// This ensures the focus happens after the view has switched
		await visibleProvider.postMessageToWebview({ type: "action", action: "focusInput" })
	},
	mcpButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("mcp")

		visibleProvider.postMessageToWebview({ type: "action", action: "mcpButtonClicked" })
	},
	promptsButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("prompts")

		visibleProvider.postMessageToWebview({ type: "action", action: "promptsButtonClicked" })
	},
	popoutButtonClicked: () => {
		TelemetryService.instance.captureTitleButtonClicked("popout")

		return openClineInNewTab({ context, outputChannel })
	},
	openInNewTab: () => openClineInNewTab({ context, outputChannel }),
	settingsButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("settings")

		visibleProvider.postMessageToWebview({ type: "action", action: "settingsButtonClicked" })
		// Also explicitly post the visibility message to trigger scroll reliably
		visibleProvider.postMessageToWebview({ type: "action", action: "didBecomeVisible" })
	},
	historyButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		TelemetryService.instance.captureTitleButtonClicked("history")

		visibleProvider.postMessageToWebview({ type: "action", action: "historyButtonClicked" })
	},
	marketplaceButtonClicked: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)
		if (!visibleProvider) return
		visibleProvider.postMessageToWebview({ type: "action", action: "marketplaceButtonClicked" })
	},
	showHumanRelayDialog: (params: { requestId: string; promptText: string }) => {
		const panel = getPanel()

		if (panel) {
			panel?.webview.postMessage({
				type: "showHumanRelayDialog",
				requestId: params.requestId,
				promptText: params.promptText,
			})
		}
	},
	registerHumanRelayCallback: registerHumanRelayCallback,
	unregisterHumanRelayCallback: unregisterHumanRelayCallback,
	handleHumanRelayResponse: handleHumanRelayResponse,
	newTask: handleNewTask,
	executeTask: executeTask,
	executeTaskWithMode: executeTaskWithMode,
	setCustomStoragePath: async () => {
		const { promptForCustomStoragePath } = await import("../utils/storage")
		await promptForCustomStoragePath()
	},
	importSettings: async (filePath?: string) => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)
		if (!visibleProvider) {
			return
		}

		await importSettingsWithFeedback(
			{
				providerSettingsManager: visibleProvider.providerSettingsManager,
				contextProxy: visibleProvider.contextProxy,
				customModesManager: visibleProvider.customModesManager,
				provider: visibleProvider,
			},
			filePath,
		)
	},
	focusInput: async () => {
		try {
			await focusPanel(tabPanel, sidebarPanel)

			// Send focus input message only for sidebar panels
			if (sidebarPanel && getPanel() === sidebarPanel) {
				provider.postMessageToWebview({ type: "action", action: "focusInput" })
			}
		} catch (error) {
			outputChannel.appendLine(`Error focusing input: ${error}`)
		}
	},
	focusPanel: async () => {
		try {
			await focusPanel(tabPanel, sidebarPanel)
		} catch (error) {
			outputChannel.appendLine(`Error focusing panel: ${error}`)
		}
	},
	acceptInput: () => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		visibleProvider.postMessageToWebview({ type: "acceptInput" })
	},
	receiveUserInfo: async (data: { userInfo?: any; accessToken?: string; tokenKey?: string }) => {
		const visibleProvider = getVisibleProviderOrLog(outputChannel)

		if (!visibleProvider) {
			return
		}

		// 从userInfo或直接参数中提取token
		let token = data?.tokenKey || data?.accessToken || data?.userInfo?.tokenKey || data?.userInfo?.accessToken

		if (token) {
			// 发送消息到webview更新OpenAI API Key
			await visibleProvider.postMessageToWebview({
				type: "tokenKeyReceived",
				tokenKey: token,
				source: "ai-im",
				timestamp: Date.now(),
			} as any)

			// 同时更新provider设置并保存
			// const currentSettings = visibleProvider.contextProxy.getValue("providerSettings")
			// if (currentSettings) {
			// 	const updatedSettings = {
			// 		...currentSettings,
			// 		openAiApiKey: token,
			// 	}
			// 	await visibleProvider.contextProxy.setValue("providerSettings", updatedSettings)
			// 	await visibleProvider.postStateToWebview()
			// }

			outputChannel.appendLine(`[receiveUserInfo] Token received and set: ${token.substring(0, 10)}...`)

			// 显示成功通知
			vscode.window.showInformationMessage("API Key已成功从外部插件接收并设置")
		} else {
			outputChannel.appendLine("[receiveUserInfo] No token found in received data")
		}
	},
	"imPlatform.manageToken": async () => {
		const tokenManager = ImPlatformTokenManager.getInstance()
	},
	"imPlatform.setToken": async () => {
		outputChannel.appendLine("[imPlatform.setToken] Command started")

		const tokenManager = ImPlatformTokenManager.getInstance()
		const input = await vscode.window.showInputBox({
			prompt: "请输入IM Platform TokenKey",
			password: true,
			placeHolder: "your-token-key-here",
		})

		if (input) {
			await tokenManager.setTokenKey(input)
		} else {
			outputChannel.appendLine("[imPlatform.setToken] User cancelled input")
		}
	},
	"imPlatform.clearToken": async () => {
		const tokenManager = ImPlatformTokenManager.getInstance()
		await tokenManager.clearTokenKey()
	},
	sendCloudPCNotification: async () => {
		outputChannel.appendLine("[sendCloudPCNotification] Command triggered")

		try {
			// Get MCP hub instance if available
			const { McpServerManager } = await import("../services/mcp/McpServerManager")
			const visibleProvider = getVisibleProviderOrLog(outputChannel) || provider
			const mcpHub = await McpServerManager.getInstance(context, visibleProvider)

			if (mcpHub) {
				// Send cloud PC startup notification
				const cloudPCNotificationService = CloudPCNotificationService.getInstance(outputChannel)
				cloudPCNotificationService.reset() // Reset to allow re-sending
				await cloudPCNotificationService.sendStartupNotification(mcpHub)

				outputChannel.appendLine("[sendCloudPCNotification] Notification sent successfully")
			} else {
				outputChannel.appendLine("[sendCloudPCNotification] MCP hub not available")
				vscode.window.showErrorMessage("MCP服务未初始化，无法发送云电脑启动通知")
			}
		} catch (error) {
			outputChannel.appendLine(
				`[sendCloudPCNotification] Error: ${error instanceof Error ? error.message : String(error)}`,
			)
			vscode.window.showErrorMessage(
				`发送云电脑启动通知失败: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	},
	testSetTerminalNo: async () => {
		outputChannel.appendLine("[testSetTerminalNo] Command triggered")

		// 手动设置为云电脑终端类型进行测试
		const { VoidBridge } = await import("../api/void-bridge")
		const { TerminalType } = await import("../types/terminal")

		// 询问用户输入真实的用户ID和Token
		const userId = await vscode.window.showInputBox({
			prompt: "请输入用户ID（留空使用test-user-123）",
			placeHolder: "例如: 12345",
			value: "test-user-123",
		})

		const userToken = await vscode.window.showInputBox({
			prompt: "请输入用户Token（用于IM平台认证）",
			password: true,
			placeHolder: "sk-xxx",
		})

		// 如果提供了token，先设置im-platform的token
		if (userToken) {
			outputChannel.appendLine(`[testSetTerminalNo] Setting IM Platform token...`)
			const tokenManager = ImPlatformTokenManager.getInstance()
			await tokenManager.setTokenKey(userToken, true) // skipRestart=true，因为我们稍后会手动重启
			outputChannel.appendLine(`[testSetTerminalNo] IM Platform token set`)
		}

		// 模拟用户切换事件，设置为云电脑
		await vscode.commands.executeCommand("roo-cline.onUserSwitch", {
			userId: userId || "test-user-123",
			userName: "Test User",
			terminalNo: TerminalType.CLOUD_PC, // 3 - 云电脑
		})

		// 如果设置了token，重启im-platform连接
		if (userToken) {
			const { McpServerManager } = await import("../services/mcp/McpServerManager")
			const visibleProvider = getVisibleProviderOrLog(outputChannel) || provider
			const mcpHub = await McpServerManager.getInstance(context, visibleProvider)
			if (mcpHub) {
				outputChannel.appendLine(`[testSetTerminalNo] Restarting IM Platform connection...`)
				await mcpHub.restartConnection("im-platform")
				outputChannel.appendLine(`[testSetTerminalNo] IM Platform connection restarted`)
			}
		}

		outputChannel.appendLine(`[testSetTerminalNo] Set terminal to CLOUD_PC (${TerminalType.CLOUD_PC})`)

		// 显示当前状态
		const currentTerminalNo = VoidBridge.getCurrentTerminalNo()
		const currentTerminalType = VoidBridge.getCurrentTerminalType()
		const currentUserId = VoidBridge.getCurrentUserId()

		outputChannel.appendLine(`[testSetTerminalNo] Current state:`)
		outputChannel.appendLine(`  - User ID: ${currentUserId}`)
		outputChannel.appendLine(`  - Terminal No: ${currentTerminalNo}`)
		outputChannel.appendLine(`  - Terminal Type: ${currentTerminalType}`)
		outputChannel.appendLine(`  - Has IM Token: ${!!userToken}`)

		vscode.window.showInformationMessage(
			`测试设置完成: 终端类型=${currentTerminalType}, 用户=${currentUserId}, Token已设置=${!!userToken}`,
		)
	},
	switchToDefaultConfig: async () => {
		// 切换到默认配置，清空显示但保留用户数据
		// 这用于用户登出后显示欢迎页面
		try {
			const visibleProvider = getVisibleProviderOrLog(outputChannel)
			const currentProvider = visibleProvider || provider

			// 清空当前任务，显示欢迎页面
			await currentProvider.removeClineFromStack()

			// 清空任务历史显示（但不删除存储的数据）
			// 通过设置空的任务历史到context，让UI不显示任何任务
			await currentProvider.contextProxy.setValue("taskHistory", [])
			outputChannel.appendLine("[switchToDefaultConfig] Cleared task history display")

			// 刷新 webview 状态
			await currentProvider.postStateToWebview()

			outputChannel.appendLine("[switchToDefaultConfig] Successfully switched to welcome screen")
			return { success: true }
		} catch (error) {
			outputChannel.appendLine(
				`[switchToDefaultConfig] Failed to switch to default: ${error instanceof Error ? error.message : String(error)}`,
			)
			return { success: false, error: error instanceof Error ? error.message : String(error) }
		}
	},
	debugResetAllProfiles: async () => {
		try {
			// 获取当前可见的 provider 实例
			const visibleProvider = getVisibleProviderOrLog(outputChannel)
			if (!visibleProvider) {
				outputChannel.appendLine("No visible provider found, using default provider")
			}

			const currentProvider = visibleProvider || provider

			// 执行与 resetState() 相同的逻辑，静默执行不显示确认对话框
			await currentProvider.contextProxy.resetAllState()
			await currentProvider.providerSettingsManager.resetAllConfigs()
			await currentProvider.customModesManager.resetCustomModes()
			await currentProvider.removeClineFromStack()
			await currentProvider.postStateToWebview()
			await currentProvider.postMessageToWebview({ type: "action", action: "chatButtonClicked" })

			outputChannel.appendLine("Provider profiles reset to default state")
		} catch (error) {
			outputChannel.appendLine(`Error resetting provider profiles: ${error}`)
			await vscode.window.showErrorMessage(`Failed to reset provider profiles: ${error}`)
			throw error
		}
	},
	autoConfigureProvider: async (token?: string) => {
		outputChannel.appendLine("[autoConfigureProvider] Command started")
		const tokenManager = ImPlatformTokenManager.getInstance()

		try {
			// 获取当前可见的 provider 实例
			const visibleProvider = getVisibleProviderOrLog(outputChannel)
			if (!visibleProvider) {
				// 如果没有可见的实例，尝试使用传入的 provider
				outputChannel.appendLine("[autoConfigureProvider] No visible provider found, using default provider")
			}

			const currentProvider = visibleProvider || provider
			outputChannel.appendLine(
				`[autoConfigureProvider] Using provider instance: ${currentProvider ? "found" : "not found"}`,
			)

			// 如果没有提供 token，通过输入框获取
			if (!token) {
				outputChannel.appendLine("[autoConfigureProvider] No token provided, showing input box")
				const input = await vscode.window.showInputBox({
					prompt: "请输入 API Token",
					password: true,
					placeHolder: "your-api-token-here",
				})

				if (!input) {
					outputChannel.appendLine("[autoConfigureProvider] User cancelled input or provided empty token")
					vscode.window.showWarningMessage("配置取消：未提供 API Token")
					return
				}

				token = input
				outputChannel.appendLine("[autoConfigureProvider] Token received from input box")
			}

			outputChannel.appendLine(`[autoConfigureProvider] Processing with token: ${token.substring(0, 10)}...`)

			// Set IM Platform token
			outputChannel.appendLine("[autoConfigureProvider] Setting IM Platform token...")
			await tokenManager.setTokenKey(token, true) // skipRestart=true, we'll restart later if needed
			outputChannel.appendLine("[autoConfigureProvider] IM Platform token set")

			// Get current state to preserve existing settings
			outputChannel.appendLine("[autoConfigureProvider] Getting current state...")
			const currentState = await currentProvider.getState()
			outputChannel.appendLine(
				`[autoConfigureProvider] Current state retrieved, apiProvider: ${currentState.apiConfiguration.apiProvider}`,
			)

			// Create the configuration - merge with existing settings
			const config = {
				...currentState.apiConfiguration,
				apiProvider: "openai" as const,
				openAiBaseUrl: "https://one.api.mysql.service.thinkgs.cn/v1",
				openAiApiKey: token,
				openAiModelId: "deepseek-reasoner",
				// Default settings if not already set
				diffEnabled: currentState.apiConfiguration.diffEnabled ?? true,
				fuzzyMatchThreshold: currentState.apiConfiguration.fuzzyMatchThreshold ?? 1.0,
				consecutiveMistakeLimit: currentState.apiConfiguration.consecutiveMistakeLimit ?? 3,
				todoListEnabled: currentState.apiConfiguration.todoListEnabled ?? true,
			}

			outputChannel.appendLine(`[autoConfigureProvider] New config prepared:`)
			outputChannel.appendLine(`  - apiProvider: ${config.apiProvider}`)
			outputChannel.appendLine(`  - openAiBaseUrl: ${config.openAiBaseUrl}`)
			outputChannel.appendLine(`  - openAiModelId: ${config.openAiModelId}`)
			outputChannel.appendLine(`  - Has API key: ${!!config.openAiApiKey}`)

			outputChannel.appendLine("[autoConfigureProvider] Setting global settings...")

			// Set telemetry, language and auto-approval settings using contextProxy
			await currentProvider.contextProxy.setValues({
				telemetrySetting: "enabled",
				language: "zh-CN",
				// Auto-approval settings - all enabled for maximum convenience
				autoApprovalEnabled: true,
				alwaysAllowReadOnly: true,
				alwaysAllowReadOnlyOutsideWorkspace: true,
				alwaysAllowWrite: true,
				alwaysAllowWriteOutsideWorkspace: true,
				alwaysAllowWriteProtected: true,
				writeDelayMs: 1000,
				alwaysAllowBrowser: true,
				alwaysApproveResubmit: true,
				requestDelaySeconds: 0,
				alwaysAllowMcp: true,
				alwaysAllowModeSwitch: true,
				alwaysAllowSubtasks: true,
				alwaysAllowExecute: true,
				alwaysAllowFollowupQuestions: true,
				alwaysAllowUpdateTodoList: true,
				followupAutoApproveTimeoutMs: 0,
				// Allow all commands
				allowedCommands: ["*"],
				deniedCommands: [],
				// Other permission settings
				preventCompletionWithOpenTodos: false,
				commandExecutionTimeout: 120000, // 2 minutes
				commandTimeoutAllowlist: [],
			})

			outputChannel.appendLine("[autoConfigureProvider] Global settings updated")
			outputChannel.appendLine("[autoConfigureProvider] Calling upsertProviderProfile...")

			// Use upsertProviderProfile - this is what the UI uses and handles all state updates
			await currentProvider.upsertProviderProfile("default", config, true)

			// added by qinkee.同步设置mcp的token,用于设别用户
			tokenManager.setTokenKey(token)

			outputChannel.appendLine("[autoConfigureProvider] upsertProviderProfile completed")

			// Verify the configuration was applied
			const newState = await currentProvider.getState()
			outputChannel.appendLine(
				`[autoConfigureProvider] Verification - new apiProvider: ${newState.apiConfiguration.apiProvider}`,
			)
			outputChannel.appendLine(
				`[autoConfigureProvider] Verification - currentApiConfigName: ${newState.currentApiConfigName}`,
			)

			outputChannel.appendLine("[autoConfigureProvider] Provider auto-configured successfully")

			// 设置 lastShownAnnouncementId 为当前版本，避免显示版本更新面板
			const latestId = currentProvider.latestAnnouncementId
			outputChannel.appendLine(`[autoConfigureProvider] Setting lastShownAnnouncementId to: ${latestId}`)
			await currentProvider.contextProxy.setValue("lastShownAnnouncementId", latestId)

			// 验证设置是否成功
			const storedId = currentProvider.contextProxy.getValue("lastShownAnnouncementId")
			outputChannel.appendLine(`[autoConfigureProvider] Stored lastShownAnnouncementId: ${storedId}`)

			// 刷新 webview 状态
			await currentProvider.postStateToWebview()
			outputChannel.appendLine(`[autoConfigureProvider] Posted updated state to webview`)

			// Restart IM Platform MCP connection with new token
			try {
				const { McpServerManager } = await import("../services/mcp/McpServerManager")
				const mcpHub = await McpServerManager.getInstance(context, currentProvider)
				if (mcpHub) {
					outputChannel.appendLine(
						`[autoConfigureProvider] Restarting IM Platform connection with new token...`,
					)
					await mcpHub.restartConnection("im-platform")
					outputChannel.appendLine(`[autoConfigureProvider] IM Platform connection restarted`)
				}
			} catch (mcpError) {
				outputChannel.appendLine(`[autoConfigureProvider] Failed to restart IM Platform: ${mcpError}`)
				// Don't fail the whole operation just because MCP restart failed
			}
		} catch (error) {
			outputChannel.appendLine(`Error auto-configuring provider: ${error}`)
			vscode.window.showErrorMessage(`配置失败: ${error}`)
			throw error // Re-throw to let caller handle
		}
	},
})

export const openClineInNewTab = async ({ context, outputChannel }: Omit<RegisterCommandOptions, "provider">) => {
	// (This example uses webviewProvider activation event which is necessary to
	// deserialize cached webview, but since we use retainContextWhenHidden, we
	// don't need to use that event).
	// https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts
	const contextProxy = await ContextProxy.getInstance(context)
	const codeIndexManager = CodeIndexManager.getInstance(context)

	// Get the existing MDM service instance to ensure consistent policy enforcement
	let mdmService: MdmService | undefined
	try {
		mdmService = MdmService.getInstance()
	} catch (error) {
		// MDM service not initialized, which is fine - extension can work without it
		mdmService = undefined
	}

	const tabProvider = new ClineProvider(context, outputChannel, "editor", contextProxy, mdmService)
	const lastCol = Math.max(...vscode.window.visibleTextEditors.map((editor) => editor.viewColumn || 0))

	// Check if there are any visible text editors, otherwise open a new group
	// to the right.
	const hasVisibleEditors = vscode.window.visibleTextEditors.length > 0

	if (!hasVisibleEditors) {
		await vscode.commands.executeCommand("workbench.action.newGroupRight")
	}

	const targetCol = hasVisibleEditors ? Math.max(lastCol + 1, 1) : vscode.ViewColumn.Two

	const newPanel = vscode.window.createWebviewPanel(ClineProvider.tabPanelId, "Roo Code", targetCol, {
		enableScripts: true,
		retainContextWhenHidden: true,
		localResourceRoots: [context.extensionUri],
	})

	// Save as tab type panel.
	setPanel(newPanel, "tab")

	// TODO: Use better svg icon with light and dark variants (see
	// https://stackoverflow.com/questions/58365687/vscode-extension-iconpath).
	newPanel.iconPath = {
		light: vscode.Uri.joinPath(context.extensionUri, "assets", "icons", "panel_light.png"),
		dark: vscode.Uri.joinPath(context.extensionUri, "assets", "icons", "panel_dark.png"),
	}

	await tabProvider.resolveWebviewView(newPanel)

	// Add listener for visibility changes to notify webview
	newPanel.onDidChangeViewState(
		(e) => {
			const panel = e.webviewPanel
			if (panel.visible) {
				panel.webview.postMessage({ type: "action", action: "didBecomeVisible" }) // Use the same message type as in SettingsView.tsx
			}
		},
		null, // First null is for `thisArgs`
		context.subscriptions, // Register listener for disposal
	)

	// Handle panel closing events.
	newPanel.onDidDispose(
		() => {
			setPanel(undefined, "tab")
		},
		null,
		context.subscriptions, // Also register dispose listener
	)

	// Lock the editor group so clicking on files doesn't open them over the panel.
	await delay(100)
	await vscode.commands.executeCommand("workbench.action.lockEditorGroup")

	return tabProvider
}
