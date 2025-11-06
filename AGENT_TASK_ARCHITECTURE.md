# 智能体任务架构文档

## 🏗️ 核心架构设计

### 两套独立的任务管理系统
    
```
┌─────────────────────────────────────────────────────────────┐
│                      ClineProvider                          │
│                                                             │
│  ┌────────────────────┐        ┌─────────────────────────┐ │
│  │   clineStack       │        │   agentTaskPool         │ │
│  │   (用户任务栈)      │        │   (智能体任务池)         │ │
│  ├────────────────────┤        ├─────────────────────────┤ │
│  │ Task[]             │        │ Map<rootId, Task[]>     │ │
│  │ - 单栈LIFO         │        │ - 多栈并行执行           │ │
│  │ - UI可见           │        │ - 后台运行              │ │
│  │ - 串行执行          │        │ - 每个根任务独立栈       │ │
│  │ - 用户主动触发      │        │ - IM/A2A触发           │ │
│  └────────────────────┘        └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 任务类型判断逻辑（Task构造函数）

```typescript
// Task.ts:461-490
if (historyItem) {
    // 🔥 从历史加载：使用 historyItem.source（绝对权威）
    this.isAgentTask = historyItem.source === "agent"
    this.agentTaskId = historyItem.agentId
} else {
    // 新任务：根据参数判断类型
    if (agentTaskContext) {
        // 后台智能体任务：IM/A2A调用
        this.isAgentTask = true
        this.agentTaskId = agentTaskContext.agentId
    } else if (isAgentTaskParam && agentTaskIdParam) {
        // 调试智能体任务：UI触发，在clineStack执行
        this.isAgentTask = true
        this.agentTaskId = agentTaskIdParam
    } else {
        // 用户任务
        this.isAgentTask = false
        this.agentTaskId = undefined
    }
}
```

## 🔄 任务添加流程（addClineToStack）

```
Task创建
    ↓
检查 task.agentTaskContext
    ↓
    ├─ YES (智能体任务) ──────────────────────────┐
    │                                           │
    │  确定rootTaskId                            │
    │  rootTaskId = task.rootTask?.taskId       │
    │             || task.taskId               │
    │      ↓                                    │
    │  获取/创建任务栈                            │
    │  stack = agentTaskPool.get(rootTaskId)   │
    │  if (!stack) {                           │
    │      stack = []                          │
    │      agentTaskPool.set(rootTaskId, stack)│
    │      if (是根任务) task.rootTask = task   │
    │  }                                       │
    │      ↓                                    │
    │  推入栈                                    │
    │  stack.push(task)                        │
    │      ↓                                    │
    │  发出TaskFocused事件                       │
    │  task.emit(TaskFocused)                  │
    │      ↓                                    │
    │  异步执行准备任务                           │
    │  performPreparationTasks(task)           │
    │      ↓                                    │
    │  return（不添加到clineStack）              │
    │                                           │
    └─ NO (用户任务) ─────────────────────────────┤
                                              │
       清除viewingAgentTaskId = null           │
              ↓                                │
       推入用户任务栈                            │
       clineStack.push(task)                   │
              ↓                                │
       发出TaskFocused事件                      │
       task.emit(TaskFocused)                  │
              ↓                                │
       同步执行准备任务                          │
       await performPreparationTasks(task)     │
              ↓                                │
       验证状态                                 │
       await getState()                        │
```

## 🗑️ 任务清理流程（cleanupAgentTask）

```
任务完成/中止
    ↓
触发 cleanupAgentTask(task, reason)
    ↓
确定rootTaskId
    ↓
获取任务栈
stack = agentTaskPool.get(rootTaskId)
    ↓
保存任务历史
TaskHistory.updateTaskHistory(...)
    ↓
从栈中移除任务
index = stack.indexOf(task)
stack.splice(index, 1)
    ↓
检查栈是否为空
    ├─ 空 ─→ 删除整个栈
    │        agentTaskPool.delete(rootTaskId)
    │
    └─ 非空 ─→ 保留栈，继续执行父任务
    ↓
清除查看状态（如果正在查看此任务）
if (viewingAgentTaskId === taskId)
    viewingAgentTaskId = null
```

## 🎯 智能体任务关键数据结构

### AgentTaskContext（agentTaskContext）
```typescript
{
    agentId: string          // 智能体ID
    streamId: string         // IM流ID
    mode: string             // 智能体mode配置
    roleDescription?: string // 智能体角色描述
    imMetadata: {           // IM元数据
        sendId: number
        recvId: number
        senderTerminal: number
        targetTerminal: number
        chatType: number
    }
}
```

### Task池结构（agentTaskPool）
```typescript
Map<rootTaskId, Task[]>

示例：
{
    "task-root-1": [
        Task(id=task-root-1, parent=null),      // 根任务
        Task(id=task-child-1, parent=task-root-1) // 子任务
    ],
    "task-root-2": [
        Task(id=task-root-2, parent=null)       // 另一个根任务
    ]
}
```

## 🚨 关键约束

### 1. 必须调用 addClineToStack
```typescript
// ❌ 错误：直接创建Task但不添加到池
const task = new Task({ agentTaskContext: {...} })
// 任务不在agentTaskPool中，无法管理！

// ✅ 正确：创建后添加到池
const task = new Task({ agentTaskContext: {...}, startTask: false })
await provider.addClineToStack(task)
// 任务被添加到agentTaskPool，可以正确管理
```

### 2. 必须设置 rootTask
```typescript
// 根任务（第一级）
const rootTask = new Task({
    agentTaskContext: {...},
    rootTask: undefined,    // 根任务没有rootTask
    parentTask: undefined   // 根任务没有parentTask
})
// addClineToStack会自动设置: task.rootTask = task

// 子任务
const childTask = new Task({
    agentTaskContext: {...},
    rootTask: rootTask,     // ✅ 必须指向根任务
    parentTask: parentTask  // ✅ 必须指向父任务
})
```

### 3. 智能体任务vs调试任务
```typescript
// 后台智能体任务（IM/A2A调用）
// → 添加到 agentTaskPool
// → 后台执行，UI不可见（除非主动查看）
new Task({
    agentTaskContext: { agentId, streamId, ... }  // ✅ 有agentTaskContext
})

// 调试智能体任务（UI触发）
// → 添加到 clineStack
// → 前台执行，UI可见
new Task({
    isAgentTask: true,        // ✅ 标记为智能体任务
    agentTaskId: agentId,     // ✅ 智能体ID
    // ❌ 没有agentTaskContext
})
```

## 🔧 配置隔离原则

### 每个智能体任务必须有独立的API配置

```typescript
// ✅ 正确：每个任务使用独立配置
const agentApiConfiguration = { ...agentConfig.apiConfig }

const task = new Task({
    provider,
    apiConfiguration: agentApiConfiguration,  // 独立配置
    agentTaskContext: {...}
})
```

### 不能修改全局provider配置

```typescript
// ❌ 错误：污染全局配置
await provider.contextProxy.setProviderSettings(agentConfig.apiConfig)
const task = await provider.initClineWithTask(...)
// 全局配置被修改，影响其他任务！

// ✅ 正确：使用独立配置
const agentApiConfiguration = { ...agentConfig.apiConfig }
const task = new Task({
    apiConfiguration: agentApiConfiguration  // 不修改全局
})
```

## 📋 UI查看智能体任务流程

```
用户点击查看智能体任务
    ↓
设置 viewingAgentTaskId = taskId
    ↓
postStateToWebview()
    ↓
UI显示智能体任务的消息历史
    ↓
智能体任务继续在后台运行
（消息通过增量更新发送到UI）
```

## 🎬 完整流程示例：IM调用智能体

```
1. IM消息到达
   extension.ts: onLLMStreamRequest()
   ↓
2. 准备任务参数
   prepareAgentTask(data, provider)
   → 提取agentId, streamId, message
   → 获取agentConfig
   ↓
3. 准备独立API配置
   agentApiConfiguration = { ...agentConfig.apiConfig }
   ↓
4. 创建Task实例
   task = new Task({
       provider,
       apiConfiguration: agentApiConfiguration,  // 独立配置
       task: message,
       agentTaskContext: {
           agentId, streamId, mode, imMetadata
       },
       rootTask: undefined,    // 根任务
       parentTask: undefined,
       startTask: false        // 手动控制启动
   })
   ↓
5. 添加到任务池
   await provider.addClineToStack(task)
   → 检测到agentTaskContext
   → 创建新栈: agentTaskPool.set(task.taskId, [task])
   → 设置rootTask: task.rootTask = task
   → 异步执行准备任务
   ↓
6. 手动启动任务（在设置完其他配置后）
   await task.startTask(message, [])
   ↓
7. 任务执行
   → 使用独立的API配置调用LLM
   → 生成响应消息
   → 通过IM流式发送
   ↓
8. 任务完成
   → 触发TaskCompleted事件
   → cleanupAgentTask(task, "completed")
   → 保存历史消息
   → 从agentTaskPool移除
```

## ⚠️ 常见错误

### 错误1：不调用addClineToStack
```typescript
// ❌ 任务不在池中，无法管理
const task = new Task({ agentTaskContext: {...} })

// ✅ 必须添加到池
const task = new Task({ agentTaskContext: {...}, startTask: false })
await provider.addClineToStack(task)
```

### 错误2：修改全局配置
```typescript
// ❌ 污染全局配置
await provider.contextProxy.setProviderSettings(config)

// ✅ 使用独立配置
const task = new Task({ apiConfiguration: {...} })
```

### 错误3：startTask时机错误
```typescript
// ❌ 在addClineToStack之前启动
const task = new Task({ startTask: true })
await provider.addClineToStack(task)  // 太晚了

// ✅ 先添加到池，再启动
const task = new Task({ startTask: false })
await provider.addClineToStack(task)
// 设置其他配置...
await task.startTask(message, [])
```

## 📝 总结

**关键要点**：
1. ✅ 智能体任务必须通过`addClineToStack`添加到`agentTaskPool`
2. ✅ 每个智能体任务使用独立的API配置，不修改全局
3. ✅ 根任务的`rootTask`指向自己，由`addClineToStack`自动设置
4. ✅ 子任务的`rootTask`和`parentTask`必须正确设置
5. ✅ `startTask: false`延迟启动，先设置配置再启动

**基础设施保护**：
- ✅ `agentTaskPool`：智能体任务并行执行池
- ✅ `clineStack`：用户任务串行执行栈
- ✅ `viewingAgentTaskId`：UI查看状态管理
- ✅ `cleanupAgentTask`：任务清理和历史保存
- ✅ `performPreparationTasks`：任务准备（如LM Studio模型加载）
