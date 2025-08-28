# void侧同步机制改进方案

## 当前问题总结

### 已实现功能

1. ✅ 用户登录时通知RooCode (`roo-cline.onUserSwitch`)
2. ✅ 用户登录时配置Provider (`roo-cline.autoConfigureProvider`)
3. ✅ 用户登录时同步任务历史userId (`roo-cline.updateTaskUserId`)
4. ✅ 用户登出时清理处理

### 缺失功能

1. ❌ **没有IM联系人同步** - 未调用 `roo-code.updateImContacts`
2. ❌ **没有定期同步机制** - 数据只在登录时同步一次
3. ❌ **没有数据变化监听** - IM数据变化时不会通知RooCode

## 建议的改进实现

### 1. 添加IM联系人同步服务

创建新文件：`src/vs/workbench/contrib/void/browser/imContactsSyncService.ts`

```typescript
import { Disposable } from "../../../../base/common/lifecycle.js"
import { ICommandService } from "../../../../platform/commands/common/commands.js"
import { ILogService } from "../../../../platform/log/common/log.js"
import { UserStateManager } from "../../wechat/browser/userSystem/userStateManager.js"

export class ImContactsSyncService extends Disposable {
	private syncInterval: NodeJS.Timeout | undefined
	private lastSyncTime: number = 0

	constructor(
		@ICommandService private readonly commandService: ICommandService,
		@ILogService private readonly logService: ILogService,
		private readonly userStateManager: UserStateManager,
	) {
		super()
		this.initialize()
	}

	private initialize(): void {
		// 监听用户登录事件
		this._register(
			this.userStateManager.onUserLogin(() => {
				this.startSync()
			}),
		)

		// 监听用户登出事件
		this._register(
			this.userStateManager.onUserLogout(() => {
				this.stopSync()
			}),
		)

		// 如果已登录，立即开始同步
		if (this.userStateManager.isLoggedIn) {
			this.startSync()
		}
	}

	private startSync(): void {
		// 立即同步一次
		this.syncImContacts()

		// 每30秒同步一次
		this.syncInterval = setInterval(() => {
			this.syncImContacts()
		}, 30000)
	}

	private stopSync(): void {
		if (this.syncInterval) {
			clearInterval(this.syncInterval)
			this.syncInterval = undefined
		}
	}

	private async syncImContacts(): Promise<void> {
		try {
			const currentUser = this.userStateManager.currentUser
			if (!currentUser) {
				this.logService.warn("[ImContactsSync] No user logged in, skipping sync")
				return
			}

			// 获取IM联系人数据（需要根据实际情况调整）
			const imData = await this.getImContactsData()

			// 检查命令是否可用
			const commands = await this.commandService.executeCommand<string[]>("getRegisteredCommands")
			if (!commands?.includes("roo-code.updateImContacts")) {
				this.logService.warn("[ImContactsSync] roo-code.updateImContacts command not available")
				return
			}

			// 同步到RooCode
			await this.commandService.executeCommand("roo-code.updateImContacts", {
				userId: currentUser.userId,
				friends: imData.friends || [],
				groups: imData.groups || [],
			})

			this.lastSyncTime = Date.now()
			this.logService.info(`[ImContactsSync] Successfully synced IM contacts for user ${currentUser.userId}`)
		} catch (error) {
			this.logService.error("[ImContactsSync] Failed to sync IM contacts:", error)
		}
	}

	private async getImContactsData(): Promise<{ friends: any[]; groups: any[] }> {
		// TODO: 实现获取IM联系人数据的逻辑
		// 这里需要从Vue store或其他数据源获取

		// 临时实现：尝试从window对象获取Vue store
		try {
			if (typeof window !== "undefined" && (window as any).__VUE_STORE__) {
				const store = (window as any).__VUE_STORE__
				return {
					friends: store.state?.im?.friends || [],
					groups: store.state?.im?.groups || [],
				}
			}
		} catch (error) {
			this.logService.error("[ImContactsSync] Failed to get IM data from Vue store:", error)
		}

		return { friends: [], groups: [] }
	}

	public async forceSync(): Promise<void> {
		await this.syncImContacts()
	}

	override dispose(): void {
		this.stopSync()
		super.dispose()
	}
}
```

### 2. 修改UserStateManager以集成同步服务

在 `UserStateManager.ts` 的 `login` 方法中添加IM联系人同步：

```typescript
// 在登录成功后添加（第280行后）
// 初始化并同步IM联系人
try {
	// 获取IM联系人数据
	const imData = await this.getImContactsData() // 需要实现这个方法

	if (commands && commands.includes("roo-code.updateImContacts")) {
		await this.commandService.executeCommand("roo-code.updateImContacts", {
			userId: completeUserInfo.userId,
			friends: imData.friends || [],
			groups: imData.groups || [],
		})
		this.logService.info("[UserStateManager] Successfully synced IM contacts on login")
	}
} catch (error) {
	this.logService.error("[UserStateManager] Failed to sync IM contacts on login:", error)
}
```

### 3. 添加Vue Store监听器

创建监听器来监控IM数据变化：

```typescript
// 在Vue组件或适当的位置添加
export function setupImDataWatcher(store: any, commandService: ICommandService) {
	// 监听friends变化
	store.watch(
		(state: any) => state.im?.friends,
		async (newFriends: any[], oldFriends: any[]) => {
			if (!arraysEqual(newFriends, oldFriends)) {
				await syncImContacts(store, commandService)
			}
		},
		{ deep: true },
	)

	// 监听groups变化
	store.watch(
		(state: any) => state.im?.groups,
		async (newGroups: any[], oldGroups: any[]) => {
			if (!arraysEqual(newGroups, oldGroups)) {
				await syncImContacts(store, commandService)
			}
		},
		{ deep: true },
	)
}

async function syncImContacts(store: any, commandService: ICommandService) {
	const currentUser = store.state?.user?.currentUser
	if (!currentUser?.userId) return

	try {
		await commandService.executeCommand("roo-code.updateImContacts", {
			userId: currentUser.userId,
			friends: store.state?.im?.friends || [],
			groups: store.state?.im?.groups || [],
		})
	} catch (error) {
		console.error("[ImSync] Failed to sync IM contacts:", error)
	}
}
```

### 4. 在初始化时立即同步

在void初始化完成后立即进行一次数据同步：

```typescript
// 在应用启动或用户认证完成后
async function initializeRooCodeSync() {
	try {
		// 等待RooCode扩展加载
		await waitForRooCodeExtension()

		// 获取当前用户
		const currentUser = getCurrentUser()
		if (!currentUser) return

		// 通知用户切换
		await vscode.postMessage({
			command: "roo-code.onUserSwitch",
			data: {
				userId: currentUser.userId,
				userName: currentUser.userName,
			},
		})

		// 同步IM联系人
		const imData = getImData()
		await vscode.postMessage({
			command: "roo-code.updateImContacts",
			data: {
				userId: currentUser.userId,
				friends: imData.friends,
				groups: imData.groups,
			},
		})

		console.log("[RooCodeSync] Initial sync completed")
	} catch (error) {
		console.error("[RooCodeSync] Failed to initialize sync:", error)
	}
}

async function waitForRooCodeExtension(maxWait = 5000) {
	const startTime = Date.now()

	while (Date.now() - startTime < maxWait) {
		const commands = await vscode.commands.getCommands()
		if (commands.some((cmd) => cmd.startsWith("roo-code."))) {
			return true
		}
		await new Promise((resolve) => setTimeout(resolve, 500))
	}

	throw new Error("RooCode extension not available")
}
```

## 实施步骤

1. **第一阶段：基础同步**

    - [ ] 在UserStateManager的login方法中添加IM联系人同步
    - [ ] 添加获取IM数据的辅助方法
    - [ ] 测试登录时的数据同步

2. **第二阶段：定期同步**

    - [ ] 实现ImContactsSyncService
    - [ ] 集成到void的服务系统
    - [ ] 测试定期同步功能

3. **第三阶段：实时同步**

    - [ ] 添加Vue store监听器
    - [ ] 实现数据变化时的即时同步
    - [ ] 优化同步频率避免过度调用

4. **第四阶段：优化和监控**
    - [ ] 添加同步状态指示
    - [ ] 实现同步失败重试机制
    - [ ] 添加性能监控和日志

## 测试清单

- [ ] 用户登录时自动同步所有数据
- [ ] 每30秒自动同步IM联系人
- [ ] IM数据变化时实时同步
- [ ] 用户切换时数据正确隔离
- [ ] 网络断开时的容错处理
- [ ] 同步失败时的重试机制

## 注意事项

1. **性能优化**：

    - 使用防抖避免频繁同步
    - 批量更新而非单个更新
    - 缓存比对避免无效同步

2. **错误处理**：

    - 命令不存在时的降级处理
    - 网络错误时的重试机制
    - 数据格式错误时的容错

3. **用户体验**：

    - 同步过程不应阻塞UI
    - 失败时静默处理，避免频繁提示
    - 提供手动同步选项

4. **安全性**：
    - 验证用户ID防止数据混淆
    - 敏感数据加密传输
    - 日志脱敏处理
