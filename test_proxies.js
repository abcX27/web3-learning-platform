const https = require('https');
const http = require('http');
const { URL } = require('url');

// 测试代理连接
function testProxy(proxy) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        // 创建代理请求
        const proxyOptions = {
            host: proxy.server,
            port: proxy.port,
            method: 'CONNECT',
            path: 'www.google.com:443',
            timeout: 5000
        };
        
        const req = http.request(proxyOptions);
        
        req.on('connect', (res, socket) => {
            const latency = Date.now() - startTime;
            socket.end();
            resolve({
                name: proxy.name,
                status: 'success',
                latency: latency,
                message: `连接成功 (${latency}ms)`
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                name: proxy.name,
                status: 'timeout',
                message: '连接超时'
            });
        });
        
        req.on('error', (err) => {
            resolve({
                name: proxy.name,
                status: 'error',
                message: err.message
            });
        });
        
        req.end();
    });
}

// 简单的 TCP 连接测试
function testTCP(proxy) {
    return new Promise((resolve) => {
        const net = require('net');
        const startTime = Date.now();
        
        const socket = new net.Socket();
        socket.setTimeout(5000);
        
        socket.connect(proxy.port, proxy.server, () => {
            const latency = Date.now() - startTime;
            socket.destroy();
            resolve({
                name: proxy.name,
                status: 'tcp_ok',
                latency: latency,
                message: `TCP 连接成功 (${latency}ms)`
            });
        });
        
        socket.on('timeout', () => {
            socket.destroy();
            resolve({
                name: proxy.name,
                status: 'timeout',
                message: 'TCP 连接超时'
            });
        });
        
        socket.on('error', (err) => {
            resolve({
                name: proxy.name,
                status: 'error',
                message: `TCP 错误: ${err.message}`
            });
        });
    });
}

async function main() {
    const yaml = require('js-yaml');
    const fs = require('fs');
    
    console.log('正在读取配置文件...\n');
    const config = yaml.load(fs.readFileSync('clash_evoxt.yaml', 'utf8'));
    
    // 测试前10个节点
    const testProxies = config.proxies.slice(0, 10);
    
    console.log(`开始测试 ${testProxies.length} 个节点...\n`);
    console.log('='.repeat(80));
    
    let successCount = 0;
    let failCount = 0;
    
    for (const proxy of testProxies) {
        console.log(`\n测试节点: ${proxy.name}`);
        console.log(`地址: ${proxy.server}:${proxy.port}`);
        
        // 先测试 TCP 连接
        const result = await testTCP(proxy);
        
        if (result.status === 'tcp_ok') {
            console.log(`✅ ${result.message}`);
            successCount++;
        } else {
            console.log(`❌ ${result.message}`);
            failCount++;
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n测试总结:');
    console.log(`✅ 成功: ${successCount} 个`);
    console.log(`❌ 失败: ${failCount} 个`);
    console.log(`📊 成功率: ${(successCount / testProxies.length * 100).toFixed(1)}%`);
    
    if (successCount === 0) {
        console.log('\n⚠️  所有节点都无法连接，可能的原因:');
        console.log('   1. 需要认证信息（用户名/密码）');
        console.log('   2. 节点已失效');
        console.log('   3. 网络防火墙阻止');
        console.log('   4. 需要使用订阅链接获取最新节点');
    } else if (successCount < testProxies.length / 2) {
        console.log('\n⚠️  部分节点可用，建议:');
        console.log('   1. 联系 EVOXT 获取订阅链接');
        console.log('   2. 确认是否需要认证信息');
    } else {
        console.log('\n✅ 大部分节点可用！');
        console.log('   如果 Clash 中无法使用，可能需要添加认证信息');
    }
}

main().catch(console.error);
