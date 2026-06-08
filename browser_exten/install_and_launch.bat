@echo off
setlocal enabledelayedexpansion

echo ==================================================
echo Checking Administrator Privileges...
echo ==================================================

net session >nul 2>&1
if %errorLevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Administrative privileges required.
    echo Please right-click this script and select "Run as Administrator".
    echo.
    pause
    exit /b
)

color 0A
echo [SUCCESS] Administrative privileges confirmed.
echo.
color 07

echo ==================================================
echo Setting up Workspace Environment...
echo ==================================================

:: Move into the Ui directory relative to where the script is run
cd /d "%~dp0Ui"

echo Checking for pnpm...
where pnpm >nul 2>&1
if %errorLevel% neq 0 (
    color 0E
    echo [WARNING] pnpm is not in PATH. Assuming npm is used or pnpm is aliased.
    echo Running 'npm install' instead...
    call npm install
    call npm run build
) else (
    echo Running 'pnpm install'...
    call pnpm install
    
    echo.
    echo Running 'pnpm build'...
    call pnpm build
)

:MENU
cls
echo ==================================================
echo   CHOOSE A BROWSER TO LAUNCH ETHEREAL DASHBOARD
echo ==================================================
echo   [1] Google Chrome
echo   [2] Brave Browser
echo   [3] Microsoft Edge
echo   [4] Mozilla Firefox
echo   [5] Opera
echo   [6] Opera GX
echo   [7] Exit
echo ==================================================
set /p choice="Type your choice (1-7) and press Enter: "

:: Dynamically set the extension path securely using quotation marks
set "EXTENSION_PATH=%~dp0Ui\dist"

if "%choice%"=="1" (
    echo Launching Google Chrome...
    start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" --load-extension="%EXTENSION_PATH%"
    goto END
)
if "%choice%"=="2" (
    echo Launching Brave Browser...
    start "" "C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" --load-extension="%EXTENSION_PATH%"
    goto END
)
if "%choice%"=="3" (
    echo Launching Microsoft Edge...
    start "" "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --load-extension="%EXTENSION_PATH%"
    goto END
)
if "%choice%"=="4" (
    echo Launching Mozilla Firefox...
    echo Loading unpacked extension via Mozilla web-ext runner...
    start cmd /k "npx web-ext run --source-dir="%EXTENSION_PATH%""
    goto END
)
if "%choice%"=="5" (
    echo Launching Opera...
    start "" "%LOCALAPPDATA%\Programs\Opera\launcher.exe" --load-extension="%EXTENSION_PATH%"
    goto END
)
if "%choice%"=="6" (
    echo Launching Opera GX...
    start "" "%LOCALAPPDATA%\Programs\Opera GX\launcher.exe" --load-extension="%EXTENSION_PATH%"
    goto END
)
if "%choice%"=="7" (
    echo Exiting...
    goto END
)

echo Invalid choice. Please try again.
pause
goto MENU

:END
exit /b
