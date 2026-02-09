import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean existing data (in development only)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...');
    await prisma.userBadge.deleteMany();
    await prisma.badge.deleteMany();
    await prisma.note.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.challengeSubmit.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.progress.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Existing data cleaned');
  }

  // Create admin user
  console.log('👤 Creating users...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@web3learning.com',
      passwordHash: adminPassword,
      username: 'admin',
      role: 'ADMIN',
      bio: 'Platform administrator',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      passwordHash: userPassword,
      username: 'web3learner',
      role: 'USER',
      bio: 'Passionate about blockchain technology',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      passwordHash: userPassword,
      username: 'blockchain_dev',
      role: 'USER',
      walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      bio: 'Full-stack blockchain developer',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
    },
  });

  console.log('✅ Users created');

  // Create courses
  console.log('📚 Creating courses...');
  
  const course1 = await prisma.course.create({
    data: {
      title: '区块链基础',
      description: '了解区块链的基本概念、工作原理和应用场景',
      level: 'BEGINNER',
      duration: 120,
      orderIndex: 1,
      isPublished: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Solidity 智能合约开发',
      description: '学习 Solidity 编程语言，掌握智能合约开发技能',
      level: 'INTERMEDIATE',
      duration: 240,
      orderIndex: 2,
      isPublished: true,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'DApp 全栈开发',
      description: '构建完整的去中心化应用，包括前端和智能合约',
      level: 'ADVANCED',
      duration: 360,
      orderIndex: 3,
      isPublished: true,
    },
  });

  console.log('✅ Courses created');

  // Create chapters for course 1
  console.log('📖 Creating chapters...');
  
  const chapter1_1 = await prisma.chapter.create({
    data: {
      courseId: course1.id,
      title: '什么是区块链',
      content: `# 什么是区块链

## 简介

区块链（Blockchain）是一种分布式账本技术，它通过密码学方法将数据区块按时间顺序链接起来，形成一个不可篡改的数据链。

## 核心特点

1. **去中心化**: 没有中央控制机构
2. **不可篡改**: 数据一旦写入很难更改
3. **透明性**: 所有交易公开可查
4. **安全性**: 使用密码学保护数据

## 工作原理

\`\`\`
区块 1 -> 区块 2 -> 区块 3 -> ...
每个区块包含:
- 交易数据
- 时间戳
- 前一个区块的哈希值
\`\`\`

## 应用场景

- 加密货币（比特币、以太坊）
- 供应链管理
- 数字身份认证
- 智能合约

## 小结

区块链技术正在改变我们处理数据和信任的方式，为未来的数字经济奠定基础。`,
      orderIndex: 1,
    },
  });

  const chapter1_2 = await prisma.chapter.create({
    data: {
      courseId: course1.id,
      title: '比特币和以太坊',
      content: `# 比特币和以太坊

## 比特币 (Bitcoin)

比特币是第一个成功的加密货币，由中本聪在 2009 年创建。

### 特点
- 总量限制: 2100 万枚
- 区块时间: 约 10 分钟
- 共识机制: 工作量证明 (PoW)

## 以太坊 (Ethereum)

以太坊是一个支持智能合约的区块链平台，由 Vitalik Buterin 在 2015 年创建。

### 特点
- 支持智能合约
- 图灵完备
- 区块时间: 约 12-15 秒
- 共识机制: 权益证明 (PoS)

## 主要区别

| 特性 | 比特币 | 以太坊 |
|------|--------|--------|
| 目的 | 数字货币 | 智能合约平台 |
| 编程语言 | Script | Solidity |
| 应用场景 | 支付 | DApp 开发 |

## 代码示例

\`\`\`solidity
// 简单的以太坊智能合约
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, Ethereum!";
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}
\`\`\``,
      orderIndex: 2,
    },
  });

  // Create chapters for course 2
  const chapter2_1 = await prisma.chapter.create({
    data: {
      courseId: course2.id,
      title: 'Solidity 基础语法',
      content: `# Solidity 基础语法

## 什么是 Solidity

Solidity 是一种面向合约的高级编程语言，用于编写以太坊智能合约。

## 基本结构

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MyContract {
    // 状态变量
    uint256 public myNumber;
    
    // 构造函数
    constructor() {
        myNumber = 0;
    }
    
    // 函数
    function setNumber(uint256 _number) public {
        myNumber = _number;
    }
    
    function getNumber() public view returns (uint256) {
        return myNumber;
    }
}
\`\`\`

## 数据类型

### 值类型
- \`bool\`: 布尔值
- \`uint\`: 无符号整数
- \`int\`: 有符号整数
- \`address\`: 地址类型

### 引用类型
- \`string\`: 字符串
- \`array\`: 数组
- \`mapping\`: 映射

## 可见性修饰符

- \`public\`: 公开访问
- \`private\`: 仅合约内部
- \`internal\`: 合约及继承合约
- \`external\`: 仅外部调用

## 练习

尝试创建一个简单的存储合约，可以存储和读取一个数字。`,
      orderIndex: 1,
    },
  });

  console.log('✅ Chapters created');

  // Create challenges
  console.log('🎯 Creating challenges...');
  
  const challenge1 = await prisma.challenge.create({
    data: {
      title: 'Hello World 合约',
      description: `创建一个简单的 Hello World 智能合约。

要求：
1. 合约名称为 HelloWorld
2. 包含一个公开的字符串变量 message
3. message 的初始值为 "Hello, Web3!"
4. 提供一个函数可以修改 message`,
      difficulty: 'EASY',
      template: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    // 在这里编写你的代码
}`,
      testCases: JSON.stringify([
        {
          name: '合约可以编译',
          type: 'compile',
        },
        {
          name: 'message 变量存在且为 public',
          type: 'variable',
          variable: 'message',
          visibility: 'public',
        },
        {
          name: 'message 初始值正确',
          type: 'value',
          variable: 'message',
          expected: 'Hello, Web3!',
        },
      ]),
      solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message = "Hello, Web3!";
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
}`,
    },
  });

  const challenge2 = await prisma.challenge.create({
    data: {
      title: '简单存储合约',
      description: `创建一个可以存储和读取数字的合约。

要求：
1. 合约名称为 SimpleStorage
2. 包含一个 uint256 类型的状态变量 value
3. 提供 setValue 函数设置值
4. 提供 getValue 函数读取值`,
      difficulty: 'EASY',
      template: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // 在这里编写你的代码
}`,
      testCases: JSON.stringify([
        {
          name: '合约可以编译',
          type: 'compile',
        },
        {
          name: 'value 变量存在',
          type: 'variable',
          variable: 'value',
        },
        {
          name: 'setValue 函数存在',
          type: 'function',
          function: 'setValue',
        },
        {
          name: 'getValue 函数存在',
          type: 'function',
          function: 'getValue',
        },
      ]),
      solution: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 public value;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
    
    function getValue() public view returns (uint256) {
        return value;
    }
}`,
    },
  });

  console.log('✅ Challenges created');

  // Create badges
  console.log('🏆 Creating badges...');
  
  await prisma.badge.createMany({
    data: [
      {
        name: '初学者',
        description: '完成第一个课程',
        icon: '🎓',
        level: 'BRONZE',
        condition: JSON.stringify({ type: 'course_complete', count: 1 }),
      },
      {
        name: '勤奋学习者',
        description: '完成 5 个课程',
        icon: '📚',
        level: 'SILVER',
        condition: JSON.stringify({ type: 'course_complete', count: 5 }),
      },
      {
        name: '课程大师',
        description: '完成 10 个课程',
        icon: '🎖️',
        level: 'GOLD',
        condition: JSON.stringify({ type: 'course_complete', count: 10 }),
      },
      {
        name: '挑战新手',
        description: '完成第一个编程挑战',
        icon: '⚔️',
        level: 'BRONZE',
        condition: JSON.stringify({ type: 'challenge_complete', count: 1 }),
      },
      {
        name: '挑战达人',
        description: '完成 10 个编程挑战',
        icon: '🗡️',
        level: 'SILVER',
        condition: JSON.stringify({ type: 'challenge_complete', count: 10 }),
      },
      {
        name: '挑战大师',
        description: '完成 30 个编程挑战',
        icon: '🏅',
        level: 'GOLD',
        condition: JSON.stringify({ type: 'challenge_complete', count: 30 }),
      },
      {
        name: '连续学习 7 天',
        description: '保持 7 天连续学习',
        icon: '🔥',
        level: 'SILVER',
        condition: JSON.stringify({ type: 'streak', days: 7 }),
      },
      {
        name: '社区贡献者',
        description: '发布 10 个帖子或评论',
        icon: '💬',
        level: 'BRONZE',
        condition: JSON.stringify({ type: 'community', count: 10 }),
      },
    ],
  });

  console.log('✅ Badges created');

  // Create some progress for user1
  console.log('📊 Creating user progress...');
  
  await prisma.progress.create({
    data: {
      userId: user1.id,
      chapterId: chapter1_1.id,
      completed: true,
      completedAt: new Date(),
    },
  });

  await prisma.progress.create({
    data: {
      userId: user1.id,
      chapterId: chapter1_2.id,
      completed: false,
    },
  });

  console.log('✅ User progress created');

  // Create community posts
  console.log('💬 Creating community posts...');
  
  const post1 = await prisma.post.create({
    data: {
      userId: user1.id,
      title: '如何理解 Solidity 的 modifier？',
      content: `我在学习 Solidity 时遇到了 modifier 的概念，不太理解它的作用和使用场景。

有人能解释一下吗？最好能给个例子。谢谢！`,
      likes: 12,
      views: 89,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      userId: user2.id,
      title: '部署合约时 gas 费用太高怎么办？',
      content: `我在 Sepolia 测试网部署合约时发现 gas 费用很高，有什么优化方法吗？`,
      likes: 8,
      views: 45,
    },
  });

  // Create comments
  await prisma.comment.create({
    data: {
      userId: user2.id,
      postId: post1.id,
      content: `modifier 是一种代码复用机制，可以在函数执行前后添加检查逻辑。

例如：
\`\`\`solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}

function withdraw() public onlyOwner {
    // 只有 owner 可以调用
}
\`\`\``,
    },
  });

  console.log('✅ Community posts and comments created');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Users: 3 (1 admin, 2 regular users)`);
  console.log(`- Courses: 3`);
  console.log(`- Chapters: 3`);
  console.log(`- Challenges: 2`);
  console.log(`- Badges: 8`);
  console.log(`- Posts: 2`);
  console.log(`- Comments: 1`);
  console.log('\n🔑 Test Credentials:');
  console.log('Admin: admin@web3learning.com / admin123');
  console.log('User: user1@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
