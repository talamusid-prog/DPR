import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getPublishedPosts, getBlogImageUrl } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy data untuk demo
  const dummyPosts: BlogPost[] = useMemo(() => [
    {
      id: "1",
      title: "Keberadaan KEK Sanur Harus Seiring dengan Identitas Sejarah dan Budaya Bali",
      excerpt: "Pembangunan Kawasan Ekonomi Khusus (KEK) Sanur harus memperhatikan aspek sejarah dan budaya Bali yang kental.",
      content: "Konten lengkap artikel...",
      featured_image: "/berita1.jpg",
      author: "Admin",
      published_at: "2025-10-06T00:00:00Z",
      created_at: "2025-10-06T00:00:00Z",
      updated_at: "2025-10-06T00:00:00Z",
      slug: "keberadaan-kek-sanur",
      status: "published",
      views: 0,
      tags: ["KEK", "Sanur", "Bali"]
    },
    {
      id: "2",
      title: "BUMN Didorong Tingkatkan Kontribusi pada Pembangunan",
      excerpt: "Pemerintah mendorong BUMN untuk meningkatkan kontribusi dalam pembangunan nasional.",
      content: "Konten lengkap artikel...",
      featured_image: "/berita2.jpg",
      author: "Admin",
      published_at: "2025-10-06T00:00:00Z",
      created_at: "2025-10-06T00:00:00Z",
      updated_at: "2025-10-06T00:00:00Z",
      slug: "bumn-didorong-tingkatkan-kontribusi",
      status: "published",
      views: 0,
      tags: ["BUMN", "Pembangunan"]
    },
    {
      id: "3",
      title: "TNI tidak boleh Terjebak Struktur Usang tapi",
      excerpt: "TNI harus terus beradaptasi dengan perkembangan zaman dan tidak terjebak dalam struktur usang.",
      content: "Konten lengkap artikel...",
      featured_image: "/berita3.jpg",
      author: "Admin",
      published_at: "2025-10-06T00:00:00Z",
      created_at: "2025-10-06T00:00:00Z",
      updated_at: "2025-10-06T00:00:00Z",
      slug: "tni-tidak-boleh-terjebak-struktur",
      status: "published",
      views: 0,
      tags: ["TNI", "Struktur"]
    },
    {
      id: "4",
      title: "Legislator NasDem: Pelayanan Harus Relevan dengan",
      excerpt: "Legislator NasDem menekankan pentingnya pelayanan yang relevan dengan kebutuhan masyarakat.",
      content: "Konten lengkap artikel...",
      featured_image: "/berita4.jpg",
      author: "Admin",
      published_at: "2025-10-06T00:00:00Z",
      created_at: "2025-10-06T00:00:00Z",
      updated_at: "2025-10-06T00:00:00Z",
      slug: "legislator-nasdem-pelayanan-harus-relevan",
      status: "published",
      views: 0,
      tags: ["NasDem", "Pelayanan"]
    },
    {
      id: "5",
      title: "Muslim Ayub Minta Usut Tuntas Dugaan Pelanggaran HAM di",
      excerpt: "Muslim Ayub meminta agar dugaan pelanggaran HAM diselidiki secara tuntas.",
      content: "Konten lengkap artikel...",
      featured_image: "/berita5.jpg",
      author: "Admin",
      published_at: "2025-10-06T00:00:00Z",
      created_at: "2025-10-06T00:00:00Z",
      updated_at: "2025-10-06T00:00:00Z",
      slug: "muslim-ayub-minta-usut-tuntas",
      status: "published",
      views: 0,
      tags: ["HAM", "Muslim Ayub"]
    }
  ], []);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Preload dengan data dummy terlebih dahulu untuk UX yang lebih baik
      if (posts.length === 0) {
        setPosts(dummyPosts);
      }
      
      const data = await getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
      // Fallback ke dummy data jika error
      if (posts.length === 0) {
        setPosts(dummyPosts);
      }
    } finally {
      setLoading(false);
    }
  }, [posts.length, dummyPosts]);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const displayPosts = posts.length > 0 ? posts : dummyPosts;
  const featuredPost = displayPosts[0];
  const sidebarPosts = displayPosts.slice(1, 5);

  // Auto slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayPosts.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [displayPosts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayPosts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + displayPosts.length) % displayPosts.length);
  };



  return (
    <section id="blog" className="pt-12 pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            BERITA TERBARU
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
            Berita Terbaru
          </h2>
        </div>

        {/* Loading State */}
        {loading && posts.length === 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Loading Skeleton */}
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
            </div>
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-32 animate-pulse"></div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && displayPosts.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Featured Article - Left Column */}
            <div className="lg:col-span-2">
              <div className="relative">
                {/* Slide Container */}
                <div className="relative h-96 rounded-2xl overflow-hidden">
                  {displayPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`absolute inset-0 transition-opacity duration-500 ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <div 
                        className="relative group cursor-pointer h-full" 
                        onClick={() => navigate(`/blog/${post.slug}`)}
                      >
                              <img
                          src={post.featured_image ? getBlogImageUrl(post.featured_image, { width: 400, height: 300, quality: 80 }) : `/berita${index + 1}.jpg`}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                decoding="async"
                                onError={(e) => {
                                  console.warn('Image load error:', e.currentTarget.src);
                                  e.currentTarget.src = `/berita${index + 1}.jpg`;
                                }}
                              />
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                        
                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <div className="text-sm text-white/80 mb-2">
                            {new Date(post.created_at).toLocaleDateString('id-ID', { 
                              day: '2-digit', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                            </div>
                                  <h3 className="text-2xl lg:text-3xl font-bold text-red-300 leading-tight">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Pagination Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {displayPosts.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? 'bg-red-600' : 'bg-white border-2 border-gray-300'
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Articles - Right Column */}
            <div className="lg:col-span-1">
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {sidebarPosts.map((post, index) => (
                  <div 
                    key={post.id}
                    className={`flex gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer group transition-colors ${
                      index >= 2 ? 'hidden lg:flex' : ''
                    }`}
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                      <img
                        src={post.featured_image ? getBlogImageUrl(post.featured_image, { width: 80, height: 80, quality: 80 }) : `/berita${index + 2}.jpg`}
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          console.warn('Sidebar image load error:', e.currentTarget.src);
                          e.currentTarget.src = `/berita${index + 2}.jpg`;
                        }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Category Tag */}
                              <div className="inline-block px-2 py-1 bg-primary text-white text-xs font-medium rounded mb-2">
                        BERITA TERBARU
                      </div>
                      
                      {/* Title */}
                      <h4 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      
                      {/* Date */}
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('id-ID', { 
                          day: '2-digit', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* View All Button */}
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/blog')}
              variant="outline" 
              size="lg"
                    className="border-primary text-primary hover:bg-primary hover:text-white transition-colors px-8 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
            Lihat Semua Berita
            <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
      </div>
    </section>
  );
};

export default Blog;
