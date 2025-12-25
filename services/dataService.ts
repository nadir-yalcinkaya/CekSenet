import { TakipKayit } from '../types';

const API_URL = '/api/takip';

export const dataService = {
  getAll: async (): Promise<TakipKayit[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Veri çekilemedi');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("Veri yükleme hatası:", error);
      // Kullanıcıya hatayı göstermek için boş dizi dönmek yerine hatayı fırlatabiliriz
      // Ancak UI çökmemesi için boş dizi dönüp logluyoruz.
      return []; 
    }
  },

  add: async (kayit: Omit<TakipKayit, 'ID' | 'SON_GUNCELLEME_TARIHI'>): Promise<TakipKayit> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kayit)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kayıt eklenemedi');
    }
    return await response.json();
  },

  update: async (kayit: TakipKayit): Promise<TakipKayit> => {
    const response = await fetch(`${API_URL}/${kayit.ID}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(kayit)
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kayıt güncellenemedi');
    }
    return await response.json();
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Kayıt silinemedi');
    }
  }
};