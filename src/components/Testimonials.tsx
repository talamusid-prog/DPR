import { Users, MapPin, Award } from "lucide-react";
import { useMemo } from "react";

const AnggotaKomunitas = () => {
  const anggotaKomunitas = useMemo(() => [
    {
      name: "Ahmad Rizki Pratama",
      position: "Ketua Komunitas",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
      location: "Mataram, NTB",
      background: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      name: "Siti Nurhaliza",
      position: "Wakil Ketua",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
      location: "Lombok Tengah",
      background: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      name: "Muhammad Fajar",
      position: "Sekretaris",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
      location: "Lombok Utara",
      background: "bg-gradient-to-br from-green-500 to-green-600"
    },
    {
      name: "Dewi Sartika",
      position: "Bendahara",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
      location: "Lombok Timur",
      background: "bg-gradient-to-br from-orange-500 to-orange-600"
    },
    {
      name: "Budi Santoso",
      position: "Koordinator Program",
      image: "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?w=200&h=200&fit=crop&crop=face",
      location: "Lombok Selatan",
      background: "bg-gradient-to-br from-red-500 to-red-600"
    },
    {
      name: "Rina Wulandari",
      position: "Koordinator Media",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=face",
      location: "Sumbawa",
      background: "bg-gradient-to-br from-teal-500 to-teal-600"
    }
  ], []);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4" />
            Tim Pengurus
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary mb-4">
            Pengurus IKKBG Pasangkayu
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kenali tim pengurus yang berdedikasi dalam memajukan komunitas pemuda Nusa Tenggara Barat
          </p>
        </div>

        {/* Grid Pengurus */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {anggotaKomunitas.map((anggota, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 aspect-[3/4]"
            >
              {/* Background dengan gradient - Full Height */}
              <div className={`absolute inset-0 ${anggota.background}`}></div>
              
              {/* Content */}
              <div className="relative z-10 p-4 h-full flex flex-col justify-center items-center text-center">
                {/* Foto Profil */}
                <div className="relative mb-3">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/20 backdrop-blur-sm p-1">
                    <img
                      src={anggota.image}
                      alt={anggota.name}
                      className="w-full h-full rounded-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(anggota.name)}&size=200&background=ffffff&color=000000&rounded=true`;
                      }}
                    />
                  </div>
                  {/* Badge Status */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Award className="w-3 h-3 text-primary" />
                  </div>
                </div>
                
                {/* Nama */}
                <h3 className="text-white font-bold text-sm sm:text-base mb-1 leading-tight drop-shadow-sm">
                  {anggota.name}
                </h3>
                
                {/* Posisi */}
                <p className="text-white/90 text-xs sm:text-sm font-medium mb-2 leading-tight drop-shadow-sm">
                  {anggota.position}
                </p>
                
                {/* Lokasi */}
                <div className="flex items-center gap-1 text-white/80 text-xs drop-shadow-sm">
                  <MapPin className="w-3 h-3" />
                  <span>{anggota.location}</span>
                </div>
              </div>
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="text-center text-white">
                  <div className="w-8 h-8 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Users className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-medium">Lihat Profil</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 lg:gap-4 px-4 lg:px-8 py-2 lg:py-4 bg-primary/10 rounded-full">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold text-sm lg:text-base">
              1000+ Anggota Komunitas
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnggotaKomunitas;