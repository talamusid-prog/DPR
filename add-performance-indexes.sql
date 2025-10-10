-- Add Performance Indexes untuk Database Optimization
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Add indexes untuk gallery_images
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_images_user_id ON public.gallery_images(user_id);

-- 2. Add indexes untuk portfolios
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON public.portfolios(featured);

-- 3. Add indexes untuk kegiatan
CREATE INDEX IF NOT EXISTS idx_kegiatan_created_at ON public.kegiatan(created_at);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON public.kegiatan(status);

-- 4. Add indexes untuk blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- 5. Add indexes untuk aspirasi
CREATE INDEX IF NOT EXISTS idx_aspirasi_status ON public.aspirasi(status);
CREATE INDEX IF NOT EXISTS idx_aspirasi_created_at ON public.aspirasi(created_at);

-- Verify indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('gallery_images', 'portfolios', 'kegiatan', 'blog_posts', 'aspirasi')
ORDER BY tablename, indexname;
