// Script untuk test update post di Supabase Zeabur
import { createClient } from '@supabase/supabase-js';

const testUpdatePost = async () => {
  console.log('🔧 Testing update post in Supabase Zeabur...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

  const testSlug = 'anggota-dpr-ri-agus-ambo-djiwa-gelar-sosialisasi-4-pilar-di-pasangkayu';

  try {
    // 1. Test koneksi
    console.log('📡 Testing connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }
    console.log('✅ Connection successful');

    // 2. Cek post exists
    console.log(`\n🔍 Checking if post exists with slug: ${testSlug}`);
    const { data: existingPost, error: checkError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status')
      .eq('slug', testSlug)
      .single();

    if (checkError) {
      console.log('❌ Error checking post:', {
        message: checkError.message,
        details: checkError.details,
        hint: checkError.hint,
        code: checkError.code
      });
      return;
    }

    if (!existingPost) {
      console.log('❌ Post not found with slug:', testSlug);
      return;
    }

    console.log('✅ Post found:', {
      id: existingPost.id,
      title: existingPost.title,
      status: existingPost.status
    });

    // 3. Test update
    console.log('\n🔄 Testing update...');
    const testUpdates = {
      updated_at: new Date().toISOString(),
      status: 'published'
    };

    console.log('📝 Update data:', testUpdates);

    const { data: updateData, error: updateError } = await supabase
      .from('blog_posts')
      .update(testUpdates)
      .eq('slug', testSlug)
      .select();

    console.log('📊 Update response:', {
      hasData: !!updateData,
      hasError: !!updateError,
      dataLength: updateData?.length || 0
    });

    if (updateError) {
      console.log('❌ Update failed:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code,
        fullError: updateError
      });
    } else {
      console.log('✅ Update successful:', updateData[0]);
    }

  } catch (error) {
    console.log('❌ Test failed:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error: error,
      stack: error instanceof Error ? error.stack : undefined
    });
  }
};

testUpdatePost().catch(console.error);
