// Script untuk setup storage bucket di Supabase Zeabur
// Jalankan dengan: node setup-zeabur-storage.js

import { createClient } from '@supabase/supabase-js';

const setupZeaburStorage = async () => {
  console.log('🔧 Setting up Supabase Zeabur storage...\n');

  const zeaburUrl = 'https://supabase-k8m28006.zeabur.app'
  const zeaburKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(zeaburUrl, zeaburKey);

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
      const { data, error } = await supabase.storage.createBucket(bucket.id, {
        public: bucket.public,
        fileSizeLimit: bucket.file_size_limit,
        allowedMimeTypes: bucket.allowed_mime_types
      });

      if (error) {
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          console.log(`⚠️  Bucket '${bucket.name}' already exists`);
        } else {
          console.log(`❌ Failed to create bucket '${bucket.name}': ${error.message}`);
        }
      } else {
        console.log(`✅ Bucket '${bucket.name}' created successfully`);
      }
    } catch (error) {
      console.log(`❌ Error creating bucket '${bucket.name}': ${error.message}`);
    }
  }

  console.log('\n🔍 Verifying buckets...');
  
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.log('❌ Error listing buckets:', error.message);
    } else {
      console.log('📋 Available buckets:');
      buckets.forEach(bucket => {
        console.log(`  - ${bucket.id} (public: ${bucket.public})`);
      });
    }
  } catch (error) {
    console.log('❌ Error verifying buckets:', error.message);
  }

  console.log('\n🔧 Setting up RLS policies...');
  
  // SQL untuk setup RLS policies
  const rlsPolicies = `
-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for blog images" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete gallery images" ON storage.objects;

-- Create new policies for public read access
CREATE POLICY "Public read access for blog images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Public read access for gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

-- Create policies for anonymous upload (for public access)
CREATE POLICY "Anonymous users can upload blog images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'gallery-images');

-- Create policies for anonymous update
CREATE POLICY "Anonymous users can update blog images" ON storage.objects
FOR UPDATE USING (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can update gallery images" ON storage.objects
FOR UPDATE USING (bucket_id = 'gallery-images');

-- Create policies for anonymous delete
CREATE POLICY "Anonymous users can delete blog images" ON storage.objects
FOR DELETE USING (bucket_id = 'blog-images');

CREATE POLICY "Anonymous users can delete gallery images" ON storage.objects
FOR DELETE USING (bucket_id = 'gallery-images');
`;

  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql: rlsPolicies });
    
    if (error) {
      console.log('❌ Error setting up RLS policies:', error.message);
      console.log('📝 Manual setup required. Run this SQL in Supabase SQL Editor:');
      console.log(rlsPolicies);
    } else {
      console.log('✅ RLS policies setup successfully');
    }
  } catch (error) {
    console.log('❌ Error setting up RLS policies:', error.message);
    console.log('📝 Manual setup required. Run this SQL in Supabase SQL Editor:');
    console.log(rlsPolicies);
  }

  console.log('\n🏁 Setup completed!');
};

setupZeaburStorage().catch(console.error);
