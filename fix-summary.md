# API请求加载状态修复总结

## 问题原因

API请求完成后，UI仍显示"API请求..."的加载状态。原因是后台任务 `drainStreamInBackgroundToFindAllUsage` 在收集token使用信息时可能失败，导致 `cost` 字段永远不会被添加到消息中。

## 修复内容

### 1. 增强错误处理 (src/core/task/Task.ts 第1891-1903行)

在 `drainStreamInBackgroundToFindAllUsage` 的错误处理中，即使收集使用信息失败，也要更新消息状态：

```typescript
drainStreamInBackgroundToFindAllUsage(lastApiReqIndex).catch((error) => {
	console.error("Background usage collection failed:", error)

	// 确保至少更新消息以停止加载状态
	updateApiReqMsg()
	this.saveClineMessages()
		.then(() => {
			const apiReqMessage = this.clineMessages[lastApiReqIndex]
			if (apiReqMessage) {
				this.updateClineMessage(apiReqMessage)
			}
		})
		.catch((err) => console.error("Failed to update message after usage collection error:", err))
})
```

### 2. 添加调试日志 (第1775-1781行 和 第1798行)

添加了日志以便追踪使用信息的收集和更新过程：

```typescript
console.log("[Usage Collection] Updating usage data:", {
	input: tokens.input,
	output: tokens.output,
	cacheWrite: tokens.cacheWrite,
	cacheRead: tokens.cacheRead,
	total: tokens.total,
})

// ...更新后...
console.log("[Usage Collection] Message updated in webview")
```

## 测试验证

- ✅ 类型检查通过 (`npm run check-types`)
- ✅ Lint检查通过 (`npm run lint`)

## 如何验证修复效果

1. **开发者控制台查看日志**：

    - 查看是否有 "Background usage collection failed" 错误
    - 查看 "[Usage Collection]" 相关日志

2. **测试场景**：
    - 正常的API请求应该显示费用
    - 如果后台任务失败，应该至少停止加载动画
    - 错误情况下不应该永久卡在加载状态

## 后续改进建议

1. **更可靠的使用信息收集**：

    - 考虑使用 Promise.race 设置超时
    - 在主流程中等待关键信息而不是完全异步

2. **前端超时处理**：

    - 如果超过一定时间没有收到cost信息，自动停止加载状态
    - 显示"使用信息不可用"而不是持续加载

3. **更好的错误恢复**：
    - 在失败时至少设置 cost 为 0
    - 添加重试机制
