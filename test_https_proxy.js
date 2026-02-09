const http = require('http');
const https = require('https');
const tls = require('tls');

// 测试 HTTPS 代理 (CONNECT 方法)
function testHTTPSProxy(proxy) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const options = {
            host: proxy.server,
            port: proxy.port,
            method: 'CONNECT',
            path: 'www.google.com:443',
            timeout: 10000
        };
        
        const req = http.request(options);
        
        req.on('connect', (res, socket, head) => {
            const latency = Date.now() - startTime;
            
            if (res.statusCode === 200) {
                socket.end();
                resolve({
                    name: proxy.name,
                    status: 'success',
                    latency: latency,
                    message: `✅ HTTPS 代理可用 (${latency}ms)`
                });
            } else if (res.statusCode === 407) {
                socket.end();
                resolve({
                    name: proxy.name,
                    status: 'auth_required',
                    message: `🔐 需要认证 (407 Proxy Authentication Required)`
                });
            } else {
                socket.end();
                resolve({
                    name: proxy.name,
                    status: 'error',
                    message: `❌ 返回状态码: ${res.statusCode}`
                });
            }
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                name: proxy.name,
                status: 'timeout',
                message: '❌ 连接超时'
            });
        });
        
        req.on('error', (err) => {
            resolve({
                name: proxy.name,
                status: 'error',
                message: `❌ ${err.message}`
            });
        });
        
        req.end();
    });
}

async function main() {
    const yaml = require('js-yaml');
    const fs = require('fs');
    
    console.log('正在读取配置文件...\n');
    const config = yaml.load(fs.readFileSync('clash_evoxt.yaml', 'utf8'));
    
    // 测试多个地区的节点
    const testProxies = [
        ...config.proxies.slice(0, 5),   // 洛杉矶
        ...config.proxies.slice(5, 8),   // 纽瓦克
        ...config.proxies.slice(13, 16)  // 日本
    ];
    
    console.log(`开始测试 ${testProxies.length} 个节点的 HTTPS 代理功能...\n`);
    console.log('='.repeat(80));
    
    let successCount = 0;
    let authRequiredCount = 0;
    let failCount = 0;
    
    for (const proxy of testProxies) {
        console.log(`\n[${testProxies.indexOf(proxy) + 1}/${testProxies.length}] ${proxy.name}`);
        console.log(`    地址: ${proxy.server}:${proxy.port}`);
        
        const result = await testHTTPSProxy(proxy);
        console.log(`    ${result.message}`);
        
        if (result.status === 'success') {
            successCount++;
        } else if (result.status === 'auth_required') {
            authRequiredCount++;
        } else {
            failCount++;
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n📊 测试总结:');
    console.log(`   ✅ 可直接使用: ${successCount} 个 (${(successCount/testProxies.length*100).toFixed(1)}%)`);
    console.log(`   🔐 需要认证: ${authRequiredCount} 个 (${(authRequiredCount/testProxies.length*100).toFixed(1)}%)`);
    console.log(`   ❌ 无法连接: ${failCount} 个 (${(failCount/testProxies.length*100).toFixed(1)}%)`);
    
    console.log('\n' + '='.repeat(80));
    
    if (successCount > 0) {
        console.log('\n✅ 好消息！部分节点可以直接使用');
        console.log('   clash_evoxt.yaml 配置文件应该可以在 Clash 中工作');
        console.log('   建议：导入配置后测试不同节点，选择可用的');
    }
    
    if (authRequiredCount > 0) {
        console.log('\n🔐 部分节点需要认证');
        console.log('   解决方案：');
        console.log('   1. 联系 EVOXT 获取用户名/密码');
        console.log('   2. 使用 EVOXT 提供的订阅链接（推荐）');
    }
    
    if (failCount === testProxies.length) {
        console.log('\n❌ 所有测试节点都无法连接');
        console.log('   建议：使用 EVOXT 官方提供的 Clash 订阅链接');
    }
    
    console.log('\n💡 提示：');
    console.log('   - 在 Clash 中导入 clash_evoxt.yaml');
    console.log('   - 使用"延迟测试"功能找出可用节点');
    console.log('   - 或联系 EVOXT 获取官方订阅链接');
}

main().catch(console.error);
