import * as vscode from "vscode"
import { logger } from "../../utils/logging"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { A2AServerManager } from "./A2AServerManager"
import { VoidBridge } from "../../api/void-bridge"

/**
 * 智能体自动启动服务
 * 负责在扩展启动时自动启动已发布的智能体服务器
 */
export class AgentAutoStartService {
	private static instance: AgentAutoStartService | null = null
	private storageService: EnhancedAgentStorageService | null = null
	private a2aServerManager: A2AServerManager | null = null
	private provider: any = null
	private isInitialized = false

	private constructor() {}

	static getInstance(): AgentAutoStartService {
		if (!AgentAutoStartService.instance) {
			AgentAutoStartService.instance = new AgentAutoStartService()
		}
		return AgentAutoStartService.instance
	}

	/**
	 * 初始化服务
	 */
	async initialize(
		storageService: EnhancedAgentStorageService,
		provider: any
	): Promise<void> {
		try {
			logger.info("[AgentAutoStartService] Initializing auto-start service...")
			
			this.storageService = storageService
			this.provider = provider
			this.a2aServerManager = A2AServerManager.getInstance()

			// 初始化A2A服务器管理器
			await this.a2aServerManager.initialize(storageService, provider)

			this.isInitialized = true
			logger.info("[AgentAutoStartService] Auto-start service initialized successfully")
		} catch (error) {
			logger.error("[AgentAutoStartService] Failed to initialize:", error)
			throw error
		}
	}

	/**
	 * 自动启动所有已发布的智能体服务器
	 */
	async autoStartPublishedAgents(): Promise<void> {
		if (!this.isInitialized) {
			logger.warn("[AgentAutoStartService] Service not initialized, skipping auto-start")
			return
		}

		try {
			logger.info("[AgentAutoStartService] Starting auto-start process...")

			// 获取当前用户ID
			const currentUserId = VoidBridge.getCurrentUserId() || "default"
			logger.info(`[AgentAutoStartService] Current user ID: ${currentUserId}`)

			// 获取用户的所有智能体
			let allAgents: any[] = []
			try {
				allAgents = await this.storageService!.listUserAgents(currentUserId)
				logger.info(`[AgentAutoStartService] Found ${allAgents.length} total agents for user ${currentUserId}`)
			} catch (error) {
				logger.error(`[AgentAutoStartService] Failed to get user agents: ${error instanceof Error ? error.message : "Unknown error"}`)
				throw error
			}

			// 筛选已发布的智能体
			const publishedAgents = allAgents.filter(agent => agent.isPublished === true)
			logger.info(`[AgentAutoStartService] Found ${publishedAgents.length} published agents`)

			if (publishedAgents.length === 0) {
				logger.info("[AgentAutoStartService] No published agents found, skipping auto-start")
				return
			}

			// 记录即将启动的智能体
			publishedAgents.forEach(agent => {
				logger.info(`[AgentAutoStartService] Will start agent: ${agent.name} (${agent.id})`)
			})

			// 启动已发布的智能体服务器
			const startPromises = publishedAgents.map(agent => this.startAgentServer(agent))
			
			// 等待所有启动完成
			const results = await Promise.allSettled(startPromises)

			// 统计结果
			let successCount = 0
			let failureCount = 0

			results.forEach((result, index) => {
				const agent = publishedAgents[index]
				if (result.status === 'fulfilled') {
					successCount++
					logger.info(`[AgentAutoStartService] ✅ Successfully started agent: ${agent.name} (${agent.id})`)
				} else {
					failureCount++
					logger.error(`[AgentAutoStartService] ❌ Failed to start agent: ${agent.name} (${agent.id})`, result.reason)
				}
			})

			logger.info(`[AgentAutoStartService] Auto-start completed: ${successCount} success, ${failureCount} failures`)

			// 显示通知
			if (successCount > 0) {
				vscode.window.showInformationMessage(
					`Roo-Code: ${successCount} 个已发布的智能体服务已自动启动`
				)
			}

			if (failureCount > 0) {
				vscode.window.showWarningMessage(
					`Roo-Code: ${failureCount} 个智能体服务启动失败，请检查配置`
				)
			}

		} catch (error) {
			logger.error("[AgentAutoStartService] Auto-start process failed:", error)
			vscode.window.showErrorMessage(`智能体自动启动失败: ${error instanceof Error ? error.message : "未知错误"}`)
		}
	}

	/**
	 * 启动单个智能体服务器 - 复用手动发布的完整逻辑
	 */
	private async startAgentServer(agent: any): Promise<void> {
		try {
			logger.info(`[AgentAutoStartService] Starting server for agent: ${agent.name} (${agent.id})`)

			// 优先使用上次发布的端口
			const preferredPort = agent.publishInfo?.serverPort
			if (preferredPort) {
				logger.info(`[AgentAutoStartService] Using preferred port ${preferredPort} for agent ${agent.id}`)
			}

			// 使用本地终端配置（与手动发布保持一致）
			const terminal = { id: "local-computer", name: "本地电脑" }

			// 直接复用手动发布的完整逻辑
			await this.initializeAgentOnTerminal(agent, terminal, preferredPort)

			logger.info(`[AgentAutoStartService] Successfully started server for ${agent.name} (${agent.id})`)

		} catch (error) {
			logger.error(`[AgentAutoStartService] Failed to start server for agent ${agent.id}:`, error)
			throw error
		}
	}

	/**
	 * 智能体初始化工作流 - 复用 webviewMessageHandler 中的逻辑
	 */
	private async initializeAgentOnTerminal(agent: any, terminal: any, preferredPort?: number): Promise<void> {
		try {
			logger.info(`[AgentAutoStartService] Initializing agent "${agent.name}" on terminal "${terminal.name}"`, {
				preferredPort,
			})

			if (terminal.id === "local-computer") {
				// 本地电脑发布逻辑 - 直接复用现有的 initializeLocalAgent 逻辑
				await this.initializeLocalAgent(agent, preferredPort)
			} else {
				throw new Error(`Unsupported terminal type: ${terminal.id}`)
			}

			logger.info(`[AgentAutoStartService] Agent "${agent.name}" initialized successfully on "${terminal.name}"`)
		} catch (error) {
			logger.error(`[AgentAutoStartService] Failed to initialize agent "${agent.name}":`, error)
			throw error
		}
	}

	/**
	 * 初始化本地智能体 - 完全复用 webviewMessageHandler 中的 initializeLocalAgent 逻辑
	 */
	private async initializeLocalAgent(agent: any, preferredPort?: number): Promise<void> {
		try {
			logger.info(`[AgentAutoStartService] Initializing local agent ${agent.id}...`)

			// 1. 获取A2A服务器管理器实例
			const serverManager = this.a2aServerManager!

			// 2. 为智能体启动专用的A2A服务器
			logger.info(`[AgentAutoStartService] Starting A2A server for agent ${agent.id}`, { preferredPort })
			const serverInfo = await serverManager.startAgentServer(agent.id, preferredPort)

			logger.info(`[AgentAutoStartService] A2A server started:`, {
				port: serverInfo.port,
				url: serverInfo.url,
				agentCard: !!serverInfo.agentCard
			})

			// 3. 更新 Provider 的全局状态（agentA2AMode）
			if (this.provider) {
				const updatedA2AConfig = {
					enabled: true,
					serverPort: serverInfo.port,
					serverUrl: serverInfo.url,
					agentId: agent.id,
					agentName: agent.name,
				}

				logger.info(`[AgentAutoStartService] Updating provider global state for agent ${agent.id}`)
				await this.provider.updateGlobalState("agentA2AMode", updatedA2AConfig)

				// 同步状态到webview
				await this.provider.postStateToWebview()
				logger.info(`[AgentAutoStartService] Provider state synchronized to webview`)
			}

			// 4. 更新本地智能体状态为"已发布"
			logger.info(`[AgentAutoStartService] Updating agent status to published`)
			await this.updateAgentPublishStatus(agent.id, true, {
				terminalType: "local",
				serverPort: serverInfo.port,
				serverUrl: serverInfo.url,
				publishedAt: new Date().toISOString(),
				serviceStatus: 'online',
				lastHeartbeat: Date.now(),
			})

			// 5. 向Redis注册智能体服务
			logger.info(`[AgentAutoStartService] Registering agent ${agent.id} in Redis`)
			await this.registerAgentInRedis(agent, serverInfo)

			logger.info(`[AgentAutoStartService] Local agent ${agent.id} initialized successfully`)
		} catch (error) {
			logger.error(`[AgentAutoStartService] Failed to initialize local agent ${agent.id}:`, error)
			throw error
		}
	}

	/**
	 * 更新智能体发布状态 - 复用 webviewMessageHandler 中的 updateAgentPublishStatus 逻辑
	 */
	private async updateAgentPublishStatus(
		agentId: string,
		isPublished: boolean,
		publishInfo: any
	): Promise<void> {
		try {
			const VoidBridge = require("../../api/void-bridge").VoidBridge
			const userId = VoidBridge.getCurrentUserId() || "default"

			logger.info(`[AgentAutoStartService] Updating agent ${agentId} publish status:`, {
				isPublished,
				publishInfo,
			})

			// 使用 VSCode 命令更新智能体状态
			const result = await vscode.commands.executeCommand("roo-cline.updateAgent", {
				userId,
				agentId,
				updates: {
					isPublished,
					publishInfo,
					updatedAt: Date.now(),
				},
			}) as any

			if (result.success) {
				logger.info(`[AgentAutoStartService] ✅ Agent ${agentId} publish status updated successfully`)
			} else {
				logger.error(`[AgentAutoStartService] ❌ Failed to update agent ${agentId} publish status:`, result.error)
				throw new Error(result.error || "Failed to update agent publish status")
			}
		} catch (error) {
			logger.error(`[AgentAutoStartService] Failed to update publish status for agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 向Redis注册智能体服务 - 完全复用 webviewMessageHandler 中的 registerAgentInRedis 逻辑
	 */
	private async registerAgentInRedis(agent: any, serverInfo: any): Promise<void> {
		try {
			logger.info(`[AgentAutoStartService] 🔄 Starting Redis registration for agent ${agent.id}`)

			// 获取Redis适配器 - 使用与手动发布相同的方式
			const { AgentRedisAdapter } = require("./AgentRedisAdapter")
			const redisAdapter = new AgentRedisAdapter()

			// 🔍 检查Redis连接状态
			if (!redisAdapter.isEnabled()) {
				logger.warn(`[AgentAutoStartService] ⚠️ Redis is not enabled/connected, skipping registration for agent ${agent.id}`)
				return
			}

			// 扩展智能体信息，加入服务注册相关字段 - 与手动发布完全一致
			const serviceAgent = {
				...agent,
				// 服务发现信息
				serviceEndpoint: serverInfo.url,
				servicePort: serverInfo.port,
				serviceStatus: "online",
				publishedAt: new Date().toISOString(),
				terminalType: "local",
				// A2A服务信息
				a2aCard: serverInfo.agentCard,
				capabilities: serverInfo.agentCard?.capabilities,
				deployment: serverInfo.agentCard?.deployment,
				// 运行时状态
				isPublished: true,
				lastHeartbeat: Date.now(),
			}

			logger.info(`[AgentAutoStartService] 📋 Agent data prepared for Redis:`, {
				agentId: agent.id,
				serviceEndpoint: serviceAgent.serviceEndpoint,
				servicePort: serviceAgent.servicePort,
				serviceStatus: serviceAgent.serviceStatus,
				hasA2ACard: !!serviceAgent.a2aCard,
			})

			// 🔥 立即同步到Redis（强制即时写入）- 使用与手动发布相同的方法
			await redisAdapter.syncAgentToRegistry(serviceAgent)
			logger.info(`[AgentAutoStartService] ✅ Agent ${agent.id} synced to Redis`)

			// 添加到在线智能体服务列表
			await redisAdapter.updateAgentOnlineStatus(agent.id, true)
			logger.info(`[AgentAutoStartService] ✅ Agent ${agent.id} marked as online in Redis`)

			// 🔍 验证Redis中的数据
			const retrievedAgent = await redisAdapter.getAgentFromRegistry(agent.userId, agent.id)
			if (retrievedAgent && retrievedAgent.serviceEndpoint) {
				logger.info(`[AgentAutoStartService] 🎯 Redis verification successful - agent ${agent.id} found with serviceEndpoint: ${retrievedAgent.serviceEndpoint}`)
			} else {
				logger.error(`[AgentAutoStartService] ❌ Redis verification failed - agent ${agent.id} not found or missing serviceEndpoint`)
			}

			logger.info(`[AgentAutoStartService] ✅ Agent ${agent.id} registered in Redis successfully`)

		} catch (error) {
			logger.error(`[AgentAutoStartService] ❌ CRITICAL: Failed to register agent in Redis:`, error)
			// 不抛出错误，避免阻塞整个自动启动流程
			// throw error
		}
	}

	/**
	 * 停止所有自动启动的服务器
	 */
	async stopAllServers(): Promise<void> {
		if (!this.a2aServerManager) {
			return
		}

		try {
			logger.info("[AgentAutoStartService] Stopping all auto-started servers...")
			await this.a2aServerManager.stopAllServers()
			logger.info("[AgentAutoStartService] All servers stopped")
		} catch (error) {
			logger.error("[AgentAutoStartService] Failed to stop servers:", error)
		}
	}

	/**
	 * 获取运行中的服务器状态
	 */
	getRunningServersStatus(): Array<{
		agentId: string
		status: string
		port: number
		url: string
	}> {
		if (!this.a2aServerManager) {
			return []
		}

		const runningAgentIds = this.a2aServerManager.getRunningServers()
		return runningAgentIds.map(agentId => {
			const serverStatus = this.a2aServerManager!.getServerStatus(agentId)
			return serverStatus || {
				agentId,
				status: 'unknown',
				port: 0,
				url: ''
			}
		})
	}

	/**
	 * 销毁服务
	 */
	async dispose(): Promise<void> {
		try {
			logger.info("[AgentAutoStartService] Disposing auto-start service...")
			await this.stopAllServers()
			this.storageService = null
			this.a2aServerManager = null
			this.provider = null
			this.isInitialized = false
			AgentAutoStartService.instance = null
			logger.info("[AgentAutoStartService] Service disposed")
		} catch (error) {
			logger.error("[AgentAutoStartService] Failed to dispose service:", error)
		}
	}
}