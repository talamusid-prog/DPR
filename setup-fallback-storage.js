// Script untuk setup storage bucket di fallback Supabase
// Jalankan dengan: node setup-fallback-storage.js

const setupFallbackStorage = async () => {
  console.log('🔧 Setting up fallback Supabase storage...\n');

  const fallbackUrl = 'https://paobhbmitoydoxnifijk.supabase.co'
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'

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
    console.log(`📦 Creating bucket: ${bucket.name}`);
    
    try {
      const response = await fetch(`${fallbackUrl}/storage/v1/bucket`, {
        method: 'POST',
        headers: {
          'apikey': fallbackKey,
          'Authorization': `Bearer ${fallbackKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bucket)
      });

      if (response.ok) {
        console.log(`✅ Bucket '${bucket.name}' created successfully`);
      } else {
        const error = await response.text();
        if (error.includes('already exists') || error.includes('duplicate')) {
          console.log(`⚠️  Bucket '${bucket.name}' already exists`);
        } else {
          console.log(`❌ Failed to create bucket '${bucket.name}': ${error}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error creating bucket '${bucket.name}': ${error.message}`);
    }
  }

  console.log('\n🔍 Verifying buckets...');
  
  try {
    const response = await fetch(`${fallbackUrl}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'apikey': fallbackKey,
        'Authorization': `Bearer ${fallbackKey}`
      }
    });

    if (response.ok) {
      const buckets = await response.json();
      console.log(`✅ Available buckets: ${buckets.map(b => b.name).join(', ')}`);
    } else {
      console.log(`❌ Failed to verify buckets: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Error verifying buckets: ${error.message}`);
  }

  console.log('\n🏁 Fallback storage setup completed!');
};

// Run the setup
setupFallbackStorage().catch(console.error);
