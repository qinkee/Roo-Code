import { logger } from "../../utils/logging"
import {
	UnifiedAgentRegistry as UnifiedAgentRegistryType,
	AgentDiscoveryQuery,
	AgentDiscoveryResult,
	AgentEndpoint,
} from "@roo-code/types"
import { AgentRedisAdapter } from "./AgentRedisAdapter"

/**
 * 统一智能体注册中心
 * 基于Redis的智能体发现和管理服务
 */
export class UnifiedAgentRegistry {
	private static instance: UnifiedAgentRegistry | null = null
	private redisAdapter: AgentRedisAdapter

	private constructor() {
		this.redisAdapter = new AgentRedisAdapter()
	}

	static getInstance(): UnifiedAgentRegistry {
		if (!UnifiedAgentRegistry.instance) {
			UnifiedAgentRegistry.instance = new UnifiedAgentRegistry()
		}
		return UnifiedAgentRegistry.instance
	}

	/**
	 * 注册智能体到注册中心
	 */
	async registerAgent(registry: UnifiedAgentRegistryType): Promise<void> {
		if (!this.redisAdapter.isEnabled()) {
			logger.warn(`[UnifiedAgentRegistry] Redis not available, skipping registration for ${registry.agentId}`)
			return
		}

		try {
			// 使用RedisSyncService的同步功能，包含 publishInfo 相关字段
			await this.redisAdapter.syncAgentToRegistry({
				id: registry.agentId,
				userId: registry.userId,
				name: registry.name,
				avatar: registry.avatar,
				roleDescription: registry.description,
				apiConfigId: "default",
				mode: "assistant",
				tools: registry.capabilities.tools.map((toolId) => ({ toolId, enabled: true })),
				todos: [],
				isPrivate: registry.sharing.isPrivate,
				shareScope: registry.sharing.shareScope,
				shareLevel: registry.sharing.shareLevel,
				permissions: registry.sharing.permissions,
				allowedUsers: registry.sharing.allowedUsers,
				allowedGroups: registry.sharing.allowedGroups,
				deniedUsers: registry.sharing.deniedUsers,
				createdAt: registry.metadata.createdAt,
				updatedAt: registry.metadata.updatedAt,
				isActive: registry.status.state === "online",
				version: registry.metadata.version,

				// 🔑 关键优化：同步 publishInfo 相关字段到 Redis
				isPublished: registry.status.state === "online",
				publishInfo: {
					serviceStatus: registry.status.state as "online" | "offline" | "error",
					lastHeartbeat: registry.status.lastSeen,
					serverUrl: registry.deployment.directUrl,
					publishedAt: new Date().toISOString(),
					terminalType: "local" as const,
				},
				serviceEndpoint: registry.deployment.directUrl,
				serviceStatus: registry.status.state as "online" | "offline" | "error",
				lastHeartbeat: registry.status.lastSeen,
				deployment: registry.deployment,
				capabilities: {
					messageTypes: ["text", "json"],
					taskTypes: ["execute", "query"],
					dataFormats: ["text", "json"],
					maxConcurrency: 5,
				},
			})

			logger.info(`[UnifiedAgentRegistry] Registered agent ${registry.agentId}`)
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Failed to register agent ${registry.agentId}:`, error)
			throw error
		}
	}

	/**
	 * 注销智能体
	 */
	async unregisterAgent(agentId: string, userId: string): Promise<void> {
		if (!this.redisAdapter.isEnabled()) {
			return
		}

		try {
			await this.redisAdapter.removeAgentFromRegistry(userId, agentId)
			logger.info(`[UnifiedAgentRegistry] Unregistered agent ${agentId}`)
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Failed to unregister agent ${agentId}:`, error)
			throw error
		}
	}

	/**
	 * 发现智能体
	 */
	async discoverAgents(query: AgentDiscoveryQuery): Promise<AgentDiscoveryResult[]> {
		if (!this.redisAdapter.isEnabled()) {
			logger.warn(`[UnifiedAgentRegistry] Redis not available, returning empty results`)
			return []
		}

		try {
			const results = await this.searchAgents(query)
			const filtered = await this.filterByPermissions(results, query.userId)
			const sorted = this.sortResults(filtered, query.sortBy, query.sortOrder)
			const paginated = this.paginate(sorted, query.offset, query.limit)

			return paginated
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Failed to discover agents:`, error)
			return []
		}
	}

	/**
	 * 搜索智能体
	 */
	private async searchAgents(query: AgentDiscoveryQuery): Promise<AgentDiscoveryResult[]> {
		const results: AgentDiscoveryResult[] = []

		try {
			// 获取在线智能体
			const onlineAgents = await this.redisAdapter.getOnlineAgents()

			// 获取共享智能体
			const sharedAgents = await this.getSharedAgents(query)

			// 合并结果
			const allAgents = new Set([...onlineAgents, ...sharedAgents])

			for (const agentId of allAgents) {
				const agentInfo = await this.getAgentDiscoveryInfo(agentId)
				if (agentInfo && this.matchesQuery(agentInfo, query)) {
					results.push(agentInfo)
				}
			}
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Search error:`, error)
		}

		return results
	}

	/**
	 * 获取共享智能体
	 */
	private async getSharedAgents(query: AgentDiscoveryQuery): Promise<string[]> {
		// 这里应该实现Redis查询逻辑
		// 当前返回空数组作为占位符
		return []
	}

	/**
	 * 获取智能体发现信息
	 */
	private async getAgentDiscoveryInfo(agentId: string): Promise<AgentDiscoveryResult | null> {
		// 这里应该从Redis获取智能体详细信息并转换为AgentDiscoveryResult
		// 当前返回null作为占位符
		return null
	}

	/**
	 * 检查智能体是否匹配查询条件
	 */
	private matchesQuery(agent: AgentDiscoveryResult, query: AgentDiscoveryQuery): boolean {
		// 检查能力匹配
		if (query.capabilities && query.capabilities.length > 0) {
			const hasMatchingCapability = query.capabilities.some((cap) => agent.matchedCapabilities.includes(cap))
			if (!hasMatchingCapability) {
				return false
			}
		}

		// 检查分类匹配
		if (query.categories && query.categories.length > 0) {
			if (!agent.category || !query.categories.includes(agent.category)) {
				return false
			}
		}

		// 检查标签匹配
		if (query.tags && query.tags.length > 0) {
			const hasMatchingTag = query.tags.some((tag) => agent.tags.includes(tag))
			if (!hasMatchingTag) {
				return false
			}
		}

		// 检查部署类型
		if (query.deploymentTypes && query.deploymentTypes.length > 0) {
			if (!query.deploymentTypes.includes(agent.deploymentType)) {
				return false
			}
		}

		// 检查只显示在线
		if (query.onlyOnline && agent.currentLoad === 0) {
			return false
		}

		// 检查可见性
		if (query.visibility && query.visibility !== "all") {
			if (query.visibility === "private" && !agent.isPrivate) {
				return false
			}
			if (query.visibility === "public" && agent.isPrivate) {
				return false
			}
		}

		// 关键词搜索
		if (query.keywords) {
			const keywords = query.keywords.toLowerCase()
			const searchableText = [agent.name, agent.description, ...agent.tags, agent.category || ""]
				.join(" ")
				.toLowerCase()

			if (!searchableText.includes(keywords)) {
				return false
			}
		}

		return true
	}

	/**
	 * 权限过滤
	 */
	private async filterByPermissions(agents: AgentDiscoveryResult[], userId: string): Promise<AgentDiscoveryResult[]> {
		const filtered: AgentDiscoveryResult[] = []

		for (const agent of agents) {
			// 检查访问权限
			const hasAccess = await this.checkAgentAccess(userId, agent.agentId)
			if (hasAccess) {
				agent.hasAccess = true
				filtered.push(agent)
			}
		}

		return filtered
	}

	/**
	 * 检查智能体访问权限
	 */
	private async checkAgentAccess(userId: string, agentId: string): Promise<boolean> {
		// 这里应该实现详细的权限检查逻辑
		// 当前简化实现
		return true
	}

	/**
	 * 排序结果
	 */
	private sortResults(agents: AgentDiscoveryResult[], sortBy?: string, sortOrder?: string): AgentDiscoveryResult[] {
		if (!sortBy) {
			return agents
		}

		const sorted = [...agents].sort((a, b) => {
			let aVal: any
			let bVal: any

			switch (sortBy) {
				case "relevance":
					aVal = a.relevanceScore
					bVal = b.relevanceScore
					break
				case "performance":
					aVal = a.avgResponseTime
					bVal = b.avgResponseTime
					break
				case "popularity":
					aVal = a.totalCalls
					bVal = b.totalCalls
					break
				case "rating":
					aVal = a.rating || 0
					bVal = b.rating || 0
					break
				default:
					return 0
			}

			if (typeof aVal === "number" && typeof bVal === "number") {
				return sortOrder === "desc" ? bVal - aVal : aVal - bVal
			}

			return 0
		})

		return sorted
	}

	/**
	 * 分页处理
	 */
	private paginate(agents: AgentDiscoveryResult[], offset?: number, limit?: number): AgentDiscoveryResult[] {
		if (!offset && !limit) {
			return agents
		}

		const start = offset || 0
		const end = limit ? start + limit : undefined

		return agents.slice(start, end)
	}

	/**
	 * 智能推荐
	 */
	async recommendAgents(userId: string, context: RecommendationContext): Promise<AgentRecommendation[]> {
		if (!this.redisAdapter.isEnabled()) {
			return []
		}

		try {
			// 获取用户历史使用记录
			const userHistory = await this.getUserUsageHistory(userId)

			// 分析用户偏好
			const preferences = this.analyzeUserPreferences(userHistory)

			// 基于内容的推荐
			const recommendations = await this.contentBasedRecommendation(context, preferences)

			return recommendations.slice(0, 10) // 返回前10个推荐
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Failed to get recommendations:`, error)
			return []
		}
	}

	/**
	 * 获取用户使用历史
	 */
	private async getUserUsageHistory(userId: string): Promise<UsageRecord[]> {
		// TODO: 从Redis获取用户使用历史
		return []
	}

	/**
	 * 分析用户偏好
	 */
	private analyzeUserPreferences(history: UsageRecord[]): UserPreferences {
		// TODO: 实现偏好分析算法
		return {
			preferredCapabilities: [],
			preferredCategories: [],
			avgUsageTime: 0,
			preferredPerformance: "balanced",
		}
	}

	/**
	 * 基于内容的推荐
	 */
	private async contentBasedRecommendation(
		context: RecommendationContext,
		preferences: UserPreferences,
	): Promise<AgentRecommendation[]> {
		// TODO: 实现基于内容的推荐算法
		return []
	}

	/**
	 * 获取智能体统计信息
	 */
	async getRegistryStats(): Promise<RegistryStats> {
		if (!this.redisAdapter.isEnabled()) {
			return {
				totalAgents: 0,
				onlineAgents: 0,
				privateAgents: 0,
				sharedAgents: 0,
				categories: {},
				regions: {},
			}
		}

		try {
			const onlineAgents = await this.redisAdapter.getOnlineAgents()

			// TODO: 从Redis获取其他统计信息

			return {
				totalAgents: 0, // TODO: 实际统计
				onlineAgents: onlineAgents.length,
				privateAgents: 0, // TODO: 实际统计
				sharedAgents: 0, // TODO: 实际统计
				categories: {}, // TODO: 实际统计
				regions: {}, // TODO: 实际统计
			}
		} catch (error) {
			logger.error(`[UnifiedAgentRegistry] Failed to get registry stats:`, error)
			return {
				totalAgents: 0,
				onlineAgents: 0,
				privateAgents: 0,
				sharedAgents: 0,
				categories: {},
				regions: {},
			}
		}
	}
}

// 接口定义
export interface RecommendationContext {
	currentTask?: string
	requiredCapabilities?: string[]
	performanceRequirements?: {
		maxResponseTime?: number
		minAvailability?: number
	}
	userContext?: {
		role?: string
		experience?: string
		workload?: string
	}
}

export interface AgentRecommendation {
	agentId: string
	score: number
	reason: string
	confidence: number
	agent: AgentDiscoveryResult
}

export interface UsageRecord {
	agentId: string
	timestamp: number
	duration: number
	success: boolean
	capabilities: string[]
}

export interface UserPreferences {
	preferredCapabilities: string[]
	preferredCategories: string[]
	avgUsageTime: number
	preferredPerformance: "fast" | "balanced" | "quality"
}

export interface RegistryStats {
	totalAgents: number
	onlineAgents: number
	privateAgents: number
	sharedAgents: number
	categories: Record<string, number>
	regions: Record<string, number>
}
