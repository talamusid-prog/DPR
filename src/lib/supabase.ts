import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://paobhbmitoydoxnifijk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhb2JoYm1pdG95ZG94bmlmaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MTQ5MjEsImV4cCI6MjA3NDk5MDkyMX0.vyfqLYjaFTvTB4M2A3FGLihV2bN28kroqID3K5ROTFM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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

// Types untuk Portfolio
export interface Portfolio {
  id: string
  title: string
  description: string
  slug: string
  featured_image?: string
  client: string
  category: string
  technologies: string[]
  project_url?: string
  github_url?: string
  created_at: string
  updated_at: string
  status: 'draft' | 'published'
  featured: boolean
}

export interface CreatePortfolio {
  title: string
  description: string
  slug: string
  featured_image?: string
  client: string
  category: string
  technologies: string[]
  project_url?: string
  github_url?: string
  status: 'draft' | 'published'
  featured: boolean
}

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
