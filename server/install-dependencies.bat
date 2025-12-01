@echo off
echo =====================================
echo  INSTALACION DE DEPENDENCIAS
echo =====================================
echo.
echo Instalando dependencias del servidor...
echo.

cd /d "%~dp0"

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descarga e instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado, instalando paquetes...
npm install

if errorlevel 1 (
    echo ERROR: Fallo la instalacion de dependencias
    pause
    exit /b 1
)

echo.
echo =====================================
echo  INSTALACION COMPLETADA
echo =====================================
echo.
echo Dependencias instaladas correctamente:
echo - express (servidor web)
echo - mysql2 (base de datos)
echo - nodemailer (emails)
echo - cors (politicas de origen cruzado)
echo - body-parser (parseo de datos)
echo - jsonwebtoken (autenticacion JWT)
echo - bcrypt (encriptacion de passwords)
echo.
echo Para iniciar el servidor ejecuta: start-server.bat
echo.
pause