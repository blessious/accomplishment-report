@echo off
setlocal

if /i "%~1" neq "__run" (
    start "Boac Accomplishment Hub" cmd /k ""%~f0" __run"
    exit /b
)

cd /d "%~dp0"
echo Starting Boac Accomplishment Hub on port 4199...
npm run start

if errorlevel 1 (
    echo.
    echo The application stopped with an error.
)

echo.
echo The application has stopped. This window will stay open so you can review any messages.
pause
