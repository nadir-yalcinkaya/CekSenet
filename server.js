import express from 'express';
import sql from 'mssql';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// SQL SERVER AYARLARI (GÜNCELLENDİ)
const config = {
  // Not: JavaScript'te ters eğik çizgi (\) özel karakter olduğu için iki tane (\\) kullanıyoruz.
  server: 'DESKTOP-9TQ8601\\SQLEXPRESS05', 
  database: 'CEKSENET',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true, // Windows Authentication
    enableArithAbort: true,
    trustServerCertificate: true, 
    encrypt: false, 
    connectionTimeout: 30000 
  }
};

// Tarih formatlama
const formatDateForFrontend = (dateVal) => {
  if (!dateVal) return null;
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime()) && d.getFullYear() > 1900) {
      return d.toISOString().split('T')[0];
    }
    return null;
  } catch (e) {
    return null;
  }
};

// Veritabanı Bağlantısı
async function connectToDB() {
  try {
    console.log('⏳ SQL Server\'a bağlanılıyor...');
    if (sql.globalConnection) {
        await sql.globalConnection.close();
    }
    await sql.connect(config);
    console.log('✅ SQL Server bağlantısı BAŞARILI.');
    console.log('   Sunucu: ' + config.server);
    console.log('   Veritabanı: ' + config.database);
  } catch (err) {
    console.error('❌ SQL Server bağlantı hatası:', err.message);
    console.error('------------------------------------------------');
    console.error('OLASI ÇÖZÜMLER:');
    console.error('1. "baslat.bat" dosyasını Yönetici Olarak çalıştırın.');
    console.error('2. SQL Server servisinin çalıştığından emin olun.');
    console.error('------------------------------------------------');
  }
}

connectToDB();

// Middleware: Bağlantı koptuysa yeniden bağlan
app.use(async (req, res, next) => {
  if (!sql.globalConnection || !sql.globalConnection.connected) {
    console.log('⚠️ Bağlantı yenileniyor...');
    try {
      await connectToDB();
    } catch (err) {
      console.error('Yeniden bağlanma hatası:', err);
    }
  }
  next();
});

// 1. Tüm Kayıtları Getir
app.get('/api/takip', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM dbo.TAKIP ORDER BY ID DESC`;
    
    console.log(`✅ ${result.recordset.length} kayıt çekildi.`);

    const formattedData = result.recordset.map(row => ({
      ID: row.ID,
      FIRMA: row.FIRMA,
      KESIDE: row.KESIDE,
      ADRES: row.ADRES,
      TEL: row.TEL,
      TARH: formatDateForFrontend(row.TARH),
      VALOR: formatDateForFrontend(row.VALOR),
      TUTAR: row.TUTAR,
      SeriNo: row.SeriNo,
      DURUM: row.DURUM || 'BEKLIYOR',
      SON_GUNCELLEME_TARIHI: row.SON_GUNCELLEME_TARHI 
        ? new Date(row.SON_GUNCELLEME_TARHI).toISOString() 
        : null
    }));
    
    res.json(formattedData);
  } catch (err) {
    console.error('❌ VERİ ÇEKME HATASI:', err);
    res.status(500).send(`Veritabanı Hatası: ${err.message}`);
  }
});

// 2. Yeni Kayıt Ekle
app.post('/api/takip', async (req, res) => {
  const { FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, DURUM, TUTAR, SeriNo } = req.body;
  try {
    const request = new sql.Request();
    request.input('FIRMA', sql.NVarChar, FIRMA);
    request.input('KESIDE', sql.NVarChar, KESIDE);
    request.input('ADRES', sql.NVarChar, ADRES);
    request.input('TEL', sql.VarChar, TEL);
    request.input('TARH', sql.Date, TARH);
    request.input('VALOR', sql.Date, VALOR);
    request.input('DURUM', sql.NVarChar, DURUM);
    request.input('TUTAR', sql.Money, TUTAR || 0);
    request.input('SeriNo', sql.VarChar, SeriNo);

    const result = await request.query(`
      INSERT INTO dbo.TAKIP (FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, DURUM, TUTAR, SeriNo, SON_GUNCELLEME_TARHI)
      VALUES (@FIRMA, @KESIDE, @ADRES, @TEL, @TARH, @VALOR, @DURUM, @TUTAR, @SeriNo, GETDATE());
      SELECT SCOPE_IDENTITY() AS ID;
    `);
    
    res.json({ ID: result.recordset[0].ID, ...req.body });
  } catch (err) {
    console.error('Ekleme Hatası:', err);
    res.status(500).send(err.message);
  }
});

// 3. Kayıt Güncelle
app.put('/api/takip/:id', async (req, res) => {
  const { id } = req.params;
  const { FIRMA, KESIDE, ADRES, TEL, TARH, VALOR, DURUM, TUTAR, SeriNo } = req.body;
  try {
    const request = new sql.Request();
    request.input('ID', sql.BigInt, id);
    request.input('FIRMA', sql.NVarChar, FIRMA);
    request.input('KESIDE', sql.NVarChar, KESIDE);
    request.input('ADRES', sql.NVarChar, ADRES);
    request.input('TEL', sql.VarChar, TEL);
    request.input('TARH', sql.Date, TARH);
    request.input('VALOR', sql.Date, VALOR);
    request.input('DURUM', sql.NVarChar, DURUM);
    request.input('TUTAR', sql.Money, TUTAR || 0);
    request.input('SeriNo', sql.VarChar, SeriNo);

    await request.query(`
      UPDATE dbo.TAKIP 
      SET FIRMA=@FIRMA, KESIDE=@KESIDE, ADRES=@ADRES, TEL=@TEL, TARH=@TARH, VALOR=@VALOR, DURUM=@DURUM, TUTAR=@TUTAR, SeriNo=@SeriNo, SON_GUNCELLEME_TARHI=GETDATE()
      WHERE ID = @ID
    `);
    res.json({ ID: Number(id), ...req.body });
  } catch (err) {
    console.error('Güncelleme Hatası:', err);
    res.status(500).send(err.message);
  }
});

// 4. Kayıt Sil
app.delete('/api/takip/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql.query`DELETE FROM dbo.TAKIP WHERE ID = ${id}`;
    res.sendStatus(200);
  } catch (err) {
    console.error('Silme Hatası:', err);
    res.status(500).send(err.message);
  }
});

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).send('API not found');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu port ${PORT} üzerinde çalışıyor.`);
});