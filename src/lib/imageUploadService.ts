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

// Fungsi untuk upload gambar ke Supabase Storage dengan timeout dan retry
export const uploadImage = async (
  file: File, 
  config: Partial<UploadConfig> = {}
): Promise<UploadResult> => {
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
  
  // Uploading image

  // Retry mechanism dengan timeout
  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Upload attempt
      
      // Create timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Upload timeout after 30 seconds')), 30000)
      })

      // Upload dengan timeout
      const uploadPromise = supabase.storage
        .from(finalConfig.bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Allow overwrite existing files
        })

      const result = await Promise.race([uploadPromise, timeoutPromise])
      const { data, error } = result as { data: { path: string } | null; error: Error | null }

      if (error) {
        // Upload error
        
        // Jika error timeout atau connection, coba lagi
        if (error.message?.includes('timeout') || 
            error.message?.includes('connection') ||
            error.message?.includes('timed out')) {
          lastError = error
          if (attempt < maxRetries) {
            const delay = Math.pow(2, attempt) * 1000 // 2s, 4s, 8s
            // Waiting before retry
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        }
        
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

    // Test akses file untuk memastikan URL dapat diakses
    try {
      const testResponse = await fetch(publicUrl, { method: 'HEAD' })
      if (!testResponse.ok) {
        // File tidak dapat diakses karena RLS, gunakan fallback
        throw new Error(`File not accessible: ${testResponse.status}`)
      }
    } catch (testError) {
      // File accessibility test gagal, gunakan fallback
      throw new Error(`File accessibility test failed`)
    }

      // Upload berhasil tanpa log berlebihan

      return {
        success: true,
        url: publicUrl,
        path: data.path
      }

    } catch (error) {
      lastError = error
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  // Jika semua retry gagal, coba fallback ke base64
  
  try {
    // Convert file to base64 as fallback
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Image uploaded with base64 fallback
    return {
      success: true,
      url: base64,
      path: 'base64-fallback'
    }
  } catch (fallbackError) {
    return {
      success: false,
      error: `Upload gagal: ${lastError?.message || 'Unknown error'}`
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
      // Delete error
      return false
    }

    // Image deleted
    return true
  } catch (error) {
    // Delete error
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
      // Create bucket error
      return false
    }

    // Bucket created
    return true
  } catch (error) {
    // Create bucket error
    return false
  }
}

// Fungsi untuk cek status Supabase Storage
export const checkStorageHealth = async (): Promise<{
  healthy: boolean
  buckets: string[]
  error?: string
}> => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets()
    
    if (error) {
      return {
        healthy: false,
        buckets: [],
        error: error.message
      }
    }

    const bucketNames = buckets?.map(b => b.name) || []
    
    return {
      healthy: true,
      buckets: bucketNames
    }
  } catch (error) {
    return {
      healthy: false,
      buckets: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Fungsi untuk setup storage bucket (run once)
export const setupStorage = async (): Promise<boolean> => {
  try {
    // Cek health dulu
    const health = await checkStorageHealth()
    if (!health.healthy) {
      // Storage not healthy
      return false
    }

    // Cek apakah bucket sudah ada
    const bucketExists = health.buckets.includes('blog-images')
    
    if (bucketExists) {
      // Bucket blog-images sudah ada
      return true
    }

    // Buat bucket jika belum ada
    const created = await createBucket('blog-images', true)
    if (created) {
      // Storage setup completed
      return true
    }

    return false
  } catch (error) {
    // Setup storage error
    return false
  }
}
