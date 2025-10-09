# Cara Setup Environment Variables di Vercel

## 🚨 Error yang Terjadi
```
Uncaught Error: Missing Supabase environment variables. Please check your .env file.
```

## 🔧 Solusi: Setup Environment Variables di Vercel

### Langkah 1: Login ke Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Login dengan akun GitHub Anda
3. Pilih project **DPR** dari daftar project

### Langkah 2: Masuk ke Settings
1. Klik pada project **DPR**
2. Klik tab **"Settings"** di menu atas
3. Pilih **"Environment Variables"** di sidebar kiri

### Langkah 3: Tambahkan Environment Variables

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://paobhbmitoydoxnifijk.supabase.co`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### Langkah 4: Save dan Redeploy
1. Klik **"Save"** setelah menambahkan kedua variable
2. Pergi ke tab **"Deployments"**
3. Klik **"Redeploy"** pada deployment terbaru
4. Atau push commit baru ke GitHub untuk trigger auto-deploy

## 📸 Screenshot Panduan

### Step 1: Masuk ke Project Settings
```
Vercel Dashboard → DPR Project → Settings Tab
```

### Step 2: Environment Variables
```
Settings → Environment Variables → Add New
```

### Step 3: Tambahkan Variables
```
Name: VITE_SUPABASE_URL
Value: https://paobhbmitoydoxnifijk.supabase.co
Environment: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY  
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM
Environment: Production, Preview, Development
```

## 🔄 Alternative: Push Commit untuk Auto-Deploy

Jika tidak ingin manual redeploy, bisa push commit kosong:

```bash
git commit --allow-empty -m "trigger: Redeploy with environment variables"
git push origin master
```

## ✅ Verifikasi

Setelah setup environment variables:

1. **Cek di Vercel Dashboard:**
   - Pastikan environment variables sudah tersedia
   - Pastikan deployment berhasil tanpa error

2. **Test Aplikasi:**
   - Buka URL production Vercel
   - Pastikan tidak ada error di console
   - Test fitur yang menggunakan Supabase (kalender, aspirasi, dll)

## 🚨 Troubleshooting

**Jika masih error:**

1. **Pastikan Environment Variables:**
   - Nama variable harus tepat: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   - Value tidak ada spasi di awal/akhir
   - Environment dipilih untuk Production, Preview, Development

2. **Redeploy Wajib:**
   - Environment variables tidak otomatis ter-apply ke deployment lama
   - Harus redeploy setelah menambah environment variables

3. **Cek Supabase:**
   - Pastikan project Supabase masih aktif
   - Pastikan API key masih valid

## 📞 Bantuan

Jika masih mengalami masalah:
1. Screenshot error di console browser
2. Screenshot environment variables di Vercel dashboard
3. Cek deployment logs di Vercel dashboard
