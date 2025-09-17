import type { HistoryItem } from "@roo-code/types"

// 定义智能体模板数据类型
export interface AgentTemplateData {
	apiConfigId?: string
	mode?: string
	tools?: string[]
	templateSource: {
		type: 'task'
		taskId: string
		taskDescription: string
		timestamp: number
	}
}

/**
 * 从任务历史项中提取智能体模板数据
 * 这是核心的业务逻辑，可以在多个地方复用
 */
export function extractAgentTemplateFromTask(task: HistoryItem): AgentTemplateData | null {
	if (!task.id || !task.task) {
		return null
	}

	// TODO: 实际实现需要根据任务数据结构来提取配置信息
	// 目前先使用默认值，后续需要根据实际的任务数据结构来完善
	
	const templateData: AgentTemplateData = {
		// 从任务中提取API配置ID (需要根据实际数据结构调整)
		apiConfigId: (task as any).apiConfigId || undefined,
		
		// 从任务中提取模式信息 (需要根据实际数据结构调整)
		mode: (task as any).mode || "ask", // 默认使用ask模式
		
		// 从任务中提取工具配置 (需要根据实际数据结构调整)
		tools: (task as any).tools || ["internal"], // 默认使用内置工具
		
		// 记录模板来源信息
		templateSource: {
			type: 'task',
			taskId: task.id,
			taskDescription: task.task,
			timestamp: task.ts || Date.now()
		}
	}

	return templateData
}

/**
 * 检查任务是否可以用于创建智能体模板
 */
export function isTaskSuitableForTemplate(task: HistoryItem): boolean {
	return !!(task.id && task.task && task.task.trim().length > 0)
}

/**
 * 格式化任务显示信息，用于在任务列表中展示
 */
export function formatTaskForDisplay(task: HistoryItem) {
	const date = task.ts ? new Date(task.ts) : null
	const timeAgo = date ? getTimeAgo(date) : '未知时间'
	
	return {
		id: task.id,
		title: task.task || '未命名任务',
		subtitle: `${timeAgo} • ${task.workspace ? getWorkspaceName(task.workspace) : '未知工作区'}`,
		description: task.task || '',
		timestamp: task.ts || 0,
		workspace: task.workspace,
		// 显示的配置信息预览
		configPreview: {
			mode: (task as any).mode || 'ask',
			hasApiConfig: !!(task as any).apiConfigId,
			toolsCount: ((task as any).tools || ['internal']).length
		}
	}
}

/**
 * 获取相对时间描述
 */
function getTimeAgo(date: Date): string {
	const now = new Date()
	const diffMs = now.getTime() - date.getTime()
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
	
	if (diffDays === 0) {
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		if (diffHours === 0) {
			const diffMinutes = Math.floor(diffMs / (1000 * 60))
			return diffMinutes <= 1 ? '刚刚' : `${diffMinutes}分钟前`
		}
		return `${diffHours}小时前`
	} else if (diffDays === 1) {
		return '昨天'
	} else if (diffDays < 7) {
		return `${diffDays}天前`
	} else {
		return date.toLocaleDateString('zh-CN')
	}
}

/**
 * 从工作区路径中提取工作区名称
 */
function getWorkspaceName(workspace: string): string {
	const parts = workspace.split('/')
	return parts[parts.length - 1] || workspace
}