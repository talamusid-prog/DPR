// Preload optimization untuk performa yang lebih baik
import { useEffect } from 'react';

// Fungsi untuk preload resources kritis
export const preloadCriticalResources = () => {
  // Preload fonts
  const fonts = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
  ];

  fonts.forEach(fontUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = fontUrl;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });

  // Preload critical CSS
  const criticalCSS = [
    '/src/index.css',
    '/src/App.css'
  ];

  criticalCSS.forEach(cssUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = cssUrl;
    document.head.appendChild(link);
  });

  // Preload critical JavaScript
  const criticalJS = [
    '/src/main.tsx',
    '/src/App.tsx'
  ];

  criticalJS.forEach(jsUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = jsUrl;
    document.head.appendChild(link);
  });

  // Preload critical images
  const criticalImages = [
    '/logo.png',
    '/hero-image.jpg'
  ];

  criticalImages.forEach(imageUrl => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = imageUrl;
    document.head.appendChild(link);
  });
};

// Fungsi untuk defer non-critical resources
export const deferNonCriticalResources = () => {
  // Defer non-critical CSS
  const nonCriticalCSS = [
    '/src/components/ui/button.css',
    '/src/components/ui/card.css',
    '/src/components/ui/input.css'
  ];

  nonCriticalCSS.forEach(cssUrl => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
    document.head.appendChild(link);
  });

  // Defer non-critical JavaScript
  const nonCriticalJS = [
    '/src/pages/AdminGallery.tsx',
    '/src/pages/AdminAspirasi.tsx',
    '/src/pages/AdminKalenderPage.tsx'
  ];

  nonCriticalJS.forEach(jsUrl => {
    const script = document.createElement('script');
    script.src = jsUrl;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  });
};

// Hook untuk optimasi preload
export const usePreloadOptimization = () => {
  useEffect(() => {
    // Preload resources kritis
    preloadCriticalResources();

    // Defer resources non-kritis
    const timer = setTimeout(() => {
      deferNonCriticalResources();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
};

// Fungsi untuk optimasi DNS prefetch
export const optimizeDNSPrefetch = () => {
  const dnsPrefetchDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://supabase-k8m28929.zeabur.app'
  ];

  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Fungsi untuk optimasi resource hints
export const optimizeResourceHints = () => {
  // Preconnect ke domain eksternal
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://supabase-k8m28929.zeabur.app'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};
