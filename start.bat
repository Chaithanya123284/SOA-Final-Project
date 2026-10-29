@echo off
title CareerLink Networks - Microservices Launcher
color 0B

echo ===============================================================================
echo        CAREERLINK NETWORKS - ENTERPRISE TALENT ACQUISITION PLATFORM
echo                     Microservices Suite Startup Script
echo ===============================================================================
echo.

set "ROOT=%~dp0"

:: Check for Java
where java >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Java is not detected in your system PATH!
    echo Please install JDK 17 or JDK 21 and configure JAVA_HOME.
    pause
    exit /b 1
)

:: Check for Maven
where mvn >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Maven is not detected in your system PATH!
    echo Please add Maven to your system PATH environment variable.
    pause
    exit /b 1
)

echo [PRE-BUILD] Verifying parent POM ^& dependencies in Maven repository...
cd /d "%ROOT%backend"
call mvn clean install -DskipTests
if %errorlevel% neq 0 (
    echo [ERROR] Maven build failed! Check errors above.
    pause
    exit /b 1
)

echo.
echo [1/7] Starting Eureka Service Discovery Server (Port 8761)...
start "CareerLink - Eureka Discovery Server (Port 8761)" /d "%ROOT%backend\eureka-server" cmd /k "title Eureka Server (8761) && echo Starting Eureka Server on port 8761... && mvn spring-boot:run"

echo Waiting 12 seconds for Eureka Server to initialize...
timeout /t 12 /nobreak >nul

echo [2/7] Starting Authentication Service (Port 8081)...
start "CareerLink - Auth Service (Port 8081)" /d "%ROOT%backend\auth-service" cmd /k "title Auth Service (8081) && echo Starting Auth Service on port 8081... && mvn spring-boot:run"

echo [3/7] Starting Profile Service (Port 8082)...
start "CareerLink - Profile Service (Port 8082)" /d "%ROOT%backend\profile-service" cmd /k "title Profile Service (8082) && echo Starting Profile Service on port 8082... && mvn spring-boot:run"

echo [4/7] Starting Job Catalog Service (Port 8083)...
start "CareerLink - Job Service (Port 8083)" /d "%ROOT%backend\job-service" cmd /k "title Job Service (8083) && echo Starting Job Service on port 8083... && mvn spring-boot:run"

echo [5/7] Starting Application Tracking Service (Port 8084)...
start "CareerLink - Application Service (Port 8084)" /d "%ROOT%backend\application-service" cmd /k "title Application Service (8084) && echo Starting Application Service on port 8084... && mvn spring-boot:run"

echo Waiting 10 seconds for backend microservices to register with Eureka...
timeout /t 10 /nobreak >nul

echo [6/7] Starting API Gateway ^& Load Balancer (Port 8080)...
start "CareerLink - API Gateway (Port 8080)" /d "%ROOT%backend\api-gateway" cmd /k "title API Gateway (8080) && echo Starting Spring Cloud Gateway on port 8080... && mvn spring-boot:run"

echo Waiting 6 seconds for API Gateway to boot...
timeout /t 6 /nobreak >nul

echo [7/7] Launching CareerLink Web Portal in default browser...
start "" "%ROOT%frontend\index.html"

echo.
echo ===============================================================================
echo [SUCCESS] All CareerLink Microservices have been launched in separate windows!
echo.
echo  * Web Portal:       Opened in browser (frontend/index.html)
echo  * Eureka Dashboard: http://localhost:8761
echo  * API Gateway:      http://localhost:8080
echo  * Auth Service:     http://localhost:8081/swagger-ui.html
echo  * Profile Service:  http://localhost:8082/swagger-ui.html
echo  * Job Service:      http://localhost:8083/swagger-ui.html
echo  * Application Svc:  http://localhost:8084/swagger-ui.html
echo.
echo To gracefully stop all services, run: stop.bat
echo ===============================================================================
pause
