#!/bin/bash
# 智座 SeatWise - 一键云端部署脚本
# 用法: ./deploy.sh

set -e

# ── 颜色定义 ──
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
BOLD='\033[1m'
NC='\033[0m'

# ── 工具函数 ──
step_num=0
total_steps=8
current_task=""
start_time=$(date +%s)

elapsed() {
    local now=$(date +%s)
    local diff=$((now - start_time))
    local min=$((diff / 60))
    local sec=$((diff % 60))
    printf "%02d:%02d" $min $sec
}

step() {
    step_num=$((step_num + 1))
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  [步骤 ${step_num}/${total_steps}] $1${NC}"
    echo -e "${GRAY}  已用时: $(elapsed)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

task() {
    current_task="$1"
    echo -e "  ${CYAN}[$(elapsed)]${NC} ⟳ ${BOLD}$1${NC}"
}

info() {
    echo -e "  ${CYAN}[$(elapsed)]${NC}   ${GRAY}▸${NC} $1"
}

success() {
    echo -e "  ${CYAN}[$(elapsed)]${NC} ${GREEN}✓${NC} $1"
}

warn() {
    echo -e "  ${CYAN}[$(elapsed)]${NC} ${YELLOW}!${NC} $1"
}

error() {
    echo -e "  ${CYAN}[$(elapsed)]${NC} ${RED}✗${NC} $1"
    echo -e "  ${GRAY}  失败任务: ${current_task}${NC}"
}

# ── 开始 ──
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║   🪑  智座 SeatWise - 一键云端部署                       ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}║   Vercel + Supabase 全自动部署                           ║${NC}"
echo -e "${CYAN}║   预计耗时：5-10 分钟                                    ║${NC}"
echo -e "${CYAN}║                                                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GRAY}部署流程概览：${NC}"
echo -e "  ${GRAY}  [1/8] 检查 Node.js${NC}"
echo -e "  ${GRAY}  [2/8] 安装 pnpm${NC}"
echo -e "  ${GRAY}  [3/8] 安装 Vercel CLI${NC}"
echo -e "  ${GRAY}  [4/8] 登录 Vercel${NC}"
echo -e "  ${GRAY}  [5/8] 获取 Supabase 数据库${NC}"
echo -e "  ${GRAY}  [6/8] 初始化数据库${NC}"
echo -e "  ${GRAY}  [7/8] 部署后端 API${NC}"
echo -e "  ${GRAY}  [8/8] 部署前端${NC}"
echo ""
echo -e "  ${GRAY}提示：每个步骤都会显示实时进度和耗时${NC}"
echo ""

# ══════════════════════════════════════════════════════
# 步骤 1：检查 Node.js
# ══════════════════════════════════════════════════════
step "检查 Node.js 环境"

task "检测 node 命令"
if ! command -v node &> /dev/null; then
    error "未检测到 Node.js"
    echo ""
    info "请先安装 Node.js（≥ 18）："
    info "  下载地址: ${CYAN}https://nodejs.org/${NC}"
    info ""
    info "安装步骤："
    info "  1. 打开上面的链接，下载 LTS 版本"
    info "  2. 双击安装包，一路点击 Next"
    info "  3. 安装完成后重新打开终端"
    info "  4. 运行 ${CYAN}node -v${NC} 验证安装成功"
    info "  5. 重新运行本脚本"
    exit 1
fi

task "检查 Node.js 版本"
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 版本过低（当前: $(node -v)，需要: ≥ 18）"
    info "请升级 Node.js: ${CYAN}https://nodejs.org/${NC}"
    exit 1
fi
success "Node.js $(node -v) ✓"

# ══════════════════════════════════════════════════════
# 步骤 2：安装 pnpm
# ══════════════════════════════════════════════════════
step "检查并安装 pnpm 包管理器"

task "检测 pnpm 命令"
if ! command -v pnpm &> /dev/null; then
    warn "pnpm 未安装"
    task "运行 npm install -g pnpm"
    info "正在下载并安装 pnpm..."
    if npm install -g pnpm 2>&1; then
        success "pnpm 安装成功"
    else
        error "pnpm 安装失败"
        info "请手动运行: ${CYAN}npm install -g pnpm${NC}"
        exit 1
    fi
else
    success "pnpm $(pnpm -v) 已安装"
fi

# ══════════════════════════════════════════════════════
# 步骤 3：安装 Vercel CLI
# ══════════════════════════════════════════════════════
step "检查并安装 Vercel CLI"

task "检测 vercel 命令"
if ! command -v vercel &> /dev/null; then
    warn "Vercel CLI 未安装"
    info "Vercel CLI 用于将项目部署到 Vercel 云平台"
    task "运行 npm install -g vercel"
    info "正在下载并安装 Vercel CLI（可能需要 1-2 分钟）..."
    if npm install -g vercel 2>&1; then
        success "Vercel CLI 安装成功"
    else
        error "Vercel CLI 安装失败"
        info "请手动运行: ${CYAN}npm install -g vercel${NC}"
        exit 1
    fi
else
    success "Vercel CLI 已安装"
fi

# ══════════════════════════════════════════════════════
# 步骤 4：登录 Vercel
# ══════════════════════════════════════════════════════
step "登录 Vercel 账号"

task "检查 Vercel 登录状态"
VERCEL_USER=$(vercel whoami 2>/dev/null || echo "")

if [ -z "$VERCEL_USER" ]; then
    warn "未登录 Vercel"
    echo ""
    info "登录流程："
    info "  1. 浏览器会自动打开 Vercel 登录页面"
    info "  2. 选择 ${CYAN}Continue with GitHub${NC}（推荐）"
    info "  3. 授权后页面会显示成功"
    info "  4. 返回终端继续"
    echo ""
    info "如果没有 Vercel 账号，会自动引导注册"
    echo ""
    read -p "  按 Enter 开始登录..."
    echo ""

    task "执行 vercel login"
    info "等待浏览器授权..."
    vercel login

    task "验证登录状态"
    VERCEL_USER=$(vercel whoami 2>/dev/null || echo "")
    if [ -z "$VERCEL_USER" ]; then
        error "Vercel 登录失败"
        info "请手动运行: ${CYAN}vercel login${NC}"
        exit 1
    fi
fi

success "已登录 Vercel（账号: $VERCEL_USER）"

# ══════════════════════════════════════════════════════
# 步骤 5：获取 Supabase 数据库
# ══════════════════════════════════════════════════════
step "创建 Supabase 数据库"

echo ""
info "请在浏览器中完成以下操作："
echo ""
info "  ${BOLD}第 1 步：打开 Supabase${NC}"
info "  打开链接: ${CYAN}https://supabase.com/new${NC}"
info "  用 GitHub 账号登录（推荐）"
echo ""
info "  ${BOLD}第 2 步：创建项目${NC}"
info "  点击 ${CYAN}New Project${NC}，填写："
info "    - Organization: 选择默认或创建新的"
info "    - Project Name: 任意，如 ${CYAN}seatwise-db${NC}"
info "    - Database Password: 设置密码（${RED}请牢记${NC}）"
info "    - Region: 选择 ${CYAN}Southeast Asia${NC} 或 ${CYAN}Northeast Asia${NC}"
echo ""
info "  ${BOLD}第 3 步：获取连接字符串${NC}"
info "  等待项目创建完成（约 1-2 分钟）"
info "  进入 ${CYAN}Settings → Database${NC}"
info "  找到 ${CYAN}Connection string${NC}，点击 ${CYAN}URI${NC} 标签"
info "  复制连接字符串，将 ${CYAN}[YOUR-PASSWORD]${NC} 替换为你的密码"
echo ""
info "  ${GRAY}连接字符串格式:${NC}"
info "  ${GRAY}postgresql://postgres.xxxxx:你的密码@aws-0-xxx.pooler.supabase.com:6532/postgres${NC}"
echo ""

while true; do
    read -p "  请粘贴 Supabase 连接字符串: " DATABASE_URL
    if [[ "$DATABASE_URL" == postgresql://* ]]; then
        break
    else
        error "连接字符串格式不正确，应以 postgresql:// 开头"
        info "请重新复制，确保包含完整的连接字符串"
    fi
done

task "验证连接字符串格式"
success "数据库连接字符串已获取"

# ══════════════════════════════════════════════════════
# 步骤 6：生成安全密钥并初始化数据库
# ══════════════════════════════════════════════════════
step "生成安全密钥并初始化数据库"

task "生成 JWT 安全密钥"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
success "JWT 密钥已生成"

task "克隆项目代码"
if [ -d "SeatWise" ]; then
    info "项目目录已存在，跳过克隆"
    cd SeatWise
else
    info "正在从 GitHub 克隆..."
    if git clone https://github.com/Meet7th/SeatWise.git 2>&1; then
        success "项目代码已克隆"
    else
        error "项目克隆失败"
        info "请检查网络连接，或手动运行: ${CYAN}git clone https://github.com/Meet7th/SeatWise.git${NC}"
        exit 1
    fi
    cd SeatWise
fi

task "安装项目依赖"
info "运行 pnpm install（可能需要 1-3 分钟）..."
info "正在下载依赖包，请耐心等待..."
if pnpm install 2>&1; then
    success "依赖安装完成"
else
    error "依赖安装失败"
    info "请尝试手动运行: ${CYAN}pnpm install${NC}"
    exit 1
fi

task "准备数据库 Schema"
cp apps/server/prisma/schema.postgres.prisma apps/server/prisma/schema.prisma
success "PostgreSQL Schema 已准备"

task "创建环境配置文件"
cat > apps/server/.env << EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
PORT=3000
FRONTEND_URL=http://localhost:5173
EOF
success "环境配置已生成"

task "生成 Prisma Client"
info "正在生成数据库客户端（可能需要 30 秒）..."
if cd apps/server && npx prisma generate 2>&1; then
    success "Prisma Client 已生成"
else
    error "Prisma Client 生成失败"
    exit 1
fi

task "创建数据库表结构"
info "正在连接 Supabase 并创建表..."
info "首次连接可能需要 10-20 秒..."
if npx prisma db push --accept-data-loss 2>&1; then
    success "数据库表已创建"
else
    error "数据库表创建失败"
    info "请检查 Supabase 连接字符串是否正确"
    info "确认 Supabase 项目状态为 Active"
    exit 1
fi

task "灌入测试数据"
info "正在灌入教师、学生、测评题等测试数据..."
if npx prisma db seed 2>&1; then
    success "测试数据已灌入"
else
    warn "种子数据灌入失败（不影响基本使用）"
fi

cd ../..

# ══════════════════════════════════════════════════════
# 步骤 7：部署后端 API
# ══════════════════════════════════════════════════════
step "部署后端 API 到 Vercel"

info "后端 API 负责处理所有业务逻辑和数据操作"
echo ""

cd apps/server

task "链接 Vercel 项目 seatwise-api"
info "正在创建/链接 Vercel 项目..."
if vercel link --yes --project seatwise-api 2>&1; then
    success "项目已链接"
else
    warn "项目链接可能失败，继续尝试部署..."
fi

task "配置环境变量 DATABASE_URL"
info "正在设置数据库连接..."
if echo "$DATABASE_URL" | vercel env add DATABASE_URL production --yes 2>&1; then
    success "DATABASE_URL 已配置"
else
    warn "DATABASE_URL 配置可能已存在"
fi

task "配置环境变量 JWT_SECRET"
if echo "$JWT_SECRET" | vercel env add JWT_SECRET production --yes 2>&1; then
    success "JWT_SECRET 已配置"
else
    warn "JWT_SECRET 配置可能已存在"
fi

task "配置环境变量 JWT_REFRESH_SECRET"
if echo "$JWT_REFRESH_SECRET" | vercel env add JWT_REFRESH_SECRET production --yes 2>&1; then
    success "JWT_REFRESH_SECRET 已配置"
else
    warn "JWT_REFRESH_SECRET 配置可能已存在"
fi

task "部署后端到 Vercel"
info "正在构建和部署（可能需要 1-3 分钟）..."
info "Vercel 正在执行以下操作："
info "  1. 安装依赖"
info "  2. 编译 TypeScript"
info "  3. 打包部署"
info "请耐心等待..."

BACKEND_OUTPUT=$(vercel --prod --yes 2>&1)
BACKEND_URL=$(echo "$BACKEND_OUTPUT" | grep -oP 'https://[^\s]+\.vercel\.app' | head -1)

if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="https://seatwise-api.vercel.app"
    warn "无法自动获取后端地址，使用默认: $BACKEND_URL"
fi

cd ../..
success "后端已部署: ${CYAN}$BACKEND_URL${NC}"

# ══════════════════════════════════════════════════════
# 步骤 8：部署前端
# ══════════════════════════════════════════════════════
step "部署前端到 Vercel"

info "前端是用户访问的界面，需要关联后端 API 地址"
echo ""

cd apps/web

task "链接 Vercel 项目 seatwise"
info "正在创建/链接 Vercel 项目..."
if vercel link --yes --project seatwise 2>&1; then
    success "项目已链接"
else
    warn "项目链接可能失败，继续尝试部署..."
fi

task "配置环境变量 VITE_API_BASE_URL"
info "后端地址: $BACKEND_URL/api"
if echo "${BACKEND_URL}/api" | vercel env add VITE_API_BASE_URL production --yes 2>&1; then
    success "VITE_API_BASE_URL 已配置"
else
    warn "VITE_API_BASE_URL 配置可能已存在"
fi

task "部署前端到 Vercel"
info "正在构建和部署（可能需要 1-3 分钟）..."
info "Vercel 正在执行以下操作："
info "  1. 安装依赖"
info "  2. 编译 Vue 3 + TypeScript"
info "  3. 打包静态资源"
info "请耐心等待..."

FRONTEND_OUTPUT=$(vercel --prod --yes 2>&1)
FRONTEND_URL=$(echo "$FRONTEND_OUTPUT" | grep -oP 'https://[^\s]+\.vercel\.app' | head -1)

if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="https://seatwise.vercel.app"
    warn "无法自动获取前端地址，使用默认: $FRONTEND_URL"
fi

cd ../..
success "前端已部署: ${CYAN}$FRONTEND_URL${NC}"

# ── 关联前后端 ──
task "关联前后端地址"
info "正在更新后端的前端地址配置..."

cd apps/server
vercel env rm FRONTEND_URL production --yes 2>/dev/null || true
if echo "$FRONTEND_URL" | vercel env add FRONTEND_URL production --yes 2>&1; then
    success "FRONTEND_URL 已更新"
else
    warn "FRONTEND_URL 更新可能失败"
fi

task "重新部署后端以应用配置"
info "正在重新部署后端..."
if vercel --prod --yes 2>&1; then
    success "后端已重新部署"
else
    warn "后端重新部署可能失败"
fi
cd ../..

success "前后端已关联"

# ══════════════════════════════════════════════════════
# 完成
# ══════════════════════════════════════════════════════
end_time=$(date +%s)
total_time=$((end_time - start_time))
total_min=$((total_time / 60))
total_sec=$((total_time % 60))

echo ""
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   🎉  部署完成！                                         ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}║   总耗时: ${total_min} 分 ${total_sec} 秒                                  ║${NC}"
echo -e "${GREEN}║                                                          ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}访问地址：${NC}"
echo -e "    前端: ${CYAN}$FRONTEND_URL${NC}"
echo -e "    后端: ${CYAN}$BACKEND_URL${NC}"
echo ""
echo -e "  ${BOLD}测试账号：${NC}"
echo -e "    教师: ${CYAN}teacher@seatwise.com${NC} / ${CYAN}Teacher123${NC}"
echo -e "    学生: 学号 ${CYAN}2026001${NC} / ${CYAN}Student123${NC}"
echo -e "    班级邀请码: ${CYAN}TEST01${NC}"
echo ""
echo -e "  ${BOLD}使用提示：${NC}"
echo -e "    ${GRAY}• 首次访问可能需要等待 30 秒（Serverless 冷启动）${NC}"
echo -e "    ${GRAY}• 如需自定义域名，在 Vercel 控制台 Settings → Domains${NC}"
echo -e "    ${GRAY}• 如需 CDN 加速，在 Cloudflare 添加域名${NC}"
echo ""
echo -e "  ${BOLD}下一步操作：${NC}"
echo -e "    1. 打开前端地址 ${CYAN}$FRONTEND_URL${NC}"
echo -e "    2. 用教师账号登录（teacher@seatwise.com / Teacher123）"
echo -e "    3. 创建班级，配置教室布局"
echo -e "    4. 用学生账号注册，完成性格测评"
echo -e "    5. 回到教师端，点击「AI 智能排座」"
echo ""
echo -e "  ${GRAY}如果遇到问题，请查看上方日志或访问:${NC}"
echo -e "  ${GRAY}  https://github.com/Meet7th/SeatWise/issues${NC}"
echo ""
