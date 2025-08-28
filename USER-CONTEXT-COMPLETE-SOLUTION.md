# Roo-Code 完整用户上下文隔离解决方案

## 核心问题总结

当前实现的根本问题是：

1. **ContextProxy 是单例模式**，所有用户共享同一个实例
2. **登出只是局部清理**，没有完全重置用户上下文
3. **配置数据混乱**，用户登出后仍保留前用户的配置

## 完整解决方案

### 方案一：UserContextManager 架构（推荐）

这是最彻底的解决方案，通过为每个用户创建独立的 ContextProxy 实例实现完全隔离。

#### 1. 核心组件

**UserContextManager** - 用户上下文管理器

- 管理所有用户的上下文
- 处理用户切换和登出
- 确保数据完全隔离

**UserContext** - 用户上下文

- 每个用户有独立的 ContextProxy
- 包含用户的所有配置和数据
- 支持快速切换

#### 2. 实现步骤

1. **创建 UserContextManager.ts**

```typescript
class UserContextManager {
	private contexts: Map<string, UserContext>
	private currentContext: UserContext | null

	async switchUser(userId: string) {
		// 保存当前上下文
		// 加载或创建新用户上下文
		// 应用新上下文
	}

	async logout() {
		// 保存用户数据
		// 切换到默认上下文
	}
}
```

2. **修改 ContextProxy.ts**

```typescript
class ContextProxy {
	constructor(context: ExtensionContext, userId?: string) {
		this.userId = userId
		this.statePrefix = userId ? `user_${userId}_` : "default_"
	}

	// 所有存储操作使用带前缀的键
	private getPrefixedKey(key: string): string {
		return `${this.statePrefix}${key}`
	}
}
```

3. **修改 ClineProvider.ts**

```typescript
class ClineProvider {
	async switchContextProxy(newContextProxy: ContextProxy) {
		// 更新 contextProxy 引用
		// 重新初始化组件
		// 刷新 UI
	}
}
```

### 方案二：简化的状态重置方案

如果完整重构风险太大，可以采用简化方案：

#### 1. 登出时完全重置

修改 VoidBridge 的登出逻辑：

```typescript
// 用户登出命令
vscode.commands.registerCommand("roo-cline.onUserLogout", async () => {
	// 1. 保存当前用户数据到带前缀的存储
	if (currentUserId) {
		await saveUserData(currentUserId)
	}

	// 2. 重置 ContextProxy 到默认状态
	await contextProxy.resetToDefaults()

	// 3. 重新初始化所有管理器
	await providerSettingsManager.resetAndInitialize()
	await customModesManager.resetAndInitialize()

	// 4. 清空 UI 显示
	await provider.clearAllAndShowWelcome()

	// 5. 清除用户标识
	currentUserId = undefined
})
```

#### 2. 用户切换时完全重新加载

```typescript
// 用户切换命令
vscode.commands.registerCommand("roo-cline.onUserSwitch", async (data) => {
	// 1. 保存当前用户数据
	if (currentUserId) {
		await saveUserData(currentUserId)
	}

	// 2. 重置到默认状态
	await contextProxy.resetToDefaults()

	// 3. 加载新用户数据
	await loadUserData(data.userId)

	// 4. 重新初始化所有组件
	await reinitializeAllComponents()

	// 5. 更新 UI
	await provider.postStateToWebview()
})
```

### 方案三：使用多个 Extension Context（最简单）

最简单的方案是为每个用户创建独立的扩展上下文：

```typescript
class UserContextWrapper {
	private userContexts: Map<string, ExtensionContext> = new Map()

	getContext(userId?: string): ExtensionContext {
		if (!userId) {
			return this.defaultContext
		}

		if (!this.userContexts.has(userId)) {
			// 创建用户专属的上下文包装器
			const userContext = this.createUserContext(userId)
			this.userContexts.set(userId, userContext)
		}

		return this.userContexts.get(userId)!
	}

	private createUserContext(userId: string): ExtensionContext {
		// 包装原始 context，重写 globalState 方法
		return new Proxy(this.originalContext, {
			get(target, prop) {
				if (prop === "globalState") {
					return new UserGlobalState(target.globalState, userId)
				}
				return target[prop]
			},
		})
	}
}
```

## 数据存储结构设计

### 存储键规范

```
系统级数据（所有用户共享）：
- language
- telemetrySetting
- machineId
- organizationSettings

用户级数据（每个用户独立）：
- user_${userId}_taskHistory
- user_${userId}_imContacts
- user_${userId}_currentApiConfigName
- user_${userId}_listApiConfigMeta
- user_${userId}_customModes
- user_${userId}_providerSettings
- user_${userId}_allowedCommands
- user_${userId}_deniedCommands

默认/匿名用户数据：
- default_taskHistory
- default_imContacts
- default_currentApiConfigName
...
```

## 实施建议

### 短期方案（1-2天）

采用方案二的简化状态重置，快速解决当前问题：

1. 修改登出逻辑，完全重置状态
2. 修改切换逻辑，完全重新加载
3. 确保 UI 正确反映状态变化

### 中期方案（1周）

实施方案一的 UserContextManager：

1. 创建 UserContextManager
2. 重构 ContextProxy 支持用户隔离
3. 更新所有组件支持上下文切换

### 长期方案（2周+）

完整重构，考虑：

1. 微服务架构，每个用户一个独立服务
2. 使用 WebWorker 隔离用户上下文
3. 支持多用户同时在线

## 测试要点

1. **用户切换测试**

    - 切换后配置完全独立
    - 任务历史正确切换
    - IM 联系人正确切换

2. **登出测试**

    - UI 显示欢迎页
    - 所有用户数据清空
    - 配置重置为默认

3. **数据恢复测试**
    - 重新登录恢复数据
    - 数据完整性验证
    - 性能测试

## 风险评估

### 高风险

- 数据丢失：确保有备份机制
- 性能问题：多用户数据加载优化
- 兼容性：确保向后兼容

### 中风险

- UI 状态不同步
- 内存泄漏
- 并发问题

### 低风险

- 日志混乱
- 临时文件清理

## 结论

推荐采用分阶段实施：

1. **立即**：实施简化方案，解决紧急问题
2. **下周**：开发 UserContextManager
3. **下月**：完整测试和优化

这样可以快速解决当前问题，同时为长期方案打好基础。
