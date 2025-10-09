import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAspirasi, updateAspirasiStatus, deleteAspirasi, type Aspirasi, type AspirasiStatus } from '@/lib/aspirasiService';
import { showSuccess, showError, showConfirm } from '@/lib/sweetAlert';
import { CheckCircle2, Clock3, Trash2, RefreshCw, Menu, X } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminAspirasi = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Aspirasi[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AspirasiStatus | 'all'>('all');
  const [selected, setSelected] = useState<Aspirasi | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await listAspirasi(filter === 'all' ? undefined : filter);
      setItems(data);
    } catch (e) {
      console.error(e);
      showError('Gagal memuat aspirasi');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: AspirasiStatus) => {
    const ok = await updateAspirasiStatus(id, status);
    if (ok) { showSuccess('Status diperbarui'); load(); } else { showError('Gagal memperbarui status'); }
  };

  const remove = async (id: string) => {
    const ok = await showConfirm('Hapus Aspirasi', 'Yakin hapus aspirasi ini?');
    if (!ok) return;
    const done = await deleteAspirasi(id);
    if (done) { showSuccess('Aspirasi dihapus'); load(); } else { showError('Gagal menghapus aspirasi'); }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <div className={`
          fixed lg:fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar 
            active="aspirasi" 
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">Kelola Aspirasi</h2>
              <p className="text-sm text-muted-foreground">Masukan masyarakat untuk DPR</p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <select 
                value={filter} 
                onChange={e => setFilter(e.target.value as 'all' | AspirasiStatus)} 
                className="border rounded px-3 py-2 w-full sm:w-auto"
              >
                <option value="all">Semua</option>
                <option value="baru">Baru</option>
                <option value="diproses">Diproses</option>
                <option value="selesai">Selesai</option>
              </select>
              <button 
                onClick={load} 
                className="px-3 py-2 border rounded flex items-center justify-center gap-2 w-full sm:w-auto hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-4 h-4"/>
                <span className="hidden sm:inline">Muat Ulang</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Memuat...</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">Belum ada aspirasi.</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block bg-white border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3">Nama</th>
                      <th className="text-left p-3">Email</th>
                      <th className="text-left p-3">Kategori</th>
                      <th className="text-left p-3">Aspirasi</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => (
                      <tr key={item.id} className="border-b align-top hover:bg-gray-50">
                        <td className="p-3">{item.nama}<div className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('id-ID')}</div></td>
                        <td className="p-3">{item.email}</td>
                        <td className="p-3">{item.kategori}</td>
                        <td className="p-3 max-w-md">
                          <div className="whitespace-pre-wrap break-words">{item.aspirasi}</div>
                        </td>
                        <td className="p-3">
                          <select value={item.status} onChange={e => setStatus(item.id, e.target.value as AspirasiStatus)} className="border rounded px-2 py-1">
                            <option value="baru">Baru</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => setSelected(item)} title="Detail" className="px-2 py-1 border rounded">Detail</button>
                            <button onClick={() => setStatus(item.id, 'diproses')} title="Tandai Diproses" className="px-2 py-1 border rounded"><Clock3 className="w-4 h-4"/></button>
                            <button onClick={() => setStatus(item.id, 'selesai')} title="Tandai Selesai" className="px-2 py-1 border rounded text-green-600"><CheckCircle2 className="w-4 h-4"/></button>
                            <button onClick={() => remove(item.id)} title="Hapus" className="px-2 py-1 border rounded text-red-600"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile List */}
              <div className="lg:hidden space-y-2 overflow-x-hidden">
                {items.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors overflow-x-hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">{item.nama}</h3>
                          <select 
                            value={item.status} 
                            onChange={e => setStatus(item.id, e.target.value as AspirasiStatus)} 
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="baru">Baru</option>
                            <option value="diproses">Diproses</option>
                            <option value="selesai">Selesai</option>
                          </select>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <span className="line-clamp-1">{item.email}</span>
                          <span>•</span>
                          <span className="line-clamp-1">{item.kategori}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="line-clamp-1">{new Date(item.created_at).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button 
                          onClick={() => setSelected(item)} 
                          className="px-2 py-1 border rounded text-xs hover:bg-gray-50 transition-colors"
                        >
                          Detail
                        </button>
                        <button 
                          onClick={() => setStatus(item.id, 'diproses')} 
                          className="px-2 py-1 border rounded text-xs hover:bg-gray-50 transition-colors"
                        >
                          <Clock3 className="w-3 h-3"/>
                        </button>
                        <button 
                          onClick={() => setStatus(item.id, 'selesai')} 
                          className="px-2 py-1 border rounded text-xs text-green-600 hover:bg-green-50 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3"/>
                        </button>
                        <button 
                          onClick={() => remove(item.id)} 
                          className="px-2 py-1 border rounded text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3 h-3"/>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {/* Detail Modal */}
          {selected && (
            <DetailModal 
              item={selected} 
              onClose={() => setSelected(null)} 
              onSetStatus={async (s) => {
                await setStatus(selected.id, s);
                setSelected(prev => prev ? { ...prev, status: s } : prev);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Detail modal
const DetailModal = ({ item, onClose, onSetStatus }: { item: Aspirasi; onClose: () => void; onSetStatus: (s: AspirasiStatus) => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Detail Aspirasi</h3>
          <button onClick={onClose} className="px-2 py-1 border rounded">Tutup</button>
        </div>
        <div className="p-6 space-y-3 text-sm">
          <div><span className="text-muted-foreground">Tanggal:</span> {new Date(item.created_at).toLocaleString('id-ID')}</div>
          <div><span className="text-muted-foreground">Nama:</span> {item.nama}</div>
          <div><span className="text-muted-foreground">Email:</span> {item.email}</div>
          <div><span className="text-muted-foreground">Kategori:</span> {item.kategori}</div>
          <div>
            <div className="text-muted-foreground mb-1">Aspirasi:</div>
            <div className="whitespace-pre-wrap break-words border rounded p-3 bg-gray-50">{item.aspirasi}</div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <label className="text-muted-foreground">Status:</label>
            <select value={item.status} onChange={e => onSetStatus(e.target.value as AspirasiStatus)} className="border rounded px-2 py-1">
              <option value="baru">Baru</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAspirasi;


