// Script untuk menganalisis bundle size
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Analyzing bundle size...');

try {
  // Build dengan analisis bundle
  execSync('npm run build', { stdio: 'inherit' });
  
  // Jalankan analisis bundle
  execSync('npx vite-bundle-analyzer dist', { stdio: 'inherit' });
  
  console.log('✅ Bundle analysis completed!');
  console.log('📊 Check the generated report for optimization opportunities.');
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
