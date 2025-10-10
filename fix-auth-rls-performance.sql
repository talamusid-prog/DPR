-- Fix Auth RLS Initialization Plan Performance Issues
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Fix gallery_images auth RLS issue
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
CREATE POLICY "Allow authenticated users to manage galleries" ON public.gallery_images
FOR ALL USING ((select auth.uid()) IS NOT NULL);

-- 2. Fix kegiatan auth RLS issues
DROP POLICY IF EXISTS "Authenticated users can insert kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can insert kegiatan" ON public.kegiatan
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can update kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can update kegiatan" ON public.kegiatan
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

DROP POLICY IF EXISTS "Authenticated users can delete kegiatan" ON public.kegiatan;
CREATE POLICY "Authenticated users can delete kegiatan" ON public.kegiatan
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Verify changes
SELECT 'Auth RLS policies fixed' as status;
