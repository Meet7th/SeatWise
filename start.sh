#!/bin/bash

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║     智座 SeatWise - AI 智能排座系统    ║"
echo "  ║          一键启动 (SQLite 版)          ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到 Node.js，请先安装：https://nodejs.org/"
    exit 1
fi
echo "[√] Node.js 版本: $(node -v)"

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "[!] 未检测到 pnpm，正在自动安装..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "[错误] pnpm 安装失败，请手动运行: npm install -g pnpm"
        exit 1
    fi
    echo "[√] pnpm 安装完成"
else
    echo "[√] pnpm 已安装"
fi

# 安装依赖
echo ""
echo "[1/4] 正在安装依赖..."
pnpm install
if [ $? -ne 0 ]; then
    echo "[错误] 依赖安装失败"
    exit 1
fi
echo "[√] 依赖安装完成"

# 初始化数据库
echo ""
echo "[2/4] 正在初始化数据库..."
cd apps/server

cp -f prisma/schema.sqlite.prisma prisma/schema.prisma
cp -f ../../.env.local .env

npx prisma generate
if [ $? -ne 0 ]; then
    echo "[错误] Prisma Client 生成失败"
    exit 1
fi

npx prisma db push --accept-data-loss
if [ $? -ne 0 ]; then
    echo "[错误] 数据库初始化失败"
    exit 1
fi
echo "[√] 数据库初始化完成"

# 灌入测试数据
echo ""
echo "[3/4] 正在灌入测试数据..."
npx prisma db seed
if [ $? -ne 0 ]; then
    echo "[!] 种子数据灌入失败（不影响使用）"
else
    echo "[√] 测试数据灌入完成"
fi

cd ../..

# 启动服务
echo ""
echo "[4/4] 正在启动服务..."
echo ""
echo "  ┌─────────────────────────────────────┐"
echo "  │  前端地址: http://localhost:5173      │"
echo "  │  后端地址: http://localhost:3000      │"
echo "  │                                     │"
echo "  │  测试账号:                           │"
echo "  │  教师: teacher@seatwise.com          │"
echo "  │  密码: Teacher123                    │"
echo "  │  班级邀请码: TEST01                   │"
echo "  └─────────────────────────────────────┘"
echo ""
echo "  按 Ctrl+C 可停止服务"
echo ""

pnpm dev:all
