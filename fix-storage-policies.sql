-- Script untuk fix storage policies
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Drop semua existing policies
DROP POLICY IF EXISTS "Public read access for blog-images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for gallery-images" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous read access for public buckets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete files" ON storage.objects;

-- 2. Enable RLS (jika belum)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Create simple policy untuk anonymous read access
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT USING (true);

-- 4. Create policy untuk authenticated users
CREATE POLICY "Allow authenticated upload" ON storage.objects
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON storage.objects
FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON storage.objects
FOR DELETE USING (auth.role() = 'authenticated');

-- 5. Verifikasi policies
SELECT 
  policyname,
  cmd,
  roles,
  qual
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;
