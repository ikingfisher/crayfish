# Crayfish Project

## 项目简介
这是一个基于 Next.js 15 和 React 19 的现代化工具类项目，使用 TypeScript 和 Tailwind CSS 构建。

## 技术栈
- **框架**: Next.js 15.2.4
- **前端库**: React 19
- **语言**: TypeScript 5
- **样式**: Tailwind CSS 4.1.9
- **UI组件**: Radix UI
- **图标**: Lucide React
- **表单**: React Hook Form + Zod
- **构建工具**: Next.js 内置构建系统

## 系统要求
- Node.js 18.0 或更高版本
- npm 8.0 或更高版本（推荐使用 npm 或 pnpm）

## 快速开始

### 1. 克隆项目
```bash
git clone https://github.com/your-repo/crayfish.git
cd crayfish
```

### 2. 安装依赖
```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐)
pnpm install

# 或使用 yarn
yarn install
```

### 3. 开发环境运行
```bash
# 启动开发服务器 (默认端口: 3000)
npm run dev

# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 构建和部署

### 开发构建
```bash
# 构建项目
npm run build

# 构建完成后启动生产环境服务器
npm start
```

### 生产环境部署
```bash
# 1. 构建优化版本
npm run build

# 2. 启动生产服务器
npm start
```

构建产物将输出到 `.next` 目录。

## 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器，支持热重载 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器（需要先运行 build） |
| `npm run lint` | 运行 ESLint 代码检查 |

## 项目结构

```
crayfish/
├── .next/                  # Next.js 构建输出目录
├── public/                 # 静态资源文件
├── src/                    # 源代码目录
│   ├── app/                # Next.js App Router 目录
│   ├── components/         # React 组件
│   ├── lib/                # 工具函数和配置
│   └── styles/             # 样式文件
├── next.config.mjs         # Next.js 配置文件
├── tailwind.config.js      # Tailwind CSS 配置
├── postcss.config.mjs      # PostCSS 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 项目依赖和脚本
```

### 重要目录说明
- **`src/app/`**: Next.js 13+ App Router 的主要目录，包含页面路由
- **`src/components/`**: 可复用的 React 组件
- **`src/lib/`**: 工具函数、常量、配置文件等
- **`public/`**: 静态资源，如图片、图标等
- **`.next/`**: Next.js 自动生成的构建输出，无需手动修改

## 开发指南

### 环境变量
如需要环境变量，请在项目根目录创建 `.env.local` 文件：
```bash
# .env.local
NEXT_PUBLIC_API_URL=your_api_url
DATABASE_URL=your_database_url
```

### 代码规范
- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Tailwind CSS 进行样式开发
- 组件使用 Radix UI 作为基础 UI 组件库

### 热重载
开发模式下，文件保存后会自动重载页面，无需手动刷新。

## 故障排除

### 常见问题
1. **端口被占用**: 如果 3000 端口被占用，Next.js 会自动使用下一个可用端口
2. **依赖安装失败**: 尝试删除 `node_modules` 和 `package-lock.json`，重新安装
3. **构建失败**: 检查 TypeScript 错误，当前配置已忽略构建时的类型错误

### 清理缓存
```bash
# 清理 Next.js 缓存
npm run build -- --clean

# 或手动删除缓存目录
rm -rf .next
npm run build
```

## 贡献指南
欢迎提交 Pull Request 或 Issue。

## 许可证
MIT