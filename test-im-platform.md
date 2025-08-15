# IM Platform MCP 集成测试指南

## 测试准备

### 1. 安装 im-platform-mcp
确保已经全局安装了 `im-platform-mcp` 包：
```bash
npm install -g im-platform-mcp
```

### 2. 设置 TokenKey

#### 方法 A: 使用环境变量
```bash
export IM_PLATFORM_TOKEN_KEY="your-test-token-key"
code /path/to/roo-code
```

#### 方法 B: 使用 VSCode 设置
1. 打开 VSCode 设置 (Cmd+, 或 Ctrl+,)
2. 搜索 `roo-cline.imPlatformTokenKey`
3. 输入您的测试 TokenKey

## 测试步骤

### 1. 构建并运行项目
```bash
# 在项目根目录
pnpm install
pnpm build

# 运行开发版本
cd src
pnpm watch:bundle
```

### 2. 验证内置配置加载
1. 打开 VSCode 开发主机 (F5)
2. 打开 Roo Code 侧边栏
3. 点击 MCP 服务器图标查看服务器列表
4. 应该能看到 `im-platform-local` 服务器

### 3. 检查 TokenKey 传递
1. 在 VSCode 终端查看日志
2. 搜索包含 `im-platform-local` 的日志
3. 确认环境变量 `IM_TOKEN_KEY` 已正确设置

### 4. 测试工具调用
在 Roo Code 对话中输入：
```
使用 im-platform-local 服务器的 login 工具进行测试
```

### 5. 验证环境变量
可以在 McpHub.ts 的 connectToServer 方法中添加调试日志：
```typescript
if (name === "im-platform-local") {
    console.log("IM Platform Token Key:", tokenKey ? "Set" : "Not Set");
    console.log("Environment:", configInjected.env);
}
```

## 故障排查

### 问题 1: 找不到 im-platform-local 服务器
- 检查 `initializeBuiltinServers` 方法是否被调用
- 确认 MCP 功能已启用

### 问题 2: TokenKey 未传递
- 检查环境变量设置
- 验证 VSCode 配置项
- 查看 `getImPlatformTokenKey` 方法的返回值

### 问题 3: 连接失败
- 确认 `npx im-platform-mcp` 命令可用
- 检查 IM_API_BASE_URL 是否可访问
- 查看错误日志

## 期望结果

1. ✅ im-platform-local 服务器自动出现在 MCP 服务器列表中
2. ✅ TokenKey 从配置源正确读取
3. ✅ 环境变量 IM_TOKEN_KEY 传递给 MCP 服务
4. ✅ 工具调用时 TokenKey 可用
5. ✅ 无需手动配置 MCP 文件

## 日志位置

- VSCode 开发者工具: Help > Toggle Developer Tools
- 输出面板: View > Output > 选择 "Roo Code"
- 扩展主机日志: 查看调试控制台