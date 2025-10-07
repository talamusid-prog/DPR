import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Users } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = "6285242766676";
    const message = "Halo! Saya ingin menyampaikan aspirasi kepada Bapak Dr. Ir. H. AGUS AMBO DJIWA, M.P.,  Bisa info lebih lanjut?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:info@haerulhadi.com";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+6285242766676";
  };

  return (
    <footer 
      className="text-white"
              style={{
                background: 'linear-gradient(to bottom right, #800000, #4d0000)'
              }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" 
                alt="Dr. Ir. H. AGUS AMBO DJIWA, M.P.
 Logo" 
                className="w-20 h-20 object-contain brightness-0 invert"
              />
            </div>
            <p className="text-white/80 leading-relaxed">
              Anggota DPR-RI periode 2024-2029 yang berkomitmen melayani masyarakat dan menyerap aspirasi untuk kemajuan daerah.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="/aspirasi" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-primary transition-smooth">
                <Users className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-white/80 hover:text-primary transition-smooth">
                  Home
                </a>
              </li>
              <li>
                <a href="/profil" className="text-white/80 hover:text-primary transition-smooth">
                  Profil
                </a>
              </li>
              <li>
                <a href="/kalender" className="text-white/80 hover:text-primary transition-smooth">
                  Kalender Kegiatan
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-white/80 hover:text-primary transition-smooth">
                  Galeri
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white/80 hover:text-primary transition-smooth">
                  Berita
                </a>
              </li>
              <li>
                <a href="/contact" className="text-white/80 hover:text-primary transition-smooth">
                  Kontak
                </a>
              </li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program & Layanan</h3>
            <ul className="space-y-3">
              <li>
                <a href="/aspirasi" className="text-white/80 hover:text-primary transition-smooth">
                  Layanan Aspirasi
                </a>
              </li>
              <li>
                <a href="/kalender" className="text-white/80 hover:text-primary transition-smooth">
                  Kalender Kegiatan
                </a>
              </li>
              <li>
                <a href="/profil" className="text-white/80 hover:text-primary transition-smooth">
                  Profil & Visi Misi
                </a>
              </li>
              <li>
                <a href="/portfolio" className="text-white/80 hover:text-primary transition-smooth">
                  Dokumentasi Kegiatan
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white/80 hover:text-primary transition-smooth">
                  Berita & Informasi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <button 
                  onClick={handlePhoneClick}
                  className="text-white/80 hover:text-primary transition-colors"
                >
                  +62 852-4276-6676
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                        <button 
                          onClick={handleEmailClick}
                          className="text-white/80 hover:text-primary transition-colors"
                        >
                          info@haerulhadi.com
                        </button>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-white/80">
                  Jakarta, DKI Jakarta<br />
                  Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              &copy; {currentYear} Dr. Ir. H. AGUS AMBO DJIWA, M.P.
. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/60 hover:text-primary transition-smooth">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-smooth">
                Terms of Service
              </a>
              <a href="#" className="text-white/60 hover:text-primary transition-smooth">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;