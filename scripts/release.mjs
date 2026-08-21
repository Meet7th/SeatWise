#!/usr/bin/env node

/**
 * 智座 SeatWise - 版本发布脚本
 * 自动更新版本号、创建 Git Tag、推送到 GitHub
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

function log(msg) {
  console.log(`  ${msg}`);
}

function run(cmd) {
  try {
    return execSync(cmd, { cwd: ROOT, encoding: 'utf-8' }).trim();
  } catch (e) {
    console.error(`  [错误] ${e.message}`);
    process.exit(1);
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
  ║   智座 SeatWise - 版本发布           ║
  ╚══════════════════════════════════════╝
`);

// 读取当前版本
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
const currentVersion = pkg.version;

log(`当前版本: v${currentVersion}`);
console.log('');

// 选择版本类型
log('选择版本类型:');
log('  1. patch  (修复 Bug，如 1.0.0 → 1.0.1)');
log('  2. minor  (新功能，如 1.0.0 → 1.1.0)');
log('  3. major  (重大更新，如 1.0.0 → 2.0.0)');
log('  4. 自定义版本号');
console.log('');

const choice = await ask('请选择 (1-4): ');

let newVersion;

switch (choice) {
  case '1':
    newVersion = run('npm version patch --no-git-tag-version').replace('v', '');
    break;
  case '2':
    newVersion = run('npm version minor --no-git-tag-version').replace('v', '');
    break;
  case '3':
    newVersion = run('npm version major --no-git-tag-version').replace('v', '');
    break;
  case '4':
    newVersion = await ask('请输入版本号 (如 1.2.0): ');
    if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
      log('[错误] 版本号格式不正确，应为 x.y.z');
      process.exit(1);
    }
    pkg.version = newVersion;
    writeFileSync(join(ROOT, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
    break;
  default:
    log('[错误] 无效选择');
    process.exit(1);
}

log(`版本号已更新: v${currentVersion} → v${newVersion}`);

// 检查 CHANGELOG 是否有对应版本
const changelog = readFileSync(join(ROOT, 'CHANGELOG.md'), 'utf-8');
if (!changelog.includes(`## [${newVersion}]`)) {
  console.log('');
  log(`[!] CHANGELOG.md 中未找到 v${newVersion} 的更新日志`);
  log('请先在 CHANGELOG.md 中添加该版本的更新内容');
  const proceed = await ask('是否继续发布？(y/N): ');
  if (proceed.toLowerCase() !== 'y') {
    // 回退版本号
    pkg.version = currentVersion;
    writeFileSync(join(ROOT, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
    log('已取消发布');
    process.exit(0);
  }
}

// 同步版本号到子项目
const serverPkg = JSON.parse(readFileSync(join(ROOT, 'apps/server/package.json'), 'utf-8'));
serverPkg.version = newVersion;
writeFileSync(join(ROOT, 'apps/server/package.json'), JSON.stringify(serverPkg, null, 2) + '\n');

const webPkg = JSON.parse(readFileSync(join(ROOT, 'apps/web/package.json'), 'utf-8'));
webPkg.version = newVersion;
writeFileSync(join(ROOT, 'apps/web/package.json'), JSON.stringify(webPkg, null, 2) + '\n');

log('子项目版本号已同步');

// 创建 Git 提交和 Tag
console.log('');
log('正在创建 Git Tag...');

run('git add -A');
run(`git commit -m "release: v${newVersion}"`);
run(`git tag -a v${newVersion} -m "Release v${newVersion}"`);

log(`Git Tag v${newVersion} 已创建`);

// 推送到 GitHub
console.log('');
const push = await ask('是否推送到 GitHub？(Y/n): ');

if (push.toLowerCase() !== 'n') {
  log('正在推送到 GitHub...');
  run('git push origin main');
  run(`git push origin v${newVersion}`);
  log('推送完成！');
  console.log('');
  log('GitHub Actions 将自动:');
  log('  1. 构建前端和后端');
  log('  2. 创建 GitHub Release');
  log('  3. 构建并发布 Docker 镜像');
  console.log('');
  log(`查看 Release: https://github.com/Meet7th/SeatWise/releases/tag/v${newVersion}`);
} else {
  log('跳过推送，稍后可手动执行:');
  log(`  git push origin main && git push origin v${newVersion}`);
}

console.log('');
log(`🎉 v${newVersion} 发布完成！`);
