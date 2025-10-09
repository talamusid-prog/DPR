# Vercel Environment Variables Setup

## Error yang Terjadi
```
Uncaught Error: Missing Supabase environment variables. Please check your .env file.
```

## Solusi

### 1. Setup Environment Variables di Vercel

**Langkah-langkah:**

1. **Login ke Vercel Dashboard:**
   - Buka https://vercel.com/dashboard
   - Login dengan akun Anda

2. **Pilih Project:**
   - Klik pada project DPR Anda

3. **Pergi ke Settings:**
   - Klik tab **"Settings"**
   - Pilih **"Environment Variables"** di sidebar

4. **Tambahkan Environment Variables:**
   
   **Variable 1:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** `https://your-project-id.supabase.co`
   - **Environment:** Production, Preview, Development

   **Variable 2:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** `your-anon-key-here`
   - **Environment:** Production, Preview, Development

### 2. Cara Mendapatkan Supabase Credentials

**Langkah-langkah:**

1. **Buka Supabase Dashboard:**
   - Login ke https://supabase.com/dashboard
   - Pilih project Anda

2. **Pergi ke Settings:**
   - Klik **"Settings"** di sidebar
   - Pilih **"API"**

3. **Copy Credentials:**
   - **Project URL:** Copy dari "Project URL"
   - **Anon Key:** Copy dari "Project API keys" → "anon public"

### 3. Redeploy di Vercel

**Setelah menambahkan environment variables:**

1. **Trigger Redeploy:**
   - Pergi ke tab **"Deployments"**
   - Klik **"Redeploy"** pada deployment terbaru
   - Atau push commit baru ke GitHub

2. **Atau Manual Deploy:**
   ```bash
   git add .
   git commit -m "fix: Add environment variables"
   git push origin master
   ```

### 4. Verifikasi

**Cek di Vercel Dashboard:**
- Pastikan environment variables sudah tersedia
- Pastikan deployment berhasil tanpa error
- Test aplikasi di URL production

## Environment Variables yang Diperlukan

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

**Jika masih error:**

1. **Cek Environment Variables:**
   - Pastikan nama variable benar: `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
   - Pastikan value tidak ada spasi di awal/akhir

2. **Redeploy:**
   - Setelah menambah environment variables, wajib redeploy
   - Environment variables tidak otomatis ter-apply ke deployment yang sudah ada

3. **Cek Supabase Project:**
   - Pastikan project Supabase masih aktif
   - Pastikan API key masih valid

## File yang Perlu Diperhatikan

- `src/lib/supabase.ts` - File yang menggunakan environment variables
- `.env.local` - File environment local (jangan di-commit)
- `vercel.json` - Konfigurasi Vercel (jika ada)
