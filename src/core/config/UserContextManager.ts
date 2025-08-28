import * as vscode from "vscode"
import { ContextProxy } from "./ContextProxy"
import { ProviderSettingsManager } from "./ProviderSettingsManager"
import { CustomModesManager } from "./CustomModesManager"
import { type HistoryItem, type ProviderSettings, type GlobalSettings, type RooCodeSettings } from "@roo-code/types"

/**
 * User context containing all user-specific data and settings
 */
export interface UserContext {
	userId: string
	userName?: string
	contextProxy: ContextProxy
	isDefault: boolean
	createdAt: number
	lastActiveAt: number
}

/**
 * Manages user contexts and handles context switching
 * Ensures complete isolation between different users
 */
export class UserContextManager {
	private static instance: UserContextManager
	private contexts: Map<string, UserContext> = new Map()
	private currentContext: UserContext | null = null
	private defaultContext: UserContext | null = null
	private extensionContext: vscode.ExtensionContext
	private provider: any // ClineProvider reference

	private constructor(extensionContext: vscode.ExtensionContext) {
		this.extensionContext = extensionContext
	}

	/**
	 * Get singleton instance
	 */
	static getInstance(extensionContext?: vscode.ExtensionContext): UserContextManager {
		if (!UserContextManager.instance) {
			if (!extensionContext) {
				throw new Error("Extension context required for first initialization")
			}
			UserContextManager.instance = new UserContextManager(extensionContext)
		}
		return UserContextManager.instance
	}

	/**
	 * Set the provider reference
	 */
	setProvider(provider: any) {
		this.provider = provider
	}

	/**
	 * Initialize the manager and restore last user
	 */
	async initialize(): Promise<UserContext> {
		console.log("[UserContextManager] Initializing...")

		// Create default context
		this.defaultContext = await this.createDefaultContext()

		// Check if there's a last user to restore
		const lastUserId = this.extensionContext.globalState.get<string>("lastUserId")

		if (lastUserId) {
			console.log(`[UserContextManager] Restoring last user: ${lastUserId}`)
			try {
				return await this.switchUser(lastUserId)
			} catch (error) {
				console.error(`[UserContextManager] Failed to restore user ${lastUserId}:`, error)
			}
		}

		// Use default context
		this.currentContext = this.defaultContext
		return this.defaultContext
	}

	/**
	 * Get current context
	 */
	getCurrentContext(): UserContext | null {
		return this.currentContext
	}

	/**
	 * Get current user ID
	 */
	getCurrentUserId(): string | undefined {
		return this.currentContext?.isDefault ? undefined : this.currentContext?.userId
	}

	/**
	 * Switch to a different user
	 */
	async switchUser(userId: string, userName?: string): Promise<UserContext> {
		console.log(`[UserContextManager] Switching to user: ${userId}`)

		// Save current context if it exists and is not default
		if (this.currentContext && !this.currentContext.isDefault) {
			await this.saveContext(this.currentContext)
		}

		// Load or create user context
		let context = this.contexts.get(userId)
		if (!context) {
			context = await this.loadOrCreateUserContext(userId, userName)
			this.contexts.set(userId, context)
		}

		// Update last active time
		context.lastActiveAt = Date.now()
		if (userName && context.userName !== userName) {
			context.userName = userName
		}

		// Apply context
		this.currentContext = context
		await this.applyContext(context)

		// Save last user ID
		await this.extensionContext.globalState.update("lastUserId", userId)

		console.log(`[UserContextManager] Switched to user ${userId}`)
		return context
	}

	/**
	 * Logout current user and switch to default context
	 */
	async logout(): Promise<UserContext> {
		console.log("[UserContextManager] Logging out...")

		// Save current user context if exists
		if (this.currentContext && !this.currentContext.isDefault) {
			await this.saveContext(this.currentContext)

			// Remove from active contexts (but keep data in storage)
			const userId = this.currentContext.userId
			this.contexts.delete(userId)
		}

		// Clear last user ID
		await this.extensionContext.globalState.update("lastUserId", undefined)

		// Switch to default context
		if (!this.defaultContext) {
			this.defaultContext = await this.createDefaultContext()
		}

		this.currentContext = this.defaultContext
		await this.applyContext(this.defaultContext)

		console.log("[UserContextManager] Logged out, switched to default context")
		return this.defaultContext
	}

	/**
	 * Create default context for anonymous/logged-out state
	 */
	private async createDefaultContext(): Promise<UserContext> {
		console.log("[UserContextManager] Creating default context...")

		// Create a new ContextProxy for default user
		const contextProxy = new ContextProxy(this.extensionContext, undefined)
		await contextProxy.initialize()

		// Reset to default values
		await contextProxy.resetToDefaults()

		const context: UserContext = {
			userId: "default",
			userName: "Anonymous",
			contextProxy,
			isDefault: true,
			createdAt: Date.now(),
			lastActiveAt: Date.now(),
		}

		return context
	}

	/**
	 * Load or create user context
	 */
	private async loadOrCreateUserContext(userId: string, userName?: string): Promise<UserContext> {
		console.log(`[UserContextManager] Loading/creating context for user ${userId}`)

		// Create a new ContextProxy for this user
		const contextProxy = new ContextProxy(this.extensionContext, userId)
		await contextProxy.initialize()

		// Try to load existing user data
		const hasExistingData = await contextProxy.loadUserState()

		if (!hasExistingData) {
			console.log(`[UserContextManager] No existing data for user ${userId}, creating new context`)
			// Initialize with defaults if no existing data
			await contextProxy.resetToDefaults()
		}

		const context: UserContext = {
			userId,
			userName,
			contextProxy,
			isDefault: false,
			createdAt: hasExistingData ? 0 : Date.now(), // 0 means unknown creation time
			lastActiveAt: Date.now(),
		}

		return context
	}

	/**
	 * Save user context to storage
	 */
	private async saveContext(context: UserContext): Promise<void> {
		if (context.isDefault) {
			console.log("[UserContextManager] Skipping save for default context")
			return
		}

		console.log(`[UserContextManager] Saving context for user ${context.userId}`)
		await context.contextProxy.saveUserState()
	}

	/**
	 * Apply context to the system
	 */
	private async applyContext(context: UserContext): Promise<void> {
		console.log(`[UserContextManager] Applying context for user ${context.isDefault ? "default" : context.userId}`)

		// The context's ContextProxy is already configured with the right data
		// Now we need to notify the provider to use this context

		if (this.provider) {
			// Update provider's context proxy reference
			await this.provider.switchContextProxy(context.contextProxy)
		}
	}

	/**
	 * Clear all user contexts (for debugging/reset)
	 */
	async clearAllContexts(): Promise<void> {
		console.log("[UserContextManager] Clearing all contexts...")

		// Save current context
		if (this.currentContext && !this.currentContext.isDefault) {
			await this.saveContext(this.currentContext)
		}

		// Clear contexts map
		this.contexts.clear()

		// Switch to default
		await this.logout()
	}

	/**
	 * Get all user IDs that have saved data
	 */
	async getAllUserIds(): Promise<string[]> {
		// This would scan globalState for all user_* prefixed keys
		// For now, return empty array
		return []
	}
}
