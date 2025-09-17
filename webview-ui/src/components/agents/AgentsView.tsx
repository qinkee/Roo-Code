import React, { useState, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Plus, MoreHorizontal, Settings, Trash2, Play, Pause } from "lucide-react"

import { vscode } from "@src/utils/vscode"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"

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
			<div className="flex items-center justify-between p-4 border-b border-vscode-panel-border">
				<h1 className="text-lg font-semibold">{t("agents:title", "智能体")}</h1>
				<button
					onClick={handleCreateAgent}
					className="flex items-center gap-2 px-3 py-1.5 bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground rounded text-sm"
				>
					<Plus size={16} />
					{t("agents:create", "创建")}
				</button>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto p-4 space-y-6">
				{/* Custom Agents Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<div className="w-6 h-6 bg-vscode-button-background rounded flex items-center justify-center">
							<span className="text-sm">📝</span>
						</div>
						<h2 className="text-sm font-medium text-vscode-foreground/80">
							{t("agents:customAgents", "自定义智能体")}
						</h2>
					</div>

					<div className="space-y-2">
						{agents.filter(agent => agent.type === "custom").map((agent) => (
							<div
								key={agent.id}
								className="flex items-center justify-between p-3 bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded border border-vscode-panel-border"
							>
								<div className="flex items-center gap-3 flex-1">
									<div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-sm">
										💬
									</div>
									<div className="flex-1">
										<div className="font-medium">{agent.name}</div>
										<div className="text-sm text-vscode-foreground/60">{agent.description}</div>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<StandardTooltip content={t("agents:more", "更多")}>
										<button className="p-1 hover:bg-vscode-toolbar-hoverBackground rounded">
											<MoreHorizontal size={16} />
										</button>
									</StandardTooltip>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Builtin Agents Section */}
				<div>
					<div className="flex items-center gap-2 mb-3">
						<div className="w-6 h-6 bg-vscode-button-background rounded flex items-center justify-center">
							<span className="text-sm">🏠</span>
						</div>
						<h2 className="text-sm font-medium text-vscode-foreground/80">
							{t("agents:builtinAgents", "内置智能体")}
						</h2>
					</div>

					<div className="space-y-2">
						{agents.filter(agent => agent.type === "builtin").map((agent) => (
							<div
								key={agent.id}
								className="flex items-center justify-between p-3 bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded border border-vscode-panel-border"
							>
								<div className="flex items-center gap-3 flex-1">
									<div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-sm">
										{agent.icon}
									</div>
									<div className="flex-1">
										<div className="font-medium">{agent.name}</div>
										<div className="text-sm text-vscode-foreground/60">{agent.description}</div>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<StandardTooltip content={t("agents:configure", "配置")}>
										<button className="p-1 hover:bg-vscode-toolbar-hoverBackground rounded">
											<Settings size={16} />
										</button>
									</StandardTooltip>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Task List Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/80 mb-3">
						{t("agents:taskList", "任务列表")}
					</h2>
					<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
						<span className="text-sm">{t("agents:taskListDesc", "允许agent使用任务来求助或来实现")}</span>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={taskListEnabled}
								onChange={(e) => setTaskListEnabled(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-9 h-5 bg-vscode-input-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
						</label>
					</div>
				</div>

				{/* Auto Run Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/80 mb-3">
						{t("agents:autoRun", "自动运行")}
					</h2>
					<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
						<span className="text-sm">{t("agents:autoRunDesc", "使用智能体时，自动运行命令和 MCP 工具")}</span>
						<label className="relative inline-flex items-center cursor-pointer">
							<input
								type="checkbox"
								checked={autoRunEnabled}
								onChange={(e) => setAutoRunEnabled(e.target.checked)}
								className="sr-only peer"
							/>
							<div className="w-9 h-5 bg-vscode-input-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
						</label>
					</div>
				</div>

				{/* Task Status Notification Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/80 mb-3">
						{t("agents:taskStatusNotification", "任务状态通知")}
					</h2>
					<div className="space-y-2">
						<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
							<span className="text-sm">{t("agents:detailNotification", "允许任务完成或失败时收集通知")}</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={taskStatusNotification.detail}
									onChange={(e) => setTaskStatusNotification(prev => ({ ...prev, detail: e.target.checked }))}
									className="sr-only peer"
								/>
								<div className="w-9 h-5 bg-vscode-input-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
							</label>
						</div>
						<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
							<span className="text-sm">{t("agents:voiceNotification", "语言")}</span>
							<label className="relative inline-flex items-center cursor-pointer">
								<input
									type="checkbox"
									checked={taskStatusNotification.voice}
									onChange={(e) => setTaskStatusNotification(prev => ({ ...prev, voice: e.target.checked }))}
									className="sr-only peer"
								/>
								<div className="w-9 h-5 bg-vscode-input-background peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
							</label>
						</div>
					</div>
				</div>

				{/* Sound Settings Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/80 mb-3">
						{t("agents:soundSettings", "音频设置")}
					</h2>
					<div className="p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm">{t("agents:soundVolume", "音量设置")}</span>
							<span className="text-sm text-vscode-foreground/60">{soundVolume}%</span>
						</div>
						<input
							type="range"
							min="0"
							max="100"
							value={soundVolume}
							onChange={(e) => setSoundVolume(Number(e.target.value))}
							className="w-full h-2 bg-vscode-slider-background rounded-lg appearance-none cursor-pointer slider"
						/>
					</div>
				</div>

				{/* Blacklist Commands Section */}
				<div>
					<h2 className="text-sm font-medium text-vscode-foreground/80 mb-3">
						{t("agents:blacklistCommands", "黑名单")}
					</h2>
					<div className="p-3 bg-vscode-input-background rounded border border-vscode-panel-border">
						<p className="text-sm text-vscode-foreground/60 mb-3">
							{t("agents:blacklistDesc", "请告知您Mac的系统设置->通知中，以便使用时获得更好的用户体验。")}
						</p>
						<div className="flex flex-wrap gap-2">
							{blacklistCommands.map((command) => (
								<div
									key={command}
									className="flex items-center gap-1 px-2 py-1 bg-vscode-badge-background text-vscode-badge-foreground rounded text-sm"
								>
									<span>{command}</span>
									<button
										onClick={() => handleBlacklistCommand(command)}
										className="hover:bg-vscode-toolbar-hoverBackground rounded p-0.5"
									>
										<span className="text-xs">×</span>
									</button>
								</div>
							))}
						</div>
						<div className="mt-2">
							<button className="text-sm text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground">
								+ {t("agents:addCommand", "添加")}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AgentsView