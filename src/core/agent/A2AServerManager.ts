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
				} else {
					// 降级到创建新实例（不推荐）
					this.storageService = new EnhancedAgentStorageService()
					logger.warn(
						"[A2AServerManager] Creating new storage service instance - this may cause inconsistencies",
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
	 * 为智能体启动A2A服务器
	 */
	async startAgentServer(
		agentIdOrData: string | any,
		preferredPort?: number,
	): Promise<{
		port: number
		url: string
		agentCard: any
	}> {
		// 处理输入参数（在try外定义以便错误处理时使用）
		const agentId = typeof agentIdOrData === "string" ? agentIdOrData : agentIdOrData.id

		try {
			if (!this.a2aServer) {
				await this.initialize()
			}

			logger.info(
				`[A2AServerManager] Starting server for agent: ${agentId}, input type: ${typeof agentIdOrData}, preferredPort: ${preferredPort}`,
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
	 * 检查服务器健康状态
	 */
	async checkServerHealth(agentId: string): Promise<boolean> {
		try {
			const serverInfo = this.runningServers.get(agentId)
			if (!serverInfo) {
				return false
			}

			// TODO: 实现实际的健康检查逻辑
			// 可以发送ping请求到服务器端点
			return true
		} catch (error) {
			logger.error(`[A2AServerManager] Health check failed for agent ${agentId}:`, error)
			return false
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
