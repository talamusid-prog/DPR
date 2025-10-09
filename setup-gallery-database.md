# Setup Gallery Database

## Langkah-langkah Setup Database Gallery

### 1. Buka Supabase Dashboard
1. Login ke [supabase.com](https://supabase.com)
2. Pilih project Anda
3. Buka **SQL Editor** di sidebar kiri

### 2. Jalankan SQL Script
Copy dan paste script berikut ke SQL Editor, lalu klik **Run**:

```sql
-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    image_url TEXT NOT NULL,
    location TEXT,
    category TEXT CHECK (category IN ('Rapat', 'Reses', 'Kunjungan', 'Bantuan', 'Event')),
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
```

### 3. Verifikasi Setup
Setelah menjalankan script, verifikasi bahwa:
- ✅ Table `gallery_images` berhasil dibuat
- ✅ Indexes berhasil dibuat
- ✅ RLS policies berhasil dibuat
- ✅ Trigger berhasil dibuat

### 4. Test Upload Gallery
1. Buka aplikasi di browser
2. Login sebagai admin
3. Buka halaman **Admin Gallery**
4. Upload foto dokumentasi
5. Set status menjadi **Published**
6. Kembali ke halaman utama
7. Scroll ke section **Gallery Kegiatan**
8. Foto yang diupload seharusnya muncul di sana

### 5. Troubleshooting

#### Error: "Could not find the table 'public.gallery_images'"
- Pastikan script SQL dijalankan dengan benar
- Cek di **Table Editor** apakah table `gallery_images` ada

#### Error: "Permission denied"
- Pastikan RLS policies sudah dibuat dengan benar
- Cek apakah user sudah login sebagai admin

#### Foto tidak muncul di Gallery
- Pastikan status foto adalah **Published**
- Cek console browser untuk error
- Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah benar

### 6. Kategori Gallery
Gallery mendukung 10 kategori sesuai kebutuhan anggota DPR:
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

### 7. Fitur Gallery
- ✅ Upload foto dengan kategori
- ✅ Tambah lokasi dan pencatat
- ✅ Status draft/published
- ✅ Filter berdasarkan kategori
- ✅ Responsive masonry layout
- ✅ Loading states dan error handling
- ✅ Fallback ke gambar lokal jika tidak ada data
