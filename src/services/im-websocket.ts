import * as vscode from "vscode"
import { IMTokenHelper } from "./im-token-helper"

// 在Node.js环境中使用ws库
const WebSocket = require("ws")

export class RooCodeIMConnection {
	private ws: any = null // WebSocket instance
	private accessToken: string = ""
	private isConnected: boolean = false
	private reconnectTimer: NodeJS.Timeout | null = null
	private heartbeatTimer: NodeJS.Timeout | null = null
	private heartbeatTimeoutTimer: NodeJS.Timeout | null = null
	private sequenceMap: Map<string, number> = new Map()
	private messageHandlers: Map<number, (data: any) => void> = new Map()

	constructor(
		private context: vscode.ExtensionContext,
		private outputChannel: vscode.OutputChannel,
		private wsUrl: string = "wss://aiim.ws.service.thinkgs.cn/im",
	) {
		this.setupMessageHandlers()
	}

	/**
	 * 建立WebSocket连接
	 */
	async connect(): Promise<void> {
		if (this.isConnected) {
			return
		}

		// 获取访问令牌
		this.accessToken = await this.getAccessToken()
		if (!this.accessToken) {
			throw new Error("No access token available")
		}

		return new Promise((resolve, reject) => {
			try {
				this.ws = new WebSocket(this.wsUrl)
			} catch (error: any) {
				this.outputChannel.appendLine(`[RooCode IM] ❌ Create failed: ${error?.message || error}`)
				reject(error)
				return
			}

			this.ws.onopen = () => {
				this.login()
				resolve()
			}

			this.ws.onmessage = (event: MessageEvent) => {
				this.handleMessage(event.data.toString())
			}

			this.ws.onerror = (error: any) => {
				this.outputChannel.appendLine(`[RooCode IM] ❌ Error: ${error?.message || error}`)
				reject(error)
			}

			this.ws.onclose = (event: any) => {
				if (!event.wasClean) {
					this.outputChannel.appendLine(`[RooCode IM] ❌ Disconnected: ${event.code}`)
				}
				this.isConnected = false
				this.stopHeartbeat()
				this.scheduleReconnect()
			}
		})
	}

	/**
	 * 登录到IM服务器
	 */
	private login(): void {
		const loginData = {
			cmd: 0, // LOGIN
			data: {
				accessToken: this.accessToken,
			},
		}

		this.send(loginData)
	}

	/**
	 * 处理接收到的消息
	 */
	private handleMessage(rawData: string): void {
		try {
			const message = JSON.parse(rawData)

			// 处理登录成功
			if (message.cmd === 0) {
				this.isConnected = true
				this.startHeartbeat()
				this.outputChannel.appendLine("[RooCode IM] Connected")
				return
			}

			// 处理心跳响应
			if (message.cmd === 1) {
				this.resetHeartbeat()
				return
			}

			// 处理LLM消息
			const handler = this.messageHandlers.get(message.cmd)
			if (handler) {
				handler(message.data)
			} else {
				this.outputChannel.appendLine(`[RooCode IM] ❌ No handler for cmd=${message.cmd}`)
			}
		} catch (error) {
			this.outputChannel.appendLine(`[RooCode IM] ❌ Message error: ${error}`)
		}
	}

	/**
	 * 发送LLM流式请求
	 */
	public sendLLMRequest(question: string, recvId?: number, targetTerminal?: number, chatType?: string): string {
		const streamId = this.generateStreamId()
		this.send({
			cmd: 10,
			data: {
				streamId,
				question,
				recvId,
				targetTerminal,
				chatType,
				timestamp: Date.now(),
			},
		})
		this.sequenceMap.set(streamId, 0)
		return streamId
	}

	/**
	 * 发送LLM流式数据块
	 */
	public sendLLMChunk(
		streamId: string,
		chunk: string,
		recvId?: number,
		targetTerminal?: number,
		chatType?: string,
		sendId?: number,
		senderTerminal?: number,
	): void {
		this.send({
			cmd: 11,
			data: {
				streamId,
				chunk,
				sequence: this.getNextSequence(streamId),
				sendId,
				recvId,
				senderTerminal,
				targetTerminal,
				chatType,
				timestamp: Date.now(),
			},
		})
	}

	/**
	 * 发送LLM流结束标记
	 */
	public sendLLMEnd(
		streamId: string,
		recvId?: number,
		targetTerminal?: number,
		chatType?: string,
		taskInfo?: { name: string; id?: string },
		sendId?: number,
		senderTerminal?: number,
		conversationId?: string,
	): void {
		this.send({
			cmd: 12,
			data: {
				streamId,
				sendId,
				recvId,
				senderTerminal,
				targetTerminal,
				chatType,
				taskName: taskInfo?.name,
				taskId: taskInfo?.id,
				conversationId,
				timestamp: Date.now(),
			},
		})
		this.sequenceMap.delete(streamId)
	}

	/**
	 * 发送LLM错误
	 */
	public sendLLMError(
		streamId: string,
		error: string,
		recvId?: number,
		targetTerminal?: number,
		chatType?: string,
		sendId?: number,
		senderTerminal?: number,
	): void {
		this.send({
			cmd: 13,
			data: {
				streamId,
				error,
				sendId,
				recvId,
				senderTerminal,
				targetTerminal,
				chatType,
				timestamp: Date.now(),
			},
		})
		this.sequenceMap.delete(streamId)
	}

	/**
	 * 注册消息处理器
	 */
	public onLLMStreamRequest(handler: (data: any) => void): void {
		this.messageHandlers.set(10, handler)
	}

	public onLLMChunk(handler: (data: any) => void): void {
		this.messageHandlers.set(11, handler)
	}

	public onLLMEnd(handler: (data: any) => void): void {
		this.messageHandlers.set(12, handler)
	}

	public onLLMError(handler: (data: any) => void): void {
		this.messageHandlers.set(13, handler)
	}

	/**
	 * 发送消息
	 */
	private send(data: any): void {
		if (this.ws?.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data))
		} else {
			this.outputChannel.appendLine("[RooCode IM] ❌ WebSocket not ready")
		}
	}

	/**
	 * 心跳机制
	 */
	private startHeartbeat(): void {
		this.resetHeartbeat()
	}

	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearTimeout(this.heartbeatTimer)
			this.heartbeatTimer = null
		}
		if (this.heartbeatTimeoutTimer) {
			clearTimeout(this.heartbeatTimeoutTimer)
			this.heartbeatTimeoutTimer = null
		}
	}

	private resetHeartbeat(): void {
		// 清除现有定时器
		if (this.heartbeatTimer) {
			clearTimeout(this.heartbeatTimer)
		}
		if (this.heartbeatTimeoutTimer) {
			clearTimeout(this.heartbeatTimeoutTimer)
			this.heartbeatTimeoutTimer = null
		}

		// 设置新的心跳定时器（5秒后发送心跳）
		this.heartbeatTimer = setTimeout(() => {
			if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
				this.send({ cmd: 1, data: {} })

				// 设置心跳超时定时器（如果10秒内没有收到响应，认为连接断开）
				this.heartbeatTimeoutTimer = setTimeout(() => {
					this.outputChannel.appendLine("[RooCode IM] ❌ Heartbeat timeout")
					this.ws?.close()
				}, 10000)
			}
		}, 5000)
	}

	/**
	 * 重连机制
	 */
	private scheduleReconnect(): void {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
		}

		// 使用15秒延迟，避免过于频繁的重连
		this.reconnectTimer = setTimeout(() => {
			this.connect().catch((err) => this.outputChannel.appendLine(`[RooCode IM] ❌ Reconnect failed: ${err}`))
		}, 15000)
	}

	/**
	 * 获取访问令牌
	 */
	private async getAccessToken(): Promise<string> {
		try {
			const tokenHelper = IMTokenHelper.getInstance(this.context, this.outputChannel)
			return await tokenHelper.getAccessToken()
		} catch (error) {
			this.outputChannel.appendLine(`[RooCode IM] ❌ Token failed: ${error}`)
			throw error
		}
	}

	/**
	 * 工具方法
	 */
	private generateStreamId(): string {
		return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
	}

	private getNextSequence(streamId: string): number {
		const current = this.sequenceMap.get(streamId) || 0
		const next = current + 1
		this.sequenceMap.set(streamId, next)
		return next
	}

	private setupMessageHandlers(): void {
		// 默认处理器
		this.onLLMChunk((data) => {
			console.log("Received LLM chunk:", data)
		})

		this.onLLMEnd((data) => {
			console.log("LLM stream ended:", data)
		})

		this.onLLMError((data) => {
			console.error("LLM stream error:", data)
		})
	}

	/**
	 * 断开连接
	 * @param preventReconnect 是否阻止自动重连（用户登出时应设为true）
	 */
	public disconnect(preventReconnect: boolean = false): void {
		// 如果已经断开，静默返回
		if (!this.isConnected && !this.ws && !this.reconnectTimer) {
			return
		}

		this.outputChannel.appendLine(`[RooCode IM] 🔌 Disconnecting... Current state: isConnected=${this.isConnected}, hasWS=${!!this.ws}, preventReconnect=${preventReconnect}`)

		// 清除重连计时器
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer)
			this.reconnectTimer = null
			this.outputChannel.appendLine(`[RooCode IM] ⏹️ Cleared reconnect timer`)
		}

		// 停止心跳
		this.stopHeartbeat()
		this.outputChannel.appendLine(`[RooCode IM] 💓 Stopped heartbeat`)

		// 关闭WebSocket连接
		if (this.ws) {
			// 如果需要阻止重连，移除onclose事件处理器以避免触发自动重连
			if (preventReconnect) {
				this.ws.onclose = null
				this.outputChannel.appendLine(`[RooCode IM] 🚫 Disabled auto-reconnect`)
			}
			this.ws.close()
			this.ws = null
			this.outputChannel.appendLine(`[RooCode IM] ✅ WebSocket closed`)
		} else {
			this.outputChannel.appendLine(`[RooCode IM] ℹ️ No WebSocket to close`)
		}

		this.isConnected = false
		this.outputChannel.appendLine(`[RooCode IM] ✅ Disconnect completed`)
	}
}
