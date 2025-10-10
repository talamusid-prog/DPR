# Environment Variables Setup

## File .env yang Diperlukan

Buat file `.env` di root directory dengan konten berikut:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://supabase-k8m28929.zeabur.app
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Encryption Key for Local Storage
VITE_ENCRYPTION_KEY=your_secure_encryption_key_here

# Admin Configuration
VITE_ADMIN_EMAIL=admin@dpr-ri.com

# Application Configuration
VITE_APP_NAME=Idea Digital Creative
VITE_APP_DESCRIPTION=Platform Dokumentasi Kegiatan Organisasi
VITE_APP_URL=https://ideadigiralcreative.com

# Development Configuration
NODE_ENV=development
```

## Cara Mendapatkan Nilai Environment Variables

### 1. Supabase Configuration
1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project Anda
3. Pergi ke Settings > API
4. Copy:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`

### 2. Encryption Key
Generate secure encryption key untuk enkripsi data di localStorage:
```bash
# Generate random 32-character key
openssl rand -hex 32
```

### 3. Admin Configuration
- `VITE_ADMIN_EMAIL`: Email admin yang akan memiliki akses admin
- Ganti dengan email yang Anda inginkan (contoh: `admin@dpr-ri.com`)

### 4. Application Configuration
- `VITE_APP_NAME`: Nama aplikasi
- `VITE_APP_DESCRIPTION`: Deskripsi aplikasi
- `VITE_APP_URL`: URL aplikasi (untuk production)

## Contoh File .env Lengkap

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://supabase-k8m28929.zeabur.app
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# Encryption Key for Local Storage
VITE_ENCRYPTION_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Admin Configuration
VITE_ADMIN_EMAIL=admin@dpr-ri.com

# Application Configuration
VITE_APP_NAME=Idea Digital Creative
VITE_APP_DESCRIPTION=Platform Dokumentasi Kegiatan Organisasi
VITE_APP_URL=https://ideadigiralcreative.com

# Development Configuration
NODE_ENV=development
```

## Setup Admin User di Supabase

1. **Buka Supabase Dashboard**:
   - Pergi ke [Supabase Dashboard](https://supabase.com/dashboard)
   - Pilih project Anda

2. **Buat Admin User**:
   - Pergi ke Authentication > Users
   - Klik "Add user" atau "Invite user"
   - Masukkan email yang sama dengan `VITE_ADMIN_EMAIL` di file .env
   - Set password yang kuat (minimal 8 karakter)
   - Klik "Send invitation" atau "Create user"

3. **Verifikasi Email**:
   - Admin user akan menerima email konfirmasi
   - Klik link di email untuk mengaktifkan akun
   - Login dengan email dan password yang sudah diset

## Catatan Penting

1. **Jangan commit file .env ke Git** - file ini sudah ada di .gitignore
2. **Gunakan .env.local untuk development** - file ini juga tidak akan di-commit
3. **Generate encryption key yang kuat** - minimal 32 karakter
4. **Jaga keamanan Supabase keys** - jangan share keys ke public
5. **Gunakan password admin yang kuat** - minimal 8 karakter dengan kombinasi huruf, angka, dan simbol
6. **Hanya email yang terdaftar di `VITE_ADMIN_EMAIL` yang bisa login sebagai admin**

## Troubleshooting

Jika ada error "Missing Supabase environment variables":
1. Pastikan file .env ada di root directory
2. Pastikan nama variable dimulai dengan `VITE_`
3. Restart development server setelah membuat .env
4. Cek console browser untuk error detail
