import { supabase, BlogPost, CreateBlogPost, supabaseAdmin } from './supabase'

// Row types for Supabase queries to avoid `any`
type ArticlesFeedRow = {
  id: number | string
  title: string
  slug: string
  excerpt: string | null
  thumbnail_url: string | null
  author_name?: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  tags: string[] | null
  categories: string[] | null
}

type ArticleRow = {
  id: number | string
  title: string
  slug: string
  content?: string | null
  excerpt: string | null
  thumbnail_url: string | null
  author_id?: number | string | null
  published_at: string | null
  created_at: string
  updated_at: string
  status?: 'draft' | 'published'
}

// Helpers untuk memetakan row DB ke BlogPost
const mapArticlesFeedRowToBlogPost = (row: ArticlesFeedRow): BlogPost => ({
  id: String(row.id),
  title: row.title,
  content: '',
  excerpt: row.excerpt || '',
  slug: row.slug,
  featured_image: row.thumbnail_url || '',
  alt_text: '',
  author: row.author_name || '',
  published_at: row.published_at || '',
  created_at: row.created_at,
  updated_at: row.updated_at,
  tags: row.tags || [],
  status: 'published',
  views: 0
})

const mapArticleRowToBlogPost = (row: ArticleRow): BlogPost => ({
  id: String(row.id),
  title: row.title,
  content: row.content || '',
  excerpt: row.excerpt || '',
  slug: row.slug,
  featured_image: row.thumbnail_url || '',
  alt_text: '',
  author: '',
  published_at: row.published_at || '',
  created_at: row.created_at,
  updated_at: row.updated_at,
  tags: [],
  status: (row.status || 'published') as 'draft' | 'published',
  views: 0
})
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

    // 1) Ambil langsung dari tabel articles (menghindari ketergantungan MV)
    let mapped: BlogPost[] = []
    const { data: articlesData, error: articlesErr } = await supabase
      .from('articles')
      .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(20)

    if (!articlesErr && articlesData) {
      mapped = articlesData.map((row: ArticleRow) => mapArticleRowToBlogPost(row))
    }

    // 2) Jika kosong, coba dari materialized view (jika sudah ter-refresh)
    if (!mapped.length) {
      const { data: feedData } = await supabase
        .from('articles_feed')
        .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at,tags,categories')
        .order('published_at', { ascending: false })
      if (feedData) {
        mapped = feedData.map((row: ArticlesFeedRow) => mapArticlesFeedRowToBlogPost(row))
      }
    }

    // Update cache hanya jika ada data
    if (mapped.length) {
      postsCache = mapped
      cacheTimestamp = now
    }

    return mapped
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
      .from('articles')
      .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular posts:', error)
      throw error
    }

    // Update cache
    popularPostsCache = (data || []).map((row: ArticleRow) => mapArticleRowToBlogPost(row))
    popularCacheTimestamp = now

    return popularPostsCache
  } catch (error) {
    console.error('Error in getPopularPosts:', error)
    return []
  }
}

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const upsertTagsAndAttach = async (articleId: string | number, tags: string[] | undefined) => {
  if (!tags || tags.length === 0) return;
  const tagRows = tags.map((name) => ({ name, slug: toSlug(name) }));
  const { error: upsertErr } = await supabaseAdmin
    .from('tags')
    .upsert(tagRows, { onConflict: 'slug' });
  if (upsertErr) throw upsertErr;

  const slugs = tagRows.map(t => t.slug);
  const { data: tagIds, error: selErr } = await supabaseAdmin
    .from('tags')
    .select('id, slug')
    .in('slug', slugs);
  if (selErr) throw selErr;

  const linkRows = (tagIds || []).map(t => ({ article_id: articleId, tag_id: t.id }));
  if (linkRows.length > 0) {
    const { error: linkErr } = await supabaseAdmin
      .from('article_tags')
      .insert(linkRows);
    if (linkErr) throw linkErr;
  }
};

// Fungsi untuk mendapatkan semua artikel (termasuk draft) - untuk admin
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('id,title,slug,excerpt,thumbnail_url,author_id,published_at,created_at,updated_at,status')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching all posts:', error)
      throw error
    }

    return (data || []).map((row: ArticleRow) => mapArticleRowToBlogPost(row))
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
      .from('articles')
      .select('id,title,slug,content,excerpt,thumbnail_url,author_id,published_at,created_at,updated_at,status')
      .eq('slug', slug.toLowerCase())
      .eq('status', 'published')
      .single()

    if (error) {
      console.error('Error fetching post by slug:', error)
      return null
    }

    // Update cache
    if (!data) return null

    const mapped: BlogPost = mapArticleRowToBlogPost(data as ArticleRow)

    postDetailCache.set(slug, { post: mapped, timestamp: now })
    return mapped
  } catch (error) {
    console.error('Error in getPostBySlug:', error)
    return null
  }
}

// Fungsi untuk mendapatkan artikel berdasarkan slug (untuk admin - semua status)
export const getPostBySlugAdmin = async (slug: string): Promise<BlogPost | null> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('articles')
      .select('id,title,slug,content,excerpt,thumbnail_url,author_id,published_at,created_at,updated_at,status')
      .eq('slug', slug.toLowerCase())
      .single()

    if (error) {
      console.error('Error fetching post by slug (admin):', error)
      return null
    }

    if (!data) return null
    return mapArticleRowToBlogPost(data as ArticleRow)
  } catch (error) {
    console.error('Error in getPostBySlugAdmin:', error)
    return null
  }
}

// Fungsi untuk increment views
export const incrementViews = async (_postId: string): Promise<void> => {
  // No-op: skema baru tidak memiliki kolom views
  return
}

// Fungsi untuk membuat artikel baru
export const createPost = async (post: CreateBlogPost): Promise<BlogPost | null> => {
  try {
    const slug = post.slug?.trim() || toSlug(post.title);
    const insertData = {
      title: post.title.trim(),
      slug,
      content: post.content?.trim() || '',
      excerpt: post.excerpt?.trim() || '',
      thumbnail_url: post.featured_image || '',
      status: post.status || 'draft',
      author_id: null as number | null,
      published_at: (post.status === 'published') ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    if (!data) return null;

    // attach tags if any
    if (post.tags && post.tags.length > 0) {
      await upsertTagsAndAttach(data.id, post.tags);
    }

    // refresh feed setelah create
    await supabaseAdmin.rpc('refresh_articles_feed');

    return mapArticleRowToBlogPost(data as ArticleRow);
  } catch (error) {
    console.error('Error in createPost:', error)
    return null
  }
}

// Fungsi untuk membuat artikel baru dengan slug otomatis
export const createPostWithSlug = async (post: Omit<CreateBlogPost, 'slug'>): Promise<boolean> => {
  try {
    if (!post.title?.trim()) throw new Error('Judul artikel tidak boleh kosong');
    if (!post.content?.trim()) throw new Error('Konten artikel tidak boleh kosong');

    const slug = toSlug(post.title);
    const insertData = {
      title: post.title.trim(),
      slug,
      content: post.content.trim(),
      excerpt: post.excerpt?.trim() || '',
      thumbnail_url: post.featured_image || '',
      status: post.status || 'draft',
      author_id: null as number | null,
      published_at: (post.status === 'published') ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabaseAdmin
      .from('articles')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;

    if (data && post.tags?.length) {
      await upsertTagsAndAttach(data.id, post.tags);
    }

    // refresh feed setelah create
    await supabaseAdmin.rpc('refresh_articles_feed');

    return true;
  } catch (error) {
    console.error('Error in createPostWithSlug:', error);
    return false;
  }
}

type ArticleUpdate = Partial<{
  title: string
  content: string
  excerpt: string
  thumbnail_url: string
  status: 'draft' | 'published'
  updated_at: string
  published_at: string | null
}>

// Fungsi untuk mengupdate artikel berdasarkan ID
export const updatePost = async (id: string, updates: Partial<CreateBlogPost>): Promise<BlogPost | null> => {
  try {
    const updateData: ArticleUpdate = {
      ...('title' in updates ? { title: updates.title?.trim() || '' } : {}),
      ...('content' in updates ? { content: updates.content?.trim() || '' } : {}),
      ...('excerpt' in updates ? { excerpt: updates.excerpt?.trim() || '' } : {}),
      ...('featured_image' in updates ? { thumbnail_url: updates.featured_image || '' } : {}),
      ...('status' in updates && updates.status ? { status: updates.status } : {}),
      updated_at: new Date().toISOString(),
      ...(updates.status === 'published' ? { published_at: new Date().toISOString() } : {})
    };

    const { data, error } = await supabaseAdmin
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) return null;
    if (!data) return null;

    // sync tags if provided
    if (updates.tags) {
      await supabaseAdmin.from('article_tags').delete().eq('article_id', data.id);
      if (updates.tags.length > 0) {
        await upsertTagsAndAttach(data.id, updates.tags);
      }
    }

    // refresh feed setelah update
    await supabaseAdmin.rpc('refresh_articles_feed');

    return mapArticleRowToBlogPost(data as ArticleRow);
  } catch (error) {
    return null
  }
}

// Fungsi untuk mengupdate artikel berdasarkan slug
export const updatePostBySlug = async (slug: string, updates: Partial<CreateBlogPost>): Promise<boolean> => {
  try {
    const { data: existingPost, error: checkError } = await supabaseAdmin
      .from('articles')
      .select('id, title, slug')
      .eq('slug', slug.toLowerCase())
      .single();

    if (checkError || !existingPost) {
      return false
    }

    const updateData: ArticleUpdate = {
      ...('title' in updates ? { title: updates.title?.trim() || '' } : {}),
      ...('content' in updates ? { content: updates.content?.trim() || '' } : {}),
      ...('excerpt' in updates ? { excerpt: updates.excerpt?.trim() || '' } : {}),
      ...('featured_image' in updates ? { thumbnail_url: updates.featured_image || '' } : {}),
      ...('status' in updates && updates.status ? { status: updates.status } : {}),
      updated_at: new Date().toISOString(),
      ...(updates.status === 'published' ? { published_at: new Date().toISOString() } : {})
    };

    const { error } = await supabaseAdmin
      .from('articles')
      .update(updateData)
      .eq('slug', slug.toLowerCase());

    if (error) {
      return false
    }

    // sync tags if provided
    if (updates.tags) {
      await supabaseAdmin.from('article_tags').delete().eq('article_id', existingPost.id);
      if (updates.tags.length > 0) {
        await upsertTagsAndAttach(existingPost.id, updates.tags);
      }
    }

    // refresh feed setelah update
    await supabaseAdmin.rpc('refresh_articles_feed');

    return true
  } catch (error) {
    return false
  }
}

// Fungsi untuk menghapus artikel
export const deletePost = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabaseAdmin
      .from('articles')
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
      .from('articles_feed')
      .select('id,title,slug,excerpt,thumbnail_url,author_name,published_at,created_at,updated_at,tags,categories')
      .contains('tags', [tag])
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts by tag:', error)
      throw error
    }

    return (data || []).map((row: ArticlesFeedRow) => mapArticlesFeedRowToBlogPost(row))
  } catch (error) {
    console.error('Error in getPostsByTag:', error)
    return []
  }
}

// Fungsi untuk mencari artikel
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at')
      .textSearch('search_tsv', query, { type: 'plain', config: 'simple' })
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error searching posts:', error)
      throw error
    }

    return (data || []).map((row: ArticleRow) => mapArticleRowToBlogPost(row))
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
    const baseQuery = supabase
      .from('articles_feed')
      .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at,tags,categories')
      .neq('id', currentPost.id)
      .order('published_at', { ascending: false })
      .limit(limit)

    const { data, error } = currentPost.tags && currentPost.tags.length
      ? await baseQuery.contains('tags', currentPost.tags)
      : await baseQuery

    if (error) {
      console.error('Error fetching related posts:', error)
      throw error
    }

    let relatedPosts: ArticlesFeedRow[] = data || []

    // Jika tidak cukup artikel dengan tag yang sama, ambil artikel terbaru
    if (relatedPosts.length < limit) {
      const excludeIds = relatedPosts.map(p => p.id)
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('articles_feed')
        .select('id,title,slug,excerpt,thumbnail_url,published_at,created_at,updated_at,tags,categories')
        .neq('id', currentPost.id)
        .not('id', 'in', `(${excludeIds.join(',') || 'NULL'})`)
        .order('published_at', { ascending: false })
        .limit(limit - relatedPosts.length)

      if (!fallbackError && fallbackData) {
        relatedPosts = [...relatedPosts, ...fallbackData]
      }
    }

    // Update cache
    relatedPostsCache.set(cacheKey, { posts: relatedPosts.map(mapArticlesFeedRowToBlogPost), timestamp: now })

    return (relatedPosts || []).map(mapArticlesFeedRowToBlogPost)
  } catch (error) {
    console.error('Error in getRelatedPosts:', error)
    return []
  }
}
