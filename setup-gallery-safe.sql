-- Safe setup for gallery_images table
-- This script can be run multiple times without errors
-- Run this in Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read access to published galleries" ON public.gallery_images;
DROP POLICY IF EXISTS "Allow authenticated users to manage galleries" ON public.gallery_images;

-- Drop existing trigger first
DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON public.gallery_images;

-- Create table if not exists
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT,
    category TEXT CHECK (category IN (
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
    )),
    photographer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE
);

-- Create indexes (IF NOT EXISTS will prevent errors)
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at DESC);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to published galleries" ON public.gallery_images
    FOR SELECT USING (status = 'published');

CREATE POLICY "Allow authenticated users to manage galleries" ON public.gallery_images
    FOR ALL USING (auth.role() = 'authenticated');

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON public.gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Test the setup
SELECT 'Gallery table setup completed successfully!' as message;
