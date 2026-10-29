@echo off
title CareerLink Networks - Shutdown Script
color 0C

echo ===============================================================================
echo        CAREERLINK NETWORKS - STOPPING ALL MICROSERVICES (PORTS 8761-8084)
echo ===============================================================================
echo.

setlocal enabledelayedexpansion
set PORTS=8761 8080 8081 8082 8083 8084

for %%P in (%PORTS%) do (
    echo Searching for processes on port %%P...
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%%P" ^| findstr "LISTENING"') do (
        echo [KILLING] Terminating Process PID %%a on port %%P...
        taskkill /F /PID %%a >nul 2>&1
    )
)

echo.
echo ===============================================================================
echo [SUCCESS] All CareerLink microservices have been stopped!
echo ===============================================================================
echo.
pause
