# Open Graph & Meta Tags Setup

## Overview
Dokumentasi ini menjelaskan implementasi Open Graph meta tags dan Twitter Cards untuk mengoptimalkan tampilan thumbnail saat artikel dan portofolio di-share di social media.

## Fitur yang Diimplementasikan

### ✅ **Open Graph Meta Tags**
- `og:title` - Judul artikel/portofolio
- `og:description` - Deskripsi singkat
- `og:type` - Tipe konten (article/website)
- `og:url` - URL lengkap halaman
- `og:image` - Gambar thumbnail
- `og:image:width` & `og:image:height` - Dimensi gambar
- `og:image:alt` - Alt text untuk gambar
- `og:site_name` - Nama website
- `og:locale` - Lokal bahasa

### ✅ **Twitter Card Meta Tags**
- `twitter:card` - Tipe card (summary_large_image)
- `twitter:title` - Judul untuk Twitter
- `twitter:description` - Deskripsi untuk Twitter
- `twitter:image` - Gambar untuk Twitter
- `twitter:site` - Handle Twitter website

### ✅ **Article Specific Meta Tags**
- `article:published_time` - Waktu publikasi
- `article:modified_time` - Waktu modifikasi
- `article:author` - Penulis artikel
- `article:tag` - Tag artikel

## Halaman yang Sudah Dioptimasi

### 1. **Blog Detail** (`/blog/:slug`)
```jsx
<Helmet>
  <title>{post.title} | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P.</title>
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.excerpt} />
  <meta property="og:image" content={post.featured_image} />
  {/* ... */}
</Helmet>
```

### 2. **Blog List** (`/blog`)
```jsx
<Helmet>
  <title>Blog & Artikel | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P.</title>
  <meta property="og:title" content="Blog & Artikel | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P." />
  <meta property="og:description" content="Temukan artikel menarik..." />
  {/* ... */}
</Helmet>
```

### 3. **Portfolio Detail** (`/portfolio/:slug`)
```jsx
<Helmet>
  <title>{portfolio.title} | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P.</title>
  <meta property="og:title" content={portfolio.title} />
  <meta property="og:description" content={portfolio.description} />
  <meta property="og:image" content={portfolio.featured_image} />
  {/* ... */}
</Helmet>
```

### 4. **Portfolio List** (`/portfolio`)
```jsx
<Helmet>
  <title>Portofolio Proyek | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P.</title>
  <meta property="og:title" content="Portofolio Proyek | Official Website Dr. Ir. H. AGUS AMBO DJIWA, M.P." />
  <meta property="og:description" content="Kumpulan proyek-proyek..." />
  {/* ... */}
</Helmet>
```

## Dependencies

### **react-helmet-async**
```bash
npm install react-helmet-async
```

### **Setup di App.tsx**
```jsx
import { HelmetProvider } from "react-helmet-async";

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      {/* ... rest of app */}
    </HelmetProvider>
  </ErrorBoundary>
);
```

## Cara Penggunaan

### **Di Komponen React**
```jsx
import { Helmet } from "react-helmet-async";

const MyComponent = () => {
  return (
    <div>
      <Helmet>
        <title>Judul Halaman | Brand</title>
        <meta property="og:title" content="Judul untuk Social Media" />
        <meta property="og:description" content="Deskripsi untuk Social Media" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta property="og:url" content="https://example.com/page" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Judul untuk Twitter" />
        <meta name="twitter:description" content="Deskripsi untuk Twitter" />
        <meta name="twitter:image" content="https://example.com/image.jpg" />
      </Helmet>
      {/* Content */}
    </div>
  );
};
```

## Testing Open Graph

### **1. Facebook Sharing Debugger**
- URL: https://developers.facebook.com/tools/debug/
- Masukkan URL website
- Klik "Debug" untuk melihat preview

### **2. Twitter Card Validator**
- URL: https://cards-dev.twitter.com/validator
- Masukkan URL website
- Klik "Preview card" untuk melihat preview

### **3. LinkedIn Post Inspector**
- URL: https://www.linkedin.com/post-inspector/
- Masukkan URL website
- Klik "Inspect" untuk melihat preview

### **4. WhatsApp Link Preview**
- Share URL di WhatsApp
- Lihat preview yang muncul

## Best Practices

### **1. Gambar Thumbnail**
- **Ukuran Optimal**: 1200x630 pixels
- **Format**: JPG atau PNG
- **File Size**: < 1MB
- **Aspect Ratio**: 1.91:1

### **2. Deskripsi**
- **Panjang Optimal**: 150-160 karakter
- **Jangan gunakan**: Karakter khusus atau emoji
- **Gunakan**: Kalimat yang menarik dan informatif

### **3. Judul**
- **Panjang Optimal**: 50-60 karakter
- **Jangan gunakan**: Karakter khusus
- **Gunakan**: Judul yang jelas dan menarik

### **4. URL**
- **Pastikan**: URL bersih dan SEO-friendly
- **Hindari**: Parameter yang tidak perlu
- **Gunakan**: Canonical URL

## Troubleshooting

### **Thumbnail Tidak Muncul**
1. **Periksa URL Gambar**
   - Pastikan URL gambar dapat diakses publik
   - Coba buka URL gambar di browser

2. **Periksa Meta Tags**
   - Gunakan browser developer tools
   - Lihat source code halaman
   - Pastikan meta tags ada di `<head>`

3. **Cache Social Media**
   - Social media menyimpan cache
   - Gunakan debugger untuk refresh cache
   - Tunggu beberapa jam untuk update otomatis

### **Gambar Terlalu Kecil**
1. **Periksa Dimensi Gambar**
   - Pastikan minimal 600x315 pixels
   - Optimal 1200x630 pixels

2. **Periksa Meta Tags**
   - Pastikan `og:image:width` dan `og:image:height` ada
   - Sesuaikan dengan dimensi gambar asli

### **Deskripsi Terpotong**
1. **Periksa Panjang Teks**
   - Facebook: ~200 karakter
   - Twitter: ~200 karakter
   - LinkedIn: ~200 karakter

2. **Periksa Karakter Khusus**
   - Hindari emoji dan karakter khusus
   - Gunakan karakter ASCII standar

## Monitoring

### **Tools untuk Monitoring**
1. **Google Search Console**
   - Pantau rich snippets
   - Lihat data structured data

2. **Social Media Analytics**
   - Facebook Insights
   - Twitter Analytics
   - LinkedIn Analytics

3. **Third-party Tools**
   - OpenGraph.xyz
   - Metatags.io
   - Social Media Preview

## Notes
- Meta tags di-generate secara dinamis berdasarkan data dari database
- Gambar thumbnail menggunakan featured_image dari artikel/portofolio
- Fallback image digunakan jika tidak ada featured_image
- Semua URL menggunakan domain `https://ideadigiralcreative.com`
- Meta tags di-update setiap kali halaman dimuat
