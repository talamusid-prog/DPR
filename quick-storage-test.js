// Quick test untuk storage access
import { createClient } from '@supabase/supabase-js'

const quickStorageTest = async () => {
  console.log('🔧 Quick Storage Test\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // Test 1: List files
    console.log('📦 Testing file list...')
    const { data: files, error: listError } = await supabase.storage
      .from('blog-images')
      .list('articles', { limit: 3 })

    if (listError) {
      console.log('❌ List error:', listError.message)
    } else {
      console.log('✅ List successful')
      console.log(`📊 Found ${files?.length || 0} files`)
    }

    // Test 2: Test specific file
    const testFile = 'articles/1760067694118-glhd60.jpg'
    console.log(`\n🔍 Testing file: ${testFile}`)
    
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(testFile)
    
    console.log(`📡 URL: ${urlData.publicUrl}`)
    
    // Test 3: Fetch test
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
      console.log(`📊 Status: ${response.status}`)
      
      if (response.status === 200) {
        console.log('✅ File accessible - RLS policies working!')
      } else if (response.status === 400) {
        console.log('❌ File returns 400 - RLS policies needed')
        console.log('\n📝 Next steps:')
        console.log('1. Go to Supabase Dashboard > SQL Editor')
        console.log('2. Copy and paste setup-anonymous-storage-access.sql')
        console.log('3. Click Run')
        console.log('4. Run this test again')
      } else {
        console.log(`⚠️ Unexpected status: ${response.status}`)
      }
    } catch (fetchError) {
      console.log('❌ Fetch error:', fetchError.message)
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

quickStorageTest().catch(console.error)
