import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Save,
  X,
  Search,
  Filter
} from 'lucide-react';
import { 
  getAllKegiatan, 
  createKegiatan, 
  updateKegiatan, 
  deleteKegiatan,
  type Kegiatan,
  type CreateKegiatan 
} from '@/lib/kalenderService';
import { showSuccess, showError, showConfirm } from '@/lib/sweetAlert';

const AdminKalender = () => {
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKegiatan, setEditingKegiatan] = useState<Kegiatan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    type: 'sidang' as 'sidang' | 'rapat' | 'kunjungan' | 'acara' | 'lainnya',
    status: 'terjadwal' as 'terjadwal' | 'berlangsung' | 'selesai' | 'dibatalkan',
    participants: ''
  });

  // Load kegiatan data
  useEffect(() => {
    loadKegiatan();
  }, []);

  const loadKegiatan = async () => {
    try {
      setLoading(true);
      const data = await getAllKegiatan();
      setKegiatan(data);
    } catch (error) {
      console.error('Error loading kegiatan:', error);
      showError('Gagal memuat data kegiatan');
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setEditingKegiatan(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      type: 'sidang',
      status: 'terjadwal',
      participants: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingKegiatan(null);
  };

  const handleEdit = (kegiatan: Kegiatan) => {
    setEditingKegiatan(kegiatan);
    setFormData({
      title: kegiatan.title,
      description: kegiatan.description,
      date: kegiatan.date,
      time: kegiatan.time,
      location: kegiatan.location,
      type: kegiatan.type,
      status: kegiatan.status,
      participants: kegiatan.participants?.join(', ') || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const kegiatanData: CreateKegiatan = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        type: formData.type,
        status: formData.status,
        participants: formData.participants ? formData.participants.split(',').map(p => p.trim()) : []
      };

      if (editingKegiatan) {
        await updateKegiatan(editingKegiatan.id, kegiatanData);
        showSuccess('Kegiatan berhasil diperbarui');
      } else {
        await createKegiatan(kegiatanData);
        showSuccess('Kegiatan berhasil ditambahkan');
      }

      await loadKegiatan();
      closeModal();
    } catch (error) {
      console.error('Error saving kegiatan:', error);
      showError('Gagal menyimpan kegiatan');
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Hapus Kegiatan', 'Yakin ingin menghapus kegiatan ini?');
    if (!confirmed) return;

    try {
      await deleteKegiatan(id);
      showSuccess('Kegiatan berhasil dihapus');
      await loadKegiatan();
    } catch (error) {
      console.error('Error deleting kegiatan:', error);
      showError('Gagal menghapus kegiatan');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sidang': return 'bg-blue-500';
      case 'rapat': return 'bg-green-500';
      case 'kunjungan': return 'bg-orange-500';
      case 'acara': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terjadwal': return 'text-blue-600 bg-blue-50';
      case 'berlangsung': return 'text-green-600 bg-green-50';
      case 'selesai': return 'text-gray-600 bg-gray-50';
      case 'dibatalkan': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredKegiatan = kegiatan.filter(kegiatan => {
    const matchesSearch = kegiatan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        kegiatan.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        kegiatan.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || kegiatan.type === filterType;
    const matchesStatus = filterStatus === 'all' || kegiatan.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
            Kelola Kalender Kegiatan
          </h2>
          <p className="text-sm text-gray-600 mt-1">Manajemen jadwal dan agenda kegiatan</p>
        </div>
        <Button onClick={openModal} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Kegiatan
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Cari kegiatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="sidang">Sidang</SelectItem>
              <SelectItem value="rapat">Rapat</SelectItem>
              <SelectItem value="kunjungan">Kunjungan</SelectItem>
              <SelectItem value="acara">Acara</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="terjadwal">Terjadwal</SelectItem>
              <SelectItem value="berlangsung">Berlangsung</SelectItem>
              <SelectItem value="selesai">Selesai</SelectItem>
              <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-3 sm:p-4 lg:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{kegiatan.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Kegiatan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{kegiatan.filter(k => k.status === 'terjadwal').length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Terjadwal</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{kegiatan.filter(k => k.status === 'berlangsung').length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Berlangsung</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="p-3 sm:p-4 lg:p-6">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              <div>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{kegiatan.filter(k => k.status === 'selesai').length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Selesai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kegiatan List */}
      <div className="space-y-4">
        {filteredKegiatan.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              {searchQuery || filterType !== 'all' || filterStatus !== 'all' 
                ? 'Tidak ada kegiatan yang ditemukan.' 
                : 'Belum ada kegiatan yang ditambahkan.'}
            </p>
            {!searchQuery && filterType === 'all' && filterStatus === 'all' && (
              <Button onClick={openModal} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Kegiatan Pertama
              </Button>
            )}
          </div>
        ) : (
          filteredKegiatan.map(kegiatan => (
            <Card key={kegiatan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {kegiatan.title}
                      </h3>
                      <Badge className={`text-xs ${getStatusColor(kegiatan.status)}`}>
                        {kegiatan.status}
                      </Badge>
                      <div className={`w-3 h-3 rounded-full ${getTypeColor(kegiatan.type)}`}></div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {kegiatan.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(kegiatan.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{kegiatan.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{kegiatan.location}</span>
                      </div>
                    </div>
                    {kegiatan.participants && kegiatan.participants.length > 0 && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{kegiatan.participants.length} peserta</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(kegiatan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(kegiatan.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">
                  {editingKegiatan ? 'Edit Kegiatan' : 'Tambah Kegiatan'}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Judul Kegiatan *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Masukkan judul kegiatan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Lokasi *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Masukkan lokasi"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Deskripsi *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Deskripsi kegiatan"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="date">Tanggal *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="time">Waktu *</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Kategori *</Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'sidang' | 'rapat' | 'kunjungan' | 'acara' | 'lainnya' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sidang">Sidang</SelectItem>
                        <SelectItem value="rapat">Rapat</SelectItem>
                        <SelectItem value="kunjungan">Kunjungan</SelectItem>
                        <SelectItem value="acara">Acara</SelectItem>
                        <SelectItem value="lainnya">Lainnya</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as 'terjadwal' | 'berlangsung' | 'selesai' | 'dibatalkan' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="terjadwal">Terjadwal</SelectItem>
                        <SelectItem value="berlangsung">Berlangsung</SelectItem>
                        <SelectItem value="selesai">Selesai</SelectItem>
                        <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="participants">Peserta (opsional)</Label>
                    <Input
                      id="participants"
                      value={formData.participants}
                      onChange={(e) => setFormData(prev => ({ ...prev, participants: e.target.value }))}
                      placeholder="Pisahkan dengan koma"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={closeModal}>
                    Batal
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingKegiatan ? 'Update' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKalender;
