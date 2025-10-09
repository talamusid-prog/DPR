// Service untuk mengelola gambar portfolio dengan sistem berbagi antar tab
import { supabase } from './supabase';

// Event untuk berbagi data antar tab
const PORTFOLIO_IMAGE_EVENT = 'portfolio-image-updated';

// Interface untuk data gambar
interface PortfolioImageData {
  key: string;
  data: string;
  timestamp: number;
}

// Broadcast channel untuk komunikasi antar tab
let broadcastChannel: BroadcastChannel | null = null;

// Initialize broadcast channel
const initBroadcastChannel = () => {
  try {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      broadcastChannel = new BroadcastChannel('portfolio-images');
    }
  } catch (error) {
    console.warn('⚠️ BroadcastChannel not supported, falling back to postMessage');
  }
};

// Initialize on module load
initBroadcastChannel();

// Auto-fix missing images on module load (disabled to prevent overwriting real images)
// if (typeof window !== 'undefined') {
//   setTimeout(() => {
//     fixMissingImages().then((fixedCount) => {
//       if (fixedCount > 0) {
//         console.log(`🔧 [IMAGE SERVICE] Auto-fixed ${fixedCount} missing images on load`);
//       }
//     });
//   }, 2000); // Wait 2 seconds after page load
// }

// Fungsi untuk menyimpan gambar menggunakan base64 langsung (seperti blog)
export const savePortfolioImageToPublic = async (file: File): Promise<string | null> => {
  try {
    // Convert file to base64 langsung (seperti blog)
    const base64 = await convertFileToBase64(file);
    
    // Generate unique key untuk database
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 11);
    const imageKey = `portfolio-image-${timestamp}-${randomId}`;
    
    // Save to localStorage dan sessionStorage untuk backup (dengan enkripsi)
    try {
      const { setEncryptedItem } = await import('./encryption');
      setEncryptedItem(imageKey, base64);
      sessionStorage.setItem(imageKey, base64);
    } catch (storageError) {
      console.error('❌ [IMAGE SERVICE] Storage backup failed:', storageError);
    }
    
    // Broadcast to other tabs
    broadcastImageToOtherTabs(imageKey, base64);
    
    // Return base64 langsung (seperti blog)
    return base64;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error saving image:', error);
    return null;
  }
};

// Fungsi untuk menyimpan gambar dengan sistem berbagi antar tab (legacy - untuk backward compatibility)
export const savePortfolioImage = async (file: File): Promise<string | null> => {
  try {
    // Convert file to base64
    const base64 = await convertFileToBase64(file);

    // Generate unique key
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 11);
    const imageKey = `portfolio-image-${timestamp}-${randomId}`;

    let localStorageSuccess = false;
    let sessionStorageSuccess = false;
    let retryCount = 0;
    const maxRetries = 3;

    while ((!localStorageSuccess || !sessionStorageSuccess) && retryCount < maxRetries) {
      try {
        localStorage.setItem(imageKey, base64);
        const verifyLocal = localStorage.getItem(imageKey);
        localStorageSuccess = verifyLocal === base64;
      } catch (localError) {
        console.error('❌ [IMAGE SERVICE] localStorage save failed:', localError);
      }

      try {
        sessionStorage.setItem(imageKey, base64);
        const verifySession = sessionStorage.getItem(imageKey);
        sessionStorageSuccess = verifySession === base64;
      } catch (sessionError) {
        console.error('❌ [IMAGE SERVICE] sessionStorage save failed:', sessionError);
      }

      if (!localStorageSuccess || !sessionStorageSuccess) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 100 * retryCount)); // Exponential backoff
      }
    }

    if (localStorageSuccess || sessionStorageSuccess) {
      // Broadcast to other tabs
      broadcastImageToOtherTabs(imageKey, base64);
      return imageKey;
    } else {
      console.error('❌ [IMAGE SERVICE] Failed to save image to both localStorage and sessionStorage after retries.');
      return null;
    }
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error saving image:', error);
    return null;
  }
};

// Fungsi untuk mengambil gambar dari storage
export const getPortfolioImage = async (imageKey: string): Promise<string | null> => {
  try {
    // Check if it's already a base64 data URL (seperti blog)
    if (imageKey.startsWith('data:image/')) {
      return imageKey;
    }
    
    // Check if it's a public path
    if (imageKey.startsWith('/portfolio-images/')) {
      return imageKey;
    }
    
    // Check if it's a portfolio-image key (legacy)
    if (imageKey.startsWith('portfolio-image-')) {
      // Try localStorage first (dengan dekripsi)
      const { getEncryptedItem } = await import('./encryption');
      let image = getEncryptedItem(imageKey);
      
      if (image) {
        // Check if it's a real image (base64) or placeholder
        if (image.startsWith('data:image/')) {
          return image;
        }
      }
      
      // Try sessionStorage as fallback
      image = sessionStorage.getItem(imageKey);
      
      if (image) {
        // Check if it's a real image (base64) or placeholder
        if (image.startsWith('data:image/')) {
          return image;
        } else {
          return null; // Don't return placeholder, let fallback handle it
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error getting image from storage:', error);
    return null;
  }
};

// Fungsi untuk broadcast gambar ke tab lain
const broadcastImageToOtherTabs = (key: string, data: string) => {
  try {
    const imageData: PortfolioImageData = {
      key,
      data,
      timestamp: Date.now()
    };
    
    // Use BroadcastChannel if available
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: PORTFOLIO_IMAGE_EVENT,
        payload: imageData
      });
    } else {
      // Fallback to postMessage
      window.postMessage({
        type: PORTFOLIO_IMAGE_EVENT,
        payload: imageData
      }, '*');
    }
  } catch (error) {
    console.error('❌ Error broadcasting image:', error);
  }
};

// Fungsi untuk mendengarkan update gambar dari tab lain
export const listenForImageUpdates = (callback: (key: string, data: string) => void) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === PORTFOLIO_IMAGE_EVENT) {
      const { key, data } = event.data.payload;
      
      // Save to current tab's storage
      localStorage.setItem(key, data);
      sessionStorage.setItem(key, data);
      
      // Call callback
      callback(key, data);
    }
  };

  const handleBroadcastMessage = (event: MessageEvent) => {
    if (event.data.type === PORTFOLIO_IMAGE_EVENT) {
      const { key, data } = event.data.payload;
      
      // Save to current tab's storage
      localStorage.setItem(key, data);
      sessionStorage.setItem(key, data);
      
      // Call callback
      callback(key, data);
    }
  };

  // Listen for postMessage
  window.addEventListener('message', handleMessage);
  
  // Listen for BroadcastChannel
  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcastMessage);
  }
  
  // Return cleanup function
  return () => {
    window.removeEventListener('message', handleMessage);
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcastMessage);
    }
  };
};

// Fungsi untuk convert file ke base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Fungsi untuk sync gambar dari database ke storage
export const syncImagesFromDatabase = async () => {
  try {
    // Get all portfolios from database
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, featured_image')
      .not('featured_image', 'is', null);
    
    if (error) {
      console.error('❌ [IMAGE SERVICE] Error fetching portfolios for sync:', error);
      return;
    }
    
    // Check which images are missing from storage
    let missingCount = 0;
    portfolios?.forEach(portfolio => {
      if (portfolio.featured_image && portfolio.featured_image.startsWith('portfolio-image-')) {
        const existsInLocal = localStorage.getItem(portfolio.featured_image);
        const existsInSession = sessionStorage.getItem(portfolio.featured_image);
        
        if (!existsInLocal && !existsInSession) {
          missingCount++;
        }
      }
    });
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error syncing images:', error);
  }
};

// Fungsi untuk debug storage status
export const debugStorageStatus = () => {
  try {
    const localStorageKeys = [];
    const sessionStorageKeys = [];
    
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        localStorageKeys.push(key);
      }
    }
    
    // Get all sessionStorage keys
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        sessionStorageKeys.push(key);
      }
    }
    
    return {
      localStorage: localStorageKeys,
      sessionStorage: sessionStorageKeys
    };
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error debugging storage:', error);
    return { localStorage: [], sessionStorage: [] };
  }
};

// Fungsi untuk export semua gambar dari storage
export const exportAllImages = (): Record<string, string> => {
  const images: Record<string, string> = {};
  
  try {
    // Get all localStorage keys that start with portfolio-image-
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        const data = localStorage.getItem(key);
        if (data) {
          images[key] = data;
        }
      }
    }
    
    return images;
  } catch (error) {
    console.error('❌ Error exporting images:', error);
    return {};
  }
};

// Fungsi untuk import gambar ke storage
export const importImages = (images: Record<string, string>) => {
  try {
    let importedCount = 0;
    
    Object.entries(images).forEach(([key, data]) => {
      if (key.startsWith('portfolio-image-')) {
        localStorage.setItem(key, data);
        sessionStorage.setItem(key, data);
        importedCount++;
      }
    });
    
    return importedCount;
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error importing images:', error);
    return 0;
  }
};

// Fungsi untuk memperbaiki gambar yang hilang
export const fixMissingImages = async () => {
  try {
    // Get all portfolios from database
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, featured_image, category')
      .not('featured_image', 'is', null);
    
    if (error) {
      console.error('❌ [IMAGE SERVICE] Error fetching portfolios for fix:', error);
      return;
    }
    
    let fixedCount = 0;
    portfolios?.forEach(portfolio => {
      if (portfolio.featured_image && portfolio.featured_image.startsWith('portfolio-image-')) {
        const existsInLocal = localStorage.getItem(portfolio.featured_image);
        const existsInSession = sessionStorage.getItem(portfolio.featured_image);
        
        if (!existsInLocal && !existsInSession) {
          // Try to get from other tabs or use placeholder
          const placeholder = getPlaceholderImageByTitle(portfolio.title) || getPlaceholderImage(portfolio.category);
          
          // Save placeholder as the missing image temporarily
          localStorage.setItem(portfolio.featured_image, placeholder);
          sessionStorage.setItem(portfolio.featured_image, placeholder);
          
          fixedCount++;
        }
      }
    });
    
    return fixedCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error fixing missing images:', error);
    return 0;
  }
};

// Fungsi untuk membersihkan placeholder yang salah tersimpan
export const cleanupPlaceholderImages = () => {
  try {
    let cleanedCount = 0;
    
    // Clean localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        const value = localStorage.getItem(key);
        if (value && !value.startsWith('data:image/')) {
          localStorage.removeItem(key);
          cleanedCount++;
        }
      }
    }
    
    // Clean sessionStorage
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        const value = sessionStorage.getItem(key);
        if (value && !value.startsWith('data:image/')) {
          sessionStorage.removeItem(key);
          cleanedCount++;
        }
      }
    }
    
    return cleanedCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error cleaning up placeholder images:', error);
    return 0;
  }
};

// Fungsi untuk memaksa reload semua gambar dari database
export const forceReloadAllImages = async () => {
  try {
    // Get all portfolios from database
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, featured_image')
      .not('featured_image', 'is', null);
    
    if (error) {
      console.error('❌ [IMAGE SERVICE] Error fetching portfolios for reload:', error);
      return 0;
    }
    
    let reloadedCount = 0;
    portfolios?.forEach(portfolio => {
      if (portfolio.featured_image && portfolio.featured_image.startsWith('portfolio-image-')) {
        // Remove the image from storage to force fallback
        localStorage.removeItem(portfolio.featured_image);
        sessionStorage.removeItem(portfolio.featured_image);
        reloadedCount++;
      }
    });
    
    return reloadedCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error force reloading images:', error);
    return 0;
  }
};

// Fungsi untuk menyimpan ulang gambar yang ada di database ke storage
export const restoreImagesFromDatabase = async () => {
  try {
    // Get all portfolios from database
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, featured_image, category')
      .not('featured_image', 'is', null);
    
    if (error) {
      console.error('❌ [IMAGE SERVICE] Error fetching portfolios for restore:', error);
      return 0;
    }
    
    let restoredCount = 0;
    portfolios?.forEach(portfolio => {
      if (portfolio.featured_image && portfolio.featured_image.startsWith('portfolio-image-')) {
        // Check if image exists in storage
        const existsInLocal = localStorage.getItem(portfolio.featured_image);
        const existsInSession = sessionStorage.getItem(portfolio.featured_image);
        
        if (!existsInLocal && !existsInSession) {
          // Try to get from other tabs or use placeholder
          const placeholder = getPlaceholderImageByTitle(portfolio.title) || getPlaceholderImage(portfolio.category || 'default');
          
          // Save placeholder as the missing image temporarily
          try {
            localStorage.setItem(portfolio.featured_image, placeholder);
            sessionStorage.setItem(portfolio.featured_image, placeholder);
            restoredCount++;
          } catch (storageError) {
            console.error(`❌ [IMAGE SERVICE] Failed to restore image for: ${portfolio.title}`, storageError);
          }
        }
      }
    });
    
    return restoredCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error restoring images from database:', error);
    return 0;
  }
};

// Fungsi untuk memperbaiki gambar yang hanya tersimpan di sessionStorage
export const fixSessionStorageOnlyImages = () => {
  try {
    let fixedCount = 0;
    
    // Get all sessionStorage keys
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('portfolio-image-')) {
        const sessionData = sessionStorage.getItem(key);
        const localData = localStorage.getItem(key);
        
        // If image exists in sessionStorage but not in localStorage
        if (sessionData && !localData && sessionData.startsWith('data:image/')) {
          try {
            localStorage.setItem(key, sessionData);
            fixedCount++;
          } catch (error) {
            console.error(`❌ [IMAGE SERVICE] Failed to copy image to localStorage: ${key}`, error);
          }
        }
      }
    }
    
    return fixedCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error fixing sessionStorage-only images:', error);
    return 0;
  }
};

// Fungsi untuk memperbaiki gambar yang salah tersimpan (placeholder di storage)
export const fixCorruptedImages = async () => {
  try {
    // Get all portfolios from database
    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, featured_image, category')
      .not('featured_image', 'is', null);
    
    if (error) {
      console.error('❌ [IMAGE SERVICE] Error fetching portfolios for fix:', error);
      return 0;
    }
    
    let fixedCount = 0;
    portfolios?.forEach(portfolio => {
      if (portfolio.featured_image && portfolio.featured_image.startsWith('portfolio-image-')) {
        const localData = localStorage.getItem(portfolio.featured_image);
        const sessionData = sessionStorage.getItem(portfolio.featured_image);
        
        // Check if storage contains placeholder instead of base64
        const isLocalCorrupted = localData && !localData.startsWith('data:image/');
        const isSessionCorrupted = sessionData && !sessionData.startsWith('data:image/');
        
        if (isLocalCorrupted || isSessionCorrupted) {
          // Remove corrupted data
          if (isLocalCorrupted) {
            localStorage.removeItem(portfolio.featured_image);
          }
          if (isSessionCorrupted) {
            sessionStorage.removeItem(portfolio.featured_image);
          }
          
          fixedCount++;
        }
      }
    });
    
    return fixedCount;
    
  } catch (error) {
    console.error('❌ [IMAGE SERVICE] Error fixing corrupted images:', error);
    return 0;
  }
};

// Fungsi untuk mendapatkan placeholder image berdasarkan kategori
export const getPlaceholderImage = (category: string): string => {
  const categoryImages: Record<string, string> = {
    'Web Development': '/ecommerce.jpg',
    'Mobile Development': '/ecommerce.jpg',
    'E-Commerce': '/ecommerce.jpg',
    'Healthcare': '/Healthcare.webp',
    'Restaurant': '/Food-Beverage.webp',
    'Education': '/Education.jpg',
    'Finance': '/ecommerce.jpg',
    'default': '/placeholder.svg'
  };
  
  return categoryImages[category] || categoryImages.default;
};

// Fungsi untuk mendapatkan placeholder image berdasarkan nama portfolio
export const getPlaceholderImageByTitle = (title: string): string => {
  const titleImages: Record<string, string> = {
    'E-Commerce Website': '/ecommerce.jpg',
    'Apps Juara': '/ecommerce.jpg',
    'Restaurant Management System': '/Food-Beverage.webp',
    'HealtCare': '/Healthcare.webp',
    'Healthcare': '/Healthcare.webp',
    'Mobile Banking App': '/ecommerce.jpg',
    'Company Profile Website': '/ecommerce.jpg',
    'Task Management App': '/ecommerce.jpg',
    'Warehouse Management System': '/ecommerce.jpg',
    'warehouse-management-system': '/ecommerce.jpg',
    'Warehouse Management': '/ecommerce.jpg',
    'Management System': '/ecommerce.jpg',
    'System Management': '/ecommerce.jpg'
  };
  
  // Check exact match first
  if (titleImages[title]) {
    return titleImages[title];
  }
  
  // Check partial matches for better fallback
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('warehouse') || lowerTitle.includes('management')) {
    return '/ecommerce.jpg';
  }
  if (lowerTitle.includes('restaurant') || lowerTitle.includes('food')) {
    return '/Food-Beverage.webp';
  }
  if (lowerTitle.includes('health') || lowerTitle.includes('care')) {
    return '/Healthcare.webp';
  }
  if (lowerTitle.includes('education') || lowerTitle.includes('school')) {
    return '/Education.jpg';
  }
  if (lowerTitle.includes('banking') || lowerTitle.includes('finance')) {
    return '/ecommerce.jpg';
  }
  
  return '/placeholder.svg';
};

// Fungsi untuk mendapatkan gambar dengan fallback yang lebih robust
export const getPortfolioImageWithFallback = async (imageKey: string, category: string = 'default', title: string = ''): Promise<string> => {
  // Try to get from storage first
  const storedImage = await getPortfolioImage(imageKey);
  if (storedImage) {
    return storedImage;
  }
  
  // If not found in storage, return placeholder based on title first, then category
  if (title) {
    const placeholderByTitle = getPlaceholderImageByTitle(title);
    return placeholderByTitle;
  }
  
  const placeholderByCategory = getPlaceholderImage(category);
  return placeholderByCategory;
};
