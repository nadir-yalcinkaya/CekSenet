@echo off
chcp 65001 >nul
cls
title Cek ve Senet Takip Sistemi Baslatici

echo ===================================================
echo   CEK VE SENET TAKIP SISTEMI BASLATILIYOR
echo ===================================================
echo.

:: 1. Node.js Kontrolu
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [HATA] Node.js yuklu degil veya yol (PATH) ayarlarina eklenmemis.
    echo Lutfen https://nodejs.org adresinden Node.js kurun.
    pause
    exit
)

:: 2. Modul Kontrolu
if not exist "node_modules" (
    echo [BILGI] Gerekli kutuphaneler yukleniyor (Ilk kurulum)...
    call npm install
    if %errorlevel% neq 0 (
        echo [HATA] Kutuphaneler yuklenemedi. Internet baglantinizi kontrol edin.
        pause
        exit
    )
)

:: 3. Uygulamayi Baslat
echo.
echo [BILGI] Uygulama baslatiliyor...
echo [NOT] Tarayici otomatik acilmazsa: http://localhost:5173 adresine gidin.
echo.

npm run hepsi

pause