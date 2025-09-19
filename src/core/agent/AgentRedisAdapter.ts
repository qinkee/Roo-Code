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
			const key = `roo:${agent.userId}:agents:${agent.id}`
			
			// 调试：打印收到的agent数据
			logger.info(`[AgentRedisAdapter] Syncing agent to Redis:`, {
				agentId: agent.id,
				hasServiceEndpoint: !!agent.serviceEndpoint,
				serviceEndpoint: agent.serviceEndpoint,
				servicePort: agent.servicePort,
				serviceStatus: agent.serviceStatus,
				terminalType: agent.terminalType,
				isPublished: agent.isPublished,
				agentKeys: Object.keys(agent)
			})
			
			// 保存完整的智能体信息，包括服务注册相关字段
			const agentData = {
				// 基础智能体信息
				id: agent.id,
				userId: agent.userId,
				name: agent.name,
				avatar: agent.avatar,
				roleDescription: agent.roleDescription,
				apiConfigId: agent.apiConfigId,
				mode: agent.mode,
				tools: agent.tools,
				isPrivate: agent.isPrivate ?? true,
				shareScope: agent.shareScope || 'none',
				shareLevel: agent.shareLevel || 0,
				permissions: agent.permissions || [],
				allowedUsers: agent.allowedUsers || [],
				allowedGroups: agent.allowedGroups || [],
				deniedUsers: agent.deniedUsers || [],
				createdAt: agent.createdAt,
				updatedAt: agent.updatedAt,
				lastUsedAt: agent.lastUsedAt,
				isActive: agent.isActive ?? true,
				version: agent.version || 1,
				
				// 服务注册相关字段（如果存在）
				...(agent.serviceEndpoint && {
					serviceEndpoint: agent.serviceEndpoint,
					servicePort: agent.servicePort,
					serviceStatus: agent.serviceStatus,
					publishedAt: agent.publishedAt,
					terminalType: agent.terminalType,
					a2aCard: agent.a2aCard,
					capabilities: agent.capabilities,
					deployment: agent.deployment,
					isPublished: agent.isPublished,
					lastHeartbeat: agent.lastHeartbeat
				})
			}
			
			// 调试：打印将要保存的数据
			logger.info(`[AgentRedisAdapter] Data to be saved:`, {
				agentId: agent.id,
				hasServiceFields: !!agentData.serviceEndpoint,
				dataKeys: Object.keys(agentData)
			})
			
			await this.redisService.set(key, agentData)

			// 同时添加到在线智能体列表
			if (agent.isActive) {
				const onlineKey = `roo:online_agents`
				const onlineAgents = await this.getOnlineAgents()
				if (!onlineAgents.includes(agent.id)) {
					onlineAgents.push(agent.id)
					await this.redisService.set(onlineKey, onlineAgents)
				}
			}

			logger.debug(`[AgentRedisAdapter] Synced agent ${agent.id} to Redis`)

		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to sync agent ${agent.id}:`, error)
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
			const filtered = onlineAgents.filter(id => id !== agentId)
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

			return data as AgentConfig

		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to get agent ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 获取用户的所有智能体
	 */
	async getUserAgentsFromRegistry(userId: string): Promise<AgentConfig[]> {
		try {
			// 由于现有Redis服务没有模式匹配查询，这里返回空数组
			// 在实际使用中，建议维护一个用户智能体列表的索引
			logger.debug(`[AgentRedisAdapter] getUserAgentsFromRegistry not fully implemented for Redis`)
			return []

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
		this.redisService.startHealthCheck()
		logger.info(`[AgentRedisAdapter] Initialized with existing Redis service`)
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
				await this.redisService.set(onlineKey, onlineAgents)
			} else if (!isOnline && onlineAgents.includes(agentId)) {
				const filtered = onlineAgents.filter(id => id !== agentId)
				await this.redisService.set(onlineKey, filtered)
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
			const syncPromises = agents.map(agent => this.syncAgentToRegistry(agent))
			await Promise.all(syncPromises)
			
			logger.info(`[AgentRedisAdapter] Batch synced ${agents.length} agents`)

		} catch (error) {
			logger.error(`[AgentRedisAdapter] Failed to batch sync agents:`, error)
			throw error
		}
	}
}