# Setup Database untuk Gallery

## 1. Buat Tabel gallery_images di Supabase

### Langkah-langkah:

1. **Buka Supabase Dashboard**:
   - Pergi ke: https://supabase.com/dashboard
   - Login dengan akun Anda
   - Pilih project: `paobhbmitoydoxnifijk`

2. **Buka SQL Editor**:
   - Klik **"SQL Editor"** di sidebar kiri
   - Klik **"New query"**

3. **Jalankan SQL Script**:
   - Copy script dari file `create-gallery-table.sql`
   - Paste ke SQL Editor
   - Klik **"Run"** (tombol hijau)

### Script SQL yang perlu dijalankan:

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

## 2. Verifikasi Tabel

Setelah menjalankan SQL:

1. **Cek Tabel**:
   - Pergi ke **"Table Editor"** di sidebar
   - Cari tabel `gallery_images`
   - Pastikan tabel ada dan memiliki kolom yang benar

2. **Test Insert Data** (Opsional):
   ```sql
   INSERT INTO public.gallery_images (title, description, slug, image_url, location, category, photographer, status)
   VALUES ('Test Gallery', 'Test description', 'test-gallery', 'https://example.com/image.jpg', 'Test Location', 'Rapat', 'Test Photographer', 'published');
   ```

## 3. Restart Aplikasi

Setelah membuat tabel:

1. **Restart Development Server**:
   ```bash
   npm run dev
   ```

2. **Test Admin Gallery**:
   - Buka: `http://localhost:8082/admin-gallery`
   - Seharusnya tidak ada error lagi
   - Sidebar sudah muncul dengan konsisten

## 4. Troubleshooting

### Jika masih ada error:

1. **Cek Console Browser**:
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error messages

2. **Cek Supabase Logs**:
   - Supabase Dashboard > Logs
   - Lihat error yang muncul

3. **Cek RLS Policies**:
   - Pastikan policies sudah dibuat dengan benar
   - Cek di Supabase Dashboard > Authentication > Policies

## 5. Catatan Penting

- ✅ **Tabel akan dibuat** dengan semua kolom yang diperlukan
- ✅ **RLS diaktifkan** untuk keamanan
- ✅ **Index dibuat** untuk performa yang baik
- ✅ **Trigger dibuat** untuk auto-update timestamp
- ✅ **Policies dibuat** untuk akses yang tepat
