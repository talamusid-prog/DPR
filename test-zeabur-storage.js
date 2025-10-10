// Script untuk test dan setup storage di Supabase Zeabur
import { createClient } from '@supabase/supabase-js';

const testZeaburStorage = async () => {
  console.log('🔧 Testing Supabase Zeabur Storage...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

  // 1. Test koneksi
  console.log('📡 Testing connection...');
  try {
    const { data, error } = await supabase.from('blog_posts').select('count').limit(1);
    if (error) {
      console.log('❌ Connection failed:', error.message);
      return;
    }
    console.log('✅ Connection successful');
  } catch (err) {
    console.log('❌ Connection error:', err.message);
    return;
  }

  // 2. List existing buckets
  console.log('\n📦 Checking existing buckets...');
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('❌ Error listing buckets:', error.message);
    } else {
      console.log('📋 Available buckets:');
      if (buckets.length === 0) {
        console.log('  - No buckets found');
      } else {
        buckets.forEach(bucket => {
          console.log(`  - ${bucket.id} (public: ${bucket.public})`);
        });
      }
    }
  } catch (err) {
    console.log('❌ Error listing buckets:', err.message);
  }

  // 3. Test upload small file
  console.log('\n📤 Testing file upload...');
  try {
    const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
    
    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload('test/test.txt', testFile);

    if (error) {
      console.log('❌ Upload failed:', error.message);
      console.log('💡 This means the bucket "blog-images" does not exist or RLS policies are blocking upload');
    } else {
      console.log('✅ Upload successful:', data.path);
      
      // Test get public URL
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);
      
      console.log('🔗 Public URL:', urlData.publicUrl);
    }
  } catch (err) {
    console.log('❌ Upload error:', err.message);
  }

  console.log('\n📝 Next steps:');
  console.log('1. Run setup-zeabur-storage.sql in Supabase SQL Editor');
  console.log('2. Or run: node setup-zeabur-storage.js');
  console.log('3. Verify buckets are created and accessible');
};

testZeaburStorage().catch(console.error);
