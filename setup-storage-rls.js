// Script untuk setup RLS policies untuk storage
import { createClient } from '@supabase/supabase-js'

const setupStorageRLS = async () => {
  console.log('🔧 Setting up Supabase Storage RLS policies...\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // 1. Cek bucket blog-images
    console.log('📦 Checking blog-images bucket...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.log('❌ Buckets error:', bucketsError.message)
      return
    }

    const blogImagesBucket = buckets?.find(b => b.name === 'blog-images')
    if (!blogImagesBucket) {
      console.log('❌ blog-images bucket not found')
      return
    }

    console.log('✅ blog-images bucket found')
    console.log(`📊 Bucket public: ${blogImagesBucket.public}`)

    // 2. Test current file access
    console.log('\n🔍 Testing current file access...')
    const testFile = 'articles/1760067694118-glhd60.jpg'
    
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(testFile)
    
    console.log(`📡 Public URL: ${urlData.publicUrl}`)
    
    // Test dengan fetch
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
      console.log(`📊 Current status: ${response.status} ${response.statusText}`)
      
      if (response.status === 400) {
        console.log('❌ File returns 400 - RLS policy issue')
        console.log('💡 Need to setup RLS policies for public access')
      }
    } catch (fetchError) {
      console.log('❌ Fetch error:', fetchError.message)
    }

    // 3. Test upload new file
    console.log('\n📤 Testing new file upload...')
    const testContent = 'Test file content for RLS testing'
    const newTestFile = new File([testContent], 'rls-test.txt', { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('test/rls-test.txt', newTestFile)

    if (uploadError) {
      console.log('❌ Upload error:', uploadError.message)
    } else {
      console.log('✅ Upload successful')
      
      // Test public URL for new file
      const { data: newUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(uploadData.path)
      
      console.log(`📡 New file URL: ${newUrlData.publicUrl}`)
      
      try {
        const newResponse = await fetch(newUrlData.publicUrl, { method: 'HEAD' })
        console.log(`📊 New file status: ${newResponse.status} ${newResponse.statusText}`)
      } catch (newFetchError) {
        console.log('❌ New file fetch error:', newFetchError.message)
      }
      
      // Clean up
      const { error: deleteError } = await supabase.storage
        .from('blog-images')
        .remove([uploadData.path])
      
      if (deleteError) {
        console.log('⚠️ Cleanup failed:', deleteError.message)
      } else {
        console.log('🧹 Test file cleaned up')
      }
    }

    console.log('\n📝 Next steps:')
    console.log('1. Go to Supabase Dashboard > Storage')
    console.log('2. Check if blog-images bucket is public')
    console.log('3. If not public, make it public')
    console.log('4. Or setup RLS policies for public access')
    console.log('5. Check if files have correct permissions')

  } catch (error) {
    console.log('❌ Setup failed:', error.message)
    console.log('❌ Full error:', error)
  }
}

setupStorageRLS().catch(console.error)
