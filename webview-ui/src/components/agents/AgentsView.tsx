import React, { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Plus, MoreHorizontal, Settings, Info, Play, Edit, Trash2, Share, Upload, Square } from "lucide-react"
import ActionBar from "./ActionBar"
import TaskListModal from "./TaskListModal"
import TerminalSelectionModal from "./TerminalSelectionModal"
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

// 发布状态组件
const PublishStatusBadge = ({ agent }: { agent: any }) => {
	const [serverStatus, setServerStatus] = useState<'checking' | 'running' | 'stopped'>('checking')
	const publishInfo = agent.publishInfo || {}
	const isPublished = agent.isPublished || false
	
	useEffect(() => {
		if (!isPublished || !publishInfo.serverUrl) {
			setServerStatus('stopped')
			return
		}

		const checkServerHealth = async () => {
			try {
				const response = await fetch(`${publishInfo.serverUrl}/health`, {
					method: 'GET',
					signal: AbortSignal.timeout(3000) // 3秒超时
				})
				setServerStatus(response.ok ? 'running' : 'stopped')
			} catch (error) {
				setServerStatus('stopped')
			}
		}

		// 立即检查一次
		checkServerHealth()
		
		// 每10秒检查一次
		const interval = setInterval(checkServerHealth, 10000)
		
		return () => clearInterval(interval)
	}, [isPublished, publishInfo.serverUrl])
	
	if (!isPublished) {
		return null
	}
	
	const terminalIcon = publishInfo.terminalType === 'cloud' ? '☁️' : '💻'
	const terminalText = publishInfo.terminalType === 'cloud' ? '云端' : '本地'
	
	const getStatusBadge = () => {
		switch (serverStatus) {
			case 'checking':
				return (
					<span className="px-1.5 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded flex items-center gap-1">
						<span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
						检查中
					</span>
				)
			case 'running':
				return (
					<span className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded flex items-center gap-1">
						<span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
						运行中
					</span>
				)
			case 'stopped':
				return (
					<span className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded flex items-center gap-1">
						<span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
						已停止
					</span>
				)
		}
	}
	
	return (
		<div className="flex items-center gap-1.5">
			{getStatusBadge()}
			<span className="px-1.5 py-0.5 text-xs bg-blue-500/20 text-blue-400 rounded flex items-center gap-1">
				{terminalIcon} {terminalText}
			</span>
		</div>
	)
}

// 发布详情组件
const PublishDetails = ({ agent, isExpanded }: { agent: any; isExpanded: boolean }) => {
	const publishInfo = agent.publishInfo || {}
	const isPublished = agent.isPublished || false
	
	if (!isPublished || !publishInfo.serverUrl || !isExpanded) {
		return null
	}
	
	return (
		<div className="mt-2 p-2 bg-vscode-list-hoverBackground/30 rounded border border-vscode-input-border">
			<div className="grid grid-cols-2 gap-2 text-xs">
				<div className="flex justify-between">
					<span className="text-vscode-foreground/70">地址:</span>
					<span className="font-mono text-blue-400 truncate ml-1">{publishInfo.serverUrl}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-vscode-foreground/70">端口:</span>
					<span className="font-mono text-blue-400">{publishInfo.serverPort}</span>
				</div>
				{publishInfo.publishedAt && (
					<div className="col-span-2 flex justify-between">
						<span className="text-vscode-foreground/70">发布时间:</span>
						<span className="text-vscode-foreground/70">
							{new Date(publishInfo.publishedAt).toLocaleString('zh-CN', {
								month: '2-digit',
								day: '2-digit',
								hour: '2-digit',
								minute: '2-digit'
							})}
						</span>
					</div>
				)}
			</div>
		</div>
	)
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


const AgentsView: React.FC<AgentsViewProps> = ({ onDone }) => {
	const { t } = useTranslation()
	const [agents, setAgents] = useState<Agent[]>([...mockBuiltinAgents])
	const [customAgents, setCustomAgents] = useState<Agent[]>([])
	const [loading, setLoading] = useState(false)
	const [showCreateAgent, setShowCreateAgent] = useState(false)
	const [showApiConfig, setShowApiConfig] = useState(false)
	const [showModeConfig, setShowModeConfig] = useState(false)
	const [showTaskModal, setShowTaskModal] = useState(false)
	const [selectedTaskData, setSelectedTaskData] = useState<AgentTemplateData | null>(null)
	const [editMode, setEditMode] = useState(false)
	const [editAgentData, setEditAgentData] = useState<any>(null)
	const [taskListEnabled, setTaskListEnabled] = useState(true)
	const [autoRunEnabled, setAutoRunEnabled] = useState(true)
	const [workflowEnabled, setWorkflowEnabled] = useState(false)
	const [triggerEnabled, setTriggerEnabled] = useState(false)
	const [cronRule, setCronRule] = useState("0 9 * * *") // 默认每天9点
	const [taskStatusNotification, setTaskStatusNotification] = useState({ detail: true, voice: true })
	const [soundVolume, setSoundVolume] = useState(100)
	const [blacklistCommands] = useState(["rm", "kill", "chmod"])
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)
	const [showTerminalModal, setShowTerminalModal] = useState(false)
	const [selectedAgentForPublish, setSelectedAgentForPublish] = useState<Agent | null>(null)
	const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null)

	// 加载智能体列表
	const loadAgents = useCallback(() => {
		console.log("📤 [AgentsView] Loading agents list...")
		setLoading(true)
		vscode.postMessage({
			type: "listAgents",
			agentListOptions: {} // 可以添加过滤和排序选项
		})
	}, [])

	// Listen for messages from extension
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			
			if (message.type === "action") {
				switch (message.action) {
					case "createAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体创建成功，关闭创建页面并刷新列表
							setShowCreateAgent(false)
							setSelectedTaskData(null)
							loadAgents() // 重新加载智能体列表
						} else {
							console.error("Failed to create agent:", message.error)
						}
						break
					
					case "listAgentsResult":
						setLoading(false)
						if (message.success && message.agents) {
							console.log("📋 [AgentsView] Received agents list from backend:", {
								count: message.agents.length,
								agentIds: message.agents.map((a: any) => a.id),
								agentIdsDetailed: message.agents.map((a: any) => ({ id: a.id, name: a.name })),
								agents: message.agents
							})
							console.log("🔍 [AgentsView] Agent IDs in detail:", message.agents.map((a: any) => a.id))
							
							// 转换后端数据为前端格式
							const transformedAgents = message.agents.map((agent: any) => ({
								id: agent.id,
								name: agent.name,
								description: agent.roleDescription || "",
								type: "custom" as const,
								status: agent.isActive ? "active" as const : "inactive" as const,
								icon: agent.avatar,
								// 发布状态相关字段
								isPublished: agent.isPublished || false,
								publishInfo: agent.publishInfo || null
							}))
							
							console.log("🔄 [AgentsView] Transformed agents for frontend:", {
								count: transformedAgents.length,
								agentIds: transformedAgents.map((a: any) => a.id),
								transformedAgents
							})
							console.log("🔍 [AgentsView] Transformed agent IDs in detail:", transformedAgents.map((a: any) => a.id))
							
							setCustomAgents(transformedAgents)
						} else {
							console.error("❌ [AgentsView] Failed to list agents:", message.error)
						}
						break
					
					case "getAgentResult":
						setLoading(false)
						if (message.success && message.agent) {
							// 设置编辑模式和智能体数据
							setEditAgentData(message.agent)
							setEditMode(true)
							setShowCreateAgent(true) // 复用创建页面
						} else {
							console.error("Failed to get agent:", message.error)
						}
						break
					
					case "updateAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体更新成功，关闭编辑页面并刷新列表
							setShowCreateAgent(false)
							setEditMode(false)
							setEditAgentData(null)
							setSelectedTaskData(null)
							loadAgents() // 重新加载智能体列表
						} else {
							console.error("Failed to update agent:", message.error)
						}
						break
					
					case "deleteAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体删除成功，刷新列表
							loadAgents() // 重新加载智能体列表
						} else {
							console.error("Failed to delete agent:", message.error)
						}
						break
					
					case "publishAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体发布成功
							console.log("🎉 [AgentsView] Agent published successfully:", message.agentId)
							
							// 检查是否有更新后的智能体数据
							console.log("🔍 [AgentsView] Checking updated agent data:", {
								hasUpdatedAgent: !!message.updatedAgent,
								updatedAgentId: message.updatedAgent?.id,
								isPublished: message.updatedAgent?.isPublished,
								publishInfo: message.updatedAgent?.publishInfo
							})
							
							// 如果返回了更新后的智能体数据，直接更新列表
							if (message.updatedAgent) {
								console.log("🔄 [AgentsView] Updating state with fresh agent data")
								console.log("🔄 [AgentsView] Before state update, current agents:", agents.length)
								console.log("🔄 [AgentsView] Updated agent data:", {
									id: message.updatedAgent.id,
									name: message.updatedAgent.name,
									isPublished: message.updatedAgent.isPublished,
									publishInfo: message.updatedAgent.publishInfo
								})
								console.log("🔍 [AgentsView] Debug agentId vs updatedAgent.id:")
								console.log("  messageAgentId:", message.agentId)
								console.log("  updatedAgentId:", message.updatedAgent.id)
								console.log("  areEqual:", message.agentId === message.updatedAgent.id)
								console.log("🔍 [AgentsView] Current agents IDs:", agents.map(a => a.id))
								
								setCustomAgents(prevAgents => {
									console.log("🔧 [AgentsView] setCustomAgents called, updating custom agent list")
									const targetId = message.updatedAgent.id // 使用updatedAgent的id
									const newAgents = prevAgents.map(agent => {
										if (agent.id === targetId) {
											const updatedAgent = {
												...agent,
												isPublished: message.updatedAgent.isPublished,
												publishInfo: message.updatedAgent.publishInfo
											}
											console.log("🎯 [AgentsView] Found and updated target agent:", {
												id: updatedAgent.id,
												isPublished: updatedAgent.isPublished,
												publishInfo: updatedAgent.publishInfo
											})
											return updatedAgent
										}
										return agent
									})
									console.log("🔄 [AgentsView] After state update, updated custom agents:", newAgents.length)
									const updatedTarget = newAgents.find(a => a.id === targetId)
									console.log("🔄 [AgentsView] Found updated agent in new list:", updatedTarget)
									return newAgents
								})
								
								console.log("✅ [AgentsView] State updated with new server info:", {
									agentId: message.agentId,
									serverUrl: message.updatedAgent.publishInfo?.serverUrl,
									serverPort: message.updatedAgent.publishInfo?.serverPort
								})
							} else {
								console.log("⚠️ [AgentsView] No updated agent data, reloading entire list")
								// 重新加载智能体列表以更新发布状态
								loadAgents()
							}
						} else {
							console.error("❌ [AgentsView] Failed to publish agent:", message.error)
						}
						break
					
					case "stopAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体停止成功
							console.log("Agent stopped successfully:", message.agentId)
							// 重新加载智能体列表以更新状态
							loadAgents()
						} else {
							// 停止失败或用户取消
							if (message.error !== "用户取消操作") {
								console.error("Failed to stop agent:", message.error)
							}
						}
						break
				}
			} else if (message.type === "createAgentFromTask" && message.templateData) {
				// Set the template data and show the create agent view
				setSelectedTaskData(message.templateData)
				setShowCreateAgent(true)
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [loadAgents])

	// 在组件挂载时加载智能体列表
	useEffect(() => {
		loadAgents()
	}, [loadAgents])

	// 智能体操作处理函数
	const handleRunAgent = useCallback((agent: Agent) => {
		// 检查智能体是否已发布，决定执行模式
		const agentData = agent as any // 转换为包含发布信息的类型
		const isPublished = agentData.isPublished || false
		const publishInfo = agentData.publishInfo || null
		
		console.log('[AgentsView] 🚀 Running agent:', agent.name)
		console.log('[AgentsView] 📊 Agent data:', {
			id: agent.id,
			name: agent.name,
			isPublished,
			publishInfo,
			executionMode: isPublished ? "a2a" : "direct"
		})
		
		// 在新任务面板中加载智能体，发送消息给扩展
		vscode.postMessage({
			type: "startAgentTask",
			agentId: agent.id,
			agentName: agent.name,
			// A2A模式相关参数
			executionMode: isPublished ? "a2a" : "direct",
			a2aServerUrl: isPublished && publishInfo ? publishInfo.serverUrl : null,
			a2aServerPort: isPublished && publishInfo ? publishInfo.serverPort : null
		})
		// 关闭智能体面板，切换到聊天界面
		onDone()
	}, [onDone])

	const handleEditAgent = useCallback(async (agent: Agent) => {
		setLoading(true)
		try {
			// 获取完整的智能体数据
			vscode.postMessage({
				type: "getAgent" as const,
				agentId: agent.id
			})
			
			// 等待getAgent响应，然后在message listener中处理
			setOpenDropdownId(null)
		} catch (error) {
			console.error("Error fetching agent for edit:", error)
			setLoading(false)
		}
	}, [])

	const handleDeleteAgent = useCallback(async (agent: Agent) => {
		setLoading(true)
		vscode.postMessage({
			type: "deleteAgent",
			agentId: agent.id,
			agentName: agent.name
		})
		setOpenDropdownId(null)
	}, [])

	const handlePublishAgent = useCallback(async (agent: Agent) => {
		// 如果已经发布，显示停止选项；否则显示发布选项
		if ((agent as any).isPublished) {
			handleStopAgent(agent)
		} else {
			setSelectedAgentForPublish(agent)
			setShowTerminalModal(true)
		}
		setOpenDropdownId(null)
	}, [])

	const handleStopAgent = useCallback(async (agent: Agent) => {
		setLoading(true)
		vscode.postMessage({
			type: "stopAgent",
			agentId: agent.id,
			agentName: agent.name
		})
	}, [])

	const handleShareAgent = useCallback(async (agent: Agent) => {
		// TODO: 实现分享智能体功能
		console.log("Share/unshare agent:", agent)
		setOpenDropdownId(null)
	}, [])

	const handleDropdownToggle = useCallback((agentId: string) => {
		setOpenDropdownId(openDropdownId === agentId ? null : agentId)
	}, [openDropdownId])

	const handleCardExpand = useCallback((agentId: string) => {
		setExpandedAgentId(expandedAgentId === agentId ? null : agentId)
	}, [expandedAgentId])

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = () => {
			setOpenDropdownId(null)
		}
		
		if (openDropdownId) {
			document.addEventListener('click', handleClickOutside)
			return () => document.removeEventListener('click', handleClickOutside)
		}
	}, [openDropdownId])

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
		// 清理编辑模式状态
		if (editMode) {
			setEditMode(false)
			setEditAgentData(null)
		}
	}, [editMode])

	const handleCreateAgentCancel = useCallback(() => {
		setShowCreateAgent(false)
		// 清理编辑模式状态
		if (editMode) {
			setEditMode(false)
			setEditAgentData(null)
		}
	}, [editMode])

	const handleTerminalSelect = useCallback((terminal: any) => {
		if (selectedAgentForPublish) {
			setLoading(true)
			vscode.postMessage({
				type: "publishAgent",
				agentId: selectedAgentForPublish.id,
				agentName: selectedAgentForPublish.name,
				terminal: terminal
			})
		}
		setShowTerminalModal(false)
		setSelectedAgentForPublish(null)
	}, [selectedAgentForPublish])

	const handleTerminalModalClose = useCallback(() => {
		setShowTerminalModal(false)
		setSelectedAgentForPublish(null)
	}, [])

	const handleCreateAgentSubmit = useCallback((agentData: any) => {
		// CreateAgentView已经发送了createAgent消息，这里只需要设置loading状态
		setLoading(true)
	}, [])

	const handleAgentUpdate = useCallback((agentData: any) => {
		// CreateAgentView已经发送了updateAgent消息，这里只需要设置loading状态
		setLoading(true)
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
				editMode={editMode}
				editData={editAgentData}
				onUpdate={handleAgentUpdate}
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
						{loading && customAgents.length === 0 ? (
							<div className="text-center py-8 text-vscode-foreground/70">
								<div className="text-sm">加载中...</div>
							</div>
						) : customAgents.length === 0 ? (
							<div className="text-center py-8 text-vscode-foreground/70">
								<div className="text-sm">暂无智能体</div>
								<div className="text-xs mt-1">点击创建按钮开始创建您的第一个智能体</div>
							</div>
						) : (
							customAgents.map((agent) => {
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
									className="bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded-md border border-vscode-input-border transition-colors group"
								>
									<div 
										className="flex items-center justify-between p-3 cursor-pointer"
										onClick={() => handleCardExpand(agent.id)}
									>
										<div className="flex items-center gap-3 flex-1 min-w-0">
											<div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0", agentStyle.bg)}>
												{agentStyle.icon}
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<div className="font-bold text-sm text-vscode-foreground truncate">{agent.name}</div>
													<PublishStatusBadge agent={agent} />
												</div>
												<div className="text-xs text-vscode-foreground/70 truncate mt-0.5">{agent.description}</div>
											</div>
										</div>
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										{/* 运行按钮 */}
										<StandardTooltip content="运行智能体">
											<button 
												onClick={(e) => {
													e.stopPropagation()
													handleRunAgent(agent)
												}}
												className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
											>
												<Play size={14} />
											</button>
										</StandardTooltip>
										
										{/* 更多操作下拉菜单 */}
										<div className="relative">
											<StandardTooltip content="更多操作">
												<button 
													onClick={(e) => {
														e.stopPropagation()
														handleDropdownToggle(agent.id)
													}}
													className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
												>
													<MoreHorizontal size={14} />
												</button>
											</StandardTooltip>
											
											{/* 下拉菜单内容 */}
											{openDropdownId === agent.id && (
												<div 
													className="absolute right-0 top-full mt-1 z-10 bg-vscode-dropdown-background border border-vscode-dropdown-border rounded-md shadow-lg min-w-32"
													onClick={(e) => e.stopPropagation()}
												>
													<button
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleEditAgent(agent)
														}}
														className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2"
													>
														<Edit size={12} />
														修改
													</button>
													<button
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handlePublishAgent(agent)
														}}
														className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2"
													>
														{(agent as any).isPublished ? (
															<>
																<Square size={12} />
																停止
															</>
														) : (
															<>
																<Upload size={12} />
																发布
															</>
														)}
													</button>
													<button
														onClick={(e) => {
															e.preventDefault()
															e.stopPropagation()
															handleDeleteAgent(agent)
														}}
														className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2"
													>
														<Trash2 size={12} />
														删除
													</button>
													<button
														onClick={() => handleShareAgent(agent)}
														className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2"
													>
														{/* TODO: 根据分享状态显示不同的图标 */}
														<Share size={12} />
														分享
													</button>
												</div>
											)}
										</div>
									</div>
									</div>
									<PublishDetails agent={agent} isExpanded={expandedAgentId === agent.id} />
								</div>
							)
						})
					)}
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

		{/* Terminal Selection Modal */}
		<TerminalSelectionModal
			isOpen={showTerminalModal}
			onClose={handleTerminalModalClose}
			onSelect={handleTerminalSelect}
			agentName={selectedAgentForPublish?.name || ""}
		/>
		</>
	)
}

export default AgentsView