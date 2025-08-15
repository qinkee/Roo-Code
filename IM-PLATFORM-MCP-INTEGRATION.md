# IM Platform MCP 集成方案

## 一、项目背景

Roocode项目需要集成IM Platform MCP服务，该服务提供即时通讯相关功能，包括登录、好友列表、文件上传、私聊消息、群聊消息等功能。核心需求是：

1. 内置MCP配置到Roocode中
2. 通过环境变量动态传递tokenKey
3. 支持在大模型对话上下文中定义和使用tokenKey

## 二、技术架构分析

### 2.1 现有MCP架构

Roocode的MCP实现基于以下核心组件：

- **McpHub** (`src/services/mcp/McpHub.ts`): MCP连接管理中心，负责：

    - 管理全局和项目级MCP服务器配置
    - 处理服务器连接生命周期
    - 提供工具调用和资源访问接口
    - 支持stdio、SSE、streamable-http三种连接类型

- **useMcpToolTool** (`src/core/tools/useMcpToolTool.ts`): MCP工具调用接口，负责：

    - 验证和解析工具调用参数
    - 执行工具调用并处理响应
    - 管理执行状态通知

- **ClineProvider** (`src/core/webview/ClineProvider.ts`): 核心提供者，负责：
    - 维护McpHub实例
    - 处理WebView消息通信
    - 管理全局状态

### 2.2 配置管理机制

MCP配置存储在两个位置：

- **全局配置**: `~/.roocode/mcp.json`
- **项目配置**: `{workspace}/.roo/mcp.json`

配置结构：

```json
{
	"mcpServers": {
		"server-name": {
			"type": "stdio|sse|streamable-http",
			"command": "...", // stdio类型
			"url": "...", // sse/streamable-http类型
			"env": {},
			"alwaysAllow": [],
			"disabledTools": []
		}
	}
}
```

## 三、集成方案设计

### 3.1 内置MCP配置

在McpHub初始化时自动注入IM Platform MCP配置：

```typescript
// src/services/mcp/McpHub.ts
private async initializeBuiltinServers(): Promise<void> {
  const builtinConfig = {
    "im-platform-local": {
      "type": "stdio",
      "command": "npx",
      "args": ["im-platform-mcp"],
      "env": {
        "IM_API_BASE_URL": "http://127.0.0.1:8888",
        "IM_DEFAULT_SIMILARITY": "0.8",
        "IM_DEFAULT_LIMIT": "20",
        "IM_TOKEN_KEY": "${imPlatformTokenKey}" // 使用变量占位符
      },
      "alwaysAllow": [
        "composite_search",
        "login",
        "get_friend_list",
        "upload_file",
        "send_private_message",
        "send_group_message"
      ]
    }
  };

  // 合并到现有配置
  await this.mergeBuiltinConfig(builtinConfig);
}
```

### 3.2 扩展McpHub支持动态环境变量

修改McpHub的连接逻辑，支持从上下文中获取tokenKey并注入到环境变量：

```typescript
// src/services/mcp/McpHub.ts
private async connectToServer(
  name: string,
  config: z.infer<typeof ServerConfigSchema>,
  source: "global" | "project" = "global",
): Promise<void> {
  // ... 现有代码

  // 为IM Platform MCP注入动态TokenKey
  if (name === "im-platform-local") {
    // 从上下文或配置中获取tokenKey
    const tokenKey = this.getImPlatformTokenKey();
    if (tokenKey) {
      configInjected.env = {
        ...configInjected.env,
        IM_TOKEN_KEY: tokenKey
      };
    }
  }

  // ... 继续连接逻辑
}

// 新增方法：获取IM Platform的TokenKey
private getImPlatformTokenKey(): string | undefined {
  // 方案1：从环境变量读取
  const envTokenKey = process.env.IM_PLATFORM_TOKEN_KEY;
  if (envTokenKey) return envTokenKey;

  // 方案2：从VSCode配置读取
  const config = vscode.workspace.getConfiguration('roocode');
  const configTokenKey = config.get<string>('imPlatformTokenKey');
  if (configTokenKey) return configTokenKey;

  // 方案3：从上下文状态读取（如果需要动态切换）
  const provider = this.providerRef.deref();
  if (provider) {
    const state = provider.getState();
    if (state.imPlatformTokenKey) {
      return state.imPlatformTokenKey;
    }
  }

  return undefined;
}
```

### 3.3 在大模型对话上下文中使用TokenKey

通过修改工具调用逻辑，让所有IM Platform MCP的工具调用自动包含tokenKey：

```typescript
// src/core/tools/useMcpToolTool.ts
async function executeToolAndProcessResult(
	cline: Task,
	serverName: string,
	toolName: string,
	parsedArguments: Record<string, unknown> | undefined,
	executionId: string,
	pushToolResult: PushToolResult,
): Promise<void> {
	// 为IM Platform服务器的所有工具调用自动注入tokenKey
	if (serverName === "im-platform-local") {
		// tokenKey已经通过环境变量传递给MCP服务
		// MCP服务内部会从环境变量IM_TOKEN_KEY获取
		// 这里不需要额外处理
	}

	// ... 继续执行工具调用
	const toolResult = await cline.providerRef.deref()?.getMcpHub()?.callTool(serverName, toolName, parsedArguments)

	// ... 处理结果
}
```

## 四、实施步骤

### 第一阶段：内置配置实现

1. 在McpHub中添加initializeBuiltinServers方法
2. 在初始化流程中调用该方法注入im-platform-local配置
3. 确保配置合并逻辑不覆盖用户自定义配置

### 第二阶段：动态环境变量支持

1. 实现getImPlatformTokenKey方法
2. 修改connectToServer方法支持动态环境变量注入
3. 测试TokenKey传递机制

### 第三阶段：配置管理

1. 添加VSCode配置项支持设置tokenKey
2. 支持从环境变量读取tokenKey
3. 提供配置优先级管理

## 五、关键技术点

### 5.1 TokenKey管理

- 支持多种配置源：环境变量、VSCode配置、上下文状态
- 配置优先级：环境变量 > VSCode配置 > 上下文状态
- TokenKey通过环境变量传递给MCP服务，确保安全性

### 5.2 内置配置机制

- 默认配置硬编码在代码中，无需外部配置文件
- 支持用户覆盖默认配置
- 自动合并用户配置和内置配置

### 5.3 兼容性保证

- 不影响现有MCP服务器功能
- 保持现有配置文件格式
- 支持热更新TokenKey而无需重启VSCode

## 六、配置示例

### 6.1 内置默认配置

```typescript
// 硬编码在McpHub中的默认配置
const builtinConfig = {
	"im-platform-local": {
		type: "stdio",
		command: "npx",
		args: ["im-platform-mcp"],
		env: {
			IM_API_BASE_URL: "http://127.0.0.1:8888",
			IM_DEFAULT_SIMILARITY: "0.8",
			IM_DEFAULT_LIMIT: "20",
			IM_TOKEN_KEY: "${dynamic}", // 运行时从配置源获取
		},
		alwaysAllow: [
			"composite_search",
			"login",
			"get_friend_list",
			"upload_file",
			"send_private_message",
			"send_group_message",
		],
	},
}
```

### 6.2 VSCode配置项

```json
// .vscode/settings.json 或用户设置
{
	"roocode.imPlatformTokenKey": "your-token-key-here"
}
```

### 6.3 环境变量配置

```bash
# 启动VSCode时设置环境变量
export IM_PLATFORM_TOKEN_KEY="your-token-key-here"
code .
```

## 七、使用方式

1. **通过环境变量设置TokenKey**：

    ```bash
    IM_PLATFORM_TOKEN_KEY="xxx" code .
    ```

2. **通过VSCode设置**：

    - 打开VSCode设置
    - 搜索 `roocode.imPlatformTokenKey`
    - 输入TokenKey值

3. **在AI对话中使用**：
    - 无需额外配置，MCP服务会自动获取配置的TokenKey
    - 直接调用IM Platform的工具即可

## 八、注意事项

1. **配置优先级**：环境变量 > VSCode设置 > 默认值
2. **安全性**：TokenKey不会在日志中显示
3. **兼容性**：不影响其他MCP服务器的正常使用
4. **简化部署**：无需手动配置MCP文件，开箱即用

## 本次修改总结

### 实现的功能

1. **内置 IM Platform MCP 配置**

    - 在 McpHub 初始化时自动加载 im-platform MCP 服务器
    - 无需用户手动配置文件，开箱即用
    - 包含所有必要的工具权限（composite_search, login, get_friend_list 等）

2. **VSCode 配置界面集成**

    - TokenKey 作为 VSCode 设置项 `roo-cline.imPlatformTokenKey`
    - 可通过设置界面直接管理，无需编辑 JSON 文件
    - 支持全局和工作区级别配置

3. **命令面板集成**

    - 添加三个新命令用于 TokenKey 管理：
        - `Roo Code: Manage IM Platform Token` - 显示当前状态并提供管理选项
        - `Roo Code: Set IM Platform Token` - 设置新的 TokenKey
        - `Roo Code: Clear IM Platform Token` - 清空现有 TokenKey

4. **动态 TokenKey 管理**

    - 实现了 `ImPlatformTokenManager` 服务类
    - 支持三种配置源（优先级从高到低）：
        - 环境变量：`IM_PLATFORM_TOKEN_KEY`
        - VSCode 配置：`roo-cline.imPlatformTokenKey`
        - 上下文状态：`state.imPlatformTokenKey`
    - 配置更改时自动重启 MCP 连接

5. **环境变量注入机制**
    - 在 connectToServer() 中特殊处理 im-platform 服务器
    - 动态获取 TokenKey 并注入到环境变量 IM_TOKEN_KEY
    - MCP 服务内部可以通过 process.env.IM_TOKEN_KEY 获取

### TokenKey 设置方法

**方法 1：VSCode 设置界面（推荐）**

1. 打开 VSCode 设置（`Cmd+,` 或 `Ctrl+,`）
2. 搜索 "IM Platform" 或 "imPlatformTokenKey"
3. 在输入框中填入您的 TokenKey
4. 设置会自动保存并立即生效

**方法 2：命令面板（快速访问）**

1. 打开命令面板（`Cmd+Shift+P` 或 `Ctrl+Shift+P`）
2. 搜索并执行以下命令之一：
    - "Manage IM Platform Token" - 查看当前状态和管理选项
    - "Set IM Platform Token" - 直接设置新的 TokenKey
    - "Clear IM Platform Token" - 清空 TokenKey

**方法 3：环境变量（推荐用于开发）**

# 在终端设置环境变量后启动 VSCode

export IM_PLATFORM_TOKEN_KEY="your-token-key-here"
code .

# 在终端设置环境变量后启动 VSCode

export IM_PLATFORM_TOKEN_KEY="your-token-key-here"
code .

**方法 4：settings.json 直接编辑**

```json
{
	"roo-cline.imPlatformTokenKey": "your-token-key-here"
}
```

**方法 5：程序动态设置（用于多用户切换）**

```typescript
// 使用 ImPlatformTokenManager
const tokenManager = ImPlatformTokenManager.getInstance()

// 设置 TokenKey
await tokenManager.setTokenKey("new-token-key")

// 清空 TokenKey
await tokenManager.clearTokenKey()

// 检查是否已设置
if (tokenManager.hasTokenKey()) {
	// TokenKey 已设置
}

// 用户登录时
await tokenManager.onUserLogin(tokenKey, userId)

// 用户登出时
await tokenManager.onUserLogout()
```

### 关键代码位置

1. **TokenKey 管理服务**：`src/services/im-platform/ImPlatformTokenManager.ts`

    - 完整的 TokenKey 生命周期管理
    - 配置变更监听和自动重连
    - 用户友好的状态显示和管理界面

2. **内置配置**：`McpHub.ts` 第 175-198 行
   const builtinConfig = {
   "im-platform": {
   env: {
   IM_TOKEN_KEY: "${imPlatformTokenKey}" // 占位符
   }
   }
   }
3. TokenKey 获取：McpHub.ts 第 240-273 行


    - 三级优先级查找机制

3. 环境变量注入：McpHub.ts 第 366-379 行


    - 运行时动态替换 ${imPlatformTokenKey} 占位符

### 功能特性

- **自动重连**: TokenKey 更改后自动重启 MCP 连接
- **配置监听**: 实时监听配置变化，无需手动重启
- **安全显示**: TokenKey 在界面中部分隐藏（仅显示末尾 4 位）
- **剪贴板支持**: 可以复制 TokenKey 到剪贴板
- **状态反馈**: 清晰的状态提示和错误处理

### 调试日志

系统会输出详细的调试日志：

- `[IM Platform MCP] TokenKey found/not found`
- `[IM Platform MCP] Final environment variables`
- `[IM Platform Token] Configuration changed`
- `[IM Platform Token] Connection restarted`
- 显示 TokenKey 的最后 4 位字符（安全考虑）

### 注意事项

1. TokenKey 存储在 VSCode 全局配置中，会在重启后保持
2. 更换 TokenKey 会自动重启 MCP 连接，无需手动操作
3. 日志中 TokenKey 会被部分隐藏，只显示末尾 4 位
4. 支持同时管理多个工作区的不同 TokenKey
5. 配置优先级：环境变量 > VSCode 设置 > 上下文状态
