@echo off
cd /d %~dp0
if not exist node_modules (
  echo Instalando dependencias pela primeira vez...
  call npm install
)
echo Iniciando o site...
call npm run dev
pause
