import { VSCodeAgentStorageService } from "./VSCodeAgentStorageService"
import { AgentRedisAdapter } from "./AgentRedisAdapter"
import { AgentConfig } from "@roo-code/types"
import { logger } from "../../utils/logging"

/**
 * 智能体同步管理器 - 负责本地和Redis之间的数据同步
 *
 * 核心原则:
 * - KISS: 只用时间戳 updatedAt 判断新旧
 * - 稳定: 只在登录时主动同步，不搞实时推送和轮询
 * - 数据一致性: 后写入的覆盖先写入的 (Last-Write-Wins)
 */
export class AgentSyncManager {
	constructor(
		private localStorage: VSCodeAgentStorageService,
		private redisAdapter: AgentRedisAdapter,
	) {}

	/**
	 * 用户登录时执行一次性同步
	 *
	 * 同步逻辑:
	 * 1. 获取本地和Redis的智能体列表
	 * 2. Redis有但本地没有 → 下载到本地
	 * 3. 本地有但Redis没有 → 上传到Redis
	 * 4. 都存在 → 比对updatedAt，谁新用谁
	 */
	async syncOnLogin(userId: string): Promise<void> {
		console.log(`[AgentSyncManager] 🚀 syncOnLogin method ENTERED for user ${userId}`)
		try {
			console.log(`[AgentSyncManager] 🔄 Starting sync for user ${userId}`)
			console.log(`[AgentSyncManager] 🔍 localStorage exists:`, !!this.localStorage)
			console.log(`[AgentSyncManager] 🔍 redisAdapter exists:`, !!this.redisAdapter)

			// 1. 获取本地和Redis的智能体列表
			console.log(`[AgentSyncManager] 📥 Fetching local agents...`)
			const localAgents = await this.localStorage.listUserAgents(userId)
			console.log(`[AgentSyncManager] 📥 Fetching Redis agent IDs...`)
			const redisAgentIds = await this.redisAdapter.getUserAgentIds(userId)

			console.log(
				`[AgentSyncManager] 📊 Local: ${localAgents.length} agents, Redis: ${redisAgentIds.length} agents`,
			)

			// 2. 构建本地智能体映射
			const localMap = new Map(localAgents.map((a) => [a.id, a]))
			const syncedIds = new Set<string>()

			// 3. 处理Redis中的智能体
			console.log(`[AgentSyncManager] 🔍 Redis agent IDs:`, redisAgentIds)

			for (const redisId of redisAgentIds) {
				console.log(`[AgentSyncManager] 🔍 Processing Redis agent: ${redisId}`)
				const local = localMap.get(redisId)
				console.log(`[AgentSyncManager] 🔍 Local agent exists:`, !!local)

				const redis = await this.redisAdapter.getAgentFromRegistry(userId, redisId)
				console.log(`[AgentSyncManager] 🔍 Redis agent data:`, redis ? `Found: ${redis.name}` : 'NOT FOUND')

				if (!redis) {
					console.log(`[AgentSyncManager] ⚠️ Agent ${redisId} not found in Redis, skipping`)
					continue
				}

				if (!local) {
					// 场景1: Redis有，本地没有 → 下载到本地
					await this.downloadAgent(userId, redis)
					logger.info(`[AgentSyncManager] ⬇️ Downloaded agent ${redis.name} (${redisId}) from Redis`)
				} else if (redis.updatedAt > local.updatedAt) {
					// 场景2: 都存在，Redis更新 → 覆盖本地
					await this.updateLocalAgent(userId, redis)
					logger.info(
						`[AgentSyncManager] 🔄 Updated local agent ${local.name} (${redisId}) from Redis (Redis: ${new Date(redis.updatedAt).toISOString()}, Local: ${new Date(local.updatedAt).toISOString()})`,
					)
				} else if (local.updatedAt > redis.updatedAt) {
					// 场景3: 都存在，本地更新 → 上传到Redis
					await this.redisAdapter.syncAgentToRegistry(local)
					logger.info(
						`[AgentSyncManager] ⬆️ Uploaded local agent ${local.name} (${redisId}) to Redis (Local: ${new Date(local.updatedAt).toISOString()}, Redis: ${new Date(redis.updatedAt).toISOString()})`,
					)
				} else {
					// 场景4: updatedAt相同 → 不处理
					logger.debug(`[AgentSyncManager] ✓ Agent ${local.name} (${redisId}) is in sync`)
				}

				syncedIds.add(redisId)
			}

			// 4. 处理本地独有的智能体 (上传到Redis)
			for (const local of localAgents) {
				if (!syncedIds.has(local.id)) {
					await this.redisAdapter.syncAgentToRegistry(local)
					logger.info(`[AgentSyncManager] ⬆️ Uploaded new local agent ${local.name} (${local.id}) to Redis`)
				}
			}

			logger.info(`[AgentSyncManager] ✅ Sync completed for user ${userId}`)
		} catch (error) {
			logger.error(`[AgentSyncManager] ❌ Sync failed for user ${userId}:`, error)
			// 同步失败不影响正常使用，只记录日志
		}
	}

	/**
	 * 从Redis下载智能体到本地
	 *
	 * 注意: 使用私有方法访问 VSCodeAgentStorageService 的内部方法
	 */
	private async downloadAgent(userId: string, agent: AgentConfig): Promise<void> {
		try {
			// 直接保存到本地，使用Redis中的ID和时间戳
			const agents = await (this.localStorage as any).getUserAgents(userId)
			agents[agent.id] = agent
			await (this.localStorage as any).setUserAgents(userId, agents)

			logger.debug(`[AgentSyncManager] 💾 Downloaded agent ${agent.id} to local storage`)
		} catch (error) {
			logger.error(`[AgentSyncManager] ❌ Failed to download agent ${agent.id}:`, error)
		}
	}

	/**
	 * 用Redis数据更新本地智能体
	 */
	private async updateLocalAgent(userId: string, agent: AgentConfig): Promise<void> {
		try {
			const agents = await (this.localStorage as any).getUserAgents(userId)
			agents[agent.id] = agent
			await (this.localStorage as any).setUserAgents(userId, agents)

			logger.debug(`[AgentSyncManager] 💾 Updated local agent ${agent.id} from Redis`)
		} catch (error) {
			logger.error(`[AgentSyncManager] ❌ Failed to update local agent ${agent.id}:`, error)
		}
	}
}
