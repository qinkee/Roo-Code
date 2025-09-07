import { describe, it, expect, vi, beforeEach } from "vitest"
import * as vscode from "vscode"
import { executeTask, executeTaskWithMode, listTasks } from "../handleTaskCommands"
import { ClineProvider } from "../../core/webview/ClineProvider"
import { TaskHistoryBridge } from "../../api/task-history-bridge"

vi.mock("vscode")
vi.mock("../../core/webview/ClineProvider")
vi.mock("../../api/task-history-bridge")
vi.mock("../../i18n", () => ({
	t: (key: string) => key,
}))

describe("handleTaskCommands", () => {
	let mockProvider: any

	beforeEach(() => {
		vi.clearAllMocks()

		mockProvider = {
			getTaskWithId: vi.fn(),
			initClineWithHistoryItem: vi.fn(),
			initClineWithTask: vi.fn(),
			postMessageToWebview: vi.fn(),
			updateGlobalState: vi.fn(),
			customModesManager: {
				getCustomModes: vi.fn().mockResolvedValue([]),
			},
			providerSettingsManager: {
				getModeConfigId: vi.fn(),
				listConfig: vi.fn().mockResolvedValue([]),
			},
			activateProviderProfile: vi.fn(),
		}

		vi.mocked(ClineProvider.getVisibleInstance).mockReturnValue(mockProvider)
	})

	describe("executeTask", () => {
		it("should create a new task when no taskId is provided", async () => {
			const params = { content: "Test task content" }

			await executeTask(params)

			expect(mockProvider.initClineWithTask).toHaveBeenCalledWith("Test task content")
		})

		it("should continue existing task when taskId is provided", async () => {
			const historyItem = { id: "task-123", task: "Existing task" }
			const mockTask = {
				handleWebviewAskResponse: vi.fn(),
			}
			mockProvider.getTaskWithId.mockResolvedValue({ historyItem })
			mockProvider.initClineWithHistoryItem.mockResolvedValue(mockTask)

			const params = { taskId: "task-123", content: "Continue task" }

			await executeTask(params)

			expect(mockProvider.getTaskWithId).toHaveBeenCalledWith("task-123")
			expect(mockProvider.initClineWithHistoryItem).toHaveBeenCalledWith(historyItem)

			// Wait for the setTimeout to complete
			await new Promise((resolve) => setTimeout(resolve, 250))

			expect(mockTask.handleWebviewAskResponse).toHaveBeenCalledWith("messageResponse", "Continue task")
		})

		it("should show error when task is not found", async () => {
			mockProvider.getTaskWithId.mockResolvedValue({ historyItem: null })
			const showErrorMessage = vi.spyOn(vscode.window, "showErrorMessage")

			const params = { taskId: "non-existent", content: "Test" }

			await executeTask(params)

			expect(showErrorMessage).toHaveBeenCalledWith("Task with ID non-existent not found")
		})

		it("should prompt for content when not provided", async () => {
			const showInputBox = vi.spyOn(vscode.window, "showInputBox").mockResolvedValue("User input task")

			await executeTask(null)

			expect(showInputBox).toHaveBeenCalled()
			expect(mockProvider.initClineWithTask).toHaveBeenCalledWith("User input task")
		})
	})

	describe("executeTaskWithMode", () => {
		it("should create task with specified mode", async () => {
			const params = { modeId: "code", content: "Write code" }

			vi.mocked(mockProvider.customModesManager.getCustomModes).mockResolvedValue([])

			await executeTaskWithMode(params)

			expect(mockProvider.updateGlobalState).toHaveBeenCalledWith("mode", "code")
			expect(mockProvider.initClineWithTask).toHaveBeenCalledWith("Write code")
		})

		it("should load saved API config for mode if exists", async () => {
			const params = { modeId: "architecture", content: "Design system" }

			mockProvider.providerSettingsManager.getModeConfigId.mockResolvedValue("config-123")
			mockProvider.providerSettingsManager.listConfig.mockResolvedValue([
				{ id: "config-123", name: "Architecture Config" },
			])

			await executeTaskWithMode(params)

			expect(mockProvider.activateProviderProfile).toHaveBeenCalledWith({ name: "Architecture Config" })
		})

		it("should show error when mode does not exist", async () => {
			const showErrorMessage = vi.spyOn(vscode.window, "showErrorMessage")
			const params = { modeId: "non-existent-mode", content: "Test" }

			vi.mocked(mockProvider.customModesManager.getCustomModes).mockResolvedValue([])

			await executeTaskWithMode(params)

			expect(showErrorMessage).toHaveBeenCalledWith("Mode with ID non-existent-mode not found")
		})
	})

	describe("listTasks", () => {
		it("should return formatted task list", async () => {
			const mockHistory = [
				{ 
					id: "task-1", 
					task: "First task", 
					ts: Date.now(),
					number: 1,
					tokensIn: 100,
					tokensOut: 200,
					totalCost: 0.01
				},
				{ 
					id: "task-2", 
					task: "Second task", 
					ts: Date.now() - 3600000,
					number: 2,
					tokensIn: 150,
					tokensOut: 250,
					totalCost: 0.02
				},
				{ 
					id: "task-3", 
					task: null as any, 
					ts: Date.now() - 7200000,
					number: 3,
					tokensIn: 200,
					tokensOut: 300,
					totalCost: 0.03
				},
			]

			vi.mocked(TaskHistoryBridge.getTaskHistory).mockResolvedValue(mockHistory)

			const tasks = await listTasks()

			expect(tasks).toHaveLength(3)
			expect(tasks[0]).toMatchObject({
				id: "task-1",
				label: "First task",
			})
			expect(tasks[2].label).toBe("Untitled Task")
		})

		it("should return empty array when no tasks", async () => {
			vi.mocked(TaskHistoryBridge.getTaskHistory).mockResolvedValue([])

			const tasks = await listTasks()

			expect(tasks).toEqual([])
		})
	})
})
