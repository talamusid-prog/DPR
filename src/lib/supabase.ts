import { createClient } from '@supabase/supabase-js'

// Menggunakan environment variables untuk keamanan
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug environment variables
console.log('🔍 Environment Variables Debug:')
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing')
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Set' : '❌ Missing')

// Fallback values untuk development
const fallbackUrl = 'https://paobhbmitoydoxnifijk.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'

// Gunakan fallback jika environment variables tidak tersedia
const finalUrl = supabaseUrl || fallbackUrl
const finalKey = supabaseAnonKey || fallbackKey

// Validasi final values
if (!finalUrl || !finalKey) {
  console.error('❌ Supabase configuration failed:', {
    url: finalUrl,
    key: finalKey ? 'Set' : 'Missing'
  })
  throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

console.log('✅ Supabase client initialized successfully')

export const supabase = createClient(finalUrl, finalKey)

// Types untuk Blog
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string
  alt_text?: string
  author: string
  published_at: string
  created_at: string
  updated_at: string
  tags?: string[]
  status: 'draft' | 'published'
  views?: number
}

export interface CreateBlogPost {
  title: string
  content: string
  excerpt: string
  slug: string
  featured_image?: string
  alt_text?: string
  author: string
  tags?: string[]
  status: 'draft' | 'published'
}

// Types untuk Gallery (Portfolio yang diubah menjadi Gallery)
export interface Gallery {
  id: string
  title: string
  description: string
  slug: string
  image_url: string
  location: string
  category: 'Rapat DPR' | 'Reses Anggota DPR' | 'Kunjungan Kerja' | 'Penyerahan Bantuan' | 'Sosialisasi Program' | 'Konsultasi Publik' | 'Kegiatan Komisi' | 'Sidang Paripurna' | 'Hearing Publik' | 'Lainnya'
  photographer: string // Pencatat/Dokumentasi
  created_at: string
  updated_at: string
  status: 'draft' | 'published'
  featured: boolean
}

export interface CreateGallery {
  title: string
  description: string
  slug: string
  image_url: string
  location: string
  category: 'Rapat DPR' | 'Reses Anggota DPR' | 'Kunjungan Kerja' | 'Penyerahan Bantuan' | 'Sosialisasi Program' | 'Konsultasi Publik' | 'Kegiatan Komisi' | 'Sidang Paripurna' | 'Hearing Publik' | 'Lainnya'
  photographer: string // Pencatat/Dokumentasi
  status: 'draft' | 'published'
  featured: boolean
}

// Alias untuk backward compatibility
export type Portfolio = Gallery
export type CreatePortfolio = CreateGallery

// Types untuk Gallery
export interface GalleryImage {
  id: string
  title: string
  description: string
  slug: string
  image_url: string
  location: string
  category: string
  photographer: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published'
  featured: boolean
}

export interface CreateGalleryImage {
  title: string
  description: string
  image_url: string
  location: string
  category: string
  photographer: string
  status: 'draft' | 'published'
  featured: boolean
}
