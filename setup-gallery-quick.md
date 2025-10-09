# Quick Setup Gallery Database

## 🚀 Langkah Cepat Setup Database Gallery

### 1. Buka Supabase Dashboard
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor** di sidebar kiri

### 2. Jalankan Script SQL
Copy dan paste script dari file `setup-gallery-safe.sql` ke SQL Editor, lalu klik **Run**.

```sql
-- Safe setup for gallery_images table
-- This script can be run multiple times without errors

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
    category TEXT,
    photographer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'draft',
    featured BOOLEAN DEFAULT FALSE
);

-- Create indexes
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
```

### 3. Verifikasi Setup
Setelah menjalankan script, Anda akan melihat pesan:
```
Gallery table setup completed successfully!
```

### 4. Test Upload Gallery
1. Buka aplikasi di `http://localhost:8083`
2. Login sebagai admin
3. Buka **Admin Gallery** 
4. Klik **Tambah Dokumentasi**
5. Upload gambar dan isi data
6. Set status **Published**
7. **Simpan**

### 5. Lihat Hasil
- Buka homepage
- Scroll ke section **Gallery Kegiatan**
- Foto yang diupload akan muncul di sana

## 🔧 Troubleshooting

### Error: "policy already exists"
- ✅ **Sudah diperbaiki**: Script menggunakan `DROP POLICY IF EXISTS`
- ✅ **Aman dijalankan berulang**: Tidak akan error jika policy sudah ada

### Error: "trigger already exists"  
- ✅ **Sudah diperbaiki**: Script menggunakan `DROP TRIGGER IF EXISTS`
- ✅ **Aman dijalankan berulang**: Tidak akan error jika trigger sudah ada

### Error: "table already exists"
- ✅ **Sudah diperbaiki**: Script menggunakan `CREATE TABLE IF NOT EXISTS`
- ✅ **Aman dijalankan berulang**: Tidak akan error jika table sudah ada

### Error: "index already exists"
- ✅ **Sudah diperbaiki**: Script menggunakan `CREATE INDEX IF NOT EXISTS`
- ✅ **Aman dijalankan berulang**: Tidak akan error jika index sudah ada

## 📋 Kategori Gallery
- **Rapat DPR**: Dokumentasi rapat-rapat DPR
- **Reses Anggota DPR**: Dokumentasi reses anggota DPR di daerah
- **Kunjungan Kerja**: Dokumentasi kunjungan kerja ke daerah
- **Penyerahan Bantuan**: Dokumentasi penyerahan bantuan kepada masyarakat
- **Sosialisasi Program**: Dokumentasi sosialisasi program pemerintah
- **Konsultasi Publik**: Dokumentasi konsultasi publik dengan masyarakat
- **Kegiatan Komisi**: Dokumentasi kegiatan komisi-komisi DPR
- **Sidang Paripurna**: Dokumentasi sidang paripurna DPR
- **Hearing Publik**: Dokumentasi hearing publik
- **Lainnya**: Dokumentasi kegiatan lainnya

## ✅ Fitur Gallery
- ✅ Upload foto dengan kategori DPR
- ✅ Penyimpanan base64 (seperti blog)
- ✅ Status draft/published
- ✅ Filter berdasarkan kategori
- ✅ Responsive masonry layout
- ✅ Error handling yang baik
- ✅ Loading states
- ✅ Real-time preview
