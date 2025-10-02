import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  LayoutDashboard, 
  FileText, 
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
  Settings,
  Camera
} from "lucide-react";
import { getAllPosts, deletePost } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";
import { showSuccess, showError, showConfirm } from "@/lib/sweetAlert";

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Load posts on component mount
  useEffect(() => {
    loadPosts();
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
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-sm text-gray-600">Blog Management</p>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "dashboard" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab("posts")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "posts" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <FileText className="h-5 w-5" />
                Artikel
              </button>
              
              <button
                onClick={() => navigate('/admin-gallery')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-50"
              >
                <Camera className="h-5 w-5" />
                Galeri Komunitas
              </button>
              
              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "analytics" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="h-5 w-5" />
                Analytics
              </button>
              
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === "settings" 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Settings className="h-5 w-5" />
                Pengaturan
              </button>
            </div>
          </nav>
          
          {onLogout && (
            <div className="p-4 border-t">
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="w-full"
              >
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/create-article')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Buat Artikel Baru
                  </Button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalPosts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Published</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.publishedPosts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Draft</CardTitle>
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.draftPosts}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalViews}</div>
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
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-600">Memuat artikel...</p>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Belum ada artikel</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{post.title}</h3>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {post.author}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(post.published_at)}
                              </span>
                              {getStatusBadge(post.status)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Kelola Artikel</h2>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/create-article')}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Buat Artikel Baru
                  </Button>
                </div>
              </div>

              {/* Search */}
              <div className="max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Cari artikel..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Posts Table */}
              <Card>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Judul
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Penulis
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tanggal
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aksi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredPosts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {post.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {post.excerpt.substring(0, 60)}...
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {post.author}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(post.status)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatDate(post.published_at)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditPost(post)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeletePost(post.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
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
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
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
              <h2 className="text-2xl font-bold text-gray-800">Pengaturan</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Blog</CardTitle>
                  <CardDescription>
                    Konfigurasi blog dan sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Fitur pengaturan akan segera hadir...</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
