@echo off
title Campus Canteen - Backend Server (Spring Boot 3)
echo =========================================================
echo   Starting College Canteen Backend Server (Port 8080)...
echo =========================================================
cd /d "%~dp0\backend"
..\maven\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
pause
