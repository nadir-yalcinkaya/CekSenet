USE master;
GO

-- 1. Veritabanı Yoksa Oluştur
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CEKSENET')
BEGIN
    CREATE DATABASE CEKSENET;
END
GO

USE CEKSENET;
GO

-- 2. Tablo Yoksa Oluştur
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'TAKIP' AND type = 'U')
BEGIN
    CREATE TABLE dbo.TAKIP (
        ID bigint IDENTITY(1,1) PRIMARY KEY,
        FIRMA nvarchar(255) NOT NULL,
        KESIDE nvarchar(100),
        ADRES nvarchar(MAX),
        TEL varchar(50),
        TARH date NOT NULL,
        VALOR date NOT NULL,
        TUTAR money DEFAULT 0,
        SeriNo varchar(50),
        DURUM nvarchar(50) DEFAULT 'BEKLIYOR',
        SON_GUNCELLEME_TARHI datetime DEFAULT GETDATE()
    );
END
GO

-- 3. Örnek Veri Ekle (Tablo boşsa)
IF NOT EXISTS (SELECT TOP 1 * FROM dbo.TAKIP)
BEGIN
    INSERT INTO dbo.TAKIP (FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, TUTAR, SeriNo, DURUM)
    VALUES 
    ('Ornek Firma A.S.', 'Istanbul', 'Organize Sanayi', '05321002030', GETDATE(), DATEADD(day, 45, GETDATE()), 125000, 'A-885522', 'BEKLIYOR');
END
GO