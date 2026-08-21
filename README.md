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

**[🌐 官方主页](https://meet7th.github.io/SeatWise/)** · 
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

### 方式一：全自动部署（推荐）

> 🟢 免费 · 只需 3 个 Token · 全部自动完成 · 无需任何手动操作

**只需提供 3 个 API Token，脚本自动完成所有操作：**

| 步骤 | 操作 | 状态 |
|------|------|------|
| ① | 检查环境 (Node.js, pnpm, curl) | 🤖 自动 |
| ② | 创建 Supabase 数据库 | 🤖 自动 |
| ③ | 部署后端 API 到 Vercel | 🤖 自动 |
| ④ | 部署前端到 Vercel | 🤖 自动 |
| ⑤ | 初始化数据库 + 灌入测试数据 | 🤖 自动 |
| ⑥ | 关联前后端地址 | 🤖 自动 |

**获取 Token（每个只需 30 秒）：**

| Token | 获取地址 | 用途 |
|-------|----------|------|
| Supabase Token | [点击获取](https://supabase.com/dashboard/account/tokens) | 自动创建数据库 |
| Vercel Token | [点击获取](https://vercel.com/account/tokens) | 自动部署前后端 |
| GitHub Token | [点击获取](https://github.com/settings/tokens?type=beta) | 自动 Fork 仓库 |

**运行脚本：**

**Windows（CMD 或 PowerShell）：**

```cmd
:: 先下载项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

:: 运行全自动部署脚本
setup.bat
```

**Mac / Linux（终端）：**

```bash
# 先下载项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

# 运行全自动部署脚本
chmod +x setup.sh
./setup.sh
```

脚本会提示你粘贴 3 个 Token，然后自动完成全部部署，预计 5-8 分钟。

<details>
<summary>📋 如何获取 Supabase Token？（约 1 分钟）</summary>

**第 1 步：登录 Supabase**
1. 打开浏览器，访问 https://supabase.com
2. 点击右上角 **Sign In**
3. 选择 **Continue with GitHub**（推荐）或用邮箱注册
4. 授权登录后进入控制台

**第 2 步：创建 Access Token**
1. 登录后，点击左下角头像 → **Account Settings**
2. 或直接访问 https://supabase.com/dashboard/account/tokens
3. 点击 **Generate new token**
4. 在 **Token Name** 输入框填写名称，如 `seatwise-deploy`
5. 点击 **Generate token**
6. **立即复制 Token**（只会显示一次！）
7. 保存好这个 Token，稍后粘贴到脚本中

> ⚠️ Token 只会显示一次，请立即复制保存。如果丢失需要重新生成。

</details>

<details>
<summary>📋 如何获取 Vercel Token？（约 1 分钟）</summary>

**第 1 步：登录 Vercel**
1. 打开浏览器，访问 https://vercel.com
2. 点击右上角 **Sign Up** 或 **Log In**
3. 选择 **Continue with GitHub**（推荐）或用邮箱注册
4. 授权登录后进入控制台

**第 2 步：创建 Access Token**
1. 登录后，点击右上角头像 → **Settings**
2. 点击左侧菜单 **Tokens**
3. 或直接访问 https://vercel.com/account/tokens
4. 点击 **Create**
5. 在 **Token Name** 输入框填写名称，如 `seatwise-deploy`
6. **Scope** 选择默认即可
7. 点击 **Create Token**
8. **立即复制 Token**（只会显示一次！）
9. 保存好这个 Token，稍后粘贴到脚本中

> ⚠️ Token 只会显示一次，请立即复制保存。如果丢失需要重新生成。

</details>

<details>
<summary>📋 如何获取 GitHub Token？（约 1 分钟）</summary>

**第 1 步：登录 GitHub**
1. 打开浏览器，访问 https://github.com
2. 点击右上角 **Sign in**
3. 输入用户名和密码登录

**第 2 步：创建 Personal Access Token**
1. 登录后，点击右上角头像 → **Settings**
2. 滚动到最下方，点击左侧菜单 **Developer settings**
3. 点击 **Personal access tokens** → **Fine-grained tokens**
4. 点击 **Generate new token**
5. 填写以下信息：
   - **Token name**：输入 `seatwise-deploy`
   - **Expiration**：选择 `7 days`（或 `30 days`）
   - **Repository access**：选择 `All repositories`
6. 在 **Permissions** 区域：
   - 找到 **Contents**
   - 点击右侧下拉菜单，选择 **Read and write**
7. 点击 **Generate token**
8. **立即复制 Token**（只会显示一次！）
9. 保存好这个 Token，稍后粘贴到脚本中

> ⚠️ Token 只会显示一次，请立即复制保存。如果丢失需要重新生成。

</details>

---

### 方式二：Vercel 按钮部署

> 🟢 免费 · 需要手动配置 · 适合有经验的用户

#### 第 1 步：创建 Supabase 数据库（约 2 分钟）

1. 打开 [Supabase](https://supabase.com/new)，用 GitHub 账号登录
2. 点击 **New Project**，填写以下信息：
   - **Organization**：选择默认或创建新的
   - **Project Name**：任意，如 `seatwise-db`
   - **Database Password**：设置一个密码（请牢记）
   - **Region**：选择 `Southeast Asia (Singapore)` 或 `Northeast Asia (Tokyo)`
3. 点击 **Create new project**，等待 1-2 分钟创建完成
4. 进入左侧 **Settings** → **Database**
5. 找到 **Connection string** 区域，点击 **URI** 标签
6. 复制连接字符串，将 `[YOUR-PASSWORD]` 替换为你刚才设置的密码

> 连接字符串格式：`postgresql://postgres.xxxxx:你的密码@aws-0-xxx.pooler.supabase.com:6532/postgres`

#### 第 2 步：部署后端 API（约 1 分钟）

点击下方按钮，填入环境变量：

[![Deploy Backend to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fserver&env=DATABASE_URL%2CJWT_SECRET%2CJWT_REFRESH_SECRET&envDescription=Supabase%20PostgreSQL%20%E8%BF%9E%E6%8E%A5%E5%AD%97%E7%AC%A6%E4%B8%B2%E5%92%8C%20JWT%20%E5%AF%86%E9%92%A5&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise-api&repository-name=SeatWise-API)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:密码@...` | 第 1 步复制的连接字符串 |
| `JWT_SECRET` | 任意随机字符串（≥32字符） | [点击生成](https://randomkeygen.com/) |
| `JWT_REFRESH_SECRET` | 另一个随机字符串 | 与上面不同即可 |

> 部署完成后，记录生成的后端地址，格式为 `https://seatwise-api-xxxx.vercel.app`

#### 第 3 步：部署前端（约 1 分钟）

点击下方按钮，填入后端地址：

[![Deploy Frontend to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise&root-directory=apps%2Fweb&env=VITE_API_BASE_URL&envDescription=%E5%90%8E%E7%AB%AF%20API%20%E5%9C%B0%E5%9D%80&envLink=https%3A%2F%2Fgithub.com%2FMeet7th%2FSeatWise%2Fblob%2Fmain%2F.env.example&project-name=seatwise&repository-name=SeatWise)

| 变量名 | 值 |
|--------|-----|
| `VITE_API_BASE_URL` | `https://第2步的后端地址/api` |

#### 第 4 步：初始化数据库（约 1 分钟）

这一步是在你的**本地电脑**上执行的，作用是给空数据库创建表结构和测试数据。

**前提条件：** 已安装 [Node.js](https://nodejs.org/)（≥ 18）

**Windows 用户（CMD 或 PowerShell）：**

```cmd
:: 1. 克隆项目（如果已下载则跳过）
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

:: 2. 安装 pnpm（如果没有的话）
npm install -g pnpm

:: 3. 安装项目依赖
pnpm install

:: 4. 进入后端目录
cd apps/server

:: 5. 复制数据库 Schema
copy prisma\schema.postgres.prisma prisma\schema.prisma

:: 6. 创建环境配置文件（请替换下面的值）
echo DATABASE_URL=你的Supabase连接字符串 > .env
echo JWT_SECRET=第2步填的JWT_SECRET >> .env
echo JWT_REFRESH_SECRET=第2步填的JWT_REFRESH_SECRET >> .env

:: 7. 创建数据库表
npx prisma db push

:: 8. 灌入测试数据
npx prisma db seed
```

**Mac / Linux 用户（终端）：**

```bash
# 1. 克隆项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

# 2. 安装依赖
pnpm install

# 3. 进入后端目录
cd apps/server

# 4. 复制数据库 Schema
cp prisma/schema.postgres.prisma prisma/schema.prisma

# 5. 创建环境配置文件（请替换下面的值）
cat > .env << EOF
DATABASE_URL=你的Supabase连接字符串
JWT_SECRET=第2步填的JWT_SECRET
JWT_REFRESH_SECRET=第2步填的JWT_REFRESH_SECRET
EOF

# 6. 创建数据库表
npx prisma db push

# 7. 灌入测试数据
npx prisma db seed
```

> 完成后打开前端地址，使用测试账号登录即可体验

---

### 方式三：脚本部署（需要手动操作）

> 🟢 一行命令 · 自动安装依赖 · 自动部署 · 只需粘贴数据库地址

只需安装 [Node.js](https://nodejs.org/)（≥ 18），无需其他任何工具：

**Windows 用户：**

```cmd
:: 方法 1：直接运行（推荐，如果已下载项目代码）
cd C:\Users\你的用户名\Desktop\SeatWise
deploy.bat

:: 方法 2：curl 下载运行（如果网络正常）
curl -fsSL https://raw.githubusercontent.com/Meet7th/SeatWise/main/deploy.bat -o deploy.bat && deploy.bat

:: 方法 3：如果 curl 报证书错误（国内网络常见）
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
deploy.bat
```

**Mac / Linux 用户：**

```bash
# 方法 1：直接运行（如果已下载项目代码）
cd ~/SeatWise
chmod +x deploy.sh
./deploy.sh

# 方法 2：curl 下载运行
curl -fsSL https://raw.githubusercontent.com/Meet7th/SeatWise/main/deploy.sh | bash

# 方法 3：如果 curl 报错
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
chmod +x deploy.sh
./deploy.sh
```

脚本执行流程：

| 步骤 | 操作 | 说明 |
|------|------|------|
| ① | 检查 Node.js | 确认已安装 Node.js ≥ 18 |
| ② | 安装 pnpm | 自动全局安装（如未安装） |
| ③ | 安装 Vercel CLI | 自动全局安装（如未安装） |
| ④ | 登录 Vercel | 浏览器自动弹窗，授权一次即可 |
| ⑤ | 克隆项目代码 | 自动从 GitHub 拉取最新代码 |
| ⑥ | 安装项目依赖 | 自动运行 pnpm install |
| ⑦ | 创建 Supabase 数据库 | 引导你在浏览器中操作，粘贴连接字符串 |
| ⑧ | 生成 JWT 密钥 | 自动生成安全密钥 |
| ⑨ | 初始化数据库 | 自动创建表结构 + 灌入测试数据 |
| ⑩ | 部署后端到 Vercel | 自动配置环境变量并部署 |
| ⑪ | 部署前端到 Vercel | 自动关联后端地址并部署 |
| ⑫ | 关联前后端 | 自动更新后端的前端地址配置 |

<details>
<summary>📋 脚本部署前提条件</summary>

- **Node.js** ≥ 18：[下载安装](https://nodejs.org/)
- **Git**：[下载安装](https://git-scm.com/)
- **Vercel 账号**：[免费注册](https://vercel.com/signup)（可用 GitHub 登录）
- **Supabase 账号**：[免费注册](https://supabase.com/new)（可用 GitHub 登录）

脚本会自动安装 pnpm 和 Vercel CLI，无需手动操作。

</details>

<details>
<summary>🔧 常见问题排查</summary>

**Q: curl 报证书错误 `CRYPT_E_NO_REVOCATION_CHECK`**
A: 国内网络常见问题，使用方法 3（先 git clone 再运行脚本）

**Q: `vercel login` 浏览器没有弹出**
A: 手动打开终端中显示的链接进行授权

**Q: `pnpm install` 报错**
A: 运行 `npm install -g pnpm@9` 安装指定版本

**Q: 部署后前端白屏**
A: 检查 `VITE_API_BASE_URL` 是否正确，必须是 `https://后端地址/api`

**Q: 部署后登录报错**
A: 确认第 4 步数据库初始化是否成功完成

</details>

---

### 方式四：本地一键启动

> 🟢 零配置 · 无需服务器 · 无需数据库 · 双击即用

只需安装 [Node.js](https://nodejs.org/)（≥ 18）：

**Windows 用户：**

```cmd
:: 1. 克隆项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

:: 2. 安装依赖
npm install -g pnpm
pnpm install

:: 3. 启动（自动打开浏览器）
pnpm start

:: 或者直接双击 start.bat
```

**Mac / Linux 用户：**

```bash
# 1. 克隆项目
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise

# 2. 安装依赖
pnpm install

# 3. 启动
./start.sh
# 或者 pnpm start
```

> 启动后自动打开浏览器，使用 SQLite 本地数据库，数据保存在 `apps/server/seatwise.db`

---

### 方式五：Docker 部署

> 🟡 需要安装 [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
git clone https://github.com/Meet7th/SeatWise.git
cd SeatWise
cp .env.example .env
docker-compose up -d
```

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:5173 |
| 后端 | http://localhost:3000 |
| 数据库 | MySQL 3306 端口 |

停止：`docker-compose down`

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
