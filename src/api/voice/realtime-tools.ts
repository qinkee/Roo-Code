/*---------------------------------------------------------------------------------------------
 *  Copyright (c) ShadanAI. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

/**
 * OpenAI Realtime API 工具函数定义
 * 这些工具可以被语音助手调用来执行代码操作
 */

export interface VoiceTool {
	name: string
	description: string
	parameters: {
		type: "object"
		properties: Record<string, any>
		required?: string[]
	}
}

/**
 * 工具函数列表
 */
export const realtimeTools: VoiceTool[] = [
	{
		name: "read_file",
		description: "读取指定路径的文件内容",
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "文件相对路径或绝对路径",
				},
			},
			required: ["path"],
		},
	},
	{
		name: "write_file",
		description: "写入内容到文件",
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "文件路径",
				},
				content: {
					type: "string",
					description: "文件内容",
				},
			},
			required: ["path", "content"],
		},
	},
	{
		name: "execute_command",
		description: "在终端执行命令",
		parameters: {
			type: "object",
			properties: {
				command: {
					type: "string",
					description: "要执行的命令",
				},
			},
			required: ["command"],
		},
	},
	{
		name: "search_code",
		description: "在代码库中搜索关键词",
		parameters: {
			type: "object",
			properties: {
				query: {
					type: "string",
					description: "搜索关键词",
				},
			},
			required: ["query"],
		},
	},
	{
		name: "list_files",
		description: "列出目录下的文件",
		parameters: {
			type: "object",
			properties: {
				path: {
					type: "string",
					description: "目录路径，默认为当前工作目录",
				},
			},
		},
	},
	{
		name: "get_current_file",
		description: "获取当前打开的文件路径和内容",
		parameters: {
			type: "object",
			properties: {},
		},
	},
]
