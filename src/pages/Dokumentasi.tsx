import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Filter, Search, MapPin, User, Calendar, ArrowLeft, Grid, List } from "lucide-react";
import { supabase } from "../lib/supabase";
import { getPortfolioImageWithFallback } from "../lib/portfolioImageService";
import type { Gallery } from "../lib/supabase";
import { Helmet } from "react-helmet-async";
import { getCurrentDomain } from "../lib/urlUtils";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dokumentasi = () => {
  const navigate = useNavigate();
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Load galleries from Supabase
  const loadGalleries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Loading galleries...");
      
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading galleries:', error);
        setError('Gagal memuat dokumentasi');
        return;
      }

      console.log("✅ Galleries loaded:", data?.length || 0, "items");
      setGalleries(data || []);
    } catch (err) {
      console.error('❌ Error loading galleries:', err);
      setError('Gagal memuat dokumentasi');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGalleries();
  }, [loadGalleries]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(galleries.map(img => img.category))];
    return ["All", ...uniqueCategories];
  }, [galleries]);

  // Filter and sort galleries
  const filteredGalleries = useMemo(() => {
    let filtered = galleries;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(gallery => gallery.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(gallery => 
        gallery.title.toLowerCase().includes(term) ||
        gallery.description?.toLowerCase().includes(term) ||
        gallery.location?.toLowerCase().includes(term) ||
        gallery.photographer?.toLowerCase().includes(term)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered = filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered = filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "title":
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [galleries, selectedCategory, searchTerm, sortBy]);

  // Handle gallery click
  const handleGalleryClick = (gallery: Gallery) => {
    navigate(`/dokumentasi/${gallery.slug}`);
  };

  return (
    <>
      <Helmet>
        <title>Dokumentasi Kegiatan - Dr. Ir. H. AGUS AMBO DJIWA, M.P.</title>
        <meta name="description" content="Dokumentasi lengkap kegiatan dan aktivitas Dr. Ir. H. AGUS AMBO DJIWA, M.P. sebagai anggota DPR RI dalam melayani masyarakat." />
        <meta name="keywords" content="dokumentasi, kegiatan, DPR, parlemen, aspirasi, Dr. Ir. H. AGUS AMBO DJIWA" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Dokumentasi Kegiatan - Dr. Ir. H. AGUS AMBO DJIWA, M.P." />
        <meta property="og:description" content="Dokumentasi lengkap kegiatan dan aktivitas Dr. Ir. H. AGUS AMBO DJIWA, M.P. sebagai anggota DPR RI dalam melayani masyarakat." />
        <meta property="og:url" content={`${getCurrentDomain()}/dokumentasi`} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={`${getCurrentDomain()}/public/logo.png`} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dokumentasi Kegiatan - Dr. Ir. H. AGUS AMBO DJIWA, M.P." />
        <meta name="twitter:description" content="Dokumentasi lengkap kegiatan dan aktivitas Dr. Ir. H. AGUS AMBO DJIWA, M.P. sebagai anggota DPR RI dalam melayani masyarakat." />
        <meta name="twitter:image" content={`${getCurrentDomain()}/public/logo.png`} />
      </Helmet>

      <div className="min-h-screen">
        <Header />
        
        {/* Page Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali ke Beranda</span>
                </button>
                <div className="h-6 w-px bg-border" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Dokumentasi Kegiatan</h1>
                  <p className="text-muted-foreground">Dokumentasi lengkap kegiatan Dr. Ir. H. AGUS AMBO DJIWA, M.P.</p>
                </div>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "grid" 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === "list" 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-background via-muted/20 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Filters */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari dokumentasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-primary text-white"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "title")}
                  className="px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Terbaru</option>
                  <option value="oldest">Terlama</option>
                  <option value="title">Judul A-Z</option>
                </select>
              </div>
            </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span>Memuat dokumentasi...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button 
                onClick={loadGalleries}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredGalleries.length === 0 && (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Filter className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchTerm || selectedCategory !== "All" ? "Tidak Ada Hasil" : "Belum Ada Dokumentasi"}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm || selectedCategory !== "All" 
                    ? "Coba ubah filter atau kata kunci pencarian" 
                    : "Dokumentasi kegiatan akan ditampilkan di sini setelah diupload melalui admin panel."
                  }
                </p>
              </div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && !error && filteredGalleries.length > 0 && (
            <div className={`${
              viewMode === "grid" 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }`}>
              {filteredGalleries.map((gallery) => (
                <div
                  key={gallery.id}
                  onClick={() => handleGalleryClick(gallery)}
                  className={`group cursor-pointer transition-all duration-300 hover:scale-105 ${
                    viewMode === "grid" 
                      ? "bg-white rounded-xl shadow-lg overflow-hidden border border-border" 
                      : "bg-white rounded-lg shadow-sm border border-border p-4 flex items-center gap-4"
                  }`}
                >
                  {viewMode === "grid" ? (
                    <>
                      {/* Grid View */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={gallery.image_url}
                          alt={gallery.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/public/logo.png';
                          }}
                        />
                        <div className="absolute top-3 left-3">
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-primary/90 backdrop-blur-sm rounded-full">
                            {gallery.category}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                          {gallery.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {gallery.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {gallery.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" strokeWidth={1.5} />
                              <span>{gallery.location}</span>
                            </div>
                          )}
                          {gallery.photographer && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{gallery.photographer}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(gallery.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* List View */}
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={gallery.image_url}
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/public/logo.png';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-foreground line-clamp-1">
                            {gallery.title}
                          </h3>
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-full ml-2 flex-shrink-0">
                            {gallery.category}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {gallery.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {gallery.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" strokeWidth={1.5} />
                              <span>{gallery.location}</span>
                            </div>
                          )}
                          {gallery.photographer && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{gallery.photographer}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(gallery.created_at).toLocaleDateString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Results Count */}
          {!loading && !error && filteredGalleries.length > 0 && (
            <div className="mt-8 text-center text-muted-foreground">
              <p>
                Menampilkan {filteredGalleries.length} dari {galleries.length} dokumentasi
                {selectedCategory !== "All" && ` dalam kategori "${selectedCategory}"`}
                {searchTerm && ` untuk "${searchTerm}"`}
              </p>
            </div>
          )}
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default Dokumentasi;
