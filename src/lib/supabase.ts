import { createClient } from '@supabase/supabase-js'

// Konfigurasi Supabase mandiri
const supabaseUrl = 'https://superbase.zeabur.app'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

// Environment variables sebagai fallback
const envUrl = import.meta.env.VITE_SUPABASE_URL
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Gunakan environment variables jika tersedia, jika tidak gunakan konfigurasi mandiri
const finalUrl = envUrl || supabaseUrl
const finalKey = envKey || supabaseAnonKey

// Validasi final values
if (!finalUrl || !finalKey) {
  throw new Error('Missing Supabase configuration.')
}

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
