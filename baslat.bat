@echo off
title Cek Senet Sistemi Baslatici
color 1F
cls

echo ==================================================
echo   CEK VE SENET TAKIP SISTEMI BASLATILIYOR
echo ==================================================
echo.

:: 1. Node.js Yüklü mü Kontrol Et
node -v >nul 2>&1
if %errorlevel% neq 0 (
    color 4F
    echo [KRITIK HATA] Node.js bulunamadi!
    echo Lutfen https://nodejs.org adresinden Node.js indirip kurun.
    echo Kurulumdan sonra bilgisayari yeniden baslatmaniz gerekebilir.
    echo.
    pause
    exit
)

:: 2. Kütüphaneleri Yükle (Eğer yoksa)
if not exist "node_modules" (
    echo [BILGI] Gerekli dosyalar yukleniyor (Bu islem bir kez yapilir)...
    call npm install
    if %errorlevel% neq 0 (
        color 4F
        echo [HATA] Yukleme sirasinda hata olustu. Internet baglantinizi kontrol edin.
        pause
        exit
    )
)

:: 3. Uygulamayı Başlat
echo.
echo [BASARILI] Sistem hazir. Uygulama aciliyor...
echo.
echo Tarayicidan su adrese gidin: http://localhost:5173
echo.
echo (Durdurmak icin bu pencereyi kapatin)
echo --------------------------------------------------

call npm run hepsi

:: Eğer hata oluşup program kapanırsa pencere açık kalsın
color 60
echo.
echo [UYARI] Program kapandi. Bir hata olusmus olabilir.
pause