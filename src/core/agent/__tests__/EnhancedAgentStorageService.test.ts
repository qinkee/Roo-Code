import { vi, describe, it, expect, beforeEach } from 'vitest'
import { EnhancedAgentStorageService } from '../EnhancedAgentStorageService'
import { AgentConfig } from '@roo-code/types'
import * as vscode from 'vscode'

// Mock VSCode extension context
const mockContext = {
	subscriptions: [],
	workspaceState: {
		get: vi.fn(),
		update: vi.fn()
	},
	globalState: {
		get: vi.fn(),
		update: vi.fn()
	},
	extensionUri: {} as vscode.Uri,
	extensionPath: '/mock/path',
	environmentVariableCollection: {} as any,
	asAbsolutePath: vi.fn(),
	storageUri: {} as vscode.Uri,
	storagePath: '/mock/storage',
	globalStorageUri: {} as vscode.Uri,
	globalStoragePath: '/mock/global',
	logUri: {} as vscode.Uri,
	logPath: '/mock/logs',
	secrets: {} as any,
	extension: {} as vscode.Extension<any>,
	extensionMode: 1, // Production mode
	languageModelAccessInformation: {} as any
} as unknown as vscode.ExtensionContext

// Mock dependencies
vi.mock('../VSCodeAgentStorageService')
vi.mock('../AgentRedisAdapter')

const mockLocalStorage = {
	createAgent: vi.fn(),
	getAgent: vi.fn(),
	updateAgent: vi.fn(),
	deleteAgent: vi.fn(),
	listUserAgents: vi.fn(),
	searchAgents: vi.fn(),
	addTodo: vi.fn(),
	updateTodo: vi.fn(),
	deleteTodo: vi.fn(),
	importAgents: vi.fn(),
	exportAgents: vi.fn(),
	updateAgentSharing: vi.fn(),
	checkAgentAccess: vi.fn(),
	getAgentCard: vi.fn()
}

const mockRedisAdapter = {
	initialize: vi.fn().mockResolvedValue(undefined),
	isEnabled: vi.fn(() => true),
	syncAgentToRegistry: vi.fn().mockResolvedValue(undefined),
	removeAgentFromRegistry: vi.fn().mockResolvedValue(undefined),
	getOnlineAgents: vi.fn().mockResolvedValue([]),
	close: vi.fn().mockResolvedValue(undefined)
}

vi.mock('../VSCodeAgentStorageService', () => ({
	VSCodeAgentStorageService: vi.fn(() => mockLocalStorage)
}))

vi.mock('../AgentRedisAdapter', () => ({
	AgentRedisAdapter: vi.fn(() => mockRedisAdapter)
}))

describe('EnhancedAgentStorageService', () => {
	let service: EnhancedAgentStorageService
	let mockAgent: AgentConfig

	beforeEach(async () => {
		service = new EnhancedAgentStorageService(mockContext as unknown as vscode.ExtensionContext)
		vi.clearAllMocks()

		mockAgent = {
			id: 'test-agent-1',
			userId: 'user123',
			name: 'Test Agent',
			version: 1,
			avatar: 'avatar.png',
			roleDescription: 'A test agent',
			apiConfigId: 'default',
			mode: 'assistant',
			tools: [{ toolId: 'test-tool', enabled: true }],
			todos: [],
			isActive: true,
			isPrivate: false,
			isPublished: false,
			shareScope: 'public',
			shareLevel: 3,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}

		// Wait for initialization
		await new Promise(resolve => setTimeout(resolve, 10))
	})

	describe('createAgent', () => {
		it('should create agent locally and sync to Redis', async () => {
			mockLocalStorage.createAgent.mockResolvedValue(mockAgent)

			const result = await service.createAgent('user123', {
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
				isPublished: false
			})

			expect(mockLocalStorage.createAgent).toHaveBeenCalledWith('user123', expect.any(Object))
			expect(mockRedisAdapter.syncAgentToRegistry).toHaveBeenCalledWith(mockAgent)
			expect(result).toEqual(mockAgent)
		})

		it('should create agent locally even if Redis sync fails', async () => {
			mockLocalStorage.createAgent.mockResolvedValue(mockAgent)
			mockRedisAdapter.syncAgentToRegistry.mockRejectedValue(new Error('Redis error'))

			const result = await service.createAgent('user123', {
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
				isPublished: false
			})

			expect(result).toEqual(mockAgent)
			// Should still succeed even if Redis fails
		})
	})

	describe('updateAgent', () => {
		it('should update agent locally and sync to Redis', async () => {
			const updatedAgent = { ...mockAgent, name: 'Updated Agent' }
			mockLocalStorage.updateAgent.mockResolvedValue(updatedAgent)

			const result = await service.updateAgent('user123', 'test-agent-1', {
				name: 'Updated Agent'
			})

			expect(mockLocalStorage.updateAgent).toHaveBeenCalledWith(
				'user123',
				'test-agent-1',
				{ name: 'Updated Agent' }
			)
			expect(mockRedisAdapter.syncAgentToRegistry).toHaveBeenCalledWith(updatedAgent)
			expect(result).toEqual(updatedAgent)
		})

		it('should handle update failure gracefully', async () => {
			mockLocalStorage.updateAgent.mockRejectedValue(new Error('Update failed'))

			await expect(
				service.updateAgent('user123', 'test-agent-1', { name: 'Updated Agent' })
			).rejects.toThrow('Update failed')

			expect(mockRedisAdapter.syncAgentToRegistry).not.toHaveBeenCalled()
		})
	})

	describe('deleteAgent', () => {
		it('should delete agent locally and from Redis', async () => {
			mockLocalStorage.deleteAgent.mockResolvedValue(true)

			const result = await service.deleteAgent('user123', 'test-agent-1')

			expect(mockLocalStorage.deleteAgent).toHaveBeenCalledWith('user123', 'test-agent-1')
			expect(mockRedisAdapter.removeAgentFromRegistry).toHaveBeenCalledWith('user123', 'test-agent-1')
			expect(result).toBe(true)
		})

		it('should not remove from Redis if local delete fails', async () => {
			mockLocalStorage.deleteAgent.mockResolvedValue(false)

			const result = await service.deleteAgent('user123', 'test-agent-1')

			expect(result).toBe(false)
			expect(mockRedisAdapter.removeAgentFromRegistry).not.toHaveBeenCalled()
		})
	})

	describe('getAgent', () => {
		it('should get agent from local storage', async () => {
			mockLocalStorage.getAgent.mockResolvedValue(mockAgent)

			const result = await service.getAgent('user123', 'test-agent-1')

			expect(mockLocalStorage.getAgent).toHaveBeenCalledWith('user123', 'test-agent-1')
			expect(result).toEqual(mockAgent)
		})

		it('should return null if agent not found', async () => {
			mockLocalStorage.getAgent.mockResolvedValue(null)

			const result = await service.getAgent('user123', 'nonexistent')

			expect(result).toBeNull()
		})
	})

	describe('listUserAgents', () => {
		it('should list agents from local storage', async () => {
			const mockAgents = [mockAgent]
			mockLocalStorage.listUserAgents.mockResolvedValue(mockAgents)

			const result = await service.listUserAgents('user123')

			expect(mockLocalStorage.listUserAgents).toHaveBeenCalledWith('user123', undefined)
			expect(result).toEqual(mockAgents)
		})

		it('should pass options to local storage', async () => {
			const options = { active: true, limit: 10 }
			mockLocalStorage.listUserAgents.mockResolvedValue([])

			await service.listUserAgents('user123', options)

			expect(mockLocalStorage.listUserAgents).toHaveBeenCalledWith('user123', options)
		})
	})

	describe('todo management', () => {
		const mockTodo = {
			id: 'todo-1',
			content: 'Test todo',
			status: 'pending' as const,
			createdAt: Date.now(),
			updatedAt: Date.now()
		}

		it('should add todo and sync agent', async () => {
			mockLocalStorage.addTodo.mockResolvedValue(mockTodo)

			const result = await service.addTodo('user123', 'test-agent-1', {
				content: 'Test todo',
				status: 'pending'
			})

			expect(mockLocalStorage.addTodo).toHaveBeenCalled()
			expect(result).toEqual(mockTodo)
		})

		it('should update todo and sync agent', async () => {
			const updatedTodo = { ...mockTodo, status: 'completed' as const }
			mockLocalStorage.updateTodo.mockResolvedValue(updatedTodo)

			const result = await service.updateTodo('user123', 'test-agent-1', 'todo-1', {
				status: 'completed'
			})

			expect(mockLocalStorage.updateTodo).toHaveBeenCalled()
			expect(result).toEqual(updatedTodo)
		})

		it('should delete todo and sync agent', async () => {
			mockLocalStorage.deleteTodo.mockResolvedValue(true)

			const result = await service.deleteTodo('user123', 'test-agent-1', 'todo-1')

			expect(mockLocalStorage.deleteTodo).toHaveBeenCalled()
			expect(result).toBe(true)
		})
	})

	describe('sync operations', () => {
		it('should force sync to Redis', async () => {
			const mockAgents = [mockAgent]
			mockLocalStorage.listUserAgents.mockResolvedValue(mockAgents)

			await service.forceSyncToRedis('user123')

			expect(mockLocalStorage.listUserAgents).toHaveBeenCalledWith('user123')
			expect(mockRedisAdapter.syncAgentToRegistry).toHaveBeenCalledWith(mockAgent)
		})

		it('should handle sync failure', async () => {
			mockRedisAdapter.syncAgentToRegistry.mockRejectedValue(new Error('Sync failed'))
			mockLocalStorage.listUserAgents.mockResolvedValue([mockAgent])

			await expect(service.forceSyncToRedis('user123')).rejects.toThrow('Sync failed')
		})

		it('should restore from Redis (placeholder)', async () => {
			// This is currently a placeholder implementation
			await expect(service.restoreFromRedis('user123')).resolves.not.toThrow()
		})

		it('should check data consistency', async () => {
			mockLocalStorage.listUserAgents.mockResolvedValue([mockAgent])

			const result = await service.checkDataConsistency('user123')

			expect(result).toEqual({
				localCount: 1,
				redisCount: 0, // TODO implementation
				missingInRedis: [],
				missingInLocal: []
			})
		})
	})

	describe('online agents', () => {
		it('should get online agents from Redis', async () => {
			const onlineAgents = ['agent1', 'agent2']
			mockRedisAdapter.getOnlineAgents.mockResolvedValue(onlineAgents)

			const result = await service.getOnlineAgents()

			expect(result).toEqual(onlineAgents)
		})

		it('should return empty array when Redis is disabled', async () => {
			mockRedisAdapter.isEnabled.mockReturnValue(false)
			
			// Create new service instance with Redis disabled
			const disabledService = new EnhancedAgentStorageService(mockContext as unknown as vscode.ExtensionContext)
			await new Promise(resolve => setTimeout(resolve, 10))

			const result = await disabledService.getOnlineAgents()

			expect(result).toEqual([])
		})
	})

	describe('manual sync', () => {
		it('should manually sync all user agents', async () => {
			const mockAgents = [mockAgent]
			mockLocalStorage.listUserAgents.mockResolvedValue(mockAgents)

			await service.manualSync('user123')

			expect(mockLocalStorage.listUserAgents).toHaveBeenCalledWith('user123')
			expect(mockRedisAdapter.syncAgentToRegistry).toHaveBeenCalledWith(mockAgent)
		})

		it('should throw error when Redis is disabled', async () => {
			mockRedisAdapter.isEnabled.mockReturnValue(false)
			const disabledService = new EnhancedAgentStorageService(mockContext as unknown as vscode.ExtensionContext)
			await new Promise(resolve => setTimeout(resolve, 10))

			await expect(disabledService.manualSync('user123')).rejects.toThrow('Redis sync is not enabled')
		})
	})

	describe('compatibility methods', () => {
		it('should handle setCurrentUserId for compatibility', () => {
			// Should not throw
			expect(() => service.setCurrentUserId('user123')).not.toThrow()
		})
	})

	describe('cleanup', () => {
		it('should close Redis connection', async () => {
			await service.close()

			expect(mockRedisAdapter.close).toHaveBeenCalled()
		})

		it('should handle close when Redis is disabled', async () => {
			mockRedisAdapter.isEnabled.mockReturnValue(false)
			const disabledService = new EnhancedAgentStorageService(mockContext as unknown as vscode.ExtensionContext)
			
			await expect(disabledService.close()).resolves.not.toThrow()
		})
	})

	describe('delegation methods', () => {
		it('should delegate searchAgents to local storage', async () => {
			const mockResults = [mockAgent]
			mockLocalStorage.searchAgents.mockResolvedValue(mockResults)

			const result = await service.searchAgents('user123', 'test query')

			expect(mockLocalStorage.searchAgents).toHaveBeenCalledWith('user123', 'test query')
			expect(result).toEqual(mockResults)
		})

		it('should delegate import/export operations', async () => {
			const mockExportData = { 
				agent: mockAgent,
				metadata: {
					exportedAt: Date.now(),
					exportedBy: "user123",
					version: "1.0"
				}
			}
			mockLocalStorage.exportAgents.mockResolvedValue(mockExportData)
			mockLocalStorage.importAgents.mockResolvedValue([mockAgent])

			const exportResult = await service.exportAgents('user123')
			const importResult = await service.importAgents('user123', mockExportData)

			expect(exportResult).toEqual(mockExportData)
			expect(importResult).toEqual([mockAgent])
		})
	})
})