-- Simple fix untuk bucket public access
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Make buckets public
UPDATE storage.buckets SET public = true WHERE name = 'blog-images';
UPDATE storage.buckets SET public = true WHERE name = 'gallery-images';

-- 2. Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create simple policy untuk public access
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (true);

-- 4. Verifikasi
SELECT name, public FROM storage.buckets WHERE name IN ('blog-images', 'gallery-images');
