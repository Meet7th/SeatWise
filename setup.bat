@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ══════════════════════════════════════════════════════
:: 智座 SeatWise - 全自动云端部署脚本 (Windows)
:: 用户只需提供 3 个 Token，其余全部自动完成
:: ══════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   🪑  智座 SeatWise - 全自动云端部署                          ║
echo ║                                                              ║
echo ║   只需 3 个 Token，其余全部自动完成                           ║
echo ║   预计耗时：5-8 分钟                                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo   部署流程：
echo     [1/6] 检查环境 (Node.js, pnpm)
echo     [2/6] 获取用户 Token
echo     [3/6] 自动创建 Supabase 数据库
echo     [4/6] 自动部署后端 API 到 Vercel
echo     [5/6] 自动部署前端到 Vercel
echo     [6/6] 初始化数据库并关联服务
echo.

set step_num=0
set total_steps=6

:: ══════════════════════════════════════════════════════
:: 步骤 1：检查环境
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 检查环境
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 检查 Node.js...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未检测到 Node.js，请先安装: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('node -v') do echo   ✓ Node.js %%v

echo   ⟳ 检查 pnpm...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo   ! pnpm 未安装，正在安装...
    call npm install -g pnpm
)
for /f "tokens=*" %%v in ('pnpm -v') do echo   ✓ pnpm %%v

echo   ⟳ 检查 curl...
where curl >nul 2>nul
if %errorlevel% neq 0 (
    echo   ✗ 未检测到 curl，请先安装
    pause
    exit /b 1
)
echo   ✓ curl 已安装

:: ══════════════════════════════════════════════════════
:: 步骤 2：获取 Token
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 获取 API Token
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   本脚本需要 3 个 Token 来自动完成部署：
echo.
echo   Token 1: Supabase Access Token
echo     用途: 自动创建数据库项目
echo     获取步骤:
echo       1. 打开 https://supabase.com，用 GitHub 登录
echo       2. 点击左下角头像 → Account Settings
echo       3. 点击左侧 Access Tokens
echo       4. 点击 Generate new token
echo       5. 输入名称如 seatwise-deploy
echo       6. 点击 Generate token，复制 Token
echo.
echo   Token 2: Vercel Access Token
echo     用途: 自动部署前端和后端
echo     获取步骤:
echo       1. 打开 https://vercel.com，用 GitHub 登录
echo       2. 点击右上角头像 → Settings
echo       3. 点击左侧 Tokens
echo       4. 点击 Create
echo       5. 输入名称如 seatwise-deploy
echo       6. 点击 Create Token，复制 Token
echo.
echo   Token 3: GitHub Personal Access Token
echo     用途: 自动 Fork 仓库到你的账号
echo     获取步骤:
echo       1. 打开 https://github.com，登录账号
echo       2. 点击右上角头像 → Settings
echo       3. 滚动到底部 → Developer settings
echo       4. 点击 Personal access tokens → Fine-grained tokens
echo       5. 点击 Generate new token
echo       6. 输入名称如 seatwise-deploy
echo       7. Repository access 选择 All repositories
echo       8. Permissions 找到 Contents，选择 Read and write
echo       9. 点击 Generate token，复制 Token
echo.
echo   ⚠ Token 只会显示一次，请立即复制保存！
echo   提示: Token 只在本次部署中使用，不会被存储
echo.

set /p SUPABASE_TOKEN="  请粘贴 Supabase Token: "
set /p VERCEL_TOKEN="  请粘贴 Vercel Token: "
set /p GITHUB_TOKEN="  请粘贴 GitHub Token: "

if "!SUPABASE_TOKEN!"=="" (
    echo   ✗ Token 不能为空
    pause
    exit /b 1
)
if "!VERCEL_TOKEN!"=="" (
    echo   ✗ Token 不能为空
    pause
    exit /b 1
)
if "!GITHUB_TOKEN!"=="" (
    echo   ✗ Token 不能为空
    pause
    exit /b 1
)
echo   ✓ Token 已获取

:: ══════════════════════════════════════════════════════
:: 步骤 3：创建 Supabase 数据库
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 自动创建 Supabase 数据库
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 验证 Supabase Token...
curl -s -H "Authorization: Bearer !SUPABASE_TOKEN!" "https://api.supabase.com/v1/organizations" > %TEMP%\supa_org.json
findstr /c:"id" %TEMP%\supa_org.json >nul
if %errorlevel% neq 0 (
    echo   ✗ Supabase Token 无效或已过期
    echo   请重新获取: https://supabase.com/dashboard/account/tokens
    pause
    exit /b 1
)
echo   ✓ Supabase Token 有效

echo   ⟳ 创建 Supabase 项目 seatwise-db...
echo   正在创建数据库项目（可能需要 1-2 分钟）...

:: 生成随机密码
for /f "tokens=*" %%a in ('node -e "console.log('Sw'+require('crypto').randomBytes(12).toString('hex'))"') do set DB_PASSWORD=%%a

:: 获取组织 ID
for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\supa_org.json','utf8'));console.log(d[0]?.id||'')"') do set ORG_ID=%%a

:: 创建项目
curl -s -X POST ^
    -H "Authorization: Bearer !SUPABASE_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"organization_id\": \"!ORG_ID!\", \"name\": \"seatwise-db\", \"plan\": \"free\", \"region\": \"ap-southeast-1\", \"db_pass\": \"!DB_PASSWORD!\"}" ^
    "https://api.supabase.com/v1/projects" > %TEMP%\supa_create.json

findstr /c:"id" %TEMP%\supa_create.json >nul
if %errorlevel% neq 0 (
    echo   ✗ 项目创建失败
    echo   可能原因: 免费项目数量已达上限（最多 2 个）
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\supa_create.json','utf8'));console.log(d.id||'')"') do set PROJECT_REF=%%a
echo   ✓ 项目已创建 (ID: !PROJECT_REF!)

echo   ⟳ 等待数据库就绪...
echo   等待数据库初始化（约 1-2 分钟）...
set DB_READY=0
for /L %%i in (1,1,24) do (
    if !DB_READY!==0 (
        timeout /t 5 /nobreak >nul
        curl -s -H "Authorization: Bearer !SUPABASE_TOKEN!" "https://api.supabase.com/v1/projects/!PROJECT_REF!" > %TEMP%\supa_status.json
        for /f "tokens=*" %%s in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\supa_status.json','utf8'));console.log(d.status||'')"') do set STATUS=%%s
        if "!STATUS!"=="ACTIVE_HEALTHY" (
            set DB_READY=1
            echo   ✓ 数据库已就绪
        ) else (
            echo   ▸ 状态: !STATUS!，继续等待... (%%i*5s^)
        )
    )
)

if !DB_READY!==0 (
    echo   ✗ 数据库创建超时
    pause
    exit /b 1
)

set DATABASE_URL=postgresql://postgres.!PROJECT_REF!:!DB_PASSWORD!@aws-0-!PROJECT_REF!.pooler.supabase.com:6532/postgres
echo   ✓ 数据库连接字符串已生成

:: ══════════════════════════════════════════════════════
:: 步骤 4：部署后端 API
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 自动部署后端 API 到 Vercel
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 克隆项目代码...
if exist SeatWise (
    echo   ▸ 项目目录已存在，跳过克隆
    cd SeatWise
    git pull origin main >nul 2>nul
) else (
    git clone https://github.com/Meet7th/SeatWise.git >nul 2>nul
    cd SeatWise
)
echo   ✓ 项目代码已准备

echo   ⟳ 安装依赖...
call pnpm install --silent
echo   ✓ 依赖安装完成

echo   ⟳ 生成 JWT 密钥...
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%a
for /f "tokens=*" %%a in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_REFRESH_SECRET=%%a
echo   ✓ JWT 密钥已生成

echo   ⟳ 准备数据库 Schema...
copy /y apps\server\prisma\schema.postgres.prisma apps\server\prisma\schema.prisma >nul
(
echo DATABASE_URL=!DATABASE_URL!
echo JWT_SECRET=!JWT_SECRET!
echo JWT_REFRESH_SECRET=!JWT_REFRESH_SECRET!
echo PORT=3000
echo FRONTEND_URL=http://localhost:5173
) > apps\server\.env
echo   ✓ 环境配置已生成

echo   ⟳ 部署后端到 Vercel...
echo   正在通过 Vercel API 创建项目并部署...

:: 创建 Vercel 项目
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"name\": \"seatwise-api\", \"gitRepository\": {\"type\": \"github\", \"repo\": \"Meet7th/SeatWise\"}}" ^
    "https://api.vercel.com/v10/projects" > %TEMP%\vercel_backend.json

for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_backend.json','utf8'));console.log(d.id||'')"') do set BACKEND_PROJECT_ID=%%a

if "!BACKEND_PROJECT_ID!"=="" (
    echo   ! 项目可能已存在，尝试获取...
    curl -s -H "Authorization: Bearer !VERCEL_TOKEN!" "https://api.vercel.com/v9/projects" > %TEMP%\vercel_projects.json
    for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_projects.json','utf8'));const p=d.projects?.find(p=>p.name==='seatwise-api');console.log(p?.id||'')"') do set BACKEND_PROJECT_ID=%%a
)

if "!BACKEND_PROJECT_ID!"=="" (
    echo   ✗ 无法创建或找到 Vercel 后端项目
    pause
    exit /b 1
)
echo   ✓ Vercel 后端项目已创建

echo   ⟳ 配置后端环境变量...
for %%e in (DATABASE_URL JWT_SECRET JWT_REFRESH_SECRET) do (
    if "%%e"=="DATABASE_URL" set val=!DATABASE_URL!
    if "%%e"=="JWT_SECRET" set val=!JWT_SECRET!
    if "%%e"=="JWT_REFRESH_SECRET" set val=!JWT_REFRESH_SECRET!
    curl -s -X POST ^
        -H "Authorization: Bearer !VERCEL_TOKEN!" ^
        -H "Content-Type: application/json" ^
        -d "{\"key\": \"%%e\", \"value\": \"!val!\", \"type\": \"encrypted\", \"target\": [\"production\"]}" ^
        "https://api.vercel.com/v10/projects/!BACKEND_PROJECT_ID!/env" >nul
)
echo   ✓ 环境变量已配置

echo   ⟳ 触发后端部署...
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"name\": \"seatwise-api\", \"gitSource\": {\"type\": \"github\", \"ref\": \"main\"}, \"projectSettings\": {\"rootDirectory\": \"apps/server\"}}" ^
    "https://api.vercel.com/v13/deployments" > %TEMP%\vercel_deploy.json

for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_deploy.json','utf8'));console.log(d.url?'https://'+d.url:'')"') do set BACKEND_URL=%%a

if "!BACKEND_URL!"=="" set BACKEND_URL=https://seatwise-api.vercel.app
echo   ✓ 后端已部署: !BACKEND_URL!

:: ══════════════════════════════════════════════════════
:: 步骤 5：部署前端
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 自动部署前端到 Vercel
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 创建前端 Vercel 项目...
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"name\": \"seatwise\", \"framework\": \"vite\", \"gitRepository\": {\"type\": \"github\", \"repo\": \"Meet7th/SeatWise\"}}" ^
    "https://api.vercel.com/v10/projects" > %TEMP%\vercel_frontend.json

for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_frontend.json','utf8'));console.log(d.id||'')"') do set FRONTEND_PROJECT_ID=%%a

if "!FRONTEND_PROJECT_ID!"=="" (
    echo   ! 项目可能已存在，尝试获取...
    curl -s -H "Authorization: Bearer !VERCEL_TOKEN!" "https://api.vercel.com/v9/projects" > %TEMP%\vercel_projects2.json
    for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_projects2.json','utf8'));const p=d.projects?.find(p=>p.name==='seatwise');console.log(p?.id||'')"') do set FRONTEND_PROJECT_ID=%%a
)

if "!FRONTEND_PROJECT_ID!"=="" (
    echo   ✗ 无法创建或找到 Vercel 前端项目
    pause
    exit /b 1
)
echo   ✓ Vercel 前端项目已创建

echo   ⟳ 配置前端环境变量...
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"key\": \"VITE_API_BASE_URL\", \"value\": \"!BACKEND_URL!/api\", \"type\": \"encrypted\", \"target\": [\"production\"]}" ^
    "https://api.vercel.com/v10/projects/!FRONTEND_PROJECT_ID!/env" >nul
echo   ✓ VITE_API_BASE_URL 已配置

echo   ⟳ 触发前端部署...
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"name\": \"seatwise\", \"gitSource\": {\"type\": \"github\", \"ref\": \"main\"}, \"projectSettings\": {\"rootDirectory\": \"apps/web\"}}" ^
    "https://api.vercel.com/v13/deployments" > %TEMP%\vercel_deploy2.json

for /f "tokens=*" %%a in ('node -e "const d=JSON.parse(require('fs').readFileSync('%TEMP%\vercel_deploy2.json','utf8'));console.log(d.url?'https://'+d.url:'')"') do set FRONTEND_URL=%%a

if "!FRONTEND_URL!"=="" set FRONTEND_URL=https://seatwise.vercel.app
echo   ✓ 前端已部署: !FRONTEND_URL!

:: ══════════════════════════════════════════════════════
:: 步骤 6：初始化数据库并关联服务
:: ══════════════════════════════════════════════════════
set /a step_num+=1
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   [%step_num%/%total_steps%] 初始化数据库并关联服务
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

echo   ⟳ 更新后端 FRONTEND_URL...
curl -s -X POST ^
    -H "Authorization: Bearer !VERCEL_TOKEN!" ^
    -H "Content-Type: application/json" ^
    -d "{\"key\": \"FRONTEND_URL\", \"value\": \"!FRONTEND_URL!\", \"type\": \"encrypted\", \"target\": [\"production\"]}" ^
    "https://api.vercel.com/v10/projects/!BACKEND_PROJECT_ID!/env" >nul
echo   ✓ FRONTEND_URL 已更新

echo   ⟳ 初始化数据库...
cd apps\server
call npx prisma generate --silent >nul 2>nul
call npx prisma db push --accept-data-loss >nul 2>nul
echo   ✓ 数据库表已创建

echo   ⟳ 灌入测试数据...
call npx prisma db seed >nul 2>nul
echo   ✓ 测试数据已灌入

cd ..\..

:: ══════════════════════════════════════════════════════
:: 完成
:: ══════════════════════════════════════════════════════
echo.
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   🎉  全部部署完成！                                         ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo   访问地址：
echo     前端: !FRONTEND_URL!
echo     后端: !BACKEND_URL!
echo.
echo   测试账号：
echo     教师: teacher@seatwise.com / Teacher123
echo     学生: 学号 2026001 / Student123
echo     班级邀请码: TEST01
echo.
echo   下一步操作：
echo     1. 打开前端地址 !FRONTEND_URL!
echo     2. 用教师账号登录
echo     3. 创建班级，配置教室布局
echo     4. 用学生账号注册，完成性格测评
echo     5. 回到教师端，点击「AI 智能排座」
echo.

pause
