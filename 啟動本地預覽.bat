@echo off
rem ==============================================================================
rem   Script Name: 啟動本地預覽.bat
rem   Description: TrustCV PWA 本地靜態伺服器啟動器 (偏門端口 + 零自動開瀏覽器)
rem   Encoding: UTF-8 (No BOM, Windows CRLF)
rem ==============================================================================

chcp 65001 > nul
setlocal enabledelayedexpansion

rem 1. 強制鎖定工作目錄為本專案根目錄
cd /d "%~dp0"

rem 2. 設定端口 (需與 Google Cloud Console OAuth Authorized Origins 一致)
set "PORT=5188"
set "URL=http://localhost:!PORT!"

title TrustCV PWA Local Preview Server - Port !PORT!

echo ========================================================
echo   [TrustCV] PWA Local HTTP Preview Server
echo ========================================================
echo.
echo [INFO] Selected Port: !PORT!
echo [INFO] Access URL:    !URL!
echo.

rem 3. 檢查端口是否被舊進程佔用，如有則釋放
for /f "tokens=5" %%a in ('netstat -aon ^| findstr /R /C:":!PORT! .*LISTENING"') do (
    set "OLD_PID=%%a"
    if defined OLD_PID (
        echo [INFO] Found process PID: !OLD_PID! on port !PORT!, terminating...
        taskkill /F /PID !OLD_PID! > nul 2>&1
        ping 127.0.0.1 -n 2 > nul
    )
)

rem 4. 依使用者要求：絕對不自動啟動瀏覽器，由使用者自行開啟測試
echo [READY] Server is starting up...
echo.
echo ========================================================
echo   [RUNNING] Local HTTP Server is active!
echo   - Open your browser and navigate to:
echo     !URL!
echo   - To test PWA features and avoid file:/// CORS blocks
echo   - Press Ctrl+C in this console or close window to stop.
echo ========================================================
echo.

rem 5. 前台啟動 Python HTTP 伺服器接管輸出
py -m http.server !PORT!

if %errorlevel% neq 0 (
    echo.
    echo ========================================================
    echo   [ERROR] Failed to start Python HTTP Server on port !PORT!
    echo ========================================================
    echo.
    pause
)

endlocal
