@echo off
REM Quick Start Script for Employee Management System
REM This script will install all dependencies and start all servers

echo.
echo ========================================
echo Employee Management System - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed. Please install Node.js v14+
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed. Please install Node.js
    pause
    exit /b 1
)

echo.
echo Step 1: Installing Node.js Backend Dependencies...
echo =========================================
cd backend-node
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install Node.js dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Installing React Frontend Dependencies...
echo =========================================
cd frontend-react
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install React dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo 1. Make sure MySQL is running with database created
echo 2. Run: start_servers.bat (to start all servers)
echo 3. Or run individually:
echo    - Backend: cd backend-node && npm start
echo    - Frontend: cd frontend-react && npm start
echo    - Java Backend: cd backend-java && mvn spring-boot:run
echo.
echo.

pause
