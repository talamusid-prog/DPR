# Panduan Pengaturan Warna

## Fitur yang Tersedia

### 1. Halaman Pengaturan Warna
- **URL**: `/pengaturan-warna`
- **Akses**: Tersedia di menu navigasi utama
- **Fungsi**: Memungkinkan pengguna untuk mengkustomisasi warna aplikasi

### 2. Fitur Utama

#### Kustomisasi Warna
- **Warna Utama**: Primary, Primary Dark, Accent, Accent Dark
- **Warna Status**: Success, Success Dark, Warning, Gold, Gold Light
- **Mode Preview**: Lihat perubahan warna secara real-time
- **Mode Gelap**: Toggle untuk tema gelap/terang

#### Tema Siap Pakai
- **Default (Merah)**: Tema asli aplikasi
- **Biru Profesional**: Tema dengan warna biru
- **Hijau Alam**: Tema dengan warna hijau
- **Ungu Kreatif**: Tema dengan warna ungu

#### Import/Export
- **Export**: Simpan konfigurasi tema ke file JSON
- **Import**: Muat konfigurasi tema dari file JSON
- **Format**: File JSON dengan struktur yang konsisten

### 3. Cara Penggunaan

#### Mengubah Warna Manual
1. Buka halaman Pengaturan Warna
2. Aktifkan "Mode Preview" untuk melihat perubahan real-time
3. Ubah nilai HSL di kolom input warna
4. Klik "Simpan Tema" untuk menyimpan perubahan

#### Menggunakan Tema Siap Pakai
1. Buka tab "Tema Siap Pakai"
2. Pilih tema yang diinginkan
3. Klik "Pilih Tema"
4. Klik "Simpan Tema" untuk menerapkan

#### Import/Export Tema
1. Buka tab "Import/Export"
2. Untuk export: Klik "Export Tema"
3. Untuk import: Pilih file JSON tema
4. Tema akan otomatis diterapkan

### 4. Format Warna HSL

Semua warna menggunakan format HSL (Hue, Saturation, Lightness):
- **Format**: `h s% l%`
- **Contoh**: `0 84% 60%` (merah)
- **Hue**: 0-360 (derajat warna)
- **Saturation**: 0-100% (intensitas warna)
- **Lightness**: 0-100% (kecerahan)

### 5. Penyimpanan

- **Local Storage**: Tema disimpan di browser pengguna
- **Persistensi**: Tema akan tetap tersimpan setelah refresh halaman
- **Reset**: Gunakan tombol "Reset" untuk kembali ke tema default

### 6. Komponen Teknis

#### File yang Dibuat
- `src/components/ColorSettings.tsx`: Komponen utama pengaturan warna
- `src/pages/ColorSettingsPage.tsx`: Halaman wrapper dengan SEO
- `src/hooks/useTheme.ts`: Hook untuk mengelola state tema

#### Integrasi
- Route ditambahkan di `src/App.tsx`
- Link navigasi ditambahkan di `src/components/Header.tsx`
- Menggunakan CSS variables untuk perubahan warna real-time

### 7. Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **CSS Variables**: Diperlukan dukungan CSS custom properties
- **Local Storage**: Diperlukan untuk penyimpanan tema
- **File API**: Diperlukan untuk import/export tema

### 8. Troubleshooting

#### Tema Tidak Berubah
- Pastikan "Mode Preview" aktif
- Periksa format HSL yang benar
- Refresh halaman setelah menyimpan

#### Import Gagal
- Pastikan file JSON valid
- Periksa struktur file sesuai format yang benar
- Coba export tema baru untuk melihat format yang benar

#### Warna Tidak Sesuai
- Periksa nilai HSL (0-360 untuk hue, 0-100% untuk saturation/lightness)
- Pastikan tidak ada karakter tambahan di input
- Gunakan format yang konsisten
