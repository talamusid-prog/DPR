import { useState } from "react";
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

  // Fungsi untuk membuka WhatsApp dengan format nomor yang benar
  const handleWhatsAppClick = () => {
    const phoneNumber = "6285242766676"; // Format nomor WhatsApp dengan kode negara +62
    const message = "Halo! Saya ingin berkonsultasi tentang pembuatan website. Apakah ada yang bisa dibantu?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
    { label: "Tentang Kami", href: "#pricing", isAnchor: true },
    { label: "Galeri", href: "/portfolio", isAnchor: false },
    { label: "Berita", href: "/blog", isAnchor: false },
    { label: "Kontak", href: "/contact", isAnchor: false },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5">
              <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
          >
            <img 
              src="/logo.png" 
              alt="Ideadigiralcreative Logo" 
              className="w-20 h-20 md:w-28 md:h-28 object-contain"
            />
            
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleMenuClick(item)}
                className="text-foreground hover:text-primary transition-smooth font-medium bg-transparent border-none cursor-pointer text-sm lg:text-base"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Button 
              className="gradient-primary text-white hover:shadow-glow transition-smooth"
              onClick={handleWhatsAppClick}
            >
              Gabung Sekarang
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleMenuClick(item)}
                  className="text-foreground hover:text-primary transition-smooth font-medium bg-transparent border-none cursor-pointer text-left"
                >
                  {item.label}
                </button>
              ))}
              <Button 
                className="gradient-primary text-white mt-2"
                onClick={() => {
                  handleWhatsAppClick();
                  setIsMenuOpen(false);
                }}
              >
                Konsultasi Gratis
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;