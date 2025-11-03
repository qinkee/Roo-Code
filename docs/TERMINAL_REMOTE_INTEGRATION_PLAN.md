# 🖥️ Roo-Code 远程终端交互完整方案

> **版本：** v2.0（基于现有实现优化）
> **日期：** 2025-11-01
> **目标：** 在 IM 对话中支持完整的 xterm.js 交互式终端

---

## 📊 一、现状分析

### ✅ 已实现组件

#### 1. **后端 (Roo-Code)**

- ✅ **LLMStreamService.handleTerminalMessage()** - 处理 `terminal_input` 消息
- ✅ **TerminalRegistry** - 终端会话管理和复用
- ✅ **实时输出转发** - 通过 `onLine` 回调推送到 IM WebSocket
- ✅ **命令完成信号** - `cmd:12` (LLM_STREAM_END)

**文件位置：**

```
/Users/david/ThinkgsProjects/Roo-Code/src/services/llm-stream-service.ts
/Users/david/ThinkgsProjects/Roo-Code/src/integrations/terminal/TerminalRegistry.ts
```

#### 2. **前端 (im-web)**

**已完成：**

- ✅ **FullTerminalDialog.vue** - xterm.js 完整终端弹窗

    - 位置：`/src/components/agent/FullTerminalDialog.vue`
    - 功能：xterm.js 集成、ANSI 颜色支持、手动输入、清屏、复制

- ✅ **A2AClient** - 终端命令发送和历史缓存

    - `sendTerminalCommand()` - 发送命令
    - `getTerminalHistory()` - 获取历史
    - `terminalHistoryCache` - 缓存管理（100KB限制）

- ✅ **AgentSessionManager** - 命令输出处理

    - `handleCommandOutputChunk()` - 处理 `command_output`

- ✅ **RooCodeTaskMessage.vue** - 显示命令输出

    - Command Output Section（黑色终端样式）

- ✅ **xterm 依赖** - 已安装
    ```json
    "xterm": "^5.3.0",
    "xterm-addon-fit": "^0.8.0"
    ```

### ❌ 缺失环节

1. **没有"展开终端"按钮**

    - RooCodeTaskMessage.vue 中的 command_output section 缺少按钮

2. **FullTerminalDialog 没有被调用**

    - 没有父组件集成和打开弹窗的逻辑

3. **实时输出未连接到 xterm.js**

    - AgentSessionManager 收到的输出没有推送到 FullTerminalDialog

4. **缺少中止命令功能**
    - 没有发送 Ctrl+C 的机制

---

## 🎯 二、完整实施方案

### 阶段 1：连接现有组件（核心功能）

#### 1.1 在 RooCodeTaskMessage.vue 中添加"展开终端"按钮

**修改位置：** `RooCodeTaskMessage.vue:105-114`

```vue
<!-- Command Output Section -->
<div v-else-if="item.type === 'command_output'" class="message-section command-output-section">
  <div class="section-header">
    <span class="section-icon-terminal"></span>
    <span class="section-title">命令输出</span>
    <!-- 🔥 新增：操作按钮 -->
    <div class="section-actions">
      <el-button
        size="mini"
        type="primary"
        icon="el-icon-view"
        @click="openFullTerminal(item)">
        📺 展开完整终端
      </el-button>
      <el-button
        v-if="item.streaming"
        size="mini"
        type="danger"
        icon="el-icon-close"
        @click="abortCommand(item)">
        中止
      </el-button>
    </div>
  </div>
  <div class="section-content command-output-content">
    <pre class="terminal-output">{{ item.content }}</pre>
  </div>
</div>
```

**新增 methods：**

```javascript
methods: {
  /**
   * 打开完整终端弹窗
   */
  openFullTerminal(item) {
    this.$emit('open-terminal', {
      streamId: this.streamId,
      taskId: item.taskId,
      content: item.content,
      cwd: this.msgInfo.cwd || '~'
    });
  },

  /**
   * 中止命令执行
   */
  abortCommand(item) {
    this.$emit('abort-command', {
      streamId: this.streamId,
      taskId: item.taskId
    });
  }
}
```

**新增样式：**

```scss
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;

	.section-actions {
		display: flex;
		gap: 8px;
		margin-left: auto;
	}
}

.section-icon-terminal {
	// ... 已有样式
}
```

---

#### 1.2 在父组件中集成 FullTerminalDialog

**文件：** `InboxSession.vue` 或 `ChatAgentDialog.vue`

**1. 引入组件：**

```vue
<script>
import FullTerminalDialog from "@/components/agent/FullTerminalDialog.vue"

export default {
	components: {
		FullTerminalDialog,
	},

	data() {
		return {
			// ... 现有数据
			fullTerminalVisible: false,
			currentTerminalData: null,
		}
	},
}
</script>
```

**2. 添加弹窗组件：**

```vue
<template>
	<div class="inbox-session">
		<!-- ... 现有内容 ... -->

		<!-- 消息列表 -->
		<roo-code-task-message
			v-for="msg in messages"
			:key="msg.id"
			:msg-info="msg"
			:stream-id="msg.streamId"
			@open-terminal="handleOpenTerminal"
			@abort-command="handleAbortCommand" />

		<!-- 🔥 完整终端弹窗 -->
		<full-terminal-dialog
			v-if="fullTerminalVisible"
			:visible.sync="fullTerminalVisible"
			:stream-id="currentTerminalData.streamId"
			:agent="currentAgent"
			:allow-manual-input="true"
			:initial-output="currentTerminalData.content"
			:cwd="currentTerminalData.cwd"
			@command-sent="handleTerminalCommand" />
	</div>
</template>
```

**3. 添加事件处理：**

```javascript
methods: {
  /**
   * 打开完整终端
   */
  handleOpenTerminal(data) {
    this.currentTerminalData = data;
    this.fullTerminalVisible = true;

    console.log('[InboxSession] 打开完整终端:', data);
  },

  /**
   * 中止命令
   */
  async handleAbortCommand(data) {
    try {
      // 发送 Ctrl+C 信号
      await this.$agentSessionManager.abortCommand(data.streamId);
      this.$message.success('已发送中止信号');
    } catch (error) {
      this.$message.error('中止失败: ' + error.message);
    }
  },

  /**
   * 处理终端命令发送
   */
  handleTerminalCommand(command) {
    console.log('[InboxSession] 发送终端命令:', command);
    // 命令由 FullTerminalDialog 内部的 A2AClient 处理
  }
}
```

---

#### 1.3 增强 FullTerminalDialog 的实时输出

**问题：** 当前 FullTerminalDialog 只在打开时加载历史，没有监听实时输出。

**修改 FullTerminalDialog.vue：**

```javascript
export default {
	props: {
		// ... 现有 props
		initialOutput: {
			type: String,
			default: "",
		},
		cwd: {
			type: String,
			default: "~",
		},
	},

	data() {
		return {
			// ... 现有数据
			outputListener: null,
			currentWorkingDir: this.cwd, // 使用传入的 cwd
		}
	},

	methods: {
		initTerminal() {
			// ... 现有初始化代码

			// 加载历史输出
			this.loadHistoryOutput()

			// 🔥 监听实时输出
			this.subscribeToOutput()
		},

		loadHistoryOutput() {
			// 优先使用 initialOutput
			if (this.initialOutput) {
				this.terminal.write(this.initialOutput)
			} else {
				// 从 A2AClient 缓存获取
				const history = this.a2aClient.getTerminalHistory(this.streamId)
				if (history) {
					this.terminal.write(history)
				}
			}
		},

		/**
		 * 🔥 订阅实时输出
		 */
		subscribeToOutput() {
			// 监听 A2AClient 的输出事件
			this.outputListener = (data) => {
				if (data.streamId === this.streamId && data.chunk) {
					// 实时写入到 xterm.js
					this.terminal.write(data.chunk)
				}
			}

			// 注册监听器
			this.a2aClient.on("terminal_output", this.outputListener)
		},

		destroyTerminal() {
			// 取消监听
			if (this.outputListener) {
				this.a2aClient.off("terminal_output", this.outputListener)
				this.outputListener = null
			}

			// ... 现有清理代码
			window.removeEventListener("resize", this.handleResize)
			if (this.terminal) {
				this.terminal.dispose()
				this.terminal = null
			}
		},
	},
}
```

---

#### 1.4 在 A2AClient 中添加事件发射

**修改 A2AClient.js：**

```javascript
export class A2AClient {
	constructor() {
		// ... 现有代码
		this.terminalHistoryCache = new Map()
		this.eventListeners = new Map() // 🔥 新增：事件监听器
	}

	/**
	 * 🔥 注册事件监听器
	 */
	on(event, callback) {
		if (!this.eventListeners.has(event)) {
			this.eventListeners.set(event, [])
		}
		this.eventListeners.get(event).push(callback)
	}

	/**
	 * 🔥 取消事件监听器
	 */
	off(event, callback) {
		if (!this.eventListeners.has(event)) return

		const listeners = this.eventListeners.get(event)
		const index = listeners.indexOf(callback)
		if (index > -1) {
			listeners.splice(index, 1)
		}
	}

	/**
	 * 🔥 触发事件
	 */
	emit(event, data) {
		if (!this.eventListeners.has(event)) return

		const listeners = this.eventListeners.get(event)
		listeners.forEach((callback) => {
			try {
				callback(data)
			} catch (error) {
				console.error(`[A2AClient] Event handler error for ${event}:`, error)
			}
		})
	}

	handleIMBridgeMessage(cmd, data) {
		// ... 现有代码

		switch (cmd) {
			case 11: // LLM_STREAM_CHUNK
				if (request.onData && data.chunk) {
					// ... 现有逻辑

					// 缓存终端输出
					if (data.streamId && data.chunk) {
						const history = this.terminalHistoryCache.get(data.streamId) || ""
						this.terminalHistoryCache.set(data.streamId, history + data.chunk)

						// 🔥 触发实时输出事件
						this.emit("terminal_output", {
							streamId: data.streamId,
							chunk: data.chunk,
							timestamp: Date.now(),
						})

						// ... 现有的大小限制逻辑
					}
				}
				break

			// ... 其他 case
		}
	}
}
```

---

#### 1.5 在 AgentSessionManager 中添加中止命令

**修改 AgentSessionManager.js：**

```javascript
export class AgentSessionManager {
	// ... 现有代码

	/**
	 * 🔥 中止命令执行
	 * @param {string} streamId - 终端会话ID
	 */
	async abortCommand(streamId) {
		console.log(`[SessionManager] 中止命令: ${streamId}`)

		// 通过 A2AClient 发送 Ctrl+C
		const a2aClient = globalA2AClient || this.vue.$agentSessionManager?.a2aClient

		if (!a2aClient) {
			throw new Error("A2AClient not available")
		}

		// 发送中止信号
		return a2aClient.sendTerminalCommand("\x03", {
			streamId: streamId,
			action: "abort",
		})
	}
}
```

---

### 阶段 2：优化用户体验

#### 2.1 添加命令执行状态指示

**修改 RooCodeTaskMessage.vue 的 command-output section：**

```vue
<div class="section-header">
  <span class="section-icon-terminal"></span>
  <span class="section-title">命令输出</span>

  <!-- 🔥 状态标签 -->
  <el-tag
    v-if="item.streaming"
    size="mini"
    type="warning"
    class="status-tag">
    <i class="el-icon-loading"></i> 执行中
  </el-tag>
  <el-tag
    v-else
    size="mini"
    :type="item.exitCode === 0 ? 'success' : 'danger'"
    class="status-tag">
    {{ item.exitCode === 0 ? '✓' : '✗' }}
    Exit {{ item.exitCode || 0 }}
  </el-tag>

  <!-- 操作按钮 -->
  <div class="section-actions">
    <!-- ... -->
  </div>
</div>
```

**添加样式：**

```scss
.status-tag {
	margin-left: 8px;
	font-family: monospace;
}
```

---

#### 2.2 优化终端输出显示（折叠/展开）

**修改 RooCodeTaskMessage.vue：**

```vue
<div class="section-content command-output-content" :class="{ 'collapsed': isCollapsed }">
  <pre class="terminal-output">{{ item.content }}</pre>

  <!-- 🔥 展开/折叠按钮 -->
  <div v-if="item.content.length > 1000" class="collapse-control">
    <el-button
      type="text"
      size="mini"
      @click="toggleCollapse">
      {{ isCollapsed ? '展开 ▼' : '折叠 ▲' }}
    </el-button>
  </div>
</div>
```

```javascript
data() {
  return {
    // ... 现有数据
    isCollapsed: true
  };
},

methods: {
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
}
```

```scss
.command-output-content {
	&.collapsed {
		max-height: 200px;
		overflow: hidden;
		position: relative;

		&::after {
			content: "";
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			height: 50px;
			background: linear-gradient(transparent, #1e1e1e);
			pointer-events: none;
		}
	}

	.collapse-control {
		text-align: center;
		padding: 8px;
		background: #2d2d2d;
	}
}
```

---

### 阶段 3：增强 Roo-Code 后端

#### 3.1 支持中止命令（Roo-Code）

**修改 LLMStreamService.ts：**

```typescript
private async handleTerminalCommand(
  streamId: string,
  message: TerminalMessage,
  requestData: any
): Promise<void> {
  try {
    // ... 现有代码

    // 🔥 处理中止命令
    if (message.action === 'abort') {
      const terminal = this.terminalSessions.get(streamId);
      if (terminal) {
        // 发送 Ctrl+C 到终端
        terminal.sendText('\x03', false);

        this.outputChannel.appendLine(`[Terminal] Abort signal sent to ${streamId}`);

        // 发送确认消息
        this.imConnection.sendLLMChunk(
          streamId,
          '\r\n^C\r\n',
          requestData.recvId,
          requestData.targetTerminal,
          requestData.chatType,
          requestData.sendId,
          requestData.senderTerminal
        );
      }
      return;
    }

    // ... 现有的执行命令逻辑
  } catch (error: any) {
    // ... 现有错误处理
  }
}
```

---

#### 3.2 优化命令输出格式

**修改 LLMStreamService.ts 的 onLine 回调：**

```typescript
onLine: (line, proc) => {
  // 确保行尾有换行符
  const formattedLine = line.endsWith('\n') ? line : line + '\r\n';

  // 实时转发输出到 IM
  this.imConnection.sendLLMChunk(
    streamId,
    formattedLine,
    requestData.recvId,
    requestData.targetTerminal,
    requestData.chatType,
    requestData.sendId,
    requestData.senderTerminal
  );
},
```

---

### 阶段 4：测试和验证

#### 4.1 测试用例

**测试场景 1：基本命令执行**

```bash
# 在 IM 对话中发送命令
用户: 执行 ls -la 命令

预期结果:
1. 显示 command_output section
2. 有"展开完整终端"按钮
3. 点击按钮，弹出 FullTerminalDialog
4. xterm.js 显示完整输出（带颜色）
```

**测试场景 2：手动输入命令**

```bash
# 在 FullTerminalDialog 中手动输入
输入: pwd
回车

预期结果:
1. 命令发送到 Roo-Code
2. 输出显示在 xterm.js
3. 历史缓存更新
```

**测试场景 3：中止长时间运行命令**

```bash
# 执行长时间命令
用户: 执行 ping google.com

操作:
1. 点击"中止"按钮
2. 发送 Ctrl+C

预期结果:
1. 命令被中止
2. 显示 ^C
3. 返回提示符
```

**测试场景 4：ANSI 颜色支持**

```bash
# 执行带颜色的命令
用户: 执行 ls --color=auto

预期结果:
1. 在 command_output section 显示原始文本
2. 在 FullTerminalDialog 中显示彩色输出
3. 文件名、目录有不同颜色
```

**测试场景 5：实时流式输出**

```bash
# 执行多行输出命令
用户: 执行 for i in {1..10}; do echo "Line $i"; sleep 1; done

预期结果:
1. 每秒输出一行
2. FullTerminalDialog 中实时显示
3. command_output section 逐行累积
```

---

## 🗂️ 三、文件修改清单

### 需要修改的文件

#### 前端 (im-web)

1. **RooCodeTaskMessage.vue** ⭐

    - [ ] 添加"展开完整终端"按钮
    - [ ] 添加"中止"按钮
    - [ ] 添加状态标签（执行中/完成）
    - [ ] 添加折叠/展开控制
    - [ ] 发射 `open-terminal` 和 `abort-command` 事件

2. **FullTerminalDialog.vue** ⭐

    - [ ] 添加 `initialOutput` prop
    - [ ] 添加 `cwd` prop
    - [ ] 实现实时输出监听 (`subscribeToOutput`)
    - [ ] 更新 `currentWorkingDir` 从 props
    - [ ] 添加事件清理逻辑

3. **A2AClient.js** ⭐

    - [ ] 添加事件系统 (`on`, `off`, `emit`)
    - [ ] 在 `handleIMBridgeMessage` 中触发 `terminal_output` 事件
    - [ ] 优化 `sendTerminalCommand` 支持 `abort` action

4. **AgentSessionManager.js**

    - [ ] 添加 `abortCommand()` 方法

5. **InboxSession.vue** 或 **ChatAgentDialog.vue** ⭐
    - [ ] 引入 `FullTerminalDialog` 组件
    - [ ] 添加 `fullTerminalVisible` 状态
    - [ ] 实现 `handleOpenTerminal()` 方法
    - [ ] 实现 `handleAbortCommand()` 方法
    - [ ] 传递事件监听器到 `RooCodeTaskMessage`

#### 后端 (Roo-Code)

6. **llm-stream-service.ts** (可选优化)
    - [ ] 支持 `action: 'abort'` 处理
    - [ ] 优化输出格式（添加 `\r\n`）

---

## 📋 四、实施步骤

### Phase 1: 核心功能（2-3小时）

**优先级 P0：**

1. [ ] **RooCodeTaskMessage.vue** - 添加"展开终端"按钮（30分钟）
2. [ ] **父组件集成** - 集成 FullTerminalDialog（30分钟）
3. [ ] **FullTerminalDialog** - 实时输出监听（45分钟）
4. [ ] **A2AClient** - 事件系统（45分钟）

**测试：** 基本的展开终端 + 实时输出显示

---

### Phase 2: 交互功能（1-2小时）

**优先级 P1：** 5. [ ] **AgentSessionManager** - 中止命令（30分钟）6. [ ] **RooCodeTaskMessage** - 中止按钮（15分钟）7. [ ] **Roo-Code** - 支持 abort action（30分钟）

**测试：** 手动输入命令 + 中止命令

---

### Phase 3: 用户体验（1小时）

**优先级 P2：** 8. [ ] **状态标签** - 显示执行状态和退出码（15分钟）9. [ ] **折叠/展开** - 长输出折叠控制（30分钟）10. [ ] **工作目录** - 显示当前目录（15分钟）

**测试：** 完整的用户体验流程

---

### Phase 4: 测试和优化（1-2小时）

11. [ ] **端到端测试** - 所有测试场景
12. [ ] **性能优化** - 大输出处理
13. [ ] **错误处理** - 边界情况
14. [ ] **文档更新** - 用户手册

---

## 🎨 五、UI/UX 效果图

### 对话界面（默认状态）

```
┌─────────────────────────────────────────┐
│ 🤖 傻蛋AI                              │
├─────────────────────────────────────────┤
│                                         │
│ 👤 用户: 执行 ls -la 查看文件列表       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔧 使用工具: execute_command        │ │
│ │ $ ls -la                            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 💻 命令输出    [执行中⏳] [中止]    │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ total 48                        │ │ │
│ │ │ drwxr-xr-x  12 user  staff  384 │ │ │
│ │ │ ...                             │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ [📺 展开完整终端]  [折叠 ▲]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ 任务完成 🚀                      │ │
│ │ 已成功执行命令，文件列表如上显示。  │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### FullTerminalDialog（点击展开后）

```
┌────────────────────────────────────────────────┐
│ 完整终端                                [×]    │
├────────────────────────────────────────────────┤
│ 📁 /Users/david/Projects     [清屏] [复制]    │
├────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────┐ │
│ │ $ ls -la                                   │ │ ← xterm.js
│ │ total 48                                   │ │
│ │ drwxr-xr-x  12 user  staff   384 Nov  1...│ │   ANSI 颜色
│ │ drwxr-xr-x   3 user  staff    96 Oct 30...│ │
│ │ -rw-r--r--   1 user  staff  1234 Nov  1...│ │
│ │ -rw-r--r--   1 user  staff   567 Oct 28...│ │
│ │ drwxr-xr-x   8 user  staff   256 Nov  1...│ │
│ │ -rwxr-xr-x   1 user  staff   890 Oct 25...│ │
│ │ $ █                                        │ │ ← 可输入
│ └────────────────────────────────────────────┘ │
├────────────────────────────────────────────────┤
│ $ ▏输入命令并按回车...                        │ │ ← 手动输入
└────────────────────────────────────────────────┘
```

---

## 🔑 六、关键技术要点

### 1. 实时输出同步

**问题：** xterm.js 需要实时接收输出，但 Vue 响应式可能有延迟。

**解决方案：**

```javascript
// A2AClient 发射事件 → FullTerminalDialog 监听 → xterm.write()
this.a2aClient.on("terminal_output", (data) => {
	if (data.streamId === this.streamId) {
		this.terminal.write(data.chunk) // 直接写入，绕过 Vue 响应式
	}
})
```

### 2. ANSI 颜色支持

**xterm.js 自动支持：**

```javascript
// 无需额外处理，xterm.js 会自动解析 ANSI 转义序列
this.terminal.write("\x1b[31mRed Text\x1b[0m") // 红色文本
this.terminal.write("\x1b[1;32mBold Green\x1b[0m") // 加粗绿色
```

### 3. 历史输出加载

**优先级：**

1. 使用 `initialOutput` prop（从父组件传递）
2. 从 `A2AClient.terminalHistoryCache` 获取
3. 如果都没有，显示空终端

### 4. 中止命令

**流程：**

```
im-web                      Roo-Code              Terminal
  |                            |                     |
  | 用户点击"中止"             |                     |
  |---- sendTerminalCommand -->|                     |
  |  (action: 'abort')         | terminal.sendText() |
  |                            |------ '\x03' ------>|
  |                            |                     |
  |<-------- chunk ------------|<----- ^C -----------|
```

### 5. 命令状态管理

**在 AgentSessionManager 中维护状态：**

```javascript
handleCommandOutputChunk(items, content, ts, partial, msg) {
  // ... 现有逻辑

  // 🔥 更新状态
  if (last) {
    this.vue.$set(last, 'streaming', partial);
    this.vue.$set(last, 'exitCode', msg._exitCode); // 从 metadata 获取
  }
}
```

---

## ⚠️ 七、注意事项和限制

### 1. 不支持的功能

- ❌ 完整的 PTY 交互（vim, nano 等）
- ❌ Tab 补全
- ❌ 命令历史（↑/↓ 键）
- ❌ 多终端分屏

### 2. 性能考虑

- ✅ 输出缓存限制 100KB
- ✅ xterm.js scrollback 限制 10000 行
- ✅ 过期会话自动清理（1小时）

### 3. 安全性

- ✅ 用户认证通过 IM WebSocket
- ✅ 只能操作自己的智能体
- ⚠️ 建议添加命令白名单（可选）
- ⚠️ 工作目录限制（建议实现）

---

## 📊 八、完成度评估

### 当前完成度：**70%**

| 功能模块      | 完成度  | 说明                  |
| ------------- | ------- | --------------------- |
| 后端命令执行  | ✅ 100% | 已完全实现            |
| IM 消息转发   | ✅ 100% | 已完全实现            |
| 前端输出显示  | ✅ 100% | command_output 已显示 |
| xterm.js 集成 | ✅ 90%  | 组件已存在，缺少调用  |
| 实时输出推送  | ❌ 0%   | 需要事件系统          |
| 手动命令输入  | ✅ 80%  | UI 已有，缺少集成     |
| 中止命令      | ❌ 0%   | 需要实现              |
| 历史缓存      | ✅ 100% | 已实现                |
| ANSI 颜色     | ✅ 100% | xterm.js 自动支持     |

### 剩余工作量：**3-5 小时**

---

## 🎯 九、总结

### 优势

1. **基础扎实** - 70% 的功能已经实现
2. **架构清晰** - FullTerminalDialog 已存在，只需连接
3. **技术成熟** - xterm.js 久经考验
4. **零额外依赖** - 所有依赖已安装

### 快速上线路径

**Phase 1 (核心功能，2-3小时)：**

- 添加"展开终端"按钮
- 集成 FullTerminalDialog
- 实现实时输出监听

**Phase 2 (交互功能，1-2小时)：**

- 中止命令
- 手动输入优化

**Phase 3 (用户体验，1小时)：**

- 状态标签
- 折叠/展开
- 样式优化

**总计：4-6 小时即可完整上线！**

---

**方案版本：** v2.0
**最后更新：** 2025-11-01
**状态：** 待实施
**作者：** Claude Code
