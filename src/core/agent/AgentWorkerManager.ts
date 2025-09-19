import { Worker } from "worker_threads"
import { logger } from "../../utils/logging"
import { AgentConfig, ResourceQuota, ResourceUsage, AgentInstance } from "@roo-code/types"
import * as path from "path"
import * as fs from "fs"

/**
 * 智能体Worker管理器
 * 负责在独立线程中运行智能体，提供资源隔离和监控
 */
export class AgentWorkerManager {
	private workers: Map<string, AgentWorker> = new Map()
	private workerPool: Worker[] = []
	private maxWorkers: number = 5
	private workerScript: string

	constructor() {
		this.workerScript = this.createWorkerScript()
		this.initializeWorkerPool()
	}

	/**
	 * 创建Worker脚本文件
	 */
	private createWorkerScript(): string {
		const workerScriptPath = path.join(__dirname, 'agent-worker.js')
		
		// 如果脚本不存在，创建它
		if (!fs.existsSync(workerScriptPath)) {
			const workerCode = this.generateWorkerCode()
			fs.writeFileSync(workerScriptPath, workerCode)
		}
		
		return workerScriptPath
	}

	/**
	 * 生成Worker脚本代码
	 */
	private generateWorkerCode(): string {
		return `
const { parentPort, workerData } = require('worker_threads');
const path = require('path');
const fs = require('fs');

// 资源监控
let resourceUsage = {
	memory: 0,
	cpuTime: 0,
	fileOperations: 0,
	networkRequests: 0,
	startTime: Date.now(),
	lastUpdate: Date.now()
};

// 资源配额
let resourceQuota = workerData.resourceQuota || {
	maxMemory: 512, // MB
	maxCpuTime: 60000, // ms
	maxFileOperations: 1000,
	maxNetworkRequests: 100,
	maxExecutionTime: 300000 // 5 minutes
};

// 监控间隔
const MONITOR_INTERVAL = 1000; // 1秒

// 启动资源监控
const monitorInterval = setInterval(() => {
	updateResourceUsage();
	checkResourceLimits();
	sendResourceUpdate();
}, MONITOR_INTERVAL);

// 更新资源使用情况
function updateResourceUsage() {
	const memUsage = process.memoryUsage();
	resourceUsage.memory = Math.round(memUsage.heapUsed / 1024 / 1024); // MB
	resourceUsage.lastUpdate = Date.now();
	
	// CPU时间近似计算（基于运行时间）
	const runTime = Date.now() - resourceUsage.startTime;
	resourceUsage.cpuTime = runTime; // 简化处理
}

// 检查资源限制
function checkResourceLimits() {
	const violations = [];
	
	if (resourceUsage.memory > resourceQuota.maxMemory) {
		violations.push(\`Memory limit exceeded: \${resourceUsage.memory}MB > \${resourceQuota.maxMemory}MB\`);
	}
	
	if (resourceUsage.cpuTime > resourceQuota.maxCpuTime) {
		violations.push(\`CPU time limit exceeded: \${resourceUsage.cpuTime}ms > \${resourceQuota.maxCpuTime}ms\`);
	}
	
	if (resourceUsage.fileOperations > resourceQuota.maxFileOperations) {
		violations.push(\`File operations limit exceeded: \${resourceUsage.fileOperations} > \${resourceQuota.maxFileOperations}\`);
	}
	
	if (resourceUsage.networkRequests > resourceQuota.maxNetworkRequests) {
		violations.push(\`Network requests limit exceeded: \${resourceUsage.networkRequests} > \${resourceQuota.maxNetworkRequests}\`);
	}
	
	const totalRunTime = Date.now() - resourceUsage.startTime;
	if (totalRunTime > resourceQuota.maxExecutionTime) {
		violations.push(\`Execution time limit exceeded: \${totalRunTime}ms > \${resourceQuota.maxExecutionTime}ms\`);
	}
	
	if (violations.length > 0) {
		parentPort.postMessage({
			type: 'resourceViolation',
			violations,
			resourceUsage
		});
	}
}

// 发送资源使用更新
function sendResourceUpdate() {
	parentPort.postMessage({
		type: 'resourceUpdate',
		resourceUsage
	});
}

// 包装文件系统操作
const originalFs = { ...fs };
['readFile', 'writeFile', 'appendFile', 'unlink', 'mkdir', 'rmdir'].forEach(method => {
	if (originalFs[method]) {
		fs[method] = function(...args) {
			resourceUsage.fileOperations++;
			return originalFs[method].apply(this, args);
		};
	}
});

// 包装网络请求
const originalFetch = global.fetch;
if (originalFetch) {
	global.fetch = function(...args) {
		resourceUsage.networkRequests++;
		return originalFetch.apply(this, args);
	};
}

// 处理来自主线程的消息
parentPort.on('message', async (message) => {
	try {
		switch (message.type) {
			case 'execute':
				await handleExecution(message.data);
				break;
			case 'updateQuota':
				resourceQuota = { ...resourceQuota, ...message.quota };
				break;
			case 'getStatus':
				parentPort.postMessage({
					type: 'status',
					resourceUsage,
					resourceQuota
				});
				break;
			case 'terminate':
				clearInterval(monitorInterval);
				process.exit(0);
				break;
		}
	} catch (error) {
		parentPort.postMessage({
			type: 'error',
			error: error.message,
			stack: error.stack
		});
	}
});

// 处理智能体执行
async function handleExecution(data) {
	const { agentConfig, request, context } = data;
	
	try {
		// 这里应该加载并执行智能体代码
		// 当前阶段先返回模拟结果
		const result = {
			success: true,
			data: 'Agent executed successfully in worker thread',
			agentId: agentConfig.id,
			timestamp: Date.now(),
			resourceUsage: { ...resourceUsage }
		};
		
		parentPort.postMessage({
			type: 'executionResult',
			requestId: data.requestId,
			result
		});
		
	} catch (error) {
		parentPort.postMessage({
			type: 'executionResult',
			requestId: data.requestId,
			result: {
				success: false,
				error: error.message,
				agentId: agentConfig.id,
				timestamp: Date.now()
			}
		});
	}
}

// 错误处理
process.on('uncaughtException', (error) => {
	parentPort.postMessage({
		type: 'error',
		error: error.message,
		stack: error.stack
	});
});

process.on('unhandledRejection', (reason) => {
	parentPort.postMessage({
		type: 'error',
		error: reason.toString(),
		stack: reason.stack
	});
});

// 发送启动完成信号
parentPort.postMessage({
	type: 'ready',
	workerId: workerData.workerId
});
`;
	}

	/**
	 * 初始化Worker池
	 */
	private initializeWorkerPool(): void {
		// 当前阶段先不预创建Worker，按需创建
		logger.info(`[AgentWorkerManager] Initialized with max ${this.maxWorkers} workers`)
	}

	/**
	 * 启动智能体Worker
	 */
	async startAgentWorker(
		agentConfig: AgentConfig, 
		resourceQuota?: ResourceQuota
	): Promise<string> {
		const workerId = `worker_${agentConfig.id}_${Date.now()}`
		
		try {
			const worker = new Worker(this.workerScript, {
				workerData: {
					workerId,
					agentId: agentConfig.id,
					resourceQuota: resourceQuota || this.getDefaultResourceQuota()
				}
			})

			const agentWorker: AgentWorker = {
				id: workerId,
				agentId: agentConfig.id,
				worker,
				startTime: Date.now(),
				resourceUsage: {
					memory: 0,
					cpuTime: 0,
					fileOperations: 0,
					networkRequests: 0,
					startTime: Date.now(),
					lastUpdate: Date.now()
				},
				resourceQuota: resourceQuota || this.getDefaultResourceQuota(),
				status: 'starting',
				pendingRequests: new Map()
			}

			// 设置事件监听器
			this.setupWorkerEventHandlers(agentWorker)

			this.workers.set(workerId, agentWorker)

			// 等待Worker就绪
			await this.waitForWorkerReady(agentWorker)

			logger.info(`[AgentWorkerManager] Started worker ${workerId} for agent ${agentConfig.id}`)
			return workerId

		} catch (error) {
			logger.error(`[AgentWorkerManager] Failed to start worker for agent ${agentConfig.id}:`, error)
			throw error
		}
	}

	/**
	 * 设置Worker事件处理器
	 */
	private setupWorkerEventHandlers(agentWorker: AgentWorker): void {
		const { worker } = agentWorker

		worker.on('message', (message) => {
			this.handleWorkerMessage(agentWorker, message)
		})

		worker.on('error', (error) => {
			logger.error(`[AgentWorkerManager] Worker ${agentWorker.id} error:`, error)
			agentWorker.status = 'error'
		})

		worker.on('exit', (code) => {
			logger.info(`[AgentWorkerManager] Worker ${agentWorker.id} exited with code ${code}`)
			this.workers.delete(agentWorker.id)
		})
	}

	/**
	 * 处理Worker消息
	 */
	private handleWorkerMessage(agentWorker: AgentWorker, message: any): void {
		switch (message.type) {
			case 'ready':
				agentWorker.status = 'ready'
				break

			case 'resourceUpdate':
				agentWorker.resourceUsage = { ...message.resourceUsage }
				break

			case 'resourceViolation':
				logger.warn(`[AgentWorkerManager] Resource violation in worker ${agentWorker.id}:`, message.violations)
				this.handleResourceViolation(agentWorker, message)
				break

			case 'executionResult':
				this.handleExecutionResult(agentWorker, message)
				break

			case 'error':
				logger.error(`[AgentWorkerManager] Worker ${agentWorker.id} reported error:`, message.error)
				agentWorker.status = 'error'
				break
		}
	}

	/**
	 * 处理资源违规
	 */
	private handleResourceViolation(agentWorker: AgentWorker, message: any): void {
		// 记录违规行为
		logger.warn(`[AgentWorkerManager] Resource violations for worker ${agentWorker.id}:`, message.violations)
		
		// 严重违规时终止Worker
		const severeViolations = message.violations.filter((v: string) => 
			v.includes('Memory limit') || v.includes('Execution time limit')
		)
		
		if (severeViolations.length > 0) {
			logger.error(`[AgentWorkerManager] Terminating worker ${agentWorker.id} due to severe resource violations`)
			this.terminateWorker(agentWorker.id)
		}
	}

	/**
	 * 处理执行结果
	 */
	private handleExecutionResult(agentWorker: AgentWorker, message: any): void {
		const { requestId, result } = message
		const pendingRequest = agentWorker.pendingRequests.get(requestId)
		
		if (pendingRequest) {
			const { resolve } = pendingRequest
			agentWorker.pendingRequests.delete(requestId)
			resolve(result)
		}
	}

	/**
	 * 等待Worker就绪
	 */
	private async waitForWorkerReady(agentWorker: AgentWorker): Promise<void> {
		return new Promise((resolve, reject) => {
			const timeout = setTimeout(() => {
				reject(new Error('Worker startup timeout'))
			}, 10000) // 10秒超时

			const checkReady = () => {
				if (agentWorker.status === 'ready') {
					clearTimeout(timeout)
					resolve()
				} else if (agentWorker.status === 'error') {
					clearTimeout(timeout)
					reject(new Error('Worker startup failed'))
				} else {
					setTimeout(checkReady, 100)
				}
			}

			checkReady()
		})
	}

	/**
	 * 在Worker中执行智能体
	 */
	async executeAgentInWorker(
		workerId: string,
		request: any,
		context: any = {}
	): Promise<any> {
		const agentWorker = this.workers.get(workerId)
		if (!agentWorker) {
			throw new Error(`Worker ${workerId} not found`)
		}

		if (agentWorker.status !== 'ready') {
			throw new Error(`Worker ${workerId} is not ready (status: ${agentWorker.status})`)
		}

		const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

		return new Promise((resolve, reject) => {
			// 设置超时
			const timeout = setTimeout(() => {
				agentWorker.pendingRequests.delete(requestId)
				reject(new Error('Execution timeout'))
			}, 30000) // 30秒超时

			// 存储请求
			agentWorker.pendingRequests.set(requestId, {
				resolve: (result) => {
					clearTimeout(timeout)
					resolve(result)
				},
				reject: (error) => {
					clearTimeout(timeout)
					reject(error)
				}
			})

			// 发送执行请求
			agentWorker.worker.postMessage({
				type: 'execute',
				data: {
					requestId,
					agentConfig: { id: agentWorker.agentId }, // 简化的配置
					request,
					context
				}
			})
		})
	}

	/**
	 * 获取Worker状态
	 */
	async getWorkerStatus(workerId: string): Promise<AgentWorkerStatus | null> {
		const agentWorker = this.workers.get(workerId)
		if (!agentWorker) {
			return null
		}

		return {
			workerId: agentWorker.id,
			agentId: agentWorker.agentId,
			status: agentWorker.status,
			startTime: agentWorker.startTime,
			resourceUsage: agentWorker.resourceUsage,
			resourceQuota: agentWorker.resourceQuota,
			pendingRequestsCount: agentWorker.pendingRequests.size
		}
	}

	/**
	 * 更新Worker资源配额
	 */
	async updateWorkerQuota(workerId: string, quota: Partial<ResourceQuota>): Promise<void> {
		const agentWorker = this.workers.get(workerId)
		if (!agentWorker) {
			throw new Error(`Worker ${workerId} not found`)
		}

		agentWorker.resourceQuota = { ...agentWorker.resourceQuota, ...quota }

		agentWorker.worker.postMessage({
			type: 'updateQuota',
			quota
		})
	}

	/**
	 * 终止Worker
	 */
	async terminateWorker(workerId: string): Promise<void> {
		const agentWorker = this.workers.get(workerId)
		if (!agentWorker) {
			return
		}

		try {
			// 拒绝所有待处理的请求
			for (const [requestId, pendingRequest] of agentWorker.pendingRequests) {
				pendingRequest.reject(new Error('Worker terminated'))
			}
			agentWorker.pendingRequests.clear()

			// 发送终止信号
			agentWorker.worker.postMessage({ type: 'terminate' })

			// 强制终止（3秒后）
			setTimeout(() => {
				if (this.workers.has(workerId)) {
					agentWorker.worker.terminate()
					this.workers.delete(workerId)
				}
			}, 3000)

		} catch (error) {
			logger.error(`[AgentWorkerManager] Failed to terminate worker ${workerId}:`, error)
		}
	}

	/**
	 * 获取所有Worker状态
	 */
	async getAllWorkerStatus(): Promise<AgentWorkerStatus[]> {
		const statuses = []
		for (const [workerId] of this.workers) {
			const status = await this.getWorkerStatus(workerId)
			if (status) {
				statuses.push(status)
			}
		}
		return statuses
	}

	/**
	 * 获取默认资源配额
	 */
	private getDefaultResourceQuota(): ResourceQuota {
		return {
			maxMemory: 512, // 512MB
			maxCpuTime: 60000, // 60秒
			maxFileOperations: 1000,
			maxNetworkRequests: 100,
			maxExecutionTime: 300000, // 5分钟
			workspaceAccess: {
				readOnly: false,
				allowedPaths: [process.cwd()],
				deniedPaths: ['/etc', '/sys', '/proc'],
				tempDirectory: '/tmp'
			}
		}
	}

	/**
	 * 清理资源
	 */
	async cleanup(): Promise<void> {
		const workerIds = Array.from(this.workers.keys())
		
		await Promise.all(
			workerIds.map(id => this.terminateWorker(id))
		)

		// 清理Worker脚本文件
		try {
			if (fs.existsSync(this.workerScript)) {
				fs.unlinkSync(this.workerScript)
			}
		} catch (error) {
			logger.debug(`[AgentWorkerManager] Failed to cleanup worker script:`, error)
		}

		logger.info(`[AgentWorkerManager] Cleanup completed`)
	}
}

// 接口定义
interface AgentWorker {
	id: string
	agentId: string
	worker: Worker
	startTime: number
	resourceUsage: ResourceUsage
	resourceQuota: ResourceQuota
	status: 'starting' | 'ready' | 'error' | 'terminating'
	pendingRequests: Map<string, {
		resolve: (result: any) => void
		reject: (error: Error) => void
	}>
}

export interface AgentWorkerStatus {
	workerId: string
	agentId: string
	status: string
	startTime: number
	resourceUsage: ResourceUsage
	resourceQuota: ResourceQuota
	pendingRequestsCount: number
}