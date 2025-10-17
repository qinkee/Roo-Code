import * as vscode from "vscode"
import { ImPlatformTokenManager } from "./im-platform/ImPlatformTokenManager"

/**
 * IM认证服务 - 负责Roo-Code独立登录获取terminal=6的token
 */
export class IMAuthService {
	private static instance: IMAuthService
	private accessToken: string | null = null
	private tokenManager: ImPlatformTokenManager

	private constructor(
		private context: vscode.ExtensionContext,
		private outputChannel: vscode.OutputChannel,
	) {
		this.tokenManager = ImPlatformTokenManager.getInstance()
	}

	static getInstance(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel): IMAuthService {
		if (!IMAuthService.instance) {
			IMAuthService.instance = new IMAuthService(context, outputChannel)
		}
		return IMAuthService.instance
	}

	/**
	 * 执行独立登录，获取terminal=6的accessToken
	 */
	async login(): Promise<string> {
		try {
			this.outputChannel.appendLine("[IMAuth] Starting independent login for Roo-Code (terminal=6)...")

			// 步骤1: 获取tokenKey
			const tokenKey = await this.getTokenKey()
			if (!tokenKey) {
				throw new Error("No token key available for login")
			}

			this.outputChannel.appendLine("[IMAuth] Using token key for login")

			// 步骤2: 调用登录接口，使用terminal=6
			const loginResponse = await fetch("https://aiim.service.thinkgs.cn/api/login", {
				method: "POST",
				headers: {
					"Token-Key": tokenKey,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: "123", // 占位符，接口需要但不使用
					userName: "test", // 占位符，接口需要但不使用
					terminal: 6, // Roo-Code专用终端类型（扩展范围到6）
					terminalNo: 0,
				}),
			})

			if (!loginResponse.ok) {
				throw new Error(`Login failed with status: ${loginResponse.status}`)
			}

			const loginResult = await loginResponse.json()

			if (loginResult.code !== 200) {
				throw new Error(`Login failed: ${loginResult.message || "Unknown error"}`)
			}

			const loginData = loginResult.data
			if (!loginData || !loginData.accessToken) {
				throw new Error("Login response missing accessToken")
			}

			// 保存token
			this.accessToken = loginData.accessToken
			await this.saveToken(loginData.accessToken)

			// 保存terminal类型信息
			await this.context.globalState.update("rooCodeTerminal", 6)

			this.outputChannel.appendLine("[IMAuth] Login successful, got accessToken for terminal=6")
			this.outputChannel.appendLine(`[IMAuth] Token payload: terminal=6, userId=${loginData.userId || "unknown"}`)

			// 显示成功消息
			// vscode.window.showInformationMessage('Roo-Code IM connection established (terminal=6)');

			return loginData.accessToken
		} catch (error) {
			this.outputChannel.appendLine(`[IMAuth] Login failed: ${error}`)
			throw error
		}
	}

	/**
	 * 获取tokenKey - 使用现有的ImPlatformTokenManager
	 */
	private async getTokenKey(): Promise<string | null> {
		// 使用ImPlatformTokenManager获取tokenKey
		const tokenKey = this.tokenManager.getTokenKey()

		if (tokenKey) {
			this.outputChannel.appendLine("[IMAuth] Found token key from ImPlatformTokenManager")
			return tokenKey
		}

		// 如果没有tokenKey，提示用户需要先设置
		this.outputChannel.appendLine("[IMAuth] No token key found. User needs to set it in settings.")

		// 提示用户设置tokenKey
		const action = await vscode.window.showWarningMessage(
			"IM Token Key not configured. Please set it in settings.",
			"Open Settings",
		)

		if (action === "Open Settings") {
			await vscode.commands.executeCommand("workbench.action.openSettings", "roo-cline.imPlatformTokenKey")
		}

		return null
	}

	/**
	 * 获取accessToken - 每次都通过 skToken 重新登录，不使用缓存
	 */
	async getAccessToken(): Promise<string> {
		this.outputChannel.appendLine(`[IMAuth] Getting access token, will always login with current skToken`)
		// 直接执行登录，不使用任何缓存
		return await this.login()
	}

	/**
	 * 保存token到存储
	 */
	private async saveToken(token: string): Promise<void> {
		await this.context.globalState.update("rooCodeAccessToken", token)
	}

	/**
	 * 清除token
	 */
	async clearToken(): Promise<void> {
		this.accessToken = null
		await this.context.globalState.update("rooCodeAccessToken", undefined)
		this.outputChannel.appendLine("[IMAuth] Access token cleared")
	}

	/**
	 * 检查token是否有效
	 */
	isTokenValid(): boolean {
		return this.accessToken !== null && !this.isTokenExpiringSoon()
	}

	/**
	 * 检查token是否即将过期（5分钟内）
	 */
	private isTokenExpiringSoon(): boolean {
		if (!this.accessToken) {
			return true
		}

		try {
			// 解析JWT token
			const parts = this.accessToken.split(".")
			if (parts.length !== 3) {
				return true
			}

			// 解码payload
			const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
			const exp = payload.exp

			if (!exp) {
				return true
			}

			// 检查是否在5分钟内过期
			const now = Math.floor(Date.now() / 1000)
			const timeLeft = exp - now

			if (timeLeft < 300) {
				// 5分钟 = 300秒
				this.outputChannel.appendLine(`[IMAuth] Token expires in ${timeLeft} seconds`)
				return true
			}

			return false
		} catch (error) {
			this.outputChannel.appendLine(`[IMAuth] Failed to parse token: ${error}`)
			return true
		}
	}
}
