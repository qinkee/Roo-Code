import { RooCodeIMConnection } from "./im-websocket"
import * as vscode from "vscode"
import { TerminalRegistry } from "../integrations/terminal/TerminalRegistry"
import { RooTerminal } from "../integrations/terminal/types"
import { RemotePtyTerminal } from "../integrations/terminal/RemotePtyTerminal"

interface TerminalMessage {
	type: "terminal_input" | "terminal_resize" | "say_hi"
	content: string
	action?: "execute" | "input" | "abort" | "resize"
	terminalId?: string
	cwd?: string
	cols?: number
	rows?: number
	timestamp: number
}

export class LLMStreamService {
	public imConnection: RooCodeIMConnection
	private isInitialized: boolean = false
	private initializePromise: Promise<void> | null = null
	public handlersRegistered: boolean = false
	private terminalSessions: Map<string, RooTerminal> = new Map()
	// 🔥 远程 PTY 终端会话（支持实时交互）
	private remotePtyTerminals: Map<string, { pty: RemotePtyTerminal; terminal: vscode.Terminal }> = new Map()

	constructor(
		private context: vscode.ExtensionContext,
		private outputChannel: vscode.OutputChannel,
	) {
		this.imConnection = new RooCodeIMConnection(context, outputChannel)
		this.setupTerminalHandlers()
	}

	/**
	 * 重置连接状态（用户登出/切换时调用）
	 */
	public resetConnectionState(): void {
		this.isInitialized = false
		this.initializePromise = null
		this.outputChannel.appendLine("[LLMStreamService] Connection state reset")
	}

	/**
	 * 标记处理器已注册（必须在连接前调用）
	 */
	public markHandlersRegistered(): void {
		this.handlersRegistered = true
	}

	/**
	 * 手动初始化服务（确保tokenKey已设置）
	 */
	public async initialize(): Promise<void> {
		// 🔥 关键安全检查：必须先注册处理器才能连接
		if (!this.handlersRegistered) {
			const error =
				"CRITICAL: Handlers must be registered before connecting! Call markHandlersRegistered() first."
			this.outputChannel.appendLine(`[LLMStreamService] ❌ ${error}`)
			throw new Error(error)
		}

		// 防止重复初始化
		if (this.isInitialized) {
			return
		}

		// 如果正在初始化，等待完成
		if (this.initializePromise) {
			return this.initializePromise
		}

		this.initializePromise = this.doInitialize()
		return this.initializePromise
	}

	private async doInitialize(): Promise<void> {
		try {
			await this.imConnection.connect()
			this.isInitialized = true
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error)
			const errorStack = error instanceof Error ? error.stack : ""
			this.outputChannel.appendLine(`[LLMStreamService] ❌ Init failed: ${errorMessage}`)
			if (errorStack) {
				this.outputChannel.appendLine(`[LLMStreamService] Stack: ${errorStack}`)
			}
			this.initializePromise = null
			throw error
		}
	}

	/**
	 * 检查是否已初始化
	 */
	public isConnected(): boolean {
		return this.isInitialized
	}

	/**
	 * 发送问题到LLM并流式传输响应
	 */
	async streamLLMResponse(
		question: string,
		recvId?: number,
		targetTerminal?: number,
		chatType?: string,
	): Promise<void> {
		if (!this.isInitialized) {
			await this.initialize()
		}

		const streamId = this.imConnection.sendLLMRequest(question, recvId, targetTerminal, chatType)

		try {
			const response = await this.callLLMAPI(question)
			for (const chunk of this.simulateStream(response)) {
				this.imConnection.sendLLMChunk(streamId, chunk, recvId, targetTerminal, chatType)
				await this.delay(50)
			}
			this.imConnection.sendLLMEnd(streamId, recvId, targetTerminal, chatType)
		} catch (error: any) {
			this.imConnection.sendLLMError(streamId, error.message, recvId, targetTerminal, chatType)
		}
	}

	/**
	 * 模拟LLM API调用
	 */
	private async callLLMAPI(question: string): Promise<string> {
		// 实际实现中，这里应该调用真实的LLM API
		return `This is a simulated response to: ${question}`
	}

	/**
	 * 模拟流式输出
	 */
	private *simulateStream(text: string): Generator<string> {
		const words = text.split(" ")
		for (const word of words) {
			yield word + " "
		}
	}

	private delay(ms: number): Promise<void> {
		return new Promise((resolve) => setTimeout(resolve, ms))
	}

	/**
	 * 设置 Terminal 消息处理器
	 * 注意：不在这里注册 onLLMStreamRequest，避免覆盖 extension.ts 中的主处理器
	 * terminal 消息处理已集成到 extension.ts 的主处理器中
	 */
	private setupTerminalHandlers(): void {
		// 不再在这里注册处理器，避免覆盖 extension.ts 中注册的处理器
		// terminal 消息处理逻辑已经移到 extension.ts 的统一处理器中
	}

	/**
	 * 公共方法：处理 terminal 消息（由 extension.ts 调用）
	 */
	public async handleTerminalMessage(data: any): Promise<void> {
		try {
			const message = JSON.parse(data.question) as TerminalMessage

			if (message.type === "terminal_input") {
				// 🔥 检查是否为 abort action
				if (message.action === "abort") {
					await this.handleTerminalAbort(data.streamId, data)
				} else {
					await this.handleTerminalCommand(data.streamId, message, data)
				}
			}
		} catch (e) {
			this.outputChannel.appendLine(`[LLMStreamService] Failed to handle terminal message: ${e}`)
		}
	}

	/**
	 * 处理 Terminal 命令执行 - 使用 RemotePtyTerminal 实现真正的实时交互
	 */
	private async handleTerminalCommand(streamId: string, message: TerminalMessage, requestData: any): Promise<void> {
		try {
			const cwd = message.cwd || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""

			// 🔥 如果是 input action，发送输入到已存在的 PTY 终端
			if (message.action === "input") {
				const session = this.remotePtyTerminals.get(streamId)
				if (session) {
					session.pty.handleInput(message.content)
					this.outputChannel.appendLine(`[RemotePty] Sent input: ${message.content}`)
				} else {
					this.outputChannel.appendLine(`[RemotePty] No session found for streamId: ${streamId}`)
				}
				return
			}

			// 🔥 创建新的 RemotePtyTerminal 会话
			const pty = new RemotePtyTerminal(
				message.content,
				cwd,
				streamId,
				// 输出回调 - 转发到 IM（包装为 JSON 格式）
				(output: string) => {
					const formattedOutput = JSON.stringify({
						type: "command_output",
						content: output,
						partial: true,
						timestamp: Date.now(),
					})

					this.imConnection.sendLLMChunk(
						streamId,
						formattedOutput,
						requestData.recvId,
						requestData.targetTerminal,
						requestData.chatType,
						requestData.sendId,
						requestData.senderTerminal,
					)
				},
				// 关闭回调 - 发送完成信号
				(exitCode: number | null) => {
					this.imConnection.sendLLMEnd(
						streamId,
						requestData.recvId,
						requestData.targetTerminal,
						requestData.chatType,
						undefined,
						requestData.sendId,
						requestData.senderTerminal,
					)

					// 清理会话
					setTimeout(() => {
						this.remotePtyTerminals.delete(streamId)
					}, 5000)
				},
			)

			// 创建 VSCode 终端并显示
			const terminal = vscode.window.createTerminal({
				name: `Remote: ${message.content.substring(0, 20)}...`,
				pty: pty,
			})

			terminal.show(true)

			// 保存会话
			this.remotePtyTerminals.set(streamId, { pty, terminal })

			this.outputChannel.appendLine(`[RemotePty] Created session for: ${message.content}`)
		} catch (error: any) {
			this.outputChannel.appendLine(`[RemotePty] Error: ${error.message}`)

			// 发送错误到 IM
			this.imConnection.sendLLMError(
				streamId,
				error.message,
				requestData.recvId,
				requestData.targetTerminal,
				requestData.chatType,
				requestData.sendId,
				requestData.senderTerminal,
			)
		}
	}

	/**
	 * 🔥 更新 handleTerminalAbort 以支持 RemotePtyTerminal
	 */
	private async handleTerminalAbort(streamId: string, requestData: any): Promise<void> {
		try {
			this.outputChannel.appendLine(`[Terminal] Aborting command for streamId: ${streamId}`)

			// 查找 RemotePtyTerminal 会话
			const session = this.remotePtyTerminals.get(streamId)

			if (session) {
				// 发送 Ctrl+C
				session.pty.sendInterrupt()
				this.outputChannel.appendLine(`[RemotePty] Sent SIGINT to terminal ${streamId}`)

				// 发送确认（格式化为 JSON）
				const abortMessage = JSON.stringify({
					type: "command_output",
					content: "\n^C (命令已中止)\n",
					partial: false,
					timestamp: Date.now(),
				})

				this.imConnection.sendLLMChunk(
					streamId,
					abortMessage,
					requestData.recvId,
					requestData.targetTerminal,
					requestData.chatType,
					requestData.sendId,
					requestData.senderTerminal,
				)

				return
			}

			// 回退：查找旧的终端会话
			const terminal = this.terminalSessions.get(streamId)
			if (terminal && "sendText" in terminal && typeof terminal.sendText === "function") {
				terminal.sendText("\x03")
				this.outputChannel.appendLine(`[Terminal] Sent Ctrl+C to legacy terminal ${streamId}`)

				const legacyAbortMessage = JSON.stringify({
					type: "command_output",
					content: "\n^C (命令已中止)\n",
					partial: false,
					timestamp: Date.now(),
				})

				this.imConnection.sendLLMChunk(
					streamId,
					legacyAbortMessage,
					requestData.recvId,
					requestData.targetTerminal,
					requestData.chatType,
					requestData.sendId,
					requestData.senderTerminal,
				)
			} else {
				this.outputChannel.appendLine(`[Terminal] No terminal session found for streamId: ${streamId}`)
				this.imConnection.sendLLMError(
					streamId,
					"Terminal session not found",
					requestData.recvId,
					requestData.targetTerminal,
					requestData.chatType,
				)
			}
		} catch (error: any) {
			this.outputChannel.appendLine(`[Terminal] Failed to abort command: ${error.message}`)
			this.imConnection.sendLLMError(
				streamId,
				error.message,
				requestData.recvId,
				requestData.targetTerminal,
				requestData.chatType,
			)
		}
	}
}
