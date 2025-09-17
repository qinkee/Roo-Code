import React, { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Sparkles } from "lucide-react"
import type { HistoryItem } from "@roo-code/types"
import { extractAgentTemplateFromTask, isTaskSuitableForTemplate } from "@src/components/agents/utils/taskToAgentTemplate"
import { vscode } from "@src/utils/vscode"
import { StandardTooltip } from "@src/components/ui"
import { cn } from "@src/lib/utils"

interface CreateAgentButtonProps {
	item?: HistoryItem
	disabled?: boolean
	showLabel?: boolean
}

export const CreateAgentButton = ({ item, disabled = false, showLabel = false }: CreateAgentButtonProps) => {
	const { t } = useTranslation()

	const handleCreateAgent = useCallback(() => {
		if (!item || !isTaskSuitableForTemplate(item)) {
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

	// 如果没有item或item不适合创建模板，则不渲染
	if (!item?.id || !isTaskSuitableForTemplate(item)) {
		return null
	}

	const buttonContent = (
		<>
			<Sparkles size={16} />
			{showLabel && <span className="ml-1">{t("chat:createAgent", "创建智能体")}</span>}
		</>
	)

	if (showLabel) {
		return (
			<button
				onClick={handleCreateAgent}
				disabled={disabled}
				className={cn(
					"flex items-center gap-1 px-2 py-1 text-xs rounded-md transition-colors",
					disabled
						? "text-vscode-foreground/50 cursor-not-allowed"
						: "text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground"
				)}
				data-testid="create-agent-button"
			>
				{buttonContent}
			</button>
		)
	}

	return (
		<StandardTooltip content={t("chat:createAgentFromTask", "从任务创建智能体")}>
			<button
				onClick={handleCreateAgent}
				disabled={disabled}
				className={cn(
					"h-7 w-7 p-1.5 rounded-md transition-colors",
					disabled
						? "text-vscode-foreground/50 cursor-not-allowed"
						: "text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground"
				)}
				data-testid="create-agent-button"
			>
				{buttonContent}
			</button>
		</StandardTooltip>
	)
}