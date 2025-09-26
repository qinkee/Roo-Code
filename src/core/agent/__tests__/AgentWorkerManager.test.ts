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
	let mockAgentConfig: AgentConfig

	beforeEach(() => {
		vi.clearAllMocks()
		
		// Set up mock worker
		mockWorker = {
			on: vi.fn(),
			postMessage: vi.fn(),
			terminate: vi.fn().mockResolvedValue(undefined)
		}
		
		// Set up mock agent config
		mockAgentConfig = {
			id: 'test-agent',
			userId: 'user123',
			name: 'Test Agent',
			version: 1,
			avatar: '',
			roleDescription: 'A test agent',
			apiConfigId: 'default',
			mode: 'assistant',
			tools: [],
			todos: [],
			isActive: true,
			isPrivate: false,
			isPublished: false,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}
		
		// Create manager after setting up mocks
		manager = new AgentWorkerManager()
	})

	describe('startAgentWorker', () => {
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

			const result = await manager.startAgentWorker(mockAgentConfig)

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

			await manager.startAgentWorker(mockAgentConfig)

			// Try to start same agent again
			const result = await manager.startAgentWorker(mockAgentConfig)

			expect(result).toEqual({
				success: false,
				error: 'Agent test-agent is already running'
			})
		})

		it('should handle worker startup timeout', async () => {
			// Mock worker that never sends ready message
			mockWorker.on.mockImplementation(() => {})

			const result = await manager.startAgentWorker(mockAgentConfig, {
				maxMemory: 512,
				maxCpuTime: 1000,
				maxFileOperations: 10,
				maxNetworkRequests: 5,
				maxExecutionTime: 100, // Short timeout for test
				workspaceAccess: {
					readOnly: false,
					allowedPaths: [],
					deniedPaths: [],
					tempDirectory: '/tmp'
				}
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

			const result = await manager.startAgentWorker(mockAgentConfig)

			expect(result).toEqual({
				success: false,
				error: 'Worker failed'
			})
		})
	})

	describe('terminateWorker', () => {
		it('should stop running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const workerId = await manager.startAgentWorker(mockAgentConfig, {
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
			})

			await manager.terminateWorker(workerId)

			// Verify worker was terminated
			expect(mockWorker.terminate).toHaveBeenCalled()
		})

		it('should handle stopping non-existent agent', async () => {
			await manager.terminateWorker('nonexistent-agent')
			
			// Should not throw error, just silently return
			expect(mockWorker.terminate).not.toHaveBeenCalled()
		})
	})

	describe('getWorkerStatus', () => {
		it('should return status for running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const workerId = await manager.startAgentWorker(mockAgentConfig, {
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
			})

			const status = await manager.getWorkerStatus(workerId)

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
			const status = await manager.getWorkerStatus('nonexistent')

			expect(status).toBeNull()
		})
	})

	describe('getAllWorkerStatus', () => {
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

			const agent1Config = { ...mockAgentConfig, id: 'agent1' }
			const agent2Config = { ...mockAgentConfig, id: 'agent2' }
			
			await manager.startAgentWorker(agent1Config, {
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
			})
			await manager.startAgentWorker(agent2Config, {
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
			})

			const agents = manager.getAllWorkerStatus()

			expect(agents).toHaveLength(2)
			expect(agents).toContain('agent1')
			expect(agents).toContain('agent2')
		})

		it('should return empty array when no agents running', () => {
			const agents = manager.getAllWorkerStatus()

			expect(agents).toEqual([])
		})
	})

	describe('executeAgentInWorker', () => {
		it('should execute task in running agent', async () => {
			// Start agent first
			mockWorker.on.mockImplementation((event: string, callback: Function) => {
				if (event === 'message') {
					setTimeout(() => callback({ type: 'ready' }), 10)
				}
			})

			const workerId = await manager.startAgentWorker(mockAgentConfig, {
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

			const result = await manager.executeAgentInWorker(workerId, {
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
			const result = await manager.executeAgentInWorker('nonexistent', {
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

			const agent1Config = { ...mockAgentConfig, id: 'agent1' }
			const agent2Config = { ...mockAgentConfig, id: 'agent2' }
			
			await manager.startAgentWorker(agent1Config, {
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
			})
			await manager.startAgentWorker(agent2Config, {
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
			})

			await manager.cleanup()

			// Should have terminated all workers
			expect(mockWorker.terminate).toHaveBeenCalledTimes(2)

			// Should have no running agents
			expect(manager.getAllWorkerStatus()).toEqual([])
		})
	})
})