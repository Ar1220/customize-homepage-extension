@echo off
setlocal EnableDelayedExpansion

:: 1. Administrative Shield
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo [INFO] Requesting Administrative privileges...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

:: Portable Path Resolution
cd /d "%~dp0Ui"

:: 2. Dependency Safetynet
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
) else (
    powershell -NoProfile -Command "if ((Get-Item 'package.json').LastWriteTime -gt (Get-Item 'node_modules').LastWriteTime) { exit 1 } else { exit 0 }"
    if errorlevel 1 (
        echo [INFO] package.json is newer than node_modules. Updating dependencies...
        call npm install
        :: Update the folder timestamp so it doesn't trigger repeatedly
        powershell -NoProfile -Command "(Get-Item 'node_modules').LastWriteTime = (Get-Date)"
    ) else (
        echo [OK] Dependencies are up to date.
    )
)

:: 3. Recompilation Loop
echo [INFO] Triggering clean build...
call npm run build

:: Extension Path Resolution
set "EXT_PATH=%~dp0Ui\dist"

:: 4. Interactive Browser Selection Menu
:MENU
echo =========================================
echo   Cross-Platform Local Deployment Tool   
echo =========================================
echo 1) Google Chrome
echo 2) Brave Browser
echo 3) Comet Browser
echo 4) Firefox (web-ext)
echo 5) Opera Air
echo 6) Opera
echo 7) Opera GX
echo =========================================
set /p choice="Enter selection (1-7): "

if "%choice%"=="1" goto CHROME
if "%choice%"=="2" goto BRAVE
if "%choice%"=="3" goto COMET
if "%choice%"=="4" goto FIREFOX
if "%choice%"=="5" goto OPERA_AIR
if "%choice%"=="6" goto OPERA
if "%choice%"=="7" goto OPERA_GX
echo Invalid selection.
goto MENU

:CHROME
set "EXE="
for %%P in ("C:\Program Files\Google\Chrome\Application\chrome.exe" "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start chrome --load-extension="%EXT_PATH%")
goto END

:BRAVE
set "EXE="
for %%P in ("C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe" "C:\Program Files (x86)\BraveSoftware\Brave-Browser\Application\brave.exe" "%LOCALAPPDATA%\BraveSoftware\Brave-Browser\Application\brave.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start brave --load-extension="%EXT_PATH%")
goto END

:COMET
set "EXE="
for %%P in ("C:\Program Files\Comet\Application\comet.exe" "C:\Program Files (x86)\Comet\Application\comet.exe" "%LOCALAPPDATA%\Comet\Application\comet.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start comet --load-extension="%EXT_PATH%")
goto END

:FIREFOX
echo [INFO] Launching Firefox via web-ext...
call npx web-ext run --source-dir="%EXT_PATH%"
goto END

:OPERA_AIR
set "EXE="
for %%P in ("%LOCALAPPDATA%\Programs\Opera Air\launcher.exe" "C:\Program Files\Opera Air\launcher.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start opera_air --load-extension="%EXT_PATH%")
goto END

:OPERA
set "EXE="
for %%P in ("%LOCALAPPDATA%\Programs\Opera\launcher.exe" "C:\Program Files\Opera\launcher.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start opera --load-extension="%EXT_PATH%")
goto END

:OPERA_GX
set "EXE="
for %%P in ("%LOCALAPPDATA%\Programs\Opera GX\launcher.exe" "C:\Program Files\Opera GX\launcher.exe") do if exist "%%~P" set "EXE=%%~P"
if defined EXE (start "" "!EXE!" --load-extension="%EXT_PATH%") else (start launcher --load-extension="%EXT_PATH%")
goto END

:END
echo [INFO] Browser launched.
pause
