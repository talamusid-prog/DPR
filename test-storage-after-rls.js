// Script untuk test storage setelah setup RLS
import { createClient } from '@supabase/supabase-js'

const testStorageAfterRLS = async () => {
  console.log('🔧 Testing storage access after RLS setup...\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // 1. Test existing files
    console.log('🔍 Testing existing files...')
    const testFiles = [
      'articles/1760067694118-glhd60.jpg',
      'articles/1760067728156-a99wgn.jpg',
      'articles/1760067753263-21tbxb.jpg'
    ]

    for (const fileName of testFiles) {
      console.log(`\n📁 Testing file: ${fileName}`)
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(fileName)
      
      console.log(`📡 Public URL: ${urlData.publicUrl}`)
      
      // Test URL accessibility
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
        console.log(`📊 Status: ${response.status} ${response.statusText}`)
        
        if (response.status === 200) {
          console.log('✅ File accessible')
        } else if (response.status === 400) {
          console.log('❌ File returns 400 - RLS policy issue')
        } else {
          console.log(`⚠️ Unexpected status: ${response.status}`)
        }
      } catch (fetchError) {
        console.log('❌ Fetch error:', fetchError.message)
      }
    }

    // 2. Test upload new file
    console.log('\n📤 Testing new file upload...')
    const testContent = 'Test file for RLS verification'
    const testFile = new File([testContent], 'rls-test.txt', { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('test/rls-test.txt', testFile)

    if (uploadError) {
      console.log('❌ Upload error:', uploadError.message)
    } else {
      console.log('✅ Upload successful')
      console.log(`📁 Uploaded to: ${uploadData.path}`)
      
      // Test public URL for new file
      const { data: newUrlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(uploadData.path)
      
      console.log(`📡 New file URL: ${newUrlData.publicUrl}`)
      
      try {
        const newResponse = await fetch(newUrlData.publicUrl, { method: 'HEAD' })
        console.log(`📊 New file status: ${newResponse.status} ${newResponse.statusText}`)
        
        if (newResponse.status === 200) {
          console.log('✅ New file accessible')
        } else {
          console.log(`❌ New file returns ${newResponse.status}`)
        }
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

    console.log('\n📝 Summary:')
    console.log('1. Jika semua file returns 200: RLS policies berhasil')
    console.log('2. Jika file returns 400: Perlu setup RLS policies')
    console.log('3. Jalankan SQL script di Supabase Dashboard > SQL Editor')

  } catch (error) {
    console.log('❌ Test failed:', error.message)
    console.log('❌ Full error:', error)
  }
}

testStorageAfterRLS().catch(console.error)
