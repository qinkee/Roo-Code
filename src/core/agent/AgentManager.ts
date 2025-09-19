import * as vscode from "vscode"
import { EnhancedAgentStorageService } from "./EnhancedAgentStorageService"
import { AgentCommands } from "./AgentCommands"
import { logger } from "../../utils/logging"

/**
 * 智能体管理器
 * 负责初始化和管理所有智能体相关服务
 */
export class AgentManager {
	private enhancedStorageService: EnhancedAgentStorageService

	constructor(private context: vscode.ExtensionContext) {
		// 初始化增强存储服务（包含本地存储和Redis同步）
		this.enhancedStorageService = new EnhancedAgentStorageService(context)

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
	 * 获取Redis同步服务
	 */
	getSyncService() {
		return this.enhancedStorageService.getSyncService()
	}

	/**
	 * 获取基础存储服务
	 */
	getBaseStorageService() {
		return this.enhancedStorageService.getBaseStorageService()
	}

	/**
	 * 销毁所有服务
	 */
	dispose(): void {
		// 清理资源
		logger.info("[AgentManager] Agent services disposed")
	}
}