# Setup Admin User untuk Aplikasi DPR

## 1. Update File .env

Tambahkan baris berikut ke file `.env` Anda:

```env
# Admin Configuration
VITE_ADMIN_EMAIL=admin@dpr-ri.com
```

File `.env` Anda sekarang akan terlihat seperti ini:

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

## 2. Buat Admin User di Supabase

### Langkah 1: Buka Supabase Dashboard
1. Pergi ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda (paobhbmitoydoxnifijk)

### Langkah 2: Buat User Admin
1. Pergi ke **Authentication** > **Users**
2. Klik **"Add user"** atau **"Invite user"**
3. Isi form:
   - **Email**: `admin@dpr-ri.com` (atau email yang Anda inginkan)
   - **Password**: Buat password yang kuat (minimal 8 karakter)
   - **Auto Confirm User**: ✅ Centang (untuk langsung aktif)
4. Klik **"Create user"**

### Langkah 3: Verifikasi User
- User akan langsung aktif jika Anda centang "Auto Confirm User"
- Jika tidak, user akan menerima email konfirmasi

## 3. Test Login

1. Restart development server:
   ```bash
   npm run dev
   ```

2. Buka `http://localhost:8080/admin`

3. Login dengan:
   - **Email**: `admin@dpr-ri.com` (atau email yang Anda set)
   - **Password**: Password yang Anda buat di Supabase

## 4. Troubleshooting

### Jika Login Gagal:
1. **Cek Environment Variables**:
   - Pastikan `VITE_ADMIN_EMAIL` sama dengan email di Supabase
   - Restart server setelah mengubah .env

2. **Cek User di Supabase**:
   - Pastikan user sudah dibuat dan aktif
   - Cek di Authentication > Users

3. **Cek Console Browser**:
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error messages

### Jika Error "Invalid login credentials":
- Pastikan email dan password benar
- Pastikan user sudah aktif di Supabase
- Cek apakah email sudah terverifikasi

## 5. Keamanan

- **Gunakan password yang kuat** (minimal 8 karakter, kombinasi huruf, angka, simbol)
- **Jangan share kredensial login** dengan orang lain
- **Ganti password secara berkala**
- **Hanya email yang terdaftar di `VITE_ADMIN_EMAIL` yang bisa login sebagai admin**

## 6. Catatan Penting

- Sistem login lama (admin/admin123) sudah tidak digunakan
- Sekarang menggunakan Supabase Auth yang lebih aman
- Hanya user dengan email yang terdaftar di `VITE_ADMIN_EMAIL` yang bisa login sebagai admin
- Password disimpan dengan enkripsi di Supabase
