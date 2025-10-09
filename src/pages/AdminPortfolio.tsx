import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Portfolio } from "@/lib/supabase";
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
  Star,
  StarOff,
  ArrowLeft,
  Save,
  X,
  Upload,
  Image as ImageIcon,
  Download
} from "lucide-react";
import { getAllPortfolios, createPortfolioWithSlug, updatePortfolioBySlug, deletePortfolio } from "@/lib/portfolioService";
import { savePortfolioImage, getPortfolioImage, savePortfolioImageToPublic } from "@/lib/portfolioImageService";
import { Gallery, CreateGallery } from "@/lib/supabase";
import { 
  getAllGalleries, 
  createGallery, 
  updateGallery, 
  deleteGallery,
  getGalleryCategories,
  generateSlug,
  validateImageFile,
  fileToBase64
} from "@/lib/galleryService";
import { supabase } from "@/lib/supabase";
import { showSuccess, showError, showWarning, showConfirm } from "@/lib/sweetAlert";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// Component untuk menangani async image loading
const PortfolioImage = ({ gallery, getImageFromLocal }: { 
  gallery: Gallery; 
  getImageFromLocal: (imageKey: string) => Promise<string | null>;
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (gallery.image_url) {
        if (gallery.image_url.startsWith('data:image/')) {
          setImageSrc(gallery.image_url);
        } else if (gallery.image_url.startsWith('portfolio-image-')) {
          const localImage = await getImageFromLocal(gallery.image_url);
          setImageSrc(localImage || '');
        } else {
          setImageSrc(gallery.image_url);
        }
      }
      setLoading(false);
    };

    loadImage();
  }, [gallery.image_url, getImageFromLocal]);

  if (loading) {
    return (
      <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={gallery.title}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    />
  );
};

const AdminPortfolio = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
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

  const [categories, setCategories] = useState<string[]>([]);


  // Load galleries
  const loadGalleries = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllGalleries();
      setGalleries(data);
    } catch (error) {
      console.error('Error loading galleries:', error);
      showError('Gagal memuat gallery');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories
  const loadCategories = useCallback(async () => {
    try {
      const data = await getGalleryCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }, []);

  // Fungsi untuk menyimpan gambar menggunakan service baru
  const saveImageToLocal = async (file: File): Promise<string | null> => {
    // Gunakan sistem public folder
    const result = await savePortfolioImageToPublic(file);
    return result;
  };

  // Fungsi untuk mengambil gambar dari storage
  const getImageFromLocal = async (imageKey: string): Promise<string | null> => {
    try {
      // Check if it's already a base64 data URL (seperti blog)
      if (imageKey.startsWith('data:image/')) {
        return imageKey;
      }
      
      const image = await getPortfolioImage(imageKey);
      return image;
    } catch (error) {
      console.error('❌ Error getting image from storage:', error);
      return null;
    }
  };

  // Fungsi untuk handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi file menggunakan service
      const validation = validateImageFile(file);
      if (!validation.valid) {
        showError(validation.error || 'File tidak valid');
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

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      const data = await getAllPortfolios();
      setGalleries(data);
      // Cleanup unused local images after loading portfolios
      setTimeout(() => cleanupUnusedLocalImages(), 100);
    } catch (error) {
      console.error("❌ Error loading portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      showWarning("Judul dan deskripsi harus diisi!");
      return;
    }

    try {
      setIsUploading(true);
      
      let imageUrl = formData.image_url;
      
      // Save image to local storage if file is selected
      if (selectedFile) {
        const imageKey = await saveImageToLocal(selectedFile);
        if (imageKey) {
          imageUrl = imageKey; // Simpan key sebagai URL
        } else {
          console.error('❌ Failed to save image to local storage');
          showError("Gagal menyimpan gambar. Silakan coba lagi.");
          setIsUploading(false);
          return;
        }
      }
      
      const galleryData: CreateGallery = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: formData.category.trim() as 'Rapat DPR' | 'Reses Anggota DPR' | 'Kunjungan Kerja' | 'Penyerahan Bantuan' | 'Sosialisasi Program' | 'Konsultasi Publik' | 'Kegiatan Komisi' | 'Sidang Paripurna' | 'Hearing Publik' | 'Lainnya',
        photographer: formData.photographer.trim(),
        image_url: imageUrl || '',
        slug: generateSlug(formData.title.trim()),
        status: formData.status,
        featured: formData.featured
      };

      let success = false;
      
      if (editingGallery) {
        // Update existing gallery
        const result = await updateGallery(editingGallery.id, galleryData);
        if (result) {
          showSuccess("Dokumentasi berhasil diperbarui!");
          success = true;
        }
      } else {
        // Create new gallery
        const result = await createGallery(galleryData);
        if (result) {
          showSuccess("Dokumentasi berhasil dibuat!");
          success = true;
        }
      }

      if (success) {
        setIsModalOpen(false);
        resetForm();
        loadGalleries();
      } else {
        console.error('❌ Failed to save gallery');
        showError("Gagal menyimpan dokumentasi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saving gallery:", error);
      showError("Terjadi kesalahan saat menyimpan dokumentasi.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = async (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      location: gallery.location,
      category: gallery.category,
      photographer: gallery.photographer,
      image_url: gallery.image_url,
      status: gallery.status,
      featured: gallery.featured
    });
    // Set image preview if gallery has image
    if (gallery.image_url) {
      // Check if it's already a base64 data URL (seperti blog)
      if (gallery.image_url.startsWith('data:image/')) {
        setImagePreview(gallery.image_url);
      } else if (gallery.image_url.startsWith('portfolio-image-')) {
        const localImage = await getImageFromLocal(gallery.image_url);
        setImagePreview(localImage || "");
      } else {
        setImagePreview(gallery.image_url);
      }
    } else {
      setImagePreview("");
    }
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumentasi ini?")) {
      try {
        // Find gallery to get image_url
        const gallery = galleries.find(g => g.id === id);
        
        const success = await deleteGallery(id);
        if (success) {
          // Clean up local storage if image was stored locally
          if (gallery?.image_url?.startsWith('portfolio-image-')) {
            localStorage.removeItem(gallery.image_url);
          }
          
          showSuccess("Dokumentasi berhasil dihapus!");
          loadGalleries();
        } else {
          showError("Gagal menghapus dokumentasi.");
        }
      } catch (error) {
        console.error("Error deleting gallery:", error);
        showError("Terjadi kesalahan saat menghapus dokumentasi.");
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
    setEditingGallery(null);
    setSelectedFile(null);
    setImagePreview("");
  };

  // Fungsi untuk membersihkan local storage yang tidak terpakai
  const cleanupUnusedLocalImages = useCallback(() => {
    try {
      const keys = Object.keys(localStorage);
      const imageKeys = keys.filter(key => key.startsWith('portfolio-image-'));
      
      // Get all gallery image keys from database
      const portfolioImageKeys = galleries
        .map(g => g.image_url)
        .filter(img => img?.startsWith('portfolio-image-'));
      
      // Remove unused image keys
      imageKeys.forEach(key => {
        if (!portfolioImageKeys.includes(key)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error cleaning up local storage:', error);
    }
  }, [galleries]);

  useEffect(() => {
    loadGalleries();
    loadCategories();
    // Cleanup unused local images on component mount
    cleanupUnusedLocalImages();
  }, [cleanupUnusedLocalImages, loadGalleries, loadCategories]);

  // Fungsi untuk export data gallery dengan gambar
  const exportGalleryData = async () => {
    try {
      const exportData = await Promise.all(galleries.map(async (gallery) => {
        let imageData = null;
        if (gallery.image_url?.startsWith('portfolio-image-')) {
          imageData = await getImageFromLocal(gallery.image_url);
        }
        
        return {
          ...gallery,
          localImageData: imageData
        };
      }));
      
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `dokumentasi-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showSuccess('Data dokumentasi berhasil di-export!');
    } catch (error) {
      console.error('Error exporting data:', error);
      showError('Gagal export data dokumentasi.');
    }
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

  // Fungsi untuk membersihkan HTML tags dari deskripsi
  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat portofolio...</p>
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
              <h1 className="text-3xl font-bold text-secondary">Kelola Dokumentasi</h1>
              <p className="text-muted-foreground">Kelola dokumentasi kegiatan</p>
            </div>
          </div>
                     <div className="flex items-center gap-2">
            <Button onClick={exportGalleryData} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={openModal} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Tambah Dokumentasi
            </Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((gallery) => (
              <Card key={gallery.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  {gallery.image_url ? (
                    <div className="aspect-[3/2] overflow-hidden rounded-lg mb-4">
                                                                     <PortfolioImage 
                          gallery={gallery}
                          getImageFromLocal={getImageFromLocal}
                        />
                    </div>
                  ) : (
                    <div className="aspect-[3/2] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center rounded-lg mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <Eye className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  )}
                  <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-2">
                      {gallery.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Lokasi: {gallery.location}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Pencatat: {gallery.photographer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {gallery.featured && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    {gallery.status === 'published' ? (
                      <Eye className="h-4 w-4 text-green-500" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                  {stripHtmlTags(gallery.description)}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="text-xs">
                    {gallery.category}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span>Dibuat: {formatDate(gallery.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(gallery)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(gallery.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {galleries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              Belum ada dokumentasi yang dibuat.
            </p>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-secondary">
                    {editingGallery ? "Edit Dokumentasi" : "Tambah Dokumentasi"}
                  </h2>
                  <Button variant="ghost" size="sm" onClick={closeModal}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
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
                        placeholder="Lokasi pengambilan foto"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Deskripsi *</Label>
                    <div className="ckeditor-wrapper">
                      <style>
                        {`
                          .ckeditor-wrapper .ck-editor__editable {
                            min-height: 200px;
                            max-height: 400px;
                            overflow-y: auto;
                          }
                          .ckeditor-wrapper .ck-editor__editable ol {
                            list-style: none;
                            counter-reset: item;
                            padding-left: 0;
                          }
                          .ckeditor-wrapper .ck-editor__editable ol li {
                            counter-increment: item;
                            margin-bottom: 0.5rem;
                            position: relative;
                            padding-left: 2rem;
                          }
                          .ckeditor-wrapper .ck-editor__editable ol li::before {
                            content: counter(item) ". ";
                            position: absolute;
                            left: 0;
                            font-weight: bold;
                          }
                          .ckeditor-wrapper .ck-editor__editable ul {
                            list-style: none;
                            padding-left: 0;
                          }
                          .ckeditor-wrapper .ck-editor__editable ul li {
                            margin-bottom: 0.5rem;
                            position: relative;
                            padding-left: 2rem;
                          }
                          .ckeditor-wrapper .ck-editor__editable ul li::before {
                            content: "• ";
                            position: absolute;
                            left: 0;
                            font-weight: bold;
                          }
                        `}
                      </style>
                      <CKEditor
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        editor={ClassicEditor as any}
                        data={formData.description}
                        config={{
                          toolbar: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'underline',
                            'strikethrough',
                            '|',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'blockQuote',
                            'link',
                            '|',
                            'undo',
                            'redo',
                            '|',
                            'pasteFromWord'
                          ],
                          heading: {
                            options: [
                              { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                              { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                              { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                              { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                            ]
                          },
                          removePlugins: ['PasteFromOfficeEnhanced']
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onReady={(editor: any) => {
                          console.log('Editor is ready to use!', editor);
                          
                          // Tambahkan event listener untuk membersihkan paste dari Word
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          editor.editing.view.document.on('paste', (evt: any, data: any) => {
                            if (data.dataTransfer.getData('text/html')) {
                              const html = data.dataTransfer.getData('text/html');
                              const cleanHtml = html
                                .replace(/<o:p[^>]*>/g, '')
                                .replace(/<\/o:p>/g, '')
                                .replace(/<w:WordDocument[^>]*>.*?<\/w:WordDocument>/gs, '')
                                .replace(/style="[^"]*"/g, '')
                                .replace(/class="[^"]*"/g, '')
                                .replace(/<span[^>]*>/g, '')
                                .replace(/<\/span>/g, '')
                                .replace(/<div[^>]*>/g, '<p>')
                                .replace(/<\/div>/g, '</p>');
                              
                              data.dataTransfer.setData('text/html', cleanHtml);
                            }
                          });
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onChange={(event: any, editor: any) => {
                          const data = editor.getData();
                          setFormData(prev => ({ 
                            ...prev, 
                            description: data
                          }));
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onBlur={(event: any, editor: any) => {
                          console.log('Blur.', editor);
                        }}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onFocus={(event: any, editor: any) => {
                          console.log('Focus.', editor);
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        placeholder="Web Development, Mobile App, dll"
                      />
                    </div>
                    <div>
                      <Label>Gambar Portfolio</Label>
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
                                {selectedFile ? selectedFile.name : 'Gambar dipilih'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Klik untuk ganti gambar atau drag & drop
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                              <p className="text-sm font-medium">
                                Klik untuk pilih gambar atau drag & drop
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
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                setSelectedFile(null);
                                setImagePreview("");
                                setFormData(prev => ({ ...prev, featured_image: "" }));
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
                           <p className="text-blue-600">💾 Gambar akan disimpan sebagai base64 (seperti blog)</p>
                         </div>
                        
                        {/* URL input as fallback */}
                        <div>
                          <Label htmlFor="image_url" className="text-sm text-muted-foreground">
                            Atau masukkan URL gambar
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
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rapat">Rapat</SelectItem>
                          <SelectItem value="Reses">Reses</SelectItem>
                          <SelectItem value="Kunjungan">Kunjungan</SelectItem>
                          <SelectItem value="Bantuan">Bantuan</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="photographer">Pencatat/Dokumentasi *</Label>
                      <Input
                        id="photographer"
                        value={formData.photographer}
                        onChange={(e) => setFormData(prev => ({ ...prev, photographer: e.target.value }))}
                        placeholder="Nama pencatat dokumentasi"
                        required
                      />
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
                          {editingGallery ? "Update Dokumentasi" : "Simpan Dokumentasi"}
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

export default AdminPortfolio;
