#!/usr/bin/env node

/**
 * 简单的智能体测试脚本
 * 用于测试已发布的本地智能体
 */

const http = require('http');

// 配置
const AGENT_HOST = 'localhost';
const AGENT_PORT = 3841; // 从日志中确认的端口
const BASE_URL = `http://${AGENT_HOST}:${AGENT_PORT}`;

/**
 * 发送HTTP请求
 */
function makeRequest(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: AGENT_HOST,
            port: AGENT_PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                try {
                    const result = {
                        status: res.statusCode,
                        headers: res.headers,
                        data: body ? JSON.parse(body) : null
                    };
                    resolve(result);
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: body
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

/**
 * 测试智能体连接
 */
async function testConnection() {
    console.log('🔍 Testing agent connection...');
    try {
        const response = await makeRequest('GET', '/health');
        console.log('✅ Agent is online!');
        console.log('📊 Status:', response.status);
        console.log('📄 Response:', response.data);
        return true;
    } catch (error) {
        console.log('❌ Agent is offline or unreachable');
        console.log('🚫 Error:', error.message);
        return false;
    }
}

/**
 * 获取智能体信息
 */
async function getAgentInfo() {
    console.log('\n📋 Getting agent information...');
    try {
        const response = await makeRequest('GET', '/');  // 修正：使用根路径而不是 /info
        console.log('✅ Agent info retrieved!');
        console.log('🤖 Agent Details:');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.log('❌ Failed to get agent info');
        console.log('🚫 Error:', error.message);
        return null;
    }
}

/**
 * 发送消息给智能体
 */
async function sendMessage(message) {
    console.log(`\n💬 Sending message: "${message}"`);
    try {
        const response = await makeRequest('POST', '/execute', {  // 修正：使用 /execute 端点
            method: 'chat',
            params: {
                message: message,
                sender: 'test-client'
            }
        });
        console.log('✅ Message sent successfully!');
        console.log('📥 Response:');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.log('❌ Failed to send message');
        console.log('🚫 Error:', error.message);
        return null;
    }
}

/**
 * 运行测试套件
 */
async function runTests() {
    console.log('🚀 Starting Agent Test Suite');
    console.log('=' .repeat(50));
    
    // 1. 测试连接
    const isOnline = await testConnection();
    if (!isOnline) {
        console.log('\n❌ Cannot continue tests - agent is not reachable');
        console.log('💡 Make sure your agent is published and running');
        process.exit(1);
    }

    // 2. 获取智能体信息
    await getAgentInfo();

    // 3. 测试基本消息
    await sendMessage('你好！请介绍一下你的功能');

    // 4. 测试文件操作（如果智能体支持）
    await sendMessage('请列出当前目录下的文件');

    // 5. 测试代码相关任务（如果是代码智能体）
    await sendMessage('请帮我分析一下这个项目的结构');

    console.log('\n🎉 Test suite completed!');
    console.log('=' .repeat(50));
}

/**
 * 交互模式
 */
async function interactiveMode() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    console.log('\n🎮 Entering interactive mode');
    console.log('💡 Type your messages and press Enter');
    console.log('💡 Type "exit" to quit\n');

    // 测试连接
    const isOnline = await testConnection();
    if (!isOnline) {
        console.log('❌ Agent is not reachable. Exiting...');
        rl.close();
        return;
    }

    const askQuestion = () => {
        rl.question('You: ', async (input) => {
            if (input.toLowerCase() === 'exit') {
                console.log('👋 Goodbye!');
                rl.close();
                return;
            }

            await sendMessage(input);
            askQuestion();
        });
    };

    askQuestion();
}

// 主程序
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--interactive') || args.includes('-i')) {
        await interactiveMode();
    } else {
        await runTests();
    }
}

// 运行
if (require.main === module) {
    main().catch(console.error);
}