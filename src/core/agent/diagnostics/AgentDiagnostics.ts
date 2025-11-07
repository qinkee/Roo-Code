import * as vscode from "vscode"
import { A2AServerManager } from "../A2AServerManager"
import { ClineProvider } from "../../webview/ClineProvider"

/**
 * 智能体诊断工具
 * 用于检查和诊断智能体调用过程中的问题
 */
export class AgentDiagnostics {
	private outputChannel: vscode.OutputChannel
	private provider: ClineProvider
	private a2aManager: A2AServerManager

	constructor(provider: ClineProvider) {
		this.provider = provider
		this.a2aManager = A2AServerManager.getInstance()
		this.outputChannel = vscode.window.createOutputChannel("Roo-Code Agent Diagnostics", { log: true })
	}

	/**
	 * 诊断智能体调用过程中的attempt_completion问题
	 */
	async diagnoseAgentAttemptCompletion(agentId: string): Promise<void> {
		this.outputChannel.clear()
		this.outputChannel.appendLine("🕵️‍♂️ 智能体 attempt_completion 诊断报告")
		this.outputChannel.appendLine("=" + "=".repeat(50))
		this.outputChannel.appendLine("")

		try {
			// 1. 获取智能体配置
			this.outputChannel.appendLine("📋 1. 智能体配置检查")
			const agentConfig = await this.a2aManager.getAgentConfig(agentId)
			if (!agentConfig) {
				this.outputChannel.appendLine(`❌ 智能体 ${agentId} 不存在`)
				return
			}

			this.outputChannel.appendLine(`   ✅ 智能体名称: ${agentConfig.name}`)
			this.outputChannel.appendLine(`   ✅ 模式: ${agentConfig.mode}`)
			this.outputChannel.appendLine(`   ✅ API配置ID: ${agentConfig.apiConfigId || '自定义配置'}`)

			// 2. 检查 allowedTools
			this.outputChannel.appendLine("")
			this.outputChannel.appendLine("🛠️‍ 2. 工具权限检查")
			if (agentConfig.allowedTools && agentConfig.allowedTools.length > 0) {
				this.outputChannel.appendLine(`   📋 允许的工具列表 (${agentConfig.allowedTools.length} 个)`)
				agentConfig.allowedTools.forEach((tool: string, index: number) => {
					const hasAttemptCompletion = tool.toLowerCase().includes('completion')
					const status = hasAttemptCompletion ? '✅' : '⚠️'
					this.outputChannel.appendLine(`   ${status} ${index + 1}. ${tool}`)
				})

				// 检查 attempt_completion 是否在 allowedTools 中
				const hasAttemptCompletion = agentConfig.allowedTools.some((tool: string) =>
					tool.toLowerCase().includes('completion')
				)
				if (!hasAttemptCompletion) {
					this.outputChannel.appendLine("   ⚠️️️️ 警告: allowedTools 中未找到 attempt_completion 工具！")
					this.outputChannel.appendLine("   🔧 建议: 在智能体配置中添加 'attempt_completion' 到 allowedTools")
				} else {
					this.outputChannel.appendLine("   ✅ allowedTools 中包含 completion 相关工具")
				}
			} else {
				this.outputChannel.appendLine("   ✅ 工具权限: 允许所有工具 (allowedTools 为空或未定义)")
			}

			// 3. API配置检查
			this.outputChannel.appendLine("")
			this.outputChannel.appendLine("⚙️ 3. API 配置检查")
			const isValidApi = agentConfig.apiConfig || agentConfig.apiConfigId
			if (isValidApi) {
				this.outputChannel.appendLine(`   ✅ 已配置 API (${agentConfig.apiConfigId || '内嵌配置'})`)
			} else {
				this.outputChannel.appendLine("   ❌ 未找到 API 配置")
			}

			// 4. 智能体角色描述检查
			this.outputChannel.appendLine("")
			this.outputChannel.appendLine("🎯 4. 角色描述检查")
			if (agentConfig.roleDescription) {
				this.outputChannel.appendLine(`   ✅ 角色描述已定义 (${agentConfig.roleDescription.length} 字符)`)
				this.outputChannel.appendLine(`   预览: ${agentConfig.roleDescription.substring(0, 100)}...`)
			} else {
				this.outputChannel.appendLine("   ⚠️ 未定义角色描述")
			}

			// 5. 工具使用建议
			this.outputChannel.appendLine("")
			this.outputChannel.appendLine("💡 5. 诊断建议")
			this.outputChannel.appendLine("   📌 attempt_completion 工具必须在 allowedTools 中才能被智能体调用")
			this.outputChannel.appendLine("   📌 如果您的智能体允许所有工具，请确保 allowedTools 为空数组或未定义")
			this.outputChannel.appendLine("   📌 如果限制工具，请包含 key 工具:")
			this.outputChannel.appendLine("        - attempt_completion (必需)")
			this.outputChannel.appendLine("        - str_replace_editor (文件操作)")
			this.outputChannel.appendLine("        - execute_command (命令执行)")

			this.outputChannel.appendLine("")
			this.outputChannel.appendLine("诊断完成 🎯")

		} catch (error: any) {
			this.outputChannel.appendLine("")
			this.outputChannel.appendLine(`❌ 诊断失败: ${error.message}`)
		}

		this.outputChannel.show()
	}

	/**
	 * 添加诊断命令到 VSCode
	 */
	static registerCommands(context: vscode.ExtensionContext, provider: ClineProvider): void {
		const diagnostics = new AgentDiagnostics(provider)

		context.subscriptions.push(
			vscode.commands.registerCommand('roo-cline.diagnoseAgentAttemptCompletion', async () => {
				// 获取要诊断的智能体ID
				const agentId = await vscode.window.showInputBox({
					title: '诊断智能体 attempt_completion',
					prompt: '输入要诊断的智能体ID',
					placeHolder: '例如: agent_123',
					validateInput: (value) => {
						return (!value || value.trim()) ? undefined : '请输入有效的智能体ID'
					}
				})

				if (agentId) {
					await diagnostics.diagnoseAgentAttemptCompletion(agentId.trim())
				}
			})
		)
	}
}