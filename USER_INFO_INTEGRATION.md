# UserInfo Integration Guide - 用户信息集成指南

## 概述

本文档说明如何从ShadanAI-Workbench或其他VSCode插件接收用户信息(userInfo)和访问令牌(accessToken/tokenKey)，并自动设置到Roo-Code的OpenAI API Key配置中。

## 功能实现

### 1. 命令接口

Roo-Code提供了以下命令来接收外部插件的用户信息：

- **命令ID**: `roo-cline.receiveUserInfo`
- **参数格式**:
    ```typescript
    {
      userInfo?: {
        tokenKey?: string,
        accessToken?: string,
        // 其他用户信息字段
      },
      accessToken?: string,
      tokenKey?: string
    }
    ```

### 2. 调用方式

#### 从ShadanAI-Workbench调用

在ShadanAI-Workbench中，当用户登录成功后，可以通过以下方式将token发送到Roo-Code：

```javascript
// 在ShadanAI-Workbench登录成功后
window.vscodeServices?.get("IUserStateService").login(userInfo, data.accessToken)

// 同时发送到Roo-Code
vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
	userInfo: userInfo,
	accessToken: data.accessToken,
	tokenKey: data.tokenKey,
})
```

#### 从其他VSCode插件调用

```javascript
// 方式1: 直接传递token
vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
	tokenKey: "your-api-token-here",
})

// 方式2: 传递完整的userInfo对象
vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
	userInfo: {
		tokenKey: "your-api-token",
		userName: "user@example.com",
		// 其他用户信息
	},
})

// 方式3: 同时传递多个token字段（优先级：tokenKey > accessToken）
vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
	tokenKey: "primary-token",
	accessToken: "fallback-token",
})
```

## 数据流程

1. **接收数据**: 外部插件通过VSCode命令系统发送用户信息
2. **提取Token**: 按以下优先级提取token：
    - `data.tokenKey`
    - `data.accessToken`
    - `data.userInfo.tokenKey`
    - `data.userInfo.accessToken`
3. **更新Webview**: 发送`tokenKeyReceived`消息到webview
4. **更新配置**: 将token保存到全局配置的`openAiApiKey`字段
5. **UI更新**: OpenAICompatible组件自动更新显示新的API Key

## 实现细节

### 涉及的文件

1. **命令注册**:

    - `src/package.json` - 命令定义
    - `packages/types/src/vscode.ts` - 命令ID类型
    - `src/activate/registerCommands.ts` - 命令处理逻辑

2. **消息处理**:
    - `src/shared/ExtensionMessage.ts` - 消息类型定义
    - `webview-ui/src/components/settings/providers/OpenAICompatible.tsx` - UI组件

### 消息格式

发送到webview的消息格式：

```typescript
{
    type: "tokenKeyReceived",
    tokenKey: string,
    source: "ai-im",
    timestamp: number
}
```

## 集成示例

### 完整的集成示例

```javascript
// 在ShadanAI-Workbench或其他插件中

async function handleUserLogin(loginData) {
	try {
		// 1. 处理自己的登录逻辑
		const userInfo = await processLogin(loginData)

		// 2. 发送到Roo-Code
		const commandExists = await vscode.commands
			.getCommands()
			.then((commands) => commands.includes("roo-cline.receiveUserInfo"))

		if (commandExists) {
			await vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
				userInfo: userInfo,
				tokenKey: loginData.tokenKey,
				accessToken: loginData.accessToken,
			})

			console.log("Token successfully sent to Roo-Code")
		}
	} catch (error) {
		console.error("Failed to send token to Roo-Code:", error)
	}
}
```

## 测试方法

1. **手动测试**:

    ```javascript
    // 在VSCode命令面板中执行
    vscode.commands.executeCommand("roo-cline.receiveUserInfo", {
    	tokenKey: "test-token-123456",
    })
    ```

2. **验证结果**:
    - 打开Roo-Code侧边栏
    - 进入Settings页面
    - 检查OpenAI Compatible部分的API Key字段
    - 应该显示接收到的token（密码字段形式）

## 注意事项

1. **安全性**: Token以密码形式存储和显示，不会以明文形式暴露
2. **优先级**: 如果同时提供多个token字段，将按优先级选择第一个非空值
3. **持久化**: Token会自动保存到VSCode的全局配置中
4. **通知**: 成功接收token后会显示通知消息
5. **日志**: 操作日志会记录在输出通道中（敏感信息会被截断）

## 故障排除

### 常见问题

1. **Token未更新**:

    - 确保Roo-Code插件已激活
    - 确保侧边栏或标签页已打开
    - 检查输出通道的日志信息

2. **命令不存在**:

    - 确保Roo-Code插件版本支持此功能
    - 重新加载VSCode窗口

3. **数据格式错误**:
    - 确保传递的参数符合上述格式要求
    - 检查token字段名称是否正确

## 扩展建议

未来可以扩展此功能以支持：

1. 更多的认证信息（如baseURL、modelId等）
2. 多个API provider的配置
3. 用户配置文件的完整同步
4. 双向通信机制

## 联系支持

如有问题或建议，请联系开发团队或提交Issue到项目仓库。
