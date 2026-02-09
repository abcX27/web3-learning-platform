# Web3 Learning Platform - Frontend

基于 Next.js 14 的 Web3 学习平台前端应用。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **UI 库**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **代码编辑器**: Monaco Editor
- **Web3 库**: Ethers.js v6
- **Markdown**: react-markdown
- **测试**: Jest + React Testing Library + fast-check

## 项目结构

```
src/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # 认证相关页面组
│   │   ├── login/                # 登录页面
│   │   ├── register/             # 注册页面
│   │   └── layout.tsx            # 认证布局
│   ├── (dashboard)/              # 主应用页面组
│   │   ├── courses/              # 课程页面
│   │   ├── challenges/           # 挑战页面
│   │   ├── editor/               # 编辑器页面
│   │   ├── community/            # 社区页面
│   │   ├── profile/              # 个人中心
│   │   └── layout.tsx            # 主应用布局
│   ├── layout.tsx                # 根布局
│   ├── page.tsx                  # 首页
│   └── globals.css               # 全局样式
├── components/                   # 可复用组件
│   └── ui/                       # shadcn/ui 组件
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/                          # 工具库
│   ├── api.ts                    # API 客户端
│   └── utils.ts                  # 工具函数
├── store/                        # Zustand 状态管理
│   ├── authStore.ts              # 认证状态
│   ├── courseStore.ts            # 课程状态
│   └── editorStore.ts            # 编辑器状态
└── types/                        # TypeScript 类型定义
    ├── user.ts                   # 用户类型
    ├── course.ts                 # 课程类型
    ├── challenge.ts              # 挑战类型
    └── api.ts                    # API 类型
```

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行 ESLint
npm run lint

# 修复 ESLint 错误
npm run lint:fix

# 格式化代码
npm run format

# 运行测试
npm test

# 运行测试（监听模式）
npm run test:watch

# TypeScript 类型检查
npm run type-check
```

## 环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_WS_URL=ws://localhost:4000
```

## 开发指南

### 添加新页面

1. 在 `src/app` 目录下创建新的路由文件夹
2. 创建 `page.tsx` 文件
3. 如果需要布局，创建 `layout.tsx` 文件

### 添加新组件

1. 在 `src/components` 目录下创建组件文件
2. 使用 TypeScript 定义组件 props
3. 使用 Tailwind CSS 进行样式设计

### 状态管理

使用 Zustand 进行状态管理：

```typescript
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, isAuthenticated } = useAuthStore();
  // ...
}
```

### API 调用

使用封装的 API 客户端：

```typescript
import { api } from '@/lib/api';

async function fetchCourses() {
  const response = await api.get('/api/courses');
  return response.data;
}
```

## 路由组

### (auth) 组

认证相关页面，包含登录和注册页面。使用独立的布局，带有渐变背景。

### (dashboard) 组

主应用页面，包含课程、挑战、编辑器等功能页面。使用统一的 Header 和 Footer 布局。

## 样式系统

使用 Tailwind CSS 和 shadcn/ui 设计系统：

- 主色调：蓝色 (#3B82F6)
- 辅助色：紫色 (#8B5CF6)
- 支持深色模式
- 响应式设计

## 测试

- 单元测试：Jest + React Testing Library
- 属性测试：fast-check
- 测试覆盖率目标：> 80%

## 部署

使用 Docker 部署：

```bash
docker build -t web3-learning-frontend .
docker run -p 3000:3000 web3-learning-frontend
```

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 许可证

MIT
