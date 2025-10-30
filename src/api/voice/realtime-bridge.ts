/*---------------------------------------------------------------------------------------------
 *  Copyright (c) ShadanAI. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from "vscode"
import { realtimeTools } from "./realtime-tools"

/**
 * 执行工具调用
 */
export async function executeToolCall(toolName: string, args: any): Promise<any> {
	switch (toolName) {
		case "read_file":
			return await executeReadFile(args.path)

		case "write_file":
			return await executeWriteFile(args.path, args.content)

		case "execute_command":
			return await executeCommand(args.command)

		case "search_code":
			return await executeSearchCode(args.query)

		case "list_files":
			return await executeListFiles(args.path)

		case "get_current_file":
			return await executeGetCurrentFile()

		default:
			throw new Error(`Unknown tool: ${toolName}`)
	}
}

/**
 * 读取文件
 */
async function executeReadFile(path: string): Promise<any> {
	try {
		const uri = vscode.Uri.file(path)
		const content = await vscode.workspace.fs.readFile(uri)
		return {
			success: true,
			content: content.toString(),
			path,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
			path,
		}
	}
}

/**
 * 写入文件
 */
async function executeWriteFile(path: string, content: string): Promise<any> {
	try {
		const uri = vscode.Uri.file(path)
		await vscode.workspace.fs.writeFile(uri, Buffer.from(content))
		return {
			success: true,
			message: `File written: ${path}`,
			path,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
			path,
		}
	}
}

/**
 * 执行命令
 */
async function executeCommand(command: string): Promise<any> {
	try {
		const terminal = vscode.window.createTerminal("Voice Assistant")
		terminal.show()
		terminal.sendText(command)

		return {
			success: true,
			message: `Command executed: ${command}`,
			command,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
			command,
		}
	}
}

/**
 * 搜索代码
 */
async function executeSearchCode(query: string): Promise<any> {
	try {
		const files = await vscode.workspace.findFiles(`**/*${query}*`, "**/node_modules/**", 20)
		return {
			success: true,
			files: files.map((f) => f.fsPath),
			count: files.length,
			query,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
			query,
		}
	}
}

/**
 * 列出文件
 */
async function executeListFiles(path?: string): Promise<any> {
	try {
		const dirPath = path || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
		if (!dirPath) {
			return {
				success: false,
				error: "No workspace opened",
			}
		}

		const uri = vscode.Uri.file(dirPath)
		const entries = await vscode.workspace.fs.readDirectory(uri)

		return {
			success: true,
			files: entries.filter(([_, type]) => type === vscode.FileType.File).map(([name]) => name),
			directories: entries.filter(([_, type]) => type === vscode.FileType.Directory).map(([name]) => name),
			path: dirPath,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
			path,
		}
	}
}

/**
 * 获取当前文件
 */
async function executeGetCurrentFile(): Promise<any> {
	try {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			return {
				success: false,
				error: "No active editor",
			}
		}

		return {
			success: true,
			path: editor.document.fileName,
			content: editor.document.getText(),
			language: editor.document.languageId,
			lineCount: editor.document.lineCount,
		}
	} catch (error: any) {
		return {
			success: false,
			error: error.message,
		}
	}
}

/**
 * 生成Realtime API的instructions
 */
export function generateRealtimeInstructions(): string {
	const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
	const currentFile = vscode.window.activeTextEditor?.document.fileName

	return `
你是Void IDE的语音助手。你可以:
1. 帮助用户编写代码
2. 查找和修改文件
3. 执行终端命令
4. 解释代码逻辑
5. 进行代码审查

当前工作目录: ${workspaceFolder?.uri.fsPath || "N/A"}
当前打开的文件: ${currentFile || "N/A"}

请用简洁、自然的语言回答。当需要执行操作时，使用提供的工具函数。
`.trim()
}

/**
 * 获取工具列表
 */
export function getRealtimeTools() {
	return realtimeTools
}
