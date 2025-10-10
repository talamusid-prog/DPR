// Script sederhana untuk test Supabase URL
import { createClient } from '@supabase/supabase-js'

const testSupabaseConnection = async () => {
  console.log('🔧 Testing Supabase connection...\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  console.log(`📡 URL: ${url}`)
  console.log(`🔑 Key: ${key.substring(0, 20)}...`)
  console.log('')

  try {
    const supabase = createClient(url, key)
    console.log('✅ Supabase client created successfully')

    // Test simple query
    console.log('📡 Testing basic query...')
    const { data, error } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)

    if (error) {
      console.log('❌ Query failed:', error.message)
      console.log('❌ Error details:', error)
      return
    }

    console.log('✅ Query successful')
    console.log('✅ Supabase instance is accessible and working!')

  } catch (error) {
    console.log('❌ Connection failed:', error.message)
    console.log('❌ Full error:', error)
  }
}

testSupabaseConnection().catch(console.error)
