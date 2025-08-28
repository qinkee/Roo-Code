# 用户上下文完全隔离设计方案

## 问题分析

当前实现的根本问题：

1. **单例 ContextProxy**：所有用户共享同一个 ContextProxy 实例和状态缓存
2. **局部清理**：登出时只清理部分数据，没有重置整个上下文
3. **配置混淆**：用户登出后仍保留前一个用户的配置设置
4. **状态污染**：新用户登录时会继承前用户的某些状态

## 核心设计思路

### 1. 用户上下文封装

创建 `UserContext` 类，封装每个用户的完整上下文：

```typescript
interface UserContext {
	userId: string
	contextProxy: ContextProxy // 每个用户独立的 ContextProxy
	taskHistory: HistoryItem[]
	imContacts: any
	providerSettings: ProviderSettings
	customSettings: any
	// ... 其他用户特定数据
}
```

### 2. 用户上下文管理器

创建 `UserContextManager` 单例，管理所有用户上下文：

```typescript
class UserContextManager {
	private static instance: UserContextManager
	private contexts: Map<string, UserContext> = new Map()
	private currentContext: UserContext | null = null

	// 切换用户
	async switchUser(userId: string) {
		// 保存当前用户上下文
		if (this.currentContext) {
			await this.saveContext(this.currentContext)
		}

		// 加载或创建新用户上下文
		this.currentContext = await this.loadOrCreateContext(userId)

		// 应用用户上下文到系统
		await this.applyContext(this.currentContext)
	}

	// 用户登出
	async logout() {
		// 保存当前用户上下文
		if (this.currentContext) {
			await this.saveContext(this.currentContext)
		}

		// 创建并应用匿名/默认上下文
		this.currentContext = await this.createDefaultContext()
		await this.applyContext(this.currentContext)
	}
}
```

### 3. ContextProxy 重构

将 ContextProxy 改为可重新初始化的设计：

```typescript
export class ContextProxy {
	private userId?: string
	private statePrefix: string = ""

	constructor(context: vscode.ExtensionContext, userId?: string) {
		this.originalContext = context
		this.userId = userId
		this.statePrefix = userId ? `user_${userId}_` : ""
		this.reset()
	}

	// 重置为默认状态
	reset() {
		this.stateCache = this.getDefaultState()
		this.secretCache = {}
	}

	// 从存储加载用户状态
	async loadUserState() {
		if (!this.userId) {
			// 加载默认/匿名状态
			await this.loadDefaultState()
		} else {
			// 加载用户特定状态
			await this.loadStateWithPrefix(this.statePrefix)
		}
	}

	// 保存用户状态
	async saveUserState() {
		if (this.userId) {
			await this.saveStateWithPrefix(this.statePrefix)
		}
	}

	// 获取带前缀的键
	private getPrefixedKey(key: string): string {
		return `${this.statePrefix}${key}`
	}
}
```

### 4. ClineProvider 改造

修改 ClineProvider 以支持上下文切换：

```typescript
export class ClineProvider {
  private userContextManager: UserContextManager

  constructor(...) {
    this.userContextManager = UserContextManager.getInstance()
  }

  // 处理用户切换
  async handleUserSwitch(userId: string) {
    // 保存当前任务（如果有）
    await this.saveCurrentTask()

    // 切换用户上下文
    await this.userContextManager.switchUser(userId)

    // 重新初始化 Provider 状态
    await this.reinitialize()

    // 刷新 UI
    await this.postStateToWebview()
  }

  // 处理用户登出
  async handleUserLogout() {
    // 保存当前任务
    await this.saveCurrentTask()

    // 切换到默认上下文
    await this.userContextManager.logout()

    // 重新初始化为欢迎状态
    await this.reinitialize()

    // 显示欢迎页面
    await this.showWelcomePage()
  }

  // 重新初始化
  private async reinitialize() {
    // 获取当前上下文
    const context = this.userContextManager.getCurrentContext()

    // 更新 contextProxy
    this.contextProxy = context.contextProxy

    // 重新初始化各个组件
    await this.providerSettingsManager.initialize(this.contextProxy)
    await this.customModesManager.initialize(this.contextProxy)
    await this.mcpServerManager.initialize(this.contextProxy)

    // 重新加载任务历史等
    await this.loadTaskHistory()
  }
}
```

## 实现步骤

### 第一步：创建 UserContextManager

1. 创建 `src/core/config/UserContextManager.ts`
2. 实现用户上下文的创建、保存、加载、切换逻辑
3. 实现默认上下文的创建

### 第二步：重构 ContextProxy

1. 修改 `src/core/config/ContextProxy.ts`
2. 添加用户ID支持
3. 实现带前缀的存储键
4. 实现重置和重新加载功能

### 第三步：改造 ClineProvider

1. 修改 `src/core/webview/ClineProvider.ts`
2. 集成 UserContextManager
3. 实现用户切换和登出处理
4. 实现重新初始化流程

### 第四步：更新 VoidBridge

1. 修改 `src/api/void-bridge.ts`
2. 调用 ClineProvider 的新方法
3. 确保完整的上下文切换

### 第五步：测试验证

1. 测试用户切换后配置完全隔离
2. 测试登出后显示默认配置
3. 测试重新登录后恢复用户配置
4. 测试多用户快速切换

## 数据存储结构

```
globalState:
  // 系统级（所有用户共享）
  - lastUserId: "123456"
  - systemSettings: {...}

  // 默认/匿名用户
  - default_taskHistory: []
  - default_providerSettings: {...}
  - default_customSettings: {...}

  // 用户 123456
  - user_123456_taskHistory: [...]
  - user_123456_providerSettings: {...}
  - user_123456_customSettings: {...}
  - user_123456_imContacts: {...}

  // 用户 789012
  - user_789012_taskHistory: [...]
  - user_789012_providerSettings: {...}
  - user_789012_customSettings: {...}
  - user_789012_imContacts: {...}
```

## 优势

1. **完全隔离**：每个用户有独立的上下文，互不干扰
2. **快速切换**：上下文缓存在内存中，切换速度快
3. **数据安全**：用户数据完全隔离，避免泄露
4. **易于扩展**：新增用户配置只需在 UserContext 中添加
5. **向后兼容**：保留原有数据结构，可以平滑迁移

## 注意事项

1. **内存管理**：避免同时缓存太多用户上下文
2. **并发控制**：确保上下文切换的原子性
3. **错误处理**：上下文加载失败时的降级策略
4. **性能优化**：大量数据时的加载优化
5. **数据迁移**：提供旧数据到新结构的迁移工具
