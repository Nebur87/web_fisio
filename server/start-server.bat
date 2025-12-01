@echo off
echo =====================================
echo  SERVIDOR ECLOSION DES SENS
echo =====================================
echo.

:: Verificar si Node.js esta instalado
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descarga e instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

:: Verificar si las dependencias estan instaladas
if not exist "node_modules" (
    echo Las dependencias no estan instaladas.
    echo Ejecutando instalacion automatica...
    echo.
    call install-dependencies.bat
    if errorlevel 1 (
        echo Fallo la instalacion de dependencias
        pause
        exit /b 1
    )
)

echo Iniciando servidor Node.js...
echo.
echo URLs disponibles:
echo - Website: http://localhost:3001/index.html
echo - Reservas: http://localhost:3001/views/reserve.html
echo - Admin Panel: http://localhost:3001/views/admin-reservas.html (con login integrado)
echo.
echo Credenciales de administrador:
echo - Usuario: admin
echo - Contraseña: admin123
echo.
echo Para detener el servidor, presiona Ctrl+C
echo.

cd /d "%~dp0"
node index.js
pause