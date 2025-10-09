import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Tag,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  BarChart3,
  FileText,
  Palette,
  Menu,
  X
} from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import { getAllPosts, deletePost } from "@/lib/blogService";
import { countNewAspirasi } from "@/lib/aspirasiService";
import { BlogPost } from "@/lib/supabase";
import { showSuccess, showError, showConfirm } from "@/lib/sweetAlert";
import AdminColorSettings from "./AdminColorSettings";

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [newAspCount, setNewAspCount] = useState<number>(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
    (async () => {
      const c = await countNewAspirasi();
      setNewAspCount(c);
    })();
  }, []);

  // Sync active tab with query param (?tab=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ["dashboard","posts","analytics","settings"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  // Auto-close sidebar on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await getAllPosts();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  };

  const handleDeletePost = async (postId: string) => {
    const confirmed = await showConfirm(
      "Hapus Artikel",
      "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
    );
    
    if (confirmed) {
      try {
        const success = await deletePost(postId);
        if (success) {
          await loadPosts();
          showSuccess("Artikel berhasil dihapus!");
        } else {
          showError("Gagal menghapus artikel");
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        showError("Terjadi kesalahan saat menghapus artikel");
      }
    }
  };

  const handleEditPost = (post: BlogPost) => {
    navigate(`/edit-article/${post.slug}`);
  };





  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'published' ? (
      <Badge className="bg-green-100 text-green-800">Published</Badge>
    ) : (
      <Badge variant="secondary">Draft</Badge>
    );
  };

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter(p => p.status === 'published').length,
    draftPosts: posts.filter(p => p.status === 'draft').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views || 0), 0)
  };




  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Sidebar */}
        <div className={`
          fixed lg:fixed inset-y-0 left-0 z-40 w-64 bg-white border-r
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <AdminSidebar 
            active={activeTab as 'dashboard' | 'artikel' | 'gallery' | 'aspirasi' | 'analytics' | 'settings'} 
            onClose={() => setSidebarOpen(false)}
          />
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-64">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/create-article')}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Buat Artikel Baru</span>
                    <span className="sm:hidden">Buat Artikel</span>
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <Card className="p-3 sm:p-4 lg:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Total Artikel</CardTitle>
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalPosts}</div>
                  </CardContent>
                </Card>

                <Card className="p-3 sm:p-4 lg:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Published</CardTitle>
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.publishedPosts}</div>
                  </CardContent>
                </Card>

                <Card className="p-3 sm:p-4 lg:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Draft</CardTitle>
                    <EyeOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">{stats.draftPosts}</div>
                  </CardContent>
                </Card>

                <Card className="p-3 sm:p-4 lg:p-6">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs sm:text-sm font-medium">Total Views</CardTitle>
                    <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalViews}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Artikel Terbaru</CardTitle>
                  <CardDescription>
                    Artikel yang baru-baru ini dipublikasikan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Belum ada artikel</p>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 line-clamp-1 sm:line-clamp-none">{post.title}</h3>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span className="line-clamp-1">{post.author}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="line-clamp-1">{formatDate(post.published_at)}</span>
                              </span>
                              <div className="flex-shrink-0">
                                {getStatusBadge(post.status)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPost(post)}
                              className="p-1 sm:p-2"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1 sm:p-2 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "posts" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Kelola Artikel</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/create-article')}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Buat Artikel Baru</span>
                    <span className="sm:hidden">Buat Artikel</span>
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="w-full max-w-md mx-auto sm:mx-0">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Posts Table - Desktop */}
              <Card className="hidden lg:block">
                <CardContent className="p-0">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600">
                        {searchQuery ? "Tidak ada artikel yang ditemukan." : "Belum ada artikel."}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Judul
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Penulis
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                              <td className="px-4 lg:px-6 py-4">
                                <div>
                                  <div className="text-sm font-medium text-gray-900 line-clamp-1">
                                    {post.title}
                                  </div>
                                  <div className="text-sm text-gray-500 line-clamp-1">
                                    {post.excerpt.substring(0, 50)}...
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                                <div className="line-clamp-1">{post.author}</div>
                              </td>
                              <td className="px-4 lg:px-6 py-4">
                                {getStatusBadge(post.status)}
                              </td>
                              <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                                <div className="line-clamp-1">{formatDate(post.published_at)}</div>
                              </td>
                              <td className="px-4 lg:px-6 py-4 text-sm font-medium">
                                <div className="flex items-center gap-1 lg:gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditPost(post)}
                                    className="p-1 lg:p-2"
                                  >
                                    <Edit className="h-3 w-3 lg:h-4 lg:w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                    className="p-1 lg:p-2 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Posts List - Mobile & Tablet */}
              <div className="lg:hidden space-y-2">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">
                      {searchQuery ? "Tidak ada artikel yang ditemukan." : "Belum ada artikel."}
                    </p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </h3>
                            {getStatusBadge(post.status)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="line-clamp-1">{post.author}</span>
                            <span>•</span>
                            <span className="line-clamp-1">{formatDate(post.published_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPost(post)}
                            className="p-1 h-8 w-8"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePost(post.id)}
                            className="p-1 h-8 w-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Analytics</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Statistik Blog</CardTitle>
                  <CardDescription>
                    Data performa blog Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Fitur analytics akan segera hadir...</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
                    <Palette className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                    Pengaturan Warna
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">
                    Kustomisasi warna dan tema aplikasi
                  </p>
                </div>
              </div>
              <AdminColorSettings />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
