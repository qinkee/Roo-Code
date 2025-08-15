# 外部插件集成说明

## 功能说明

本插件已实现接收外部VSCode插件发送的数据功能，特别是接收API Key并自动设置到OpenAI Compatible provider的配置中。

## 使用方法

### 从外部插件发送数据

外部插件可以通过以下方式向Roo Code插件发送数据：

```javascript
// 在外部插件中执行以下代码
vscode.commands.executeCommand("roo-cline.receiveExternalData", {
	apiKey: "your-api-key-here",
})
```

### 示例：在Webview中发送数据

如果外部插件使用Webview，可以通过以下方式发送：

```javascript
// 在外部插件的webview中
const vscode = acquireVsCodeApi()

// 先从webview发送到外部插件的extension
vscode.postMessage({
	command: "sendToRooCode",
	apiKey: "your-api-key-here",
})

// 然后在外部插件的extension中处理并转发
panel.webview.onDidReceiveMessage((message) => {
	switch (message.command) {
		case "sendToRooCode":
			// 调用Roo Code的命令
			vscode.commands.executeCommand("roo-cline.receiveExternalData", {
				apiKey: message.apiKey,
			})
			break
	}
})
```

## 功能实现详情

### 1. 命令注册

- 命令ID: `roo-cline.receiveExternalData`
- 位置: `src/activate/registerCommands.ts`

### 2. 数据流程

1. 外部插件通过VSCode命令系统发送数据
2. Roo Code接收数据并验证
3. 通过postMessage发送到webview
4. OpenAICompatible组件接收并更新API Key字段

### 3. 涉及的文件

- `src/package.json` - 命令定义
- `src/activate/registerCommands.ts` - 命令处理逻辑
- `src/shared/ExtensionMessage.ts` - 消息类型定义
- `webview-ui/src/components/settings/providers/OpenAICompatible.tsx` - UI组件更新

## 注意事项

1. 确保Roo Code插件已激活并且侧边栏或标签页已打开
2. API Key会立即更新到OpenAI Compatible provider的配置中
3. 更新后的API Key会自动保存到全局配置中
4. 如果没有可见的Roo Code实例，命令将不会执行

## 测试方法

1. 安装并激活Roo Code插件
2. 打开Roo Code侧边栏
3. 在另一个插件或通过命令面板执行：
    ```
    vscode.commands.executeCommand('roo-cline.receiveExternalData', { apiKey: 'test-key-123' })
    ```
4. 检查Settings页面的OpenAI Compatible配置，API Key字段应该已更新

## 扩展功能

如需传递其他数据，可以扩展`receiveExternalData`命令的data参数，例如：

```javascript
vscode.commands.executeCommand("roo-cline.receiveExternalData", {
	apiKey: "your-api-key",
	baseUrl: "https://api.example.com",
	modelId: "gpt-4",
})
```

然后在`registerCommands.ts`中相应地处理这些额外的字段。
