import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AgentRedisAdapter } from '../AgentRedisAdapter'
import { AgentConfig } from '@roo-code/types'

// Mock RedisSyncService
vi.mock('../../../services/RedisSyncService', () => ({
	RedisSyncService: {
		getInstance: vi.fn(() => ({
			set: vi.fn(),
			get: vi.fn(),
			startHealthCheck: vi.fn(),
			disconnect: vi.fn()
		}))
	}
}))

describe('AgentRedisAdapter', () => {
	let adapter: AgentRedisAdapter
	let mockRedisService: any

	beforeEach(() => {
		adapter = new AgentRedisAdapter()
		// Access the mock redis service
		mockRedisService = (adapter as any).redisService
		vi.clearAllMocks()
	})

	describe('syncAgentToRegistry', () => {
		it('should sync agent to Redis with correct key and data', async () => {
			const mockAgent: AgentConfig = {
				id: 'test-agent-1',
				userId: 'user123',
				name: 'Test Agent',
				avatar: 'avatar.png',
				roleDescription: 'A test agent',
				apiConfigId: 'default',
				mode: 'assistant',
				tools: [{ toolId: 'test-tool', enabled: true }],
				todos: [],
				isActive: true,
				isPrivate: false,
				shareScope: 'public',
				shareLevel: 3,
				permissions: ['read', 'execute'],
				allowedUsers: [],
				allowedGroups: [],
				deniedUsers: [],
				createdAt: Date.now(),
				updatedAt: Date.now(),
				version: 1
			}

			// Mock online agents list
			mockRedisService.get.mockResolvedValue([])

			await adapter.syncAgentToRegistry(mockAgent)

			// Verify agent data was set
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:user123:agents:test-agent-1',
				expect.objectContaining({
					id: 'test-agent-1',
					userId: 'user123',
					name: 'Test Agent',
					isPrivate: false,
					shareScope: 'public',
					shareLevel: 3
				})
			)

			// Verify online agents list was updated
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:online_agents',
				['test-agent-1']
			)
		})

		it('should handle agent sync error gracefully', async () => {
			const mockAgent: AgentConfig = {
				id: 'test-agent-1',
				userId: 'user123',
				name: 'Test Agent',
				avatar: '',
				roleDescription: 'A test agent',
				apiConfigId: 'default',
				mode: 'assistant',
				tools: [],
				todos: [],
				createdAt: Date.now(),
				updatedAt: Date.now()
			}

			mockRedisService.set.mockRejectedValue(new Error('Redis error'))

			await expect(adapter.syncAgentToRegistry(mockAgent)).rejects.toThrow('Redis error')
		})
	})

	describe('getOnlineAgents', () => {
		it('should return online agents list', async () => {
			const mockOnlineAgents = ['agent1', 'agent2', 'agent3']
			mockRedisService.get.mockResolvedValue(mockOnlineAgents)

			const result = await adapter.getOnlineAgents()

			expect(mockRedisService.get).toHaveBeenCalledWith('roo:online_agents')
			expect(result).toEqual(mockOnlineAgents)
		})

		it('should return empty array when no data', async () => {
			mockRedisService.get.mockResolvedValue(null)

			const result = await adapter.getOnlineAgents()

			expect(result).toEqual([])
		})

		it('should return empty array on error', async () => {
			mockRedisService.get.mockRejectedValue(new Error('Redis error'))

			const result = await adapter.getOnlineAgents()

			expect(result).toEqual([])
		})
	})

	describe('removeAgentFromRegistry', () => {
		it('should remove agent and update online list', async () => {
			const onlineAgents = ['agent1', 'agent2', 'agent3']
			mockRedisService.get.mockResolvedValue(onlineAgents)

			await adapter.removeAgentFromRegistry('user123', 'agent2')

			// Verify agent data was nullified
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:user123:agents:agent2',
				null
			)

			// Verify online agents list was updated (agent2 removed)
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:online_agents',
				['agent1', 'agent3']
			)
		})
	})

	describe('updateAgentOnlineStatus', () => {
		it('should add agent to online list when setting online', async () => {
			mockRedisService.get.mockResolvedValue(['agent1'])

			await adapter.updateAgentOnlineStatus('agent2', true)

			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:online_agents',
				['agent1', 'agent2']
			)
		})

		it('should remove agent from online list when setting offline', async () => {
			mockRedisService.get.mockResolvedValue(['agent1', 'agent2'])

			await adapter.updateAgentOnlineStatus('agent2', false)

			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:online_agents',
				['agent1']
			)
		})

		it('should not duplicate agents in online list', async () => {
			mockRedisService.get.mockResolvedValue(['agent1', 'agent2'])

			await adapter.updateAgentOnlineStatus('agent2', true)

			// Should not call set since agent2 is already online
			expect(mockRedisService.set).not.toHaveBeenCalled()
		})
	})

	describe('getAgentFromRegistry', () => {
		it('should return agent data when found', async () => {
			const mockAgentData = {
				id: 'test-agent',
				userId: 'user123',
				name: 'Test Agent',
				roleDescription: 'A test agent'
			}
			mockRedisService.get.mockResolvedValue(mockAgentData)

			const result = await adapter.getAgentFromRegistry('user123', 'test-agent')

			expect(mockRedisService.get).toHaveBeenCalledWith('roo:user123:agents:test-agent')
			expect(result).toEqual(mockAgentData)
		})

		it('should return null when agent not found', async () => {
			mockRedisService.get.mockResolvedValue(null)

			const result = await adapter.getAgentFromRegistry('user123', 'nonexistent')

			expect(result).toBeNull()
		})

		it('should return null for invalid agent data', async () => {
			mockRedisService.get.mockResolvedValue({ invalid: 'data' })

			const result = await adapter.getAgentFromRegistry('user123', 'test-agent')

			expect(result).toBeNull()
		})
	})

	describe('batchSyncAgents', () => {
		it('should sync multiple agents', async () => {
			const mockAgents: AgentConfig[] = [
				{
					id: 'agent1',
					userId: 'user123',
					name: 'Agent 1',
					avatar: '',
					roleDescription: 'First agent',
					apiConfigId: 'default',
					mode: 'assistant',
					tools: [],
					todos: [],
					isActive: true,
					createdAt: Date.now(),
					updatedAt: Date.now()
				},
				{
					id: 'agent2',
					userId: 'user123',
					name: 'Agent 2',
					avatar: '',
					roleDescription: 'Second agent',
					apiConfigId: 'default',
					mode: 'assistant',
					tools: [],
					todos: [],
					isActive: true,
					createdAt: Date.now(),
					updatedAt: Date.now()
				}
			]

			mockRedisService.get.mockResolvedValue([])

			await adapter.batchSyncAgents(mockAgents)

			// Should have called set for each agent data and online list updates
			expect(mockRedisService.set).toHaveBeenCalledTimes(4) // 2 agents + 2 online list updates
			
			// Verify agent data storage
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:user123:agents:agent1',
				expect.any(Object)
			)
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:user123:agents:agent2',
				expect.any(Object)
			)
			
			// Verify online agents list updates (both calls should include both agents due to concurrent execution)
			expect(mockRedisService.set).toHaveBeenCalledWith(
				'roo:online_agents',
				['agent1', 'agent2']
			)
			
			// The last two calls should both be for the online agents list
			const calls = mockRedisService.set.mock.calls
			expect(calls[2][0]).toBe('roo:online_agents')
			expect(calls[3][0]).toBe('roo:online_agents')
		})
	})

	describe('initialization and cleanup', () => {
		it('should initialize successfully', async () => {
			await adapter.initialize()

			expect(mockRedisService.startHealthCheck).toHaveBeenCalled()
		})

		it('should close connection successfully', async () => {
			await adapter.close()

			expect(mockRedisService.disconnect).toHaveBeenCalled()
		})

		it('should report as enabled', () => {
			const enabled = adapter.isEnabled()

			expect(enabled).toBe(true)
		})
	})
})