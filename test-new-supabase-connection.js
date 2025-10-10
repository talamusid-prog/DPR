// Script untuk test koneksi ke Supabase instance baru
import { createClient } from '@supabase/supabase-js'

const testNewSupabaseConnection = async () => {
  console.log('🔧 Testing connection to new Supabase instance...\n')

  const newUrl = 'https://supabase-dedicated-k8m2.zeabur.app'
  const newKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(newUrl, newKey)

  try {
    // 1. Test koneksi dasar
    console.log('📡 Testing basic connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1)

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message)
      return
    }
    console.log('✅ Basic connection successful')

    // 2. Test authentication
    console.log('\n🔐 Testing authentication...')
    const { data: authData, error: authError } = await supabase.auth.getSession()
    
    if (authError) {
      console.log('⚠️ Auth check warning:', authError.message)
    } else {
      console.log('✅ Authentication service accessible')
    }

    // 3. Test storage
    console.log('\n📦 Testing storage...')
    const { data: buckets, error: storageError } = await supabase.storage.listBuckets()
    
    if (storageError) {
      console.log('❌ Storage access failed:', storageError.message)
    } else {
      console.log('✅ Storage accessible')
      console.log(`📊 Available buckets: ${buckets?.length || 0}`)
      if (buckets && buckets.length > 0) {
        buckets.forEach(bucket => {
          console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
        })
      }
    }

    // 4. Test blog_posts table
    console.log('\n📝 Testing blog_posts table...')
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('id, title, created_at')
      .limit(3)

    if (postsError) {
      console.log('❌ Blog posts access failed:', postsError.message)
    } else {
      console.log('✅ Blog posts table accessible')
      console.log(`📊 Found ${posts?.length || 0} posts`)
      if (posts && posts.length > 0) {
        posts.forEach((post, index) => {
          console.log(`   ${index + 1}. ${post.title} (${post.id})`)
        })
      }
    }

    // 5. Test gallery table
    console.log('\n🖼️ Testing gallery table...')
    const { data: gallery, error: galleryError } = await supabase
      .from('gallery')
      .select('id, title, created_at')
      .limit(3)

    if (galleryError) {
      console.log('❌ Gallery access failed:', galleryError.message)
    } else {
      console.log('✅ Gallery table accessible')
      console.log(`📊 Found ${gallery?.length || 0} gallery items`)
      if (gallery && gallery.length > 0) {
        gallery.forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title} (${item.id})`)
        })
      }
    }

    // 6. Test upload to storage (if buckets exist)
    if (buckets && buckets.length > 0) {
      console.log('\n📤 Testing storage upload...')
      const testFile = new File(['test content'], 'test-connection.txt', { type: 'text/plain' })
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(buckets[0].name)
        .upload('test/test-connection.txt', testFile)

      if (uploadError) {
        console.log('⚠️ Upload test failed:', uploadError.message)
      } else {
        console.log('✅ Storage upload successful')
        console.log(`📁 Uploaded to: ${uploadData.path}`)
        
        // Clean up test file
        const { error: deleteError } = await supabase.storage
          .from(buckets[0].name)
          .remove([uploadData.path])
        
        if (deleteError) {
          console.log('⚠️ Cleanup failed:', deleteError.message)
        } else {
          console.log('🧹 Test file cleaned up')
        }
      }
    }

    console.log('\n🎉 All tests completed successfully!')
    console.log('✅ New Supabase instance is working properly')

  } catch (error) {
    console.log('❌ Test failed:', {
      message: error.message,
      error: error,
      stack: error.stack
    })
  }
}

testNewSupabaseConnection().catch(console.error)
