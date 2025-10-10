-- Script untuk membuat bucket menjadi public
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Update blog-images bucket menjadi public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'blog-images';

-- 2. Update gallery-images bucket menjadi public
UPDATE storage.buckets 
SET public = true 
WHERE name = 'gallery-images';

-- 3. Verifikasi bucket configuration
SELECT 
  name,
  public,
  created_at
FROM storage.buckets 
WHERE name IN ('blog-images', 'gallery-images');

-- 4. Cek policies yang ada
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
