import {
	AgentExecutor,
	RequestContext,
	DefaultRequestHandler,
	InMemoryTaskStore,
	AgentCard,
	ExecutionEventBus,
	DefaultExecutionEventBusManager,
} from "@a2a-js/sdk/server"
import { RooCodeEventName } from "@roo-code/types"
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
	private provider: any // ClineProvider实例

	constructor(storageService: EnhancedAgentStorageService, provider?: any) {
		this.storageService = storageService
		this.provider = provider
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
			const server = await this.startServerInstance(handler, port, agent)
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
			const server = await this.startServerInstance(handler, port, agent)
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
	private async startServerInstance(handler: any, port: number, agent?: AgentConfig): Promise<any> {
		const http = require("http")

		// 获取推荐的绑定地址
		const bindAddress = await NetworkUtils.getRecommendedBindAddress()
		logger.info(`[A2AServer] Will bind to address: ${bindAddress}`)

		// 创建真实的HTTP服务器
		const server = http.createServer(async (req: any, res: any) => {
			console.log(`[A2AServer] 🌟 RAW HTTP REQUEST: ${req.method} ${req.url}`)
			try {
				// 设置完整的CORS头 - 允许任意访问
				res.setHeader("Access-Control-Allow-Origin", "*")
				res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
				res.setHeader("Access-Control-Allow-Headers", "*")
				res.setHeader("Access-Control-Allow-Credentials", "true")
				res.setHeader("Access-Control-Max-Age", "86400") // 缓存预检请求24小时

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
					// 处理执行请求 - 支持流式响应
					console.log(`[A2AServer] 🔥 Received POST /execute request`)
					let body = ""
					req.on("data", (chunk: any) => {
						body += chunk
						console.log(`[A2AServer] 📥 Received data chunk, total length: ${body.length}`)
					})
					req.on("end", async () => {
						try {
							console.log(`[A2AServer] 🔄 Request body complete, parsing JSON:`, { bodyLength: body.length, bodyPreview: body.substring(0, 200) })
							const requestData = JSON.parse(body)
							console.log(`[A2AServer] ✅ Execute request parsed:`, requestData)

							// 检查客户端是否支持 SSE
							const acceptHeader = req.headers.accept || ""
							const isSSE = acceptHeader.includes("text/event-stream") || requestData.stream === true
							
							console.log(`[A2AServer] 📡 Request mode: ${isSSE ? 'SSE streaming' : 'standard JSON'}`)

							// 获取智能体配置并执行真正的AI逻辑
							console.log(`[A2AServer] 🔍 Checking agent availability:`, { agentExists: !!agent, agentId: requestData.agentId })
							if (!agent) {
								console.log(`[A2AServer] ❌ Agent not found for ID: ${requestData.agentId}`)
								res.writeHead(404, { "Content-Type": "application/json" })
								res.end(JSON.stringify({ 
									success: false, 
									error: `Agent not found` 
								}))
								return
							}
							
							// 打印智能体的API配置信息
							console.log(`[A2AServer] 📋 Agent API Config Info:`, {
								agentId: agent.id,
								hasEmbeddedApiConfig: !!agent.apiConfig,
								apiConfigId: agent.apiConfigId,
								apiProvider: agent.apiConfig?.apiProvider,
								apiModel: agent.apiConfig?.apiModelId,
								hasApiKey: !!(agent.apiConfig?.apiKey || agent.apiConfig?.openAiApiKey || agent.apiConfig?.anthropicApiKey)
							})

							if (isSSE) {
								// SSE 流式响应
								res.writeHead(200, {
									"Content-Type": "text/event-stream",
									"Cache-Control": "no-cache",
									"Connection": "keep-alive",
									"Access-Control-Allow-Origin": "*",
									"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
									"Access-Control-Allow-Headers": "*",
									"Access-Control-Allow-Credentials": "true"
								})
								
								// 发送初始连接事件
								res.write(`event: connected\ndata: {"message":"SSE connection established"}\n\n`)
								
								// 执行智能体逻辑并流式传输结果
								console.log(`[A2AServer] 🚀 Starting streaming agent execution for:`, requestData.agentId)
								await this.executeAgentLogicWithStreaming(agent, requestData, res)
								
							} else {
								// 标准 JSON 响应（保持向后兼容）
								console.log(`[A2AServer] 🚀 Starting agent execution for:`, requestData.agentId)
								const result = await this.executeAgentLogic(agent, requestData)
								console.log(`[A2AServer] ✅ Agent execution completed:`, { success: result.success, duration: result.duration })

								const response = {
									success: result.success,
									result: result.success ? result.data : result.error,
									timestamp: Date.now(),
									duration: result.duration,
								}

								res.writeHead(200, { "Content-Type": "application/json" })
								res.end(JSON.stringify(response))
							}
						} catch (error) {
							logger.error(`[A2AServer] Execute error:`, error)
							if (!res.headersSent) {
								res.writeHead(500, { "Content-Type": "application/json" })
								res.end(JSON.stringify({ 
									success: false, 
									error: "Agent execution failed",
									details: error instanceof Error ? error.message : "Unknown error"
								}))
							}
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
	 * 执行智能体逻辑并支持流式输出
	 */
	private async executeAgentLogicWithStreaming(
		agent: AgentConfig,
		request: any,
		res: any
	): Promise<void> {
		const startTime = Date.now()
		let isStreamClosed = false
		
		// 跟踪已经发送的内容，用于计算增量
		let sentThinkingContent = ""
		let sentCompletionContent = ""
		
		// 辅助函数：发送SSE事件
		const sendSSE = (event: string, data: any) => {
			if (!isStreamClosed && !res.destroyed) {
				try {
					const jsonData = typeof data === 'string' ? data : JSON.stringify(data)
					res.write(`event: ${event}\ndata: ${jsonData}\n\n`)
				} catch (error) {
					console.error(`[A2AServer] SSE send error:`, error)
				}
			}
		}
		
		// 监听客户端断开连接
		res.on('close', () => {
			console.log(`[A2AServer] SSE connection closed by client`)
			isStreamClosed = true
		})
		
		try {
			// 获取用户消息
			const userMessage = request.task || request.params?.message || request.message || request.data?.message || "Hello"
			console.log(`[A2AServer] 📝 Starting streaming execution for agent ${agent.id} with message: "${userMessage}"`)
			
			// 发送开始事件
			sendSSE("start", { 
				agentId: agent.id, 
				message: userMessage,
				timestamp: Date.now() 
			})
			
			// 获取API配置 - 捕获配置错误
			let agentApiConfig
			try {
				agentApiConfig = await this.getAgentApiConfiguration(agent)
				
				// 验证API密钥是否存在
				const hasValidKey = agentApiConfig.providerSettings.apiKey ||
					agentApiConfig.providerSettings.openAiApiKey ||
					agentApiConfig.providerSettings.anthropicApiKey ||
					agentApiConfig.providerSettings.requestyApiKey ||
					agentApiConfig.providerSettings.glamaApiKey
				
				if (!hasValidKey) {
					throw new Error("API key not configured for this agent")
				}
			} catch (configError) {
				logger.error(`[A2AServer] API configuration error for agent ${agent.id}:`, configError)
				sendSSE("error", {
					error: `Configuration error: ${configError instanceof Error ? configError.message : "Failed to get API configuration"}`,
					code: "CONFIG_ERROR",
					timestamp: Date.now()
				})
				res.end()
				return
			}
			
			// 设置智能体上下文
			try {
				await this.setupAgentContext(agent)
			} catch (contextError) {
				logger.error(`[A2AServer] Context setup error for agent ${agent.id}:`, contextError)
				sendSSE("error", {
					error: `Context setup failed: ${contextError instanceof Error ? contextError.message : "Unknown error"}`,
					code: "CONTEXT_ERROR",
					timestamp: Date.now()
				})
				res.end()
				return
			}
			
			// 导入Task类
			const { Task } = await import("../task/Task")
			
			// 创建Task实例
			let task
			try {
				task = new Task({
					provider: this.provider,
					apiConfiguration: agentApiConfig.providerSettings,
					enableDiff: false,
					enableCheckpoints: false,
					enableTaskBridge: false,
					task: userMessage,
					startTask: false,
					experiments: {},
				})
			} catch (taskCreationError) {
				logger.error(`[A2AServer] Task creation error for agent ${agent.id}:`, taskCreationError)
				sendSSE("error", {
					error: `Task creation failed: ${taskCreationError instanceof Error ? taskCreationError.message : "Unknown error"}`,
					code: "TASK_CREATION_ERROR",
					timestamp: Date.now()
				})
				res.end()
				return
			}
			
			// 重要：由于Task的attemptApiRequest是一个生成器函数，错误不会通过事件发出
			// 我们需要在执行生成器时捕获错误
			let apiRequestGenerator: any = null
			
			// 监听Task的消息事件并流式发送
			task.on(RooCodeEventName.Message, (messageEvent: any) => {
				if (messageEvent && messageEvent.message) {
					const message = messageEvent.message
					
					// 检查是否有错误消息 - 特别是api_req_failed
					if (message.type === "error" || message.say === "error" || message.say === "api_req_failed") {
						if (!isStreamClosed) {
							logger.error(`[A2AServer] Error message detected:`, message)
							
							let errorMessage = message.text || message.error || "Task execution error"
							let errorCode = "MESSAGE_ERROR"
							
							// 检查是否是API请求失败
							if (message.say === "api_req_failed") {
								errorCode = "API_REQUEST_FAILED"
								// 分析错误内容
								if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized") ||
									errorMessage.toLowerCase().includes("invalid_api_key") || 
									errorMessage.toLowerCase().includes("invalid api key")) {
									errorCode = "AUTH_ERROR"
									errorMessage = "API authentication failed. Please check your API key configuration."
								} else if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
									errorCode = "RATE_LIMIT_ERROR"
									errorMessage = "API rate limit exceeded. Please try again later."
								} else if (errorMessage.toLowerCase().includes("network") || errorMessage.toLowerCase().includes("econnrefused")) {
									errorCode = "NETWORK_ERROR"
									errorMessage = "Network connection failed. Please check your internet connection."
								}
							}
							
							sendSSE("error", {
								error: errorMessage,
								code: errorCode,
								details: message,
								timestamp: Date.now()
							})
							res.end()
							isStreamClosed = true
						}
						return
					}
					
					// 根据消息类型发送不同的SSE事件
					if (message.type === "say" && message.say === "text" && message.text && message.text !== userMessage) {
						// AI的思考过程 - 只发送增量内容
						const fullContent = message.text
						if (fullContent.startsWith(sentThinkingContent)) {
							// 计算增量内容（新增的部分）
							const incrementalContent = fullContent.substring(sentThinkingContent.length)
							if (incrementalContent) {
								sendSSE("thinking", {
									content: incrementalContent,
									timestamp: Date.now()
								})
								// 更新已发送的内容
								sentThinkingContent = fullContent
							}
						} else {
							// 如果内容不是追加的，可能是新的思考过程，直接发送
							sendSSE("thinking", {
								content: fullContent,
								timestamp: Date.now()
							})
							sentThinkingContent = fullContent
						}
					} else if (message.say === "completion_result" && message.text) {
						// AI的最终回答 - 只发送增量内容
						const fullContent = message.text
						if (fullContent.startsWith(sentCompletionContent)) {
							// 计算增量内容（新增的部分）
							const incrementalContent = fullContent.substring(sentCompletionContent.length)
							if (incrementalContent) {
								sendSSE("completion", {
									content: incrementalContent,
									timestamp: Date.now()
								})
								// 更新已发送的内容
								sentCompletionContent = fullContent
							}
						} else {
							// 如果内容不是追加的，可能是新的回答，直接发送
							sendSSE("completion", {
								content: fullContent,
								timestamp: Date.now()
							})
							sentCompletionContent = fullContent
						}
					} else if (message.say === "api_req_started") {
						// API请求开始
						sendSSE("api_start", {
							message: "Processing request...",
							timestamp: Date.now()
						})
					} else if (message.say === "api_req_retry_delayed") {
						// API请求重试中
						sendSSE("api_retry", {
							message: message.text || "Retrying API request...",
							timestamp: Date.now()
						})
					} else if (message.type === "tool_use") {
						// 工具使用
						sendSSE("tool_use", {
							tool: message.tool,
							input: message.input,
							timestamp: Date.now()
						})
					}
				}
			})
			
			// 监听任务完成
			task.on(RooCodeEventName.TaskCompleted, (_, tokenUsage, toolUsage) => {
				if (!isStreamClosed) {
					// 发送完成事件
					sendSSE("done", {
						success: true,
						duration: Date.now() - startTime,
						tokensUsed: tokenUsage?.totalTokens || 0,
						toolsUsed: toolUsage ? Object.keys(toolUsage) : [],
						timestamp: Date.now()
					})
					
					// 关闭连接
					res.end()
					isStreamClosed = true
				}
			})
			
			// 监听任务错误
			task.on("taskError", (error: any) => {
				if (!isStreamClosed) {
					logger.error(`[A2AServer] Task error for agent ${agent.id}:`, error)
					
					// 识别错误类型
					let errorCode = "TASK_ERROR"
					let errorMessage = error.message || error.toString()
					
					// 检测API认证错误
					if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized") || 
						errorMessage.toLowerCase().includes("invalid api key") || 
						errorMessage.toLowerCase().includes("invalid_api_key") ||
						errorMessage.toLowerCase().includes("authentication")) {
						errorCode = "AUTH_ERROR"
						errorMessage = "API authentication failed. Please check your API key configuration."
					}
					// 检测配额错误
					else if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit") ||
						errorMessage.toLowerCase().includes("quota")) {
						errorCode = "QUOTA_ERROR"
						errorMessage = "API rate limit or quota exceeded. Please try again later."
					}
					// 检测网络错误
					else if (errorMessage.toLowerCase().includes("econnrefused") || 
						errorMessage.toLowerCase().includes("timeout") ||
						errorMessage.toLowerCase().includes("network")) {
						errorCode = "NETWORK_ERROR"
						errorMessage = "Network connection failed. Please check your internet connection."
					}
					
					sendSSE("error", {
						error: errorMessage,
						code: errorCode,
						details: error.stack || error.toString(),
						timestamp: Date.now()
					})
					res.end()
					isStreamClosed = true
				}
			})
			
			// 监听任务中止
			task.on("taskAborted", () => {
				if (!isStreamClosed) {
					sendSSE("aborted", {
						message: "Task was aborted",
						timestamp: Date.now()
					})
					res.end()
					isStreamClosed = true
				}
			})
			
			// 等待Task初始化并启动
			try {
				await task.waitForModeInitialization()
				
				// 额外的错误监听：监听Task的say方法输出
				const originalSay = task.say.bind(task)
				task.say = async (type: string, text?: string, ...args: any[]) => {
					// 拦截api_req_failed消息
					if (type === "api_req_failed") {
						logger.error(`[A2AServer] API request failed intercepted:`, text)
						if (!isStreamClosed) {
							let errorMessage = text || "API request failed"
							let errorCode = "API_REQUEST_FAILED"
							
							// 分析错误类型
							if (errorMessage.includes("401") || errorMessage.toLowerCase().includes("unauthorized") ||
								errorMessage.toLowerCase().includes("invalid_api_key") || 
								errorMessage.toLowerCase().includes("invalid api key") ||
								errorMessage.toLowerCase().includes("incorrect api key")) {
								errorCode = "AUTH_ERROR"
								errorMessage = "API authentication failed. Please check your API key configuration."
							} else if (errorMessage.includes("429") || errorMessage.toLowerCase().includes("rate limit")) {
								errorCode = "RATE_LIMIT_ERROR"
								errorMessage = "API rate limit exceeded. Please try again later."
							} else if (errorMessage.includes("404") && errorMessage.toLowerCase().includes("model")) {
								errorCode = "MODEL_NOT_FOUND"
								errorMessage = "The specified model was not found. Please check your model configuration."
							}
							
							sendSSE("error", {
								error: errorMessage,
								code: errorCode,
								timestamp: Date.now()
							})
							res.end()
							isStreamClosed = true
							
							// 阻止进一步执行
							throw new Error(errorMessage)
						}
					}
					// 调用原始方法
					return originalSay(type, text, ...args)
				}
				
				task.startTask(userMessage)
			} catch (initError) {
				logger.error(`[A2AServer] Task initialization/start error for agent ${agent.id}:`, initError)
				if (!isStreamClosed) {
					let errorMessage = initError instanceof Error ? initError.message : "Task initialization failed"
					let errorCode = "INIT_ERROR"
					
					// 检查是否是API相关错误
					if (errorMessage.toLowerCase().includes("api") || errorMessage.toLowerCase().includes("key")) {
						errorCode = "API_CONFIG_ERROR"
					} else if (errorMessage.toLowerCase().includes("model")) {
						errorCode = "MODEL_ERROR"
					}
					
					sendSSE("error", {
						error: errorMessage,
						code: errorCode,
						timestamp: Date.now()
					})
					res.end()
					isStreamClosed = true
				}
				return
			}
			
			// 可选的超时保护 - 默认不设置超时（0表示无超时）
			const timeoutMs = request.timeout || 0 // 客户端可以通过request.timeout指定超时时间（毫秒）
			if (timeoutMs > 0) {
				setTimeout(() => {
					if (!isStreamClosed) {
						sendSSE("timeout", {
							message: `Task execution timeout after ${timeoutMs}ms`,
							timestamp: Date.now()
						})
						res.end()
						isStreamClosed = true
						task.abortTask(true)
					}
				}, timeoutMs)
				
				// 发送超时配置信息
				logger.info(`[A2AServer] Task timeout set to ${timeoutMs}ms for agent ${agent.id}`)
			} else {
				// 无超时限制
				logger.info(`[A2AServer] No timeout limit for agent ${agent.id} task execution`)
			}
			
		} catch (error) {
			logger.error(`[A2AServer] Streaming execution failed:`, error)
			if (!isStreamClosed) {
				sendSSE("error", {
					error: error instanceof Error ? error.message : "Unknown error",
					timestamp: Date.now()
				})
				res.end()
			}
		}
	}

	/**
	 * 执行智能体逻辑 - 直接使用Task类，复用Roo-Code完整逻辑
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
			// 获取用户消息 - 添加详细的调试日志
			console.log(`[A2AServer] 🔍 Request object:`, {
				hasTask: !!request.task,
				task: request.task,
				hasParams: !!request.params,
				paramsMessage: request.params?.message,
				hasMessage: !!request.message,
				message: request.message,
				hasData: !!request.data,
				dataMessage: request.data?.message,
				allKeys: Object.keys(request || {})
			})
			
			const userMessage = request.task || request.params?.message || request.message || request.data?.message || "Hello"
			
			console.log(`[A2AServer] 📝 Executing agent ${agent.id} with message: "${userMessage}"`)

			// 直接使用Roo-Code的Task执行引擎
			console.log(`[A2AServer] 🔧 Starting executeInWorker for agent ${agent.id}`)
			const taskResponse = await this.executeInWorker(agent, userMessage)
			console.log(`[A2AServer] ✨ executeInWorker completed:`, { success: taskResponse.success, duration: taskResponse.duration })

			const result = {
				success: taskResponse.success,
				data: taskResponse.success ? taskResponse.response : undefined,
				error: taskResponse.success ? undefined : taskResponse.error,
				duration: Date.now() - startTime,
			}

			return result
		} catch (error) {
			logger.error(`[A2AServer] Agent execution failed for ${agent.id}:`, error)
			return {
				success: false,
				error: error instanceof Error ? error.message : "Agent execution failed",
				duration: Date.now() - startTime,
			}
		}
	}

	/**
	 * 在Worker进程中执行智能体任务
	 * 确保任务隔离且不阻塞主进程和UI
	 */
	private async executeInWorker(agent: AgentConfig, userMessage: string): Promise<{
		success: boolean
		response?: string
		error?: string
		duration: number
		tokensUsed?: number
		toolsUsed?: string[]
	}> {
		const startTime = Date.now()
		
		try {
			console.log(`[A2AServer] 🎯 Starting agent task execution for ${agent.id}`)
			console.log(`[A2AServer] 📋 Agent config: mode=${agent.mode}, tools=${agent.tools?.length || 0}`)
			
			// 1. 获取智能体的API配置
			console.log(`[A2AServer] 🔧 Getting agent API configuration for ${agent.id}`)
			const agentApiConfig = await this.getAgentApiConfiguration(agent)
			console.log(`[A2AServer] ✅ API config loaded: provider=${agentApiConfig.providerSettings.apiProvider}`)
			
			// 2. 准备智能体上下文 - 设置Provider状态
			console.log(`[A2AServer] 🎨 Setting up agent context for ${agent.id}`)
			await this.setupAgentContext(agent)
			console.log(`[A2AServer] ✅ Agent context setup completed`)
			
			// 3. 动态导入Task类（避免循环依赖）
			console.log(`[A2AServer] 📦 Importing Task class...`)
			const { Task } = await import("../task/Task")
			console.log(`[A2AServer] ✅ Task class imported successfully`)
			
			// 4. 创建并自动启动Task实例
			console.log(`[A2AServer] 🚀 Creating Task with API configuration:`, {
				agentId: agent.id,
				apiProvider: agentApiConfig.providerSettings.apiProvider,
				modelName: agentApiConfig.providerSettings.modelName,
				hasApiKey: !!agentApiConfig.providerSettings.apiKey,
				userMessage: userMessage
			})
			
			console.log(`[A2AServer] 📌 Task constructor params:`, {
				hasProvider: !!this.provider,
				hasApiConfiguration: !!agentApiConfig.providerSettings,
				taskMessage: userMessage,
				taskMessageType: typeof userMessage,
				taskMessageLength: userMessage?.length
			})
			
			const task = new Task({
				provider: this.provider,
				apiConfiguration: agentApiConfig.providerSettings,
				enableDiff: false,
				enableCheckpoints: false,
				enableTaskBridge: false,
				task: userMessage,
				startTask: false, // 不自动启动，等待taskModeReady后启动
				experiments: {},
			})
			
			console.log(`[A2AServer] ✅ Task created and started for agent ${agent.id}`)

			// 5. 等待任务完成
			console.log(`[A2AServer] ⏳ Starting executeTaskWithProperFlow...`)
			return await this.executeTaskWithProperFlow(task, agent, userMessage, startTime)

		} catch (error) {
			logger.error(`[A2AServer] executeInWorker failed for agent ${agent.id}:`, error)
			return {
				success: false,
				error: error instanceof Error ? error.message : "Task creation failed",
				duration: Date.now() - startTime
			}
		}
	}
	
	/**
	 * 设置智能体执行上下文
	 */
	private async setupAgentContext(agent: AgentConfig): Promise<void> {
		if (!this.provider || !this.provider.contextProxy) {
			throw new Error("Provider or contextProxy not available for agent context setup")
		}
		
		try {
			// 设置智能体的模式
			await this.provider.contextProxy.setValue('mode', agent.mode)
			logger.info(`[A2AServer] Set agent mode: ${agent.mode}`)
			
			// 设置智能体的工具配置
			if (agent.tools && agent.tools.length > 0) {
				const enabledTools = agent.tools
					.filter(tool => tool.enabled)
					.map(tool => tool.toolId)
				
				logger.info(`[A2AServer] Agent enabled tools: [${enabledTools.join(', ')}]`)
				
				// TODO: 根据实际的Provider API设置工具状态
				// 这里可能需要调用Provider的特定方法来启用/禁用工具
			}
			
		} catch (error) {
			logger.error(`[A2AServer] Failed to setup agent context:`, error)
			throw error
		}
	}
	
	/**
	 * 按照Roo-Code标准流程执行任务
	 */
	private async executeTaskWithProperFlow(
		task: any, 
		agent: AgentConfig, 
		userMessage: string, 
		startTime: number
	): Promise<{
		success: boolean
		response?: string
		error?: string
		duration: number
		tokensUsed?: number
		toolsUsed?: string[]
	}> {
		console.log(`[A2AServer] 🎬 executeTaskWithProperFlow started for agent ${agent.id}`)
		return new Promise((resolve, reject) => {
			let taskResult = ""
			let finalResponse = ""
			const toolsUsed: string[] = []
			let isCompleted = false
			
			console.log(`[A2AServer] 🎯 Setting up task execution for agent ${agent.id}`)
			
			// 先等待Task初始化完成
			console.log(`[A2AServer] ⏸️ Waiting for Task initialization...`)
			task.waitForModeInitialization().then(() => {
				console.log(`[A2AServer] ✅ Task initialized, starting execution with message: "${userMessage}"`)
				task.startTask(userMessage)
				console.log(`[A2AServer] 🚀 Task started successfully`)
			}).catch(error => {
				console.log(`[A2AServer] ❌ Task initialization failed:`, error)
				if (!isCompleted) {
					isCompleted = true
					if (timeout) clearTimeout(timeout)
					resolve({
						success: false,
						error: `Task initialization failed: ${error.message}`,
						duration: Date.now() - startTime
					})
				}
			})
			
			// 可选的超时保护 - 默认不设置超时
			let timeout: NodeJS.Timeout | null = null
			// 注意：这里的超时配置应该从调用方传入，暂时禁用超时
			const timeoutMs = 0 // 0表示无超时限制
			
			if (timeoutMs > 0) {
				timeout = setTimeout(() => {
					if (!isCompleted) {
						console.log(`[A2AServer] ⏰ Task timeout for agent ${agent.id} after ${timeoutMs}ms`)
						task.abortTask(true)
						resolve({
							success: false,
							error: `Task execution timeout (${timeoutMs}ms)`,
							duration: Date.now() - startTime
						})
					}
				}, timeoutMs)
			} else {
				console.log(`[A2AServer] 🚀 No timeout limit for task execution`)
			}

			// 监听任务状态变化事件
			task.on("taskStatusChanged", (status: string) => {
				console.log(`[A2AServer] 📢 Task status: ${status}`)
			})

			// 监听Task的消息输出 - 这是获取AI回答的关键
			task.on(RooCodeEventName.Message, (messageEvent: any) => {
				console.log(`[A2AServer] 📝 Task Message event:`, messageEvent)
				if (messageEvent && messageEvent.message) {
					const message = messageEvent.message
					console.log(`[A2AServer] 📝 Message details - type: ${message.type}, say: ${message.say}, text: ${message.text?.substring(0, 100)}`)
					
					// 捕获所有类型的AI响应 - 但排除用户消息的回显
					if (message.type === "say" && message.say === "text" && message.text) {
						// 检查是否是用户消息的回显（通常与userMessage相同）
						if (message.text === userMessage) {
							console.log(`[A2AServer] 🔄 Skipping user message echo: ${message.text.substring(0, 100)}...`)
						} else {
							// 这是AI的主要回答
							console.log(`[A2AServer] 📝 Capturing AI text response: ${message.text.substring(0, 200)}...`)
							taskResult += message.text + "\n"
							// 只有在还没有finalResponse时才设置，避免覆盖completion_result
							if (!finalResponse) {
								finalResponse = message.text
							}
						}
					}
					// 处理assistant类型的消息（AI回答）
					else if (message.type === "ask" && message.say === "completion_result" && message.text) {
						console.log(`[A2AServer] 📝 Capturing AI completion result: ${message.text.substring(0, 200)}...`)
						finalResponse = message.text
					}
					// 处理普通text消息
					else if (message.type === "text" && message.text && message.say !== "user") {
						console.log(`[A2AServer] 📝 Capturing text message: ${message.text.substring(0, 100)}...`)
						taskResult += message.text + "\n"
					}
					// 处理say为completion_result的消息 - 这是最高优先级
					else if (message.say === "completion_result" && message.text) {
						console.log(`[A2AServer] 📝 Capturing completion result: ${message.text.substring(0, 200)}...`)
						finalResponse = message.text
						// completion_result 是最终答案，也添加到 taskResult
						if (!taskResult.includes(message.text)) {
							taskResult = message.text // 直接使用completion_result作为最终结果
						}
					}
				}
			})

			// 监听任务完成事件  
			task.on(RooCodeEventName.TaskCompleted, (_, tokenUsage, toolUsage) => {
				if (isCompleted) return
				isCompleted = true
				if (timeout) clearTimeout(timeout)
				clearInterval(statusPoller)
				
				console.log(`[A2AServer] ✅ Task completed for agent ${agent.id}`)
				
				// 最后机会：直接从Task的clineMessages读取AI回答
				if (!finalResponse && !taskResult && task.clineMessages) {
					console.log(`[A2AServer] 🔍 Final attempt - scanning all clineMessages:`, task.clineMessages.length)
					let extractedResponse = ""
					
					for (const msg of task.clineMessages) {
						console.log(`[A2AServer] 🔍 Final scan - type: ${msg.type}, say: ${msg.say}, text: ${msg.text?.substring(0, 100)}`)
						
						// 尝试各种可能的AI回答格式
						if (msg.type === "text" && msg.text && msg.say !== "user") {
							extractedResponse = msg.text
							console.log(`[A2AServer] 📝 Final extracted text response: ${extractedResponse.substring(0, 200)}...`)
						} else if (msg.say === "completion_result" && msg.text) {
							extractedResponse = msg.text
							console.log(`[A2AServer] 📝 Final extracted completion result: ${extractedResponse.substring(0, 200)}...`)
						} else if (msg.type === "ask" && msg.text) {
							extractedResponse = msg.text
							console.log(`[A2AServer] 📝 Final extracted ask message: ${extractedResponse.substring(0, 200)}...`)
						}
					}
					
					if (extractedResponse) {
						finalResponse = extractedResponse
					}
				}
				
				console.log(`[A2AServer] 🎯 Final taskResult:`, taskResult?.substring(0, 200))
				console.log(`[A2AServer] 🎯 Final finalResponse:`, finalResponse?.substring(0, 200))
				console.log(`[A2AServer] 🎯 TokenUsage:`, tokenUsage, 'ToolUsage:', toolUsage)
				
				const actualResponse = finalResponse || taskResult || "任务执行完成"
				console.log(`[A2AServer] 🎯 Actual response being returned:`, actualResponse?.substring(0, 200))
				
				resolve({
					success: true,
					response: actualResponse,
					duration: Date.now() - startTime,
					tokensUsed: tokenUsage?.totalTokens || 0,
					toolsUsed: toolUsage ? Object.keys(toolUsage) : []
				})
			})
			
			// 轮询检查Task状态 - 作为事件监听的备用方案
			const statusPoller = setInterval(() => {
				if (isCompleted) {
					clearInterval(statusPoller)
					return
				}
				
				console.log(`[A2AServer] 🔄 Polling - state: ${task.state}, isActive: ${task.isActive}, taskResult length: ${taskResult.length}`)
				
				// 尝试从clineMessages获取Task的输出内容
				if (task.clineMessages && task.clineMessages.length > 0) {
					console.log(`[A2AServer] 🔍 Found clineMessages:`, task.clineMessages.length, 'messages')
					// 查找最新的AI回答消息
					for (let i = task.clineMessages.length - 1; i >= 0; i--) {
						const msg = task.clineMessages[i]
						console.log(`[A2AServer] 🔍 Message ${i}: type=${msg.type}, say=${msg.say}, hasText=${!!msg.text}`)
						
						if (msg.type === "ask" && msg.say === "completion_result" && msg.text && !finalResponse) {
							finalResponse = msg.text
							console.log(`[A2AServer] 📝 Found completion result: ${finalResponse.substring(0, 200)}...`)
							break
						} else if (msg.type === "text" && msg.text && msg.say !== "user" && !finalResponse) {
							finalResponse = msg.text
							console.log(`[A2AServer] 📝 Found text response: ${finalResponse.substring(0, 200)}...`)
							break
						}
					}
				}
				
				// 备用：检查conversationHistory
				if (!finalResponse && task.conversationHistory && task.conversationHistory.length > 0) {
					console.log(`[A2AServer] 🔍 Checking conversation history:`, task.conversationHistory.length, 'messages')
					const lastMessage = task.conversationHistory[task.conversationHistory.length - 1]
					if (lastMessage && lastMessage.type === 'text' && lastMessage.text) {
						finalResponse = lastMessage.text
						console.log(`[A2AServer] 📝 Extracted from conversation history: ${finalResponse.substring(0, 100)}...`)
					}
				}
				
				// 检查任务是否已完成但没有触发事件
				if (task.state === 'completed' || task.state === 'finished' || !task.isActive) {
					console.log(`[A2AServer] 🔍 Task completion detected via polling`)
					if (!isCompleted) {
						isCompleted = true
						if (timeout) clearTimeout(timeout)
						clearInterval(statusPoller)
						
						resolve({
							success: true,
							response: finalResponse || taskResult || "任务执行完成",
							duration: Date.now() - startTime,
							tokensUsed: task.tokenUsage?.totalTokens || 0,
							toolsUsed
						})
					}
				}
			}, 2000)

			// 监听任务错误
			task.on("taskError", (error: any) => {
				if (isCompleted) return
				isCompleted = true
				if (timeout) clearTimeout(timeout)
				
				console.log(`[A2AServer] ❌ Task error for agent ${agent.id}:`, error)
				resolve({
					success: false,
					error: error.message || error.toString(),
					duration: Date.now() - startTime
				})
			})

				// 监听消息更新 - 收集所有AI输出
				console.log(`[A2AServer] 🎧 Setting up messageUpdate event listener`)
				task.on("messageUpdate", (message: any) => {
				try {
					if (message && message.type === "say" && message.text) {
						const text = message.text.trim()
						if (text) {
							taskResult += text + "\n"
							finalResponse = text // 保存最后一个有效响应
							logger.debug(`[A2AServer] Collected response: ${text.substring(0, 100)}...`)
						}
					}
					
					// 收集工具使用信息
					if (message && message.type === "tool" && message.toolName) {
						if (!toolsUsed.includes(message.toolName)) {
							toolsUsed.push(message.toolName)
						}
					}
				} catch (error) {
					logger.error(`[A2AServer] Error processing message update:`, error)
				}
			})
			
			// 监听任务中止事件
			task.on("taskAborted", () => {
				if (isCompleted) return
				isCompleted = true
				if (timeout) clearTimeout(timeout)
				
				logger.warn(`[A2AServer] Task aborted for agent ${agent.id}`)
				resolve({
					success: false,
					error: "Task was aborted",
					duration: Date.now() - startTime
				})
			})

			// 任务已自动启动，只需添加调试监听器
			logger.info(`[A2AServer] ===== Task auto-started with message: "${userMessage}" =====`)
			
			// 添加任务状态监听以便调试
			task.on("messageIncoming", (msg: any) => {
				logger.info(`[A2AServer] Task messageIncoming:`, msg)
			})
			
			task.on("messageOutgoing", (msg: any) => {
				logger.info(`[A2AServer] Task messageOutgoing:`, msg)
			})
		})
	}
	
	/**
	 * 获取智能体的API配置
	 */
	private async getAgentApiConfiguration(agent: AgentConfig): Promise<{
		providerSettings: any
	}> {
		try {
			console.log(`[A2AServer] 🔍 Getting API configuration for agent ${agent.id}`)
			console.log(`[A2AServer] 📋 Agent details: apiConfigId=${agent.apiConfigId}, mode=${agent.mode}`)
			console.log(`[A2AServer] 🛠️ Agent tools: ${JSON.stringify(agent.tools?.map(t => ({id: t.toolId, enabled: t.enabled})))}`)
			
			// 优先使用嵌入式API配置（避免引用失效问题）
			if (agent.apiConfig) {
				console.log(`[A2AServer] ✅ Using embedded API config: provider=${agent.apiConfig.apiProvider}`)
				
				// 直接使用完整的ProviderSettings副本
				const providerSettings = {
					...agent.apiConfig, // 包含所有字段
					modelName: agent.apiConfig.apiModelId, // 添加兼容字段
				}
				
				// 详细打印API配置信息以便调试
				console.log(`[A2AServer] 📊 Detailed embedded API config:`, { 
					provider: providerSettings.apiProvider, 
					model: providerSettings.modelName || providerSettings.apiModelId,
					hasApiKey: !!providerSettings.apiKey,
					hasOpenAiApiKey: !!providerSettings.openAiApiKey,
					hasAnthropicApiKey: !!providerSettings.anthropicApiKey,
					apiKeyLength: providerSettings.apiKey?.length || 0,
					openAiKeyLength: providerSettings.openAiApiKey?.length || 0,
					anthropicKeyLength: providerSettings.anthropicApiKey?.length || 0,
					originalName: agent.apiConfig.originalName,
					allKeys: Object.keys(providerSettings).filter(k => k.includes('Key') || k.includes('key'))
				})
				
				return { providerSettings }
			}
			
			// 降级：从Provider状态中获取API配置（兼容旧版本）
			console.log(`[A2AServer] 🔎 Fallback: Using apiConfigId lookup for: ${agent.apiConfigId}`)
			const apiConfig = await this.getApiConfigById(agent.apiConfigId)
			console.log(`[A2AServer] 📊 Fallback API config result:`, { found: !!apiConfig, provider: apiConfig?.apiProvider })
			
			if (!apiConfig) {
				throw new Error(`API configuration ${agent.apiConfigId} not found for agent ${agent.id}`)
			}
			
			console.log(`[A2AServer] Using fallback API config for agent ${agent.id}:`, {
				provider: apiConfig.apiProvider,
				model: apiConfig.modelName
			})
			
			return {
				providerSettings: apiConfig
			}
			
		} catch (error) {
			logger.error(`[A2AServer] Failed to get API configuration for agent ${agent.id}:`, error)
			throw error
		}
	}
	
	/**
	 * 根据API配置ID获取配置详情
	 */
	private async getApiConfigById(apiConfigId: string): Promise<any> {
		try {
			// 从Provider获取当前API配置
			if (!this.provider) {
				throw new Error("Provider not available")
			}
			
			logger.info(`[A2AServer] 🔍 Looking for API config ID: "${apiConfigId}"`)
			
			// 获取Provider的状态，包含API配置
			const state = await this.provider.getState()
			logger.info(`[A2AServer] 📋 Provider state keys:`, Object.keys(state || {}))
			
			if (!state) {
				throw new Error(`Provider state is null/undefined`)
			}
			
			// 检查Provider状态中的API配置相关字段
			logger.info(`[A2AServer] 🔧 Provider API related fields:`, {
				hasApiConfiguration: !!state.apiConfiguration,
				hasCurrentApiConfigName: !!state.currentApiConfigName,
				hasListApiConfigMeta: !!state.listApiConfigMeta,
				currentApiConfigName: state.currentApiConfigName,
				apiProvider: state.apiConfiguration?.apiProvider
			})
			
			// 如果有listApiConfigMeta，尝试从中查找指定ID的配置
			if (state.listApiConfigMeta && Array.isArray(state.listApiConfigMeta)) {
				logger.info(`[A2AServer] 📝 Available API configs:`, state.listApiConfigMeta.map((meta: any) => ({
					id: meta.id,
					name: meta.name,
					provider: meta.apiProvider
				})))
				
				const targetConfig = state.listApiConfigMeta.find((meta: any) => meta.id === apiConfigId)
				if (targetConfig) {
					logger.info(`[A2AServer] ✅ Found matching API config:`, {
						id: targetConfig.id,
						name: targetConfig.name,
						provider: targetConfig.apiProvider
					})
					return targetConfig
				}
			}
			
			// 如果没有找到特定配置，检查当前配置是否匹配
			if (state.currentApiConfigName === apiConfigId || !state.listApiConfigMeta) {
				logger.info(`[A2AServer] 🎯 Using current API configuration as fallback`)
				if (!state.apiConfiguration) {
					throw new Error(`No current API configuration found in provider state`)
				}
				
				const apiConfig = state.apiConfiguration
				logger.info(`[A2AServer] 🔧 Current API config details:`, {
					provider: apiConfig.apiProvider,
					modelId: apiConfig.modelId || apiConfig.modelName,
					hasApiKey: !!(apiConfig.openAiApiKey || apiConfig.anthropicApiKey || apiConfig.requestyApiKey || apiConfig.glamaApiKey),
					hasBaseUrl: !!(apiConfig.openAiBaseUrl || apiConfig.anthropicBaseUrl)
				})
				
				return apiConfig
			}
			
			throw new Error(`API configuration "${apiConfigId}" not found in provider state`)
			
		} catch (error) {
			logger.error(`[A2AServer] ❌ Failed to get API config "${apiConfigId}":`, error)
			throw error
		}
	}

	/**
	 * 获取智能体的独立工作空间路径
	 */
	private getAgentWorkspacePath(agentId: string): string {
		const os = require("os")
		const path = require("path")
		
		// 为每个智能体创建独立的工作空间，避免文件冲突
		return path.join(os.tmpdir(), "roo-code-agents", agentId)
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
