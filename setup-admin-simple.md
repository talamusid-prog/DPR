# Setup Admin User - Cara Sederhana

## 1. Update File .env

Pastikan file `.env` Anda memiliki `VITE_ADMIN_EMAIL`:

```env
VITE_SUPABASE_URL=https://paobhbmitoydoxnifijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM

# Encryption Key for Local Storage
VITE_ENCRYPTION_KEY=your_secure_encryption_key_here

# Admin Configuration
VITE_ADMIN_EMAIL=admin@dpr-ri.com

# Application Configuration
VITE_APP_NAME=Idea Digital Creative
VITE_APP_DESCRIPTION=Platform Dokumentasi Kegiatan Organisasi
VITE_APP_URL=http://localhost:8080

# Development Configuration
NODE_ENV=development
```

## 2. Buat Admin User di Supabase Dashboard

### Langkah-langkah:

1. **Buka Supabase Dashboard**:
   - Pergi ke: https://supabase.com/dashboard
   - Login dengan akun Anda
   - Pilih project: `paobhbmitoydoxnifijk`

2. **Buat User Admin**:
   - Klik **"Authentication"** di sidebar kiri
   - Klik **"Users"** 
   - Klik **"Add user"** (tombol biru di kanan atas)
   - Isi form:
     - **Email**: `admin@dpr-ri.com` (atau email yang Anda inginkan)
     - **Password**: Buat password yang kuat (minimal 8 karakter)
     - **Auto Confirm User**: ✅ **Centang** (penting!)
   - Klik **"Create user"**

3. **Verifikasi**:
   - User akan langsung aktif (karena auto confirm)
   - Anda bisa lihat user baru di list

## 3. Test Login

1. **Restart Server**:
   ```bash
   # Stop server (Ctrl+C) lalu jalankan lagi
   npm run dev
   ```

2. **Buka Admin Panel**:
   - Pergi ke: `http://localhost:8080/admin`

3. **Login**:
   - **Email**: `admin@dpr-ri.com` (atau email yang Anda set)
   - **Password**: Password yang Anda buat di Supabase

## 4. Jika Login Gagal

### Cek Environment Variables:
```bash
# Pastikan .env ada dan benar
cat .env
```

### Cek Console Browser:
1. Buka Developer Tools (F12)
2. Lihat tab Console
3. Cari error messages

### Cek User di Supabase:
1. Buka Supabase Dashboard
2. Authentication > Users
3. Pastikan user ada dan status "Confirmed"

## 5. Ganti Email Admin (Opsional)

Jika ingin menggunakan email lain:

1. **Update .env**:
   ```env
   VITE_ADMIN_EMAIL=email-baru@domain.com
   ```

2. **Buat User Baru di Supabase**:
   - Authentication > Users > Add user
   - Email: `email-baru@domain.com`
   - Password: password yang kuat
   - Auto Confirm: ✅

3. **Restart Server**:
   ```bash
   npm run dev
   ```

## 6. Keamanan

- ✅ **Password kuat**: Minimal 8 karakter, kombinasi huruf, angka, simbol
- ✅ **Email unik**: Gunakan email yang hanya Anda yang tahu
- ✅ **Jangan share kredensial**: Jangan berikan login ke orang lain
- ✅ **Ganti password berkala**: Setiap 3-6 bulan

## 7. Catatan Penting

- ❌ **Login lama tidak berlaku**: `admin/admin123` sudah tidak bisa digunakan
- ✅ **Sistem baru lebih aman**: Menggunakan Supabase Auth
- ✅ **Password terenkripsi**: Disimpan dengan enkripsi di Supabase
- ✅ **Hanya email terdaftar**: Yang bisa login sebagai admin
