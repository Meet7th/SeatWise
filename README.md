<div align="center">

# 🪑 智座 SeatWise

**AI 驱动的智能教室排座系统**

基于学生性格测评与多维度画像，让排座更科学、更公平

[![GitHub release](https://img.shields.io/github/v/release/Meet7th/SeatWise?style=flat&logo=github)](https://github.com/Meet7th/SeatWise/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=flat&logo=vuedotjs)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)

---

**[🌐 官方主页](https://github.com/Meet7th/SeatWise)** · 
**[📖 使用文档](#-使用指南)** · 
**[🚀 立即部署](#-快速开始)**

</div>

---

## 📢 关于本项目

> **本项目由 AI 全程开发与维护。**
> 
> 从架构设计、代码编写、测试调试到文档生成，均由 AI（Claude）独立完成。人类开发者负责需求提出、项目管理与最终决策。这种开发模式代表了一种新的软件开发范式 —— **AI 原生开发**。

### 🤖 AI 开发声明

| 项目 | 说明 |
|------|------|
| **开发工具** | Claude Code (Anthropic) |
| **开发模式** | 人类提需求 → AI 写代码 → 人类验收 |
| **代码质量** | AI 自审 + 自动化测试 |
| **维护方式** | AI 持续迭代，人类监督决策 |

---

## ✨ 核心功能

<table>
<tr>
<td width="50%">

### 🎯 智能排座
- AI 概率引擎一键排座
- 支持性别均衡、特殊需求适配
- 黑白名单、社交偏好约束
- 热力图可视化分析

</td>
<td width="50%">

### 📊 性格测评
- 35 道多维度测评题
- MBTI、学习风格、社交类型
- 自动生成学生综合画像
- 支持进度自动保存

</td>
</tr>
<tr>
<td width="50%">

### 🔄 申诉管理
- 学生提交换座申请
- AI 自动分析建议
- 教师一键审批
- 申诉历史可追溯

</td>
<td width="50%">

### 📤 数据导出
- CSV 表格导出
- PNG 座位图截图
- PDF 完整报告
- 多格式支持

</td>
</tr>
<tr>
<td width="50%">

### 🎨 交互体验
- 拖拽手动调座
- 深色/浅色主题
- 移动端响应式
- 实时数据同步

</td>
<td width="50%">

### 🔐 安全认证
- JWT Token 认证
- bcrypt 密码加密
- 微信/QQ OAuth（可选）
- 短信/邮件验证码（可选）

</td>
</tr>
</table>

---

## 🚀 快速开始

### 方式一：一键云端部署（推荐）

> 🟢 免费 · 全自动 · 只需粘贴一个数据库地址

只需安装 [Node.js](https://nodejs.org/)（≥ 18），一行命令完成全部部署：

**Windows：**

```bash
curl -fsSL https://raw.githubusercontent.com/Meet7th/SeatWise/main/deploy.bat -o deploy.bat && deploy.bat
```

**Mac / Linux：**

```bash
curl -fsSL https://raw.githubusercontent.com/Meet7th/SeatWise/main/deploy.sh | bash
```

脚本会自动完成以下全部操作：

| 步骤 | 操作 | 状态 |
|------|------|------|
| 1 | 安装 pnpm 和 Vercel CLI | 🤖 自动 |
| 2 | 登录 Vercel（浏览器弹窗） | 👤 一次 |
| 3 | 引导创建 Supabase 数据库 | 👤 粘贴地址 |
| 4 | 生成 JWT 安全密钥 | 🤖 自动 |
| 5 | 初始化数据库表和测试数据 | 🤖 自动 |
| 6 | 部署后端 API 到 Vercel | 🤖 自动 |
| 7 | 部署前端到 Vercel | 🤖 自动 |
| 8 | 关联前后端地址 | 🤖 自动 |

<details>
<summary>📋 如何获取 Supabase 数据库连接字符串？</summary>

1. 打开 [Supabase](https://supabase.com/new)，用 GitHub 登录
2. 点击 **New Project**，填写项目名称和数据库密码
3. 等待创建完成（约 1-2 分钟）
4. 进入 **Settings → Database**
5. 找到 **Connection string**，选择 **Transaction** 模式
6. 复制连接字符串，将 `[YOUR-PASSWORD]` 替换为你设置的密码

</details>

---

### 方式二：本地一键启动

> 🟢 零配置 · 无需数据库 · 双击即用

只需安装 [Node.js](https://nodejs.org/)（≥ 18）：

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
pnpm install
pnpm start
```

Windows 用户可直接双击 `start.bat`，Mac/Linux 用户运行 `./start.sh`。

---

### 方式三：Docker 部署

> 🟡 需要安装 Docker Desktop

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
cp .env.example .env
docker-compose up -d
```

访问：前端 `http://localhost:5173` · 后端 `http://localhost:3000`

---

### 方式四：Vercel 手动部署

> 适合需要自定义配置的用户

<details>
<summary>展开查看手动部署步骤</summary>

**第 1 步：部署后端 API**

[![Deploy Backend to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fserver&env=DATABASE_URL%2CJWT_SECRET%2CJWT_REFRESH_SECRET&envDescription=Supabase%20PostgreSQL%20%E8%BF%9E%E6%8E%A5%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%20JWT%20%E5%AF%86%E9%92%A5&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise-api&repository-name=SeatWise-API)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | Supabase 连接字符串 |
| `JWT_SECRET` | 随机字符串（≥32字符） | [在线生成](https://randomkeygen.com/) |
| `JWT_REFRESH_SECRET` | 另一个随机字符串 | 与上面不同 |

**第 2 步：部署前端**

[![Deploy Frontend to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fweb&env=VITE_API_BASE_URL&envDescription=%E5%90%8E%E7%AB%AF%20API%20%E5%9C%B0%E5%9D%80&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise&repository-name=SeatWise)

| 变量名 | 值 |
|--------|-----|
| `VITE_API_BASE_URL` | `https://第1步的后端地址/api` |

**第 3 步：初始化数据库**

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

---

## 🧪 测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 👨‍🏫 教师 | `teacher@seatwise.com` | `Teacher123` |
| 👨‍🎓 学生 | 学号：`2026001` | `Student123` |
| 🏫 班级邀请码 | `TEST01` | — |

---

## 📖 使用指南

### 教师流程

```
创建班级 → 配置教室布局 → 分享邀请码 → 查看测评进度 → AI 排座 → 手动调整 → 发布座位 → 处理申诉
```

### 学生流程

```
邀请码注册 → 完成性格测评（35题，约15分钟） → 等待排座 → 查看座位 → 提交申诉（可选）
```

---

## 🏗️ 技术架构

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend (Vue 3)                         │
│   测评系统  ·  排座编辑器  ·  申诉管理  ·  数据导出          │
│                  Pinia + Vue Router + Tailwind                │
└──────────────────────────┬───────────────────────────────────┘
                           │ REST API
┌──────────────────────────┴───────────────────────────────────┐
│                     Backend (Express)                          │
│   认证服务  ·  排座算法  ·  申诉处理  ·  通知服务             │
│              Prisma ORM + JWT + Zod Validation                │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────┴────┐  ┌───┴───┐  ┌─────┴─────┐
         │  MySQL  │  │ SQLite│  │PostgreSQL │
         │  生产   │  │ 本地  │  │   云端    │
         └─────────┘  └───────┘  └───────────┘
```

---

## ⚙️ 配置说明

<details>
<summary>📋 环境变量完整列表</summary>

```env
# 数据库（三选一）
DATABASE_URL=file:./seatwise.db                              # SQLite
DATABASE_URL=mysql://user:pass@localhost:3306/seatwise       # MySQL
DATABASE_URL=postgresql://postgres:pass@host:5432/postgres   # PostgreSQL

# JWT 密钥
JWT_SECRET=your-random-secret-key-at-least-32-chars
JWT_REFRESH_SECRET=your-another-random-key

# 可选：微信登录
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret

# 可选：QQ 登录
QQ_APP_ID=your-qq-app-id
QQ_APP_KEY=your-qq-app-key

# 可选：短信验证码（阿里云）
SMS_ACCESS_KEY_ID=your-aliyun-key
SMS_ACCESS_KEY_SECRET=your-aliyun-secret

# 可选：邮件验证（SMTP）
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_USER=your-email@qq.com
SMTP_PASS=your-email-password
```

</details>

---

## 📁 目录结构

```
SeatWise/
├── apps/
│   ├── web/                          # 🖥️  前端 Vue 3 SPA
│   │   └── src/
│   │       ├── api/                  #     HTTP 请求封装
│   │       ├── components/           #     UI 组件
│   │       ├── composables/          #     逻辑复用
│   │       ├── features/             #     测评题库与算法
│   │       ├── router/               #     路由配置
│   │       ├── stores/               #     Pinia 状态管理
│   │       ├── utils/                #     工具函数
│   │       └── views/                #     页面视图
│   └── server/                       # ⚙️  后端 Express API
│       ├── api/                      #     Vercel Serverless 入口
│       ├── src/
│       │   ├── config/               #     环境配置
│       │   ├── middleware/           #     中间件
│       │   ├── routes/               #     路由定义
│       │   ├── services/             #     业务逻辑
│       │   └── utils/                #     工具函数
│       └── prisma/                   #     数据库 Schema
├── packages/shared/                  # 📦  前后端共享类型
├── scripts/                          # 🔧  脚本工具
├── docker-compose.yml                # 🐳  Docker 编排
└── vercel.json                       # ▲   Vercel 配置
```

---

## ❓ 常见问题

<details>
<summary><b>Q: 需要会编程才能使用吗？</b></summary>

不需要。推荐使用 Vercel 一键部署按钮或本地 `pnpm start`，全程无需编写代码。
</details>

<details>
<summary><b>Q: 数据安全吗？</b></summary>

密码使用 bcrypt 加密存储，接口使用 JWT 认证，本地部署完全离线运行。
</details>

<details>
<summary><b>Q: 可以离线使用吗？</b></summary>

可以。本地部署无需联网（OAuth 和短信验证功能除外）。
</details>

<details>
<summary><b>Q: 如何备份数据？</b></summary>

- SQLite：备份 `.db` 文件
- MySQL：使用 `mysqldump`
- Docker：备份 `docker-data/` 目录
</details>

<details>
<summary><b>Q: 支持哪些浏览器？</b></summary>

Chrome、Edge、Firefox、Safari，以及主流移动端浏览器。
</details>

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

<div align="center">

**智座 SeatWise** — AI 原生开发，让排座更科学，让教育更公平。

*Built with ❤️ by AI*

</div>
