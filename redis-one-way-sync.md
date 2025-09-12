# Redis 单向同步改进说明

## 改进内容

已将Redis从双向同步改为单向写入同步：

1. **移除Redis读取逻辑**：
   - 删除了`ContextProxy.tryRestoreFromRedis()`方法
   - 删除了`TaskHistoryBridge.getTaskHistory()`中从Redis恢复数据的逻辑

2. **保留Redis写入功能**：
   - `ContextProxy.updateGlobalState()`继续向Redis写入重要数据
   - `TaskHistoryBridge.updateTaskHistory()`继续向Redis同步任务历史

3. **支持terminalNo区分**：
   - 不同终端的任务使用不同的Redis key
   - Redis key格式：`roo:{userId}:{terminalNo}:tasks`
   - 没有terminalNo时降级为：`roo:{userId}:tasks`

## 数据流向

```
本地存储 (VSCode GlobalState)
    ↓ (单向写入)
Redis存储 (仅用于跨设备同步，不影响本地)
```

## 核心文件修改

1. **src/core/config/ContextProxy.ts**
   - 第141-145行：移除`tryRestoreFromRedis()`调用
   - 第147-168行：删除从Redis恢复数据的方法
   - 第316-326行：保留Redis写入逻辑，添加terminalNo支持

2. **src/api/task-history-bridge.ts**
   - 第96-98行：移除从Redis读取任务历史的逻辑
   - 第140-143行：保留Redis写入，使用terminalNo区分

## 优势

1. **数据一致性**：本地存储作为唯一数据源，避免冲突
2. **性能提升**：减少Redis读取操作，降低延迟
3. **简化逻辑**：数据流向单一，易于维护
4. **终端隔离**：不同终端的任务互不影响

## 测试要点

1. 创建新任务时，检查Redis是否正确写入（含terminalNo）
2. 重启VSCode后，任务从本地存储加载，不依赖Redis
3. 切换用户时，任务历史正确隔离
4. 不同终端的任务数据独立存储

## Redis Key 示例

- 用户1的PC终端任务：`roo:1:2:tasks`  
- 用户1的云电脑终端任务：`roo:1:3:tasks`
- 用户2的Web终端任务：`roo:2:0:tasks`