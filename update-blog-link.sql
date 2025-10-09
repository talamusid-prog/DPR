-- Update blog links from old to new

-- Update 1: Cindy Monica -> Agus Ambo Djiwa Kolaborasi
UPDATE blog_posts 
SET 
  slug = 'agus-ambo-djiwa-kolaborasi-pemerintah-dunia-usaha-masyarakat',
  title = 'Agus Ambo Djiwa: Kolaborasi Pemerintah, Dunia Usaha, Masyarakat',
  updated_at = NOW()
WHERE slug = 'cindy-monica-bangun-kampung-nelayan-merah-putih-di-padang-pariaman';

-- Update 2: Website Responsive -> Kunker Spesifik Kalsel
UPDATE blog_posts 
SET 
  slug = 'kunker-spesifik-di-kalsel-agus-ambo-djiwa-bersama-rombongan-komisi-iv',
  title = 'Kunker Spesifik di Kalsel, Agus Ambo Djiwa Bersama Rombongan Komisi IV',
  updated_at = NOW()
WHERE slug = 'mengapa-website-responsive-penting-era-mobile';

-- Update 3: Tips SEO -> Bantuan Alsintan
UPDATE blog_posts 
SET 
  slug = 'anggota-dpr-agus-ambo-djiwa-salurkan-bantuan-alsintan-senilai-rp50-miliar',
  title = 'Anggota DPR Agus Ambo Djiwa Salurkan Bantuan Alsintan Senilai Rp50 Miliar',
  updated_at = NOW()
WHERE slug = 'tips-membuat-website-seo-friendly';

-- Update 4: Fauzan Khalid -> Agus Ambo Djiwa Bupati ke DPR
UPDATE blog_posts 
SET 
  slug = 'agus-ambo-djiwa-dari-bupati-ke-dpr-dedikasi-nyata-untuk-pertanian-dan-lingkungan',
  title = 'Agus Ambo Djiwa: Dari Bupati ke DPR, Dedikasi Nyata untuk Pertanian dan Lingkungan',
  updated_at = NOW()
WHERE slug = 'fauzan-khalid-tinjau-rumah-warga-lombok-barat-penerima-program-bedah-rumah';

-- Update 5: Website Statis vs Dinamis -> Sosialisasi 4 Pilar
UPDATE blog_posts 
SET 
  slug = 'anggota-dpr-ri-agus-ambo-djiwa-gelar-sosialisasi-4-pilar-di-pasangkayu',
  title = 'Anggota DPR RI, Agus Ambo Djiwa Gelar Sosialisasi 4 Pilar di Pasangkayu',
  updated_at = NOW()
WHERE slug = 'perbedaan-website-statis-vs-dinamis';

-- Verify all updates
SELECT id, title, slug, created_at, updated_at 
FROM blog_posts 
WHERE slug IN (
  'agus-ambo-djiwa-kolaborasi-pemerintah-dunia-usaha-masyarakat',
  'kunker-spesifik-di-kalsel-agus-ambo-djiwa-bersama-rombongan-komisi-iv',
  'anggota-dpr-agus-ambo-djiwa-salurkan-bantuan-alsintan-senilai-rp50-miliar',
  'agus-ambo-djiwa-dari-bupati-ke-dpr-dedikasi-nyata-untuk-pertanian-dan-lingkungan',
  'anggota-dpr-ri-agus-ambo-djiwa-gelar-sosialisasi-4-pilar-di-pasangkayu'
);
