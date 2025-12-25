import React, { useState, useEffect } from 'react';
import { TakipKayit, DurumTipi } from '../types';

interface TakipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: Omit<TakipKayit, 'ID' | 'SON_GUNCELLEME_TARIHI'> | TakipKayit) => void;
  initialData?: TakipKayit | null;
}

export const TakipModal: React.FC<TakipModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<Partial<TakipKayit>>({
    FIRMA: '',
    KESIDE: '',
    ADRES: '',
    TEL: '',
    TARH: '',
    VALOR: '',
    TUTAR: 0,
    SeriNo: '',
    DURUM: DurumTipi.BEKLIYOR
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        FIRMA: '',
        KESIDE: '',
        ADRES: '',
        TEL: '',
        TARH: new Date().toISOString().split('T')[0],
        VALOR: new Date().toISOString().split('T')[0],
        TUTAR: 0,
        SeriNo: '',
        DURUM: DurumTipi.BEKLIYOR
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center sticky top-0">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Kaydı Düzenle' : 'Yeni Çek/Senet Ekle'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Firma Ünvanı</label>
            <input 
              required
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.FIRMA}
              onChange={e => setFormData({...formData, FIRMA: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tutar (TL)</label>
            <input 
              required
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
              value={formData.TUTAR}
              onChange={e => setFormData({...formData, TUTAR: parseFloat(e.target.value)})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Seri No</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.SeriNo}
              onChange={e => setFormData({...formData, SeriNo: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keşide Yeri</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.KESIDE}
              onChange={e => setFormData({...formData, KESIDE: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.TEL}
              onChange={e => setFormData({...formData, TEL: e.target.value})}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adres</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.ADRES}
              onChange={e => setFormData({...formData, ADRES: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Evrak Tarihi (TARH)</label>
            <input 
              required
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.TARH}
              onChange={e => setFormData({...formData, TARH: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Valör Tarihi</label>
            <input 
              required
              type="date" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.VALOR}
              onChange={e => setFormData({...formData, VALOR: e.target.value})}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={formData.DURUM}
              onChange={e => setFormData({...formData, DURUM: e.target.value as DurumTipi})}
            >
              {Object.values(DurumTipi).map(durum => (
                <option key={durum} value={durum}>{durum}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
            >
              İptal
            </button>
            <button 
              type="submit"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg hover:shadow-xl transition transform hover:-translate-y-0.5"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};