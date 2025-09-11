import * as vscode from 'vscode';
import { IMAuthService } from './im-auth-service';

/**
 * IM Token获取辅助类
 */
export class IMTokenHelper {
    private static instance: IMTokenHelper;
    private token: string | null = null;
    private authService: IMAuthService;
    
    private constructor(
        private context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel
    ) {
        this.authService = IMAuthService.getInstance(context, outputChannel);
    }
    
    static getInstance(context: vscode.ExtensionContext, outputChannel?: vscode.OutputChannel): IMTokenHelper {
        if (!IMTokenHelper.instance) {
            const channel = outputChannel || vscode.window.createOutputChannel('Roo-Code IM');
            IMTokenHelper.instance = new IMTokenHelper(context, channel);
        }
        return IMTokenHelper.instance;
    }
    
    /**
     * 获取IM访问令牌 - 使用独立登录获取terminal=6的token
     */
    async getAccessToken(): Promise<string> {
        this.outputChannel.appendLine('[IMTokenHelper] Getting access token for terminal=6...');
        
        try {
            // 通过IMAuthService获取独立的accessToken
            const token = await this.authService.getAccessToken();
            this.token = token;
            this.outputChannel.appendLine('[IMTokenHelper] Got independent access token for terminal=6');
            return token;
        } catch (error) {
            console.error('[IMTokenHelper] Failed to get access token:', error);
            throw error;
        }
    }
    
    /**
     * 设置访问令牌
     */
    async setAccessToken(token: string): Promise<void> {
        this.token = token;
        await this.context.globalState.update('imAccessToken', token);
        await this.context.workspaceState.update('imAccessToken', token);
        console.log('[IMTokenHelper] Token saved');
    }
    
    /**
     * 清除访问令牌
     */
    async clearAccessToken(): Promise<void> {
        this.token = null;
        await this.context.globalState.update('imAccessToken', undefined);
        await this.context.workspaceState.update('imAccessToken', undefined);
        console.log('[IMTokenHelper] Token cleared');
    }
    
    /**
     * 监听IM登录事件
     */
    setupLoginListener(): void {
        // 监听来自WebView的登录事件
        const listener = (event: any) => {
            if (event.detail?.accessToken) {
                console.log('[IMTokenHelper] Received login event with token');
                this.setAccessToken(event.detail.accessToken);
            }
        };
        
        // 这里需要通过某种方式监听WebView事件
        // 可能需要在ClineProvider中转发
    }
}