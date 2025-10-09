/**
 * Utility functions for URL handling
 */

/**
 * Get the current domain dynamically based on the current environment
 * @returns The current domain with protocol
 */
export const getCurrentDomain = (): string => {
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  
  // Fallback for server-side rendering or when window is not available
  if (typeof process !== 'undefined' && process.env) {
    // Check for Vercel deployment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}`;
    }
    
    // Check for custom domain in environment
    if (process.env.VITE_APP_URL) {
      return process.env.VITE_APP_URL;
    }
  }
  
  // Default fallback
  return 'https://ideadigiralcreative.com';
};

/**
 * Get the full URL for a given path
 * @param path - The path to append to the domain
 * @returns The full URL
 */
export const getFullUrl = (path: string): string => {
  const domain = getCurrentDomain();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${domain}${cleanPath}`;
};

/**
 * Get the current URL with pathname
 * @returns The current full URL
 */
export const getCurrentUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.href;
  }
  return getCurrentDomain();
};
