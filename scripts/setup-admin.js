/**
 * Script untuk setup admin user di Supabase
 * Jalankan dengan: node scripts/setup-admin.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import readline from 'readline'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Anda perlu menambahkan ini ke .env

if (!supabaseUrl) {
  console.error('❌ VITE_SUPABASE_URL tidak ditemukan di .env')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di .env')
  console.log('📝 Tambahkan SUPABASE_SERVICE_ROLE_KEY ke file .env')
  console.log('   Dapatkan dari Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise((resolve) => rl.question(query, resolve))

async function setupAdmin() {
  console.log('🔧 Setup Admin User untuk Aplikasi DPR')
  console.log('=====================================\n')

  try {
    const email = await question('📧 Masukkan email admin: ')
    const password = await question('🔒 Masukkan password admin: ')
    const confirmPassword = await question('🔒 Konfirmasi password: ')

    if (password !== confirmPassword) {
      console.error('❌ Password tidak cocok!')
      process.exit(1)
    }

    if (password.length < 8) {
      console.error('❌ Password minimal 8 karakter!')
      process.exit(1)
    }

    console.log('\n⏳ Membuat admin user...')

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto confirm email
      user_metadata: {
        role: 'admin'
      }
    })

    if (error) {
      console.error('❌ Error membuat admin user:', error.message)
      process.exit(1)
    }

    console.log('✅ Admin user berhasil dibuat!')
    console.log(`📧 Email: ${email}`)
    console.log(`🆔 User ID: ${data.user.id}`)
    console.log('\n📝 Jangan lupa update VITE_ADMIN_EMAIL di file .env dengan email ini!')
    console.log('🔄 Restart development server setelah mengupdate .env')

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    rl.close()
  }
}

setupAdmin()
