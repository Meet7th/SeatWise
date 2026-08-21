@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════╗
echo ║   🪑 智座 SeatWise - 一键云端部署        ║
echo ║   Vercel + Supabase 全自动               ║
echo ╚══════════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [✗] 未检测到 Node.js，请先安装: https://nodejs.org/
    pause
    exit /b 1
)
echo [√] Node.js 已就绪

:: 安装 pnpm
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] 正在安装 pnpm...
    call npm install -g pnpm
)
echo [√] pnpm 已就绪

:: 安装 Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] 正在安装 Vercel CLI...
    call npm install -g vercel
)
echo [√] Vercel CLI 已就绪

:: 检查 Vercel 登录
vercel whoami >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] 请在浏览器中登录 Vercel...
    call vercel login
)
for /f "tokens=*" %%i in ('vercel whoami 2^>nul') do set VERCEL_USER=%%i
echo [√] 已登录 Vercel (%VERCEL_USER%)

:: 克隆项目
if not exist SeatWise (
    echo [↓] 正在克隆项目...
    git clone https://github.com/Meet7th/SeatWise.git
)
cd SeatWise

:: 安装依赖
echo [↓] 正在安装依赖...
call pnpm install --silent

:: 获取 Supabase 数据库
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   请在浏览器中完成以下操作：
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   1. 打开 https://supabase.com/new
echo   2. 用 GitHub 登录，点击 New Project
echo   3. 填写项目名称和数据库密码
echo   4. 选择区域 (建议 Southeast Asia^)
echo   5. 等待创建完成（约 1-2 分钟^）
echo   6. 进入 Settings → Database
echo   7. 找到 Connection string → Transaction
echo   8. 复制连接字符串
echo.
echo   格式: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6532/postgres
echo.

set /p DATABASE_URL="  请粘贴 Supabase 连接字符串: "

echo %DATABASE_URL% | findstr /b "postgresql://" >nul
if %errorlevel% neq 0 (
    echo [✗] 连接字符串格式不正确，应以 postgresql:// 开头
    pause
    exit /b 1
)
echo [√] 数据库连接字符串已获取

:: 生成密钥
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%a
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_REFRESH_SECRET=%%a
echo [√] JWT 密钥已生成

:: 准备数据库
echo [...] 正在准备数据库 Schema...
copy /y apps\server\prisma\schema.postgres.prisma apps\server\prisma\schema.prisma >nul

(
echo DATABASE_URL=%DATABASE_URL%
echo JWT_SECRET=%JWT_SECRET%
echo JWT_REFRESH_SECRET=%JWT_REFRESH_SECRET%
echo PORT=3000
echo FRONTEND_URL=http://localhost:5173
) > apps\server\.env

echo [...] 正在初始化数据库...
cd apps\server
call npx prisma generate --silent 2>nul
call npx prisma db push --accept-data-loss 2>nul
call npx prisma db seed 2>nul
cd ..\..
echo [√] 数据库已初始化

:: 部署后端
echo [...] 正在部署后端 API（约 1-2 分钟^)...
cd apps\server

vercel link --yes --project seatwise-api 2>nul

(
echo %DATABASE_URL%
) | vercel env add DATABASE_URL production --yes 2>nul
(
echo %JWT_SECRET%
) | vercel env add JWT_SECRET production --yes 2>nul
(
echo %JWT_REFRESH_SECRET%
) | vercel env add JWT_REFRESH_SECRET production --yes 2>nul

for /f "tokens=*" %%u in ('vercel --prod --yes 2^>^&1 ^| findstr /r "https://.*\.vercel\.app"') do set BACKEND_URL=%%u
if "%BACKEND_URL%"=="" set BACKEND_URL=https://seatwise-api.vercel.app

cd ..\..
echo [√] 后端已部署: %BACKEND_URL%

:: 部署前端
echo [...] 正在部署前端（约 1-2 分钟^)...
cd apps\web

vercel link --yes --project seatwise 2>nul

(
echo %BACKEND_URL%/api
) | vercel env add VITE_API_BASE_URL production --yes 2>nul

for /f "tokens=*" %%u in ('vercel --prod --yes 2^>^&1 ^| findstr /r "https://.*\.vercel\.app"') do set FRONTEND_URL=%%u
if "%FRONTEND_URL%"=="" set FRONTEND_URL=https://seatwise.vercel.app

cd ..\..
echo [√] 前端已部署: %FRONTEND_URL%

:: 更新后端 FRONTEND_URL
cd apps\server
vercel env rm FRONTEND_URL production --yes 2>nul
(
echo %FRONTEND_URL%
) | vercel env add FRONTEND_URL production --yes 2>nul
vercel --prod --yes 2>nul
cd ..\..

:: 完成
echo.
echo ╔══════════════════════════════════════════╗
echo ║          🎉 部署完成！                   ║
echo ╚══════════════════════════════════════════╝
echo.
echo   前端地址: %FRONTEND_URL%
echo   后端地址: %BACKEND_URL%
echo.
echo   测试账号:
echo   教师: teacher@seatwise.com / Teacher123
echo   学生: 2026001 (学号^) / Student123
echo   班级邀请码: TEST01
echo.
echo   提示:
echo   - 首次访问可能需要等待 30 秒（Serverless 冷启动^)
echo   - 如需自定义域名，请在 Vercel 控制台设置
echo.

pause
