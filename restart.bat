@echo off
setlocal

call "%~dp0stop.bat"
timeout /t 2 /nobreak >nul
call "%~dp0start.bat"

echo.
echo Restart command finished. The app console is open in its own window.
pause
