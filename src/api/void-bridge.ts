import * as vscode from "vscode"
import { ClineProvider } from "../core/webview/ClineProvider"
import { TaskHistoryBridge } from "./task-history-bridge"

/**
 * Bridge for communication between void renderer process and Roo-Code extension
 * This allows void to update globalState with data from __VUE_STORE__
 */
export class VoidBridge {
	private static currentUserId: string | undefined = undefined
	private static provider: ClineProvider | undefined = undefined

	/**
	 * Set the ClineProvider instance for notifications
	 */
	static setProvider(provider: ClineProvider) {
		VoidBridge.provider = provider
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
		// Try to restore last user ID from globalState
		const lastUserId = context.globalState.get<string>("lastUserId")
		if (lastUserId) {
			VoidBridge.currentUserId = lastUserId
			TaskHistoryBridge.setCurrentUserId(lastUserId)
			console.log("[VoidBridge] Restored last user ID:", lastUserId)
		}

		// Command for void to notify user switch
		const onUserSwitchCommand = vscode.commands.registerCommand(
			"roo-cline.onUserSwitch",
			async (data: { userId: string; userName?: string }) => {
				try {
					console.log("[VoidBridge] User switch detected:", {
						newUserId: data.userId,
						previousUserId: VoidBridge.currentUserId,
						userName: data.userName,
					})

					// Store current user ID
					const previousUserId = VoidBridge.currentUserId
					VoidBridge.currentUserId = data.userId

					// Persist user ID to globalState
					await context.globalState.update("lastUserId", data.userId)

					// Sync user ID with TaskHistoryBridge
					TaskHistoryBridge.setCurrentUserId(data.userId)

					// Clear webview cache to force reload of user-specific data
					if (VoidBridge.provider) {
						// 如果当前有任务打开，先关闭它
						await VoidBridge.provider.removeClineFromStack()

						// Notify webview about user change
						await VoidBridge.provider.postMessageToWebview({
							type: "userSwitched",
							userId: data.userId,
							userName: data.userName,
						})

						// 刷新状态，这会重新加载该用户的任务历史
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

					// 清空当前用户ID
					VoidBridge.currentUserId = undefined
					await context.globalState.update("lastUserId", undefined)

					// 清空TaskHistoryBridge的用户ID
					TaskHistoryBridge.setCurrentUserId(undefined)

					if (VoidBridge.provider) {
						// 清空当前任务，显示欢迎页面
						await VoidBridge.provider.removeClineFromStack()

						// 重置到默认配置
						await vscode.commands.executeCommand("roo-cline.switchToDefaultConfig")

						// 通知 webview 用户已登出
						await VoidBridge.provider.postMessageToWebview({
							type: "userLoggedOut",
							userId: "",
						})

						// 刷新状态
						await VoidBridge.provider.postStateToWebview()
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

					// Also update the general key for backward compatibility
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
