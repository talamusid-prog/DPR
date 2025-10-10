-- SQL Script untuk Anonymous Access ke Storage
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Enable RLS pada storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies jika ada
DROP POLICY IF EXISTS "Public read access for blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for gallery-images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous read access for public buckets" ON storage.objects;

-- 3. Create policy untuk anonymous read access ke semua public buckets
CREATE POLICY "Anonymous read access for public buckets" ON storage.objects
FOR SELECT USING (
  bucket_id IN ('blog-images', 'gallery-images')
);

-- 4. Create policy untuk authenticated users upload
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id IN ('blog-images', 'gallery-images')
  AND auth.role() = 'authenticated'
);

-- 5. Create policy untuk authenticated users update
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (
  bucket_id IN ('blog-images', 'gallery-images')
  AND auth.role() = 'authenticated'
);

-- 6. Create policy untuk authenticated users delete
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (
  bucket_id IN ('blog-images', 'gallery-images')
  AND auth.role() = 'authenticated'
);

-- 7. Verifikasi policies
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
