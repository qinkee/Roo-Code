import * as vscode from "vscode"
import { AgentConfig, AgentTodo, AgentListOptions, AgentExportData, A2AAgentCard } from "@roo-code/types"
import { AgentStorageService } from "./AgentStorageService"
import { logger } from "../../utils/logging"

/**
 * VSCode本地存储实现的智能体存储服务
 * 使用VSCode的GlobalState API进行数据持久化
 */
export class VSCodeAgentStorageService implements AgentStorageService {
	private static readonly USER_AGENTS_PREFIX = "userAgents:"

	constructor(private context: vscode.ExtensionContext) {}

	/**
	 * 获取用户智能体存储key
	 */
	private getUserAgentsKey(userId: string): string {
		return `${VSCodeAgentStorageService.USER_AGENTS_PREFIX}${userId}`
	}

	/**
	 * 获取用户的所有智能体
	 */
	private async getUserAgents(userId: string): Promise<Record<string, AgentConfig>> {
		const key = this.getUserAgentsKey(userId)
		const agents = (await this.context.globalState.get(key, {})) as Record<string, AgentConfig>
		
		// 向后兼容性：为旧的智能体添加默认的新字段
		Object.values(agents).forEach(agent => {
			this.migrateAgentConfig(agent)
		})
		
		return agents
	}

	/**
	 * 迁移智能体配置以支持新字段（向后兼容性）
	 */
	private migrateAgentConfig(agent: AgentConfig): void {
		// 为旧的智能体添加新的字段默认值
		if (agent.isPrivate === undefined) {
			agent.isPrivate = true
		}
		if (agent.shareLevel === undefined) {
			agent.shareLevel = 0
		}
		if (!agent.permissions) {
			agent.permissions = []
		}
		if (!agent.allowedUsers) {
			agent.allowedUsers = []
		}
		if (!agent.allowedGroups) {
			agent.allowedGroups = []
		}
		if (!agent.deniedUsers) {
			agent.deniedUsers = []
		}
	}

	/**
	 * 保存用户的所有智能体
	 */
	private async setUserAgents(userId: string, agents: Record<string, AgentConfig>): Promise<void> {
		const key = this.getUserAgentsKey(userId)
		await this.context.globalState.update(key, agents)
	}

	/**
	 * 生成唯一的智能体ID
	 */
	private generateAgentId(): string {
		const timestamp = Date.now()
		const random = Math.random().toString(36).substr(2, 9)
		return `agent_${timestamp}_${random}`
	}

	/**
	 * 生成唯一的Todo ID
	 */
	private generateTodoId(): string {
		const timestamp = Date.now()
		const random = Math.random().toString(36).substr(2, 9)
		return `todo_${timestamp}_${random}`
	}

	async createAgent(userId: string, config: Omit<AgentConfig, "id" | "createdAt" | "updatedAt">): Promise<AgentConfig> {
		try {
			const now = Date.now()
			const agent: AgentConfig = {
				...config,
				id: this.generateAgentId(),
				userId,
				createdAt: now,
				updatedAt: now,
			}

			const agents = await this.getUserAgents(userId)
			agents[agent.id] = agent
			await this.setUserAgents(userId, agents)

			logger.info(`[VSCodeAgentStorageService] Created agent ${agent.id} for user ${userId}`)
			return agent
		} catch (error) {
			logger.error("[VSCodeAgentStorageService] Failed to create agent:", error)
			throw new Error(`Failed to create agent: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async getAgent(userId: string, agentId: string): Promise<AgentConfig | null> {
		try {
			const agents = await this.getUserAgents(userId)
			const agent = agents[agentId]
			
			if (agent && agent.userId === userId) {
				return agent
			}
			return null
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to get agent ${agentId}:`, error)
			return null
		}
	}

	async updateAgent(userId: string, agentId: string, updates: Partial<AgentConfig>): Promise<AgentConfig> {
		try {
			const agents = await this.getUserAgents(userId)
			const existing = agents[agentId]

			if (!existing || existing.userId !== userId) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			const updated: AgentConfig = {
				...existing,
				...updates,
				id: agentId, // 确保ID不被覆盖
				userId, // 确保用户ID不被覆盖
				updatedAt: Date.now(),
			}

			agents[agentId] = updated
			await this.setUserAgents(userId, agents)

			logger.info(`[VSCodeAgentStorageService] Updated agent ${agentId} for user ${userId}`)
			return updated
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to update agent ${agentId}:`, error)
			throw new Error(`Failed to update agent: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async deleteAgent(userId: string, agentId: string): Promise<boolean> {
		try {
			const agents = await this.getUserAgents(userId)

			if (!agents[agentId] || agents[agentId].userId !== userId) {
				return false
			}

			delete agents[agentId]
			await this.setUserAgents(userId, agents)

			logger.info(`[VSCodeAgentStorageService] Deleted agent ${agentId} for user ${userId}`)
			return true
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to delete agent ${agentId}:`, error)
			return false
		}
	}

	async listUserAgents(userId: string, options?: AgentListOptions): Promise<AgentConfig[]> {
		try {
			const agents = await this.getUserAgents(userId)
			let agentList = Object.values(agents).filter(agent => agent.userId === userId)

			// 应用过滤器
			if (options?.filterByMode) {
				agentList = agentList.filter(agent => agent.mode === options.filterByMode)
			}

			if (options?.onlyActive) {
				agentList = agentList.filter(agent => agent.isActive)
			}

			// 排序
			if (options?.sortBy) {
				agentList.sort((a, b) => {
					const aVal = a[options.sortBy!] as number | string
					const bVal = b[options.sortBy!] as number | string
					
					if (typeof aVal === 'number' && typeof bVal === 'number') {
						return options.sortOrder === 'desc' ? bVal - aVal : aVal - bVal
					} else {
						const aStr = String(aVal || '')
						const bStr = String(bVal || '')
						return options.sortOrder === 'desc' 
							? bStr.localeCompare(aStr) 
							: aStr.localeCompare(bStr)
					}
				})
			} else {
				// 默认按更新时间倒序排列
				agentList.sort((a, b) => b.updatedAt - a.updatedAt)
			}

			// 分页
			if (options?.offset || options?.limit) {
				const start = options.offset || 0
				const end = options.limit ? start + options.limit : undefined
				agentList = agentList.slice(start, end)
			}

			return agentList
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to list agents for user ${userId}:`, error)
			return []
		}
	}

	async searchAgents(userId: string, query: string): Promise<AgentConfig[]> {
		try {
			const agents = await this.listUserAgents(userId)
			const lowercaseQuery = query.toLowerCase()

			return agents.filter(agent => 
				agent.name.toLowerCase().includes(lowercaseQuery) ||
				agent.roleDescription.toLowerCase().includes(lowercaseQuery) ||
				agent.mode.toLowerCase().includes(lowercaseQuery)
			)
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to search agents for user ${userId}:`, error)
			return []
		}
	}

	async addTodo(
		userId: string,
		agentId: string,
		todo: Omit<AgentTodo, "id" | "createdAt" | "updatedAt">
	): Promise<AgentTodo> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			const now = Date.now()
			const newTodo: AgentTodo = {
				...todo,
				id: this.generateTodoId(),
				createdAt: now,
				updatedAt: now,
			}

			const updatedTodos = [...agent.todos, newTodo]
			await this.updateAgent(userId, agentId, { todos: updatedTodos })

			logger.info(`[VSCodeAgentStorageService] Added todo ${newTodo.id} to agent ${agentId}`)
			return newTodo
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to add todo to agent ${agentId}:`, error)
			throw new Error(`Failed to add todo: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async updateTodo(
		userId: string,
		agentId: string,
		todoId: string,
		updates: Partial<AgentTodo>
	): Promise<AgentTodo> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			const todoIndex = agent.todos.findIndex(todo => todo.id === todoId)
			if (todoIndex === -1) {
				throw new Error(`Todo ${todoId} not found in agent ${agentId}`)
			}

			const updatedTodo: AgentTodo = {
				...agent.todos[todoIndex],
				...updates,
				id: todoId, // 确保ID不被覆盖
				updatedAt: Date.now(),
			}

			const updatedTodos = [...agent.todos]
			updatedTodos[todoIndex] = updatedTodo

			await this.updateAgent(userId, agentId, { todos: updatedTodos })

			logger.info(`[VSCodeAgentStorageService] Updated todo ${todoId} in agent ${agentId}`)
			return updatedTodo
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to update todo ${todoId}:`, error)
			throw new Error(`Failed to update todo: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async deleteTodo(userId: string, agentId: string, todoId: string): Promise<boolean> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				return false
			}

			const todoIndex = agent.todos.findIndex(todo => todo.id === todoId)
			if (todoIndex === -1) {
				return false
			}

			const updatedTodos = agent.todos.filter(todo => todo.id !== todoId)
			await this.updateAgent(userId, agentId, { todos: updatedTodos })

			logger.info(`[VSCodeAgentStorageService] Deleted todo ${todoId} from agent ${agentId}`)
			return true
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to delete todo ${todoId}:`, error)
			return false
		}
	}

	async exportAgent(userId: string, agentId: string): Promise<AgentExportData> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			const exportData: AgentExportData = {
				agent,
				metadata: {
					exportedAt: Date.now(),
					exportedBy: userId,
					version: "1.0",
				},
			}

			logger.info(`[VSCodeAgentStorageService] Exported agent ${agentId}`)
			return exportData
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to export agent ${agentId}:`, error)
			throw new Error(`Failed to export agent: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	async importAgent(userId: string, data: AgentExportData): Promise<AgentConfig> {
		try {
			// 验证导入数据
			if (!data.agent || !data.agent.id || !data.agent.name) {
				throw new Error("Invalid export data")
			}

			// 生成新的ID和时间戳以避免冲突
			const importedAgent: AgentConfig = {
				...data.agent,
				id: this.generateAgentId(), // 生成新的ID
				userId, // 设置为当前用户
				createdAt: Date.now(),
				updatedAt: Date.now(),
			}

			const agents = await this.getUserAgents(userId)
			agents[importedAgent.id] = importedAgent
			await this.setUserAgents(userId, agents)

			logger.info(`[VSCodeAgentStorageService] Imported agent as ${importedAgent.id}`)
			return importedAgent
		} catch (error) {
			logger.error("[VSCodeAgentStorageService] Failed to import agent:", error)
			throw new Error(`Failed to import agent: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	/**
	 * 更新智能体的共享配置
	 */
	async updateAgentSharing(
		userId: string, 
		agentId: string, 
		sharing: {
			isPrivate?: boolean
			shareScope?: 'friends' | 'groups' | 'public'
			shareLevel?: number
			allowedUsers?: string[]
			allowedGroups?: string[]
			deniedUsers?: string[]
		}
	): Promise<AgentConfig> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			// 确保只有所有者可以修改共享设置
			if (agent.userId !== userId) {
				throw new Error(`Only the owner can modify sharing settings`)
			}

			const updates: Partial<AgentConfig> = {
				isPrivate: sharing.isPrivate ?? agent.isPrivate,
				shareScope: sharing.shareScope ?? agent.shareScope,
				shareLevel: sharing.shareLevel ?? agent.shareLevel,
				allowedUsers: sharing.allowedUsers ?? agent.allowedUsers,
				allowedGroups: sharing.allowedGroups ?? agent.allowedGroups,
				deniedUsers: sharing.deniedUsers ?? agent.deniedUsers,
			}

			// 如果设置为私有，清除其他共享配置
			if (updates.isPrivate) {
				updates.shareScope = undefined
				updates.shareLevel = 0
				updates.allowedUsers = []
				updates.allowedGroups = []
			}

			return await this.updateAgent(userId, agentId, updates)
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to update agent sharing ${agentId}:`, error)
			throw new Error(`Failed to update agent sharing: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	/**
	 * 更新智能体的A2A配置
	 */
	async updateAgentA2AConfig(
		userId: string, 
		agentId: string, 
		a2aConfig: {
			a2aAgentCard?: A2AAgentCard
			a2aEndpoint?: string
		}
	): Promise<AgentConfig> {
		try {
			const agent = await this.getAgent(userId, agentId)
			if (!agent) {
				throw new Error(`Agent ${agentId} not found for user ${userId}`)
			}

			// 确保只有所有者可以修改A2A配置
			if (agent.userId !== userId) {
				throw new Error(`Only the owner can modify A2A configuration`)
			}

			const updates: Partial<AgentConfig> = {
				a2aAgentCard: a2aConfig.a2aAgentCard ?? agent.a2aAgentCard,
				a2aEndpoint: a2aConfig.a2aEndpoint ?? agent.a2aEndpoint,
			}

			return await this.updateAgent(userId, agentId, updates)
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to update agent A2A config ${agentId}:`, error)
			throw new Error(`Failed to update agent A2A config: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	/**
	 * 搜索可访问的智能体（包括共享的智能体）
	 */
	async searchAccessibleAgents(
		userId: string, 
		query: string, 
		includeShared: boolean = true
	): Promise<AgentConfig[]> {
		try {
			// 首先获取用户自己的智能体
			const userAgents = await this.searchAgents(userId, query)
			
			if (!includeShared) {
				return userAgents
			}

			// TODO: 这里需要实现跨用户的共享智能体搜索
			// 当前阶段只返回用户自己的智能体
			// 后续需要集成Redis注册中心来支持共享智能体发现
			
			logger.debug(`[VSCodeAgentStorageService] Searched ${userAgents.length} accessible agents for user ${userId}`)
			return userAgents
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to search accessible agents for user ${userId}:`, error)
			return []
		}
	}

	/**
	 * 获取智能体的基本信息（用于公开展示）
	 */
	async getAgentPublicInfo(agentId: string): Promise<{
		id: string
		name: string
		description: string
		avatar: string
		isPrivate: boolean
		shareScope?: string
		tags?: string[]
		capabilities?: string[]
	} | null> {
		try {
			// TODO: 这里需要实现从Redis注册中心获取智能体公开信息
			// 当前阶段返回null，后续集成注册中心后实现
			logger.debug(`[VSCodeAgentStorageService] Get public info for agent ${agentId} - not implemented yet`)
			return null
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to get agent public info ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 检查用户是否有权限访问指定智能体
	 */
	async checkAgentAccess(
		userId: string, 
		agentId: string, 
		action: 'read' | 'execute' | 'modify' = 'read'
	): Promise<boolean> {
		try {
			// 首先检查是否是用户自己的智能体
			const agent = await this.getAgent(userId, agentId)
			if (agent) {
				return true // 所有者有所有权限
			}

			// TODO: 这里需要实现共享智能体的权限检查
			// 需要从Redis注册中心获取智能体信息并检查权限
			logger.debug(`[VSCodeAgentStorageService] Check agent access for ${agentId} - shared agent access not implemented yet`)
			return false
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to check agent access ${agentId}:`, error)
			return false
		}
	}

	/**
	 * 批量导出智能体数据
	 */
	async exportAgents(userId: string): Promise<AgentExportData> {
		try {
			const agents = await this.listUserAgents(userId)
			return {
				agent: agents[0] || {} as any,
				metadata: {
					exportedAt: Date.now(),
					exportedBy: userId,
					version: "1.0"
				}
			}
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to export agents for user ${userId}:`, error)
			throw error
		}
	}

	/**
	 * 批量导入智能体数据
	 */
	async importAgents(userId: string, data: AgentExportData): Promise<AgentConfig[]> {
		try {
			const importedAgents: AgentConfig[] = []
			
			if (data.agent) {
				try {
					const importedAgent = await this.importAgent(userId, { 
						agent: data.agent,
						metadata: data.metadata
					})
					importedAgents.push(importedAgent)
				} catch (error) {
					logger.warn(`[VSCodeAgentStorageService] Failed to import agent ${data.agent.id}:`, error)
					// Continue with other agents
				}
			}
			
			return importedAgents
		} catch (error) {
			logger.error(`[VSCodeAgentStorageService] Failed to import agents for user ${userId}:`, error)
			throw error
		}
	}
}