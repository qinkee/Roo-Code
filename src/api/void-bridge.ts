import * as vscode from "vscode"
import { ClineProvider } from "../core/webview/ClineProvider"
import { TaskHistoryBridge } from "./task-history-bridge"
import { SECRET_STATE_KEYS, type ProviderName, type HistoryItem } from "@roo-code/types"
import { TerminalType } from "../types/terminal"

/**
 * Bridge for communication between void renderer process and Roo-Code extension
 * This allows void to update globalState with data from __VUE_STORE__
 */
export class VoidBridge {
	private static currentUserId: string | undefined = undefined
	private static currentTerminalNo: number | undefined = undefined
	private static currentSkToken: string | undefined = undefined
	private static provider: ClineProvider | undefined = undefined

	/**
	 * Set the ClineProvider instance for notifications
	 */
	static setProvider(provider: ClineProvider) {
		VoidBridge.provider = provider

		// 启动时自动触发智能体同步（如果有当前用户）
		if (VoidBridge.currentUserId) {

			// 延迟执行，确保 provider 和 agentManager 完全初始化
			setTimeout(async () => {
				try {

					const agentStorage = VoidBridge.provider?.getAgentStorageService()

					if (agentStorage && "syncOnUserLogin" in agentStorage) {
						await (agentStorage as any).syncOnUserLogin(VoidBridge.currentUserId)
					} else {
						if (agentStorage) {
						}
					}
				} catch (error) {
				}
			}, 2000) // 等待2秒，确保所有服务都已初始化
		} else {
		}
	}

	/**
	 * Get the current user ID
	 */
	static getCurrentUserId(): string | undefined {
		return VoidBridge.currentUserId
	}

	/**
	 * Get the current terminal type (stored in currentTerminalNo for backward compatibility)
	 * @returns 终端类型：0-傻蛋网页端, 1-傻蛋精灵App, 2-我的电脑(VSCode), 3-我的云电脑, 4-傻蛋浏览器插件, 5-MCP端
	 */
	static getCurrentTerminalNo(): number | undefined {
		return VoidBridge.currentTerminalNo
	}

	/**
	 * Get the current SK token
	 */
	static getCurrentSkToken(): string | undefined {
		return VoidBridge.currentSkToken
	}

	/**
	 * Get the current terminal type as enum
	 */
	static getCurrentTerminalType(): TerminalType | undefined {
		const result =
			VoidBridge.currentTerminalNo !== undefined ? (VoidBridge.currentTerminalNo as TerminalType) : undefined
		return result
	}

	/**
	 * Get storage key with user prefix
	 */
	private static getUserKey(baseKey: string, userId?: string): string {
		const id = userId || VoidBridge.currentUserId
		return id ? `user_${id}_${baseKey}` : baseKey
	}

	/**
	 * Register commands for void to update globalState
	 */
	static register(context: vscode.ExtensionContext) {

		// Try to restore last user ID and terminal number from globalState
		const lastUserId = context.globalState.get<string>("lastUserId")
		const lastTerminalNo = context.globalState.get<number>("lastTerminalNo")
		const lastSkToken = context.globalState.get<string>("lastSkToken")


		if (lastUserId) {
			VoidBridge.currentUserId = lastUserId
			TaskHistoryBridge.setCurrentUserId(lastUserId)
		} else {
		}

		if (lastTerminalNo !== undefined) {
			VoidBridge.currentTerminalNo = lastTerminalNo
		} else {
		}

		if (lastSkToken) {
			VoidBridge.currentSkToken = lastSkToken
		} else {
		}


		// Command for void to notify user switch
		const onUserSwitchCommand = vscode.commands.registerCommand(
			"roo-cline.onUserSwitch",
			async (data: {
				userId: string
				userName?: string
				terminalNo?: number
				terminal?: number
				skToken?: string
			}) => {
				try {
					// 第一性原理：
					// - terminalNo: 账号隔离标识，固定为0
					// - terminal: 实际终端类型，需要存储到currentTerminalNo中
					const effectiveTerminalNo = data.terminal !== undefined ? data.terminal : 0


					// === 🔥 切换前清理旧用户资源（异步，不阻塞主流程） ===
					const previousUserId = VoidBridge.currentUserId
					if (previousUserId) {
						// 🚀 优化：异步停止智能体和断开IM连接，不阻塞用户切换
						Promise.all([
							// 1. 停止所有运行中的智能体
							(async () => {
								try {
									const { A2AServerManager } = require("../core/agent/A2AServerManager")
									const serverManager = A2AServerManager.getInstance()
									const runningAgents = serverManager.getRunningServers()

									if (runningAgents.length > 0) {
										await serverManager.stopAllServers()
									}
								} catch (error) {
								}
							})(),

							// 2. 断开IM WebSocket连接
							(async () => {
								try {
									const llmService = (global as any).llmStreamService
									if (llmService?.imConnection?.isConnected) {
										llmService.imConnection.disconnect(true)
										llmService.resetConnectionState()
									}
								} catch (error) {
								}
							})(),
						]).catch((error) => {
						})

						// === 保存旧用户数据 ===
						// Save current IM contacts to user-specific key
						const currentContacts = context.globalState.get("imContacts")
						if (currentContacts) {
							const userKey = VoidBridge.getUserKey("imContacts", previousUserId)
							await context.globalState.update(userKey, currentContacts)
						}

						// Save current task history to user-specific key
						if (VoidBridge.provider) {
							const currentHistory = VoidBridge.provider.contextProxy.getValue("taskHistory")
							if (currentHistory) {
								const historyKey = VoidBridge.getUserKey("taskHistory", previousUserId)
								await context.globalState.update(historyKey, currentHistory)
							}
						}

						// Save current API keys to user-specific secrets
						for (const key of SECRET_STATE_KEYS) {
							try {
								const value = await context.secrets.get(key)
								if (value) {
									const userKey = VoidBridge.getUserKey(key, previousUserId)
									await context.secrets.store(userKey, value)
								}
							} catch (error) {
								// Silently ignore errors
							}
						}

						// Save provider settings
						if (VoidBridge.provider) {
							const apiProvider = VoidBridge.provider.contextProxy.getValue("apiProvider")
							const currentApiConfig = VoidBridge.provider.contextProxy.getValue("currentApiConfigName")
							if (apiProvider) {
								const providerKey = VoidBridge.getUserKey("apiProvider", previousUserId)
								await context.globalState.update(providerKey, apiProvider)
							}
							if (currentApiConfig) {
								const configKey = VoidBridge.getUserKey("currentApiConfigName", previousUserId)
								await context.globalState.update(configKey, currentApiConfig)
							}
						}
					}

					// Update local tracking
					VoidBridge.currentUserId = data.userId
					VoidBridge.currentTerminalNo = effectiveTerminalNo
					if (data.skToken) {
						VoidBridge.currentSkToken = data.skToken
						await context.globalState.update("lastSkToken", data.skToken)
					}
					await context.globalState.update("lastUserId", data.userId)
					await context.globalState.update("lastTerminalNo", effectiveTerminalNo)
					TaskHistoryBridge.setCurrentUserId(data.userId)

					// Restore new user's data
					const userContactsKey = VoidBridge.getUserKey("imContacts", data.userId)
					const userContacts = context.globalState.get(userContactsKey)
					if (userContacts) {
						await context.globalState.update("imContacts", userContacts)
					} else {
						await context.globalState.update("imContacts", undefined)
					}

					// Restore task history
					const userHistoryKey = VoidBridge.getUserKey("taskHistory", data.userId)
					const userHistory = context.globalState.get(userHistoryKey) as HistoryItem[] | undefined
					if (VoidBridge.provider) {
						await VoidBridge.provider.contextProxy.setValue("taskHistory", userHistory || [])
					}

					// Clear current API keys first
					for (const key of SECRET_STATE_KEYS) {
						try {
							await context.secrets.delete(key)
						} catch (error) {
							// Silently ignore errors
						}
					}

					// Restore user's API keys from user-specific secrets
					let hasRestoredKeys = false
					for (const key of SECRET_STATE_KEYS) {
						try {
							const userKey = VoidBridge.getUserKey(key, data.userId)
							const value = await context.secrets.get(userKey)
							if (value) {
								await context.secrets.store(key, value)
								hasRestoredKeys = true
							}
						} catch (error) {
							// Silently ignore errors
						}
					}

					if (hasRestoredKeys) {
					} else {
					}

					// Restore provider settings
					if (VoidBridge.provider) {
						const providerKey = VoidBridge.getUserKey("apiProvider", data.userId)
						const configKey = VoidBridge.getUserKey("currentApiConfigName", data.userId)

						const apiProvider = context.globalState.get(providerKey) as ProviderName | undefined
						const currentApiConfig = context.globalState.get(configKey) as string | undefined

						if (apiProvider) {
							await VoidBridge.provider.contextProxy.setValue("apiProvider", apiProvider)
						}
						if (currentApiConfig) {
							await VoidBridge.provider.contextProxy.setValue("currentApiConfigName", currentApiConfig)
						}

						// 🚀 优化：异步触发智能体同步，不阻塞UI更新
						;(async () => {
							try {
								const agentStorage = VoidBridge.provider?.getAgentStorageService()
								if (agentStorage && "syncOnUserLogin" in agentStorage) {
									await (agentStorage as any).syncOnUserLogin(data.userId)
								}
							} catch (error) {
							}
						})()
					} else {
					}

					// Clear webview cache to force reload of user-specific data
					if (VoidBridge.provider) {
						// Remove current task if any
						await VoidBridge.provider.removeClineFromStack()

						// Update CustomModesManager with new userId and sync from Redis
						if (VoidBridge.provider.customModesManager) {
							VoidBridge.provider.customModesManager.setUserId(data.userId)

							// Force sync modes from Redis for the new user
							await VoidBridge.provider.customModesManager.forceSyncFromRedis()
						}

						// Notify webview about user change
						await VoidBridge.provider.postMessageToWebview({
							type: "userSwitched",
							userId: data.userId,
							userName: data.userName,
							terminalNo: data.terminalNo,
						})

						// Update webview state after mode sync (ensures correct mode selection)
						await VoidBridge.provider.postStateToWebview()

						// Send IM contacts to webview
						if (userContacts) {
							await VoidBridge.provider.postMessageToWebview({
								type: "imContactsResponse",
								contacts: userContacts as {
									friends: Array<{
										id: number
										nickName: string
										headImage?: string
										online?: boolean
										onlineWeb?: boolean
										onlineApp?: boolean
										deleted?: boolean
									}>
									groups: Array<{
										id: number
										name: string
										showGroupName?: string
										headImage?: string
										ownerId?: number
										notice?: string
									}>
								},
							})
						}

						// Refresh state
						await VoidBridge.provider.postStateToWebview()
					}

					// 🚀 优化：异步为新用户建立连接和启动智能体
					;(async () => {
						try {
							// 1. 设置新用户的 TokenKey 并重新连接IM WebSocket
							if (data.skToken) {

								const {
									ImPlatformTokenManager,
								} = require("../services/im-platform/ImPlatformTokenManager")
								const tokenManager = ImPlatformTokenManager.getInstance()
								await tokenManager.setTokenKey(data.skToken, true)

								const llmService = (global as any).llmStreamService
								if (llmService?.handlersRegistered) {
									await llmService.initialize()
								}
							}

							// 2. 自动启动新用户的已发布智能体
							const { A2AServerManager } = require("../core/agent/A2AServerManager")
							const serverManager = A2AServerManager.getInstance()

							const result = await serverManager.startAllPublishedAgents()
						} catch (error) {
						}
					})()

					// 通知 void 任务历史已更新（基于新用户）
					const taskHistory = await TaskHistoryBridge.getTaskHistory(context)
					// Filter out agent tasks - only sync user tasks to void
					const userTasks = taskHistory.filter((task) => task.source !== "agent")
					await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
						tasks: userTasks,
						activeTaskId: undefined,
						userId: data.userId,
					})


					// 🚀 优化：异步发送Cloud PC通知
					if (effectiveTerminalNo === 3) {
						;(async () => {
							try {
								await new Promise((resolve) => setTimeout(resolve, 3000))
								await vscode.commands.executeCommand("roo-cline.sendCloudPCNotification")
							} catch (error) {
							}
						})()
					}

					// 验证最终状态
					const verifyTerminalNo = VoidBridge.getCurrentTerminalNo()

					return { success: true, message: "User switched successfully" }
				} catch (error) {
					throw error
				}
			},
		)

		context.subscriptions.push(onUserSwitchCommand)

		// Command for void to notify user logout
		const onUserLogoutCommand = vscode.commands.registerCommand(
			"roo-cline.onUserLogout",
			async (data: { userId?: string; isLoggedOut: boolean }) => {
				try {

					// === 🔥 用户登出前的资源清理 ===
					const previousUserId = VoidBridge.currentUserId

					// 1. 停止所有运行中的智能体
					try {
						const { A2AServerManager } = require("../core/agent/A2AServerManager")
						const serverManager = A2AServerManager.getInstance()
						const runningAgents = serverManager.getRunningServers()

						if (runningAgents.length > 0) {
							// 获取智能体名称用于通知
							const agentNames: string[] = []
							for (const agentId of runningAgents) {
								try {
									const config = await serverManager.getAgentConfig(agentId)
									if (config) {
										agentNames.push(config.name || agentId)
									}
								} catch (err) {
									agentNames.push(agentId)
								}
							}


							// 停止所有运行中的智能体
							await serverManager.stopAllServers()
						}
					} catch (error) {
						// 错误不阻塞登出流程
					}

					// 2. 清除 TokenKey
					try {
						const { ImPlatformTokenManager } = require("../services/im-platform/ImPlatformTokenManager")
						const tokenManager = ImPlatformTokenManager.getInstance()
						await tokenManager.clearTokenKey()
					} catch (error) {
						// 错误不阻塞登出流程
					}

					// 3. 断开IM WebSocket连接（阻止自动重连）
					try {
						const llmService = (global as any).llmStreamService

						if (llmService?.imConnection) {
							llmService.imConnection.disconnect(true) // 传入 true 阻止自动重连
							llmService.resetConnectionState() // 重置连接状态
						} else {
						}
					} catch (error) {
						// 错误不阻塞登出流程
					}

					// === 清除用户状态 ===
					VoidBridge.currentUserId = undefined
					VoidBridge.currentTerminalNo = undefined
					TaskHistoryBridge.setCurrentUserId(undefined)

					// Clear lastUserId and lastTerminalNo from storage
					await context.globalState.update("lastUserId", undefined)
					await context.globalState.update("lastTerminalNo", undefined)

					// Clear user data from display (but keep in user-specific storage)
					await context.globalState.update("imContacts", undefined)


					// Save current user's data before logout if user exists
					if (previousUserId && VoidBridge.provider) {
						// Save current user's API keys before clearing
						for (const key of SECRET_STATE_KEYS) {
							try {
								const value = await context.secrets.get(key)
								if (value) {
									const userKey = VoidBridge.getUserKey(key, previousUserId)
									await context.secrets.store(userKey, value)
								}
							} catch (error) {
								// Silently ignore errors
							}
						}

						// Save provider settings
						const apiProvider = VoidBridge.provider.contextProxy.getValue("apiProvider")
						const currentApiConfig = VoidBridge.provider.contextProxy.getValue("currentApiConfigName")
						if (apiProvider) {
							const providerKey = VoidBridge.getUserKey("apiProvider", previousUserId)
							await context.globalState.update(providerKey, apiProvider)
						}
						if (currentApiConfig) {
							const configKey = VoidBridge.getUserKey("currentApiConfigName", previousUserId)
							await context.globalState.update(configKey, currentApiConfig)
						}
					}

					// Clear all API keys from current use
					for (const key of SECRET_STATE_KEYS) {
						try {
							await context.secrets.delete(key)
						} catch (error) {
						}
					}

					if (VoidBridge.provider) {
						// Clear provider settings - MUST clear all provider-related state
						await VoidBridge.provider.contextProxy.setValue("apiProvider", undefined)
						await VoidBridge.provider.contextProxy.setValue("currentApiConfigName", undefined)
						await VoidBridge.provider.contextProxy.setValue("listApiConfigMeta", [])

						// Clear all provider configuration fields to ensure no cached values remain
						const providerFields = [
							"apiModelId",
							"apiBaseUrl",
							"apiModelInfo",
							"awsRegion",
							"awsProfile",
							"vertexProjectId",
							"vertexRegion",
							"ollamaModelIds",
							"lmStudioModelIds",
							"openAiBaseUrl",
							"openAiHeaders",
							"openAiModelIds",
							"openAiStreamingEnabled",
							"anthropicBaseUrl",
							"anthropicHeaders",
							"vsCodeLmModelSelector",
						]

						for (const field of providerFields) {
							await VoidBridge.provider.contextProxy.setValue(field as any, undefined)
						}

						// Clear task history display
						await VoidBridge.provider.contextProxy.setValue("taskHistory", [])

						// IMPORTANT: Clear any active task that might be using the old API keys
						const currentTask = VoidBridge.provider.getCurrentCline()
						if (currentTask) {
							// Force abort any running task to prevent it from using old credentials
							await currentTask.abortTask()
						}

						// Remove current task
						await VoidBridge.provider.removeClineFromStack()

						// Force refresh provider settings to ensure cached values are cleared
						await VoidBridge.provider.contextProxy.refreshSecrets()

						// 通知 webview 用户已登出
						await VoidBridge.provider.postMessageToWebview({
							type: "userLoggedOut",
							userId: "",
						})

						// Send empty IM contacts to webview
						await VoidBridge.provider.postMessageToWebview({
							type: "imContactsResponse",
							contacts: {
								friends: [],
								groups: [],
							},
						})

						// Refresh state to show welcome page
						await VoidBridge.provider.postStateToWebview()

					}

					// 通知 void 任务历史已清空
					try {
						await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
							tasks: [],
							activeTaskId: undefined,
							userId: undefined,
						})
					} catch (error) {
						// void might not be listening, that's ok
					}

					return { success: true, message: "User logged out successfully" }
				} catch (error) {
					throw error
				}
			},
		)

		context.subscriptions.push(onUserLogoutCommand)

		// Command for void to update IM contacts with user context
		const updateImContactsCommand = vscode.commands.registerCommand(
			"roo-cline.updateImContacts",
			async (data: { friends: any[]; groups: any[]; userId?: string }) => {
				try {
					// Use provided userId or current userId
					const userId = data.userId || VoidBridge.currentUserId

					// If userId is provided but not current, update current user
					if (data.userId && data.userId !== VoidBridge.currentUserId) {
						VoidBridge.currentUserId = data.userId
						await context.globalState.update("lastUserId", data.userId)
						TaskHistoryBridge.setCurrentUserId(data.userId)
					}


					// Update globalState with user-specific key
					const contactsData = {
						friends: data.friends || [],
						groups: data.groups || [],
						lastUpdated: Date.now(),
					}

					// Store with user-specific key if userId is available
					if (userId) {
						const userKey = VoidBridge.getUserKey("imContacts", userId)
						await context.globalState.update(userKey, contactsData)
					}

					// Also update the general key for current display
					await context.globalState.update("imContacts", contactsData)

					return { success: true, message: "Contacts updated successfully" }
				} catch (error) {
					throw error
				}
			},
		)

		context.subscriptions.push(updateImContactsCommand)

		// Command to get current IM contacts (for debugging)
		const getImContactsCommand = vscode.commands.registerCommand("roo-cline.getImContacts", async () => {
			// Try to get user-specific contacts first
			if (VoidBridge.currentUserId) {
				const userKey = VoidBridge.getUserKey("imContacts")
				const userContacts = context.globalState.get(userKey)
				if (userContacts) {
					console.log(`Current IM contacts for user ${VoidBridge.currentUserId}:`, userContacts)
					return userContacts
				}
			}

			// Fallback to general contacts
			const imContacts = context.globalState.get("imContacts")
			console.log("Current IM contacts in globalState:", imContacts)
			return imContacts
		})

		context.subscriptions.push(getImContactsCommand)

		// Command to get current user ID
		const getCurrentUserCommand = vscode.commands.registerCommand("roo-cline.getCurrentUser", async () => {
			return {
				userId: VoidBridge.currentUserId,
			}
		})

		context.subscriptions.push(getCurrentUserCommand)
	}
}
