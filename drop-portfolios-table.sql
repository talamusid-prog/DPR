-- Script untuk menghapus tabel portfolios yang sudah tidak digunakan
-- Jalankan script ini di Supabase Dashboard > SQL Editor
-- PERINGATAN: Script ini akan menghapus tabel portfolios dan semua datanya!

-- ============================================
-- STEP 1: BACKUP DATA (Optional)
-- ============================================
-- Jika Anda ingin backup data sebelum menghapus, uncomment baris berikut:
-- CREATE TABLE portfolios_backup AS SELECT * FROM public.portfolios;

-- ============================================
-- STEP 2: DROP ALL POLICIES
-- ============================================

-- Drop semua policies terkait portfolios
DROP POLICY IF EXISTS "Optimized portfolio access" ON public.portfolios;
DROP POLICY IF EXISTS "Allow public read access to published portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Enable read for all users" ON public.portfolios;
DROP POLICY IF EXISTS "Authenticated users can manage portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Authenticated users can update portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Authenticated users can delete portfolios" ON public.portfolios;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.portfolios;
DROP POLICY IF EXISTS "Enable update for all users" ON public.portfolios;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.portfolios;

-- ============================================
-- STEP 3: DROP INDEXES
-- ============================================

-- Drop semua indexes terkait portfolios
DROP INDEX IF EXISTS idx_portfolios_status;
DROP INDEX IF EXISTS idx_portfolios_created_at;
DROP INDEX IF EXISTS idx_portfolios_featured;

-- ============================================
-- STEP 4: DROP TABLE
-- ============================================

-- Drop tabel portfolios
DROP TABLE IF EXISTS public.portfolios CASCADE;

-- ============================================
-- STEP 5: VERIFY DELETION
-- ============================================

-- Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'portfolios' AND table_schema = 'public') 
    THEN 'Table portfolios still exists'
    ELSE 'Table portfolios successfully deleted'
  END as status;

-- Check remaining policies
SELECT 
  'Remaining Policies' as category,
  schemaname,
  tablename,
  policyname
FROM pg_policies 
WHERE tablename = 'portfolios'
AND schemaname = 'public';

-- Success message
SELECT '🎉 Portfolios table and all related policies successfully deleted!' as result;
