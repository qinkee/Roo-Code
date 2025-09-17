import React, { useState, useCallback, useMemo, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ArrowLeft, Settings, Check, Sparkles } from "lucide-react"
import { cn } from "@src/lib/utils"
import { StandardTooltip } from "@src/components/ui"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import { getAllModes } from "@roo/modes"
import { vscode } from "@src/utils/vscode"
import ChangeAvatarModal from "./ChangeAvatarModal"

import type { AgentTemplateData } from "./utils/taskToAgentTemplate"

interface CreateAgentViewProps {
	onBack: () => void
	onCancel: () => void
	onCreate: (agentData: any) => void
	onShowApiConfig: () => void
	onShowModeConfig: () => void
	templateData?: AgentTemplateData | null // 新增：模板数据
}

const CreateAgentView: React.FC<CreateAgentViewProps> = ({ onBack, onCancel, onCreate, onShowApiConfig, onShowModeConfig, templateData }) => {
	const { t } = useTranslation()
	const { customModes, customModePrompts, listApiConfigMeta, currentApiConfigName } = useExtensionState()
	const [agentName, setAgentName] = useState("")
	const [selectedMode, setSelectedMode] = useState(() => templateData?.mode || "architect")
	const [selectedTools, setSelectedTools] = useState<string[]>(() => templateData?.tools || ["internal"])
	const [agentAvatar, setAgentAvatar] = useState<string>("")
	const [showAvatarModal, setShowAvatarModal] = useState(false)
	
	// Get the current API config ID or default to the first available
	const [selectedApiConfig, setSelectedApiConfig] = useState(() => {
		// 优先使用模板数据中的API配置
		if (templateData?.apiConfigId) {
			return templateData.apiConfigId
		}
		// 否则使用当前配置或第一个可用配置
		const currentConfig = listApiConfigMeta?.find((config) => config.name === currentApiConfigName)
		return currentConfig?.id || listApiConfigMeta?.[0]?.id || ""
	})

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

	// Get all available API configurations
	const apiConfigs = useMemo(() => {
		return listApiConfigMeta?.map((config) => ({
			id: config.id,
			name: config.name,
			provider: config.apiProvider || "Unknown",
			isActive: config.id === selectedApiConfig
		})) || []
	}, [listApiConfigMeta, selectedApiConfig])

	const handleToolToggle = useCallback((toolId: string) => {
		setSelectedTools(prev => 
			prev.includes(toolId) 
				? prev.filter(id => id !== toolId)
				: [...prev, toolId]
		)
	}, [])

	const handleCreate = useCallback(() => {
		const agentData = {
			name: agentName,
			mode: selectedMode,
			tools: selectedTools,
			apiConfig: selectedApiConfig,
			avatar: agentAvatar
		}
		onCreate(agentData)
	}, [agentName, selectedMode, selectedTools, selectedApiConfig, agentAvatar, onCreate])

	const handleApiConfigSettings = useCallback(() => {
		// Show API configuration page within agents view
		onShowApiConfig()
	}, [onShowApiConfig])

	const handleModeSettings = useCallback(() => {
		// Show modes configuration page within agents view
		onShowModeConfig()
	}, [onShowModeConfig])

	const handleAvatarClick = useCallback(() => {
		setShowAvatarModal(true)
	}, [])

	const handleAvatarModalClose = useCallback(() => {
		setShowAvatarModal(false)
	}, [])

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
						<h1 className="text-lg font-bold">{t("agents:createAgent", "创建智能体")}</h1>
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
					<div className="space-y-2">
						{modeOptions.map((mode) => (
							<button
								key={mode.id}
								onClick={() => setSelectedMode(mode.id)}
								className={cn(
									"w-full text-left p-3 rounded-md border transition-colors",
									selectedMode === mode.id
										? "bg-vscode-button-background border-vscode-button-background text-vscode-button-foreground"
										: "bg-vscode-input-background border-vscode-input-border text-vscode-foreground hover:bg-vscode-list-hoverBackground"
								)}
							>
								<div className="font-medium text-sm">{mode.label}</div>
								<div className="text-xs text-vscode-foreground/60 mt-0.5">{mode.description}</div>
							</button>
						))}
					</div>
				</div>

				{/* API Configuration Section */}
				<div>
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-sm font-bold text-vscode-foreground/90">
							{t("agents:apiConfiguration", "API配置")}
						</h2>
						<StandardTooltip content={t("agents:configureApiConfig", "配置API")}>
							<button
								onClick={handleApiConfigSettings}
								className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
							>
								<Settings size={14} />
							</button>
						</StandardTooltip>
					</div>
					<div className="space-y-2">
						{apiConfigs.map((config) => (
							<button
								key={config.id}
								onClick={() => setSelectedApiConfig(config.id)}
								className={cn(
									"w-full flex items-center justify-between p-3 rounded-md border transition-colors",
									selectedApiConfig === config.id
										? "bg-vscode-list-activeSelectionBackground border-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground"
										: "bg-vscode-input-background border-vscode-input-border text-vscode-foreground hover:bg-vscode-list-hoverBackground"
								)}
							>
								<div className="flex-1 text-left">
									<div className="font-medium text-sm">{config.name}</div>
									<div className="text-xs text-vscode-foreground/60">{config.provider}</div>
								</div>
								{selectedApiConfig === config.id && (
									<Check size={16} className="text-green-500 ml-2" />
								)}
							</button>
						))}
					</div>
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
					onClick={handleCreate}
					disabled={!agentName.trim()}
					className={cn(
						"px-4 py-2 text-sm rounded-md transition-colors",
						agentName.trim()
							? "bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground"
							: "bg-vscode-button-background/50 text-vscode-button-foreground/50 cursor-not-allowed"
					)}
				>
					{t("agents:create", "创建")}
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