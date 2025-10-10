// Script untuk membuat bucket blog-images dan setup RLS
import { createClient } from '@supabase/supabase-js'

const createBlogImagesBucket = async () => {
  console.log('🔧 Creating blog-images bucket and setting up RLS...\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    // 1. List existing buckets
    console.log('📦 Checking existing buckets...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
    
    if (bucketsError) {
      console.log('❌ Buckets error:', bucketsError.message)
      return
    }
    
    console.log(`📊 Found ${buckets?.length || 0} existing buckets:`)
    buckets?.forEach(bucket => {
      console.log(`   - ${bucket.name} (${bucket.public ? 'public' : 'private'})`)
    })

    // 2. Check if blog-images exists
    const blogImagesBucket = buckets?.find(b => b.name === 'blog-images')
    if (blogImagesBucket) {
      console.log('\n✅ blog-images bucket already exists')
      console.log(`📊 Bucket public: ${blogImagesBucket.public}`)
    } else {
      console.log('\n📦 blog-images bucket not found, creating...')
      
      // Create bucket
      const { data: createData, error: createError } = await supabase.storage.createBucket('blog-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      })

      if (createError) {
        console.log('❌ Create bucket error:', createError.message)
        console.log('❌ Error details:', createError)
        return
      }

      console.log('✅ blog-images bucket created successfully')
      console.log('📊 Bucket is public: true')
    }

    // 3. Test bucket access
    console.log('\n🔍 Testing bucket access...')
    const { data: testFiles, error: testError } = await supabase.storage
      .from('blog-images')
      .list('', { limit: 5 })

    if (testError) {
      console.log('❌ Bucket access error:', testError.message)
    } else {
      console.log('✅ Bucket access successful')
      console.log(`📊 Found ${testFiles?.length || 0} files in root`)
    }

    // 4. Test upload
    console.log('\n📤 Testing file upload...')
    const testContent = 'Test file for blog-images bucket'
    const testFile = new File([testContent], 'test-bucket.txt', { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload('test/test-bucket.txt', testFile)

    if (uploadError) {
      console.log('❌ Upload error:', uploadError.message)
      console.log('❌ Upload details:', uploadError)
    } else {
      console.log('✅ Upload successful')
      console.log(`📁 Uploaded to: ${uploadData.path}`)
      
      // Test public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(uploadData.path)
      
      console.log(`📡 Public URL: ${urlData.publicUrl}`)
      
      // Test URL accessibility
      try {
        const response = await fetch(urlData.publicUrl, { method: 'HEAD' })
        console.log(`📊 URL Status: ${response.status} ${response.statusText}`)
        
        if (response.status === 200) {
          console.log('✅ Public URL accessible')
        } else {
          console.log(`❌ Public URL returns ${response.status}`)
        }
      } catch (fetchError) {
        console.log('❌ URL fetch error:', fetchError.message)
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
    console.log('1. Check Supabase Dashboard > Storage > blog-images')
    console.log('2. Verify bucket is public')
    console.log('3. Check RLS policies if needed')
    console.log('4. Test with existing files')

  } catch (error) {
    console.log('❌ Setup failed:', error.message)
    console.log('❌ Full error:', error)
  }
}

createBlogImagesBucket().catch(console.error)
