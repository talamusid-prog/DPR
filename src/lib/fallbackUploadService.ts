// Fallback upload service untuk ketika Supabase Storage bermasalah
import { UploadResult } from './imageUploadService'

// Fungsi untuk compress image sebelum convert ke base64
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height)
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        file.type,
        quality
      )
    }

    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(file)
  })
}

// Fungsi untuk upload dengan fallback ke base64
export const uploadWithFallback = async (file: File): Promise<UploadResult> => {
  try {
    console.log('📤 Uploading with fallback mechanism...')
    
    // Compress image terlebih dahulu
    const compressedFile = await compressImage(file, 800, 0.8)
    console.log(`📊 Image compressed: ${file.size} -> ${compressedFile.size} bytes`)
    
    // Convert to base64
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(compressedFile)
    })

    console.log('✅ Image converted to base64 (compressed)')
    return {
      success: true,
      url: base64,
      path: 'base64-compressed'
    }
  } catch (error) {
    console.error('❌ Fallback upload error:', error)
    return {
      success: false,
      error: `Fallback upload gagal: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Fungsi untuk mendapatkan URL yang dioptimasi dari base64
export const getOptimizedBase64Url = (base64Url: string, options?: {
  width?: number
  height?: number
  quality?: number
}): string => {
  // Untuk base64, kita tidak bisa mengoptimasi lebih lanjut
  // Tapi kita bisa menambahkan parameter untuk tracking
  const params = new URLSearchParams()
  if (options?.width) params.append('w', options.width.toString())
  if (options?.height) params.append('h', options.height.toString())
  if (options?.quality) params.append('q', options.quality.toString())
  
  const queryString = params.toString()
  return queryString ? `${base64Url}?${queryString}` : base64Url
}
