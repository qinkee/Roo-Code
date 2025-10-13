import { z } from "zod"
import { clineMessageSchema } from "./message.js"

/**
 * HistoryItem
 */

export const historyItemSchema = z.object({
	id: z.string(),
	number: z.number(),
	ts: z.number(),
	task: z.string(),
	tokensIn: z.number(),
	tokensOut: z.number(),
	cacheWrites: z.number().optional(),
	cacheReads: z.number().optional(),
	totalCost: z.number(),
	size: z.number().optional(),
	workspace: z.string().optional(),
	mode: z.string().optional(),
	terminalNo: z.number().optional(),
	// 🔥 智能体任务标记
	source: z.enum(["user", "agent"]).optional(), // 任务来源：用户或智能体
	agentId: z.string().optional(), // 智能体ID（仅当 source === "agent" 时存在）
	// 🔥 消息历史（用于查看已完成的智能体任务）
	clineMessages: z.array(clineMessageSchema).optional(),
})

export type HistoryItem = z.infer<typeof historyItemSchema>
