import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase mandiri
const supabaseUrl = 'https://superbase.zeabur.app'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

// Fallback ke Supabase resmi jika custom server bermasalah
const fallbackUrl = 'https://paobhbmitoydoxnifijk.supabase.co'
const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'

// Environment variables sebagai prioritas utama
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Prioritas: Environment > Fallback Supabase > Custom Supabase (karena custom bermasalah)
const finalUrl = envUrl || fallbackUrl || supabaseUrl
const finalKey = envKey || fallbackKey || supabaseAnonKey

// Validasi final values
if (!finalUrl || !finalKey) {
  throw new Error('Missing Supabase configuration.')
}

// Debug logging
console.log('🔧 Supabase Configuration:', {
  url: finalUrl,
  key: finalKey ? `${finalKey.substring(0, 20)}...` : 'Missing',
  source: envUrl ? 'Environment' : supabaseUrl ? 'Custom' : 'Fallback'
})

export const supabase = createClient(finalUrl, finalKey)

// Service role key untuk operasi admin (jika diperlukan)
export const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJzZXJ2aWNlX3JvbGUiLAogICAgImlzcyI6ICJzdXBhYmFzZS1kZW1vIiwKICAgICJpYXQiOiAxNjQxNzY5MjAwLAogICAgImV4cCI6IDE3OTk1MzU2MDAKfQ.DaYlNEoUrrEn2Ig7tqibS-PHK5vgusbcbo7X36XVt4Q'

// Client dengan service role untuk operasi admin
export const supabaseAdmin = createClient(finalUrl, supabaseServiceRoleKey)

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
