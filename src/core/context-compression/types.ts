/**
 * Context Compression Types for Roo-Code
 * 与 Void 端的类型定义保持一致
 */

import { Anthropic } from "@anthropic-ai/sdk"

/**
 * LLM 消息格式
 */
export interface LLMMessage {
	role: "system" | "user" | "assistant"
	content: string | Anthropic.Messages.ContentBlock[]
}

/**
 * 分层上下文结构
 */
export interface LayeredContext {
	/** 核心层：永不压缩（系统提示词、初始目标） */
	core: LLMMessage[]
	/** 摘要层：已压缩的历史摘要 */
	summary?: string
	/** 活跃层：待压缩的最近消息 */
	recent: LLMMessage[]
}

/**
 * 预算约束信息
 */
export interface CompressionBudget {
	/** 当前 token 数 */
	currentTokens: number
	/** 目标 token 数（压缩到多少） */
	targetTokens: number
	/** 上下文窗口最大 token 数 */
	maxTokens: number
}

/**
 * 压缩策略类型
 */
export type CompressionStrategy = "sliding-window" | "summarization" | "auto"

/**
 * 压缩配置选项
 */
export interface CompressionOptions {
	/** 保留最近几条消息（默认 5） */
	preserveLastN?: number
	/** 目标压缩比（默认 0.4 = 压缩到 40%） */
	compressionRatio?: number
}

/**
 * 压缩请求参数
 */
export interface CompressionRequest {
	/** 任务标识 */
	taskId: string
	/** 用户标识（多用户隔离） */
	userId: string
	/** 终端类型 */
	terminalNo: number
	/** 分层上下文 */
	context: LayeredContext
	/** 预算约束 */
	budget: CompressionBudget
	/** 压缩策略（可选，默认 'auto'） */
	strategy?: CompressionStrategy
	/** 配置选项（可选） */
	options?: CompressionOptions
}

/**
 * 压缩统计信息
 */
export interface CompressionStats {
	/** 原始 token 数 */
	originalTokens: number
	/** 压缩后 token 数 */
	compressedTokens: number
	/** 压缩比（0.4 = 压缩到 40%） */
	compressionRatio: number
	/** 使用的策略 */
	strategy: string
	/** 耗时（毫秒） */
	timeMs: number
	/** 成本（美元，可选） */
	cost?: number
}

/**
 * 压缩结果
 */
export interface CompressionResult {
	/** 新的摘要（合并了旧摘要 + 压缩的消息） */
	newSummary: string
	/** 保留的完整消息（最近 N 条） */
	retainedMessages: LLMMessage[]
	/** 统计信息 */
	stats: CompressionStats
}

/**
 * 错误代码
 */
export type CompressionErrorCode =
	| "COMPRESSION_FAILED"
	| "BUDGET_UNREACHABLE"
	| "LLM_ERROR"
	| "TIMEOUT"
	| "INVALID_REQUEST"

/**
 * 压缩错误
 */
export interface CompressionError {
	code: CompressionErrorCode
	message: string
	details?: any
}

/**
 * 压缩响应
 */
export interface CompressionResponse {
	/** 请求标识 */
	taskId: string
	/** 是否成功 */
	success: boolean
	/** 压缩结果（成功时） */
	result?: CompressionResult
	/** 错误信息（失败时） */
	error?: CompressionError
}

/**
 * Token 估算请求
 */
export interface TokenEstimationRequest {
	/** 待估算的文本 */
	text: string
	/** 模型名称（用于选择系数，可选） */
	modelName?: string
}

/**
 * Token 估算响应
 */
export interface TokenEstimationResponse {
	/** 估算的 token 数 */
	tokens: number
	/** 使用的方法 */
	method: "simple" | "tiktoken"
}
