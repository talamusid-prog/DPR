import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Calendar, 
  Eye, 
  Tag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { getPublishedPosts } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;



  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    filterAndSortPosts();
  }, [posts, searchTerm, selectedTag, sortBy]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await getPublishedPosts();
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPosts = () => {
    let filtered = [...posts];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by tag/category
    if (selectedTag && selectedTag !== "all") {
      filtered = filtered.filter(post =>
        post.tags?.some(tag => tag === selectedTag)
      );
    }

    // Sort posts
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.published_at).getTime() - new Date(b.published_at).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit`;
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  };

  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // Function to reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedTag("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat artikel...</p>
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
        <title>Blog & Artikel | Idea Digital Creative</title>
        <meta name="description" content="Temukan artikel menarik seputar teknologi, bisnis, dan tips pengembangan website dari Idea Digital Creative" />
        <meta name="keywords" content="blog, artikel, teknologi, bisnis, website, development, tips" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Blog & Artikel | Idea Digital Creative" />
        <meta property="og:description" content="Temukan artikel menarik seputar teknologi, bisnis, dan tips pengembangan website dari Idea Digital Creative" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ideadigiralcreative.com/blog" />
        <meta property="og:site_name" content="Idea Digital Creative" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Open Graph Image - Default blog image */}
        <meta property="og:image" content="https://ideadigiralcreative.com/public/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Blog & Artikel Idea Digital Creative" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content="https://ideadigiralcreative.com/public/logo.png" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog & Artikel | Idea Digital Creative" />
        <meta name="twitter:description" content="Temukan artikel menarik seputar teknologi, bisnis, dan tips pengembangan website dari Idea Digital Creative" />
        <meta name="twitter:image" content="https://ideadigiralcreative.com/public/logo.png" />
        <meta name="twitter:site" content="@Komunitas Lombok Pasangkayu" />
        <meta name="twitter:creator" content="@Komunitas Lombok Pasangkayu" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://ideadigiralcreative.com/blog" />
      </Helmet>
      <Header onLogoClick={() => navigate('/')} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Button>
          
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
            Blog & Artikel
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Temukan artikel menarik seputar teknologi, bisnis, dan tips pengembangan website
          </p>
        </div>

                          {/* Search and Filter Section */}
         <div className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg rounded-lg p-6 mb-8">
           <div className="grid md:grid-cols-1 gap-4">
             {/* Search */}
             <div>
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Cari artikel..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10"
                 />
               </div>
             </div>
           </div>
         </div>



                 {/* Artikel Terbaru Section */}
         <div className="mb-8">
           <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-4">
               <h2 className="text-2xl font-bold text-secondary">
                 Artikel Terbaru
               </h2>
               {/* Filter Indicator */}
               {(selectedTag !== "all" || searchTerm) && (
                 <div className="flex items-center gap-2">
                   <Badge variant="default" className="text-xs">
                     {selectedTag !== "all" ? `Kategori: ${selectedTag}` : ""}
                     {searchTerm ? `Pencarian: "${searchTerm}"` : ""}
                   </Badge>
                   <Button 
                     variant="ghost" 
                     size="sm"
                     onClick={resetFilters}
                     className="text-xs text-muted-foreground hover:text-primary"
                   >
                     Hapus Filter
                   </Button>
                 </div>
               )}
             </div>
             <Button 
               variant="outline" 
               size="sm"
               className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
             >
               Lihat Lainnya
             </Button>
           </div>

                     {/* Articles Grid */}
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             {getCurrentPagePosts().map((post) => (
               <Card 
                 key={post.id} 
                 className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20 cursor-pointer"
                 onClick={() => navigate(`/blog/${post.slug}`)}
               >
                {/* Thumbnail */}
                {post.featured_image ? (
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-2">
                        <Tag className="h-6 w-6 text-white" />
                      </div>
                      <p className="text-muted-foreground text-sm font-medium">Artikel</p>
                    </div>
                  </div>
                )}

                                 <CardContent className="p-4">

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {post.tags.slice(0, 1).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                                     {/* Title */}
                   <h3 className="font-semibold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                     {post.title}
                   </h3>

                   {/* Excerpt */}
                   <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                     {post.excerpt}
                   </p>

                   {/* Meta Information */}
                   <div className="flex items-center justify-between text-xs text-muted-foreground">
                     <span className="flex items-center gap-1">
                       <Calendar className="h-3 w-3" />
                       {formatDate(post.published_at)}
                     </span>
                     <span className="flex items-center gap-1">
                       <Eye className="h-3 w-3" />
                       {post.views || 0}
                     </span>
                   </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {getCurrentPagePosts().length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-secondary mb-2">
                Tidak ada artikel ditemukan
              </h3>
              <p className="text-muted-foreground">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Sebelumnya
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        
      </div>
      
      <Footer />
    </div>
  );
};

export default Blog;
