import React, { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Plus, MoreHorizontal, Settings, Info } from "lucide-react"
import ActionBar from "./ActionBar"
import TaskListModal from "./TaskListModal"
import type { AgentTemplateData } from "./utils/taskToAgentTemplate"

import { vscode } from "@src/utils/vscode"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import ToggleSwitch from "./ToggleSwitch"
import VolumeSlider from "./VolumeSlider"
import CronRulePanel from "./CronRulePanel"
import CreateAgentView from "./CreateAgentView"
import ApiConfigView from "../settings/ApiConfigView"
import ModeConfigView from "../modes/ModeConfigView"

interface Agent {
	id: string
	name: string
	description: string
	type: "custom" | "builtin"
	status: "active" | "inactive"
	icon?: string
}

interface AgentsViewProps {
	onDone: () => void
}

const mockBuiltinAgents: Agent[] = [
	{
		id: "text-diagram",
		name: "文本图",
		description: "",
		type: "builtin",
		status: "inactive",
		icon: "📄"
	}
]

const mockCustomAgents: Agent[] = [
	{
		id: "chat-agent",
		name: "Chat",
		description: "聊聊你的代码或编写代码",
		type: "custom",
		status: "active"
	},
	{
		id: "builder-agent",
		name: "Builder",
		description: "端到端构建开发任务",
		type: "custom",
		status: "active"
	},
	{
		id: "builder-mcp-agent", 
		name: "Builder with MCP",
		description: "支持使用配置的所有 MCP Serv...",
		type: "custom",
		status: "active"
	}
]

const AgentsView: React.FC<AgentsViewProps> = ({ onDone }) => {
	const { t } = useTranslation()
	const [agents, setAgents] = useState<Agent[]>([...mockBuiltinAgents, ...mockCustomAgents])
	const [showCreateAgent, setShowCreateAgent] = useState(false)
	const [showApiConfig, setShowApiConfig] = useState(false)
	const [showModeConfig, setShowModeConfig] = useState(false)
	const [showTaskModal, setShowTaskModal] = useState(false)
	const [selectedTaskData, setSelectedTaskData] = useState<AgentTemplateData | null>(null)
	const [taskListEnabled, setTaskListEnabled] = useState(true)
	const [autoRunEnabled, setAutoRunEnabled] = useState(true)
	const [workflowEnabled, setWorkflowEnabled] = useState(false)
	const [triggerEnabled, setTriggerEnabled] = useState(false)
	const [cronRule, setCronRule] = useState("0 9 * * *") // 默认每天9点
	const [taskStatusNotification, setTaskStatusNotification] = useState({ detail: true, voice: true })
	const [soundVolume, setSoundVolume] = useState(100)
	const [blacklistCommands] = useState(["rm", "kill", "chmod"])

	// Listen for createAgentFromTask messages
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			if (message.type === "createAgentFromTask" && message.templateData) {
				// Set the template data and show the create agent view
				setSelectedTaskData(message.templateData)
				setShowCreateAgent(true)
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	const handleCreateAgent = useCallback(() => {
		setShowCreateAgent(true)
		setSelectedTaskData(null) // 清除任务数据，表示是新建
	}, [])

	const handleCreateFromTask = useCallback(() => {
		setShowTaskModal(true)
	}, [])

	const handleTaskModalClose = useCallback(() => {
		setShowTaskModal(false)
	}, [])

	const handleTaskSelect = useCallback((templateData: AgentTemplateData) => {
		setSelectedTaskData(templateData)
		setShowTaskModal(false)
		setShowCreateAgent(true) // 跳转到创建页面
	}, [])

	const handleCreateAgentBack = useCallback(() => {
		setShowCreateAgent(false)
	}, [])

	const handleCreateAgentCancel = useCallback(() => {
		setShowCreateAgent(false)
	}, [])

	const handleCreateAgentSubmit = useCallback((agentData: any) => {
		// 创建新智能体的逻辑
		console.log("Creating new agent with data:", agentData)
		const newAgent: Agent = {
			id: `custom-${Date.now()}`,
			name: agentData.name,
			description: `${agentData.mode} 模式智能体`,
			type: "custom",
			status: "active"
		}
		setAgents(prev => [...prev, newAgent])
		setShowCreateAgent(false)
	}, [])

	const handleShowApiConfig = useCallback(() => {
		setShowApiConfig(true)
	}, [])

	const handleApiConfigBack = useCallback(() => {
		setShowApiConfig(false)
	}, [])

	const handleShowModeConfig = useCallback(() => {
		setShowModeConfig(true)
	}, [])

	const handleModeConfigBack = useCallback(() => {
		setShowModeConfig(false)
	}, [])

	const handleAgentAction = useCallback((agentId: string, action: "toggle" | "configure" | "delete") => {
		console.log(`Agent ${agentId} action: ${action}`)
	}, [])

	const handleBlacklistCommand = useCallback((command: string) => {
		console.log(`Adding blacklist command: ${command}`)
	}, [])

	// Show API config view if requested
	if (showApiConfig) {
		return (
			<ApiConfigView
				onBack={handleApiConfigBack}
			/>
		)
	}

	// Show mode config view if requested
	if (showModeConfig) {
		return (
			<ModeConfigView
				onBack={handleModeConfigBack}
			/>
		)
	}

	// Show create agent view if requested
	if (showCreateAgent) {
		return (
			<CreateAgentView
				onBack={handleCreateAgentBack}
				onCancel={handleCreateAgentCancel}
				onCreate={handleCreateAgentSubmit}
				onShowApiConfig={handleShowApiConfig}
				onShowModeConfig={handleShowModeConfig}
				templateData={selectedTaskData}
			/>
		)
	}

	return (
		<>
			<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-2">
					<h1 className="text-lg font-bold">{t("agents:title", "智能体")}</h1>
					<StandardTooltip content="管理和配置您的智能体">
						<Info size={14} className="text-vscode-foreground/60" />
					</StandardTooltip>
				</div>
				<ActionBar
					onCreateNew={handleCreateAgent}
					onCreateFromTask={handleCreateFromTask}
				/>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto px-6 py-4 space-y-5">
				{/* Custom Agents Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<div className="w-5 h-5 bg-vscode-list-activeSelectionBackground rounded flex items-center justify-center">
							<span className="text-xs">📝</span>
						</div>
						<h2 className="text-sm font-bold text-vscode-foreground/90">
							{t("agents:customAgents", "自定义智能体")}
						</h2>
					</div>

					<div className="space-y-1">
						{agents.filter(agent => agent.type === "custom").map((agent) => {
							const getAgentIcon = (name: string) => {
								switch (name.toLowerCase()) {
									case 'chat': return { bg: 'bg-blue-500', icon: '💬' }
									case 'builder': return { bg: 'bg-gray-600', icon: '🛠️' }
									case 'builder with mcp': return { bg: 'bg-green-600', icon: '🔧' }
									default: return { bg: 'bg-blue-500', icon: '🤖' }
								}
							}
							const agentStyle = getAgentIcon(agent.name)
							return (
								<div
									key={agent.id}
									className="flex items-center justify-between p-3 bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded-md border border-vscode-input-border transition-colors cursor-pointer group"
								>
									<div className="flex items-center gap-3 flex-1 min-w-0">
										<div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0", agentStyle.bg)}>
											{agentStyle.icon}
										</div>
										<div className="flex-1 min-w-0">
											<div className="font-bold text-sm text-vscode-foreground truncate">{agent.name}</div>
											<div className="text-xs text-vscode-foreground/70 truncate mt-0.5">{agent.description}</div>
										</div>
									</div>
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<StandardTooltip content={t("agents:more", "更多")}>
											<button className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
												<MoreHorizontal size={14} />
											</button>
										</StandardTooltip>
									</div>
								</div>
							)
						})}
					</div>
				</div>

				{/* Builtin Agents Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<div className="w-5 h-5 bg-vscode-list-activeSelectionBackground rounded flex items-center justify-center">
							<span className="text-xs">🏠</span>
						</div>
						<h2 className="text-sm font-bold text-vscode-foreground/90">
							{t("agents:builtinAgents", "内置智能体")}
						</h2>
					</div>

					<div className="space-y-1">
						{agents.filter(agent => agent.type === "builtin").map((agent) => (
							<div
								key={agent.id}
								className="flex items-center justify-between p-3 bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded-md border border-vscode-input-border transition-colors cursor-pointer group"
							>
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0">
										{agent.icon}
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-bold text-sm text-vscode-foreground truncate">{agent.name}</div>
										{agent.description && (
											<div className="text-xs text-vscode-foreground/70 truncate mt-0.5">{agent.description}</div>
										)}
									</div>
								</div>
								<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
									<StandardTooltip content={t("agents:configure", "配置")}>
										<button className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
											<Settings size={14} />
										</button>
									</StandardTooltip>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Task List Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:taskList", "任务列表")}
					</h2>
					<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<div className="flex-1 pr-3">
							<span className="text-sm text-vscode-foreground">{t("agents:taskList", "任务列表")}</span>
							<div className="text-xs text-vscode-foreground/70 mt-0.5">{t("agents:taskListDesc", "允许agent使用任务来求助或来实现")}</div>
						</div>
						<ToggleSwitch checked={taskListEnabled} onChange={setTaskListEnabled} />
					</div>
				</div>

				{/* Auto Run Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:autoRun", "自动运行")}
					</h2>
					<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<div className="flex-1 pr-3">
							<span className="text-sm text-vscode-foreground">{t("agents:autoRun", "自动运行命令和 MCP 工具")}</span>
							<div className="text-xs text-vscode-foreground/70 mt-0.5">{t("agents:autoRunDesc", "使用智能体时，自动运行命令和 MCP 工具")}</div>
						</div>
						<ToggleSwitch checked={autoRunEnabled} onChange={setAutoRunEnabled} />
					</div>
				</div>

				{/* Workflow Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:workflow", "工作流")}
					</h2>
					<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<div className="flex-1 pr-3">
							<span className="text-sm text-vscode-foreground">{t("agents:workflow", "工作流")}</span>
							<div className="text-xs text-vscode-foreground/70 mt-0.5">{t("agents:workflowDesc", "运行自行编制并执行n8n、dify、浏览器自动化等工作流")}</div>
						</div>
						<ToggleSwitch checked={workflowEnabled} onChange={setWorkflowEnabled} />
					</div>
				</div>

				{/* Trigger Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:trigger", "触发器")}
					</h2>
					<div className="bg-vscode-input-background rounded-md border border-vscode-input-border">
						{/* 触发器开关控制 */}
						<div className="flex items-center justify-between p-3">
							<div className="flex-1 pr-3">
								<span className="text-sm text-vscode-foreground">{t("agents:trigger", "触发器")}</span>
								<div className="text-xs text-vscode-foreground/70 mt-0.5">{t("agents:triggerDesc", "启动定时任务，在指定的时间规则里自动执行智能体")}</div>
							</div>
							<ToggleSwitch checked={triggerEnabled} onChange={setTriggerEnabled} />
						</div>
						
						{/* Cron Rule Panel - 展开面板 */}
						{triggerEnabled && (
							<div className="border-t border-vscode-input-border p-4">
								<CronRulePanel 
									cronRule={cronRule} 
									onChange={setCronRule}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Task Status Notification Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:taskStatusNotification", "任务状态通知")}
					</h2>
					<div className="space-y-1">
						<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
							<div className="flex-1 pr-3">
								<span className="text-sm text-vscode-foreground">{t("agents:detail", "详细")}</span>
								<div className="text-xs text-vscode-foreground/70 mt-0.5">{t("agents:detailNotification", "允许任务完成或失败时收集通知")}</div>
							</div>
							<ToggleSwitch 
								checked={taskStatusNotification.detail} 
								onChange={(checked) => setTaskStatusNotification(prev => ({ ...prev, detail: checked }))} 
							/>
						</div>
						<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
							<div className="flex-1 pr-3">
								<span className="text-sm text-vscode-foreground">{t("agents:voiceNotification", "语音")}</span>
							</div>
							<ToggleSwitch 
								checked={taskStatusNotification.voice} 
								onChange={(checked) => setTaskStatusNotification(prev => ({ ...prev, voice: checked }))} 
							/>
						</div>
					</div>
				</div>

				{/* Sound Settings Section */}
				<div>
					<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
						{t("agents:soundSettings", "音频设置")}
					</h2>
					<div className="p-4 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm text-vscode-foreground">{t("agents:soundVolume", "音量设置")}</span>
							<span className="text-sm font-bold text-vscode-foreground">{soundVolume}%</span>
						</div>
						<VolumeSlider value={soundVolume} onChange={setSoundVolume} />
					</div>
				</div>

				{/* Blacklist Commands Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<h2 className="text-sm font-bold text-vscode-foreground/90">
							{t("agents:blacklistCommands", "黑名单")}
						</h2>
						<StandardTooltip content="防止意外执行危险命令">
							<Info size={12} className="text-vscode-foreground/50" />
						</StandardTooltip>
					</div>
					<div className="p-4 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<p className="text-xs text-vscode-foreground/70 mb-3">
							{t("agents:blacklistDesc", "请告知您Mac的系统设置->通知中，以便使用时获得更好的用户体验。")}
						</p>
						<div className="flex flex-wrap gap-1.5 mb-3">
							{blacklistCommands.map((command) => (
								<div
									key={command}
									className="flex items-center gap-1 px-2 py-1 bg-vscode-badge-background text-vscode-badge-foreground rounded-md text-xs font-mono"
								>
									<span>{command}</span>
									<button
										onClick={() => handleBlacklistCommand(command)}
										className="hover:bg-vscode-toolbar-hoverBackground rounded p-0.5 text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
									>
										<span className="text-xs">×</span>
									</button>
								</div>
							))}
						</div>
						<button className="text-xs text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground font-bold">
							+ {t("agents:addCommand", "添加")}
						</button>
					</div>
				</div>
			</div>
		</div>

		{/* Task List Modal */}
		<TaskListModal
			isOpen={showTaskModal}
			onClose={handleTaskModalClose}
			onSelectTask={handleTaskSelect}
		/>
		</>
	)
}

export default AgentsView