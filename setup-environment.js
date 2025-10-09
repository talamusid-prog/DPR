#!/usr/bin/env node

/**
 * Script untuk setup environment variables
 * Jalankan: node setup-environment.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up environment variables...\n');

// Cek apakah .env.local sudah ada
const envLocalPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.local.example');

if (fs.existsSync(envLocalPath)) {
  console.log('✅ .env.local already exists');
} else {
  // Buat .env.local.example jika belum ada
  const envExampleContent = `# Supabase Configuration
VITE_SUPABASE_URL=https://paobhbmitoydoxnifijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM


# Instructions:
# 1. Copy this file to .env.local
# 2. Fill in your Supabase credentials
# 3. DO NOT commit .env.local to git
`;

  fs.writeFileSync(envExamplePath, envExampleContent);
  console.log('📝 Created .env.local.example');
  
  // Copy ke .env.local
  fs.copyFileSync(envExamplePath, envLocalPath);
  console.log('📝 Created .env.local');
}

console.log('\n📋 Next steps:');
console.log('1. Edit .env.local with your Supabase credentials');
console.log('2. For Vercel deployment, add environment variables in Vercel dashboard');
console.log('3. Redeploy your application');
console.log('\n🔗 Supabase Dashboard: https://supabase.com/dashboard');
console.log('🔗 Vercel Dashboard: https://vercel.com/dashboard');
