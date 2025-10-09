import { useState, useMemo, useEffect, useCallback } from "react";
import { Filter, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getPortfolioImageWithFallback } from "../lib/portfolioImageService";
import type { Gallery } from "../lib/supabase";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hanya menggunakan data dari database Supabase

  // Load galleries from Supabase
  const loadGalleries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading galleries:', error);
        setError('Gagal memuat dokumentasi');
        return;
      }

      if (data) {
        setGalleries(data);
      }
    } catch (err) {
      console.error('Error loading galleries:', err);
      setError('Gagal memuat dokumentasi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGalleries();
  }, [loadGalleries]);

  // Update kategori yang dipilih
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Get unique categories dari data gallery database
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(galleries.map(img => img.category))];
    return ["All", ...uniqueCategories];
  }, [galleries]);

  // Filter gambar berdasarkan kategori yang dipilih
  const filteredImages = useMemo((): Gallery[] => {
    return selectedCategory === "All" 
      ? galleries 
      : galleries.filter(image => image.category === selectedCategory);
  }, [selectedCategory, galleries]);


  // Get image URL for gallery items
  const getImageUrl = useCallback(async (gallery: Gallery) => {
    if (gallery.image_url) {
      try {
        return await getPortfolioImageWithFallback(gallery.image_url);
      } catch (error) {
        console.error('Error loading image:', error);
        return '/public/logo.png'; // Fallback image
      }
    }
    return '/public/logo.png';
  }, []);

  // Handler untuk tombol Lihat Galeri Lainnya
  const handleViewAllGallery = () => {
    // Navigate to dokumentasi page
    window.location.href = '/dokumentasi';
  };



  return (
    <section id="gallery" className="py-12 sm:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
            <Filter className="w-4 h-4" />
            Gallery
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4 leading-tight">
            Gallery Kegiatan
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-0">
            Dokumentasi kegiatan dan aktivitas Dr. Ir. H. AGUS AMBO DJIWA, M.P.
 dalam melayani masyarakat
          </p>
        </div>

        {/* Filter Categories */}
        <div className="mb-6 sm:mb-8">
          {/* Desktop: Flex wrap */}
          <div className="hidden md:flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-card text-muted-foreground hover:bg-muted border border-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Mobile: Swipeable */}
          <div className="md:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 sm:gap-3 px-3 sm:px-4 py-2 min-w-max">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 sm:px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-primary text-white shadow-lg shadow-primary/25"
                      : "bg-card text-muted-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Memuat dokumentasi...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-500 text-base sm:text-lg mb-4">
              {error}
            </p>
            <button 
              onClick={loadGalleries}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {/* Masonry Gallery */}
        {!loading && !error && filteredImages.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Filter className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Belum Ada Dokumentasi
              </h3>
              
            </div>
          </div>
        )}

        {!loading && !error && filteredImages.length > 0 && (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {filteredImages.map((gallery) => {
              // Semua data sekarang dari database Supabase
              const imageUrl = gallery.image_url;
              const title = gallery.title;
              const category = gallery.category;
              const photographer = gallery.photographer;
              const location = gallery.location;

              return (
                <div 
                  key={gallery.id}
                  className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mb-4 sm:mb-6 break-inside-avoid"
                  onMouseEnter={() => setHoveredImage(gallery.id)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/public/logo.png';
                      }}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full">
                        {category}
                      </span>
                    </div>

                  </div>

                  {/* Image Info */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                      {title}
                    </h3>
                    {photographer && (
                      <p className="text-white/80 text-xs mb-1">
                        {photographer}
                      </p>
                    )}
                    {location && (
                      <p className="text-white/70 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" strokeWidth={1.5} />
                        {location}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-6 sm:mt-8">
          <div 
            onClick={handleViewAllGallery}
            className="inline-flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            <span className="text-sm sm:text-base">Lihat Semua Foto</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;