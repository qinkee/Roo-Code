# 任务栈 LIFO 架构设计文档

## 概述

Roo-Code 支持两种任务执行模式：
- **用户任务**：UI 触发，单栈串行执行
- **智能体任务**：后台执行，多栈并发执行（LIFO）

## 核心数据结构

```typescript
// ClineProvider.ts
class ClineProvider {
    // 用户任务：单栈
    private clineStack: Task[] = []

    // 智能体任务：多栈池（每个根任务一个栈）
    private agentTaskPool: Map<string, Task[]> = new Map()
}
```

## 关键机制

### 1. 任务完成路由

**核心方法**：`finishSubTask(lastMessage: string, task?: Task)`

```typescript
async finishSubTask(lastMessage: string, task?: Task) {
    const targetTask = task || this.getCurrentCline()

    if (targetTask?.agentTaskContext) {
        // 智能体任务 → LIFO 栈逻辑
        await this.finishAgentSubTask(lastMessage, targetTask)
    } else {
        // 用户任务 → 传统单栈逻辑
        await this.removeClineFromStack()
        await this.getCurrentUserTask()?.resumePausedTask(lastMessage)
    }
}
```

### 2. 智能体任务 LIFO 流程

```
1. 父任务调用 new_task 工具
   ├─ 创建子任务
   ├─ 推入栈：agentTaskPool[rootId].push(childTask)
   └─ 设置父任务：parentTask.isPaused = true

2. 父任务进入等待
   └─ waitForResume() 轮询检查 isPaused

3. 子任务完成
   ├─ attemptCompletionTool 调用
   ├─ 设置 childTask.shouldEndLoop = true
   └─ 调用 finishSubTask(result, childTask) ⚠️ 必须传递 task

4. finishAgentSubTask 处理
   ├─ 从栈弹出：stack.pop()
   ├─ 获取父任务：parentTask = stack[stack.length - 1]
   └─ 调用 parentTask.resumePausedTask(result)

5. 父任务恢复
   ├─ 设置 isPaused = false
   ├─ 添加子任务结果到会话历史
   └─ waitForResume() 退出，继续执行
```

### 3. 关键修复：传递 task 参数

**问题**：
```typescript
// ❌ 错误：不传 task 参数
await provider.finishSubTask(result)
// getCurrentCline() 在多栈环境下可能返回错误任务
```

**解决**：
```typescript
// ✅ 正确：传递明确的 task 实例
await provider.finishSubTask(result, cline)
// 精确路由到对应的任务栈
```

**原因**：
- 用户任务：单栈，`getCurrentCline()` 总是返回正确的栈顶任务
- 智能体任务：多栈并发，`getCurrentCline()` 无法确定返回哪个栈的任务
- **解决方案**：显式传递 `task` 参数，确保路由到正确的栈

## 执行模型对比

| 特性 | 用户任务 | 智能体任务 |
|------|---------|-----------|
| 数据结构 | 单栈 `Task[]` | 多栈池 `Map<rootId, Task[]>` |
| 并发模型 | 串行执行 | 并发执行（每个根任务一个栈） |
| 栈管理 | FIFO 推入/移除 | LIFO 推入/弹出 |
| 任务识别 | `getCurrentCline()` | **必须传递 task 引用** |
| 父任务暂停 | `isPaused + waitForResume()` | 同左 |
| 子任务完成 | `removeClineFromStack()` | `stack.pop() + resumePausedTask()` |

## 关键代码位置

| 功能 | 文件 | 行号 |
|------|------|------|
| 任务完成路由 | `ClineProvider.ts` | ~573 |
| 智能体子任务完成 | `ClineProvider.ts` | ~589 |
| 父任务恢复 | `Task.ts` | ~1469 |
| 暂停等待 | `Task.ts` | ~1917 |
| attempt_completion 调用 | `attemptCompletionTool.ts` | ~106-126 |
| new_task 工具 | `newTaskTool.ts` | ~11-128 |

## 调试日志关键标记

```
🎯 Called for task          - finishAgentSubTask 被调用
🔥 Popped completed task     - 子任务从栈弹出
🚀 Calling resumePausedTask  - 开始恢复父任务
✅ Set isPaused=false        - 父任务暂停标志清除
⏸️  Paused                   - 父任务进入暂停
▶️  Resumed                  - 父任务恢复执行
🔄 Parent task will continue - 父任务即将继续
```

## 注意事项

1. **所有调用 `finishSubTask` 的地方必须传递 `task` 参数**
2. 子任务完成时设置 `shouldEndLoop = true` 仅影响子任务自己（Task 实例隔离）
3. 父任务的 `waitForResume()` 通过轮询 `isPaused` 标志实现暂停/恢复
4. `resumePausedTask` 负责添加子任务结果到父任务的会话历史

---

**最后更新**：2025-10-18
**相关 Issue**：子任务完成后未能返回结果给父任务并继续执行
