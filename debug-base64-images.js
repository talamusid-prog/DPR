// Script untuk debug masalah base64 images
import { createClient } from '@supabase/supabase-js';

const debugBase64Images = async () => {
  console.log('🔍 Debugging base64 images...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

  try {
    // 1. Cek post dengan slug yang bermasalah
    const slug = 'anggota-dpr-ri-agus-ambo-djiwa-gelar-sosialisasi-4-pilar-di-pasangkayu';
    console.log(`🔍 Checking post with slug: ${slug}`);
    
    const { data: post, error: postError } = await supabase
      .from('blog_posts')
      .select('id, title, featured_image, created_at, updated_at')
      .eq('slug', slug)
      .single();

    if (postError) {
      console.log('❌ Error fetching post:', postError.message);
      return;
    }

    if (!post) {
      console.log('❌ Post not found');
      return;
    }

    console.log('✅ Post found:', {
      id: post.id,
      title: post.title,
      hasFeaturedImage: !!post.featured_image,
      imageLength: post.featured_image?.length || 0,
      imageStart: post.featured_image?.substring(0, 50) + '...',
      imageEnd: '...' + post.featured_image?.substring(post.featured_image.length - 50)
    });

    // 2. Cek apakah featured_image adalah base64
    if (post.featured_image) {
      const isBase64 = post.featured_image.startsWith('data:image/');
      console.log(`📊 Is base64: ${isBase64}`);
      
      if (isBase64) {
        // 3. Validasi base64 format
        const base64Parts = post.featured_image.split(',');
        if (base64Parts.length === 2) {
          console.log('✅ Base64 format valid (has comma separator)');
          console.log(`📊 Header: ${base64Parts[0]}`);
          console.log(`📊 Data length: ${base64Parts[1].length}`);
          
          // 4. Test decode base64
          try {
            const binaryString = atob(base64Parts[1]);
            console.log('✅ Base64 decode successful');
            console.log(`📊 Binary length: ${binaryString.length}`);
          } catch (decodeError) {
            console.log('❌ Base64 decode failed:', decodeError.message);
          }
        } else {
          console.log('❌ Base64 format invalid (missing comma separator)');
        }
      } else {
        console.log('📊 Not a base64 image, checking if it\'s a URL...');
        console.log(`📊 Image path: ${post.featured_image}`);
      }
    }

    // 5. Cek semua posts dengan base64 images
    console.log('\n🔍 Checking all posts with base64 images...');
    const { data: allPosts, error: allPostsError } = await supabase
      .from('blog_posts')
      .select('id, title, featured_image')
      .not('featured_image', 'is', null);

    if (allPostsError) {
      console.log('❌ Error fetching all posts:', allPostsError.message);
      return;
    }

    const base64Posts = allPosts.filter(post => 
      post.featured_image && post.featured_image.startsWith('data:image/')
    );

    console.log(`📊 Total posts: ${allPosts.length}`);
    console.log(`📊 Posts with base64 images: ${base64Posts.length}`);

    base64Posts.forEach((post, index) => {
      console.log(`\n📋 Post ${index + 1}:`);
      console.log(`  ID: ${post.id}`);
      console.log(`  Title: ${post.title.substring(0, 50)}...`);
      console.log(`  Image length: ${post.featured_image.length}`);
      console.log(`  Image start: ${post.featured_image.substring(0, 30)}...`);
    });

  } catch (error) {
    console.log('❌ Debug failed:', error.message);
  }
};

debugBase64Images().catch(console.error);
