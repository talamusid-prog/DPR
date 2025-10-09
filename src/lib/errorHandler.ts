// Error handler untuk menangani error Supabase dan network
export interface ErrorInfo {
  type: 'network' | 'auth' | 'database' | 'unknown'
  message: string
  code?: string
  retryable: boolean
}

export function analyzeError(error: any): ErrorInfo {
  // Network errors
  if (error?.message?.includes('503') || error?.message?.includes('Service Unavailable')) {
    return {
      type: 'network',
      message: 'Server tidak tersedia. Silakan coba lagi nanti.',
      code: '503',
      retryable: true
    }
  }

  if (error?.message?.includes('500') || error?.message?.includes('Internal Server Error')) {
    return {
      type: 'network',
      message: 'Server mengalami masalah. Silakan coba lagi.',
      code: '500',
      retryable: true
    }
  }

  if (error?.message?.includes('404') || error?.message?.includes('Not Found')) {
    return {
      type: 'network',
      message: 'Resource tidak ditemukan.',
      code: '404',
      retryable: false
    }
  }

  // Auth errors
  if (error?.message?.includes('JWT') || error?.message?.includes('token')) {
    return {
      type: 'auth',
      message: 'Sesi telah berakhir. Silakan login kembali.',
      code: 'AUTH_ERROR',
      retryable: false
    }
  }

  // Database errors
  if (error?.message?.includes('relation') || error?.message?.includes('table')) {
    return {
      type: 'database',
      message: 'Database tidak tersedia. Silakan hubungi administrator.',
      code: 'DB_ERROR',
      retryable: false
    }
  }

  // Default
  return {
    type: 'unknown',
    message: error?.message || 'Terjadi kesalahan yang tidak diketahui.',
    retryable: true
  }
}

export function shouldRetry(error: any, retryCount: number = 0): boolean {
  const maxRetries = 3
  const errorInfo = analyzeError(error)
  
  return errorInfo.retryable && retryCount < maxRetries
}

export function getRetryDelay(retryCount: number): number {
  // Exponential backoff: 1s, 2s, 4s
  return Math.min(1000 * Math.pow(2, retryCount), 10000)
}

// Utility untuk retry dengan exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: any
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (i === maxRetries || !shouldRetry(error, i)) {
        break
      }
      
      const delay = getRetryDelay(i)
      console.log(`🔄 Retrying in ${delay}ms (attempt ${i + 1}/${maxRetries + 1})`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  throw lastError
}

// Fallback data untuk ketika Supabase tidak tersedia
export const fallbackData = {
  aspirasi: [],
  galleries: [],
  blogPosts: [],
  newAspirasiCount: 0
}
