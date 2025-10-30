import { A2AServer } from "./A2AServer"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { logger } from "../../utils/logging"

/**
 * A2A服务器管理器
 * 在扩展进程中管理所有发布的智能体的A2A服务器实例
 */
export class A2AServerManager {
	private static instance: A2AServerManager
	private a2aServer: A2AServer | null = null
	private storageService: EnhancedAgentStorageService | null = null
	private runningServers: Map<string, any> = new Map()
	private provider: any = null // ClineProvider实例

	private constructor() {}

	static getInstance(): A2AServerManager {
		if (!A2AServerManager.instance) {
			A2AServerManager.instance = new A2AServerManager()
		}
		return A2AServerManager.instance
	}

	/**
	 * 使用共享存储服务初始化A2A服务器管理器
	 */
	async initialize(sharedStorageService?: EnhancedAgentStorageService, provider?: any): Promise<void> {
		try {
			if (!this.storageService) {
				if (sharedStorageService) {
					// 使用共享的存储服务实例
					this.storageService = sharedStorageService
					logger.info("[A2AServerManager] Using shared storage service")
				} else if (provider?.context) {
					// 使用provider提供的context创建实例
					this.storageService = new EnhancedAgentStorageService(provider.context)
					logger.info("[A2AServerManager] Created storage service with provider context")
				} else {
					// 抛出错误，要求提供context
					throw new Error(
						"EnhancedAgentStorageService requires a context parameter. Please provide sharedStorageService or provider with context.",
					)
				}
			}

			if (!this.a2aServer) {
				this.a2aServer = new A2AServer(this.storageService, provider)
			}

			logger.info("[A2AServerManager] Initialized successfully")
		} catch (error) {
			logger.error("[A2AServerManager] Failed to initialize:", error)
			throw error
		}
	}

	/**
	 * 为智能体启动A2A服务器（通过ID查找）
	 */
	async startAgentServer(
		agentId: string,
		preferredPort?: number,
	): Promise<{
		port: number
		url: string
		agentCard: any
	}> {
		try {
			if (!this.a2aServer) {
				await this.initialize()
			}

			logger.info(
				`[A2AServerManager] Starting server for agent: ${agentId}, input type: ${typeof agentId}, preferredPort: ${preferredPort}`,
			)

			// 检查是否已经运行
			if (this.runningServers.has(agentId)) {
				logger.warn(`[A2AServerManager] Server for agent ${agentId} is already running`)
				return this.runningServers.get(agentId)
			}

			// 🎯 UX优化：如果没有指定首选端口，尝试从智能体的发布信息中获取
			let targetPort = preferredPort
			if (!targetPort && this.storageService) {
				try {
					const VoidBridge = require("../../api/void-bridge").VoidBridge
					const userId = VoidBridge.getCurrentUserId() || "default"

					// 获取智能体配置以检查是否有历史端口信息
					const result = await (this.storageService as any).getAgent(userId, agentId)
					if (result?.publishInfo?.serverPort) {
						targetPort = result.publishInfo.serverPort
						logger.info(
							`[A2AServerManager] 🎯 Found previous port ${targetPort} for agent ${agentId}, attempting to reuse`,
						)
					}
				} catch (error) {
					logger.warn(`[A2AServerManager] Failed to get agent config for port reuse:`, error)
				}
			}

			// 启动服务器 - 传递首选端口
			const serverInfo = await this.a2aServer!.startAgentServer(agentId, targetPort)

			// 记录运行状态
			this.runningServers.set(agentId, serverInfo)

			const isPortReused = targetPort && serverInfo.port === targetPort
			logger.info(`[A2AServerManager] Started server for agent ${agentId}`, {
				port: serverInfo.port,
				url: serverInfo.url,
				portReused: isPortReused,
				preferredPort: targetPort,
			})

			if (isPortReused) {
				logger.info(
					`[A2AServerManager] ✅ Successfully reused previous port ${targetPort} for agent ${agentId}`,
				)
			} else if (targetPort) {
				logger.info(
					`[A2AServerManager] ⚠️ Port ${targetPort} was not available, used ${serverInfo.port} instead for agent ${agentId}`,
				)
			}

			return serverInfo
		} catch (error) {
			logger.error(`[A2AServerManager] Failed to start server for agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 停止智能体的A2A服务器
	 */
	async stopAgentServer(agentId: string): Promise<void> {
		try {
			if (!this.a2aServer) {
				logger.warn("[A2AServerManager] A2A server not initialized")
				return
			}

			// 停止服务器
			await this.a2aServer.stopAgentServer(agentId)

			// 移除运行状态记录
			this.runningServers.delete(agentId)

			logger.info(`[A2AServerManager] Stopped server for agent ${agentId}`)
		} catch (error) {
			logger.error(`[A2AServerManager] Failed to stop server for agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 获取运行中的服务器列表
	 */
	getRunningServers(): string[] {
		return Array.from(this.runningServers.keys())
	}

	/**
	 * 获取服务器状态
	 */
	getServerStatus(agentId: string): any {
		const serverInfo = this.runningServers.get(agentId)
		if (!serverInfo) {
			return null
		}

		return {
			agentId,
			status: "running",
			port: serverInfo.port,
			url: serverInfo.url,
			startedAt: serverInfo.startedAt || Date.now(),
		}
	}

	/**
	 * 停止所有服务器
	 */
	async stopAllServers(): Promise<void> {
		try {
			if (!this.a2aServer) {
				return
			}

			await this.a2aServer.stopAllServers()
			this.runningServers.clear()

			logger.info("[A2AServerManager] Stopped all servers")
		} catch (error) {
			logger.error("[A2AServerManager] Failed to stop all servers:", error)
			throw error
		}
	}

	/**
	 * 自动启动所有已发布的智能体A2A服务器
	 */
	async startAllPublishedAgents(): Promise<{
		total: number
		started: number
		errors: Array<{ agentId: string; error: string }>
	}> {
		try {
			if (!this.storageService) {
				throw new Error("Storage service not initialized")
			}

			logger.info("[A2AServerManager] Starting auto-startup of published agents...")

			// 获取当前用户ID
			const VoidBridge = require("../../api/void-bridge").VoidBridge
			const userId = VoidBridge.getCurrentUserId() || "default"

			// 获取所有已发布的智能体
			const allAgents = await this.storageService.listUserAgents(userId)
			const publishedAgents = allAgents.filter(
				(agent) => agent.isPublished === true && (agent as any).autoStartServer !== false, // 默认自动启动，除非明确禁用
			)

			logger.info(
				`[A2AServerManager] Found ${publishedAgents.length} published agents out of ${allAgents.length} total agents`,
			)

			const results = {
				total: publishedAgents.length,
				started: 0,
				errors: [] as Array<{ agentId: string; error: string }>,
			}

			// 并行启动所有已发布的智能体 - 使用完整的发布流程
			const startupPromises = publishedAgents.map(async (agent) => {
				try {
					logger.info(`[A2AServerManager] Auto-starting agent: ${agent.name} (${agent.id})`)

					// 尝试使用智能体记录的端口（如果有的话）
					const preferredPort = (agent as any).publishInfo?.serverPort

					// 🔥 关键修复：使用完整的发布流程，确保Redis同步
					await this.startAgentWithFullFlow(agent, preferredPort)
					results.started++

					logger.info(`[A2AServerManager] ✅ Auto-started agent ${agent.name} with full Redis sync`)
					return { success: true, agentId: agent.id }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error(`[A2AServerManager] ❌ Failed to auto-start agent ${agent.name} (${agent.id}):`, error)
					results.errors.push({ agentId: agent.id, error: errorMessage })
					return { success: false, agentId: agent.id, error: errorMessage }
				}
			})

			// 等待所有启动完成
			await Promise.allSettled(startupPromises)

			console.log(
				`[A2AServerManager] ✅ Auto-startup completed: ${results.started}/${results.total} agents started successfully`,
			)

			// 打印所有运行中的智能体信息
			console.log(`[A2AServerManager] 📊 Running servers (${this.runningServers.size}):`)
			for (const [agentId, serverInfo] of this.runningServers.entries()) {
				console.log(`  - Agent ID: ${agentId}, URL: ${serverInfo.url}, Port: ${serverInfo.port}`)
			}

			if (results.errors.length > 0) {
				logger.warn(
					`[A2AServerManager] ${results.errors.length} agents failed to start: ${JSON.stringify(results.errors)}`,
				)
			}

			return results
		} catch (error) {
			logger.error("[A2AServerManager] Failed to start published agents:", error)
			throw error
		}
	}

	/**
	 * 检查服务器健康状态
	 * 同时检测 HTTP 端点和 WebSocket 连接状态
	 */
	async checkServerHealth(agentId: string): Promise<{ healthy: boolean; httpHealthy: boolean; wsHealthy: boolean }> {
		try {
			const serverInfo = this.runningServers.get(agentId)
			if (!serverInfo) {
				console.warn(
					`[A2AServerManager] Agent ${agentId} not found in runningServers. Current running agents: ${Array.from(this.runningServers.keys()).join(", ")}`,
				)
				return { healthy: false, httpHealthy: false, wsHealthy: false }
			}

			console.log(`[A2AServerManager] Checking health for agent ${agentId}, URL: ${serverInfo.url}`)

			// 1. 检查 HTTP 健康状态
			let httpHealthy = false
			try {
				const healthUrl = `${serverInfo.url}/health`
				console.log(`[A2AServerManager] Fetching health endpoint: ${healthUrl}`)

				// 使用原生 fetch API（Node.js 18+ 内置）
				const controller = new AbortController()
				const timeoutId = setTimeout(() => controller.abort(), 3000) // 3秒超时

				const response = await fetch(healthUrl, {
					method: "GET",
					signal: controller.signal,
				})

				clearTimeout(timeoutId)
				httpHealthy = response.ok
				console.log(
					`[A2AServerManager] HTTP health check for ${agentId}: status=${response.status}, ok=${response.ok}`,
				)
			} catch (error) {
				console.warn(
					`[A2AServerManager] HTTP health check failed for agent ${agentId} at ${serverInfo.url}/health:`,
					error,
				)
			}

			// 2. 检查 WebSocket 连接状态
			let wsHealthy = false
			try {
				// 获取全局的 LLMStreamService 实例中的 IM 连接
				// llmStreamService 存储在 global 对象中
				const llmService = (global as any).llmStreamService
				if (llmService?.imConnection) {
					wsHealthy = llmService.imConnection.isConnected
					console.log(
						`[A2AServerManager] WebSocket connection status: ${wsHealthy ? "✓ connected" : "✗ disconnected"}`,
					)
				} else {
					console.warn(`[A2AServerManager] LLMStreamService or IM connection not available in global`)
				}
			} catch (error) {
				console.warn(`[A2AServerManager] WebSocket health check failed for agent ${agentId}:`, error)
			}

			// 3. 综合判断：智能体调用主要依靠 WebSocket 桥接
			// HTTP 和 WebSocket 都正常才认为智能体可以正常工作
			const healthy = httpHealthy && wsHealthy

			console.log(
				`[A2AServerManager] ✅ Health check result for agent ${agentId}: httpHealthy=${httpHealthy}, wsHealthy=${wsHealthy}, overall=${healthy}`,
			)

			return { healthy, httpHealthy, wsHealthy }
		} catch (error) {
			logger.error(`[A2AServerManager] Health check failed for agent ${agentId}:`, error)
			return { healthy: false, httpHealthy: false, wsHealthy: false }
		}
	}

	/**
	 * 重启智能体服务器
	 */
	async restartAgentServer(agentId: string): Promise<void> {
		try {
			// 先停止
			await this.stopAgentServer(agentId)

			// 稍等一下
			await new Promise((resolve) => setTimeout(resolve, 1000))

			// 重新启动
			await this.startAgentServer(agentId)

			logger.info(`[A2AServerManager] Restarted server for agent ${agentId}`)
		} catch (error) {
			logger.error(`[A2AServerManager] Failed to restart server for agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 使用完整发布流程启动智能体 - 确保Redis同步
	 * 🔥 这是自动启动的核心方法，复用手动发布的完整逻辑
	 */
	private async startAgentWithFullFlow(agent: any, preferredPort?: number): Promise<void> {
		try {
			logger.info(`[A2AServerManager] Starting agent ${agent.id} with full flow, preferredPort: ${preferredPort}`)

			// 1. 重新获取完整的智能体数据（包含apiConfig）
			const VoidBridge = require("../../api/void-bridge").VoidBridge
			const userId = VoidBridge.getCurrentUserId() || "default"

			const result = (await require("vscode").commands.executeCommand("roo-cline.getAgent", {
				userId,
				agentId: agent.id,
			})) as any

			if (!result.success || !result.agent) {
				throw new Error(`Failed to get agent data: ${result.error || "Agent not found"}`)
			}

			const fullAgent = result.agent
			const terminal = { id: "local-computer", name: "本地电脑" }

			logger.info(`[A2AServerManager] Got agent data:`, {
				agentId: fullAgent.id,
				hasApiConfig: !!fullAgent.apiConfig,
				apiConfigId: fullAgent.apiConfigId,
			})

			// 2. 如果智能体缺少apiConfig对象，手动加载
			if (!fullAgent.apiConfig) {
				try {
					logger.info(`[A2AServerManager] Loading missing apiConfig for agent ${fullAgent.id}`)

					// 通过provider获取API配置列表
					// 注意：这里需要provider实例，我们通过构造函数传入
					if (this.provider) {
						const providerState = await this.provider.getState()

						// 首先尝试根据apiConfigId从listApiConfigMeta中查找
						if (fullAgent.apiConfigId && providerState?.listApiConfigMeta) {
							const matchingConfig = providerState.listApiConfigMeta.find(
								(config: any) =>
									config.id === fullAgent.apiConfigId || config.name === fullAgent.apiConfigId,
							)

							if (matchingConfig) {
								fullAgent.apiConfig = matchingConfig
								logger.info(
									`[A2AServerManager] ✅ Found apiConfig in listApiConfigMeta for agent ${fullAgent.id}`,
								)
							}
						}

						// 如果还没找到，使用当前API配置作为fallback
						if (!fullAgent.apiConfig && providerState?.apiConfiguration) {
							fullAgent.apiConfig = providerState.apiConfiguration
							logger.info(
								`[A2AServerManager] 🔄 Using provider current API config as fallback for agent ${fullAgent.id}`,
							)
						}
					}

					// 如果仍然没有API配置，警告但继续
					if (!fullAgent.apiConfig) {
						logger.warn(
							`[A2AServerManager] ⚠️ No API configuration found for agent ${fullAgent.id}, continuing anyway`,
						)
					}
				} catch (configError) {
					logger.error(
						`[A2AServerManager] ❌ Error loading apiConfig for agent ${fullAgent.id}:`,
						configError,
					)
				}
			}

			// 3. 直接调用手动发布使用的initializeAgentOnTerminal函数
			const { initializeAgentOnTerminal } = await import("../webview/webviewMessageHandler")
			await initializeAgentOnTerminal(fullAgent, terminal, this.provider, preferredPort)

			logger.info(`[A2AServerManager] ✅ Successfully started agent ${fullAgent.id} with full flow`)
		} catch (error) {
			logger.error(`[A2AServerManager] Failed to start agent ${agent.id} with full flow:`, error)
			throw error
		}
	}

	/**
	 * 设置provider实例（用于获取API配置）
	 */
	setProvider(provider: any): void {
		this.provider = provider
	}

	/**
	 * 获取A2A服务器实例
	 */
	async getA2AServer(): Promise<A2AServer | null> {
		if (!this.a2aServer) {
			await this.initialize()
		}
		return this.a2aServer
	}

	/**
	 * 获取智能体配置
	 */
	async getAgentConfig(agentId: string): Promise<any> {
		try {
			if (!this.storageService) {
				throw new Error("Storage service not initialized")
			}

			// 获取当前用户ID
			const VoidBridge = require("../../api/void-bridge").VoidBridge
			const userId = VoidBridge.getCurrentUserId() || "default"

			// 获取智能体配置
			const result = await this.storageService.getAgent(userId, agentId)
			return result
		} catch (error) {
			logger.error(`[A2AServerManager] Failed to get agent config for ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 销毁管理器
	 */
	async destroy(): Promise<void> {
		try {
			await this.stopAllServers()
			this.a2aServer = null
			this.storageService = null
			logger.info("[A2AServerManager] Destroyed successfully")
		} catch (error) {
			logger.error("[A2AServerManager] Failed to destroy:", error)
		}
	}
}
