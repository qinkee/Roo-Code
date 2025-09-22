import React, { useState, useCallback, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Settings, Check, Sparkles, Grid3X3, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { getAllModes } from "@roo/modes"
import { vscode } from "@src/utils/vscode"
import ChangeAvatarModal from "./ChangeAvatarModal"
import type { AgentApiConfig } from "@roo-code/types"

import type { AgentTemplateData } from "./utils/taskToAgentTemplate"

interface CreateAgentViewProps {
	onBack: () => void
	onCancel: () => void
	onCreate: (agentData: any) => void
	onShowApiConfig: (selectedConfigId?: string, currentConfig?: any, agentMode?: boolean) => void
	onShowModeConfig: () => void
	onAgentApiConfigSave?: (config: any) => void // 智能体模式的API配置保存回调
	templateData?: AgentTemplateData | null // 新增：模板数据
	editMode?: boolean // 新增：编辑模式标识
	editData?: any // 新增：要编辑的智能体数据
	onUpdate?: (agentData: any) => void // 新增：更新回调
	modifiedApiConfig?: any // 新增：从API配置页面返回的修改后配置
	onApiConfigUsed?: () => void // 新增：通知已使用修改后的配置
}

const CreateAgentView: React.FC<CreateAgentViewProps> = ({ onBack, onCancel, onCreate, onShowApiConfig, onShowModeConfig, onAgentApiConfigSave, templateData, editMode = false, editData, onUpdate, modifiedApiConfig, onApiConfigUsed }) => {
	const { t } = useTranslation()
	const { customModes, customModePrompts, listApiConfigMeta, currentApiConfigName, apiConfiguration } = useExtensionState()
	const [agentName, setAgentName] = useState(() => {
		if (editMode && editData) return editData.name || ""
		return ""
	})
	const [selectedMode, setSelectedMode] = useState(() => {
		if (editMode && editData) return editData.mode || "architect"
		return templateData?.mode || "architect"
	})
	const [selectedTools, setSelectedTools] = useState<string[]>(() => {
		if (editMode && editData) {
			return editData.tools?.map((tool: any) => tool.toolId) || ["internal"]
		}
		return templateData?.tools || ["internal"]
	})
	const [agentAvatar, setAgentAvatar] = useState<string>(() => {
		if (editMode && editData) return editData.avatar || ""
		return ""
	})
	const [showAvatarModal, setShowAvatarModal] = useState(false)
	const [roleDescription, setRoleDescription] = useState(() => {
		if (editMode && editData) return editData.roleDescription || ""
		return ""
	})
	const [todos, setTodos] = useState<Array<{ id: string; content: string; completed: boolean }>>(() => {
		if (editMode && editData && editData.todos) {
			return editData.todos.map((todo: any, index: number) => ({
				id: String(index + 1),
				content: todo.content || "",
				completed: todo.status === "completed"
			}))
		}
		return [{ id: "1", content: "", completed: false }]
	})
	const [displayMode, setDisplayMode] = useState<"stack" | "switch">("stack")
	const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
	// 为每个profile维护独立的完整配置状态（智能体专用，不影响全局）
	const [profileConfigs, setProfileConfigs] = useState<Record<string, any>>(() => {
		// 编辑模式下，如果有内嵌的API配置，预加载到profileConfigs中
		if (editMode && editData && editData.apiConfig) {
			const apiConfig = editData.apiConfig
			console.log('[CreateAgentView] Loading saved API config in edit mode:', apiConfig)
			return {
				[apiConfig.originalId]: apiConfig
			}
		}
		return {}
	})
	// 记住当前正在编辑的profile ID
	const [editingProfileId, setEditingProfileId] = useState<string>("")
	
	// 智能体最终的API配置（编辑模式或新创建）
	const [agentApiConfig, setAgentApiConfig] = useState<AgentApiConfig | undefined>(() => {
		// 编辑模式下使用现有的内嵌API配置
		if (editMode && editData && editData.apiConfig) {
			return editData.apiConfig
		}
		return undefined
	})
	
	// Get the current API config ID or default to the first available
	const [selectedApiConfig, setSelectedApiConfig] = useState(() => {
		// 编辑模式下优先使用嵌入的API配置，然后才是apiConfigId
		if (editMode && editData) {
			// 如果有嵌入的API配置，优先使用originalId（对应的profile ID）
			if (editData.apiConfig && editData.apiConfig.originalId) {
				console.log('[CreateAgentView] Edit mode: selecting saved API config profile:', editData.apiConfig.originalId)
				return editData.apiConfig.originalId
			}
			// 降级使用apiConfigId
			if (editData.apiConfigId) {
				console.log('[CreateAgentView] Edit mode: falling back to apiConfigId:', editData.apiConfigId)
				return editData.apiConfigId
			}
		}
		// 优先使用模板数据中的API配置
		if (templateData?.apiConfigId) {
			return templateData.apiConfigId
		}
		// 否则使用当前配置或第一个可用配置
		const currentConfig = listApiConfigMeta?.find((config) => config.name === currentApiConfigName)
		return currentConfig?.id || listApiConfigMeta?.[0]?.id || ""
	})
	
	// 当前选中profile的配置（智能体内独立维护）
	const currentProfileConfig = profileConfigs[selectedApiConfig]

	// 加载profile配置（智能体专用，不影响全局状态）
	const loadProfileConfig = useCallback(async (profileId: string) => {
		if (profileConfigs[profileId]) {
			return profileConfigs[profileId]
		}

		try {
			// 使用专门的获取API，不激活全局状态
			vscode.postMessage({
				type: "getApiConfigurationById",
				text: profileId
			})
			
			// 等待响应通过事件接收
			// TODO: 这里需要实现正确的响应处理机制
			return null
		} catch (error) {
			console.error('Failed to load profile config:', error)
		}
		return null
	}, [profileConfigs])

	// Get all available modes including custom modes
	const modeOptions = useMemo(() => {
		const allModes = getAllModes(customModes)
		return allModes.map((mode) => {
			// Check if this is a preset mode for translation
			const isPresetMode = ["architect", "code", "ask", "debug", "orchestrator"].includes(mode.slug)
			
			const translatedName = isPresetMode
				? t(`chat:modeSelector.presetModes.${mode.slug}.name` as any) || mode.name
				: mode.name
			
			const translatedDescription = isPresetMode
				? t(`chat:modeSelector.presetModes.${mode.slug}.description` as any) || mode.description
				: (customModePrompts?.[mode.slug]?.description ?? mode.description)

			return {
				id: mode.slug,
				label: translatedName,
				description: translatedDescription || mode.whenToUse || ""
			}
		})
	}, [customModes, customModePrompts, t])

	// Update selected API config when the list changes
	useEffect(() => {
		if (listApiConfigMeta && listApiConfigMeta.length > 0 && !selectedApiConfig) {
			const currentConfig = listApiConfigMeta.find((config) => config.name === currentApiConfigName)
			setSelectedApiConfig(currentConfig?.id || listApiConfigMeta[0]?.id || "")
		}
	}, [listApiConfigMeta, currentApiConfigName, selectedApiConfig])


	// TODO: 等待后端提供更完整的profile信息

	// Helper function to get provider display name (与settings/constants.ts保持一致)
	const getProviderDisplayName = useCallback((provider: string) => {
		const providerNames: Record<string, string> = {
			"anthropic": "Anthropic",
			"openai-native": "OpenAI",
			"openai": "OpenAI Compatible",
			"google": "Google",
			"azure": "Azure", 
			"bedrock": "Amazon Bedrock",
			"vertex": "GCP Vertex AI",
			"deepseek": "DeepSeek",
			"moonshot": "Moonshot",
			"glama": "Glama",
			"vscode-lm": "VS Code LM API",
			"mistral": "Mistral",
			"lmstudio": "LM Studio",
			"ollama": "Ollama",
			"unbound": "Unbound",
			"requesty": "Requesty",
			"human-relay": "Human Relay",
			"xai": "xAI (Grok)",
			"groq": "Groq",
			"huggingface": "Hugging Face",
			"chutes": "Chutes AI",
			"litellm": "LiteLLM",
			"sambanova": "SambaNova"
		}
		return providerNames[provider] || provider
	}, [])

	// Helper function to get model display name from config
	const getModelDisplayName = useCallback((config: any) => {
		if (!config) return "未设置"
		
		// 直接返回完整的模型ID，不做任何简化处理
		const modelId = config.apiModelId || 
			   config.glamaModelId || 
			   config.openRouterModelId || 
			   config.openAiModelId || 
			   config.ollamaModelId || 
			   config.lmStudioModelId || 
			   config.unboundModelId || 
			   config.requestyModelId || 
			   config.litellmModelId || 
			   config.huggingFaceModelId || 
			   config.ioIntelligenceModelId || 
			   "未设置"
		
		console.log('[CreateAgentView] getModelDisplayName - config:', config, 'returning:', modelId)
		return modelId
	}, [])

	// Get all available API configurations with correct display info
	const apiConfigs = useMemo(() => {
		if (!listApiConfigMeta) return []
		
		return listApiConfigMeta.map((configEntry) => {
			// 检查该profile是否有临时修改
			const profileMod = profileConfigs[configEntry.id]
			const isSelected = configEntry.id === selectedApiConfig
			
			// 如果有临时修改，显示修改后的信息（优先于原始配置）
			if (profileMod) {
				console.log('[CreateAgentView] Using profile modification for display:', profileMod)
				console.log('[CreateAgentView] Display - configEntry.id:', configEntry.id)
				console.log('[CreateAgentView] Display - selectedApiConfig:', selectedApiConfig)
				console.log('[CreateAgentView] Display - profileMod.apiModelId:', profileMod.apiModelId)
				return {
					id: configEntry.id,
					name: configEntry.name,
					provider: profileMod.apiProvider || "Unknown",
					model: getModelDisplayName(profileMod),
					isActive: isSelected,
					isModified: true, // 标记为已修改
				}
			}
			
			// 如果是编辑模式且选中的是原有配置，显示智能体内嵌的配置（无修改时）
			if (isSelected && editMode && editData?.apiConfig && editData.apiConfig.originalId === configEntry.id) {
				console.log('[CreateAgentView] Using agent embedded API config for display (unmodified):', editData.apiConfig)
				return {
					id: configEntry.id,
					name: configEntry.name,
					provider: editData.apiConfig.apiProvider || "Unknown",
					model: getModelDisplayName(editData.apiConfig),
					isActive: true,
					isModified: false, // 编辑模式下显示原有配置
				}
			}
			
			// 显示原始配置信息
			return {
				id: configEntry.id,
				name: configEntry.name,
				provider: configEntry.apiProvider || "Unknown",
				model: (configEntry as any).modelId || "未设置模型",
				isActive: isSelected,
				isModified: false,
			}
		})
	}, [listApiConfigMeta, selectedApiConfig, profileConfigs, editMode, editData, getModelDisplayName])

	const handleToolToggle = useCallback((toolId: string) => {
		setSelectedTools(prev => 
			prev.includes(toolId) 
				? prev.filter(id => id !== toolId)
				: [...prev, toolId]
		)
	}, [])

	const handleSave = useCallback(async () => {
		if (!agentName.trim()) {
			return
		}

		try {
			// 获取最终的API配置（智能体内部维护的配置）
			let selectedApiConfigDetails: AgentApiConfig | undefined
			
			console.log('[CreateAgentView] Save - Checking API config sources:')
			console.log('[CreateAgentView] Save - selectedApiConfig:', selectedApiConfig)
			console.log('[CreateAgentView] Save - profileConfigs[selectedApiConfig]:', profileConfigs[selectedApiConfig])
			console.log('[CreateAgentView] Save - profileConfigs whole object:', profileConfigs)
			console.log('[CreateAgentView] Save - profileConfigs[selectedApiConfig] detailed:', JSON.stringify(profileConfigs[selectedApiConfig], null, 2))
			console.log('[CreateAgentView] Save - editMode:', editMode, 'agentApiConfig:', agentApiConfig)
			
			// 1. 紧急修复：如果有最新的modifiedApiConfig，优先使用它
			if (modifiedApiConfig && modifiedApiConfig.editingConfigId === selectedApiConfig) {
				console.log('[CreateAgentView] Save - Using latest modifiedApiConfig directly:', modifiedApiConfig.apiModelId)
				selectedApiConfigDetails = {
					...modifiedApiConfig,
					originalId: selectedApiConfig,
					originalName: modifiedApiConfig.name || listApiConfigMeta?.find(c => c.id === selectedApiConfig)?.name || '',
					createdAt: modifiedApiConfig.createdAt || Date.now()
				} as AgentApiConfig
				console.log('[CreateAgentView] Save - Using latest modified config:', selectedApiConfigDetails)
			}
			// 2. 使用智能体内部维护的配置修改
			else if (profileConfigs[selectedApiConfig]) {
				const profileConfig = profileConfigs[selectedApiConfig]
				console.log('[CreateAgentView] Save - Found profileConfig, apiModelId:', profileConfig.apiModelId)
				selectedApiConfigDetails = {
					...profileConfig,
					originalId: selectedApiConfig,
					originalName: profileConfig.name || listApiConfigMeta?.find(c => c.id === selectedApiConfig)?.name || '',
					createdAt: profileConfig.createdAt || Date.now()
				} as AgentApiConfig
				console.log('[CreateAgentView] Save - Using agent profile config (modified):', selectedApiConfigDetails)
				console.log('[CreateAgentView] Save - Final apiModelId will be:', selectedApiConfigDetails.apiModelId)
			} 
			// 3. 编辑模式下使用已存在的智能体内嵌配置（仅当没有修改时）
			else if (editMode && agentApiConfig) {
				selectedApiConfigDetails = agentApiConfig
				console.log('[CreateAgentView] Save - Using existing agent API config (unmodified):', selectedApiConfigDetails)
			} 
			// 4. 使用原始profile配置创建副本
			else {
				const originalConfig = listApiConfigMeta?.find(config => config.id === selectedApiConfig)
				if (originalConfig) {
					// 注意：这里只有metadata，没有完整配置。在实际项目中需要获取完整配置
					console.log('[CreateAgentView] Warning: Using metadata only, missing full API config details')
					selectedApiConfigDetails = {
						...originalConfig,
						// 保留原有字段 
						apiProvider: originalConfig.apiProvider,
						apiModelId: originalConfig.modelId,
						originalId: originalConfig.id,
						originalName: originalConfig.name,
						createdAt: Date.now()
					} as AgentApiConfig
					console.log('[CreateAgentView] Save - Using original config as base:', selectedApiConfigDetails)
				}
			}
			
			console.log('[CreateAgentView] Save - selectedApiConfig:', selectedApiConfig)
			console.log('[CreateAgentView] Save - profileConfigs:', profileConfigs)
			console.log('[CreateAgentView] Save - agentApiConfig:', agentApiConfig)
			console.log('[CreateAgentView] Save - final selectedApiConfigDetails:', selectedApiConfigDetails)
			
			// 重要：检查所有分支条件
			console.log('[CreateAgentView] Save - Branch analysis:')
			console.log('  - Branch 1 (profileConfigs): has config =', !!profileConfigs[selectedApiConfig])
			console.log('  - Branch 2 (editMode + agentApiConfig): editMode =', editMode, ', agentApiConfig =', !!agentApiConfig)
			console.log('  - Branch 3 (originalConfig): has metadata =', !!listApiConfigMeta?.find(config => config.id === selectedApiConfig))
			console.log('  - selectedApiConfig value:', selectedApiConfig)
			console.log('  - listApiConfigMeta:', listApiConfigMeta)
			
			// 构建智能体配置，符合AgentConfig接口
			const agentConfig = {
				...(editMode && editData ? { id: editData.id } : {}), // 编辑模式下保留原有ID
				name: agentName.trim(),
				avatar: agentAvatar,
				roleDescription: roleDescription,
				apiConfigId: selectedApiConfig,
				// 嵌入完整的ProviderSettings副本
				apiConfig: selectedApiConfigDetails || undefined,
				mode: selectedMode,
				tools: selectedTools.map(toolId => ({
					toolId,
					enabled: true,
					config: {}
				})),
				todos: todos
					.filter(todo => todo.content.trim() !== "")
					.map((todo, index) => ({
						id: `todo_${Date.now()}_${index}`,
						content: todo.content.trim(),
						status: "pending" as const,
						priority: "medium" as const,
						createdAt: Date.now(),
						updatedAt: Date.now()
					})),
				templateSource: templateData?.templateSource,
				isActive: true,
				version: editMode && editData ? (editData.version || 1) + 1 : 1 // 编辑模式下递增版本号
			}

			console.log('[CreateAgentView] Save - Final agentConfig being sent:', agentConfig)
			
			if (editMode) {
				// 编辑模式：发送更新消息
				console.log('[CreateAgentView] Save - Updating agent with config:', agentConfig)
				vscode.postMessage({
					type: "updateAgent",
					agentId: editData?.id,
					agentConfig
				})
				// 调用更新回调
				if (onUpdate) {
					const legacyData = {
						name: agentName,
						mode: selectedMode,
						tools: selectedTools,
						apiConfig: selectedApiConfig,
						avatar: agentAvatar,
						roleDescription: roleDescription,
						todos: todos.filter(todo => todo.content.trim() !== "")
					}
					onUpdate(legacyData)
				}
			} else {
				// 创建模式：发送创建消息
				console.log('[CreateAgentView] Save - Creating agent with config:', agentConfig)
				vscode.postMessage({
					type: "createAgent",
					agentConfig
				})
				// 暂时保持原有回调以兼容现有逻辑
				const legacyData = {
					name: agentName,
					mode: selectedMode,
					tools: selectedTools,
					apiConfig: selectedApiConfig,
					avatar: agentAvatar,
					roleDescription: roleDescription,
					todos: todos.filter(todo => todo.content.trim() !== "")
				}
				onCreate(legacyData)
			}
		} catch (error) {
			console.error(editMode ? "Error updating agent:" : "Error creating agent:", error)
			// 可以在这里显示错误提示
		}
	}, [agentName, selectedMode, selectedTools, selectedApiConfig, agentAvatar, roleDescription, todos, templateData, onCreate, editMode, editData, onUpdate])

	// 智能体API配置处理 - 使用原有ApiConfigView + 保存回调
	const handleAgentApiConfig = useCallback(() => {
		if (!selectedApiConfig) return
		
		// 记住正在编辑的profile ID
		setEditingProfileId(selectedApiConfig)
		console.log('[CreateAgentView] Starting to edit profile:', selectedApiConfig)
		
		// 获取要传递的配置：优先使用修改过的配置，否则使用原始配置
		const configToPass = profileConfigs[selectedApiConfig] || 
			listApiConfigMeta?.find(c => c.id === selectedApiConfig)
		
		console.log('[CreateAgentView] Passing config to API view:', configToPass)
		
		// 使用原有的onShowApiConfig，但添加智能体模式标识
		onShowApiConfig(selectedApiConfig, configToPass, true) // 第三个参数表示智能体模式
	}, [selectedApiConfig, profileConfigs, onShowApiConfig])

	// 智能体API配置保存回调（现在只用于清理状态）
	const handleAgentApiConfigSave = useCallback((config: any) => {
		console.log('[CreateAgentView] Agent API config save callback (cleanup only):', config)
		// 清除编辑状态
		setEditingProfileId("")
	}, [])

	// 监听modifiedApiConfig，如果是智能体模式保存，则触发回调
	useEffect(() => {
		if (modifiedApiConfig && onApiConfigUsed) {
			// 如果配置带有editingConfigId，使用它；否则使用原来的逻辑
			const configId = modifiedApiConfig.editingConfigId || editingProfileId
			console.log('[CreateAgentView] useEffect - Saving config to profile:', configId, 'config:', modifiedApiConfig)
			console.log('[CreateAgentView] useEffect - modifiedApiConfig.apiModelId:', modifiedApiConfig.apiModelId)
			
			if (configId) {
				// 强制确保使用最新的modifiedApiConfig
				const latestConfig = { ...modifiedApiConfig }
				console.log('[CreateAgentView] useEffect - Setting profileConfigs with latest config:', latestConfig.apiModelId)
				
				setProfileConfigs(prev => {
					const updated = {
						...prev,
						[configId]: latestConfig
					}
					console.log('[CreateAgentView] useEffect - Updated profileConfigs:', updated)
					return updated
				})
				
				// 关键：恢复到正在编辑的profile
				console.log('[CreateAgentView] Restoring selection to edited profile:', configId)
				setSelectedApiConfig(configId)
				
				// 直接保存，然后清理状态
				onAgentApiConfigSave?.(latestConfig)
				handleAgentApiConfigSave(latestConfig)
			}
			
			onApiConfigUsed()
		}
	}, [modifiedApiConfig, onApiConfigUsed, editingProfileId, onAgentApiConfigSave, handleAgentApiConfigSave])

	const handleModeSettings = useCallback(() => {
		// Show modes configuration page within agents view
		onShowModeConfig()
	}, [onShowModeConfig])

	const handleAvatarClick = useCallback(() => {
		setShowAvatarModal(true)
	}, [])

	// Get system prompt for selected mode
	const selectedModeSystemPrompt = useMemo(() => {
		const selectedModeData = modeOptions.find(mode => mode.id === selectedMode)
		// This is a simplified version - in real implementation, you'd get the actual system prompt
		// For now, return a placeholder based on mode description
		return selectedModeData?.description || "请在此输入角色描述..."
	}, [selectedMode, modeOptions])

	// Update role description when mode changes
	useEffect(() => {
		setRoleDescription(selectedModeSystemPrompt)
	}, [selectedModeSystemPrompt])

	// Todo management functions
	const addTodo = useCallback(() => {
		const newTodo = {
			id: Date.now().toString(),
			content: "",
			completed: false
		}
		setTodos(prev => [...prev, newTodo])
	}, [])

	const updateTodo = useCallback((id: string, content: string) => {
		setTodos(prev => prev.map(todo => 
			todo.id === id ? { ...todo, content } : todo
		))
	}, [])

	const deleteTodo = useCallback((id: string) => {
		setTodos(prev => {
			const filtered = prev.filter(todo => todo.id !== id)
			// Ensure at least one todo exists
			return filtered.length > 0 ? filtered : [{ id: "1", content: "", completed: false }]
		})
	}, [])

	const toggleTodo = useCallback((id: string) => {
		setTodos(prev => prev.map(todo => 
			todo.id === id ? { ...todo, completed: !todo.completed } : todo
		))
	}, [])

	// Define sections for switch mode
	const sections = useMemo(() => [
		{
			id: "mode",
			title: t("agents:mode", "模式"),
			hasSettings: true,
			onSettings: handleModeSettings
		},
		{
			id: "apiConfig", 
			title: t("agents:apiConfiguration", "API配置"),
			hasSettings: true,
			onSettings: handleAgentApiConfig
		},
		{
			id: "todoList",
			title: t("agents:todoList", "任务清单"),
			hasSettings: false
		},
		{
			id: "tools",
			title: t("agents:tools", "工具"),
			hasSettings: false
		}
	], [t, handleModeSettings, handleAgentApiConfig])

	// Navigation handlers for switch mode
	const goToPrevSection = useCallback(() => {
		setCurrentSectionIndex(prev => prev > 0 ? prev - 1 : sections.length - 1)
	}, [sections.length])

	const goToNextSection = useCallback(() => {
		setCurrentSectionIndex(prev => prev < sections.length - 1 ? prev + 1 : 0)
	}, [sections.length])

	const currentSection = sections[currentSectionIndex]

	const handleAvatarModalClose = useCallback(() => {
		setShowAvatarModal(false)
	}, [])

	// Render individual section content
	const renderSectionContent = useCallback((sectionId: string) => {
		switch (sectionId) {
			case "mode":
				return (
					<div className="space-y-2">
						{modeOptions.map((mode) => (
							<button
								key={mode.id}
								onClick={() => setSelectedMode(mode.id)}
								className={cn(
									"w-full flex items-center justify-between p-3 rounded-md border transition-colors",
									selectedMode === mode.id
										? "bg-vscode-list-activeSelectionBackground border-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
										: "bg-vscode-input-background border-vscode-input-border text-vscode-foreground hover:bg-vscode-list-hoverBackground"
								)}
							>
								<div className="flex-1 text-left">
									<div className="font-medium text-sm">{mode.label}</div>
									<div className="text-xs text-vscode-foreground/60 mt-0.5">{mode.description}</div>
								</div>
								{selectedMode === mode.id && (
									<Check size={16} className="text-green-500 ml-2" />
								)}
							</button>
						))}
					</div>
				)

			case "apiConfig":
				return (
					<div className="space-y-2">
						{apiConfigs.map((config) => (
							<button
								key={config.id}
								onClick={() => {
									console.log('[CreateAgentView] API Config selected:', config.id, config)
									console.log('[CreateAgentView] Current profileConfigs before selection:', profileConfigs)
									setSelectedApiConfig(config.id)
									console.log('[CreateAgentView] Set selectedApiConfig to:', config.id)
									// 简单选择，不立即创建副本
									// 副本将在保存智能体时创建
								}}
								className={cn(
									"w-full flex items-center justify-between p-3 rounded-md border transition-colors",
									selectedApiConfig === config.id
										? "bg-vscode-list-activeSelectionBackground border-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
										: "bg-vscode-input-background border-vscode-input-border text-vscode-foreground hover:bg-vscode-list-hoverBackground"
								)}
							>
								<div className="flex-1 text-left">
									<div className="flex items-center gap-2">
										<div className="font-medium text-sm">
											{config.name}
										</div>
									</div>
									<div className="text-xs text-vscode-foreground/60">
										Provider: {getProviderDisplayName(profileConfigs[config.id]?.apiProvider || config.provider)}
									</div>
									<div className="text-xs text-vscode-foreground/60">
										Model: {profileConfigs[config.id]?.apiModelId || config.model}
									</div>
								</div>
								{selectedApiConfig === config.id && (
									<Check size={16} className="text-green-500 ml-2" />
								)}
							</button>
						))}
					</div>
				)

			case "todoList":
				return (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<span className="text-sm text-vscode-foreground/80">管理任务清单</span>
							<button
								onClick={addTodo}
								className="text-xs text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground font-medium"
							>
								+ {t("agents:addTodo", "添加任务")}
							</button>
						</div>
						<div className="space-y-2">
							{todos.map((todo, index) => (
								<div key={todo.id} className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={todo.completed}
										onChange={() => toggleTodo(todo.id)}
										className="w-4 h-4 text-vscode-button-background bg-vscode-input-background border-vscode-input-border rounded focus:ring-vscode-focusBorder"
									/>
									<input
										type="text"
										value={todo.content}
										onChange={(e) => updateTodo(todo.id, e.target.value)}
										placeholder={t("agents:todoPlaceholder", "输入任务内容...")}
										className={cn(
											"flex-1 px-2 py-1 text-sm bg-vscode-input-background border border-vscode-input-border rounded focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder",
											todo.completed ? "line-through text-vscode-foreground/50" : "text-vscode-foreground"
										)}
									/>
									{todos.length > 1 && (
										<button
											onClick={() => deleteTodo(todo.id)}
											className="p-1 text-vscode-foreground/50 hover:text-red-500 transition-colors"
											title={t("agents:deleteTodo", "删除任务")}
										>
											<span className="text-sm">×</span>
										</button>
									)}
								</div>
							))}
						</div>
					</div>
				)

			case "tools":
				return (
					<div className="space-y-3">
						{/* MCP Tools */}
						<div>
							<div className="flex items-center justify-between mb-2">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={selectedTools.includes("mcp")}
										onChange={() => handleToolToggle("mcp")}
										className="w-4 h-4 text-vscode-button-background bg-vscode-input-background border-vscode-input-border rounded focus:ring-vscode-focusBorder"
									/>
									<span className="text-sm text-vscode-foreground">工具 - MCP</span>
								</label>
								<button className="text-xs text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground">
									+ 添加 MCP Servers
								</button>
							</div>
						</div>

						{/* Playwright */}
						<div>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedTools.includes("playwright")}
									onChange={() => handleToolToggle("playwright")}
									className="w-4 h-4 text-vscode-button-background bg-vscode-input-background border-vscode-input-border rounded focus:ring-vscode-focusBorder"
								/>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-blue-500 rounded flex items-center justify-center text-white text-xs">P</div>
									<span className="text-sm text-vscode-foreground">Playwright</span>
								</div>
							</label>
						</div>

						{/* Figma AI Bridge */}
						<div>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									checked={selectedTools.includes("figma")}
									onChange={() => handleToolToggle("figma")}
									className="w-4 h-4 text-vscode-button-background bg-vscode-input-background border-vscode-input-border rounded focus:ring-vscode-focusBorder"
								/>
								<div className="flex items-center gap-2">
									<div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center text-white text-xs">F</div>
									<span className="text-sm text-vscode-foreground">Figma AI Bridge</span>
								</div>
							</label>
						</div>

						{/* Internal Tools */}
						<div className="space-y-2">
							{[
								{ id: "internal", label: "工具 - 内置", description: "对文件进行增删改查等和调用" },
								{ id: "filesystem", label: "文件系统", description: "对文件进行增删改查等和调用" },
								{ id: "terminal", label: "终端", description: "在终端运行各令并获取和解释结果" },
								{ id: "browser", label: "规范", description: "在生成规范类型的制作结果" },
								{ id: "link", label: "联网搜索", description: "搜索利用产生各和相关的网页内容" }
							].map((tool) => (
								<div key={tool.id}>
									<label className="flex items-center gap-2">
										<input
											type="checkbox"
											checked={selectedTools.includes(tool.id)}
											onChange={() => handleToolToggle(tool.id)}
											className="w-4 h-4 text-vscode-button-background bg-vscode-input-background border-vscode-input-border rounded focus:ring-vscode-focusBorder"
										/>
										<div className="flex items-center gap-2">
											<div className="w-4 h-4 bg-gray-500 rounded flex items-center justify-center text-white text-xs">
												{tool.label.charAt(0)}
											</div>
											<div className="flex-1">
												<div className="text-sm text-vscode-foreground">{tool.label}</div>
												<div className="text-xs text-vscode-foreground/60">{tool.description}</div>
											</div>
										</div>
									</label>
								</div>
							))}
						</div>
					</div>
				)

			default:
				return null
		}
	}, [modeOptions, selectedMode, apiConfigs, selectedApiConfig, todos, selectedTools, addTodo, toggleTodo, updateTodo, deleteTodo, handleToolToggle, t])

	const handleAvatarChange = useCallback((avatar: string) => {
		setAgentAvatar(avatar)
	}, [])

	const handleNameChange = useCallback((name: string) => {
		setAgentName(name)
	}, [])

	return (
		<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-3">
					<button
						onClick={onBack}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
					>
						<ArrowLeft size={16} />
					</button>
					<div className="flex items-center gap-2">
						<h1 className="text-lg font-bold">
							{editMode ? t("agents:editAgent", "编辑智能体") : t("agents:createAgent", "创建智能体")}
						</h1>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto px-6 py-4 space-y-6">
				{/* Template Info - Show when creating from task */}
				{templateData && (
					<div className="p-4 bg-vscode-textCodeBlock-background border border-vscode-button-background rounded-md">
						<div className="flex items-center gap-2 mb-2">
							<Sparkles size={16} className="text-vscode-button-background" />
							<span className="text-sm font-medium text-vscode-foreground">
								{t("agents:creatingFromTemplate", "基于任务模板创建")}
							</span>
						</div>
						<p className="text-xs text-vscode-foreground/70">
							{t("agents:templateTaskDescription", "任务：")}{templateData.templateSource.taskDescription}
						</p>
						<p className="text-xs text-vscode-foreground/50 mt-1">
							{t("agents:templateConfigApplied", "已自动应用任务的配置信息（模式、工具、API配置等）")}
						</p>
					</div>
				)}

				{/* Fixed Header: Avatar, Name and Role Description */}
				<div className="space-y-6">
					{/* Avatar and Name Section - Left Right Layout */}
					<div className="flex gap-6 items-start">
						{/* Avatar Section - Left */}
						<div className="flex-shrink-0">
							<div className="flex items-center gap-2 mb-3">
								<label className="text-sm font-bold text-vscode-foreground/90">
									{t("agents:avatar", "头像")}
								</label>
							</div>
							<div className="relative">
								<button
									onClick={handleAvatarClick}
									className="w-20 h-20 rounded-lg border-2 border-dashed border-vscode-input-border hover:border-vscode-button-background bg-vscode-input-background hover:bg-vscode-list-hoverBackground transition-colors flex items-center justify-center group"
								>
									{agentAvatar ? (
										<img
											src={agentAvatar}
											alt="Agent avatar"
											className="w-full h-full object-cover rounded-lg"
										/>
									) : (
										<div className="text-center">
											<div className="w-8 h-8 bg-vscode-button-background rounded-lg flex items-center justify-center mx-auto mb-1">
												<span className="text-lg">👤</span>
											</div>
											<span className="text-xs text-vscode-foreground/60 group-hover:text-vscode-foreground">
												点击选择
											</span>
										</div>
									)}
									
									{/* Custom centered tooltip */}
									<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
										<div className="bg-vscode-tooltip-background text-vscode-tooltip-foreground text-xs px-2 py-1 rounded shadow-lg border border-vscode-tooltip-border">
											{t("agents:changeAvatar", "更改头像")}
										</div>
									</div>
								</button>
							</div>
						</div>

						{/* Agent Name Section - Right */}
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-3">
								<label className="text-sm font-bold text-vscode-foreground/90">
									{t("agents:agentName", "名称")} <span className="text-red-500">*</span>
								</label>
							</div>
							<div className="relative">
								<input
									type="text"
									value={agentName}
									onChange={(e) => setAgentName(e.target.value)}
									placeholder={t("agents:agentNamePlaceholder", "请输入智能体名称")}
									maxLength={20}
									className="w-full px-3 py-2 bg-vscode-input-background border border-vscode-input-border rounded-md text-sm text-vscode-foreground placeholder-vscode-foreground/50 focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder"
								/>
								<div className="absolute right-3 top-2 text-xs text-vscode-foreground/50">
									{agentName.length}/20
								</div>
							</div>
						</div>
					</div>

					{/* Role Description Section */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<h2 className="text-sm font-bold text-vscode-foreground/90">
								{t("agents:roleDescription", "角色描述")}
							</h2>
						</div>
						<textarea
							value={roleDescription}
							onChange={(e) => setRoleDescription(e.target.value)}
							placeholder={t("agents:roleDescriptionPlaceholder", "请输入智能体的角色描述...")}
							rows={4}
							className="w-full px-3 py-2 bg-vscode-input-background border border-vscode-input-border rounded-md text-sm text-vscode-foreground placeholder-vscode-foreground/50 focus:outline-none focus:ring-1 focus:ring-vscode-focusBorder resize-none"
						/>
					</div>
				</div>

				{/* Configurable Sections Container */}
				<div className="relative">
					{/* Display Mode Toggle */}
					<div className="absolute top-0 right-0 z-10">
						<div className="flex items-center gap-1 bg-vscode-input-background border border-vscode-input-border rounded-md p-1">
							<StandardTooltip content={t("agents:stackMode", "堆叠模式")}>
								<button
									onClick={() => setDisplayMode("stack")}
									className={cn(
										"p-1.5 rounded transition-colors",
										displayMode === "stack"
											? "bg-vscode-button-background text-vscode-button-foreground"
											: "text-vscode-foreground/60 hover:text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground"
									)}
								>
									<LayoutGrid size={14} />
								</button>
							</StandardTooltip>
							<StandardTooltip content={t("agents:switchMode", "切换模式")}>
								<button
									onClick={() => setDisplayMode("switch")}
									className={cn(
										"p-1.5 rounded transition-colors",
										displayMode === "switch"
											? "bg-vscode-button-background text-vscode-button-foreground"
											: "text-vscode-foreground/60 hover:text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground"
									)}
								>
									<Grid3X3 size={14} />
								</button>
							</StandardTooltip>
						</div>
					</div>

					{displayMode === "stack" ? (
						/* Stack Mode - All sections visible */
						<div className="space-y-6 pt-12">
							{/* Mode Selection Section */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-bold text-vscode-foreground/90">
										{t("agents:mode", "模式")}
									</h2>
									<StandardTooltip content={t("agents:configureMode", "配置模式")}>
										<button
											onClick={handleModeSettings}
											className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
										>
											<Settings size={14} />
										</button>
									</StandardTooltip>
								</div>
								{renderSectionContent("mode")}
							</div>

							{/* API Configuration Section */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-bold text-vscode-foreground/90">
										{t("agents:apiConfiguration", "API配置")}
									</h2>
									<StandardTooltip content={t("agents:configureApiConfig", "配置API")}>
										<button
											onClick={handleAgentApiConfig}
											className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
										>
											<Settings size={14} />
										</button>
									</StandardTooltip>
								</div>
								{renderSectionContent("apiConfig")}
							</div>

							{/* Todo List Section */}
							<div>
								<div className="flex items-center justify-between mb-3">
									<h2 className="text-sm font-bold text-vscode-foreground/90">
										{t("agents:todoList", "任务清单")}
									</h2>
									<button
										onClick={addTodo}
										className="text-xs text-vscode-textLink-foreground hover:text-vscode-textLink-activeForeground font-medium"
									>
										+ {t("agents:addTodo", "添加任务")}
									</button>
								</div>
								{renderSectionContent("todoList")}
							</div>

							{/* Tools Section */}
							<div>
								<div className="flex items-center gap-2 mb-3">
									<h2 className="text-sm font-bold text-vscode-foreground/90">
										{t("agents:tools", "工具")}
									</h2>
									<StandardTooltip content="选择智能体可以使用的工具">
										<div className="w-4 h-4 bg-vscode-foreground/20 rounded-full flex items-center justify-center text-xs text-vscode-foreground/60">
											?
										</div>
									</StandardTooltip>
								</div>
								{renderSectionContent("tools")}
							</div>
						</div>
					) : (
						/* Switch Mode - One section at a time with side navigation */
						<div className="pt-12">
							{/* Section Header */}
							<div className="flex items-center justify-between mb-4 p-3 bg-vscode-input-background border border-vscode-input-border rounded-md">
								<div className="flex items-center gap-2">
									<h2 className="text-sm font-bold text-vscode-foreground/90">
										{currentSection.title}
									</h2>
									<div className="flex gap-1">
										{sections.map((_, index) => (
											<div
												key={index}
												className={cn(
													"w-1.5 h-1.5 rounded-full transition-colors",
													index === currentSectionIndex
														? "bg-vscode-button-background"
														: "bg-vscode-foreground/30"
												)}
											/>
										))}
									</div>
									<span className="text-xs text-vscode-foreground/50">
										{currentSectionIndex + 1}/{sections.length}
									</span>
								</div>

								{/* Settings Button */}
								{currentSection.hasSettings && (
									<StandardTooltip content={t("agents:configureSection", "配置")}>
										<button
											onClick={currentSection.onSettings}
											className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
										>
											<Settings size={14} />
										</button>
									</StandardTooltip>
								)}
							</div>

							{/* Section Content with Side Navigation */}
							<div className="relative">
								{/* Left Arrow - Outside content area */}
								<StandardTooltip content={`上一个：${sections[(currentSectionIndex - 1 + sections.length) % sections.length].title}`}>
									<button
										onClick={goToPrevSection}
										className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-20 p-2 bg-vscode-input-background border border-vscode-input-border rounded-full hover:bg-vscode-toolbar-hoverBackground text-vscode-foreground/70 hover:text-vscode-foreground transition-all duration-200 shadow-lg"
									>
										<ChevronLeft size={18} />
									</button>
								</StandardTooltip>

								{/* Right Arrow - Outside content area */}
								<StandardTooltip content={`下一个：${sections[(currentSectionIndex + 1) % sections.length].title}`}>
									<button
										onClick={goToNextSection}
										className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-20 p-2 bg-vscode-input-background border border-vscode-input-border rounded-full hover:bg-vscode-toolbar-hoverBackground text-vscode-foreground/70 hover:text-vscode-foreground transition-all duration-200 shadow-lg"
									>
										<ChevronRight size={18} />
									</button>
								</StandardTooltip>

								{/* Section Content - Full width */}
								<div className="bg-vscode-editor-background border border-vscode-input-border rounded-md p-6 min-h-[300px]">
									{renderSectionContent(currentSection.id)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer */}
			<div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-vscode-panel-border">
				<button
					onClick={onCancel}
					className="px-4 py-2 text-sm text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground rounded-md transition-colors"
				>
					{t("agents:cancel", "取消")}
				</button>
				<button
					onClick={handleSave}
					disabled={!agentName.trim()}
					className={cn(
						"px-4 py-2 text-sm rounded-md transition-colors",
						agentName.trim()
							? "bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground"
							: "bg-vscode-button-background/50 text-vscode-button-foreground/50 cursor-not-allowed"
					)}
				>
					{editMode ? t("agents:update", "保存") : t("agents:create", "创建")}
				</button>
			</div>

			{/* Change Avatar Modal */}
			<ChangeAvatarModal
				isOpen={showAvatarModal}
				onClose={handleAvatarModalClose}
				currentAvatar={agentAvatar}
				onAvatarChange={handleAvatarChange}
				agentName={agentName}
				onNameChange={handleNameChange}
			/>

		</div>
	)
}

export default CreateAgentView