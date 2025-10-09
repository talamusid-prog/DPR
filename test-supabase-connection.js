// Script untuk test koneksi Supabase
// Jalankan dengan: node test-supabase-connection.js

const testSupabaseConnection = async () => {
  console.log('🔍 Testing Supabase connections...\n');

  const configs = [
    {
      name: 'Custom Supabase (Zeabur)',
      url: 'https://superbase.zeabur.app',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
    },
    {
      name: 'Fallback Supabase',
      url: 'https://paobhbmitoydoxnifijk.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'
    }
  ];

  for (const config of configs) {
    console.log(`📡 Testing ${config.name}...`);
    
    try {
      // Test basic connectivity
      const response = await fetch(`${config.url}/rest/v1/`, {
        method: 'HEAD',
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`
        }
      });

      if (response.ok) {
        console.log(`✅ ${config.name}: Connection successful (${response.status})`);
        
        // Test specific table
        try {
          const tableResponse = await fetch(`${config.url}/rest/v1/aspirations?select=count`, {
            method: 'HEAD',
            headers: {
              'apikey': config.key,
              'Authorization': `Bearer ${config.key}`
            }
          });
          
          if (tableResponse.ok) {
            console.log(`✅ ${config.name}: Aspirations table accessible`);
          } else {
            console.log(`⚠️  ${config.name}: Aspirations table not accessible (${tableResponse.status})`);
          }
        } catch (tableError) {
          console.log(`❌ ${config.name}: Table test failed - ${tableError.message}`);
        }
        
      } else {
        console.log(`❌ ${config.name}: Connection failed (${response.status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${config.name}: Error - ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Connection test completed!');
};

// Run the test
testSupabaseConnection().catch(console.error);
