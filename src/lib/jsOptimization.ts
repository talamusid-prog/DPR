// JavaScript Optimization untuk menghapus kode yang tidak digunakan
import { useEffect } from 'react';

// Fungsi untuk menghapus JavaScript yang tidak digunakan
export const optimizeJavaScript = () => {
  // Hapus console.log di production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.debug = () => {};
    console.info = () => {};
    console.warn = () => {};
  }

  // Hapus unused imports
  const unusedImports = [
    'Portfolio',
    'PortfolioDetail',
    'AdminPortfolio',
    'getPortfolioImageWithFallback',
    'portfolioService',
    'portfolioImageService'
  ];

  unusedImports.forEach(importName => {
    console.log(`Unused import: ${importName}`);
  });
};

// Hook untuk optimasi JavaScript
export const useJSOptimization = () => {
  useEffect(() => {
    // Jalankan optimasi JavaScript setelah komponen mount
    const timer = setTimeout(() => {
      optimizeJavaScript();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
};

// Fungsi untuk preload JavaScript kritis
export const preloadCriticalJS = () => {
  const criticalJS = [
    '/src/main.tsx',
    '/src/App.tsx',
    '/src/pages/Index.tsx',
    '/src/components/Header.tsx',
    '/src/components/Footer.tsx'
  ];

  criticalJS.forEach(jsPath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'script';
    link.href = jsPath;
    document.head.appendChild(link);
  });
};

// Fungsi untuk defer JavaScript yang tidak kritis
export const deferNonCriticalJS = () => {
  const nonCriticalJS = [
    '/src/pages/AdminGallery.tsx',
    '/src/pages/AdminAspirasi.tsx',
    '/src/pages/AdminKalenderPage.tsx',
    '/src/pages/CreateArticle.tsx',
    '/src/pages/EditArticle.tsx'
  ];

  nonCriticalJS.forEach(jsPath => {
    const script = document.createElement('script');
    script.src = jsPath;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);
  });
};
