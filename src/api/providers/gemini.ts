import type { Anthropic } from "@anthropic-ai/sdk"
import {
	GoogleGenAI,
	type GenerateContentResponseUsageMetadata,
	type GenerateContentParameters,
	type GenerateContentConfig,
	type GroundingMetadata,
} from "@google/genai"
import type { JWTInput } from "google-auth-library"

import { type ModelInfo, type GeminiModelId, geminiDefaultModelId, geminiModels } from "@roo-code/types"

import type { ApiHandlerOptions } from "../../shared/api"
import { safeJsonParse } from "../../shared/safeJsonParse"

import { convertAnthropicContentToGemini, convertAnthropicMessageToGemini } from "../transform/gemini-format"
import { t } from "i18next"
import type { ApiStream } from "../transform/stream"
import { getModelParams } from "../transform/model-params"

import type { SingleCompletionHandler, ApiHandlerCreateMessageMetadata } from "../index"
import { BaseProvider } from "./base-provider"

type GeminiHandlerOptions = ApiHandlerOptions & {
	isVertex?: boolean
}

export class GeminiHandler extends BaseProvider implements SingleCompletionHandler {
	protected options: ApiHandlerOptions

	private client: GoogleGenAI

	constructor({ isVertex, ...options }: GeminiHandlerOptions) {
		super()

		this.options = options

		const project = this.options.vertexProjectId ?? "not-provided"
		const location = this.options.vertexRegion ?? "not-provided"
		const apiKey = this.options.geminiApiKey ?? "not-provided"

		this.client = this.options.vertexJsonCredentials
			? new GoogleGenAI({
					vertexai: true,
					project,
					location,
					googleAuthOptions: {
						credentials: safeJsonParse<JWTInput>(this.options.vertexJsonCredentials, undefined),
					},
				})
			: this.options.vertexKeyFile
				? new GoogleGenAI({
						vertexai: true,
						project,
						location,
						googleAuthOptions: { keyFile: this.options.vertexKeyFile },
					})
				: isVertex
					? new GoogleGenAI({ vertexai: true, project, location })
					: new GoogleGenAI({ apiKey })
	}

	async *createMessage(
		systemInstruction: string,
		messages: Anthropic.Messages.MessageParam[],
		metadata?: ApiHandlerCreateMessageMetadata,
	): ApiStream {
		const { id: model, info, reasoning: thinkingConfig, maxTokens } = this.getModel()
		console.log("GeminiHandler.createMessage - Model:", model)

		// Use REST API for image generation model
		if (model === "imagen-2") {
			console.log("Detected imagen-2 model, calling handleImageGeneration")
			yield* this.handleImageGeneration(messages)
			return
		}

		const contents = messages.map(convertAnthropicMessageToGemini)

		const tools: GenerateContentConfig["tools"] = []
		if (this.options.enableUrlContext) {
			tools.push({ urlContext: {} })
		}

		if (this.options.enableGrounding) {
			tools.push({ googleSearch: {} })
		}

		const config: GenerateContentConfig = {
			systemInstruction,
			httpOptions: this.options.googleGeminiBaseUrl ? { baseUrl: this.options.googleGeminiBaseUrl } : undefined,
			thinkingConfig,
			maxOutputTokens: this.options.modelMaxTokens ?? maxTokens ?? undefined,
			temperature: this.options.modelTemperature ?? 0,
			...(tools.length > 0 ? { tools } : {}),
		}

		const params: GenerateContentParameters = { model, contents, config }

		try {
			const result = await this.client.models.generateContentStream(params)

			let lastUsageMetadata: GenerateContentResponseUsageMetadata | undefined
			let pendingGroundingMetadata: GroundingMetadata | undefined

			for await (const chunk of result) {
				// Process candidates and their parts to separate thoughts from content
				if (chunk.candidates && chunk.candidates.length > 0) {
					const candidate = chunk.candidates[0]

					if (candidate.groundingMetadata) {
						pendingGroundingMetadata = candidate.groundingMetadata
					}

					if (candidate.content && candidate.content.parts) {
						for (const part of candidate.content.parts) {
							if (part.thought) {
								// This is a thinking/reasoning part
								if (part.text) {
									yield { type: "reasoning", text: part.text }
								}
							} else {
								// This is regular content
								if (part.text) {
									yield { type: "text", text: part.text }
								}
							}
						}
					}
				}

				// Fallback to the original text property if no candidates structure
				else if (chunk.text) {
					yield { type: "text", text: chunk.text }
				}

				if (chunk.usageMetadata) {
					lastUsageMetadata = chunk.usageMetadata
				}
			}

			if (pendingGroundingMetadata) {
				const citations = this.extractCitationsOnly(pendingGroundingMetadata)
				if (citations) {
					yield { type: "text", text: `\n\n${t("common:errors.gemini.sources")} ${citations}` }
				}
			}

			if (lastUsageMetadata) {
				const inputTokens = lastUsageMetadata.promptTokenCount ?? 0
				const outputTokens = lastUsageMetadata.candidatesTokenCount ?? 0
				const cacheReadTokens = lastUsageMetadata.cachedContentTokenCount
				const reasoningTokens = lastUsageMetadata.thoughtsTokenCount

				yield {
					type: "usage",
					inputTokens,
					outputTokens,
					cacheReadTokens,
					reasoningTokens,
					totalCost: this.calculateCost({ info, inputTokens, outputTokens, cacheReadTokens }),
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(t("common:errors.gemini.generate_stream", { error: error.message }))
			}

			throw error
		}
	}

	override getModel() {
		const modelId = this.options.apiModelId
		let id = modelId && modelId in geminiModels ? (modelId as GeminiModelId) : geminiDefaultModelId
		let info: ModelInfo = geminiModels[id]
		const params = getModelParams({ format: "gemini", modelId: id, model: info, settings: this.options })

		// The `:thinking` suffix indicates that the model is a "Hybrid"
		// reasoning model and that reasoning is required to be enabled.
		// The actual model ID honored by Gemini's API does not have this
		// suffix.
		return { id: id.endsWith(":thinking") ? id.replace(":thinking", "") : id, info, ...params }
	}

	private extractCitationsOnly(groundingMetadata?: GroundingMetadata): string | null {
		const chunks = groundingMetadata?.groundingChunks

		if (!chunks) {
			return null
		}

		const citationLinks = chunks
			.map((chunk, i) => {
				const uri = chunk.web?.uri
				if (uri) {
					return `[${i + 1}](${uri})`
				}
				return null
			})
			.filter((link): link is string => link !== null)

		if (citationLinks.length > 0) {
			return citationLinks.join(", ")
		}

		return null
	}

	async completePrompt(prompt: string): Promise<string> {
		try {
			const { id: model } = this.getModel()

			const tools: GenerateContentConfig["tools"] = []
			if (this.options.enableUrlContext) {
				tools.push({ urlContext: {} })
			}
			if (this.options.enableGrounding) {
				tools.push({ googleSearch: {} })
			}
			const promptConfig: GenerateContentConfig = {
				httpOptions: this.options.googleGeminiBaseUrl
					? { baseUrl: this.options.googleGeminiBaseUrl }
					: undefined,
				temperature: this.options.modelTemperature ?? 0,
				...(tools.length > 0 ? { tools } : {}),
			}

			const result = await this.client.models.generateContent({
				model,
				contents: [{ role: "user", parts: [{ text: prompt }] }],
				config: promptConfig,
			})

			let text = result.text ?? ""

			const candidate = result.candidates?.[0]
			if (candidate?.groundingMetadata) {
				const citations = this.extractCitationsOnly(candidate.groundingMetadata)
				if (citations) {
					text += `\n\n${t("common:errors.gemini.sources")} ${citations}`
				}
			}

			return text
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(t("common:errors.gemini.generate_complete_prompt", { error: error.message }))
			}

			throw error
		}
	}

	override async countTokens(content: Array<Anthropic.Messages.ContentBlockParam>): Promise<number> {
		try {
			const { id: model } = this.getModel()

			const response = await this.client.models.countTokens({
				model,
				contents: convertAnthropicContentToGemini(content),
			})

			if (response.totalTokens === undefined) {
				console.warn("Gemini token counting returned undefined, using fallback")
				return super.countTokens(content)
			}

			return response.totalTokens
		} catch (error) {
			console.warn("Gemini token counting failed, using fallback", error)
			return super.countTokens(content)
		}
	}

	private async *handleImageGeneration(messages: Anthropic.Messages.MessageParam[]): ApiStream {
		console.log("Starting handleImageGeneration")
		console.log("Messages array:", JSON.stringify(messages, null, 2))
		
		const apiKey = this.options.geminiApiKey
		console.log("API Key exists:", !!apiKey)
		
		if (!apiKey || apiKey === "not-provided") {
			yield { type: "error", error: "NoApiKey", message: "需要配置 Gemini API Key" }
			return
		}

		// Extract text prompt from messages - look for the original user message
		// The messages array might contain system messages or error messages
		// We need to find the actual user input
		let prompt = ""
		
		// Try to find the first user message with actual content
		for (const message of messages) {
			if (message.role === 'user' && message.content) {
				if (typeof message.content === "string") {
					// Skip error messages
					if (!message.content.includes("[ERROR]") && !message.content.includes("Tool uses are formatted")) {
						prompt = message.content
						break
					}
				} else if (Array.isArray(message.content)) {
					// Find the first text content that contains the actual task
					for (const block of message.content) {
						if (block.type === "text" && block.text) {
							// Look for content within <task> tags
							const taskMatch = block.text.match(/<task>\s*(.*?)\s*<\/task>/s)
							if (taskMatch) {
								prompt = taskMatch[1].trim()
								break
							}
							// Fallback to content that's not error or environment
							if (!block.text.includes("[ERROR]") && 
								!block.text.includes("Tool uses are formatted") &&
								!block.text.includes("<environment_details>")) {
								prompt = block.text
								break
							}
						}
					}
					if (prompt) break
				}
			}
		}
		
		console.log("Extracted prompt:", prompt)

		if (!prompt) {
			yield { type: "error", error: "NoPrompt", message: "请提供图片生成提示词" }
			return
		}

		try {
			// Call REST API
			const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent`
			
			// Request image generation with size constraints for smaller output
			const requestBody = {
				contents: [{
					parts: [{
						text: `Generate a small, compressed image (512x512 pixels or smaller): ${prompt}`
					}]
				}],
				generationConfig: {
					// Add any available size/quality constraints
					maxOutputTokens: 2048
				}
			}

			console.log("Request URL:", url)
			console.log("Request body:", JSON.stringify(requestBody))

			yield { type: "text", text: "🎨 正在生成图片..." }

			console.log("Sending request...")
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'x-goog-api-key': apiKey,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(requestBody)
			})
			console.log("Response status:", response.status)

			if (!response.ok) {
				const error = await response.text()
				console.error("API Error:", error)
				yield { type: "error", error: "APIError", message: `生成失败: ${error}` }
				return
			}

			const result = await response.json()
			console.log("Response has candidates:", !!result.candidates)
			if (result.candidates && result.candidates[0]) {
				const candidate = result.candidates[0]
				console.log("Candidate has content:", !!candidate.content)
				if (candidate.content && candidate.content.parts) {
					console.log("Number of parts:", candidate.content.parts.length)
					// Check all parts for image data
					let imageFound = false
					for (let i = 0; i < candidate.content.parts.length; i++) {
						const part = candidate.content.parts[i]
						console.log(`Part ${i} type:`, Object.keys(part))
						
						// Try both camelCase and snake_case
						const inlineData = part.inlineData || part.inline_data
						if (inlineData && inlineData.data) {
							const imageBase64 = inlineData.data
							const mimeType = inlineData.mimeType || inlineData.mime_type || "image/png"
							
							console.log("Found image data, size:", imageBase64.length)
							console.log("About to yield image result...")
							console.log("Checking threshold: size =", imageBase64.length, ", threshold = 2000000, condition =", imageBase64.length > 2000000)
							
							// Save all images to workspace for proper webview display
							console.log("Saving image to workspace for webview compatibility:", imageBase64.length)
							
							try {
								const fs = require('fs')
								const path = require('path')
								const vscode = require('vscode')
								
								// Save to workspace and open in VSCode editor
								const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
								if (workspaceFolder) {
									const fileName = `gemini-generated-${Date.now()}.png`
									const fileUri = vscode.Uri.joinPath(workspaceFolder.uri, fileName)
									const filePath = fileUri.fsPath
									
									// Convert base64 to buffer and save
									const imageBuffer = Buffer.from(imageBase64, 'base64')
									fs.writeFileSync(filePath, imageBuffer)
									
									console.log("Image saved to workspace:", filePath)
									
									// Open image in VSCode editor for preview (using correct parameters)
									try {
										// For images, we need to use showTextDocument with specific options
										await vscode.window.showTextDocument(fileUri, { 
											preview: false,  // Don't use preview mode for images
											preserveFocus: false,  // Give focus to the image
											viewColumn: vscode.ViewColumn.Active 
										})
										console.log("Image opened in VSCode editor successfully")
									} catch (openError) {
										// If showTextDocument fails for images, try alternative method
										console.warn("showTextDocument failed for image, trying executeCommand:", openError)
										try {
											await vscode.commands.executeCommand('vscode.open', fileUri)
											console.log("Image opened using vscode.open command")
										} catch (cmdError) {
											console.error("Both open methods failed:", cmdError)
										}
									}
									
									// Display success message with proper line breaks
									yield { 
										type: "text", 
										text: `🖼️ **图片生成成功！**

📁 文件路径：\`${fileName}\`

💡 图片已自动在编辑器中打开预览，也可在文件资源管理器中查看

✨ 图片生成任务完成！`
									}
								} else {
									yield { 
										type: "text", 
										text: `🖼️ **图片生成成功！**\n\n⚠️ 无工作区，图片已生成但无法保存显示`
									}
								}
							} catch (saveError) {
								console.error("Failed to save image:", saveError)
								yield { 
									type: "text", 
									text: `🖼️ **图片生成成功！**\n\n⚠️ 保存失败，但图片已生成`
								}
							}
							
							// Report usage and complete successfully for ALL paths
							if (result.usageMetadata) {
								yield {
									type: "usage",
									inputTokens: result.usageMetadata.promptTokenCount || 0,
									outputTokens: result.usageMetadata.candidatesTokenCount || 0,
								}
							}
							
							// Explicitly signal task completion
							yield {
								type: "text",
								text: "<attempt_completion>\n<result>\n图片生成任务已完成。图片已保存到工作区并在编辑器中打开预览。\n</result>\n</attempt_completion>"
							}
							
							console.log("handleImageGeneration completed successfully with attempt_completion")
							return // CRITICAL: Exit immediately after processing ANY image
						} else if (part.text) {
							console.log(`Part ${i} text:`, part.text.substring(0, 100))
						}
					}
					
					if (!imageFound) {
						yield { type: "error", error: "NoImage", message: "响应中没有找到图片数据，只有文本内容" }
						yield {
							type: "text",
							text: "<attempt_completion>\n<result>\n图片生成失败：响应中没有找到图片数据。\n</result>\n</attempt_completion>"
						}
						return // Exit on error
					}
				} else {
					yield { type: "error", error: "NoImage", message: "API 响应格式异常" }
					yield {
						type: "text",
						text: "<attempt_completion>\n<result>\n图片生成失败：API响应格式异常。\n</result>\n</attempt_completion>"
					}
					return // Exit on error
				}
			} else {
				console.log("No candidates in API response")
				yield { type: "error", error: "NoImage", message: "API 响应中没有候选结果" }
				yield {
					type: "text",
					text: "<attempt_completion>\n<result>\n图片生成失败：API响应中没有候选结果。\n</result>\n</attempt_completion>"
				}
				return // Exit on error
			}
		} catch (error) {
			console.error("Image generation error:", error)
			yield { 
				type: "error", 
				error: "GenerationError", 
				message: error instanceof Error ? error.message : "图片生成失败" 
			}
			yield {
				type: "text",
				text: `<attempt_completion>\n<result>\n图片生成失败：${error instanceof Error ? error.message : "未知错误"}。\n</result>\n</attempt_completion>`
			}
			return // Exit on exception
		}
		
		console.log("handleImageGeneration completed - this should never be reached")
	}

	public calculateCost({
		info,
		inputTokens,
		outputTokens,
		cacheReadTokens = 0,
	}: {
		info: ModelInfo
		inputTokens: number
		outputTokens: number
		cacheReadTokens?: number
	}) {
		if (!info.inputPrice || !info.outputPrice || !info.cacheReadsPrice) {
			return undefined
		}

		let inputPrice = info.inputPrice
		let outputPrice = info.outputPrice
		let cacheReadsPrice = info.cacheReadsPrice

		// If there's tiered pricing then adjust the input and output token prices
		// based on the input tokens used.
		if (info.tiers) {
			const tier = info.tiers.find((tier) => inputTokens <= tier.contextWindow)

			if (tier) {
				inputPrice = tier.inputPrice ?? inputPrice
				outputPrice = tier.outputPrice ?? outputPrice
				cacheReadsPrice = tier.cacheReadsPrice ?? cacheReadsPrice
			}
		}

		// Subtract the cached input tokens from the total input tokens.
		const uncachedInputTokens = inputTokens - cacheReadTokens

		let cacheReadCost = cacheReadTokens > 0 ? cacheReadsPrice * (cacheReadTokens / 1_000_000) : 0

		const inputTokensCost = inputPrice * (uncachedInputTokens / 1_000_000)
		const outputTokensCost = outputPrice * (outputTokens / 1_000_000)
		const totalCost = inputTokensCost + outputTokensCost + cacheReadCost

		const trace: Record<string, { price: number; tokens: number; cost: number }> = {
			input: { price: inputPrice, tokens: uncachedInputTokens, cost: inputTokensCost },
			output: { price: outputPrice, tokens: outputTokens, cost: outputTokensCost },
		}

		if (cacheReadTokens > 0) {
			trace.cacheRead = { price: cacheReadsPrice, tokens: cacheReadTokens, cost: cacheReadCost }
		}

		// console.log(`[GeminiHandler] calculateCost -> ${totalCost}`, trace)

		return totalCost
	}
}
