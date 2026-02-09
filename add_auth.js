const yaml = require('js-yaml');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    console.log('='.repeat(60));
    console.log('EVOXT Clash 配置 - 添加认证信息');
    console.log('='.repeat(60));
    console.log('\n请输入你的 EVOXT 认证信息：\n');
    
    const username = await question('用户名 (username): ');
    const password = await question('密码 (password): ');
    
    if (!username || !password) {
        console.log('\n❌ 用户名和密码不能为空！');
        rl.close();
        return;
    }
    
    console.log('\n正在读取配置文件...');
    const config = yaml.load(fs.readFileSync('clash_evoxt.yaml', 'utf8'));
    
    console.log(`正在为 ${config.proxies.length} 个节点添加认证信息...`);
    
    // 为所有代理添加认证
    config.proxies.forEach(proxy => {
        proxy.username = username;
        proxy.password = password;
    });
    
    // 保存新配置
    const outputFile = 'clash_evoxt_auth.yaml';
    const yamlStr = yaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
    });
    
    fs.writeFileSync(outputFile, yamlStr, 'utf-8');
    
    console.log(`\n✅ 完成！新配置已保存到: ${outputFile}`);
    console.log('\n使用方法:');
    console.log(`1. 在 Clash 中导入 ${outputFile}`);
    console.log('2. 测试节点连接');
    console.log('3. 如果还是不行，联系 EVOXT 获取订阅链接\n');
    
    rl.close();
}

main().catch(err => {
    console.error('错误:', err);
    rl.close();
});
