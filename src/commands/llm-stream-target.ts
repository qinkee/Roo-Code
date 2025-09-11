import * as vscode from 'vscode';

/**
 * LLM流式传输目标管理
 */
export class LLMStreamTargetManager {
    private static instance: LLMStreamTargetManager;
    private targetUserId?: number;
    private targetTerminal?: number;
    
    private constructor() {}
    
    public static getInstance(): LLMStreamTargetManager {
        if (!LLMStreamTargetManager.instance) {
            LLMStreamTargetManager.instance = new LLMStreamTargetManager();
        }
        return LLMStreamTargetManager.instance;
    }
    
    /**
     * 设置流式传输目标
     */
    public async setTarget(context: vscode.ExtensionContext): Promise<void> {
        // 获取目标用户ID
        const userIdInput = await vscode.window.showInputBox({
            prompt: 'Enter target user ID (leave empty to clear target)',
            placeHolder: 'e.g., 1',
            value: this.targetUserId?.toString() || ''
        });
        
        if (userIdInput === undefined) {
            // 用户取消了操作
            return;
        }
        
        if (userIdInput === '') {
            // 清除目标
            this.targetUserId = undefined;
            this.targetTerminal = undefined;
            vscode.window.showInformationMessage('LLM stream target cleared');
            return;
        }
        
        const userId = parseInt(userIdInput);
        if (isNaN(userId)) {
            vscode.window.showErrorMessage('Invalid user ID');
            return;
        }
        
        // 获取目标终端
        const terminalChoice = await vscode.window.showQuickPick(
            [
                { label: 'All Terminals', value: undefined, description: 'Send to all terminals of the user' },
                { label: '0 - Web', value: 0 },
                { label: '1 - App', value: 1 },
                { label: '2 - PC', value: 2 },
                { label: '3 - Cloud PC', value: 3 },
                { label: '4 - Plugin', value: 4 },
                { label: '5 - MCP', value: 5 },
                { label: '6 - Roo-Code', value: 6 }
            ],
            { 
                placeHolder: 'Select target terminal',
                title: 'LLM Stream Target Terminal'
            }
        );
        
        if (terminalChoice === undefined) {
            // 用户取消了操作
            return;
        }
        
        this.targetUserId = userId;
        this.targetTerminal = terminalChoice.value;
        
        // 保存到全局状态
        await context.globalState.update('llmStreamTargetUserId', this.targetUserId);
        await context.globalState.update('llmStreamTargetTerminal', this.targetTerminal);
        
        const terminalName = terminalChoice.value !== undefined ? `terminal ${terminalChoice.value}` : 'all terminals';
        vscode.window.showInformationMessage(`LLM stream target set to user ${userId} (${terminalName})`);
        
        // 更新所有活动的Task实例
        this.updateActiveTasks();
    }
    
    /**
     * 从全局状态加载目标设置
     */
    public async loadFromState(context: vscode.ExtensionContext): Promise<void> {
        this.targetUserId = context.globalState.get<number>('llmStreamTargetUserId');
        this.targetTerminal = context.globalState.get<number>('llmStreamTargetTerminal');
        
        if (this.targetUserId !== undefined) {
            const terminalName = this.targetTerminal !== undefined ? `terminal ${this.targetTerminal}` : 'all terminals';
            console.log(`[LLMStreamTarget] Loaded target: user ${this.targetUserId} (${terminalName})`);
        }
    }
    
    /**
     * 获取当前目标
     */
    public getTarget(): { userId?: number; terminal?: number } {
        return {
            userId: this.targetUserId,
            terminal: this.targetTerminal
        };
    }
    
    /**
     * 显示当前目标状态
     */
    public async showStatus(): Promise<void> {
        if (this.targetUserId === undefined) {
            vscode.window.showInformationMessage('No LLM stream target set');
        } else {
            const terminalName = this.targetTerminal !== undefined ? `terminal ${this.targetTerminal}` : 'all terminals';
            vscode.window.showInformationMessage(`Current LLM stream target: user ${this.targetUserId} (${terminalName})`);
        }
    }
    
    /**
     * 更新所有活动的Task实例的目标设置
     */
    private updateActiveTasks(): void {
        // 通过全局变量获取当前的Task实例（如果有的话）
        const globalAny = global as any;
        if (globalAny.currentTask) {
            globalAny.currentTask.setLLMStreamTarget(this.targetUserId, this.targetTerminal);
            console.log(`[LLMStreamTarget] Updated active task target: userId=${this.targetUserId}, terminal=${this.targetTerminal}`);
        }
    }
}