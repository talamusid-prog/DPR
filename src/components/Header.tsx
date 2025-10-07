import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  onLogoClick?: () => void;
}

const Header = ({ onLogoClick }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Effect untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fungsi untuk navigasi ke halaman registrasi
  const handleRegisterClick = () => {
    navigate('/registration');
  };

  // Fungsi untuk menangani navigasi menu
  const handleMenuClick = (item: { href: string; isAnchor: boolean }) => {
    if (item.isAnchor) {
      // Untuk anchor links, scroll ke elemen dengan ID tersebut
      if (location.pathname === '/') {
        // Jika sudah di halaman utama, scroll ke anchor
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // Jika di halaman lain, navigasi ke home dengan anchor
        navigate(`/${item.href}`);
      }
    } else {
      // Untuk route links, gunakan navigate
      navigate(item.href);
    }
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", href: "/", isAnchor: false },
    { label: "Profil", href: "/profil", isAnchor: false },
    { label: "Kalender Kegiatan", href: "/kalender", isAnchor: false },
    { label: "Galeri", href: "/portfolio", isAnchor: false },
    { label: "Berita", href: "/blog", isAnchor: false },
    { label: "Kontak", href: "/contact", isAnchor: false },
  ];

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5' 
        : 'bg-gradient-to-br from-red-600 to-red-700'
    }`}>
              <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (onLogoClick) {
                onLogoClick();
              } else {
                navigate('/');
              }
            }}
          >
            <img 
              src="/logo.png" 
              alt="Ideadigiralcreative Logo" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <img 
              src="/logo2.png" 
              alt="Logo Kedua" 
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item)}
                className={`transition-smooth font-medium bg-transparent border-none cursor-pointer text-sm lg:text-base ${
                  isScrolled 
                    ? 'text-foreground hover:text-primary' 
                    : 'text-white hover:text-red-200'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Button 
              className={`transition-smooth ${
                isScrolled 
                  ? 'gradient-primary text-white hover:shadow-glow' 
                  : 'bg-white/20 text-white border border-white/30 hover:bg-white/30 hover:shadow-lg'
              }`}
              onClick={handleRegisterClick}
            >
              Daftar
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              className={`p-2 transition-colors ${
                isScrolled ? 'text-foreground' : 'text-white'
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item)}
                  className="text-white hover:text-red-200 transition-smooth font-medium bg-transparent border-none cursor-pointer text-left"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                className="gradient-primary text-white mt-2"
                onClick={() => {
                  handleRegisterClick();
                  setIsMenuOpen(false);
                }}
              >
                Daftar
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;