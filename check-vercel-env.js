#!/usr/bin/env node

/**
 * Script untuk mengecek environment variables di Vercel
 * Jalankan: node check-vercel-env.js
 */

console.log('🔍 Checking Vercel Environment Variables...\n');

// Simulasi environment variables yang seharusnya ada
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const expectedValues = {
  'VITE_SUPABASE_URL': 'https://paobhbmitoydoxnifijk.supabase.co',
  'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'
};

console.log('📋 Required Environment Variables:');
requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  const expected = expectedValues[envVar];
  
  if (value) {
    console.log(`✅ ${envVar}: Set (${value === expected ? 'Correct' : 'Different'})`);
  } else {
    console.log(`❌ ${envVar}: Missing`);
  }
});

console.log('\n🔧 Next Steps:');
console.log('1. Go to Vercel Dashboard: https://vercel.com/dashboard');
console.log('2. Select your DPR project');
console.log('3. Go to Settings → Environment Variables');
console.log('4. Add the missing variables with the values above');
console.log('5. Redeploy your application');

console.log('\n📝 Copy these values to Vercel:');
console.log('VITE_SUPABASE_URL=https://paobhbmitoydoxnifijk.supabase.co');
console.log('VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM');
