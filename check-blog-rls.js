// Script untuk cek RLS policies pada tabel blog_posts
import { createClient } from '@supabase/supabase-js';

const checkBlogRLS = async () => {
  console.log('🔍 Checking RLS policies for blog_posts table...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

  try {
    // 1. Cek RLS status
    console.log('📋 Checking RLS status...');
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'blog_posts'` 
      });

    if (rlsError) {
      console.log('❌ Error checking RLS status:', rlsError.message);
    } else {
      console.log('📊 RLS Status:', rlsStatus);
    }

    // 2. Cek policies
    console.log('\n📋 Checking policies...');
    const { data: policies, error: policiesError } = await supabase
      .rpc('exec_sql', { 
        sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE tablename = 'blog_posts'` 
      });

    if (policiesError) {
      console.log('❌ Error checking policies:', policiesError.message);
    } else {
      console.log('📊 Policies:', policies);
    }

    // 3. Test simple select
    console.log('\n🔍 Testing simple select...');
    const { data: selectData, error: selectError } = await supabase
      .from('blog_posts')
      .select('id, title, slug')
      .limit(1);

    if (selectError) {
      console.log('❌ Select failed:', selectError.message);
    } else {
      console.log('✅ Select successful:', selectData);
    }

    // 4. Test simple update
    console.log('\n🔄 Testing simple update...');
    const { data: updateData, error: updateError } = await supabase
      .from('blog_posts')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', '10c59b74-8fed-459c-a0af-7acabbbfe2c2')
      .select();

    if (updateError) {
      console.log('❌ Update failed:', {
        message: updateError.message,
        details: updateError.details,
        hint: updateError.hint,
        code: updateError.code
      });
    } else {
      console.log('✅ Update successful:', updateData);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
};

checkBlogRLS().catch(console.error);
