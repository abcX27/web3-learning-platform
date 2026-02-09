# Web3 学习平台

一个全栈 Web3 学习平台，提供区块链和 Solidity 课程，支持传统登录和 MetaMask 钱包登录。

## 🚀 快速开始

### 前置要求
- Node.js 18+
- PostgreSQL 15
- npm 或 yarn

### 安装步骤

1. **克隆项目**
```bash
git clone <repository-url>
cd web3-learning-platform
```

2. **安装依赖**
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

3. **配置环境变量**
```bash
# 后端配置
cd backend
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等

# 前端配置
cd ../frontend
cp .env.example .env.local
# 编辑 .env.local 文件
```

4. **初始化数据库**
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed  # 可选：添加测试数据
```

5. **启动服务**
```bash
# 启动后端（在 backend 目录）
npm run dev

# 启动前端（在 frontend 目录，新终端）
npm run dev
```

6. **访问应用**
- 前端: http://localhost:3002
- 后端 API: http://localhost:4000
- 健康检查: http://localhost:4000/health

## ✨ 功能特性

### 已实现功能 ✅

#### 用户认证
- ✅ 邮箱/密码注册和登录
- ✅ MetaMask 钱包登录
- ✅ JWT token 认证
- ✅ 密码加密存储

#### 用户个人中心
- ✅ 个人信息展示和编辑
- ✅ 学习统计（课程、挑战、徽章、学习时长）
- ✅ 课程进度追踪
- ✅ 钱包地址显示

#### 课程系统
- ✅ 课程列表浏览
- ✅ 课程搜索
- ✅ 难度级别筛选
- ✅ 分页功能
- ✅ 章节管理
- ✅ 学习进度跟踪

### 待实现功能 📋

- 📋 课程详情页面
- 📋 在线代码编辑器（Monaco Editor）
- 📋 Solidity 编译器
- 📋 合约部署功能
- 📋 挑战系统
- 📋 社区讨论
- 📋 笔记系统
- 📋 徽章系统

## 🏗️ 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **样式**: Tailwind CSS, shadcn/ui
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **Web3**: ethers.js v6

### 后端
- **运行时**: Node.js 18+
- **框架**: Express 4
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 15
- **认证**: JWT, bcrypt
- **日志**: Winston

## 📁 项目结构

```
web3-learning-platform/
├── backend/                 # 后端应用
│   ├── src/
│   │   ├── controllers/    # 控制器
│   │   ├── services/       # 业务逻辑
│   │   ├── routes/         # 路由
│   │   ├── middleware/     # 中间件
│   │   ├── utils/          # 工具函数
│   │   └── index.ts        # 入口文件
│   ├── prisma/
│   │   ├── schema.prisma   # 数据库模型
│   │   └── migrations/     # 数据库迁移
│   └── package.json
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── app/           # Next.js 页面
│   │   ├── components/    # React 组件
│   │   ├── lib/           # 工具库
│   │   ├── store/         # 状态管理
│   │   └── types/         # TypeScript 类型
│   └── package.json
└── README.md
```

## 🔌 API 端点

### 认证 API
```
POST   /api/auth/register        # 用户注册
POST   /api/auth/login           # 用户登录
POST   /api/auth/wallet-login    # MetaMask 登录
GET    /api/auth/me              # 获取当前用户
PUT    /api/auth/profile         # 更新个人资料
POST   /api/auth/logout          # 登出
```

### 课程 API
```
GET    /api/courses              # 课程列表
GET    /api/courses/search       # 搜索课程
GET    /api/courses/:id          # 课程详情
GET    /api/courses/:id/chapters # 课程章节
GET    /api/chapters/:id         # 章节详情
POST   /api/chapters/:id/complete # 标记完成
```

### 管理员 API
```
POST   /api/admin/courses        # 创建课程
PUT    /api/admin/courses/:id    # 更新课程
DELETE /api/admin/courses/:id    # 删除课程
POST   /api/admin/chapters       # 创建章节
PUT    /api/admin/chapters/:id   # 更新章节
DELETE /api/admin/chapters/:id   # 删除章节
```

## 🗄️ 数据库模型

- **User**: 用户信息
- **Course**: 课程信息
- **Chapter**: 章节内容
- **Progress**: 学习进度
- **Challenge**: 编程挑战
- **ChallengeSubmit**: 挑战提交
- **Post**: 社区帖子
- **Comment**: 评论
- **Note**: 学习笔记
- **Badge**: 徽章
- **UserBadge**: 用户徽章关联

## 🧪 测试

```bash
# 后端测试
cd backend
npm test

# 前端测试
cd frontend
npm test
```

## 📝 开发指南

### 添加新的 API 端点

1. 在 `backend/src/services/` 创建服务
2. 在 `backend/src/controllers/` 创建控制器
3. 在 `backend/src/routes/` 添加路由
4. 在 `backend/src/index.ts` 注册路由

### 添加新的前端页面

1. 在 `frontend/src/app/` 创建页面
2. 在 `frontend/src/components/` 创建组件
3. 在 `frontend/src/store/` 添加状态管理（如需要）

## 🔐 环境变量

### 后端 (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/web3_learning
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3002
PORT=4000
```

### 前端 (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📊 项目进度

- ✅ Phase 1: 基础架构 (100%)
- 🚧 Phase 2: 核心功能 (50%)
- ⏳ Phase 3: 高级功能 (0%)
- ⏳ Phase 4: 优化和测试 (0%)
- ⏳ Phase 5: 上线部署 (0%)

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

项目链接: [https://github.com/yourusername/web3-learning-platform](https://github.com/yourusername/web3-learning-platform)

## 🙏 致谢

- Next.js
- Prisma
- shadcn/ui
- ethers.js
- 所有开源贡献者

---

**当前版本**: v0.2.0  
**最后更新**: 2026-02-07
