import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Star,
  Eye,
  Calendar,
  User,
  Tag
} from "lucide-react";
import { getPublishedPortfolios, getPortfoliosByCategory } from "@/lib/portfolioService";
import { getPortfolioImage, getPortfolioImageWithFallback } from "@/lib/portfolioImageService";
import { Portfolio as PortfolioType } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState<PortfolioType[]>([]);
  const [filteredPortfolios, setFilteredPortfolios] = useState<PortfolioType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);

  // Fungsi untuk membersihkan HTML tags dari deskripsi
  const stripHtmlTags = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '');
  };

  // Fungsi untuk mengambil gambar dari storage
  const getImageFromLocal = (imageKey: string): string | null => {
    try {
      return getPortfolioImage(imageKey);
    } catch (error) {
      console.error('❌ [PORTFOLIO PAGE] Error getting image from storage:', error);
      return null;
    }
  };

  useEffect(() => {
    loadPortfolios();
  }, []);

  useEffect(() => {
    filterPortfolios();
  }, [portfolios, searchQuery, selectedCategory]);

  const loadPortfolios = async () => {
    try {
      setLoading(true);
      console.log('📄 [PORTFOLIO PAGE] Loading published portfolios...');
      const data = await getPublishedPortfolios();
      console.log('📄 [PORTFOLIO PAGE] Published portfolios loaded:', data.length, 'items');
      
      // Log image keys for debugging
      data.forEach((portfolio, index) => {
        if (portfolio.featured_image) {
          console.log(`📄 [PORTFOLIO PAGE] Portfolio ${index + 1} (${portfolio.title}):`, {
            imageKey: portfolio.featured_image,
            isLocalStorage: portfolio.featured_image.startsWith('portfolio-image-'),
            hasImage: portfolio.featured_image.startsWith('portfolio-image-') 
              ? !!localStorage.getItem(portfolio.featured_image)
              : 'External URL'
          });
        }
      });
      
      setPortfolios(data);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("❌ [PORTFOLIO PAGE] Error loading portfolios:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPortfolios = () => {
    let filtered = portfolios;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(portfolio =>
        portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portfolio.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portfolio.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        portfolio.technologies.some(tech => 
          tech.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(portfolio => portfolio.category === selectedCategory);
    }

    setFilteredPortfolios(filtered);
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
            <p className="mt-4 text-muted-foreground">Memuat portofolio...</p>
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
        <title>Portofolio Proyek | Idea Digital Creative</title>
        <meta name="description" content="Kumpulan proyek-proyek terbaik yang telah kami kerjakan untuk berbagai klien. Lihat portofolio website, e-commerce, dan aplikasi web kami." />
        <meta name="keywords" content="portofolio, proyek, website, e-commerce, aplikasi web, development, klien" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Portofolio Proyek | Idea Digital Creative" />
        <meta property="og:description" content="Kumpulan proyek-proyek terbaik yang telah kami kerjakan untuk berbagai klien. Lihat portofolio website, e-commerce, dan aplikasi web kami." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ideadigiralcreative.com/portfolio" />
        <meta property="og:site_name" content="Idea Digital Creative" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Open Graph Image - Default portfolio image */}
        <meta property="og:image" content="https://ideadigiralcreative.com/public/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Portofolio Proyek Idea Digital Creative" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content="https://ideadigiralcreative.com/public/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Portofolio Proyek | Idea Digital Creative" />
        <meta name="twitter:description" content="Kumpulan proyek-proyek terbaik yang telah kami kerjakan untuk berbagai klien. Lihat portofolio website, e-commerce, dan aplikasi web kami." />
        <meta name="twitter:image" content="https://ideadigiralcreative.com/public/logo.png" />
        <meta name="twitter:site" content="@Komunitas Lombok Pasangkayu" />
        <meta name="twitter:creator" content="@Komunitas Lombok Pasangkayu" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ideadigiralcreative.com/portfolio" />
      </Helmet>
      <Header onLogoClick={() => navigate('/')} />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">
            Portofolio Proyek
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Kumpulan proyek-proyek terbaik yang telah kami kerjakan untuk berbagai klien
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
                  placeholder="Cari portofolio..."
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
            Menampilkan {filteredPortfolios.length} dari {portfolios.length} portofolio
          </p>
        </div>

        {/* Portfolio Grid */}
        {filteredPortfolios.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPortfolios.map((portfolio) => (
              <Card 
                key={portfolio.id} 
                className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20 cursor-pointer"
                onClick={() => navigate(`/portfolio/${portfolio.slug}`)}
              >
                <CardHeader className="pb-4">
                  {/* Featured Image */}
                  <div className="aspect-[3/2] overflow-hidden rounded-lg mb-4">
                    <img
                      src={(() => {
                        if (portfolio.featured_image) {
                          if (portfolio.featured_image.startsWith('portfolio-image-')) {
                            return getPortfolioImageWithFallback(portfolio.featured_image, portfolio.category, portfolio.title);
                          } else {
                            return portfolio.featured_image;
                          }
                        } else {
                          return getPortfolioImageWithFallback('', portfolio.category, portfolio.title);
                        }
                      })()}
                      alt={portfolio.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Title and Featured Badge */}
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
                      {portfolio.title}
                    </CardTitle>
                    {portfolio.featured && (
                      <Star className="h-5 w-5 text-yellow-500 fill-current flex-shrink-0 ml-2" />
                    )}
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{portfolio.client}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(portfolio.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Description */}
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                    {stripHtmlTags(portfolio.description)}
                  </p>

                  {/* Category */}
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {portfolio.category}
                    </Badge>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {portfolio.technologies.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {portfolio.technologies.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{portfolio.technologies.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {/* Tombol Demo dan Code dihapus */}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-secondary mb-2">
              Tidak ada portofolio ditemukan
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
