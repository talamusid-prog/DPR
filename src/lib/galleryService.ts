import { supabase, Gallery, CreateGallery } from './supabase'
import { uploadImage, getOptimizedImageUrl, UploadResult } from './imageUploadService'

// Service untuk mengelola gallery foto
export const getAllGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching galleries:', error)
    return []
  }
}

export const getPublishedGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching published galleries:', error)
    return []
  }
}

export const getFeaturedGalleries = async (): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('status', 'published')
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(6)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching featured galleries:', error)
    return []
  }
}

export const getGalleryBySlug = async (slug: string): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching gallery by slug:', error)
    return null
  }
}

export const getGalleriesByCategory = async (category: string): Promise<Gallery[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('*')
      .eq('category', category)
      .eq('status', 'published')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching galleries by category:', error)
    return []
  }
}

export const createGallery = async (gallery: CreateGallery): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .insert([gallery])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating gallery:', error)
    return null
  }
}

export const updateGallery = async (id: string, gallery: Partial<CreateGallery>): Promise<Gallery | null> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .update(gallery)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating gallery:', error)
    return null
  }
}

export const deleteGallery = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting gallery:', error)
    return false
  }
}

export const getGalleryCategories = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('gallery_images')
      .select('category')
      .eq('status', 'published')

    if (error) throw error
    
    const categories = [...new Set(data?.map(item => item.category) || [])]
    return categories.sort()
  } catch (error) {
    console.error('Error fetching gallery categories:', error)
    return []
  }
}

// Fungsi untuk generate slug dari title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

// Fungsi untuk validasi file gambar
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Format file tidak didukung. Gunakan JPG, PNG, atau WebP.' }
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Ukuran file terlalu besar. Maksimal 10MB.' }
  }
  
  return { valid: true }
}

// Fungsi untuk upload gambar gallery ke Supabase Storage
export const uploadGalleryImage = async (file: File): Promise<UploadResult> => {
  try {
    // Uploading gallery image

    const result = await uploadImage(file, {
      bucket: 'gallery-images',
      folder: 'gallery',
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    })

    if (result.success && result.url) {
      // Gallery image uploaded successfully
    } else {
      // Gallery image upload failed
    }

    return result
  } catch (error) {
    // Upload gallery image error
    return {
      success: false,
      error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Fungsi untuk mendapatkan URL gambar gallery yang dioptimasi
export const getGalleryImageUrl = (imagePath: string, options?: {
  width?: number
  height?: number
  quality?: number
}): string => {
  return getOptimizedImageUrl(imagePath, {
    ...options,
    format: 'webp'
  })
}

// Fungsi untuk convert file ke base64 (deprecated - gunakan uploadGalleryImage)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}