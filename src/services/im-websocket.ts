import * as vscode from 'vscode';
import { IMTokenHelper } from './im-token-helper';

// 在Node.js环境中使用ws库
const WebSocket = require('ws');

export class RooCodeIMConnection {
    private ws: any = null; // WebSocket instance
    private accessToken: string = '';
    private isConnected: boolean = false;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private heartbeatTimer: NodeJS.Timeout | null = null;
    private heartbeatTimeoutTimer: NodeJS.Timeout | null = null;
    private sequenceMap: Map<string, number> = new Map();
    private messageHandlers: Map<number, (data: any) => void> = new Map();
    
    constructor(
        private context: vscode.ExtensionContext,
        private outputChannel: vscode.OutputChannel,
        private wsUrl: string = 'ws://localhost:8878/im'
    ) {
        this.setupMessageHandlers();
    }
    
    /**
     * 建立WebSocket连接
     */
    async connect(): Promise<void> {
        if (this.isConnected) {
            this.outputChannel.appendLine('[RooCode IM] Already connected');
            return;
        }
        
        // 获取访问令牌
        this.accessToken = await this.getAccessToken();
        if (!this.accessToken) {
            throw new Error('No access token available');
        }
        
        this.outputChannel.appendLine(`[RooCode IM] Connecting to IM server at: ${this.wsUrl}`);
        
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.wsUrl);
            } catch (error: any) {
                this.outputChannel.appendLine(`[RooCode IM] Failed to create WebSocket: ${error?.message || error}`);
                reject(error);
                return;
            }
            
            this.ws.onopen = () => {
                this.outputChannel.appendLine('[RooCode IM] WebSocket connected');
                this.login();
                resolve();
            };
            
            this.ws.onmessage = (event) => {
                this.handleMessage(event.data.toString());
            };
            
            this.ws.onerror = (error: any) => {
                const errorMsg = error?.message || error?.toString() || 'Unknown error';
                this.outputChannel.appendLine(`[RooCode IM] WebSocket error: ${errorMsg}`);
                if (error?.code) {
                    this.outputChannel.appendLine(`[RooCode IM] Error code: ${error.code}`);
                }
                reject(error);
            };
            
            this.ws.onclose = (event: any) => {
                this.outputChannel.appendLine(`[RooCode IM] WebSocket closed - code: ${event.code}, reason: ${event.reason || 'No reason provided'}`);
                this.outputChannel.appendLine(`[RooCode IM] Clean close: ${event.wasClean}`);
                this.isConnected = false;
                this.stopHeartbeat();
                this.scheduleReconnect();
            };
        });
    }
    
    /**
     * 登录到IM服务器
     */
    private login(): void {
        const loginData = {
            cmd: 0, // LOGIN
            data: {
                accessToken: this.accessToken
            }
        };
        
        this.send(loginData);
    }
    
    /**
     * 处理接收到的消息
     */
    private handleMessage(rawData: string): void {
        try {
            const message = JSON.parse(rawData);
            this.outputChannel.appendLine(`[RooCode IM] Received message: cmd=${message.cmd}`);
            
            // 处理登录成功
            if (message.cmd === 0) {
                this.isConnected = true;
                this.startHeartbeat();
                this.outputChannel.appendLine('[RooCode IM] Login successful');
                return;
            }
            
            // 处理心跳响应
            if (message.cmd === 1) {
                this.outputChannel.appendLine('[RooCode IM] Heartbeat response received');
                this.resetHeartbeat();
                return;
            }
            
            // 处理LLM消息
            const handler = this.messageHandlers.get(message.cmd);
            if (handler) {
                handler(message.data);
            }
            
        } catch (error) {
            this.outputChannel.appendLine(`[RooCode IM] Failed to handle message: ${error}`);
        }
    }
    
    /**
     * 发送LLM流式请求
     */
    public sendLLMRequest(question: string, recvId?: number, targetTerminal?: number, chatType?: string): string {
        const streamId = this.generateStreamId();
        
        const request = {
            cmd: 10, // LLM_STREAM_REQUEST
            data: {
                streamId,
                question,
                recvId,         // 接收用户ID
                targetTerminal, // 目标终端类型
                chatType,       // 聊天类型 (PRIVATE/GROUP)
                timestamp: Date.now()
            }
        };
        
        this.outputChannel.appendLine(`[RooCode IM] Sending LLM REQUEST (cmd=10): streamId=${streamId}, question=${question.substring(0, 50)}..., recvId=${recvId}, targetTerminal=${targetTerminal}, chatType=${chatType}`);
        this.send(request);
        this.sequenceMap.set(streamId, 0);
        
        return streamId;
    }
    
    /**
     * 发送LLM流式数据块
     */
    public sendLLMChunk(streamId: string, chunk: string, recvId?: number, targetTerminal?: number, chatType?: string): void {
        const sequence = this.getNextSequence(streamId);
        
        const message = {
            cmd: 11, // LLM_STREAM_CHUNK
            data: {
                streamId,
                chunk,
                sequence,
                recvId,         // 保持接收用户ID
                targetTerminal, // 保持目标终端
                chatType,       // 聊天类型
                timestamp: Date.now()
            }
        };
        
        this.outputChannel.appendLine(`[RooCode IM] Sending LLM CHUNK (cmd=11): streamId=${streamId}, seq=${sequence}, recvId=${recvId}, targetTerminal=${targetTerminal}, chatType=${chatType}, chunk=${chunk.substring(0, 20)}...`);
        this.send(message);
    }
    
    /**
     * 发送LLM流结束标记
     */
    public sendLLMEnd(streamId: string, recvId?: number, targetTerminal?: number, chatType?: string): void {
        const message = {
            cmd: 12, // LLM_STREAM_END
            data: {
                streamId,
                recvId,         // 保持接收用户ID
                targetTerminal, // 保持目标终端
                chatType,       // 聊天类型
                timestamp: Date.now()
            }
        };
        
        this.outputChannel.appendLine(`[RooCode IM] Sending LLM END (cmd=12): streamId=${streamId}, recvId=${recvId}, targetTerminal=${targetTerminal}, chatType=${chatType}`);
        this.send(message);
        this.sequenceMap.delete(streamId);
    }
    
    /**
     * 发送LLM错误
     */
    public sendLLMError(streamId: string, error: string, recvId?: number, targetTerminal?: number, chatType?: string): void {
        const message = {
            cmd: 13, // LLM_STREAM_ERROR
            data: {
                streamId,
                error,
                recvId,         // 保持接收用户ID
                targetTerminal, // 保持目标终端
                chatType,       // 聊天类型
                timestamp: Date.now()
            }
        };
        
        this.outputChannel.appendLine(`[RooCode IM] Sending LLM ERROR (cmd=13): streamId=${streamId}, recvId=${recvId}, targetTerminal=${targetTerminal}, chatType=${chatType}, error=${error}`);
        this.send(message);
        this.sequenceMap.delete(streamId);
    }
    
    /**
     * 注册消息处理器
     */
    public onLLMChunk(handler: (data: any) => void): void {
        this.messageHandlers.set(11, handler);
    }
    
    public onLLMEnd(handler: (data: any) => void): void {
        this.messageHandlers.set(12, handler);
    }
    
    public onLLMError(handler: (data: any) => void): void {
        this.messageHandlers.set(13, handler);
    }
    
    /**
     * 发送消息
     */
    private send(data: any): void {
        if (this.ws?.readyState === WebSocket.OPEN) {
            const jsonData = JSON.stringify(data);
            this.ws.send(jsonData);
            this.outputChannel.appendLine(`[RooCode IM] Sent message: ${jsonData.substring(0, 200)}`);
        } else {
            this.outputChannel.appendLine('[RooCode IM] WebSocket not ready, message queued');
            // TODO: 实现消息队列
        }
    }
    
    /**
     * 心跳机制 - 参考wssocket.js实现
     */
    private startHeartbeat(): void {
        this.outputChannel.appendLine('[RooCode IM] Starting heartbeat mechanism');
        this.resetHeartbeat();
    }
    
    private stopHeartbeat(): void {
        if (this.heartbeatTimer) {
            clearTimeout(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
        if (this.heartbeatTimeoutTimer) {
            clearTimeout(this.heartbeatTimeoutTimer);
            this.heartbeatTimeoutTimer = null;
        }
    }
    
    private resetHeartbeat(): void {
        // 清除现有定时器
        if (this.heartbeatTimer) {
            clearTimeout(this.heartbeatTimer);
        }
        if (this.heartbeatTimeoutTimer) {
            clearTimeout(this.heartbeatTimeoutTimer);
            this.heartbeatTimeoutTimer = null;
        }
        
        // 设置新的心跳定时器（5秒后发送心跳）
        this.heartbeatTimer = setTimeout(() => {
            if (this.isConnected && this.ws?.readyState === WebSocket.OPEN) {
                this.outputChannel.appendLine('[RooCode IM] Sending heartbeat');
                this.send({ cmd: 1, data: {} });
                
                // 设置心跳超时定时器（如果10秒内没有收到响应，认为连接断开）
                this.heartbeatTimeoutTimer = setTimeout(() => {
                    this.outputChannel.appendLine('[RooCode IM] Heartbeat timeout, closing connection');
                    this.ws?.close();
                }, 10000);
            }
        }, 5000);
    }
    
    /**
     * 重连机制
     */
    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        
        // 使用15秒延迟，避免过于频繁的重连
        this.reconnectTimer = setTimeout(() => {
            this.outputChannel.appendLine('[RooCode IM] Attempting to reconnect...');
            this.connect().catch(err => this.outputChannel.appendLine(`[RooCode IM] Reconnection failed: ${err}`));
        }, 15000);
    }
    
    /**
     * 获取访问令牌
     */
    private async getAccessToken(): Promise<string> {
        try {
            const tokenHelper = IMTokenHelper.getInstance(this.context, this.outputChannel);
            const token = await tokenHelper.getAccessToken();
            this.outputChannel.appendLine('[RooCode IM] Successfully got access token for terminal=6');
            return token;
        } catch (error) {
            this.outputChannel.appendLine(`[RooCode IM] Failed to get access token: ${error}`);
            throw error;
        }
    }
    
    /**
     * 工具方法
     */
    private generateStreamId(): string {
        return `stream_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    private getNextSequence(streamId: string): number {
        const current = this.sequenceMap.get(streamId) || 0;
        const next = current + 1;
        this.sequenceMap.set(streamId, next);
        return next;
    }
    
    private setupMessageHandlers(): void {
        // 默认处理器
        this.onLLMChunk((data) => {
            console.log('Received LLM chunk:', data);
        });
        
        this.onLLMEnd((data) => {
            console.log('LLM stream ended:', data);
        });
        
        this.onLLMError((data) => {
            console.error('LLM stream error:', data);
        });
    }
    
    /**
     * 断开连接
     */
    public disconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        
        this.isConnected = false;
    }
}