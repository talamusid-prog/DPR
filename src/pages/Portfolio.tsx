import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye,
  MapPin,
  Camera,
  ArrowRight
} from "lucide-react";
import { getPublishedGalleryImages, getGalleryImagesByCategory } from "@/lib/galleryService";
import { GalleryImage } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Portfolio = () => {
  const navigate = useNavigate();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Fungsi untuk handle view image
  const handleViewImage = (image: GalleryImage) => {
    window.open(image.image_url, '_blank', 'noopener,noreferrer');
  };

  // Fungsi untuk handle view more
  const handleViewMore = () => {
    window.open('https://unsplash.com/s/photos/lombok-indonesia', '_blank', 'noopener,noreferrer');
  };

  const filterImages = useCallback(() => {
    let filtered = galleryImages;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(image =>
        image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        image.photographer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(image => image.category === selectedCategory);
    }

    setFilteredImages(filtered);
  }, [galleryImages, searchQuery, selectedCategory]);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  useEffect(() => {
    filterImages();
  }, [filterImages]);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      console.log('📄 [GALLERY PAGE] Loading published gallery images...');
      const data = await getPublishedGalleryImages();
      console.log('📄 [GALLERY PAGE] Published gallery images loaded:', data.length, 'items');
      
      setGalleryImages(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(img => img.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("❌ [GALLERY PAGE] Error loading gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat galeri komunitas...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Helmet>
        {/* Basic Meta Tags */}
        <title>Galeri IKKBG Pasangkayu | Menjaga Warisan, Membangun Masa Depan</title>
        <meta name="description" content="Jelajahi galeri foto komunitas pemuda Nusa Tenggara Barat. Lihat keindahan alam, budaya, dan kegiatan komunitas dalam koleksi foto gallery kami." />
        <meta name="keywords" content="galeri, foto, IKKBG Pasangkayu, Nusa Tenggara Barat, budaya, alam, pantai, Lombok, galeri masonry" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Galeri IKKBG Pasangkayu | Menjaga Warisan, Membangun Masa Depan" />
        <meta property="og:description" content="Jelajahi galeri foto komunitas pemuda Nusa Tenggara Barat. Lihat keindahan alam, budaya, dan kegiatan komunitas dalam koleksi foto gallery kami." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://komunitaspemudantb.org/portfolio" />
        <meta property="og:site_name" content="IKKBG Pasangkayu" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Open Graph Image - Default gallery image */}
        <meta property="og:image" content="https://komunitaspemudantb.org/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Galeri IKKBG Pasangkayu" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:secure_url" content="https://komunitaspemudantb.org/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Galeri IKKBG Pasangkayu | Menjaga Warisan, Membangun Masa Depan" />
        <meta name="twitter:description" content="Jelajahi galeri foto komunitas pemuda Nusa Tenggara Barat. Lihat keindahan alam, budaya, dan kegiatan komunitas dalam koleksi foto gallery kami." />
        <meta name="twitter:image" content="https://komunitaspemudantb.org/logo.png" />
        <meta name="twitter:site" content="@komunitaspemudantb" />
        <meta name="twitter:creator" content="@komunitaspemudantb" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://komunitaspemudantb.org/portfolio" />
      </Helmet>
      <Header onLogoClick={() => navigate('/')} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            Galeri Komunitas
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Galeri Masonry IKKBG Pasangkayu
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Jelajahi keindahan Nusa Tenggara Barat dan kegiatan komunitas dalam galeri foto masonry
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Cari foto galeri..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 border-border focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan {filteredImages.length} dari {galleryImages.length} foto galeri
          </p>
        </div>

        {/* Masonry Gallery */}
        {filteredImages.length > 0 ? (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {filteredImages.map((image, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mb-4 sm:mb-6 break-inside-avoid cursor-pointer"
                  onClick={() => handleViewImage(image)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Overlay with Buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-0 right-0 p-3 sm:p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewImage(image);
                        }}
                        className="group/btn relative w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 sm:py-3 px-2 sm:px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        <div className="relative flex items-center justify-center gap-1 sm:gap-2">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                          <span className="text-xs sm:text-sm">Lihat Detail</span>
                        </div>
                      </button>
                    </div>
                  </div>
                  {/* Location Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4 max-w-[120px] sm:max-w-[140px]">
                    <span className="inline-flex items-center gap-1 px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full truncate w-full">
                      <MapPin className="w-3 h-3" />
                      {image.location}
                    </span>
                  </div>
                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 max-w-[100px] sm:max-w-[120px]">
                    <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-secondary/90 backdrop-blur-sm rounded-full truncate w-full">
                      {image.category}
                    </span>
                  </div>
                  {/* Image Title */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                      {image.title}
                    </h3>
                    <p className="text-white/80 text-xs line-clamp-1">
                      Photographer: {image.photographer}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="text-center mt-6 sm:mt-8">
              <div
                onClick={handleViewMore}
                className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                <span className="text-sm sm:text-base">Lihat Galeri Lainnya</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Tidak ada foto galeri ditemukan
            </h3>
            <p className="text-muted-foreground mb-4">
              Coba ubah kata kunci pencarian atau pilih kategori yang berbeda
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Portfolio;
