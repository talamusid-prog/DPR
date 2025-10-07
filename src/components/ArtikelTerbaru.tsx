import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublishedPosts } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";

const ArtikelTerbaru = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getPublishedPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Dummy data untuk fallback
  const dummyPosts = [
    {
      id: 1,
      title: "Keberadaan KEK Sanur Harus Seiring dengan Identitas Sejarah dan Budaya Bali",
      excerpt: "Pembangunan Kawasan Ekonomi Khusus (KEK) Sanur harus memperhatikan aspek sejarah dan budaya Bali yang kental.",
      created_at: "2025-10-06",
      slug: "keberadaan-kek-sanur"
    },
    {
      id: 2,
      title: "TNI tidak boleh Terjebak Struktur Usang",
      excerpt: "TNI harus terus beradaptasi dengan perkembangan zaman dan teknologi modern.",
      created_at: "2025-10-06",
      slug: "tni-tidak-boleh-terjebak-struktur"
    },
    {
      id: 3,
      title: "Legislator NasDem: Pelayanan Harus Relevan",
      excerpt: "Pelayanan Harus Relevan dengan kebutuhan masyarakat dan terus ditingkatkan kualitasnya.",
      created_at: "2025-10-06",
      slug: "legislator-nasdem-pelayanan-harus-relevan"
    },
    {
      id: 4,
      title: "Muslim Ayub Minta Usut Tuntas Dugaan Pelanggaran HAM",
      excerpt: "Usut Tuntas Dugaan Pelanggaran HAM di berbagai daerah untuk menegakkan keadilan.",
      created_at: "2025-10-06",
      slug: "muslim-ayub-minta-usut-tuntas"
    },
    {
      id: 5,
      title: "Legislator NasDem Perkuat Pelaku Ekonomi Kreatif",
      excerpt: "Perkuat Pelaku Ekonomi Kreatif untuk mendorong pertumbuhan ekonomi daerah.",
      created_at: "2025-10-06",
      slug: "legislator-nasdem-perkuat-pelaku-ekonomi-kreatif"
    }
  ];

  const displayPosts = posts.length > 0 ? posts : dummyPosts;
  
  // Transform posts data to artikel format
  const artikelData = displayPosts.slice(0, 5).map((post, index) => ({
    id: post.id,
    number: String(index + 1).padStart(2, '0'),
    date: new Date(post.created_at).toLocaleDateString('id-ID', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }),
    title: post.title,
    description: post.excerpt,
    slug: post.slug
  }));

  const [itemsPerSlide, setItemsPerSlide] = useState(5); // Responsive items per slide
  const totalSlides = 1; // Only one slide since we show all items

  // Effect untuk responsive items per slide
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(2); // Mobile: 2 cards
      } else if (window.innerWidth < 1024) {
        setItemsPerSlide(3); // Tablet: 3 cards
      } else {
        setItemsPerSlide(5); // Desktop: 5 cards
      }
    };

    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto slide functionality - continuous loop
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = prev + 1;
        // Reset to 0 when we reach the end of the first set
        if (next >= artikelData.length) {
          return 0;
        }
        return next;
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [artikelData.length]);

  return (
    <section 
      className="pt-4 pb-4 relative overflow-hidden min-h-[200px] sm:min-h-[250px]"
      style={{
        backgroundImage: 'url(/background2.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay untuk memastikan konten tetap terbaca */}
      <div className="absolute inset-0 bg-white/60"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-12">
          
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
          </div>
        )}

        {/* Carousel Container */}
        {!loading && artikelData.length > 0 && (
          <div className="relative">
            {/* Articles Grid */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-1000 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%)` }}
              >
                {/* Create infinite loop by duplicating items */}
                {[...artikelData, ...artikelData].map((artikel, index) => (
                <div 
                  key={`${artikel.id}-${index}`}
                  className={`flex-shrink-0 px-2 sm:px-3 ${
                    itemsPerSlide === 2 ? 'w-1/2' : 
                    itemsPerSlide === 3 ? 'w-1/3' : 
                    'w-1/5'
                  }`}
                >
                  <div 
                    className="bg-white rounded-lg border border-blue-600 transition-all duration-300 p-3 sm:p-4 flex h-28 sm:h-32 cursor-pointer hover:shadow-lg hover:scale-105 group" 
                    style={{
                      background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #1e40af, #3b82f6) border-box',
                      border: '1px solid transparent'
                    }}
                    onClick={() => navigate(`/blog/${artikel.slug}`)}
                  >
                    {/* Number - Moved to left side */}
                    <div className="flex-shrink-0 mr-2 sm:mr-3">
                      <div className="text-3xl sm:text-4xl font-bold italic text-transparent" 
                           style={{ 
                             WebkitTextStroke: '2px #3B82F6',
                             color: 'transparent'
                           }}>
                        {artikel.number}
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Date */}
                      <div className="text-xs text-gray-500 mb-1 sm:mb-2">
                        {artikel.date}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xs sm:text-sm font-bold text-blue-900 mb-1 sm:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {artikel.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-xs text-blue-700 line-clamp-2 group-hover:text-blue-800 transition-colors">
                        {artikel.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}

        {/* Empty State */}
        {!loading && artikelData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">Belum ada artikel tersedia.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default ArtikelTerbaru;
