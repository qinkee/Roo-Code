import * as vscode from "vscode"
import { AgentConfig, AgentTodo, AgentListOptions, AgentExportData } from "@roo-code/types"
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
		return (await this.context.globalState.get(key, {})) as Record<string, AgentConfig>
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
}