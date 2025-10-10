-- Script untuk memperbaiki performa database Supabase
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Fix Auth RLS Initialization Plan issues
-- Mengganti auth.uid() dengan (select auth.uid()) untuk performa yang lebih baik

-- Fix gallery_images policies
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
CREATE POLICY "Allow authenticated users to manage galleries" ON public.gallery_images
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- Fix kegiatan policies
DROP POLICY IF EXISTS "Authenticated users can insert kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can insert kegiatan" ON public.kegiatan
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can update kegiatan" ON public.kegiatan
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can delete kegiatan" ON public.kegiatan
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- 2. Fix Multiple Permissive Policies issues
-- Menggabungkan multiple policies menjadi satu policy yang lebih efisien

-- Fix gallery_images multiple policies
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow public read access to published galleries" ON public.gallery_images;

-- Create single optimized policy for gallery_images
CREATE POLICY "Optimized gallery access" ON public.gallery_images
FOR SELECT USING (
  -- Allow public read access to published galleries
  status = 'published' OR 
  -- Allow authenticated users to manage their own galleries
  ((select auth.uid()) IS NOT NULL)
);

CREATE POLICY "Authenticated users can manage galleries" ON public.gallery_images
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update galleries" ON public.gallery_images
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete galleries" ON public.gallery_images
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Fix portfolios multiple policies
DROP POLICY IF EXISTS "Allow public read access to published portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Enable read for all users" ON public.portfolios;

-- Create single optimized policy for portfolios
CREATE POLICY "Optimized portfolio access" ON public.portfolios
FOR SELECT USING (
  -- Allow public read access to published portfolios
  status = 'published' OR 
  -- Allow authenticated users to manage their own portfolios
  ((select auth.uid()) IS NOT NULL)
);

CREATE POLICY "Authenticated users can manage portfolios" ON public.portfolios
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolios" ON public.portfolios
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolios" ON public.portfolios
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- 3. Add indexes untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolios_status ON public.portfolios(status);
CREATE INDEX IF NOT EXISTS idx_portfolios_created_at ON public.portfolios(created_at);
CREATE INDEX IF NOT EXISTS idx_kegiatan_created_at ON public.kegiatan(created_at);

-- 4. Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename IN ('gallery_images', 'portfolios', 'kegiatan')
AND schemaname = 'public'
ORDER BY tablename, policyname;
