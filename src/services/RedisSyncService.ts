import { createClient, RedisClientType } from 'redis'
import * as vscode from 'vscode'

interface RedisConfig {
	enabled: boolean
	host: string
	port: number
	password: string
	database: number
}

export class RedisSyncService {
	private static instance: RedisSyncService
	private client: RedisClientType | null = null
	private isConnected = false
	private failureCount = 0
	private lastFailureTime = 0
	
	// 批量写入缓冲
	private writeBuffer = new Map<string, any>()
	private flushTimer: NodeJS.Timeout | null = null
	
	private constructor() {
		this.connect()
	}
	
	static getInstance(): RedisSyncService {
		if (!RedisSyncService.instance) {
			RedisSyncService.instance = new RedisSyncService()
		}
		return RedisSyncService.instance
	}
	
	private getConfig(): RedisConfig {
		// 优先从VSCode配置读取
		const config = vscode.workspace.getConfiguration('roo-cline').get<RedisConfig>('redis')
		if (config) {
			return config
		}
		
		// 降级到环境变量
		return {
			enabled: process.env.REDIS_ENABLED !== 'false',
			host: process.env.REDIS_HOST || 'localhost',
			port: parseInt(process.env.REDIS_PORT || '6379'),
			password: process.env.REDIS_PASSWORD || '',
			database: parseInt(process.env.REDIS_DB || '0')
		}
	}
	
	private async connect() {
		const config = this.getConfig()
		
		// 如果配置中禁用了Redis，直接返回
		if (!config.enabled) {
			console.log('[Redis] Sync service disabled by configuration')
			return
		}
		
		try {
			this.client = createClient({
				socket: {
					host: config.host,
					port: config.port,
					reconnectStrategy: false // 不自动重连
				},
				password: config.password || undefined,
				database: config.database
			})
			
			this.client.on('ready', () => {
				this.isConnected = true
				this.failureCount = 0
				console.log('[Redis] Connected successfully')
			})
			
			this.client.on('error', (err) => {
				console.debug('[Redis] Connection error:', err.message)
				this.isConnected = false
			})
			
			this.client.on('end', () => {
				this.isConnected = false
				console.debug('[Redis] Connection closed')
			})
			
			await this.client.connect()
		} catch (error) {
			console.debug('[Redis] Failed to connect:', error instanceof Error ? error.message : 'Unknown error')
			this.isConnected = false
		}
	}
	
	async set(key: string, value: any): Promise<void> {
		// 降级检查 - 连续失败5次后暂停1分钟
		if (this.failureCount >= 5) {
			const now = Date.now()
			if (now - this.lastFailureTime < 60000) {
				return // 降级期间跳过Redis
			} else {
				this.failureCount = 0 // 重置计数
			}
		}
		
		// 加入缓冲区
		this.writeBuffer.set(key, value)
		
		// 延迟批量写入
		if (!this.flushTimer) {
			this.flushTimer = setTimeout(() => this.flush(), 100)
		}
	}
	
	private async flush() {
		if (!this.isConnected || this.writeBuffer.size === 0) {
			this.flushTimer = null
			this.writeBuffer.clear()
			return
		}
		
		try {
			const multi = this.client?.multi()
			
			for (const [key, value] of this.writeBuffer) {
				multi?.setEx(key, 7 * 24 * 60 * 60, JSON.stringify(value))
			}
			
			await multi?.exec()
			this.failureCount = 0
			this.writeBuffer.clear()
		} catch (error) {
			this.failureCount++
			this.lastFailureTime = Date.now()
			console.debug('[Redis] Batch write failed:', error instanceof Error ? error.message : 'Unknown error')
		}
		
		this.flushTimer = null
	}
	
	async get(key: string): Promise<any | null> {
		if (!this.isConnected || !this.client) return null
		
		return new Promise((resolve) => {
			const timeout = setTimeout(() => {
				resolve(null)
			}, 500) // 500ms超时
			
			this.client?.get(key)
				.then((data) => {
					clearTimeout(timeout)
					if (!data) {
						resolve(null)
					} else {
						try {
							resolve(JSON.parse(data))
						} catch {
							resolve(null)
						}
					}
				})
				.catch((err) => {
					clearTimeout(timeout)
					console.debug('[Redis] Get failed:', err.message)
					resolve(null)
				})
		})
	}
	
	startHealthCheck() {
		// 健康检查定时器
		setInterval(async () => {
			if (!this.isConnected && this.client) {
				try {
					await this.client.ping()
					this.isConnected = true
					this.failureCount = 0
					console.log('[Redis] Health check: Connection restored')
				} catch {
					// Still disconnected
				}
			}
		}, 30000) // 30秒检查一次
		
		// 监听配置变化
		vscode.workspace.onDidChangeConfiguration(async (e) => {
			if (e.affectsConfiguration('roo-cline.redis')) {
				console.log('[Redis] Configuration changed, reconnecting...')
				await this.reconnect()
			}
		})
	}
	
	private async reconnect() {
		// 断开现有连接
		if (this.client) {
			await this.client.quit().catch(() => {})
			this.client = null
			this.isConnected = false
		}
		
		// 重新连接
		await this.connect()
	}
	
	async disconnect() {
		if (this.flushTimer) {
			clearTimeout(this.flushTimer)
			await this.flush()
		}
		
		if (this.client) {
			await this.client.quit()
			this.client = null
			this.isConnected = false
		}
	}
}