import DOMPurify from 'dompurify'

// Konfigurasi DOMPurify untuk keamanan maksimal
const config = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'a', 'img', 'div', 'span', 'table', 'tr', 'td', 'th', 'tbody', 'thead'
  ],
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'id', 'target'
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ['script', 'object', 'embed', 'iframe', 'form', 'input', 'button'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur'],
  ALLOW_DATA_ATTR: false,
  SANITIZE_DOM: true,
  KEEP_CONTENT: true,
  RETURN_DOM: false,
  RETURN_DOM_FRAGMENT: false,
  RETURN_DOM_IMPORT: false
}

/**
 * Sanitasi HTML content untuk mencegah XSS
 * @param html - HTML content yang akan disanitasi
 * @returns HTML yang sudah disanitasi dan aman
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  try {
    // Sanitasi dengan DOMPurify
    const sanitized = DOMPurify.sanitize(html, config)
    
    // Validasi tambahan untuk memastikan tidak ada script
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi
    const eventHandlerRegex = /on\w+\s*=\s*["'][^"']*["']/gi
    
    if (scriptRegex.test(sanitized) || eventHandlerRegex.test(sanitized)) {
      console.warn('Potentially malicious content detected and removed')
      return DOMPurify.sanitize(html, { ...config, ALLOWED_TAGS: [] })
    }
    
    return sanitized
  } catch (error) {
    console.error('Error sanitizing HTML:', error)
    return ''
  }
}

/**
 * Sanitasi text content untuk mencegah XSS
 * @param text - Text content yang akan disanitasi
 * @returns Text yang sudah disanitasi
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }

  return text
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
}

/**
 * Validasi URL untuk mencegah malicious links
 * @param url - URL yang akan divalidasi
 * @returns boolean apakah URL aman
 */
export function isValidURL(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const urlObj = new URL(url)
    
    // Hanya izinkan HTTP dan HTTPS
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }
    
    // Cek untuk javascript: dan data: protocols
    if (url.toLowerCase().includes('javascript:') || url.toLowerCase().includes('data:')) {
      return false
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * Sanitasi dan validasi URL
 * @param url - URL yang akan disanitasi
 * @returns URL yang aman atau string kosong
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }

  const sanitized = sanitizeText(url)
  
  if (!isValidURL(sanitized)) {
    return ''
  }
  
  return sanitized
}

/**
 * Sanitasi form input
 * @param input - Input yang akan disanitasi
 * @returns Input yang sudah disanitasi
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/script/gi, '') // Remove script tags
    .trim()
}
