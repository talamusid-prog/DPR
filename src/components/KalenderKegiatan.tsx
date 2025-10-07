import { Calendar, MapPin, Clock, Users, ArrowRight, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const KalenderKegiatan = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample data kegiatan dengan lebih banyak data dummy
  const kegiatanData = [
    {
      id: 1,
      title: "Penyerahan Hadiah ",
      date: new Date(2024, 11, 15),
      time: "09:00 - 12:00",
      location: "Gedung DPR RI, Jakarta",
      type: "Rapat",
      description: "Rapat kerja komisi IX membahas kebijakan kesehatan dan ketenagakerjaan"
    },
    {
      id: 2,
      title: "Kunjungan Kerja ke Pasangkayu",
      date: new Date(2024, 11, 20),
      time: "08:00 - 17:00",
      location: "Kecamatan Pasangkayu, Sulawesi Barat",
      type: "Kunjungan",
      description: "Kunjungan kerja dan sosialisasi program pembangunan daerah"
    },
    {
      id: 3,
      title: "Sosialisasi Program Kesehatan",
      date: new Date(2024, 11, 25),
      time: "14:00 - 16:00",
      location: "Aula Kecamatan, Pasangkayu",
      type: "Sosialisasi",
      description: "Sosialisasi program kesehatan gratis untuk masyarakat"
    },
    {
      id: 4,
      title: "Rapat Koordinasi Fraksi NasDem",
      date: new Date(2024, 11, 28),
      time: "10:00 - 15:00",
      location: "Sekretariat Fraksi NasDem, Jakarta",
      type: "Rapat",
      description: "Koordinasi program dan kebijakan fraksi Partai NasDem"
    },
    {
      id: 5,
      title: "Hearing dengan Menteri Kesehatan",
      date: new Date(2024, 12, 5),
      time: "13:00 - 16:00",
      location: "Gedung DPR RI, Jakarta",
      type: "Hearing",
      description: "Hearing dengan Menteri Kesehatan terkait program kesehatan nasional"
    },
    {
      id: 6,
      title: "Konsultasi Masyarakat",
      date: new Date(2024, 11, 8),
      time: "10:00 - 12:00",
      location: "Kantor DPRD Sulawesi Barat",
      type: "Konsultasi",
      description: "Sesi konsultasi dengan masyarakat untuk mendengar aspirasi"
    },
    {
      id: 7,
      title: "Seminar Pendidikan",
      date: new Date(2024, 11, 12),
      time: "14:00 - 17:00",
      location: "Universitas Sulawesi Barat",
      type: "Seminar",
      description: "Seminar tentang peningkatan kualitas pendidikan daerah"
    },
    {
      id: 8,
      title: "Rapat Anggaran",
      date: new Date(2024, 11, 18),
      time: "09:00 - 16:00",
      location: "Gedung DPR RI, Jakarta",
      type: "Rapat",
      description: "Pembahasan anggaran kesehatan dan ketenagakerjaan 2025"
    },
    {
      id: 9,
      title: "Kunjungan Rumah Sakit",
      date: new Date(2024, 11, 22),
      time: "08:00 - 11:00",
      location: "RSUD Pasangkayu",
      type: "Kunjungan",
      description: "Monitoring fasilitas kesehatan dan keluhan pasien"
    },
    {
      id: 10,
      title: "Workshop UMKM",
      date: new Date(2024, 11, 30),
      time: "09:00 - 15:00",
      location: "Balai Pertemuan Pasangkayu",
      type: "Workshop",
      description: "Pelatihan peningkatan kapasitas UMKM lokal"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Rapat":
        return "bg-red-100 text-red-800 border-red-200";
      case "Kunjungan":
        return "bg-green-100 text-green-800 border-green-200";
      case "Sosialisasi":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "Hearing":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Konsultasi":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "Seminar":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "Workshop":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();
      const hasEvent = kegiatanData.some(kegiatan => 
        kegiatan.date.toDateString() === date.toDateString()
      );
      
      const dayEvents = kegiatanData.filter(kegiatan => 
        kegiatan.date.toDateString() === date.toDateString()
      );
      
      days.push({
        date: date.getDate(),
        fullDate: date,
        isCurrentMonth,
        isToday,
        hasEvent,
        events: dayEvents
      });
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric'
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const filteredKegiatan = kegiatanData.filter(kegiatan => 
    kegiatan.date.getMonth() === currentMonth.getMonth() && 
    kegiatan.date.getFullYear() === currentMonth.getFullYear()
  );

  return (
    <section id="kalender-kegiatan" className="py-16 bg-gradient-to-br from-background to-muted">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Calendar className="w-4 h-4" />
            Kalender Kegiatan
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="gradient-primary bg-clip-text text-transparent">Jadwal Kegiatan</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ikuti jadwal kegiatan dan agenda Bapak Dr. Dr. Ir. H. AGUS AMBO DJIWA, M.P.
, 
          </p>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Sebelumnya
            </Button>
            
            <h3 className="text-xl font-semibold text-gray-900">
              {formatMonthYear(currentMonth)}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="flex items-center gap-2"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {generateCalendarGrid().map((day, index) => (
              <div
                key={index}
                className={`
                  min-h-[60px] p-1 border border-gray-200 rounded cursor-pointer transition-all duration-200
                  ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                  ${day.isToday ? 'ring-2 ring-primary bg-primary/5' : ''}
                  ${day.hasEvent ? 'hover:shadow-md hover:border-primary/30' : 'hover:bg-gray-50'}
                `}
              >
                <div className={`
                  text-xs font-medium mb-1
                  ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  ${day.isToday ? 'text-primary font-bold' : ''}
                `}>
                  {day.date}
                </div>
                
                {day.events.length > 0 && (
                  <div className="space-y-0.5">
                    {day.events.slice(0, 1).map((event, eventIndex) => (
                      <div
                        key={eventIndex}
                        className={`
                          text-xs p-0.5 rounded truncate
                          ${getTypeColor(event.type)}
                        `}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    ))}
                    {day.events.length > 1 && (
                      <div className="text-xs text-gray-500 font-medium">
                        +{day.events.length - 1}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>


        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingin Mendapatkan Update Kegiatan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Daftar untuk mendapatkan notifikasi jadwal kegiatan terbaru
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-base px-6 py-3 rounded-[30px] flex items-center gap-2">
                <Users className="w-5 h-5" />
                Daftar Notifikasi
              </Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-base px-6 py-3 rounded-[30px] flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Lihat Semua Jadwal
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default KalenderKegiatan;
