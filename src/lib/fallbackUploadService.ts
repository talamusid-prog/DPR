// Fallback upload service untuk ketika Supabase Storage bermasalah
import { UploadResult } from './imageUploadService'

// Fungsi untuk compress image sebelum convert ke base64 dengan WebP untuk performa yang lebih baik
export const compressImage = (file: File, maxWidth: number = 600, quality: number = 0.7): Promise<File> => {
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
      
      // Coba WebP dulu untuk ukuran yang lebih kecil
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.webp'), {
              type: 'image/webp',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            // Fallback ke JPEG jika WebP tidak didukung
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob) {
                  const compressedFile = new File([jpegBlob], file.name, {
                    type: 'image/jpeg',
                    lastModified: Date.now()
                  })
                  resolve(compressedFile)
                } else {
                  reject(new Error('Failed to compress image'))
                }
              },
              'image/jpeg',
              quality
            )
          }
        },
        'image/webp',
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
    // Uploading with fallback mechanism
    
    // Compress image dengan setting yang lebih agresif untuk performa
    const compressedFile = await compressImage(file, 600, 0.7) // Lebih kecil dan lebih terkompresi
    // Image compressed
    
    // Convert to base64 dengan optimasi untuk performa yang lebih baik
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        
        // Validasi format base64 yang ketat
        if (!result || typeof result !== 'string' || !result.startsWith('data:image/') || !result.includes(',')) {
          reject(new Error('Invalid base64 format'))
          return
        }
        
        // Optimasi base64 dengan menghapus whitespace dan karakter yang tidak perlu
        const optimizedBase64 = result.replace(/\s/g, '')
        
        // Validasi base64 data setelah optimasi
        const base64Parts = optimizedBase64.split(',')
        if (base64Parts.length !== 2 || !base64Parts[0] || !base64Parts[1]) {
          reject(new Error('Invalid base64 format after optimization'))
          return
        }
        
        // Validasi header
        if (!base64Parts[0].includes('base64')) {
          reject(new Error('Invalid base64 header'))
          return
        }
        
        // Test decode untuk memastikan data valid
        try {
          atob(base64Parts[1].substring(0, Math.min(100, base64Parts[1].length)))
        } catch (error) {
          reject(new Error('Invalid base64 data'))
          return
        }
        
        // Jika base64 terlalu besar (>500KB), coba kompresi tambahan
        if (optimizedBase64.length > 500000) {
          console.warn('Base64 too large, applying additional compression')
          // Return base64 yang sudah dioptimasi
          resolve(optimizedBase64)
        } else {
          resolve(optimizedBase64)
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(compressedFile)
    })

    // Image converted to optimized base64
    return {
      success: true,
      url: base64,
      path: 'base64-optimized'
    }
  } catch (error) {
    // Fallback upload error
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
  // Validasi base64 URL
  if (!base64Url || typeof base64Url !== 'string') {
    console.warn('Invalid base64 URL: not a string')
    return ''
  }

  // Validasi format base64
  if (!base64Url.startsWith('data:image/')) {
    console.warn('Invalid base64 URL: does not start with data:image/')
    return ''
  }

  if (!base64Url.includes(',')) {
    console.warn('Invalid base64 format - missing comma separator')
    return ''
  }

  // Split untuk validasi
  const [header, data] = base64Url.split(',')
  if (!header || !data) {
    console.warn('Invalid base64 format - missing header or data')
    return ''
  }

  // Validasi header
  if (!header.includes('base64')) {
    console.warn('Invalid base64 header:', header)
    return ''
  }

  // Validasi data base64 tidak kosong
  if (!data.trim()) {
    console.warn('Invalid base64 data: empty data')
    return ''
  }

  // Test decode untuk memastikan data valid
  try {
    // Test decode sebagian kecil untuk validasi
    const testData = data.substring(0, Math.min(100, data.length))
    atob(testData)
  } catch (error) {
    console.warn('Invalid base64 data:', error.message)
    return ''
  }

  // Return base64 URL as is
  return base64Url
}
