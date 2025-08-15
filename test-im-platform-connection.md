# IM Platform MCP 连接测试指南

## 问题诊断步骤

### 1. 检查 im-platform-mcp 包是否安装
```bash
ls -la node_modules/im-platform-mcp/
```

### 2. 验证脚本路径
```bash
ls -la src/node_modules/im-platform-mcp/dist/index.js
```

### 3. 检查 VSCode 配置
打开 VSCode 设置，搜索 `imPlatformTokenKey`，确保已设置 TokenKey

### 4. 查看输出日志
1. 打开 VSCode 输出面板 (View > Output)
2. 选择 "Roo Code" 频道
3. 查找以下日志：
   - `[IM Platform MCP]` 开头的日志
   - `[McpHub]` 开头的日志
   - 任何错误信息

### 5. 测试连接
1. 打开命令面板 (Cmd+Shift+P 或 Ctrl+Shift+P)
2. 运行 "Roo Code: Manage IM Platform Token"
3. 确认 TokenKey 已设置
4. 重新加载窗口 (Developer: Reload Window)

## 常见问题及解决方案

### 问题 1: Script file not found
**错误信息**: `[IM Platform MCP] Script file not found at ...`

**解决方案**:
```bash
cd src
pnpm install im-platform-mcp
```

### 问题 2: TokenKey not found
**错误信息**: `[IM Platform MCP] TokenKey not found`

**解决方案**:
1. 通过命令面板设置 TokenKey: "Roo Code: Set IM Platform Token"
2. 或通过环境变量设置:
   ```bash
   export IM_PLATFORM_TOKEN_KEY="your-token-key"
   code .
   ```

### 问题 3: Connection closed
**错误信息**: `MCP error -32000: Connection closed`

**可能原因**:
1. TokenKey 无效
2. 网络连接问题
3. API 服务器不可用

**解决方案**:
1. 验证 TokenKey 是否正确
2. 检查网络连接
3. 确认 API URL 是否正确 (https://aiim.service.thinkgs.cn/api)

### 问题 4: 初始化顺序问题
如果在扩展启动时连接失败，尝试：
1. 重新加载窗口: Developer: Reload Window
2. 手动重启连接（如果有相关命令）

## 调试模式

要启用详细日志，可以在 McpHub.ts 中添加更多日志：

```typescript
console.log("[IM Platform MCP] Initialization state:", {
  hasTokenKey: !!tokenKey,
  scriptExists: fs.existsSync(mcpScriptPath),
  config: builtinConfig
});
```

## 验证成功标志

连接成功时，你应该看到：
1. `[IM Platform MCP] TokenKey found in ...`
2. `[IM Platform MCP] TokenKey injected into environment`
3. MCP 服务器在 MCP 面板中显示为 "connected" 状态
4. 可以成功调用 IM Platform 的工具（如 login, get_friend_list 等）