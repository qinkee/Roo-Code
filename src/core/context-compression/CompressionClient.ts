/**
 * Context Compression Client for Roo-Code
 * 通过 IPC 调用 Void 主进程的压缩服务
 */

import * as vscode from "vscode"
import {
	type LayeredContext,
	type CompressionRequest,
	type CompressionResponse,
	type LLMMessage,
	type CompressionBudget,
} from "./types"
import { Anthropic } from "@anthropic-ai/sdk"

export class ContextCompressionClient {
	private taskId: string
	private userId: string
	private terminalNo: number

	constructor(taskId: string, userId: string = "default", terminalNo: number = 2) {
		this.taskId = taskId
		this.userId = userId
		this.terminalNo = terminalNo
	}

	/**
	 * 请求 Void 压缩上下文
	 */
	async requestCompression(
		context: LayeredContext,
		targetTokens: number,
		maxTokens: number,
	): Promise<CompressionResponse> {
		const currentTokens = this.estimateTokens(JSON.stringify(context.recent))

		const request: CompressionRequest = {
			taskId: this.taskId,
			userId: this.userId,
			terminalNo: this.terminalNo,
			context,
			budget: {
				currentTokens,
				targetTokens,
				maxTokens,
			},
			strategy: "auto",
		}

		try {
			// 调用 Void 的压缩命令
			const response = await vscode.commands.executeCommand<CompressionResponse>(
				"void.compressContext",
				request,
			)

			if (!response) {
				throw new Error("No response from Void compression service")
			}

			return response
		} catch (error: any) {
			console.error("[CompressionClient] Request failed:", error)
			throw error
		}
	}

	/**
	 * 本地估算 token（快速）
	 * 简单规则：4 字符 = 1 token
	 */
	estimateTokens(text: string): number {
		return Math.ceil(text.length / 4)
	}

	/**
	 * 确保上下文在预算内（守门员机制）
	 * 如果超过预算,自动调用压缩
	 */
	async ensureContextWithinBudget(messages: Anthropic.MessageParam[], budget: number, maxTokens: number): Promise<{
		messages: Anthropic.MessageParam[]
		compressed: boolean
		summary?: string
	}> {
		const currentTokens = this.estimateTokens(JSON.stringify(messages))

		// 已经在预算内
		if (currentTokens <= budget) {
			console.log(`[ContextCompression] Within budget: ${currentTokens} <= ${budget} tokens`)
			return {
				messages,
				compressed: false,
			}
		}

		console.log(
			`[ContextCompression] Exceeds budget: ${currentTokens} > ${budget} tokens, requesting compression`,
		)

		try {
			// 构建分层上下文
			const context: LayeredContext = {
				core: messages.filter((m) => m.role === "system") as LLMMessage[],
				recent: messages.filter((m) => m.role !== "system") as LLMMessage[],
			}

			// 请求 Void 压缩
			const response = await this.requestCompression(context, budget, maxTokens)

			if (response.success && response.result) {
				const { newSummary, retainedMessages, stats } = response.result

				console.log(
					`[ContextCompression] Success: ${stats.originalTokens} → ${stats.compressedTokens} tokens (${Math.round((1 - stats.compressionRatio) * 100)}% reduction)`,
				)

				// 应用压缩结果
				const compressedMessages: Anthropic.MessageParam[] = [
					...context.core,
					// 添加摘要作为 system 消息
					...(newSummary
						? [
								{
									role: "system" as const,
									content: `Previous conversation summary:\n${newSummary}`,
								},
							]
						: []),
					// 添加保留的最近消息
					...retainedMessages,
				] as Anthropic.MessageParam[]

				return {
					messages: compressedMessages,
					compressed: true,
					summary: newSummary,
				}
			} else {
				throw new Error(response.error?.message || "Compression failed")
			}
		} catch (error: any) {
			console.warn("[ContextCompression] Void compression failed, using local fallback:", error.message)
			return {
				messages: this.fallbackTruncate(messages),
				compressed: true,
				summary: "Fallback truncation applied",
			}
		}
	}

	/**
	 * 本地回退压缩（Void 不可用时）
	 * 简单策略：保留 system 消息 + 最近 10 条消息
	 */
	fallbackTruncate(messages: Anthropic.MessageParam[]): Anthropic.MessageParam[] {
		console.warn("[ContextCompression] Using fallback truncation (keep last 10 messages)")

		const systemMessages = messages.filter((m) => m.role === "system")
		const otherMessages = messages.filter((m) => m.role !== "system")

		// 保留最近 10 条
		const retained = otherMessages.slice(-10)

		return [...systemMessages, ...retained]
	}
}
