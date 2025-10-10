-- Script untuk menghapus referensi portfolios dari kode aplikasi
-- Jalankan script ini setelah drop-portfolios-table.sql

-- ============================================
-- STEP 1: DROP PORTFOLIOS TABLE (jika belum)
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

-- Drop semua indexes terkait portfolios
DROP INDEX IF EXISTS idx_portfolios_status;
DROP INDEX IF EXISTS idx_portfolios_created_at;
DROP INDEX IF EXISTS idx_portfolios_featured;

-- Drop tabel portfolios
DROP TABLE IF EXISTS public.portfolios CASCADE;

-- ============================================
-- STEP 2: VERIFY DELETION
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
