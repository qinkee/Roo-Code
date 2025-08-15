import * as vscode from "vscode"
import { McpHub } from "../mcp/McpHub"

/**
 * IM Platform Token Manager
 * 管理IM Platform的TokenKey，支持动态设置、清空和自动重连
 */
export class ImPlatformTokenManager {
	private static instance: ImPlatformTokenManager | undefined
	private mcpHub: McpHub | undefined
	private disposables: vscode.Disposable[] = []

	private constructor() {
		this.setupConfigListener()
	}

	/**
	 * 获取单例实例
	 */
	public static getInstance(): ImPlatformTokenManager {
		if (!ImPlatformTokenManager.instance) {
			ImPlatformTokenManager.instance = new ImPlatformTokenManager()
		}
		return ImPlatformTokenManager.instance
	}

	/**
	 * 设置MCP Hub引用
	 */
	public setMcpHub(mcpHub: McpHub): void {
		this.mcpHub = mcpHub
	}

	/**
	 * 设置TokenKey
	 * @param tokenKey 新的TokenKey
	 * @param skipRestart 是否跳过重启MCP连接
	 */
	public async setTokenKey(tokenKey: string, skipRestart: boolean = false): Promise<void> {
		try {
			// 更新VSCode配置
			const config = vscode.workspace.getConfiguration("roo-cline")
			await config.update("imPlatformTokenKey", tokenKey, vscode.ConfigurationTarget.Global)

			console.log(`[IM Platform Token] TokenKey updated ${tokenKey ? "(set)" : "(cleared)"}`)

			// 如果不跳过且MCP Hub可用，重启IM Platform连接
			if (!skipRestart && this.mcpHub) {
				await this.restartImPlatformConnection()
			}

			// 显示成功消息
			if (tokenKey) {
				vscode.window.showInformationMessage("IM Platform TokenKey已设置")
			} else {
				vscode.window.showInformationMessage("IM Platform TokenKey已清空")
			}
		} catch (error) {
			console.error("[IM Platform Token] Failed to set TokenKey:", error)
			vscode.window.showErrorMessage(`设置TokenKey失败: ${error}`)
		}
	}

	/**
	 * 清空TokenKey
	 */
	public async clearTokenKey(): Promise<void> {
		await this.setTokenKey("", false)
	}

	/**
	 * 获取当前TokenKey
	 */
	public getTokenKey(): string {
		const config = vscode.workspace.getConfiguration("roo-cline")
		return config.get<string>("imPlatformTokenKey") || ""
	}

	/**
	 * 检查是否已设置TokenKey
	 */
	public hasTokenKey(): boolean {
		return !!this.getTokenKey()
	}

	/**
	 * 重启IM Platform MCP连接
	 */
	private async restartImPlatformConnection(): Promise<void> {
		if (!this.mcpHub) {
			console.warn("[IM Platform Token] MCP Hub not available, skip restart")
			return
		}

		try {
			console.log("[IM Platform Token] Restarting IM Platform connection...")
			await this.mcpHub.restartConnection("im-platform")
			console.log("[IM Platform Token] IM Platform connection restarted")
		} catch (error) {
			console.error("[IM Platform Token] Failed to restart connection:", error)
			// 不抛出错误，因为这不应该阻止TokenKey的更新
		}
	}

	/**
	 * 监听配置变化
	 */
	private setupConfigListener(): void {
		// 监听配置变化
		const configListener = vscode.workspace.onDidChangeConfiguration(async (e) => {
			if (e.affectsConfiguration("roo-cline.imPlatformTokenKey")) {
				console.log("[IM Platform Token] Configuration changed")

				// 获取新的TokenKey值
				const newTokenKey = this.getTokenKey()
				console.log(`[IM Platform Token] New TokenKey ${newTokenKey ? "set" : "empty"}`)

				// 自动重启连接
				await this.restartImPlatformConnection()
			}
		})

		this.disposables.push(configListener)
	}

	/**
	 * 用户登录时设置TokenKey
	 * @param tokenKey 登录后获得的TokenKey
	 * @param userId 用户ID（可选）
	 */
	public async onUserLogin(tokenKey: string, userId?: string): Promise<void> {
		console.log(`[IM Platform Token] User login${userId ? ` (ID: ${userId})` : ""}`)
		await this.setTokenKey(tokenKey, false)

		// 可以在这里存储用户信息到全局状态
		if (userId) {
			// 预留接口，后续可以扩展存储用户信息
			console.log(`[IM Platform Token] User ID: ${userId}`)
		}
	}

	/**
	 * 用户登出时清空TokenKey
	 */
	public async onUserLogout(): Promise<void> {
		console.log("[IM Platform Token] User logout, clearing TokenKey")
		await this.clearTokenKey()

		// 重启连接以确保清空生效
		await this.restartImPlatformConnection()
	}

	/**
	 * 显示TokenKey状态
	 */
	public async showTokenStatus(): Promise<void> {
		const hasToken = this.hasTokenKey()
		const tokenKey = this.getTokenKey()

		if (hasToken) {
			const maskedToken = `***${tokenKey.slice(-4)}`
			const action = await vscode.window.showInformationMessage(
				`IM Platform TokenKey已设置: ${maskedToken}`,
				"清空TokenKey",
				"复制TokenKey",
			)

			if (action === "清空TokenKey") {
				await this.clearTokenKey()
			} else if (action === "复制TokenKey") {
				await vscode.env.clipboard.writeText(tokenKey)
				vscode.window.showInformationMessage("TokenKey已复制到剪贴板")
			}
		} else {
			const action = await vscode.window.showInformationMessage("IM Platform TokenKey未设置", "设置TokenKey")

			if (action === "设置TokenKey") {
				const input = await vscode.window.showInputBox({
					prompt: "请输入IM Platform TokenKey",
					password: true,
					placeHolder: "your-token-key-here",
				})

				if (input) {
					await this.setTokenKey(input)
				}
			}
		}
	}

	/**
	 * 释放资源
	 */
	public dispose(): void {
		this.disposables.forEach((d) => d.dispose())
		this.disposables = []
	}
}
