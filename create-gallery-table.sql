-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT,
    category TEXT CHECK (category IN ('Rapat DPR', 'Reses Anggota DPR', 'Kunjungan Kerja', 'Penyerahan Bantuan', 'Sosialisasi Program', 'Konsultasi Publik', 'Kegiatan Komisi', 'Sidang Paripurna', 'Hearing Publik', 'Lainnya')),
    photographer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN DEFAULT FALSE
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON public.gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON public.gallery_images(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON public.gallery_images(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow public read access to published galleries
CREATE POLICY "Allow public read access to published galleries" ON public.gallery_images
    FOR SELECT USING (status = 'published');

-- Allow authenticated users to read all galleries
CREATE POLICY "Allow authenticated users to read all galleries" ON public.gallery_images
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert galleries
CREATE POLICY "Allow authenticated users to insert galleries" ON public.gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update galleries
CREATE POLICY "Allow authenticated users to update galleries" ON public.gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete galleries
CREATE POLICY "Allow authenticated users to delete galleries" ON public.gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON public.gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
