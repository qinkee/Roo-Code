import * as vscode from 'vscode';
import { IMAuthService } from './im-auth-service';

/**
 * IM Token获取辅助类
 */
export class IMTokenHelper {
    private static instance: IMTokenHelper;
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
     * 获取IM访问令牌 - 直接委托给IMAuthService，不做任何缓存
     */
    async getAccessToken(): Promise<string> {
        this.outputChannel.appendLine('[IMTokenHelper] Getting access token for terminal=6...');

        try {
            // 直接使用IMAuthService获取token，不做额外缓存
            const token = await this.authService.getAccessToken();
            this.outputChannel.appendLine('[IMTokenHelper] Got independent access token for terminal=6');
            return token;
        } catch (error) {
            console.error('[IMTokenHelper] Failed to get access token:', error);
            throw error;
        }
    }

    /**
     * 清除访问令牌 - 直接委托给IMAuthService
     */
    async clearAccessToken(): Promise<void> {
        await this.authService.clearToken();
        this.outputChannel.appendLine('[IMTokenHelper] Token cleared');
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