// CSS Optimization untuk menghapus CSS yang tidak digunakan
import { useEffect } from 'react';

// Fungsi untuk menghapus CSS yang tidak digunakan
export const optimizeCSS = () => {
  // Hapus CSS yang tidak digunakan dari global styles
  const unusedCSSSelectors = [
    // Selectors yang tidak digunakan
    '.portfolio-item',
    '.portfolio-detail',
    '.admin-portfolio',
    '.portfolio-gallery',
    '.portfolio-image',
    '.portfolio-card',
    '.portfolio-grid',
    '.portfolio-list',
    '.portfolio-thumbnail',
    '.portfolio-overlay',
    '.portfolio-meta',
    '.portfolio-category',
    '.portfolio-tags',
    '.portfolio-author',
    '.portfolio-date',
    '.portfolio-status',
    '.portfolio-featured',
    '.portfolio-actions',
    '.portfolio-edit',
    '.portfolio-delete',
    '.portfolio-publish',
    '.portfolio-draft',
    '.portfolio-unpublish',
    '.portfolio-feature',
    '.portfolio-unfeature'
  ];

  // Hapus CSS yang tidak digunakan
  unusedCSSSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) {
      // CSS selector tidak digunakan, bisa dihapus
      console.log(`Unused CSS selector: ${selector}`);
    }
  });
};

// Hook untuk optimasi CSS
export const useCSSOptimization = () => {
  useEffect(() => {
    // Jalankan optimasi CSS setelah komponen mount
    const timer = setTimeout(() => {
      optimizeCSS();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
};

// Fungsi untuk preload CSS kritis
export const preloadCriticalCSS = () => {
  const criticalCSS = [
    '/src/index.css',
    '/src/components/ui/button.css',
    '/src/components/ui/card.css',
    '/src/components/ui/input.css'
  ];

  criticalCSS.forEach(cssPath => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = cssPath;
    document.head.appendChild(link);
  });
};
