#!/usr/bin/env node

/**
 * 智能体服务器诊断脚本
 * 扫描常用端口，找到正在运行的智能体服务器
 */

const http = require('http');

// 常用的A2A服务器端口范围
const COMMON_PORTS = [
    3000, 3001, 3002, 3003, 3004, 3005,
    3673, 3842, 3843, 3844, 3845,
    8000, 8001, 8002, 8003, 8004, 8005
];

/**
 * 测试单个端口
 */
function testPort(port) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            path: '/health',
            method: 'GET',
            timeout: 1000
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    port,
                    status: res.statusCode,
                    available: true,
                    response: body
                });
            });
        });

        req.on('error', () => {
            resolve({
                port,
                available: false
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                port,
                available: false
            });
        });

        req.end();
    });
}

/**
 * 获取端口信息
 */
function getPortInfo(port) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            path: '/info',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const data = JSON.parse(body);
                    resolve({
                        port,
                        info: data,
                        success: true
                    });
                } catch (e) {
                    resolve({
                        port,
                        info: body,
                        success: false
                    });
                }
            });
        });

        req.on('error', () => {
            resolve({ port, success: false });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({ port, success: false });
        });

        req.end();
    });
}

/**
 * 主扫描函数
 */
async function scanPorts() {
    console.log('🔍 Scanning for A2A agent servers...');
    console.log('📡 Testing common ports:', COMMON_PORTS.join(', '));
    console.log('⏳ This may take a few seconds...\n');

    // 并行测试所有端口
    const results = await Promise.all(
        COMMON_PORTS.map(port => testPort(port))
    );

    // 找到可用的端口
    const availablePorts = results.filter(result => result.available);

    if (availablePorts.length === 0) {
        console.log('❌ No A2A servers found on common ports');
        console.log('💡 Your agent might be running on a different port');
        console.log('💡 Or the agent might not be published yet');
        return;
    }

    console.log(`✅ Found ${availablePorts.length} running server(s):\n`);

    // 获取每个可用端口的详细信息
    for (const portResult of availablePorts) {
        console.log(`🔹 Port ${portResult.port}:`);
        console.log(`   Status: ${portResult.status}`);
        
        // 获取详细信息
        const info = await getPortInfo(portResult.port);
        if (info.success && info.info) {
            console.log(`   Agent: ${info.info.name || 'Unknown'}`);
            console.log(`   Description: ${info.info.description || 'No description'}`);
            console.log(`   URL: http://localhost:${portResult.port}`);
            
            // 检查是否是A2A服务器
            if (info.info.capabilities || info.info.skills) {
                console.log('   ✅ This appears to be an A2A agent server!');
            }
        } else {
            console.log('   ⚠️  Server responding but no agent info available');
        }
        console.log('');
    }

    // 提供测试建议
    if (availablePorts.length > 0) {
        const firstPort = availablePorts[0].port;
        console.log('🎯 Quick test commands:');
        console.log(`   curl http://localhost:${firstPort}/health`);
        console.log(`   curl http://localhost:${firstPort}/info`);
        console.log(`   node test-agent.js  # (make sure to update the port)`);
    }
}

/**
 * 检查特定端口
 */
async function checkSpecificPort(port) {
    console.log(`🔍 Checking port ${port}...`);
    
    const result = await testPort(port);
    
    if (!result.available) {
        console.log(`❌ Port ${port} is not accessible`);
        console.log('💡 Make sure your agent is published and running');
        return;
    }

    console.log(`✅ Port ${port} is responding!`);
    
    const info = await getPortInfo(port);
    if (info.success) {
        console.log('📋 Agent Information:');
        console.log(JSON.stringify(info.info, null, 2));
    } else {
        console.log('⚠️  Server is running but agent info is not available');
    }
}

// 主程序
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        const port = parseInt(args[0]);
        if (isNaN(port)) {
            console.log('❌ Invalid port number');
            process.exit(1);
        }
        await checkSpecificPort(port);
    } else {
        await scanPorts();
    }
}

// 运行
if (require.main === module) {
    main().catch(console.error);
}