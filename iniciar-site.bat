@echo off
cd /d %~dp0
echo Iniciando Clinica Sorriso pelo WSL...
wsl --cd "%~dp0." bash -lc "npm run dev"
pause
