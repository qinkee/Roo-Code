import {
	AgentExecutor,
	RequestContext,
	DefaultRequestHandler,
	InMemoryTaskStore,
	AgentCard,
	ExecutionEventBus,
	DefaultExecutionEventBusManager,
} from "@a2a-js/sdk/server"
import { logger } from "../../utils/logging"
import { NetworkUtils } from "../../utils/network"
import { AgentConfig, AgentRequest, AgentResponse } from "@roo-code/types"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { UnifiedAgentRegistry } from "./UnifiedAgentRegistry"
import { AgentResourceManager } from "./AgentResourceManager"
import { A2AConnectionManager } from "./A2AConnectionManager"

/**
 * A2A协议服务器实现
 * 使用官方 @a2a-js/sdk 构建标准A2A服务
 */
export class A2AServer {
	private handlers: Map<string, DefaultRequestHandler> = new Map()
	private taskStore: InMemoryTaskStore
	private eventBusManager: DefaultExecutionEventBusManager
	private storageService: EnhancedAgentStorageService
	private registry: UnifiedAgentRegistry
	private resourceManager: AgentResourceManager
	private connectionManager: A2AConnectionManager
	private servers: Map<string, any> = new Map()

	constructor(storageService: EnhancedAgentStorageService) {
		this.storageService = storageService
		this.registry = UnifiedAgentRegistry.getInstance()
		this.resourceManager = AgentResourceManager.getInstance()
		this.connectionManager = A2AConnectionManager.getInstance()

		// 初始化TaskStore和EventBusManager
		try {
			this.taskStore = new InMemoryTaskStore()
			this.eventBusManager = new DefaultExecutionEventBusManager()
			logger.info("[A2AServer] InMemoryTaskStore and EventBusManager created successfully")
		} catch (error) {
			logger.error("[A2AServer] Failed to create TaskStore or EventBusManager:", error)
			throw error
		}

		this.initializeHandlers()
	}

	/**
	 * 初始化请求处理器
	 */
	private initializeHandlers(): void {
		// 根据官方SDK文档，DefaultRequestHandler需要AgentCard, TaskStore, AgentExecutor三个参数
		// 这里我们先不创建通用处理器，而是在启动时为每个智能体单独创建
		logger.info("[A2AServer] Handlers will be created per agent")
	}

	/**
	 * 创建通用智能体执行器
	 */
	private createUniversalExecutor(): AgentExecutor {
		return async (context: RequestContext) => {
			const { request, agentId } = context

			try {
				logger.info(`[A2AServer] Executing request for agent: ${agentId}`)

				// 获取智能体配置
				const agent = await this.getAgentByAnyUser(agentId)
				if (!agent) {
					throw new Error(`Agent ${agentId} not found`)
				}

				// 检查权限
				const hasPermission = await this.checkExecutePermission(agentId, request.sourceUserId)
				if (!hasPermission) {
					throw new Error(`Access denied for agent ${agentId}`)
				}

				// 执行智能体逻辑
				const result = await this.executeAgentLogic(agent, request)

				// 返回执行结果
				return {
					success: true,
					data: result.data,
					timestamp: Date.now(),
					agentId,
					route: "a2a_official",
				}
			} catch (error) {
				logger.error(`[A2AServer] Execution failed for agent ${agentId}:`, error)
				throw error
			}
		}
	}

	/**
	 * 使用智能体数据启动A2A服务器（避免重新查询）
	 */
	async startAgentServerWithData(
		agent: AgentConfig,
		port: number = 0,
	): Promise<{
		port: number
		url: string
		agentCard: any
	}> {
		try {
			logger.info(`[A2AServer] Starting A2A server with provided data for agent ${agent.id}`)

			// 创建A2A AgentCard
			const a2aAgentCard = await this.createA2AAgentCard(agent, port)

			// 创建专用的执行器
			const agentExecutor = this.createAgentSpecificExecutor(agent)

			// 根据官方文档创建处理器，传递所有必需的参数
			const handler = new DefaultRequestHandler(
				a2aAgentCard,
				this.taskStore,
				agentExecutor,
				this.eventBusManager, // 第4个参数：EventBusManager
			)

			// 启动服务器（这里需要根据@a2a-js/sdk的实际API调整）
			// 注意：官方SDK可能有不同的启动方式，这里是示例实现
			const server = await this.startServerInstance(handler, port)
			const actualPort = server.port || port
			const url =
				server.url || NetworkUtils.buildServerUrl(await NetworkUtils.getRecommendedBindAddress(), actualPort)

			// 更新AgentCard的URL为实际的端口
			if (handler.agentCard) {
				handler.agentCard.url = url
			}

			// 存储服务器实例
			this.servers.set(agent.id, server)

			// 生成智能体卡片（兼容格式）
			const agentCard = this.generateAgentCard(agent, url, server.bindAddress)

			// 注册到统一注册中心
			await this.registerAgentToRegistry(agent, url)

			logger.info(`[A2AServer] Started A2A server for agent ${agent.id} on port ${actualPort}`)

			return {
				port: actualPort,
				url,
				agentCard,
			}
		} catch (error) {
			logger.error(`[A2AServer] Failed to start server for agent ${agent.id}:`, error)
			throw error
		}
	}

	/**
	 * 启动指定智能体的A2A服务
	 */
	async startAgentServer(
		agentId: string,
		port: number = 0,
	): Promise<{
		port: number
		url: string
		agentCard: any
	}> {
		try {
			// 获取智能体配置
			const agent = await this.getAgentByAnyUser(agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found`)
			}

			// 创建A2A AgentCard
			const a2aAgentCard = await this.createA2AAgentCard(agent, port)

			// 创建专用的执行器
			const agentExecutor = this.createAgentSpecificExecutor(agent)

			// 调试：检查参数
			logger.info(`[A2AServer] Creating DefaultRequestHandler with:`, {
				agentCard: !!a2aAgentCard,
				taskStore: !!this.taskStore,
				agentExecutor: !!agentExecutor,
				agentCardDetails: a2aAgentCard ? Object.keys(a2aAgentCard) : "undefined",
				taskStoreType: this.taskStore?.constructor?.name || "undefined",
				executorType: typeof agentExecutor,
			})

			// 根据官方文档创建处理器，传递所有必需的参数
			const handler = new DefaultRequestHandler(
				a2aAgentCard,
				this.taskStore,
				agentExecutor,
				this.eventBusManager, // 第4个参数：EventBusManager
			)

			// 启动服务器（这里需要根据@a2a-js/sdk的实际API调整）
			// 注意：官方SDK可能有不同的启动方式，这里是示例实现
			const server = await this.startServerInstance(handler, port)
			const actualPort = server.port || port
			const url =
				server.url || NetworkUtils.buildServerUrl(await NetworkUtils.getRecommendedBindAddress(), actualPort)

			// 更新AgentCard的URL为实际的端口
			if (handler.agentCard) {
				handler.agentCard.url = url
			}

			// 存储服务器实例
			this.servers.set(agentId, server)

			// 生成智能体卡片（兼容格式）
			const agentCard = this.generateAgentCard(agent, url, server.bindAddress)

			// 注册到统一注册中心
			await this.registerAgentToRegistry(agent, url)

			logger.info(`[A2AServer] Started A2A server for agent ${agentId} on port ${actualPort}`)

			return {
				port: actualPort,
				url,
				agentCard,
			}
		} catch (error) {
			logger.error(`[A2AServer] Failed to start server for agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 创建符合A2A标准的AgentCard
	 */
	private async createA2AAgentCard(agent: AgentConfig, port: number): Promise<AgentCard> {
		const bindAddress = await NetworkUtils.getRecommendedBindAddress()
		// 注意：如果port为0，先用0生成URL，稍后会在服务器启动后更新
		const url = NetworkUtils.buildServerUrl(bindAddress, port)

		return {
			name: agent.name,
			description: agent.roleDescription,
			protocolVersion: "0.3.0",
			version: String(agent.version || "1.0.0"),
			url: url,
			capabilities: {
				streaming: true,
				pushNotifications: true,
				stateTransitionHistory: true,
			},
			skills: agent.tools
				?.filter((t) => t.enabled)
				.map((tool) => ({
					id: tool.toolId,
					name: tool.toolId,
					description: `Skill for ${tool.toolId}`,
					tags: [tool.toolId, "agent-tool"],
				})) || [
				{
					id: "chat",
					name: "Chat",
					description: "Basic chat functionality",
					tags: ["chat", "conversation"],
				},
			],
		}
	}

	/**
	 * 创建智能体专用执行器
	 */
	private createAgentSpecificExecutor(agent: AgentConfig): AgentExecutor {
		return {
			execute: async (requestContext: RequestContext, eventBus: ExecutionEventBus) => {
				const { request } = requestContext

				try {
					// 检查权限
					const hasPermission = await this.checkExecutePermission(agent.id, request.sourceUserId)
					if (!hasPermission) {
						throw new Error(`Access denied for agent ${agent.id}`)
					}

					// 检查资源配额
					await this.checkResourceQuota(agent.id)

					// 执行智能体逻辑
					const result = await this.executeAgentLogic(agent, request)

					// 通过事件总线发布响应
					await eventBus.publish({
						success: true,
						data: result.data,
						timestamp: Date.now(),
						agentId: agent.id,
						route: "a2a_official",
						duration: result.duration,
					})

					// 标记任务完成
					await eventBus.finished()

					// 更新使用统计
					await this.updateUsageStats(agent.id, true)
				} catch (error) {
					// 更新失败统计
					await this.updateUsageStats(agent.id, false)

					// 通过事件总线发布错误响应
					await eventBus.publish({
						success: false,
						error: error instanceof Error ? error.message : String(error),
						timestamp: Date.now(),
						agentId: agent.id,
					})

					// 标记任务完成
					await eventBus.finished()
				}
			},

			cancelTask: async (taskId: string, eventBus: ExecutionEventBus) => {
				// 实现任务取消逻辑
				logger.info(`[A2AServer] Cancelling task ${taskId} for agent ${agent.id}`)

				// 发布取消状态事件
				await eventBus.publish({
					kind: "status-update",
					taskId: taskId,
					contextId: "", // 在实际实现中需要正确的contextId
					status: { state: "canceled", timestamp: new Date().toISOString() },
					final: true,
				})

				// 标记完成
				await eventBus.finished()
			},
		}
	}

	/**
	 * 创建简化的处理器（临时解决方案）
	 */
	private createSimplifiedHandler(agentCard: AgentCard, agentExecutor: AgentExecutor): any {
		return {
			agentCard,
			executor: agentExecutor,
			// 模拟DefaultRequestHandler的基本功能
			handle: async (request: any) => {
				try {
					logger.info("[A2AServer] Handling request with simplified handler")
					// 这里可以实现基本的请求处理逻辑
					return { success: true, message: "Agent is running" }
				} catch (error) {
					logger.error("[A2AServer] Error in simplified handler:", error)
					throw error
				}
			},
		}
	}

	/**
	 * 启动服务器实例
	 * 注意：这里需要根据@a2a-js/sdk的实际API进行调整
	 */
	private async startServerInstance(handler: any, port: number): Promise<any> {
		const http = require("http")

		// 获取推荐的绑定地址
		const bindAddress = await NetworkUtils.getRecommendedBindAddress()
		logger.info(`[A2AServer] Will bind to address: ${bindAddress}`)

		// 创建真实的HTTP服务器
		const server = http.createServer(async (req: any, res: any) => {
			try {
				// 设置CORS头
				res.setHeader("Access-Control-Allow-Origin", "*")
				res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
				res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

				// 处理OPTIONS请求
				if (req.method === "OPTIONS") {
					res.writeHead(200)
					res.end()
					return
				}

				const url = req.url || "/"
				const method = req.method || "GET"

				logger.debug(`[A2AServer] ${method} ${url}`)

				// 基本路由处理
				if (url === "/" && method === "GET") {
					// 返回智能体卡片信息
					const agentCard = handler.agentCard || handler._agentCard
					res.writeHead(200, { "Content-Type": "application/json" })
					res.end(
						JSON.stringify(
							agentCard || {
								name: "A2A Agent",
								description: "Agent to Agent communication server",
								capabilities: { messaging: true },
							},
						),
					)
				} else if (url === "/health" && method === "GET") {
					// 健康检查
					res.writeHead(200, { "Content-Type": "application/json" })
					res.end(JSON.stringify({ status: "healthy", timestamp: Date.now() }))
				} else if (url === "/status" && method === "GET") {
					// 状态检查
					res.writeHead(200, { "Content-Type": "application/json" })
					res.end(
						JSON.stringify({
							status: "running",
							uptime: process.uptime(),
							port: port,
						}),
					)
				} else if (url === "/execute" && method === "POST") {
					// 处理执行请求
					let body = ""
					req.on("data", (chunk: any) => (body += chunk))
					req.on("end", async () => {
						try {
							const requestData = JSON.parse(body)
							logger.info(`[A2AServer] Execute request:`, requestData)

							// 简单的响应处理
							const response = {
								success: true,
								result: `Received: ${requestData.params?.message || "No message"}`,
								timestamp: Date.now(),
							}

							res.writeHead(200, { "Content-Type": "application/json" })
							res.end(JSON.stringify(response))
						} catch (error) {
							res.writeHead(400, { "Content-Type": "application/json" })
							res.end(JSON.stringify({ error: "Invalid JSON" }))
						}
					})
				} else {
					// 404
					res.writeHead(404, { "Content-Type": "application/json" })
					res.end(JSON.stringify({ error: "Not found" }))
				}
			} catch (error) {
				logger.error(`[A2AServer] Request handling error:`, error)
				res.writeHead(500, { "Content-Type": "application/json" })
				res.end(JSON.stringify({ error: "Internal server error" }))
			}
		})

		// 启动服务器
		const actualPort = await new Promise<number>((resolve, reject) => {
			const targetPort = port || 0
			server.listen(targetPort, bindAddress, () => {
				const address = server.address()
				if (address && typeof address === "object") {
					const serverInfo = NetworkUtils.getServerDisplayInfo(bindAddress, address.port)
					logger.info(`[A2AServer] HTTP server started:`, {
						bindAddress: serverInfo.bindAddress,
						port: address.port,
						publicUrl: serverInfo.publicUrl,
						localUrl: serverInfo.localUrl,
						allUrls: serverInfo.allUrls,
					})
					resolve(address.port)
				} else {
					reject(new Error("Failed to get server port"))
				}
			})

			server.on("error", (error: any) => {
				logger.error(`[A2AServer] Server error:`, error)
				reject(error)
			})
		})

		// 返回服务器对象
		const finalUrl = NetworkUtils.buildServerUrl(bindAddress, actualPort)

		const serverWrapper = {
			port: actualPort,
			status: "running",
			handler,
			url: finalUrl,
			bindAddress,
			httpServer: server,
			stop: async () => {
				logger.info(`[A2AServer] Stopping server on port ${actualPort}`)
				return new Promise<void>((resolve) => {
					server.close(() => {
						logger.info(`[A2AServer] Server stopped on port ${actualPort}`)
						resolve()
					})
				})
			},
		}

		logger.info(`[A2AServer] Real HTTP server started successfully on port ${actualPort}`)
		return serverWrapper
	}

	/**
	 * 停止智能体服务器
	 */
	async stopAgentServer(agentId: string): Promise<void> {
		const server = this.servers.get(agentId)
		if (server) {
			await server.stop()
			this.servers.delete(agentId)

			// 从注册中心注销
			await this.registry.unregisterAgent(agentId, "system")

			logger.info(`[A2AServer] Stopped A2A server for agent ${agentId}`)
		}
	}

	/**
	 * 停止所有服务器
	 */
	async stopAllServers(): Promise<void> {
		const stopPromises = Array.from(this.servers.keys()).map((agentId) => this.stopAgentServer(agentId))

		await Promise.all(stopPromises)
		logger.info(`[A2AServer] Stopped all A2A servers`)
	}

	/**
	 * 生成智能体卡片
	 */
	private generateAgentCard(agent: AgentConfig, url: string, bindAddress?: string): any {
		const localIP = NetworkUtils.getLocalIP()
		const isNetworkReachable = bindAddress && bindAddress !== "127.0.0.1"

		return {
			name: agent.name,
			description: agent.roleDescription,
			skills: agent.tools?.filter((t) => t.enabled).map((t) => t.toolId) || [],
			url,
			capabilities: {
				messageTypes: ["text", "json"],
				taskTypes: ["execute", "query", "status"],
				dataFormats: ["json", "markdown"],
				maxConcurrency: 1,
				networking: {
					directConnection: isNetworkReachable,
					bridgeSupport: true,
					localIP: localIP,
				},
			},
			deployment: {
				type: "pc",
				platform: "vscode",
				networkReachable: isNetworkReachable,
				bindAddress: bindAddress || "localhost",
				accessibility: {
					local: true,
					lan: isNetworkReachable,
					wan: false, // PC智能体通常不暴露到公网
				},
			},
			auth: {
				authType: "none",
			},
			metadata: {
				version: agent.version || 1,
				createdAt: agent.createdAt,
				updatedAt: agent.updatedAt,
				networkInfo: {
					bindAddress,
					localIP,
					allIPs: NetworkUtils.getAllLocalIPs(),
				},
			},
		}
	}

	/**
	 * 注册智能体到统一注册中心
	 */
	private async registerAgentToRegistry(agent: AgentConfig, url: string): Promise<void> {
		try {
			await this.registry.registerAgent({
				agentId: agent.id,
				userId: agent.userId,
				name: agent.name,
				avatar: agent.avatar,
				description: agent.roleDescription,
				capabilities: {
					tools: agent.tools?.filter((t) => t.enabled).map((t) => t.toolId) || [],
					skills: [],
					categories: [],
				},
				deployment: {
					type: "pc",
					endpointType: "network_reachable",
					directUrl: url,
				},
				status: {
					state: "online",
					lastSeen: Date.now(),
					currentLoad: 0.1,
					errorRate: 0.01,
					avgResponseTime: 1000,
				},
				sharing: {
					isPrivate: agent.isPrivate ?? true,
					shareScope: agent.shareScope || "none",
					shareLevel: agent.shareLevel || 0,
					permissions: agent.permissions || [],
					allowedUsers: agent.allowedUsers || [],
					allowedGroups: agent.allowedGroups || [],
					deniedUsers: agent.deniedUsers || [],
				},
				metadata: {
					createdAt: agent.createdAt,
					updatedAt: agent.updatedAt,
					version: String(agent.version || 1),
					tags: [],
				},
			})
		} catch (error) {
			logger.error(`[A2AServer] Failed to register agent to registry:`, error)
		}
	}

	/**
	 * 获取智能体（跨用户查找）
	 */
	private async getAgentByAnyUser(agentId: string): Promise<AgentConfig | null> {
		try {
			// 首先尝试从当前用户获取
			const VoidBridge = require("../../api/void-bridge").VoidBridge
			const currentUserId = VoidBridge.getCurrentUserId() || "default"

			logger.info(`[A2AServer] Looking for agent ${agentId} for user ${currentUserId}`)

			// 先列出所有智能体，看看有哪些
			const allAgents = await this.storageService.listUserAgents(currentUserId)
			logger.info(
				`[A2AServer] Available agents for user ${currentUserId}:`,
				allAgents.map((a) => ({ id: a.id, name: a.name })),
			)

			let agent = await this.storageService.getAgent(currentUserId, agentId)
			if (agent) {
				logger.info(`[A2AServer] Found agent ${agentId}:`, { id: agent.id, name: agent.name })
				return agent
			}

			// 如果当前用户没有，可以考虑从Redis注册中心查找共享智能体
			// TODO: 实现跨用户的智能体查找逻辑
			logger.warn(`[A2AServer] Agent ${agentId} not found for user ${currentUserId}`)
			return null
		} catch (error) {
			logger.error(`[A2AServer] Error finding agent ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 检查执行权限
	 */
	private async checkExecutePermission(agentId: string, sourceUserId?: string): Promise<boolean> {
		// TODO: 实现详细的权限检查
		return true
	}

	/**
	 * 检查资源配额
	 */
	private async checkResourceQuota(agentId: string): Promise<void> {
		const instances = await this.resourceManager.getAllManagedInstances()
		const instance = instances.find((i) => i.agentId === agentId)

		if (instance && instance.violations.length > 0) {
			throw new Error(`Agent ${agentId} has resource quota violations`)
		}
	}

	/**
	 * 执行智能体逻辑
	 */
	private async executeAgentLogic(
		agent: AgentConfig,
		request: any,
	): Promise<{
		success: boolean
		data?: any
		error?: string
		duration?: number
	}> {
		const startTime = Date.now()

		try {
			// TODO: 实现实际的智能体执行逻辑
			// 这里是模拟实现
			const result = {
				success: true,
				data: {
					message: `Agent ${agent.name} executed successfully`,
					agentId: agent.id,
					method: request.method || "execute",
					params: request.params || {},
					timestamp: Date.now(),
				},
				duration: Date.now() - startTime,
			}

			return result
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Execution failed",
				duration: Date.now() - startTime,
			}
		}
	}

	/**
	 * 更新使用统计
	 */
	private async updateUsageStats(agentId: string, success: boolean): Promise<void> {
		try {
			logger.debug(`[A2AServer] Usage stats: ${agentId}, success: ${success}`)
			// TODO: 实现实际的统计更新逻辑
		} catch (error) {
			logger.error(`[A2AServer] Failed to update usage stats:`, error)
		}
	}

	/**
	 * 获取所有运行中的服务器
	 */
	getRunningServers(): string[] {
		return Array.from(this.servers.keys())
	}

	/**
	 * 获取服务器状态
	 */
	getServerStatus(agentId: string): any {
		const server = this.servers.get(agentId)
		if (!server) {
			return null
		}

		// 如果没有保存的URL，重新构建正确的URL
		let serverUrl = server.url
		if (!serverUrl) {
			const bindAddress = server.bindAddress || NetworkUtils.getLocalIP()
			serverUrl = NetworkUtils.buildServerUrl(bindAddress, server.port)
		}

		return {
			agentId,
			status: "running",
			port: server.port,
			url: serverUrl,
			bindAddress: server.bindAddress,
		}
	}

	/**
	 * 获取最佳连接方式到指定智能体
	 */
	async getBestConnectionToAgent(agentUrl: string): Promise<{
		method: "direct" | "bridge"
		url: string
		reason: string
	}> {
		return await this.connectionManager.getBestConnectionMethod(agentUrl)
	}

	/**
	 * 获取连接统计信息
	 */
	getConnectionStats() {
		return this.connectionManager.getConnectionStats()
	}

	/**
	 * 清理过期的桥接连接
	 */
	async cleanupConnections(): Promise<void> {
		await this.connectionManager.cleanupBridgeServers()
	}
}
