import { MessageSquare, Calendar, Users, ArrowRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const UpdateAspirasi = () => {
  const aspirasiUpdates = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Aspirasi Pendidikan",
      description: "Pembangunan 5 Sekolah Baru di Pasangkayu",
      date: "15 Des 2024",
      status: "Dalam Proses"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Aspirasi Kesehatan",
      description: "Renovasi Puskesmas dan Penambahan Ambulans",
      date: "12 Des 2024",
      status: "Disetujui"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Aspirasi Infrastruktur",
      description: "Pembangunan Jembatan Penghubung Desa",
      date: "10 Des 2024",
      status: "Selesai"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Aspirasi UMKM",
      description: "Program Pelatihan dan Modal Usaha",
      date: "8 Des 2024",
      status: "Dalam Proses"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Aspirasi Lingkungan",
      description: "Program Penghijauan dan Pengelolaan Sampah",
      date: "5 Des 2024",
      status: "Disetujui"
    }
  ];

  return (
    <section className="relative py-16">
             {/* Background Split */}
      <div className="absolute inset-0">
        <div className="h-1/2 gradient-primary relative overflow-hidden">
          <img 
            src="/background2.png" 
            alt="Background Pattern" 
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="h-1/2 bg-white"></div>
      </div>


      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Top Section - Primary Background */}
        <div className="text-center mb-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Update Aspirasi Masyarakat
          </h2>
          <p className="text-white text-lg">
            Pantau Perkembangan Aspirasi yang Telah Diterima
          </p>
        </div>

        {/* Main Content Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
                         {/* Left Panel - Aspirasi Statistics & CTA */}
             <div className="text-center">
                              {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="gradient-primary text-white w-20 h-20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                </div>

               {/* Title */}
               <h3 className="text-3xl font-bold text-gray-700 mb-4">
                 Statistik Aspirasi
               </h3>

               {/* Statistics */}
               <div className="mb-6">
                 <div>
                   <div className="text-4xl lg:text-5xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                     150+
                   </div>
                   <p className="text-gray-600">Aspirasi Diterima</p>
                 </div>
               </div>

               {/* CTA Button */}
               <Link to="/aspirasi" className="inline-block w-full lg:w-auto">
                 <div className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-3 px-8 rounded-full text-base hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-center cursor-pointer">
                   Kirim Aspirasi
                 </div>
               </Link>
             </div>

                                      {/* Right Panel - Aspirasi Updates Grid */}
              <div className="space-y-3 lg:space-y-4 flex flex-col justify-center">
                                 {/* Top Row - 3 Cards */}
                 <div className="grid grid-cols-3 gap-1 lg:gap-2">
                   {aspirasiUpdates.slice(0, 3).map((update, index) => (
                     <div key={index} className="bg-gray-50 rounded-lg px-2 py-2 lg:py-2 text-center border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                       <div className="flex justify-center mb-1">
                         <div className="text-primary">
                           {update.icon}
                         </div>
                       </div>
                       <h4 className="font-semibold text-gray-700 text-xs lg:text-sm mb-1">
                         {update.title}
                       </h4>
                       <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                         {update.description}
                       </p>
                       <div className="flex flex-col gap-1 text-xs">
                         <span className="text-gray-500 flex items-center justify-center gap-1">
                           <Clock className="w-3 h-3" />
                           {update.date}
                         </span>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           update.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                           update.status === 'Dalam Proses' ? 'bg-red-100 text-red-800' :
                           'bg-yellow-100 text-yellow-800'
                         }`}>
                           {update.status}
                         </span>
                       </div>
                     </div>
                   ))}
                 </div>
                
                                 {/* Bottom Row - 2 Cards */}
                 <div className="grid grid-cols-2 gap-2 lg:gap-4">
                   {aspirasiUpdates.slice(3, 5).map((update, index) => (
                     <div key={index + 3} className="bg-gray-50 rounded-xl px-4 py-2 lg:py-3 text-center border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                       <div className="flex justify-center mb-1">
                         <div className="text-primary">
                           {update.icon}
                         </div>
                       </div>
                       <h4 className="font-semibold text-gray-700 text-sm lg:text-base mb-1">
                         {update.title}
                       </h4>
                       <p className="text-gray-600 text-xs lg:text-sm mb-2">
                         {update.description}
                       </p>
                       <div className="flex items-center justify-between text-xs">
                         <span className="text-gray-500 flex items-center gap-1">
                           <Clock className="w-3 h-3" />
                           {update.date}
                         </span>
                         <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                           update.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                           update.status === 'Dalam Proses' ? 'bg-red-100 text-red-800' :
                           'bg-yellow-100 text-yellow-800'
                         }`}>
                           {update.status}
                         </span>
                       </div>
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

export default UpdateAspirasi;
