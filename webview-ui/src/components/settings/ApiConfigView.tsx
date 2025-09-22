import React, { useCallback, useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useExtensionState } from "@src/context/ExtensionStateContext"
import ApiOptions from "./ApiOptions"
import type { ProviderSettings } from "@roo-code/types"

interface ApiConfigViewProps {
	onBack: () => void
	onConfigChanged?: (config: ProviderSettings) => void
	readOnlyMode?: boolean // 新增：只读模式，用于智能体配置时不修改全局配置
	initialConfig?: ProviderSettings // 新增：初始配置，用于显示特定profile的配置
	enableSaveButton?: boolean // 新增：是否显示保存按钮
}

const ApiConfigView: React.FC<ApiConfigViewProps> = ({ onBack, onConfigChanged, readOnlyMode = false, initialConfig, enableSaveButton = false }) => {
	const { t } = useTranslation()
	const { apiConfiguration, setApiConfiguration } = useExtensionState()
	const [errorMessage, setErrorMessage] = useState<string | undefined>()
	
	// 在只读模式下使用本地状态，避免影响全局配置
	const [localConfig, setLocalConfig] = useState<ProviderSettings | undefined>(() => {
		// 优先使用初始配置，然后是全局配置
		if (initialConfig) {
			// 如果 initialConfig 只是 ProviderSettingsEntry，需要扩展为完整的 ProviderSettings
			if ('modelId' in initialConfig && !('diffEnabled' in initialConfig)) {
				// 这是一个 ProviderSettingsEntry，需要扩展
				console.log('[ApiConfigView] Expanding ProviderSettingsEntry to ProviderSettings:', initialConfig)
				return {
					...initialConfig,
					// 添加默认的 ProviderSettings 字段
					diffEnabled: true,
					todoListEnabled: true,
					fuzzyMatchThreshold: 1,
					consecutiveMistakeLimit: 3,
					// 根据 provider 设置相应的 model 字段
					...(initialConfig.apiProvider === 'openai' && { openAiModelId: initialConfig.modelId }),
					...(initialConfig.apiProvider === 'anthropic' && { apiModelId: initialConfig.modelId }),
					...(initialConfig.apiProvider === 'ollama' && { ollamaModelId: initialConfig.modelId }),
				} as ProviderSettings
			}
			return initialConfig
		}
		return apiConfiguration
	})
	
	// 同步全局配置到本地状态
	useEffect(() => {
		if (readOnlyMode) {
			// 只读模式下，优先使用initialConfig，其次是apiConfiguration
			if (initialConfig) {
				// 处理 ProviderSettingsEntry 的情况
				if ('modelId' in initialConfig && !('diffEnabled' in initialConfig)) {
					const expandedConfig = {
						...initialConfig,
						diffEnabled: true,
						todoListEnabled: true,
						fuzzyMatchThreshold: 1,
						consecutiveMistakeLimit: 3,
						...(initialConfig.apiProvider === 'openai' && { openAiModelId: initialConfig.modelId }),
						...(initialConfig.apiProvider === 'anthropic' && { apiModelId: initialConfig.modelId }),
						...(initialConfig.apiProvider === 'ollama' && { ollamaModelId: initialConfig.modelId }),
					} as ProviderSettings
					setLocalConfig(expandedConfig)
				} else {
					setLocalConfig(initialConfig)
				}
			} else if (apiConfiguration) {
				setLocalConfig(apiConfiguration)
			}
		} else {
			// 非只读模式下，同步全局配置
			if (apiConfiguration) {
				setLocalConfig(apiConfiguration)
			}
		}
	}, [apiConfiguration, readOnlyMode, initialConfig])
	
	// 获取当前使用的配置（只读模式用本地状态，否则用全局状态）
	const currentConfig = readOnlyMode ? localConfig : apiConfiguration
	
	// 跟踪是否有未保存的更改
	const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
	
	console.log('[ApiConfigView] Debug config state:', {
		readOnlyMode,
		initialConfig: !!initialConfig,
		apiConfiguration: !!apiConfiguration,
		localConfig: !!localConfig,
		currentConfig: !!currentConfig,
		enableSaveButton,
		hasUnsavedChanges
	})

	const handleApiConfigFieldChange = useCallback(<K extends keyof ProviderSettings>(
		field: K,
		value: ProviderSettings[K]
	) => {
		const configToUpdate = readOnlyMode ? localConfig : apiConfiguration
		if (configToUpdate) {
			const newConfig = {
				...configToUpdate,
				[field]: value
			}
			
			// 如果是只读模式，只更新本地状态
			if (readOnlyMode) {
				setLocalConfig(newConfig)
				// 在只读模式下标记为有未保存的更改
				if (enableSaveButton) {
					setHasUnsavedChanges(true)
				}
			} else {
				setApiConfiguration(newConfig)
			}
			
			// 只在非保存按钮模式下才自动触发配置变更
			if (!enableSaveButton && onConfigChanged) {
				onConfigChanged(newConfig)
			}
		}
	}, [localConfig, apiConfiguration, setApiConfiguration, onConfigChanged, readOnlyMode, enableSaveButton])

	// 保存配置
	const handleSave = useCallback(() => {
		if (localConfig && onConfigChanged) {
			console.log('[ApiConfigView] Saving config:', localConfig)
			onConfigChanged(localConfig)
			setHasUnsavedChanges(false)
			onBack() // 保存后返回
		}
	}, [localConfig, onConfigChanged, onBack])

	// 取消更改
	const handleCancel = useCallback(() => {
		if (hasUnsavedChanges) {
			// 可以在这里添加确认对话框
			const shouldDiscard = window.confirm('您有未保存的更改，确定要放弃吗？')
			if (!shouldDiscard) {
				return
			}
			// 重置到初始配置
			setLocalConfig(initialConfig || apiConfiguration)
			setHasUnsavedChanges(false)
		}
		onBack()
	}, [hasUnsavedChanges, initialConfig, apiConfiguration, onBack])

	// 键盘快捷键支持
	useEffect(() => {
		if (!enableSaveButton) return
		
		const handleKeyDown = (e: KeyboardEvent) => {
			// Ctrl+S 或 Cmd+S 保存
			if ((e.ctrlKey || e.metaKey) && e.key === 's') {
				e.preventDefault()
				if (hasUnsavedChanges) {
					handleSave()
				}
			}
			// Escape 取消
			else if (e.key === 'Escape') {
				e.preventDefault()
				handleCancel()
			}
		}
		
		document.addEventListener('keydown', handleKeyDown)
		return () => document.removeEventListener('keydown', handleKeyDown)
	}, [enableSaveButton, hasUnsavedChanges, handleSave, handleCancel])

	return (
		<div className="flex flex-col h-full bg-vscode-editor-background text-vscode-foreground">
			{/* Header */}
			<div className="flex items-center justify-between px-6 py-4 border-b border-vscode-panel-border">
				<div className="flex items-center gap-3">
					<button
						onClick={enableSaveButton ? handleCancel : onBack}
						className="p-1.5 hover:bg-vscode-toolbar-hoverBackground rounded-md text-vscode-foreground/70 hover:text-vscode-foreground transition-colors"
					>
						<ArrowLeft size={16} />
					</button>
					<h1 className="text-lg font-bold">{t("settings:apiConfiguration", "API配置")}</h1>
					{hasUnsavedChanges && (
						<span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">
							未保存
						</span>
					)}
				</div>
				
				{/* 保存按钮模式下显示保存和取消按钮 */}
				{enableSaveButton && (
					<div className="flex items-center gap-2">
						<button
							onClick={handleCancel}
							title="取消更改 (Esc)"
							className="px-3 py-1.5 text-sm text-vscode-foreground hover:bg-vscode-toolbar-hoverBackground rounded-md transition-colors"
						>
							取消
						</button>
						<button
							onClick={handleSave}
							disabled={!hasUnsavedChanges}
							title={hasUnsavedChanges ? '保存更改 (Ctrl+S)' : '没有更改需要保存'}
							className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
								hasUnsavedChanges
									? 'bg-vscode-button-background hover:bg-vscode-button-hoverBackground text-vscode-button-foreground'
									: 'bg-vscode-button-background/50 text-vscode-button-foreground/50 cursor-not-allowed'
							}`}
						>
							保存
						</button>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 overflow-auto px-6 py-4">
				{currentConfig ? (
					<ApiOptions
						uriScheme={undefined}
						apiConfiguration={currentConfig}
						setApiConfigurationField={handleApiConfigFieldChange}
						fromWelcomeView={false}
						errorMessage={errorMessage}
						setErrorMessage={setErrorMessage}
					/>
				) : (
					<div className="flex items-center justify-center h-64 text-vscode-foreground/70">
						<div className="text-center">
							<div className="text-sm mb-2">加载中...</div>
							<div className="text-xs">正在获取API配置信息</div>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default ApiConfigView