-- Fix Multiple Permissive Policies Performance Issues
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Fix gallery_images multiple policies
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow public read access to published galleries" ON public.gallery_images;

-- Create single optimized policy
CREATE POLICY "Optimized gallery access" ON public.gallery_images
FOR SELECT USING (
  status = 'published' OR (select auth.uid()) IS NOT NULL
);

-- Add management policies for authenticated users
CREATE POLICY "Authenticated users can manage galleries" ON public.gallery_images
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update galleries" ON public.gallery_images
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete galleries" ON public.gallery_images
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- 2. Fix portfolios multiple policies
-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow public read access to published portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Enable read for all users" ON public.portfolios;

-- Create single optimized policy
CREATE POLICY "Optimized portfolio access" ON public.portfolios
FOR SELECT USING (
  status = 'published' OR (select auth.uid()) IS NOT NULL
);

-- Add management policies for authenticated users
CREATE POLICY "Authenticated users can manage portfolios" ON public.portfolios
FOR INSERT WITH CHECK ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can update portfolios" ON public.portfolios
FOR UPDATE USING ((select auth.uid()) IS NOT NULL);

CREATE POLICY "Authenticated users can delete portfolios" ON public.portfolios
FOR DELETE USING ((select auth.uid()) IS NOT NULL);

-- Verify changes
SELECT 'Multiple policies optimized' as status;
