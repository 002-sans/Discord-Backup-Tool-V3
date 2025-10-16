@echo off
cd /d "%~dp0"

echo ===============================
echo Verification de node_modules...
echo ===============================

if exist "node_modules" (
    echo Le dossier node_modules existe deja.
) else (
    echo Installation des dependances...

    where bun >nul 2>nul
    if %errorlevel%==0 (
        echo Bun detecte, installation avec bun i...
        bun i
    ) else (
        echo Bun non trouve, utilisation de npm i...
        npm install
    )

    if %errorlevel% neq 0 (
        echo Erreur pendant l'installation des dependances !
        pause
        exit /b
    )
)

echo ===============================
echo ▶️ Lancement du script Node.js
echo ===============================
node .
pause
