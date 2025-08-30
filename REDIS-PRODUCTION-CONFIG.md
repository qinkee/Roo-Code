# Redis生产环境配置说明

## 配置方式

生产环境发布后，Redis配置支持以下方式：

### 1. VSCode用户设置（推荐）

用户可以在VSCode设置中配置Redis连接：

#### 通过设置界面
1. 打开VSCode设置（`Cmd+,` 或 `Ctrl+,`）
2. 搜索 `roo-cline.redis`
3. 配置以下选项：
   - **Enabled**: 是否启用Redis同步（默认：true）
   - **Host**: Redis服务器地址（默认：localhost）
   - **Port**: Redis端口（默认：6379）
   - **Password**: Redis密码（默认：空）
   - **Database**: 数据库编号（默认：0）

#### 通过settings.json
在VSCode的 `settings.json` 中添加：

```json
{
  "roo-cline.redis": {
    "enabled": true,
    "host": "your-redis-server.com",
    "port": 6379,
    "password": "your-password",
    "database": 0
  }
}
```

### 2. 环境变量（备选）

如果没有配置VSCode设置，系统会尝试读取环境变量：

```bash
# macOS/Linux
export REDIS_HOST=your-redis-server.com
export REDIS_PORT=6379
export REDIS_PASSWORD=your-password
export REDIS_DB=0

# Windows
set REDIS_HOST=your-redis-server.com
set REDIS_PORT=6379
set REDIS_PASSWORD=your-password
set REDIS_DB=0
```

### 3. 配置优先级

1. **VSCode设置**（最高优先级）
2. **环境变量**
3. **默认值**（localhost:6379，无密码）

## 重要说明

### 开发环境 vs 生产环境

| 环境 | .env文件支持 | VSCode设置 | 环境变量 |
|-----|------------|-----------|---------|
| 开发环境 | ✅ 支持 | ✅ 支持 | ✅ 支持 |
| 生产环境 | ❌ 不支持 | ✅ 支持 | ✅ 支持 |

**原因**：
- 生产环境的VSIX包不包含.env文件
- 扩展安装在用户的 `.vscode/extensions` 目录
- 用户无法访问或修改扩展内部文件

### 配置变更

- **动态重连**：修改VSCode设置后，Redis会自动重新连接
- **无需重启**：配置变更立即生效
- **静默降级**：连接失败不影响本地功能

## 用户使用场景

### 场景1：个人使用（默认配置）
```json
// 使用默认配置，连接本地Redis
{
  "roo-cline.redis": {
    "enabled": true,
    "host": "localhost",
    "port": 6379
  }
}
```

### 场景2：团队共享Redis
```json
// 连接团队Redis服务器
{
  "roo-cline.redis": {
    "enabled": true,
    "host": "team-redis.example.com",
    "port": 6379,
    "password": "team-password",
    "database": 2
  }
}
```

### 场景3：云Redis服务（如阿里云、AWS）
```json
// 连接云Redis
{
  "roo-cline.redis": {
    "enabled": true,
    "host": "r-xxxxx.redis.rds.aliyuncs.com",
    "port": 6379,
    "password": "cloud-password",
    "database": 0
  }
}
```

### 场景4：禁用Redis（纯本地模式）
```json
// 完全禁用Redis同步
{
  "roo-cline.redis": {
    "enabled": false
  }
}
```

## 安全建议

1. **密码保护**：生产环境强烈建议设置Redis密码
2. **网络隔离**：使用内网地址，避免公网暴露
3. **SSL/TLS**：如需要，可在后续版本添加SSL支持
4. **权限控制**：限制Redis用户权限，仅允许必要操作

## 故障排查

### 检查连接状态
在VSCode输出面板查看 `Roo Code` 输出：
- `[Redis] Connected successfully` - 连接成功
- `[Redis] Sync service disabled by configuration` - 被配置禁用
- `[Redis] Connection error` - 连接失败（自动降级）

### 常见问题

1. **Q: 配置后没有连接到Redis？**
   - A: 检查Redis服务是否运行，防火墙是否开放端口

2. **Q: 修改配置后需要重启VSCode吗？**
   - A: 不需要，配置会自动重新加载

3. **Q: Redis宕机会影响使用吗？**
   - A: 不会，系统会自动降级到本地存储

4. **Q: 数据会永久保存在Redis吗？**
   - A: 数据设置了7天过期时间，自动清理

## 后续优化

1. 添加SSL/TLS支持
2. 支持Redis Sentinel高可用
3. 支持Redis Cluster集群
4. 添加连接池配置
5. 实现数据加密存储