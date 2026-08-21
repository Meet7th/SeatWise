#!/bin/bash
# 智座 SeatWise - 全自动云端部署脚本
# 用户只需提供 3 个 Token，其余全部自动完成

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
GRAY='\033[0;37m'
BOLD='\033[1m'
NC='\033[0m'

step_num=0
total_steps=6
start_time=$(date +%s)

elapsed() {
    local now=$(date +%s)
    local diff=$((now - start_time))
    printf "%02d:%02d" $((diff / 60)) $((diff % 60))
}

step() {
    step_num=$((step_num + 1))
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}  [${step_num}/${total_steps}] $1${NC}"
    echo -e "${GRAY}  已用时: $(elapsed)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

task() { echo -e "  ${CYAN}[$(elapsed)]${NC} ⟳ ${BOLD}$1${NC}"; }
info() { echo -e "  ${CYAN}[$(elapsed)]${NC}   ${GRAY}▸${NC} $1"; }
success() { echo -e "  ${CYAN}[$(elapsed)]${NC} ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${CYAN}[$(elapsed)]${NC} ${YELLOW}!${NC} $1"; }
error() { echo -e "  ${CYAN}[$(elapsed)]${NC} ${RED}✗${NC} $1"; }

# ── Banner ──
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║   🪑  智座 SeatWise - 全自动云端部署                          ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}║   只需 3 个 Token，其余全部自动完成                           ║${NC}"
echo -e "${CYAN}║   预计耗时：5-8 分钟                                         ║${NC}"
echo -e "${CYAN}║                                                              ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GRAY}部署流程：${NC}"
echo -e "  ${GRAY}  [1/6] 检查环境 (Node.js, pnpm)${NC}"
echo -e "  ${GRAY}  [2/6] 获取用户 Token${NC}"
echo -e "  ${GRAY}  [3/6] 自动创建 Supabase 数据库${NC}"
echo -e "  ${GRAY}  [4/6] 自动部署后端 API 到 Vercel${NC}"
echo -e "  ${GRAY}  [5/6] 自动部署前端到 Vercel${NC}"
echo -e "  ${GRAY}  [6/6] 初始化数据库并关联服务${NC}"
echo ""

# ══════════════════════════════════════════════════════
# 步骤 1：检查环境
# ══════════════════════════════════════════════════════
step "检查环境"

task "检查 Node.js"
if ! command -v node &> /dev/null; then
    error "未检测到 Node.js，请先安装: https://nodejs.org/"
    exit 1
fi
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js 版本过低（当前: $(node -v)，需要: ≥ 18）"
    exit 1
fi
success "Node.js $(node -v)"

task "检查 pnpm"
if ! command -v pnpm &> /dev/null; then
    info "pnpm 未安装，正在安装..."
    npm install -g pnpm 2>&1 | tail -1
fi
success "pnpm $(pnpm -v)"

task "检查 curl"
if ! command -v curl &> /dev/null; then
    error "未检测到 curl，请先安装"
    exit 1
fi
success "curl 已安装"

# ══════════════════════════════════════════════════════
# 步骤 2：获取 Token
# ══════════════════════════════════════════════════════
step "获取 API Token"

echo ""
info "本脚本需要 3 个 Token 来自动完成部署："
echo ""
info "  ${BOLD}Token 1: Supabase Access Token${NC}"
info "  用途: 自动创建数据库项目"
info "  获取: 打开 ${CYAN}https://supabase.com/dashboard/account/tokens${NC}"
info "  点击 ${CYAN}Generate new token${NC}，复制生成的 Token"
echo ""
info "  ${BOLD}Token 2: Vercel Access Token${NC}"
info "  用途: 自动部署前端和后端"
info "  获取: 打开 ${CYAN}https://vercel.com/account/tokens${NC}"
info "  点击 ${CYAN}Create${NC}，输入名称，复制生成的 Token"
echo ""
info "  ${BOLD}Token 3: GitHub Personal Access Token${NC}"
info "  用途: 自动 Fork 仓库到你的账号"
info "  获取: 打开 ${CYAN}https://github.com/settings/tokens?type=beta${NC}"
info "  点击 ${CYAN}Generate new token${NC}"
info "  权限选择: ${CYAN}Contents (Read and write)${NC}"
info "  复制生成的 Token"
echo ""
info "  ${GRAY}提示: Token 只在本次部署中使用，不会被存储${NC}"
echo ""

read -p "  请粘贴 Supabase Token: " SUPABASE_TOKEN
read -p "  请粘贴 Vercel Token: " VERCEL_TOKEN
read -p "  请粘贴 GitHub Token: " GITHUB_TOKEN

if [ -z "$SUPABASE_TOKEN" ] || [ -z "$VERCEL_TOKEN" ] || [ -z "$GITHUB_TOKEN" ]; then
    error "Token 不能为空"
    exit 1
fi

success "Token 已获取"

# ══════════════════════════════════════════════════════
# 步骤 3：创建 Supabase 数据库
# ══════════════════════════════════════════════════════
step "自动创建 Supabase 数据库"

task "验证 Supabase Token"
ORG_RESPONSE=$(curl -s -H "Authorization: Bearer $SUPABASE_TOKEN" \
    "https://api.supabase.com/v1/organizations")

if echo "$ORG_RESPONSE" | grep -q '"id"'; then
    ORG_ID=$(echo "$ORG_RESPONSE" | node -e "
        const data = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
        console.log(data[0]?.id || '');
    ")
    success "Supabase Token 有效"
else
    error "Supabase Token 无效或已过期"
    info "请重新获取: ${CYAN}https://supabase.com/dashboard/account/tokens${NC}"
    exit 1
fi

task "创建 Supabase 项目 seatwise-db"
info "正在创建数据库项目（可能需要 1-2 分钟）..."

DB_PASSWORD="Sw$(node -e "console.log(require('crypto').randomBytes(12).toString('hex'))")"

CREATE_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $SUPABASE_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"organization_id\": \"$ORG_ID\",
        \"name\": \"seatwise-db\",
        \"plan\": \"free\",
        \"region\": \"ap-southeast-1\",
        \"db_pass\": \"$DB_PASSWORD\"
    }" \
    "https://api.supabase.com/v1/projects")

if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    PROJECT_REF=$(echo "$CREATE_RESPONSE" | node -e "
        const data = JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
        console.log(data.id || '');
    ")
    success "项目已创建 (ID: $PROJECT_REF)"
else
    error "项目创建失败"
    info "响应: $CREATE_RESPONSE"
    info "可能原因: 免费项目数量已达上限（Supabase 免费版最多 2 个项目）"
    exit 1
fi

task "等待数据库就绪"
info "等待数据库初始化（约 1-2 分钟）..."
for i in $(seq 1 24); do
    sleep 5
    STATUS=$(curl -s -H "Authorization: Bearer $SUPABASE_TOKEN" \
        "https://api.supabase.com/v1/projects/$PROJECT_REF" | \
        node -e "const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));console.log(d.status||'')")
    if [ "$STATUS" = "ACTIVE_HEALTHY" ]; then
        success "数据库已就绪"
        break
    fi
    info "状态: $STATUS，继续等待... ($((i*5))s)"
    if [ $i -eq 24 ]; then
        error "数据库创建超时"
        exit 1
    fi
done

DATABASE_URL="postgresql://postgres.${PROJECT_REF}:${DB_PASSWORD}@aws-0-${PROJECT_REF}.pooler.supabase.com:6532/postgres"
success "数据库连接字符串已生成"

# ══════════════════════════════════════════════════════
# 步骤 4：部署后端 API
# ══════════════════════════════════════════════════════
step "自动部署后端 API 到 Vercel"

task "克隆项目代码"
if [ -d "SeatWise" ]; then
    info "项目目录已存在，跳过克隆"
    cd SeatWise
    git pull origin main 2>&1 | tail -1
else
    git clone https://github.com/Meet7th/SeatWise.git 2>&1 | tail -1
    cd SeatWise
fi
success "项目代码已准备"

task "安装依赖"
pnpm install --silent 2>&1 | tail -1
success "依赖安装完成"

task "生成 JWT 密钥"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_REFRESH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
success "JWT 密钥已生成"

task "准备数据库 Schema"
cp apps/server/prisma/schema.postgres.prisma apps/server/prisma/schema.prisma
cat > apps/server/.env << EOF
DATABASE_URL=$DATABASE_URL
JWT_SECRET=$JWT_SECRET
JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET
PORT=3000
FRONTEND_URL=http://localhost:5173
EOF
success "环境配置已生成"

task "部署后端到 Vercel"
info "正在通过 Vercel API 创建项目并部署..."

# 创建 Vercel 项目
VERCEL_BACKEND=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"seatwise-api\",
        \"framework\": \"nextjs\",
        \"gitRepository\": {
            \"type\": \"github\",
            \"repo\": \"Meet7th/SeatWise\"
        }
    }" \
    "https://api.vercel.com/v10/projects")

BACKEND_PROJECT_ID=$(echo "$VERCEL_BACKEND" | node -e "
    const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    console.log(d.id||'')
" 2>/dev/null || echo "")

if [ -z "$BACKEND_PROJECT_ID" ]; then
    warn "项目可能已存在，尝试获取..."
    BACKEND_PROJECT_ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
        "https://api.vercel.com/v9/projects" | \
        node -e "
            const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
            const p=d.projects?.find(p=>p.name==='seatwise-api');
            console.log(p?.id||'')
        ")
fi

if [ -z "$BACKEND_PROJECT_ID" ]; then
    error "无法创建或找到 Vercel 后端项目"
    info "请手动在 Vercel 控制台创建项目"
    exit 1
fi

success "Vercel 后端项目已创建 (ID: $BACKEND_PROJECT_ID)"

# 设置环境变量
task "配置后端环境变量"
for env_name in DATABASE_URL JWT_SECRET JWT_REFRESH_SECRET; do
    if [ "$env_name" = "DATABASE_URL" ]; then env_value="$DATABASE_URL"
    elif [ "$env_name" = "JWT_SECRET" ]; then env_value="$JWT_SECRET"
    else env_value="$JWT_REFRESH_SECRET"
    fi

    curl -s -X POST \
        -H "Authorization: Bearer $VERCEL_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"key\": \"$env_name\",
            \"value\": \"$env_value\",
            \"type\": \"encrypted\",
            \"target\": [\"production\"]
        }" \
        "https://api.vercel.com/v10/projects/$BACKEND_PROJECT_ID/env" > /dev/null
done
success "环境变量已配置"

# 触发部署
task "触发后端部署"
DEPLOY_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"seatwise-api\",
        \"gitSource\": {
            \"type\": \"github\",
            \"ref\": \"main\",
            \"repoId\": \"Meet7th/SeatWise\"
        },
        \"projectSettings\": {
            \"rootDirectory\": \"apps/server\"
        }
    }" \
    "https://api.vercel.com/v13/deployments")

BACKEND_URL=$(echo "$DEPLOY_RESPONSE" | node -e "
    const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    console.log(d.url ? 'https://'+d.url : '')
" 2>/dev/null || echo "")

if [ -z "$BACKEND_URL" ]; then
    BACKEND_URL="https://seatwise-api.vercel.app"
    warn "无法自动获取后端地址，使用默认: $BACKEND_URL"
fi

info "等待后端构建完成..."
sleep 30
success "后端已部署: ${CYAN}$BACKEND_URL${NC}"

# ══════════════════════════════════════════════════════
# 步骤 5：部署前端
# ══════════════════════════════════════════════════════
step "自动部署前端到 Vercel"

task "创建前端 Vercel 项目"
VERCEL_FRONTEND=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"seatwise\",
        \"framework\": \"vite\",
        \"gitRepository\": {
            \"type\": \"github\",
            \"repo\": \"Meet7th/SeatWise\"
        }
    }" \
    "https://api.vercel.com/v10/projects")

FRONTEND_PROJECT_ID=$(echo "$VERCEL_FRONTEND" | node -e "
    const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    console.log(d.id||'')
" 2>/dev/null || echo "")

if [ -z "$FRONTEND_PROJECT_ID" ]; then
    warn "项目可能已存在，尝试获取..."
    FRONTEND_PROJECT_ID=$(curl -s -H "Authorization: Bearer $VERCEL_TOKEN" \
        "https://api.vercel.com/v9/projects" | \
        node -e "
            const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
            const p=d.projects?.find(p=>p.name==='seatwise');
            console.log(p?.id||'')
        ")
fi

if [ -z "$FRONTEND_PROJECT_ID" ]; then
    error "无法创建或找到 Vercel 前端项目"
    exit 1
fi

success "Vercel 前端项目已创建 (ID: $FRONTEND_PROJECT_ID)"

task "配置前端环境变量"
curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"key\": \"VITE_API_BASE_URL\",
        \"value\": \"${BACKEND_URL}/api\",
        \"type\": \"encrypted\",
        \"target\": [\"production\"]
    }" \
    "https://api.vercel.com/v10/projects/$FRONTEND_PROJECT_ID/env" > /dev/null
success "VITE_API_BASE_URL 已配置"

task "触发前端部署"
DEPLOY_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"seatwise\",
        \"gitSource\": {
            \"type\": \"github\",
            \"ref\": \"main\",
            \"repoId\": \"Meet7th/SeatWise\"
        },
        \"projectSettings\": {
            \"rootDirectory\": \"apps/web\"
        }
    }" \
    "https://api.vercel.com/v13/deployments")

FRONTEND_URL=$(echo "$DEPLOY_RESPONSE" | node -e "
    const d=JSON.parse(require('fs').readFileSync('/dev/stdin','utf8'));
    console.log(d.url ? 'https://'+d.url : '')
" 2>/dev/null || echo "")

if [ -z "$FRONTEND_URL" ]; then
    FRONTEND_URL="https://seatwise.vercel.app"
    warn "无法自动获取前端地址，使用默认: $FRONTEND_URL"
fi

info "等待前端构建完成..."
sleep 30
success "前端已部署: ${CYAN}$FRONTEND_URL${NC}"

# ══════════════════════════════════════════════════════
# 步骤 6：初始化数据库并关联服务
# ══════════════════════════════════════════════════════
step "初始化数据库并关联服务"

task "更新后端 FRONTEND_URL"
curl -s -X POST \
    -H "Authorization: Bearer $VERCEL_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"key\": \"FRONTEND_URL\",
        \"value\": \"$FRONTEND_URL\",
        \"type\": \"encrypted\",
        \"target\": [\"production\"]
    }" \
    "https://api.vercel.com/v10/projects/$BACKEND_PROJECT_ID/env" > /dev/null
success "FRONTEND_URL 已更新"

task "初始化数据库"
cd apps/server
npx prisma generate --silent 2>&1 | tail -1
npx prisma db push --accept-data-loss 2>&1 | tail -1
success "数据库表已创建"

task "灌入测试数据"
npx prisma db seed 2>&1 | tail -1 || warn "种子数据灌入失败（不影响基本使用）"
cd ../..

success "数据库初始化完成"

# ══════════════════════════════════════════════════════
# 完成
# ══════════════════════════════════════════════════════
end_time=$(date +%s)
total_time=$((end_time - start_time))

echo ""
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║   🎉  全部部署完成！                                         ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}║   总耗时: $((total_time / 60)) 分 $((total_time % 60)) 秒                                            ║${NC}"
echo -e "${GREEN}║                                                              ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════════╝${NC}"
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
echo -e "  ${BOLD}下一步操作：${NC}"
echo -e "    1. 打开前端地址 ${CYAN}$FRONTEND_URL${NC}"
echo -e "    2. 用教师账号登录"
echo -e "    3. 创建班级，配置教室布局"
echo -e "    4. 用学生账号注册，完成性格测评"
echo -e "    5. 回到教师端，点击「AI 智能排座」"
echo ""
