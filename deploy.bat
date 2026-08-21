@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ══════════════════════════════════════════════════════
:: 智座 SeatWise - 一键云端部署脚本 (Windows)
:: ══════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║   🪑  智座 SeatWise - 一键云端部署                   ║
echo ║                                                      ║
echo ║   Vercel + Supabase 全自动部署                       ║
echo ║   预计耗时：5-10 分钟                                ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   部署流程：检查环境 → 创建数据库 → 部署后端 → 部署前端
echo.

set step_num=0
set total_steps=8

:: ══════════════════════════════════════════════════════
:: 步骤 1：检查 Node.js
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 检查 Node.js 环境
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未检测到 Node.js
    echo.
    echo   请先安装 Node.js（≥ 18）：
    echo     下载地址: https://nodejs.org/
    echo.
    echo   安装步骤：
    echo     1. 打开上面的链接，下载 LTS 版本
    echo     2. 双击安装包，一路点击 Next
    echo     3. 安装完成后重新打开终端
    echo     4. 运行 node -v 验证安装成功
    echo     5. 重新运行本脚本
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do set NODE_VER=%%v
echo   ✓ Node.js %NODE_VER% ✓

:: ══════════════════════════════════════════════════════
:: 步骤 2：安装 pnpm
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 检查并安装 pnpm 包管理器
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo   ▸ pnpm 未安装，正在自动安装...
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo   ✗ pnpm 安装失败
        echo   请手动运行: npm install -g pnpm
        pause
        exit /b 1
    )
    echo   ✓ pnpm 安装成功
) else (
    for /f "tokens=*" %%v in ('pnpm -v') do set PNPM_VER=%%v
    echo   ✓ pnpm !PNPM_VER! 已安装
)

:: ══════════════════════════════════════════════════════
:: 步骤 3：安装 Vercel CLI
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 检查并安装 Vercel CLI
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo   ▸ Vercel CLI 未安装，正在自动安装...
    echo   ▸ Vercel CLI 用于将项目部署到 Vercel 云平台
    call npm install -g vercel
    if %errorlevel% neq 0 (
        echo   ✗ Vercel CLI 安装失败
        echo   请手动运行: npm install -g vercel
        pause
        exit /b 1
    )
    echo   ✓ Vercel CLI 安装成功
) else (
    echo   ✓ Vercel CLI 已安装
)

:: ══════════════════════════════════════════════════════
:: 步骤 4：登录 Vercel
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 登录 Vercel 账号
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo   ▸ 需要登录 Vercel 账号
    echo.
    echo   登录流程：
    echo     1. 浏览器会自动打开 Vercel 登录页面
    echo     2. 选择 Continue with GitHub（推荐）
    echo     3. 授权后页面会显示成功
    echo     4. 返回终端继续
    echo.
    echo   如果没有 Vercel 账号，会自动引导注册
    echo.
    pause
    call vercel login
    if %errorlevel% neq 0 (
        echo   ✗ Vercel 登录失败
        echo   请手动运行: vercel login
        pause
        exit /b 1
    )
)
for /f "tokens=*" %%u in ('vercel whoami 2^>nul') do set VERCEL_USER=%%u
echo   ✓ 已登录 Vercel（账号: %VERCEL_USER%）

:: ══════════════════════════════════════════════════════
:: 步骤 5：获取 Supabase 数据库
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 创建 Supabase 数据库
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   请在浏览器中完成以下操作：
echo.
echo   第 1 步：打开 Supabase
echo     打开链接: https://supabase.com/new
echo     用 GitHub 账号登录（推荐）
echo.
echo   第 2 步：创建项目
echo     点击 New Project，填写：
echo       - Organization: 选择默认或创建新的
echo       - Project Name: 任意，如 seatwise-db
echo       - Database Password: 设置密码（请牢记）
echo       - Region: 选择 Southeast Asia 或 Northeast Asia
echo.
echo   第 3 步：获取连接字符串
echo     等待项目创建完成（约 1-2 分钟）
echo     进入 Settings → Database
echo     找到 Connection string，点击 URI 标签
echo     复制连接字符串，将 [YOUR-PASSWORD] 替换为你的密码
echo.
echo   连接字符串格式:
echo   postgresql://postgres.xxxxx:你的密码@aws-0-xxx.pooler.supabase.com:6532/postgres
echo.

:input_db
set /p DATABASE_URL="  请粘贴 Supabase 连接字符串: "
echo %DATABASE_URL% | findstr /b "postgresql://" >nul
if %errorlevel% neq 0 (
    echo   ✗ 连接字符串格式不正确，应以 postgresql:// 开头
    echo   请重新复制，确保包含完整的连接字符串
    goto input_db
)
echo   ✓ 数据库连接字符串已获取

:: ══════════════════════════════════════════════════════
:: 步骤 6：生成安全密钥并初始化数据库
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 生成安全密钥并初始化数据库
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 生成 JWT 安全密钥...
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%a
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_REFRESH_SECRET=%%a
echo   ✓ JWT 密钥已生成

echo   ⟳ 克隆项目代码...
if exist SeatWise (
    echo   ▸ 项目目录已存在，跳过克隆
    cd SeatWise
) else (
    git clone https://github.com/Meet7th/SeatWise.git
    if %errorlevel% neq 0 (
        echo   ✗ 项目克隆失败，请检查网络连接
        pause
        exit /b 1
    )
    cd SeatWise
    echo   ✓ 项目代码已克隆
)

echo   ⟳ 安装项目依赖（可能需要 1-2 分钟）...
call pnpm install --silent
if %errorlevel% neq 0 (
    echo   ✗ 依赖安装失败
    pause
    exit /b 1
)
echo   ✓ 依赖安装完成

echo   ⟳ 准备数据库 Schema...
copy /y apps\server\prisma\schema.postgres.prisma apps\server\prisma\schema.prisma >nul
echo   ✓ PostgreSQL Schema 已准备

echo   ⟳ 创建环境配置文件...
(
echo DATABASE_URL=%DATABASE_URL%
echo JWT_SECRET=%JWT_SECRET%
echo JWT_REFRESH_SECRET=%JWT_REFRESH_SECRET%
echo PORT=3000
echo FRONTEND_URL=http://localhost:5173
) > apps\server\.env
echo   ✓ 环境配置已生成

echo   ⟳ 生成 Prisma Client...
cd apps\server
call npx prisma generate
echo   ✓ Prisma Client 已生成

echo   ⟳ 创建数据库表结构...
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo   ✗ 数据库表创建失败
    echo   请检查 Supabase 连接字符串是否正确
    pause
    exit /b 1
)
echo   ✓ 数据库表已创建

echo   ⟳ 灌入测试数据（教师、学生、测评题）...
call npx prisma db seed
echo   ✓ 测试数据已灌入

cd ..\..

:: ══════════════════════════════════════════════════════
:: 步骤 7：部署后端 API
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 部署后端 API 到 Vercel
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ▸ 后端 API 负责处理所有业务逻辑和数据操作
echo.

cd apps\server

echo   ⟳ 链接 Vercel 项目...
vercel link --yes --project seatwise-api 2>nul
echo   ✓ 项目已链接

echo   ⟳ 配置环境变量...
(
echo %DATABASE_URL%
) | vercel env add DATABASE_URL production --yes 2>nul
(
echo %JWT_SECRET%
) | vercel env add JWT_SECRET production --yes 2>nul
(
echo %JWT_REFRESH_SECRET%
) | vercel env add JWT_REFRESH_SECRET production --yes 2>nul
echo   ✓ 环境变量已配置

echo   ⟳ 部署后端（可能需要 1-2 分钟）...
for /f "tokens=*" %%u in ('vercel --prod --yes 2^>^&1 ^| findstr /r "https://.*\.vercel\.app"') do set BACKEND_URL=%%u
if "%BACKEND_URL%"=="" set BACKEND_URL=https://seatwise-api.vercel.app

cd ..\..
echo   ✓ 后端已部署: %BACKEND_URL%

:: ══════════════════════════════════════════════════════
:: 步骤 8：部署前端
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 部署前端到 Vercel
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ▸ 前端是用户访问的界面，需要关联后端 API 地址
echo.

cd apps\web

echo   ⟳ 链接 Vercel 项目...
vercel link --yes --project seatwise 2>nul
echo   ✓ 项目已链接

echo   ⟳ 配置环境变量...
(
echo %BACKEND_URL%/api
) | vercel env add VITE_API_BASE_URL production --yes 2>nul
echo   ✓ 环境变量已配置

echo   ⟳ 部署前端（可能需要 1-2 分钟）...
for /f "tokens=*" %%u in ('vercel --prod --yes 2^>^&1 ^| findstr /r "https://.*\.vercel\.app"') do set FRONTEND_URL=%%u
if "%FRONTEND_URL%"=="" set FRONTEND_URL=https://seatwise.vercel.app

cd ..\..
echo   ✓ 前端已部署: %FRONTEND_URL%

:: ── 关联前后端 ──
echo   ⟳ 关联前后端地址...
cd apps\server
vercel env rm FRONTEND_URL production --yes 2>nul
(
echo %FRONTEND_URL%
) | vercel env add FRONTEND_URL production --yes 2>nul
echo   ⟳ 重新部署后端以应用配置...
vercel --prod --yes 2>nul
cd ..\..
echo   ✓ 前后端已关联

:: ══════════════════════════════════════════════════════
:: 完成
:: ══════════════════════════════════════════════════════
echo.
echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║                                                      ║
echo ║   🎉  部署完成！                                     ║
echo ║                                                      ║
echo ╚══════════════════════════════════════════════════════╝
echo.
echo   访问地址：
echo     前端: %FRONTEND_URL%
echo     后端: %BACKEND_URL%
echo.
echo   测试账号：
echo     教师: teacher@seatwise.com / Teacher123
echo     学生: 学号 2026001 / Student123
echo     班级邀请码: TEST01
echo.
echo   使用提示：
echo     • 首次访问可能需要等待 30 秒（Serverless 冷启动）
echo     • 如需自定义域名，在 Vercel 控制台 Settings → Domains
echo     • 如需 CDN 加速，在 Cloudflare 添加域名
echo.
echo   下一步：
echo     1. 打开前端地址 %FRONTEND_URL%
echo     2. 用教师账号登录（teacher@seatwise.com / Teacher123）
echo     3. 创建班级，配置教室布局
echo     4. 用学生账号注册，完成性格测评
echo     5. 回到教师端，点击「AI 智能排座」
echo.

pause
