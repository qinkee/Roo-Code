import { A2AServer } from "./A2AServer"
import { A2AClient } from "./A2AClient"
import { AgentRoutingService } from "./AgentRoutingService"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { logger } from "../../utils/logging"
import * as vscode from "vscode"

/**
 * A2A SDK使用示例
 * 展示如何使用官方SDK进行智能体间通信
 */
export class A2AUsageExample {
	private server: A2AServer
	private client: A2AClient
	private routingService: AgentRoutingService
	private storageService: EnhancedAgentStorageService

	constructor(context: vscode.ExtensionContext) {
		this.storageService = new EnhancedAgentStorageService(context)
		this.server = new A2AServer(this.storageService)
		this.client = new A2AClient()
		this.routingService = new AgentRoutingService()
	}

	/**
	 * 示例1: 启动智能体A2A服务器
	 */
	async example1_StartAgentServer(): Promise<void> {
		try {
			logger.info("[A2AUsageExample] Example 1: Starting agent A2A server")

			// 创建测试智能体
			const agent = await this.storageService.createAgent("user123", {
				name: "Test Agent",
				roleDescription: "A test agent for A2A communication",
				apiConfigId: "default",
				mode: "assistant",
				tools: [
					{ toolId: "file-operation", enabled: true },
					{ toolId: "web-search", enabled: true }
				],
				isPrivate: false,
				shareScope: "public",
				shareLevel: 3
			})

			// 启动A2A服务器
			const serverInfo = await this.server.startAgentServer(agent.id, 3001)

			logger.info(`[A2AUsageExample] Agent server started:`, {
				agentId: agent.id,
				port: serverInfo.port,
				url: serverInfo.url,
				agentCard: serverInfo.agentCard
			})

			// 验证服务器状态
			const status = this.server.getServerStatus(agent.id)
			logger.info(`[A2AUsageExample] Server status:`, status)

		} catch (error) {
			logger.error("[A2AUsageExample] Example 1 failed:", error)
		}
	}

	/**
	 * 示例2: 智能体发现和通信
	 */
	async example2_AgentDiscoveryAndCommunication(): Promise<void> {
		try {
			logger.info("[A2AUsageExample] Example 2: Agent discovery and communication")

			// 1. 发现可用的智能体
			const availableAgents = await this.client.discoverAgents({
				capabilities: ["file-operation"],
				onlyOnline: true
			})

			logger.info(`[A2AUsageExample] Discovered ${availableAgents.length} agents:`, 
				availableAgents.map(a => ({ agentId: a.agentId, type: a.type }))
			)

			if (availableAgents.length > 0) {
				const targetAgent = availableAgents[0]

				// 2. 测试连接
				const connectionTest = await this.client.testConnection(targetAgent.agentId)
				logger.info(`[A2AUsageExample] Connection test result:`, connectionTest)

				if (connectionTest.success) {
					// 3. 发送请求
					const response = await this.client.sendRequest(
						"source-agent",
						targetAgent.agentId,
						{
							method: "execute",
							params: {
								task: "list_files",
								path: "./src"
							}
						}
					)

					logger.info(`[A2AUsageExample] Request response:`, response)
				}
			}

		} catch (error) {
			logger.error("[A2AUsageExample] Example 2 failed:", error)
		}
	}

	/**
	 * 示例3: 流式通信
	 */
	async example3_StreamingCommunication(): Promise<void> {
		try {
			logger.info("[A2AUsageExample] Example 3: Streaming communication")

			// 发现目标智能体
			const agents = await this.client.discoverAgents({ onlyOnline: true })
			if (agents.length === 0) {
				logger.warn("[A2AUsageExample] No online agents found for streaming test")
				return
			}

			const targetAgent = agents[0]

			// 发送流式请求
			await this.client.sendStreamingRequest(
				"source-agent",
				targetAgent.agentId,
				{
					method: "stream_execute",
					params: {
						task: "generate_code",
						language: "typescript"
					}
				},
				(data) => {
					logger.info("[A2AUsageExample] Streaming data received:", data)
				},
				(error) => {
					logger.error("[A2AUsageExample] Streaming error:", error)
				},
				() => {
					logger.info("[A2AUsageExample] Streaming completed")
				}
			)

		} catch (error) {
			logger.error("[A2AUsageExample] Example 3 failed:", error)
		}
	}

	/**
	 * 示例4: 智能路由
	 */
	async example4_SmartRouting(): Promise<void> {
		try {
			logger.info("[A2AUsageExample] Example 4: Smart routing")

			// 使用智能路由服务
			const response = await this.routingService.routeToAgent(
				"source-agent",
				"target-agent",
				{
					method: "execute",
					params: { task: "analyze_code", file: "example.ts" }
				},
				{
					// 让路由服务自动选择最优路径
					preferDirect: true,
					timeout: 15000,
					maxRetries: 3
				}
			)

			logger.info("[A2AUsageExample] Routed request response:", response)

		} catch (error) {
			logger.error("[A2AUsageExample] Example 4 failed:", error)
		}
	}

	/**
	 * 示例5: 多智能体协作
	 */
	async example5_MultiAgentCollaboration(): Promise<void> {
		try {
			logger.info("[A2AUsageExample] Example 5: Multi-agent collaboration")

			// 创建多个智能体
			const agents = await Promise.all([
				this.storageService.createAgent("user123", {
					name: "Code Analyzer",
					roleDescription: "Analyzes code quality and structure",
					tools: [{ toolId: "ast-parser", enabled: true }]
				}),
				this.storageService.createAgent("user123", {
					name: "Test Generator", 
					roleDescription: "Generates unit tests for code",
					tools: [{ toolId: "test-framework", enabled: true }]
				}),
				this.storageService.createAgent("user123", {
					name: "Documentation Writer",
					roleDescription: "Writes documentation for code",
					tools: [{ toolId: "markdown-generator", enabled: true }]
				})
			])

			// 启动所有智能体的A2A服务器
			const serverInfos = await Promise.all(
				agents.map((agent, index) => 
					this.server.startAgentServer(agent.id, 3010 + index)
				)
			)

			logger.info("[A2AUsageExample] Started multiple agent servers:", 
				serverInfos.map(info => ({ port: info.port, url: info.url }))
			)

			// 模拟协作流程: 代码分析 -> 测试生成 -> 文档生成
			const collaborationFlow = async () => {
				// 1. 代码分析
				const analysisResult = await this.client.sendRequest(
					"coordinator",
					agents[0].id, // Code Analyzer
					{
						method: "analyze",
						params: { code: "function example() { return 'hello'; }" }
					}
				)

				// 2. 基于分析结果生成测试
				const testResult = await this.client.sendRequest(
					"coordinator", 
					agents[1].id, // Test Generator
					{
						method: "generate_tests",
						params: { 
							analysisResult: analysisResult.data,
							framework: "jest"
						}
					}
				)

				// 3. 生成文档
				const docResult = await this.client.sendRequest(
					"coordinator",
					agents[2].id, // Documentation Writer
					{
						method: "generate_docs",
						params: {
							code: "function example() { return 'hello'; }",
							tests: testResult.data
						}
					}
				)

				return { analysisResult, testResult, docResult }
			}

			const results = await collaborationFlow()
			logger.info("[A2AUsageExample] Multi-agent collaboration results:", results)

		} catch (error) {
			logger.error("[A2AUsageExample] Example 5 failed:", error)
		}
	}

	/**
	 * 运行所有示例
	 */
	async runAllExamples(): Promise<void> {
		logger.info("[A2AUsageExample] Starting A2A SDK usage examples")

		try {
			await this.example1_StartAgentServer()
			await new Promise(resolve => setTimeout(resolve, 1000)) // 等待1秒

			await this.example2_AgentDiscoveryAndCommunication()
			await new Promise(resolve => setTimeout(resolve, 1000))

			await this.example3_StreamingCommunication()
			await new Promise(resolve => setTimeout(resolve, 1000))

			await this.example4_SmartRouting()
			await new Promise(resolve => setTimeout(resolve, 1000))

			await this.example5_MultiAgentCollaboration()

			logger.info("[A2AUsageExample] All examples completed successfully")

		} catch (error) {
			logger.error("[A2AUsageExample] Examples execution failed:", error)
		}
	}

	/**
	 * 清理资源
	 */
	async cleanup(): Promise<void> {
		try {
			// 停止所有服务器
			await this.server.stopAllServers()

			// 关闭客户端连接
			await this.client.close()

			// 关闭存储服务
			await this.storageService.close()

			logger.info("[A2AUsageExample] Cleanup completed")

		} catch (error) {
			logger.error("[A2AUsageExample] Cleanup failed:", error)
		}
	}

	/**
	 * 获取统计信息
	 */
	getStats(): {
		servers: string[]
		clients: any
	} {
		return {
			servers: this.server.getRunningServers(),
			clients: this.client.getStats()
		}
	}
}