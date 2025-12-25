USE master;
GO

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'CEKSENET')
BEGIN
    CREATE DATABASE CEKSENET;
END
GO

USE CEKSENET;
GO

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

    -- Örnek veri
    INSERT INTO dbo.TAKIP (FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, TUTAR, SeriNo, DURUM)
    VALUES ('Deneme Firma Ltd', 'Istanbul', 'Test Adresi', '05551112233', GETDATE(), DATEADD(day, 30, GETDATE()), 50000, 'A-123456', 'BEKLIYOR');
END
GO

dfgfdgf


fdgfd