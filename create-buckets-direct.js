// Script untuk membuat bucket storage secara langsung
// Jalankan dengan: node create-buckets-direct.js

const createBucketsDirect = async () => {
  console.log('🔧 Creating Supabase Storage buckets directly...\n');

  const configs = [
    {
      name: 'Fallback Supabase (Primary)',
      url: 'https://paobhbmitoydoxnifijk.supabase.co',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'
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
            'apikey': config.key,
            'Authorization': `Bearer ${config.key}`,
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
          'apikey': config.key,
          'Authorization': `Bearer ${config.key}`
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
                'apikey': config.key,
                'Authorization': `Bearer ${config.key}`
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

  console.log('🏁 Bucket creation completed!');
};

// Run the creation
createBucketsDirect().catch(console.error);

