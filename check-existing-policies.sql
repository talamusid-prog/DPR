-- Script untuk cek policies yang sudah ada
-- Jalankan script ini di Supabase Dashboard > SQL Editor

-- 1. Cek policies yang sudah ada
SELECT 
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
ORDER BY policyname;

-- 2. Cek apakah RLS sudah enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- 3. Cek bucket configuration
SELECT 
  name,
  public,
  created_at
FROM storage.buckets 
WHERE name IN ('blog-images', 'gallery-images');
