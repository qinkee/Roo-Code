import { vi, describe, it, expect, beforeEach } from 'vitest'
import { AgentRoutingService } from '../AgentRoutingService'
import { AgentRequest, AgentResponse, AgentEndpoint } from '@roo-code/types'

// Mock dependencies
vi.mock('../UnifiedAgentRegistry')
vi.mock('../A2AClient')
vi.mock('../../utils/logging', () => ({
	logger: {
		debug: vi.fn(),
		info: vi.fn(),
		warn: vi.fn(),
		error: vi.fn()
	}
}))

const mockA2AClient = {
	sendRequest: vi.fn(),
	discoverAgents: vi.fn(),
	testConnection: vi.fn()
}

const mockRegistry = {
	getInstance: vi.fn(() => mockRegistry),
	discoverAgents: vi.fn(),
	registerAgent: vi.fn(),
	unregisterAgent: vi.fn()
}

// Mock the modules
vi.mock('../A2AClient', () => ({
	A2AClient: vi.fn(() => mockA2AClient)
}))

vi.mock('../UnifiedAgentRegistry', () => ({
	UnifiedAgentRegistry: {
		getInstance: () => mockRegistry
	}
}))

describe('AgentRoutingService', () => {
	let routingService: AgentRoutingService
	let mockRequest: AgentRequest
	let mockEndpoint: AgentEndpoint

	beforeEach(() => {
		routingService = new AgentRoutingService()
		vi.clearAllMocks()

		mockRequest = {
			method: 'execute',
			params: { task: 'test' },
			sourceAgentId: 'source-agent',
			sourceUserId: 'user123',
			timeout: 30000
		}

		mockEndpoint = {
			agentId: 'target-agent',
			userId: 'user456',
			type: 'network_reachable',
			directUrl: 'http://localhost:3001',
			imProxyId: 'proxy_target-agent',
			status: {
				state: 'online',
				lastSeen: Date.now(),
				currentLoad: 0.1,
				errorRate: 0.01,
				avgResponseTime: 1000
			},
			deploymentType: 'pc'
		}
	})

	describe('routeToAgent', () => {
		it('should route request successfully using direct route', async () => {
			// Mock endpoint discovery
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(mockEndpoint)
			
			// Mock permissions check
			vi.spyOn(routingService as any, 'checkPermissions').mockResolvedValue(true)
			
			// Mock A2A client response
			const mockResponse: AgentResponse = {
				success: true,
				data: { result: 'success' },
				agentId: 'target-agent',
				route: 'a2a_official',
				timestamp: Date.now()
			}
			mockA2AClient.sendRequest.mockResolvedValue(mockResponse)

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest
			)

			expect(response.success).toBe(true)
			expect(response.data).toEqual({ result: 'success' })
			expect(response.route).toBe('a2a_official')
			expect(mockA2AClient.sendRequest).toHaveBeenCalledWith(
				'source-agent',
				'target-agent',
				mockRequest
			)
		})

		it('should handle target agent not found', async () => {
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(null)

			const response = await routingService.routeToAgent(
				'source-agent',
				'nonexistent-agent',
				mockRequest
			)

			expect(response.success).toBe(false)
			expect(response.error).toBe('Target agent nonexistent-agent not found')
		})

		it('should handle permission denied', async () => {
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(mockEndpoint)
			vi.spyOn(routingService as any, 'checkPermissions').mockResolvedValue(false)

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest
			)

			expect(response.success).toBe(false)
			expect(response.error).toBe('Access denied: source-agent cannot access target-agent')
		})

		it('should handle offline target agent', async () => {
			const offlineEndpoint = {
				...mockEndpoint,
				status: { ...mockEndpoint.status, state: 'offline' as const }
			}
			
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(offlineEndpoint)
			vi.spyOn(routingService as any, 'checkPermissions').mockResolvedValue(true)

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest
			)

			expect(response.success).toBe(false)
			expect(response.error).toBe('Target agent target-agent is offline')
		})

		it('should use forced route when specified', async () => {
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(mockEndpoint)
			vi.spyOn(routingService as any, 'checkPermissions').mockResolvedValue(true)
			
			const mockIMResponse = {
				success: true,
				data: { message: 'IM bridge call successful' },
				agentId: 'target-agent',
				route: 'im_bridge',
				timestamp: Date.now()
			}
			
			// Mock IM bridge call
			vi.spyOn(routingService as any, 'imBridgeCall').mockResolvedValue(mockIMResponse)

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest,
				{ forceRoute: 'im_bridge' }
			)

			expect(response.route).toBe('im_bridge')
		})
	})

	describe('selectOptimalRoute', () => {
		it('should select direct route for network_reachable agents', async () => {
			const route = await (routingService as any).selectOptimalRoute(mockEndpoint)
			expect(route).toBe('direct')
		})

		it('should select im_bridge route for local_only agents', async () => {
			const localEndpoint = { ...mockEndpoint, type: 'local_only' as const }
			const route = await (routingService as any).selectOptimalRoute(localEndpoint)
			expect(route).toBe('im_bridge')
		})

		it('should select probe_then_fallback route for hybrid agents', async () => {
			const hybridEndpoint = { ...mockEndpoint, type: 'hybrid' as const }
			const route = await (routingService as any).selectOptimalRoute(hybridEndpoint)
			expect(route).toBe('probe_then_fallback')
		})

		it('should select direct route even for offline agents (offline check moved to main method)', async () => {
			const offlineEndpoint = {
				...mockEndpoint,
				status: { ...mockEndpoint.status, state: 'offline' as const }
			}

			const route = await (routingService as any).selectOptimalRoute(offlineEndpoint)
			expect(route).toBe('direct')
		})
	})

	describe('probeAndFallbackCall', () => {
		it('should succeed with direct call if available', async () => {
			const mockDirectResponse: AgentResponse = {
				success: true,
				data: { result: 'direct success' },
				agentId: 'target-agent',
				route: 'a2a_official',
				timestamp: Date.now()
			}
			
			mockA2AClient.sendRequest.mockResolvedValue(mockDirectResponse)

			const response = await (routingService as any).probeAndFallbackCall(mockEndpoint, mockRequest)

			expect(response.success).toBe(true)
			expect(response.data).toEqual({ result: 'direct success' })
		})

		it('should fallback to IM bridge when direct call fails', async () => {
			// Mock direct call failure
			mockA2AClient.sendRequest.mockRejectedValue(new Error('Connection failed'))
			
			// Mock IM bridge success
			const mockIMResponse = {
				success: true,
				data: { message: 'IM bridge call successful' },
				agentId: 'target-agent',
				route: 'im_bridge',
				timestamp: Date.now()
			}
			vi.spyOn(routingService as any, 'imBridgeCall').mockResolvedValue(mockIMResponse)

			const response = await (routingService as any).probeAndFallbackCall(mockEndpoint, mockRequest)

			expect(response.success).toBe(true)
			expect(response.route).toBe('im_bridge')
		})
	})

	describe('hybridCall', () => {
		it('should try direct call first', async () => {
			const mockDirectResponse: AgentResponse = {
				success: true,
				data: { result: 'direct success' },
				agentId: 'target-agent',
				route: 'a2a_official',
				timestamp: Date.now()
			}
			
			mockA2AClient.sendRequest.mockResolvedValue(mockDirectResponse)

			const response = await (routingService as any).hybridCall(mockEndpoint, mockRequest)

			expect(response.success).toBe(true)
			expect(response.route).toBe('a2a_official')
		})

		it('should fallback to IM bridge when direct fails', async () => {
			// Mock direct call failure
			mockA2AClient.sendRequest.mockRejectedValue(new Error('Direct failed'))
			
			// Mock IM bridge success
			const mockIMResponse = {
				success: true,
				data: { message: 'IM bridge call successful' },
				agentId: 'target-agent',
				route: 'im_bridge',
				timestamp: Date.now()
			}
			vi.spyOn(routingService as any, 'imBridgeCall').mockResolvedValue(mockIMResponse)

			const response = await (routingService as any).hybridCall(mockEndpoint, mockRequest)

			expect(response.success).toBe(true)
			expect(response.route).toBe('im_bridge')
		})
	})

	describe('updateMetrics', () => {
		it('should update metrics for successful requests', async () => {
			const { logger } = await import('../../utils/logging')
			const loggerSpy = vi.spyOn(logger, 'debug')

			await (routingService as any).updateMetrics('test-agent', 'direct', 1500, true)

			expect(loggerSpy).toHaveBeenCalledWith(
				expect.stringContaining('Metrics: test-agent via direct took 1500ms, success: true')
			)
		})

		it('should handle metrics update errors gracefully', async () => {
			const { logger } = await import('../../utils/logging')
			const loggerSpy = vi.spyOn(logger, 'error')

			// This should not throw
			await (routingService as any).updateMetrics('test-agent', 'direct', 1500, true)

			// Should not have logged any errors for basic metrics logging
			expect(loggerSpy).not.toHaveBeenCalled()
		})
	})

	describe('route type validation', () => {
		it('should handle unknown route types', async () => {
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockResolvedValue(mockEndpoint)
			vi.spyOn(routingService as any, 'checkPermissions').mockResolvedValue(true)
			vi.spyOn(routingService as any, 'selectOptimalRoute').mockResolvedValue('unknown_route')

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest
			)

			expect(response.success).toBe(false)
			expect(response.error).toContain('Unknown route type: unknown_route')
		})
	})

	describe('error handling', () => {
		it('should handle unexpected errors gracefully', async () => {
			vi.spyOn(routingService as any, 'getAgentEndpoint').mockRejectedValue(new Error('Unexpected error'))

			const response = await routingService.routeToAgent(
				'source-agent',
				'target-agent',
				mockRequest
			)

			expect(response.success).toBe(false)
			expect(response.error).toContain('Unexpected error')
			expect(response.agentId).toBe('target-agent')
			expect(response.route).toBe('failed')
		})
	})
})