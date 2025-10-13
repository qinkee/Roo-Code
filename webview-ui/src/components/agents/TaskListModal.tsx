import React, { useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { X, Clock, Settings, Sparkles } from "lucide-react"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { useTaskSearch } from "@src/components/history/useTaskSearch"
import { formatTaskForDisplay, isTaskSuitableForTemplate, type AgentTemplateData } from "./utils/taskToAgentTemplate"

interface TaskListModalProps {
	isOpen: boolean
	onClose: () => void
	onSelectTask: (templateData: AgentTemplateData) => void
}

const TaskListModal: React.FC<TaskListModalProps> = ({ isOpen, onClose, onSelectTask }) => {
	const { t } = useTranslation()
	const { taskHistory } = useExtensionState()

	// 使用现有的任务搜索hook
	const { tasks, searchQuery, setSearchQuery } = useTaskSearch()

	// 过滤出适合创建模板的任务
	const suitableTasks = useMemo(() => {
		return tasks
			.filter(isTaskSuitableForTemplate)
			.map(formatTaskForDisplay)
			.sort((a: any, b: any) => b.timestamp - a.timestamp) // 按时间倒序
	}, [tasks])

	const handleTaskSelect = useCallback(
		(task: any) => {
			// 从原始任务数据中提取模板信息
			const originalTask = taskHistory?.find((t) => t.id === task.id)
			if (originalTask) {
				const templateData: AgentTemplateData = {
					apiConfigId: (originalTask as any).apiConfigId,
					mode: (originalTask as any).mode || "ask",
					tools: (originalTask as any).tools || ["internal"],
					templateSource: {
						type: "task",
						taskId: originalTask.id,
						taskDescription: originalTask.task || "",
						timestamp: originalTask.ts || Date.now(),
					},
				}
				onSelectTask(templateData)
			}
		},
		[taskHistory, onSelectTask],
	)

	const handleBackdropClick = useCallback(
		(e: React.MouseEvent) => {
			if (e.target === e.currentTarget) {
				onClose()
			}
		},
		[onClose],
	)

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 bg-black/50 flex items-center justify-center"
			style={{ zIndex: 9999 }}
			onClick={handleBackdropClick}>
			<div className="bg-vscode-editor-background border border-vscode-panel-border rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
				{/* Header */}
				<div className="flex items-center justify-between py-4 border-b border-vscode-panel-border">
					<div className="flex items-center gap-2">
						<Sparkles size={18} className="text-vscode-foreground" />
						<h2 className="text-lg font-bold text-vscode-foreground">
							{t("agents:selectTaskForTemplate", "选择任务作为模板")}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
						<X size={16} />
					</button>
				</div>

				{/* Search */}
				<div className="px-6 py-3 border-b border-vscode-panel-border">
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder={t("agents:searchTasks", "搜索任务...")}
						className="w-full px-3 py-2 bg-vscode-input-background border border-vscode-input-border rounded-md text-sm text-vscode-foreground placeholder-vscode-foreground/50 focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder"
					/>
				</div>

				{/* Task List */}
				<div className="flex-1 overflow-auto px-6 py-4">
					{suitableTasks.length === 0 ? (
						<div className="text-center py-12 text-vscode-foreground/60">
							<Sparkles size={48} className="mx-auto mb-4 opacity-30" />
							<p className="text-lg mb-2">{t("agents:noSuitableTasks", "暂无适合的任务")}</p>
							<p className="text-sm">
								{searchQuery
									? t("agents:noTasksMatchSearch", "没有找到匹配的任务")
									: t("agents:noTasksAvailable", "暂无任务历史，请先创建一些任务")}
							</p>
						</div>
					) : (
						<div className="space-y-2">
							{suitableTasks.map((task) => (
								<button
									key={task.id}
									onClick={() => handleTaskSelect(task)}
									className="w-full text-left p-4 bg-vscode-input-background hover:bg-vscode-list-hoverBackground border border-vscode-input-border rounded-md transition-colors group">
									<div className="flex items-start justify-between gap-3">
										<div className="flex-1 min-w-0">
											{/* Task Title */}
											<h3 className="font-medium text-vscode-foreground truncate group-hover:text-vscode-list-activeSelectionForeground">
												{task.title}
											</h3>

											{/* Task Subtitle */}
											<div className="flex items-center gap-2 mt-1 text-xs text-vscode-foreground/60">
												<Clock size={12} />
												<span>{task.subtitle}</span>
											</div>

											{/* Configuration Preview */}
											<div className="flex items-center gap-3 mt-2">
												<div className="flex items-center gap-1 text-xs text-vscode-foreground/50">
													<Settings size={10} />
													<span>
														{t(
															`chat:modeSelector.presetModes.${task.configPreview.mode}.name` as any,
														) || task.configPreview.mode}
													</span>
												</div>
												{task.configPreview.hasApiConfig && (
													<div className="flex items-center gap-1 text-xs text-green-500">
														<div className="w-2 h-2 bg-green-500 rounded-full"></div>
														<span>API已配置</span>
													</div>
												)}
												<div className="flex items-center gap-1 text-xs text-vscode-foreground/50">
													<span>{task.configPreview.toolsCount}个工具</span>
												</div>
											</div>
										</div>

										{/* Action Icon */}
										<div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
											<Sparkles size={16} className="text-vscode-button-background" />
										</div>
									</div>
								</button>
							))}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="px-6 py-4 border-t border-vscode-panel-border text-center">
					<p className="text-xs text-vscode-foreground/60">
						{t(
							"agents:taskTemplateHint",
							"选择一个任务将使用其配置信息（API配置、模式、工具等）作为智能体的初始设置",
						)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default TaskListModal
