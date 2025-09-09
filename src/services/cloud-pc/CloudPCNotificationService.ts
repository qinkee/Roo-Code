import * as vscode from "vscode"
import { VoidBridge } from "../../api/void-bridge"
import { TerminalType } from "../../types/terminal"
import { McpHub } from "../mcp/McpHub"

/**
 * Service to handle cloud PC startup notifications
 * Sends notifications to other terminals when a cloud PC starts up
 */
export class CloudPCNotificationService {
	private static instance: CloudPCNotificationService | null = null
	private notificationSent = false

	private constructor(private readonly outputChannel: vscode.OutputChannel) {}

	/**
	 * Get singleton instance
	 */
	static getInstance(outputChannel: vscode.OutputChannel): CloudPCNotificationService {
		if (!CloudPCNotificationService.instance) {
			CloudPCNotificationService.instance = new CloudPCNotificationService(outputChannel)
		}
		return CloudPCNotificationService.instance
	}

	/**
	 * Send startup notification to other terminals
	 * @param mcpHub The MCP hub instance to use for sending messages
	 */
	async sendStartupNotification(mcpHub: McpHub): Promise<void> {
		try {
			// Check if notification was already sent
			if (this.notificationSent) {
				this.outputChannel.appendLine("[CloudPCNotification] Startup notification already sent")
				return
			}

			// Get current terminal type
			const terminalNo = VoidBridge.getCurrentTerminalNo()
			const terminalType = VoidBridge.getCurrentTerminalType()

			this.outputChannel.appendLine(
				`[CloudPCNotification] Current terminal info - terminalNo: ${terminalNo}, terminalType: ${terminalType}`,
			)

			// Only send notification if current terminal is Cloud PC
			if (terminalType !== TerminalType.CLOUD_PC) {
				this.outputChannel.appendLine(
					`[CloudPCNotification] Current terminal is not Cloud PC (type: ${terminalType}), skipping notification`,
				)
				return
			}

			// Get current user ID
			const userId = VoidBridge.getCurrentUserId()
			if (!userId) {
				this.outputChannel.appendLine("[CloudPCNotification] No user ID found, skipping notification")
				return
			}

			this.outputChannel.appendLine(
				`[CloudPCNotification] Sending startup notification for Cloud PC user: ${userId}`,
			)

			// Define the terminals to notify
			const terminalTypesToNotify = [
				TerminalType.WEB, // 傻蛋网页端
				TerminalType.APP, // 傻蛋精灵App
				TerminalType.VSCODE, // 我的电脑(VSCode)
				TerminalType.BROWSER_PLUGIN, // 傻蛋浏览器插件
				TerminalType.MCP, // MCP端
			]

			const message = "你的云电脑已经启动就绪，现在可以给我发送AI任务并执行了。"

			// Send notification to each terminal type
			for (const targetTerminal of terminalTypesToNotify) {
				try {
					this.outputChannel.appendLine(
						`[CloudPCNotification] Sending notification to terminal type ${targetTerminal}...`,
					)

					// Call the im-platform MCP tool to send private message
					const response = await mcpHub.callTool(
						"im-platform", // Server name
						"send_private_message", // Tool name
						{
							recvId: userId, // 接收者ID
							content: message, // 消息内容
							messageType: "text", // 消息类型：text/image/file/voice/video
							targetTerminal: targetTerminal, // 目标终端类型
							senderTerminal: TerminalType.CLOUD_PC, // 发送者终端类型：云电脑
						},
					)

					this.outputChannel.appendLine(
						`[CloudPCNotification] Successfully sent notification to terminal ${targetTerminal}: ${JSON.stringify(response)}`,
					)
				} catch (error) {
					// Don't fail the whole process if one notification fails
					this.outputChannel.appendLine(
						`[CloudPCNotification] Failed to send notification to terminal ${targetTerminal}: ${error}`,
					)
				}
			}

			// Mark notification as sent
			this.notificationSent = true
			this.outputChannel.appendLine("[CloudPCNotification] Cloud PC startup notifications completed")
		} catch (error) {
			this.outputChannel.appendLine(
				`[CloudPCNotification] Error sending startup notification: ${error instanceof Error ? error.message : String(error)}`,
			)
		}
	}

	/**
	 * Reset notification state (for testing or re-initialization)
	 */
	reset(): void {
		this.notificationSent = false
	}
}
