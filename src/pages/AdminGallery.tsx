import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Download,
  MapPin,
  Camera,
  Filter
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError, showWarning, showConfirm } from "@/lib/sweetAlert";

// Interface untuk Gallery
export interface GalleryImage {
  id: string;
  title: string;
  description: string;
  slug: string;
  image_url: string;
  location: string;
  category: string;
  photographer: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  featured: boolean;
}

export interface CreateGalleryImage {
  title: string;
  description: string;
  image_url: string;
  location: string;
  category: string;
  photographer: string;
  status: 'draft' | 'published';
  featured: boolean;
}

const AdminGallery = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    photographer: "",
    image_url: "",
    status: "draft" as "draft" | "published",
    featured: false
  });

  const categories = [
    "Alam",
    "Pantai", 
    "Pulau",
    "Budaya",
    "Kegiatan Komunitas",
    "Event",
    "Wisata",
    "Tradisi",
    "Kuliner",
    "Lainnya"
  ];

  useEffect(() => {
    loadGalleryImages();
  }, []);

  // Fungsi untuk menyimpan gambar sebagai base64
  const saveImageAsBase64 = async (file: File): Promise<string | null> => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error('❌ Error converting image to base64:', error);
      return null;
    }
  };

  // Fungsi untuk handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi file type
      if (!file.type.startsWith('image/')) {
        showWarning('Pilih file gambar yang valid!');
        return;
      }

      // Validasi file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showWarning('Ukuran file maksimal 5MB!');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Fungsi untuk trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Fungsi untuk handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) {
          setSelectedFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          showWarning('Ukuran file maksimal 5MB!');
        }
      } else {
        showWarning('Pilih file gambar yang valid!');
      }
    }
  };

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("❌ Error loading gallery images:", error);
        showError("Gagal memuat galeri. Silakan refresh halaman.");
        return;
      }

      setGalleryImages(data || []);
    } catch (error) {
      console.error("❌ Error loading gallery images:", error);
      showError("Terjadi kesalahan saat memuat galeri.");
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      showWarning("Judul, deskripsi, dan lokasi harus diisi!");
      return;
    }

    if (!selectedFile && !formData.image_url && !editingImage) {
      showWarning("Pilih gambar atau masukkan URL gambar!");
      return;
    }

    try {
      setIsUploading(true);
      
      let imageUrl = formData.image_url;
      
      // Save image as base64 if file is selected
      if (selectedFile) {
        const base64Image = await saveImageAsBase64(selectedFile);
        if (base64Image) {
          imageUrl = base64Image;
        } else {
          showError("Gagal menyimpan gambar. Silakan coba lagi.");
          setIsUploading(false);
          return;
        }
      }
      
      const galleryData: CreateGalleryImage & { slug?: string } = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category.trim(),
        photographer: formData.photographer.trim() || 'Admin',
        image_url: imageUrl || editingImage?.image_url || '',
        status: formData.status,
        featured: formData.featured,
        slug: generateSlug(formData.title.trim())
      };

      let success = false;
      
      if (editingImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update(galleryData)
          .eq('id', editingImage.id);
          
        if (!error) {
          success = true;
          showSuccess("Foto galeri berhasil diperbarui!");
        } else {
          console.error('❌ Update error:', error);
          showError("Gagal memperbarui foto galeri.");
        }
      } else {
        // Create new image
        const { error } = await supabase
          .from('gallery_images')
          .insert([galleryData]);
          
        if (!error) {
          success = true;
          showSuccess("Foto galeri berhasil ditambahkan!");
        } else {
          console.error('❌ Insert error:', error);
          showError("Gagal menambahkan foto galeri.");
        }
      }

      if (success) {
        setIsModalOpen(false);
        resetForm();
        loadGalleryImages();
      }
    } catch (error) {
      console.error("Error saving gallery image:", error);
      showError("Terjadi kesalahan saat menyimpan foto galeri.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      description: image.description,
      location: image.location,
      category: image.category,
      photographer: image.photographer,
      image_url: image.image_url.startsWith('data:image/') ? '' : image.image_url,
      status: image.status,
      featured: image.featured
    });
    
    // Set image preview
    setImagePreview(image.image_url);
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await showConfirm(
      "Hapus Foto Galeri",
      "Apakah Anda yakin ingin menghapus foto ini dari galeri?",
      "Ya, Hapus",
      "Batal"
    );

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('gallery_images')
          .delete()
          .eq('id', id);

        if (!error) {
          showSuccess("Foto galeri berhasil dihapus!");
          loadGalleryImages();
        } else {
          console.error('❌ Delete error:', error);
          showError("Gagal menghapus foto galeri.");
        }
      } catch (error) {
        console.error("Error deleting gallery image:", error);
        showError("Terjadi kesalahan saat menghapus foto galeri.");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      location: "",
      category: "",
      photographer: "",
      image_url: "",
      status: "draft",
      featured: false
    });
    setEditingImage(null);
    setSelectedFile(null);
    setImagePreview("");
  };

  const openModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Fungsi untuk export data galeri
  const exportGalleryData = () => {
    try {
      const dataStr = JSON.stringify(galleryImages, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `gallery-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showSuccess('Data galeri berhasil di-export!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Gagal export data galeri.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat galeri komunitas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-secondary">Kelola Galeri Komunitas</h1>
              <p className="text-muted-foreground">Kelola foto-foto kegiatan dan wisata NTB</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={exportGalleryData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={openModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Foto
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Camera className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{galleryImages.length}</p>
                  <p className="text-sm text-muted-foreground">Total Foto</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{galleryImages.filter(img => img.status === 'published').length}</p>
                  <p className="text-sm text-muted-foreground">Published</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <EyeOff className="h-8 w-8 text-gray-400" />
                <div>
                  <p className="text-2xl font-bold">{galleryImages.filter(img => img.status === 'draft').length}</p>
                  <p className="text-sm text-muted-foreground">Draft</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Filter className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{[...new Set(galleryImages.map(img => img.category))].length}</p>
                  <p className="text-sm text-muted-foreground">Kategori</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryImages.map((image) => (
            <Card key={image.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="aspect-square overflow-hidden rounded-lg mb-4 relative">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {image.featured && (
                      <Badge variant="secondary" className="text-xs bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    )}
                    <Badge variant={image.status === 'published' ? 'default' : 'secondary'} className="text-xs">
                      {image.status === 'published' ? 'Published' : 'Draft'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="text-xs bg-white/90 text-gray-700">
                      {image.category}
                    </Badge>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                    {image.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" />
                    {image.location}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                  {image.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Foto: {image.photographer}</span>
                  <span>{formatDate(image.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(image)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(image.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {galleryImages.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Belum ada foto yang ditambahkan ke galeri.
            </p>
            <Button onClick={openModal} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Foto Pertama
            </Button>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-secondary">
                    {editingImage ? "Edit Foto Galeri" : "Tambah Foto Galeri"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Judul Foto *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Masukkan judul foto"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Lokasi *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="Contoh: Mataram, NTB"
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
                      placeholder="Deskripsi foto atau cerita di balik foto ini"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="photographer">Photographer</Label>
                      <Input
                        id="photographer"
                        value={formData.photographer}
                        onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                        placeholder="Nama photographer (default: Admin)"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Upload Foto</Label>
                    <div className="space-y-3">
                      {/* Hidden file input */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      
                      {/* Drag & Drop Area */}
                      <div
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={isUploading ? undefined : triggerFileInput}
                        className={`
                          border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
                          ${isUploading 
                            ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
                            : selectedFile || imagePreview 
                              ? 'border-primary bg-primary/5 cursor-pointer' 
                              : 'border-gray-300 hover:border-primary hover:bg-primary/5 cursor-pointer'
                          }
                        `}
                      >
                        {isUploading ? (
                          <div className="space-y-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                            <p className="text-sm font-medium text-primary">
                              Uploading...
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Mohon tunggu sebentar
                            </p>
                          </div>
                        ) : selectedFile || imagePreview ? (
                          <div className="space-y-2">
                            <ImageIcon className="h-8 w-8 mx-auto text-primary" />
                            <p className="text-sm font-medium text-primary">
                              {selectedFile ? selectedFile.name : 'Foto dipilih'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Klik untuk ganti foto atau drag & drop
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                            <p className="text-sm font-medium">
                              Klik untuk pilih foto atau drag & drop
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JPG, PNG, WebP, GIF (max 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Image preview */}
                      {(imagePreview || selectedFile) && (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setSelectedFile(null);
                              setImagePreview("");
                              setFormData(prev => ({ ...prev, image_url: "" }));
                            }}
                            className="absolute top-2 right-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      
                      {/* File info */}
                      <div className="text-xs text-muted-foreground">
                        <p>Format yang didukung: JPG, PNG, WebP, GIF</p>
                        <p>Ukuran maksimal: 5MB</p>
                        <p className="text-blue-600">💾 Foto akan disimpan sebagai base64</p>
                      </div>
                      
                      {/* URL input as fallback */}
                      <div>
                        <Label htmlFor="image_url" className="text-sm text-muted-foreground">
                          Atau masukkan URL foto
                        </Label>
                        <Input
                          id="image_url"
                          value={formData.image_url}
                          onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                          placeholder="https://example.com/image.jpg"
                          disabled={!!selectedFile}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value: "draft" | "published") => 
                          setFormData(prev => ({ ...prev, status: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="featured">Featured</Label>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={isUploading}
                      className="flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Menyimpan...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {editingImage ? "Update Foto" : "Simpan Foto"}
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={closeModal}>
                      Batal
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGallery;
