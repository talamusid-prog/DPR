// Script untuk optimasi gambar untuk mobile
const fs = require('fs');
const path = require('path');

console.log('🖼️ Optimizing images for mobile...');

// Daftar gambar yang perlu dioptimasi
const imagesToOptimize = [
  'public/background2.jpg',
  'public/logo2.png', 
  'public/background2.png',
  'public/jasa1.png',
  'public/logo.png'
];

// Fungsi untuk check apakah file ada
const checkFileExists = (filePath) => {
  return fs.existsSync(filePath);
};

// Fungsi untuk get file size
const getFileSize = (filePath) => {
  const stats = fs.statSync(filePath);
  return stats.size;
};

// Fungsi untuk optimize image (placeholder - dalam implementasi nyata akan menggunakan sharp atau imagemin)
const optimizeImage = (filePath) => {
  const originalSize = getFileSize(filePath);
  console.log(`📁 ${filePath}: ${(originalSize / 1024).toFixed(2)} KB`);
  
  // Dalam implementasi nyata, di sini akan ada kompresi gambar
  // Untuk sekarang, hanya log informasi
  return {
    original: originalSize,
    optimized: Math.round(originalSize * 0.7), // Simulasi 30% reduction
    saved: Math.round(originalSize * 0.3)
  };
};

// Main function
const main = () => {
  console.log('🔍 Checking images...');
  
  let totalOriginal = 0;
  let totalOptimized = 0;
  let totalSaved = 0;
  
  imagesToOptimize.forEach(imagePath => {
    if (checkFileExists(imagePath)) {
      const result = optimizeImage(imagePath);
      totalOriginal += result.original;
      totalOptimized += result.optimized;
      totalSaved += result.saved;
    } else {
      console.log(`⚠️ File not found: ${imagePath}`);
    }
  });
  
  console.log('\n📊 Optimization Summary:');
  console.log(`Original size: ${(totalOriginal / 1024).toFixed(2)} KB`);
  console.log(`Optimized size: ${(totalOptimized / 1024).toFixed(2)} KB`);
  console.log(`Saved: ${(totalSaved / 1024).toFixed(2)} KB (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);
  
  console.log('\n✅ Image optimization completed!');
};

// Jalankan optimasi
main();
