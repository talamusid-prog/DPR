import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://supabase-k8m28006.zeabur.app';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Testing Supabase Zeabur connection...');
  console.log('URL:', supabaseUrl);
  console.log('Key:', supabaseKey.substring(0, 20) + '...');
  
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
