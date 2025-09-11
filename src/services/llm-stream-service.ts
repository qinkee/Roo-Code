import { RooCodeIMConnection } from './im-websocket';
import * as vscode from 'vscode';

export class LLMStreamService {
    public imConnection: RooCodeIMConnection;
    
    constructor(
        private context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel
    ) {
        this.imConnection = new RooCodeIMConnection(context, outputChannel);
        this.initialize();
    }
    
    private async initialize() {
        try {
            await this.imConnection.connect();
            this.outputChannel.appendLine('[LLMStreamService] Service initialized with terminal=6');
        } catch (error) {
            this.outputChannel.appendLine(`[LLMStreamService] Failed to initialize: ${error}`);
        }
    }
    
    /**
     * 发送问题到LLM并流式传输响应
     */
    async streamLLMResponse(question: string, recvId?: number, targetTerminal?: number, chatType?: string): Promise<void> {
        this.outputChannel.appendLine(`[LLMStreamService] Starting LLM stream for question: ${question}, recvId=${recvId}, targetTerminal=${targetTerminal}, chatType=${chatType}`);
        const streamId = this.imConnection.sendLLMRequest(question, recvId, targetTerminal, chatType);
        this.outputChannel.appendLine(`[LLMStreamService] Created stream with ID: ${streamId}`);
        
        try {
            // 调用实际的LLM API（这里是示例）
            const response = await this.callLLMAPI(question);
            this.outputChannel.appendLine(`[LLMStreamService] Got LLM response: ${response}`);
            
            // 模拟流式输出
            let chunkCount = 0;
            for (const chunk of this.simulateStream(response)) {
                this.imConnection.sendLLMChunk(streamId, chunk, recvId, targetTerminal, chatType);
                chunkCount++;
                this.outputChannel.appendLine(`[LLMStreamService] Sent chunk ${chunkCount}: ${chunk}`);
                await this.delay(50); // 控制发送速率
            }
            
            // 发送结束标记
            this.imConnection.sendLLMEnd(streamId, recvId, targetTerminal, chatType);
            this.outputChannel.appendLine(`[LLMStreamService] Stream ended, sent ${chunkCount} chunks`);
            
        } catch (error: any) {
            // 发送错误
            this.outputChannel.appendLine(`[LLMStreamService] Stream error: ${error.message}`);
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