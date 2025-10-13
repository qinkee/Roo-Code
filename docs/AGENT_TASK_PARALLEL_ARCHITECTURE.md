# Agent Task Parallel Execution Architecture

## 概述

本文档描述了智能体任务并行执行架构的设计与实现。该架构实现了**用户任务单栈执行**和**智能体任务并行执行**的双轨机制，确保两者互不干扰。

**重构日期**: 2025-10-12
**分支**: `feature/agent-task-parallel`

---

## 核心架构

### 1. 双轨任务管理

#### 1.1 用户任务（User Tasks）

- **存储结构**: `clineStack: Task[]` - LIFO 栈
- **执行模式**: 单栈顺序执行，栈顶任务激活
- **UI 交互**: 实时消息显示，用户手动批准操作
- **状态同步**: 实时更新 UI 状态

#### 1.2 智能体任务（Agent Tasks）

- **存储结构**: `agentTaskPool: Map<string, Task>` - 任务池
- **执行模式**: 并行执行，互不阻塞
- **UI 交互**: 静默执行，自动批准所有操作
- **状态同步**: 完成时批量保存到 TaskHistory

### 2. 任务路由机制

```typescript
async addClineToStack(task: Task) {
    // Agent task: add to pool for parallel execution
    if (task.agentTaskContext) {
        this.agentTaskPool.set(task.taskId, task)
        task.emit(RooCodeEventName.TaskFocused)
        this.performPreparationTasks(task).catch(err => {
            this.log(`Agent task ${task.taskId} preparation failed: ${err}`)
        })
        return // Don't add to user task stack
    }

    // User task: maintain original stack logic
    this.viewingAgentTaskId = null
    this.clineStack.push(task)
    task.emit(RooCodeEventName.TaskFocused)
    await this.performPreparationTasks(task)
}
```

**关键点**:

- 根据 `task.agentTaskContext` 判断任务类型
- 智能体任务放入 `agentTaskPool`，用户任务压入 `clineStack`
- 智能体任务异步启动，不阻塞主流程

---

## 消息路由策略

### 1. 黑名单模式（Blacklist Approach）

**设计原则**: 默认发送所有消息到 webview，只拦截明确的任务相关消息

```typescript
public async postMessageToWebview(message: ExtensionMessage, sourceTaskId?: string) {
    // Task-related message types that need routing check
    const taskRelatedTypes = ['messageUpdated', 'invoke', 'completion', 'thinking']

    // Non-task messages: send directly to webview
    if (!taskRelatedTypes.includes(message.type)) {
        await this.view?.webview.postMessage(message)
        return
    }

    // Task-related messages: check if it's an agent task
    const taskId = sourceTaskId || this.getCurrentCline()?.taskId
    if (!taskId) {
        await this.view?.webview.postMessage(message)
        return
    }

    const task = this.agentTaskPool.get(taskId) || this.clineStack.find(t => t.taskId === taskId)
    if (!task) {
        await this.view?.webview.postMessage(message)
        return
    }

    // Agent task: forward to IM WebSocket (unless viewing)
    if (task.agentTaskContext && this.viewingAgentTaskId !== taskId) {
        this.forwardToIMWebSocket(task, message)
        return
    }

    // User task or viewed agent task: send to webview
    await this.view?.webview.postMessage(message)
}
```

**优势**:

- ✅ 稳定性优先：所有全局消息默认通过，不破坏现有功能
- ✅ 易于排查：如果智能体任务干扰 UI，只需在黑名单中添加该消息类型
- ✅ 维护简单：只需关注 4 种任务消息，不需要维护庞大的全局消息列表
- ✅ 向后兼容：新增的任何全局消息类型都能正常工作

### 2. 智能体任务消息转发

智能体任务的消息不发送到 VSCode UI，而是通过 IM WebSocket 转发到调用端：

```typescript
private forwardToIMWebSocket(task: Task, message: ExtensionMessage) {
    const ctx = task.agentTaskContext
    const llmService = (global as any).llmStreamService

    if (message.type === "messageUpdated" && message.clineMessage) {
        const clineMsg = message.clineMessage
        const isPartial = clineMsg.partial === true

        if (clineMsg.type === "ask" && clineMsg.ask === "tool") {
            llmService.imConnection.sendLLMChunk(ctx.streamId, JSON.stringify({
                type: "tool_use",
                text: clineMsg.text,
                partial: isPartial,
                ts: clineMsg.ts,
            }))
        }
        // ... 其他消息类型处理
    }
}
```

---

## 智能体任务自动响应

### 1. 自动批准机制

智能体任务在 `ask()` 方法中自动响应所有询问，无需用户交互：

```typescript
// Task.ts: ask() method
if (this.agentTaskContext && !partial) {
	switch (type) {
		case "followup":
			this.askResponse = "messageResponse"
			this.askResponseText = ""
			break

		case "command":
		case "tool":
		case "browser_action_launch":
		case "use_mcp_server":
		case "command_output":
		case "api_req_failed":
		case "mistake_limit_reached":
		case "resume_task":
		case "resume_completed_task":
		case "completion_result":
		case "auto_approval_max_req_reached":
			this.askResponse = "yesButtonClicked"
			break

		default:
			this.askResponse = "yesButtonClicked"
			break
	}
}
```

### 2. 性能优化

智能体任务减少 TaskHistory 更新频率，只在任务结束时更新：

```typescript
// Task.ts: saveClineMessages()
if (!this.agentTaskContext) {
	await this.providerRef.deref()?.updateTaskHistory(historyItem)
}
```

---

## 任务查看机制

### 1. 查看状态管理

- **状态标记**: `viewingAgentTaskId: string | null`
- **查看触发**: 用户点击任务历史中的智能体任务
- **状态清除**: 切换到用户任务或智能体任务完成时

### 2. 历史消息显示

查看智能体任务时，显示 TaskHistory 中的已保存消息，不显示实时消息：

```typescript
// getStateToPostToWebview()
const currentTaskId = currentTask?.taskId || this.viewingAgentTaskId
const currentTaskItem = currentTaskId
	? (taskHistory || []).find((item: HistoryItem) => item.id === currentTaskId)
	: undefined

let clineMessages: ClineMessage[] = []
if (this.viewingAgentTaskId) {
	// Viewing agent task: use history messages
	clineMessages = currentTaskItem?.clineMessages || []
} else {
	// User task: use real-time messages
	clineMessages = currentTask?.clineMessages || []
}
```

**关键点**:

- 查看时不影响任务执行
- 只读模式，避免触发交互逻辑
- 支持查看正在执行和已完成的智能体任务

---

## 任务清理机制

### 1. 统一清理函数

处理所有智能体任务结束场景（完成、中止、异常）：

```typescript
const cleanupAgentTask = async (taskId: string, reason: string) => {
	if (!instance.agentTaskContext || !this.agentTaskPool.has(taskId)) {
		return
	}

	// Save final messages to TaskHistory
	if (instance.historyItem && instance.clineMessages.length > 0) {
		const historyItemWithMessages = {
			...instance.historyItem,
			clineMessages: instance.clineMessages, // 🔥 手动添加消息
		}
		await this.updateTaskHistory(historyItemWithMessages)
	}

	// Remove from pool
	this.agentTaskPool.delete(taskId)

	// Clear viewing state if viewing this task
	if (this.viewingAgentTaskId === taskId) {
		this.viewingAgentTaskId = null
	}
}
```

### 2. 事件监听

```typescript
const onTaskCompleted = async (taskId: string, tokenUsage: any, toolUsage: any) => {
	await cleanupAgentTask(taskId, "TaskCompleted")
	this.emit(RooCodeEventName.TaskCompleted, taskId, tokenUsage, toolUsage)
}

const onTaskAborted = async () => {
	await cleanupAgentTask(instance.taskId, "TaskAborted")
	this.emit(RooCodeEventName.TaskAborted, instance.taskId)
}
```

**覆盖场景**:

- ✅ TaskCompleted - 任务正常完成
- ✅ TaskAborted - 任务被中止
- ✅ 异常终止 - 任务执行出错

---

## 关键文件修改

### 1. ClineProvider.ts

**新增字段**:

```typescript
private agentTaskPool: Map<string, Task> = new Map()
private viewingAgentTaskId: string | null = null
```

**核心方法**:

- `addClineToStack()` - 任务路由
- `postMessageToWebview()` - 消息路由
- `getCurrentCline()` - 获取当前任务（支持查看智能体任务）
- `getCurrentUserTask()` - 获取当前用户任务
- `showTaskWithId()` - 激活任务查看
- `getStateToPostToWebview()` - 获取 UI 状态
- `cleanupAgentTask()` - 统一清理函数

### 2. Task.ts

**核心逻辑**:

- `ask()` - 智能体任务自动响应
- `saveClineMessages()` - 跳过智能体任务的频繁更新
- `abortTask()` - 智能体任务完成时更新 TaskHistory

### 3. webviewMessageHandler.ts

**用户操作路由**:

- `askResponse` → `getCurrentUserTask()`
- `terminalOperation` → `getCurrentUserTask()`
- `clearTask` → `getCurrentUserTask()`
- 确保用户操作不影响查看中的智能体任务

---

## 数据流图

### 用户任务流程

```
用户输入 → ClineProvider.initClineWithTask()
         → addClineToStack() → clineStack.push()
         → task.startTask()
         → task.ask() → 等待用户响应
         → 用户点击批准 → task.handleWebviewAskResponse()
         → 继续执行
         → task.completion_result → 任务完成
         → 实时更新 TaskHistory
```

### 智能体任务流程

```
IM 消息 → VoidBridge.onIMMessage()
        → ClineProvider.initClineWithTask(agentTaskContext)
        → addClineToStack() → agentTaskPool.set()
        → task.startTask() (异步)
        → task.ask() → 自动响应（无等待）
        → 继续执行
        → task.completion_result → 任务完成
        → onTaskCompleted() → cleanupAgentTask()
        → 批量保存 TaskHistory（包含 clineMessages）
        → 从 agentTaskPool 移除
```

### 查看智能体任务流程

```
用户点击历史 → TaskItem.onClick()
            → vscode.postMessage({ type: "showTaskWithId", text: taskId })
            → ClineProvider.showTaskWithId()
            → 从 TaskHistory 获取任务信息
            → 判断 source === "agent"
            → 设置 viewingAgentTaskId = taskId
            → postStateToWebview()
            → getStateToPostToWebview()
            → 从 taskHistory 获取 clineMessages（历史消息）
            → UI 显示只读历史
```

---

## 设计原则

### 1. 稳定性优先（Stability First）

- 用户任务保持原有逻辑不变
- 智能体任务作为新增功能，不影响现有流程
- 消息路由采用黑名单模式，默认不拦截

### 2. 性能优化（Performance Optimization）

- 智能体任务减少 TaskHistory 更新频率
- 跳过智能体任务的 `postStateToWebview` 调用
- 任务完成时批量保存数据

### 3. 隔离性（Isolation）

- 用户任务和智能体任务完全隔离
- 智能体任务不干扰 UI
- 查看智能体任务不影响其执行

### 4. KISS 原则（Keep It Simple, Stupid）

- 简单明了的任务路由逻辑
- 统一的清理函数
- 黑名单模式易于维护

---

## 常见问题排查

### 1. 智能体任务干扰 UI

**现象**: 智能体任务的消息显示在用户界面

**排查**:

1. 检查 `postMessageToWebview` 的 `taskRelatedTypes` 黑名单
2. 添加该消息类型到黑名单
3. 重新编译测试

### 2. 智能体任务无法查看

**现象**: 点击任务历史无响应或显示 0 条消息

**排查**:

1. 检查 `cleanupAgentTask` 是否正确保存 `clineMessages`
2. 检查 `taskMetadata` 返回的 `historyItem` 是否包含消息
3. 查看日志：`Updating TaskHistory with X messages`

### 3. 智能体任务循环执行

**现象**: 任务完成后继续执行

**排查**:

1. 检查 `onTaskCompleted` 是否正确触发
2. 检查任务是否从 `agentTaskPool` 移除
3. 检查 `completion_result` 的自动响应逻辑

### 4. 用户操作影响智能体任务

**现象**: 查看智能体任务后，任务被中断或行为异常

**排查**:

1. 检查用户操作是否路由到 `getCurrentUserTask()`
2. 检查 `viewingAgentTaskId` 是否正确设置和清除
3. 检查查看时是否使用历史消息而非实时消息

---

## 后续优化方向

1. **任务池容量管理**: 限制并行任务数量，防止资源耗尽
2. **任务优先级**: 支持智能体任务优先级调度
3. **任务监控**: 添加任务执行状态监控面板
4. **错误恢复**: 智能体任务异常时的自动重试机制
5. **增量保存**: 支持智能体任务的增量消息保存

---

## 版本历史

- **v1.0** (2025-10-12): 初始架构实现
    - 双轨任务管理
    - 消息路由黑名单模式
    - 智能体任务自动响应
    - 任务查看机制
    - 统一清理机制
