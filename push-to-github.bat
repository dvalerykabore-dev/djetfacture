@echo off
echo =========================================================
echo DJETFACTURE - Synchronisation et Push vers GitHub
echo Depot : https://github.com/dvalerykabore-dev/djetfacture.git
echo =========================================================

cd /d "%~dp0"

set GIT_CMD=git

where git >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    set GIT_CMD=git
    goto :FOUND
)

if exist "C:\Program Files\Git\cmd\git.exe" (
    set GIT_CMD="C:\Program Files\Git\cmd\git.exe"
    goto :FOUND
)

if exist "C:\Program Files (x86)\Git\cmd\git.exe" (
    set GIT_CMD="C:\Program Files (x86)\Git\cmd\git.exe"
    goto :FOUND
)

if exist "%LOCALAPPDATA%\Programs\Git\cmd\git.exe" (
    set GIT_CMD="%LOCALAPPDATA%\Programs\Git\cmd\git.exe"
    goto :FOUND
)

if exist "%LOCALAPPDATA%\GitHubDesktop\bin\git.exe" (
    set GIT_CMD="%LOCALAPPDATA%\GitHubDesktop\bin\git.exe"
    goto :FOUND
)

echo.
echo [ATTENTION] Git n'a pas ete detecte sur votre ordinateur.
echo Vous pouvez installer Git gratuitement depuis https://git-scm.com/download/win
echo OU ajouter directement vos fichiers sur le site GitHub (bouton 'uploading an existing file').
echo.
pause
exit /b 1

:FOUND
echo Executable Git detecte avec succes !
echo.

if exist "src\app\page.tsx" (
    echo Nettoyage du fichier en double src\app\page.tsx...
    del /f /q "src\app\page.tsx"
)

%GIT_CMD% init
%GIT_CMD% rm --cached src/app/page.tsx 2>nul
%GIT_CMD% config user.email "dvalerykabore@dev.com"
%GIT_CMD% config user.name "Valery Kabore"
%GIT_CMD% add .
%GIT_CMD% commit -m "feat: DJETFACTURE SaaS App OHADA & Supabase Cloud"
%GIT_CMD% branch -M main
%GIT_CMD% remote remove origin 2>nul
%GIT_CMD% remote add origin https://github.com/dvalerykabore-dev/djetfacture.git
%GIT_CMD% push -u origin main --force

echo.
echo =========================================================
echo Publication terminee avec succes sur GitHub !
echo =========================================================
pause
