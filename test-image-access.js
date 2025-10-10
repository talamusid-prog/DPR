// Script untuk test akses file gambar di Supabase Zeabur
import { createClient } from '@supabase/supabase-js';

const testImageAccess = async () => {
  console.log('🔍 Testing image access in Supabase Zeabur...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

  // Test URLs yang sudah ada
  const testUrls = [
    'https://supabase-k8m28006.zeabur.app/storage/v1/object/public/blog-images/articles/1760059100550-fvceiw.jpeg',
    'https://supabase-k8m28006.zeabur.app/storage/v1/object/public/blog-images/articles/1760059106979-z1hp9z.jpg'
  ];

  console.log('📋 Testing existing image URLs...\n');

  for (const url of testUrls) {
    console.log(`🔗 Testing: ${url}`);
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log('   ✅ File accessible');
        console.log(`   📏 Content-Type: ${response.headers.get('content-type')}`);
        console.log(`   📦 Content-Length: ${response.headers.get('content-length')}`);
      } else {
        console.log('   ❌ File not accessible');
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    console.log('');
  }

  // Test list files in bucket
  console.log('📁 Listing files in blog-images bucket...');
  try {
    const { data: files, error } = await supabase.storage
      .from('blog-images')
      .list('articles', {
        limit: 10,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.log('❌ Error listing files:', error.message);
    } else {
      console.log('📋 Files in bucket:');
      files.forEach(file => {
        console.log(`  - ${file.name} (${file.metadata?.size} bytes)`);
      });
    }
  } catch (err) {
    console.log('❌ Error listing files:', err.message);
  }

  // Test get public URL
  console.log('\n🔗 Testing getPublicUrl...');
  try {
    const { data: urlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl('articles/1760059100550-fvceiw.jpeg');
    
    console.log('📤 Generated public URL:', urlData.publicUrl);
    
    // Test akses URL yang di-generate
    try {
      const response = await fetch(urlData.publicUrl, { method: 'HEAD' });
      console.log(`📊 URL Status: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`❌ URL Error: ${error.message}`);
    }
  } catch (err) {
    console.log('❌ Error getting public URL:', err.message);
  }

  console.log('\n💡 Solutions:');
  console.log('1. Check if server Zeabur is configured to serve static files');
  console.log('2. Verify CORS settings in Supabase dashboard');
  console.log('3. Check RLS policies for storage.objects table');
  console.log('4. Use fallback mechanism (base64) if server issues persist');
};

testImageAccess().catch(console.error);
