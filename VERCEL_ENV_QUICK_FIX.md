# 🚨 Quick Fix: Environment Variables di Vercel

## Status Saat Ini
```
VITE_SUPABASE_URL: ❌ Missing
VITE_SUPABASE_ANON_KEY: ❌ Missing
✅ Supabase client initialized successfully (menggunakan fallback)
```

## 🔧 Solusi Cepat

### Langkah 1: Login ke Vercel Dashboard
1. Buka https://vercel.com/dashboard
2. Login dengan akun Anda
3. Pilih project **DPR**

### Langkah 2: Tambahkan Environment Variables
1. Klik **Settings** → **Environment Variables**
2. Klik **Add New**

**Variable 1:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://paobhbmitoydoxnifijk.supabase.co`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

**Variable 2:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM`
- **Environment:** ✅ Production, ✅ Preview, ✅ Development

### Langkah 3: Save dan Redeploy
1. Klik **Save**
2. Pergi ke **Deployments**
3. Klik **Redeploy** pada deployment terbaru

## 🎯 Hasil yang Diharapkan

Setelah setup environment variables:
```
VITE_SUPABASE_URL: ✅ Set
VITE_SUPABASE_ANON_KEY: ✅ Set
✅ Supabase client initialized successfully
```

## 📱 Screenshot Panduan

### Step 1: Vercel Dashboard
```
Dashboard → DPR Project → Settings
```

### Step 2: Environment Variables
```
Settings → Environment Variables → Add New
```

### Step 3: Add Variables
```
Name: VITE_SUPABASE_URL
Value: https://paobhbmitoydoxnifijk.supabase.co

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM
```

## ✅ Verifikasi

Setelah redeploy:
1. Buka aplikasi di browser
2. Buka Developer Tools (F12)
3. Lihat Console tab
4. Pastikan muncul:
   ```
   VITE_SUPABASE_URL: ✅ Set
   VITE_SUPABASE_ANON_KEY: ✅ Set
   ```

## 🚨 Troubleshooting

**Jika masih "Missing":**
1. Pastikan nama variable tepat: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
2. Pastikan value tidak ada spasi di awal/akhir
3. Pastikan environment dipilih untuk Production, Preview, Development
4. **Wajib redeploy** setelah menambah environment variables

**Jika error persist:**
- Cek deployment logs di Vercel dashboard
- Pastikan tidak ada typo di nama/value variable
- Coba hapus dan tambah ulang environment variables
