@echo off
chcp 65001 >nul
title 智座 SeatWise - 一键启动

echo.
echo  ╔══════════════════════════════════════╗
echo  ║     智座 SeatWise - AI 智能排座系统    ║
echo  ║          一键启动 (SQLite 版)          ║
echo  ╚══════════════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装：https://nodejs.org/
    echo 建议下载 LTS（长期支持）版本
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [√] Node.js 版本: %NODE_VER%

:: 检查 pnpm，没有则自动安装
where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] 未检测到 pnpm，正在自动安装...
    call npm install -g pnpm
    if %errorlevel% neq 0 (
        echo [错误] pnpm 安装失败，请手动运行: npm install -g pnpm
        pause
        exit /b 1
    )
    echo [√] pnpm 安装完成
) else (
    echo [√] pnpm 已安装
)

:: 复制本地配置
if not exist ".env.local" (
    echo [!] 未找到 .env.local 配置文件
    pause
    exit /b 1
)

:: 安装依赖
echo.
echo [1/4] 正在安装依赖...
call pnpm install
if %errorlevel% neq 0 (
    echo [错误] 依赖安装失败
    pause
    exit /b 1
)
echo [√] 依赖安装完成

:: 生成 Prisma Client（SQLite 版）
echo.
echo [2/4] 正在初始化数据库...
cd apps\server

:: 使用 SQLite schema
copy /Y prisma\schema.sqlite.prisma prisma\schema.prisma >nul
copy /Y ..\..\.env.local .env >nul

call npx prisma generate
if %errorlevel% neq 0 (
    echo [错误] Prisma Client 生成失败
    pause
    exit /b 1
)

:: 创建数据库和表结构
call npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo [错误] 数据库初始化失败
    pause
    exit /b 1
)
echo [√] 数据库初始化完成

:: 灌入测试数据
echo.
echo [3/4] 正在灌入测试数据...
call npx prisma db seed
if %errorlevel% neq 0 (
    echo [!] 种子数据灌入失败（不影响使用）
) else (
    echo [√] 测试数据灌入完成
)

cd ..\..

:: 启动服务
echo.
echo [4/4] 正在启动服务...
echo.
echo  ┌─────────────────────────────────────┐
echo  │  前端地址: http://localhost:5173      │
echo  │  后端地址: http://localhost:3000      │
echo  │                                     │
echo  │  测试账号:                           │
echo  │  教师: teacher@seatwise.com          │
echo  │  密码: Teacher123                    │
echo  │  班级邀请码: TEST01                   │
echo  └─────────────────────────────────────┘
echo.
echo  按 Ctrl+C 可停止服务
echo.

:: 同时启动前端和后端
call pnpm dev:all
