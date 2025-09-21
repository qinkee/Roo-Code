import { logger } from "../../utils/logging"
import { NetworkUtils } from "../../utils/network"

/**
 * A2A连接管理器
 * 支持直连和IP桥接降级机制
 */
export class A2AConnectionManager {
	private static instance: A2AConnectionManager
	private bridgeServers: Map<string, any> = new Map()

	private constructor() {}

	static getInstance(): A2AConnectionManager {
		if (!A2AConnectionManager.instance) {
			A2AConnectionManager.instance = new A2AConnectionManager()
		}
		return A2AConnectionManager.instance
	}

	/**
	 * 测试直连可达性
	 */
	async testDirectConnection(url: string, timeout: number = 5000): Promise<boolean> {
		try {
			const urlObj = new URL(url)
			const host = urlObj.hostname
			const port = parseInt(urlObj.port) || (urlObj.protocol === "https:" ? 443 : 80)

			logger.info(`[A2AConnectionManager] Testing direct connection to ${host}:${port}`)

			const isReachable = await NetworkUtils.testConnection(host, port, timeout)
			logger.info(`[A2AConnectionManager] Direct connection test result: ${isReachable}`)

			return isReachable
		} catch (error) {
			logger.error(`[A2AConnectionManager] Direct connection test failed:`, error)
			return false
		}
	}

	/**
	 * 获取最佳连接方式
	 */
	async getBestConnectionMethod(targetUrl: string): Promise<{
		method: "direct" | "bridge"
		url: string
		reason: string
	}> {
		// 首先尝试直连
		const directReachable = await this.testDirectConnection(targetUrl)

		if (directReachable) {
			return {
				method: "direct",
				url: targetUrl,
				reason: "Direct connection available",
			}
		}

		// 直连失败，尝试桥接
		logger.info(`[A2AConnectionManager] Direct connection failed, attempting bridge connection`)

		const bridgeUrl = await this.setupBridgeConnection(targetUrl)
		if (bridgeUrl) {
			return {
				method: "bridge",
				url: bridgeUrl,
				reason: "Direct connection failed, using bridge",
			}
		}

		// 都失败了，返回原URL但标记为不可达
		return {
			method: "direct",
			url: targetUrl,
			reason: "Both direct and bridge connections failed",
		}
	}

	/**
	 * 设置桥接连接
	 */
	private async setupBridgeConnection(targetUrl: string): Promise<string | null> {
		try {
			// 检查是否已有桥接服务器
			const existingBridge = this.bridgeServers.get(targetUrl)
			if (existingBridge && (await this.testDirectConnection(existingBridge.url))) {
				logger.info(`[A2AConnectionManager] Using existing bridge for ${targetUrl}`)
				return existingBridge.url
			}

			// 创建新的桥接服务器
			const bridgePort = await this.findAvailablePort()
			const bridgeUrl = await this.createBridgeServer(targetUrl, bridgePort)

			if (bridgeUrl) {
				this.bridgeServers.set(targetUrl, {
					url: bridgeUrl,
					targetUrl,
					createdAt: Date.now(),
				})

				logger.info(`[A2AConnectionManager] Created bridge server: ${bridgeUrl} -> ${targetUrl}`)
				return bridgeUrl
			}

			return null
		} catch (error) {
			logger.error(`[A2AConnectionManager] Failed to setup bridge connection:`, error)
			return null
		}
	}

	/**
	 * 创建桥接服务器
	 */
	private async createBridgeServer(targetUrl: string, port: number): Promise<string | null> {
		try {
			const http = require("http")
			const https = require("https")

			const bindAddress = await NetworkUtils.getRecommendedBindAddress()

			const server = http.createServer(async (req: any, res: any) => {
				try {
					// 设置CORS头
					res.setHeader("Access-Control-Allow-Origin", "*")
					res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
					res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

					if (req.method === "OPTIONS") {
						res.writeHead(200)
						res.end()
						return
					}

					// 代理请求到目标服务器
					const targetUrlObj = new URL(targetUrl)
					const isHttps = targetUrlObj.protocol === "https:"
					const client = isHttps ? https : http

					const proxyReq = client.request(
						{
							hostname: targetUrlObj.hostname,
							port: targetUrlObj.port || (isHttps ? 443 : 80),
							path: req.url,
							method: req.method,
							headers: req.headers,
						},
						(proxyRes: any) => {
							res.writeHead(proxyRes.statusCode, proxyRes.headers)
							proxyRes.pipe(res)
						},
					)

					proxyReq.on("error", (error: any) => {
						logger.error(`[A2AConnectionManager] Proxy request error:`, error)
						res.writeHead(500, { "Content-Type": "application/json" })
						res.end(JSON.stringify({ error: "Bridge connection failed" }))
					})

					req.pipe(proxyReq)
				} catch (error) {
					logger.error(`[A2AConnectionManager] Bridge server error:`, error)
					res.writeHead(500, { "Content-Type": "application/json" })
					res.end(JSON.stringify({ error: "Internal bridge error" }))
				}
			})

			const bridgeUrl = await new Promise<string>((resolve, reject) => {
				server.listen(port, bindAddress, () => {
					const address = server.address()
					if (address && typeof address === "object") {
						const url = NetworkUtils.buildServerUrl(bindAddress, address.port)
						logger.info(`[A2AConnectionManager] Bridge server started on ${url}`)
						resolve(url)
					} else {
						reject(new Error("Failed to start bridge server"))
					}
				})

				server.on("error", reject)
			})

			return bridgeUrl
		} catch (error) {
			logger.error(`[A2AConnectionManager] Failed to create bridge server:`, error)
			return null
		}
	}

	/**
	 * 查找可用端口
	 */
	private async findAvailablePort(startPort: number = 65000): Promise<number> {
		for (let port = startPort; port < 65535; port++) {
			if (await NetworkUtils.isPortAvailable(port)) {
				return port
			}
		}
		throw new Error("No available port found for bridge server")
	}

	/**
	 * 清理桥接服务器
	 */
	async cleanupBridgeServers(): Promise<void> {
		const now = Date.now()
		const maxAge = 30 * 60 * 1000 // 30分钟

		for (const [targetUrl, bridge] of this.bridgeServers.entries()) {
			if (now - bridge.createdAt > maxAge) {
				try {
					// 停止桥接服务器（需要保存服务器实例引用）
					logger.info(`[A2AConnectionManager] Cleaning up expired bridge for ${targetUrl}`)
					this.bridgeServers.delete(targetUrl)
				} catch (error) {
					logger.error(`[A2AConnectionManager] Failed to cleanup bridge:`, error)
				}
			}
		}
	}

	/**
	 * 获取连接统计
	 */
	getConnectionStats(): {
		directConnections: number
		bridgeConnections: number
		activeBridges: number
	} {
		return {
			directConnections: 0, // TODO: 实现连接统计
			bridgeConnections: 0,
			activeBridges: this.bridgeServers.size,
		}
	}
}
