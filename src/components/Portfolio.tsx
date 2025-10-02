import { useState, useMemo } from "react";
import { Eye, Filter, ArrowRight, MapPin } from "lucide-react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  // Data gambar NTB dari Unsplash
  const ntbImages = [
    {
      id: "1",
      title: "Gunung Rinjani",
      location: "Lombok",
      category: "Alam",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "2", 
      title: "Pantai Pink Lombok",
      location: "Lombok Timur",
      category: "Pantai",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=1000&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "3",
      title: "Gili Trawangan",
      location: "Gili Islands",
      category: "Pulau",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "4",
      title: "Air Terjun Sendang Gile",
      location: "Lombok Utara",
      category: "Alam",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "5",
      title: "Pantai Kuta Lombok",
      location: "Lombok Selatan",
      category: "Pantai",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "6",
      title: "Kampung Sasak",
      location: "Lombok Tengah",
      category: "Budaya",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "7",
      title: "Danau Segara Anak",
      location: "Gunung Rinjani",
      category: "Alam",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "8",
      title: "Gili Meno",
      location: "Gili Islands",
      category: "Pulau",
      imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=800&fit=crop",
      photographer: "Unsplash"
    },
    {
      id: "9",
      title: "Taman Nasional Gunung Rinjani",
      location: "Lombok",
      category: "Alam",
      imageUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
      photographer: "Unsplash"
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

  // Handler untuk melihat gambar detail
  const handleViewImage = (image: { imageUrl: string }) => {
    window.open(image.imageUrl, '_blank', 'noopener,noreferrer');
  };

  // Handler untuk tombol Lihat Galeri Lainnya
  const handleViewAllGallery = () => {
    window.open('https://unsplash.com/s/photos/lombok-indonesia', '_blank', 'noopener,noreferrer');
  };



  return (
    <section id="gallery" className="py-12 sm:py-16 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3 sm:mb-4">
            <Filter className="w-4 h-4" />
            Masonry Gallery
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-secondary mb-3 sm:mb-4 leading-tight">
            Masonry Gallery
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-0">
            Jelajahi keindahan Nusa Tenggara Barat dalam galeri foto masonry
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
                  
                  {/* Overlay with Button */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="absolute bottom-4 left-0 right-0 p-3 sm:p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <button 
                        onClick={() => handleViewImage(image)}
                        className="group/btn relative w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-2 sm:py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                      >
                        {/* Background Animation */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
                        
                        {/* Content */}
                        <div className="relative flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                          <span className="text-sm">Lihat Detail</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full">
                      {image.category}
                    </span>
                  </div>

                  {/* Location Badge */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                    <span className="inline-block px-2 sm:px-3 py-1 text-xs font-semibold text-white bg-secondary/90 backdrop-blur-sm rounded-full flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {image.location}
                    </span>
                  </div>
                </div>

                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 sm:p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-1 mb-1">
                    {image.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-xs line-clamp-1 flex-1 mr-2">
                      {image.location}
                    </p>
                    <p className="text-white/80 text-xs flex-shrink-0">
                      {image.photographer}
                    </p>
                  </div>
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
            <span className="text-sm sm:text-base">Lihat Galeri Lainnya</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;