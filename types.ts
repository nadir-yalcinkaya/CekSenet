export interface TakipKayit {
  ID: number;
  FIRMA: string;
  KESIDE: string;
  ADRES: string;
  TEL: string;
  TARH: string; // YYYY-MM-DD (Evrak Tarihi)
  VALOR: string; // YYYY-MM-DD
  TUTAR: number;
  SeriNo: string;
  DURUM: string; // 'BEKLIYOR', 'ODENDI', 'KARSILIKSIZ', 'IADE'
  SON_GUNCELLEME_TARIHI: string;
}

export enum DurumTipi {
  BEKLIYOR = 'BEKLIYOR',
  ODENDI = 'ODENDI',
  KARSILIKSIZ = 'KARSILIKSIZ',
  IADE = 'IADE'
}

export interface GeminiAnalizSonuc {
  ozet: string;
  riskDurumu: 'DUSUK' | 'ORTA' | 'YUKSEK';
  oneri: string;
}