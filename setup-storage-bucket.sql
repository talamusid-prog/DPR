-- Setup Supabase Storage untuk Blog Images dan Gallery Images
-- Jalankan script ini di Supabase SQL Editor

-- Buat bucket untuk gambar blog
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Buat bucket untuk gambar gallery
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Buat policy untuk public read access blog images
CREATE POLICY "Public read access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Buat policy untuk public read access gallery images
CREATE POLICY "Public read access for gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

-- Buat policy untuk authenticated users upload blog images
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users upload gallery images
CREATE POLICY "Authenticated users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users update blog images
CREATE POLICY "Authenticated users can update blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users update gallery images
CREATE POLICY "Authenticated users can update gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users delete blog images
CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users delete gallery images
CREATE POLICY "Authenticated users can delete gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- Verifikasi bucket telah dibuat
SELECT * FROM storage.buckets WHERE id IN ('blog-images', 'gallery-images');
