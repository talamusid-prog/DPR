-- Setup Supabase Zeabur Storage Buckets dan RLS Policies
-- Jalankan script ini di Supabase SQL Editor

-- 1. Buat bucket untuk gambar blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Buat bucket untuk gambar gallery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can delete gallery images" ON storage.objects;

-- 5. Create policies for public read access
CREATE POLICY "Public read access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Public read access for gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

-- 6. Create policies for anonymous upload (for public access)
CREATE POLICY "Anonymous users can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

-- 7. Create policies for anonymous update
CREATE POLICY "Anonymous users can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can update gallery images" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery-images');

-- 8. Create policies for anonymous delete
CREATE POLICY "Anonymous users can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can delete gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery-images');

-- 9. Verifikasi bucket telah dibuat
SELECT * FROM storage.buckets WHERE id IN ('blog-images', 'gallery-images');

-- 10. Verifikasi policies telah dibuat
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
