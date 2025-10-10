// Script untuk test performa setelah optimasi database
import { createClient } from '@supabase/supabase-js'

const testOptimizedPerformance = async () => {
  console.log('🚀 Testing Optimized Database Performance\n')

  const url = 'https://supabase-k8m28929.zeabur.app'
  const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

  const supabase = createClient(url, key)

  try {
    console.log('📊 Running Performance Tests...\n')

    const tests = [
      {
        name: 'Blog Posts (Published)',
        query: () => supabase.from('blog_posts').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(5)
      },
      {
        name: 'Portfolios (Published)',
        query: () => supabase.from('portfolios').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(5)
      },
      {
        name: 'Gallery Images (Published)',
        query: () => supabase.from('gallery_images').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(10)
      },
      {
        name: 'Kegiatan (All)',
        query: () => supabase.from('kegiatan').select('*').order('created_at', { ascending: false }).limit(5)
      },
      {
        name: 'Aspirasi (All)',
        query: () => supabase.from('aspirasi').select('*').order('created_at', { ascending: false }).limit(5)
      }
    ]

    const results = []

    for (const test of tests) {
      console.log(`Testing ${test.name}...`)
      const startTime = Date.now()
      
      try {
        const { data, error } = await test.query()
        const endTime = Date.now()
        const duration = endTime - startTime

        if (error) {
          console.log(`❌ ${test.name}: Error - ${error.message} (${duration}ms)`)
          results.push({ name: test.name, duration, error: error.message })
        } else {
          console.log(`✅ ${test.name}: ${data?.length || 0} records in ${duration}ms`)
          results.push({ name: test.name, duration, count: data?.length || 0 })
        }
      } catch (err) {
        const endTime = Date.now()
        const duration = endTime - startTime
        console.log(`❌ ${test.name}: Exception - ${err.message} (${duration}ms)`)
        results.push({ name: test.name, duration, error: err.message })
      }
    }

    // Performance Summary
    console.log('\n📈 Performance Summary:')
    console.log('=' .repeat(50))
    
    const totalTime = results.reduce((sum, result) => sum + result.duration, 0)
    const avgTime = totalTime / results.length

    results.forEach(result => {
      const status = result.error ? '❌' : '✅'
      const count = result.count ? ` (${result.count} records)` : ''
      console.log(`${status} ${result.name}: ${result.duration}ms${count}`)
    })

    console.log('=' .repeat(50))
    console.log(`Total Time: ${totalTime}ms`)
    console.log(`Average Time: ${avgTime.toFixed(2)}ms`)

    // Performance Analysis
    console.log('\n💡 Performance Analysis:')
    if (avgTime < 200) {
      console.log('🚀 Excellent! Average query time under 200ms')
    } else if (avgTime < 500) {
      console.log('✅ Good! Average query time under 500ms')
    } else if (avgTime < 1000) {
      console.log('⚠️ Acceptable, but could be improved')
    } else {
      console.log('❌ Needs optimization')
    }

    // Recommendations
    console.log('\n🔧 Next Steps:')
    console.log('1. Run comprehensive-database-fix.sql in Supabase Dashboard')
    console.log('2. Monitor database performance in Supabase Dashboard')
    console.log('3. Check for any remaining linter warnings')
    console.log('4. Consider adding more specific indexes if needed')

    console.log('\n🎉 Database performance test completed!')

  } catch (error) {
    console.log('❌ Test failed:', error.message)
  }
}

testOptimizedPerformance().catch(console.error)
