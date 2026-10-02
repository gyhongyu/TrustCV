@echo off
rem ==============================================================================
rem   Script Name: 環境依賴自檢.bat
rem   Description: 專案環境依賴自檢與一鍵修復總管
rem   Encoding: UTF-8 (No BOM), CRLF line endings
rem ==============================================================================

chcp 65001 > nul
setlocal enabledelayedexpansion

cd /d "%~dp0"

title Project - Environment Doctor

echo ========================================================================
echo   [Project Doctor] 專案環境依賴自檢與一鍵修復總管
echo ========================================================================
echo.

py "%~dp0.agents\skills\project_environment_doctor\scripts\doctor.py"

echo.
echo ========================================================================
echo [選項 1] 輸入 Y 立即執行自動修復 (安裝所有缺失套件)
echo [選項 2] 輸入 Q 或直接按 Enter 退出
echo ========================================================================
set /p user_choice="請輸入您的選擇 [Y/Q]: "

if /i "%user_choice%"=="y" (
    echo.
    echo [INFO] 正在為您自動安裝缺失依賴...
    py "%~dp0.agents\skills\project_environment_doctor\scripts\doctor.py" --fix -y
    echo.
    echo [DONE] 修復作業已完成，請檢視上方報告。
    pause
    goto :end
)

:end
endlocal
