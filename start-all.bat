@echo off
title College Canteen Food Ordering System Launcher
echo ===================================================================
echo     Launching College Canteen Food Ordering System (Full Stack)
echo ===================================================================
echo 1. Launching Spring Boot Backend Server on http://localhost:8080
start "Canteen Backend" cmd /k "%~dp0start-backend.bat"

timeout /t 6 /nobreak > nul

echo 2. Launching React Vite Frontend UI on http://localhost:5173
start "Canteen Frontend" cmd /k "%~dp0start-frontend.bat"

echo.
echo ===================================================================
echo   Canteen System has launched in dedicated windows!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8080
echo   Admin:    admin@canteen.com   / admin123
echo   Student:  student@canteen.com / student123
echo ===================================================================
pause
