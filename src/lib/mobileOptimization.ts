// Mobile optimization untuk performa yang lebih baik
import { useEffect } from 'react';

// Interface untuk mobile optimization
interface MobileOptimizationConfig {
  enableLazyLoading: boolean;
  enableCodeSplitting: boolean;
  enableImageOptimization: boolean;
  enablePreloading: boolean;
  maxBundleSize: number; // KB
}

// Default config untuk mobile
const MOBILE_CONFIG: MobileOptimizationConfig = {
  enableLazyLoading: true,
  enableCodeSplitting: true,
  enableImageOptimization: true,
  enablePreloading: true,
  maxBundleSize: 500 // 500KB max untuk mobile
};

// Fungsi untuk detect mobile device
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768;
};

// Fungsi untuk optimize bundle size untuk mobile
export const optimizeBundleForMobile = () => {
  if (!isMobileDevice()) return;

  // Remove non-critical scripts
  const nonCriticalScripts = [
    'analytics',
    'tracking',
    'debug',
    'development'
  ];

  nonCriticalScripts.forEach(scriptName => {
    const scripts = document.querySelectorAll(`script[src*="${scriptName}"]`);
    scripts.forEach(script => {
      script.remove();
    });
  });

  // Defer non-critical CSS
  const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
  nonCriticalCSS.forEach(link => {
    link.media = 'print';
    link.onload = () => {
      link.media = 'all';
    };
  });
};

// Fungsi untuk optimize images untuk mobile
export const optimizeImagesForMobile = () => {
  if (!isMobileDevice()) return;

  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    // Set loading="lazy" untuk semua images
    img.loading = 'lazy';
    
    // Set decoding="async"
    img.decoding = 'async';
    
    // Add error handling
    img.addEventListener('error', () => {
      // Fallback ke placeholder atau hide image
      img.style.display = 'none';
    });
    
    // Optimize src jika menggunakan Supabase
    if (img.src.includes('supabase')) {
      const optimizedSrc = img.src + '?width=800&quality=80';
      img.src = optimizedSrc;
    }
  });
};

// Fungsi untuk preload critical resources untuk mobile
export const preloadCriticalResourcesForMobile = () => {
  if (!isMobileDevice()) return;

  const criticalResources = [
    '/logo.png',
    '/background2.jpg',
    '/assets/index-CBH05rpD.css',
    '/assets/vendor-B0GH47Ad.js'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else {
      link.as = 'image';
    }
    
    link.href = resource;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Fungsi untuk defer non-critical resources
export const deferNonCriticalResources = () => {
  if (!isMobileDevice()) return;

  // Defer non-critical JavaScript
  const nonCriticalJS = [
    'analytics',
    'tracking',
    'social',
    'ads'
  ];

  nonCriticalJS.forEach(jsName => {
    const scripts = document.querySelectorAll(`script[src*="${jsName}"]`);
    scripts.forEach(script => {
      script.defer = true;
      script.async = true;
    });
  });
};

// Fungsi untuk optimize network requests
export const optimizeNetworkRequests = () => {
  if (!isMobileDevice()) return;

  // Add connection hints
  const connectionHints = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://supabase-k8m28929.zeabur.app'
  ];

  connectionHints.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Hook untuk mobile optimization
export const useMobileOptimization = (config: Partial<MobileOptimizationConfig> = {}) => {
  const finalConfig = { ...MOBILE_CONFIG, ...config };

  useEffect(() => {
    if (!isMobileDevice()) return;

    // Optimize bundle
    if (finalConfig.enableCodeSplitting) {
      optimizeBundleForMobile();
    }

    // Optimize images
    if (finalConfig.enableImageOptimization) {
      optimizeImagesForMobile();
    }

    // Preload critical resources
    if (finalConfig.enablePreloading) {
      preloadCriticalResourcesForMobile();
    }

    // Defer non-critical resources
    deferNonCriticalResources();

    // Optimize network requests
    optimizeNetworkRequests();

  }, [finalConfig]);
};

// Fungsi untuk measure mobile performance
export const measureMobilePerformance = () => {
  if (!isMobileDevice()) return;

  const metrics = {
    connection: (navigator as any).connection,
    memory: (performance as any).memory,
    timing: performance.timing
  };

  console.log('Mobile Performance Metrics:', metrics);
  
  // Send to analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', 'mobile_performance', {
      event_category: 'Performance',
      event_label: 'Mobile Optimization',
      value: metrics.timing.loadEventEnd - metrics.timing.navigationStart
    });
  }
};

// Fungsi untuk optimize touch interactions
export const optimizeTouchInteractions = () => {
  if (!isMobileDevice()) return;

  // Add touch-friendly styles
  const style = document.createElement('style');
  style.textContent = `
    button, a, input, select, textarea {
      min-height: 44px;
      min-width: 44px;
    }
    
    .touch-target {
      touch-action: manipulation;
    }
  `;
  document.head.appendChild(style);
};
