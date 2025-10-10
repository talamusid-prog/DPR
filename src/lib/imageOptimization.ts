// Image Optimization untuk performa yang lebih baik
import { useEffect, useState } from 'react';

// Fungsi untuk optimasi image loading
export const optimizeImageLoading = () => {
  // Lazy load images
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

// Hook untuk optimasi image
export const useImageOptimization = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Jalankan optimasi image setelah komponen mount
    const timer = setTimeout(() => {
      optimizeImageLoading();
      setIsLoaded(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return { isLoaded };
};

// Fungsi untuk preload images kritis
export const preloadCriticalImages = () => {
  const criticalImages = [
    '/logo.png',
    '/hero-image.jpg',
    '/berita1.jpg',
    '/berita2.jpg',
    '/berita3.jpg'
  ];

  criticalImages.forEach(imagePath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imagePath;
    document.head.appendChild(link);
  });
};

// Fungsi untuk compress images
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        }
      }, 'image/jpeg', quality);
    };

    img.src = URL.createObjectURL(file);
  });
};
