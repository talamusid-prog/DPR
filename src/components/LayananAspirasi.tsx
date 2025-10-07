import { MessageSquare, Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LayananAspirasi = () => {
  const layananItems = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Layanan Aspirasi",
      description: "Menyediakan informasi tentang layanan serap aspirasi",
      link: "/aspirasi"
    },
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Kegiatan Terbaru",
      description: "Dapatkan informasi terkini tentang kebijakan dan program",
      link: "/kalender"
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Profil Bapak Dr. Ir. H. AGUS AMBO DJIWA, M.P., ",
      description: "Temukan informasi lengkap tentang profil dan visi misi",
      link: "/profil"
    }
  ];

  return (
    <section id="layanan-aspirasi" className="pt-4 sm:pt-8 pb-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Layanan Aspirasi</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Akses berbagai layanan dan informasi terkini untuk mendukung aspirasi masyarakat
          </p>
        </div>

        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
          {layananItems.map((item, index) => (
            <Link key={index} to={item.link}>
              <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-primary/30 hover:border-primary h-full relative overflow-hidden">
                {/* Decorative circle in corner */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 ease-out"></div>
                <div className="flex items-start gap-4 relative z-10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all duration-300">
                      <span>Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ada Pertanyaan atau Saran?
            </h3>
            <p className="text-muted-foreground mb-6">
              Tim kami siap membantu Anda dengan informasi dan layanan terbaik
            </p>
            <div className="flex flex-row gap-2 sm:gap-4 justify-center">
              <Link to="/aspirasi">
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 rounded-[30px] flex items-center gap-1 sm:gap-2">
                  <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Kirim Aspirasi</span>
                  <span className="xs:hidden">Aspirasi</span>
                </Button>
              </Link>
              <Link to="/kontak">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm px-4 py-2 sm:text-base sm:px-6 sm:py-3 rounded-[30px] flex items-center gap-1 sm:gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Hubungi Kami</span>
                  <span className="xs:hidden">Kontak</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LayananAspirasi;
