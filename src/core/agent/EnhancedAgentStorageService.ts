import * as vscode from "vscode"
import { AgentConfig, AgentTodo, AgentListOptions, AgentExportData } from "@roo-code/types"
import { AgentStorageService } from "./AgentStorageService"
import { VSCodeAgentStorageService } from "./VSCodeAgentStorageService"
import { AgentRedisSyncService } from "./AgentRedisSyncService"
import { logger } from "../../utils/logging"

/**
 * 增强的智能体存储服务
 * 集成本地VSCode存储和Redis云端同步功能
 */
export class EnhancedAgentStorageService implements AgentStorageService {
	constructor(
		private baseStorageService: VSCodeAgentStorageService,
		private syncService: AgentRedisSyncService
	) {}

	async createAgent(userId: string, config: Omit<AgentConfig, "id" | "createdAt" | "updatedAt">): Promise<AgentConfig> {
		try {
			// 1. 本地创建
			const agent = await this.baseStorageService.createAgent(userId, config)

			// 2. 异步同步到Redis
			this.syncService.syncSingleAgent(agent).catch(error =>
				logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
			)

			// 3. 触发事件通知
			this.emitAgentEvent("created", agent)

			return agent
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to create agent:", error)
			throw error
		}
	}

	async getAgent(userId: string, agentId: string): Promise<AgentConfig | null> {
		try {
			return await this.baseStorageService.getAgent(userId, agentId)
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to get agent ${agentId}:`, error)
			return null
		}
	}

	async updateAgent(userId: string, agentId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
		try {
			// 1. 本地更新
			const agent = await this.baseStorageService.updateAgent(userId, agentId, updates)

			// 2. 异步同步到Redis
			this.syncService.syncSingleAgent(agent).catch(error =>
				logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
			)

			// 3. 触发事件通知
			this.emitAgentEvent("updated", agent)

			return agent
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to update agent ${agentId}:`, error)
			throw error
		}
	}

	async deleteAgent(userId: string, agentId: string): Promise<boolean> {
		try {
			// 1. 本地删除
			const result = await this.baseStorageService.deleteAgent(userId, agentId)

			if (result) {
				// 2. 从Redis删除
				this.syncService.deleteAgentFromRedis(agentId, userId).catch(error =>
					logger.debug("[EnhancedAgentStorageService] Redis delete failed:", error)
				)

				// 3. 触发事件通知
				this.emitAgentEvent("deleted", { id: agentId, userId })
			}

			return result
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to delete agent ${agentId}:`, error)
			return false
		}
	}

	async listUserAgents(userId: string, options?: AgentListOptions): Promise<AgentConfig[]> {
		try {
			// 优先本地数据
			let agents = await this.baseStorageService.listUserAgents(userId, options)

			// 如果本地为空且网络可用，尝试从Redis恢复
			if (agents.length === 0) {
				try {
					const isRedisAvailable = await this.syncService.isRedisAvailable()
					if (isRedisAvailable) {
						const redisAgents = await this.syncService.loadUserAgentsFromRedis(userId)
						if (redisAgents.length > 0) {
							// 批量恢复到本地
							await this.restoreAgentsToLocal(userId, redisAgents)
							// 重新查询本地数据（应用过滤和排序）
							agents = await this.baseStorageService.listUserAgents(userId, options)
						}
					}
				} catch (error) {
					logger.debug("[EnhancedAgentStorageService] Redis restore failed:", error)
				}
			}

			return agents
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to list agents for user ${userId}:`, error)
			return []
		}
	}

	async searchAgents(userId: string, query: string): Promise<AgentConfig[]> {
		try {
			return await this.baseStorageService.searchAgents(userId, query)
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to search agents for user ${userId}:`, error)
			return []
		}
	}

	async addTodo(
		userId: string,
		agentId: string,
		todo: Omit<AgentTodo, "id" | "createdAt" | "updatedAt">
	): Promise<AgentTodo> {
		try {
			// 1. 本地添加
			const newTodo = await this.baseStorageService.addTodo(userId, agentId, todo)

			// 2. 获取更新后的智能体并同步
			const updatedAgent = await this.baseStorageService.getAgent(userId, agentId)
			if (updatedAgent) {
				this.syncService.syncSingleAgent(updatedAgent).catch(error =>
					logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
				)
			}

			return newTodo
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to add todo to agent ${agentId}:`, error)
			throw error
		}
	}

	async updateTodo(
		userId: string,
		agentId: string,
		todoId: string,
		updates: Partial<AgentTodo>
	): Promise<AgentTodo> {
		try {
			// 1. 本地更新
			const updatedTodo = await this.baseStorageService.updateTodo(userId, agentId, todoId, updates)

			// 2. 获取更新后的智能体并同步
			const updatedAgent = await this.baseStorageService.getAgent(userId, agentId)
			if (updatedAgent) {
				this.syncService.syncSingleAgent(updatedAgent).catch(error =>
					logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
				)
			}

			return updatedTodo
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to update todo ${todoId}:`, error)
			throw error
		}
	}

	async deleteTodo(userId: string, agentId: string, todoId: string): Promise<boolean> {
		try {
			// 1. 本地删除
			const result = await this.baseStorageService.deleteTodo(userId, agentId, todoId)

			if (result) {
				// 2. 获取更新后的智能体并同步
				const updatedAgent = await this.baseStorageService.getAgent(userId, agentId)
				if (updatedAgent) {
					this.syncService.syncSingleAgent(updatedAgent).catch(error =>
						logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
					)
				}
			}

			return result
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to delete todo ${todoId}:`, error)
			return false
		}
	}

	async exportAgent(userId: string, agentId: string): Promise<AgentExportData> {
		try {
			return await this.baseStorageService.exportAgent(userId, agentId)
		} catch (error) {
			logger.error(`[EnhancedAgentStorageService] Failed to export agent ${agentId}:`, error)
			throw error
		}
	}

	async importAgent(userId: string, data: AgentExportData): Promise<AgentConfig> {
		try {
			// 1. 本地导入
			const agent = await this.baseStorageService.importAgent(userId, data)

			// 2. 异步同步到Redis
			this.syncService.syncSingleAgent(agent).catch(error =>
				logger.debug("[EnhancedAgentStorageService] Sync failed:", error)
			)

			// 3. 触发事件通知
			this.emitAgentEvent("imported", agent)

			return agent
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to import agent:", error)
			throw error
		}
	}

	/**
	 * 手动触发全量同步到Redis
	 */
	async forceSyncToRedis(userId: string): Promise<void> {
		try {
			const agents = await this.baseStorageService.listUserAgents(userId)
			await this.syncService.forceSyncUserAgents(userId, agents)
			logger.info(`[EnhancedAgentStorageService] Force synced ${agents.length} agents to Redis`)
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to force sync to Redis:", error)
			throw error
		}
	}

	/**
	 * 从Redis恢复所有智能体到本地
	 */
	async restoreFromRedis(userId: string): Promise<number> {
		try {
			const redisAgents = await this.syncService.loadUserAgentsFromRedis(userId)
			await this.restoreAgentsToLocal(userId, redisAgents)
			logger.info(`[EnhancedAgentStorageService] Restored ${redisAgents.length} agents from Redis`)
			return redisAgents.length
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to restore from Redis:", error)
			throw error
		}
	}

	/**
	 * 检查数据一致性
	 */
	async checkDataConsistency(userId: string): Promise<{
		localCount: number
		redisCount: number
		consistent: boolean
	}> {
		try {
			const localAgents = await this.baseStorageService.listUserAgents(userId)
			const redisAgents = await this.syncService.loadUserAgentsFromRedis(userId)

			const consistent = localAgents.length === redisAgents.length

			return {
				localCount: localAgents.length,
				redisCount: redisAgents.length,
				consistent,
			}
		} catch (error) {
			logger.error("[EnhancedAgentStorageService] Failed to check data consistency:", error)
			return {
				localCount: 0,
				redisCount: 0,
				consistent: false,
			}
		}
	}

	/**
	 * 从Redis恢复智能体到本地存储
	 */
	private async restoreAgentsToLocal(userId: string, agents: AgentConfig[]): Promise<void> {
		for (const agent of agents) {
			try {
				const existing = await this.baseStorageService.getAgent(userId, agent.id)
				if (!existing) {
					// 本地不存在，直接创建
					await this.baseStorageService.createAgent(userId, agent)
				} else if (existing.updatedAt < agent.updatedAt) {
					// 本地数据较旧，更新
					await this.baseStorageService.updateAgent(userId, agent.id, agent)
				}
				// 如果本地数据较新，保持不变
			} catch (error) {
				logger.error(`[EnhancedAgentStorageService] Failed to restore agent ${agent.id}:`, error)
			}
		}
		logger.info(`[EnhancedAgentStorageService] Restored ${agents.length} agents from Redis`)
	}

	/**
	 * 触发智能体事件
	 */
	private emitAgentEvent(event: string, data: any): void {
		try {
			// 触发VSCode命令事件，供其他模块监听
			Promise.resolve(vscode.commands.executeCommand("roo-cline.agentEvent", { event, data })).catch((error: any) =>
				logger.debug("[EnhancedAgentStorageService] Failed to emit event:", error)
			)
		} catch (error) {
			logger.debug("[EnhancedAgentStorageService] Failed to emit event:", error)
		}
	}

	/**
	 * 设置当前用户ID（用于Redis同步）
	 */
	setCurrentUserId(userId: string): void {
		this.syncService.setCurrentUserId(userId)
	}

	/**
	 * 获取底层存储服务（供测试或特殊需求使用）
	 */
	getBaseStorageService(): VSCodeAgentStorageService {
		return this.baseStorageService
	}

	/**
	 * 获取同步服务（供测试或特殊需求使用）
	 */
	getSyncService(): AgentRedisSyncService {
		return this.syncService
	}
}