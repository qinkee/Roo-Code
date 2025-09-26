import { A2AClient as OfficialA2AClient } from "@a2a-js/sdk/client"
import { logger } from "../../utils/logging"
import { AgentRequest, AgentResponse, AgentEndpoint } from "@roo-code/types"
import { UnifiedAgentRegistry } from "./UnifiedAgentRegistry"

/**
 * A2A协议客户端实现
 * 使用官方 @a2a-js/sdk 进行智能体间通信
 */
export class A2AClient {
	private clients: Map<string, OfficialA2AClient> = new Map()
	private registry: UnifiedAgentRegistry

	constructor() {
		this.registry = UnifiedAgentRegistry.getInstance()
	}

	/**
	 * 向目标智能体发送请求
	 */
	async sendRequest(
		sourceAgentId: string,
		targetAgentId: string,
		request: AgentRequest,
		options?: {
			timeout?: number
			retries?: number
		}
	): Promise<AgentResponse> {
		const startTime = Date.now()

		try {
			// 1. 获取目标智能体端点信息
			const targetEndpoint = await this.getAgentEndpoint(targetAgentId)
			if (!targetEndpoint) {
				throw new Error(`Target agent ${targetAgentId} not found`)
			}

			// 2. 检查目标智能体是否在线
			if (targetEndpoint.status.state !== 'online') {
				throw new Error(`Target agent ${targetAgentId} is offline`)
			}

			// 3. 获取或创建A2A客户端
			const client = await this.getOrCreateClient(targetEndpoint)

			// 4. 发送请求
			const response = await this.executeRequest(client, request, options)

			// 5. 构造标准响应
			const agentResponse: AgentResponse = {
				success: true,
				data: response,
				agentId: targetAgentId,
				route: 'direct',
				timestamp: Date.now(),
				duration: Date.now() - startTime
			}

			logger.info(`[A2AClient] Request sent successfully: ${sourceAgentId} -> ${targetAgentId}`)
			return agentResponse

		} catch (error) {
			const agentResponse: AgentResponse = {
				success: false,
				error: error instanceof Error ? error.message : 'Request failed',
				agentId: targetAgentId,
				route: 'direct',
				timestamp: Date.now(),
				duration: Date.now() - startTime
			}

			logger.error(`[A2AClient] Request failed: ${sourceAgentId} -> ${targetAgentId}:`, error)
			return agentResponse
		}
	}

	/**
	 * 流式请求支持
	 */
	async sendStreamingRequest(
		sourceAgentId: string,
		targetAgentId: string,
		request: AgentRequest,
		onData: (data: any) => void,
		onError: (error: Error) => void,
		onComplete: () => void
	): Promise<void> {
		try {
			// 获取目标智能体端点
			const targetEndpoint = await this.getAgentEndpoint(targetAgentId)
			if (!targetEndpoint) {
				throw new Error(`Target agent ${targetAgentId} not found`)
			}

			// 获取客户端
			const client = await this.getOrCreateClient(targetEndpoint)

			// 发送流式请求
			await this.executeStreamingRequest(client, request, onData, onError, onComplete)

			logger.info(`[A2AClient] Streaming request initiated: ${sourceAgentId} -> ${targetAgentId}`)

		} catch (error) {
			logger.error(`[A2AClient] Streaming request failed: ${sourceAgentId} -> ${targetAgentId}:`, error)
			onError(error instanceof Error ? error : new Error('Streaming request failed'))
		}
	}

	/**
	 * 获取智能体端点信息
	 */
	private async getAgentEndpoint(agentId: string): Promise<AgentEndpoint | null> {
		try {
			// 从统一注册中心获取端点信息
			const discoveryResults = await this.registry.discoverAgents({
				userId: 'system', // 系统级查询
				onlyOnline: true,
				limit: 1
			})

			if (discoveryResults.length === 0) {
				return null
			}

			const result = discoveryResults[0]
			
			// 转换为AgentEndpoint格式
			const endpoint: AgentEndpoint = {
				agentId: result.agentId,
				userId: result.userId,
				type: result.endpointType,
				directUrl: `http://localhost:3000`, // TODO: 从注册中心获取实际URL
				imProxyId: `proxy_${result.agentId}`,
				status: {
					state: result.currentLoad > 0 ? 'online' : 'offline',
					lastSeen: result.lastUsed || Date.now(),
					currentLoad: result.currentLoad,
					errorRate: result.errorRate,
					avgResponseTime: result.avgResponseTime
				},
				deploymentType: result.deploymentType
			}

			return endpoint

		} catch (error) {
			logger.error(`[A2AClient] Failed to get agent endpoint for ${agentId}:`, error)
			return null
		}
	}

	/**
	 * 获取或创建A2A客户端
	 */
	private async getOrCreateClient(endpoint: AgentEndpoint): Promise<OfficialA2AClient> {
		const clientKey = `${endpoint.agentId}_${endpoint.directUrl}`
		
		let client = this.clients.get(clientKey)
		if (!client) {
			// 创建新的A2A客户端
			client = new OfficialA2AClient(endpoint.directUrl || 'http://localhost:3000')

			this.clients.set(clientKey, client)
			logger.debug(`[A2AClient] Created new A2A client for ${endpoint.agentId}`)
		}

		return client
	}

	/**
	 * 执行请求
	 */
	private async executeRequest(
		client: OfficialA2AClient,
		request: AgentRequest,
		options?: {
			timeout?: number
			retries?: number
		}
	): Promise<any> {
		const maxRetries = options?.retries || 3
		const timeout = options?.timeout || 30000

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				// 根据官方SDK的API调整请求方式
				const response = await client.sendMessage({
					message: {
						messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
						role: "user",
						parts: [{ kind: "text", text: JSON.stringify(request.params || {}) }],
						kind: "message",
					},
					configuration: {
						blocking: true,
						acceptedOutputModes: ["text/plain"],
					}
				})

				return response

			} catch (error) {
				logger.warn(`[A2AClient] Request attempt ${attempt} failed:`, error)

				if (attempt === maxRetries) {
					throw error
				}

				// 指数退避重试
				const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000)
				await new Promise(resolve => setTimeout(resolve, delay))
			}
		}
	}

	/**
	 * 执行流式请求
	 */
	private async executeStreamingRequest(
		client: OfficialA2AClient,
		request: AgentRequest,
		onData: (data: any) => void,
		onError: (error: Error) => void,
		onComplete: () => void
	): Promise<void> {
		try {
			// 根据官方SDK的流式API调整
			/*
			await client.sendStreamingRequest({
				method: request.method || 'execute',
				params: request.params || {},
				onData,
				onError,
				onComplete
			});
			*/

			// 临时模拟实现
			setTimeout(() => {
				onData({ message: 'Streaming response chunk 1' })
			}, 100)

			setTimeout(() => {
				onData({ message: 'Streaming response chunk 2' })
			}, 200)

			setTimeout(() => {
				onComplete()
			}, 300)

		} catch (error) {
			onError(error instanceof Error ? error : new Error('Streaming request failed'))
		}
	}

	/**
	 * 发现可用的智能体
	 */
	async discoverAgents(query: {
		capabilities?: string[]
		categories?: string[]
		onlyOnline?: boolean
		region?: string
	}): Promise<AgentEndpoint[]> {
		try {
			const results = await this.registry.discoverAgents({
				userId: 'system',
				capabilities: query.capabilities,
				categories: query.categories,
				onlyOnline: query.onlyOnline ?? true,
				limit: 50
			})

			// 转换为AgentEndpoint格式
			const endpoints: AgentEndpoint[] = results.map(result => ({
				agentId: result.agentId,
				userId: result.userId,
				type: result.endpointType,
				directUrl: `http://localhost:3000`, // TODO: 从注册中心获取
				imProxyId: `proxy_${result.agentId}`,
				status: {
					state: result.currentLoad > 0 ? 'online' : 'offline',
					lastSeen: result.lastUsed || Date.now(),
					currentLoad: result.currentLoad,
					errorRate: result.errorRate,
					avgResponseTime: result.avgResponseTime
				},
				deploymentType: result.deploymentType
			}))

			logger.info(`[A2AClient] Discovered ${endpoints.length} agents`)
			return endpoints

		} catch (error) {
			logger.error(`[A2AClient] Agent discovery failed:`, error)
			return []
		}
	}

	/**
	 * 测试智能体连接
	 */
	async testConnection(agentId: string): Promise<{
		success: boolean
		latency?: number
		error?: string
	}> {
		const startTime = Date.now()

		try {
			const endpoint = await this.getAgentEndpoint(agentId)
			if (!endpoint) {
				return {
					success: false,
					error: 'Agent not found'
				}
			}

			const client = await this.getOrCreateClient(endpoint)
			
			// 发送ping请求
			await this.executeRequest(client, {
				method: 'ping',
				params: {}
			}, { timeout: 5000, retries: 1 })

			const latency = Date.now() - startTime

			return {
				success: true,
				latency
			}

		} catch (error) {
			return {
				success: false,
				latency: Date.now() - startTime,
				error: error instanceof Error ? error.message : 'Connection failed'
			}
		}
	}

	/**
	 * 关闭所有客户端连接
	 */
	async close(): Promise<void> {
		try {
			// 关闭所有客户端连接
			for (const [key, client] of this.clients) {
				try {
					// 根据官方SDK的API调整关闭方式
					// await client.close();
				} catch (error) {
					logger.error(`[A2AClient] Failed to close client ${key}:`, error)
				}
			}

			this.clients.clear()
			logger.info(`[A2AClient] All client connections closed`)

		} catch (error) {
			logger.error(`[A2AClient] Failed to close connections:`, error)
		}
	}

	/**
	 * 获取客户端统计信息
	 */
	getStats(): {
		totalClients: number
		activeConnections: string[]
	} {
		return {
			totalClients: this.clients.size,
			activeConnections: Array.from(this.clients.keys())
		}
	}
}