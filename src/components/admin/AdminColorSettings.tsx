import { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/hooks/useTheme';

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

const predefinedThemes = {
  default: {
    name: 'Default (Merah)',
    colors: defaultTheme,
  },
  blue: {
    name: 'Biru Profesional',
    colors: {
      primary: '217 91% 60%', // Blue-500
      primaryDark: '217 91% 40%', // Blue-700
      accent: '197 71% 73%', // Sky-300
      accentDark: '197 71% 53%', // Sky-500
      success: '142 76% 36%', // Green-600
      successDark: '142 76% 26%', // Green-800
      warning: '38 92% 50%', // Amber-500
      gold: '45 93% 47%', // Yellow-500
      goldLight: '45 93% 67%', // Yellow-300
    },
  },
  green: {
    name: 'Hijau Alam',
    colors: {
      primary: '142 76% 36%', // Green-600
      primaryDark: '142 76% 26%', // Green-800
      accent: '84 81% 44%', // Lime-600
      accentDark: '84 81% 24%', // Lime-800
      success: '130 68% 42%', // Green-500
      successDark: '130 74% 32%', // Green-700
      warning: '38 92% 50%', // Amber-500
      gold: '45 93% 47%', // Yellow-500
      goldLight: '45 93% 67%', // Yellow-300
    },
  },
  purple: {
    name: 'Ungu Kreatif',
    colors: {
      primary: '262 83% 58%', // Purple-600
      primaryDark: '262 83% 38%', // Purple-800
      accent: '280 100% 70%', // Violet-400
      accentDark: '280 100% 50%', // Violet-600
      success: '142 76% 36%', // Green-600
      successDark: '142 76% 26%', // Green-800
      warning: '38 92% 50%', // Amber-500
      gold: '45 93% 47%', // Yellow-500
      goldLight: '45 93% 67%', // Yellow-300
    },
  },
};

const AdminColorSettings = () => {
  const { theme, isDarkMode, updateTheme, updateDarkMode, resetTheme } = useTheme();
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  // Apply theme changes immediately when preview mode is on
  useEffect(() => {
    if (previewMode) {
      // Theme is already applied globally by useTheme hook
      // This effect is just for preview mode
    }
  }, [previewMode]);

  const handleColorChange = (colorKey: keyof ColorTheme, value: string) => {
    const newTheme = {
      ...theme,
      [colorKey]: value
    };
    updateTheme(newTheme);
  };

  const handlePredefinedTheme = (themeKey: string) => {
    const predefinedTheme = predefinedThemes[themeKey as keyof typeof predefinedThemes];
    if (predefinedTheme) {
      updateTheme(predefinedTheme.colors);
    }
  };

  const saveTheme = () => {
    // Theme is already saved by useTheme hook
    setPreviewMode(false);
    toast({
      title: "Tema Disimpan",
      description: "Pengaturan warna telah disimpan dan diterapkan untuk seluruh aplikasi.",
    });
  };

  const handleResetTheme = () => {
    resetTheme();
    setPreviewMode(false);
    toast({
      title: "Tema Direset",
      description: "Tema telah dikembalikan ke pengaturan default.",
    });
  };

  // Convert HSL to hex for color picker
  const hslToHex = (hsl: string) => {
    try {
      const [h, s, l] = hsl.split(' ').map(v => parseFloat(v.replace('%', '')));
      const hNorm = h / 360;
      const sNorm = s / 100;
      const lNorm = l / 100;
      
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      let r, g, b;
      if (sNorm === 0) {
        r = g = b = lNorm;
      } else {
        const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
        const p = 2 * lNorm - q;
        r = hue2rgb(p, q, hNorm + 1/3);
        g = hue2rgb(p, q, hNorm);
        b = hue2rgb(p, q, hNorm - 1/3);
      }
      
      const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };
      
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    } catch {
      return '#dc2626';
    }
  };

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    try {
      const r = parseInt(hex.slice(1, 3), 16) / 255;
      const g = parseInt(hex.slice(3, 5), 16) / 255;
      const b = parseInt(hex.slice(5, 7), 16) / 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / max;
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }
      
      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    } catch {
      return '0 84% 60%';
    }
  };

  const ColorInput = ({ label, colorKey, value }: { label: string; colorKey: keyof ColorTheme; value: string }) => (
    <div className="space-y-2">
      <Label htmlFor={colorKey} className="text-sm font-medium">
        {label}
      </Label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          id={colorKey}
          value={hslToHex(value)}
          onChange={(e) => {
            const hslValue = hexToHsl(e.target.value);
            handleColorChange(colorKey, hslValue);
          }}
          className="w-12 h-12 rounded border border-gray-300 cursor-pointer"
        />
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => handleColorChange(colorKey, e.target.value)}
            placeholder="0 84% 60%"
            className="text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format HSL: hue saturation% lightness%
          </p>
        </div>
        <div 
          className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
          style={{ backgroundColor: `hsl(${value})` }}
          title="Preview warna"
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Tabs defaultValue="customize" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="customize">Kustomisasi</TabsTrigger>
          <TabsTrigger value="presets">Tema Siap Pakai</TabsTrigger>
        </TabsList>

        <TabsContent value="customize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Preview & Kontrol
              </CardTitle>
              <CardDescription>
                Aktifkan preview untuk melihat perubahan secara real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="preview-mode">Mode Preview</Label>
                  <p className="text-sm text-gray-500">
                    Tampilkan perubahan warna secara langsung
                  </p>
                </div>
                <Switch
                  id="preview-mode"
                  checked={previewMode}
                  onCheckedChange={setPreviewMode}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="dark-mode">Mode Gelap</Label>
                  <p className="text-sm text-gray-500">
                    Aktifkan tema gelap untuk aplikasi
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDarkMode}
                  onCheckedChange={updateDarkMode}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warna Utama</CardTitle>
              <CardDescription>
                Sesuaikan warna-warna utama yang digunakan di seluruh aplikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput label="Primary" colorKey="primary" value={theme.primary} />
              <ColorInput label="Primary Dark" colorKey="primaryDark" value={theme.primaryDark} />
              <ColorInput label="Accent" colorKey="accent" value={theme.accent} />
              <ColorInput label="Accent Dark" colorKey="accentDark" value={theme.accentDark} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Warna Status</CardTitle>
              <CardDescription>
                Warna untuk indikator status dan notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput label="Success" colorKey="success" value={theme.success} />
              <ColorInput label="Success Dark" colorKey="successDark" value={theme.successDark} />
              <ColorInput label="Warning" colorKey="warning" value={theme.warning} />
              <ColorInput label="Gold" colorKey="gold" value={theme.gold} />
              <ColorInput label="Gold Light" colorKey="goldLight" value={theme.goldLight} />
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleResetTheme}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveTheme}>
              <Save className="w-4 h-4 mr-2" />
              Simpan Tema
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="presets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tema Siap Pakai</CardTitle>
              <CardDescription>
                Pilih dari koleksi tema yang telah disiapkan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(predefinedThemes).map(([key, themeData]) => (
                  <Card key={key} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex space-x-1">
                          <div 
                            className="w-6 h-6 rounded" 
                            style={{ backgroundColor: `hsl(${themeData.colors.primary})` }}
                          />
                          <div 
                            className="w-6 h-6 rounded" 
                            style={{ backgroundColor: `hsl(${themeData.colors.accent})` }}
                          />
                          <div 
                            className="w-6 h-6 rounded" 
                            style={{ backgroundColor: `hsl(${themeData.colors.success})` }}
                          />
                        </div>
                        <h3 className="font-semibold">{themeData.name}</h3>
                        <Button 
                          size="sm" 
                          className="w-full"
                          onClick={() => handlePredefinedTheme(key)}
                        >
                          Pilih Tema
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminColorSettings;
