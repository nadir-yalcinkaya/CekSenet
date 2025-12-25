@echo off
title Cek Senet Takip Sistemi
color 0A
cls

echo ================================================================
echo   CEK SENET TAKIP SISTEMI BASLATILIYOR
echo ================================================================
echo.

:: 1. Node.js Kontrolü
echo [ADIM 1] Node.js versiyonu kontrol ediliyor...
node -v
IF %ERRORLEVEL% NEQ 0 (
    color 4F
    echo.
    echo [KRITIK HATA] Node.js bilgisayarinizda yuklu degil!
    echo Lutfen https://nodejs.org adresinden indirip kurunuz.
    echo.
    pause
    exit
)

:: 2. Kütüphanelerin Yüklenmesi
echo.
echo [ADIM 2] Gerekli kutuphaneler kontrol ediliyor...
if not exist "node_modules" (
    echo    - Ilk kurulum yapiliyor, dosyalar indiriliyor (Internet gerekir)...
    call npm install
    IF %ERRORLEVEL% NEQ 0 (
        color 4F
        echo.
        echo [HATA] Kutuphaneler yuklenirken hata olustu!
        pause
        exit
    )
) else (
    echo    - Kutuphaneler zaten yuklu, devam ediliyor.
)

:: 3. Uygulamayı Başlat
echo.
echo [ADIM 3] Uygulama baslatiliyor...
echo.
echo    Eger veritabani baglantisi basarili ise tarayici acilacak.
echo    Adres: http://localhost:5173
echo.
echo ----------------------------------------------------------------
echo CALISIYOR... (Durdurmak icin bu pencereyi kapatin)
echo ----------------------------------------------------------------

:: Uygulamayı çalıştır
call npm run hepsi

:: Eğer program çökerse buraya düşer
color 6F
echo.
echo ================================================================
echo [UYARI] PROGRAM BEKLENMEDIK SEKILDE KAPANDI!
echo ================================================================
echo Yukaridaki hata mesajini okuyunuz.
echo Genellikle veritabani baglantisi veya port cakismasi olabilir.
echo.
pause