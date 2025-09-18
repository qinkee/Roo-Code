import { z } from "zod"

/**
 * 智能体工具配置
 */
export const agentToolConfigSchema = z.object({
	toolId: z.string(),
	enabled: z.boolean(),
	config: z.record(z.string(), z.any()).optional(),
})

export type AgentToolConfig = z.infer<typeof agentToolConfigSchema>

/**
 * 智能体Todo项
 */
export const agentTodoSchema = z.object({
	id: z.string(),
	content: z.string(),
	status: z.enum(["pending", "in_progress", "completed"]),
	createdAt: z.number(),
	updatedAt: z.number(),
	priority: z.enum(["low", "medium", "high"]).optional(),
})

export type AgentTodo = z.infer<typeof agentTodoSchema>

/**
 * 智能体模板来源
 */
export const agentTemplateSourceSchema = z.object({
	type: z.enum(["manual", "task"]),
	taskId: z.string().optional(),
	taskDescription: z.string().optional(),
	timestamp: z.number(),
})

export type AgentTemplateSource = z.infer<typeof agentTemplateSourceSchema>

/**
 * 智能体配置
 */
export const agentConfigSchema = z.object({
	id: z.string(),
	userId: z.string(),
	name: z.string(),
	avatar: z.string(),
	roleDescription: z.string(),
	apiConfigId: z.string(),
	mode: z.string(),
	tools: z.array(agentToolConfigSchema),
	todos: z.array(agentTodoSchema),
	templateSource: agentTemplateSourceSchema.optional(),
	createdAt: z.number(),
	updatedAt: z.number(),
	lastUsedAt: z.number().optional(),
	isActive: z.boolean(),
	version: z.number(),
})

export type AgentConfig = z.infer<typeof agentConfigSchema>

/**
 * 智能体列表查询选项
 */
export const agentListOptionsSchema = z.object({
	sortBy: z.enum(["name", "createdAt", "updatedAt", "lastUsedAt"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	filterByMode: z.string().optional(),
	onlyActive: z.boolean().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
})

export type AgentListOptions = z.infer<typeof agentListOptionsSchema>

/**
 * 智能体导出数据
 */
export const agentExportDataSchema = z.object({
	agent: agentConfigSchema,
	metadata: z.object({
		exportedAt: z.number(),
		exportedBy: z.string(),
		version: z.string(),
	}),
})

export type AgentExportData = z.infer<typeof agentExportDataSchema>

/**
 * 智能体模板数据（用于从任务创建智能体）
 */
export const agentTemplateDataSchema = z.object({
	apiConfigId: z.string().optional(),
	mode: z.string().optional(),
	tools: z.array(z.string()).optional(),
	templateSource: agentTemplateSourceSchema,
})

export type AgentTemplateData = z.infer<typeof agentTemplateDataSchema>