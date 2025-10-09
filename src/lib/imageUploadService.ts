import { supabase, supabaseAdmin } from './supabase'

// Interface untuk hasil upload
export interface UploadResult {
  success: boolean
  url?: string
  error?: string
  path?: string
}

// Interface untuk konfigurasi upload
export interface UploadConfig {
  bucket: string
  folder?: string
  fileName?: string
  maxSize?: number // dalam bytes
  allowedTypes?: string[]
}

// Konfigurasi default
const DEFAULT_CONFIG: UploadConfig = {
  bucket: 'blog-images',
  folder: 'articles',
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
}

// Fungsi untuk generate nama file unik
const generateFileName = (originalName: string, folder?: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 8)
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  
  const fileName = `${timestamp}-${randomString}.${extension}`
  return folder ? `${folder}/${fileName}` : fileName
}

// Fungsi untuk validasi file
const validateFile = (file: File, config: UploadConfig): string | null => {
  // Cek ukuran file
  if (file.size > (config.maxSize || DEFAULT_CONFIG.maxSize)) {
    return `Ukuran file terlalu besar. Maksimal ${Math.round((config.maxSize || DEFAULT_CONFIG.maxSize) / 1024 / 1024)}MB`
  }

  // Cek tipe file
  const allowedTypes = config.allowedTypes || DEFAULT_CONFIG.allowedTypes
  if (!allowedTypes.includes(file.type)) {
    return `Tipe file tidak didukung. Gunakan: ${allowedTypes.join(', ')}`
  }

  return null
}

// Fungsi untuk upload gambar ke Supabase Storage
export const uploadImage = async (
  file: File, 
  config: Partial<UploadConfig> = {}
): Promise<UploadResult> => {
  try {
    const finalConfig = { ...DEFAULT_CONFIG, ...config }
    
    // Validasi file
    const validationError = validateFile(file, finalConfig)
    if (validationError) {
      return {
        success: false,
        error: validationError
      }
    }

    // Generate nama file
    const fileName = generateFileName(file.name, finalConfig.folder)
    
    console.log('📤 Uploading image:', {
      fileName,
      size: file.size,
      type: file.type,
      bucket: finalConfig.bucket
    })

    // Upload ke Supabase Storage
    const { data, error } = await supabase.storage
      .from(finalConfig.bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('❌ Upload error:', error)
      return {
        success: false,
        error: `Gagal mengupload gambar: ${error.message}`
      }
    }

    // Dapatkan URL publik
    const { data: urlData } = supabase.storage
      .from(finalConfig.bucket)
      .getPublicUrl(fileName)

    const publicUrl = urlData.publicUrl

    console.log('✅ Upload berhasil:', {
      path: data.path,
      url: publicUrl
    })

    return {
      success: true,
      url: publicUrl,
      path: data.path
    }

  } catch (error) {
    console.error('❌ Upload error:', error)
    return {
      success: false,
      error: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Fungsi untuk upload multiple images
export const uploadMultipleImages = async (
  files: File[],
  config: Partial<UploadConfig> = {}
): Promise<UploadResult[]> => {
  const results: UploadResult[] = []
  
  for (const file of files) {
    const result = await uploadImage(file, config)
    results.push(result)
  }
  
  return results
}

// Fungsi untuk menghapus gambar dari storage
export const deleteImage = async (
  path: string,
  bucket: string = DEFAULT_CONFIG.bucket
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) {
      console.error('❌ Delete error:', error)
      return false
    }

    console.log('✅ Image deleted:', path)
    return true
  } catch (error) {
    console.error('❌ Delete error:', error)
    return false
  }
}

// Fungsi untuk mendapatkan URL gambar dengan optimasi
export const getOptimizedImageUrl = (
  imagePath: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  } = {}
): string => {
  const { width, height, quality = 80, format = 'webp' } = options
  
  // Jika path sudah berupa URL lengkap, return as is
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Jika path relatif, buat URL dari Supabase Storage
  const baseUrl = supabase.storage.from('blog-images').getPublicUrl(imagePath).data.publicUrl
  
  // Tambahkan parameter transformasi jika diperlukan
  const params = new URLSearchParams()
  if (width) params.append('width', width.toString())
  if (height) params.append('height', height.toString())
  if (quality) params.append('quality', quality.toString())
  if (format) params.append('format', format)
  
  const queryString = params.toString()
  return queryString ? `${baseUrl}?${queryString}` : baseUrl
}

// Fungsi untuk membuat bucket jika belum ada (admin only)
export const createBucket = async (
  bucketName: string,
  isPublic: boolean = true
): Promise<boolean> => {
  try {
    const { data, error } = await supabaseAdmin.storage.createBucket(bucketName, {
      public: isPublic,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    })

    if (error) {
      console.error('❌ Create bucket error:', error)
      return false
    }

    console.log('✅ Bucket created:', bucketName)
    return true
  } catch (error) {
    console.error('❌ Create bucket error:', error)
    return false
  }
}

// Fungsi untuk setup storage bucket (run once)
export const setupStorage = async (): Promise<boolean> => {
  try {
    // Cek apakah bucket sudah ada
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(bucket => bucket.name === 'blog-images')
    
    if (bucketExists) {
      console.log('✅ Bucket blog-images sudah ada')
      return true
    }

    // Buat bucket jika belum ada
    const created = await createBucket('blog-images', true)
    if (created) {
      console.log('✅ Storage setup completed')
      return true
    }

    return false
  } catch (error) {
    console.error('❌ Setup storage error:', error)
    return false
  }
}
