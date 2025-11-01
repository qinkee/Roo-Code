import { LLMStreamService } from "../llm-stream-service"
import { TerminalRegistry } from "../../integrations/terminal/TerminalRegistry"
import * as vscode from "vscode"

// Mock dependencies
jest.mock("../../integrations/terminal/TerminalRegistry")
jest.mock("../im-websocket")

describe("LLMStreamService Terminal Handler", () => {
	let service: LLMStreamService
	let mockContext: vscode.ExtensionContext
	let mockOutputChannel: vscode.OutputChannel
	let mockTerminal: any

	beforeEach(() => {
		// Setup mocks
		mockOutputChannel = {
			appendLine: jest.fn(),
			show: jest.fn(),
			dispose: jest.fn(),
		} as any

		mockContext = {} as vscode.ExtensionContext

		mockTerminal = {
			id: 1,
			runCommand: jest.fn().mockImplementation((cmd, callbacks) => {
				// Simulate command execution
				setTimeout(() => {
					callbacks.onLine("output line 1\n", {} as any)
					callbacks.onLine("output line 2\n", {} as any)
					callbacks.onCompleted("output line 1\noutput line 2\n", {} as any)
					callbacks.onShellExecutionComplete(
						{
							exitCode: 0,
							isSuccess: true,
						},
						{} as any,
					)
				}, 10)

				return Promise.resolve()
			}),
			terminal: {
				show: jest.fn(),
			},
		}

		;(TerminalRegistry.getOrCreateTerminal as jest.Mock).mockResolvedValue(mockTerminal)

		service = new LLMStreamService(mockContext, mockOutputChannel)
		service.markHandlersRegistered()
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	describe("handleTerminalCommand", () => {
		it("should create terminal and execute command", async () => {
			const streamId = "test_stream_123"
			const message = {
				type: "terminal_input" as const,
				action: "execute" as const,
				content: 'echo "Hello World"',
				cwd: "/test/dir",
				timestamp: Date.now(),
			}

			const requestData = {
				streamId,
				recvId: 1661,
				sendId: 166,
				targetTerminal: 6,
				senderTerminal: 0,
				chatType: "PRIVATE",
			}

			// Access private method for testing
			await (service as any).handleTerminalCommand(streamId, message, requestData)

			// Verify terminal was created
			expect(TerminalRegistry.getOrCreateTerminal).toHaveBeenCalledWith("/test/dir", false, streamId, "vscode")

			// Verify command was executed
			expect(mockTerminal.runCommand).toHaveBeenCalledWith(
				'echo "Hello World"',
				expect.objectContaining({
					onLine: expect.any(Function),
					onCompleted: expect.any(Function),
					onShellExecutionComplete: expect.any(Function),
					onShellExecutionStarted: expect.any(Function),
					onNoShellIntegration: expect.any(Function),
				}),
			)
		})

		it("should reuse existing terminal session", async () => {
			const streamId = "test_stream_123"
			const message = {
				type: "terminal_input" as const,
				action: "execute" as const,
				content: 'echo "Test 1"',
				timestamp: Date.now(),
			}

			const requestData = {
				streamId,
				recvId: 1661,
				sendId: 166,
				targetTerminal: 6,
				senderTerminal: 0,
				chatType: "PRIVATE",
			}

			// Execute first command
			await (service as any).handleTerminalCommand(streamId, message, requestData)

			// Execute second command with same streamId
			const message2 = { ...message, content: 'echo "Test 2"' }
			await (service as any).handleTerminalCommand(streamId, message2, requestData)

			// Terminal should only be created once
			expect(TerminalRegistry.getOrCreateTerminal).toHaveBeenCalledTimes(1)

			// Both commands should be executed
			expect(mockTerminal.runCommand).toHaveBeenCalledTimes(2)
		})

		it("should handle command execution errors", async () => {
			const streamId = "test_stream_error"
			const message = {
				type: "terminal_input" as const,
				action: "execute" as const,
				content: "invalid_command",
				timestamp: Date.now(),
			}

			const requestData = {
				streamId,
				recvId: 1661,
				sendId: 166,
				targetTerminal: 6,
				senderTerminal: 0,
				chatType: "PRIVATE",
			}

			// Mock terminal to throw error
			mockTerminal.runCommand.mockRejectedValueOnce(new Error("Command failed"))

			await (service as any).handleTerminalCommand(streamId, message, requestData)

			// Verify error was logged
			expect(mockOutputChannel.appendLine).toHaveBeenCalledWith(expect.stringContaining("[Terminal] Error:"))
		})

		it("should send output chunks via IM connection", async () => {
			const streamId = "test_stream_output"
			const message = {
				type: "terminal_input" as const,
				action: "execute" as const,
				content: "ls -la",
				timestamp: Date.now(),
			}

			const requestData = {
				streamId,
				recvId: 1661,
				sendId: 166,
				targetTerminal: 6,
				senderTerminal: 0,
				chatType: "PRIVATE",
			}

			const sendLLMChunkSpy = jest.spyOn(service.imConnection, "sendLLMChunk")

			await (service as any).handleTerminalCommand(streamId, message, requestData)

			// Wait for async callbacks
			await new Promise((resolve) => setTimeout(resolve, 50))

			// Verify output was sent via IM
			expect(sendLLMChunkSpy).toHaveBeenCalled()
		})

		it("should clean up terminal session after timeout", async () => {
			jest.useFakeTimers()

			const streamId = "test_stream_cleanup"
			const message = {
				type: "terminal_input" as const,
				action: "execute" as const,
				content: 'echo "test"',
				timestamp: Date.now(),
			}

			const requestData = {
				streamId,
				recvId: 1661,
				sendId: 166,
				targetTerminal: 6,
				senderTerminal: 0,
				chatType: "PRIVATE",
			}

			await (service as any).handleTerminalCommand(streamId, message, requestData)

			// Fast-forward time by 5 minutes
			jest.advanceTimersByTime(300000)

			// Verify session was cleaned up
			const sessions = (service as any).terminalSessions
			expect(sessions.has(streamId)).toBe(false)

			jest.useRealTimers()
		})
	})

	describe("setupTerminalHandlers", () => {
		it("should register LLM stream request handler", () => {
			const onLLMStreamRequestSpy = jest.spyOn(service.imConnection, "onLLMStreamRequest")

			// Trigger setup
			;(service as any).setupTerminalHandlers()

			// Wait for setTimeout
			jest.advanceTimersByTime(100)

			expect(onLLMStreamRequestSpy).toHaveBeenCalled()
		})

		it("should ignore non-terminal messages", async () => {
			const handler = jest.fn()
			service.imConnection.onLLMStreamRequest = handler

			const data = {
				streamId: "test",
				question: JSON.stringify({ type: "other_type", content: "test" }),
			}

			// This should not throw
			expect(() => {
				;(service as any).setupTerminalHandlers()
			}).not.toThrow()
		})
	})
})
