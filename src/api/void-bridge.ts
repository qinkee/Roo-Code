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
		console.log(`[VoidBridge] getCurrentTerminalNo called, returning: ${VoidBridge.currentTerminalNo}`)
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
		console.log(`[VoidBridge] getCurrentTerminalType called, currentTerminalNo: ${VoidBridge.currentTerminalNo}`)
		const result =
			VoidBridge.currentTerminalNo !== undefined ? (VoidBridge.currentTerminalNo as TerminalType) : undefined
		console.log(`[VoidBridge] getCurrentTerminalType returning: ${result}`)
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
		console.log("[VoidBridge] ===== REGISTER STARTED =====")

		// Try to restore last user ID and terminal number from globalState
		const lastUserId = context.globalState.get<string>("lastUserId")
		const lastTerminalNo = context.globalState.get<number>("lastTerminalNo")
		const lastSkToken = context.globalState.get<string>("lastSkToken")

		console.log("[VoidBridge] Reading from globalState:", {
			lastUserId,
			lastTerminalNo,
			lastTerminalNoType: typeof lastTerminalNo,
			hasSkToken: !!lastSkToken,
		})

		if (lastUserId) {
			VoidBridge.currentUserId = lastUserId
			TaskHistoryBridge.setCurrentUserId(lastUserId)
			console.log("[VoidBridge] Restored last user ID:", lastUserId)
		} else {
			console.log("[VoidBridge] No lastUserId found in globalState")
		}

		if (lastTerminalNo !== undefined) {
			VoidBridge.currentTerminalNo = lastTerminalNo
			console.log("[VoidBridge] Restored last terminal number:", lastTerminalNo)
		} else {
			console.log(
				"[VoidBridge] No lastTerminalNo found in globalState, currentTerminalNo remains:",
				VoidBridge.currentTerminalNo,
			)
		}

		if (lastSkToken) {
			VoidBridge.currentSkToken = lastSkToken
			console.log("[VoidBridge] Restored last SK token (first 10 chars):", lastSkToken.substring(0, 10) + "...")
		} else {
			console.log("[VoidBridge] No lastSkToken found in globalState")
		}

		console.log("[VoidBridge] Initial state after register:", {
			currentUserId: VoidBridge.currentUserId,
			currentTerminalNo: VoidBridge.currentTerminalNo,
			hasSkToken: !!VoidBridge.currentSkToken,
		})

		// Command for void to notify user switch
		const onUserSwitchCommand = vscode.commands.registerCommand(
			"roo-cline.onUserSwitch",
			async (data: { userId: string; userName?: string; terminalNo?: number; terminal?: number; skToken?: string }) => {
				try {
					console.log("[VoidBridge] ===== USER SWITCH STARTED =====")
					console.log("[VoidBridge] Received data:", JSON.stringify(data, null, 2))
					// 第一性原理：
					// - terminalNo: 账号隔离标识，固定为0
					// - terminal: 实际终端类型，需要存储到currentTerminalNo中
					const effectiveTerminalNo = data.terminal !== undefined ? data.terminal : 0

					console.log("[VoidBridge] User switch detected:", {
						newUserId: data.userId,
						previousUserId: VoidBridge.currentUserId,
						userName: data.userName,
						terminalNo: data.terminalNo,
						terminal: data.terminal,
						effectiveTerminalNo: effectiveTerminalNo,
						terminalNoType: typeof data.terminalNo,
						terminalType: typeof data.terminal,
						hasSkToken: !!data.skToken,
					})

					// Save previous user's data if exists
					const previousUserId = VoidBridge.currentUserId
					if (previousUserId) {
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
						console.log(`[VoidBridge] Saving API keys for user ${previousUserId}`)
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
					console.log("[VoidBridge] Updating local tracking...")
					console.log(`[VoidBridge] Setting currentUserId to: ${data.userId}`)
					VoidBridge.currentUserId = data.userId
					console.log(`[VoidBridge] Setting currentTerminalNo to terminal type: ${effectiveTerminalNo}`)
					VoidBridge.currentTerminalNo = effectiveTerminalNo
					if (data.skToken) {
						console.log(`[VoidBridge] Setting currentSkToken (first 10 chars): ${data.skToken.substring(0, 10)}...`)
						VoidBridge.currentSkToken = data.skToken
						await context.globalState.update("lastSkToken", data.skToken)
					}
					await context.globalState.update("lastUserId", data.userId)
					await context.globalState.update("lastTerminalNo", effectiveTerminalNo)
					console.log(
						`[VoidBridge] Saved terminal type ${effectiveTerminalNo} to globalState as lastTerminalNo`,
					)
					TaskHistoryBridge.setCurrentUserId(data.userId)

					// Restore new user's data
					const userContactsKey = VoidBridge.getUserKey("imContacts", data.userId)
					const userContacts = context.globalState.get(userContactsKey)
					if (userContacts) {
						await context.globalState.update("imContacts", userContacts)
						console.log(`[VoidBridge] Restored IM contacts for user ${data.userId}`)
					} else {
						await context.globalState.update("imContacts", undefined)
						console.log(`[VoidBridge] No IM contacts found for user ${data.userId}`)
					}

					// Restore task history
					const userHistoryKey = VoidBridge.getUserKey("taskHistory", data.userId)
					const userHistory = context.globalState.get(userHistoryKey) as HistoryItem[] | undefined
					if (VoidBridge.provider) {
						await VoidBridge.provider.contextProxy.setValue("taskHistory", userHistory || [])
						console.log(`[VoidBridge] Restored ${userHistory?.length || 0} tasks for user ${data.userId}`)
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
					console.log(`[VoidBridge] Restoring API keys for user ${data.userId}`)
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
						console.log(`[VoidBridge] Successfully restored API keys for user ${data.userId}`)
					} else {
						console.log(`[VoidBridge] No saved API keys found for user ${data.userId}`)
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
					}

					// Clear webview cache to force reload of user-specific data
					if (VoidBridge.provider) {
						// Remove current task if any
						await VoidBridge.provider.removeClineFromStack()

						// Update CustomModesManager with new userId and sync from Redis
						if (VoidBridge.provider.customModesManager) {
							VoidBridge.provider.customModesManager.setUserId(data.userId)
							console.log(`[VoidBridge] Updated CustomModesManager userId to ${data.userId}`)
							
							// Force sync modes from Redis for the new user
							await VoidBridge.provider.customModesManager.forceSyncFromRedis()
							console.log(`[VoidBridge] Synced modes from Redis for user ${data.userId}`)
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

					// 通知 void 任务历史已更新（基于新用户）
					const taskHistory = TaskHistoryBridge.getTaskHistory(context)
					await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
						tasks: taskHistory,
						activeTaskId: undefined,
						userId: data.userId,
					})

					console.log("[VoidBridge] User switch completed successfully")

					// Check if this is a cloud PC terminal and send notification
					// effectiveTerminalNo contains the actual terminal type (data.terminal)
					if (effectiveTerminalNo === 3) {
						// 3 = CLOUD_PC
						console.log(
							"[VoidBridge] Cloud PC terminal detected (terminalType=3), triggering startup notification",
						)

						// Delay a bit to ensure MCP is ready
						setTimeout(async () => {
							try {
								await vscode.commands.executeCommand("roo-cline.sendCloudPCNotification")
								console.log("[VoidBridge] Cloud PC notification command executed")
							} catch (error) {
								console.error("[VoidBridge] Failed to send cloud PC notification:", error)
							}
						}, 3000) // Wait 3 seconds for MCP to be ready
					}

					// 验证最终状态
					console.log("[VoidBridge] ===== USER SWITCH COMPLETED =====")
					console.log("[VoidBridge] Final state verification:", {
						currentUserId: VoidBridge.currentUserId,
						currentTerminalNo: VoidBridge.currentTerminalNo,
						expectedUserId: data.userId,
						expectedTerminalNo: effectiveTerminalNo,
					})
					console.log("[VoidBridge] Calling getCurrentTerminalNo() for verification:")
					const verifyTerminalNo = VoidBridge.getCurrentTerminalNo()
					console.log("[VoidBridge] Verification result:", verifyTerminalNo)

					return { success: true, message: "User switched successfully" }
				} catch (error) {
					console.error("[VoidBridge] Error switching user:", error)
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
					console.log("[VoidBridge] User logout detected:", {
						userId: data.userId,
						isLoggedOut: data.isLoggedOut,
					})

					// Clear local tracking
					const previousUserId = VoidBridge.currentUserId
					VoidBridge.currentUserId = undefined
					VoidBridge.currentTerminalNo = undefined
					TaskHistoryBridge.setCurrentUserId(undefined)

					// Clear lastUserId and lastTerminalNo from storage
					await context.globalState.update("lastUserId", undefined)
					await context.globalState.update("lastTerminalNo", undefined)

					// Clear user data from display (but keep in user-specific storage)
					await context.globalState.update("imContacts", undefined)

					console.log("[VoidBridge] User logout - clearing display data")

					// Save current user's data before logout if user exists
					if (previousUserId && VoidBridge.provider) {
						// Save current user's API keys before clearing
						console.log(`[VoidBridge] Saving API keys for user ${previousUserId} before logout`)
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
					console.log("[VoidBridge] Clearing current API keys...")
					for (const key of SECRET_STATE_KEYS) {
						try {
							await context.secrets.delete(key)
						} catch (error) {
							console.debug(`[VoidBridge] Could not clear secret ${key}:`, error)
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

						console.log("[VoidBridge] All API keys, secrets and provider state cleared")
					}

					// 通知 void 任务历史已清空
					try {
						await vscode.commands.executeCommand("void.onTaskHistoryUpdated", {
							tasks: [],
							activeTaskId: undefined,
							userId: undefined,
						})
						console.log("[VoidBridge] Notified void that task history is cleared")
					} catch (error) {
						// void might not be listening, that's ok
						console.debug("[VoidBridge] Could not notify void about cleared task history:", error)
					}

					console.log("[VoidBridge] User logout handled, reset to default config and welcome screen")
					return { success: true, message: "User logged out successfully" }
				} catch (error) {
					console.error("[VoidBridge] Error handling user logout:", error)
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
						console.log("[VoidBridge] Auto-switched to user:", data.userId)
					}

					console.log("[VoidBridge] Received updateImContacts command with data:", {
						userId: userId,
						friendsCount: data?.friends?.length || 0,
						groupsCount: data?.groups?.length || 0,
						sampleFriend: data?.friends?.[0],
						sampleGroup: data?.groups?.[0],
					})

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
						console.log(`[VoidBridge] Updated IM contacts for user ${userId}`)
					}

					// Also update the general key for current display
					await context.globalState.update("imContacts", contactsData)

					console.log("[VoidBridge] Successfully updated IM contacts in globalState")
					return { success: true, message: "Contacts updated successfully" }
				} catch (error) {
					console.error("[VoidBridge] Error updating IM contacts:", error)
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
