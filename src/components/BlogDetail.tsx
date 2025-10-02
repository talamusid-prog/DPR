import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  Eye,
  Share2,
  Bookmark,
  MessageCircle,
  TrendingUp,
  Flame,
  ChevronRight,
  Home
} from "lucide-react";
import { getPostBySlug, getPublishedPosts, getPopularPosts } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";
import Header from "./Header";
import Footer from "./Footer";
import { showSuccess } from "@/lib/sweetAlert";

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [popularTags, setPopularTags] = useState<{tag: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPost = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      if (!slug) {
        setError("Slug artikel tidak ditemukan");
        return;
      }

      const postData = await getPostBySlug(slug);
             if (postData) {
         setPost(postData);
         await loadRelatedPosts(postData);
         await loadPopularPosts();
         await loadPopularTags();
       } else {
         setError("Artikel tidak ditemukan");
       }
    } catch (error) {
      console.error("Error loading post:", error);
      setError("Terjadi kesalahan saat memuat artikel");
    } finally {
      setLoading(false);
    }
  }, [slug]); // Menambahkan slug sebagai dependency

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug, loadPost]); // Menambahkan loadPost ke dependency array

  // Scroll to top when post loads
  useEffect(() => {
    if (post && !loading) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post, loading]);

  // Scroll to top on component mount
  useEffect(() => {
    // Remove any hash from URL and scroll to top
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    window.scrollTo(0, 0);
  }, []);

  const loadRelatedPosts = async (currentPost: BlogPost) => {
    try {
      const allPosts = await getPublishedPosts();
      const related = allPosts
        .filter(p => p.id !== currentPost.id)
        .filter(p => 
          p.tags?.some(tag => 
            currentPost.tags?.includes(tag)
          ) || 
          p.author === currentPost.author
        )
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error("Error loading related posts:", error);
    }
  };

  const loadPopularPosts = async () => {
    try {
      const popular = await getPopularPosts(6);
      // Exclude current post from popular posts
      const filteredPopular = popular.filter(p => p.id !== post?.id);
      setPopularPosts(filteredPopular);
    } catch (error) {
      console.error("Error loading popular posts:", error);
    }
  };

  const loadPopularTags = async () => {
    try {
      const allPosts = await getPublishedPosts();
      const tagCounts: {[key: string]: number} = {};
      
      // Count tags from all posts
      allPosts.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
          });
        }
      });
      
      // Convert to array and sort by count
      const sortedTags = Object.entries(tagCounts)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tags
      
      setPopularTags(sortedTags);
    } catch (error) {
      console.error("Error loading popular tags:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(' ').length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} menit membaca`;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      showSuccess("Link artikel berhasil disalin!");
    }
  };

  const formatContentWithHeadings = (content: string) => {
    // Convert plain text to HTML with heading support
    let formattedContent = content
      // Convert heading patterns first (before paragraph wrapping)
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>');

    // Handle numbered lists (1. 2. 3. etc.)
    formattedContent = formattedContent
      // Find numbered list patterns and wrap them in <ol>
      .replace(/^(\d+\.\s+.+)(?:\n(\d+\.\s+.+))*$/gm, (match) => {
        const items = match.split('\n').filter(line => line.trim());
        const listItems = items.map(item => 
          item.replace(/^\d+\.\s+(.+)$/, '<li>$1</li>')
        ).join('');
        return `<ol>${listItems}</ol>`;
      });

    // Handle bullet lists (- * • etc.)
    formattedContent = formattedContent
      .replace(/^([-*•]\s+.+)(?:\n([-*•]\s+.+))*$/gm, (match) => {
        const items = match.split('\n').filter(line => line.trim());
        const listItems = items.map(item => 
          item.replace(/^[-*•]\s+(.+)$/, '<li>$1</li>')
        ).join('');
        return `<ul>${listItems}</ul>`;
      });

    // Handle mixed content with lists (better approach)
    formattedContent = formattedContent
      // Split content into blocks
      .split('\n\n')
      .map(block => {
        const lines = block.split('\n');
        
        // Check if this block is a numbered list
        if (lines.every(line => /^\d+\.\s+/.test(line.trim()))) {
          const listItems = lines.map(line => 
            line.replace(/^\d+\.\s+(.+)$/, '<li>$1</li>')
          ).join('');
          return `<ol>${listItems}</ol>`;
        }
        
        // Check if this block is a bullet list
        if (lines.every(line => /^[-*•]\s+/.test(line.trim()))) {
          const listItems = lines.map(line => 
            line.replace(/^[-*•]\s+(.+)$/, '<li>$1</li>')
          ).join('');
          return `<ul>${listItems}</ul>`;
        }
        
        // Return as regular paragraph
        return block;
      })
      .join('\n\n');

    // Convert remaining line breaks to <br> tags for non-heading and non-list lines
    formattedContent = formattedContent
      .replace(/\n/g, '<br>')
      // Convert double line breaks to paragraph breaks
      .replace(/<br><br>/g, '</p><p>')
      // Wrap non-heading and non-list content in paragraphs
      .replace(/^(?!<h[1-3]>)(?!<[ou]l>)(.+)$/gm, '<p>$1</p>')
      // Remove empty paragraphs
      .replace(/<p><\/p>/g, '')
      // Clean up any remaining <br> tags at the end of paragraphs
      .replace(/<br><\/p>/g, '</p>');

    return formattedContent;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground overflow-x-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-1 h-auto p-0 hover:text-primary whitespace-nowrap"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/blog')}
                className="h-auto p-0 hover:text-primary whitespace-nowrap"
              >
                Blog
              </Button>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <span className="text-primary font-medium">Memuat...</span>
            </nav>
          </div>
          
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground overflow-x-auto">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-1 h-auto p-0 hover:text-primary whitespace-nowrap"
              >
                <Home className="h-4 w-4" />
                <span className="hidden sm:inline">Beranda</span>
              </Button>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/blog')}
                className="h-auto p-0 hover:text-primary whitespace-nowrap"
              >
                Blog
              </Button>
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
              <span className="text-primary font-medium">Error</span>
            </nav>
          </div>
          
          <div className="text-center py-8 sm:py-12">
            <h1 className="text-2xl font-bold text-secondary mb-4">
              {error || "Artikel tidak ditemukan"}
            </h1>
            <p className="text-muted-foreground mb-6">
              Artikel yang Anda cari tidak dapat ditemukan atau telah dihapus.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Button>
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
        <title>{post.title} | Idea Digital Creative</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content={post.author} />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://ideadigiralcreative.com/blog/${post.slug}`} />
        <meta property="og:site_name" content="Idea Digital Creative" />
        <meta property="og:locale" content="id_ID" />
        
        {/* Open Graph Image - Perbaikan untuk WhatsApp */}
        <meta property="og:image" content={(() => {
          if (post.featured_image) {
            // Jika featured_image adalah URL lengkap
            if (post.featured_image.startsWith('http')) {
              console.log('🔗 [BlogDetail] OG Image - URL lengkap:', post.featured_image);
              return post.featured_image;
            }
            // Jika featured_image adalah base64 data URL
            if (post.featured_image.startsWith('data:image/')) {
              console.log('🔗 [BlogDetail] OG Image - Base64 data URL:', post.featured_image.substring(0, 50) + '...');
              return post.featured_image;
            }
            // Jika featured_image adalah path relatif, buat URL lengkap
            const fullUrl = `https://ideadigiralcreative.com${post.featured_image.startsWith('/') ? '' : '/'}${post.featured_image}`;
            console.log('🔗 [BlogDetail] OG Image - Path relatif, dibuat URL lengkap:', fullUrl);
            return fullUrl;
          }
          // Fallback ke logo website
          console.log('🔗 [BlogDetail] OG Image - Fallback ke logo');
          return 'https://ideadigiralcreative.com/logo.png';
        })()} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content={(() => {
          if (post.featured_image) {
            if (post.featured_image.startsWith('http')) {
              return post.featured_image;
            }
            if (post.featured_image.startsWith('data:image/')) {
              return post.featured_image;
            }
            return `https://ideadigiralcreative.com${post.featured_image.startsWith('/') ? '' : '/'}${post.featured_image}`;
          }
          return 'https://ideadigiralcreative.com/logo.png';
        })()} />
        
        {/* Article Specific Meta Tags */}
        <meta property="article:published_time" content={post.published_at} />
        <meta property="article:modified_time" content={post.updated_at} />
        <meta property="article:author" content={post.author} />
        {post.tags && post.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={(() => {
          if (post.featured_image) {
            if (post.featured_image.startsWith('http')) {
              return post.featured_image;
            }
            if (post.featured_image.startsWith('data:image/')) {
              return post.featured_image;
            }
            return `https://ideadigiralcreative.com${post.featured_image.startsWith('/') ? '' : '/'}${post.featured_image}`;
          }
          return 'https://ideadigiralcreative.com/logo.png';
        })()} />
        <meta name="twitter:site" content="@Komunitas Lombok Pasangkayu" />
        <meta name="twitter:creator" content="@Komunitas Lombok Pasangkayu" />
        
        {/* Additional Meta Tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={post.author} />
        <meta name="keywords" content={post.tags ? post.tags.join(', ') : 'blog, artikel, website'} />
        <link rel="canonical" href={`https://ideadigiralcreative.com/blog/${post.slug}`} />
        
        {/* Additional Open Graph Tags untuk WhatsApp */}
        <meta property="og:determiner" content="the" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={post.title} />
        <meta property="og:image:type" content="image/jpeg" />
        
        {/* WhatsApp specific meta tags */}
        <meta property="og:image:secure_url" content={(() => {
          if (post.featured_image) {
            if (post.featured_image.startsWith('http')) {
              return post.featured_image;
            }
            if (post.featured_image.startsWith('data:image/')) {
              return post.featured_image;
            }
            return `https://ideadigiralcreative.com${post.featured_image.startsWith('/') ? '' : '/'}${post.featured_image}`;
          }
          return 'https://ideadigiralcreative.com/logo.png';
        })()} />
        
        {/* Additional meta tags untuk WhatsApp dan social media */}
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Idea Digital Creative" />
        
        {/* Cache control untuk social media crawlers */}
        <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
      </Helmet>
      <Header onLogoClick={() => navigate('/')} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-4 sm:mb-6">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground overflow-x-auto">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1 h-auto p-0 hover:text-primary whitespace-nowrap"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Beranda</span>
            </Button>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/blog')}
              className="h-auto p-0 hover:text-primary whitespace-nowrap"
            >
              Blog
            </Button>
            <ChevronRight className="h-4 w-4 flex-shrink-0" />
            <span className="text-primary font-medium truncate max-w-[200px] sm:max-w-xs">
              {post.title}
            </span>
          </nav>
        </div>

        

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Article Content - 3 columns */}
          <div className="lg:col-span-3">
            <article className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg rounded-lg overflow-hidden">
              {/* Featured Image/Thumbnail */}
              {post.featured_image ? (
                <div className="w-full h-64 md:h-96 overflow-hidden relative">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay gradient for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              ) : (
                /* Default thumbnail when no featured image */
                <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Tag className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-muted-foreground font-medium">Artikel</p>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-4 sm:p-6 md:p-8">
                                  {/* Title */}
                  <h1 className="text-2xl md:text-3xl font-bold text-secondary mb-4 leading-tight">
                    {post.title}
                  </h1>
                  
                  

                                 {/* Meta Information */}
                 <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                   <div className="flex items-center gap-2">
                     <User className="h-4 w-4" />
                     <span>{post.author}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Clock className="h-4 w-4" />
                     <span>{formatReadingTime(post.content)}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <Eye className="h-4 w-4" />
                     <span>{post.views || 0} views</span>
                   </div>
                 </div>

                                 {/* Excerpt */}
                 <div className="bg-gray-50 border-l-4 border-gray-300 p-4 mb-6">
                   <p className="text-lg text-gray-800 font-medium">
                     {post.excerpt}
                   </p>
                 </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                  <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Bagikan
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Komentar
                  </Button>
                </div>

                <Separator className="mb-8" />

                                 {/* Article Content */}
                                   <div className="prose prose-lg max-w-none">
                    {/* 
                      Format Support:
                      - Use "# Heading 1" for main sections
                      - Use "## Heading 2" for subsections  
                      - Use "### Heading 3" for sub-subsections
                      - Use "1. Item" for numbered lists
                      - Use "- Item" or "* Item" for bullet lists
                      - Regular text will be wrapped in paragraphs
                    */}
                                                                                 <div 
                        className="leading-loose text-gray-800 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-secondary [&>h1]:mb-2 [&>h1]:mt-12 [&>h1]:first:mt-0 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-secondary [&>h2]:mb-2 [&>h2]:mt-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-secondary [&>h3]:mb-2 [&>h3]:mt-3 [&>p]:mb-6 [&>p]:last:mb-0 [&>ol]:mb-3 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol>li]:mb-1 [&>ul]:mb-3 [&>ul]:pl-6 [&>ul]:list-disc [&>ul>li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: formatContentWithHeadings(post.content)
                      }}
                    />
                 </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                                         <div className="flex items-center gap-2 mb-4">
                       <Tag className="h-4 w-4 text-orange-500" />
                       <span className="text-sm font-medium text-muted-foreground">Tags:</span>
                     </div>
                                         <div className="flex flex-wrap gap-2">
                       {post.tags.map((tag, index) => (
                                                   <Badge 
                            key={index} 
                            variant="secondary" 
                            className="px-2 py-1 text-xs bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 hover:text-orange-800 transition-colors"
                          >
                            {tag}
                          </Badge>
                       ))}
                     </div>
                  </div>
                )}

                                 {/* Article Footer */}
                 <div className="mt-8 pt-6 border-t border-gray-200">
                   <div className="flex justify-end">
                     <Button onClick={handleShare} variant="outline" size="sm">
                       <Share2 className="h-4 w-4 mr-2" />
                       Bagikan Artikel
                     </Button>
                   </div>
                 </div>
              </div>
            </article>
          </div>

                    {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Popular Posts Sidebar */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-bold text-secondary">
                      Artikel Populer
                    </h3>
                  </div>
                  
                  {popularPosts.length > 0 ? (
                    <div className="space-y-4">
                      {popularPosts.map((popularPost, index) => (
                        <div 
                          key={popularPost.id} 
                          className="group cursor-pointer"
                          onClick={() => navigate(`/blog/${popularPost.slug}`)}
                        >
                          <div className="flex items-start gap-3">
                                                         {/* Number Badge */}
                             <div className="flex-shrink-0 w-10 h-10 bg-orange-100 border-2 border-orange-200 rounded-full flex items-center justify-center">
                               <span className="text-orange-700 text-base font-bold">
                                 {index + 1}
                               </span>
                             </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                                             <h4 className="font-semibold text-base text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-1">
                                 {popularPost.title}
                               </h4>
                               <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                 <span className="flex items-center gap-1">
                                   <Eye className="h-3 w-3" />
                                   {popularPost.views || 0}
                                 </span>
                               </div>
                            </div>
                          </div>
                          
                          {/* Separator */}
                          {index < popularPosts.length - 1 && (
                            <Separator className="mt-4" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Belum ada artikel populer
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Popular Tags Sidebar */}
              <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
                <CardContent className="p-4 sm:p-6 md:p-8">
                                     <div className="flex items-center gap-2 mb-6">
                     <Tag className="h-5 w-5 text-orange-500" />
                     <h3 className="text-xl font-bold text-secondary">
                       Tag Populer
                     </h3>
                   </div>
                  
                                     {popularTags.length > 0 ? (
                     <div className="flex flex-wrap gap-2">
                       {popularTags.map((tagData, index) => (
                                                   <Badge 
                            key={tagData.tag}
                            variant="secondary" 
                            className="px-3 py-2 text-sm cursor-pointer bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 hover:text-orange-800 transition-colors"
                          >
                            {tagData.tag}
                          </Badge>
                       ))}
                     </div>
                  ) : (
                    <div className="text-center py-8">
                      <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        Belum ada tag populer
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Artikel Terkait
            </h2>
            <div className="grid md:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="group hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-white/20">
                  {/* Thumbnail for related posts */}
                  {relatedPost.featured_image ? (
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={relatedPost.featured_image}
                        alt={relatedPost.title}
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
                  <CardContent className="p-3 sm:p-4">
                    <h3 className="font-semibold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-3">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {relatedPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(relatedPost.published_at)}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => navigate(`/blog/${relatedPost.slug}`)}
                    >
                      Baca Selengkapnya
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section (Placeholder) */}
        <div className="mt-12">
          <Card className="bg-white/80 backdrop-blur-sm border-white/20 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-xl font-bold text-secondary mb-4">
                Komentar
              </h3>
              <p className="text-muted-foreground">
                Fitur komentar akan segera hadir. Silakan bagikan pendapat Anda melalui media sosial.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
