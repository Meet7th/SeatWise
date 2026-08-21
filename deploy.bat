@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║           智座 SeatWise - 一键部署脚本                  ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: Check Docker
echo [1/4] 检查 Docker 是否安装...
docker --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ 未检测到 Docker！
    echo.
    echo 请先安装 Docker Desktop：
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo 安装完成后，请重启电脑，然后重新运行此脚本。
    pause
    exit /b 1
)
echo ✅ Docker 已安装

:: Check Docker is running
echo.
echo [2/4] 检查 Docker 是否运行...
docker info >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ Docker 未运行！
    echo.
    echo 请先启动 Docker Desktop，等待状态变为 "Running"。
    echo 启动后，请重新运行此脚本。
    pause
    exit /b 1
)
echo ✅ Docker 正在运行

:: Copy env file
echo.
echo [3/4] 配置环境变量...
if not exist .env (
    copy .env.example .env >nul
    echo ✅ 已创建 .env 配置文件
) else (
    echo ✅ .env 文件已存在，跳过
)

:: Start services
echo.
echo [4/4] 启动服务（首次启动约需 3-5 分钟）...
echo.
docker-compose up -d --build

if errorlevel 1 (
    echo.
    echo ❌ 启动失败！请检查错误信息。
    pause
    exit /b 1
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                  🎉 部署成功！                          ║
echo ╠═══════════════════════════════════════════════════════════╣
echo ║                                                           ║
echo ║  前端访问：http://localhost:5173                         ║
echo ║  后端 API：http://localhost:3000                         ║
echo ║                                                           ║
echo ║  测试账号：                                              ║
echo ║  - 教师：teacher@seatwise.com / Teacher123               ║
echo ║  - 学生：学号 2026001 / Student123                       ║
echo ║  - 邀请码：TEST01                                        ║
echo ║                                                           ║
echo ║  停止服务：docker-compose down                           ║
echo ║  查看日志：docker-compose logs -f                        ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
pause