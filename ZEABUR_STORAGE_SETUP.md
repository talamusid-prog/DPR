# Setup Storage di Supabase Zeabur

## 🚨 Masalah yang Ditemukan

Upload gambar **berhasil** tetapi file tidak dapat diakses karena:
- Server Zeabur tidak dapat melayani file static dengan benar
- Storage buckets belum dikonfigurasi dengan RLS policies
- URL mengembalikan 400 Bad Request

## 🔧 Solusi

### 1. Setup Storage Buckets di Supabase Dashboard

**Langkah-langkah:**

1. **Buka Supabase Zeabur Dashboard**
   - URL: `https://supabase-k8m28006.zeabur.app`
   - Login dengan kredensial admin

2. **Pergi ke SQL Editor**
   - Klik "SQL Editor" di sidebar
   - Buat query baru

3. **Jalankan Script SQL**
   ```sql
   -- Copy dan paste seluruh isi file setup-zeabur-storage.sql
   -- Jalankan script ini untuk membuat buckets dan RLS policies
   ```

4. **Verifikasi Setup**
   - Pergi ke "Storage" di sidebar
   - Pastikan buckets `blog-images` dan `gallery-images` sudah ada
   - Test upload file kecil untuk memastikan berfungsi

### 2. Konfigurasi Server Zeabur

**Masalah:** Server Zeabur tidak melayani file static dengan benar.

**Solusi:**
1. **Cek konfigurasi Supabase** di dashboard Zeabur
2. **Pastikan storage service aktif**
3. **Konfigurasi CORS** untuk akses file public
4. **Test akses file** setelah setup

### 3. Fallback Mechanism

**Sementara server belum dikonfigurasi dengan benar:**

Aplikasi sudah memiliki fallback mechanism yang akan:
1. **Coba upload ke Supabase Storage** dulu
2. **Jika gagal**, gunakan base64 compressed
3. **Simpan gambar** sebagai base64 di database

## 📋 Checklist Setup

- [ ] Login ke Supabase Zeabur dashboard
- [ ] Jalankan `setup-zeabur-storage.sql` di SQL Editor
- [ ] Verifikasi buckets dibuat di Storage
- [ ] Test upload file kecil
- [ ] Test akses file public
- [ ] Konfigurasi server untuk melayani file static
- [ ] Test upload gambar di aplikasi

## 🔍 Debugging

**Jika masih ada masalah:**

1. **Cek logs** di Supabase dashboard
2. **Test koneksi** dengan script test-zeabur-storage.js
3. **Verifikasi RLS policies** sudah aktif
4. **Cek konfigurasi server** Zeabur

## 📞 Support

Jika masalah berlanjut:
1. **Cek dokumentasi** Supabase Storage
2. **Hubungi support** Zeabur untuk konfigurasi server
3. **Gunakan fallback mechanism** sementara
