#!/usr/bin/env node

const http = require('http');

const PORT = 3841;

console.log(`🔍 Testing http://localhost:${PORT}/`);

const req = http.request({
    hostname: 'localhost',
    port: PORT,
    path: '/',
    method: 'GET',
    timeout: 5000
}, (res) => {
    console.log(`✅ Connected! Status: ${res.statusCode}`);
    console.log(`📋 Headers:`, res.headers);
    
    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });
    
    res.on('end', () => {
        console.log(`📄 Response body:`);
        try {
            const json = JSON.parse(body);
            console.log(JSON.stringify(json, null, 2));
        } catch (e) {
            console.log(body);
        }
    });
});

req.on('error', (err) => {
    console.log(`❌ Error: ${err.message}`);
    console.log(`💡 This might mean:`);
    console.log(`   - The server is not running on port ${PORT}`);
    console.log(`   - The agent was not published successfully`);
    console.log(`   - There's a firewall blocking the connection`);
});

req.on('timeout', () => {
    console.log(`⏰ Timeout: Server didn't respond within 5 seconds`);
    req.destroy();
});

req.end();