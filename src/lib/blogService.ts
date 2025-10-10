import { supabase, BlogPost, CreateBlogPost } from './supabase'
import { uploadImage, getOptimizedImageUrl, UploadResult } from './imageUploadService'
import { uploadWithFallback, getOptimizedBase64Url } from './fallbackUploadService'

// Cache untuk menyimpan data artikel
let postsCache: BlogPost[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

// Fungsi untuk mendapatkan semua artikel yang dipublikasikan dengan cache
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    // Cek cache terlebih dahulu
    const now = Date.now()
    if (postsCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return postsCache
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
      throw error
    }

    // Update cache
    postsCache = data || []
    cacheTimestamp = now

    return postsCache
  } catch (error) {
    console.error('Error in getPublishedPosts:', error)
    return []
  }
}

// Cache untuk artikel populer
let popularPostsCache: BlogPost[] | null = null
let popularCacheTimestamp: number = 0

// Cache untuk detail artikel
const postDetailCache: Map<string, { post: BlogPost; timestamp: number }> = new Map()
const POST_DETAIL_CACHE_DURATION = 10 * 60 * 1000 // 10 menit untuk detail artikel

// Fungsi untuk clear cache
export const clearPostsCache = () => {
  postsCache = null
  popularPostsCache = null
  postDetailCache.clear()
  relatedPostsCache.clear()
  cacheTimestamp = 0
  popularCacheTimestamp = 0
}

// Fungsi untuk upload gambar artikel dengan fallback
export const uploadBlogImage = async (file: File): Promise<UploadResult> => {
  try {
    // Uploading blog image

    // Coba upload ke Supabase Storage dulu
    const result = await uploadImage(file, {
      bucket: 'blog-images',
      folder: 'articles',
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    })

    if (result.success && result.url) {
      // Blog image uploaded to Supabase Storage
      return result
    } else {
      // Supabase Storage failed, trying fallback
      
      // Fallback ke base64 compressed
      const fallbackResult = await uploadWithFallback(file)
      
      if (fallbackResult.success) {
        // Blog image uploaded with fallback
      } else {
        // Both Supabase and fallback failed
      }
      
      return fallbackResult
    }
  } catch (error) {
    // Upload blog image error
    
    // Try fallback on error
    try {
      // Trying fallback due to error
      const fallbackResult = await uploadWithFallback(file)
      return fallbackResult
    } catch (fallbackError) {
      // Fallback also failed
      return {
        success: false,
        error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
}

// Fungsi untuk mendapatkan URL gambar yang dioptimasi
export const getBlogImageUrl = (imagePath: string, options?: {
  width?: number
  height?: number
  quality?: number
}): string => {
  // Validasi input
  if (!imagePath) {
    return ''
  }

  // Jika base64, gunakan fallback service
  if (imagePath.startsWith('data:image/')) {
    return getOptimizedBase64Url(imagePath, options)
  }
  
  // Jika Supabase Storage URL, gunakan service normal
  return getOptimizedImageUrl(imagePath, {
    ...options,
    format: 'webp'
  })
}

// Fungsi untuk mendapatkan artikel populer dengan cache
export const getPopularPosts = async (limit: number = 6): Promise<BlogPost[]> => {
  try {
    // Cek cache terlebih dahulu
    const now = Date.now()
    if (popularPostsCache && (now - popularCacheTimestamp) < CACHE_DURATION) {
      return popularPostsCache.slice(0, limit)
    }

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

    // Update cache
    popularPostsCache = data || []
    popularCacheTimestamp = now

    return popularPostsCache
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
    // Cek cache terlebih dahulu
    const now = Date.now()
    const cached = postDetailCache.get(slug)
    
    if (cached && (now - cached.timestamp) < POST_DETAIL_CACHE_DURATION) {
      // Increment views count (non-blocking) untuk cached data
      incrementViews(cached.post.id).catch(error => {
        console.warn('Failed to increment views (non-critical):', error)
      })
      return cached.post
    }

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

    // Update cache
    if (data) {
      postDetailCache.set(slug, { post: data, timestamp: now })
      
      // Increment views count (non-blocking)
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
    // Updating post by ID
    
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
      // Error updating post
      return null
    }

    if (!data) {
      // No post found with ID
      return null
    }

    // Post updated successfully
    return data
  } catch (error) {
    // Error in updatePost
    return null
  }
}

// Fungsi untuk mengupdate artikel berdasarkan slug
export const updatePostBySlug = async (slug: string, updates: Partial<CreateBlogPost>): Promise<boolean> => {
  try {
    // Updating post by slug
    
    // Cek apakah post ada terlebih dahulu
    const { data: existingPost, error: checkError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .eq('slug', slug)
      .single()

    if (checkError) {
      // Error checking post existence
      return false
    }

    if (!existingPost) {
      // Post not found with slug
      return false
    }

    // Found post

    // Update post
    // Attempting to update post with data

    const { data, error } = await supabase
      .from('blog_posts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
        published_at: updates.status === 'published' ? new Date().toISOString() : null
      })
      .eq('slug', slug)
      .select()

    // Update response

    // Check if there's an error object (even if it's empty)
    if (error && Object.keys(error).length > 0) {
      // Error updating post by slug
      return false
    }

    // Check if we have data returned
    if (!data || data.length === 0) {
      // No data returned after update for slug
      return false
    }

    // Post updated successfully
    return true
  } catch (error) {
    // Error in updatePostBySlug
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

// Cache untuk artikel terkait
const relatedPostsCache: Map<string, { posts: BlogPost[]; timestamp: number }> = new Map()
const RELATED_POSTS_CACHE_DURATION = 15 * 60 * 1000 // 15 menit untuk artikel terkait

// Fungsi untuk mendapatkan artikel terkait dengan cache
export const getRelatedPosts = async (currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> => {
  try {
    const cacheKey = `${currentPost.id}-${limit}`
    const now = Date.now()
    const cached = relatedPostsCache.get(cacheKey)
    
    if (cached && (now - cached.timestamp) < RELATED_POSTS_CACHE_DURATION) {
      return cached.posts
    }

    // Ambil artikel dengan tag yang sama
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .neq('id', currentPost.id)
      .contains('tags', currentPost.tags || [])
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching related posts:', error)
      throw error
    }

    let relatedPosts = data || []

    // Jika tidak cukup artikel dengan tag yang sama, ambil artikel terbaru
    if (relatedPosts.length < limit) {
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .neq('id', currentPost.id)
        .not('id', 'in', `(${relatedPosts.map(p => p.id).join(',')})`)
        .order('published_at', { ascending: false })
        .limit(limit - relatedPosts.length)

      if (!fallbackError && fallbackData) {
        relatedPosts = [...relatedPosts, ...fallbackData]
      }
    }

    // Update cache
    relatedPostsCache.set(cacheKey, { posts: relatedPosts, timestamp: now })

    return relatedPosts
  } catch (error) {
    console.error('Error in getRelatedPosts:', error)
    return []
  }
}
