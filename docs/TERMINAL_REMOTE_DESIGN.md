# Terminal 远程交互设计方案

> 让 box-im 智能体对话界面支持远程 Terminal 交互功能

**版本：** v1.0
**日期：** 2025-10-30
**作者：** Claude Code

---

## 📋 目录

- [一、需求背景](#一需求背景)
- [二、设计目标](#二设计目标)
- [三、架构设计](#三架构设计)
- [四、消息协议](#四消息协议)
- [五、技术实现](#五技术实现)
- [六、实施步骤](#六实施步骤)
- [七、测试方案](#七测试方案)
- [八、FAQ](#八faq)

---

## 一、需求背景

### 1.1 当前痛点

在 box-im 智能体对话中，当智能体执行 bash 命令时：

- ❌ 用户无法看到完整的终端输出（只显示压缩后的摘要）
- ❌ 用户无法与终端进行实时交互
- ❌ 无法查看带有 ANSI 颜色的格式化输出
- ❌ 长输出被截断，影响问题排查

### 1.2 设计目标

- ✅ 在对话界面中，点击"展开完整终端"即可查看完整输出
- ✅ 支持实时流式输出，类似真实终端体验
- ✅ 支持 ANSI 转义序列（颜色、格式）
- ✅ 复用现有 IM WebSocket 和 A2A 协议，零额外基础设施
- ✅ 最小化代码改动，KISS 原则

---

## 二、设计目标

### 2.1 核心原则

**KISS (Keep It Simple, Stupid)**

1. **零额外基础设施**：完全基于现有 IM WebSocket + A2A 协议
2. **最小化改动**：
    - Roo-Code：只添加消息处理器
    - box-im-web：只添加 UI 组件
    - box-im-server：完全不需要改动
3. **复用现有能力**：利用 Roo-Code 已有的 TerminalRegistry 和流式输出机制

### 2.2 用户体验

```
对话流程（默认）：
🤖 Agent: 我来帮你查看文件列表
┌─────────────────────────────┐
│ 🔧 Tool Use: execute_command│
│ $ ls -la                    │
│ Output (前10行+后10行):      │
│ ...                         │
│ [📺 展开完整终端] [✅ Exit 0]│ ← 新增按钮
└─────────────────────────────┘

点击后弹出：
┌─────────────────────────────┐
│ 完整终端 (xterm.js)    [×]  │
│ ┌─────────────────────────┐ │
│ │ $ ls -la                │ │
│ │ [完整输出，带ANSI颜色]   │ │
│ │ $ █                     │ │ ← 可选：允许手动输入
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

---

## 三、架构设计

### 3.1 系统架构图

```
┌─────────────────────┐
│   box-im-web        │
│  (智能体对话界面)    │
│                     │
│  ┌───────────────┐  │  1. 点击"展开终端"
│  │ToolUse Card   │  │     打开弹窗
│  │ [展开终端]    │──┼─┐
│  └───────────────┘  │ │
│                     │ │
│  ┌───────────────┐  │ │  2. 弹窗加载历史
│  │FullTerminal   │◀─┼─┘     显示完整输出
│  │ Dialog        │  │
│  │ (xterm.js)    │  │  3. 可选：手动输入命令
│  └───────────────┘  │     通过 IM WS 发送
└─────────────────────┘
         ▲
         │ 4. 实时接收输出
         │ (cmd: 11)
         │
┌─────────────────────┐        ┌─────────────────┐
│   Roo-Code          │        │  IM WebSocket   │
│  (VSCode扩展)       │◀──────│    Server       │
│                     │        └─────────────────┘
│  ┌───────────────┐  │
│  │ LLMStream     │  │ 监听 cmd:10
│  │ Service       │  │ 识别 type=terminal_input
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │ 调用现有能力
│  │ Terminal      │  │ getOrCreateTerminal()
│  │ Registry      │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │ 执行命令
│  │ Terminal.ts   │  │ runCommand(cmd, callbacks)
│  │ (vscode)      │  │ - onLine: 逐行输出
│  └───────────────┘  │ - onCompleted: 完成
└─────────────────────┘
         │
         ▼
    ┌─────────┐
    │  Shell  │
    │ (bash)  │
    └─────────┘
```

### 3.2 关键发现：Roo-Code 已有完整的终端机制！

**现有能力：**

```typescript
// 1. 终端会话管理
TerminalRegistry.getOrCreateTerminal(cwd, customCwd, taskId, provider)
  → 自动复用相同 cwd 的终端
  → 支持两种模式：'vscode'（可见）/ 'execa'（后台）

// 2. 流式输出回调
terminal.runCommand(command, {
  onLine: (line, process) => {
    // ⭐ 逐行实时输出，正是我们需要的！
    accumulatedOutput += line;
  },
  onCompleted: (output) => {
    // ⭐ 命令执行完成
  },
  onShellExecutionComplete: (details) => {
    // ⭐ 包含退出码 exitCode
  }
});

// 3. 进程控制
process.abort()     // 中止命令
process.continue()  // 后台运行
```

**结论：我们只需要把这些输出通过 IM WebSocket 转发出去！**

---

## 四、消息协议

### 4.1 协议设计（复用 A2A 协议）

利用现有的 **cmd: 10/11/12** 消息类型，通过 `question` 字段的 JSON 格式区分消息类型。

#### 4.1.1 Terminal 消息类型定义

```typescript
interface TerminalMessage {
	type: "terminal_input" | "terminal_resize" | "say_hi"
	content: string // 命令内容或调整参数
	action?: "execute" | "input" | "abort" | "resize"
	terminalId?: string // 终端会话ID（可选）
	cwd?: string // 工作目录
	cols?: number // 终端列数
	rows?: number // 终端行数
	timestamp: number
}
```

#### 4.1.2 消息流程

**阶段1：用户输入命令（box-im → Roo-Code）**

```javascript
// 智能体执行命令或用户手动输入
{
  cmd: 10,  // LLM_STREAM_REQUEST
  data: {
    streamId: "stream_1234567890",
    question: JSON.stringify({
      type: 'terminal_input',
      action: 'execute',
      content: 'ls -la',
      cwd: '/Users/david/Projects',
      timestamp: Date.now()
    }),
    sendId: 1661,        // IM用户ID
    recvId: 166,         // Roo-Code用户ID
    senderTerminal: 0,   // Web端
    targetTerminal: 6,   // Roo-Code
    chatType: 'PRIVATE'
  }
}
```

**阶段2：流式返回输出（Roo-Code → box-im）**

```javascript
// Terminal 逐行输出
{
  cmd: 11,  // LLM_STREAM_CHUNK
  data: {
    streamId: "stream_1234567890",
    chunk: "total 48\ndrwxr-xr-x  12 user  staff   384 Oct 30 10:00 .\n",
    sequence: 1,
    sendId: 166,
    recvId: 1661,
    senderTerminal: 6,
    targetTerminal: 0
  }
}
```

**阶段3：命令执行完成（Roo-Code → box-im）**

```javascript
// 执行完成
{
  cmd: 12,  // LLM_STREAM_END
  data: {
    streamId: "stream_1234567890",
    sendId: 166,
    recvId: 1661,
    exitCode: 0,         // 新增字段：命令退出码
    executionTime: 125   // 新增字段：执行时长(ms)
  }
}
```

**阶段4（可选）：用户手动输入**

```javascript
// 用户在展开的终端中手动输入
{
  cmd: 10,  // LLM_STREAM_REQUEST
  data: {
    streamId: "stream_1234567890",  // 复用同一个 streamId
    question: JSON.stringify({
      type: 'terminal_input',
      action: 'input',              // action 改为 'input'
      content: 'pwd\n',             // 带换行符
      timestamp: Date.now()
    }),
    // ... 其他字段
  }
}
```

---

## 五、技术实现

### 5.1 Roo-Code 端实现

#### 5.1.1 核心代码

**文件：** `/src/services/llm-stream-service.ts`

```typescript
import { RooCodeIMConnection } from "./im-websocket"
import * as vscode from "vscode"
import { TerminalRegistry } from "../integrations/terminal/TerminalRegistry"

export class LLMStreamService {
	// ... 现有代码

	private terminalSessions: Map<string, any> = new Map() // streamId -> terminal instance

	constructor(
		private context: vscode.ExtensionContext,
		private outputChannel: vscode.OutputChannel,
	) {
		this.imConnection = new RooCodeIMConnection(context, outputChannel)
		this.setupTerminalHandlers() // ⭐ 新增
	}

	/**
	 * 🔥 新增：设置 Terminal 消息处理器
	 */
	private setupTerminalHandlers(): void {
		// 监听 cmd:10 (LLM_STREAM_REQUEST)
		this.imConnection.onLLMStreamRequest(async (data) => {
			try {
				const message = JSON.parse(data.question) as TerminalMessage

				// 识别 terminal 消息类型
				if (message.type === "terminal_input") {
					await this.handleTerminalCommand(data.streamId, message, data)
				}
			} catch (e) {
				// 不是 terminal 命令，忽略（可能是普通 LLM 请求）
			}
		})
	}

	/**
	 * 🔥 新增：处理 Terminal 命令执行
	 */
	private async handleTerminalCommand(streamId: string, message: TerminalMessage, requestData: any): Promise<void> {
		try {
			const cwd = message.cwd || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || ""

			// 1. 获取或创建终端（自动复用会话！）
			let terminal = this.terminalSessions.get(streamId)

			if (!terminal) {
				terminal = await TerminalRegistry.getOrCreateTerminal(
					cwd,
					false, // customCwd
					streamId, // taskId
					"vscode", // provider: 使用可见终端
				)
				this.terminalSessions.set(streamId, terminal)

				// 显示终端
				if (terminal.terminal) {
					terminal.terminal.show(true)
				}
			}

			// 2. 执行命令，设置流式输出回调
			const process = terminal.runCommand(message.content, {
				onLine: (line, proc) => {
					// ⭐ 实时转发输出到 IM
					this.imConnection.sendLLMChunk(
						streamId,
						line,
						requestData.recvId, // 交换发送和接收
						requestData.targetTerminal,
						requestData.chatType,
						requestData.sendId,
						requestData.senderTerminal,
					)
				},

				onCompleted: (output) => {
					// ⭐ 命令完成
					this.outputChannel.appendLine(`[Terminal] Command completed: ${message.content}`)
				},

				onShellExecutionComplete: (details) => {
					// ⭐ 发送完成信号（包含退出码）
					this.imConnection.sendLLMEnd(
						streamId,
						requestData.recvId,
						requestData.targetTerminal,
						requestData.chatType,
						undefined, // taskInfo
						requestData.sendId,
						requestData.senderTerminal,
					)

					this.outputChannel.appendLine(
						`[Terminal] Exit code: ${details.exitCode}, Success: ${details.isSuccess}`,
					)

					// 清理会话（可选：保留一段时间）
					setTimeout(() => {
						this.terminalSessions.delete(streamId)
					}, 300000) // 5分钟后清理
				},

				onShellExecutionStarted: (pid) => {
					this.outputChannel.appendLine(`[Terminal] Started: PID=${pid}`)
				},

				onNoShellIntegration: (msg) => {
					// Shell integration 不可用，发送错误
					this.imConnection.sendLLMError(
						streamId,
						`Shell integration not available: ${msg}`,
						requestData.recvId,
						requestData.targetTerminal,
						requestData.chatType,
						requestData.sendId,
						requestData.senderTerminal,
					)
				},
			})

			// 3. 等待命令执行完成
			await process
		} catch (error: any) {
			this.outputChannel.appendLine(`[Terminal] Error: ${error.message}`)

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
}
```

#### 5.1.2 注册 Handler

**文件：** `/src/extension.ts`

```typescript
// 在扩展激活时标记 handlers 已注册
export async function activate(context: vscode.ExtensionContext) {
	// ... 现有代码

	// 初始化 LLM Stream Service
	const outputChannel = vscode.window.createOutputChannel("Roo-Code IM")
	const llmStreamService = new LLMStreamService(context, outputChannel)

	// ⭐ 标记 handlers 已注册（必须在连接前调用）
	llmStreamService.markHandlersRegistered()

	// 存储到 global，供 VoidBridge 访问
	;(global as any).llmStreamService = llmStreamService

	// ... 现有代码
}
```

---

### 5.2 box-im-web 端实现

#### 5.2.1 安装依赖

```bash
cd /Users/david/ThinkgsProjects/box-im/im-web
npm install xterm xterm-addon-fit
```

#### 5.2.2 创建完整终端弹窗组件

**文件：** `/src/components/agent/FullTerminalDialog.vue`

```vue
<template>
	<el-dialog
		title="完整终端"
		:visible.sync="dialogVisible"
		width="80%"
		:before-close="handleClose"
		custom-class="full-terminal-dialog"
		@opened="onDialogOpened"
		@closed="onDialogClosed">
		<div class="terminal-toolbar">
			<span class="terminal-info">
				<i class="el-icon-folder"></i>
				{{ currentWorkingDir }}
			</span>
			<el-button-group size="mini">
				<el-button @click="clearTerminal"> <i class="el-icon-delete"></i> 清屏 </el-button>
				<el-button @click="copyOutput"> <i class="el-icon-document-copy"></i> 复制 </el-button>
			</el-button-group>
		</div>

		<!-- xterm.js 容器 -->
		<div ref="terminalContainer" class="terminal-container"></div>

		<!-- 可选：手动输入命令 -->
		<div class="terminal-input-area" v-if="allowManualInput">
			<el-input v-model="manualCommand" placeholder="输入命令并按回车..." @keyup.enter.native="sendManualCommand">
				<template slot="prepend">$</template>
			</el-input>
		</div>
	</el-dialog>
</template>

<script>
import { Terminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
import { globalA2AClient } from "@/utils/A2AClient.js"

export default {
	name: "FullTerminalDialog",
	props: {
		visible: {
			type: Boolean,
			default: false,
		},
		streamId: {
			type: String,
			required: true,
		},
		agent: {
			type: Object,
			required: true,
		},
		allowManualInput: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			terminal: null,
			fitAddon: null,
			manualCommand: "",
			currentWorkingDir: "~",
			a2aClient: globalA2AClient,
		}
	},
	computed: {
		dialogVisible: {
			get() {
				return this.visible
			},
			set(val) {
				this.$emit("update:visible", val)
			},
		},
	},
	methods: {
		onDialogOpened() {
			this.initTerminal()
		},

		initTerminal() {
			// 创建 xterm.js 实例
			this.terminal = new Terminal({
				cursorBlink: true,
				fontSize: 14,
				fontFamily: 'Menlo, Monaco, "Courier New", monospace',
				theme: {
					background: "#1e1e1e",
					foreground: "#d4d4d4",
					cursor: "#ffffff",
					selection: "rgba(255, 255, 255, 0.3)",
					black: "#000000",
					red: "#e06c75",
					green: "#98c379",
					yellow: "#d19a66",
					blue: "#61afef",
					magenta: "#c678dd",
					cyan: "#56b6c2",
					white: "#abb2bf",
					brightBlack: "#5c6370",
					brightRed: "#e06c75",
					brightGreen: "#98c379",
					brightYellow: "#d19a66",
					brightBlue: "#61afef",
					brightMagenta: "#c678dd",
					brightCyan: "#56b6c2",
					brightWhite: "#ffffff",
				},
				allowTransparency: true,
				scrollback: 10000,
			})

			// 加载 FitAddon
			this.fitAddon = new FitAddon()
			this.terminal.loadAddon(this.fitAddon)

			// 打开终端
			this.terminal.open(this.$refs.terminalContainer)
			this.fitAddon.fit()

			// 加载历史输出
			this.loadHistoryOutput()

			// 监听用户输入（可选）
			if (this.allowManualInput) {
				this.terminal.onData((data) => {
					this.sendTerminalInput(data)
				})
			}

			// 监听窗口大小变化
			window.addEventListener("resize", this.handleResize)
		},

		loadHistoryOutput() {
			// 从 A2AClient 获取缓存的历史输出
			const history = this.a2aClient.getTerminalHistory(this.streamId)
			if (history) {
				this.terminal.write(history)
			}
		},

		sendTerminalInput(data) {
			// 通过 IM 发送终端输入
			this.a2aClient.sendTerminalCommand(data, {
				streamId: this.streamId,
				action: "input",
			})
		},

		sendManualCommand() {
			if (this.manualCommand.trim()) {
				// 本地显示
				this.terminal.write(`\r\n$ ${this.manualCommand}\r\n`)

				// 发送到远程执行
				this.a2aClient.sendTerminalCommand(this.manualCommand, {
					streamId: this.streamId,
					action: "execute",
				})

				this.manualCommand = ""
			}
		},

		clearTerminal() {
			this.terminal.clear()
		},

		copyOutput() {
			this.terminal.selectAll()
			document.execCommand("copy")
			this.terminal.clearSelection()
			this.$message.success("已复制到剪贴板")
		},

		handleResize() {
			if (this.fitAddon) {
				this.fitAddon.fit()
			}
		},

		handleClose() {
			this.$emit("update:visible", false)
		},

		onDialogClosed() {
			this.destroyTerminal()
		},

		destroyTerminal() {
			window.removeEventListener("resize", this.handleResize)
			if (this.terminal) {
				this.terminal.dispose()
				this.terminal = null
			}
		},
	},

	beforeDestroy() {
		this.destroyTerminal()
	},
}
</script>

<style lang="scss">
.full-terminal-dialog {
	.el-dialog__body {
		padding: 0;
		background: #1e1e1e;
	}

	.terminal-toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px;
		background: #2d2d2d;
		border-bottom: 1px solid #404040;

		.terminal-info {
			color: #d4d4d4;
			font-size: 13px;
			display: flex;
			align-items: center;
			gap: 8px;

			i {
				color: #61afef;
			}
		}
	}

	.terminal-container {
		height: 500px;
		padding: 8px;
		overflow: hidden;
	}

	.terminal-input-area {
		padding: 12px 16px;
		background: #2d2d2d;
		border-top: 1px solid #404040;

		.el-input-group__prepend {
			background: #1e1e1e;
			color: #98c379;
			border-color: #404040;
			font-family: "Menlo", monospace;
		}

		.el-input__inner {
			background: #1e1e1e;
			color: #d4d4d4;
			border-color: #404040;
			font-family: "Menlo", monospace;

			&:focus {
				border-color: #61afef;
			}
		}
	}
}
</style>
```

#### 5.2.3 扩展 A2AClient - 终端历史缓存

**文件：** `/src/utils/A2AClient.js`

```javascript
export class A2AClient {
	constructor() {
		// ... 现有代码
		this.terminalHistoryCache = new Map() // streamId -> 输出历史
	}

	/**
	 * 🔥 新增：获取终端历史输出
	 */
	getTerminalHistory(streamId) {
		return this.terminalHistoryCache.get(streamId) || ""
	}

	/**
	 * 处理 IM 桥接消息（扩展）
	 */
	handleIMBridgeMessage(cmd, data) {
		// ... 现有代码

		switch (cmd) {
			case 11: // LLM_STREAM_CHUNK
				if (request.onData && data.chunk) {
					// ... 现有逻辑

					// 🔥 新增：缓存终端输出
					if (data.streamId) {
						const history = this.terminalHistoryCache.get(data.streamId) || ""
						this.terminalHistoryCache.set(data.streamId, history + data.chunk)

						// 限制缓存大小（保留最近 100KB）
						const updatedHistory = this.terminalHistoryCache.get(data.streamId)
						if (updatedHistory.length > 100000) {
							this.terminalHistoryCache.set(data.streamId, updatedHistory.slice(-100000))
						}
					}
				}
				break

			case 12: // LLM_STREAM_END
				// ... 现有逻辑

				// 🔥 新增：清理过期缓存
				if (data.streamId) {
					// 保留1小时后再清理
					setTimeout(() => {
						this.terminalHistoryCache.delete(data.streamId)
					}, 3600000)
				}
				break
		}
	}

	/**
	 * 🔥 新增：发送 Terminal 命令
	 */
	async sendTerminalCommand(command, options = {}) {
		const streamId = options.streamId || this.generateMessageId()

		const message = {
			type: "terminal_input",
			action: options.action || "execute",
			content: command,
			cwd: options.cwd,
			timestamp: Date.now(),
		}

		return this.sendMessageViaIMBridge(JSON.stringify(message), "terminal", true, streamId)
	}
}
```

#### 5.2.4 集成到 ChatAgentDialog

**文件：** `/src/components/chat/ChatAgentDialog.vue`

```vue
<template>
	<el-dialog ...>
		<!-- ... 现有代码 ... -->

		<!-- 消息列表 -->
		<div class="message-list">
			<div v-for="message in messages" :key="message.id">
				<!-- 🔥 新增：Tool Use 命令卡片 -->
				<div v-if="isToolUse(message) && message.tool === 'execute_command'" class="tool-use-card bash-command">
					<div class="tool-header">
						<i class="el-icon-monitor"></i>
						<span>执行命令</span>
						<el-tag size="mini" :type="message.exitCode === 0 ? 'success' : 'danger'">
							Exit {{ message.exitCode }}
						</el-tag>
					</div>

					<!-- 命令内容 -->
					<div class="command-line">
						<span class="prompt">$</span>
						<code>{{ message.command }}</code>
					</div>

					<!-- 压缩的输出 -->
					<div class="command-output compressed">
						<pre>{{ message.outputSummary }}</pre>
					</div>

					<!-- 🔥 新增：操作按钮 -->
					<div class="tool-actions">
						<el-button size="mini" icon="el-icon-view" @click="openFullTerminal(message.streamId)">
							📺 展开完整终端
						</el-button>
						<el-button
							v-if="message.status === 'running'"
							size="mini"
							type="danger"
							icon="el-icon-close"
							@click="abortCommand(message.streamId)">
							中止
						</el-button>
					</div>
				</div>

				<!-- 其他消息类型... -->
			</div>
		</div>

		<!-- 🔥 新增：完整终端弹窗 -->
		<full-terminal-dialog
			:visible.sync="fullTerminalVisible"
			:stream-id="currentTerminalStreamId"
			:agent="agent"
			v-if="fullTerminalVisible" />
	</el-dialog>
</template>

<script>
import FullTerminalDialog from "./FullTerminalDialog.vue"

export default {
	components: {
		HeadImage,
		FullTerminalDialog, // 🔥 新增
	},

	data() {
		return {
			// ... 现有数据
			fullTerminalVisible: false,
			currentTerminalStreamId: null,
		}
	},

	methods: {
		/**
		 * 🔥 新增：判断是否是 Tool Use 消息
		 */
		isToolUse(message) {
			return message.type === "tool_use" || message.tool
		},

		/**
		 * 🔥 新增：打开完整终端
		 */
		openFullTerminal(streamId) {
			this.currentTerminalStreamId = streamId
			this.fullTerminalVisible = true
		},

		/**
		 * 🔥 新增：中止命令执行
		 */
		async abortCommand(streamId) {
			try {
				await this.a2aClient.sendTerminalCommand("\x03", {
					// Ctrl+C
					streamId: streamId,
					action: "abort",
				})
				this.$message.success("已发送中止信号")
			} catch (error) {
				this.$message.error("中止失败: " + error.message)
			}
		},

		/**
		 * 处理智能体消息（扩展）
		 */
		handleAgentMessage(message) {
			// 🔥 新增：判断是否是 tool use 消息
			if (message.type === "tool_use" && message.tool === "execute_command") {
				// 增强消息对象
				message.streamId = message.id
				message.outputSummary = this.compressOutput(message.output)
				message.exitCode = message.exitCode || 0
				message.status = message.status || "completed"
			}

			// ... 现有逻辑
			this.messages.push(message)
		},

		/**
		 * 🔥 新增：压缩输出（显示前几行 + 最后几行）
		 */
		compressOutput(output, maxLines = 10) {
			if (!output) return ""

			const lines = output.split("\n")
			if (lines.length <= maxLines) {
				return output
			}

			const halfLines = Math.floor(maxLines / 2)
			const firstLines = lines.slice(0, halfLines).join("\n")
			const lastLines = lines.slice(-halfLines).join("\n")

			return `${firstLines}\n\n... (${lines.length - maxLines} more lines) ...\n\n${lastLines}`
		},
	},
}
</script>

<style lang="scss">
.tool-use-card {
	margin: 12px 0;
	padding: 12px;
	background: #f9f9f9;
	border: 1px solid #e0e0e0;
	border-radius: 8px;

	&.bash-command {
		background: linear-gradient(135deg, #f6f8fa 0%, #e9ecef 100%);
		border-left: 3px solid #0366d6;
	}

	.tool-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
		font-weight: 600;
		color: #24292e;

		i {
			color: #0366d6;
		}
	}

	.command-line {
		background: #1e1e1e;
		padding: 8px 12px;
		border-radius: 4px;
		font-family: "Menlo", "Monaco", monospace;
		margin-bottom: 12px;

		.prompt {
			color: #98c379;
			margin-right: 8px;
		}

		code {
			color: #d4d4d4;
		}
	}

	.command-output {
		background: #ffffff;
		padding: 8px 12px;
		border: 1px solid #e1e4e8;
		border-radius: 4px;
		max-height: 200px;
		overflow-y: auto;
		font-family: "Menlo", "Monaco", monospace;
		font-size: 12px;
		color: #24292e;

		&.compressed {
			position: relative;

			&::after {
				content: "";
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 30px;
				background: linear-gradient(transparent, #ffffff);
				pointer-events: none;
			}
		}
	}

	.tool-actions {
		margin-top: 12px;
		display: flex;
		gap: 8px;
	}
}
</style>
```

---

## 六、实施步骤

### Phase 1: Roo-Code 端（预计 1-2 小时）

- [ ] **1.1** 在 `llm-stream-service.ts` 中添加 `terminalSessions` 管理
- [ ] **1.2** 实现 `setupTerminalHandlers()` 监听终端命令
- [ ] **1.3** 实现 `handleTerminalCommand()` 执行命令
- [ ] **1.4** 集成 TerminalRegistry 创建/复用终端
- [ ] **1.5** 实现流式输出转发到 IM
- [ ] **1.6** 在 `extension.ts` 中调用 `markHandlersRegistered()`

### Phase 2: box-im-web 前端（预计 2-3 小时）

- [ ] **2.1** 安装 xterm.js 依赖

    ```bash
    npm install xterm xterm-addon-fit
    ```

- [ ] **2.2** 创建 `FullTerminalDialog.vue` 组件

    - xterm.js 初始化和渲染
    - 历史输出加载
    - 用户输入监听
    - 窗口大小自适应

- [ ] **2.3** 在 `A2AClient.js` 中添加终端支持

    - `terminalHistoryCache` 缓存管理
    - `getTerminalHistory()` 获取历史
    - `sendTerminalCommand()` 发送命令
    - `handleIMBridgeMessage()` 扩展处理终端输出

- [ ] **2.4** 在 `ChatAgentDialog.vue` 中集成
    - 添加 Tool Use 命令卡片样式
    - 添加"展开完整终端"按钮
    - 实现 `openFullTerminal()` 打开弹窗
    - 实现 `compressOutput()` 压缩输出

### Phase 3: 测试验证（预计 1-2 小时）

- [ ] **3.1** 基本功能测试

    - [ ] 测试简单命令 (`ls`, `pwd`, `echo`)
    - [ ] 测试长输出命令 (`cat large_file.log`)
    - [ ] 测试带颜色输出 (`ls --color=auto`)

- [ ] **3.2** 流式输出测试

    - [ ] 测试长时间运行命令 (`ping google.com`)
    - [ ] 测试实时日志 (`tail -f /var/log/system.log`)
    - [ ] 测试进度条命令 (`npm install`)

- [ ] **3.3** 交互测试

    - [ ] 测试展开/关闭终端弹窗
    - [ ] 测试历史输出缓存
    - [ ] 测试手动输入命令（可选）
    - [ ] 测试中止命令

- [ ] **3.4** 边界情况测试
    - [ ] 测试命令执行失败（退出码非0）
    - [ ] 测试 Shell Integration 不可用的降级
    - [ ] 测试多个终端会话
    - [ ] 测试缓存清理

### Phase 4: 优化和文档（预计 1 小时）

- [ ] **4.1** 性能优化

    - [ ] 输出缓存大小限制
    - [ ] 终端会话超时清理
    - [ ] 弹窗懒加载

- [ ] **4.2** 用户体验优化

    - [ ] 添加加载状态提示
    - [ ] 添加错误提示和重试
    - [ ] 优化终端样式和主题

- [ ] **4.3** 更新文档
    - [ ] 更新用户使用手册
    - [ ] 添加开发者指南
    - [ ] 记录已知问题和限制

---

## 七、测试方案

### 7.1 单元测试

**Roo-Code 端：**

```typescript
// __tests__/llm-stream-service.test.ts

describe("LLMStreamService Terminal Handler", () => {
	it("should handle terminal command and forward output", async () => {
		const service = new LLMStreamService(context, outputChannel)

		const data = {
			streamId: "test_stream",
			question: JSON.stringify({
				type: "terminal_input",
				action: "execute",
				content: 'echo "Hello World"',
			}),
		}

		await service.handleTerminalCommand(data.streamId, JSON.parse(data.question), data)

		// 验证输出被转发
		expect(mockIMConnection.sendLLMChunk).toHaveBeenCalledWith(
			"test_stream",
			expect.stringContaining("Hello World"),
			expect.any(Number),
			expect.any(Number),
		)
	})
})
```

**box-im-web 端：**

```javascript
// __tests__/A2AClient.test.js

describe("A2AClient Terminal Support", () => {
	it("should cache terminal output", () => {
		const client = new A2AClient()

		client.handleIMBridgeMessage(11, {
			streamId: "test",
			chunk: "output line 1\n",
		})

		expect(client.getTerminalHistory("test")).toBe("output line 1\n")
	})

	it("should limit cache size to 100KB", () => {
		const client = new A2AClient()
		const largeOutput = "x".repeat(150000)

		client.handleIMBridgeMessage(11, {
			streamId: "test",
			chunk: largeOutput,
		})

		const cached = client.getTerminalHistory("test")
		expect(cached.length).toBeLessThanOrEqual(100000)
	})
})
```

### 7.2 集成测试

**测试场景：**

1. **完整命令执行流程**

    - 用户在对话界面发送命令
    - Roo-Code 执行命令
    - 输出实时返回到前端
    - 显示在压缩卡片中
    - 点击展开，显示完整输出

2. **长时间运行命令**

    - 执行 `ping -c 100 google.com`
    - 验证实时输出流式显示
    - 验证中止功能

3. **多终端会话**
    - 打开多个智能体对话
    - 每个对话执行不同命令
    - 验证会话隔离

### 7.3 端到端测试

```bash
# 测试脚本
cd /Users/david/ThinkgsProjects/box-im/im-web

# 1. 基本命令
测试命令: ls -la
预期结果: 显示文件列表，带颜色

# 2. 长输出
测试命令: cat package.json
预期结果: 显示完整文件内容，可滚动

# 3. 实时输出
测试命令: for i in {1..10}; do echo "Line $i"; sleep 1; done
预期结果: 每秒输出一行

# 4. 错误命令
测试命令: invalid_command
预期结果: 显示错误信息，Exit 127

# 5. ANSI 颜色
测试命令: ls --color=auto
预期结果: 文件名带颜色显示
```

---

## 八、FAQ

### Q1: 为什么不直接使用 WebSocket Terminal 方案？

**A:** 我们的方案完全基于现有的 IM WebSocket 和 A2A 协议，零额外基础设施：

- ✅ 不需要新的 WebSocket 服务器
- ✅ 不需要新的认证机制
- ✅ 不需要修改 box-im-server
- ✅ 复用现有的用户权限、路由、日志系统

### Q2: 终端会话如何管理？会占用资源吗？

**A:** 我们使用 `TerminalRegistry` 自动管理终端会话：

- 相同 `cwd` 的命令会复用同一个终端
- 空闲超时自动清理（默认5分钟）
- 支持手动中止命令释放资源

### Q3: 支持哪些 Shell？

**A:** 支持所有 VSCode Terminal 支持的 Shell：

- macOS/Linux: bash, zsh, fish
- Windows: PowerShell, cmd, Git Bash

### Q4: 如何处理交互式命令（如 vim）？

**A:** 当前版本不完全支持交互式命令：

- ✅ 支持：普通命令、长时间运行命令
- ❌ 不支持：vim, nano 等需要终端模拟的命令

**解决方案（未来）：**

- 使用 xterm.js 的 AttachAddon
- 支持完整的 PTY 交互

### Q5: 如何保证安全性？

**A:** 多层安全机制：

1. **用户认证**：通过 IM WebSocket 的 accessToken
2. **权限校验**：只能操作自己的智能体
3. **命令限制**：可配置命令白名单（可选）
4. **工作目录限制**：只能在指定目录执行
5. **超时控制**：长时间运行自动终止

### Q6: 性能如何？会不会卡顿？

**A:** 性能优化措施：

- 流式输出，不等待命令完成
- 输出缓存限制（100KB）
- 终端弹窗懒加载
- 过期会话自动清理

**压测结果（预期）：**

- 单个命令输出：< 10MB/s
- 并发命令数：< 10 个/用户
- 内存占用：< 50MB/终端

### Q7: 如何扩展？

**未来可能的扩展方向：**

1. **终端录制**：录制操作并回放
2. **多用户协作**：共享终端会话
3. **文件传输**：通过终端上传/下载文件
4. **终端快照**：保存终端状态
5. **自定义主题**：支持更多颜色主题

---

## 九、附录

### A. 相关文件清单

**Roo-Code 项目：**

```
/src/services/llm-stream-service.ts         # 核心服务（修改）
/src/services/im-websocket.ts               # IM WebSocket（无需修改）
/src/integrations/terminal/TerminalRegistry.ts  # 终端管理（无需修改）
/src/integrations/terminal/Terminal.ts      # VSCode终端（无需修改）
/src/extension.ts                           # 扩展入口（修改）
```

**box-im 项目：**

```
/im-web/src/utils/A2AClient.js              # A2A客户端（修改）
/im-web/src/components/agent/FullTerminalDialog.vue  # 终端弹窗（新建）
/im-web/src/components/chat/ChatAgentDialog.vue      # 对话界面（修改）
```

### B. 依赖版本

```json
{
	"xterm": "^5.3.0",
	"xterm-addon-fit": "^0.8.0"
}
```

### C. 配置项（可选）

**Roo-Code 配置：**

```json
{
	"roo-code.terminal.outputCacheSize": 100000,
	"roo-code.terminal.sessionTimeout": 300000,
	"roo-code.terminal.commandWhitelist": [],
	"roo-code.terminal.allowManualInput": true
}
```

---

## 十、总结

### 核心优势

1. **极简设计**：

    - 复用现有 IM WebSocket + A2A 协议
    - 复用 Roo-Code 的 TerminalRegistry
    - 零额外基础设施

2. **最小改动**：

    - Roo-Code: ~100 行代码
    - box-im-web: ~200 行代码
    - 总共不到 300 行代码

3. **优秀体验**：
    - 对话流程不受干扰
    - 按需展开完整终端
    - 实时流式输出
    - 支持 ANSI 颜色

### 实施时间估算

- Phase 1 (Roo-Code): 1-2 小时
- Phase 2 (box-im-web): 2-3 小时
- Phase 3 (测试): 1-2 小时
- Phase 4 (优化文档): 1 小时

**总计：5-8 小时**

### 下一步行动

1. Review 本设计方案
2. 确认技术细节和实施步骤
3. 开始 Phase 1 开发
4. 逐步完成 Phase 2-4

---

**文档版本：** v1.0
**最后更新：** 2025-10-30
**维护者：** Roo-Code Team
