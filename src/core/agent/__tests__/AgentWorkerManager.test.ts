import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { AgentWorkerManager } from '../AgentWorkerManager'
import { AgentConfig } from '@roo-code/types'
import * as fs from 'fs'
import * as path from 'path'

// Mock fs operations
vi.mock('fs', async () => {
	const actual = await vi.importActual('fs')
	return {
		...actual,
		writeFileSync: vi.fn(),
		unlinkSync: vi.fn(),
		existsSync: vi.fn(() => true),
		mkdirSync: vi.fn(),
		statSync: vi.fn(() => ({ isDirectory: () => true }))
	}
})

// Mock worker_threads
vi.mock('worker_threads', () => ({
	Worker: vi.fn().mockImplementation(() => ({
		on: vi.fn(),
		postMessage: vi.fn(),
		terminate: vi.fn().mockResolvedValue(undefined)
	}))
}))

describe('AgentWorkerManager', () => {
	let manager: AgentWorkerManager
	let mockWorker: any

	beforeEach(() => {
		vi.clearAllMocks()
		
		// Set up mock worker
		mockWorker = {
			on: vi.fn(),
			postMessage: vi.fn(),
			terminate: vi.fn().mockResolvedValue(undefined)
		}
		
		// Create manager after setting up mocks
		manager = new AgentWorkerManager()
	})

	describe('startAgent', () => {
		const mockAgentInstance = {
			agentId: 'test-agent',
			userId: 'user123',
			resourceQuota: {
				maxMemory: 100,
				maxCpuTime: 5000,
				maxFileOperations: 50,
				maxNetworkRequests: 10,
				maxExecutionTime: 30000,
				workspaceAccess: {
					readOnly: false,
					allowedPaths: ['/test'],
					deniedPaths: [],
					tempDirectory: '/tmp'
				}
			},
			priority: 'normal' as const,
			timeout: 30000,
			environment: {}
		}

		it('should start agent worker successfully', async () => {
			// Mock successful worker startup
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					// Simulate worker ready message
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const result = await manager.startAgent('test-agent', mockAgentInstance)

			expect(result).toEqual({
				success: true,
				workerId: expect.any(String),
				message: 'Agent worker started successfully'
			})

			// Verify worker script was created
			expect(fs.writeFileSync).toHaveBeenCalled()

			// Verify worker was instantiated
			const { Worker } = require('worker_threads')
			expect(Worker).toHaveBeenCalled()
		})

		it('should handle agent already running', async () => {
			// Start agent first time
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			await manager.startAgent('test-agent', mockAgentInstance)

			// Try to start same agent again
			const result = await manager.startAgent('test-agent', mockAgentInstance)

			expect(result).toEqual({
				success: false,
				error: 'Agent test-agent is already running'
			})
		})

		it('should handle worker startup timeout', async () => {
			// Mock worker that never sends ready message
			mockWorker.on.mockImplementation(() => {})

			const result = await manager.startAgent('test-agent', {
				...mockAgentInstance,
				timeout: 100 // Short timeout for test
			})

			expect(result).toEqual({
				success: false,
				error: 'Worker startup timeout'
			})
		})

		it('should handle worker startup error', async () => {
			// Mock worker error
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'error') {
					setTimeout(() => callback(new Error('Worker failed')), 10)
				}
			})

			const result = await manager.startAgent('test-agent', mockAgentInstance)

			expect(result).toEqual({
				success: false,
				error: 'Worker failed'
			})
		})
	})

	describe('stopAgent', () => {
		it('should stop running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			await manager.startAgent('test-agent', {
				agentId: 'test-agent',
				userId: 'user123',
				resourceQuota: {
					maxMemory: 100,
					maxCpuTime: 5000,
					maxFileOperations: 50,
					maxNetworkRequests: 10,
					maxExecutionTime: 30000,
					workspaceAccess: {
						readOnly: false,
						allowedPaths: [],
						deniedPaths: [],
						tempDirectory: '/tmp'
					}
				}
			})

			const result = await manager.stopAgent('test-agent')

			expect(result).toEqual({
				success: true,
				message: 'Agent worker stopped successfully'
			})

			expect(mockWorker.terminate).toHaveBeenCalled()
		})

		it('should handle stopping non-existent agent', async () => {
			const result = await manager.stopAgent('nonexistent-agent')

			expect(result).toEqual({
				success: false,
				error: 'Agent nonexistent-agent is not running'
			})
		})
	})

	describe('getAgentStatus', () => {
		it('should return status for running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			await manager.startAgent('test-agent', {
				agentId: 'test-agent',
				userId: 'user123',
				resourceQuota: {
					maxMemory: 100,
					maxCpuTime: 5000,
					maxFileOperations: 50,
					maxNetworkRequests: 10,
					maxExecutionTime: 30000,
					workspaceAccess: {
						readOnly: false,
						allowedPaths: [],
						deniedPaths: [],
						tempDirectory: '/tmp'
					}
				}
			})

			const status = await manager.getAgentStatus('test-agent')

			expect(status).toEqual({
				agentId: 'test-agent',
				status: 'running',
				workerId: expect.any(String),
				startTime: expect.any(Number),
				lastActivity: expect.any(Number),
				resourceUsage: {
					memory: 0,
					cpuTime: 0,
					fileOperations: 0,
					networkRequests: 0,
					startTime: expect.any(Number),
					lastUpdate: expect.any(Number)
				}
			})
		})

		it('should return null for non-existent agent', async () => {
			const status = await manager.getAgentStatus('nonexistent')

			expect(status).toBeNull()
		})
	})

	describe('getAllRunningAgents', () => {
		it('should return list of running agents', async () => {
			// Start multiple agents
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const agentConfig = {
				userId: 'user123',
				resourceQuota: {
					maxMemory: 100,
					maxCpuTime: 5000,
					maxFileOperations: 50,
					maxNetworkRequests: 10,
					maxExecutionTime: 30000,
					workspaceAccess: {
						readOnly: false,
						allowedPaths: [],
						deniedPaths: [],
						tempDirectory: '/tmp'
					}
				}
			}

			await manager.startAgent('agent1', { ...agentConfig, agentId: 'agent1' })
			await manager.startAgent('agent2', { ...agentConfig, agentId: 'agent2' })

			const agents = manager.getAllRunningAgents()

			expect(agents).toHaveLength(2)
			expect(agents).toContain('agent1')
			expect(agents).toContain('agent2')
		})

		it('should return empty array when no agents running', () => {
			const agents = manager.getAllRunningAgents()

			expect(agents).toEqual([])
		})
	})

	describe('executeInAgent', () => {
		it('should execute task in running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					const message = callback.mock.calls?.[0]?.[0]
					if (!message) {
						setTimeout(() => callback({ type: 'ready' }), 10)
					}
				}
			})

			await manager.startAgent('test-agent', {
				agentId: 'test-agent',
				userId: 'user123',
				resourceQuota: {
					maxMemory: 100,
					maxCpuTime: 5000,
					maxFileOperations: 50,
					maxNetworkRequests: 10,
					maxExecutionTime: 30000,
					workspaceAccess: {
						readOnly: false,
						allowedPaths: [],
						deniedPaths: [],
						tempDirectory: '/tmp'
					}
				}
			})

			// Mock execution response
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({
						type: 'execution_result',
						taskId: expect.any(String),
						result: { success: true, data: 'test result' }
					}), 10)
				}
			})

			const result = await manager.executeInAgent('test-agent', {
				method: 'test',
				params: { task: 'hello' }
			})

			expect(result).toEqual({
				success: true,
				data: 'test result'
			})

			expect(mockWorker.postMessage).toHaveBeenCalledWith({
				type: 'execute',
				taskId: expect.any(String),
				task: {
					method: 'test',
					params: { task: 'hello' }
				}
			})
		})

		it('should handle execution in non-existent agent', async () => {
			const result = await manager.executeInAgent('nonexistent', {
				method: 'test',
				params: {}
			})

			expect(result).toEqual({
				success: false,
				error: 'Agent nonexistent is not running'
			})
		})
	})

	describe('cleanup', () => {
		it('should stop all agents and clean up', async () => {
			// Start some agents
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const agentConfig = {
				userId: 'user123',
				resourceQuota: {
					maxMemory: 100,
					maxCpuTime: 5000,
					maxFileOperations: 50,
					maxNetworkRequests: 10,
					maxExecutionTime: 30000,
					workspaceAccess: {
						readOnly: false,
						allowedPaths: [],
						deniedPaths: [],
						tempDirectory: '/tmp'
					}
				}
			}

			await manager.startAgent('agent1', { ...agentConfig, agentId: 'agent1' })
			await manager.startAgent('agent2', { ...agentConfig, agentId: 'agent2' })

			await manager.cleanup()

			// Should have terminated all workers
			expect(mockWorker.terminate).toHaveBeenCalledTimes(2)

			// Should have no running agents
			expect(manager.getAllRunningAgents()).toEqual([])
		})
	})
})