// Script untuk test akses storage Supabase
import { createClient } from '@supabase/supabase-js'

const testStorageAccess = async () => {
  console.log('🔧 Testing Supabase Storage access...\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // 1. Test list buckets
    console.log('📦 Testing storage buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.log('❌ Buckets error:', bucketsError.message)
      return
    }
    
    console.log('✅ Buckets accessible')
    console.log(`📊 Found ${buckets?.length || 0} buckets:`)
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })

    // 2. Test blog-images bucket specifically
    console.log('\n🖼️ Testing blog-images bucket...')
    const { data: files, error: filesError } = await supabase.storage
      .from('blog-images')
      .list('articles', { limit: 5 })

    if (filesError) {
      console.log('❌ Files list error:', filesError.message)
    } else {
      console.log('✅ Files list accessible')
      console.log(`📊 Found ${files?.length || 0} files in articles folder`)
      files?.forEach(file => {
        console.log(`   - ${file.name} (${file.metadata?.size || 'unknown size'})`)
      })
    }

    // 3. Test specific file access
    const testFileName = 'articles/1760067694118-glhd60.jpg'
    console.log(`\n🔍 Testing specific file: ${testFileName}`)
    
    const { data: fileData, error: fileError } = await supabase.storage
      .from('blog-images')
      .download(testFileName)

    if (fileError) {
      console.log('❌ File download error:', fileError.message)
      console.log('❌ Error details:', fileError)
    } else {
      console.log('✅ File download successful')
      console.log(`📊 File size: ${fileData?.size || 'unknown'} bytes`)
    }

    // 4. Test public URL
    console.log('\n🔗 Testing public URL...')
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(testFileName)
    
    console.log(`📡 Public URL: ${urlData.publicUrl}`)
    
    // Test URL accessibility
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
      console.log(`📊 URL Status: ${response.status} ${response.statusText}`)
      
      if (response.status === 200) {
        console.log('✅ Public URL accessible')
      } else if (response.status === 400) {
        console.log('❌ Public URL returns 400 - file not accessible')
      } else {
        console.log(`⚠️ Unexpected status: ${response.status}`)
      }
    } catch (fetchError) {
      console.log('❌ URL fetch error:', fetchError.message)
    }

    // 5. Test upload new file
    console.log('\n📤 Testing file upload...')
    const testFile = new File(['test content'], 'test-connection.txt', { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('test/test-connection.txt', testFile)

    if (uploadError) {
      console.log('❌ Upload error:', uploadError.message)
      console.log('❌ Upload details:', uploadError)
    } else {
      console.log('✅ Upload successful')
      console.log(`📁 Uploaded to: ${uploadData.path}`)
      
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

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('❌ Full error:', error)
  }
}

testStorageAccess().catch(console.error)
