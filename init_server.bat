@echo off
REM Initialize server directories
echo Creating server structure...
cd /d "%~dp0"
python -c "import os; [os.makedirs(d, exist_ok=True) for d in ['server/models', 'server/routes', 'server/controllers', 'server/middleware', 'server/utils', 'server/python']]"
echo Server directories created
pause
