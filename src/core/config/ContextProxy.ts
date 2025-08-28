import * as vscode from "vscode"
import { ZodError } from "zod"

import {
	PROVIDER_SETTINGS_KEYS,
	GLOBAL_SETTINGS_KEYS,
	SECRET_STATE_KEYS,
	GLOBAL_STATE_KEYS,
	type ProviderSettings,
	type GlobalSettings,
	type SecretState,
	type GlobalState,
	type RooCodeSettings,
	providerSettingsSchema,
	globalSettingsSchema,
	isSecretStateKey,
} from "@roo-code/types"
import { TelemetryService } from "@roo-code/telemetry"

import { logger } from "../../utils/logging"

type GlobalStateKey = keyof GlobalState
type SecretStateKey = keyof SecretState
type RooCodeSettingsKey = keyof RooCodeSettings

const PASS_THROUGH_STATE_KEYS = ["taskHistory", "imContacts"]

export const isPassThroughStateKey = (key: string) => PASS_THROUGH_STATE_KEYS.includes(key)

const globalSettingsExportSchema = globalSettingsSchema.omit({
	taskHistory: true,
	listApiConfigMeta: true,
	currentApiConfigName: true,
})

// Keys that should always be shared across all users
const SHARED_STATE_KEYS = [
	"language",
	"telemetrySetting",
	"machineId",
	"organizationAllowList",
	"organizationSettingsVersion",
]

// Keys that should be isolated per user
const USER_ISOLATED_KEYS = [
	"taskHistory",
	"imContacts",
	"currentApiConfigName",
	"listApiConfigMeta",
	"pinnedApiConfigs",
	"customInstructions",
	"autoApprovalEnabled",
	"alwaysAllowReadOnly",
	"alwaysAllowWrite",
	"alwaysAllowBrowser",
	"alwaysAllowMcp",
	"alwaysAllowExecute",
	"allowedCommands",
	"deniedCommands",
	"modeApiConfigs",
	"customModes",
	"customModePrompts",
	"customSupportPrompts",
	"codebaseIndexConfig",
]

export class ContextProxy {
	private readonly originalContext: vscode.ExtensionContext
	private readonly userId?: string
	private readonly statePrefix: string

	private stateCache: GlobalState
	private secretCache: SecretState
	private _isInitialized = false

	constructor(context: vscode.ExtensionContext, userId?: string) {
		this.originalContext = context
		this.userId = userId
		this.statePrefix = userId ? `user_${userId}_` : "default_"
		this.stateCache = {}
		this.secretCache = {}
		this._isInitialized = false
	}

	public get isInitialized() {
		return this._isInitialized
	}

	public async initialize() {
		// Load state based on user context
		for (const key of GLOBAL_STATE_KEYS) {
			try {
				if (this.shouldUseUserPrefix(key)) {
					// Load user-specific value
					const prefixedKey = this.getPrefixedKey(key)
					const userValue = this.originalContext.globalState.get(prefixedKey)
					if (userValue !== undefined) {
						this.stateCache[key] = userValue as any
					} else {
						// No user-specific value, use default
						this.stateCache[key] = this.getDefaultValue(key)
					}
				} else {
					// Load shared value
					this.stateCache[key] = this.originalContext.globalState.get(key)
				}
			} catch (error) {
				logger.error(`Error loading ${key}: ${error instanceof Error ? error.message : String(error)}`)
			}
		}

		// Load secrets (user-specific)
		const promises = SECRET_STATE_KEYS.map(async (key) => {
			try {
				if (this.userId) {
					// Try user-specific secret first
					const prefixedKey = this.getPrefixedKey(key)
					const userSecret = await this.originalContext.secrets.get(prefixedKey)
					if (userSecret) {
						this.secretCache[key] = userSecret
					} else {
						// Fallback to shared secret for backward compatibility
						this.secretCache[key] = await this.originalContext.secrets.get(key)
					}
				} else {
					// Default context uses shared secrets
					this.secretCache[key] = await this.originalContext.secrets.get(key)
				}
			} catch (error) {
				logger.error(`Error loading secret ${key}: ${error instanceof Error ? error.message : String(error)}`)
			}
		})

		await Promise.all(promises)

		this._isInitialized = true
	}

	/**
	 * Load user state from storage
	 * @returns true if user data exists, false otherwise
	 */
	public async loadUserState(): Promise<boolean> {
		let hasData = false

		for (const key of GLOBAL_STATE_KEYS) {
			if (this.shouldUseUserPrefix(key)) {
				const prefixedKey = this.getPrefixedKey(key)
				const value = this.originalContext.globalState.get(prefixedKey)
				if (value !== undefined) {
					this.stateCache[key] = value as any
					hasData = true
				}
			}
		}

		return hasData
	}

	/**
	 * Save user state to storage
	 */
	public async saveUserState(): Promise<void> {
		const promises: Promise<void>[] = []

		for (const key of GLOBAL_STATE_KEYS) {
			if (this.shouldUseUserPrefix(key) && this.stateCache[key] !== undefined) {
				const prefixedKey = this.getPrefixedKey(key)
				promises.push(
					this.originalContext.globalState.update(prefixedKey, this.stateCache[key]) as Promise<void>,
				)
			}
		}

		// Save user-specific secrets
		for (const key of SECRET_STATE_KEYS) {
			if (this.secretCache[key] !== undefined) {
				const prefixedKey = this.getPrefixedKey(key)
				promises.push(
					this.originalContext.secrets.store(prefixedKey, this.secretCache[key] as string) as Promise<void>,
				)
			}
		}

		await Promise.all(promises)
	}

	/**
	 * Reset to default values
	 */
	public async resetToDefaults(): Promise<void> {
		this.stateCache = {}
		this.secretCache = {}

		// Set default values for important keys
		for (const key of GLOBAL_STATE_KEYS) {
			if (this.shouldUseUserPrefix(key)) {
				this.stateCache[key] = this.getDefaultValue(key)
			}
		}

		await this.saveUserState()
	}

	private shouldUseUserPrefix(key: string): boolean {
		// Shared keys don't use user prefix
		if (SHARED_STATE_KEYS.includes(key)) {
			return false
		}
		// User isolated keys always use prefix
		if (USER_ISOLATED_KEYS.includes(key)) {
			return true
		}
		// Default: use prefix for user context
		return true
	}

	private getPrefixedKey(key: string): string {
		return `${this.statePrefix}${key}`
	}

	private getDefaultValue(key: string): any {
		// Return appropriate default values
		const defaults: Partial<GlobalState> = {
			taskHistory: [],
			imContacts: undefined,
			currentApiConfigName: undefined,
			listApiConfigMeta: [],
			pinnedApiConfigs: {},
			customInstructions: undefined,
			autoApprovalEnabled: false,
			alwaysAllowReadOnly: false,
			alwaysAllowWrite: false,
			alwaysAllowBrowser: false,
			alwaysAllowMcp: false,
			alwaysAllowExecute: false,
			allowedCommands: [],
			deniedCommands: [],
			customModes: [],
		}
		return defaults[key as keyof GlobalState]
	}

	public get extensionUri() {
		return this.originalContext.extensionUri
	}

	public get extensionPath() {
		return this.originalContext.extensionPath
	}

	public get globalStorageUri() {
		return this.originalContext.globalStorageUri
	}

	public get logUri() {
		return this.originalContext.logUri
	}

	public get extension() {
		return this.originalContext.extension
	}

	public get extensionMode() {
		return this.originalContext.extensionMode
	}

	/**
	 * ExtensionContext.globalState
	 * https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.globalState
	 */

	getGlobalState<K extends GlobalStateKey>(key: K): GlobalState[K]
	getGlobalState<K extends GlobalStateKey>(key: K, defaultValue: GlobalState[K]): GlobalState[K]
	getGlobalState<K extends GlobalStateKey>(key: K, defaultValue?: GlobalState[K]): GlobalState[K] {
		if (isPassThroughStateKey(key)) {
			// For pass-through keys, use user prefix if applicable
			if (this.shouldUseUserPrefix(key)) {
				const prefixedKey = this.getPrefixedKey(key)
				const value = this.originalContext.globalState.get<GlobalState[K]>(prefixedKey)
				return value === undefined || value === null ? defaultValue : value
			} else {
				const value = this.originalContext.globalState.get<GlobalState[K]>(key)
				return value === undefined || value === null ? defaultValue : value
			}
		}

		const value = this.stateCache[key]
		return value !== undefined ? value : defaultValue
	}

	updateGlobalState<K extends GlobalStateKey>(key: K, value: GlobalState[K]) {
		// Update cache
		this.stateCache[key] = value

		// Update storage with appropriate key
		if (this.shouldUseUserPrefix(key)) {
			const prefixedKey = this.getPrefixedKey(key)
			return this.originalContext.globalState.update(prefixedKey, value)
		} else {
			return this.originalContext.globalState.update(key, value)
		}
	}

	private getAllGlobalState(): GlobalState {
		return Object.fromEntries(GLOBAL_STATE_KEYS.map((key) => [key, this.getGlobalState(key)]))
	}

	/**
	 * ExtensionContext.secrets
	 * https://code.visualstudio.com/api/references/vscode-api#ExtensionContext.secrets
	 */

	getSecret(key: SecretStateKey) {
		return this.secretCache[key]
	}

	storeSecret(key: SecretStateKey, value?: string) {
		// Update cache.
		this.secretCache[key] = value

		// Write with user prefix if applicable
		if (this.userId) {
			const prefixedKey = this.getPrefixedKey(key)
			return value === undefined
				? this.originalContext.secrets.delete(prefixedKey)
				: this.originalContext.secrets.store(prefixedKey, value)
		} else {
			// Default context uses shared secrets
			return value === undefined
				? this.originalContext.secrets.delete(key)
				: this.originalContext.secrets.store(key, value)
		}
	}

	/**
	 * Refresh secrets from storage and update cache
	 * This is useful when you need to ensure the cache has the latest values
	 */
	async refreshSecrets(): Promise<void> {
		const promises = SECRET_STATE_KEYS.map(async (key) => {
			try {
				this.secretCache[key] = await this.originalContext.secrets.get(key)
			} catch (error) {
				logger.error(
					`Error refreshing secret ${key}: ${error instanceof Error ? error.message : String(error)}`,
				)
			}
		})
		await Promise.all(promises)
	}

	private getAllSecretState(): SecretState {
		return Object.fromEntries(SECRET_STATE_KEYS.map((key) => [key, this.getSecret(key)]))
	}

	/**
	 * GlobalSettings
	 */

	public getGlobalSettings(): GlobalSettings {
		const values = this.getValues()

		try {
			return globalSettingsSchema.parse(values)
		} catch (error) {
			if (error instanceof ZodError) {
				TelemetryService.instance.captureSchemaValidationError({ schemaName: "GlobalSettings", error })
			}

			return GLOBAL_SETTINGS_KEYS.reduce((acc, key) => ({ ...acc, [key]: values[key] }), {} as GlobalSettings)
		}
	}

	/**
	 * ProviderSettings
	 */

	public getProviderSettings(): ProviderSettings {
		const values = this.getValues()

		try {
			return providerSettingsSchema.parse(values)
		} catch (error) {
			if (error instanceof ZodError) {
				TelemetryService.instance.captureSchemaValidationError({ schemaName: "ProviderSettings", error })
			}

			return PROVIDER_SETTINGS_KEYS.reduce((acc, key) => ({ ...acc, [key]: values[key] }), {} as ProviderSettings)
		}
	}

	public async setProviderSettings(values: ProviderSettings) {
		// Explicitly clear out any old API configuration values before that
		// might not be present in the new configuration.
		// If a value is not present in the new configuration, then it is assumed
		// that the setting's value should be `undefined` and therefore we
		// need to remove it from the state cache if it exists.

		// Ensure openAiHeaders is always an object even when empty
		// This is critical for proper serialization/deserialization through IPC
		if (values.openAiHeaders !== undefined) {
			// Check if it's empty or null
			if (!values.openAiHeaders || Object.keys(values.openAiHeaders).length === 0) {
				values.openAiHeaders = {}
			}
		}

		await this.setValues({
			...PROVIDER_SETTINGS_KEYS.filter((key) => !isSecretStateKey(key))
				.filter((key) => !!this.stateCache[key])
				.reduce((acc, key) => ({ ...acc, [key]: undefined }), {} as ProviderSettings),
			...values,
		})
	}

	/**
	 * RooCodeSettings
	 */

	public setValue<K extends RooCodeSettingsKey>(key: K, value: RooCodeSettings[K]) {
		return isSecretStateKey(key) ? this.storeSecret(key, value as string) : this.updateGlobalState(key, value)
	}

	public getValue<K extends RooCodeSettingsKey>(key: K): RooCodeSettings[K] {
		return isSecretStateKey(key)
			? (this.getSecret(key) as RooCodeSettings[K])
			: (this.getGlobalState(key) as RooCodeSettings[K])
	}

	public getValues(): RooCodeSettings {
		return { ...this.getAllGlobalState(), ...this.getAllSecretState() }
	}

	public async setValues(values: RooCodeSettings) {
		const entries = Object.entries(values) as [RooCodeSettingsKey, unknown][]
		await Promise.all(entries.map(([key, value]) => this.setValue(key, value)))
	}

	/**
	 * Import / Export
	 */

	public async export(): Promise<GlobalSettings | undefined> {
		try {
			const globalSettings = globalSettingsExportSchema.parse(this.getValues())

			// Exports should only contain global settings, so this skips project custom modes (those exist in the .roomode folder)
			globalSettings.customModes = globalSettings.customModes?.filter((mode) => mode.source === "global")

			return Object.fromEntries(Object.entries(globalSettings).filter(([_, value]) => value !== undefined))
		} catch (error) {
			if (error instanceof ZodError) {
				TelemetryService.instance.captureSchemaValidationError({ schemaName: "GlobalSettings", error })
			}

			return undefined
		}
	}

	/**
	 * Resets all global state, secrets, and in-memory caches.
	 * For user context, only resets user-specific data.
	 * @returns A promise that resolves when all reset operations are complete
	 */
	public async resetAllState() {
		// Clear in-memory caches
		this.stateCache = {}
		this.secretCache = {}

		if (this.userId) {
			// For user context, only reset user-specific data
			const promises: Promise<void>[] = []

			for (const key of GLOBAL_STATE_KEYS) {
				if (this.shouldUseUserPrefix(key)) {
					const prefixedKey = this.getPrefixedKey(key)
					promises.push(this.originalContext.globalState.update(prefixedKey, undefined) as Promise<void>)
				}
			}

			for (const key of SECRET_STATE_KEYS) {
				const prefixedKey = this.getPrefixedKey(key)
				promises.push(this.originalContext.secrets.delete(prefixedKey) as Promise<void>)
			}

			await Promise.all(promises)
		} else {
			// For default context, reset everything
			await Promise.all([
				...GLOBAL_STATE_KEYS.map((key) => {
					if (this.shouldUseUserPrefix(key)) {
						const prefixedKey = this.getPrefixedKey(key)
						return this.originalContext.globalState.update(prefixedKey, undefined)
					} else {
						return this.originalContext.globalState.update(key, undefined)
					}
				}),
				...SECRET_STATE_KEYS.map((key) => this.originalContext.secrets.delete(key)),
			])

			// After resetting, set language back to Chinese as default
			await this.originalContext.globalState.update("language", "zh-CN")
		}

		await this.initialize()
	}

	private static _instance: ContextProxy | null = null

	static get instance() {
		if (!this._instance) {
			throw new Error("ContextProxy not initialized")
		}

		return this._instance
	}

	static async getInstance(context: vscode.ExtensionContext) {
		if (this._instance) {
			return this._instance
		}

		this._instance = new ContextProxy(context)
		await this._instance.initialize()

		return this._instance
	}
}
