/**
 * 智能体删除功能测试示例
 * 演示如何在前端和后端正确处理智能体删除
 */

import * as vscode from 'vscode'

/**
 * 前端调用删除智能体的示例
 */
export class AgentDeleteDemo {
    
    /**
     * 模拟前端发送删除智能体消息
     */
    async simulateDeleteAgentFromUI(agentId: string, agentName: string) {
        console.log('🗑️ 模拟前端删除智能体请求')
        
        // 这是前端JavaScript会发送的消息格式
        const deleteMessage = {
            type: "deleteAgent",
            agentId: agentId,
            agentName: agentName  // 用于确认对话框显示
        }
        
        console.log('发送消息到webview:', deleteMessage)
        
        // 在实际前端代码中，这会是：
        // vscode.postMessage(deleteMessage)
        
        return deleteMessage
    }

    /**
     * 测试VSCode命令直接删除
     */
    async testDirectDelete(userId: string, agentId: string) {
        try {
            console.log('🧪 测试直接删除智能体命令')
            
            const result = await vscode.commands.executeCommand("roo-cline.deleteAgent", {
                userId,
                agentId
            }) as any
            
            console.log('删除结果:', result)
            
            if (result.success) {
                console.log('✅ 智能体删除成功')
            } else {
                console.log('❌ 智能体删除失败:', result.error)
            }
            
            return result
        } catch (error) {
            console.error('❌ 删除异常:', error)
            throw error
        }
    }

    /**
     * 测试批量删除智能体
     */
    async testBatchDelete(userId: string, agentIds: string[]) {
        const results = []
        
        console.log(`🔄 开始批量删除 ${agentIds.length} 个智能体`)
        
        for (const agentId of agentIds) {
            try {
                const result = await this.testDirectDelete(userId, agentId)
                results.push({ agentId, ...result })
                
                // 添加延迟避免过快请求
                await new Promise(resolve => setTimeout(resolve, 100))
            } catch (error) {
                results.push({ 
                    agentId, 
                    success: false, 
                    error: error instanceof Error ? error.message : String(error) 
                })
            }
        }
        
        const successCount = results.filter(r => r.success).length
        console.log(`✅ 批量删除完成: ${successCount}/${agentIds.length} 个成功`)
        
        return results
    }

    /**
     * 获取智能体列表用于测试
     */
    async getTestAgents(userId: string) {
        try {
            const result = await vscode.commands.executeCommand("roo-cline.getAgents", {
                userId
            }) as any
            
            if (result.success) {
                console.log(`📋 找到 ${result.agents.length} 个智能体`)
                return result.agents
            } else {
                console.log('❌ 获取智能体列表失败:', result.error)
                return []
            }
        } catch (error) {
            console.error('❌ 获取智能体列表异常:', error)
            return []
        }
    }

    /**
     * 完整的删除流程测试
     */
    async runCompleteDeleteTest(userId: string) {
        console.log('🚀 开始完整的智能体删除测试')
        
        try {
            // 1. 获取当前智能体列表
            const agents = await this.getTestAgents(userId)
            if (agents.length === 0) {
                console.log('ℹ️ 没有智能体可以删除，测试结束')
                return
            }
            
            // 2. 选择第一个智能体进行删除测试
            const testAgent = agents[0]
            console.log(`🎯 选择测试智能体: ${testAgent.name} (${testAgent.id})`)
            
            // 3. 模拟前端UI删除请求
            const uiMessage = await this.simulateDeleteAgentFromUI(testAgent.id, testAgent.name)
            console.log('📤 UI消息格式:', uiMessage)
            
            // 4. 执行实际删除
            const deleteResult = await this.testDirectDelete(userId, testAgent.id)
            
            // 5. 验证删除结果
            if (deleteResult.success) {
                console.log('✅ 删除测试成功')
                
                // 6. 验证智能体确实被删除
                const updatedAgents = await this.getTestAgents(userId)
                const stillExists = updatedAgents.find(a => a.id === testAgent.id)
                
                if (!stillExists) {
                    console.log('✅ 验证通过: 智能体已从列表中移除')
                } else {
                    console.log('⚠️ 警告: 智能体仍然存在于列表中')
                }
            } else {
                console.log('❌ 删除测试失败')
            }
            
        } catch (error) {
            console.error('❌ 完整测试失败:', error)
        }
    }

    /**
     * 创建测试智能体用于删除测试
     */
    async createTestAgentForDeletion(userId: string) {
        try {
            const testAgentConfig = {
                name: `测试智能体-${Date.now()}`,
                avatar: '🧪',
                roleDescription: '这是一个用于测试删除功能的临时智能体',
                apiConfigId: 'default',
                mode: 'assistant' as const,
                tools: [],
                isPrivate: true,
                shareScope: 'private' as const,
                shareLevel: 0
            }
            
            const result = await vscode.commands.executeCommand("roo-cline.createAgent", {
                userId,
                agentConfig: testAgentConfig
            }) as any
            
            if (result.success) {
                console.log('✅ 测试智能体创建成功:', result.agent.name)
                return result.agent
            } else {
                console.log('❌ 测试智能体创建失败:', result.error)
                return null
            }
        } catch (error) {
            console.error('❌ 创建测试智能体异常:', error)
            return null
        }
    }
}

/**
 * 运行删除功能测试的示例函数
 */
export async function runAgentDeleteTests() {
    const demo = new AgentDeleteDemo()
    const userId = 'test-user-123'
    
    try {
        console.log('🎬 启动智能体删除功能测试')
        
        // 1. 创建测试智能体
        console.log('\n📝 创建测试智能体...')
        const testAgent = await demo.createTestAgentForDeletion(userId)
        
        if (testAgent) {
            // 2. 等待一下确保数据同步
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            // 3. 运行完整删除测试
            console.log('\n🧪 开始删除测试...')
            await demo.runCompleteDeleteTest(userId)
        }
        
        console.log('\n🏁 删除功能测试完成')
        
    } catch (error) {
        console.error('❌ 测试运行失败:', error)
    }
}

/**
 * VSCode命令注册示例
 */
export function registerDeleteTestCommands(context: vscode.ExtensionContext) {
    const testCommand = vscode.commands.registerCommand(
        'agent.testDelete',
        runAgentDeleteTests
    )
    
    context.subscriptions.push(testCommand)
    console.log('✅ 智能体删除测试命令已注册: agent.testDelete')
}