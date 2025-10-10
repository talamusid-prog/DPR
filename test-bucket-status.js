// Test untuk cek status bucket
import { createClient } from '@supabase/supabase-js'

const testBucketStatus = async () => {
  console.log('🔧 Testing Bucket Status\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // Test 1: List buckets
    console.log('📦 Checking buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.log('❌ Buckets error:', bucketsError.message)
      return
    }
    
    console.log('✅ Buckets accessible')
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name}: ${bucket.public ? 'PUBLIC' : 'PRIVATE'}`)
    })

    // Test 2: Test file access
    console.log('\n🔍 Testing file access...')
    const testFile = 'articles/1760067694118-glhd60.jpg'
    
    // Download test
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('blog-images')
      .download(testFile)

    if (downloadError) {
      console.log('❌ Download error:', downloadError.message)
    } else {
      console.log('✅ Download successful')
    }

    // Public URL test
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(testFile)
    
    console.log(`📡 Public URL: ${urlData.publicUrl}`)
    
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
      console.log(`📊 Status: ${response.status}`)
      
      if (response.status === 200) {
        console.log('✅ Public URL accessible!')
      } else if (response.status === 400) {
        console.log('❌ Public URL returns 400')
        console.log('\n💡 Solution:')
        console.log('1. Run simple-bucket-fix.sql in Supabase Dashboard')
        console.log('2. This will make buckets public and fix RLS')
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

testBucketStatus().catch(console.error)
