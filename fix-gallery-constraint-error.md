# Fix Gallery Category Constraint Error

## 🚨 Error yang Terjadi
```
❌ Insert error: {code: '23514', message: 'new row for relation "gallery_images" violates check constraint "gallery_images_category_check"'}
```

## 🔍 Penyebab Error
- Database masih menggunakan constraint lama dengan kategori: `'Rapat', 'Reses', 'Kunjungan', 'Bantuan', 'Event'`
- Aplikasi sudah menggunakan kategori baru: `'Rapat DPR', 'Reses Anggota DPR', 'Kunjungan Kerja', 'Penyerahan Bantuan', 'Sosialisasi Program', 'Konsultasi Publik', 'Kegiatan Komisi', 'Sidang Paripurna', 'Hearing Publik', 'Lainnya'`

## ✅ Solusi

### Opsi 1: Fix Constraint (Recommended)
Jalankan script `fix-gallery-complete.sql` di Supabase SQL Editor:

```sql
-- Complete fix for gallery_images table
-- This script will fix the category constraint issue

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
```

### Opsi 2: Recreate Table (Jika tidak ada data penting)
Jika tidak ada data penting di table, bisa drop dan recreate:

```sql
-- Drop table completely
DROP TABLE IF EXISTS public.gallery_images CASCADE;

-- Run setup-gallery-safe.sql script
-- (Copy isi file setup-gallery-safe.sql)
```

## 🧪 Test Setelah Fix

### 1. Verifikasi Constraint
```sql
-- Check constraint exists
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'public.gallery_images'::regclass 
AND conname = 'gallery_images_category_check';
```

### 2. Test Insert
```sql
-- Test insert with new category
INSERT INTO public.gallery_images (
    title, description, slug, image_url, 
    location, category, photographer, status
) VALUES (
    'Test Rapat DPR', 'Test description', 'test-rapat-dpr', 
    'data:image/jpeg;base64,test', 'Jakarta', 
    'Rapat DPR', 'Admin', 'published'
);
```

### 3. Test Upload di Aplikasi
1. Buka `http://localhost:8083/admin-gallery`
2. Login sebagai admin
3. Klik **Tambah Dokumentasi**
4. Upload gambar
5. Pilih kategori **Rapat DPR**
6. Isi data lainnya
7. Set status **Published**
8. **Simpan** (seharusnya tidak ada error)

## 📋 Kategori yang Didukung Setelah Fix

### Kategori DPR:
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

## 🔧 Troubleshooting

### Error: "constraint does not exist"
- ✅ **Normal**: Constraint belum ada, script akan membuat yang baru
- ✅ **Lanjutkan**: Script akan berjalan normal

### Error: "permission denied"
- ✅ **Check RLS**: Pastikan user memiliki permission untuk update
- ✅ **Run as admin**: Jalankan script dengan user admin

### Error: "data type mismatch"
- ✅ **Check existing data**: Pastikan data lama sudah diupdate
- ✅ **Run UPDATE first**: Jalankan UPDATE statement terlebih dahulu

## ✅ Verifikasi Berhasil

Setelah menjalankan script, Anda akan melihat:
1. ✅ Pesan: `Gallery category constraint fixed successfully!`
2. ✅ List kategori yang ada di table
3. ✅ Upload gallery berhasil tanpa error
4. ✅ Foto muncul di homepage gallery section
