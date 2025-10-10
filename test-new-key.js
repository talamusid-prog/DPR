import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase-k8m28006.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Zeabur with new anon key...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 30) + '...');
  
  try {
    // Test basic connection
    const { data, error } = await supabase.from('aspirations').select('count').limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      console.log('Details:', error);
    } else {
      console.log('✅ Connection successful!');
      console.log('📊 Data:', data);
    }
  } catch (err) {
    console.log('❌ Connection failed:', err.message);
  }
}

testConnection();
