import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Users } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    const phoneNumber = "6285242766676";
    const message = "Halo! Saya tertarik bergabung dengan Komunitas Pemuda NTB. Bisa info lebih lanjut?";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleEmailClick = () => {
    window.location.href = "mailto:info@komunitaspemudantb.org";
  };

  const handlePhoneClick = () => {
    window.location.href = "tel:+6285242766676";
  };

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Komunitas Pemuda NTB</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Wadah pemuda daerah yang berkarakter, berdaya saing, dan berkontribusi aktif dalam menjaga warisan budaya serta membangun masa depan yang lebih baik.
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
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-white/80 hover:text-primary transition-smooth">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#visi-misi" className="text-white/80 hover:text-primary transition-smooth">
                  Visi & Misi
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-white/80 hover:text-primary transition-smooth">
                  Galeri NTB
                </a>
              </li>
              <li>
                <a href="#program" className="text-white/80 hover:text-primary transition-smooth">
                  Program
                </a>
              </li>
              <li>
                <a href="#blog" className="text-white/80 hover:text-primary transition-smooth">
                  Artikel
                </a>
              </li>
            </ul>
          </div>

          {/* Program */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Program Kami</h3>
            <ul className="space-y-3">
              <li>
                <span className="text-white/80">Pelatihan & Workshop</span>
              </li>
              <li>
                <span className="text-white/80">Diskusi Budaya</span>
              </li>
              <li>
                <span className="text-white/80">Inovasi Pemuda</span>
              </li>
              <li>
                <span className="text-white/80">Kegiatan Sosial</span>
              </li>
              <li>
                <span className="text-white/80">Kompetisi & Event</span>
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
                  info@komunitaspemudantb.org
                </button>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span className="text-white/80">
                  Mataram, Nusa Tenggara Barat<br />
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
              &copy; {currentYear} Komunitas Pemuda NTB. All rights reserved.
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