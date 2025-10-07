-- Gallery Images Table untuk Haerul Hadi
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    photographer VARCHAR(100) NOT NULL DEFAULT 'Admin',
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gallery_images_status ON gallery_images(status);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_gallery_images_featured ON gallery_images(featured);
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_images_slug ON gallery_images(slug);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_images_updated_at 
    BEFORE UPDATE ON gallery_images 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) Policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Policy untuk membaca data (semua orang bisa membaca data published)
CREATE POLICY "Gallery images are viewable by everyone for published status" ON gallery_images
    FOR SELECT USING (status = 'published' OR auth.role() = 'authenticated');

-- Policy untuk insert (hanya authenticated users)
CREATE POLICY "Gallery images are insertable by authenticated users" ON gallery_images
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy untuk update (hanya authenticated users)
CREATE POLICY "Gallery images are updatable by authenticated users" ON gallery_images
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy untuk delete (hanya authenticated users)
CREATE POLICY "Gallery images are deletable by authenticated users" ON gallery_images
    FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data untuk testing (opsional)
INSERT INTO gallery_images (title, description, slug, image_url, location, category, photographer, status, featured) VALUES
('Pantai Senggigi yang Memukau', 'Keindahan pantai Senggigi dengan pasir putih dan air laut yang jernih, destinasi wisata favorit di Lombok', 'pantai-senggigi-memukau', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop', 'Senggigi, Lombok Barat', 'Pantai', 'Admin', 'published', true),
('Gunung Rinjani Megah', 'Pemandangan spektakuler Gunung Rinjani, gunung tertinggi kedua di Indonesia yang menjadi kebanggaan NTB', 'gunung-rinjani-megah', 'https://images.unsplash.com/photo-1600057791880-79d161154121?q=80&w=2070&auto=format&fit=crop', 'Lombok, NTB', 'Alam', 'Admin', 'published', true),
('Budaya Sasak Tradisional', 'Pertunjukan tari tradisional Sasak dalam acara budaya Haerul Hadi', 'budaya-sasak-tradisional', 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?q=80&w=2070&auto=format&fit=crop', 'Mataram, NTB', 'Budaya', 'Haerul Hadi', 'published', false),
('Gili Trawangan Paradise', 'Keindahan Gili Trawangan dengan air laut biru jernih dan kehidupan bawah laut yang menakjubkan', 'gili-trawangan-paradise', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop', 'Gili Trawangan, NTB', 'Pulau', 'Admin', 'published', false),
('Kegiatan Komunitas Pemuda', 'Foto bersama anggota komunitas dalam kegiatan pemberdayaan pemuda daerah', 'kegiatan-komunitas-pemuda', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop', 'Mataram, NTB', 'Kegiatan Komunitas', 'Dokumentasi Komunitas', 'published', false);

-- Grants untuk public access (opsional, sesuaikan dengan kebutuhan)
GRANT SELECT ON gallery_images TO anon;
GRANT ALL ON gallery_images TO authenticated;

-- Comment pada tabel
COMMENT ON TABLE gallery_images IS 'Tabel untuk menyimpan foto-foto galeri Haerul Hadi';
COMMENT ON COLUMN gallery_images.title IS 'Judul foto';
COMMENT ON COLUMN gallery_images.description IS 'Deskripsi foto atau cerita di balik foto';
COMMENT ON COLUMN gallery_images.slug IS 'URL-friendly identifier untuk foto';
COMMENT ON COLUMN gallery_images.image_url IS 'URL atau base64 data gambar';
COMMENT ON COLUMN gallery_images.location IS 'Lokasi tempat foto diambil';
COMMENT ON COLUMN gallery_images.category IS 'Kategori foto (Alam, Pantai, Pulau, Budaya, dll)';
COMMENT ON COLUMN gallery_images.photographer IS 'Nama photographer atau sumber foto';
COMMENT ON COLUMN gallery_images.status IS 'Status publikasi: draft atau published';
COMMENT ON COLUMN gallery_images.featured IS 'Apakah foto ini featured/unggulan';
