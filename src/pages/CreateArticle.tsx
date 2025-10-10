import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Upload,
  X,
  Plus
} from "lucide-react";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import type { Editor, EditorConfig } from '@ckeditor/ckeditor5-core';




import { createPostWithSlug } from "@/lib/blogService";
import { runAllTests } from "@/lib/testDatabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { showSuccess, showError, showWarning } from "@/lib/sweetAlert";

const CreateArticle = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    tags: [] as string[],
    featured_image: "",
    alt_text: "",
    status: "draft" as "draft" | "published"
  });
  
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Simulate file upload - in real app, upload to cloud storage
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          featured_image: e.target?.result as string
        }));
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsUploading(false);
    }
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

  // Test database connection
  const handleTestDatabase = async () => {
    setIsTesting(true);
    try {
      await runAllTests();
    } catch (error) {
      console.error('Test error:', error);
    } finally {
      setIsTesting(false);
    }
  };

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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.title.trim()) {
      showWarning("Judul artikel harus diisi!");
      return;
    }
    
    if (!formData.content.trim()) {
      showWarning("Konten artikel harus diisi!");
      return;
    }
    
    // Log data yang akan disimpan untuk debugging
    console.log("Data yang akan disimpan:", {
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content.substring(0, 100) + "...", // Log hanya 100 karakter pertama
      tags: formData.tags,
      featured_image: formData.featured_image ? "Ada gambar" : "Tidak ada gambar",
      status: formData.status,
      author: "Admin"
    });
    
    try {
      // Set loading state
      setIsUploading(true);
      
      // Save to database
      const success = await createPostWithSlug({
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
        featured_image: formData.featured_image || "",
        alt_text: formData.alt_text.trim(),
        status: formData.status,
        author: "Admin" // Default author
      });
      
      console.log("Hasil penyimpanan:", success);
      
      if (success) {
        showSuccess("Artikel berhasil disimpan!");
        navigate("/admin");
      } else {
        showError("Gagal menyimpan artikel. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error saving article:", error);
      showError(`Terjadi kesalahan saat menyimpan artikel: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

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
                Buat Artikel Baru
              </h1>
              <p className="text-muted-foreground">
                Tulis artikel menarik dengan editor yang mudah digunakan
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleTestDatabase}
              disabled={isTesting}
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  Testing...
                </>
              ) : (
                <>
                  <span>🔧</span>
                  Test DB
                </>
              )}
            </Button>
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
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Simpan Artikel
                </>
              )}
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
                      '|',
                      'bulletedList',
                      'numberedList',
                      '|',
                      'blockQuote',
                      'link',
                      '|',
                      'undo',
                      'redo'
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
                    removePlugins: ['PasteFromOfficeEnhanced']
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
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                
                {formData.featured_image ? (
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden border">
                      <img
                        src={formData.featured_image}
                        alt="Featured"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Alt Text Input */}
                    <div>
                      <Label htmlFor="alt_text" className="text-sm font-medium mb-2 block">
                        Alt Text (Deskripsi Gambar)
                      </Label>
                      <Input
                        id="alt_text"
                        placeholder="Masukkan deskripsi gambar untuk aksesibilitas..."
                        value={formData.alt_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Alt text membantu pengguna dengan screen reader dan SEO
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, featured_image: "" }))}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hapus Gambar
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full h-32 border-dashed border-2 flex flex-col items-center justify-center gap-2"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    ) : (
                      <>
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Upload Gambar
                        </span>
                      </>
                    )}
                  </Button>
                )}
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

export default CreateArticle;
