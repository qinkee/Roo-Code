import { RooCodeIMConnection } from './im-websocket';
import * as vscode from 'vscode';

export class LLMStreamService {
    public imConnection: RooCodeIMConnection;
    private isInitialized: boolean = false;
    private initializePromise: Promise<void> | null = null;
    public handlersRegistered: boolean = false;

    constructor(
        private context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel
    ) {
        this.imConnection = new RooCodeIMConnection(context, outputChannel);
    }

    /**
     * 重置连接状态（用户登出/切换时调用）
     */
    public resetConnectionState(): void {
        this.isInitialized = false;
        this.initializePromise = null;
        this.outputChannel.appendLine('[LLMStreamService] Connection state reset');
    }

    /**
     * 标记处理器已注册（必须在连接前调用）
     */
    public markHandlersRegistered(): void {
        this.handlersRegistered = true;
    }
    
    /**
     * 手动初始化服务（确保tokenKey已设置）
     */
    public async initialize(): Promise<void> {
        // 🔥 关键安全检查：必须先注册处理器才能连接
        if (!this.handlersRegistered) {
            const error = 'CRITICAL: Handlers must be registered before connecting! Call markHandlersRegistered() first.';
            this.outputChannel.appendLine(`[LLMStreamService] ❌ ${error}`);
            throw new Error(error);
        }

        // 防止重复初始化
        if (this.isInitialized) {
            return;
        }

        // 如果正在初始化，等待完成
        if (this.initializePromise) {
            return this.initializePromise;
        }

        this.initializePromise = this.doInitialize();
        return this.initializePromise;
    }

    private async doInitialize(): Promise<void> {
        try {
            await this.imConnection.connect();
            this.isInitialized = true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            const errorStack = error instanceof Error ? error.stack : '';
            this.outputChannel.appendLine(`[LLMStreamService] ❌ Init failed: ${errorMessage}`);
            if (errorStack) {
                this.outputChannel.appendLine(`[LLMStreamService] Stack: ${errorStack}`);
            }
            this.initializePromise = null;
            throw error;
        }
    }
    
    /**
     * 检查是否已初始化
     */
    public isConnected(): boolean {
        return this.isInitialized;
    }
    
    /**
     * 发送问题到LLM并流式传输响应
     */
    async streamLLMResponse(question: string, recvId?: number, targetTerminal?: number, chatType?: string): Promise<void> {
        if (!this.isInitialized) {
            await this.initialize();
        }

        const streamId = this.imConnection.sendLLMRequest(question, recvId, targetTerminal, chatType);

        try {
            const response = await this.callLLMAPI(question);
            for (const chunk of this.simulateStream(response)) {
                this.imConnection.sendLLMChunk(streamId, chunk, recvId, targetTerminal, chatType);
                await this.delay(50);
            }
            this.imConnection.sendLLMEnd(streamId, recvId, targetTerminal, chatType);
        } catch (error: any) {
            this.imConnection.sendLLMError(streamId, error.message, recvId, targetTerminal, chatType);
        }
    }
    
    /**
     * 模拟LLM API调用
     */
    private async callLLMAPI(question: string): Promise<string> {
        // 实际实现中，这里应该调用真实的LLM API
        return `This is a simulated response to: ${question}`;
    }
    
    /**
     * 模拟流式输出
     */
    private *simulateStream(text: string): Generator<string> {
        const words = text.split(' ');
        for (const word of words) {
            yield word + ' ';
        }
    }
    
    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}