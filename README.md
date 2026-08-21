# 智座 SeatWise — AI 智能排座系统

> 基于学生性格测评与多维度画像的 AI 教室座位编排系统

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)

---

## 目录

- [项目简介](#项目简介)
- [核心功能](#核心功能)
- [技术架构](#技术架构)
- [快速开始](#快速开始)
  - [方式一：Docker 一键部署（推荐）](#方式一docker-一键部署推荐)
  - [方式二：纯本地开发运行](#方式二纯本地开发运行)
  - [方式三：生产环境部署](#方式三生产环境部署)
- [用户使用指南](#用户使用指南)
- [配置说明](#配置说明)
- [常见问题](#常见问题)
- [License](#license)

---

## 项目简介

**智座 SeatWise** 是一款面向中小学的 AI 智能排座系统。系统通过 35 道多维度性格测评题目，自动生成学生的 MBTI 性格类型、学习风格、社交类型等画像，再结合性别均衡、特殊需求、社交偏好等约束条件，利用概率引擎一键生成最优座位方案。

### 适用场景

- 班主任需要快速、科学地安排全班座位
- 希望根据学生性格特点进行个性化排座
- 需要考虑视力、身高、社交关系等特殊因素
- 需要一键导出座位表用于打印

---

## 核心功能

| 模块 | 功能说明 |
|------|----------|
| **性格测评** | 35 道多维度题目（MBTI、学习风格、社交类型、兴趣、特殊需求等），支持自动保存进度 |
| **学生画像** | 自动计算综合评分、MBTI 类型、学习风格、社交类型，生成可视化报告 |
| **AI 排座** | 概率引擎一键排座，支持性别均衡、特殊需求、黑白名单、社交偏好等约束 |
| **手动调整** | 拖拽换座、热力图可视化、撤销/重做、禁用座位 |
| **数据导出** | CSV 基础/完整表格、PNG 截图导出、PDF 报告生成 |
| **申诉管理** | 学生提交换座申诉，AI 自动建议，教师一键批准/驳回 |
| **深色模式** | 支持亮色/暗色主题切换 |
| **移动端适配** | 学生端响应式设计，支持手机端使用 |
| **第三方登录** | 支持微信、QQ OAuth 登录（可选） |
| **短信/邮件验证** | 阿里云短信验证码、SMTP 邮件验证码（可选） |

---

## 技术架构

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Vue 3)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 测评系统 │ │ 排座编辑 │ │ 申诉管理 │ │ 数据导出 │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                    Pinia + Vue Router                    │
└─────────────────────────────────────────────────────────┘
                           │
                      REST API
                           │
┌─────────────────────────────────────────────────────────┐
│                     Backend (Express)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ 认证服务 │ │ 排座算法 │ │ 申诉处理 │ │ 通知服务 │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│              Prisma ORM + JWT + Zod Validation           │
└─────────────────────────────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
        ┌─────┴─────┐            ┌──────┴──────┐
        │   MySQL   │            │    Redis    │
        └───────────┘            └─────────────┘
```

### 目录结构

```
SeatWise/
├── apps/
│   ├── web/                    # 前端 Vue 3 SPA
│   │   ├── src/
│   │   │   ├── api/            # HTTP 请求封装
│   │   │   ├── components/     # UI 组件
│   │   │   ├── composables/    # 逻辑复用
│   │   │   ├── features/       # 测评题库与算法
│   │   │   ├── router/         # 路由配置
│   │   │   ├── stores/         # Pinia 状态管理
│   │   │   ├── utils/          # 工具函数
│   │   │   └── views/          # 页面视图
│   │   └── package.json
│   └── server/                 # 后端 Express API
│       ├── src/
│       │   ├── config/         # 环境配置
│       │   ├── middleware/     # 中间件
│       │   ├── routes/         # 路由定义
│       │   ├── services/       # 业务逻辑
│       │   └── utils/          # 工具函数
│       ├── prisma/
│       │   ├── schema.prisma   # 数据库模型
│       │   └── seed.ts         # 种子数据
│       └── package.json
├── packages/
│   └── shared/                 # 前后端共享类型
│       └── types/
├── docker-compose.yml          # Docker 编排
├── Dockerfile.frontend         # 前端镜像
├── Dockerfile.backend          # 后端镜像
└── package.json                # Monorepo 根配置
```

---

## 快速开始

### 方式零：一键启动（零基础推荐）⭐

> **最适合零基础用户**，只需安装 Node.js，双击即可运行，无需 Docker、MySQL、Redis。

#### 前置条件

| 工具 | 版本要求 | 安装地址 |
|------|----------|----------|
| Node.js | >= 18.x | https://nodejs.org/ （下载 LTS 版本即可） |

#### 一键启动

**Windows 用户：**

```bash
# 双击 start.bat 即可，或在终端运行：
start.bat
```

**Mac / Linux 用户：**

```bash
chmod +x start.sh
./start.sh
```

**或使用 npm 命令（所有平台通用）：**

```bash
pnpm start
```

脚本会自动完成：安装 pnpm → 安装依赖 → 创建 SQLite 数据库 → 灌入测试数据 → 启动前后端

#### 访问系统

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000

#### 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 教师 | teacher@seatwise.com | Teacher123 |
| 学生 | 学号：2026001 | Student123 |
| 班级邀请码 | TEST01 | - |

---

### 方式一：Docker 一键部署

> **适合有 Docker 经验的用户**，所有服务容器化运行。

#### 前置条件

- 安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)（Windows/Mac 均可）
- 至少 4GB 可用内存

#### 一键启动

```bash
# 1. 克隆项目
git clone https://github.com/your-org/seatwise.git
cd seatwise

# 2. 复制环境配置
cp .env.example .env

# 3. 一键启动
docker-compose up -d

# 4. 访问系统
# 前端：http://localhost:5173
# 后端 API：http://localhost:3000
```

#### 停止服务

```bash
docker-compose down
```

#### 数据持久化

Docker 部署会自动将 MySQL 数据保存在 `docker-data/mysql` 目录，重启不会丢失数据。

---

### 方式二：纯本地开发运行

> **适合有开发经验的用户**，需要手动安装依赖。

#### 前置条件

| 工具 | 版本要求 | 安装地址 |
|------|----------|----------|
| Node.js | >= 18.x | https://nodejs.org/ |
| pnpm | >= 8.x | https://pnpm.io/ |
| MySQL | >= 8.0 | https://dev.mysql.com/ |
| Redis | >= 6.x | https://redis.io/ |

#### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/your-org/seatwise.git
cd seatwise

# 2. 安装依赖
npx pnpm install

# 3. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入数据库连接信息

# 4. 初始化数据库
cd apps/server
npx prisma db push
npx prisma db seed
cd ../..

# 5. 启动后端（新终端）
npx pnpm dev:server

# 6. 启动前端（新终端）
npx pnpm dev
```

#### 访问系统

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000

#### 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 教师 | teacher@seatwise.com | Teacher123 |
| 学生 | 学号：2026001 | Student123 |
| 班级邀请码 | TEST01 | - |

---

### 方式三：生产环境部署

> **适合学校服务器部署**，需要配置 Nginx 反向代理。

#### 1. 构建前端

```bash
cd apps/web
npx pnpm build
# 产物在 dist/ 目录
```

#### 2. 构建后端

```bash
cd apps/server
npx pnpm build
# 产物在 dist/ 目录
```

#### 3. 配置 Nginx

```nginx
server {
    listen 80;
    server_name seatwise.your-school.com;

    # 前端静态文件
    location / {
        root /path/to/seatwise/apps/web/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API 代理
    location /api {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 4. 使用 PM2 管理后端进程

```bash
# 安装 PM2
npm install -g pm2

# 启动后端
cd apps/server
pm2 start dist/index.js --name seatwise-api

# 设置开机自启
pm2 save
pm2 startup
```

#### 5. 初始化数据库

```bash
cd apps/server
npx prisma db push
npx prisma db seed
```

---

### 方式四：Vercel + Supabase 云端部署（免费）⭐

> **适合需要公网访问的用户**，无需服务器，利用免费云平台一键部署。

#### 前置条件

| 工具 | 说明 | 注册地址 |
|------|------|----------|
| Node.js | >= 18.x | https://nodejs.org/ |
| GitHub 账号 | 代码托管 | https://github.com |
| Vercel 账号 | 前端 + 后端托管（免费） | https://vercel.com（可用 GitHub 登录） |
| Supabase 账号 | PostgreSQL 数据库（免费） | https://supabase.com（可用 GitHub 登录） |

#### 一键部署

```bash
# 1. 克隆项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

# 2. 安装依赖
pnpm install

# 3. 一键部署
pnpm cloud-deploy
```

脚本会自动完成：
- ✅ 检测并安装 Vercel CLI
- ✅ 登录 Vercel
- ✅ 生成安全密钥
- ✅ 部署后端 API 到 Vercel
- ✅ 部署前端到 Vercel
- ✅ 初始化 Supabase 数据库
- ✅ 灌入测试数据
- ✅ 输出访问地址和测试账号

#### 手动操作（仅 1 步）

脚本运行时会提示你：

1. **打开 https://supabase.com/new** 创建一个免费项目
2. 创建完成后，进入 **Settings > Database**
3. 复制 **Connection string**（选择 Transaction 模式）
4. 粘贴到脚本提示中

其余所有步骤全部自动完成！

#### 访问系统

部署完成后，脚本会输出：
- 前端地址：`https://你的项目.vercel.app`
- 后端 API：`https://你的API.vercel.app/api/health`

#### Cloudflare 加速（可选）

如需自定义域名或 CDN 加速：

1. 在 [Cloudflare](https://cloudflare.com) 添加你的域名
2. 将域名的 Nameserver 修改为 Cloudflare 提供的地址
3. 在 Cloudflare DNS 中添加 CNAME 记录指向 Vercel
4. 在 Vercel 项目设置中绑定自定义域名

---

## 用户使用指南

### 教师端

#### 第一步：创建班级

1. 登录系统 → 点击「创建班级」
2. 填写班级名称、年级、学期
3. 配置教室布局（排数、列数、门的位置等）
4. 记录生成的 **邀请码**，分享给学生

#### 第二步：邀请学生

1. 进入班级详情页 → 点击「邀请学生」
2. 将邀请码发送给学生
3. 学生使用邀请码注册账号

#### 第三步：等待测评

1. 进入「测评进度」查看完成情况
2. 可提醒未完成的学生尽快完成

#### 第四步：排座

1. 进入「排座编辑」页面
2. 点击「AI 智能排座」自动生成方案
3. 可手动拖拽调整个别座位
4. 点击「发布座位」通知学生

#### 第五步：处理申诉

1. 进入「申诉管理」
2. 查看 AI 建议
3. 批准或驳回学生申诉

---

### 学生端

#### 第一步：注册加入班级

1. 打开系统 → 点击「注册」
2. 输入教师提供的 **邀请码**
3. 填写个人信息完成注册

#### 第二步：完成测评

1. 登录后点击「开始测评」
2. 认真回答 35 道题目（约 10-15 分钟）
3. 支持中途保存，下次继续

#### 第三步：查看座位

1. 测评完成后等待教师排座
2. 在「我的座位」查看分配结果

#### 第四步：申诉（可选）

1. 如需调换座位，点击「提交申诉」
2. 选择申诉类型并描述原因
3. 等待教师处理

---

## 配置说明

### 必填配置

```env
# 数据库
DATABASE_URL=mysql://用户名:密码@localhost:3306/seatwise

# Redis
REDIS_URL=redis://localhost:6379

# JWT 密钥（用于用户认证）
JWT_SECRET=your-random-secret-key
JWT_REFRESH_SECRET=your-random-refresh-key
```

### 可选配置

```env
# 微信登录（不配置则隐藏微信登录按钮）
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret

# QQ 登录（不配置则隐藏QQ登录按钮）
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key

# 短信验证码（不配置则使用开发模式，验证码输出到控制台）
SMS_ACCESS_KEY_ID=your-aliyun-key
SMS_ACCESS_KEY_SECRET=your-aliyun-secret

# 邮件验证（不配置则使用开发模式）
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your-email@qq.com
SMTP_PASS=your-email-password
```

---

## 常见问题

### Q: 需要会编程才能使用吗？

**不需要。** 推荐使用 Docker 一键部署，只需安装 Docker Desktop，运行一条命令即可启动系统。详细步骤见 [Docker 一键部署](#方式一docker-一键部署推荐)。

### Q: 需要什么样的服务器？

| 用途 | 最低配置 | 推荐配置 |
|------|----------|----------|
| 个人测试 | 2核4G | 2核8G |
| 学校使用（50人） | 2核4G | 4核8G |
| 学校使用（200人） | 4核8G | 8核16G |

### Q: 数据安全吗？

- 密码使用 bcrypt 加密存储
- JWT Token 认证
- 支持 HTTPS（需配置 SSL 证书）
- 数据库数据本地存储，不上传云端

### Q: 可以离线使用吗？

可以。系统完全本地部署，无需联网即可使用（OAuth 登录和短信验证除外）。

### Q: 如何备份数据？

```bash
# MySQL 备份
mysqldump -u root -p seatwise > backup.sql

# 恢复
mysql -u root -p seatwise < backup.sql
```

Docker 部署可直接备份 `docker-data/mysql` 目录。

### Q: 如何更新系统？

```bash
# 拉取最新代码
git pull

# Docker 部署
docker-compose up -d --build

# 本地部署
npx pnpm install
cd apps/server && npx prisma db push
cd ../web && npx pnpm build
```

---

## 项目状态

| 阶段 | 状态 | 说明 |
|------|------|------|
| Phase 1 | ✅ 完成 | 基础骨架 + 路由 + 状态管理 |
| Phase 2 | ✅ 完成 | 35 题测评系统 + 学生画像 |
| Phase 3 | ✅ 完成 | AI 概率排座引擎 + 可视化编辑 |
| Phase 4 | ✅ 完成 | 申诉管理 + 通知系统 |
| Phase 5 | ✅ 完成 | 数据导出 + 深色模式 + 移动端适配 |
| Phase 6 | ✅ 完成 | 第三方登录 + 短信/邮件验证 |

---

## License

MIT License

---

**智座 SeatWise** — 让排座更科学，让教育更公平。
