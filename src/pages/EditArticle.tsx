import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Eye,
  EyeOff,
  X,
  Plus
} from "lucide-react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { Editor } from '@ckeditor/ckeditor5-core';
import { getPostBySlugAdmin, updatePostBySlug } from "@/lib/blogService";
import { BlogPost } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const EditArticle = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    featured_image: "",
    status: "draft" as "draft" | "published"
  });
  
  const [newTag, setNewTag] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fungsi untuk format konten dengan heading dan daftar (sama seperti di BlogDetail)
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

  // Load post data
  useEffect(() => {
    if (slug) {
      loadPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const post = await getPostBySlugAdmin(slug!);
      if (post) {
        setFormData({
          title: post.title || "",
          excerpt: post.excerpt || "",
          content: post.content || "",
          tags: post.tags || [],
          featured_image: post.featured_image || "",
          status: post.status as "draft" | "published"
        });
      } else {
        setError("Artikel tidak ditemukan");
      }
    } catch (error) {
      console.error("Error loading post:", error);
      setError("Gagal memuat artikel");
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload from ImageUpload component
  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      featured_image: url
    }));
    setError(''); // Clear any previous errors
  };

  const handleImageRemoved = () => {
    setFormData(prev => ({
      ...prev,
      featured_image: ''
    }));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!slug) {
      alert("Slug tidak ditemukan");
      return;
    }
    
    try {
      setSaving(true);
      
      // Create updated post object
      const updatedPost: Partial<BlogPost> = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        tags: formData.tags,
        featured_image: formData.featured_image,
        status: formData.status,
        updated_at: new Date().toISOString()
      };

      // Update post in database
      const success = await updatePostBySlug(slug, updatedPost);
      
      if (success) {
        alert("Artikel berhasil diperbarui!");
        navigate("/admin");
      } else {
        alert("Gagal memperbarui artikel");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      alert("Terjadi kesalahan saat memperbarui artikel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="h-12 w-12 animate-spin mx-auto mb-4 border-4 border-primary border-t-transparent rounded-full" />
            <p className="text-muted-foreground">Memuat artikel...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted">
        <Header onLogoClick={() => navigate('/')} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/admin')}>
              Kembali ke Admin
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Header onLogoClick={() => navigate('/')} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-secondary">
                Edit Artikel
              </h1>
              <p className="text-muted-foreground">
                Perbarui artikel dengan editor yang mudah digunakan
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2"
            >
              {previewMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {previewMode ? "Edit" : "Preview"}
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <div className="h-4 w-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">
                  Judul Artikel
                </Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel..."
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-xl font-semibold"
                />
              </CardContent>
            </Card>

            {/* Excerpt */}
            <Card>
              <CardContent className="p-6">
                <Label htmlFor="excerpt" className="text-sm font-medium mb-2 block">
                  Ringkasan Artikel
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Tulis ringkasan singkat artikel..."
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {previewMode ? "Preview Artikel" : "Konten Artikel"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {previewMode ? (
                  // Preview Mode - tampilkan konten dengan format yang benar
                  <div className="prose prose-lg max-w-none">
                                                              <div 
                        className="leading-loose text-gray-800 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:text-secondary [&>h1]:mb-2 [&>h1]:mt-12 [&>h1]:first:mt-0 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-secondary [&>h2]:mb-2 [&>h2]:mt-4 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:text-secondary [&>h3]:mb-2 [&>h3]:mt-3 [&>p]:mb-6 [&>p]:last:mb-0 [&>ol]:mb-3 [&>ol]:pl-6 [&>ol]:list-decimal [&>ol>li]:mb-1 [&>ul]:mb-3 [&>ul]:pl-6 [&>ul]:list-disc [&>ul>li]:mb-1"
                      dangerouslySetInnerHTML={{
                        __html: formatContentWithHeadings(formData.content)
                      }}
                    />
                  </div>
                ) : (
                  // Editor Mode
                  <>
                                         {/* 
                       Editor dengan fitur pembersihan otomatis untuk paste dari Word.
                       - Menghapus tag dan style yang tidak diinginkan dari Microsoft Word
                       - Menyediakan tombol "Paste from Word" di toolbar
                       - Membersihkan format secara otomatis saat paste
                       
                       Cara membuat daftar:
                       - Gunakan tombol "Bulleted List" (•) untuk daftar dengan bullet
                       - Gunakan tombol "Numbered List" (1.) untuk daftar bernomor
                       - Atau ketik "- Item" atau "1. Item" dan tekan Enter
                     */}
                     <div className="ckeditor-wrapper">
                       <style>
                         {`
                           .ckeditor-wrapper .ck-editor__editable {
                             counter-reset: list-counter;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ol {
                             list-style: none;
                             counter-reset: list-counter;
                             padding-left: 0;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ol li {
                             counter-increment: list-counter;
                             position: relative;
                             padding-left: 2em;
                             margin-bottom: 0.5em;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ol li::before {
                             content: counter(list-counter) ". ";
                             position: absolute;
                             left: 0;
                             font-weight: bold;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ul {
                             list-style: none;
                             padding-left: 0;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ul li {
                             position: relative;
                             padding-left: 2em;
                             margin-bottom: 0.5em;
                           }
                           
                           .ckeditor-wrapper .ck-editor__editable ul li::before {
                             content: "• ";
                             position: absolute;
                             left: 0;
                             font-weight: bold;
                           }
                         `}
                       </style>
                       <CKEditor
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  editor={ClassicEditor as any}
                  data={formData.content}
                                       config={{
                       toolbar: [
                         'heading',
                         '|',
                         'bold',
                         'italic',
                         'underline',
                         'strikethrough',
                         '|',
                         'bulletedList',
                         'numberedList',
                         '|',
                         'blockQuote',
                         'link',
                         '|',
                         'undo',
                         'redo',
                         '|',
                         'pasteFromWord'
                       ],
                       heading: {
                         options: [
                           { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                           { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                           { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                           { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' }
                         ]
                       },
                       // Konfigurasi untuk menangani paste dari Word
                       removePlugins: ['PasteFromOfficeEnhanced'],
                       // Konfigurasi untuk daftar
                       list: {
                         properties: {
                           styles: true,
                           startIndex: true,
                           reversed: true
                         }
                       }
                     }}
                                     onReady={editor => {
                     // You can store the "editor" and use when it is needed.
                     console.log('Editor is ready to use!', editor);
                     
                     // Tambahkan event listener untuk membersihkan paste dari Word
                     editor.editing.view.document.on('paste', (evt, data) => {
                       // Bersihkan HTML yang di-paste dari Word
                       if (data.dataTransfer.getData('text/html')) {
                         const html = data.dataTransfer.getData('text/html');
                         // Bersihkan style yang tidak diinginkan
                         const cleanHtml = html
                           .replace(/<o:p[^>]*>/g, '') // Hapus tag Office
                           .replace(/<\/o:p>/g, '')
                           .replace(/<o:CustomDocumentProperties[^>]*>.*?<\/o:CustomDocumentProperties>/gs, '') // Hapus properti Office
                           .replace(/<w:WordDocument[^>]*>.*?<\/w:WordDocument>/gs, '') // Hapus tag Word
                           .replace(/<w:LatentStyles[^>]*>.*?<\/w:LatentStyles>/gs, '') // Hapus style laten
                           .replace(/<w:LsdException[^>]*>.*?<\/w:LsdException>/gs, '') // Hapus exception
                           .replace(/<w:IgnoreMixedContent[^>]*>.*?<\/w:IgnoreMixedContent>/gs, '') // Hapus mixed content
                           .replace(/<w:Compatibility[^>]*>.*?<\/w:Compatibility>/gs, '') // Hapus compatibility
                           .replace(/<w:BrowserLevel[^>]*>.*?<\/w:BrowserLevel>/gs, '') // Hapus browser level
                           .replace(/<m:mathPr[^>]*>.*?<\/m:mathPr>/gs, '') // Hapus math properties
                           .replace(/<m:wrapIndent[^>]*>.*?<\/m:wrapIndent>/gs, '') // Hapus wrap indent
                           .replace(/<m:defJc[^>]*>.*?<\/m:defJc>/gs, '') // Hapus default justification
                           .replace(/<m:breakSub[^>]*>.*?<\/m:breakSub>/gs, '') // Hapus break sub
                           .replace(/<m:smallFrac[^>]*>.*?<\/m:smallFrac>/gs, '') // Hapus small fraction
                           .replace(/<m:dispDef[^>]*>.*?<\/m:dispDef>/gs, '') // Hapus display default
                           .replace(/<m:lMargin[^>]*>.*?<\/m:lMargin>/gs, '') // Hapus left margin
                           .replace(/<m:rMargin[^>]*>.*?<\/m:rMargin>/gs, '') // Hapus right margin
                           .replace(/<m:defJc[^>]*>.*?<\/m:defJc>/gs, '') // Hapus default justification
                           .replace(/<m:wrapIndent[^>]*>.*?<\/m:wrapIndent>/gs, '') // Hapus wrap indent
                           .replace(/<m:intLim[^>]*>.*?<\/m:intLim>/gs, '') // Hapus int limit
                           .replace(/<m:naryLim[^>]*>.*?<\/m:naryLim>/gs, '') // Hapus nary limit
                           .replace(/style="[^"]*"/g, '') // Hapus semua style inline
                           .replace(/class="[^"]*"/g, '') // Hapus semua class
                           .replace(/<span[^>]*>/g, '') // Hapus tag span
                           .replace(/<\/span>/g, '')
                           .replace(/<div[^>]*>/g, '<p>') // Ganti div dengan p
                           .replace(/<\/div>/g, '</p>');
                         
                         // Set data yang sudah dibersihkan
                         data.dataTransfer.setData('text/html', cleanHtml);
                       }
                     });

                     // Catatan: CKEditor sudah memiliki fitur auto-format untuk daftar
                     // User bisa menggunakan toolbar atau mengetik format manual
                     console.log('CKEditor ready with list formatting support');
                   }}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFormData(prev => ({ 
                      ...prev, 
                      content: data
                    }));
                  }}
                  onBlur={(event, editor) => {
                    console.log('Blur.', editor);
                  }}
                                     onFocus={(event, editor) => {
                     console.log('Focus.', editor);
                   }}
                 />
                       </div>
                   </>
                 )}
               </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Image */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gambar Utama</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImage={formData.featured_image}
                  onImageRemoved={handleImageRemoved}
                />
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tags</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    />
                    <Button size="sm" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pengaturan Publikasi</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Status
                    </Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        status: e.target.value as "draft" | "published" 
                      }))}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default EditArticle;
