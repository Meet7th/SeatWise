#!/usr/bin/env node

/**
 * 智座 SeatWise - Vercel + Supabase 部署脚本
 * 自动化云端部署流程
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function log(msg) {
  console.log(`  ${msg}`);
}

function run(cmd, opts = {}) {
  try {
    execSync(cmd, { stdio: 'inherit', cwd: ROOT, ...opts });
  } catch (e) {
    console.error(`\n  [错误] 命令执行失败: ${cmd}`);
    process.exit(1);
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

console.log(`
  ╔══════════════════════════════════════╗
  ║   智座 SeatWise - 云端部署向导        ║
  ║   Vercel + Supabase                  ║
  ╚══════════════════════════════════════╝
`);

// 1. 检查 Vercel CLI
const hasVercel = !!runSilent('vercel --version');
if (!hasVercel) {
  log('[!] 未检测到 Vercel CLI，正在安装...');
  run('npm install -g vercel');
  log('[√] Vercel CLI 安装完成');
} else {
  log('[√] Vercel CLI 已安装');
}

// 2. 登录 Vercel
log('\n[步骤 1] 登录 Vercel...');
run('vercel login');

// 3. 配置 Supabase 数据库
console.log('\n[步骤 2] 配置 Supabase 数据库\n');
log('请在 Supabase 控制台创建项目：https://supabase.com');
log('创建后，在 Settings > Database 获取连接字符串');
log('格式：postgresql://postgres.[项目ID]:[密码]@aws-0-[区域].pooler.supabase.com:6532/postgres\n');

const databaseUrl = await ask('请输入 Supabase 数据库连接字符串 (DATABASE_URL): ');
if (!databaseUrl) {
  log('[错误] 数据库连接字符串不能为空');
  process.exit(1);
}

// 4. 生成 JWT 密钥
const jwtSecret = runSilent('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
const jwtRefreshSecret = runSilent('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');

// 5. 部署后端
console.log('\n[步骤 3] 部署后端 API...\n');

process.chdir(join(ROOT, 'apps', 'server'));

// 复制 PostgreSQL schema
const schemaSrc = 'prisma/schema.postgres.prisma';
const schemaDst = 'prisma/schema.prisma';
if (existsSync(schemaSrc)) {
  const { copyFileSync } = await import('fs');
  copyFileSync(schemaSrc, schemaDst);
  log('[√] PostgreSQL Schema 已准备');
}

// 设置 Vercel 环境变量
log('正在配置 Vercel 环境变量...');
run(`vercel env add DATABASE_URL production <<< "${databaseUrl}"`);
run(`vercel env add JWT_SECRET production <<< "${jwtSecret}"`);
run(`vercel env add JWT_REFRESH_SECRET production <<< "${jwtRefreshSecret}"`);

// 部署
log('正在部署后端...');
run('vercel --prod');

const backendUrl = runSilent('vercel ls --json | node -e "const d=JSON.parse(require(\'fs\').readFileSync(\'/dev/stdin\',\'utf-8\'));console.log(d[0]?.url || \'unknown\')"');
log(`[√] 后端已部署: https://${backendUrl}`);

// 6. 部署前端
console.log('\n[步骤 4] 部署前端...\n');

process.chdir(join(ROOT, 'apps', 'web'));

// 设置前端环境变量
const apiUrl = `https://${backendUrl}/api`;
run(`vercel env add VITE_API_BASE_URL production <<< "${apiUrl}"`);

// 部署
log('正在部署前端...');
run('vercel --prod');

const frontendUrl = runSilent('vercel ls --json | node -e "const d=JSON.parse(require(\'fs\').readFileSync(\'/dev/stdin\',\'utf-8\'));console.log(d[0]?.url || \'unknown\')"');
log(`[√] 前端已部署: https://${frontendUrl}`);

// 7. 更新后端的 FRONTEND_URL
process.chdir(join(ROOT, 'apps', 'server'));
run(`vercel env add FRONTEND_URL production <<< "https://${frontendUrl}"`);

// 8. 初始化数据库
console.log('\n[步骤 5] 初始化数据库...\n');
run('npx prisma db push --accept-data-loss');
log('[√] 数据库表已创建');

// 灌入测试数据
try {
  run('npx prisma db seed');
  log('[√] 测试数据已灌入');
} catch {
  log('[!] 种子数据灌入失败（不影响使用）');
}

// 完成
console.log(`
  ╔══════════════════════════════════════╗
  ║           部署完成！                  ║
  ╠══════════════════════════════════════╣
  ║  前端: https://${frontendUrl.padEnd(20)} ║
  ║  后端: https://${backendUrl.padEnd(20)} ║
  ║                                      ║
  ║  测试账号:                            ║
  ║  教师: teacher@seatwise.com           ║
  ║  密码: Teacher123                     ║
  ╚══════════════════════════════════════╝
`);
