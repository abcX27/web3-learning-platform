const yaml = require('js-yaml');
const fs = require('fs');

// 常见的默认认证信息
const commonAuths = [
    { username: '', password: '' },  // 无认证
    { username: 'user', password: 'pass' },
    { username: 'admin', password: 'admin' },
    { username: 'proxy', password: 'proxy' },
    { username: 'evoxt', password: 'evoxt' },
];

function createConfigWithAuth(auth, index) {
    console.log(`\n生成配置 ${index + 1}: username="${auth.username || '(空)'}", password="${auth.password || '(空)'}"`);
    
    const config = yaml.load(fs.readFileSync('clash_evoxt.yaml', 'utf8'));
    
    // 为所有代理添加认证
    config.proxies.forEach(proxy => {
        if (auth.username || auth.password) {
            proxy.username = auth.username;
            proxy.password = auth.password;
        }
    });
    
    const outputFile = `clash_evoxt_test${index + 1}.yaml`;
    const yamlStr = yaml.dump(config, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        sortKeys: false
    });
    
    fs.writeFileSync(outputFile, yamlStr, 'utf-8');
    console.log(`   ✅ 已保存: ${outputFile}`);
    
    return outputFile;
}

function main() {
    console.log('='.repeat(60));
    console.log('生成多个测试配置（使用常见认证信息）');
    console.log('='.repeat(60));
    
    const files = commonAuths.map((auth, index) => createConfigWithAuth(auth, index));
    
    console.log('\n' + '='.repeat(60));
    console.log('✅ 完成！已生成以下配置文件：\n');
    files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file}`);
    });
    
    console.log('\n使用方法:');
    console.log('1. 依次在 Clash 中导入这些配置');
    console.log('2. 测试哪个配置可用');
    console.log('3. 如果都不行，运行 node add_auth.js 手动输入认证信息');
    console.log('4. 或联系 EVOXT 获取正确的认证信息或订阅链接\n');
}

main();
