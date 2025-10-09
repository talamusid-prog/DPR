// Script untuk test Supabase Storage health
// Jalankan dengan: node test-storage-health.js

const testStorageHealth = async () => {
  console.log('🔍 Testing Supabase Storage health...\n');

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
    console.log(`📡 Testing ${config.name} Storage...`);
    
    try {
      // Test storage API
      const storageResponse = await fetch(`${config.url}/storage/v1/bucket`, {
        method: 'GET',
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`
        }
      });

      if (storageResponse.ok) {
        const buckets = await storageResponse.json();
        console.log(`✅ ${config.name}: Storage API accessible`);
        console.log(`📦 Available buckets: ${buckets.map(b => b.name).join(', ')}`);
        
        // Test specific bucket access
        const bucketNames = ['blog-images', 'gallery-images'];
        for (const bucketName of bucketNames) {
          try {
            const bucketResponse = await fetch(`${config.url}/storage/v1/object/${bucketName}`, {
              method: 'GET',
              headers: {
                'apikey': config.key,
                'Authorization': `Bearer ${config.key}`
              }
            });
            
            if (bucketResponse.ok) {
              console.log(`✅ ${config.name}: Bucket '${bucketName}' accessible`);
            } else {
              console.log(`⚠️  ${config.name}: Bucket '${bucketName}' not accessible (${bucketResponse.status})`);
            }
          } catch (bucketError) {
            console.log(`❌ ${config.name}: Bucket '${bucketName}' test failed - ${bucketError.message}`);
          }
        }
        
      } else {
        console.log(`❌ ${config.name}: Storage API failed (${storageResponse.status})`);
      }
      
    } catch (error) {
      console.log(`❌ ${config.name}: Storage test error - ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Storage health test completed!');
};

// Run the test
testStorageHealth().catch(console.error);
