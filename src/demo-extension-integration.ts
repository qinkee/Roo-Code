/**
 * VSCode扩展集成示例
 * 展示如何在主扩展文件中集成Agent系统
 */

import * as vscode from 'vscode'
import { AgentSystemDemo } from './demo-agent-usage'

let agentDemo: AgentSystemDemo

export async function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Agent系统扩展激活中...')

    try {
        // 初始化Agent系统
        agentDemo = new AgentSystemDemo(context)

        // 注册所有命令
        agentDemo.registerCommands(context)

        // 注册状态栏按钮
        const statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Right, 
            100
        )
        statusBarItem.text = "$(robot) Agent"
        statusBarItem.tooltip = "智能体系统"
        statusBarItem.command = "agent.list"
        statusBarItem.show()
        context.subscriptions.push(statusBarItem)

        // 自动创建默认智能体
        await createDefaultAgents()

        // 设置定时同步
        const syncInterval = setInterval(async () => {
            try {
                await agentDemo.syncAndBackup('current-user')
            } catch (error) {
                console.error('定时同步失败:', error)
            }
        }, 300000) // 每5分钟同步一次

        context.subscriptions.push({
            dispose: () => clearInterval(syncInterval)
        })

        vscode.window.showInformationMessage(
            '🎉 Agent系统已成功激活！',
            '查看智能体'
        ).then(selection => {
            if (selection === '查看智能体') {
                vscode.commands.executeCommand('agent.list')
            }
        })

    } catch (error) {
        console.error('Agent系统激活失败:', error)
        vscode.window.showErrorMessage(`Agent系统激活失败: ${error}`)
    }
}

/**
 * 创建默认智能体
 */
async function createDefaultAgents() {
    try {
        // 创建代码助手
        await agentDemo.createCodeAssistant('current-user')
        
        // 启动后台监控智能体
        await agentDemo.startBackgroundAgent('monitor-agent', 'current-user')
        
        console.log('✅ 默认智能体创建完成')
    } catch (error) {
        console.error('创建默认智能体失败:', error)
    }
}

export async function deactivate() {
    console.log('🔄 Agent系统扩展停用中...')
    
    if (agentDemo) {
        await agentDemo.dispose()
    }
    
    console.log('✅ Agent系统扩展已停用')
}