import React, { useState, useEffect, useMemo } from 'react';
import { TakipKayit, DurumTipi } from './types';
import { dataService } from './services/dataService';
import { geminiService } from './services/geminiService';
import { StatsCard } from './components/StatsCard';
import { TakipModal } from './components/TakipModal';
import { Login } from './components/Login';
import { 
  Plus, 
  Search, 
  Filter, 
  BrainCircuit, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Server,
  LogOut,
  Banknote,
  AlertOctagon
} from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [data, setData] = useState<TakipKayit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Hata durumu eklendi
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterDurum, setFilterDurum] = useState<string>('ALL');
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<TakipKayit | null>(null);

  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  useEffect(() => {
    const storedAuth = localStorage.getItem('CEKSENET_AUTH');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleLogin = (status: boolean) => {
    if (status) {
      setIsAuthenticated(true);
      localStorage.setItem('CEKSENET_AUTH', 'true');
      loadData();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('CEKSENET_AUTH');
    setData([]);
    setAiAnalysis(null);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null); // Hatayı sıfırla
    try {
      const records = await dataService.getAll();
      setData(records);
    } catch (err: any) {
      console.error("Veri yüklenemedi", err);
      // Kullanıcıya hatayı göster
      setError(err.message || "Veritabanına bağlanılamadı. Lütfen sunucunun (npm run hepsi) çalıştığından emin olun.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (record: any) => {
    try {
      if (editingRecord) {
        await dataService.update({ ...record, ID: editingRecord.ID });
      } else {
        await dataService.add(record);
      }
      await loadData();
    } catch (err) {
      console.error("Kaydetme hatası", err);
      alert("İşlem sırasında bir hata oluştu: " + err);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu kaydı silmek istediğinize emin misiniz?")) {
      await dataService.delete(id);
      await loadData();
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await geminiService.analyzeFinancials(filteredData);
      setAiAnalysis(result);
    } catch (err) {
      setAiAnalysis("Analiz sırasında bir hata oluştu.");
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = 
        item.FIRMA.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.KESIDE.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.SeriNo && item.SeriNo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesFilter = filterDurum === 'ALL' || item.DURUM === filterDurum;
      
      return matchesSearch && matchesFilter;
    });
  }, [data, searchTerm, filterDurum]);

  const stats = useMemo(() => {
    const total = data.length;
    const totalAmount = data.reduce((sum, item) => sum + (item.TUTAR || 0), 0);
    const pending = data.filter(d => d.DURUM === DurumTipi.BEKLIYOR).length;
    const paid = data.filter(d => d.DURUM === DurumTipi.ODENDI).length;
    const problem = data.filter(d => d.DURUM === DurumTipi.KARSILIKSIZ || d.DURUM === DurumTipi.IADE).length;
    return { total, pending, paid, problem, totalAmount };
  }, [data]);

  const getStatusBadgeClass = (durum: string) => {
    switch (durum) {
      case DurumTipi.ODENDI: return "bg-green-100 text-green-800 border border-green-200";
      case DurumTipi.BEKLIYOR: return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case DurumTipi.KARSILIKSIZ: return "bg-red-100 text-red-800 border border-red-200";
      default: return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount || 0);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="text-white h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">Çek & Senet Takip</h1>
          </div>
          <div className="flex items-center space-x-4">
             <div className="text-sm text-gray-500 hidden sm:flex items-center gap-2">
                <Server className="h-4 w-4 text-gray-400" />
                <span>SQL Server: <span className="font-mono font-semibold text-gray-700">DESKTOP-9TQ8601\SQLEXPRESS05</span></span>
                <span className="flex h-2 w-2 relative">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${error ? 'bg-red-400' : 'bg-green-400'} opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${error ? 'bg-red-500' : 'bg-green-500'}`}></span>
                </span>
             </div>
             <div className="h-8 w-1 border-r border-gray-300 mx-2 hidden sm:block"></div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <div className="text-sm font-bold text-gray-900">Nadir YK</div>
                 <div className="text-xs text-gray-500">Yönetici</div>
               </div>
               <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                 NY
               </div>
               <button onClick={handleLogout} className="ml-2 p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Güvenli Çıkış">
                 <LogOut className="h-5 w-5" />
               </button>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hata Mesajı Kutusu */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm flex items-start">
             <AlertOctagon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
             <div>
               <h3 className="text-red-800 font-bold">Veritabanı Bağlantı Hatası</h3>
               <p className="text-red-700 text-sm mt-1">{error}</p>
               <button 
                 onClick={loadData}
                 className="mt-3 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded transition"
               >
                 Tekrar Dene
               </button>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Toplam Tutar" 
            value={formatCurrency(stats.totalAmount)} 
            icon={<Banknote className="h-6 w-6" />}
            colorClass="bg-blue-600"
          />
          <StatsCard 
            title="Bekleyen Ödemeler" 
            value={stats.pending.toString()} 
            icon={<Clock className="h-6 w-6" />}
            colorClass="bg-yellow-500"
          />
          <StatsCard 
            title="Tahsil Edilen" 
            value={stats.paid.toString()} 
            icon={<CheckCircle className="h-6 w-6" />}
            colorClass="bg-green-500"
          />
          <StatsCard 
            title="Sorunlu / İade" 
            value={stats.problem.toString()} 
            icon={<AlertTriangle className="h-6 w-6" />}
            colorClass="bg-red-500"
          />
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-6 shadow-lg mb-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="h-6 w-6" />
                Yapay Zeka Finansal Analiz
              </h2>
              <p className="text-indigo-100 mt-2 text-sm max-w-2xl">
                Gemini AI kullanarak mevcut tablo verileri üzerinden risk analizi, nakit akışı özeti ve finansal durum raporu oluşturun.
              </p>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={analyzing}
              className="bg-white text-indigo-700 hover:bg-indigo-50 px-5 py-2.5 rounded-lg font-medium shadow-md transition flex items-center gap-2 disabled:opacity-70"
            >
              {analyzing ? 'Analiz Ediliyor...' : 'Rapor Oluştur'}
            </button>
          </div>
          
          {aiAnalysis && (
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 animate-fade-in">
              <h3 className="font-semibold mb-2 border-b border-white/20 pb-2">Analiz Sonucu:</h3>
              <div className="prose prose-invert prose-sm max-w-none whitespace-pre-line text-indigo-50">
                {aiAnalysis}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Firma, seri no veya yer ara..."
              className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative">
              <select
                value={filterDurum}
                onChange={(e) => setFilterDurum(e.target.value)}
                className="appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm cursor-pointer"
              >
                <option value="ALL">Tüm Durumlar</option>
                {Object.values(DurumTipi).map(durum => (
                  <option key={durum} value={durum}>{durum}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <Filter className="h-4 w-4" />
              </div>
            </div>

            <button
              onClick={() => {
                setEditingRecord(null);
                setIsModalOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition flex items-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              Yeni Ekle
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
               <p>Veriler Yükleniyor...</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Firma / Keşide</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutar / SeriNo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih / Valör</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.length > 0 ? (
                    filteredData.map((item) => (
                      <tr key={item.ID} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{item.FIRMA}</div>
                          <div className="text-xs text-gray-500">{item.KESIDE}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-blue-700 font-mono">{formatCurrency(item.TUTAR)}</div>
                          <div className="text-xs text-gray-500 font-mono">{item.SeriNo}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-medium">{item.VALOR}</div>
                          <div className="text-xs text-gray-500">Evrak: {item.TARH}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(item.DURUM)}`}>
                            {item.DURUM}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => {
                              setEditingRecord(item);
                              setIsModalOpen(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg mr-2 transition"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.ID)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg transition"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        {error ? 'Bağlantı hatası nedeniyle kayıtlar gösterilemiyor.' : 'Kayıt bulunamadı.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <TakipModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingRecord(null);
        }}
        onSave={handleSave}
        initialData={editingRecord}
      />
    </div>
  );
};

export default App;