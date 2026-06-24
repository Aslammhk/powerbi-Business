@echo off
title Money Tree Network - Setup
color 0A
echo.
echo  ==========================================
echo   Money Tree Network - Windows Setup
echo  ==========================================
echo.

REM Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker not installed!
    echo Download from: https://docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)
echo [OK] Docker found

REM Check Git
git --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Git not installed!
    echo Download from: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)
echo [OK] Git found

echo.
echo Setting up environment...
if not exist .env (
    copy .env.example .env
    echo [OK] .env file created
    echo.
    echo Opening .env for editing...
    echo Please fill in your settings then save and close Notepad
    echo.
    pause
    notepad .env
) else (
    echo [OK] .env already exists
)

echo.
echo Building Docker images (5-10 minutes first time)...
docker-compose build

echo.
echo Starting all services...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak >nul

echo.
echo  ==========================================
echo   Setup Complete!
echo  ==========================================
echo.
echo   Web App:    http://localhost:3000
echo   API Docs:   http://localhost:8000/docs
echo   Admin:      http://localhost:3000/admin
echo.
echo   Opening browser...
start http://localhost:3000
echo.
pause
