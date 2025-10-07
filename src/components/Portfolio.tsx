import { useState, useMemo } from "react";
import { Filter, ArrowRight } from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Data gambar dari folder gallery lokal
  const ntbImages = [
    {
      id: "1",
      title: "Rapat Komisi IX DPR RI",
      location: "",
      category: "Rapat",
      imageUrl: "/gallery/gallery (1).jpeg",
      photographer: "Gallery"
    },
    {
      id: "2", 
      title: "Reses Dapil NTB",
      location: "",
      category: "Reses",
      imageUrl: "/gallery/gallery (1).jpg",
      photographer: "Gallery"
    },
    {
      id: "3",
      title: "Kunjungan ke Masyarakat",
      location: "",
      category: "Kunjungan",
      imageUrl: "/gallery/gallery (2).jpeg",
      photographer: "Gallery"
    },
    {
      id: "4",
      title: "Bantuan Sosial Masyarakat",
      location: "",
      category: "Bantuan",
      imageUrl: "/gallery/gallery (2).jpg",
      photographer: "Gallery"
    },
    {
      id: "5",
      title: "Rapat Koordinasi Program",
      location: "",
      category: "Rapat",
      imageUrl: "/gallery/gallery (3).jpeg",
      photographer: "Gallery"
    },
    {
      id: "6",
      title: "Reses Konsultasi Masyarakat",
      location: "",
      category: "Reses",
      imageUrl: "/gallery/gallery (3).jpg",
      photographer: "Gallery"
    },
    {
      id: "7",
      title: "Kunjungan ke Instansi",
      location: "",
      category: "Kunjungan",
      imageUrl: "/gallery/gallery (4).jpeg",
      photographer: "Gallery"
    },
    {
      id: "8",
      title: "Bantuan Pendidikan",
      location: "",
      category: "Bantuan",
      imageUrl: "/gallery/gallery (5).jpeg",
      photographer: "Gallery"
    }
  ];

  // Update kategori yang dipilih
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Get unique categories dari data gambar
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(ntbImages.map(img => img.category))];
    return ["All", ...uniqueCategories];
  }, [ntbImages]);

  // Filter gambar berdasarkan kategori yang dipilih
  const filteredImages = useMemo(() => {
    return selectedCategory === "All" 
      ? ntbImages 
      : ntbImages.filter(image => image.category === selectedCategory);
  }, [selectedCategory, ntbImages]);


  // Handler untuk tombol Lihat Galeri Lainnya
  const handleViewAllGallery = () => {
    // Bisa diarahkan ke halaman gallery khusus atau modal
    console.log('View all gallery clicked');
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
            Dokumentasi kegiatan dan aktivitas Haerul Hadi dalam melayani masyarakat
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

        {/* Masonry Gallery */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-muted-foreground text-base sm:text-lg">
              Belum ada gambar yang tersedia.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {filteredImages.map((image) => (
              <div 
                key={image.id}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 mb-4 sm:mb-6 break-inside-avoid"
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  

                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full">
                      {image.category}
                    </span>
                  </div>

                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                    {image.title}
                  </h3>
                  <p className="text-white/80 text-xs">
                    {image.photographer}
                  </p>
                </div>
              </div>
            ))}
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