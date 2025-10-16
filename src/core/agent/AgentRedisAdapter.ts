import { RedisSyncService } from "../../services/RedisSyncService"
import { AgentConfig } from "@roo-code/types"
import { logger } from "../../utils/logging"

/**
 * 智能体Redis适配器
 * 基于现有RedisSyncService实现智能体专用的同步功能
 */
export class AgentRedisAdapter {
	private redisService: RedisSyncService

	constructor() {
		this.redisService = RedisSyncService.getInstance()
	}

	/**
	 * 同步智能体到Redis
	 */
	async syncAgentToRegistry(agent: any): Promise<void> {
		try {
			// 首先检查Redis是否可用
			const redisEnabled = this.isEnabled()

			if (!redisEnabled) {
				logger.warn(`[AgentRedisAdapter] Cannot sync agent ${agent.id} - Redis is not connected`)
				return
			}

			const key = `roo:${agent.userId}:agents:${agent.id}`

			// 🎯 从 publishInfo 提取服务信息，映射到Redis顶层字段
			const publishInfo = agent.publishInfo || {}

			// 🎯 关键修复：先展开所有字段，确保不遗漏任何字段（如 welcomeMessage）
			// 注意：undefined 字段在 JSON 序列化时会被忽略，需要显式处理
			const agentData: any = {}

			// 复制所有字段（包括undefined的字段也要保留）
			Object.keys(agent).forEach((key) => {
				agentData[key] = (agent as any)[key]
			})

			// 🎯 特殊处理：发布信息字段需要从 publishInfo 提取到顶层
			if (agent.isPublished && publishInfo) {
				agentData.serviceEndpoint = publishInfo.serverUrl
				agentData.servicePort = publishInfo.serverPort
				agentData.serviceStatus = publishInfo.serviceStatus || "offline"
				agentData.publishedAt = publishInfo.publishedAt
				agentData.terminalType = publishInfo.terminalType
				agentData.lastHeartbeat = publishInfo.lastHeartbeat

				// 确保默认值
				agentData.capabilities = agent.capabilities || {
					messageTypes: ["text", "json"],
					taskTypes: ["execute", "query"],
					dataFormats: ["text", "json"],
					maxConcurrency: 5,
				}
				agentData.deployment = agent.deployment || {
					type: "pc",
					endpointType: "network_reachable",
					directUrl: publishInfo.serverUrl,
				}
			}

			// 同步信息日志
			logger.info(`[AgentRedisAdapter] Syncing agent ${agent.id} to Redis (isPublished=${agent.isPublished}, serviceStatus=${agentData.serviceStatus})`)

			// 立即写入Redis，确保智能体注册信息第一时间生效
			await this.redisService.set(key, agentData, true)

			// 同时添加到在线智能体列表
			if (agent.isActive) {
				const onlineKey = `roo:online_agents`
				const onlineAgents = await this.getOnlineAgents()
				if (!onlineAgents.includes(agent.id)) {
					onlineAgents.push(agent.id)
					await this.redisService.set(onlineKey, onlineAgents, true)
				}
			}

			logger.info(`[AgentRedisAdapter] Successfully synced agent ${agent.id} to Redis`)
		} catch (error) {
			logger.error(`[AgentRedisAdapter] ❌ Failed to sync agent ${agent.id}:`, error)
			throw error
		}
	}

	/**
	 * 从Redis注册中心移除智能体
	 */
	async removeAgentFromRegistry(userId: string, agentId: string): Promise<void> {
		try {
			const key = `roo:${userId}:agents:${agentId}`
			// 真正删除Redis中的key
			await this.redisService.delete(key)

			// 从在线列表移除
			const onlineKey = `roo:online_agents`
			const onlineAgents = await this.getOnlineAgents()
			const filtered = onlineAgents.filter((id) => id !== agentId)
			await this.redisService.set(onlineKey, filtered)

			logger.debug(`[AgentRedisAdapter] Removed agent ${agentId} from Redis`)
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to remove agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 获取在线智能体列表
	 */
	async getOnlineAgents(): Promise<string[]> {
		try {
			const onlineKey = `roo:online_agents`
			const agents = await this.redisService.get(onlineKey)
			return Array.isArray(agents) ? agents : []
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get online agents:`, error)
			return []
		}
	}

	/**
	 * 获取智能体信息
	 */
	async getAgentFromRegistry(userId: string, agentId: string): Promise<AgentConfig | null> {
		try {
			const key = `roo:${userId}:agents:${agentId}`
			const data = await this.redisService.get(key)

			if (!data || data === null) {
				return null
			}

			// 验证数据完整性
			if (!data.id || !data.userId || !data.name) {
				logger.warn(`[AgentRedisAdapter] Invalid agent data for ${agentId}`)
				return null
			}

			// 🎯 关键修复：将Redis扁平结构转换回本地嵌套结构
			// Redis存储：serviceStatus, servicePort 等在顶层
			// 本地存储：这些字段应该在 publishInfo 中
			const agent: AgentConfig = {
				...data,
				// 如果有发布信息，将顶层字段移到 publishInfo
				...(data.isPublished && {
					publishInfo: {
						serviceStatus: data.serviceStatus,
						serverPort: data.servicePort,
						serverUrl: data.serviceEndpoint,
						terminalType: data.terminalType,
						publishedAt: data.publishedAt,
						lastHeartbeat: data.lastHeartbeat,
					},
				}),
			}

			logger.debug(`[AgentRedisAdapter] Converted Redis data to local format for agent ${agentId}`)

			return agent as AgentConfig
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get agent ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 获取用户的所有智能体ID列表（使用模式匹配）
	 */
	async getUserAgentIds(userId: string): Promise<string[]> {
		try {
			const pattern = `roo:${userId}:agents:*`
			console.log(`[AgentRedisAdapter] 🔍 Using pattern: ${pattern}`)

			const keys = await this.redisService.keys(pattern)
			console.log(`[AgentRedisAdapter] 🔍 Found ${keys.length} keys matching pattern`)

			// 过滤掉索引key和其他非智能体数据key，只保留智能体数据key
			const agentIds = keys
				.filter(key => !key.endsWith(':index') && !key.includes(':online_agents'))
				.map(key => {
					// 从 "roo:166:agents:agent_xxx" 提取 "agent_xxx"
					const parts = key.split(':')
					return parts[parts.length - 1]
				})

			console.log(`[AgentRedisAdapter] 🔍 Extracted ${agentIds.length} agent IDs:`, agentIds)
			return agentIds
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get user agent ids for ${userId}:`, error)
			return []
		}
	}

	/**
	 * 获取用户的所有智能体
	 */
	async getUserAgentsFromRegistry(userId: string): Promise<AgentConfig[]> {
		try {
			// 使用新的索引方法
			const agentIds = await this.getUserAgentIds(userId)
			const agents: AgentConfig[] = []

			for (const agentId of agentIds) {
				const agent = await this.getAgentFromRegistry(userId, agentId)
				if (agent) {
					agents.push(agent)
				}
			}

			logger.debug(`[AgentRedisAdapter] Got ${agents.length} agents for user ${userId}`)
			return agents
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get user agents for ${userId}:`, error)
			return []
		}
	}

	/**
	 * 检查Redis是否可用
	 */
	isEnabled(): boolean {
		return this.redisService.getConnectionStatus()
	}

	/**
	 * 初始化Redis连接
	 */
	async initialize(): Promise<void> {
		// 现有RedisSyncService在构造时自动连接，这里启动健康检查
		logger.info(`[AgentRedisAdapter] Starting initialization...`)
		this.redisService.startHealthCheck()

		// 检查连接状态
		const isConnected = this.redisService.getConnectionStatus()
		if (isConnected) {
			logger.info(`[AgentRedisAdapter] ✅ Redis service is connected and ready`)
		} else {
			logger.warn(`[AgentRedisAdapter] ⚠️ Redis service is not connected`)
		}
	}

	/**
	 * 关闭Redis连接
	 */
	async close(): Promise<void> {
		try {
			await this.redisService.disconnect()
			logger.info(`[AgentRedisAdapter] Closed Redis connection`)
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to close Redis connection:`, error)
		}
	}

	/**
	 * 更新智能体在线状态
	 */
	async updateAgentOnlineStatus(agentId: string, isOnline: boolean): Promise<void> {
		try {
			const onlineKey = `roo:online_agents`
			const onlineAgents = await this.getOnlineAgents()

			if (isOnline && !onlineAgents.includes(agentId)) {
				onlineAgents.push(agentId)
				await this.redisService.set(onlineKey, onlineAgents, true)
			} else if (!isOnline && onlineAgents.includes(agentId)) {
				const filtered = onlineAgents.filter((id) => id !== agentId)
				await this.redisService.set(onlineKey, filtered, true)
			}

			logger.debug(`[AgentRedisAdapter] Updated online status for ${agentId}: ${isOnline}`)
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to update online status for ${agentId}:`, error)
		}
	}

	/**
	 * 批量同步智能体
	 */
	async batchSyncAgents(agents: AgentConfig[]): Promise<void> {
		try {
			const syncPromises = agents.map((agent) => this.syncAgentToRegistry(agent))
			await Promise.all(syncPromises)

			logger.info(`[AgentRedisAdapter] Batch synced ${agents.length} agents`)
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to batch sync agents:`, error)
			throw error
		}
	}

	// ===== IM集成相关方法 =====

	/**
	 * 获取共享智能体列表
	 */
	async getSharedAgents(params: {
		shareScope: string
		allowedGroups?: string[]
		allowedUsers?: string[]
		excludeUserId?: string
	}): Promise<AgentConfig[]> {
		try {
			const sharedAgents: AgentConfig[] = []

			// 根据共享范围获取不同的智能体集合
			let searchKeys: string[] = []

			switch (params.shareScope) {
				case "friends":
					searchKeys = ["roo:shared:agents:friends"]
					break
				case "groups":
					searchKeys = ["roo:shared:agents:groups"]
					break
				case "public":
					searchKeys = ["roo:shared:agents:public"]
					break
				default:
					// 获取所有共享智能体
					searchKeys = ["roo:shared:agents:friends", "roo:shared:agents:groups", "roo:shared:agents:public"]
			}

			// 从各个集合中获取智能体ID
			const agentIds = new Set<string>()
			for (const key of searchKeys) {
				try {
					const ids = ((await this.redisService.get(key)) as string[]) || []
					ids.forEach((id: string) => agentIds.add(id))
				} catch (error) {
					logger.warn(`[AgentRedisAdapter] Failed to get agents from ${key}:`, error)
				}
			}

			// 获取每个智能体的详细信息
			for (const agentId of agentIds) {
				try {
					const agent = await this.getAgent(agentId)
					if (agent && this.checkAgentPermissions(agent, params)) {
						sharedAgents.push(agent)
					}
				} catch (error) {
					logger.warn(`[AgentRedisAdapter] Failed to get agent ${agentId}:`, error)
				}
			}

			logger.info(
				`[AgentRedisAdapter] Found ${sharedAgents.length} shared agents for scope: ${params.shareScope}`,
			)
			return sharedAgents
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get shared agents:`, error)
			return []
		}
	}

	/**
	 * 获取单个智能体详细信息
	 */
	async getAgent(agentId: string): Promise<AgentConfig | null> {
		try {
			const key = `roo:agent:${agentId}:details`
			const data = await this.redisService.get(key)

			if (data) {
				return JSON.parse(data)
			}

			return null
		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get agent ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 检查智能体权限
	 */
	private checkAgentPermissions(
		agent: AgentConfig,
		params: {
			allowedGroups?: string[]
			allowedUsers?: string[]
			excludeUserId?: string
		},
	): boolean {
		// 排除指定用户的智能体
		if (params.excludeUserId && agent.userId === params.excludeUserId) {
			return false
		}

		// 检查群组权限
		if (params.allowedGroups?.length && agent.allowedGroups?.length) {
			const hasGroupPermission = agent.allowedGroups.some((group) => params.allowedGroups!.includes(group))
			if (!hasGroupPermission) {
				return false
			}
		}

		// 检查用户权限
		if (params.allowedUsers?.length && agent.allowedUsers?.length) {
			const hasUserPermission = agent.allowedUsers.some((user) => params.allowedUsers!.includes(user))
			if (!hasUserPermission) {
				return false
			}
		}

		return true
	}
}
