import { z } from "zod"
import { parentPort } from "worker_threads"
import * as path from "path"
import * as fs from "fs"

// Worker消息类型定义
export const agentExecutorRequestSchema = z.object({
	type: z.literal("execute"),
	taskId: z.string(),
	agent: z.object({
		id: z.string(),
		name: z.string(),
		roleDescription: z.string(),
		apiConfigId: z.string(),
		mode: z.string(),
		tools: z.array(z.object({
			toolId: z.string(),
			enabled: z.boolean(),
			config: z.record(z.any()).optional()
		}))
	}),
	userMessage: z.string(),
	workspacePath: z.string().optional(),
})

export const agentExecutorResponseSchema = z.discriminatedUnion("success", [
	z.object({
		success: z.literal(true),
		taskId: z.string(),
		response: z.string(),
		duration: z.number(),
		tokensUsed: z.number().optional(),
		toolsUsed: z.array(z.string()).optional(),
	}),
	z.object({
		success: z.literal(false),
		taskId: z.string(),
		error: z.string(),
		duration: z.number(),
	}),
])

export type AgentExecutorRequest = z.infer<typeof agentExecutorRequestSchema>
export type AgentExecutorResponse = z.infer<typeof agentExecutorResponseSchema>

/**
 * 独立的Task执行器 - 不依赖vscode API
 */
class StandaloneTaskExecutor {
	private workspacePath: string
	private usedTools: string[] = []

	constructor(workspacePath: string) {
		this.workspacePath = workspacePath || process.cwd()
	}

	async executeTask(agent: any, userMessage: string, apiConfig: any): Promise<string> {
		console.log(`[StandaloneTaskExecutor] Executing task for agent ${agent.name} with mode: ${agent.mode}`)
		
		// 验证API配置
		if (!apiConfig.openAiApiKey || apiConfig.openAiApiKey === "sk-test") {
			throw new Error(`智能体 ${agent.name} 需要配置有效的API密钥才能执行任务`)
		}

		// 第一步：让AI分析任务并决定执行策略
		const aiResponse = await this.callAI(userMessage, agent, apiConfig)
		
		// 第二步：解析AI响应中的工具调用
		const toolCalls = this.parseToolCalls(aiResponse)
		let finalResponse = aiResponse

		// 第三步：执行工具调用
		if (toolCalls.length > 0) {
			console.log(`[StandaloneTaskExecutor] Found ${toolCalls.length} tool calls`)
			
			let toolResults = ""
			for (const toolCall of toolCalls) {
				try {
					const result = await this.executeTool(toolCall)
					toolResults += `\n\n[Tool: ${toolCall.tool}]\n${result}`
					this.usedTools.push(toolCall.tool)
				} catch (error) {
					toolResults += `\n\n[Tool: ${toolCall.tool} - ERROR]\n${error instanceof Error ? error.message : 'Unknown error'}`
				}
			}

			// 第四步：如果有工具执行结果，让AI整合结果
			if (toolResults.trim()) {
				const summaryPrompt = `用户请求: ${userMessage}\n\n工具执行结果:${toolResults}\n\n请基于工具执行结果，给出最终的完整回复:`
				finalResponse = await this.callAI(summaryPrompt, agent, apiConfig)
			}
		}

		return finalResponse
	}

	private async callAI(message: string, agent: any, apiConfig: any): Promise<string> {
		try {
			// 构建工具描述
			const availableTools = agent.tools.filter((t: any) => t.enabled).map((t: any) => t.toolId)
			
			const systemPrompt = `你是智能体"${agent.name}"，${agent.roleDescription}

工作模式: ${agent.mode}
当前工作目录: ${this.workspacePath}

可用工具: ${availableTools.join(', ')}

你的职责是像Roo-Code一样，分析用户请求并执行完整的任务。你可以使用以下工具:

🔧 文件操作工具:
- READ <file_path>: 读取文件内容，用于理解代码、文档等
- WRITE <file_path>:<content>: 创建或写入文件
- LS <directory>: 列出目录内容，用于了解项目结构

🖥️ 系统工具:  
- BASH <command>: 执行系统命令，如npm install、python script.py、git命令等
- MKDIR <directory>: 创建目录

如果需要使用工具，请在回复中包含工具调用，格式为:
[TOOL_CALL:工具名称:参数]

重要原则:
1. 直接回答用户问题，不要问"需要做什么"
2. 如果是技术问题，可以创建代码示例或执行相关命令
3. 如果是知识问题，直接提供答案，必要时使用工具辅助
4. 像一个真正的AI助手，而不是等待指令的工具`

			const response = await fetch(`${apiConfig.openAiBaseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${apiConfig.openAiApiKey}`
				},
				body: JSON.stringify({
					model: apiConfig.modelName || 'gpt-3.5-turbo',
					messages: [
						{ role: 'system', content: systemPrompt },
						{ role: 'user', content: message }
					],
					max_tokens: apiConfig.maxTokens || 2000,
					temperature: apiConfig.temperature || 0.7
				})
			})

			if (!response.ok) {
				throw new Error(`AI API error: ${response.status}`)
			}

			const data = await response.json()
			return data.choices[0]?.message?.content || "AI未返回有效响应"

		} catch (error) {
			console.error("[StandaloneTaskExecutor] AI API call failed:", error)
			return `AI调用失败: ${error instanceof Error ? error.message : "Unknown error"}`
		}
	}


	private parseToolCalls(response: string): Array<{tool: string, args: string}> {
		const toolCallRegex = /\[TOOL_CALL:(\w+):([^\]]+)\]/g
		const toolCalls: Array<{tool: string, args: string}> = []
		let match

		while ((match = toolCallRegex.exec(response)) !== null) {
			toolCalls.push({
				tool: match[1].toUpperCase(),
				args: match[2].trim()
			})
		}

		return toolCalls
	}

	private async executeTool(toolCall: {tool: string, args: string}): Promise<string> {
		const { tool, args } = toolCall
		
		try {
			switch (tool) {
				case 'READ':
					return await this.toolRead(args)
				case 'WRITE':
					return await this.toolWrite(args)
				case 'BASH':
					return await this.toolBash(args)
				case 'LS':
					return await this.toolLs(args)
				case 'MKDIR':
					return await this.toolMkdir(args)
				default:
					return `Unknown tool: ${tool}`
			}
		} catch (error) {
			throw new Error(`Tool ${tool} failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}

	private async toolRead(filePath: string): Promise<string> {
		const fullPath = path.resolve(this.workspacePath, filePath)
		if (!fs.existsSync(fullPath)) {
			throw new Error(`File not found: ${filePath}`)
		}
		const content = fs.readFileSync(fullPath, 'utf-8')
		return `File content (${filePath}):\n\`\`\`\n${content}\n\`\`\``
	}

	private async toolWrite(args: string): Promise<string> {
		const colonIndex = args.indexOf(':')
		if (colonIndex === -1) {
			throw new Error("Invalid WRITE format. Use: WRITE <file_path>:<content>")
		}
		
		const filePath = args.substring(0, colonIndex).trim()
		const content = args.substring(colonIndex + 1)
		
		const fullPath = path.resolve(this.workspacePath, filePath)
		const dir = path.dirname(fullPath)
		
		// 确保目录存在
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}
		
		fs.writeFileSync(fullPath, content, 'utf-8')
		return `Successfully wrote to ${filePath}`
	}

	private async toolBash(command: string): Promise<string> {
		const { exec } = await import('child_process')
		const { promisify } = await import('util')
		const execAsync = promisify(exec)
		
		try {
			const { stdout, stderr } = await execAsync(command, { 
				cwd: this.workspacePath,
				timeout: 30000 // 30秒超时
			})
			
			let result = ""
			if (stdout) result += `STDOUT:\n${stdout}`
			if (stderr) result += `${result ? '\n' : ''}STDERR:\n${stderr}`
			
			return result || "Command executed successfully (no output)"
		} catch (error: any) {
			throw new Error(`Command failed: ${error.message}`)
		}
	}

	private async toolLs(directory: string = "."): Promise<string> {
		const fullPath = path.resolve(this.workspacePath, directory)
		if (!fs.existsSync(fullPath)) {
			throw new Error(`Directory not found: ${directory}`)
		}
		
		const items = fs.readdirSync(fullPath)
		const details = items.map(item => {
			const itemPath = path.join(fullPath, item)
			const stats = fs.statSync(itemPath)
			const type = stats.isDirectory() ? '[DIR]' : '[FILE]'
			const size = stats.isFile() ? ` (${stats.size} bytes)` : ''
			return `${type} ${item}${size}`
		})
		
		return `Directory listing (${directory}):\n${details.join('\n')}`
	}

	private async toolMkdir(directory: string): Promise<string> {
		const fullPath = path.resolve(this.workspacePath, directory)
		fs.mkdirSync(fullPath, { recursive: true })
		return `Created directory: ${directory}`
	}

	getUsedTools(): string[] {
		return this.usedTools
	}
}

/**
 * Agent执行器Worker
 * 在独立的Worker线程中执行智能体任务，确保不阻塞主进程和UI
 */
class AgentExecutorWorker {
	private taskExecutors: Map<string, AbortController> = new Map()

	constructor() {
		this.setupMessageHandler()
	}

	private setupMessageHandler() {
		parentPort?.on("message", async (message: AgentExecutorRequest) => {
			try {
				const request = agentExecutorRequestSchema.parse(message)
				await this.executeAgentTask(request)
			} catch (error) {
				this.sendError("INVALID_REQUEST", error instanceof Error ? error.message : "Invalid request format")
			}
		})
	}

	private async executeAgentTask(request: AgentExecutorRequest) {
		const startTime = Date.now()
		const { taskId, agent, userMessage, workspacePath } = request

		// 创建任务中止控制器
		const abortController = new AbortController()
		this.taskExecutors.set(taskId, abortController)

		try {
			console.log(`[AgentWorker] Starting task ${taskId} for agent ${agent.id}`)

			// 创建独立的Task执行器
			const taskExecutor = new StandaloneTaskExecutor(workspacePath || process.cwd())
			
			// 获取API配置
			const apiConfig = await this.getApiConfigForAgent(agent.apiConfigId)
			
			// 执行真正的智能体任务
			const response = await taskExecutor.executeTask(agent, userMessage, apiConfig)

			const duration = Date.now() - startTime

			// 发送成功响应
			this.sendResponse({
				success: true,
				taskId,
				response,
				duration,
				tokensUsed: 200, // 估算token使用
				toolsUsed: taskExecutor.getUsedTools(),
			})

		} catch (error) {
			const duration = Date.now() - startTime
			console.error(`[AgentWorker] Task ${taskId} failed:`, error)

			this.sendResponse({
				success: false,
				taskId,
				error: error instanceof Error ? error.message : "Unknown error",
				duration,
			})
		} finally {
			// 清理任务执行器
			this.taskExecutors.delete(taskId)
		}
	}

	private async getApiConfigForAgent(apiConfigId: string): Promise<any> {
		// TODO: 这里应该从真实的API配置存储中获取
		// 目前使用环境变量作为fallback
		
		// 检查是否有真实的API密钥配置
		const openAiApiKey = process.env.OPENAI_API_KEY
		if (!openAiApiKey || openAiApiKey === "sk-test") {
			throw new Error(`智能体需要配置有效的API密钥。请在环境变量中设置 OPENAI_API_KEY`)
		}

		return {
			modelName: process.env.OPENAI_MODEL || "gpt-4",
			openAiApiKey: openAiApiKey,
			openAiBaseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
			maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || "4000"),
			temperature: parseFloat(process.env.OPENAI_TEMPERATURE || "0.7"),
		}
	}

	private sendResponse(response: AgentExecutorResponse) {
		parentPort?.postMessage(response)
	}

	private sendError(code: string, message: string) {
		parentPort?.postMessage({
			success: false,
			taskId: "unknown",
			error: `${code}: ${message}`,
			duration: 0,
		})
	}
}

// 启动Worker
new AgentExecutorWorker()