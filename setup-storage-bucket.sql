-- Setup Supabase Storage untuk Blog Images
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

-- Buat policy untuk public read access
CREATE POLICY "Public read access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

-- Buat policy untuk authenticated users upload
CREATE POLICY "Authenticated users can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users update
CREATE POLICY "Authenticated users can update blog images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Buat policy untuk authenticated users delete
CREATE POLICY "Authenticated users can delete blog images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-images' 
  AND auth.role() = 'authenticated'
);

-- Verifikasi bucket telah dibuat
SELECT * FROM storage.buckets WHERE id = 'blog-images';
