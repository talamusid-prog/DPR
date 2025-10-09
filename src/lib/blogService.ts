import { supabase, BlogPost, CreateBlogPost } from './supabase'

// Fungsi untuk mendapatkan semua artikel yang dipublikasikan
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getPublishedPosts:', error)
    return []
  }
}

// Fungsi untuk mendapatkan artikel populer
export const getPopularPosts = async (limit: number = 6): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('views', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular posts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getPopularPosts:', error)
    return []
  }
}

// Fungsi untuk mendapatkan semua artikel (termasuk draft) - untuk admin
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all posts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getAllPosts:', error)
    return []
  }
}

// Fungsi untuk mendapatkan artikel berdasarkan slug (untuk public)
export const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }

    // Increment views count (non-blocking)
    if (data) {
      // Jalankan increment views tanpa menunggu hasilnya
      incrementViews(data.id).catch(error => {
        console.warn('Failed to increment views (non-critical):', error)
      })
    }

    return data
  } catch (error) {
    console.error('Error in getPostBySlug:', error)
    return null
  }
}

// Fungsi untuk mendapatkan artikel berdasarkan slug (untuk admin - semua status)
export const getPostBySlugAdmin = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching post by slug (admin):', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getPostBySlugAdmin:', error)
    return null
  }
}

// Fungsi untuk increment views
export const incrementViews = async (postId: string): Promise<void> => {
  try {
    // Ambil data artikel saat ini
    const { data: currentPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('views')
      .eq('id', postId)
      .single()

    if (fetchError) {
      console.error('Error fetching current views:', fetchError)
      return
    }

    // Increment views secara manual
    const newViews = (currentPost?.views || 0) + 1
    
    const { error: updateError } = await supabase
      .from('blog_posts')
      .update({ views: newViews })
      .eq('id', postId)

    if (updateError) {
      console.error('Error updating views:', updateError)
    } else {
    }
  } catch (error) {
    console.error('Error in incrementViews:', error)
  }
}

// Fungsi untuk membuat artikel baru
export const createPost = async (post: CreateBlogPost): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([{
        ...post,
        published_at: post.status === 'published' ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in createPost:', error)
    return null
  }
}

// Fungsi untuk membuat artikel baru dengan slug otomatis
export const createPostWithSlug = async (post: Omit<CreateBlogPost, 'slug'>): Promise<boolean> => {
  try {
    console.log('🚀 Memulai proses penyimpanan artikel...');
    console.log('📝 Input data:', {
      title: post.title,
      contentLength: post.content?.length || 0,
      author: post.author,
      status: post.status
    });
    
    // Validasi input
    if (!post.title || !post.title.trim()) {
      throw new Error('Judul artikel tidak boleh kosong');
    }
    
    if (!post.content || !post.content.trim()) {
      throw new Error('Konten artikel tidak boleh kosong');
    }
    
    if (!post.author || !post.author.trim()) {
      throw new Error('Author tidak boleh kosong');
    }
    
    // Generate slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    if (!slug) {
      throw new Error('Tidak dapat menghasilkan slug dari judul');
    }

    console.log('🔗 Slug yang dihasilkan:', slug);

    // Data yang akan disimpan
    const postData = {
      title: post.title.trim(),
      content: post.content.trim(),
      excerpt: post.excerpt?.trim() || '',
      slug,
      featured_image: post.featured_image || '',
      alt_text: post.alt_text?.trim() || '',
      author: post.author.trim(),
      tags: post.tags || [],
      status: post.status || 'draft',
      published_at: post.status === 'published' ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    console.log('💾 Data yang akan disimpan ke database:', {
      title: postData.title,
      slug: postData.slug,
      status: postData.status,
      author: postData.author,
      contentLength: postData.content.length,
      tags: postData.tags,
      created_at: postData.created_at
    });

    console.log('📡 Mengirim request ke Supabase...');
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([postData])
      .select()

    if (error) {
      console.error('❌ Error creating post with slug:', error);
      console.error('🔍 Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Tambahan debugging untuk RLS issues
      if (error.code === '42501') {
        console.error('🚨 RLS Policy Error: Kemungkinan Row Level Security memblokir operasi');
        console.error('💡 Solusi: Jalankan script fix_rls_policies.sql di Supabase SQL Editor');
      }
      
      throw error;
    }

    console.log('✅ Artikel berhasil disimpan:', data);
    return true;
  } catch (error) {
    console.error('💥 Error in createPostWithSlug:', error);
    if (error instanceof Error) {
      console.error('📋 Error message:', error.message);
    }
    return false;
  }
}

// Fungsi untuk mengupdate artikel berdasarkan ID
export const updatePost = async (id: string, updates: Partial<CreateBlogPost>): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating post:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updatePost:', error)
    return null
  }
}

// Fungsi untuk mengupdate artikel berdasarkan slug
export const updatePostBySlug = async (slug: string, updates: Partial<CreateBlogPost>): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : null
      })
      .eq('slug', slug)

    if (error) {
      console.error('Error updating post by slug:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in updatePostBySlug:', error)
    return false
  }
}

// Fungsi untuk menghapus artikel
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting post:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deletePost:', error)
    return false
  }
}

// Fungsi untuk mendapatkan artikel berdasarkan tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .contains('tags', [tag])
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts by tag:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in getPostsByTag:', error)
    return []
  }
}

// Fungsi untuk mencari artikel
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error searching posts:', error)
      throw error
    }

    return data || []
  } catch (error) {
    console.error('Error in searchPosts:', error)
    return []
  }
}
