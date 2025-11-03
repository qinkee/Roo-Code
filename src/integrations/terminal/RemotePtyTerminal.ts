import * as vscode from "vscode"
import * as child_process from "child_process"
import * as os from "os"

/**
 * RemotePtyTerminal - 使用 VSCode Pseudoterminal API 实现的远程交互式终端
 *
 * 功能：
 * 1. 实时捕获命令输出（包括交互式命令）
 * 2. 支持用户输入（通过 IM 远程发送）
 * 3. 完整的 ANSI 控制序列支持
 * 4. 自动清理进程
 */
export class RemotePtyTerminal implements vscode.Pseudoterminal {
	private writeEmitter = new vscode.EventEmitter<string>()
	private closeEmitter = new vscode.EventEmitter<number | void>()

	// Pseudoterminal 必需的事件
	onDidWrite: vscode.Event<string> = this.writeEmitter.event
	onDidClose?: vscode.Event<number | void> = this.closeEmitter.event

	private childProcess: child_process.ChildProcess | null = null
	private command: string = ""
	private cwd: string = ""
	private streamId: string = ""

	// 输出回调（用于转发到 IM）
	private onOutputCallback?: (output: string) => void
	private onCloseCallback?: (exitCode: number | null) => void

	constructor(
		command: string,
		cwd: string,
		streamId: string,
		onOutput?: (output: string) => void,
		onClose?: (exitCode: number | null) => void,
	) {
		this.command = command
		this.cwd = cwd || process.cwd()
		this.streamId = streamId
		this.onOutputCallback = onOutput
		this.onCloseCallback = onClose
	}

	/**
	 * 打开终端（自动启动命令）
	 */
	open(initialDimensions: vscode.TerminalDimensions | undefined): void {
		// 执行命令
		this.executeCommand()
	}

	/**
	 * 执行命令
	 */
	private executeCommand(): void {
		try {
			// 获取当前 shell
			const shell = process.env.SHELL || (os.platform() === "win32" ? "cmd.exe" : "/bin/bash")

			// 使用 spawn 启动进程，保持 PTY 特性
			this.childProcess = child_process.spawn(shell, [], {
				cwd: this.cwd,
				env: {
					...process.env,
					TERM: "xterm-256color", // 支持颜色
					FORCE_COLOR: "1", // 强制颜色输出
				},
				shell: false, // 不需要再包裹一层 shell
				stdio: ["pipe", "pipe", "pipe"], // 使用管道捕获输入输出
			})

			// 启动后发送命令
			if (this.childProcess.stdin) {
				this.childProcess.stdin.write(this.command + "\n")
			}

			// 捕获 stdout（实时输出）
			if (this.childProcess.stdout) {
				this.childProcess.stdout.on("data", (data: Buffer) => {
					const output = data.toString()

					// 1. 本地显示（VSCode 终端）
					this.writeEmitter.fire(output)

					// 2. 转发到 IM
					if (this.onOutputCallback) {
						this.onOutputCallback(output)
					}
				})
			}

			// 捕获 stderr（错误输出）
			if (this.childProcess.stderr) {
				this.childProcess.stderr.on("data", (data: Buffer) => {
					const output = data.toString()

					// 用红色显示错误
					const coloredOutput = `\x1b[31m${output}\x1b[0m`

					// 1. 本地显示
					this.writeEmitter.fire(coloredOutput)

					// 2. 转发到 IM
					if (this.onOutputCallback) {
						this.onOutputCallback(output)
					}
				})
			}

			// 监听进程退出
			this.childProcess.on("exit", (code, signal) => {
				const exitCode = code ?? (signal ? 128 : 0)

				// 显示退出信息
				const exitMessage = signal
					? `\n[Process killed by signal ${signal}]\n`
					: `\n[Process exited with code ${exitCode}]\n`

				this.writeEmitter.fire(exitMessage)

				// 触发关闭回调
				if (this.onCloseCallback) {
					this.onCloseCallback(exitCode)
				}

				// 关闭终端
				this.closeEmitter.fire(exitCode)
			})

			// 监听错误
			this.childProcess.on("error", (err) => {
				const errorMessage = `\n[Error: ${err.message}]\n`
				this.writeEmitter.fire(errorMessage)

				if (this.onOutputCallback) {
					this.onOutputCallback(errorMessage)
				}

				this.closeEmitter.fire(1)
			})
		} catch (error: any) {
			const errorMessage = `Failed to execute command: ${error.message}\n`
			this.writeEmitter.fire(errorMessage)
			this.closeEmitter.fire(1)
		}
	}

	/**
	 * 关闭终端
	 */
	close(): void {
		if (this.childProcess && !this.childProcess.killed) {
			// 尝试优雅退出
			this.childProcess.kill("SIGTERM")

			// 2秒后强制杀死
			setTimeout(() => {
				if (this.childProcess && !this.childProcess.killed) {
					this.childProcess.kill("SIGKILL")
				}
			}, 2000)
		}
	}

	/**
	 * 处理用户输入（从 IM 发送）
	 */
	handleInput(data: string): void {
		if (this.childProcess && this.childProcess.stdin && !this.childProcess.stdin.destroyed) {
			this.childProcess.stdin.write(data)
		}
	}

	/**
	 * 发送 Ctrl+C 信号
	 */
	sendInterrupt(): void {
		if (this.childProcess && !this.childProcess.killed) {
			this.childProcess.kill("SIGINT")
		}
	}
}
