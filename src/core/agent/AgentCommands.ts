import * as vscode from "vscode"
import { AgentConfig, AgentListOptions, AgentExportData } from "@roo-code/types"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { logger } from "../../utils/logging"

/**
 * 智能体命令注册服务
 * 注册所有智能体相关的VSCode命令
 */
export class AgentCommands {
	/**
	 * 注册所有智能体相关命令
	 */
	static register(context: vscode.ExtensionContext, storageService: EnhancedAgentStorageService): void {
		logger.info("[AgentCommands] Registering agent commands...")

		// 获取用户智能体列表
		const getAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.getAgents",
			async (data?: {
				userId?: string
				options?: AgentListOptions
			}): Promise<{
				success: boolean
				agents: AgentConfig[]
				error?: string
			}> => {
				try {
					if (!data?.userId) {
						return { success: false, agents: [], error: "User ID is required" }
					}

					const agents = await storageService.listUserAgents(data.userId, data.options)
					return { success: true, agents }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error getting agents:", error)
					return { success: false, agents: [], error: errorMessage }
				}
			},
		)

		// 创建智能体
		const createAgentCommand = vscode.commands.registerCommand(
			"roo-cline.createAgent",
			async (data: {
				userId: string
				agentConfig: Omit<AgentConfig, "id" | "createdAt" | "updatedAt">
			}): Promise<{
				success: boolean
				agent?: AgentConfig
				error?: string
			}> => {
				try {
					const agent = await storageService.createAgent(data.userId, data.agentConfig)
					return { success: true, agent }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error creating agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 获取单个智能体
		const getAgentCommand = vscode.commands.registerCommand(
			"roo-cline.getAgent",
			async (data: {
				userId: string
				agentId: string
			}): Promise<{
				success: boolean
				agent?: AgentConfig
				error?: string
			}> => {
				try {
					const agent = await storageService.getAgent(data.userId, data.agentId)
					if (agent) {
						return { success: true, agent }
					} else {
						return { success: false, error: "Agent not found" }
					}
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error getting agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 更新智能体
		const updateAgentCommand = vscode.commands.registerCommand(
			"roo-cline.updateAgent",
			async (data: {
				userId: string
				agentId: string
				updates: Partial<AgentConfig>
			}): Promise<{
				success: boolean
				agent?: AgentConfig
				error?: string
			}> => {
				try {
					const agent = await storageService.updateAgent(data.userId, data.agentId, data.updates)
					return { success: true, agent }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error updating agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 删除智能体
		const deleteAgentCommand = vscode.commands.registerCommand(
			"roo-cline.deleteAgent",
			async (data: {
				userId: string
				agentId: string
			}): Promise<{
				success: boolean
				error?: string
			}> => {
				try {
					const result = await storageService.deleteAgent(data.userId, data.agentId)
					return { success: result }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error deleting agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 搜索智能体
		const searchAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.searchAgents",
			async (data: {
				userId: string
				query: string
			}): Promise<{
				success: boolean
				agents: AgentConfig[]
				error?: string
			}> => {
				try {
					const agents = await storageService.searchAgents(data.userId, data.query)
					return { success: true, agents }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error searching agents:", error)
					return { success: false, agents: [], error: errorMessage }
				}
			},
		)

		// 导出智能体
		const exportAgentCommand = vscode.commands.registerCommand(
			"roo-cline.exportAgent",
			async (data: {
				userId: string
				agentId: string
			}): Promise<{
				success: boolean
				exportData?: AgentExportData
				error?: string
			}> => {
				try {
					const exportData = await storageService.exportAgent(data.userId, data.agentId)
					return { success: true, exportData }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error exporting agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 导入智能体
		const importAgentCommand = vscode.commands.registerCommand(
			"roo-cline.importAgent",
			async (data: {
				userId: string
				exportData: AgentExportData
			}): Promise<{
				success: boolean
				agent?: AgentConfig
				error?: string
			}> => {
				try {
					const agent = await storageService.importAgent(data.userId, data.exportData)
					return { success: true, agent }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error importing agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 强制同步到Redis
		const syncAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.syncAgents",
			async (data: {
				userId: string
			}): Promise<{
				success: boolean
				error?: string
			}> => {
				try {
					await storageService.forceSyncToRedis(data.userId)
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error syncing agents:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 从Redis恢复
		const restoreAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.restoreAgents",
			async (data: {
				userId: string
			}): Promise<{
				success: boolean
				count: number
				error?: string
			}> => {
				try {
					const count = await storageService.restoreFromRedis(data.userId)
					return { success: true, count }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error restoring agents:", error)
					return { success: false, count: 0, error: errorMessage }
				}
			},
		)

		// 检查数据一致性
		const checkConsistencyCommand = vscode.commands.registerCommand(
			"roo-cline.checkAgentConsistency",
			async (data: {
				userId: string
			}): Promise<{
				success: boolean
				localCount: number
				redisCount: number
				consistent: boolean
				error?: string
			}> => {
				try {
					const result = await storageService.checkDataConsistency(data.userId)
					return { success: true, ...result }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error checking consistency:", error)
					return {
						success: false,
						localCount: 0,
						redisCount: 0,
						consistent: false,
						error: errorMessage,
					}
				}
			},
		)

		// Todo相关命令
		const addTodoCommand = vscode.commands.registerCommand(
			"roo-cline.addAgentTodo",
			async (data: {
				userId: string
				agentId: string
				todo: {
					content: string
					status?: "pending" | "in_progress" | "completed"
					priority?: "low" | "medium" | "high"
				}
			}): Promise<{
				success: boolean
				todo?: any
				error?: string
			}> => {
				try {
					const todo = await storageService.addTodo(data.userId, data.agentId, {
						content: data.todo.content,
						status: data.todo.status || "pending",
						priority: data.todo.priority,
					})
					return { success: true, todo }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error adding todo:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		const updateTodoCommand = vscode.commands.registerCommand(
			"roo-cline.updateAgentTodo",
			async (data: {
				userId: string
				agentId: string
				todoId: string
				updates: any
			}): Promise<{
				success: boolean
				todo?: any
				error?: string
			}> => {
				try {
					const todo = await storageService.updateTodo(data.userId, data.agentId, data.todoId, data.updates)
					return { success: true, todo }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error updating todo:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		const deleteTodoCommand = vscode.commands.registerCommand(
			"roo-cline.deleteAgentTodo",
			async (data: {
				userId: string
				agentId: string
				todoId: string
			}): Promise<{
				success: boolean
				error?: string
			}> => {
				try {
					const result = await storageService.deleteTodo(data.userId, data.agentId, data.todoId)
					return { success: result }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error deleting todo:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 清除所有智能体数据（用于开发和测试）
		const clearAllAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.clearAllAgents",
			async (data?: {
				userId?: string
			}): Promise<{
				success: boolean
				error?: string
			}> => {
				try {
					const userId = data?.userId || "default"
					// 获取所有智能体并删除
					const agents = await storageService.listUserAgents(userId)
					for (const agent of agents) {
						await storageService.deleteAgent(userId, agent.id)
					}
					logger.info(`[AgentCommands] Cleared all agents for user ${userId}`)
					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Error clearing all agents:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// ===== IM集成相关命令 =====

		// 获取用户智能体列表（IM专用）
		const getUserAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.getUserAgents",
			async (params: {
				userId: string
			}): Promise<{
				success: boolean
				agents: AgentConfig[]
				error?: string
			}> => {
				try {
					const agents = await storageService.listUserAgents(params.userId)
					return { success: true, agents }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Failed to get user agents:", error)
					return { success: false, agents: [], error: errorMessage }
				}
			},
		)

		// 获取共享智能体列表（IM专用）
		const getSharedAgentsCommand = vscode.commands.registerCommand(
			"roo-cline.getSharedAgents",
			async (params: {
				shareScope: string
				allowedGroups?: string[]
				allowedUsers?: string[]
				excludeUserId?: string
			}): Promise<{
				success: boolean
				agents: AgentConfig[]
				error?: string
			}> => {
				try {
					const sharedAgents = await storageService.getSharedAgents(params)
					return { success: true, agents: sharedAgents }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Failed to get shared agents:", error)
					return { success: false, agents: [], error: errorMessage }
				}
			},
		)

		// 调用智能体（IM专用）
		const invokeAgentCommand = vscode.commands.registerCommand(
			"roo-cline.invokeAgent",
			async (params: {
				agentId: string
				message: string
				context?: any
			}): Promise<{
				success: boolean
				content?: string
				error?: string
			}> => {
				try {
					const result = await storageService.invokeAgent(params.agentId, params.message, params.context)
					return { success: true, content: result }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Failed to invoke agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 编辑智能体（IM专用）
		const editAgentCommand = vscode.commands.registerCommand(
			"roo-cline.editAgent",
			async (params: {
				agentId: string
			}): Promise<{
				success: boolean
				error?: string
			}> => {
				try {
					// 触发智能体编辑界面（可以通过webview或其他方式）
					// 这里先简单返回成功，实际实现可能需要打开编辑界面
					logger.info(`[AgentCommands] Edit agent requested: ${params.agentId}`)

					// 发送消息到webview或打开编辑面板
					vscode.commands.executeCommand("roo-cline.openAgent", { agentId: params.agentId })

					return { success: true }
				} catch (error) {
					const errorMessage = error instanceof Error ? error.message : String(error)
					logger.error("[AgentCommands] Failed to edit agent:", error)
					return { success: false, error: errorMessage }
				}
			},
		)

		// 注册到context
		context.subscriptions.push(
			getAgentsCommand,
			createAgentCommand,
			getAgentCommand,
			updateAgentCommand,
			deleteAgentCommand,
			searchAgentsCommand,
			exportAgentCommand,
			importAgentCommand,
			syncAgentsCommand,
			restoreAgentsCommand,
			checkConsistencyCommand,
			addTodoCommand,
			updateTodoCommand,
			deleteTodoCommand,
			clearAllAgentsCommand,
			// IM集成命令
			getUserAgentsCommand,
			getSharedAgentsCommand,
			invokeAgentCommand,
			editAgentCommand,
		)

		logger.info("[AgentCommands] Agent commands registered successfully", {
			commands: [
				"roo-cline.getAgents",
				"roo-cline.createAgent",
				"roo-cline.getAgent",
				"roo-cline.updateAgent",
				"roo-cline.deleteAgent",
				"roo-cline.searchAgents",
				"roo-cline.exportAgent",
				"roo-cline.importAgent",
				"roo-cline.syncAgents",
				"roo-cline.restoreAgents",
				"roo-cline.checkAgentConsistency",
				"roo-cline.addAgentTodo",
				"roo-cline.updateAgentTodo",
				"roo-cline.deleteAgentTodo",
				"roo-cline.clearAllAgents",
				// IM集成命令
				"roo-cline.getUserAgents",
				"roo-cline.getSharedAgents",
				"roo-cline.invokeAgent",
				"roo-cline.editAgent",
			],
		})
	}
}
