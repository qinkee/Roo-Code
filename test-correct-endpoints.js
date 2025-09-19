#!/usr/bin/env node

/**
 * 测试智能体的正确端点
 */

const http = require('http');

const PORT = 3841; // 从日志中确认的端口

function testEndpoint(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        console.log(`\n🔹 Testing ${method} http://localhost:${PORT}${path}`);

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                console.log(`   Status: ${res.statusCode}`);
                try {
                    const jsonData = JSON.parse(body);
                    console.log(`   Response:`, JSON.stringify(jsonData, null, 2));
                } catch (e) {
                    console.log(`   Response (raw):`, body);
                }
                resolve({
                    status: res.statusCode,
                    data: body
                });
            });
        });

        req.on('error', (err) => {
            console.log(`   ❌ Error: ${err.message}`);
            reject(err);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testAllEndpoints() {
    console.log('🚀 Testing A2A Agent Server Endpoints');
    console.log('=' .repeat(50));

    try {
        // 1. 测试根路径 (智能体信息)
        await testEndpoint('/');

        // 2. 测试健康检查
        await testEndpoint('/health');

        // 3. 测试状态
        await testEndpoint('/status');

        // 4. 测试执行端点 (POST)
        await testEndpoint('/execute', 'POST', {
            method: 'chat',
            params: {
                message: '你好！请介绍一下你自己'
            }
        });

        console.log('\n✅ All endpoint tests completed!');
        
    } catch (error) {
        console.log('\n❌ Test failed:', error.message);
    }
}

testAllEndpoints();