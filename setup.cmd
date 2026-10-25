@echo off
REM ===========================================================================
REM  MathFis Solver - Instalacion de dependencias
REM  Ejecuta este archivo haciendo doble clic o desde CMD:  setup.cmd
REM  (No uses PowerShell si tienes la politica de ejecucion bloqueada.)
REM ===========================================================================
cd /d "%~dp0"

echo.
echo ===============================================
echo   MathFis Solver - Instalando dependencias
echo ===============================================
echo.

where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] No se encontro npm. Instala Node.js 18+ desde https://nodejs.org
  pause
  exit /b 1
)

echo Instalando paquetes con npm...
call npm install
if errorlevel 1 (
  echo.
  echo [AVISO] npm install fallo. Reintentando con --legacy-peer-deps...
  call npm install --legacy-peer-deps
)

if errorlevel 1 (
  echo.
  echo [ERROR] No se pudieron instalar las dependencias.
  echo Revisa tu conexion a internet y vuelve a intentarlo.
  pause
  exit /b 1
)

echo.
echo ===============================================
echo   Listo. Dependencias instaladas correctamente.
echo ===============================================
echo.
echo Para arrancar la aplicacion ejecuta:  start.cmd
echo.
pause
