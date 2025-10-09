import { useState, useEffect } from 'react';

interface ColorTheme {
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
  success: string;
  successDark: string;
  warning: string;
  gold: string;
  goldLight: string;
}

const defaultTheme: ColorTheme = {
  primary: '0 84% 60%', // #dc2626 - Red-600
  primaryDark: '0 100% 25%', // #800000 - Dark Maroon
  accent: '44 85% 56%', // #F1B62D
  accentDark: '44 92% 42%', // #CE8D0B
  success: '130 68% 42%', // #25D366
  successDark: '130 74% 32%', // #1B9447
  warning: '32 92% 49%', // #E86E0B
  gold: '44 72% 52%', // #B89124
  goldLight: '44 67% 58%', // #DDB650
};

export const useTheme = () => {
  const [theme, setTheme] = useState<ColorTheme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const loadTheme = () => {
      try {
        const savedTheme = localStorage.getItem('custom-theme');
        const savedDarkMode = localStorage.getItem('dark-mode');
        
        if (savedTheme) {
          const parsedTheme = JSON.parse(savedTheme);
          setTheme(parsedTheme);
        }
        
        if (savedDarkMode) {
          setIsDarkMode(savedDarkMode === 'true');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadTheme();
  }, []);

  // Apply theme to document when theme or dark mode changes
  useEffect(() => {
    if (!isLoaded) return;

    const applyTheme = () => {
      const root = document.documentElement;
      
      // Apply color variables
      root.style.setProperty('--primary', theme.primary);
      root.style.setProperty('--primary-dark', theme.primaryDark);
      root.style.setProperty('--accent', theme.accent);
      root.style.setProperty('--accent-dark', theme.accentDark);
      root.style.setProperty('--success', theme.success);
      root.style.setProperty('--success-dark', theme.successDark);
      root.style.setProperty('--warning', theme.warning);
      root.style.setProperty('--gold', theme.gold);
      root.style.setProperty('--gold-light', theme.goldLight);

      // Apply dark mode class
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();
  }, [theme, isDarkMode, isLoaded]);

  const updateTheme = (newTheme: ColorTheme) => {
    setTheme(newTheme);
    localStorage.setItem('custom-theme', JSON.stringify(newTheme));
  };

  const updateDarkMode = (darkMode: boolean) => {
    setIsDarkMode(darkMode);
    localStorage.setItem('dark-mode', darkMode.toString());
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    setIsDarkMode(false);
    localStorage.removeItem('custom-theme');
    localStorage.removeItem('dark-mode');
  };

  const exportTheme = () => {
    const themeData = {
      colors: theme,
      darkMode: isDarkMode,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importTheme = (themeData: { colors?: ColorTheme; darkMode?: boolean }) => {
    if (themeData.colors) {
      setTheme(themeData.colors);
      if (themeData.darkMode !== undefined) {
        setIsDarkMode(themeData.darkMode);
      }
      localStorage.setItem('custom-theme', JSON.stringify(themeData.colors));
      localStorage.setItem('dark-mode', themeData.darkMode.toString());
    }
  };

  return {
    theme,
    isDarkMode,
    isLoaded,
    updateTheme,
    updateDarkMode,
    resetTheme,
    exportTheme,
    importTheme,
  };
};
