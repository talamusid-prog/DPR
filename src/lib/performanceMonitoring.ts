// Performance monitoring untuk optimasi website
import { useEffect } from 'react';

// Interface untuk performance metrics
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fmp: number; // First Meaningful Paint
}

// Interface untuk PerformanceEntry dengan properti tambahan
interface PerformanceEntryWithValue extends PerformanceEntry {
  value?: number;
  processingStart?: number;
}

// Interface untuk navigator dengan connection
interface NavigatorWithConnection extends Navigator {
  connection?: {
    effectiveType: string;
    downlink: number;
    rtt: number;
    saveData: boolean;
  };
}

// Interface untuk performance dengan memory
interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

// Declare gtag function
declare global {
  function gtag(...args: unknown[]): void;
}

// Fungsi untuk mengukur performance metrics
export const measurePerformance = (): PerformanceMetrics => {
  const metrics: PerformanceMetrics = {
    fcp: 0,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0,
    fmp: 0
  };

  // Measure FCP (First Contentful Paint)
  const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
  if (fcpEntry) {
    metrics.fcp = fcpEntry.startTime;
  }

  // Measure LCP (Largest Contentful Paint)
  const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
  if (lcpEntries.length > 0) {
    metrics.lcp = lcpEntries[lcpEntries.length - 1].startTime;
  }

  // Measure FID (First Input Delay)
  const fidEntries = performance.getEntriesByType('first-input') as PerformanceEntryWithValue[];
  if (fidEntries.length > 0) {
    const entry = fidEntries[0];
    metrics.fid = (entry.processingStart || 0) - entry.startTime;
  }

  // Measure CLS (Cumulative Layout Shift)
  const clsEntries = performance.getEntriesByType('layout-shift') as PerformanceEntryWithValue[];
  if (clsEntries.length > 0) {
    metrics.cls = clsEntries.reduce((sum, entry) => sum + (entry.value || 0), 0);
  }

  // Measure TTFB (Time to First Byte)
  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationEntry) {
    metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
  }

  // Measure FMP (First Meaningful Paint)
  const fmpEntry = performance.getEntriesByName('first-meaningful-paint')[0];
  if (fmpEntry) {
    metrics.fmp = fmpEntry.startTime;
  }

  return metrics;
};

// Fungsi untuk mengirim performance data ke analytics
export const sendPerformanceData = (metrics: PerformanceMetrics) => {
  // Kirim ke Google Analytics atau service lainnya
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as { gtag: (...args: unknown[]) => void }).gtag;
    gtag('event', 'performance_metrics', {
      event_category: 'Performance',
      event_label: 'Core Web Vitals',
      custom_map: {
        fcp: metrics.fcp,
        lcp: metrics.lcp,
        fid: metrics.fid,
        cls: metrics.cls,
        ttfb: metrics.ttfb,
        fmp: metrics.fmp
      }
    });
  }

  // Log ke console untuk debugging
  console.log('Performance Metrics:', metrics);
};

// Hook untuk monitoring performance
export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Wait for page load
    const timer = setTimeout(() => {
      const metrics = measurePerformance();
      sendPerformanceData(metrics);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
};

// Fungsi untuk mengukur bundle size
export const measureBundleSize = () => {
  const scripts = document.querySelectorAll('script[src]');
  let totalSize = 0;

  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src && src.includes('assets/')) {
      // Estimate size based on URL
      const size = src.includes('index-') ? 2000 : 500; // KB
      totalSize += size;
    }
  });

  console.log(`Estimated bundle size: ${totalSize} KB`);
  return totalSize;
};

// Fungsi untuk mengukur image loading performance
export const measureImagePerformance = () => {
  const images = document.querySelectorAll('img');
  let loadedImages = 0;
  const totalImages = images.length;

  images.forEach(img => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener('load', () => {
        loadedImages++;
        if (loadedImages === totalImages) {
          console.log('All images loaded');
        }
      });
    }
  });

  return { loadedImages, totalImages };
};

// Fungsi untuk mengukur network performance
export const measureNetworkPerformance = () => {
  const navigatorWithConnection = navigator as NavigatorWithConnection;
  const connection = navigatorWithConnection.connection;
  if (connection) {
    console.log('Network Info:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    });
  }
};

// Fungsi untuk mengukur memory usage
export const measureMemoryUsage = () => {
  const performanceWithMemory = performance as PerformanceWithMemory;
  const memory = performanceWithMemory.memory;
  if (memory) {
    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    });
  }
};
