// Simple test untuk storage
import { createClient } from '@supabase/supabase-js'

const testSimpleStorage = async () => {
  console.log('🔧 Simple Storage Test\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // Test 1: List files
    console.log('📦 Testing file list...')
    const { data: files, error: listError } = await supabase.storage
      .from('blog-images')
      .list('articles', { limit: 1 })

    if (listError) {
      console.log('❌ List error:', listError.message)
      return
    }
    console.log('✅ List successful')

    // Test 2: Download file
    console.log('\n📥 Testing file download...')
    const testFile = 'articles/1760067694118-glhd60.jpg'
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('blog-images')
      .download(testFile)

    if (downloadError) {
      console.log('❌ Download error:', downloadError.message)
    } else {
      console.log('✅ Download successful')
      console.log(`📊 File size: ${fileData?.size || 'unknown'} bytes`)
    }

    // Test 3: Public URL
    console.log('\n🔗 Testing public URL...')
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(testFile)
    
    console.log(`📡 Public URL: ${urlData.publicUrl}`)
    
    // Test 4: Fetch public URL
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
      console.log(`📊 Fetch status: ${response.status}`)
      
      if (response.status === 200) {
        console.log('✅ Public URL accessible - RLS working!')
      } else if (response.status === 400) {
        console.log('❌ Public URL returns 400 - RLS issue')
        console.log('\n💡 Try running fix-storage-policies.sql')
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

testSimpleStorage().catch(console.error)
