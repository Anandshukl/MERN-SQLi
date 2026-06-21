@echo off
REM Create directory structure for the project
echo Creating project directories...
cd /d "%~dp0"
mkdir backend\models 2>nul
mkdir backend\routes 2>nul
mkdir backend\middleware 2>nul
mkdir backend\scripts 2>nul
mkdir frontend\src\components 2>nul
mkdir frontend\src\pages 2>nul
mkdir frontend\public 2>nul
mkdir data 2>nul
echo Directories created successfully
pause
