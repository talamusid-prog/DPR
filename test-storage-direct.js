// Test langsung storage bucket dan upload file
// Jalankan dengan: node test-storage-direct.js

const testDirectStorage = async () => {
  console.log('🧪 Testing Supabase Storage directly...\n');

  const configs = [
    {
      name: 'Fallback Supabase (Primary)',
      url: 'https://paobhbmitoydoxnifijk.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'
    },
    {
      name: 'Custom Supabase (Zeabur)',
      url: 'https://superbase.zeabur.app',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'
    }
  ];

  for (const config of configs) {
    console.log(`📡 Testing ${config.name}...`);
    
    try {
      // 1. Test list buckets
      console.log('  🔍 Checking available buckets...');
      const bucketsResponse = await fetch(`${config.url}/storage/v1/bucket`, {
        method: 'GET',
        headers: {
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`
        }
      });

      if (bucketsResponse.ok) {
        const buckets = await bucketsResponse.json();
        console.log(`  ✅ Buckets accessible: ${buckets.map(b => b.name).join(', ') || 'None'}`);
        
        // Check for required buckets
        const requiredBuckets = ['blog-images', 'gallery-images'];
        const availableBuckets = buckets.map(b => b.name);
        
        for (const bucketName of requiredBuckets) {
          if (availableBuckets.includes(bucketName)) {
            console.log(`  ✅ Bucket '${bucketName}' exists`);
          } else {
            console.log(`  ❌ Bucket '${bucketName}' missing`);
          }
        }
      } else {
        console.log(`  ❌ Failed to list buckets: ${bucketsResponse.status}`);
        continue;
      }

      // 2. Test bucket access
      console.log('  🔍 Testing bucket access...');
      const testBuckets = ['blog-images', 'gallery-images'];
      
      for (const bucketName of testBuckets) {
        try {
          const bucketResponse = await fetch(`${config.url}/storage/v1/object/${bucketName}`, {
            method: 'GET',
            headers: {
              'apikey': config.key,
              'Authorization': `Bearer ${config.key}`
            }
          });
          
          if (bucketResponse.ok) {
            console.log(`  ✅ Bucket '${bucketName}' accessible`);
          } else if (bucketResponse.status === 404) {
            console.log(`  ⚠️  Bucket '${bucketName}' not found (404)`);
          } else {
            console.log(`  ❌ Bucket '${bucketName}' error: ${bucketResponse.status}`);
          }
        } catch (bucketError) {
          console.log(`  ❌ Bucket '${bucketName}' test failed: ${bucketError.message}`);
        }
      }

      // 3. Test upload (simulate with small text file)
      console.log('  🔍 Testing upload capability...');
      try {
        const testContent = 'Test upload content';
        const testFileName = `test-${Date.now()}.txt`;
        
        const uploadResponse = await fetch(`${config.url}/storage/v1/object/blog-images/${testFileName}`, {
          method: 'POST',
          headers: {
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
            'Content-Type': 'text/plain'
          },
          body: testContent
        });

        if (uploadResponse.ok) {
          console.log(`  ✅ Upload test successful: ${testFileName}`);
          
          // Try to get the uploaded file
          const getResponse = await fetch(`${config.url}/storage/v1/object/blog-images/${testFileName}`, {
            method: 'GET',
            headers: {
              'apikey': config.key,
              'Authorization': `Bearer ${config.key}`
            }
          });
          
          if (getResponse.ok) {
            console.log(`  ✅ File retrieval successful`);
          } else {
            console.log(`  ⚠️  File retrieval failed: ${getResponse.status}`);
          }
        } else {
          const errorText = await uploadResponse.text();
          console.log(`  ❌ Upload test failed: ${uploadResponse.status} - ${errorText}`);
        }
      } catch (uploadError) {
        console.log(`  ❌ Upload test error: ${uploadError.message}`);
      }

      // 4. Test public URL generation
      console.log('  🔍 Testing public URL generation...');
      try {
        const publicUrlResponse = await fetch(`${config.url}/storage/v1/object/public/blog-images/test.jpg`, {
          method: 'HEAD',
          headers: {
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`
          }
        });
        
        if (publicUrlResponse.ok || publicUrlResponse.status === 404) {
          console.log(`  ✅ Public URL generation working`);
        } else {
          console.log(`  ❌ Public URL generation failed: ${publicUrlResponse.status}`);
        }
      } catch (urlError) {
        console.log(`  ❌ Public URL test error: ${urlError.message}`);
      }

    } catch (error) {
      console.log(`  ❌ ${config.name} test failed: ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Direct storage test completed!');
};

// Run the test
testDirectStorage().catch(console.error);
