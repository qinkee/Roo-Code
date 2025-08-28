# IM数据同步实现方案

## 概述

实现了从 `im-web` 到 `RooCode` 的完整数据同步机制，确保IM联系人数据能够正确同步并支持多用户数据隔离。

## 数据流架构

```
im-web (Vue Store)
    ↓ [window.vscodeServices.executeCommand]
void (VSCode)
    ↓ [命令调用]
RooCode Extension
    ↓ [globalState存储]
用户级数据隔离 (user_${userId}_imContacts)
```

## 实现位置

### 1. **im-web 端** (`/Users/david/ThinkgsProjects/box-im/im-web`)

#### 1.1 friendStore.js

- 在 `setFriends`、`removeFriend`、`addFriend` mutations 中添加同步
- 每次数据变化时自动同步到 RooCode
- 传递 `userId`、`friends`、`groups` 数据

```javascript
// 同步到 Roo-Code 扩展
if (window.vscodeServices?.get("ICommandService")) {
	const userInfo = this.state.userStore?.userInfo
	const userId = userInfo?.id ? String(userInfo.id) : null

	if (userId) {
		window.vscodeServices.get("ICommandService").executeCommand("roo-code.updateImContacts", {
			userId: userId,
			friends: state.friends,
			groups: groups,
		})
	}
}
```

#### 1.2 groupStore.js

- 在 `setGroups`、`addGroup`、`removeGroup`、`updateGroup` mutations 中添加同步
- 逻辑与 friendStore 相同

#### 1.3 store/index.js

- 添加 `syncToRooCode` action
- 在 `load` action 完成后调用初始同步
- 登录后自动同步用户状态和联系人数据

### 2. **RooCode 端** (`/Users/david/ThinkgsProjects/Roo-Code`)

#### 2.1 VoidBridge (`src/api/void-bridge.ts`)

- 处理 `roo-code.updateImContacts` 命令
- 处理 `roo-code.onUserSwitch` 命令
- 支持用户ID持久化和恢复
- 自动用户切换机制

主要改进：

- 启动时从 globalState 恢复用户ID
- `updateImContacts` 时自动识别并切换用户
- 用户级数据存储：`user_${userId}_imContacts`

#### 2.2 webviewMessageHandler.ts

- 处理 `getImContacts` 请求
- 优先获取用户级数据，降级到通用数据

## 同步时机

1. **初始同步**：

    - 用户登录后，数据加载完成时（store load action）
    - 调用 `syncToRooCode` action

2. **实时同步**：

    - 好友列表变化时（添加、删除、更新）
    - 群组列表变化时（添加、删除、更新、退出）

3. **用户切换**：
    - 登录时同步用户状态
    - 数据更新时携带 userId

## 关键特性

### 1. 多用户数据隔离

- 所有数据使用 `user_${userId}_${dataKey}` 格式存储
- 不同用户的数据完全隔离
- 支持用户切换时自动加载对应数据

### 2. 自动用户识别

- `updateImContacts` 命令携带 userId
- 自动识别用户切换并更新当前用户
- 持久化用户ID，重启后自动恢复

### 3. 向后兼容

- 同时维护用户级和通用数据
- 旧版本可以继续使用通用数据
- 新版本优先使用用户级数据

## 测试验证点

### 基础功能测试

- [ ] im-web 登录后自动同步数据到 RooCode
- [ ] 添加好友时实时同步
- [ ] 删除好友时实时同步
- [ ] 加入群组时实时同步
- [ ] 退出群组时实时同步

### 多用户测试

- [ ] 用户A登录，数据正确同步
- [ ] 切换到用户B，数据正确隔离
- [ ] 切换回用户A，数据正确恢复
- [ ] 重启VSCode后，用户数据正确恢复

### 异常处理测试

- [ ] RooCode 扩展未加载时不报错
- [ ] 命令不存在时静默失败
- [ ] userId 缺失时跳过同步

## 调试日志

关键日志点：

1. `[Store] Syncing to RooCode` - im-web 发起同步
2. `[VoidBridge] Received updateImContacts` - RooCode 接收数据
3. `[VoidBridge] User switch detected` - 用户切换
4. `[WebviewMessageHandler] Getting IM contacts` - 获取联系人数据

## 注意事项

1. **userId 格式**：确保 userId 转换为字符串
2. **数据过滤**：过滤已删除的好友和已退出的群组
3. **错误处理**：使用 catch 避免同步失败影响主流程
4. **性能考虑**：数据变化时才同步，避免频繁调用

## 后续优化建议

1. **批量同步**：合并短时间内的多次变化
2. **增量同步**：只同步变化的数据
3. **同步状态指示**：显示同步成功/失败状态
4. **重试机制**：失败时自动重试
