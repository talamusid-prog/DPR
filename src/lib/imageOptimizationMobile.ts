// Image optimization khusus untuk mobile
import { useEffect } from 'react';

// Interface untuk image optimization options
interface ImageOptimizationOptions {
  maxWidth: number;
  maxHeight: number;
  quality: number;
  format: 'webp' | 'jpeg' | 'png';
  lazy: boolean;
}

// Default options untuk mobile
const MOBILE_OPTIONS: ImageOptimizationOptions = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  format: 'webp',
  lazy: true
};

// Fungsi untuk compress image untuk mobile
export const compressImageForMobile = async (
  file: File, 
  options: Partial<ImageOptimizationOptions> = {}
): Promise<File> => {
  const opts = { ...MOBILE_OPTIONS, ...options };
  
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const maxWidth = opts.maxWidth;
      const maxHeight = opts.maxHeight;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw image with new dimensions
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to specified format
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: `image/${opts.format}`,
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, `image/${opts.format}`, opts.quality);
    };

    img.src = URL.createObjectURL(file);
  });
};

// Fungsi untuk lazy load images
export const setupLazyLoading = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        img.src = img.dataset.src || '';
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
};

// Fungsi untuk preload critical images
export const preloadCriticalImages = () => {
  const criticalImages = [
    '/logo.png',
    '/background2.jpg',
    '/logo2.png',
    '/background2.png',
    '/jasa1.png'
  ];

  criticalImages.forEach(imagePath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imagePath;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Fungsi untuk responsive images
export const setupResponsiveImages = () => {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Add loading="lazy" for non-critical images
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Add decoding="async" for better performance
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
    
    // Add error handling
    img.addEventListener('error', () => {
      console.warn('Image failed to load:', img.src);
      // Fallback to placeholder or hide image
      img.style.display = 'none';
    });
  });
};

// Hook untuk mobile image optimization
export const useMobileImageOptimization = () => {
  useEffect(() => {
    // Setup lazy loading
    setupLazyLoading();
    
    // Setup responsive images
    setupResponsiveImages();
    
    // Preload critical images
    preloadCriticalImages();
  }, []);
};

// Fungsi untuk generate responsive image URLs
export const getResponsiveImageUrl = (
  baseUrl: string, 
  width: number, 
  quality: number = 80
): string => {
  // Jika menggunakan Supabase, bisa menggunakan transform API
  if (baseUrl.includes('supabase')) {
    return `${baseUrl}?width=${width}&quality=${quality}`;
  }
  
  // Fallback untuk URL biasa
  return baseUrl;
};

// Fungsi untuk optimize background images
export const optimizeBackgroundImages = () => {
  const elements = document.querySelectorAll('[style*="background-image"]');
  
  elements.forEach(element => {
    const style = element.getAttribute('style');
    if (style && style.includes('background-image')) {
      // Extract URL from background-image
      const urlMatch = style.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (urlMatch) {
        const originalUrl = urlMatch[1];
        // Add loading="lazy" equivalent for background images
        element.setAttribute('data-bg', originalUrl);
        element.style.backgroundImage = 'none';
        
        // Load background image when element is in viewport
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const bgUrl = entry.target.getAttribute('data-bg');
              if (bgUrl) {
                entry.target.style.backgroundImage = `url(${bgUrl})`;
                observer.unobserve(entry.target);
              }
            }
          });
        });
        
        observer.observe(element);
      }
    }
  });
};
