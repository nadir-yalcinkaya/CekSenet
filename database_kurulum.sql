USE master;
GO

-- 1. Veritabanı Var mı Kontrol Et, Yoksa Oluştur
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CEKSENET')
BEGIN
    CREATE DATABASE CEKSENET;
    PRINT 'CEKSENET veritabanı başarıyla oluşturuldu.';
END
ELSE
BEGIN
    PRINT 'CEKSENET veritabanı zaten mevcut.';
END
GO

USE CEKSENET;
GO

-- 2. Tablo Var mı Kontrol Et, Yoksa Oluştur
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TAKIP' AND type = 'U')
BEGIN
    CREATE TABLE dbo.TAKIP (
        ID bigint IDENTITY(1,1) PRIMARY KEY,
        FIRMA nvarchar(255) NOT NULL,     -- Firma Adı
        KESIDE nvarchar(100),             -- Keşide Yeri
        ADRES nvarchar(MAX),              -- Adres Bilgisi
        TEL varchar(50),                  -- Telefon Numarası
        TARH date NOT NULL,               -- Evrak Tarihi
        VALOR date NOT NULL,              -- Vade Tarihi
        TUTAR money DEFAULT 0,            -- Tutar
        SeriNo varchar(50),               -- Çek/Senet Seri Numarası
        DURUM nvarchar(50) DEFAULT 'BEKLIYOR', -- Durum (ODENDI, KARSILIKSIZ vb.)
        SON_GUNCELLEME_TARHI datetime DEFAULT GETDATE() -- Kayıt/Güncelleme Zamanı
    );
    PRINT 'TAKIP tablosu başarıyla oluşturuldu.';
    
    -- Örnek bir kayıt ekleyelim (Opsiyonel)
    INSERT INTO dbo.TAKIP (FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, TUTAR, SeriNo, DURUM)
    VALUES ('Örnek Firma Ltd. Şti.', 'İstanbul', 'Organize Sanayi Bölgesi', '05551234567', GETDATE(), DATEADD(day, 30, GETDATE()), 150000, 'A-12345', 'BEKLIYOR');
END
ELSE
BEGIN
    PRINT 'TAKIP tablosu zaten mevcut.';
END
GO