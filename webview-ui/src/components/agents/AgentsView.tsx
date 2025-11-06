import React, { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { MoreHorizontal, Info, Play, Edit, Trash2, Upload } from "lucide-react"
import ActionBar from "./ActionBar"
import TaskListModal from "./TaskListModal"
import TerminalSelectionModal from "./TerminalSelectionModal"
import type { AgentTemplateData } from "./utils/taskToAgentTemplate"

import { vscode } from "@src/utils/vscode"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import { useExtensionState } from "@src/context/ExtensionStateContext"
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
	type: "custom"
	status: "active" | "inactive"
	icon?: string
}

interface AgentsViewProps {
	onDone: () => void
}

// 发布状态组件
const PublishStatusBadge = ({
	agent,
	onStatusChange,
}: {
	agent: any
	onStatusChange?: (status: "checking" | "running" | "stopped") => void
}) => {
	const [serverStatus, setServerStatus] = useState<"checking" | "running" | "stopped">("checking")
	const [httpHealthy, setHttpHealthy] = useState(false)
	const [wsHealthy, setWsHealthy] = useState(false)
	const publishInfo = agent.publishInfo || {}
	const isPublished = agent.isPublished || false

	useEffect(() => {
		// 🎯 如果当前未发布，但有历史端口信息，直接显示为停止状态
		if (!isPublished) {
			setServerStatus("stopped")
			setHttpHealthy(false)
			setWsHealthy(false)
			return
		}

		if (!publishInfo.serverUrl) {
			setServerStatus("stopped")
			setHttpHealthy(false)
			setWsHealthy(false)
			return
		}

		// 监听健康检查结果
		const handleHealthCheckResult = (event: MessageEvent) => {
			const message = event.data
			if (
				message.type === "action" &&
				message.action === "checkAgentHealthResult" &&
				message.agentId === agent.id
			) {
				if (message.success) {
					// HTTP 和 WebSocket 都正常才显示运行中
					const healthy = message.healthy || false
					const newHttpHealthy = message.httpHealthy || false
					const newWsHealthy = message.wsHealthy || false

					setHttpHealthy(newHttpHealthy)
					setWsHealthy(newWsHealthy)

					const newStatus = healthy ? "running" : "stopped"
					setServerStatus(newStatus)
					onStatusChange?.(newStatus)
				} else {
					setServerStatus("stopped")
					setHttpHealthy(false)
					setWsHealthy(false)
					onStatusChange?.("stopped")
				}
			}
		}

		window.addEventListener("message", handleHealthCheckResult)

		const checkServerHealth = async () => {
			try {
				// 使用后端的健康检查命令，同时检测 HTTP 和 WebSocket 状态
				vscode.postMessage({
					type: "checkAgentHealth",
					agentId: agent.id,
				})
			} catch (_error) {
				setServerStatus("stopped")
				setHttpHealthy(false)
				setWsHealthy(false)
				onStatusChange?.("stopped")
			}
		}

		// 立即检查一次
		checkServerHealth()

		// 每10秒检查一次
		const interval = setInterval(checkServerHealth, 10000)

		return () => {
			clearInterval(interval)
			window.removeEventListener("message", handleHealthCheckResult)
		}
	}, [isPublished, publishInfo.serverUrl, agent.id, onStatusChange])

	// 🎯 UX优化：对于有历史发布信息但当前停止的智能体，也显示状态
	if (!isPublished && !publishInfo.serverPort) {
		return null
	}

	const terminalIcon = publishInfo.terminalType === "cloud" ? "☁️" : "💻"
	const terminalText = publishInfo.terminalType === "cloud" ? "云端" : "本地"

	const getStatusBadge = () => {
		const getStatusTitle = () => {
			if (serverStatus === "checking") return "正在检查智能体服务器状态..."
			if (serverStatus === "running") {
				return `智能体服务器运行中\n• HTTP 服务: ${httpHealthy ? "✓ 正常" : "✗ 异常"}\n• IM 连接: ${wsHealthy ? "✓ 已连接" : "✗ 未连接（不影响智能体运行）"}`
			}
			return `智能体服务器已停止\n• HTTP 服务: ${httpHealthy ? "✓ 正常" : "✗ 未响应"}\n• IM 连接: ${wsHealthy ? "✓ 已连接" : "✗ 未连接"}`
		}

		switch (serverStatus) {
			case "checking":
				return (
					<span
						className="px-1.5 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 rounded flex items-center gap-1"
						title={getStatusTitle()}>
						<span className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"></span>
						检查中
					</span>
				)
			case "running":
				return (
					<span
						className="px-1.5 py-0.5 text-xs bg-green-500/20 text-green-400 rounded flex items-center gap-1"
						title={getStatusTitle()}>
						<span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
						运行中
					</span>
				)
			case "stopped":
				return (
					<span
						className="px-1.5 py-0.5 text-xs bg-red-500/20 text-red-400 rounded flex items-center gap-1"
						title={getStatusTitle()}>
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
							{new Date(publishInfo.publishedAt).toLocaleString("zh-CN", {
								month: "2-digit",
								day: "2-digit",
								hour: "2-digit",
								minute: "2-digit",
							})}
						</span>
					</div>
				)}
			</div>
		</div>
	)
}

const AgentsView: React.FC<AgentsViewProps> = ({ onDone }) => {
	const { t } = useTranslation()
	const { listApiConfigMeta } = useExtensionState()
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
	const [modifiedApiConfig, setModifiedApiConfig] = useState<any>(null)
	const [selectedProfileConfig, setSelectedProfileConfig] = useState<any>(null)
	const [isAgentMode, setIsAgentMode] = useState(false) // 标识是否为智能体模式
	const [agentConfigSaveCallback, setAgentConfigSaveCallback] = useState<((config: any) => void) | null>(null)

	// ✅ 新增：保存 CreateAgentView 的临时状态，防止跳转页面时数据丢失
	const [createAgentDraftData, setCreateAgentDraftData] = useState<any>(null)

	// 加载智能体列表
	const loadAgents = useCallback(() => {
		console.log("📤 [AgentsView] Loading agents list...")
		setLoading(true)
		vscode.postMessage({
			type: "listAgents",
			agentListOptions: {}, // 可以添加过滤和排序选项
		})
	}, [])

	// Listen for messages from extension
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data

			if (message.type === "action") {
				switch (message.action) {
					case "checkAgentHealthResult":
						// 健康检查结果需要在 PublishStatusBadge 中处理
						// 由于 badge 是独立组件，我们需要通过事件或状态管理来传递结果
						// 为了简化，我们可以让 badge 直接监听这个消息
						break

					case "getApiConfigurationByIdResult":
						if (message.success && message.config) {
							console.log(
								"[AgentsView] Received full config for profile:",
								message.configId,
								message.config,
							)
							// 保存完整的配置数据
							setSelectedProfileConfig(message.config)
							// 打开API配置页面
							setShowApiConfig(true)
						} else {
							console.error(
								"[AgentsView] Failed to get config for profile:",
								message.configId,
								message.error,
							)
							// 失败时使用元数据作为备选
							const profileMeta = listApiConfigMeta?.find((config) => config.id === message.configId)
							if (profileMeta) {
								setSelectedProfileConfig(profileMeta)
								setShowApiConfig(true)
							}
						}
						break

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
								agents: message.agents,
							})
							console.log(
								"🔍 [AgentsView] Agent IDs in detail:",
								message.agents.map((a: any) => a.id),
							)

							// 转换后端数据为前端格式
							const transformedAgents = message.agents.map((agent: any) => ({
								id: agent.id,
								name: agent.name,
								description: agent.roleDescription || "",
								type: "custom" as const,
								status: agent.isActive ? ("active" as const) : ("inactive" as const),
								icon: agent.avatar,
								// 发布状态相关字段
								isPublished: agent.isPublished || false,
								publishInfo: agent.publishInfo || null,
							}))

							console.log("🔄 [AgentsView] Transformed agents for frontend:", {
								count: transformedAgents.length,
								agentIds: transformedAgents.map((a: any) => a.id),
								transformedAgents,
							})
							console.log(
								"🔍 [AgentsView] Transformed agent IDs in detail:",
								transformedAgents.map((a: any) => a.id),
							)

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
								publishInfo: message.updatedAgent?.publishInfo,
							})

							// 如果返回了更新后的智能体数据，直接更新列表
							if (message.updatedAgent) {
								console.log("🔄 [AgentsView] Updating state with fresh agent data")
								console.log("🔄 [AgentsView] Before state update, current agents:", customAgents.length)
								console.log("🔄 [AgentsView] Updated agent data:", {
									id: message.updatedAgent.id,
									name: message.updatedAgent.name,
									isPublished: message.updatedAgent.isPublished,
									publishInfo: message.updatedAgent.publishInfo,
								})
								console.log("🔍 [AgentsView] Debug agentId vs updatedAgent.id:")
								console.log("  messageAgentId:", message.agentId)
								console.log("  updatedAgentId:", message.updatedAgent.id)
								console.log("  areEqual:", message.agentId === message.updatedAgent.id)
								console.log(
									"🔍 [AgentsView] Current agents IDs:",
									customAgents.map((a: any) => a.id),
								)

								setCustomAgents((prevAgents) => {
									console.log("🔧 [AgentsView] setCustomAgents called, updating custom agent list")
									const targetId = message.updatedAgent.id // 使用updatedAgent的id
									const newAgents = prevAgents.map((agent) => {
										if (agent.id === targetId) {
											const updatedAgent = {
												...agent,
												isPublished: message.updatedAgent.isPublished,
												publishInfo: message.updatedAgent.publishInfo,
											}
											console.log("🎯 [AgentsView] Found and updated target agent:", {
												id: updatedAgent.id,
												isPublished: updatedAgent.isPublished,
												publishInfo: updatedAgent.publishInfo,
											})
											return updatedAgent
										}
										return agent
									})
									console.log(
										"🔄 [AgentsView] After state update, updated custom agents:",
										newAgents.length,
									)
									const updatedTarget = newAgents.find((a) => a.id === targetId)
									console.log("🔄 [AgentsView] Found updated agent in new list:", updatedTarget)
									return newAgents
								})

								console.log("✅ [AgentsView] State updated with new server info:", {
									agentId: message.agentId,
									serverUrl: message.updatedAgent.publishInfo?.serverUrl,
									serverPort: message.updatedAgent.publishInfo?.serverPort,
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

					case "startAgentResult":
						setLoading(false)
						if (message.success) {
							// 智能体启动成功
							console.log("🚀 [AgentsView] Agent started successfully:", message.agentId)

							// 🎯 如果返回了更新后的智能体数据，直接更新状态
							if (message.updatedAgent) {
								console.log("🔄 [AgentsView] Updating state with fresh agent data after start")
								setCustomAgents((prevAgents) => {
									return prevAgents.map((agent) => {
										if (agent.id === message.updatedAgent.id) {
											return {
												...agent,
												isPublished: message.updatedAgent.isPublished,
												publishInfo: message.updatedAgent.publishInfo,
											}
										}
										return agent
									})
								})
							} else {
								// 重新加载智能体列表
								loadAgents()
							}
						} else {
							console.error("❌ [AgentsView] Failed to start agent:", message.error)
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
	}, [loadAgents, customAgents, listApiConfigMeta])

	// 在组件挂载时加载智能体列表
	useEffect(() => {
		loadAgents()
	}, [loadAgents])

	// 智能体操作处理函数
	const handleRunAgent = useCallback(
		(agent: Agent) => {
			// 检查智能体是否已发布，决定执行模式
			const agentData = agent as any // 转换为包含发布信息的类型
			const isPublished = agentData.isPublished || false
			const publishInfo = agentData.publishInfo || null

			console.log("[AgentsView] 🚀 Running agent:", agent.name)
			console.log("[AgentsView] 📊 Agent data:", {
				id: agent.id,
				name: agent.name,
				isPublished,
				publishInfo,
				executionMode: isPublished ? "a2a" : "direct",
			})

			// 在新任务面板中加载智能体，发送消息给扩展
			vscode.postMessage({
				type: "startAgentTask",
				agentId: agent.id,
				agentName: agent.name,
				// A2A模式相关参数
				executionMode: isPublished ? "a2a" : "direct",
				a2aServerUrl: isPublished && publishInfo ? publishInfo.serverUrl : null,
				a2aServerPort: isPublished && publishInfo ? publishInfo.serverPort : null,
			})

			// ✅ 修复：立即关闭智能体面板，切换到聊天界面
			// 不等待后端响应，让用户立即看到界面切换
			// 后端会通过postStateToWebview异步更新UI状态
			onDone()
		},
		[onDone],
	)

	const handleEditAgent = useCallback(async (agent: Agent) => {
		setLoading(true)
		try {
			// 获取完整的智能体数据
			vscode.postMessage({
				type: "getAgent" as const,
				agentId: agent.id,
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
			agentName: agent.name,
		})
		setOpenDropdownId(null)
	}, [])

	const handlePublishAgent = useCallback(async (agent: Agent) => {
		const agentData = agent as any

		// 🎯 简化方案：根据健康状态判断行为
		// 如果有发布信息，检查服务器健康状态
		if (agentData.publishInfo?.serverPort) {
			// 有历史发布信息，检查服务器是否运行
			try {
				const response = await fetch(`${agentData.publishInfo.serverUrl}/health`, {
					method: "GET",
					signal: AbortSignal.timeout(3000),
				})

				if (response.ok) {
					// 服务器运行中：停止
					console.log(`🛑 [AgentsView] Agent ${agent.id} server is running, stopping`)
					handleStopAgent(agent)
				} else {
					// 服务器已停止：重启
					console.log(`🎯 [AgentsView] Agent ${agent.id} server is stopped, restarting`)
					handleRestartAgent(agent)
				}
			} catch (_error) {
				// 网络错误或超时：服务器已停止，重启
				console.log(`🎯 [AgentsView] Agent ${agent.id} server is not responding, restarting`)
				handleRestartAgent(agent)
			}
		} else {
			// 从未发布过：显示终端选择对话框
			console.log(`🎯 [AgentsView] Agent ${agent.id} never published, showing terminal modal`)
			setSelectedAgentForPublish(agent)
			setShowTerminalModal(true)
		}
		setOpenDropdownId(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const handleStopAgent = useCallback(async (agent: Agent) => {
		setLoading(true)
		vscode.postMessage({
			type: "stopAgent",
			agentId: agent.id,
			agentName: agent.name,
		})
	}, [])

	const handleRestartAgent = useCallback(async (agent: Agent) => {
		const agentData = agent as any
		console.log(`🎯 [AgentsView] Restarting agent ${agent.id} with previous publishInfo:`, agentData.publishInfo)

		setLoading(true)

		// 🎯 修复：使用 startAgent 命令而不是 publishAgent
		vscode.postMessage({
			type: "startAgent",
			agentId: agent.id,
			agentName: agent.name,
		})
	}, [])

	const handleDropdownToggle = useCallback(
		(agentId: string) => {
			setOpenDropdownId(openDropdownId === agentId ? null : agentId)
		},
		[openDropdownId],
	)

	const handleCardExpand = useCallback(
		(agentId: string) => {
			setExpandedAgentId(expandedAgentId === agentId ? null : agentId)
		},
		[expandedAgentId],
	)

	// 点击外部关闭下拉菜单
	useEffect(() => {
		const handleClickOutside = () => {
			setOpenDropdownId(null)
		}

		if (openDropdownId) {
			document.addEventListener("click", handleClickOutside)
			return () => document.removeEventListener("click", handleClickOutside)
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
		// ✅ 清空临时草稿数据
		setCreateAgentDraftData(null)
	}, [editMode])

	const handleCreateAgentCancel = useCallback(() => {
		setShowCreateAgent(false)
		// 清理编辑模式状态
		if (editMode) {
			setEditMode(false)
			setEditAgentData(null)
		}
		// ✅ 清空临时草稿数据
		setCreateAgentDraftData(null)
	}, [editMode])

	const handleTerminalSelect = useCallback(
		(terminal: any) => {
			if (selectedAgentForPublish) {
				setLoading(true)
				vscode.postMessage({
					type: "publishAgent",
					agentId: selectedAgentForPublish.id,
					agentName: selectedAgentForPublish.name,
					terminal: terminal,
				})
			}
			setShowTerminalModal(false)
			setSelectedAgentForPublish(null)
		},
		[selectedAgentForPublish],
	)

	const handleTerminalModalClose = useCallback(() => {
		setShowTerminalModal(false)
		setSelectedAgentForPublish(null)
	}, [])

	const handleCreateAgentSubmit = useCallback((_agentData: any) => {
		// CreateAgentView已经发送了createAgent消息，这里只需要设置loading状态
		setLoading(true)
	}, [])

	const handleAgentUpdate = useCallback((_agentData: any) => {
		// CreateAgentView已经发送了updateAgent消息，这里只需要设置loading状态
		setLoading(true)
	}, [])

	const handleShowApiConfig = useCallback(
		async (selectedConfigId?: string, currentConfig?: any, agentMode?: boolean) => {
			console.log("[AgentsView] handleShowApiConfig called with:", { selectedConfigId, currentConfig, agentMode })

			// 设置智能体模式
			setIsAgentMode(!!agentMode)

			// 如果已经有完整的currentConfig（有apiModelId字段），直接使用
			if (currentConfig && currentConfig.apiModelId) {
				console.log("[AgentsView] Using provided FULL current config:", currentConfig)
				setSelectedProfileConfig(currentConfig)
				setShowApiConfig(true)
				return
			}

			// 如果没有currentConfig但有selectedConfigId，使用新的API获取完整配置
			if (selectedConfigId) {
				console.log(
					"[AgentsView] Fetching full config for profile WITHOUT changing global config:",
					selectedConfigId,
				)
				// 使用新的API来获取完整配置（不会改变全局配置）
				vscode.postMessage({
					type: "getApiConfigurationById",
					text: selectedConfigId,
				})
				// 收到响应后会在 getApiConfigurationByIdResult 中处理
				return
			}

			// 都没有的话，直接打开配置页面
			console.log("[AgentsView] Opening API config without specific profile")
			setShowApiConfig(true)
		},
		[],
	)

	const handleApiConfigBack = useCallback(() => {
		setShowApiConfig(false)
		// 清理选中profile配置
		setSelectedProfileConfig(null)
		setIsAgentMode(false) // 重置智能体模式
	}, [])

	const handleApiConfigChanged = useCallback(
		(newConfig: any) => {
			console.log("[AgentsView] API config changed, isAgentMode:", isAgentMode, "newConfig:", newConfig)

			if (isAgentMode && agentConfigSaveCallback) {
				// 智能体模式：直接调用回调
				console.log("[AgentsView] Calling agent config save callback directly")
				agentConfigSaveCallback(newConfig)
			} else {
				// 普通模式：使用全局状态
				setModifiedApiConfig(newConfig)
			}

			setShowApiConfig(false)
		},
		[isAgentMode, agentConfigSaveCallback],
	)

	const handleShowModeConfig = useCallback(() => {
		setShowModeConfig(true)
	}, [])

	const handleModeConfigBack = useCallback(() => {
		setShowModeConfig(false)
	}, [])

	const handleBlacklistCommand = useCallback((command: string) => {
		console.log(`Adding blacklist command: ${command}`)
	}, [])

	// Show API config view if requested
	if (showApiConfig) {
		return (
			<ApiConfigView
				onBack={handleApiConfigBack}
				onConfigChanged={handleApiConfigChanged}
				readOnlyMode={true}
				initialConfig={selectedProfileConfig}
				enableSaveButton={true}
			/>
		)
	}

	// Show mode config view if requested
	if (showModeConfig) {
		return <ModeConfigView onBack={handleModeConfigBack} />
	}

	// Show create agent view if requested
	if (showCreateAgent) {
		return (
			<CreateAgentView
				onBack={handleCreateAgentBack}
				onCancel={handleCreateAgentCancel}
				onCreate={handleCreateAgentSubmit}
				onShowApiConfig={(selectedConfigId, currentConfig, agentMode) => {
					// 传递回调给AgentsView
					if (agentMode) {
						const saveCallback = (config: any) => {
							// 关键：在保存配置时带上编辑的配置ID
							const configWithId = { ...config, editingConfigId: selectedConfigId }
							setModifiedApiConfig(configWithId)
						}
						setAgentConfigSaveCallback(() => saveCallback)
					}
					handleShowApiConfig(selectedConfigId, currentConfig, agentMode)
				}}
				onShowModeConfig={handleShowModeConfig}
				onAgentApiConfigSave={(config) => {
					console.log("[AgentsView] Agent API config saved callback:", config)
				}}
				templateData={selectedTaskData}
				editMode={editMode}
				editData={editAgentData}
				onUpdate={handleAgentUpdate}
				modifiedApiConfig={modifiedApiConfig}
				onApiConfigUsed={() => setModifiedApiConfig(null)}
				// ✅ 新增：状态保存和恢复
				draftData={createAgentDraftData}
				onDraftDataChange={setCreateAgentDraftData}
			/>
		)
	}

	return (
		<>
			<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
				{/* Header */}
				<div className="flex items-center justify-between py-4 border-b border-vscode-panel-border">
					<div className="flex items-center gap-2">
						<h1 className="text-lg font-bold">{t("agents:title", "智能体")}</h1>
						<StandardTooltip content="管理和配置您的智能体">
							<Info size={14} className="text-vscode-foreground/60" />
						</StandardTooltip>
					</div>
					<ActionBar onCreateNew={handleCreateAgent} onCreateFromTask={handleCreateFromTask} />
				</div>

				{/* Content */}
				<div className="flex-1 overflow-auto py-4 space-y-5">
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
											case "chat":
												return { bg: "bg-blue-500", icon: "💬" }
											case "builder":
												return { bg: "bg-gray-600", icon: "🛠️" }
											case "builder with mcp":
												return { bg: "bg-green-600", icon: "🔧" }
											default:
												return { bg: "bg-blue-500", icon: "🤖" }
										}
									}
									const agentStyle = getAgentIcon(agent.name)
									return (
										<div
											key={agent.id}
											className="bg-vscode-input-background hover:bg-vscode-list-hoverBackground rounded-md border border-vscode-input-border transition-colors group">
											<div
												className="flex items-center justify-between p-3 cursor-pointer"
												onClick={() => handleCardExpand(agent.id)}>
												<div className="flex items-center gap-3 flex-1 min-w-0">
													{agent.icon ? (
														<div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 bg-vscode-input-background border border-vscode-input-border">
															<img
																src={agent.icon}
																alt={agent.name}
																className="w-full h-full object-cover"
															/>
														</div>
													) : (
														<div
															className={cn(
																"w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0",
																agentStyle.bg,
															)}>
															{agentStyle.icon}
														</div>
													)}
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2">
															<div className="font-bold text-sm text-vscode-foreground truncate">
																{agent.name}
															</div>
															<PublishStatusBadge agent={agent} />
														</div>
														<div className="text-xs text-vscode-foreground/70 truncate mt-0.5">
															{agent.description}
														</div>
													</div>
												</div>
												<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
													{/* 运行按钮 */}
													<StandardTooltip content="调试智能体">
														<button
															onClick={(e) => {
																e.stopPropagation()
																handleRunAgent(agent)
															}}
															className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
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
																className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
																<MoreHorizontal size={14} />
															</button>
														</StandardTooltip>

														{/* 下拉菜单内容 */}
														{openDropdownId === agent.id && (
															<div
																className="absolute right-0 top-full mt-1 z-10 bg-vscode-dropdown-background border border-vscode-dropdown-border rounded-md shadow-lg min-w-32"
																onClick={(e) => e.stopPropagation()}>
																<button
																	onClick={(e) => {
																		e.preventDefault()
																		e.stopPropagation()
																		handleEditAgent(agent)
																	}}
																	className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2">
																	<Edit size={12} />
																	修改
																</button>
																<button
																	onClick={(e) => {
																		e.preventDefault()
																		e.stopPropagation()
																		handlePublishAgent(agent)
																	}}
																	className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2">
																	{(() => {
																		const agentData = agent as any

																		// 🎯 简化方案：根据发布信息显示菜单
																		if (agentData.publishInfo?.serverPort) {
																			// 有发布信息：显示启动/停止（实际状态通过健康检查确定）
																			return (
																				<>
																					<Upload size={12} />
																					启动/停止 (端口{" "}
																					{agentData.publishInfo.serverPort})
																				</>
																			)
																		} else {
																			// 从未发布：显示发布
																			return (
																				<>
																					<Upload size={12} />
																					发布
																				</>
																			)
																		}
																	})()}
																</button>
																<button
																	onClick={(e) => {
																		e.preventDefault()
																		e.stopPropagation()
																		handleDeleteAgent(agent)
																	}}
																	className="w-full px-3 py-2 text-left text-sm text-vscode-dropdown-foreground hover:bg-vscode-list-hoverBackground flex items-center gap-2">
																	<Trash2 size={12} />
																	删除
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

					{/* Task List Section */}
					<div>
						<h2 className="text-sm font-bold text-vscode-foreground/90 mb-3">
							{t("agents:taskList", "任务列表")}
						</h2>
						<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
							<div className="flex-1 pr-3">
								<span className="text-sm text-vscode-foreground">
									{t("agents:taskList", "任务列表")}
								</span>
								<div className="text-xs text-vscode-foreground/70 mt-0.5">
									{t("agents:taskListDesc", "允许agent使用任务来求助或来实现")}
								</div>
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
								<span className="text-sm text-vscode-foreground">
									{t("agents:autoRun", "自动运行命令和 MCP 工具")}
								</span>
								<div className="text-xs text-vscode-foreground/70 mt-0.5">
									{t("agents:autoRunDesc", "使用智能体时，自动运行命令和 MCP 工具")}
								</div>
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
								<div className="text-xs text-vscode-foreground/70 mt-0.5">
									{t("agents:workflowDesc", "运行自行编制并执行n8n、dify、浏览器自动化等工作流")}
								</div>
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
									<span className="text-sm text-vscode-foreground">
										{t("agents:trigger", "触发器")}
									</span>
									<div className="text-xs text-vscode-foreground/70 mt-0.5">
										{t("agents:triggerDesc", "启动定时任务，在指定的时间规则里自动执行智能体")}
									</div>
								</div>
								<ToggleSwitch checked={triggerEnabled} onChange={setTriggerEnabled} />
							</div>

							{/* Cron Rule Panel - 展开面板 */}
							{triggerEnabled && (
								<div className="border-t border-vscode-input-border p-4">
									<CronRulePanel cronRule={cronRule} onChange={setCronRule} />
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
									<div className="text-xs text-vscode-foreground/70 mt-0.5">
										{t("agents:detailNotification", "允许任务完成或失败时收集通知")}
									</div>
								</div>
								<ToggleSwitch
									checked={taskStatusNotification.detail}
									onChange={(checked) =>
										setTaskStatusNotification((prev) => ({ ...prev, detail: checked }))
									}
								/>
							</div>
							<div className="flex items-center justify-between p-3 bg-vscode-input-background rounded-md border border-vscode-input-border">
								<div className="flex-1 pr-3">
									<span className="text-sm text-vscode-foreground">
										{t("agents:voiceNotification", "语音")}
									</span>
								</div>
								<ToggleSwitch
									checked={taskStatusNotification.voice}
									onChange={(checked) =>
										setTaskStatusNotification((prev) => ({ ...prev, voice: checked }))
									}
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
								<span className="text-sm text-vscode-foreground">
									{t("agents:soundVolume", "音量设置")}
								</span>
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
								{t(
									"agents:blacklistDesc",
									"请告知您Mac的系统设置->通知中，以便使用时获得更好的用户体验。",
								)}
							</p>
							<div className="flex flex-wrap gap-1.5 mb-3">
								{blacklistCommands.map((command) => (
									<div
										key={command}
										className="flex items-center gap-1 px-2 py-1 bg-vscode-badge-background text-vscode-badge-foreground rounded-md text-xs font-mono">
										<span>{command}</span>
										<button
											onClick={() => handleBlacklistCommand(command)}
											className="hover:bg-vscode-toolbar-hoverBackground rounded p-0.5 text-vscode-foreground/70 hover:text-vscode-foreground transition-colors">
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
			<TaskListModal isOpen={showTaskModal} onClose={handleTaskModalClose} onSelectTask={handleTaskSelect} />

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
