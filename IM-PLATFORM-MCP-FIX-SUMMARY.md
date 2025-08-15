# IM Platform MCP 连接问题修复总结

## 问题描述

1. IM Platform MCP 服务器启动成功后立即关闭（显示 "Shutting down IM Platform MCP Server..."）
2. 内置的 IM Platform 服务器被删除后无法恢复

## 根本原因

问题出在 `updateServerConnections` 方法中：

- 当 `initializeGlobalMcpServers()` 读取全局配置文件时
- 如果配置文件中没有 "im-platform" 配置
- `updateServerConnections` 会删除所有不在配置文件中的服务器
- 这导致刚刚创建的内置 "im-platform" 服务器被立即删除

## 解决方案

### 1. 保护内置服务器不被删除

在 `updateServerConnections` 方法中添加保护逻辑：

```typescript
// Delete removed servers (but protect built-in servers)
for (const name of currentNames) {
	if (!newNames.has(name)) {
		// Don't delete built-in servers
		if (name === "im-platform") {
			console.log(`[IM Platform MCP] Skipping deletion of built-in server: ${name}`)
			continue
		}
		await this.deleteConnection(name, source)
	}
}
```

### 2. 防止用户配置覆盖内置服务器

```typescript
// Skip built-in servers to prevent user configs from overriding them
if (name === "im-platform" && source === "global") {
	console.log(`[IM Platform MCP] Skipping user config for built-in server: ${name}`)
	continue
}
```

### 3. 防止内置服务器被用户删除

```typescript
public async deleteServer(serverName: string, source?: "global" | "project"): Promise<void> {
    // Prevent deletion of built-in servers
    if (serverName === "im-platform") {
        console.warn(`[IM Platform MCP] Cannot delete built-in server: ${serverName}`)
        await this.deleteConnection(serverName, source)
        vscode.window.showWarningMessage("内置的 IM Platform 服务器无法删除，已断开连接。重新加载窗口可恢复。")
        return
    }
    // ... rest of the deletion logic
}
```

### 4. 自动重连断开的内置服务器

在 `initializeBuiltinServers` 中添加重连逻辑：

```typescript
if (existingConnection.server.status === "disconnected") {
	console.log(`[IM Platform MCP] Attempting to reconnect ${name}...`)
	try {
		await this.restartConnection(name, "global")
		console.log(`[IM Platform MCP] Successfully reconnected ${name}`)
	} catch (reconnectError) {
		console.error(`[IM Platform MCP] Failed to reconnect ${name}:`, reconnectError)
	}
}
```

## 初始化流程

正确的初始化顺序：

1. **构造函数**：调用 `initializeAllServers()`
2. **initializeAllServers()**：
    - 先调用 `initializeBuiltinServers()` - 创建内置的 im-platform 服务器
    - 再调用 `initializeGlobalMcpServers()` - 加载用户配置（跳过 im-platform）
    - 最后调用 `initializeProjectMcpServers()` - 加载项目配置

## 测试验证

1. **正常启动**：IM Platform MCP 应该自动连接并保持连接
2. **删除测试**：尝试删除 im-platform 服务器时，应显示警告消息
3. **重新加载**：重新加载窗口后，im-platform 应自动恢复
4. **配置冲突**：即使用户在配置文件中添加 im-platform，内置版本应优先

## 日志输出

成功运行时应看到：

```
[IM Platform MCP] Initializing built-in server: im-platform
[IM Platform MCP] TokenKey found in VSCode configuration
[IM Platform MCP] Successfully connected to im-platform
Server "im-platform" stderr: IM Platform MCP Server started successfully
```

而不应该看到：

```
Server "im-platform" stderr: Shutting down IM Platform MCP Server...
```
