import { AgentConfig, AgentTodo, AgentListOptions, AgentExportData, A2AAgentCard } from "@roo-code/types"
import { VSCodeAgentStorageService } from "./VSCodeAgentStorageService"
import { AgentRedisAdapter } from "./AgentRedisAdapter"
import { AgentStorageService } from "./AgentStorageService"
import { logger } from "../../utils/logging"
import * as vscode from "vscode"

/**
 * 增强的智能体存储服务
 * 集成本地存储和Redis同步功能
 */
export class EnhancedAgentStorageService implements AgentStorageService {
	private localStorage: VSCodeAgentStorageService
	private redisAdapter: AgentRedisAdapter
	private syncEnabled: boolean = false

	constructor(context: vscode.ExtensionContext) {
		this.localStorage = new VSCodeAgentStorageService(context)
		this.redisAdapter = new AgentRedisAdapter()
		this.initializeRedisSync()
	}

	/**
	 * 初始化Redis同步
	 */
	private async initializeRedisSync(): Promise<void> {
		try {
			logger.info(`[EnhancedAgentStorageService] Initializing Redis sync...`)
			
			// 尝试初始化Redis连接
			await this.redisAdapter.initialize()
			
			// 等待一小段时间让连接完全建立
			await new Promise(resolve => setTimeout(resolve, 1000))
			
			this.syncEnabled = this.redisAdapter.isEnabled()

			if (this.syncEnabled) {
				logger.info(`[EnhancedAgentStorageService] ✅ Redis sync enabled successfully`)
			} else {
				logger.warn(`[EnhancedAgentStorageService] ⚠️ Redis connection failed, running in local-only mode`)
				logger.warn(`[EnhancedAgentStorageService] Agent data will not be synchronized across instances`)
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] ❌ Redis sync initialization error:`, error)
			this.syncEnabled = false
		}
	}

	/**
	 * 创建智能体（本地存储 + Redis同步）
	 */
	async createAgent(
		userId: string,
		config: Omit<AgentConfig, "id" | "createdAt" | "updatedAt">,
	): Promise<AgentConfig> {
		try {
			// 1. 先保存到本地存储
			const agent = await this.localStorage.createAgent(userId, config)

			// 2. 检查Redis连接状态并同步
			const redisEnabled = this.redisAdapter.isEnabled()
			logger.info(
				`[EnhancedAgentStorageService] Creating agent ${agent.id}, Redis enabled: ${redisEnabled}, syncEnabled: ${this.syncEnabled}`,
			)

			if (this.syncEnabled && redisEnabled) {
				logger.info(`[EnhancedAgentStorageService] Syncing agent ${agent.id} to Redis...`)
				this.redisAdapter.syncAgentToRegistry(agent).catch((error) => {
					logger.error(
						`[EnhancedAgentStorageService] Failed to sync created agent ${agent.id} to Redis:`,
						error,
					)
				})
			} else {
				logger.warn(
					`[EnhancedAgentStorageService] Skipping Redis sync for agent ${agent.id} - syncEnabled: ${this.syncEnabled}, redisEnabled: ${redisEnabled}`,
				)
			}

			return agent
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to create agent:`, error)
			throw error
		}
	}

	/**
	 * 获取智能体
	 */
	async getAgent(userId: string, agentId: string): Promise<AgentConfig | null> {
		// 从本地存储获取（可能需要后续支持从Redis获取共享智能体）
		return this.localStorage.getAgent(userId, agentId)
	}

	/**
	 * 更新智能体（本地存储 + Redis同步）
	 */
	async updateAgent(userId: string, agentId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
		try {
			// 1. 先更新本地存储
			const updatedAgent = await this.localStorage.updateAgent(userId, agentId, updates)

			// 2. 检查Redis连接状态并同步
			const redisEnabled = this.redisAdapter.isEnabled()
			
			if (this.syncEnabled && redisEnabled) {
				this.redisAdapter.syncAgentToRegistry(updatedAgent)
					.catch((error) => {
						logger.error(
							`[EnhancedAgentStorageService] Failed to sync updated agent ${agentId} to Redis:`,
							error,
						)
					})
			}

			return updatedAgent
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to update agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 删除智能体（本地存储 + Redis同步）
	 */
	async deleteAgent(userId: string, agentId: string): Promise<boolean> {
		try {
			// 1. 先从本地存储删除
			const deleted = await this.localStorage.deleteAgent(userId, agentId)

			// 2. 检查Redis连接状态并删除
			const redisEnabled = this.redisAdapter.isEnabled()
			if (deleted && this.syncEnabled && redisEnabled) {
				this.redisAdapter.removeAgentFromRegistry(userId, agentId).catch((error) => {
					logger.error(`[EnhancedAgentStorageService] Failed to remove agent ${agentId} from Redis:`, error)
				})
			}

			return deleted
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to delete agent ${agentId}:`, error)
			return false
		}
	}

	/**
	 * 列出用户智能体
	 */
	async listUserAgents(userId: string, options?: AgentListOptions): Promise<AgentConfig[]> {
		return this.localStorage.listUserAgents(userId, options)
	}

	/**
	 * 搜索智能体
	 */
	async searchAgents(userId: string, query: string): Promise<AgentConfig[]> {
		return this.localStorage.searchAgents(userId, query)
	}

	/**
	 * 添加Todo
	 */
	async addTodo(
		userId: string,
		agentId: string,
		todo: Omit<AgentTodo, "id" | "createdAt" | "updatedAt">,
	): Promise<AgentTodo> {
		const result = await this.localStorage.addTodo(userId, agentId, todo)

		// 同步更新（异步）
		if (this.syncEnabled) {
			this.syncAgentAfterTodoChange(userId, agentId)
		}

		return result
	}

	/**
	 * 更新Todo
	 */
	async updateTodo(userId: string, agentId: string, todoId: string, updates: Partial<AgentTodo>): Promise<AgentTodo> {
		const result = await this.localStorage.updateTodo(userId, agentId, todoId, updates)

		// 同步更新（异步）
		if (this.syncEnabled) {
			this.syncAgentAfterTodoChange(userId, agentId)
		}

		return result
	}

	/**
	 * 删除Todo
	 */
	async deleteTodo(userId: string, agentId: string, todoId: string): Promise<boolean> {
		const result = await this.localStorage.deleteTodo(userId, agentId, todoId)

		// 同步更新（异步）
		if (result && this.syncEnabled) {
			this.syncAgentAfterTodoChange(userId, agentId)
		}

		return result
	}

	/**
	 * 导出智能体
	 */
	async exportAgent(userId: string, agentId: string): Promise<AgentExportData> {
		return this.localStorage.exportAgent(userId, agentId)
	}

	/**
	 * 导入智能体
	 */
	async importAgent(userId: string, data: AgentExportData): Promise<AgentConfig> {
		const agent = await this.localStorage.importAgent(userId, data)

		// 同步到Redis（异步）
		if (this.syncEnabled) {
			this.redisAdapter.syncAgentToRegistry(agent).catch((error) => {
				logger.error(`[EnhancedAgentStorageService] Failed to sync imported agent ${agent.id} to Redis:`, error)
			})
		}

		return agent
	}

	/**
	 * 更新智能体共享配置
	 */
	async updateAgentSharing(
		userId: string,
		agentId: string,
		sharing: {
			isPrivate?: boolean
			shareScope?: "friends" | "groups" | "public"
			shareLevel?: number
			allowedUsers?: string[]
			allowedGroups?: string[]
			deniedUsers?: string[]
		},
	): Promise<AgentConfig> {
		try {
			// 使用本地存储的方法（如果支持）
			if ("updateAgentSharing" in this.localStorage) {
				const result = await (this.localStorage as any).updateAgentSharing(userId, agentId, sharing)

				// 同步到Redis（异步）
				if (this.syncEnabled) {
					this.redisAdapter.syncAgentToRegistry(result).catch((error) => {
						logger.error(
							`[EnhancedAgentStorageService] Failed to sync sharing update for agent ${agentId}:`,
							error,
						)
					})
				}

				return result
			} else {
				// 降级到普通更新
				return this.updateAgent(userId, agentId, sharing)
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to update agent sharing ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 更新智能体A2A配置
	 */
	async updateAgentA2AConfig(
		userId: string,
		agentId: string,
		a2aConfig: {
			a2aAgentCard?: A2AAgentCard
			a2aEndpoint?: string
		},
	): Promise<AgentConfig> {
		try {
			// 使用本地存储的方法（如果支持）
			if ("updateAgentA2AConfig" in this.localStorage) {
				const result = await (this.localStorage as any).updateAgentA2AConfig(userId, agentId, a2aConfig)

				// 同步到Redis（异步）
				if (this.syncEnabled) {
					this.redisAdapter.syncAgentToRegistry(result).catch((error) => {
						logger.error(
							`[EnhancedAgentStorageService] Failed to sync A2A config update for agent ${agentId}:`,
							error,
						)
					})
				}

				return result
			} else {
				// 降级到普通更新
				return this.updateAgent(userId, agentId, a2aConfig)
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to update agent A2A config ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 搜索可访问的智能体（包括共享的智能体）
	 */
	async searchAccessibleAgents(userId: string, query: string, includeShared: boolean = true): Promise<AgentConfig[]> {
		try {
			// 使用本地存储的方法（如果支持）
			if ("searchAccessibleAgents" in this.localStorage) {
				return await (this.localStorage as any).searchAccessibleAgents(userId, query, includeShared)
			} else {
				// 降级到普通搜索
				return this.searchAgents(userId, query)
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to search accessible agents:`, error)
			return []
		}
	}

	/**
	 * 检查智能体访问权限
	 */
	async checkAgentAccess(
		userId: string,
		agentId: string,
		action: "read" | "execute" | "modify" = "read",
	): Promise<boolean> {
		try {
			// 使用本地存储的方法（如果支持）
			if ("checkAgentAccess" in this.localStorage) {
				return await (this.localStorage as any).checkAgentAccess(userId, agentId, action)
			} else {
				// 降级检查：只检查是否是自己的智能体
				const agent = await this.getAgent(userId, agentId)
				return agent !== null
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to check agent access:`, error)
			return false
		}
	}

	/**
	 * Todo变更后同步智能体
	 */
	private async syncAgentAfterTodoChange(userId: string, agentId: string): Promise<void> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (agent) {
				await this.redisAdapter.syncAgentToRegistry(agent)
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to sync agent after todo change:`, error)
		}
	}

	/**
	 * 发送心跳（用于维持Redis中的在线状态）
	 */
	async sendHeartbeat(
		agentId: string,
		metrics?: {
			currentLoad?: number
			avgResponseTime?: number
			errorRate?: number
			memoryUsage?: number
			cpuUsage?: number
		},
	): Promise<void> {
		if (this.syncEnabled) {
			await this.redisAdapter.updateHeartbeat(agentId, metrics)
		}
	}

	/**
	 * 获取在线智能体列表
	 */
	async getOnlineAgents(): Promise<string[]> {
		if (this.syncEnabled) {
			return this.redisAdapter.getOnlineAgents()
		}
		return []
	}

	/**
	 * 检查Redis同步是否启用
	 */
	isSyncEnabled(): boolean {
		return this.syncEnabled
	}

	/**
	 * 手动触发同步
	 */
	async manualSync(userId: string): Promise<void> {
		if (!this.syncEnabled) {
			throw new Error("Redis sync is not enabled")
		}

		try {
			const agents = await this.listUserAgents(userId)

			for (const agent of agents) {
				await this.redisAdapter.syncAgentToRegistry(agent)
			}

			logger.info(`[EnhancedAgentStorageService] Manual sync completed for ${agents.length} agents`)
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Manual sync failed:`, error)
			throw error
		}
	}

	/**
	 * 设置当前用户ID（for AgentManager compatibility）
	 */
	setCurrentUserId(userId: string): void {
		// This method is used by AgentManager for compatibility
		// Since we now pass userId explicitly in all methods, this is a no-op
		logger.debug(`[EnhancedAgentStorageService] setCurrentUserId called with: ${userId}`)
	}

	/**
	 * 强制同步到Redis
	 */
	async forceSyncToRedis(userId: string): Promise<void> {
		if (!this.syncEnabled) {
			throw new Error("Redis sync is not enabled")
		}

		try {
			const agents = await this.listUserAgents(userId)

			for (const agent of agents) {
				await this.redisAdapter.syncAgentToRegistry(agent)
			}

			logger.info(`[EnhancedAgentStorageService] Force sync completed for ${agents.length} agents`)
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Force sync failed:`, error)
			throw error
		}
	}

	/**
	 * 从Redis恢复数据
	 */
	async restoreFromRedis(userId: string): Promise<void> {
		if (!this.syncEnabled) {
			throw new Error("Redis sync is not enabled")
		}

		try {
			// This would need to be implemented in RedisSyncService
			// For now, just log that it was called
			logger.info(`[EnhancedAgentStorageService] Restore from Redis requested for user: ${userId}`)
			// TODO: Implement actual restore logic
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Restore from Redis failed:`, error)
			throw error
		}
	}

	/**
	 * 检查数据一致性
	 */
	async checkDataConsistency(userId: string): Promise<{
		localCount: number
		redisCount: number
		missingInRedis: string[]
		missingInLocal: string[]
	}> {
		if (!this.syncEnabled) {
			return {
				localCount: 0,
				redisCount: 0,
				missingInRedis: [],
				missingInLocal: [],
			}
		}

		try {
			const localAgents = await this.listUserAgents(userId)
			const localAgentIds = localAgents.map((a) => a.id)

			// This would need proper implementation in RedisSyncService
			// For now, return basic info
			return {
				localCount: localAgents.length,
				redisCount: 0, // TODO: Get from Redis
				missingInRedis: [],
				missingInLocal: [],
			}
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Data consistency check failed:`, error)
			throw error
		}
	}

	/**
	 * 获取Redis同步服务
	 */
	getSyncService(): AgentRedisAdapter {
		return this.redisAdapter
	}

	/**
	 * 获取基础存储服务
	 */
	getBaseStorageService(): VSCodeAgentStorageService {
		return this.localStorage
	}

	/**
	 * 导出智能体数据
	 */
	async exportAgents(userId: string): Promise<AgentExportData> {
		return this.localStorage.exportAgents(userId)
	}

	/**
	 * 导入智能体数据
	 */
	async importAgents(userId: string, data: AgentExportData): Promise<AgentConfig[]> {
		return this.localStorage.importAgents(userId, data)
	}

	// ===== IM集成相关方法 =====

	/**
	 * 获取共享智能体列表（IM专用）
	 */
	async getSharedAgents(params: {
		shareScope: string
		allowedGroups?: string[]
		allowedUsers?: string[]
		excludeUserId?: string
	}): Promise<AgentConfig[]> {
		try {
			if (!this.syncEnabled) {
				logger.warn("[EnhancedAgentStorageService] Redis not available, cannot get shared agents")
				return []
			}

			// 从Redis获取共享智能体
			const sharedAgents = await this.redisAdapter.getSharedAgents(params)
			return sharedAgents
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to get shared agents:", error)
			return []
		}
	}

	/**
	 * 调用智能体（IM专用）
	 */
	async invokeAgent(agentId: string, message: string, context?: any): Promise<string> {
		try {
			// 1. 获取智能体配置
			const agent = await this.getAgentFromAnySource(agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found`)
			}

			logger.info(
				`[EnhancedAgentStorageService] Invoking agent ${agent.name} with message: ${message.substring(0, 100)}...`,
			)

			// 2. 实现智能体调用逻辑
			const result = await this.executeAgentTask(agent, message, context)
			return result
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to invoke agent:", error)
			throw error
		}
	}

	/**
	 * 执行智能体任务的具体实现
	 */
	private async executeAgentTask(agent: AgentConfig, message: string, context?: any): Promise<string> {
		try {
			// 这里实现具体的智能体执行逻辑
			// 可能需要调用AI API、执行工具等

			// 简化版本：基于角色描述生成回复
			const systemPrompt = `你是一个名为 ${agent.name} 的AI助手。角色描述：${agent.roleDescription}`

			// 模拟智能体回复（实际实现中可能需要调用AI服务）
			const response = await this.simulateAgentResponse(systemPrompt, message, context)

			return response
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to execute agent task:", error)
			throw error
		}
	}

	/**
	 * 模拟智能体回复（临时实现）
	 */
	private async simulateAgentResponse(systemPrompt: string, message: string, context?: any): Promise<string> {
		// 这是一个临时的模拟实现
		// 实际应用中需要调用真正的AI API

		const responses = [
			`作为 ${context?.agentName || "智能助手"}，我收到了您的消息：${message}。我正在处理您的请求...`,
			`感谢您的询问！基于我的专业知识，我认为这个问题需要进一步分析。`,
			`我理解您的需求。让我为您提供一些建议和解决方案。`,
			`这是一个很好的问题！我会根据我的经验为您提供详细的回答。`,
		]

		const randomResponse = responses[Math.floor(Math.random() * responses.length)]

		// 模拟处理时间
		await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

		return randomResponse
	}

	/**
	 * 从任何可用源获取智能体（优先本地，然后Redis）
	 */
	private async getAgentFromAnySource(agentId: string): Promise<AgentConfig | null> {
		try {
			// 1. 先尝试从本地获取（假设需要当前用户ID）
			const currentUserId = this.getCurrentUserId()
			if (currentUserId) {
				const localAgent = await this.localStorage.getAgent(currentUserId, agentId)
				if (localAgent) {
					return localAgent
				}
			}

			// 2. 从Redis获取
			if (this.syncEnabled) {
				const redisAgent = await this.redisAdapter.getAgent(agentId)
				if (redisAgent) {
					return redisAgent
				}
			}

			return null
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to get agent from any source:", error)
			return null
		}
	}

	/**
	 * 获取当前用户ID（需要与VoidBridge集成）
	 */
	private getCurrentUserId(): string | null {
		try {
			// 从VoidBridge获取当前用户ID
			const { VoidBridge } = require("../../api/void-bridge")
			return VoidBridge.getCurrentUserId()
		} catch (error) {
			logger.warn("[EnhancedAgentStorageService] Failed to get current user ID:", error)
			return null
		}
	}

	/**
	 * 关闭服务
	 */
	async close(): Promise<void> {
		if (this.syncEnabled) {
			await this.redisAdapter.close()
		}
	}
}
