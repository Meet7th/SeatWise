#!/usr/bin/env node

/**
 * 智座 SeatWise - 一键启动脚本
 * 仅需 Node.js，自动安装依赖、初始化 SQLite 数据库、启动服务
 */

import { execSync, spawn } from 'child_process';
import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SERVER_DIR = join(ROOT, 'apps', 'server');

function log(msg) {
  console.log(`  ${msg}`);
}

function logBox(lines) {
  const maxLen = Math.max(...lines.map(l => l.length));
  const top = `  ┌${'─'.repeat(maxLen + 2)}┐`;
  const bot = `  └${'─'.repeat(maxLen + 2)}┘`;
  console.log(top);
  lines.forEach(l => console.log(`  │ ${l.padEnd(maxLen)} │`));
  console.log(bot);
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

// ── 主流程 ──

console.log(`
  ╔══════════════════════════════════════╗
  ║     智座 SeatWise - AI 智能排座系统    ║
  ║          一键启动 (SQLite 版)          ║
  ╚══════════════════════════════════════╝
`);

// 1. 检查 Node.js
const nodeVer = runSilent('node -v');
if (!nodeVer) {
  console.error('  [错误] 未检测到 Node.js，请先安装：https://nodejs.org/');
  process.exit(1);
}
log(`[√] Node.js 版本: ${nodeVer}`);

// 2. 检查/安装 pnpm
const hasPnpm = !!runSilent('pnpm --version');
if (!hasPnpm) {
  log('[!] 未检测到 pnpm，正在自动安装...');
  run('npm install -g pnpm');
  log('[√] pnpm 安装完成');
} else {
  log('[√] pnpm 已安装');
}

// 3. 安装依赖
console.log('\n  [1/4] 正在安装依赖...');
run('pnpm install');
log('[√] 依赖安装完成');

// 4. 初始化数据库（SQLite）
console.log('\n  [2/4] 正在初始化数据库...');

const schemaSrc = join(SERVER_DIR, 'prisma', 'schema.sqlite.prisma');
const schemaDst = join(SERVER_DIR, 'prisma', 'schema.prisma');
const envLocalSrc = join(ROOT, '.env.local');
const envDst = join(SERVER_DIR, '.env');

if (!existsSync(schemaSrc)) {
  console.error('  [错误] 未找到 SQLite Schema 文件');
  process.exit(1);
}

// 复制 SQLite schema 和环境配置
copyFileSync(schemaSrc, schemaDst);
if (existsSync(envLocalSrc)) {
  copyFileSync(envLocalSrc, envDst);
}

// 生成 Prisma Client
run('npx prisma generate', { cwd: SERVER_DIR });

// 创建数据库表
run('npx prisma db push --accept-data-loss', { cwd: SERVER_DIR });
log('[√] 数据库初始化完成');

// 5. 灌入测试数据
console.log('\n  [3/4] 正在灌入测试数据...');
try {
  run('npx prisma db seed', { cwd: SERVER_DIR });
  log('[√] 测试数据灌入完成');
} catch {
  log('[!] 种子数据灌入失败（不影响使用）');
}

// 6. 启动服务
console.log('\n  [4/4] 正在启动服务...\n');
logBox([
  '前端地址: http://localhost:5173',
  '后端地址: http://localhost:3000',
  '',
  '测试账号:',
  '教师: teacher@seatwise.com / Teacher123',
  '学生: 2026001 (学号) / Student123',
  '班级邀请码: TEST01',
]);
console.log('\n  按 Ctrl+C 可停止服务\n');

// 同时启动前端和后端
const child = spawn('pnpm', ['dev:all'], {
  stdio: 'inherit',
  cwd: ROOT,
  shell: true,
});

child.on('SIGINT', () => {
  child.kill('SIGINT');
  process.exit(0);
});
