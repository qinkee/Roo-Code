/**
 * Agent系统使用示例
 * 展示如何在实际项目中使用智能体功能
 */

import * as vscode from 'vscode'
import { AgentManager } from './core/agent/AgentManager'
import { AgentRoutingService } from './core/agent/AgentRoutingService'
import { AgentWorkerManager } from './core/agent/AgentWorkerManager'

class AgentSystemDemo {
    private agentManager: AgentManager
    private routingService: AgentRoutingService
    private workerManager: AgentWorkerManager

    constructor(context: vscode.ExtensionContext) {
        this.agentManager = new AgentManager(context)
        this.routingService = new AgentRoutingService()
        this.workerManager = new AgentWorkerManager()
    }

    /**
     * 示例1: 创建代码助手智能体
     */
    async createCodeAssistant(userId: string) {
        const storageService = this.agentManager.getStorageService()
        
        const codeAssistant = await storageService.createAgent(userId, {
            name: '代码助手',
            version: 1,
            userId: userId,
            avatar: '🤖',
            roleDescription: '专业的代码分析和优化助手，擅长多种编程语言',
            apiConfigId: 'claude-3-5-sonnet',
            mode: 'assistant',
            tools: [
                { toolId: 'code-analysis', enabled: true },
                { toolId: 'file-operations', enabled: true },
                { toolId: 'git-operations', enabled: true }
            ],
            todos: [],
            isPublished: false,
            isActive: true,
            isPrivate: false,
            shareScope: 'public',
            shareLevel: 3,
            permissions: [
                { action: 'read', resource: 'code' },
                { action: 'execute', resource: 'analysis' }
            ],
            allowedUsers: [],
            allowedGroups: ['developers']
        })

        vscode.window.showInformationMessage(`代码助手创建成功: ${codeAssistant.name}`)
        return codeAssistant
    }

    /**
     * 示例2: 智能体间协作分析代码
     */
    async collaborativeCodeAnalysis(sourceAgentId: string, targetAgentId: string, code: string) {
        try {
            // 发送代码分析请求
            const response = await this.routingService.routeToAgent(
                sourceAgentId,
                targetAgentId,
                {
                    method: 'analyze-code',
                    params: {
                        code: code,
                        language: 'typescript',
                        analysisType: ['syntax', 'performance', 'security']
                    },
                    sourceAgentId: sourceAgentId,
                    sourceUserId: 'current-user',
                    timeout: 30000
                }
            )

            if (response.success) {
                // 显示分析结果
                const panel = vscode.window.createWebviewPanel(
                    'codeAnalysis',
                    '代码分析结果',
                    vscode.ViewColumn.Two,
                    { enableScripts: true }
                )

                panel.webview.html = this.generateAnalysisHTML(response.data)
                return response.data
            } else {
                vscode.window.showErrorMessage(`分析失败: ${response.error}`)
            }
        } catch (error) {
            vscode.window.showErrorMessage(`请求异常: ${error}`)
        }
    }

    /**
     * 示例3: 启动长期运行的智能体Worker
     */
    async startBackgroundAgent(agentId: string, userId: string) {
        try {
            // Get agent config first, then start worker
            const storageService = this.agentManager.getStorageService()
            const agent = await storageService.getAgent(userId, agentId)
            if (!agent) {
                throw new Error(`Agent ${agentId} not found`)
            }
            await this.workerManager.startAgentWorker(agent)

            // 定期健康检查
            const healthCheckInterval = setInterval(() => {
                const statusPromise = this.workerManager.getWorkerStatus(agentId)
                statusPromise.then(status => {
                    if (!status || status.status !== 'running') {
                        vscode.window.showWarningMessage(`智能体 ${agentId} 状态异常`)
                        clearInterval(healthCheckInterval)
                    }
                })
            }, 60000) // 每分钟检查一次

            vscode.window.showInformationMessage(`后台智能体 ${agentId} 启动成功`)
        } catch (error) {
            vscode.window.showErrorMessage(`启动失败: ${error}`)
        }
    }

    /**
     * 示例4: 智能体任务执行
     */
    async executeAgentTask(agentId: string, taskType: string, taskData: any) {
        try {
            const result = await this.workerManager.executeAgentInWorker(agentId, {
                type: taskType,
                data: taskData,
                priority: 'normal',
                timeout: 30000
            })

            return result
        } catch (error) {
            console.error(`任务执行失败:`, error)
            throw error
        }
    }

    /**
     * 示例5: 数据同步和备份
     */
    async syncAndBackup(userId: string) {
        const storageService = this.agentManager.getStorageService()

        try {
            // 强制同步到Redis
            await storageService.forceSyncToRedis(userId)
            
            // 导出备份
            const backupData = await storageService.exportAgents(userId)
            
            // 保存到本地文件
            const backupUri = await vscode.window.showSaveDialog({
                defaultUri: vscode.Uri.file(`agent-backup-${Date.now()}.json`),
                filters: { 'JSON': ['json'] }
            })

            if (backupUri) {
                await vscode.workspace.fs.writeFile(
                    backupUri, 
                    Buffer.from(JSON.stringify(backupData, null, 2))
                )
                vscode.window.showInformationMessage('备份完成')
            }

            // 检查数据一致性
            const consistency = await storageService.checkDataConsistency(userId)
            console.log('数据一致性检查:', consistency)

        } catch (error) {
            vscode.window.showErrorMessage(`同步失败: ${error}`)
        }
    }

    /**
     * 示例6: VSCode命令注册
     */
    registerCommands(context: vscode.ExtensionContext) {
        // 创建智能体命令
        const createAgentCommand = vscode.commands.registerCommand(
            'agent.create', 
            async () => {
                const name = await vscode.window.showInputBox({
                    prompt: '请输入智能体名称'
                })
                if (name) {
                    await this.createCodeAssistant('current-user')
                }
            }
        )

        // 智能体列表命令
        const listAgentsCommand = vscode.commands.registerCommand(
            'agent.list',
            async () => {
                const storageService = this.agentManager.getStorageService()
                const agents = await storageService.listUserAgents('current-user')
                
                const quickPick = vscode.window.createQuickPick()
                quickPick.items = agents.map(agent => ({
                    label: agent.name,
                    description: agent.roleDescription,
                    detail: `状态: ${agent.isActive ? '活跃' : '非活跃'}`
                }))
                quickPick.show()
            }
        )

        // 代码分析命令
        const analyzeCodeCommand = vscode.commands.registerCommand(
            'agent.analyzeCode',
            async () => {
                const editor = vscode.window.activeTextEditor
                if (editor) {
                    const code = editor.document.getText(editor.selection)
                    if (code) {
                        await this.collaborativeCodeAnalysis(
                            'default-agent',
                            'code-analyzer',
                            code
                        )
                    }
                }
            }
        )

        context.subscriptions.push(createAgentCommand, listAgentsCommand, analyzeCodeCommand)
    }

    /**
     * 生成分析结果HTML
     */
    private generateAnalysisHTML(analysisData: any): string {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>代码分析结果</title>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
                .analysis-section { margin: 20px 0; padding: 15px; border-left: 4px solid #007ACC; }
                .issue { background: #f8f8f8; padding: 10px; margin: 5px 0; border-radius: 4px; }
                .severity-high { border-left: 4px solid #e74c3c; }
                .severity-medium { border-left: 4px solid #f39c12; }
                .severity-low { border-left: 4px solid #27ae60; }
            </style>
        </head>
        <body>
            <h1>🔍 代码分析报告</h1>
            <div class="analysis-section">
                <h2>📊 概览</h2>
                <p>分析时间: ${new Date().toLocaleString()}</p>
                <p>代码行数: ${analysisData.metrics?.lines || 'N/A'}</p>
                <p>发现问题: ${analysisData.issues?.length || 0} 个</p>
            </div>
            
            <div class="analysis-section">
                <h2>⚠️ 发现的问题</h2>
                ${(analysisData.issues || []).map((issue: any) => `
                    <div class="issue severity-${issue.severity}">
                        <strong>${issue.title}</strong>
                        <p>${issue.description}</p>
                        <small>行 ${issue.line}: ${issue.suggestion}</small>
                    </div>
                `).join('')}
            </div>
            
            <div class="analysis-section">
                <h2>💡 改进建议</h2>
                <ul>
                    ${(analysisData.suggestions || []).map((suggestion: string) => 
                        `<li>${suggestion}</li>`
                    ).join('')}
                </ul>
            </div>
        </body>
        </html>
        `
    }

    /**
     * 清理资源
     */
    async dispose() {
        // await this.workerManager.dispose() // Method not available, using alternative cleanup
        // 其他清理工作
    }
}

export { AgentSystemDemo }