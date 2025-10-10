// Script untuk membuat bucket dengan service role key
// Jalankan dengan: node create-buckets-service-role.js

const createBucketsWithServiceRole = async () => {
  console.log('🔧 Creating Supabase Storage buckets with service role...\n');

  const configs = [
    {
      name: 'Fallback Supabase (Service Role)',
      url: 'https://paobhbmitoydoxnifijk.supabase.co',
      serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQxNDkyMSwiZXhwIjoyMDc0OTkwOTIxfQ.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'
    }
  ];

  for (const config of configs) {
    console.log(`📦 Creating buckets for ${config.name}...`);
    
    const buckets = [
      {
        id: 'blog-images',
        name: 'blog-images',
        public: true,
        file_size_limit: 5242880, // 5MB
        allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      },
      {
        id: 'gallery-images',
        name: 'gallery-images', 
        public: true,
        file_size_limit: 10485760, // 10MB
        allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
      }
    ];

    for (const bucket of buckets) {
      console.log(`  🔨 Creating bucket: ${bucket.name}`);
      
      try {
        const response = await fetch(`${config.url}/storage/v1/bucket`, {
          method: 'POST',
          headers: {
            'apikey': config.serviceKey,
            'Authorization': `Bearer ${config.serviceKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bucket)
        });

        if (response.ok) {
          console.log(`  ✅ Bucket '${bucket.name}' created successfully`);
        } else {
          const error = await response.text();
          if (error.includes('already exists') || error.includes('duplicate')) {
            console.log(`  ⚠️  Bucket '${bucket.name}' already exists`);
          } else {
            console.log(`  ❌ Failed to create bucket '${bucket.name}': ${error}`);
          }
        }
      } catch (error) {
        console.log(`  ❌ Error creating bucket '${bucket.name}': ${error.message}`);
      }
    }

    // Verify buckets after creation
    console.log(`  🔍 Verifying buckets for ${config.name}...`);
    try {
      const response = await fetch(`${config.url}/storage/v1/bucket`, {
        method: 'GET',
        headers: {
          'apikey': config.serviceKey,
          'Authorization': `Bearer ${config.serviceKey}`
        }
      });

      if (response.ok) {
        const buckets = await response.json();
        console.log(`  ✅ Available buckets: ${buckets.map(b => b.name).join(', ') || 'None'}`);
        
        // Test bucket access
        const testBuckets = ['blog-images', 'gallery-images'];
        for (const bucketName of testBuckets) {
          try {
            const bucketResponse = await fetch(`${config.url}/storage/v1/object/${bucketName}`, {
              method: 'GET',
              headers: {
                'apikey': config.serviceKey,
                'Authorization': `Bearer ${config.serviceKey}`
              }
            });
            
            if (bucketResponse.ok) {
              console.log(`  ✅ Bucket '${bucketName}' is accessible`);
            } else {
              console.log(`  ⚠️  Bucket '${bucketName}' status: ${bucketResponse.status}`);
            }
          } catch (bucketError) {
            console.log(`  ❌ Bucket '${bucketName}' test failed: ${bucketError.message}`);
          }
        }
      } else {
        console.log(`  ❌ Failed to verify buckets: ${response.status}`);
      }
    } catch (error) {
      console.log(`  ❌ Error verifying buckets: ${error.message}`);
    }
    
    console.log(''); // Empty line
  }

  console.log('🏁 Bucket creation with service role completed!');
};

// Run the creation
createBucketsWithServiceRole().catch(console.error);

