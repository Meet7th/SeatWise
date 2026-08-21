# 智座 SeatWise — AI 智能排座系统

> 基于学生性格测评与多维度画像的 AI 教室座位编排系统

[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 一键部署

### Vercel + Supabase（免费，推荐）

点击按钮一键部署到 Vercel，数据库使用 Supabase 免费套餐：

**第 1 步：部署后端 API**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fserver&env=DATABASE_URL%2CJWT_SECRET%2CJWT_REFRESH_SECRET&envDescription=Supabase%20PostgreSQL%20%E8%BF%9E%E6%8E%A5%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%20JWT%20%E5%AF%86%E9%92%A5&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise-api&repository-name=SeatWise-API)

填写环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | 从 Supabase 获取（见下方） |
| `JWT_SECRET` | 随机字符串（至少 32 字符） | [在线生成](https://randomkeygen.com/) |
| `JWT_REFRESH_SECRET` | 另一个随机字符串 | 与上面不同 |

**第 2 步：部署前端**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fweb&env=VITE_API_BASE_URL&envDescription=%E5%90%8E%E7%AB%AF%20API%20%E5%9C%B0%E5%9D%80&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise&repository-name=SeatWise)

填写环境变量：

| 变量名 | 值 |
|--------|-----|
| `VITE_API_BASE_URL` | `https://第1步的后端地址/api` |

<details>
<summary><b>如何获取 Supabase 数据库连接字符串？</b></summary>

1. 打开 [Supabase](https://supabase.com/new)，用 GitHub 登录
2. 点击 **New Project**，填写项目名称和数据库密码
3. 等待创建完成（约 1-2 分钟）
4. 进入 **Settings > Database**
5. 找到 **Connection string**，选择 **Transaction** 模式
6. 复制连接字符串，将 `[YOUR-PASSWORD]` 替换为你设置的密码

</details>

<details>
<summary><b>部署后如何初始化数据库？</b></summary>

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
pnpm install
cd apps/server
cp prisma/schema.postgres.prisma prisma/schema.prisma
# 创建 .env 文件，填入 DATABASE_URL
npx prisma db push
npx prisma db seed
```

</details>

### 本地一键启动（无需服务器）

只需安装 [Node.js](https://nodejs.org/)（>= 18），双击即可运行：

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
pnpm install
pnpm start
```

Windows 用户也可直接双击 `start.bat`。

---

## 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 教师 | teacher@seatwise.com | Teacher123 |
| 学生 | 学号：2026001 | Student123 |
| 班级邀请码 | TEST01 | - |

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

## 用户使用指南

### 教师端

1. 登录系统 → 点击「创建班级」→ 配置教室布局
2. 将 **邀请码** 分享给学生
3. 进入「测评进度」查看学生完成情况
4. 点击「AI 智能排座」自动生成方案 → 可手动调整 → 发布座位
5. 在「申诉管理」中处理学生换座请求

### 学生端

1. 用邀请码注册账号
2. 完成 35 道性格测评题目（约 10-15 分钟）
3. 等待教师排座 → 在「我的座位」查看结果
4. 如需调换，可提交申诉

---

## 其他部署方式

<details>
<summary><b>Docker 一键部署</b></summary>

**前置条件：** 安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
cp .env.example .env
docker-compose up -d
```

访问：前端 http://localhost:5173 | 后端 http://localhost:3000

停止：`docker-compose down`

</details>

<details>
<summary><b>纯本地开发（MySQL）</b></summary>

**前置条件：** Node.js >= 18、pnpm >= 8、MySQL >= 8.0

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
pnpm install
cp .env.example .env
# 编辑 .env，填入 MySQL 连接信息
cd apps/server
npx prisma db push
npx prisma db seed
cd ../..
pnpm dev:server  # 终端 1：启动后端
pnpm dev          # 终端 2：启动前端
```

</details>

<details>
<summary><b>生产环境部署（Nginx + PM2）</b></summary>

```bash
# 构建
cd apps/web && pnpm build
cd ../server && pnpm build

# 配置 Nginx
server {
    listen 80;
    server_name seatwise.your-school.com;
    location / {
        root /path/to/seatwise/apps/web/dist;
        try_files $uri $uri/ /index.html;
    }
    location /api {
        proxy_pass http://127.0.0.1:3000;
    }
}

# 启动后端
npm install -g pm2
pm2 start apps/server/dist/index.js --name seatwise-api
pm2 save && pm2 startup

# 初始化数据库
cd apps/server
npx prisma db push
npx prisma db seed
```

</details>

<details>
<summary><b>Cloudflare 加速（可选）</b></summary>

1. 在 [Cloudflare](https://cloudflare.com) 添加你的域名
2. 将域名的 Nameserver 修改为 Cloudflare 提供的地址
3. 在 Cloudflare DNS 中添加 CNAME 记录指向 Vercel
4. 在 Vercel 项目设置中绑定自定义域名

</details>

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
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌──────┴──────┐
        │   MySQL   │ │ SQLite│ │ PostgreSQL  │
        │  (生产)   │ │(本地) │ │  (云端)     │
        └───────────┘ └───────┘ └─────────────┘
```

---

## 配置说明

### 数据库

```env
# SQLite（零基础推荐，无需安装数据库）
DATABASE_URL=file:./seatwise.db

# MySQL（生产环境）
DATABASE_URL=mysql://用户名:密码@localhost:3306/seatwise

# PostgreSQL（Supabase 云端部署）
DATABASE_URL=postgresql://postgres.[项目ID]:[密码]@aws-0-[区域].pooler.supabase.com:6532/postgres
```

### JWT 密钥

```env
JWT_SECRET=your-random-secret-key
JWT_REFRESH_SECRET=your-random-refresh-key
```

### 可选配置

```env
# 微信登录
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret

# QQ 登录
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key

# 短信验证码（阿里云）
SMS_ACCESS_KEY_ID=your-aliyun-key
SMS_ACCESS_KEY_SECRET=your-aliyun-secret

# 邮件验证（SMTP）
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your-email@qq.com
SMTP_PASS=your-email-password
```

---

## 常见问题

**Q: 需要会编程才能使用吗？**
A: 不需要。推荐使用 Vercel 一键部署按钮或本地 `pnpm start`。

**Q: 数据安全吗？**
A: 密码 bcrypt 加密存储，JWT 认证，本地部署完全离线。

**Q: 可以离线使用吗？**
A: 可以。本地部署无需联网（OAuth 和短信验证除外）。

**Q: 如何备份数据？**
A: SQLite 备份 `.db` 文件；MySQL 用 `mysqldump`；Docker 备份 `docker-data/` 目录。

**Q: 支持哪些浏览器？**
A: Chrome、Edge、Firefox、Safari，以及移动端浏览器。

---

## 目录结构

```
SeatWise/
├── apps/
│   ├── web/                    # 前端 Vue 3 SPA
│   │   └── src/
│   │       ├── api/            # HTTP 请求封装
│   │       ├── components/     # UI 组件
│   │       ├── composables/    # 逻辑复用
│   │       ├── features/       # 测评题库与算法
│   │       ├── router/         # 路由配置
│   │       ├── stores/         # Pinia 状态管理
│   │       ├── utils/          # 工具函数
│   │       └── views/          # 页面视图
│   └── server/                 # 后端 Express API
│       ├── api/                # Vercel Serverless 入口
│       ├── src/
│       │   ├── config/         # 环境配置
│       │   ├── middleware/     # 中间件
│       │   ├── routes/         # 路由定义
│       │   ├── services/       # 业务逻辑
│       │   └── utils/          # 工具函数
│       └── prisma/
│           ├── schema.prisma          # MySQL Schema
│           ├── schema.sqlite.prisma   # SQLite Schema
│           ├── schema.postgres.prisma # PostgreSQL Schema
│           └── seed.ts                # 种子数据
├── packages/shared/            # 前后端共享类型
├── scripts/
│   ├── start.mjs               # 本地一键启动
│   └── cloud-deploy.mjs        # 云端一键部署
├── start.bat                   # Windows 启动脚本
├── start.sh                    # Mac/Linux 启动脚本
├── docker-compose.yml          # Docker 编排
└── vercel.json                 # Vercel 配置
```

---

## License

MIT License

---

**智座 SeatWise** — 让排座更科学，让教育更公平。
