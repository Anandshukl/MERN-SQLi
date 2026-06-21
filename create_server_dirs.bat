@echo off
REM Create server specific directories
echo Creating server structure...
mkdir server\models 2>nul
mkdir server\routes 2>nul
mkdir server\controllers 2>nul
mkdir server\middleware 2>nul
mkdir server\utils 2>nul
echo Server directories created
pause
