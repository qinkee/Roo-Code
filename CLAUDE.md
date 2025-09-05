# Roo-Code Development Guide

## Debugging @联系人 and @知识库 Issues

### Data Flow

1. **VoidBridge** receives `updateImContacts` command and saves to globalState
2. **ChatTextArea** requests contacts via `getImContacts` message
3. **webviewMessageHandler** retrieves from globalState and sends to webview
4. **ChatTextArea** updates `imContacts` state
5. **queryItems** updates via useMemo
6. **ContextMenu** shows submenu based on selectedType

### Key Log Points to Check

- `[VoidBridge] Received updateImContacts` - Data received from void
- `[WebviewMessageHandler] Getting IM contacts` - Data retrieved from storage
- `[ChatTextArea] DATA RECEIVED` - Data received in webview
- `[ChatTextArea] Query items updated` - Query items regenerated
- `[context-mentions] SUBMENU CHECK` - Submenu generation
- `[ContextMenu] Getting options for submenu` - Menu rendering

### Common Issues

- **Race conditions**: Data may not be available when submenu renders
- **State updates**: React async updates may cause timing issues
- **Empty results**: Now shows "Loading..." instead of "No results"

### Testing

1. Check console logs for the data flow
2. Verify data is saved in globalState
3. Ensure periodic updates are working (every 30s)
4. Check that clicking menu triggers fresh data request

## 多用户系统核心要点

### 数据同步关键原则

- **双重缓存更新**：修改任务历史时必须同时更新 TaskHistoryBridge 和 contextProxy 缓存
- **统一删除路径**：所有删除操作必须走 command 路径，避免 UI 直接调用方法导致事件丢失
- **异步处理顺序**：确保 `await` 关键字正确使用，避免 Promise 对象被当作数据传递

### 核心代码模式

```typescript
// ❌ 错误：只更新存储，UI不更新
await TaskHistoryBridge.updateTaskHistory(context, history)
await this.postStateToWebview()

// ✅ 正确：同时更新存储和缓存
await TaskHistoryBridge.updateTaskHistory(context, history)
await this.contextProxy.setValue("taskHistory", history)
await this.postStateToWebview()
```

### 事件通知链路

1. RooCode 操作 → TaskHistoryBridge 更新
2. TaskHistoryBridge → `void.onTaskHistoryUpdated` 事件
3. Void 接收事件 → IM 界面更新
4. 同时更新 contextProxy → React UI 更新

### 调试检查点

- TaskHistoryBridge 日志：确认数据正确传递
- contextProxy 缓存：确认 React UI 数据源
- void 事件接收：确认跨组件通信
- 多用户存储 key：避免用户数据混乱

### 关键文件

- `task-history-bridge.ts` - 数据同步核心
- `ClineProvider.ts` - 缓存管理
- `webviewMessageHandler.ts` - 统一操作入口
- `rooCodeTaskHistoryService.ts` - 事件接收处理

## 文件操作配置

### 禁用Diff编辑器 (新建文件直接保存)

- **配置位置**: `src/shared/experiments.ts`
- **配置项**: `PREVENT_FOCUS_DISRUPTION: { enabled: true }`
- **作用**: 新建文件时跳过VSCode diff编辑器，直接在目标文件位置创建和保存
- **好处**: 避免打断工作流程，减少UI切换干扰
