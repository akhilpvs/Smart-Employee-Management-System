@echo off
REM Start All Servers Script
REM This script starts Node.js backend, React frontend, and optionally Java backend

echo.
echo ========================================
echo Employee Management System - Start Servers
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed
    pause
    exit /b 1
)

echo Starting Node.js Backend on Port 5000...
start cmd /k "cd backend-node && npm start"

timeout /t 3 >nul

echo Starting React Frontend on Port 3000...
start cmd /k "cd frontend-react && npm start"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:5000/api
echo.
echo Demo Credentials:
echo - Admin: admin@company.com / admin123
echo - Employee: john.doe@company.com / emp123
echo.
echo To start Java Spring Boot backend (optional):
echo cd backend-java && mvn spring-boot:run
echo Java Backend: http://localhost:8080/api
echo.

pause
