// Script untuk test performa database setelah optimasi
import { createClient } from '@supabase/supabase-js'

const testDatabasePerformance = async () => {
  console.log('🚀 Testing Database Performance\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    console.log('📊 Testing Database Queries Performance...\n')

    // Test 1: Blog Posts Query
    console.log('1. Testing Blog Posts Query...')
    const startTime1 = Date.now()
    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5)
    const postsTime = Date.now() - startTime1

    if (postsError) {
      console.log('❌ Blog posts error:', postsError.message)
    } else {
      console.log(`✅ Blog posts: ${posts?.length || 0} posts in ${postsTime}ms`)
    }

    // Test 2: Portfolios Query
    console.log('\n2. Testing Portfolios Query...')
    const startTime2 = Date.now()
    const { data: portfolios, error: portfoliosError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5)
    const portfoliosTime = Date.now() - startTime2

    if (portfoliosError) {
      console.log('❌ Portfolios error:', portfoliosError.message)
    } else {
      console.log(`✅ Portfolios: ${portfolios?.length || 0} portfolios in ${portfoliosTime}ms`)
    }

    // Test 3: Gallery Images Query
    console.log('\n3. Testing Gallery Images Query...')
    const startTime3 = Date.now()
    const { data: galleryImages, error: galleryError } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(10)
    const galleryTime = Date.now() - startTime3

    if (galleryError) {
      console.log('❌ Gallery images error:', galleryError.message)
    } else {
      console.log(`✅ Gallery images: ${galleryImages?.length || 0} images in ${galleryTime}ms`)
    }

    // Test 4: Kegiatan Query
    console.log('\n4. Testing Kegiatan Query...')
    const startTime4 = Date.now()
    const { data: kegiatan, error: kegiatanError } = await supabase
      .from('kegiatan')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
    const kegiatanTime = Date.now() - startTime4

    if (kegiatanError) {
      console.log('❌ Kegiatan error:', kegiatanError.message)
    } else {
      console.log(`✅ Kegiatan: ${kegiatan?.length || 0} activities in ${kegiatanTime}ms`)
    }

    // Performance Summary
    console.log('\n📈 Performance Summary:')
    console.log(`Blog Posts: ${postsTime}ms`)
    console.log(`Portfolios: ${portfoliosTime}ms`)
    console.log(`Gallery Images: ${galleryTime}ms`)
    console.log(`Kegiatan: ${kegiatanTime}ms`)

    const totalTime = postsTime + portfoliosTime + galleryTime + kegiatanTime
    console.log(`\nTotal Query Time: ${totalTime}ms`)

    // Performance Analysis
    console.log('\n💡 Performance Analysis:')
    if (totalTime < 1000) {
      console.log('✅ Excellent performance! All queries under 1 second')
    } else if (totalTime < 2000) {
      console.log('⚠️ Good performance, but could be optimized further')
    } else {
      console.log('❌ Performance needs improvement')
    }

    console.log('\n🔧 Recommended Actions:')
    console.log('1. Run fix-auth-rls-performance.sql to fix auth RLS issues')
    console.log('2. Run fix-multiple-policies-performance.sql to optimize policies')
    console.log('3. Run add-performance-indexes.sql to add database indexes')
    console.log('4. Monitor database performance in Supabase Dashboard')

  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testDatabasePerformance().catch(console.error)
