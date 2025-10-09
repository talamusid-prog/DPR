-- Seeder data aspirasi untuk Supabase
-- Jalankan script ini di SQL Editor di dashboard Supabase

-- Insert sample data aspirasi
INSERT INTO aspirations (nama, email, kategori, aspirasi, status, created_at, updated_at) VALUES
(
  'Budi Santoso',
  'budi.santoso@email.com',
  'Infrastruktur',
  'Saya ingin mengajukan aspirasi untuk perbaikan jalan di Desa Sukamaju yang sudah rusak parah. Jalan tersebut merupakan akses utama menuju pasar dan sekolah, sehingga sangat mengganggu aktivitas warga. Mohon perhatian untuk segera diperbaiki.',
  'baru',
  NOW(),
  NOW()
),
(
  'Siti Nurhaliza',
  'siti.nurhaliza@gmail.com',
  'Pendidikan',
  'Sebagai orang tua, saya sangat prihatin dengan kondisi gedung sekolah SD Negeri 01 yang sudah tidak layak pakai. Atap bocor, lantai retak, dan dinding yang sudah rapuh. Anak-anak kesulitan belajar dalam kondisi seperti ini. Mohon bantuan untuk renovasi gedung sekolah.',
  'diproses',
  NOW() - INTERVAL '2 days',
  NOW() - INTERVAL '1 day'
),
(
  'Ahmad Wijaya',
  'ahmad.wijaya@yahoo.com',
  'Kesehatan',
  'Saya ingin mengajukan aspirasi untuk pembangunan puskesmas di Desa Makmur. Saat ini warga harus menempuh jarak 15 km untuk mendapatkan layanan kesehatan dasar. Dengan adanya puskesmas, warga akan lebih mudah mengakses layanan kesehatan.',
  'selesai',
  NOW() - INTERVAL '7 days',
  NOW() - INTERVAL '3 days'
),
(
  'Rina Sari',
  'rina.sari@email.com',
  'Ekonomi',
  'Sebagai pengusaha kecil, saya ingin mengajukan aspirasi untuk program pelatihan kewirausahaan dan bantuan modal usaha. Banyak warga yang memiliki keterampilan tetapi tidak memiliki modal untuk memulai usaha. Program ini akan sangat membantu meningkatkan perekonomian desa.',
  'baru',
  NOW() - INTERVAL '1 day',
  NOW() - INTERVAL '1 day'
),
(
  'Dedi Kurniawan',
  'dedi.kurniawan@gmail.com',
  'Lingkungan',
  'Saya ingin mengajukan aspirasi untuk program penanaman pohon dan penghijauan di sepanjang jalan raya. Selain untuk keindahan, juga untuk mengurangi polusi udara. Program ini akan melibatkan warga dan organisasi lingkungan.',
  'diproses',
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '2 days'
),
(
  'Maya Sari',
  'maya.sari@email.com',
  'Sosial',
  'Sebagai ketua PKK, saya ingin mengajukan aspirasi untuk program pemberdayaan perempuan dan anak. Program ini meliputi pelatihan keterampilan, pendidikan kesehatan reproduksi, dan perlindungan anak. Ini akan membantu meningkatkan kualitas hidup keluarga.',
  'baru',
  NOW() - INTERVAL '3 days',
  NOW() - INTERVAL '3 days'
),
(
  'Rudi Hartono',
  'rudi.hartono@yahoo.com',
  'Infrastruktur',
  'Saya ingin mengajukan aspirasi untuk pembangunan jembatan penghubung antara Desa A dan Desa B. Saat ini warga harus memutar jauh untuk menyeberangi sungai. Jembatan ini akan mempersingkat jarak dan memudahkan akses transportasi.',
  'selesai',
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '5 days'
),
(
  'Lina Marlina',
  'lina.marlina@gmail.com',
  'Pendidikan',
  'Sebagai guru, saya ingin mengajukan aspirasi untuk program beasiswa pendidikan bagi anak-anak kurang mampu. Banyak anak yang memiliki potensi tetapi terhambat karena masalah ekonomi. Program beasiswa ini akan membantu mereka mengakses pendidikan yang layak.',
  'diproses',
  NOW() - INTERVAL '4 days',
  NOW() - INTERVAL '1 day'
),
(
  'Bambang Sutrisno',
  'bambang.sutrisno@email.com',
  'Kesehatan',
  'Saya ingin mengajukan aspirasi untuk program posyandu dan layanan kesehatan gratis bagi lansia. Banyak lansia yang kesulitan mengakses layanan kesehatan karena masalah biaya. Program ini akan membantu mereka mendapatkan perawatan yang layak.',
  'baru',
  NOW() - INTERVAL '6 days',
  NOW() - INTERVAL '6 days'
),
(
  'Sari Indah',
  'sari.indah@yahoo.com',
  'Ekonomi',
  'Sebagai pengusaha UMKM, saya ingin mengajukan aspirasi untuk program pemasaran digital dan akses ke pasar online. Banyak produk lokal yang berkualitas tetapi tidak memiliki akses ke pasar yang lebih luas. Program ini akan membantu meningkatkan penjualan.',
  'selesai',
  NOW() - INTERVAL '8 days',
  NOW() - INTERVAL '4 days'
);

-- Verify the inserted data
SELECT 
  id,
  nama,
  email,
  kategori,
  status,
  created_at,
  updated_at
FROM aspirations 
ORDER BY created_at DESC;
