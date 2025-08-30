# Redis同步实施方案

## 一、概述

为Roo-Code实现Redis数据同步功能，支持多用户数据在Redis中备份存储，便于跨应用实例共享数据。核心原则：
- **本地优先**：本地存储为主，Redis为辅
- **完全容错**：Redis故障不影响任何本地功能
- **零配置**：默认启用，无需额外配置
- **极简实现**：最小化代码改动

## 二、技术架构

### 2.1 数据流向

```
本地存储 (主) --> 异步同步 --> Redis (辅)
     ^                              |
     |                              |
     +------- 数据恢复（可选）-------+
```

### 2.2 Redis数据结构

```
roo:{userId}:taskHistory     - 任务历史（JSON）
roo:{userId}:provider        - Provider配置（加密JSON）
roo:{userId}:customInstructions - 自定义指令（JSON）
```

所有key设置7天过期时间，自动清理过期数据。

## 三、实施步骤

### 3.1 安装依赖

```bash
npm install redis@^4.6.0
npm install --save-dev @types/redis
```

### 3.2 创建RedisSyncService

创建核心服务类 `src/services/RedisSyncService.ts`：
- 单例模式
- 自动连接管理
- 容错机制
- 批量写入优化

### 3.3 集成点

1. **ContextProxy** (`src/core/config/ContextProxy.ts`)
   - `update()` 方法：写入时同步到Redis
   - `initialize()` 方法：初始化时尝试从Redis恢复

2. **ProviderSettingsManager** (`src/core/config/ProviderSettingsManager.ts`)
   - `store()` 方法：保存配置时同步到Redis
   - `load()` 方法：加载时尝试从Redis恢复

3. **TaskHistoryBridge** (`src/api/task-history-bridge.ts`)
   - `updateTaskHistory()` 方法：更新任务时同步到Redis
   - `getTaskHistory()` 方法：获取任务时尝试从Redis恢复

### 3.4 初始化

在 `src/extension.ts` 的 `activate()` 函数中初始化Redis服务。

## 四、容错机制

### 4.1 连接容错
- 连接失败静默降级
- 不影响本地功能
- 自动健康检查

### 4.2 操作容错
- 读取超时：500ms
- 写入异步：不阻塞主流程
- 批量失败：自动降级

### 4.3 降级策略
- 连续失败5次后暂停1分钟
- 自动恢复机制
- 失败计数重置

## 五、性能优化

### 5.1 批量写入
- 100ms缓冲窗口
- 自动批量提交
- 减少网络开销

### 5.2 数据限制
- 任务历史：最近50条
- 过期时间：7天
- 读取超时：500ms

## 六、环境变量

可选配置（默认值）：
- `REDIS_HOST`: localhost
- `REDIS_PORT`: 6379
- `REDIS_PASSWORD`: (空)
- `REDIS_DB`: 0

## 七、测试验证

### 7.1 功能测试
1. Redis正常：数据正常同步
2. Redis宕机：本地功能正常
3. Redis恢复：自动恢复同步

### 7.2 性能测试
1. 写入延迟：< 1ms（异步）
2. 读取延迟：< 500ms（超时保护）
3. 批量写入：100ms窗口

## 八、回滚方案

如需禁用Redis同步：
1. 注释掉 `extension.ts` 中的初始化代码
2. 各集成点的Redis调用会自动失败降级
3. 不影响任何本地功能

## 九、后续优化

1. 添加配置开关（当前默认启用）
2. 支持更多数据类型同步
3. 添加数据压缩
4. 实现增量同步
5. 添加监控指标

## 十、风险评估

| 风险 | 概率 | 影响 | 缓解措施 |
|-----|-----|------|---------|
| Redis连接失败 | 中 | 低 | 静默降级，不影响本地 |
| 数据同步延迟 | 低 | 低 | 异步同步，不阻塞 |
| Redis数据丢失 | 低 | 低 | 本地为主数据源 |
| 网络超时 | 中 | 低 | 500ms超时保护 |

## 十一、实施时间表

1. **第一阶段**（当前）
   - 实现RedisSyncService
   - 集成三个核心模块
   - 基础容错机制

2. **第二阶段**（后续）
   - 添加配置管理
   - 优化性能
   - 添加监控

3. **第三阶段**（未来）
   - 支持更多数据类型
   - 实现数据压缩
   - 增量同步优化