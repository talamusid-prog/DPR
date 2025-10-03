import { Users, BookOpen, Lightbulb, Heart, Trophy } from "lucide-react";

const ProgramKomunitas = () => {
  const programs = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Pelatihan",
      description: "Peningkatan Skill & Kapasitas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Diskusi Budaya",
      description: "Pelestarian Warisan Lokal"
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Inovasi Pemuda",
      description: "Ide Kreatif & Teknologi"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Kegiatan Sosial",
      description: "Bakti Sosial & Gotong Royong"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Kompetisi & Event",
      description: "Lomba & Festival Daerah"
    }
  ];

  return (
    <section className="relative py-16">
             {/* Background Split */}
      <div className="absolute inset-0">
        <div className="h-1/2 gradient-primary"></div>
        <div className="h-1/2 bg-white"></div>
      </div>

      {/* Primary Circle Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Top Section - Primary Background */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Bergabunglah dalam Program & Kegiatan Komunitas
          </h2>
          <p className="text-white text-lg">
            Bersama Membangun Masa Depan yang Lebih Baik
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
                         {/* Left Panel - Community Info & CTA */}
             <div className="text-center">
                              {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="gradient-primary text-white w-20 h-20 rounded-full flex items-center justify-center">
                    <Users className="w-10 h-10" />
                  </div>
                </div>

               {/* Community Title */}
               <h3 className="text-3xl font-bold text-gray-700 mb-4">
                 Komunitas Pemuda NTB
               </h3>

               {/* Member Count */}
               <div className="mb-6">
                 <div className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                   1000+
                 </div>
                 <p className="text-gray-600">Anggota Aktif</p>
               </div>

               {/* CTA Button */}
               <button className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-8 rounded-full text-base hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300">
                 Bergabung Sekarang
               </button>
             </div>

                                      {/* Right Panel - Programs Grid */}
              <div className="space-y-3 lg:space-y-4 flex flex-col justify-center">
                                 {/* Top Row - 3 Cards */}
                 <div className="grid grid-cols-3 gap-2 lg:gap-4">
                   {programs.slice(0, 3).map((program, index) => (
                     <div key={index} className="bg-gray-50 rounded-xl px-4 py-2 lg:py-3 text-center border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                       <div className="flex justify-center mb-1">
                         <div className="text-primary">
                           {program.icon}
                         </div>
                       </div>
                       <h4 className="font-semibold text-gray-700 text-sm lg:text-base mb-0.5">
                         {program.title}
                       </h4>
                       <p className="text-gray-600 text-xs lg:text-sm">
                         {program.description}
                       </p>
                     </div>
                   ))}
                 </div>
                
                                 {/* Bottom Row - 2 Cards */}
                 <div className="grid grid-cols-2 gap-2 lg:gap-4">
                   {programs.slice(3, 5).map((program, index) => (
                     <div key={index + 3} className="bg-gray-50 rounded-xl px-4 py-2 lg:py-3 text-center border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                       <div className="flex justify-center mb-1">
                         <div className="text-primary">
                           {program.icon}
                         </div>
                       </div>
                       <h4 className="font-semibold text-gray-700 text-sm lg:text-base mb-0.5">
                         {program.title}
                       </h4>
                       <p className="text-gray-600 text-xs lg:text-sm">
                         {program.description}
                       </p>
                     </div>
                   ))}
                 </div>
              </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProgramKomunitas;
