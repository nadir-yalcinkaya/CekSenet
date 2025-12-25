import sql from 'mssql';

const config = {
    server: 'DESKTOP-9TQ8601\\SQLEXPRESS05', // Doğru instance adı
    database: 'CEKSENET',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true,
        encrypt: false, // Yerel ağda SSL hatasını önlemek için false
        connectionTimeout: 15000
    }
};

async function testConnection() {
    console.log("--- SQL BAGLANTI TESTI ---");
    console.log("Sunucu: " + config.server);
    
    try {
        await sql.connect(config);
        console.log("✅ BAGLANTI BASARILI.");
        
        // Tablo kontrolü
        try {
            const res = await sql.query`SELECT count(*) as adet FROM dbo.TAKIP`;
            console.log("✅ Tablo bulundu. Kayıt sayısı: " + res.recordset[0].adet);
        } catch (e) {
            console.log("⚠️ Bağlantı var ama 'TAKIP' tablosu yok veya okunamadı.");
            console.log("   Lütfen 'database_kurulum.sql' dosyasını çalıştırın.");
            process.exit(1); 
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ BAGLANTI HATASI: " + err.message);
        console.error("   SQL Server'ın çalıştığından emin olun.");
        process.exit(1);
    }
}

testConnection();