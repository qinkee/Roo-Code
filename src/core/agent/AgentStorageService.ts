import { AgentConfig, AgentTodo, AgentListOptions, AgentExportData } from "@roo-code/types"

/**
 * 智能体存储服务接口
 * 定义了智能体数据的基础CRUD操作和查询功能
 */
export interface AgentStorageService {
	/**
	 * 创建新的智能体
	 * @param userId 用户ID
	 * @param config 智能体配置（不包含id、创建时间、更新时间）
	 * @returns 创建的智能体配置
	 */
	createAgent(userId: string, config: Omit<AgentConfig, "id" | "createdAt" | "updatedAt">): Promise<AgentConfig>

	/**
	 * 获取指定的智能体
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @returns 智能体配置，如果不存在返回null
	 */
	getAgent(userId: string, agentId: string): Promise<AgentConfig | null>

	/**
	 * 更新智能体配置
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @param updates 更新的字段
	 * @returns 更新后的智能体配置
	 */
	updateAgent(userId: string, agentId: string, updates: Partial<AgentConfig>): Promise<AgentConfig>

	/**
	 * 删除智能体
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @returns 是否删除成功
	 */
	deleteAgent(userId: string, agentId: string): Promise<boolean>

	/**
	 * 获取用户的所有智能体列表
	 * @param userId 用户ID
	 * @param options 查询选项
	 * @returns 智能体列表
	 */
	listUserAgents(userId: string, options?: AgentListOptions): Promise<AgentConfig[]>

	/**
	 * 搜索智能体
	 * @param userId 用户ID
	 * @param query 搜索关键词
	 * @returns 匹配的智能体列表
	 */
	searchAgents(userId: string, query: string): Promise<AgentConfig[]>

	/**
	 * 添加Todo到智能体
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @param todo Todo项（不包含id、创建时间、更新时间）
	 * @returns 添加的Todo项
	 */
	addTodo(
		userId: string,
		agentId: string,
		todo: Omit<AgentTodo, "id" | "createdAt" | "updatedAt">
	): Promise<AgentTodo>

	/**
	 * 更新智能体的Todo项
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @param todoId Todo ID
	 * @param updates 更新的字段
	 * @returns 更新后的Todo项
	 */
	updateTodo(
		userId: string,
		agentId: string,
		todoId: string,
		updates: Partial<AgentTodo>
	): Promise<AgentTodo>

	/**
	 * 删除智能体的Todo项
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @param todoId Todo ID
	 * @returns 是否删除成功
	 */
	deleteTodo(userId: string, agentId: string, todoId: string): Promise<boolean>

	/**
	 * 导出智能体配置
	 * @param userId 用户ID
	 * @param agentId 智能体ID
	 * @returns 导出数据
	 */
	exportAgent(userId: string, agentId: string): Promise<AgentExportData>

	/**
	 * 导入智能体配置
	 * @param userId 用户ID
	 * @param data 导入数据
	 * @returns 导入的智能体配置
	 */
	importAgent(userId: string, data: AgentExportData): Promise<AgentConfig>
}