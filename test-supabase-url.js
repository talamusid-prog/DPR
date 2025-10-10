// Script untuk test URL Supabase
import fetch from 'node-fetch'

const testSupabaseUrl = async () => {
  console.log('🔧 Testing Supabase URL accessibility...\n')

  const urls = [
    'https://supabase-dedicated-k8m2.zeabur.app',
    'https://supabase-dedicated-k8m2.zeabur.app/rest/v1/',
    'https://supabase-dedicated-k8m2.zeabur.app/auth/v1/',
    'https://supabase-dedicated-k8m2.zeabur.app/storage/v1/'
  ]

  for (const url of urls) {
    try {
      console.log(`📡 Testing: ${url}`)
      const response = await fetch(url, { method: 'HEAD' })
      console.log(`   Status: ${response.status} ${response.statusText}`)
      
      if (response.status === 200) {
        console.log('   ✅ Accessible')
      } else if (response.status === 404) {
        console.log('   ❌ Not Found')
      } else {
        console.log('   ⚠️ Unexpected status')
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`)
    }
    console.log('')
  }

  // Test dengan curl command
  console.log('🔧 Testing with curl...')
  try {
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)
    
    const { stdout, stderr } = await execAsync('curl -I https://supabase-dedicated-k8m2.zeabur.app')
    console.log('Curl output:')
    console.log(stdout)
    if (stderr) {
      console.log('Curl error:')
      console.log(stderr)
    }
  } catch (error) {
    console.log('❌ Curl test failed:', error.message)
  }
}

testSupabaseUrl().catch(console.error)
