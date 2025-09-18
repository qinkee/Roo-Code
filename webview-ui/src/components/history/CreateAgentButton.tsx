import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Sparkles } from "lucide-react"
import type { HistoryItem } from "@roo-code/types"
import { extractAgentTemplateFromTask, isTaskSuitableForTemplate } from "@src/components/agents/utils/taskToAgentTemplate"
import { vscode } from "@src/utils/vscode"
import { StandardTooltip } from "@src/components/ui"

interface CreateAgentButtonProps {
	item: HistoryItem
}

export const CreateAgentButton: React.FC<CreateAgentButtonProps> = ({ item }) => {
	const { t } = useTranslation()

	const handleCreateAgent = useCallback((e: React.MouseEvent) => {
		e.stopPropagation() // 防止触发任务项的点击事件

		if (!isTaskSuitableForTemplate(item)) {
			return
		}

		// 提取任务模板数据
		const templateData = extractAgentTemplateFromTask(item)
		if (!templateData) {
			return
		}

		// 发送消息跳转到智能体页面，并传递模板数据
		vscode.postMessage({
			type: "createAgentFromTask",
			templateData
		})
	}, [item])

	// 如果任务不适合创建模板，则不渲染
	if (!isTaskSuitableForTemplate(item)) {
		return null
	}

	return (
		<StandardTooltip content={t("chat:createAgentFromTask", "从任务创建智能体")}>
			<button
				onClick={handleCreateAgent}
				className="p-1 hover:bg-vscode-toolbar-hoverBackground rounded text-vscode-descriptionForeground/60 hover:text-vscode-descriptionForeground transition-colors"
				data-testid="create-agent-button"
			>
				<Sparkles size={14} />
			</button>
		</StandardTooltip>
	)
}