import { Target, Users, Heart, Building, Lightbulb, Leaf } from "lucide-react";

const VisiMisi = () => {
  const misiItems = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Melestarikan Budaya & Kearifan Lokal",
      description: "Menghargai, merawat, dan mengembangkan nilai-nilai tradisi serta warisan daerah agar tetap relevan di era modern."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Meningkatkan Kualitas Pemuda",
      description: "Menyelenggarakan kegiatan pendidikan, pelatihan, dan pengembangan diri untuk memperkuat kapasitas pemuda dalam bidang akademik, sosial, teknologi, dan kewirausahaan."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Membangun Solidaritas & Kebersamaan",
      description: "Menciptakan ruang kolaborasi antar pemuda daerah untuk memperkuat persaudaraan, rasa memiliki, dan kerja sama yang positif."
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: "Berperan Aktif dalam Pembangunan Daerah",
      description: "Menjadi mitra strategis pemerintah dan masyarakat dalam program pembangunan sosial, ekonomi, dan lingkungan yang berkelanjutan."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Mendorong Inovasi & Kreativitas Pemuda",
      description: "Memberikan ruang bagi ide-ide baru, teknologi, dan karya kreatif pemuda agar dapat memberikan manfaat nyata bagi daerah."
    }
  ];

  return (
    <section id="visi-misi" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Target className="w-4 h-4" />
            Visi & Misi
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Visi Section */}
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              <span className="gradient-primary bg-clip-text text-transparent">Visi Kami</span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Menjadi wadah pemuda daerah yang berkarakter, berdaya saing, dan berkontribusi aktif dalam menjaga warisan budaya serta membangun masa depan yang lebih baik bagi masyarakat dan bangsa.
            </p>
          </div>

          {/* Misi Section */}
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold mb-6">
              <span className="gradient-primary bg-clip-text text-transparent">Misi Kami</span>
            </h3>
            
            <div className="space-y-1">
              {misiItems.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="gradient-primary text-white w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.icon}
                  </div>
                  
                  <h4 className="text-base font-semibold text-gray-900">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisiMisi;