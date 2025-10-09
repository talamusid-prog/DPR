-- Fix gallery_images category constraint
-- Run this in Supabase SQL Editor to update the constraint

-- Drop the old constraint
ALTER TABLE public.gallery_images 
DROP CONSTRAINT IF EXISTS gallery_images_category_check;

-- Add the new constraint with updated categories
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

-- Test the constraint
SELECT 'Gallery category constraint updated successfully!' as message;
