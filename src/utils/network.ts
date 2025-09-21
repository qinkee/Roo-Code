import { networkInterfaces } from "os"
import { logger } from "./logging"

/**
 * 网络工具类 - 支持内网IP获取和连接检测
 */
export class NetworkUtils {
	/**
	 * 获取本机内网IP地址
	 */
	static getLocalIP(): string {
		try {
			const interfaces = networkInterfaces()

			// 优先级顺序：以太网 > WiFi > 其他
			const priorities = ["以太网", "Ethernet", "eth0", "Wi-Fi", "WiFi", "wlan0", "en0", "en1"]

			for (const priority of priorities) {
				const iface = interfaces[priority]
				if (iface) {
					for (const details of iface) {
						if (details.family === "IPv4" && !details.internal) {
							logger.info(`[NetworkUtils] Found preferred IP ${details.address} on interface ${priority}`)
							return details.address
						}
					}
				}
			}

			// 备选方案：遍历所有接口找到第一个非内部的IPv4地址
			for (const [name, iface] of Object.entries(interfaces)) {
				if (iface) {
					for (const details of iface) {
						if (details.family === "IPv4" && !details.internal) {
							logger.info(`[NetworkUtils] Using fallback IP ${details.address} on interface ${name}`)
							return details.address
						}
					}
				}
			}

			logger.warn("[NetworkUtils] No local IP found, falling back to localhost")
			return "127.0.0.1"
		} catch (error) {
			logger.error("[NetworkUtils] Error getting local IP:", error)
			return "127.0.0.1"
		}
	}

	/**
	 * 获取所有可用的内网IP地址
	 */
	static getAllLocalIPs(): string[] {
		try {
			const interfaces = networkInterfaces()
			const ips: string[] = []

			for (const [name, iface] of Object.entries(interfaces)) {
				if (iface) {
					for (const details of iface) {
						if (details.family === "IPv4" && !details.internal) {
							ips.push(details.address)
						}
					}
				}
			}

			return ips.length > 0 ? ips : ["127.0.0.1"]
		} catch (error) {
			logger.error("[NetworkUtils] Error getting all local IPs:", error)
			return ["127.0.0.1"]
		}
	}

	/**
	 * 检测端口是否可用
	 */
	static async isPortAvailable(port: number, host: string = "0.0.0.0"): Promise<boolean> {
		const net = require("net")

		return new Promise((resolve) => {
			const server = net.createServer()

			server.listen(port, host, () => {
				server.close(() => resolve(true))
			})

			server.on("error", () => resolve(false))
		})
	}

	/**
	 * 测试网络连接
	 */
	static async testConnection(host: string, port: number, timeout: number = 3000): Promise<boolean> {
		const net = require("net")

		return new Promise((resolve) => {
			const socket = new net.Socket()

			const timer = setTimeout(() => {
				socket.destroy()
				resolve(false)
			}, timeout)

			socket.connect(port, host, () => {
				clearTimeout(timer)
				socket.destroy()
				resolve(true)
			})

			socket.on("error", () => {
				clearTimeout(timer)
				resolve(false)
			})
		})
	}

	/**
	 * 获取推荐的绑定地址
	 * 优先使用内网IP，如果不可用则降级到0.0.0.0或127.0.0.1
	 */
	static async getRecommendedBindAddress(): Promise<string> {
		const localIP = this.getLocalIP()

		// 如果获取到的是localhost，直接返回0.0.0.0以支持内网访问
		if (localIP === "127.0.0.1") {
			logger.info("[NetworkUtils] Using 0.0.0.0 for network accessibility")
			return "0.0.0.0"
		}

		// 测试内网IP是否可以绑定
		const canBindToLocal = await this.isPortAvailable(0, localIP)
		if (canBindToLocal) {
			logger.info(`[NetworkUtils] Using local IP ${localIP} for optimal performance`)
			return localIP
		}

		// 降级到0.0.0.0
		logger.info("[NetworkUtils] Falling back to 0.0.0.0 for universal access")
		return "0.0.0.0"
	}

	/**
	 * 构建服务器URL
	 */
	static buildServerUrl(bindAddress: string, port: number): string {
		if (bindAddress === "0.0.0.0") {
			// 如果绑定到0.0.0.0，URL应该使用实际的本地IP
			const localIP = this.getLocalIP()
			return `http://${localIP}:${port}`
		}

		return `http://${bindAddress}:${port}`
	}

	/**
	 * 获取用于显示的服务器信息
	 */
	static getServerDisplayInfo(
		bindAddress: string,
		port: number,
	): {
		bindAddress: string
		publicUrl: string
		localUrl: string
		allUrls: string[]
	} {
		const localIP = this.getLocalIP()
		const allIPs = this.getAllLocalIPs()

		return {
			bindAddress,
			publicUrl: `http://${localIP}:${port}`,
			localUrl: `http://127.0.0.1:${port}`,
			allUrls: allIPs.map((ip) => `http://${ip}:${port}`),
		}
	}
}
