import * as vscode from "vscode"
import { VSCodeAgentStorageService } from "./VSCodeAgentStorageService"
import { AgentRedisSyncService } from "./AgentRedisSyncService"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { AgentCommands } from "./AgentCommands"
import { logger } from "../../utils/logging"

/**
 * 智能体管理器
 * 负责初始化和管理所有智能体相关服务
 */
export class AgentManager {
	private baseStorageService: VSCodeAgentStorageService
	private syncService: AgentRedisSyncService
	private enhancedStorageService: EnhancedAgentStorageService

	constructor(private context: vscode.ExtensionContext) {
		// 初始化服务
		this.baseStorageService = new VSCodeAgentStorageService(context)
		this.syncService = new AgentRedisSyncService()
		this.enhancedStorageService = new EnhancedAgentStorageService(
			this.baseStorageService,
			this.syncService
		)

		// 注册命令
		AgentCommands.register(context, this.enhancedStorageService)

		logger.info("[AgentManager] Agent services initialized successfully")
	}

	/**
	 * 设置当前用户ID
	 */
	setCurrentUserId(userId: string): void {
		this.enhancedStorageService.setCurrentUserId(userId)
		logger.info(`[AgentManager] Set current user ID: ${userId}`)
	}

	/**
	 * 获取增强存储服务
	 */
	getStorageService(): EnhancedAgentStorageService {
		return this.enhancedStorageService
	}

	/**
	 * 获取同步服务
	 */
	getSyncService(): AgentRedisSyncService {
		return this.syncService
	}

	/**
	 * 获取基础存储服务
	 */
	getBaseStorageService(): VSCodeAgentStorageService {
		return this.baseStorageService
	}

	/**
	 * 销毁所有服务
	 */
	dispose(): void {
		// 清理资源
		logger.info("[AgentManager] Agent services disposed")
	}
}