-- SQL Script untuk Setup RLS Policies di Supabase Storage
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Enable RLS pada storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Policy untuk public read access ke blog-images bucket
CREATE POLICY "Public read access for blog-images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- 3. Policy untuk public read access ke gallery-images bucket  
CREATE POLICY "Public read access for gallery-images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

-- 4. Policy untuk authenticated users upload ke blog-images
CREATE POLICY "Authenticated users can upload to blog-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- 5. Policy untuk authenticated users upload ke gallery-images
CREATE POLICY "Authenticated users can upload to gallery-images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- 6. Policy untuk authenticated users update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('blog-images', 'gallery-images')
  AND auth.role() = 'authenticated'
);

-- 7. Policy untuk authenticated users delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('blog-images', 'gallery-images')
  AND auth.role() = 'authenticated'
);

-- 8. Alternative: Policy untuk anonymous read access (jika diperlukan)
-- Uncomment jika ingin anonymous users bisa baca file
/*
CREATE POLICY "Anonymous read access for public buckets" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('blog-images', 'gallery-images')
);
*/

-- 9. Verifikasi policies yang sudah dibuat
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 10. Test query untuk cek akses
SELECT 
  name,
  bucket_id,
  created_at,
  updated_at
FROM storage.objects 
WHERE bucket_id = 'blog-images'
LIMIT 5;
