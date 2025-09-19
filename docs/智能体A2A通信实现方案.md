# 智能体 A2A 通信实现方案

## 概述

本文档详细描述基于 a2a-js 协议的智能体间通信实现方案。所有智能体都暴露标准 A2A 端点，调用时优先尝试直连，网络不可达时自动降级到 IM 桥接。实现智能路由、负载均衡和故障转移机制，并支持基于共享范围的权限验证。

## 通信架构图

```
                    智能体 A2A 通信架构 (基于正确项目理解)
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                           权限验证层                                     │
    ├─────────────────────────────────────────────────────────────────────────┤
    │  调用前权限检查：                                                       │
    │  • 源智能体身份验证                                                     │
    │  • 目标智能体共享范围检查 (私有/好友/群组/公开)                         │
    │  • 用户关系验证 (好友关系/群组成员)                                     │
    │  • 操作权限确认 (read/execute/modify)                                   │
    └─────────────────────────────────────────────────────────────────────────┘
                                        ↓
                                                  
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                       void项目统一架构                                  │
    ├─────────────────────────────────────────────────────────────────────────┤
    │  roo-code扩展(built-in) 中的 A2A 服务器实现                            │
    │  ┌─────────────────────────────────────────────────────────────────────┐ │
    │  │  A2AServer.ts (核心实现)                                           │ │
    │  │  ├── 标准HTTP端点暴露                                              │ │
    │  │  ├── 智能体请求处理                                                │ │  
    │  │  ├── 权限验证中间件                                                │ │
    │  │  ├── IM桥接客户端                                                  │ │
    │  │  └── 网络探测服务                                                  │ │
    │  └─────────────────────────────────────────────────────────────────────┘ │
    └─────────────────────────────────────────────────────────────────────────┘
               │                                                     ↑
               ↓                                                     │
    ┌─────────────────────┐                              ┌─────────────────────┐
    │   PC环境 void       │ ←──── 探测/直连/IM桥接 ────→ │  Docker环境 void   │
    │  (用户桌面)         │                              │  (云端容器)         │
    ├─────────────────────┤                              ├─────────────────────┤
    │ • localhost:端口    │                              │ • 容器IP:端口       │
    │ • 网络不可直达      │                              │ • 公网可直达        │
    │ • 依赖IM桥接        │                              │ • 直连优先          │
    │ • 相同A2A代码       │                              │ • 相同A2A代码       │
    └─────────────────────┘                              └─────────────────────┘
               │                                                     │
               └─────────────── ┌─────────────────────┐ ──────────────┘
                              │   box-im IM桥接      │
                              │  (消息中转服务)       │
                              ├─────────────────────┤
                              │ • AgentBridgeService│
                              │ • 智能体消息路由    │
                              │ • 权限代理验证      │
                              │ • 网络穿透代理      │
                              └─────────────────────┘
                                        ↓
    ┌─────────────────────────────────────────────────────────────────────────┐
    │                        Redis 注册中心                                   │
    ├─────────────────────────────────────────────────────────────────────────┤
    │ • 智能体端点注册 (PC=localhost + Docker=公网IP)                         │
    │ • 网络可达性状态 (动态更新)                                             │
    │ • 权限信息缓存 (共享范围、白名单)                                       │
    │ • 负载均衡数据 (响应时间、错误率)                                       │
    └─────────────────────────────────────────────────────────────────────────┘
```

## A2A 协议集成

### a2a-js SDK 集成

基于调研的 a2a-js 协议，实现标准的智能体间通信：

```typescript
import { AgentExecutor, AgentCard, Message, Task } from '@a2aproject/a2a-js'

// 智能体卡片定义
interface RooAgentCard extends AgentCard {
  id: string
  userId: string
  name: string
  description: string
  skills: string[]
  url: string                     // 所有智能体都有标准端点
  capabilities: {
    messageTypes: string[]
    taskTypes: string[]
    dataFormats: string[]
    maxConcurrency?: number
  }
  // 扩展字段
  deployment: {
    type: 'pc' | 'cloud'
    platform: string
    region?: string
    networkReachable: boolean       // 标识网络是否可达
  }
  auth?: {
    apiKey?: string
    authType: 'none' | 'apikey' | 'oauth'
  }
}

// 智能体执行器
class RooAgentExecutor implements AgentExecutor {
  constructor(
    private agent: AgentConfig,
    private storageService: EnhancedAgentStorageService
  ) {}
  
  async execute(requestContext: any, eventBus: any): Promise<void> {
    // 检查权限
    const hasAccess = await this.checkPermission(requestContext)
    if (!hasAccess) {
      throw new Error('Access denied: insufficient permissions')
    }
    const { method, params } = requestContext
    
    try {
      // 根据方法分发到对应处理器
      const result = await this.handleRequest(method, params)
      
      // 发送响应消息
      const responseMessage = {
        kind: "message",
        role: "agent",
        parts: [{ kind: "text", text: JSON.stringify(result) }]
      }
      
      eventBus.publish(responseMessage)
      eventBus.finished()
      
    } catch (error) {
      // 发送错误消息
      const errorMessage = {
        kind: "message", 
        role: "agent",
        parts: [{ kind: "error", error: error.message }]
      }
      
      eventBus.publish(errorMessage)
      eventBus.finished()
    }
  }
  
  private async handleRequest(method: string, params: any): Promise<any> {
    switch (method) {
      case 'execute_tool':
        return this.executeTool(params.toolId, params.args)
      case 'query_status':
        return this.getAgentStatus()
      case 'list_capabilities':
        return this.getCapabilities()
      default:
        throw new Error(`Unknown method: ${method}`)
    }
  }
  
  // 权限检查方法
  private async checkPermission(requestContext: any): Promise<boolean> {
    const { userId, action = 'execute' } = requestContext
    
    // 如果没有用户ID，使用公开权限检查
    if (!userId) {
      return this.agent.shareScope === 'public' && action === 'read'
    }
    
    // 所有者永远有权限
    if (this.agent.userId === userId) {
      return true
    }
    
    // 私有智能体只有所有者可访问
    if (this.agent.isPrivate || this.agent.shareLevel === 0) {
      return false
    }
    
    // 根据共享范围检查权限
    switch (this.agent.shareScope) {
      case 'friends':
        return this.agent.allowedUsers?.includes(userId) || false
      case 'groups':
        return await this.checkGroupAccess(userId)
      case 'public':
        return action === 'read' || action === 'execute'
      default:
        return false
    }
  }
  
  private async checkGroupAccess(userId: string): Promise<boolean> {
    if (this.agent.allowedGroups?.length) {
      // TODO: 实现群组权限检查逻辑
      return false
    }
    return false
  }
}
```

## 混合通信架构

### 智能体服务端实现

#### PC 端本地服务 (标准 A2A 端点)

```typescript
class PCAgentServer {
  private app: express.Application
  private server: http.Server
  private agent: AgentConfig
  
  async start(port: number = 0): Promise<void> {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
    
    // 监听 localhost，暴露标准 A2A 端点
    this.server = this.app.listen(port, '127.0.0.1', () => {
      const addr = this.server.address() as any
      console.log(`PC Agent Server listening on localhost:${addr.port}`)
      
      // 注册标准端点到注册中心
      this.registerStandardEndpoint(addr.port)
      
      // 同时注册 IM 桥接作为备用
      this.registerIMBridge(addr.port)
    })
  }
  
  private setupRoutes(): void {
    // A2A 协议标准端点
    this.app.get('/.well-known/agent-card.json', this.handleAgentCard.bind(this))
    this.app.post('/agent/execute', this.handleExecute.bind(this))
    
    // SSE 流式端点
    this.app.get('/agent/sse', this.handleSSE.bind(this))
    
    // 健康检查
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        agentId: this.agent.id,
        timestamp: Date.now() 
      })
    })
  }
  
  // 返回智能体卡片
  private handleAgentCard(req: Request, res: Response): void {
    const serverAddress = this.server.address() as any
    const localUrl = `http://localhost:${serverAddress.port}`
    
    const card: RooAgentCard = {
      id: this.agent.id,
      userId: this.agent.userId,
      name: this.agent.name,
      description: this.agent.roleDescription,
      skills: this.agent.tools.map(t => t.toolId),
      url: localUrl,                    // PC 端也有标准端点 URL
      capabilities: {
        messageTypes: ['text', 'json'],
        taskTypes: ['execute', 'query'],
        dataFormats: ['json', 'markdown'],
        maxConcurrency: 1
      },
      deployment: {
        type: 'pc',
        platform: 'vscode',
        networkReachable: false         // 标识网络不可从外部访问
      },
      auth: {
        authType: 'none'               // PC 端本地访问不需要认证
      }
    }
    
    res.json(card)
  }
  
  // 注册标准端点
  private async registerStandardEndpoint(port: number): Promise<void> {
    const endpoint: AgentEndpoint = {
      agentId: this.agent.id,
      type: 'local_with_standard_endpoint',  // 新类型：有标准端点但网络不可达
      directUrl: `http://localhost:${port}`,
      networkReachable: false,               // 关键：标识网络不可达
      imProxyId: `proxy_${this.agent.id}`,
      userId: this.agent.userId
    }
    
    // 注册到统一注册中心
    await this.updateAgentEndpoint(endpoint)
  }
  
  // 处理智能体执行请求
  private async handleExecute(req: Request, res: Response): Promise<void> {
    try {
      const { method, params } = req.body
      const executor = new RooAgentExecutor(this.agent, this.storageService)
      
      // 创建事件总线
      const eventBus = new LocalEventBus()
      
      // 收集响应
      const responses: any[] = []
      eventBus.on('message', (msg) => responses.push(msg))
      
      // 执行请求
      await executor.execute({ method, params }, eventBus)
      
      res.json({ 
        success: true, 
        responses,
        agentId: this.agent.id,
        timestamp: Date.now()
      })
      
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        agentId: this.agent.id
      })
    }
  }
  
  // SSE 流式处理
  private async handleSSE(req: Request, res: Response): Promise<void> {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*'
    })
    
    const { method, params } = req.query
    
    try {
      const executor = new RooAgentExecutor(this.agent, this.storageService)
      const eventBus = new SSEEventBus(res)
      
      await executor.execute({ 
        method, 
        params: JSON.parse(params as string) 
      }, eventBus)
      
    } catch (error) {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`)
    } finally {
      res.end()
    }
  }
}

// SSE 事件总线
class SSEEventBus {
  constructor(private res: Response) {}
  
  publish(message: any): void {
    this.res.write(`data: ${JSON.stringify(message)}\n\n`)
  }
  
  finished(): void {
    this.res.write(`data: ${JSON.stringify({ type: 'end' })}\n\n`)
  }
}
```

#### 云端智能体服务

```typescript
class CloudAgentServer {
  private app: express.Application
  private server: http.Server
  private agent: AgentConfig
  
  async start(config: CloudServerConfig): Promise<void> {
    this.app = express()
    this.setupMiddleware()
    this.setupRoutes()
    
    // 支持公网访问
    const host = config.enablePublic ? '0.0.0.0' : '127.0.0.1'
    
    this.server = this.app.listen(config.port, host, () => {
      const addr = this.server.address() as any
      console.log(`Cloud Agent Server listening on ${host}:${addr.port}`)
      
      // 注册公网端点
      this.registerPublicEndpoint(config, addr.port)
    })
  }
  
  private setupMiddleware(): void {
    // 认证中间件
    this.app.use('/agent', this.authenticateRequest.bind(this))
    
    // CORS 支持
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
      res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization')
      next()
    })
  }
  
  private authenticateRequest(req: Request, res: Response, next: Function): void {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }
    
    const token = authHeader.substring(7)
    if (!this.validateApiKey(token)) {
      return res.status(401).json({ error: 'Invalid API key' })
    }
    
    next()
  }
  
  private async registerPublicEndpoint(config: CloudServerConfig, port: number): Promise<void> {
    const publicUrl = `${config.protocol}://${config.domain}:${port}`
    
    const endpoint: AgentEndpoint = {
      agentId: this.agent.id,
      type: 'network_reachable',
      directUrl: publicUrl,
      apiKey: this.generateApiKey(),
      imProxyId: `proxy_${this.agent.id}`,
      userId: this.agent.userId
    }
    
    // 更新 Redis 注册信息
    await this.updateAgentEndpoint(endpoint)
    
    // 也注册到 IM（备用通道）
    await this.registerToIM(endpoint)
  }
}

interface CloudServerConfig {
  port: number
  enablePublic: boolean
  protocol: 'http' | 'https'
  domain: string
  apiKey?: string
}
```

## IM 桥接实现

### IM 桥接服务

```typescript
class AgentIMBridge {
  private localServer: PCAgentServer
  private imConnection: RooCodeIMConnection
  private pendingRequests: Map<string, PendingRequest> = new Map()
  
  constructor(localServer: PCAgentServer) {
    this.localServer = localServer
    this.imConnection = new RooCodeIMConnection()
    this.setupIMHandlers()
  }
  
  async start(): Promise<void> {
    await this.imConnection.connect()
    await this.registerAgent()
  }
  
  // 注册智能体到 IM 平台
  private async registerAgent(): Promise<void> {
    const agent = this.localServer.getAgent()
    
    const registration = {
      cmd: 25, // AGENT_REGISTER
      data: {
        agentId: agent.id,
        userId: agent.userId,
        name: agent.name,
        description: agent.roleDescription,
        capabilities: agent.tools.map(t => t.toolId),
        isPrivate: agent.isPrivate,
        proxyId: `proxy_${agent.id}`,
        deployment: {
          type: 'pc',
          platform: 'vscode'
        }
      }
    }
    
    this.imConnection.send(registration)
  }
  
  // 设置 IM 消息处理器
  private setupIMHandlers(): void {
    // 处理智能体调用请求
    this.imConnection.onMessage(26, this.handleAgentCall.bind(this)) // AGENT_CALL
    
    // 处理流式请求
    this.imConnection.onMessage(27, this.handleAgentStream.bind(this)) // AGENT_STREAM
    
    // 处理流式取消
    this.imConnection.onMessage(28, this.handleStreamCancel.bind(this)) // STREAM_CANCEL
  }
  
  // 处理来自 IM 的智能体调用
  private async handleAgentCall(data: any): Promise<void> {
    const { requestId, fromAgentId, fromUserId, method, params } = data
    
    try {
      // 转发到本地服务器
      const result = await this.callLocalAgent(method, params)
      
      // 通过 IM 返回响应
      this.imConnection.send({
        cmd: 29, // AGENT_RESPONSE
        data: {
          requestId,
          toAgentId: fromAgentId,
          toUserId: fromUserId,
          success: true,
          result,
          timestamp: Date.now()
        }
      })
      
    } catch (error) {
      // 返回错误响应
      this.imConnection.send({
        cmd: 29, // AGENT_RESPONSE
        data: {
          requestId,
          toAgentId: fromAgentId,
          toUserId: fromUserId,
          success: false,
          error: error.message,
          timestamp: Date.now()
        }
      })
    }
  }
  
  // 处理流式请求
  private async handleAgentStream(data: any): Promise<void> {
    const { streamId, fromAgentId, fromUserId, method, params } = data
    
    try {
      // 创建本地 SSE 连接
      const stream = await this.createLocalStream(method, params)
      
      // 转发流数据到 IM
      stream.on('data', (chunk) => {
        this.imConnection.send({
          cmd: 30, // AGENT_STREAM_CHUNK
          data: {
            streamId,
            toAgentId: fromAgentId,
            toUserId: fromUserId,
            chunk,
            timestamp: Date.now()
          }
        })
      })
      
      stream.on('end', () => {
        this.imConnection.send({
          cmd: 31, // AGENT_STREAM_END
          data: {
            streamId,
            toAgentId: fromAgentId,
            toUserId: fromUserId,
            timestamp: Date.now()
          }
        })
      })
      
      stream.on('error', (error) => {
        this.imConnection.send({
          cmd: 32, // AGENT_STREAM_ERROR
          data: {
            streamId,
            toAgentId: fromAgentId,
            toUserId: fromUserId,
            error: error.message,
            timestamp: Date.now()
          }
        })
      })
      
    } catch (error) {
      this.imConnection.send({
        cmd: 32, // AGENT_STREAM_ERROR
        data: {
          streamId,
          toAgentId: fromAgentId,
          toUserId: fromUserId,
          error: error.message,
          timestamp: Date.now()
        }
      })
    }
  }
  
  // 调用本地智能体
  private async callLocalAgent(method: string, params: any): Promise<any> {
    const localPort = this.localServer.getPort()
    
    const response = await fetch(`http://localhost:${localPort}/agent/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ method, params })
    })
    
    if (!response.ok) {
      throw new Error(`Local agent call failed: ${response.statusText}`)
    }
    
    return response.json()
  }
  
  // 创建本地流连接
  private async createLocalStream(method: string, params: any): Promise<EventSource> {
    const localPort = this.localServer.getPort()
    const url = `http://localhost:${localPort}/agent/sse?method=${method}&params=${encodeURIComponent(JSON.stringify(params))}`
    
    return new EventSource(url)
  }
}

interface PendingRequest {
  requestId: string
  fromAgentId: string
  timestamp: number
  resolve: (result: any) => void
  reject: (error: Error) => void
}
```

## 智能路由服务

### 路由决策引擎

```typescript
class AgentRoutingService {
  private registry: UnifiedAgentRegistry
  private loadBalancer: AgentLoadBalancer
  
  // 智能选择通信路径
  async routeToAgent(
    sourceAgentId: string,
    targetAgentId: string,
    request: AgentRequest,
    options?: RoutingOptions
  ): Promise<AgentResponse> {
    // 1. 获取源和目标智能体信息
    const [sourceEndpoint, targetEndpoint] = await Promise.all([
      this.getEndpoint(sourceAgentId),
      this.getEndpoint(targetAgentId)
    ])
    
    // 2. 权限检查
    const hasPermission = await this.checkPermissions(sourceEndpoint, targetEndpoint, request)
    if (!hasPermission) {
      throw new Error(`Access denied: ${sourceAgentId} cannot access ${targetAgentId}`)
    }
    
    // 3. 选择最优路由
    const route = await this.selectOptimalRoute(
      sourceEndpoint, 
      targetEndpoint, 
      options
    )
    
    // 4. 执行调用
    return this.executeRoute(route, targetEndpoint, request)
  }
  
  // 权限检查方法
  private async checkPermissions(
    sourceEndpoint: AgentEndpoint,
    targetEndpoint: AgentEndpoint,
    request: AgentRequest
  ): Promise<boolean> {
    const targetAgent = await this.getAgentConfig(targetEndpoint.agentId)
    if (!targetAgent) {
      return false
    }
    
    const sourceUserId = sourceEndpoint.userId
    const targetUserId = targetAgent.userId
    
    // 1. 所有者永远有权限
    if (sourceUserId === targetUserId) {
      return true
    }
    
    // 2. 私有智能体只有所有者可访问
    if (targetAgent.isPrivate || targetAgent.shareLevel === 0) {
      return false
    }
    
    // 3. 根据共享范围检查权限
    switch (targetAgent.shareScope) {
      case 'friends':
        // 好友级别：检查好友白名单
        if (targetAgent.allowedUsers?.length) {
          return targetAgent.allowedUsers.includes(sourceUserId)
        }
        // TODO: 检查是否为好友关系
        return false
        
      case 'groups':
        // 群组级别：检查群组白名单或共同群组
        if (targetAgent.allowedGroups?.length) {
          // TODO: 获取源用户的群组并检查交集
          return false
        }
        // TODO: 检查共同群组
        return false
        
      case 'public':
        // 公开级别：所有认证用户可访问
        return true
        
      default:
        return false
    }
  }
  
  // 获取智能体配置信息
  private async getAgentConfig(agentId: string): Promise<AgentConfig | null> {
    try {
      const data = await this.redis.hget(`roo:agent:${agentId}:details`, 'data')
      if (!data) return null
      return JSON.parse(data)
    } catch (error) {
      console.error(`Failed to get agent config for ${agentId}:`, error)
      return null
    }
  }
  
  // 路由选择算法 (调整后)
  private async selectOptimalRoute(
    source: AgentEndpoint,
    target: AgentEndpoint,
    options?: RoutingOptions
  ): Promise<RouteType> {
    // 1. 强制路由选项
    if (options?.forceRoute) {
      return options.forceRoute
    }
    
    // 2. 目标智能体离线，返回错误
    if (target.status.state !== 'online') {
      throw new Error(`Target agent ${target.agentId} is offline`)
    }
    
    // 3. 所有智能体都先尝试直连
    if (target.endpoint.directUrl) {
      // 3.1 如果明确标识网络可达，直接使用直连
      if (target.networkReachable === true) {
        return 'direct'
      }
      
      // 3.2 如果网络可达性未知或为 false，使用试探性直连
      return 'probe_then_fallback'
    }
    
    // 4. 没有直连端点，只能使用 IM
    return 'im_bridge'
  }
  
  // 执行路由调用
  private async executeRoute(
    route: RouteType,
    target: AgentEndpoint,
    request: AgentRequest
  ): Promise<AgentResponse> {
    const startTime = Date.now()
    
    try {
      let response: AgentResponse
      
      switch (route) {
        case 'direct':
          response = await this.directCall(target, request)
          break
        case 'im_bridge':
          response = await this.imBridgeCall(target, request)
          break
        case 'probe_then_fallback':
          response = await this.probeAndFallbackCall(target, request)
          break
        case 'hybrid':
          response = await this.hybridCall(target, request)
          break
        default:
          throw new Error(`Unknown route type: ${route}`)
      }
      
      // 更新性能指标
      const duration = Date.now() - startTime
      await this.updateMetrics(target.agentId, route, duration, true)
      
      return response
      
    } catch (error) {
      // 记录失败指标
      const duration = Date.now() - startTime
      await this.updateMetrics(target.agentId, route, duration, false)
      
      throw error
    }
  }
  
  // 直连调用
  private async directCall(
    target: AgentEndpoint,
    request: AgentRequest
  ): Promise<AgentResponse> {
    const { direct } = target.endpoint
    if (!direct) {
      throw new Error('Direct endpoint not available')
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (direct.apiKey) {
      headers['Authorization'] = `Bearer ${direct.apiKey}`
    }
    
    const response = await fetch(`${direct.url}/agent/execute`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        method: request.method,
        params: request.params
      }),
      timeout: request.timeout || 30000
    })
    
    if (!response.ok) {
      throw new Error(`Direct call failed: ${response.status} ${response.statusText}`)
    }
    
    const result = await response.json()
    
    return {
      success: result.success,
      data: result.data || result.responses,
      agentId: target.agentId,
      route: 'direct',
      timestamp: Date.now()
    }
  }
  
  // IM 桥接调用
  private async imBridgeCall(
    target: AgentEndpoint,
    request: AgentRequest
  ): Promise<AgentResponse> {
    const requestId = this.generateRequestId()
    
    // 发送请求到 IM
    const imConnection = this.getIMConnection()
    
    imConnection.send({
      cmd: 26, // AGENT_CALL
      data: {
        requestId,
        targetAgentId: target.agentId,
        targetUserId: target.userId,
        method: request.method,
        params: request.params,
        timeout: request.timeout || 30000
      }
    })
    
    // 等待响应
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId)
        reject(new Error('IM bridge call timeout'))
      }, request.timeout || 30000)
      
      this.pendingRequests.set(requestId, {
        resolve: (response) => {
          clearTimeout(timeoutId)
          resolve({
            success: response.success,
            data: response.result,
            error: response.error,
            agentId: target.agentId,
            route: 'im_bridge',
            timestamp: Date.now()
          })
        },
        reject: (error) => {
          clearTimeout(timeoutId)
          reject(error)
        }
      })
    })
  }
  
  // 试探性直连后降级 (新增)
  private async probeAndFallbackCall(
    target: AgentEndpoint,
    request: AgentRequest
  ): Promise<AgentResponse> {
    const probeTimeout = 3000 // 3秒试探超时
    
    try {
      // 快速试探连接
      const probeResponse = await Promise.race([
        this.directCall(target, { ...request, timeout: probeTimeout }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Probe timeout')), probeTimeout)
        )
      ]) as AgentResponse
      
      // 试探成功，更新网络可达性状态
      await this.updateNetworkReachability(target.agentId, true)
      
      return probeResponse
      
    } catch (directError) {
      console.log(`Direct probe failed for ${target.agentId}, falling back to IM:`, directError.message)
      
      // 更新网络可达性状态
      await this.updateNetworkReachability(target.agentId, false)
      
      // 降级到 IM 桥接
      return await this.imBridgeCall(target, request)
    }
  }
  
  // 混合调用（先尝试直连，失败则 IM）
  private async hybridCall(
    target: AgentEndpoint,
    request: AgentRequest
  ): Promise<AgentResponse> {
    try {
      return await this.directCall(target, request)
    } catch (directError) {
      console.log(`Direct call failed for ${target.agentId}, trying IM bridge:`, directError.message)
      return await this.imBridgeCall(target, request)
    }
  }
  
  // 更新网络可达性状态
  private async updateNetworkReachability(agentId: string, reachable: boolean): Promise<void> {
    await this.redis.hset(
      `roo:agent:${agentId}:endpoint`,
      'networkReachable', reachable.toString(),
      'lastProbeTime', Date.now().toString()
    )
  }
}

// 数据结构定义
interface AgentRequest {
  method: string
  params: any
  timeout?: number
  priority?: 'low' | 'normal' | 'high'
  retries?: number
}

interface AgentResponse {
  success: boolean
  data?: any
  error?: string
  agentId: string
  route: RouteType
  timestamp: number
  duration?: number
}

type RouteType = 'direct' | 'im_bridge' | 'probe_then_fallback' | 'hybrid'

interface RoutingOptions {
  forceRoute?: RouteType
  maxRetries?: number
  preferDirect?: boolean
  timeout?: number
}
```

## 负载均衡与故障转移

### 负载均衡器

```typescript
class AgentLoadBalancer {
  private metrics: AgentMetricsCollector
  
  // 选择最优智能体实例
  async selectOptimalAgent(
    capability: string,
    userId: string,
    options?: LoadBalancingOptions
  ): Promise<AgentEndpoint> {
    // 1. 获取具有该能力的所有智能体
    const candidates = await this.getCandidateAgents(capability, userId)
    
    if (candidates.length === 0) {
      throw new Error(`No agents available for capability: ${capability}`)
    }
    
    // 2. 过滤健康的智能体
    const healthyAgents = candidates.filter(agent => 
      agent.status.state === 'online' && 
      agent.status.errorRate < 0.5
    )
    
    if (healthyAgents.length === 0) {
      throw new Error(`No healthy agents available for capability: ${capability}`)
    }
    
    // 3. 应用负载均衡算法
    return this.applyLoadBalancingAlgorithm(healthyAgents, options)
  }
  
  // 负载均衡算法
  private applyLoadBalancingAlgorithm(
    agents: AgentEndpoint[],
    options?: LoadBalancingOptions
  ): AgentEndpoint {
    const algorithm = options?.algorithm || 'weighted_round_robin'
    
    switch (algorithm) {
      case 'round_robin':
        return this.roundRobin(agents)
      case 'least_connections':
        return this.leastConnections(agents)
      case 'weighted_round_robin':
        return this.weightedRoundRobin(agents)
      case 'response_time':
        return this.fastestResponse(agents)
      default:
        return agents[0] // 默认选择第一个
    }
  }
  
  // 加权轮询算法
  private weightedRoundRobin(agents: AgentEndpoint[]): AgentEndpoint {
    let bestAgent = agents[0]
    let bestScore = -Infinity
    
    for (const agent of agents) {
      // 计算权重分数
      const score = this.calculateAgentScore(agent)
      
      if (score > bestScore) {
        bestScore = score
        bestAgent = agent
      }
    }
    
    return bestAgent
  }
  
  // 智能体评分算法
  private calculateAgentScore(agent: AgentEndpoint): number {
    const load = agent.status.currentLoad || 0
    const errorRate = agent.status.errorRate || 0
    const responseTime = agent.status.avgResponseTime || 1000
    
    // 云端智能体有优势
    const deploymentBonus = agent.deploymentType === 'cloud' ? 20 : 0
    
    // 直连优于 IM 桥接
    const connectionBonus = agent.endpoint.type === 'network_reachable' ? 10 : 0
    
    // 综合评分：负载越低、错误率越低、响应时间越短，分数越高
    const score = 100 - load * 50 - errorRate * 30 - responseTime / 100 + 
                  deploymentBonus + connectionBonus
    
    return score
  }
}
```

### 故障转移机制

```typescript
class AgentFailoverManager {
  private healthChecker: AgentHealthChecker
  private circuitBreaker: Map<string, CircuitBreaker> = new Map()
  
  // 健康检查
  async performHealthCheck(): Promise<void> {
    const allAgents = await this.getAllAgents()
    
    const healthChecks = allAgents.map(agent => 
      this.checkAgentHealth(agent).catch(error => ({
        agentId: agent.agentId,
        healthy: false,
        error: error.message
      }))
    )
    
    const results = await Promise.allSettled(healthChecks)
    
    // 更新智能体状态
    for (const result of results) {
      if (result.status === 'fulfilled') {
        await this.updateAgentHealth(result.value)
      }
    }
  }
  
  // 检查单个智能体健康状态
  private async checkAgentHealth(agent: AgentEndpoint): Promise<HealthResult> {
    const circuitBreaker = this.getCircuitBreaker(agent.agentId)
    
    // 断路器开启时跳过检查
    if (circuitBreaker.isOpen()) {
      return {
        agentId: agent.agentId,
        healthy: false,
        error: 'Circuit breaker open'
      }
    }
    
    try {
      if (agent.endpoint.type === 'network_reachable') {
        // 直连健康检查
        const response = await fetch(`${agent.endpoint.direct!.url}/health`, {
          timeout: 5000
        })
        
        if (response.ok) {
          circuitBreaker.recordSuccess()
          return { agentId: agent.agentId, healthy: true }
        } else {
          throw new Error(`Health check failed: ${response.status}`)
        }
      } else {
        // IM 桥接健康检查（通过心跳）
        const lastSeen = agent.status.lastSeen
        const isHealthy = Date.now() - lastSeen < 60000 // 1分钟内有心跳
        
        if (isHealthy) {
          return { agentId: agent.agentId, healthy: true }
        } else {
          throw new Error('No recent heartbeat')
        }
      }
    } catch (error) {
      circuitBreaker.recordFailure()
      return {
        agentId: agent.agentId,
        healthy: false,
        error: error.message
      }
    }
  }
  
  // 获取断路器
  private getCircuitBreaker(agentId: string): CircuitBreaker {
    if (!this.circuitBreaker.has(agentId)) {
      this.circuitBreaker.set(agentId, new CircuitBreaker({
        failureThreshold: 5,    // 5次失败后开启
        timeout: 60000,        // 60秒后尝试恢复
        resetTimeout: 30000    // 30秒重置计数
      }))
    }
    return this.circuitBreaker.get(agentId)!
  }
}

// 断路器实现
class CircuitBreaker {
  private state: 'closed' | 'open' | 'half_open' = 'closed'
  private failureCount = 0
  private lastFailureTime = 0
  
  constructor(private config: {
    failureThreshold: number
    timeout: number
    resetTimeout: number
  }) {}
  
  isOpen(): boolean {
    // 超时后尝试半开
    if (this.state === 'open' && 
        Date.now() - this.lastFailureTime > this.config.timeout) {
      this.state = 'half_open'
      return false
    }
    
    return this.state === 'open'
  }
  
  recordSuccess(): void {
    this.failureCount = 0
    this.state = 'closed'
  }
  
  recordFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = 'open'
    }
  }
}
```

## 性能优化

### 连接池管理

```typescript
class AgentConnectionPool {
  private pools: Map<string, HttpAgent[]> = new Map()
  private maxPoolSize = 10
  
  // 获取连接
  async getConnection(agentUrl: string): Promise<HttpAgent> {
    const pool = this.pools.get(agentUrl) || []
    
    // 复用空闲连接
    const idleAgent = pool.find(agent => !agent.busy)
    if (idleAgent) {
      idleAgent.busy = true
      return idleAgent
    }
    
    // 创建新连接
    if (pool.length < this.maxPoolSize) {
      const newAgent = new HttpAgent(agentUrl)
      newAgent.busy = true
      pool.push(newAgent)
      this.pools.set(agentUrl, pool)
      return newAgent
    }
    
    // 等待连接可用
    return this.waitForConnection(agentUrl)
  }
  
  // 释放连接
  releaseConnection(agent: HttpAgent): void {
    agent.busy = false
    agent.lastUsed = Date.now()
    
    // 定期清理过期连接
    setTimeout(() => this.cleanupExpiredConnections(), 60000)
  }
}
```

### 响应缓存

```typescript
class AgentResponseCache {
  private cache: Map<string, CacheEntry> = new Map()
  private ttl = 300000 // 5分钟缓存
  
  // 生成缓存键
  private getCacheKey(agentId: string, method: string, params: any): string {
    return `${agentId}:${method}:${JSON.stringify(params)}`
  }
  
  // 获取缓存
  get(agentId: string, method: string, params: any): any | null {
    const key = this.getCacheKey(agentId, method, params)
    const entry = this.cache.get(key)
    
    if (!entry || Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data
  }
  
  // 设置缓存
  set(agentId: string, method: string, params: any, data: any): void {
    const key = this.getCacheKey(agentId, method, params)
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }
}
```

## 安全机制

### API 密钥管理

```typescript
class AgentSecurityManager {
  // 生成 API 密钥
  generateApiKey(agentId: string): string {
    const timestamp = Date.now()
    const random = crypto.randomBytes(16).toString('hex')
    return `ak_${agentId}_${timestamp}_${random}`
  }
  
  // 验证 API 密钥
  async validateApiKey(apiKey: string, agentId: string): Promise<boolean> {
    // 从 Redis 获取有效密钥
    const validKeys = await this.redis.smembers(`agent:${agentId}:api_keys`)
    return validKeys.includes(apiKey)
  }
  
  // 撤销 API 密钥
  async revokeApiKey(apiKey: string, agentId: string): Promise<void> {
    await this.redis.srem(`agent:${agentId}:api_keys`, apiKey)
  }
}
```

### 请求限流

```typescript
class AgentRateLimiter {
  private limits: Map<string, RateLimit> = new Map()
  
  // 检查速率限制
  async checkRateLimit(userId: string, agentId: string): Promise<boolean> {
    const key = `${userId}:${agentId}`
    const limit = this.limits.get(key) || { count: 0, resetTime: 0 }
    
    const now = Date.now()
    const windowSize = 60000 // 1分钟窗口
    
    // 重置窗口
    if (now > limit.resetTime) {
      limit.count = 0
      limit.resetTime = now + windowSize
    }
    
    // 检查限制
    if (limit.count >= 100) { // 每分钟最多100次请求
      return false
    }
    
    limit.count++
    this.limits.set(key, limit)
    return true
  }
}
```

## 总结

该 A2A 通信方案实现了：

1. **标准协议集成**：基于 a2a-js 的智能体卡片和执行器
2. **混合通信模式**：PC 端 IM 桥接 + 云端直连
3. **智能路由**：自动选择最优通信路径
4. **负载均衡**：多实例智能体的智能调度
5. **故障转移**：断路器模式和健康检查
6. **性能优化**：连接池、缓存、压缩传输
7. **安全保障**：认证、授权、限流机制

---

## ⚠️ 实施人员必读

**关键提醒**: 在开始实施前，请务必阅读 `智能体实施关键信息.md` 文档，其中包含了架构理解、项目职责分工、常见陷阱等关键信息，避免实施走偏。

**A2A通信要点**:
1. A2AServer在roo-code扩展中实现，不是void项目
2. 网络探测优先，直连失败后降级IM桥接
3. 权限验证在每次调用前必须执行
4. PC环境依赖IM桥接，Docker环境优先直连

下一步将输出注册中心的详细设计文档。