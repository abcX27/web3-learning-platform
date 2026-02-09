import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始填充课程数据...');

  // 创建课程 1: Solidity 基础
  const course1 = await prisma.course.create({
    data: {
      title: 'Solidity 智能合约入门',
      description: '从零开始学习 Solidity 智能合约开发，掌握区块链编程基础',
      level: 'BEGINNER',
      duration: 300, // 5 小时
      orderIndex: 1,
      isPublished: true,
      chapters: {
        create: [
          {
            title: '第一章：什么是智能合约',
            content: `# 什么是智能合约

智能合约是运行在区块链上的自动执行程序。

## 核心特点

1. **自动执行**: 满足条件时自动执行
2. **不可篡改**: 部署后无法修改
3. **透明公开**: 所有人都可以查看代码
4. **去中心化**: 不依赖中心化服务器

## Solidity 简介

Solidity 是以太坊智能合约的主要编程语言。

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, Blockchain!";
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
\`\`\`

## 学习目标

- 理解智能合约的基本概念
- 了解 Solidity 语言特点
- 掌握合约的基本结构`,
            orderIndex: 1,
          },
          {
            title: '第二章：开发环境搭建',
            content: `# 开发环境搭建

学习如何搭建 Solidity 开发环境。

## 需要的工具

1. **Node.js**: JavaScript 运行环境
2. **Hardhat**: 智能合约开发框架
3. **MetaMask**: 浏览器钱包插件

## 安装 Hardhat

\`\`\`bash
npm install --save-dev hardhat
npx hardhat
\`\`\`

## 创建第一个项目

\`\`\`bash
mkdir my-contract
cd my-contract
npm init -y
npm install --save-dev hardhat
npx hardhat init
\`\`\`

## 项目结构

\`\`\`
my-contract/
├── contracts/      # 合约代码
├── scripts/        # 部署脚本
├── test/          # 测试文件
└── hardhat.config.js
\`\`\``,
            orderIndex: 2,
          },
          {
            title: '第三章：数据类型和变量',
            content: `# Solidity 数据类型

学习 Solidity 的基本数据类型。

## 值类型

### 布尔类型
\`\`\`solidity
bool public isActive = true;
\`\`\`

### 整数类型
\`\`\`solidity
uint256 public count = 100;
int256 public temperature = -10;
\`\`\`

### 地址类型
\`\`\`solidity
address public owner;
address payable public recipient;
\`\`\`

## 引用类型

### 数组
\`\`\`solidity
uint[] public numbers;
string[] public names;
\`\`\`

### 映射
\`\`\`solidity
mapping(address => uint) public balances;
mapping(uint => string) public idToName;
\`\`\`

### 结构体
\`\`\`solidity
struct User {
    string name;
    uint age;
    address wallet;
}

User public user;
\`\`\``,
            orderIndex: 3,
          },
        ],
      },
    },
  });

  console.log(`✓ 创建课程: ${course1.title}`);

  // 创建课程 2: Web3.js 开发
  const course2 = await prisma.course.create({
    data: {
      title: 'Web3.js 前端开发',
      description: '学习使用 Web3.js 构建去中心化应用（DApp）前端',
      level: 'INTERMEDIATE',
      duration: 240, // 4 小时
      orderIndex: 2,
      isPublished: true,
      chapters: {
        create: [
          {
            title: '第一章：Web3.js 简介',
            content: `# Web3.js 简介

Web3.js 是以太坊的 JavaScript API 库。

## 什么是 Web3.js

Web3.js 允许你的网页应用与以太坊区块链交互。

## 安装

\`\`\`bash
npm install web3
\`\`\`

## 基本使用

\`\`\`javascript
import Web3 from 'web3';

// 连接到以太坊节点
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');

// 获取最新区块号
const blockNumber = await web3.eth.getBlockNumber();
console.log('Latest block:', blockNumber);
\`\`\`

## 核心功能

1. 连接钱包
2. 读取区块链数据
3. 发送交易
4. 调用智能合约`,
            orderIndex: 1,
          },
          {
            title: '第二章：连接 MetaMask',
            content: `# 连接 MetaMask 钱包

学习如何在网页中连接 MetaMask。

## 检测 MetaMask

\`\`\`javascript
if (typeof window.ethereum !== 'undefined') {
    console.log('MetaMask is installed!');
}
\`\`\`

## 请求连接

\`\`\`javascript
async function connectWallet() {
    try {
        const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
        });
        console.log('Connected account:', accounts[0]);
        return accounts[0];
    } catch (error) {
        console.error('User rejected connection');
    }
}
\`\`\`

## 监听账户变化

\`\`\`javascript
window.ethereum.on('accountsChanged', (accounts) => {
    console.log('Account changed:', accounts[0]);
});
\`\`\``,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  console.log(`✓ 创建课程: ${course2.title}`);

  // 创建课程 3: DApp 实战
  const course3 = await prisma.course.create({
    data: {
      title: 'DApp 项目实战',
      description: '从零开始构建一个完整的去中心化应用',
      level: 'ADVANCED',
      duration: 480, // 8 小时
      orderIndex: 3,
      isPublished: true,
      chapters: {
        create: [
          {
            title: '第一章：项目规划',
            content: `# DApp 项目规划

学习如何规划一个 DApp 项目。

## 项目目标

构建一个去中心化的投票系统。

## 功能需求

1. 创建投票
2. 参与投票
3. 查看结果
4. 权限管理

## 技术栈

- **智能合约**: Solidity
- **前端**: React + Web3.js
- **开发工具**: Hardhat
- **测试网**: Sepolia

## 架构设计

\`\`\`
用户界面 (React)
    ↓
Web3.js
    ↓
智能合约 (Solidity)
    ↓
以太坊区块链
\`\`\``,
            orderIndex: 1,
          },
          {
            title: '第二章：智能合约开发',
            content: `# 投票合约开发

开发投票智能合约。

## 合约结构

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Proposal {
        string description;
        uint voteCount;
    }
    
    mapping(uint => Proposal) public proposals;
    mapping(address => bool) public hasVoted;
    uint public proposalCount;
    
    function createProposal(string memory _description) public {
        proposals[proposalCount] = Proposal(_description, 0);
        proposalCount++;
    }
    
    function vote(uint _proposalId) public {
        require(!hasVoted[msg.sender], "Already voted");
        require(_proposalId < proposalCount, "Invalid proposal");
        
        proposals[_proposalId].voteCount++;
        hasVoted[msg.sender] = true;
    }
}
\`\`\``,
            orderIndex: 2,
          },
        ],
      },
    },
  });

  console.log(`✓ 创建课程: ${course3.title}`);

  // 创建一些挑战
  const challenge1 = await prisma.challenge.create({
    data: {
      title: 'Hello World 合约',
      description: '创建你的第一个智能合约，实现一个简单的 Hello World 程序。',
      difficulty: 'EASY',
      template: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    // TODO: 添加一个 public string 变量 message
    
    // TODO: 添加一个 constructor 初始化 message 为 "Hello, World!"
    
    // TODO: 添加一个 getMessage 函数返回 message
}`,
      testCases: [
        {
          description: '合约应该有一个 message 变量',
          input: {},
          expected: 'message variable exists',
        },
        {
          description: 'getMessage 应该返回 "Hello, World!"',
          input: {},
          expected: 'Hello, World!',
        },
      ],
      solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor() {
        message = "Hello, World!";
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}`,
    },
  });

  console.log(`✓ 创建挑战: ${challenge1.title}`);

  const challenge2 = await prisma.challenge.create({
    data: {
      title: '简单计数器',
      description: '实现一个计数器合约，支持增加、减少和重置操作。',
      difficulty: 'EASY',
      template: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public count;
    
    // TODO: 实现 increment 函数，count 加 1
    
    // TODO: 实现 decrement 函数，count 减 1
    
    // TODO: 实现 reset 函数，count 重置为 0
}`,
      testCases: [
        {
          description: 'increment 应该增加 count',
          input: {},
          expected: 'count increases',
        },
        {
          description: 'decrement 应该减少 count',
          input: {},
          expected: 'count decreases',
        },
        {
          description: 'reset 应该重置 count 为 0',
          input: {},
          expected: 'count is 0',
        },
      ],
      solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint public count;
    
    function increment() public {
        count++;
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count--;
    }
    
    function reset() public {
        count = 0;
    }
}`,
    },
  });

  console.log(`✓ 创建挑战: ${challenge2.title}`);

  const challenge3 = await prisma.challenge.create({
    data: {
      title: '存储合约',
      description: '创建一个合约，可以存储和检索数字。',
      difficulty: 'MEDIUM',
      template: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    // TODO: 添加一个 mapping 存储地址到数字的映射
    
    // TODO: 实现 store 函数，存储调用者的数字
    
    // TODO: 实现 retrieve 函数，返回调用者存储的数字
}`,
      testCases: [
        {
          description: 'store 应该存储数字',
          input: { value: 42 },
          expected: 'stored',
        },
        {
          description: 'retrieve 应该返回存储的数字',
          input: {},
          expected: 42,
        },
      ],
      solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Storage {
    mapping(address => uint) private data;
    
    function store(uint _value) public {
        data[msg.sender] = _value;
    }
    
    function retrieve() public view returns (uint) {
        return data[msg.sender];
    }
}`,
    },
  });

  console.log(`✓ 创建挑战: ${challenge3.title}`);

  console.log('\n✅ 数据填充完成！');
  console.log(`- 创建了 3 门课程`);
  console.log(`- 创建了 7 个章节`);
  console.log(`- 创建了 3 个挑战`);
}

main()
  .catch((e) => {
    console.error('❌ 填充数据失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
