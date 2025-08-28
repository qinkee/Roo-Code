import React, { useState, useMemo, useCallback, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRooPortal } from "@/components/ui/hooks/useRooPortal"
import { Popover, PopoverContent, PopoverTrigger, StandardTooltip } from "@/components/ui"
import { useAppTranslation } from "@/i18n/TranslationContext"
import { vscode } from "@/utils/vscode"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { useSelectedModel } from "@/components/ui/hooks/useSelectedModel"
import {
	anthropicModels,
	bedrockModels,
	cerebrasModels,
	deepSeekModels,
	doubaoModels,
	moonshotModels,
	geminiModels,
	mistralModels,
	openAiNativeModels,
	vertexModels,
	xaiModels,
	groqModels,
	chutesModels,
	vscodeLlmModels,
	claudeCodeModels,
	sambaNovaModels,
	internationalZAiModels,
	mainlandZAiModels,
	fireworksModels,
	ioIntelligenceModels,
	type ModelInfo,
} from "@roo-code/types"
import { ChevronUp, Zap } from "lucide-react"

interface ModelSelectorProps {
	disabled?: boolean
	title?: string
	triggerClassName?: string
}

export const ModelSelector = ({ disabled = false, title = "", triggerClassName = "" }: ModelSelectorProps) => {
	const { t } = useAppTranslation()
	const [open, setOpen] = useState(false)
	const [searchValue, setSearchValue] = useState("")
	const [dynamicModels, setDynamicModels] = useState<Array<{ id: string; contextWindow?: number }>>([])
	const portalContainer = useRooPortal("roo-portal")

	const { apiConfiguration, setApiConfiguration, currentApiConfigName } = useExtensionState()

	const { provider, id: currentModelId } = useSelectedModel(apiConfiguration)

	// Fetch dynamic models for OpenAI-compatible and Ollama providers
	useEffect(() => {
		if (!open) return
		
		if (provider === "openai") {
			// Request OpenAI models when dropdown opens
			const baseUrl = apiConfiguration?.openAiBaseUrl || ""
			const apiKey = apiConfiguration?.openAiApiKey || ""
			const headers = apiConfiguration?.openAiHeaders || undefined
			
			if (baseUrl && apiKey) {
				vscode.postMessage({
					type: "requestOpenAiModels",
					values: {
						baseUrl,
						apiKey,
						openAiHeaders: headers
					}
				})
			}
		} else if (provider === "ollama") {
			// Request Ollama models
			vscode.postMessage({ type: "requestOllamaModels" })
		}
	}, [provider, open, apiConfiguration])

	// Listen for model responses
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			const message = event.data
			
			if (message.type === "openAiModels" && message.openAiModels) {
				// OpenAI models come as an array of model IDs
				const modelIds = message.openAiModels as string[]
				const modelsArray = modelIds.map((modelId: string) => ({
					id: modelId,
					contextWindow: 0, // We don't have context window info from the API
				}))
				setDynamicModels(modelsArray)
			} else if (message.type === "ollamaModels" && message.ollamaModels) {
				// Convert Ollama models to array format
				const modelsArray = Object.entries(message.ollamaModels as Record<string, any>).map(([id, info]: [string, any]) => ({
					id,
					contextWindow: info.contextWindow || 0,
				}))
				setDynamicModels(modelsArray)
			}
		}

		window.addEventListener("message", handleMessage)
		return () => window.removeEventListener("message", handleMessage)
	}, [])

	// Get available models based on provider
	const availableModels = useMemo(() => {
		let models: Record<string, ModelInfo> = {}

		switch (provider) {
			case "anthropic":
				models = anthropicModels
				break
			case "bedrock":
				models = bedrockModels
				break
			case "cerebras":
				models = cerebrasModels
				break
			case "deepseek":
				models = deepSeekModels
				break
			case "doubao":
				models = doubaoModels
				break
			case "moonshot":
				models = moonshotModels
				break
			case "gemini":
			case "gemini-cli":
				models = geminiModels
				break
			case "mistral":
				models = mistralModels
				break
			case "openai-native":
				models = openAiNativeModels
				break
			case "vertex":
				models = vertexModels
				break
			case "xai":
				models = xaiModels
				break
			case "groq":
				models = groqModels
				break
			case "chutes":
				models = chutesModels
				break
			case "vscode-lm":
				models = vscodeLlmModels
				break
			case "claude-code":
				models = claudeCodeModels
				break
			case "sambanova":
				models = sambaNovaModels
				break
			case "fireworks":
				models = fireworksModels
				break
			case "io-intelligence":
				models = ioIntelligenceModels
				break
			case "zai":
				// Check if it's mainland or international based on current config
				if (apiConfiguration?.zaiApiLine === "china") {
					models = mainlandZAiModels
				} else {
					models = internationalZAiModels
				}
				break
			case "openai":
			case "openrouter":
			case "ollama":
			case "lmstudio":
			case "glama":
			case "unbound":
			case "requesty":
			case "litellm":
			case "huggingface":
			case "human-relay":
			case "fake-ai":
				// These providers have dynamic models - return fetched models
				return dynamicModels.map(model => ({
					id: model.id,
					contextWindow: model.contextWindow || 0,
					supportsPromptCache: false,
					maxTokens: null,
				}))
			default:
				return []
		}

		// Convert to array and sort by id
		return Object.entries(models)
			.map(([id, info]) => ({ id, ...info }))
			.sort((a, b) => a.id.localeCompare(b.id))
	}, [provider, apiConfiguration, dynamicModels])

	// Filter models based on search
	const filteredModels = useMemo(() => {
		if (!searchValue) return availableModels

		const query = searchValue.toLowerCase()
		return availableModels.filter((model) => model.id.toLowerCase().includes(query))
	}, [availableModels, searchValue])

	// Handle model selection
	const handleSelect = useCallback(
		(modelId: string) => {
			let updateValues: any = { ...apiConfiguration }
			
			// Update the appropriate model field based on provider
			if (provider === "openai") {
				updateValues.openAiModelId = modelId
			} else if (provider === "ollama") {
				updateValues.ollamaModelId = modelId
			} else {
				updateValues.apiModelId = modelId
			}

			// Update the API configuration
			setApiConfiguration(updateValues)

			// Send message to save the configuration
			vscode.postMessage({
				type: "upsertApiConfiguration",
				text: currentApiConfigName,
				values: updateValues,
			})

			setOpen(false)
			setSearchValue("")
		},
		[apiConfiguration, currentApiConfigName, setApiConfiguration, provider],
	)

	// For debugging: always show the selector even if no models available
	// if (availableModels.length === 0) {
	// 	return null
	// }

	// Get display name for current model
	const currentModelName = currentModelId || t("chat:modelSelector.noModel")

	const triggerContent = (
		<PopoverTrigger
			disabled={disabled}
			data-testid="model-selector-trigger"
			className={cn(
				"inline-flex items-center gap-1 relative whitespace-nowrap px-1.5 py-1 text-xs",
				"bg-transparent border border-[rgba(255,255,255,0.08)] rounded-md text-vscode-foreground",
				"transition-all duration-150 focus:outline-none focus-visible:ring-1 focus-visible:ring-vscode-focusBorder focus-visible:ring-inset",
				disabled
					? "opacity-50 cursor-not-allowed"
					: "opacity-90 hover:opacity-100 hover:bg-[rgba(255,255,255,0.03)] hover:border-[rgba(255,255,255,0.15)] cursor-pointer",
				triggerClassName,
			)}>
			<Zap className="w-3 h-3 opacity-80 flex-shrink-0" />
			<span className="truncate text-xs">{currentModelName}</span>
			<ChevronUp
				className={cn(
					"w-3 h-3 pointer-events-none opacity-80 flex-shrink-0 transition-transform duration-200",
					open && "rotate-180",
				)}
			/>
		</PopoverTrigger>
	)

	return (
		<Popover open={open} onOpenChange={setOpen}>
			{title ? <StandardTooltip content={title}>{triggerContent}</StandardTooltip> : triggerContent}
			<PopoverContent
				align="end"
				sideOffset={4}
				container={portalContainer}
				className="p-0 overflow-hidden w-[280px]">
				<div className="flex flex-col w-full">
					{/* Search input */}
					{availableModels.length > 6 && (
						<div className="relative p-2 border-b border-vscode-dropdown-border">
							<input
								aria-label={t("common:ui.search_placeholder")}
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								placeholder={t("common:ui.search_placeholder")}
								className="w-full h-8 px-2 py-1 text-xs bg-vscode-input-background text-vscode-input-foreground border border-vscode-input-border rounded focus:outline-0"
								autoFocus
							/>
							{searchValue.length > 0 && (
								<div className="absolute right-4 top-0 bottom-0 flex items-center justify-center">
									<span
										className="codicon codicon-close text-vscode-input-foreground opacity-50 hover:opacity-100 text-xs cursor-pointer"
										onClick={() => setSearchValue("")}
									/>
								</div>
							)}
						</div>
					)}

					{/* Model list */}
					<div className="max-h-[300px] overflow-y-auto">
						{filteredModels.length === 0 && searchValue ? (
							<div className="py-2 px-3 text-sm text-vscode-foreground/70">
								{t("common:ui.no_results")}
							</div>
						) : (
							<div className="py-1">
								{filteredModels.map((model) => {
									const isCurrentModel = model.id === currentModelId

									return (
										<div
											key={model.id}
											onClick={() => handleSelect(model.id)}
											className={cn(
												"px-3 py-1.5 text-sm cursor-pointer flex items-center justify-between group",
												"hover:bg-vscode-list-hoverBackground",
												isCurrentModel &&
													"bg-vscode-list-activeSelectionBackground text-vscode-list-activeSelectionForeground",
											)}>
											<span className="truncate font-medium flex-1">{model.id}</span>
											{isCurrentModel && (
												<div className="size-5 p-1 flex items-center justify-center">
													<span className="codicon codicon-check text-xs" />
												</div>
											)}
										</div>
									)
								})}
							</div>
						)}
					</div>

					{/* Info footer */}
					<div className="p-2 border-t border-vscode-dropdown-border bg-vscode-dropdown-background/50">
						<div className="text-xs text-vscode-descriptionForeground opacity-80">
							{t("chat:modelSelector.currentProfile", { profile: currentApiConfigName })}
						</div>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}
