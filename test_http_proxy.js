const http = require('http');
const https = require('https');
const { URL } = require('url');

// 测试 HTTP 代理
function testHTTPProxy(proxy) {
    return new Promise((resolve) => {
        const startTime = Date.now();
        
        const options = {
            host: proxy.server,
            port: proxy.port,
            path: 'http://www.google.com',
            method: 'GET',
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        };
        
        const req = http.request(options, (res) => {
            const latency = Date.now() - startTime;
            let data = '';
            
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    name: proxy.name,
                    status: 'success',
                    statusCode: res.statusCode,
                    latency: latency,
                    message: `HTTP 代理工作正常 (${res.statusCode}, ${latency}ms)`
                });
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                name: proxy.name,
                status: 'timeout',
                message: 'HTTP 请求超时'
            });
        });
        
        req.on('error', (err) => {
            resolve({
                name: proxy.name,
                status: 'error',
                message: `HTTP 错误: ${err.message}`
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
    
    // 测试前5个洛杉矶节点（延迟最低）
    const testProxies = config.proxies.slice(0, 5);
    
    console.log(`开始测试 HTTP 代理功能...\n`);
    console.log('='.repeat(80));
    
    let successCount = 0;
    let authRequiredCount = 0;
    let failCount = 0;
    
    for (const proxy of testProxies) {
        console.log(`\n测试节点: ${proxy.name}`);
        console.log(`地址: ${proxy.server}:${proxy.port}`);
        
        const result = await testHTTPProxy(proxy);
        
        if (result.status === 'success') {
            console.log(`✅ ${result.message}`);
            successCount++;
        } else if (result.message.includes('407') || result.message.includes('auth')) {
            console.log(`🔐 需要认证 - ${result.message}`);
            authRequiredCount++;
        } else {
            console.log(`❌ ${result.message}`);
            failCount++;
        }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('\n测试总结:');
    console.log(`✅ 无需认证可用: ${successCount} 个`);
    console.log(`🔐 需要认证: ${authRequiredCount} 个`);
    console.log(`❌ 连接失败: ${failCount} 个`);
    
    if (authRequiredCount > 0) {
        console.log('\n⚠️  节点需要认证信息！');
        console.log('\n解决方案:');
        console.log('1. 联系 EVOXT 获取用户名和密码');
        console.log('2. 或者获取 Clash 订阅链接（推荐）');
        console.log('3. 修改 generate_clash.js 添加认证信息后重新生成');
    } else if (successCount > 0) {
        console.log('\n✅ 节点可以直接使用，无需认证！');
        console.log('   配置文件应该可以在 Clash 中正常工作');
    } else {
        console.log('\n❌ 节点无法使用');
        console.log('   建议使用 EVOXT 提供的订阅链接');
    }
}

main().catch(console.error);
