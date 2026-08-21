#!/usr/bin/env node

/**
 * 智座 SeatWise - 云端一键部署脚本
 * 自动化 Vercel + Supabase 部署流程
 */

import { execSync, spawn } from 'child_process';
import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SERVER_DIR = join(ROOT, 'apps', 'server');
const WEB_DIR = join(ROOT, 'apps', 'web');

// ── 工具函数 ──

function log(msg) {
  console.log(`  ${msg}`);
}

function logSuccess(msg) {
  console.log(`  [√] ${msg}`);
}

function logError(msg) {
  console.error(`  [✗] ${msg}`);
}

function logStep(step, msg) {
  console.log(`\n  [步骤 ${step}] ${msg}`);
}

function logBox(lines) {
  const maxLen = Math.max(...lines.map(l => l.length));
  const top = `  ╔${'═'.repeat(maxLen + 2)}╗`;
  const bot = `  ╚${'═'.repeat(maxLen + 2)}╝`;
  console.log(top);
  lines.forEach(l => console.log(`  ║ ${l.padEnd(maxLen)} ║`));
  console.log(bot);
}

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
    return true;
  } catch (e) {
    return false;
  }
}

function runSilent(cmd, opts = {}) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8', ...opts }).trim();
  } catch {
    return null;
  }
}

function ask(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`  ${question}`, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHidden(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    // 简单实现，不隐藏输入（跨平台兼容性问题）
    rl.question(`  ${question}`, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

// ── 主流程 ──

console.log(`
  ╔══════════════════════════════════════╗
  ║   智座 SeatWise - 云端一键部署        ║
  ║   Vercel + Supabase                  ║
  ╚══════════════════════════════════════╝
`);

// ── 步骤 0：检查环境 ──

// 检查 Vercel CLI
let hasVercel = !!runSilent('vercel --version');
if (!hasVercel) {
  log('[!] 未检测到 Vercel CLI，正在自动安装...');
  if (run('npm install -g vercel')) {
    hasVercel = true;
    logSuccess('Vercel CLI 安装完成');
  } else {
    logError('Vercel CLI 安装失败，请手动运行: npm install -g vercel');
    process.exit(1);
  }
} else {
  logSuccess('Vercel CLI 已安装');
}

// 检查 Vercel 登录状态
const vercelUser = runSilent('vercel whoami 2>&1');
if (!vercelUser || vercelUser.includes('Error') || vercelUser.includes('Not')) {
  log('[!] 未登录 Vercel，请在浏览器中完成登录...');
  run('vercel login');
  const newUser = runSilent('vercel whoami 2>&1');
  if (!newUser || newUser.includes('Error')) {
    logError('Vercel 登录失败');
    process.exit(1);
  }
  logSuccess(`已登录 Vercel（${newUser}）`);
} else {
  logSuccess(`已登录 Vercel（${vercelUser}）`);
}

// ── 步骤 1：获取 Supabase 数据库 ──

logStep(1, '配置 Supabase 数据库');
console.log('');
log('请在浏览器中完成以下操作：');
log('  1. 打开 https://supabase.com/new');
log('  2. 点击 "New Project" 创建项目');
log('  3. 设置项目名称和数据库密码（请记住密码）');
log('  4. 选择区域（建议 Asia Pacific / Southeast Asia）');
log('  5. 等待项目创建完成（约 1-2 分钟）');
log('  6. 进入 Settings > Database');
log('  7. 找到 Connection string，选择 "Transaction" 模式');
log('  8. 复制连接字符串（格式：postgresql://postgres.xxxxx:...）');
console.log('');

const databaseUrl = await ask('请粘贴 Supabase 连接字符串: ');

if (!databaseUrl || !databaseUrl.startsWith('postgresql://')) {
  logError('连接字符串格式不正确，应以 postgresql:// 开头');
  process.exit(1);
}

logSuccess('数据库连接字符串已获取');

// ── 步骤 2：生成安全密钥 ──

const jwtSecret = crypto.randomBytes(32).toString('hex');
const jwtRefreshSecret = crypto.randomBytes(32).toString('hex');
logSuccess('JWT 密钥已生成');

// ── 步骤 3：准备数据库 Schema ──

logStep(2, '准备 PostgreSQL 数据库 Schema');

const schemaSrc = join(SERVER_DIR, 'prisma', 'schema.postgres.prisma');
const schemaDst = join(SERVER_DIR, 'prisma', 'schema.prisma');

if (!existsSync(schemaSrc)) {
  logError('未找到 PostgreSQL Schema 文件');
  process.exit(1);
}

copyFileSync(schemaSrc, schemaDst);
logSuccess('PostgreSQL Schema 已准备');

// 创建后端 .env 文件用于数据库初始化
const serverEnv = join(SERVER_DIR, '.env');
const envContent = `DATABASE_URL=${databaseUrl}
JWT_SECRET=${jwtSecret}
JWT_REFRESH_SECRET=${jwtRefreshSecret}
PORT=3000
FRONTEND_URL=http://localhost:5173
`;
writeFileSync(serverEnv, envContent);
logSuccess('后端环境配置已生成');

// ── 步骤 4：初始化数据库 ──

logStep(3, '初始化数据库');

// 安装依赖
log('正在安装依赖...');
run('pnpm install', { stdio: 'pipe' });

// 生成 Prisma Client
log('正在生成 Prisma Client...');
if (!run('npx prisma generate', { cwd: SERVER_DIR })) {
  logError('Prisma Client 生成失败');
  process.exit(1);
}
logSuccess('Prisma Client 已生成');

// 创建数据库表
log('正在创建数据库表...');
if (!run('npx prisma db push --accept-data-loss', { cwd: SERVER_DIR })) {
  logError('数据库表创建失败');
  process.exit(1);
}
logSuccess('数据库表已创建');

// 灌入测试数据
log('正在灌入测试数据...');
if (run('npx prisma db seed', { cwd: SERVER_DIR })) {
  logSuccess('测试数据已灌入');
} else {
  log('[!] 种子数据灌入失败（不影响使用）');
}

// ── 步骤 5：部署后端到 Vercel ──

logStep(4, '部署后端 API 到 Vercel');

// 询问项目名称
const projectName = await ask('请输入项目名称（用于生成域名，如 seatwise，直接回车使用默认）: ');
const backendName = projectName ? `${projectName}-api` : 'seatwise-api';

process.chdir(SERVER_DIR);

// 部署后端
log('正在部署后端...');

// 设置环境变量
const vercelEnvCmd = (name, value) => {
  try {
    execSync(`vercel env add ${name} production`, {
      input: value,
      cwd: SERVER_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return true;
  } catch {
    return false;
  }
};

// 先尝试链接项目
log('正在链接 Vercel 项目...');
run(`vercel link --yes --project ${backendName}`, { cwd: SERVER_DIR });

// 设置环境变量
log('正在配置环境变量...');
const envVars = {
  'DATABASE_URL': databaseUrl,
  'JWT_SECRET': jwtSecret,
  'JWT_REFRESH_SECRET': jwtRefreshSecret,
  'FRONTEND_URL': 'https://placeholder.vercel.app'  // 稍后更新
};

for (const [name, value] of Object.entries(envVars)) {
  // 使用 Vercel CLI 添加环境变量
  try {
    execSync(`echo "${value}" | vercel env add ${name} production --yes`, {
      cwd: SERVER_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    logSuccess(`环境变量 ${name} 已配置`);
  } catch {
    log(`[!] 环境变量 ${name} 配置可能已存在，跳过`);
  }
}

// 部署
log('正在部署后端（这可能需要 1-2 分钟）...');
const backendDeploy = runSilent(`vercel --prod --yes`, { cwd: SERVER_DIR });

if (backendDeploy) {
  // 从输出中提取 URL
  const backendUrl = backendDeploy.match(/https:\/\/[^\s]+\.vercel\.app/)?.[0] ||
                     `https://${backendName}.vercel.app`;
  logSuccess(`后端已部署: ${backendUrl}`);

  // ── 步骤 6：部署前端到 Vercel ──

  logStep(5, '部署前端到 Vercel');

  process.chdir(WEB_DIR);

  const frontendName = projectName ? projectName : 'seatwise';

  // 链接项目
  run(`vercel link --yes --project ${frontendName}`, { cwd: WEB_DIR });

  // 设置前端环境变量
  try {
    execSync(`echo "${backendUrl}/api" | vercel env add VITE_API_BASE_URL production --yes`, {
      cwd: WEB_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    logSuccess('前端环境变量已配置');
  } catch {
    log('[!] 前端环境变量配置可能已存在，跳过');
  }

  // 部署前端
  log('正在部署前端（这可能需要 1-2 分钟）...');
  const frontendDeploy = runSilent(`vercel --prod --yes`, { cwd: WEB_DIR });

  const frontendUrl = frontendDeploy?.match(/https:\/\/[^\s]+\.vercel\.app/)?.[0] ||
                      `https://${frontendName}.vercel.app`;

  logSuccess(`前端已部署: ${frontendUrl}`);

  // ── 步骤 7：更新后端的 FRONTEND_URL ──

  logStep(6, '更新后端前端地址配置');

  process.chdir(SERVER_DIR);

  // 删除旧的 FRONTEND_URL 环境变量
  try {
    execSync('vercel env rm FRONTEND_URL production --yes', {
      cwd: SERVER_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });
  } catch {}

  // 添加新的 FRONTEND_URL
  try {
    execSync(`echo "${frontendUrl}" | vercel env add FRONTEND_URL production --yes`, {
      cwd: SERVER_DIR,
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    logSuccess('后端 FRONTEND_URL 已更新');
  } catch {
    log('[!] FRONTEND_URL 更新失败，请手动在 Vercel 控制台更新');
  }

  // 重新部署后端以应用新的 FRONTEND_URL
  log('正在重新部署后端...');
  runSilent('vercel --prod --yes', { cwd: SERVER_DIR });
  logSuccess('后端已重新部署');

  // ── 完成 ──

  process.chdir(ROOT);

  console.log('');
  logBox([
    '🎉 部署完成！',
    '',
    `前端地址: ${frontendUrl}`,
    `后端地址: ${backendUrl}`,
    '',
    '测试账号:',
    '教师: teacher@seatwise.com / Teacher123',
    '学生: 2026001 (学号) / Student123',
    '班级邀请码: TEST01',
  ]);

  console.log('');
  log('提示：');
  log('  - 首次访问可能需要等待 30 秒左右（Serverless 冷启动）');
  log('  - 如需自定义域名，请在 Vercel 控制台设置');
  log('  - 如需 CDN 加速，可在 Cloudflare 添加域名');
  console.log('');

} else {
  logError('后端部署失败');
  process.exit(1);
}
