import { ResourceQuota, ResourceUsage, AgentConfig, AgentInstance } from "@roo-code/types"
import { AgentWorkerManager, AgentWorkerStatus } from "./AgentWorkerManager"
import { RedisSyncService } from "../../services/RedisSyncService"
import { logger } from "../../utils/logging"

/**
 * 智能体资源管理器
 * 负责监控和管理智能体的资源使用情况
 */
export class AgentResourceManager {
	private static instance: AgentResourceManager | null = null
	private workerManager: AgentWorkerManager
	private redisSync: RedisSyncService
	private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map()
	private resourcePolicies: Map<string, ResourcePolicy> = new Map()

	private constructor() {
		this.workerManager = new AgentWorkerManager()
		this.redisSync = RedisSyncService.getInstance()
		this.initializeDefaultPolicies()
	}

	static getInstance(): AgentResourceManager {
		if (!AgentResourceManager.instance) {
			AgentResourceManager.instance = new AgentResourceManager()
		}
		return AgentResourceManager.instance
	}

	/**
	 * 初始化默认资源策略
	 */
	private initializeDefaultPolicies(): void {
		// 开发环境策略
		this.resourcePolicies.set('development', {
			name: 'Development Environment',
			resourceQuota: {
				maxMemory: 1024, // 1GB
				maxCpuTime: 300000, // 5分钟
				maxFileOperations: 5000,
				maxNetworkRequests: 1000,
				maxExecutionTime: 600000, // 10分钟
				workspaceAccess: {
					readOnly: false,
					allowedPaths: [process.cwd()],
					deniedPaths: ['/etc', '/sys', '/proc', '/bin', '/sbin'],
					tempDirectory: '/tmp'
				}
			},
			alertThresholds: {
				memoryWarning: 0.8, // 80%
				memoryError: 0.95, // 95%
				cpuWarning: 0.7,
				cpuError: 0.9,
				executionTimeWarning: 0.8,
				executionTimeError: 0.95
			},
			enforcementMode: 'warn' // 开发环境只警告
		})

		// 生产环境策略
		this.resourcePolicies.set('production', {
			name: 'Production Environment',
			resourceQuota: {
				maxMemory: 512, // 512MB
				maxCpuTime: 120000, // 2分钟
				maxFileOperations: 1000,
				maxNetworkRequests: 500,
				maxExecutionTime: 300000, // 5分钟
				workspaceAccess: {
					readOnly: true, // 生产环境只读
					allowedPaths: ['/app/data'],
					deniedPaths: ['/etc', '/sys', '/proc', '/bin', '/sbin', '/usr'],
					tempDirectory: '/tmp'
				}
			},
			alertThresholds: {
				memoryWarning: 0.7,
				memoryError: 0.85,
				cpuWarning: 0.6,
				cpuError: 0.8,
				executionTimeWarning: 0.7,
				executionTimeError: 0.85
			},
			enforcementMode: 'strict' // 生产环境严格执行
		})

		// 受限环境策略
		this.resourcePolicies.set('restricted', {
			name: 'Restricted Environment',
			resourceQuota: {
				maxMemory: 256, // 256MB
				maxCpuTime: 60000, // 1分钟
				maxFileOperations: 100,
				maxNetworkRequests: 50,
				maxExecutionTime: 120000, // 2分钟
				workspaceAccess: {
					readOnly: true,
					allowedPaths: ['/app/sandbox'],
					deniedPaths: ['/etc', '/sys', '/proc', '/bin', '/sbin', '/usr', '/var'],
					tempDirectory: '/tmp/sandbox'
				}
			},
			alertThresholds: {
				memoryWarning: 0.6,
				memoryError: 0.8,
				cpuWarning: 0.5,
				cpuError: 0.7,
				executionTimeWarning: 0.6,
				executionTimeError: 0.8
			},
			enforcementMode: 'strict'
		})
	}

	/**
	 * 启动智能体实例并应用资源管理
	 */
	async startManagedAgent(
		agentConfig: AgentConfig,
		policyName: string = 'development'
	): Promise<AgentManagedInstance> {
		try {
			const policy = this.resourcePolicies.get(policyName)
			if (!policy) {
				throw new Error(`Resource policy '${policyName}' not found`)
			}

			// 启动Worker
			const workerId = await this.workerManager.startAgentWorker(
				agentConfig,
				policy.resourceQuota
			)

			// 创建管理实例
			const managedInstance: AgentManagedInstance = {
				instanceId: `instance_${agentConfig.id}_${Date.now()}`,
				agentId: agentConfig.id,
				workerId,
				policyName,
				startTime: Date.now(),
				status: 'running',
				resourceUsage: {
					memory: 0,
					cpuTime: 0,
					fileOperations: 0,
					networkRequests: 0,
					startTime: Date.now(),
					lastUpdate: Date.now()
				},
				resourceQuota: policy.resourceQuota,
				alerts: [],
				violations: []
			}

			// 启动资源监控
			await this.startResourceMonitoring(managedInstance, policy)

			// 注册到Redis
			if (this.redisSync.getConnectionStatus()) {
				const agentInstance: AgentInstance = this.convertToAgentInstance(managedInstance, agentConfig)
				// Note: registerAgentInstance method not available in RedisSyncService
				// await this.redisSync.registerAgentInstance(agentInstance)
			}

			logger.info(`[AgentResourceManager] Started managed agent ${agentConfig.id} with policy ${policyName}`)
			return managedInstance

		} catch (error) {
			logger.error(`[AgentResourceManager] Failed to start managed agent ${agentConfig.id}:`, error)
			throw error
		}
	}

	/**
	 * 启动资源监控
	 */
	private async startResourceMonitoring(
		instance: AgentManagedInstance,
		policy: ResourcePolicy
	): Promise<void> {
		const monitoringInterval = setInterval(async () => {
			try {
				await this.checkResourceUsage(instance, policy)
			} catch (error) {
				logger.error(`[AgentResourceManager] Resource monitoring error for ${instance.instanceId}:`, error)
			}
		}, 5000) // 每5秒检查一次

		this.monitoringIntervals.set(instance.instanceId, monitoringInterval)
	}

	/**
	 * 检查资源使用情况
	 */
	private async checkResourceUsage(
		instance: AgentManagedInstance,
		policy: ResourcePolicy
	): Promise<void> {
		// 获取Worker状态
		const workerStatus = await this.workerManager.getWorkerStatus(instance.workerId)
		if (!workerStatus) {
			logger.warn(`[AgentResourceManager] Worker status not available for ${instance.instanceId}`)
			return
		}

		// 更新资源使用情况
		instance.resourceUsage = workerStatus.resourceUsage

		// 检查告警阈值
		await this.checkAlertThresholds(instance, policy, workerStatus)

		// 检查违规行为
		await this.checkViolations(instance, policy, workerStatus)

		// 发送心跳到Redis
		if (this.redisSync.getConnectionStatus()) {
			// Note: updateHeartbeat method not available in RedisSyncService
			// await this.redisSync.updateHeartbeat(instance.agentId, {
			//	currentLoad: this.calculateCurrentLoad(workerStatus.resourceUsage, policy.resourceQuota),
			//	avgResponseTime: 1000, // TODO: 实际计算
			//	errorRate: 0, // TODO: 实际计算
			//	memoryUsage: workerStatus.resourceUsage.memory / policy.resourceQuota.maxMemory,
			//	cpuUsage: workerStatus.resourceUsage.cpuTime / policy.resourceQuota.maxCpuTime
			// })
		}
	}

	/**
	 * 检查告警阈值
	 */
	private async checkAlertThresholds(
		instance: AgentManagedInstance,
		policy: ResourcePolicy,
		workerStatus: AgentWorkerStatus
	): Promise<void> {
		const { resourceUsage } = workerStatus
		const { resourceQuota } = policy
		const { alertThresholds } = policy

		const alerts: ResourceAlert[] = []

		// 内存告警
		const memoryUsage = resourceUsage.memory / resourceQuota.maxMemory
		if (memoryUsage >= alertThresholds.memoryError) {
			alerts.push({
				type: 'memory',
				level: 'error',
				message: `Memory usage critical: ${(memoryUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: memoryUsage,
				threshold: alertThresholds.memoryError
			})
		} else if (memoryUsage >= alertThresholds.memoryWarning) {
			alerts.push({
				type: 'memory',
				level: 'warning',
				message: `Memory usage high: ${(memoryUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: memoryUsage,
				threshold: alertThresholds.memoryWarning
			})
		}

		// CPU告警
		const cpuUsage = resourceUsage.cpuTime / resourceQuota.maxCpuTime
		if (cpuUsage >= alertThresholds.cpuError) {
			alerts.push({
				type: 'cpu',
				level: 'error',
				message: `CPU usage critical: ${(cpuUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: cpuUsage,
				threshold: alertThresholds.cpuError
			})
		} else if (cpuUsage >= alertThresholds.cpuWarning) {
			alerts.push({
				type: 'cpu',
				level: 'warning',
				message: `CPU usage high: ${(cpuUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: cpuUsage,
				threshold: alertThresholds.cpuWarning
			})
		}

		// 执行时间告警
		const executionTime = Date.now() - resourceUsage.startTime
		const executionUsage = executionTime / resourceQuota.maxExecutionTime
		if (executionUsage >= alertThresholds.executionTimeError) {
			alerts.push({
				type: 'execution_time',
				level: 'error',
				message: `Execution time critical: ${(executionUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: executionUsage,
				threshold: alertThresholds.executionTimeError
			})
		} else if (executionUsage >= alertThresholds.executionTimeWarning) {
			alerts.push({
				type: 'execution_time',
				level: 'warning',
				message: `Execution time high: ${(executionUsage * 100).toFixed(1)}%`,
				timestamp: Date.now(),
				value: executionUsage,
				threshold: alertThresholds.executionTimeWarning
			})
		}

		// 添加新告警
		for (const alert of alerts) {
			instance.alerts.push(alert)
			logger.warn(`[AgentResourceManager] ${alert.level.toUpperCase()}: ${alert.message} for ${instance.instanceId}`)
		}

		// 保持最近100个告警
		if (instance.alerts.length > 100) {
			instance.alerts = instance.alerts.slice(-100)
		}
	}

	/**
	 * 检查违规行为
	 */
	private async checkViolations(
		instance: AgentManagedInstance,
		policy: ResourcePolicy,
		workerStatus: AgentWorkerStatus
	): Promise<void> {
		const { resourceUsage } = workerStatus
		const { resourceQuota } = policy

		const violations: ResourceViolation[] = []

		// 检查各种资源违规
		if (resourceUsage.memory > resourceQuota.maxMemory) {
			violations.push({
				type: 'memory_exceeded',
				message: `Memory limit exceeded: ${resourceUsage.memory}MB > ${resourceQuota.maxMemory}MB`,
				timestamp: Date.now(),
				value: resourceUsage.memory,
				limit: resourceQuota.maxMemory
			})
		}

		if (resourceUsage.cpuTime > resourceQuota.maxCpuTime) {
			violations.push({
				type: 'cpu_exceeded',
				message: `CPU time limit exceeded: ${resourceUsage.cpuTime}ms > ${resourceQuota.maxCpuTime}ms`,
				timestamp: Date.now(),
				value: resourceUsage.cpuTime,
				limit: resourceQuota.maxCpuTime
			})
		}

		if (resourceUsage.fileOperations > resourceQuota.maxFileOperations) {
			violations.push({
				type: 'file_operations_exceeded',
				message: `File operations limit exceeded: ${resourceUsage.fileOperations} > ${resourceQuota.maxFileOperations}`,
				timestamp: Date.now(),
				value: resourceUsage.fileOperations,
				limit: resourceQuota.maxFileOperations
			})
		}

		if (resourceUsage.networkRequests > resourceQuota.maxNetworkRequests) {
			violations.push({
				type: 'network_requests_exceeded',
				message: `Network requests limit exceeded: ${resourceUsage.networkRequests} > ${resourceQuota.maxNetworkRequests}`,
				timestamp: Date.now(),
				value: resourceUsage.networkRequests,
				limit: resourceQuota.maxNetworkRequests
			})
		}

		const executionTime = Date.now() - resourceUsage.startTime
		if (executionTime > resourceQuota.maxExecutionTime) {
			violations.push({
				type: 'execution_time_exceeded',
				message: `Execution time limit exceeded: ${executionTime}ms > ${resourceQuota.maxExecutionTime}ms`,
				timestamp: Date.now(),
				value: executionTime,
				limit: resourceQuota.maxExecutionTime
			})
		}

		// 处理违规行为
		for (const violation of violations) {
			instance.violations.push(violation)
			logger.error(`[AgentResourceManager] VIOLATION: ${violation.message} for ${instance.instanceId}`)

			// 根据策略处理违规
			if (policy.enforcementMode === 'strict') {
				await this.handleStrictViolation(instance, violation)
			}
		}

		// 保持最近50个违规记录
		if (instance.violations.length > 50) {
			instance.violations = instance.violations.slice(-50)
		}
	}

	/**
	 * 处理严格模式下的违规
	 */
	private async handleStrictViolation(
		instance: AgentManagedInstance,
		violation: ResourceViolation
	): Promise<void> {
		// 严重违规时立即终止
		const severeViolations = ['memory_exceeded', 'execution_time_exceeded']
		
		if (severeViolations.includes(violation.type)) {
			logger.error(`[AgentResourceManager] Terminating instance ${instance.instanceId} due to severe violation: ${violation.type}`)
			await this.stopManagedAgent(instance.instanceId)
		}
	}

	/**
	 * 计算当前负载
	 */
	private calculateCurrentLoad(usage: ResourceUsage, quota: ResourceQuota): number {
		const memoryLoad = usage.memory / quota.maxMemory
		const cpuLoad = usage.cpuTime / quota.maxCpuTime
		const fileLoad = usage.fileOperations / quota.maxFileOperations
		const networkLoad = usage.networkRequests / quota.maxNetworkRequests
		
		// 返回最高的负载百分比
		return Math.max(memoryLoad, cpuLoad, fileLoad, networkLoad)
	}

	/**
	 * 停止管理的智能体实例
	 */
	async stopManagedAgent(instanceId: string): Promise<void> {
		const interval = this.monitoringIntervals.get(instanceId)
		if (interval) {
			clearInterval(interval)
			this.monitoringIntervals.delete(instanceId)
		}

		// TODO: 需要维护实例列表以获取workerId
		// 当前简化实现
		logger.info(`[AgentResourceManager] Stopped managed agent instance ${instanceId}`)
	}

	/**
	 * 获取所有管理的实例状态
	 */
	async getAllManagedInstances(): Promise<AgentManagedInstance[]> {
		// TODO: 维护实例列表
		// 当前返回空数组
		return []
	}

	/**
	 * 更新资源策略
	 */
	updateResourcePolicy(policyName: string, policy: ResourcePolicy): void {
		this.resourcePolicies.set(policyName, policy)
		logger.info(`[AgentResourceManager] Updated resource policy: ${policyName}`)
	}

	/**
	 * 获取资源策略
	 */
	getResourcePolicy(policyName: string): ResourcePolicy | undefined {
		return this.resourcePolicies.get(policyName)
	}

	/**
	 * 获取所有资源策略
	 */
	getAllResourcePolicies(): Map<string, ResourcePolicy> {
		return new Map(this.resourcePolicies)
	}

	/**
	 * 转换为AgentInstance格式
	 */
	private convertToAgentInstance(
		managedInstance: AgentManagedInstance,
		agentConfig: AgentConfig
	): AgentInstance {
		return {
			agentId: managedInstance.agentId,
			instanceId: managedInstance.instanceId,
			userId: agentConfig.userId,
			
			deployment: {
				type: 'pc',
				platform: 'vscode',
				version: '1.0.0',
				region: 'local'
			},
			
			endpoint: {
				type: 'local_only',
				imBridge: {
					proxyId: `proxy_${managedInstance.agentId}`,
					priority: 1
				},
				networkReachable: false
			},
			
			status: {
				state: managedInstance.status === 'running' ? 'online' : 'offline',
				startTime: managedInstance.startTime,
				lastSeen: Date.now(),
				currentLoad: this.calculateCurrentLoad(managedInstance.resourceUsage, managedInstance.resourceQuota),
				errorCount: managedInstance.violations.length,
				errorRate: managedInstance.violations.length / Math.max(1, Date.now() - managedInstance.startTime) * 3600000, // 每小时错误率
				uptime: Date.now() - managedInstance.startTime
			},
			
			metrics: {
				avgResponseTime: 1000, // TODO: 实际计算
				successRate: 0.95, // TODO: 实际计算
				throughput: 10, // TODO: 实际计算
				memoryUsage: managedInstance.resourceUsage.memory / managedInstance.resourceQuota.maxMemory,
				cpuUsage: managedInstance.resourceUsage.cpuTime / managedInstance.resourceQuota.maxCpuTime,
				lastUpdate: Date.now()
			},
			
			resourceQuota: managedInstance.resourceQuota,
			
			metadata: {
				createdAt: managedInstance.startTime,
				updatedAt: Date.now(),
				version: 1,
				tags: [`policy:${managedInstance.policyName}`]
			}
		}
	}

	/**
	 * 清理资源
	 */
	async cleanup(): Promise<void> {
		// 清理所有监控间隔
		for (const [instanceId, interval] of this.monitoringIntervals) {
			clearInterval(interval)
		}
		this.monitoringIntervals.clear()

		// 清理Worker管理器
		await this.workerManager.cleanup()

		logger.info(`[AgentResourceManager] Cleanup completed`)
	}
}

// 接口定义
export interface AgentManagedInstance {
	instanceId: string
	agentId: string
	workerId: string
	policyName: string
	startTime: number
	status: 'starting' | 'running' | 'stopping' | 'stopped' | 'error'
	resourceUsage: ResourceUsage
	resourceQuota: ResourceQuota
	alerts: ResourceAlert[]
	violations: ResourceViolation[]
}

export interface ResourcePolicy {
	name: string
	resourceQuota: ResourceQuota
	alertThresholds: {
		memoryWarning: number
		memoryError: number
		cpuWarning: number
		cpuError: number
		executionTimeWarning: number
		executionTimeError: number
	}
	enforcementMode: 'warn' | 'strict'
}

export interface ResourceAlert {
	type: 'memory' | 'cpu' | 'execution_time' | 'file_operations' | 'network_requests'
	level: 'warning' | 'error'
	message: string
	timestamp: number
	value: number
	threshold: number
}

export interface ResourceViolation {
	type: string
	message: string
	timestamp: number
	value: number
	limit: number
}