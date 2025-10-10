-- Final Database Optimization Script
-- Jalankan script ini di Supabase Dashboard > SQL Editor
-- Script ini akan memperbaiki semua 12 peringatan performa

-- ============================================
-- STEP 1: FIX AUTH RLS INITIALIZATION PLAN
-- ============================================

-- Fix gallery_images auth RLS (1 warning)
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
CREATE POLICY "Allow authenticated users to manage galleries" ON public.gallery_images
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- Fix kegiatan auth RLS (3 warnings)
DROP POLICY IF EXISTS "Authenticated users can insert kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can insert kegiatan" ON public.kegiatan
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can update kegiatan" ON public.kegiatan
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can delete kegiatan" ON public.kegiatan
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- ============================================
-- STEP 2: FIX MULTIPLE PERMISSIVE POLICIES
-- ============================================

-- Fix gallery_images multiple policies (4 warnings)
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow public read access to published galleries" ON public.gallery_images;

-- Create single optimized policy for gallery_images
CREATE POLICY "Optimized gallery read access" ON public.gallery_images
FOR SELECT USING (
  status = 'published' OR (select auth.uid()) IS NOT NULL
);

-- Add specific management policies
CREATE POLICY "Authenticated users can manage galleries" ON public.gallery_images
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update galleries" ON public.gallery_images
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete galleries" ON public.gallery_images
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Fix portfolios multiple policies (4 warnings)
DROP POLICY IF EXISTS "Allow public read access to published portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Enable read for all users" ON public.portfolios;

-- Create single optimized policy for portfolios
CREATE POLICY "Optimized portfolio read access" ON public.portfolios
FOR SELECT USING (
  status = 'published' OR (select auth.uid()) IS NOT NULL
);

-- Add specific management policies
CREATE POLICY "Authenticated users can manage portfolios" ON public.portfolios
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolios" ON public.portfolios
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolios" ON public.portfolios
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- ============================================
-- STEP 3: ADD PERFORMANCE INDEXES
-- ============================================

-- Add indexes untuk gallery_images
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at);
CREATE INDEX IF NOT EXISTS idx_gallery_images_user_id ON public.gallery_images(user_id);

-- Add indexes untuk portfolios
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_featured ON public.portfolios(featured);

-- Add indexes untuk kegiatan
CREATE INDEX IF NOT EXISTS idx_kegiatan_created_at ON public.kegiatan(created_at);
CREATE INDEX IF NOT EXISTS idx_kegiatan_status ON public.kegiatan(status);

-- Add indexes untuk blog_posts
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);

-- ============================================
-- STEP 4: VERIFY OPTIMIZATIONS
-- ============================================

-- Check remaining policies
SELECT 
  'Remaining Policies' as category,
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies 
WHERE tablename IN ('gallery_images', 'portfolios', 'kegiatan')
AND schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT 
  'Performance Indexes' as category,
  schemaname,
  tablename,
  indexname
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('gallery_images', 'portfolios', 'kegiatan', 'blog_posts')
ORDER BY tablename, indexname;

-- Success message
SELECT '🎉 Database optimization completed! All 12 performance warnings should be resolved.' as result;
