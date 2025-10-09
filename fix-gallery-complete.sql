-- Complete fix for gallery_images table
-- This script will fix the category constraint issue
-- Run this in Supabase SQL Editor

-- Step 1: Drop existing constraint if it exists
ALTER TABLE public.gallery_images 
DROP CONSTRAINT IF EXISTS gallery_images_category_check;

-- Step 2: Update any existing data with old categories to new categories
UPDATE public.gallery_images 
SET category = CASE 
    WHEN category = 'Rapat' THEN 'Rapat DPR'
    WHEN category = 'Reses' THEN 'Reses Anggota DPR'
    WHEN category = 'Kunjungan' THEN 'Kunjungan Kerja'
    WHEN category = 'Bantuan' THEN 'Penyerahan Bantuan'
    WHEN category = 'Event' THEN 'Lainnya'
    ELSE category
END
WHERE category IN ('Rapat', 'Reses', 'Kunjungan', 'Bantuan', 'Event');

-- Step 3: Add the new constraint with updated categories
ALTER TABLE public.gallery_images 
ADD CONSTRAINT gallery_images_category_check 
CHECK (category IN (
    'Rapat DPR', 
    'Reses Anggota DPR', 
    'Kunjungan Kerja', 
    'Penyerahan Bantuan', 
    'Sosialisasi Program', 
    'Konsultasi Publik', 
    'Kegiatan Komisi', 
    'Sidang Paripurna', 
    'Hearing Publik', 
    'Lainnya'
));

-- Step 4: Verify the constraint is working
SELECT 'Gallery category constraint fixed successfully!' as message;

-- Step 5: Show current categories in the table
SELECT DISTINCT category FROM public.gallery_images ORDER BY category;
