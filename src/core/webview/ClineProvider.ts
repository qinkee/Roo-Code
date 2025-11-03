import os from "os"
import * as path from "path"
import fs from "fs/promises"
import EventEmitter from "events"

import { Anthropic } from "@anthropic-ai/sdk"
import delay from "delay"
import axios from "axios"
import pWaitFor from "p-wait-for"
import * as vscode from "vscode"
import { TaskHistoryBridge } from "../../api/task-history-bridge"

import {
	type TaskProviderLike,
	type TaskProviderEvents,
	type GlobalState,
	type ProviderName,
	type ProviderSettings,
	type RooCodeSettings,
	type ProviderSettingsEntry,
	type TelemetryProperties,
	type TelemetryPropertiesProvider,
	type CodeActionId,
	type CodeActionName,
	type TerminalActionId,
	type TerminalActionPromptType,
	type HistoryItem,
	type CloudUserInfo,
	type ClineMessage,
	RooCodeEventName,
	requestyDefaultModelId,
	openRouterDefaultModelId,
	glamaDefaultModelId,
	ORGANIZATION_ALLOW_ALL,
	DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
	DEFAULT_WRITE_DELAY_MS,
} from "@roo-code/types"
import { TelemetryService } from "@roo-code/telemetry"
import { CloudService, getRooCodeApiUrl } from "@roo-code/cloud"

import { Package } from "../../shared/package"
import { findLast } from "../../shared/array"
import { supportPrompt } from "../../shared/support-prompt"
import { GlobalFileNames } from "../../shared/globalFileNames"
import { ExtensionMessage, MarketplaceInstalledMetadata } from "../../shared/ExtensionMessage"
import { Mode, defaultModeSlug, getModeBySlug } from "../../shared/modes"
import { experimentDefault } from "../../shared/experiments"
import { formatLanguage } from "../../shared/language"
import { WebviewMessage } from "../../shared/WebviewMessage"
import { EMBEDDING_MODEL_PROFILES } from "../../shared/embeddingModels"
import { ProfileValidator } from "../../shared/ProfileValidator"

import { Terminal } from "../../integrations/terminal/Terminal"
import { downloadTask } from "../../integrations/misc/export-markdown"
import { getTheme } from "../../integrations/theme/getTheme"
import WorkspaceTracker from "../../integrations/workspace/WorkspaceTracker"

import { McpHub } from "../../services/mcp/McpHub"
import { McpServerManager } from "../../services/mcp/McpServerManager"
import { MarketplaceManager } from "../../services/marketplace"
import { ShadowCheckpointService } from "../../services/checkpoints/ShadowCheckpointService"
import { CodeIndexManager } from "../../services/code-index/manager"
import type { IndexProgressUpdate } from "../../services/code-index/interfaces/manager"
import { MdmService } from "../../services/mdm/MdmService"

import { fileExistsAtPath } from "../../utils/fs"
import { setTtsEnabled, setTtsSpeed } from "../../utils/tts"
import { getWorkspaceGitInfo } from "../../utils/git"
import { getWorkspacePath } from "../../utils/path"
import { isRemoteControlEnabled } from "../../utils/remoteControl"
import { ZeroWidthEncoder } from "../../utils/zeroWidthEncoder"

import { setPanel } from "../../activate/registerCommands"

import { t } from "../../i18n"

import { buildApiHandler } from "../../api"
import { VoidBridge } from "../../api/void-bridge"
import { forceFullModelDetailsLoad, hasLoadedFullDetails } from "../../api/providers/fetchers/lmstudio"

import { ContextProxy } from "../config/ContextProxy"
import { ProviderSettingsManager } from "../config/ProviderSettingsManager"
import { CustomModesManager } from "../config/CustomModesManager"
import { Task, TaskOptions, AgentTaskContext } from "../task/Task"
import { getSystemPromptFilePath } from "../prompts/sections/custom-system-prompt"
import { AgentManager } from "../agent/AgentManager"
import { EnhancedAgentStorageService } from "../agent/EnhancedAgentStorageService"

import { webviewMessageHandler } from "./webviewMessageHandler"
import { getNonce } from "./getNonce"
import { getUri } from "./getUri"

/**
 * https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts
 * https://github.com/KumarVariable/vscode-extension-sidebar-html/blob/master/src/customSidebarViewProvider.ts
 */

export class ClineProvider
	extends EventEmitter<TaskProviderEvents>
	implements vscode.WebviewViewProvider, TelemetryPropertiesProvider, TaskProviderLike
{
	// Used in package.json as the view's id. This value cannot be changed due
	// to how VSCode caches views based on their id, and updating the id would
	// break existing instances of the extension.
	public static readonly sideBarId = `${Package.name}.SidebarProvider`
	public static readonly tabPanelId = `${Package.name}.TabPanelProvider`
	private static activeInstances: Set<ClineProvider> = new Set()
	private disposables: vscode.Disposable[] = []
	private webviewDisposables: vscode.Disposable[] = []
	private view?: vscode.WebviewView | vscode.WebviewPanel
	/*
	 * 🔥 任务管理架构说明：
	 *
	 * 1. 用户任务（UI触发）：使用单一LIFO栈 clineStack
	 *    - 串行执行，一次只能有一个活跃任务
	 *    - 支持子任务嵌套（通过栈的push/pop实现）
	 *
	 * 2. 智能体任务（IM/A2A触发）：使用任务池 agentTaskPool
	 *    - 并行执行，每个根任务独立运行
	 *    - 结构：Map<rootTaskId, Task[]>，每个根任务维护自己的LIFO栈
	 *    - 支持任意深度的子任务嵌套
	 *    - 后台静默执行，不影响用户任务
	 *
	 * 3. 关键流程：
	 *    - addClineToStack: 根据 agentTaskContext 判断任务类型，分发到对应栈
	 *    - finishSubTask: 检测任务类型，调用对应的完成逻辑
	 *    - finishAgentSubTask: LIFO弹出子任务，自动恢复父任务
	 *    - cleanupAgentTask: 保存历史消息，清理栈资源
	 */
	private clineStack: Task[] = [] // 用户任务栈（单栈执行）
	private agentTaskPool: Map<string, Task[]> = new Map() // 智能体任务池（并行执行，每个根任务一个栈）
	// 🔥 追踪每个消息的上次发送位置（用于增量发送）
	// Key: `${taskId}_${messageTimestamp}`, Value: lastSentLength
	private lastSentPositions: Map<string, number> = new Map()
	// 🔥 用户正在查看的智能体任务ID（null表示未查看或查看用户任务）
	private viewingAgentTaskId: string | null = null
	private codeIndexStatusSubscription?: vscode.Disposable
	private currentWorkspaceManager?: CodeIndexManager
	private _workspaceTracker?: WorkspaceTracker // workSpaceTracker read-only for access outside this class
	public get workspaceTracker(): WorkspaceTracker | undefined {
		return this._workspaceTracker
	}
	protected mcpHub?: McpHub // Change from private to protected
	private marketplaceManager: MarketplaceManager
	private mdmService?: MdmService
	private taskCreationCallback: (task: Task) => void
	private taskEventListeners: WeakMap<Task, Array<() => void>> = new WeakMap()
	public readonly agentManager: AgentManager

	public isViewLaunched = false
	public settingsImportedAt?: number
	public readonly latestAnnouncementId = "aug-12-2025-3-25-12" // Update for v3.25.12 announcement
	public readonly providerSettingsManager: ProviderSettingsManager
	public readonly customModesManager: CustomModesManager

	constructor(
		readonly context: vscode.ExtensionContext,
		private readonly outputChannel: vscode.OutputChannel,
		private readonly renderContext: "sidebar" | "editor" = "sidebar",
		public readonly contextProxy: ContextProxy,
		mdmService?: MdmService,
	) {
		super()

		this.log("ClineProvider instantiated")
		ClineProvider.activeInstances.add(this)

		this.mdmService = mdmService
		this.updateGlobalState("codebaseIndexModels", EMBEDDING_MODEL_PROFILES)

		// Start configuration loading (which might trigger indexing) in the background.
		// Don't await, allowing activation to continue immediately.

		// Register this provider with the telemetry service to enable it to add
		// properties like mode and provider.
		TelemetryService.instance.setProvider(this)

		this._workspaceTracker = new WorkspaceTracker(this)

		this.providerSettingsManager = new ProviderSettingsManager(this.context)

		// Initialize CustomModesManager first, then update userId when VoidBridge is available
		this.customModesManager = new CustomModesManager(this.context, async () => {
			await this.postStateToWebview()
		})

		// Import VoidBridge and update userId after initialization
		import("../../api/void-bridge").then(({ VoidBridge }) => {
			const currentUserId = VoidBridge.getCurrentUserId()
			if (currentUserId && this.customModesManager) {
				this.customModesManager.setUserId(currentUserId)
			}
			if (currentUserId && this.agentManager) {
				this.agentManager.setCurrentUserId(currentUserId)
			}
		})

		// Initialize MCP Hub through the singleton manager
		McpServerManager.getInstance(this.context, this)
			.then((hub) => {
				this.mcpHub = hub
				this.mcpHub.registerClient()
			})
			.catch((error) => {
				this.log(`Failed to initialize MCP Hub: ${error}`)
			})

		this.marketplaceManager = new MarketplaceManager(this.context, this.customModesManager)

		// Initialize Agent Manager
		this.agentManager = new AgentManager(this.context)

		this.taskCreationCallback = (instance: Task) => {
			this.emit(RooCodeEventName.TaskCreated, instance)

			// 🔥 智能体任务清理：保存最终状态并从栈中移除
			const cleanupAgentTask = async (taskId: string, reason: string) => {
				const isAgentTask = !!(instance.agentTaskContext || (instance as any).isAgentTask)
				if (!isAgentTask) {
					return
				}

				// 查找该任务所在的栈
				const rootTaskId = instance.rootTask?.taskId || instance.taskId
				const stack = this.agentTaskPool.get(rootTaskId)

				this.outputChannel.appendLine(
					`[ClineProvider] cleanupAgentTask called: taskId=${taskId}, rootTaskId=${rootTaskId}, reason=${reason}, stackExists=${!!stack}, stackLength=${stack?.length || 0}`,
				)

				// 🔥 即使栈不存在或已清空，也要保存历史消息
				// Save final messages to TaskHistory
				this.outputChannel.appendLine(
					`[cleanupAgentTask] instance.clineMessages.length: ${instance.clineMessages.length}`,
				)
				this.outputChannel.appendLine(
					`[cleanupAgentTask] instance.historyItem exists: ${!!instance.historyItem}`,
				)
				if (instance.historyItem) {
					this.outputChannel.appendLine(
						`[cleanupAgentTask] instance.historyItem.clineMessages: ${instance.historyItem.clineMessages?.length || 0}`,
					)
					const historyItemWithMessages = {
						...instance.historyItem,
						clineMessages: instance.clineMessages,
					}
					this.outputChannel.appendLine(
						`[cleanupAgentTask] historyItemWithMessages.clineMessages: ${historyItemWithMessages.clineMessages.length}`,
					)
					await this.updateTaskHistory(historyItemWithMessages)
					this.outputChannel.appendLine(
						`[ClineProvider] Saved ${instance.clineMessages.length} messages for task ${taskId}`,
					)
				} else {
					this.outputChannel.appendLine(
						`[ClineProvider] ⚠️ No messages to save: historyItem=${!!instance.historyItem}, messages=${instance.clineMessages.length}`,
					)
				}

				if (!stack) {
					this.outputChannel.appendLine(
						`[ClineProvider] Stack already cleaned for task ${taskId}, skipping stack removal`,
					)
					return
				}

				// 🔥 从栈中移除该任务（可能不在栈顶，因为可能是异常退出）
				const taskIndex = stack.findIndex((t) => t.taskId === taskId)
				if (taskIndex !== -1) {
					stack.splice(taskIndex, 1)
					this.outputChannel.appendLine(
						`[ClineProvider] Removed task from stack [${rootTaskId}]: ${taskId} at index ${taskIndex} (reason: ${reason}, remaining: ${stack.length})`,
					)
				}

				// 🔥 如果栈为空，删除整个栈
				if (stack.length === 0) {
					this.agentTaskPool.delete(rootTaskId)
					this.outputChannel.appendLine(
						`[ClineProvider] Stack empty, removed from pool: ${rootTaskId} (reason: ${reason})`,
					)
				}

				// Clear viewing state if viewing this task
				if (this.viewingAgentTaskId === taskId) {
					this.viewingAgentTaskId = null
				}
			}

			// Create named listener functions so we can remove them later.
			const onTaskStarted = () => this.emit(RooCodeEventName.TaskStarted, instance.taskId)
			const onTaskCompleted = async (taskId: string, tokenUsage: any, toolUsage: any) => {
				this.log(`[taskCreationCallback] 🎯 onTaskCompleted fired for task ${taskId}, isAgentTask=${(instance as any).isAgentTask}`)
				await cleanupAgentTask(taskId, "TaskCompleted")
				this.emit(RooCodeEventName.TaskCompleted, taskId, tokenUsage, toolUsage)
			}
			const onTaskAborted = async () => {
				this.log(`[taskCreationCallback] 🛑 onTaskAborted fired for task ${instance.taskId}, isAgentTask=${(instance as any).isAgentTask}`)
				await cleanupAgentTask(instance.taskId, "TaskAborted")
				this.emit(RooCodeEventName.TaskAborted, instance.taskId)
			}
			const onTaskFocused = () => this.emit(RooCodeEventName.TaskFocused, instance.taskId)
			const onTaskUnfocused = () => this.emit(RooCodeEventName.TaskUnfocused, instance.taskId)
			const onTaskActive = (taskId: string) => this.emit(RooCodeEventName.TaskActive, taskId)
			const onTaskIdle = (taskId: string) => this.emit(RooCodeEventName.TaskIdle, taskId)

			// Attach the listeners.
			this.log(`[taskCreationCallback] 🔗 Attaching event listeners for task ${instance.taskId}, isAgentTask=${(instance as any).isAgentTask}`)
			instance.on(RooCodeEventName.TaskStarted, onTaskStarted)
			instance.on(RooCodeEventName.TaskCompleted, onTaskCompleted)
			instance.on(RooCodeEventName.TaskAborted, onTaskAborted)
			instance.on(RooCodeEventName.TaskFocused, onTaskFocused)
			instance.on(RooCodeEventName.TaskUnfocused, onTaskUnfocused)
			instance.on(RooCodeEventName.TaskActive, onTaskActive)
			instance.on(RooCodeEventName.TaskIdle, onTaskIdle)
			this.log(`[taskCreationCallback] ✅ Event listeners attached successfully`)

			// Store the cleanup functions for later removal.
			this.taskEventListeners.set(instance, [
				() => instance.off(RooCodeEventName.TaskStarted, onTaskStarted),
				() => instance.off(RooCodeEventName.TaskCompleted, onTaskCompleted),
				() => instance.off(RooCodeEventName.TaskAborted, onTaskAborted),
				() => instance.off(RooCodeEventName.TaskFocused, onTaskFocused),
				() => instance.off(RooCodeEventName.TaskUnfocused, onTaskUnfocused),
				() => instance.off(RooCodeEventName.TaskActive, onTaskActive),
				() => instance.off(RooCodeEventName.TaskIdle, onTaskIdle),
			])
		}

		// Initialize Roo Code Cloud profile sync.
		this.initializeCloudProfileSync().catch((error) => {
			this.log(`Failed to initialize cloud profile sync: ${error}`)
		})
	}

	/**
	 * Override EventEmitter's on method to match TaskProviderLike interface
	 */
	override on<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this {
		return super.on(event, listener as any)
	}

	/**
	 * Override EventEmitter's off method to match TaskProviderLike interface
	 */
	override off<K extends keyof TaskProviderEvents>(
		event: K,
		listener: (...args: TaskProviderEvents[K]) => void | Promise<void>,
	): this {
		return super.off(event, listener as any)
	}

	/**
	 * Initialize cloud profile synchronization
	 */
	private async initializeCloudProfileSync() {
		try {
			// Check if authenticated and sync profiles
			if (CloudService.hasInstance() && CloudService.instance.isAuthenticated()) {
				await this.syncCloudProfiles()
			}

			// Set up listener for future updates
			if (CloudService.hasInstance()) {
				CloudService.instance.on("settings-updated", this.handleCloudSettingsUpdate)
			}
		} catch (error) {
			this.log(`Error in initializeCloudProfileSync: ${error}`)
		}
	}

	/**
	 * Handle cloud settings updates
	 */
	private handleCloudSettingsUpdate = async () => {
		try {
			await this.syncCloudProfiles()
		} catch (error) {
			this.log(`Error handling cloud settings update: ${error}`)
		}
	}

	/**
	 * Synchronize cloud profiles with local profiles
	 */
	private async syncCloudProfiles() {
		try {
			const settings = CloudService.instance.getOrganizationSettings()
			if (!settings?.providerProfiles) {
				return
			}

			const currentApiConfigName = this.getGlobalState("currentApiConfigName")
			const result = await this.providerSettingsManager.syncCloudProfiles(
				settings.providerProfiles,
				currentApiConfigName,
			)

			if (result.hasChanges) {
				// Update list
				await this.updateGlobalState("listApiConfigMeta", await this.providerSettingsManager.listConfig())

				if (result.activeProfileChanged && result.activeProfileId) {
					// Reload full settings for new active profile
					const profile = await this.providerSettingsManager.getProfile({
						id: result.activeProfileId,
					})
					await this.activateProviderProfile({ name: profile.name })
				}

				await this.postStateToWebview()
			}
		} catch (error) {
			this.log(`Error syncing cloud profiles: ${error}`)
		}
	}

	// Adds a new Task instance to clineStack, marking the start of a new task.
	// The instance is pushed to the top of the stack (LIFO order).
	// When the task is completed, the top instance is removed, reactivating the previous task.
	async addClineToStack(task: Task) {
		// 🔥 智能体任务：添加到独立任务池（每个根任务一个栈，支持并行执行和子任务嵌套）
		if (task.agentTaskContext) {
			// 🔥 调试：记录任务层级信息
			this.outputChannel.appendLine(
				`[addClineToStack] 🔍 Task: ${task.taskId}, hasParent: ${!!task.parentTask}, parentId: ${task.parentTask?.taskId}, hasRoot: ${!!task.rootTask}, rootId: ${task.rootTask?.taskId}`,
			)

			// 获取根任务ID（如果是子任务则使用父任务的根ID，否则使用自己的ID）
			const rootTaskId = task.rootTask?.taskId || task.taskId

			// 获取或创建该根任务的栈
			let stack = this.agentTaskPool.get(rootTaskId)
			if (!stack) {
				stack = []
				this.agentTaskPool.set(rootTaskId, stack)
				this.outputChannel.appendLine(`[ClineProvider] Created new stack for root task: ${rootTaskId}`)

				// 🔥 如果是根任务（没有 parentTask），设置 rootTask 为自己
				if (!task.parentTask && !task.rootTask) {
					;(task as any).rootTask = task
					this.outputChannel.appendLine(`[ClineProvider] Set rootTask for root task: ${task.taskId}`)
				}
			}

			// 将任务推入栈（LIFO）
			stack.push(task)
			this.outputChannel.appendLine(
				`[ClineProvider] Pushed task to stack [${rootTaskId}]: ${task.taskId} (depth: ${stack.length})`,
			)

			task.emit(RooCodeEventName.TaskFocused)

			// Start task asynchronously, non-blocking
			this.performPreparationTasks(task).catch((err) => {
				this.log(`Agent task ${task.taskId} preparation failed: ${err}`)
			})
			return // Don't add to user task stack
		}

		// User task: maintain original stack logic
		this.viewingAgentTaskId = null // Switch to user task, clear viewing state
		this.clineStack.push(task)
		task.emit(RooCodeEventName.TaskFocused)

		// Perform special setup provider specific tasks.
		await this.performPreparationTasks(task)

		// Ensure getState() resolves correctly.
		const state = await this.getState()

		if (!state || typeof state.mode !== "string") {
			throw new Error(t("common:errors.retrieve_current_mode"))
		}
	}

	async performPreparationTasks(cline: Task) {
		// LMStudio: We need to force model loading in order to read its context
		// size; we do it now since we're starting a task with that model selected.
		if (cline.apiConfiguration && cline.apiConfiguration.apiProvider === "lmstudio") {
			try {
				if (!hasLoadedFullDetails(cline.apiConfiguration.lmStudioModelId!)) {
					await forceFullModelDetailsLoad(
						cline.apiConfiguration.lmStudioBaseUrl ?? "http://localhost:1234",
						cline.apiConfiguration.lmStudioModelId!,
					)
				}
			} catch (error) {
				this.log(`Failed to load full model details for LM Studio: ${error}`)
				vscode.window.showErrorMessage(error.message)
			}
		}
	}

	// Removes and destroys the top Cline instance (the current finished task),
	// activating the previous one (resuming the parent task).
	async removeClineFromStack() {
		// 🔥 如果正在查看智能体任务,清除查看状态
		if (this.viewingAgentTaskId) {
			this.viewingAgentTaskId = null
		}

		if (this.clineStack.length === 0) {
			return
		}

		// Pop the top Cline instance from the stack.
		let task = this.clineStack.pop()
		this.log(
			`[removeClineFromStack] Removed task: ${task?.taskId}, remaining stack size: ${this.clineStack.length}`,
		)

		if (task) {
			// 🔥 优化：先立即处理同步部分（清除状态、移除监听器），然后异步处理耗时的 abort 操作
			// 这样可以避免 826ms 的阻塞，提升 UI 响应速度

			// 立即触发 TaskUnfocused 事件
			task.emit(RooCodeEventName.TaskUnfocused)

			// 立即移除事件监听器
			const cleanupFunctions = this.taskEventListeners.get(task)
			if (cleanupFunctions) {
				cleanupFunctions.forEach((cleanup) => cleanup())
				this.taskEventListeners.delete(task)
			}

			// 🔥 异步处理耗时的 abort 操作（不阻塞 UI）
			const taskToAbort = task
			setImmediate(() => {
				const abortStart = Date.now()
				taskToAbort
					.abortTask(true)
					.then(() => {
						this.log(
							`[removeClineFromStack] Async abort completed for task ${taskToAbort.taskId} in ${Date.now() - abortStart}ms`,
						)
					})
					.catch((e) => {
						this.log(
							`[subtasks] encountered error while aborting task ${taskToAbort.taskId}.${taskToAbort.instanceId}: ${e.message}`,
						)
					})
			})

			// 清除引用（任务会在 promises 结束后被垃圾回收）
			task = undefined
		}
	}

	// returns the current cline object in the stack (the top one)
	// if the stack is empty, returns undefined
	// 🔥 获取当前正在执行的用户任务（不包括智能体任务）
	getCurrentUserTask(): Task | undefined {
		if (this.clineStack.length === 0) {
			return undefined
		}
		return this.clineStack[this.clineStack.length - 1]
	}

	// 🔥 查找智能体任务（在所有栈中搜索）
	private findAgentTask(taskId: string): Task | undefined {
		for (const stack of this.agentTaskPool.values()) {
			const task = stack.find((t) => t.taskId === taskId)
			if (task) {
				return task
			}
		}
		return undefined
	}

	// 🔥 获取当前查看的任务（可能是用户任务或智能体任务）
	getCurrentCline(): Task | undefined {
		// If user is viewing an agent task, search in all stacks
		if (this.viewingAgentTaskId) {
			return this.findAgentTask(this.viewingAgentTaskId)
		}

		// Otherwise return top of user task stack
		return this.getCurrentUserTask()
	}

	// returns the current clineStack length (how many cline objects are in the stack)
	getClineStackSize(): number {
		return this.clineStack.length
	}

	public getCurrentTaskStack(): string[] {
		return this.clineStack.map((cline) => cline.taskId)
	}

	// remove the current task/cline instance (at the top of the stack), so this task is finished
	// and resume the previous task/cline instance (if it exists)
	// this is used when a sub task is finished and the parent task needs to be resumed
	async finishSubTask(lastMessage: string, task?: Task) {
		// 🔥 如果提供了task或者当前是智能体任务，使用新的智能体子任务完成逻辑
		const targetTask = task || this.getCurrentCline()
		if (targetTask?.agentTaskContext) {
			await this.finishAgentSubTask(lastMessage, targetTask)
			return
		}

		// 🔥 用户任务：保持原有逻辑
		// remove the last cline instance from the stack (this is the finished sub task)
		await this.removeClineFromStack()
		// resume the last cline instance in the stack (if it exists - this is the 'parent' calling task)
		await this.getCurrentUserTask()?.resumePausedTask(lastMessage)
	}

	// 🔥 智能体任务：完成子任务并恢复父任务（LIFO栈弹出）
	async finishAgentSubTask(lastMessage: string, task: Task) {
		this.outputChannel.appendLine(
			`[finishAgentSubTask] 🎯 Called for task ${task.taskId}, lastMessage: ${lastMessage.substring(0, 100)}...`,
		)

		// 获取根任务ID
		const rootTaskId = task.rootTask?.taskId || task.taskId
		this.outputChannel.appendLine(`[finishAgentSubTask] Root task ID: ${rootTaskId}`)

		const stack = this.agentTaskPool.get(rootTaskId)

		if (!stack || stack.length === 0) {
			this.outputChannel.appendLine(
				`[finishAgentSubTask] ❌ No stack found for root task ${rootTaskId}, stack exists: ${!!stack}, stack length: ${stack?.length}`,
			)
			return
		}

		this.outputChannel.appendLine(
			`[finishAgentSubTask] Found stack for root ${rootTaskId}, current depth: ${stack.length}`,
		)

		// 从栈顶弹出已完成的子任务
		const completedTask = stack.pop()
		this.outputChannel.appendLine(
			`[finishAgentSubTask] 🔥 Popped completed task from stack [${rootTaskId}]: ${completedTask?.taskId} (remaining depth: ${stack.length})`,
		)
		this.outputChannel.appendLine(
			`[finishAgentSubTask] ✅ Completed task shouldEndLoop: ${completedTask?.shouldEndLoop}`,
		)

		// 🔥 如果栈为空，说明根任务也完成了
		// 注意：不在这里删除栈，让 cleanupAgentTask 来保存历史消息并清理
		if (stack.length === 0) {
			this.outputChannel.appendLine(
				`[finishAgentSubTask] Root task finished, stack will be cleaned by TaskCompleted event: ${rootTaskId}`,
			)
			return
		}

		// 获取父任务（栈顶元素）
		const parentTask = stack[stack.length - 1]
		this.outputChannel.appendLine(
			`[finishAgentSubTask] Parent task found: ${parentTask?.taskId}, isPaused: ${parentTask?.isPaused}`,
		)

		if (parentTask) {
			this.outputChannel.appendLine(
				`[finishAgentSubTask] 🚀 Calling resumePausedTask on parent ${parentTask.taskId}...`,
			)
			// 🔥 恢复父任务执行，传递子任务结果
			await parentTask.resumePausedTask(lastMessage)
			this.outputChannel.appendLine(`[finishAgentSubTask] ✅ resumePausedTask completed for ${parentTask.taskId}`)
		}
	}

	// Clear the current task without treating it as a subtask
	// This is used when the user cancels a task that is not a subtask
	async clearTask() {
		// 🔥 如果正在查看智能体任务，只清除查看状态
		if (this.viewingAgentTaskId) {
			this.viewingAgentTaskId = null
			await this.postStateToWebview()
			return
		}

		// 用户任务：保持原有逻辑
		await this.removeClineFromStack()
	}

	/*
	VSCode extensions use the disposable pattern to clean up resources when the sidebar/editor tab is closed by the user or system. This applies to event listening, commands, interacting with the UI, etc.
	- https://vscode-docs.readthedocs.io/en/stable/extensions/patterns-and-principles/
	- https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts
	*/
	private clearWebviewResources() {
		while (this.webviewDisposables.length) {
			const x = this.webviewDisposables.pop()
			if (x) {
				x.dispose()
			}
		}
	}

	async dispose() {
		this.log("Disposing ClineProvider...")

		// Clear all tasks from the stack.
		while (this.clineStack.length > 0) {
			await this.removeClineFromStack()
		}

		this.log("Cleared all tasks")

		if (this.view && "dispose" in this.view) {
			this.view.dispose()
			this.log("Disposed webview")
		}

		this.clearWebviewResources()

		// Clean up cloud service event listener
		if (CloudService.hasInstance()) {
			CloudService.instance.off("settings-updated", this.handleCloudSettingsUpdate)
		}

		while (this.disposables.length) {
			const x = this.disposables.pop()

			if (x) {
				x.dispose()
			}
		}

		this._workspaceTracker?.dispose()
		this._workspaceTracker = undefined
		await this.mcpHub?.unregisterClient()
		this.mcpHub = undefined
		this.marketplaceManager?.cleanup()
		this.customModesManager?.dispose()
		this.log("Disposed all disposables")
		ClineProvider.activeInstances.delete(this)

		// Clean up any event listeners attached to this provider
		this.removeAllListeners()

		McpServerManager.unregisterProvider(this)
	}

	public static getVisibleInstance(): ClineProvider | undefined {
		return findLast(Array.from(this.activeInstances), (instance) => instance.view?.visible === true)
	}

	public static async getInstance(): Promise<ClineProvider | undefined> {
		let visibleProvider = ClineProvider.getVisibleInstance()

		// If no visible provider, try to show the sidebar view
		if (!visibleProvider) {
			await vscode.commands.executeCommand(`${Package.name}.SidebarProvider.focus`)
			// Wait briefly for the view to become visible
			await delay(100)
			visibleProvider = ClineProvider.getVisibleInstance()
		}

		// If still no visible provider, return
		if (!visibleProvider) {
			return
		}

		return visibleProvider
	}

	public static async isActiveTask(): Promise<boolean> {
		const visibleProvider = await ClineProvider.getInstance()

		if (!visibleProvider) {
			return false
		}

		// 🔥 检查用户是否有活动任务（不考虑智能体任务）
		if (visibleProvider.getCurrentUserTask()) {
			return true
		}

		return false
	}

	public static async handleCodeAction(
		command: CodeActionId,
		promptType: CodeActionName,
		params: Record<string, string | any[]>,
	): Promise<void> {
		// Capture telemetry for code action usage
		TelemetryService.instance.captureCodeActionUsed(promptType)

		const visibleProvider = await ClineProvider.getInstance()

		if (!visibleProvider) {
			return
		}

		const { customSupportPrompts } = await visibleProvider.getState()

		// TODO: Improve type safety for promptType.
		const prompt = supportPrompt.create(promptType, params, customSupportPrompts)

		if (command === "addToContext") {
			await visibleProvider.postMessageToWebview({ type: "invoke", invoke: "setChatBoxMessage", text: prompt })
			return
		}

		await visibleProvider.initClineWithTask(prompt)
	}

	public static async handleTerminalAction(
		command: TerminalActionId,
		promptType: TerminalActionPromptType,
		params: Record<string, string | any[]>,
	): Promise<void> {
		TelemetryService.instance.captureCodeActionUsed(promptType)

		const visibleProvider = await ClineProvider.getInstance()

		if (!visibleProvider) {
			return
		}

		const { customSupportPrompts } = await visibleProvider.getState()
		const prompt = supportPrompt.create(promptType, params, customSupportPrompts)

		if (command === "terminalAddToContext") {
			await visibleProvider.postMessageToWebview({ type: "invoke", invoke: "setChatBoxMessage", text: prompt })
			return
		}

		try {
			await visibleProvider.initClineWithTask(prompt)
		} catch (error) {
			if (error instanceof OrganizationAllowListViolationError) {
				// Errors from terminal commands seem to get swallowed / ignored.
				vscode.window.showErrorMessage(error.message)
			}

			throw error
		}
	}

	async resolveWebviewView(webviewView: vscode.WebviewView | vscode.WebviewPanel) {
		this.log("Resolving webview view")

		this.view = webviewView

		// Set panel reference according to webview type
		const inTabMode = "onDidChangeViewState" in webviewView
		if (inTabMode) {
			// Tag page type
			setPanel(webviewView, "tab")
		} else if ("onDidChangeVisibility" in webviewView) {
			// Sidebar Type
			setPanel(webviewView, "sidebar")
		}

		// Initialize out-of-scope variables that need to receive persistent global state values
		this.getState().then(
			({
				terminalShellIntegrationTimeout = Terminal.defaultShellIntegrationTimeout,
				terminalShellIntegrationDisabled = false,
				terminalCommandDelay = 0,
				terminalZshClearEolMark = true,
				terminalZshOhMy = false,
				terminalZshP10k = false,
				terminalPowershellCounter = false,
				terminalZdotdir = false,
			}) => {
				Terminal.setShellIntegrationTimeout(terminalShellIntegrationTimeout)
				Terminal.setShellIntegrationDisabled(terminalShellIntegrationDisabled)
				Terminal.setCommandDelay(terminalCommandDelay)
				Terminal.setTerminalZshClearEolMark(terminalZshClearEolMark)
				Terminal.setTerminalZshOhMy(terminalZshOhMy)
				Terminal.setTerminalZshP10k(terminalZshP10k)
				Terminal.setPowershellCounter(terminalPowershellCounter)
				Terminal.setTerminalZdotdir(terminalZdotdir)
			},
		)

		// Initialize tts enabled state
		this.getState().then(({ ttsEnabled }) => {
			setTtsEnabled(ttsEnabled ?? false)
		})

		// Initialize tts speed state
		this.getState().then(({ ttsSpeed }) => {
			setTtsSpeed(ttsSpeed ?? 1)
		})

		webviewView.webview.options = {
			// Allow scripts in the webview
			enableScripts: true,
			localResourceRoots: [this.contextProxy.extensionUri],
		}

		// Temporarily force production mode to bypass HMR
		webviewView.webview.html = this.getHtmlContent(webviewView.webview)
		// webviewView.webview.html =
		// 	this.contextProxy.extensionMode === vscode.ExtensionMode.Development
		// 		? await this.getHMRHtmlContent(webviewView.webview)
		// 		: this.getHtmlContent(webviewView.webview)

		// Sets up an event listener to listen for messages passed from the webview view context
		// and executes code based on the message that is received
		this.setWebviewMessageListener(webviewView.webview)

		// Initialize code index status subscription for the current workspace
		this.updateCodeIndexStatusSubscription()

		// Listen for active editor changes to update code index status for the current workspace
		const activeEditorSubscription = vscode.window.onDidChangeActiveTextEditor(() => {
			// Update subscription when workspace might have changed
			this.updateCodeIndexStatusSubscription()
		})
		this.webviewDisposables.push(activeEditorSubscription)

		// Listen for when the panel becomes visible
		// https://github.com/microsoft/vscode-discussions/discussions/840
		if ("onDidChangeViewState" in webviewView) {
			// WebviewView and WebviewPanel have all the same properties except for this visibility listener
			// panel
			const viewStateDisposable = webviewView.onDidChangeViewState(() => {
				if (this.view?.visible) {
					this.postMessageToWebview({ type: "action", action: "didBecomeVisible" })
				}
			})
			this.webviewDisposables.push(viewStateDisposable)
		} else if ("onDidChangeVisibility" in webviewView) {
			// sidebar
			const visibilityDisposable = webviewView.onDidChangeVisibility(() => {
				if (this.view?.visible) {
					this.postMessageToWebview({ type: "action", action: "didBecomeVisible" })
				}
			})
			this.webviewDisposables.push(visibilityDisposable)
		}

		// Listen for when the view is disposed
		// This happens when the user closes the view or when the view is closed programmatically
		webviewView.onDidDispose(
			async () => {
				if (inTabMode) {
					this.log("Disposing ClineProvider instance for tab view")
					await this.dispose()
				} else {
					this.log("Clearing webview resources for sidebar view")
					this.clearWebviewResources()
					// Reset current workspace manager reference when view is disposed
					this.currentWorkspaceManager = undefined
				}
			},
			null,
			this.disposables,
		)

		// Listen for when color changes
		const configDisposable = vscode.workspace.onDidChangeConfiguration(async (e) => {
			if (e && e.affectsConfiguration("workbench.colorTheme")) {
				// Sends latest theme name to webview
				await this.postMessageToWebview({ type: "theme", text: JSON.stringify(await getTheme()) })
			}
		})
		this.webviewDisposables.push(configDisposable)

		// If the extension is starting a new session, clear previous task state.
		await this.removeClineFromStack()

		this.log("Webview view resolved")
	}

	public async initClineWithSubTask(parent: Task, task?: string, images?: string[]) {
		return this.initClineWithTask(task, images, parent)
	}

	// When initializing a new task, (not from history but from a tool command
	// new_task) there is no need to remove the previous task since the new
	// task is a subtask of the previous one, and when it finishes it is removed
	// from the stack and the caller is resumed in this way we can have a chain
	// of tasks, each one being a sub task of the previous one until the main
	// task is finished.
	public async initClineWithTask(
		text?: string,
		images?: string[],
		parentTask?: Task,
		options: Partial<
			Pick<
				TaskOptions,
				| "enableDiff"
				| "enableCheckpoints"
				| "fuzzyMatchThreshold"
				| "consecutiveMistakeLimit"
				| "experiments"
				| "agentTaskContext"
				| "startTask"
				| "isAgentTask"
				| "agentTaskId"
			>
		> = {},
	) {
		// Clear viewing state when creating a new user task
		// This ensures UI shows the new task, not the viewed agent task
		if (!options.agentTaskContext && this.viewingAgentTaskId) {
			this.viewingAgentTaskId = null
		}

		const {
			apiConfiguration,
			organizationAllowList,
			diffEnabled: enableDiff,
			enableCheckpoints,
			fuzzyMatchThreshold,
			experiments,
			cloudUserInfo,
			remoteControlEnabled,
		} = await this.getState()

		if (!ProfileValidator.isProfileAllowed(apiConfiguration, organizationAllowList)) {
			throw new OrganizationAllowListViolationError(t("common:errors.violated_organization_allowlist"))
		}

		// Note: Zero-width parameter parsing is now handled in Task constructor
		// to properly support senderTerminal routing logic

		// 🔥 智能体任务：rootTask 应该从父任务继承，或者是自己（如果是根任务）
		// 用户任务：rootTask 是 clineStack 的第一个任务
		let rootTask: Task | undefined
		if (options.agentTaskContext && parentTask) {
			// 智能体子任务：从父任务继承 rootTask
			rootTask = parentTask.rootTask || parentTask
		} else if (options.agentTaskContext && !parentTask) {
			// 智能体根任务：自己就是 rootTask（稍后在 addClineToStack 中设置）
			rootTask = undefined
		} else {
			// 用户任务：使用 clineStack[0]
			rootTask = this.clineStack.length > 0 ? this.clineStack[0] : undefined
		}

		const task = new Task({
			provider: this,
			apiConfiguration,
			enableDiff,
			enableCheckpoints,
			fuzzyMatchThreshold,
			consecutiveMistakeLimit: apiConfiguration.consecutiveMistakeLimit,
			task: text,
			images,
			experiments,
			rootTask,
			parentTask,
			taskNumber: this.clineStack.length + 1,
			onCreated: this.taskCreationCallback,
			enableTaskBridge: isRemoteControlEnabled(cloudUserInfo, remoteControlEnabled),
			...options,
		})

		await this.addClineToStack(task)

		this.log(
			`[subtasks] ${task.parentTask ? "child" : "parent"} task ${task.taskId}.${task.instanceId} instantiated`,
		)

		return task
	}

	public async initClineWithHistoryItem(
		historyItem: HistoryItem & { rootTask?: Task; parentTask?: Task },
		options?: { asyncConfigRestore?: boolean }
	) {
		await this.removeClineFromStack()

		// 🔥 优化：异步恢复配置，不阻塞 UI
		// 默认异步恢复（快速打开界面），用户继续执行时配置已准备好
		const asyncRestore = options?.asyncConfigRestore !== false

		// 定义配置恢复逻辑
		const restoreConfig = async () => {
			if (historyItem.mode) {
				// Validate that the mode still exists
				const customModes = await this.customModesManager.getCustomModes()
				const modeExists = getModeBySlug(historyItem.mode, customModes) !== undefined

				if (!modeExists) {
					// Mode no longer exists, fall back to default mode
					historyItem.mode = defaultModeSlug
				}

				// 🔥 优化：先并行获取配置信息，减少串行等待
				const [savedConfigId, listApiConfig] = await Promise.all([
					this.providerSettingsManager.getModeConfigId(historyItem.mode),
					this.providerSettingsManager.listConfig(),
				])

				// Update mode
				await this.updateGlobalState("mode", historyItem.mode)

				// Update listApiConfigMeta
				await this.updateGlobalState("listApiConfigMeta", listApiConfig)

				// If this mode has a saved config, use it
				if (savedConfigId) {
					const profile = listApiConfig.find(({ id }) => id === savedConfigId)

					if (profile?.name) {
						try {
							// 🔥 跳过状态更新，避免在任务初始化过程中发送错误的状态
							await this.activateProviderProfile({ name: profile.name }, true)
						} catch (error) {
							// Silently continue with default configuration
						}
					}
				}
			}
		}

		// 🔥 异步或同步恢复配置
		if (asyncRestore) {
			// 异步恢复，不阻塞任务初始化
			setImmediate(() => {
				restoreConfig().then(() => {
					// 配置恢复后，静默更新状态（不阻塞）
					this.postStateToWebview().catch(err => {
						console.error('[initClineWithHistoryItem] Failed to update state after config restore:', err)
					})
				}).catch(error => {
					console.error('[initClineWithHistoryItem] Async config restoration failed:', error)
				})
			})
		} else {
			// 同步恢复（用于需要立即使用正确配置的场景）
			await restoreConfig()
		}

		const {
			apiConfiguration,
			diffEnabled: enableDiff,
			enableCheckpoints,
			fuzzyMatchThreshold,
			experiments,
			cloudUserInfo,
			remoteControlEnabled,
		} = await this.getState()

		// Determine if TaskBridge should be enabled
		const enableTaskBridge = isRemoteControlEnabled(cloudUserInfo, remoteControlEnabled)

		// Note: Don't restore agentTaskContext when loading from history
		// Agent tasks loaded from history are for viewing only, not for active execution
		// The agentTaskContext is only needed for actively running agent tasks
		let agentTaskContext: AgentTaskContext | undefined = undefined

		const task = new Task({
			provider: this,
			apiConfiguration,
			enableDiff,
			enableCheckpoints,
			fuzzyMatchThreshold,
			consecutiveMistakeLimit: apiConfiguration.consecutiveMistakeLimit,
			historyItem,
			experiments,
			rootTask: historyItem.rootTask,
			parentTask: historyItem.parentTask,
			taskNumber: historyItem.number,
			onCreated: this.taskCreationCallback,
			enableTaskBridge,
			agentTaskContext,
		})

		await this.addClineToStack(task)

		return task
	}

	public async postMessageToWebview(message: ExtensionMessage, sourceTaskId?: string) {
		// 🔥 方案1：黑名单模式 - 只拦截明确的任务相关消息
		// 定义任务相关的消息类型（这些消息需要检查是否是智能体任务并转发到 IM）
		// messageUpdated: 任务消息更新（包括 ask、say 等）
		// invoke: LLM 调用
		// completion: 任务完成
		// thinking: 思考过程
		const taskRelatedTypes = ["messageUpdated", "invoke", "completion", "thinking"]

		// 🔥 非任务消息：直接发送到 webview（包括 state、theme、action、openAiModels 等所有全局消息）
		if (!taskRelatedTypes.includes(message.type)) {
			await this.view?.webview.postMessage(message)
			return
		}

		// 🔥 任务相关消息：需要检查是否是智能体任务
		const taskId = sourceTaskId || this.getCurrentCline()?.taskId
		if (!taskId) {
			// 没有任务时，任务消息也直接发送（保持原有行为）
			await this.view?.webview.postMessage(message)
			return
		}

		// 🔥 查找任务（可能在用户栈或智能体池）
		const task = this.findAgentTask(taskId) || this.clineStack.find((t) => t.taskId === taskId)
		if (!task) {
			// 任务不存在，直接发送
			await this.view?.webview.postMessage(message)
			return
		}

		// 🔥 智能体任务：只转发 IM，不发送到 webview（除非用户正在查看）
		if (task.agentTaskContext && this.viewingAgentTaskId !== taskId) {
			this.forwardToIMWebSocket(task, message)
			return // 静默执行，不干扰用户 UI
		}

		// 🔥 用户任务 或 用户正在查看的智能体任务：发送到 webview
		await this.view?.webview.postMessage(message)
	}

	/**
	 * 🔥 转发消息到 IM WebSocket
	 */
	private forwardToIMWebSocket(task: any, message: ExtensionMessage) {
		const ctx = task.agentTaskContext
		if (!ctx) {
			this.log(`[forwardToIMWebSocket] ❌ No agentTaskContext`)
			return
		}

		const llmService = (global as any).llmStreamService
		if (!llmService) {
			this.log(`[forwardToIMWebSocket] ❌ LLM service not available`)
			return
		}

		// 映射 ExtensionMessage → IM WebSocket
		// 🔥 messageUpdated 类型的消息也包含 clineMessage
		if (message.type === "messageUpdated" && message.clineMessage) {
			const clineMsg = message.clineMessage

			// 🔥 调试日志：记录所有收到的消息类型
			const msgType = clineMsg.type === "say" ? clineMsg.say : clineMsg.ask
			this.log(
				`[forwardToIMWebSocket] 📨 Received: type=${clineMsg.type}, msgType=${msgType}, partial=${clineMsg.partial}, text=${clineMsg.text?.substring(0, 50)}...`,
			)

			// 🔥 支持流式传输：partial=true 表示流式中间状态，partial=false 表示完成
			const isPartial = clineMsg.partial === true

			// 生成消息唯一ID（用于追踪发送位置）
			const msgKey = `${task.taskId}_${clineMsg.ts}`

			if (clineMsg.type === "ask" && (clineMsg.ask === "tool" || clineMsg.ask === "command")) {
				// tool_use - 全量发送
				if (!isPartial) {
					this.log(`[forwardToIMWebSocket] Sending tool_use message`)
				}

				// 🔥 调试日志
				this.log(
					`[forwardToIMWebSocket] DEBUG tool clineMsg:`,
					JSON.stringify({
						text: clineMsg.text,
						metadata: clineMsg.metadata,
					}),
				)

				// 🔥 解析工具信息（从 clineMsg.text 中提取工具名称和参数）
				let toolName = "unknown"
				let toolInput: any = null
				let toolStatus = isPartial ? "running" : "completed"

				// 🔥 根据 ask 类型推断工具名称
				if (clineMsg.ask === "command") {
					toolName = "execute_command"
					// 对于 command 类型，text 就是命令本身或完整描述
					if (clineMsg.text) {
						// 尝试提取命令参数
						const cmdMatch = clineMsg.text.match(/\[execute_command for '(.+?)'\]/)
						if (cmdMatch) {
							toolInput = { command: cmdMatch[1] }
						} else {
							// partial 消息，text 就是命令本身
							toolInput = { command: clineMsg.text }
						}
					}
				} else if (clineMsg.text) {
					// 对于其他类型，尝试从 text 中提取工具名称，格式如 "[tool_name for ...]"
					const toolMatch = clineMsg.text.match(/\[(\w+)/)
					this.log(`[forwardToIMWebSocket] Tool match result:`, toolMatch)
					if (toolMatch) {
						toolName = toolMatch[1]
						this.log(`[forwardToIMWebSocket] Extracted tool name:`, toolName)
					}
				}

				// 🔥 从 metadata 中获取工具参数（如果有，优先级最高）
				if (clineMsg.metadata && (clineMsg.metadata as any).tool) {
					toolName = (clineMsg.metadata as any).tool
				}
				if (clineMsg.metadata && (clineMsg.metadata as any).params) {
					toolInput = (clineMsg.metadata as any).params
				}

				llmService.imConnection.sendLLMChunk(
					ctx.streamId,
					JSON.stringify({
						type: "tool_use",
						text: clineMsg.text,
						partial: isPartial,
						ts: clineMsg.ts,
						metadata: {
							...(clineMsg.metadata || {}), // 保留原有 metadata（包含 taskId）
							tool: toolName,
							status: toolStatus,
							input: toolInput,
						},
					}),
					ctx.imMetadata.recvId,
					ctx.imMetadata.targetTerminal,
					ctx.imMetadata.chatType,
					ctx.imMetadata.sendId,
					ctx.imMetadata.senderTerminal,
				)
			} else if (clineMsg.type === "say" && clineMsg.say === "text") {
				// thinking - 增量发送
				const fullText = clineMsg.text || ""
				const lastPos = this.lastSentPositions.get(msgKey) || 0

				// 只发送新增的部分
				if (fullText.length > lastPos) {
					const incrementalText = fullText.substring(lastPos)

					if (!isPartial) {
						this.log(
							`[forwardToIMWebSocket] Sending thinking increment: ${incrementalText.length} chars (total: ${fullText.length})`,
						)
					}

					llmService.imConnection.sendLLMChunk(
						ctx.streamId,
						JSON.stringify({
							type: "thinking",
							content: incrementalText, // 🔥 只发送增量部分
							partial: isPartial,
							ts: clineMsg.ts,
							metadata: clineMsg.metadata || {}, // 🔥 包含 taskId 等元数据
						}),
						ctx.imMetadata.recvId,
						ctx.imMetadata.targetTerminal,
						ctx.imMetadata.chatType,
						ctx.imMetadata.sendId,
						ctx.imMetadata.senderTerminal,
					)

					// 更新已发送位置
					this.lastSentPositions.set(msgKey, fullText.length)
				}

				// 消息完成后清理追踪
				if (!isPartial) {
					this.lastSentPositions.delete(msgKey)
				}
			} else if (clineMsg.type === "say" && clineMsg.say === "completion_result") {
				// completion - 增量发送
				const fullText = clineMsg.text || ""
				const lastPos = this.lastSentPositions.get(msgKey) || 0

				// this.log(
				// 	`[forwardToIMWebSocket] 🔍 completion_result: msgKey=${msgKey}, isPartial=${isPartial}, lastPos=${lastPos}, fullText.length=${fullText.length}`,
				// )

				// 只发送新增的部分
				if (fullText.length > lastPos) {
					const incrementalText = fullText.substring(lastPos)

					// this.log(
					// 	`[forwardToIMWebSocket] ✅ Sending completion increment: ${incrementalText.length} chars (total: ${fullText.length})`,
					// )

					llmService.imConnection.sendLLMChunk(
						ctx.streamId,
						JSON.stringify({
							type: "completion",
							content: incrementalText, // 🔥 只发送增量部分
							partial: isPartial,
							ts: clineMsg.ts,
							metadata: clineMsg.metadata || {}, // 🔥 包含 taskId 等元数据
						}),
						ctx.imMetadata.recvId,
						ctx.imMetadata.targetTerminal,
						ctx.imMetadata.chatType,
						ctx.imMetadata.sendId,
						ctx.imMetadata.senderTerminal,
					)

					// 更新已发送位置
					this.lastSentPositions.set(msgKey, fullText.length)
				}

				// 消息完成后清理追踪
				if (!isPartial) {
					this.lastSentPositions.delete(msgKey)
				}
			} else {
				// 🔥 其他所有类型的消息（reasoning, api_req_started, error等）都发送给客户端
				// 让客户端决定如何处理和显示

				// 判断是否有文本内容需要增量发送
				const hasTextContent = clineMsg.text && typeof clineMsg.text === "string"

				if (hasTextContent) {
					// 有文本内容的消息 - 增量发送
					const fullText = clineMsg.text || ""
					const lastPos = this.lastSentPositions.get(msgKey) || 0

					if (fullText.length > lastPos) {
						const incrementalText = fullText.substring(lastPos)

						if (!isPartial) {
							const msgType = clineMsg.type === "say" ? clineMsg.say : clineMsg.ask
							this.log(
								`[forwardToIMWebSocket] Sending ${msgType} increment: ${incrementalText.length} chars`,
							)
						}

						llmService.imConnection.sendLLMChunk(
							ctx.streamId,
							JSON.stringify({
								type: clineMsg.type === "say" ? clineMsg.say : clineMsg.ask,
								content: incrementalText,
								partial: isPartial,
								ts: clineMsg.ts,
								metadata: clineMsg.metadata || {}, // 🔥 包含 taskId 等元数据
							}),
							ctx.imMetadata.recvId,
							ctx.imMetadata.targetTerminal,
							ctx.imMetadata.chatType,
							ctx.imMetadata.sendId,
							ctx.imMetadata.senderTerminal,
						)

						this.lastSentPositions.set(msgKey, fullText.length)
					}

					if (!isPartial) {
						this.lastSentPositions.delete(msgKey)
					}
				} else {
					// 无文本内容的消息 - 全量发送（如状态更新、错误等）
					if (!isPartial) {
						const msgType = clineMsg.type === "say" ? clineMsg.say : clineMsg.ask
						this.log(`[forwardToIMWebSocket] Sending ${msgType} message (no text content)`)
					}

					llmService.imConnection.sendLLMChunk(
						ctx.streamId,
						JSON.stringify({
							type: clineMsg.type === "say" ? clineMsg.say : clineMsg.ask,
							partial: isPartial,
							ts: clineMsg.ts,
							metadata: clineMsg.metadata || {}, // 🔥 包含 taskId 等元数据
						}),
						ctx.imMetadata.recvId,
						ctx.imMetadata.targetTerminal,
						ctx.imMetadata.chatType,
						ctx.imMetadata.sendId,
						ctx.imMetadata.senderTerminal,
					)
				}
			}
		} else {
			// messageUpdated 等其他类型
			if (message.type !== "messageUpdated" && message.type !== "imContactsResponse") {
				this.log(`[forwardToIMWebSocket] Ignoring message type: ${message.type}`)
			}
		}
	}

	private async getHMRHtmlContent(webview: vscode.Webview): Promise<string> {
		// Try to read the port from the file
		let localPort = "5173" // Default fallback
		try {
			const fs = require("fs")
			const path = require("path")
			const portFilePath = path.resolve(__dirname, "../../.vite-port")

			if (fs.existsSync(portFilePath)) {
				localPort = fs.readFileSync(portFilePath, "utf8").trim()
			}
		} catch (err) {
			// Continue with default port if file reading fails
		}

		const localServerUrl = `localhost:${localPort}`

		// Check if local dev server is running.
		try {
			await axios.get(`http://${localServerUrl}`)
		} catch (error) {
			vscode.window.showErrorMessage(t("common:errors.hmr_not_running"))

			return this.getHtmlContent(webview)
		}

		const nonce = getNonce()

		const stylesUri = getUri(webview, this.contextProxy.extensionUri, [
			"webview-ui",
			"build",
			"assets",
			"index.css",
		])

		const codiconsUri = getUri(webview, this.contextProxy.extensionUri, ["assets", "codicons", "codicon.css"])
		const materialIconsUri = getUri(webview, this.contextProxy.extensionUri, [
			"assets",
			"vscode-material-icons",
			"icons",
		])
		const imagesUri = getUri(webview, this.contextProxy.extensionUri, ["assets", "images"])
		const audioUri = getUri(webview, this.contextProxy.extensionUri, ["webview-ui", "audio"])

		const file = "src/index.tsx"
		const scriptUri = `http://${localServerUrl}/${file}`

		const reactRefresh = /*html*/ `
			<script nonce="${nonce}" type="module">
				import RefreshRuntime from "http://localhost:${localPort}/@react-refresh"
				RefreshRuntime.injectIntoGlobalHook(window)
				window.$RefreshReg$ = () => {}
				window.$RefreshSig$ = () => (type) => type
				window.__vite_plugin_react_preamble_installed__ = true
			</script>
		`

		const csp = [
			"default-src 'none'",
			`font-src ${webview.cspSource} data:`,
			`style-src ${webview.cspSource} 'unsafe-inline' https://* http://${localServerUrl} http://0.0.0.0:${localPort}`,
			`img-src ${webview.cspSource} https://storage.googleapis.com https://img.clerk.com data:`,
			`media-src ${webview.cspSource}`,
			`script-src 'unsafe-eval' ${webview.cspSource} https://* https://*.posthog.com http://${localServerUrl} http://0.0.0.0:${localPort} 'nonce-${nonce}'`,
			`connect-src * 'self' 'unsafe-inline' data: blob:`,
		]

		return /*html*/ `
			<!DOCTYPE html>
			<html lang="en">
				<head>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
					<meta http-equiv="Content-Security-Policy" content="${csp.join("; ")}">
					<link rel="stylesheet" type="text/css" href="${stylesUri}">
					<link href="${codiconsUri}" rel="stylesheet" />
					<script nonce="${nonce}">
						window.IMAGES_BASE_URI = "${imagesUri}"
						window.AUDIO_BASE_URI = "${audioUri}"
						window.MATERIAL_ICONS_BASE_URI = "${materialIconsUri}"
					</script>
					<title>Roo Code</title>
				</head>
				<body>
					<div id="root"></div>
					${reactRefresh}
					<script type="module" src="${scriptUri}"></script>
				</body>
			</html>
		`
	}

	/**
	 * Defines and returns the HTML that should be rendered within the webview panel.
	 *
	 * @remarks This is also the place where references to the React webview build files
	 * are created and inserted into the webview HTML.
	 *
	 * @param webview A reference to the extension webview
	 * @param extensionUri The URI of the directory containing the extension
	 * @returns A template string literal containing the HTML that should be
	 * rendered within the webview panel
	 */
	private getHtmlContent(webview: vscode.Webview): string {
		// Get the local path to main script run in the webview,
		// then convert it to a uri we can use in the webview.

		// The CSS file from the React build output
		const stylesUri = getUri(webview, this.contextProxy.extensionUri, [
			"webview-ui",
			"build",
			"assets",
			"index.css",
		])

		const scriptUri = getUri(webview, this.contextProxy.extensionUri, ["webview-ui", "build", "assets", "index.js"])
		const codiconsUri = getUri(webview, this.contextProxy.extensionUri, ["assets", "codicons", "codicon.css"])
		const materialIconsUri = getUri(webview, this.contextProxy.extensionUri, [
			"assets",
			"vscode-material-icons",
			"icons",
		])
		const imagesUri = getUri(webview, this.contextProxy.extensionUri, ["assets", "images"])
		const audioUri = getUri(webview, this.contextProxy.extensionUri, ["webview-ui", "audio"])

		// Use a nonce to only allow a specific script to be run.
		/*
		content security policy of your webview to only allow scripts that have a specific nonce
		create a content security policy meta tag so that only loading scripts with a nonce is allowed
		As your extension grows you will likely want to add custom styles, fonts, and/or images to your webview. If you do, you will need to update the content security policy meta tag to explicitly allow for these resources. E.g.
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; font-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
		- 'unsafe-inline' is required for styles due to vscode-webview-toolkit's dynamic style injection
		- since we pass base64 images to the webview, we need to specify img-src ${webview.cspSource} data:;

		in meta tag we add nonce attribute: A cryptographic nonce (only used once) to allow scripts. The server must generate a unique nonce value each time it transmits a policy. It is critical to provide a nonce that cannot be guessed as bypassing a resource's policy is otherwise trivial.
		*/
		const nonce = getNonce()

		// Tip: Install the es6-string-html VS Code extension to enable code highlighting below
		return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
            <meta name="theme-color" content="#000000">
            <meta http-equiv="Content-Security-Policy" content="default-src *; font-src * data:; style-src * 'unsafe-inline'; img-src * data:; media-src *; script-src * 'unsafe-eval' 'unsafe-inline' 'nonce-${nonce}'; connect-src *;">
            <link rel="stylesheet" type="text/css" href="${stylesUri}">
			<link href="${codiconsUri}" rel="stylesheet" />
			<script nonce="${nonce}">
				window.IMAGES_BASE_URI = "${imagesUri}"
				window.AUDIO_BASE_URI = "${audioUri}"
				window.MATERIAL_ICONS_BASE_URI = "${materialIconsUri}"
			</script>
            <title>Roo Code</title>
          </head>
          <body>
            <noscript>You need to enable JavaScript to run this app.</noscript>
            <div id="root"></div>
            <script nonce="${nonce}" type="module" src="${scriptUri}"></script>
          </body>
        </html>
      `
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is received.
	 *
	 * @param webview A reference to the extension webview
	 */
	private setWebviewMessageListener(webview: vscode.Webview) {
		const onReceiveMessage = async (message: WebviewMessage) =>
			webviewMessageHandler(this, message, this.marketplaceManager)

		const messageDisposable = webview.onDidReceiveMessage(onReceiveMessage)
		this.webviewDisposables.push(messageDisposable)
	}

	/**
	 * Handle switching to a new mode, including updating the associated API configuration
	 * @param newMode The mode to switch to
	 */
	public async handleModeSwitch(newMode: Mode) {
		// 🔥 模式切换应该针对用户任务，不是查看中的任务
		const cline = this.getCurrentUserTask()

		if (cline) {
			TelemetryService.instance.captureModeSwitch(cline.taskId, newMode)
			cline.emit(RooCodeEventName.TaskModeSwitched, cline.taskId, newMode)

			// Store the current mode in case we need to rollback
			const previousMode = (cline as any)._taskMode

			try {
				// Update the task history with the new mode first
				const history = (await TaskHistoryBridge.getTaskHistory()) ?? []
				const taskHistoryItem = history.find((item) => item.id === cline.taskId)
				if (taskHistoryItem) {
					taskHistoryItem.mode = newMode
					await this.updateTaskHistory(taskHistoryItem)
				}

				// Only update the task's mode after successful persistence
				;(cline as any)._taskMode = newMode
			} catch (error) {
				// If persistence fails, log the error but don't update the in-memory state
				this.log(
					`Failed to persist mode switch for task ${cline.taskId}: ${error instanceof Error ? error.message : String(error)}`,
				)

				// Optionally, we could emit an event to notify about the failure
				// This ensures the in-memory state remains consistent with persisted state
				throw error
			}
		}

		await this.updateGlobalState("mode", newMode)

		// Load the saved API config for the new mode if it exists
		const savedConfigId = await this.providerSettingsManager.getModeConfigId(newMode)
		const listApiConfig = await this.providerSettingsManager.listConfig()

		// Update listApiConfigMeta first to ensure UI has latest data
		await this.updateGlobalState("listApiConfigMeta", listApiConfig)

		// If this mode has a saved config, use it.
		if (savedConfigId) {
			const profile = listApiConfig.find(({ id }) => id === savedConfigId)

			if (profile?.name) {
				await this.activateProviderProfile({ name: profile.name })
			}
		} else {
			// If no saved config for this mode, save current config as default.
			const currentApiConfigName = this.getGlobalState("currentApiConfigName")

			if (currentApiConfigName) {
				const config = listApiConfig.find((c) => c.name === currentApiConfigName)

				if (config?.id) {
					await this.providerSettingsManager.setModeConfig(newMode, config.id)
				}
			}
		}

		await this.postStateToWebview()
	}

	// Provider Profile Management

	getProviderProfileEntries(): ProviderSettingsEntry[] {
		return this.contextProxy.getValues().listApiConfigMeta || []
	}

	getProviderProfileEntry(name: string): ProviderSettingsEntry | undefined {
		return this.getProviderProfileEntries().find((profile) => profile.name === name)
	}

	public hasProviderProfileEntry(name: string): boolean {
		return !!this.getProviderProfileEntry(name)
	}

	async upsertProviderProfile(
		name: string,
		providerSettings: ProviderSettings,
		activate: boolean = true,
	): Promise<string | undefined> {
		try {
			this.log(`[upsertProviderProfile] name: ${name}, activate: ${activate}`)
			// TODO: Do we need to be calling `activateProfile`? It's not
			// clear to me what the source of truth should be; in some cases
			// we rely on the `ContextProxy`'s data store and in other cases
			// we rely on the `ProviderSettingsManager`'s data store. It might
			// be simpler to unify these two.
			const id = await this.providerSettingsManager.saveConfig(name, providerSettings)
			this.log(`[upsertProviderProfile] saved config with id: ${id}`)

			if (activate) {
				const { mode } = await this.getState()

				// These promises do the following:
				// 1. Adds or updates the list of provider profiles.
				// 2. Sets the current provider profile.
				// 3. Sets the current mode's provider profile.
				// 4. Copies the provider settings to the context.
				//
				// Note: 1, 2, and 4 can be done in one `ContextProxy` call:
				// this.contextProxy.setValues({ ...providerSettings, listApiConfigMeta: ..., currentApiConfigName: ... })
				// We should probably switch to that and verify that it works.
				// I left the original implementation in just to be safe.
				await Promise.all([
					this.updateGlobalState("listApiConfigMeta", await this.providerSettingsManager.listConfig()),
					this.updateGlobalState("currentApiConfigName", name),
					this.providerSettingsManager.setModeConfig(mode, id),
					this.contextProxy.setProviderSettings(providerSettings),
				])

				// Change the provider for the current task.
				// TODO: We should rename `buildApiHandler` for clarity (e.g. `getProviderClient`).
				const task = this.getCurrentUserTask()
				this.log(`[upsertProviderProfile] current user task: ${task?.taskId || "none"}`)

				if (task) {
					this.log(`[upsertProviderProfile] updated task API handler`)
					task.api = buildApiHandler(providerSettings)
				}
			} else {
				await this.updateGlobalState("listApiConfigMeta", await this.providerSettingsManager.listConfig())
			}

			await this.postStateToWebview()
			return id
		} catch (error) {
			this.log(
				`Error create new api configuration: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
			)

			vscode.window.showErrorMessage(t("common:errors.create_api_config"))
			return undefined
		}
	}

	async deleteProviderProfile(profileToDelete: ProviderSettingsEntry) {
		const globalSettings = this.contextProxy.getValues()
		let profileToActivate: string | undefined = globalSettings.currentApiConfigName

		if (profileToDelete.name === profileToActivate) {
			profileToActivate = this.getProviderProfileEntries().find(({ name }) => name !== profileToDelete.name)?.name
		}

		if (!profileToActivate) {
			throw new Error("You cannot delete the last profile")
		}

		const entries = this.getProviderProfileEntries().filter(({ name }) => name !== profileToDelete.name)

		await this.contextProxy.setValues({
			...globalSettings,
			currentApiConfigName: profileToActivate,
			listApiConfigMeta: entries,
		})

		await this.postStateToWebview()
	}

	async activateProviderProfile(args: { name: string } | { id: string }, skipStateUpdate: boolean = false) {
		const { name, id, ...providerSettings } = await this.providerSettingsManager.activateProfile(args)

		// See `upsertProviderProfile` for a description of what this is doing.
		await Promise.all([
			this.contextProxy.setValue("listApiConfigMeta", await this.providerSettingsManager.listConfig()),
			this.contextProxy.setValue("currentApiConfigName", name),
			this.contextProxy.setProviderSettings(providerSettings),
		])

		const { mode } = await this.getState()

		if (id) {
			await this.providerSettingsManager.setModeConfig(mode, id)
		}

		// 🔥 API 切换应该针对用户任务，不是查看中的任务
		const task = this.getCurrentUserTask()

		if (task) {
			task.api = buildApiHandler(providerSettings)
		}

		// 🔥 允许跳过状态更新，避免在任务初始化过程中干扰
		if (!skipStateUpdate) {
			await this.postStateToWebview()
		}
	}

	/**
	 * Get provider profile by ID without activating it (does not change global current config)
	 */
	async getProviderProfileById(id: string) {
		try {
			return await this.providerSettingsManager.getProfile({ id })
		} catch (error) {
			this.log(`Error getting provider profile by ID ${id}: ${error instanceof Error ? error.message : error}`)
			return null
		}
	}

	// Task Management

	async cancelTask() {
		// 🔥 取消任务应该针对用户任务，不是查看中的任务
		const cline = this.getCurrentUserTask()

		if (!cline) {
			return
		}

		const { historyItem } = await this.getTaskWithId(cline.taskId)
		// Preserve parent and root task information for history item.
		const rootTask = cline.rootTask
		const parentTask = cline.parentTask

		cline.abortTask()

		// 🔥 等待任务 abort，应该针对用户任务
		await pWaitFor(
			() =>
				this.getCurrentUserTask()! === undefined ||
				this.getCurrentUserTask()!.isStreaming === false ||
				this.getCurrentUserTask()!.didFinishAbortingStream ||
				// If only the first chunk is processed, then there's no
				// need to wait for graceful abort (closes edits, browser,
				// etc).
				this.getCurrentUserTask()!.isWaitingForFirstChunk,
			{
				timeout: 3_000,
			},
		).catch(() => {
			// Failed to abort task gracefully
		})

		// 🔥 检查用户任务是否还在执行
		if (this.getCurrentUserTask()) {
			// 'abandoned' will prevent this Cline instance from affecting
			// future Cline instances. This may happen if its hanging on a
			// streaming request.
			this.getCurrentUserTask()!.abandoned = true
		}

		// Clears task again, so we need to abortTask manually above.
		await this.initClineWithHistoryItem({ ...historyItem, rootTask, parentTask })
	}

	async updateCustomInstructions(instructions?: string) {
		// User may be clearing the field.
		await this.updateGlobalState("customInstructions", instructions || undefined)
		await this.postStateToWebview()
	}

	// MCP

	async ensureMcpServersDirectoryExists(): Promise<string> {
		// Get platform-specific application data directory
		let mcpServersDir: string
		if (process.platform === "win32") {
			// Windows: %APPDATA%\Roo-Code\MCP
			mcpServersDir = path.join(os.homedir(), "AppData", "Roaming", "Roo-Code", "MCP")
		} else if (process.platform === "darwin") {
			// macOS: ~/Documents/Cline/MCP
			mcpServersDir = path.join(os.homedir(), "Documents", "Cline", "MCP")
		} else {
			// Linux: ~/.local/share/Cline/MCP
			mcpServersDir = path.join(os.homedir(), ".local", "share", "Roo-Code", "MCP")
		}

		try {
			await fs.mkdir(mcpServersDir, { recursive: true })
		} catch (error) {
			// Fallback to a relative path if directory creation fails
			return path.join(os.homedir(), ".roo-code", "mcp")
		}
		return mcpServersDir
	}

	async ensureSettingsDirectoryExists(): Promise<string> {
		const { getSettingsDirectoryPath } = await import("../../utils/storage")
		const globalStoragePath = this.contextProxy.globalStorageUri.fsPath
		return getSettingsDirectoryPath(globalStoragePath)
	}

	// OpenRouter

	async handleOpenRouterCallback(code: string) {
		let { apiConfiguration, currentApiConfigName } = await this.getState()

		let apiKey: string
		try {
			const baseUrl = apiConfiguration.openRouterBaseUrl || "https://openrouter.ai/api/v1"
			// Extract the base domain for the auth endpoint
			const baseUrlDomain = baseUrl.match(/^(https?:\/\/[^\/]+)/)?.[1] || "https://openrouter.ai"
			const response = await axios.post(`${baseUrlDomain}/api/v1/auth/keys`, { code })
			if (response.data && response.data.key) {
				apiKey = response.data.key
			} else {
				throw new Error("Invalid response from OpenRouter API")
			}
		} catch (error) {
			this.log(
				`Error exchanging code for API key: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
			)
			throw error
		}

		const newConfiguration: ProviderSettings = {
			...apiConfiguration,
			apiProvider: "openrouter",
			openRouterApiKey: apiKey,
			openRouterModelId: apiConfiguration?.openRouterModelId || openRouterDefaultModelId,
		}

		await this.upsertProviderProfile(currentApiConfigName, newConfiguration)
	}

	// Glama

	async handleGlamaCallback(code: string) {
		let apiKey: string
		try {
			const response = await axios.post("https://glama.ai/api/gateway/v1/auth/exchange-code", { code })
			if (response.data && response.data.apiKey) {
				apiKey = response.data.apiKey
			} else {
				throw new Error("Invalid response from Glama API")
			}
		} catch (error) {
			this.log(
				`Error exchanging code for API key: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`,
			)
			throw error
		}

		const { apiConfiguration, currentApiConfigName } = await this.getState()

		const newConfiguration: ProviderSettings = {
			...apiConfiguration,
			apiProvider: "glama",
			glamaApiKey: apiKey,
			glamaModelId: apiConfiguration?.glamaModelId || glamaDefaultModelId,
		}

		await this.upsertProviderProfile(currentApiConfigName, newConfiguration)
	}

	// Requesty

	async handleRequestyCallback(code: string) {
		let { apiConfiguration, currentApiConfigName } = await this.getState()

		const newConfiguration: ProviderSettings = {
			...apiConfiguration,
			apiProvider: "requesty",
			requestyApiKey: code,
			requestyModelId: apiConfiguration?.requestyModelId || requestyDefaultModelId,
		}

		await this.upsertProviderProfile(currentApiConfigName, newConfiguration)
	}

	// Task history

	async getTaskWithId(id: string): Promise<{
		historyItem: HistoryItem
		taskDirPath: string
		apiConversationHistoryFilePath: string
		uiMessagesFilePath: string
		apiConversationHistory: Anthropic.MessageParam[]
	}> {
		const history = (await TaskHistoryBridge.getTaskHistory()) ?? []
		const historyItem = history.find((item) => item.id === id)

		if (historyItem) {
			const { getTaskDirectoryPath } = await import("../../utils/storage")
			const globalStoragePath = this.contextProxy.globalStorageUri.fsPath
			const taskDirPath = await getTaskDirectoryPath(globalStoragePath, id)
			const apiConversationHistoryFilePath = path.join(taskDirPath, GlobalFileNames.apiConversationHistory)
			const uiMessagesFilePath = path.join(taskDirPath, GlobalFileNames.uiMessages)
			const fileExists = await fileExistsAtPath(apiConversationHistoryFilePath)

			if (fileExists) {
				const apiConversationHistory = JSON.parse(await fs.readFile(apiConversationHistoryFilePath, "utf8"))

				return {
					historyItem,
					taskDirPath,
					apiConversationHistoryFilePath,
					uiMessagesFilePath,
					apiConversationHistory,
				}
			}
		}

		// if we tried to get a task that doesn't exist, remove it from state
		// FIXME: this seems to happen sometimes when the json file doesnt save to disk for some reason
		await this.deleteTaskFromState(id)
		throw new Error("Task not found")
	}

	async showTaskWithId(id: string) {
		// 🔥 获取任务历史信息，判断任务类型
		const { historyItem } = await this.getTaskWithId(id)

		const isAgentTask = historyItem.source === "agent"

		// 🔥 智能体任务：标记为正在查看（无论是否还在执行）
		if (isAgentTask) {
			this.viewingAgentTaskId = id

			// 🔥 加载智能体任务的历史消息
			// 检查任务是否还在执行中（在栈池中查找）
			const runningTask = this.findAgentTask(id)

			if (!runningTask) {
				// 🔥 任务已完成，直接显示历史消息（只读模式）
				// 直接设置 viewingAgentTaskId，getState 会从 historyItem 读取消息
				this.viewingAgentTaskId = id

				// 🔥 通过 agentId 恢复智能体的配置（mode、profile、model）
				if (historyItem.agentId) {
					try {
						const agentStorage = this.getAgentStorageService()
						if (agentStorage) {
							// 🔥 获取当前用户ID (使用 VoidBridge)
							const userId = VoidBridge.getCurrentUserId()
							if (userId) {
								// 🔥 通过 agentId 获取智能体配置
								const agentConfig = await agentStorage.getAgent(userId, historyItem.agentId)
								const profileName = agentConfig?.apiConfig?.originalName || agentConfig?.apiConfigId
								if (agentConfig) {
									// 恢复 mode
									if (agentConfig.mode) {
										const customModes = await this.customModesManager.getCustomModes()
										const modeExists = getModeBySlug(agentConfig.mode, customModes) !== undefined
										if (modeExists) {
											await this.updateGlobalState("mode", agentConfig.mode)
										}
									}

									// 🔥 恢复 API profile（使用 apiConfig.originalName）
									if (profileName) {
										const listApiConfig = await this.providerSettingsManager.listConfig()
										await this.updateGlobalState("listApiConfigMeta", listApiConfig)

										const profile = listApiConfig.find((p) => p.name === profileName)
										if (profile) {
											await this.activateProviderProfile({ name: profile.name }, true)
										}
									}
								}
							}
						}
					} catch (error) {
						// Silently fail config restoration
					}
				}
			}

			// 更新 UI
			await this.postStateToWebview()
			await this.postMessageToWebview({ type: "action", action: "chatButtonClicked" })
			return
		}

		// 用户任务：保持原有逻辑
		if (id !== this.getCurrentCline()?.taskId) {
			// Non-current task.
			await this.initClineWithHistoryItem(historyItem) // Clears existing task.

			// 🔥 优化：先打开聊天界面让用户看到反馈，然后异步更新状态
			// 这样 UI 会立即响应，状态更新在后台进行
			await this.postMessageToWebview({ type: "action", action: "chatButtonClicked" })

			// 异步更新UI状态（不阻塞界面）
			setImmediate(() => {
				this.postStateToWebview().catch(error => {
					console.error("[showTaskWithId] Failed to update state:", error)
				})
			})
			return
		}

		// 打开聊天界面
		await this.postMessageToWebview({ type: "action", action: "chatButtonClicked" })
	}

	async exportTaskWithId(id: string) {
		const { historyItem, apiConversationHistory } = await this.getTaskWithId(id)
		await downloadTask(historyItem.ts, apiConversationHistory)
	}

	/* Condenses a task's message history to use fewer tokens. */
	async condenseTaskContext(taskId: string) {
		let task: Task | undefined
		for (let i = this.clineStack.length - 1; i >= 0; i--) {
			if (this.clineStack[i].taskId === taskId) {
				task = this.clineStack[i]
				break
			}
		}
		if (!task) {
			throw new Error(`Task with id ${taskId} not found in stack`)
		}
		await task.condenseContext()
		await this.postMessageToWebview({ type: "condenseTaskContextResponse", text: taskId })
	}

	// this function deletes a task from task hidtory, and deletes it's checkpoints and delete the task folder
	async deleteTaskWithId(id: string) {
		try {
			// get the task directory full path
			const { taskDirPath } = await this.getTaskWithId(id)

			// 🔥 如果正在查看此任务，清除查看状态并更新UI
			if (this.viewingAgentTaskId === id) {
				this.viewingAgentTaskId = null
				this.log(`[deleteTaskWithId] Cleared viewingAgentTaskId: ${id}`)
				// 立即更新UI，确保UI不再显示被删除的任务
				await this.postStateToWebview()
			}

			// 🔥 检查是否是后台智能体任务（在栈池中查找）
			const agentTask = this.findAgentTask(id)
			if (agentTask) {
				// 🔥 查找该任务所在的栈并移除
				const rootTaskId = agentTask.rootTask?.taskId || agentTask.taskId
				const stack = this.agentTaskPool.get(rootTaskId)
				if (stack) {
					const taskIndex = stack.findIndex((t) => t.taskId === id)
					if (taskIndex !== -1) {
						stack.splice(taskIndex, 1)
						this.log(`[deleteTaskWithId] Removed task from stack [${rootTaskId}]: ${id}`)
					}
					// 如果栈为空，删除整个栈
					if (stack.length === 0) {
						this.agentTaskPool.delete(rootTaskId)
						this.log(`[deleteTaskWithId] Stack empty, removed from pool: ${rootTaskId}`)
					}
				}
				// 中止任务
				await agentTask.abortTask()
			} else {
				// 用户任务或调试智能体任务：保持原有逻辑
				// remove task from stack if it's the current task
				if (id === this.getCurrentCline()?.taskId) {
					// if we found the taskid to delete - call finish to abort this task and allow a new task to be started,
					// if we are deleting a subtask and parent task is still waiting for subtask to finish - it allows the parent to resume (this case should neve exist)
					await this.finishSubTask(t("common:tasks.deleted"))
				}
			}

			// delete task from the task history state
			await this.deleteTaskFromState(id)

			// Delete associated shadow repository or branch.
			// TODO: Store `workspaceDir` in the `HistoryItem` object.
			const globalStorageDir = this.contextProxy.globalStorageUri.fsPath
			const workspaceDir = this.cwd

			try {
				await ShadowCheckpointService.deleteTask({ taskId: id, globalStorageDir, workspaceDir })
			} catch (error) {
				// Only log as warning if it's a "directory does not exist" error, otherwise log as error
				const errorMessage = error instanceof Error ? error.message : String(error)
				if (!errorMessage.includes("directory that does not exist")) {
					this.log(
						`[deleteTaskWithId${id}] failed to delete associated shadow repository or branch: ${errorMessage}`,
					)
				}
			}

			// delete the entire task directory including checkpoints and all content
			try {
				await fs.rm(taskDirPath, { recursive: true, force: true })
			} catch (error) {
				this.log(
					`[deleteTaskWithId${id}] failed to remove task directory: ${error instanceof Error ? error.message : String(error)}`,
				)
			}
		} catch (error) {
			// If task is not found, just remove it from state
			if (error instanceof Error && error.message === "Task not found") {
				await this.deleteTaskFromState(id)
				return
			}
			throw error
		}
	}

	async deleteTaskFromState(id: string) {
		// Ensure we read and write with the same user context
		const taskHistory = (await TaskHistoryBridge.getTaskHistory()) ?? []

		const updatedTaskHistory = taskHistory.filter((task) => task.id !== id)

		// Pass immediate: true to sync to Redis immediately for delete operations
		await TaskHistoryBridge.updateTaskHistory(undefined, updatedTaskHistory, true)

		// IMPORTANT: Also update the contextProxy cache so that getState() returns the updated history
		// This ensures postStateToWebview() sends the correct task history to the React UI
		await this.contextProxy.setValue("taskHistory", updatedTaskHistory)

		await this.postStateToWebview()
	}

	async postStateToWebview(forceUpdate: boolean = false) {
		// 获取状态并发送到 webview
		const state = await this.getStateToPostToWebview()
		this.postMessageToWebview({ type: "state", state })

		// Check MDM compliance and send user to account tab if not compliant
		if (!this.checkMdmCompliance()) {
			await this.postMessageToWebview({ type: "action", action: "accountButtonClicked" })
		}
	}

	/**
	 * Fetches marketplace data on demand to avoid blocking main state updates
	 */
	async fetchMarketplaceData() {
		try {
			const [marketplaceResult, marketplaceInstalledMetadata] = await Promise.all([
				this.marketplaceManager.getMarketplaceItems().catch((error) => {
					return { organizationMcps: [], marketplaceItems: [], errors: [error.message] }
				}),
				this.marketplaceManager.getInstallationMetadata().catch((error) => {
					return { project: {}, global: {} } as MarketplaceInstalledMetadata
				}),
			])

			// Send marketplace data separately
			this.postMessageToWebview({
				type: "marketplaceData",
				organizationMcps: marketplaceResult.organizationMcps || [],
				marketplaceItems: marketplaceResult.marketplaceItems || [],
				marketplaceInstalledMetadata: marketplaceInstalledMetadata || { project: {}, global: {} },
				errors: marketplaceResult.errors,
			})
		} catch (error) {
			// Send empty data on error to prevent UI from hanging
			this.postMessageToWebview({
				type: "marketplaceData",
				organizationMcps: [],
				marketplaceItems: [],
				marketplaceInstalledMetadata: { project: {}, global: {} },
				errors: [error instanceof Error ? error.message : String(error)],
			})

			// Show user-friendly error notification for network issues
			if (error instanceof Error && error.message.includes("timeout")) {
				vscode.window.showWarningMessage(
					"Marketplace data could not be loaded due to network restrictions. Core functionality remains available.",
				)
			}
		}
	}

	/**
	 * Checks if there is a file-based system prompt override for the given mode
	 */
	async hasFileBasedSystemPromptOverride(mode: Mode): Promise<boolean> {
		const promptFilePath = getSystemPromptFilePath(this.cwd, mode)
		return await fileExistsAtPath(promptFilePath)
	}

	/**
	 * Merges allowed commands from global state and workspace configuration
	 * with proper validation and deduplication
	 */
	private mergeAllowedCommands(globalStateCommands?: string[]): string[] {
		return this.mergeCommandLists("allowedCommands", "allowed", globalStateCommands)
	}

	/**
	 * Merges denied commands from global state and workspace configuration
	 * with proper validation and deduplication
	 */
	private mergeDeniedCommands(globalStateCommands?: string[]): string[] {
		return this.mergeCommandLists("deniedCommands", "denied", globalStateCommands)
	}

	/**
	 * Common utility for merging command lists from global state and workspace configuration.
	 * Implements the Command Denylist feature's merging strategy with proper validation.
	 *
	 * @param configKey - VSCode workspace configuration key
	 * @param commandType - Type of commands for error logging
	 * @param globalStateCommands - Commands from global state
	 * @returns Merged and deduplicated command list
	 */
	private mergeCommandLists(
		configKey: "allowedCommands" | "deniedCommands",
		commandType: "allowed" | "denied",
		globalStateCommands?: string[],
	): string[] {
		try {
			// Validate and sanitize global state commands
			const validGlobalCommands = Array.isArray(globalStateCommands)
				? globalStateCommands.filter((cmd) => typeof cmd === "string" && cmd.trim().length > 0)
				: []

			// Get workspace configuration commands
			const workspaceCommands = vscode.workspace.getConfiguration(Package.name).get<string[]>(configKey) || []

			// Validate and sanitize workspace commands
			const validWorkspaceCommands = Array.isArray(workspaceCommands)
				? workspaceCommands.filter((cmd) => typeof cmd === "string" && cmd.trim().length > 0)
				: []

			// Combine and deduplicate commands
			// Global state takes precedence over workspace configuration
			const mergedCommands = [...new Set([...validGlobalCommands, ...validWorkspaceCommands])]

			return mergedCommands
		} catch (error) {
			// Return empty array as fallback to prevent crashes
			return []
		}
	}

	async getStateToPostToWebview() {
		const {
			apiConfiguration,
			lastShownAnnouncementId,
			customInstructions,
			alwaysAllowReadOnly,
			alwaysAllowReadOnlyOutsideWorkspace,
			alwaysAllowWrite,
			alwaysAllowWriteOutsideWorkspace,
			alwaysAllowWriteProtected,
			alwaysAllowExecute,
			allowedCommands,
			deniedCommands,
			alwaysAllowBrowser,
			alwaysAllowMcp,
			alwaysAllowModeSwitch,
			alwaysAllowSubtasks,
			alwaysAllowUpdateTodoList,
			allowedMaxRequests,
			allowedMaxCost,
			autoCondenseContext,
			autoCondenseContextPercent,
			soundEnabled,
			ttsEnabled,
			ttsSpeed,
			diffEnabled,
			enableCheckpoints,
			taskHistory,
			soundVolume,
			browserViewportSize,
			screenshotQuality,
			remoteBrowserHost,
			remoteBrowserEnabled,
			cachedChromeHostUrl,
			writeDelayMs,
			terminalOutputLineLimit,
			terminalOutputCharacterLimit,
			terminalShellIntegrationTimeout,
			terminalShellIntegrationDisabled,
			terminalCommandDelay,
			terminalPowershellCounter,
			terminalZshClearEolMark,
			terminalZshOhMy,
			terminalZshP10k,
			terminalZdotdir,
			fuzzyMatchThreshold,
			mcpEnabled,
			enableMcpServerCreation,
			alwaysApproveResubmit,
			requestDelaySeconds,
			currentApiConfigName,
			listApiConfigMeta,
			pinnedApiConfigs,
			mode,
			customModePrompts,
			customSupportPrompts,
			enhancementApiConfigId,
			autoApprovalEnabled,
			customModes,
			experiments,
			maxOpenTabsContext,
			maxWorkspaceFiles,
			browserToolEnabled,
			telemetrySetting,
			showRooIgnoredFiles,
			language,
			maxReadFileLine,
			maxImageFileSize,
			maxTotalImageSize,
			terminalCompressProgressBar,
			historyPreviewCollapsed,
			cloudUserInfo,
			cloudIsAuthenticated,
			sharingEnabled,
			organizationAllowList,
			organizationSettingsVersion,
			maxConcurrentFileReads,
			condensingApiConfigId,
			customCondensingPrompt,
			codebaseIndexConfig,
			codebaseIndexModels,
			profileThresholds,
			alwaysAllowFollowupQuestions,
			followupAutoApproveTimeoutMs,
			includeDiagnosticMessages,
			maxDiagnosticMessages,
			includeTaskHistoryInEnhance,
			remoteControlEnabled,
			agentA2AMode,
		} = await this.getState()

		const telemetryKey = process.env.POSTHOG_API_KEY
		const machineId = vscode.env.machineId
		const mergedAllowedCommands = this.mergeAllowedCommands(allowedCommands)
		const mergedDeniedCommands = this.mergeDeniedCommands(deniedCommands)
		const cwd = this.cwd

		// Check if there's a system prompt override for the current mode
		const currentMode = mode ?? defaultModeSlug
		const hasSystemPromptOverride = await this.hasFileBasedSystemPromptOverride(currentMode)

		// 🔥 获取当前任务信息（可能是用户任务或正在查看的智能体任务）
		const currentTask = this.getCurrentCline()
		const currentTaskId = currentTask?.taskId || this.viewingAgentTaskId // 智能体任务可能已完成，从 viewingAgentTaskId 获取
		const currentTaskItem = currentTaskId
			? (taskHistory || []).find((item: HistoryItem) => item.id === currentTaskId)
			: undefined

		// 🔥 智能体任务：显示历史消息，不显示实时消息（避免干扰任务执行）
		// 用户任务：显示实时消息
		let clineMessages: ClineMessage[] = []
		let viewingCompletedAgentTask = false // 标记是否正在查看已完成的智能体任务
		if (this.viewingAgentTaskId) {
			// Check if viewing task is currently running (在栈池中查找)
			const viewingTask = this.findAgentTask(this.viewingAgentTaskId)
			if (viewingTask) {
				// Task is running, use real-time messages
				clineMessages = viewingTask.clineMessages || []
			} else {
				// Task completed, use history messages
				viewingCompletedAgentTask = true
				clineMessages = currentTaskItem?.clineMessages || []
			}
		} else {
			// User task or no task: use real-time messages
			clineMessages = currentTask?.clineMessages || []
		}

		return {
			version: this.context.extension?.packageJSON?.version ?? "",
			apiConfiguration,
			customInstructions,
			alwaysAllowReadOnly: alwaysAllowReadOnly ?? false,
			alwaysAllowReadOnlyOutsideWorkspace: alwaysAllowReadOnlyOutsideWorkspace ?? false,
			alwaysAllowWrite: alwaysAllowWrite ?? false,
			alwaysAllowWriteOutsideWorkspace: alwaysAllowWriteOutsideWorkspace ?? false,
			alwaysAllowWriteProtected: alwaysAllowWriteProtected ?? false,
			alwaysAllowExecute: alwaysAllowExecute ?? false,
			alwaysAllowBrowser: alwaysAllowBrowser ?? false,
			alwaysAllowMcp: alwaysAllowMcp ?? false,
			alwaysAllowModeSwitch: alwaysAllowModeSwitch ?? false,
			alwaysAllowSubtasks: alwaysAllowSubtasks ?? false,
			alwaysAllowUpdateTodoList: alwaysAllowUpdateTodoList ?? false,
			allowedMaxRequests,
			allowedMaxCost,
			autoCondenseContext: autoCondenseContext ?? true,
			autoCondenseContextPercent: autoCondenseContextPercent ?? 100,
			uriScheme: vscode.env.uriScheme,
			currentTaskItem,
			clineMessages,
			viewingAgentTask: !!this.viewingAgentTaskId, // Flag to indicate viewing an agent task
			viewingCompletedAgentTask, // Flag to indicate viewing a completed agent task (read-only mode)
			taskHistory: (taskHistory || [])
				.filter((item: HistoryItem) => item.ts && item.task)
				.sort((a: HistoryItem, b: HistoryItem) => b.ts - a.ts),
			soundEnabled: soundEnabled ?? false,
			ttsEnabled: ttsEnabled ?? false,
			ttsSpeed: ttsSpeed ?? 1.0,
			diffEnabled: diffEnabled ?? true,
			enableCheckpoints: enableCheckpoints ?? false,
			shouldShowAnnouncement: false, // 关闭版本更新提醒
			// telemetrySetting !== "unset" && lastShownAnnouncementId !== this.latestAnnouncementId,
			allowedCommands: mergedAllowedCommands,
			deniedCommands: mergedDeniedCommands,
			soundVolume: soundVolume ?? 0.5,
			browserViewportSize: browserViewportSize ?? "900x600",
			screenshotQuality: screenshotQuality ?? 75,
			remoteBrowserHost,
			remoteBrowserEnabled: remoteBrowserEnabled ?? false,
			cachedChromeHostUrl: cachedChromeHostUrl,
			writeDelayMs: writeDelayMs ?? DEFAULT_WRITE_DELAY_MS,
			terminalOutputLineLimit: terminalOutputLineLimit ?? 500,
			terminalOutputCharacterLimit: terminalOutputCharacterLimit ?? DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
			terminalShellIntegrationTimeout: terminalShellIntegrationTimeout ?? Terminal.defaultShellIntegrationTimeout,
			terminalShellIntegrationDisabled: terminalShellIntegrationDisabled ?? false,
			terminalCommandDelay: terminalCommandDelay ?? 0,
			terminalPowershellCounter: terminalPowershellCounter ?? false,
			terminalZshClearEolMark: terminalZshClearEolMark ?? true,
			terminalZshOhMy: terminalZshOhMy ?? false,
			terminalZshP10k: terminalZshP10k ?? false,
			terminalZdotdir: terminalZdotdir ?? false,
			fuzzyMatchThreshold: fuzzyMatchThreshold ?? 1.0,
			mcpEnabled: mcpEnabled ?? true,
			enableMcpServerCreation: enableMcpServerCreation ?? true,
			alwaysApproveResubmit: alwaysApproveResubmit ?? false,
			requestDelaySeconds: requestDelaySeconds ?? 10,
			currentApiConfigName: currentApiConfigName ?? "default",
			listApiConfigMeta: listApiConfigMeta ?? [],
			pinnedApiConfigs: pinnedApiConfigs ?? {},
			mode: mode ?? defaultModeSlug,
			customModePrompts: customModePrompts ?? {},
			customSupportPrompts: customSupportPrompts ?? {},
			enhancementApiConfigId,
			autoApprovalEnabled: autoApprovalEnabled ?? false,
			customModes,
			experiments: experiments ?? experimentDefault,
			mcpServers: this.mcpHub?.getAllServers() ?? [],
			maxOpenTabsContext: maxOpenTabsContext ?? 20,
			maxWorkspaceFiles: maxWorkspaceFiles ?? 200,
			cwd,
			browserToolEnabled: browserToolEnabled ?? true,
			telemetrySetting,
			telemetryKey,
			machineId,
			showRooIgnoredFiles: showRooIgnoredFiles ?? true,
			// Default to Chinese if language is not set
			language: language ?? "zh-CN",
			renderContext: this.renderContext,
			maxReadFileLine: maxReadFileLine ?? -1,
			maxImageFileSize: maxImageFileSize ?? 5,
			maxTotalImageSize: maxTotalImageSize ?? 20,
			maxConcurrentFileReads: maxConcurrentFileReads ?? 5,
			settingsImportedAt: this.settingsImportedAt,
			terminalCompressProgressBar: terminalCompressProgressBar ?? true,
			hasSystemPromptOverride,
			historyPreviewCollapsed: historyPreviewCollapsed ?? false,
			cloudUserInfo,
			cloudIsAuthenticated: cloudIsAuthenticated ?? false,
			sharingEnabled: sharingEnabled ?? false,
			organizationAllowList,
			organizationSettingsVersion,
			condensingApiConfigId,
			customCondensingPrompt,
			codebaseIndexModels: codebaseIndexModels ?? EMBEDDING_MODEL_PROFILES,
			codebaseIndexConfig: {
				codebaseIndexEnabled: codebaseIndexConfig?.codebaseIndexEnabled ?? false,
				codebaseIndexQdrantUrl: codebaseIndexConfig?.codebaseIndexQdrantUrl ?? "http://localhost:6333",
				codebaseIndexEmbedderProvider: codebaseIndexConfig?.codebaseIndexEmbedderProvider ?? "openai",
				codebaseIndexEmbedderBaseUrl: codebaseIndexConfig?.codebaseIndexEmbedderBaseUrl ?? "",
				codebaseIndexEmbedderModelId: codebaseIndexConfig?.codebaseIndexEmbedderModelId ?? "",
				codebaseIndexEmbedderModelDimension: codebaseIndexConfig?.codebaseIndexEmbedderModelDimension ?? 1536,
				codebaseIndexOpenAiCompatibleBaseUrl: codebaseIndexConfig?.codebaseIndexOpenAiCompatibleBaseUrl,
				codebaseIndexSearchMaxResults: codebaseIndexConfig?.codebaseIndexSearchMaxResults,
				codebaseIndexSearchMinScore: codebaseIndexConfig?.codebaseIndexSearchMinScore,
			},
			mdmCompliant: this.checkMdmCompliance(),
			profileThresholds: profileThresholds ?? {},
			cloudApiUrl: getRooCodeApiUrl(),
			hasOpenedModeSelector: this.getGlobalState("hasOpenedModeSelector") ?? false,
			alwaysAllowFollowupQuestions: alwaysAllowFollowupQuestions ?? false,
			followupAutoApproveTimeoutMs: followupAutoApproveTimeoutMs ?? 60000,
			includeDiagnosticMessages: includeDiagnosticMessages ?? true,
			maxDiagnosticMessages: maxDiagnosticMessages ?? 50,
			includeTaskHistoryInEnhance: includeTaskHistoryInEnhance ?? false,
			remoteControlEnabled: remoteControlEnabled ?? false,
			agentA2AMode: agentA2AMode ?? null,
		}
	}

	/**
	 * Storage
	 * https://dev.to/kompotkot/how-to-use-secretstorage-in-your-vscode-extensions-2hco
	 * https://www.eliostruyf.com/devhack-code-extension-storage-options/
	 */

	async getState() {
		const stateValues = this.contextProxy.getValues()
		const customModes = await this.customModesManager.getCustomModes()

		// 🔥 Get task history from TaskHistoryBridge (which has its own caching)
		const { TaskHistoryBridge } = await import("../../api/task-history-bridge")
		const taskHistory = await TaskHistoryBridge.getTaskHistory()

		// Determine apiProvider with the same logic as before.
		const apiProvider: ProviderName = stateValues.apiProvider ? stateValues.apiProvider : "anthropic"

		// Build the apiConfiguration object combining state values and secrets.
		const providerSettings = this.contextProxy.getProviderSettings()

		// Ensure apiProvider is set properly if not already in state
		if (!providerSettings.apiProvider) {
			providerSettings.apiProvider = apiProvider
		}

		let organizationAllowList = ORGANIZATION_ALLOW_ALL

		try {
			organizationAllowList = await CloudService.instance.getAllowList()
		} catch (error) {
			// Failed to get organization allow list
		}

		let cloudUserInfo: CloudUserInfo | null = null

		try {
			cloudUserInfo = CloudService.instance.getUserInfo()
		} catch (error) {
			// Failed to get cloud user info
		}

		let cloudIsAuthenticated: boolean = false

		try {
			cloudIsAuthenticated = CloudService.instance.isAuthenticated()
		} catch (error) {
			// Failed to get cloud authentication state
		}

		let sharingEnabled: boolean = false

		try {
			sharingEnabled = await CloudService.instance.canShareTask()
		} catch (error) {
			// Failed to get sharing enabled state
		}

		let organizationSettingsVersion: number = -1

		try {
			if (CloudService.hasInstance()) {
				const settings = CloudService.instance.getOrganizationSettings()
				organizationSettingsVersion = settings?.version ?? -1
			}
		} catch (error) {
			// Failed to get organization settings version
		}

		// Return the same structure as before
		return {
			apiConfiguration: providerSettings,
			lastShownAnnouncementId: stateValues.lastShownAnnouncementId,
			customInstructions: stateValues.customInstructions,
			apiModelId: stateValues.apiModelId,
			alwaysAllowReadOnly: stateValues.alwaysAllowReadOnly ?? false,
			alwaysAllowReadOnlyOutsideWorkspace: stateValues.alwaysAllowReadOnlyOutsideWorkspace ?? false,
			alwaysAllowWrite: stateValues.alwaysAllowWrite ?? false,
			alwaysAllowWriteOutsideWorkspace: stateValues.alwaysAllowWriteOutsideWorkspace ?? false,
			alwaysAllowWriteProtected: stateValues.alwaysAllowWriteProtected ?? false,
			alwaysAllowExecute: stateValues.alwaysAllowExecute ?? false,
			alwaysAllowBrowser: stateValues.alwaysAllowBrowser ?? false,
			alwaysAllowMcp: stateValues.alwaysAllowMcp ?? false,
			alwaysAllowModeSwitch: stateValues.alwaysAllowModeSwitch ?? false,
			alwaysAllowSubtasks: stateValues.alwaysAllowSubtasks ?? false,
			alwaysAllowFollowupQuestions: stateValues.alwaysAllowFollowupQuestions ?? false,
			alwaysAllowUpdateTodoList: stateValues.alwaysAllowUpdateTodoList ?? false,
			followupAutoApproveTimeoutMs: stateValues.followupAutoApproveTimeoutMs ?? 60000,
			diagnosticsEnabled: stateValues.diagnosticsEnabled ?? true,
			allowedMaxRequests: stateValues.allowedMaxRequests,
			allowedMaxCost: stateValues.allowedMaxCost,
			autoCondenseContext: stateValues.autoCondenseContext ?? true,
			autoCondenseContextPercent: stateValues.autoCondenseContextPercent ?? 100,
			taskHistory: taskHistory,
			allowedCommands: stateValues.allowedCommands,
			deniedCommands: stateValues.deniedCommands,
			soundEnabled: stateValues.soundEnabled ?? false,
			ttsEnabled: stateValues.ttsEnabled ?? false,
			ttsSpeed: stateValues.ttsSpeed ?? 1.0,
			diffEnabled: stateValues.diffEnabled ?? true,
			enableCheckpoints: stateValues.enableCheckpoints ?? false,
			soundVolume: stateValues.soundVolume,
			browserViewportSize: stateValues.browserViewportSize ?? "900x600",
			screenshotQuality: stateValues.screenshotQuality ?? 75,
			remoteBrowserHost: stateValues.remoteBrowserHost,
			remoteBrowserEnabled: stateValues.remoteBrowserEnabled ?? false,
			cachedChromeHostUrl: stateValues.cachedChromeHostUrl as string | undefined,
			fuzzyMatchThreshold: stateValues.fuzzyMatchThreshold ?? 1.0,
			writeDelayMs: stateValues.writeDelayMs ?? DEFAULT_WRITE_DELAY_MS,
			terminalOutputLineLimit: stateValues.terminalOutputLineLimit ?? 500,
			terminalOutputCharacterLimit:
				stateValues.terminalOutputCharacterLimit ?? DEFAULT_TERMINAL_OUTPUT_CHARACTER_LIMIT,
			terminalShellIntegrationTimeout:
				stateValues.terminalShellIntegrationTimeout ?? Terminal.defaultShellIntegrationTimeout,
			terminalShellIntegrationDisabled: stateValues.terminalShellIntegrationDisabled ?? false,
			terminalCommandDelay: stateValues.terminalCommandDelay ?? 0,
			terminalPowershellCounter: stateValues.terminalPowershellCounter ?? false,
			terminalZshClearEolMark: stateValues.terminalZshClearEolMark ?? true,
			terminalZshOhMy: stateValues.terminalZshOhMy ?? false,
			terminalZshP10k: stateValues.terminalZshP10k ?? false,
			terminalZdotdir: stateValues.terminalZdotdir ?? false,
			terminalCompressProgressBar: stateValues.terminalCompressProgressBar ?? true,
			mode: stateValues.mode ?? defaultModeSlug,
			// Default to Chinese if language is not set
			language: stateValues.language ?? "zh-CN",
			mcpEnabled: stateValues.mcpEnabled ?? true,
			enableMcpServerCreation: stateValues.enableMcpServerCreation ?? true,
			alwaysApproveResubmit: stateValues.alwaysApproveResubmit ?? false,
			requestDelaySeconds: Math.max(5, stateValues.requestDelaySeconds ?? 10),
			currentApiConfigName: stateValues.currentApiConfigName ?? "default",
			listApiConfigMeta: stateValues.listApiConfigMeta ?? [],
			pinnedApiConfigs: stateValues.pinnedApiConfigs ?? {},
			modeApiConfigs: stateValues.modeApiConfigs ?? ({} as Record<Mode, string>),
			customModePrompts: stateValues.customModePrompts ?? {},
			customSupportPrompts: stateValues.customSupportPrompts ?? {},
			enhancementApiConfigId: stateValues.enhancementApiConfigId,
			experiments: stateValues.experiments ?? experimentDefault,
			autoApprovalEnabled: stateValues.autoApprovalEnabled ?? false,
			customModes,
			maxOpenTabsContext: stateValues.maxOpenTabsContext ?? 20,
			maxWorkspaceFiles: stateValues.maxWorkspaceFiles ?? 200,
			openRouterUseMiddleOutTransform: stateValues.openRouterUseMiddleOutTransform ?? true,
			browserToolEnabled: stateValues.browserToolEnabled ?? true,
			telemetrySetting: stateValues.telemetrySetting || "unset",
			showRooIgnoredFiles: stateValues.showRooIgnoredFiles ?? true,
			maxReadFileLine: stateValues.maxReadFileLine ?? -1,
			maxImageFileSize: stateValues.maxImageFileSize ?? 5,
			maxTotalImageSize: stateValues.maxTotalImageSize ?? 20,
			maxConcurrentFileReads: stateValues.maxConcurrentFileReads ?? 5,
			historyPreviewCollapsed: stateValues.historyPreviewCollapsed ?? false,
			cloudUserInfo,
			cloudIsAuthenticated,
			sharingEnabled,
			organizationAllowList,
			organizationSettingsVersion,
			// Explicitly add condensing settings
			condensingApiConfigId: stateValues.condensingApiConfigId,
			customCondensingPrompt: stateValues.customCondensingPrompt,
			codebaseIndexModels: stateValues.codebaseIndexModels ?? EMBEDDING_MODEL_PROFILES,
			codebaseIndexConfig: {
				codebaseIndexEnabled: stateValues.codebaseIndexConfig?.codebaseIndexEnabled ?? false,
				codebaseIndexQdrantUrl:
					stateValues.codebaseIndexConfig?.codebaseIndexQdrantUrl ?? "http://localhost:6333",
				codebaseIndexEmbedderProvider:
					stateValues.codebaseIndexConfig?.codebaseIndexEmbedderProvider ?? "openai",
				codebaseIndexEmbedderBaseUrl: stateValues.codebaseIndexConfig?.codebaseIndexEmbedderBaseUrl ?? "",
				codebaseIndexEmbedderModelId: stateValues.codebaseIndexConfig?.codebaseIndexEmbedderModelId ?? "",
				codebaseIndexEmbedderModelDimension:
					stateValues.codebaseIndexConfig?.codebaseIndexEmbedderModelDimension,
				codebaseIndexOpenAiCompatibleBaseUrl:
					stateValues.codebaseIndexConfig?.codebaseIndexOpenAiCompatibleBaseUrl,
				codebaseIndexSearchMaxResults: stateValues.codebaseIndexConfig?.codebaseIndexSearchMaxResults,
				codebaseIndexSearchMinScore: stateValues.codebaseIndexConfig?.codebaseIndexSearchMinScore,
			},
			profileThresholds: stateValues.profileThresholds ?? {},
			// Add diagnostic message settings
			includeDiagnosticMessages: stateValues.includeDiagnosticMessages ?? true,
			maxDiagnosticMessages: stateValues.maxDiagnosticMessages ?? 50,
			// Add includeTaskHistoryInEnhance setting
			includeTaskHistoryInEnhance: stateValues.includeTaskHistoryInEnhance ?? false,
			// Add remoteControlEnabled setting
			remoteControlEnabled: stateValues.remoteControlEnabled ?? false,
			// Add agentA2AMode setting
			agentA2AMode: stateValues.agentA2AMode ?? null,
		}
	}

	async updateTaskHistory(item: HistoryItem): Promise<HistoryItem[]> {
		this.log(`[updateTaskHistory] 📥 Updating task: ${item.id}`)
		this.log(`[updateTaskHistory] item.clineMessages: ${item.clineMessages?.length || 0}`)

		// Get user-specific task history using TaskHistoryBridge
		const history = (await TaskHistoryBridge.getTaskHistory()) || []
		const existingItemIndex = history.findIndex((h) => h.id === item.id)

		if (existingItemIndex !== -1) {
			history[existingItemIndex] = item
			this.log(`[updateTaskHistory] 🔄 Updated existing task at index ${existingItemIndex}`)
		} else {
			history.push(item)
			this.log(`[updateTaskHistory] ➕ Added new task to history`)
		}

		// Update both user-specific and general history
		await TaskHistoryBridge.updateTaskHistory(undefined, history)

		// IMPORTANT: Also update the contextProxy cache so that getState() returns the updated history
		// This ensures postStateToWebview() sends the correct task history to the UI
		await this.contextProxy.setValue("taskHistory", history)

		// Verification: read back the saved item (TaskHistoryBridge cache is already updated)
		const verifyHistory = await TaskHistoryBridge.getTaskHistory()
		const verifyItem = verifyHistory.find((h) => h.id === item.id)
		if (verifyItem) {
			this.log(`[updateTaskHistory] 🔍 Verify - clineMessages: ${verifyItem.clineMessages?.length || 0}`)
		} else {
			this.log(`[updateTaskHistory] ❌ Verify - item not found in history!`)
		}

		return history
	}

	// ContextProxy

	// @deprecated - Use `ContextProxy#setValue` instead.
	private async updateGlobalState<K extends keyof GlobalState>(key: K, value: GlobalState[K]) {
		await this.contextProxy.setValue(key, value)
	}

	// @deprecated - Use `ContextProxy#getValue` instead.
	private getGlobalState<K extends keyof GlobalState>(key: K) {
		return this.contextProxy.getValue(key)
	}

	public async setValue<K extends keyof RooCodeSettings>(key: K, value: RooCodeSettings[K]) {
		await this.contextProxy.setValue(key, value)
	}

	public getValue<K extends keyof RooCodeSettings>(key: K) {
		return this.contextProxy.getValue(key)
	}

	public getValues() {
		return this.contextProxy.getValues()
	}

	public async setValues(values: RooCodeSettings) {
		await this.contextProxy.setValues(values)
	}

	// cwd

	get cwd() {
		return getWorkspacePath()
	}

	// dev

	/**
	 * Switch to a different context proxy (for user switching)
	 */
	async switchContextProxy(newContextProxy: ContextProxy) {
		// Remove current task if exists
		const currentTask = this.getCurrentCline()
		if (currentTask) {
			// Task will be saved when removed from stack
		}

		// Update context proxy reference
		// Note: This is a readonly property, so we need to use Object.defineProperty
		Object.defineProperty(this, "contextProxy", {
			value: newContextProxy,
			writable: false,
			configurable: true,
		})

		// Note: ProviderSettingsManager and CustomModesManager don't have initialize methods
		// They manage their own state internally and don't support context switching yet
		// This is a limitation of the current architecture that needs to be addressed

		// Clear current task stack
		while (this.clineStack.length > 0) {
			await this.removeClineFromStack()
		}

		// Post new state to webview
		await this.postStateToWebview()
	}

	async resetState() {
		const answer = await vscode.window.showInformationMessage(
			t("common:confirmation.reset_state"),
			{ modal: true },
			t("common:answers.yes"),
		)

		if (answer !== t("common:answers.yes")) {
			return
		}

		await this.contextProxy.resetAllState()
		await this.providerSettingsManager.resetAllConfigs()
		await this.customModesManager.resetCustomModes()
		await this.removeClineFromStack()
		await this.postStateToWebview()
		await this.postMessageToWebview({ type: "action", action: "chatButtonClicked" })
	}

	// logging

	public log(message: string) {
		this.outputChannel.appendLine(message)
	}

	// integration tests

	get viewLaunched() {
		return this.isViewLaunched
	}

	get messages() {
		return this.getCurrentCline()?.clineMessages || []
	}

	// Add public getter
	public getMcpHub(): McpHub | undefined {
		return this.mcpHub
	}

	/**
	 * Check if the current state is compliant with MDM policy
	 * @returns true if compliant, false if blocked
	 */
	public checkMdmCompliance(): boolean {
		if (!this.mdmService) {
			return true // No MDM service, allow operation
		}

		const compliance = this.mdmService.isCompliant()

		if (!compliance.compliant) {
			return false
		}

		return true
	}

	/**
	 * Handle remote control enabled/disabled state changes
	 * Manages UnifiedBridgeService lifecycle
	 */
	public async handleRemoteControlToggle(enabled: boolean) {
		const { CloudService: CloudServiceImport, UnifiedBridgeService } = await import("@roo-code/cloud")

		const userInfo = CloudServiceImport.instance.getUserInfo()

		const bridgeConfig = await CloudServiceImport.instance.cloudAPI?.bridgeConfig().catch(() => undefined)

		if (!bridgeConfig) {
			this.log("[ClineProvider#handleRemoteControlToggle] Failed to get bridge config")
			return
		}

		await UnifiedBridgeService.handleRemoteControlState(
			userInfo,
			enabled,
			{ ...bridgeConfig, provider: this },
			(message: string) => this.log(message),
		)

		if (isRemoteControlEnabled(userInfo, enabled)) {
			// 🔥 桥接服务只为用户任务设置
			const currentTask = this.getCurrentUserTask()

			if (currentTask && !currentTask.bridgeService) {
				try {
					currentTask.bridgeService = UnifiedBridgeService.getInstance()

					if (currentTask.bridgeService) {
						await currentTask.bridgeService.subscribeToTask(currentTask)
					}
				} catch (error) {
					const message = `[ClineProvider#handleRemoteControlToggle] subscribeToTask failed - ${error instanceof Error ? error.message : String(error)}`
					this.log(message)
				}
			}
		} else {
			for (const task of this.clineStack) {
				if (task.bridgeService) {
					try {
						await task.bridgeService.unsubscribeFromTask(task.taskId)
						task.bridgeService = null
					} catch (error) {
						const message = `[ClineProvider#handleRemoteControlToggle] unsubscribeFromTask failed - ${error instanceof Error ? error.message : String(error)}`
						this.log(message)
					}
				}
			}

			UnifiedBridgeService.resetInstance()
		}
	}

	/**
	 * Returns properties to be included in every telemetry event
	 * This method is called by the telemetry service to get context information
	 * like the current mode, API provider, git repository information, etc.
	 */
	public async getTelemetryProperties(): Promise<TelemetryProperties> {
		const { mode, apiConfiguration, language } = await this.getState()
		const task = this.getCurrentCline()

		const packageJSON = this.context.extension?.packageJSON

		// Get Roo Code Cloud authentication state
		let cloudIsAuthenticated: boolean | undefined

		try {
			if (CloudService.hasInstance()) {
				cloudIsAuthenticated = CloudService.instance.isAuthenticated()
			}
		} catch (error) {
			// Silently handle errors to avoid breaking telemetry collection
			this.log(`[getTelemetryProperties] Failed to get cloud auth state: ${error}`)
		}

		// Get git repository information
		const gitInfo = await getWorkspaceGitInfo()

		// Calculate todo list statistics
		const todoList = task?.todoList
		let todos: { total: number; completed: number; inProgress: number; pending: number } | undefined

		if (todoList && todoList.length > 0) {
			todos = {
				total: todoList.length,
				completed: todoList.filter((todo) => todo.status === "completed").length,
				inProgress: todoList.filter((todo) => todo.status === "in_progress").length,
				pending: todoList.filter((todo) => todo.status === "pending").length,
			}
		}

		// Return all properties including git info - clients will filter as needed
		return {
			appName: packageJSON?.name ?? Package.name,
			appVersion: packageJSON?.version ?? Package.version,
			vscodeVersion: vscode.version,
			platform: process.platform,
			editorName: vscode.env.appName,
			language,
			mode,
			apiProvider: apiConfiguration?.apiProvider,
			modelId: task?.api?.getModel().id,
			diffStrategy: task?.diffStrategy?.getName(),
			isSubtask: task ? !!task.parentTask : undefined,
			cloudIsAuthenticated,
			...(todos && { todos }),
			...gitInfo,
		}
	}

	/**
	 * Handles files dropped from VSCode explorer
	 * @param files Array of file paths
	 */
	public async handleFilesDropped(files: string[]): Promise<void> {
		if (!this.view || files.length === 0) {
			return
		}

		await this.postMessageToWebview({
			type: "filesDropped",
			droppedFiles: files,
		})
	}

	/**
	 * Gets the CodeIndexManager for the current active workspace
	 * @returns CodeIndexManager instance for the current workspace or the default one
	 */
	public getCurrentWorkspaceCodeIndexManager(): CodeIndexManager | undefined {
		return CodeIndexManager.getInstance(this.context)
	}

	/**
	 * Updates the code index status subscription to listen to the current workspace manager
	 */
	private updateCodeIndexStatusSubscription(): void {
		// Get the current workspace manager
		const currentManager = this.getCurrentWorkspaceCodeIndexManager()

		// If the manager hasn't changed, no need to update subscription
		if (currentManager === this.currentWorkspaceManager) {
			return
		}

		// Dispose the old subscription if it exists
		if (this.codeIndexStatusSubscription) {
			this.codeIndexStatusSubscription.dispose()
			this.codeIndexStatusSubscription = undefined
		}

		// Update the current workspace manager reference
		this.currentWorkspaceManager = currentManager

		// Subscribe to the new manager's progress updates if it exists
		if (currentManager) {
			this.codeIndexStatusSubscription = currentManager.onProgressUpdate((update: IndexProgressUpdate) => {
				// Only send updates if this manager is still the current one
				if (currentManager === this.getCurrentWorkspaceCodeIndexManager()) {
					// Get the full status from the manager to ensure we have all fields correctly formatted
					const fullStatus = currentManager.getCurrentStatus()
					this.postMessageToWebview({
						type: "indexingStatusUpdate",
						values: fullStatus,
					})
				}
			})

			if (this.view) {
				this.webviewDisposables.push(this.codeIndexStatusSubscription)
			}

			// Send initial status for the current workspace
			this.postMessageToWebview({
				type: "indexingStatusUpdate",
				values: currentManager.getCurrentStatus(),
			})
		}
	}

	/**
	 * 测试零宽编码解析 - 用于调试
	 */
	public async testZeroWidthDecoding(): Promise<void> {
		// 创建包含零宽编码的测试文本
		const testText =
			"@智能体[GPT-4]​‍⁠‍‍‍‍‍⁠‍‍⁠⁠⁠‍⁠‍‍⁠‍‍‍⁠⁠⁠‍⁠‍⁠‍‍‍‍‍⁠‍⁠‍⁠‍‍‍‍⁠‍⁠⁠‍⁠‍‍⁠⁠‍⁠‍‍‍⁠⁠⁠⁠⁠‍‍‍⁠⁠‍‍⁠⁠⁠‍⁠⁠⁠‍‍‍‍‍⁠⁠⁠‍⁠‍‍‍‍⁠‍⁠⁠‍⁠‍‍⁠⁠‍⁠‍‍‍‍⁠‍‍‍⁠⁠‍‍⁠⁠‍‍‍⁠‍⁠‍⁠⁠⁠⁠⁠‍‍⁠⁠‍‍⁠⁠‍‍⁠‍‍⁠⁠‍‍⁠‍⁠‍‍‍‍‍⁠‍⁠‍‍⁠‍‍⁠‍‍⁠‍‍⁠‍⁠‍⁠‍⁠⁠‍‍⁠‍‍‍‍‍⁠‍⁠‍⁠‍⁠‍‍‍⁠‍‍‍⁠‍⁠‌ 请帮我分析代码"

		this.log("=== 零宽编码测试开始 ===")
		this.log(`测试文本长度: ${testText.length}`)
		this.log(`可见文本: ${testText.replace(/[\u200B-\u200D\u2060]/g, "")}`)

		try {
			// 测试零宽编码解析
			const encodedParams = ZeroWidthEncoder.extractAllFromText(testText)
			this.log(`找到 ${encodedParams.length} 个零宽编码参数`)

			if (encodedParams.length > 0) {
				const params = encodedParams[0].params
				this.log(`解析结果: ${JSON.stringify(params)}`)

				// 测试参数解析
				if (params.targetId) {
					const parts = params.targetId.split("_")
					if (parts.length === 2) {
						const targetUserId = parseInt(parts[0])
						const targetTerminal = parseInt(parts[1])
						this.log(`解析 targetId: userId=${targetUserId}, terminal=${targetTerminal}`)
					}
				}

				if (params.chatType) {
					this.log(`解析 chatType: ${params.chatType}`)
				}
			} else {
				this.log("未找到零宽编码参数")
			}
		} catch (error) {
			this.log(`零宽编码解析失败: ${error}`)
		}

		this.log("=== 零宽编码测试结束 ===")
	}

	// 🔥 智能体多轮对话历史管理
	/**
	 * 获取智能体的对话历史
	 */
	async getAgentConversationHistory(conversationId: string): Promise<any[] | null> {
		try {
			const key = `agentConversation_${conversationId}`
			const history = await this.context.globalState.get<any[]>(key)
			return history || null
		} catch (error) {
			this.log(`Failed to load conversation history for ${conversationId}: ${error}`)
			return null
		}
	}

	/**
	 * 保存智能体的对话历史
	 */
	async saveAgentConversationHistory(conversationId: string, history: any[]): Promise<void> {
		try {
			const key = `agentConversation_${conversationId}`
			await this.context.globalState.update(key, history)
			this.log(`Saved conversation history for ${conversationId}: ${history.length} messages`)
		} catch (error) {
			this.log(`Failed to save conversation history for ${conversationId}: ${error}`)
		}
	}

	/**
	 * 获取模式配置
	 */
	async getModeConfig(modeName: string): Promise<any> {
		try {
			const modes = await this.customModesManager.getCustomModes()

			if (!modes) {
				return null
			}

			// 如果是数组，使用 find
			if (Array.isArray(modes)) {
				return modes.find((mode: any) => mode.slug === modeName) || null
			}

			// 如果是对象（Map形式），尝试直接访问
			if (typeof modes === "object") {
				return modes[modeName] || null
			}

			return null
		} catch (error) {
			// 静默失败，返回 null 让调用方使用默认配置
			return null
		}
	}

	/**
	 * 获取智能体存储服务 (用于VoidBridge触发同步)
	 */
	getAgentStorageService(): EnhancedAgentStorageService | undefined {
		return this.agentManager?.getStorageService()
	}
}

class OrganizationAllowListViolationError extends Error {
	constructor(message: string) {
		super(message)
	}
}
