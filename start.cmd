@echo off
REM ===========================================================================
REM  MathFis Solver - Arrancar en modo desarrollo
REM  Doble clic o desde CMD:  start.cmd
REM ===========================================================================
cd /d "%~dp0"

if not exist "node_modules" (
  echo.
  echo [AVISO] No se encontro la carpeta node_modules.
  echo Ejecuta primero:  setup.cmd
  echo.
  pause
  exit /b 1
)

echo.
echo ===============================================
echo   MathFis Solver - Iniciando servidor de dev
echo   Abre http://localhost:3000 en tu navegador
echo   (Ctrl + C para detener)
echo ===============================================
echo.

call npm run dev
pause
