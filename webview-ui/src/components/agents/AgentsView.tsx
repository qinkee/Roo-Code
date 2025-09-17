import React, { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Plus, MoreHorizontal, Settings, Info } from "lucide-react"

import { vscode } from "@src/utils/vscode"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import ToggleSwitch from "./ToggleSwitch"
import VolumeSlider from "./VolumeSlider"

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
	const [agents] = useState<Agent[]>([...mockBuiltinAgents, ...mockCustomAgents])
	const [taskListEnabled, setTaskListEnabled] = useState(true)
	const [autoRunEnabled, setAutoRunEnabled] = useState(true)
	const [taskStatusNotification, setTaskStatusNotification] = useState({ detail: true, voice: true })
	const [soundVolume, setSoundVolume] = useState(100)
	const [blacklistCommands] = useState(["rm", "kill", "chmod"])

	const handleCreateAgent = useCallback(() => {
		// 创建新智能体的逻辑
		console.log("Creating new agent...")
	}, [])

	const handleAgentAction = useCallback((agentId: string, action: "toggle" | "configure" | "delete") => {
		console.log(`Agent ${agentId} action: ${action}`)
	}, [])

	const handleBlacklistCommand = useCallback((command: string) => {
		console.log(`Adding blacklist command: ${command}`)
	}, [])

	return (
		<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-2">
					<h1 className="text-lg font-medium">{t("agents:title", "智能体")}</h1>
					<StandardTooltip content="管理和配置您的智能体">
						<Info size={14} className="text-vscode-foreground/60" />
					</StandardTooltip>
				</div>
				<button
					onClick={handleCreateAgent}
					className="flex items-center gap-1.5 px-3 py-1.5 bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground rounded-md text-sm font-medium transition-colors"
				>
					<Plus size={14} />
					{t("agents:create", "创建")}
				</button>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto px-6 py-4 space-y-5">
				{/* Custom Agents Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<div className="w-5 h-5 bg-vscode-list-activeSelectionBackground rounded flex items-center justify-center">
							<span className="text-xs">📝</span>
						</div>
						<h2 className="text-sm font-medium text-vscode-foreground/90">
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
											<div className="font-medium text-sm text-vscode-foreground truncate">{agent.name}</div>
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
						<h2 className="text-sm font-medium text-vscode-foreground/90">
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
										<div className="font-medium text-sm text-vscode-foreground truncate">{agent.name}</div>
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
					<h2 className="text-sm font-medium text-vscode-foreground/90 mb-3">
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
					<h2 className="text-sm font-medium text-vscode-foreground/90 mb-3">
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

				{/* Task Status Notification Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/90 mb-3">
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
					<h2 className="text-sm font-medium text-vscode-foreground/90 mb-3">
						{t("agents:soundSettings", "音频设置")}
					</h2>
					<div className="p-4 bg-vscode-input-background rounded-md border border-vscode-input-border">
						<div className="flex items-center justify-between mb-3">
							<span className="text-sm text-vscode-foreground">{t("agents:soundVolume", "音量设置")}</span>
							<span className="text-sm font-medium text-vscode-foreground">{soundVolume}%</span>
						</div>
						<VolumeSlider value={soundVolume} onChange={setSoundVolume} />
					</div>
				</div>

				{/* Blacklist Commands Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<h2 className="text-sm font-medium text-vscode-foreground/90">
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
						<button className="text-xs text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground font-medium">
							+ {t("agents:addCommand", "添加")}
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AgentsView