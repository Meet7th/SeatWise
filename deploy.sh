#!/bin/bash
# 智座 SeatWise - 一键云端部署脚本
# 用法: curl -fsSL https://raw.githubusercontent.com/Meet7th/SeatWise/main/deploy.sh | bash

set -e

# 颜色
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║   🪑 智座 SeatWise - 一键云端部署        ║${NC}"
echo -e "${CYAN}║   Vercel + Supabase 全自动               ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════╝${NC}"
echo ""

# ── 检查 Node.js ──
if ! command -v node &> /dev/null; then
    echo -e "${RED}[✗] 未检测到 Node.js，请先安装: https://nodejs.org/${NC}"
    exit 1
fi
echo -e "${GREEN}[√] Node.js $(node -v)${NC}"

# ── 安装 pnpm ──
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}[!] 正在安装 pnpm...${NC}"
    npm install -g pnpm
fi
echo -e "${GREEN}[√] pnpm $(pnpm -v)${NC}"

# ── 安装 Vercel CLI ──
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}[!] 正在安装 Vercel CLI...${NC}"
    npm install -g vercel
fi
echo -e "${GREEN}[√] Vercel CLI 已就绪${NC}"

# ── 检查 Vercel 登录 ──
if ! vercel whoami &> /dev/null 2>&1; then
    echo -e "${YELLOW}[!] 请在浏览器中登录 Vercel...${NC}"
    vercel login
fi
echo -e "${GREEN}[√] 已登录 Vercel ($(vercel whoami 2>/dev/null))${NC}"

# ── 克隆项目 ──
if [ ! -d "SeatWise" ]; then
    echo -e "${CYAN}[↓] 正在克隆项目...${NC}"
    git clone https://github.com/Meet7th/SeatWise.git
fi
cd SeatWise

# ── 安装依赖 ──
echo -e "${CYAN}[↓] 正在安装依赖...${NC}"
pnpm install --silent

# ── 获取 Supabase 数据库 ──
echo ""
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}  请在浏览器中完成以下操作：${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  1. 打开 ${CYAN}https://supabase.com/new${NC}"
echo -e "  2. 用 GitHub 登录，点击 ${CYAN}New Project${NC}"
echo -e "  3. 填写项目名称和数据库密码"
echo -e "  4. 选择区域 ${CYAN}(建议 Southeast Asia)${NC}"
echo -e "  5. 等待创建完成（约 1-2 分钟）"
echo -e "  6. 进入 ${CYAN}Settings → Database${NC}"
echo -e "  7. 找到 ${CYAN}Connection string → Transaction${NC}"
echo -e "  8. 复制连接字符串"
echo ""
echo -e "${YELLOW}  格式: postgresql://postgres.xxxxx:[PASSWORD]@aws-0-xxx.pooler.supabase.com:6532/postgres${NC}"
echo ""

read -p "  请粘贴 Supabase 连接字符串: " DATABASE_URL

if [[ ! "$DATABASE_URL" == postgresql://* ]]; then
    echo -e "${RED}[✗] 连接字符串格式不正确，应以 postgresql:// 开头${NC}"
    exit 1
fi
echo -e "${GREEN}[√] 数据库连接字符串已获取${NC}"

# ── 生成密钥 ──
JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}[√] JWT 密钥已生成${NC}"

# ── 准备数据库 ──
echo -e "${CYAN}[...] 正在准备数据库 Schema...${NC}"
cp apps/server/prisma/schema.postgres.prisma apps/server/prisma/schema.prisma

cat > apps/server/.env << EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
PORT=3000
FRONTEND_URL=http://localhost:5173
EOF

echo -e "${CYAN}[...] 正在初始化数据库...${NC}"
cd apps/server
npx prisma generate --silent 2>/dev/null
npx prisma db push --accept-data-loss 2>/dev/null
npx prisma db seed 2>/dev/null || true
cd ../..
echo -e "${GREEN}[√] 数据库已初始化${NC}"

# ── 部署后端 ──
echo -e "${CYAN}[...] 正在部署后端 API（约 1-2 分钟）...${NC}"
cd apps/server

vercel link --yes --project seatwise-api 2>/dev/null || true

echo "$DATABASE_URL" | vercel env add DATABASE_URL production --yes 2>/dev/null || true
echo "$JWT_SECRET" | vercel env add JWT_SECRET production --yes 2>/dev/null || true
echo "$JWT_REFRESH_SECRET" | vercel env add JWT_REFRESH_SECRET production --yes 2>/dev/null || true

BACKEND_URL=$(vercel --prod --yes 2>&1 | grep -oP 'https://[^\s]+\.vercel\.app' | head -1)
if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="https://seatwise-api.vercel.app"
fi

cd ../..
echo -e "${GREEN}[√] 后端已部署: ${BACKEND_URL}${NC}"

# ── 部署前端 ──
echo -e "${CYAN}[...] 正在部署前端（约 1-2 分钟）...${NC}"
cd apps/web

vercel link --yes --project seatwise 2>/dev/null || true

echo "${BACKEND_URL}/api" | vercel env add VITE_API_BASE_URL production --yes 2>/dev/null || true

FRONTEND_URL=$(vercel --prod --yes 2>&1 | grep -oP 'https://[^\s]+\.vercel\.app' | head -1)
if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="https://seatwise.vercel.app"
fi

cd ../..
echo -e "${GREEN}[√] 前端已部署: ${FRONTEND_URL}${NC}"

# ── 更新后端 FRONTEND_URL ──
cd apps/server
vercel env rm FRONTEND_URL production --yes 2>/dev/null || true
echo "$FRONTEND_URL" | vercel env add FRONTEND_URL production --yes 2>/dev/null || true
vercel --prod --yes 2>/dev/null || true
cd ../..

# ── 完成 ──
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          🎉 部署完成！                   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${CYAN}前端地址:${NC} $FRONTEND_URL"
echo -e "  ${CYAN}后端地址:${NC} $BACKEND_URL"
echo ""
echo -e "  ${YELLOW}测试账号:${NC}"
echo -e "  教师: teacher@seatwise.com / Teacher123"
echo -e "  学生: 2026001 (学号) / Student123"
echo -e "  班级邀请码: TEST01"
echo ""
echo -e "  ${YELLOW}提示:${NC}"
echo -e "  - 首次访问可能需要等待 30 秒（Serverless 冷启动）"
echo -e "  - 如需自定义域名，请在 Vercel 控制台设置"
echo ""
