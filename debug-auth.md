# Debug Admin Login Issue

## Langkah Debugging

### 1. Cek Environment Variables
Buka browser console (F12) dan lihat log yang muncul saat login. Harus ada log seperti:
```
🔧 Admin emails configured: ["admin@dpr-ri.com"]
🔧 VITE_ADMIN_EMAIL from env: admin@dpr-ri.com
```

### 2. Cek File .env
Pastikan file `.env` di root directory memiliki:
```env
VITE_ADMIN_EMAIL=admin@dpr-ri.com
```

### 3. Restart Server
Setelah mengubah .env, restart server:
```bash
npm run dev
```

### 4. Cek User di Supabase
1. Buka Supabase Dashboard
2. Authentication > Users
3. Pastikan user `admin@dpr-ri.com` ada dan status "Confirmed"

### 5. Test Login dengan Debug
1. Buka `http://localhost:8080/admin`
2. Buka Developer Tools (F12)
3. Lihat tab Console
4. Login dengan:
   - Email: `admin@dpr-ri.com`
   - Password: `Sembarang123`
5. Lihat log yang muncul

## Kemungkinan Masalah

### A. Environment Variable Tidak Terbaca
**Gejala**: Log menunjukkan `VITE_ADMIN_EMAIL from env: undefined`
**Solusi**: 
- Pastikan file `.env` di root directory
- Restart server
- Cek nama variable (harus `VITE_ADMIN_EMAIL`)

### B. Email Tidak Cocok
**Gejala**: Log menunjukkan email berbeda
**Solusi**:
- Pastikan email di Supabase sama dengan di .env
- Cek case sensitivity (huruf besar/kecil)

### C. User Belum Terkonfirmasi
**Gejala**: Login berhasil tapi role bukan admin
**Solusi**:
- Cek di Supabase Dashboard > Authentication > Users
- Pastikan status "Confirmed"
- Jika belum, klik "Confirm user"

## Quick Fix

Jika masih gagal, coba hardcode email di auth.ts:

```typescript
private adminEmails = [
  'admin@dpr-ri.com'  // Hardcode untuk testing
]
```

Lalu restart server dan test lagi.
