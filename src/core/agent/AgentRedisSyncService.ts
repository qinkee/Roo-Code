import { AgentConfig } from "@roo-code/types"
import { RedisSyncService } from "../../services/RedisSyncService"
import { logger } from "../../utils/logging"

/**
 * Redis智能体数据结构
 */
interface RedisAgentData {
	agents: AgentConfig[]
	metadata: {
		userId: string
		syncedAt: number
		version: string
		totalCount: number
	}
}

/**
 * 智能体Redis同步服务
 * 负责将智能体数据同步到Redis云端存储
 */
export class AgentRedisSyncService {
	private redis = RedisSyncService.getInstance()
	private currentUserId?: string
	private syncQueue = new Map<string, AgentConfig>()
	private syncTimer: NodeJS.Timeout | null = null

	constructor() {}

	/**
	 * 设置当前用户ID
	 */
	setCurrentUserId(userId: string): void {
		this.currentUserId = userId
		logger.info(`[AgentRedisSyncService] Set current user ID: ${userId}`)
	}

	/**
	 * 获取当前用户ID
	 */
	getCurrentUserId(): string | undefined {
		return this.currentUserId
	}

	/**
	 * 获取用户智能体Redis Key - 简化版，无终端隔离
	 */
	private getUserAgentsKey(userId?: string): string {
		const id = userId || this.currentUserId
		if (!id || id === "default") {
			return "" // 无效用户ID，不同步
		}
		return `roo:${id}:agents`
	}

	/**
	 * 同步用户所有智能体到Redis
	 */
	async syncUserAgents(userId: string, agents: AgentConfig[]): Promise<void> {
		try {
			if (!userId || userId === "default") {
				logger.debug("[AgentRedisSyncService] Invalid user ID, skipping sync")
				return
			}

			const syncData: RedisAgentData = {
				agents: agents.map(agent => this.sanitizeAgentForSync(agent)),
				metadata: {
					userId,
					syncedAt: Date.now(),
					version: "1.0",
					totalCount: agents.length,
				},
			}

			const redisKey = this.getUserAgentsKey(userId)
			if (redisKey) {
				await this.redis.set(redisKey, syncData)
				logger.info(`[AgentRedisSyncService] Synced ${agents.length} agents for user ${userId}`)
			}
		} catch (error) {
			logger.error("[AgentRedisSyncService] Failed to sync agents:", error)
		}
	}

	/**
	 * 从Redis加载用户智能体
	 */
	async loadUserAgentsFromRedis(userId: string): Promise<AgentConfig[]> {
		try {
			const redisKey = this.getUserAgentsKey(userId)
			if (!redisKey) return []

			const data = await this.redis.get(redisKey)
			if (!data?.agents) return []

			logger.info(`[AgentRedisSyncService] Loaded ${data.agents.length} agents from Redis for user ${userId}`)
			return data.agents.map((agent: any) => this.validateAgent(agent)).filter(Boolean) as AgentConfig[]
		} catch (error) {
			logger.error("[AgentRedisSyncService] Failed to load agents from Redis:", error)
			return []
		}
	}

	/**
	 * 增量同步单个智能体
	 */
	async syncSingleAgent(agent: AgentConfig): Promise<void> {
		if (!this.shouldSync(agent)) return

		// 加入同步队列，批量处理
		this.syncQueue.set(agent.id, agent)

		if (!this.syncTimer) {
			this.syncTimer = setTimeout(() => this.flushSyncQueue(), 300)
		}
	}

	/**
	 * 删除Redis中的智能体
	 */
	async deleteAgentFromRedis(agentId: string, userId: string): Promise<void> {
		try {
			const redisKey = this.getUserAgentsKey(userId)
			if (!redisKey) return

			const data = await this.redis.get(redisKey)
			if (data?.agents) {
				data.agents = data.agents.filter((agent: any) => agent.id !== agentId)
				data.metadata.syncedAt = Date.now()
				data.metadata.totalCount = data.agents.length
				await this.redis.set(redisKey, data)
				logger.info(`[AgentRedisSyncService] Deleted agent ${agentId} from Redis`)
			}
		} catch (error) {
			logger.error("[AgentRedisSyncService] Failed to delete agent from Redis:", error)
		}
	}

	/**
	 * 批量刷新同步队列
	 */
	private async flushSyncQueue(): Promise<void> {
		if (this.syncQueue.size === 0 || !this.currentUserId) {
			this.syncTimer = null
			return
		}

		try {
			// 获取当前用户所有智能体数据（这里需要外部提供获取方法）
			// 由于这里无法直接访问存储服务，我们采用增量更新的方式
			
			// 从Redis获取现有数据
			const existingData = await this.redis.get(this.getUserAgentsKey(this.currentUserId))
			const existingAgents = existingData?.agents || []
			
			// 创建映射以便快速查找和更新
			const agentMap = new Map<string, AgentConfig>()
			existingAgents.forEach((agent: AgentConfig) => {
				agentMap.set(agent.id, agent)
			})

			// 应用队列中的更新
			for (const [agentId, updatedAgent] of this.syncQueue) {
				agentMap.set(agentId, updatedAgent)
			}

			// 转换回数组并同步
			const updatedAgents = Array.from(agentMap.values())
			await this.syncUserAgents(this.currentUserId, updatedAgents)
			
			this.syncQueue.clear()
			logger.debug(`[AgentRedisSyncService] Flushed sync queue with ${updatedAgents.length} agents`)
		} catch (error) {
			logger.error("[AgentRedisSyncService] Failed to flush sync queue:", error)
		}

		this.syncTimer = null
	}

	/**
	 * 清理敏感信息，准备同步数据
	 */
	private sanitizeAgentForSync(agent: AgentConfig): AgentConfig {
		// 移除不需要同步的字段，保持数据精简
		return {
			...agent,
			// 可以在这里移除或加密敏感字段
		}
	}

	/**
	 * 验证从Redis加载的智能体数据
	 */
	private validateAgent(data: any): AgentConfig | null {
		try {
			if (!data.id || !data.userId || !data.name) {
				logger.warn("[AgentRedisSyncService] Invalid agent data: missing required fields")
				return null
			}

			return {
				id: data.id,
				userId: data.userId,
				name: data.name,
				avatar: data.avatar || "",
				roleDescription: data.roleDescription || "",
				apiConfigId: data.apiConfigId || "",
				mode: data.mode || "ask",
				tools: Array.isArray(data.tools) ? data.tools : [],
				todos: Array.isArray(data.todos) ? data.todos : [],
				templateSource: data.templateSource,
				createdAt: data.createdAt || Date.now(),
				updatedAt: data.updatedAt || Date.now(),
				lastUsedAt: data.lastUsedAt,
				isActive: data.isActive ?? true,
				version: data.version || 1,
			}
		} catch (error) {
			logger.error("[AgentRedisSyncService] Invalid agent data:", error)
			return null
		}
	}

	/**
	 * 检查是否应该同步该智能体
	 */
	private shouldSync(agent: AgentConfig): boolean {
		return !!(this.currentUserId && agent.userId === this.currentUserId)
	}

	/**
	 * 强制同步指定用户的所有智能体（需要外部提供数据）
	 */
	async forceSyncUserAgents(userId: string, agents: AgentConfig[]): Promise<void> {
		await this.syncUserAgents(userId, agents)
	}

	/**
	 * 检查Redis连接状态
	 */
	async isRedisAvailable(): Promise<boolean> {
		try {
			const testKey = `test:${Date.now()}`
			await this.redis.set(testKey, "test")
			const result = await this.redis.get(testKey)
			return result === "test"
		} catch (error) {
			logger.debug("[AgentRedisSyncService] Redis not available:", error)
			return false
		}
	}

	/**
	 * 清空用户的所有智能体数据（慎用）
	 */
	async clearUserAgents(userId: string): Promise<void> {
		try {
			const redisKey = this.getUserAgentsKey(userId)
			if (redisKey) {
				const emptyData: RedisAgentData = {
					agents: [],
					metadata: {
						userId,
						syncedAt: Date.now(),
						version: "1.0",
						totalCount: 0,
					},
				}
				await this.redis.set(redisKey, emptyData)
				logger.info(`[AgentRedisSyncService] Cleared all agents for user ${userId}`)
			}
		} catch (error) {
			logger.error("[AgentRedisSyncService] Failed to clear user agents:", error)
		}
	}

	/**
	 * 获取Redis实例（供外部访问）
	 */
	getRedis(): RedisSyncService {
		return this.redis
	}
}