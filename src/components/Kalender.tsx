import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAllKegiatan, type Kegiatan } from '@/lib/kalenderService';

const Kalender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [kegiatan, setKegiatan] = useState<Kegiatan[]>([]);

  // Load kegiatan data
  useEffect(() => {
    loadKegiatan();
  }, []);

  const loadKegiatan = async () => {
    try {
      const data = await getAllKegiatan();
      setKegiatan(data);
    } catch (error) {
      console.error('Error loading kegiatan:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getKegiatanForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return kegiatan.filter(k => k.date === dateStr);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'sidang': return 'bg-blue-500';
      case 'rapat': return 'bg-green-500';
      case 'kunjungan': return 'bg-orange-500';
      case 'acara': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'terjadwal': return 'text-primary';
      case 'berlangsung': return 'text-yellow-600';
      case 'selesai': return 'text-green-600';
      case 'dibatalkan': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'terjadwal': return 'bg-primary/10 border-primary/20';
      case 'berlangsung': return 'bg-yellow-100 border-yellow-200';
      case 'selesai': return 'bg-green-100 border-green-200';
      case 'dibatalkan': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatTime = (time: string) => {
    return time;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const selectedDateKegiatan = selectedDate ? getKegiatanForDate(selectedDate) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kalender Kegiatan</h1>
        <p className="text-gray-600 mt-1">Jadwal kegiatan DPRD Sulawesi Barat</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {formatDate(currentDate)}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigateMonth('next')}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Ming', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2"></div>;
                  }
                  
                  const dayKegiatan = getKegiatanForDate(day);
                  const hasKegiatan = dayKegiatan.length > 0;
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(day)}
                      className={`
                        p-2 text-center text-sm rounded-lg transition-colors
                        ${isToday(day) ? 'bg-red-100 text-red-700 font-semibold' : ''}
                        ${isSelected(day) ? 'bg-blue-100 text-blue-700' : ''}
                        ${!isToday(day) && !isSelected(day) ? 'hover:bg-gray-100' : ''}
                      `}
                    >
                      <div className="flex flex-col items-center">
                        <span>{day.getDate()}</span>
                        {hasKegiatan && (
                          <div className="flex gap-1 mt-1">
                            {dayKegiatan.slice(0, 2).map((k, i) => (
                              <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${getTypeColor(k.type)}`}
                              />
                            ))}
                            {dayKegiatan.length > 2 && (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {selectedDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDateKegiatan.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateKegiatan.map(kegiatan => (
                      <div key={kegiatan.id} className="border rounded-lg p-3">
                        <div className="p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-gray-900 line-clamp-1">
                              {kegiatan.title}
                            </h3>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStatusColor(kegiatan.status)} ${getStatusBgColor(kegiatan.status)}`}
                            >
                              {kegiatan.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                            {kegiatan.description}
                          </p>
                          <div className="space-y-1 text-xs text-gray-500">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatTime(kegiatan.time)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              <span className="line-clamp-1">{kegiatan.location}</span>
                            </div>
                            {kegiatan.participants && kegiatan.participants.length > 0 && (
                              <div className="flex items-center gap-2">
                                <Users className="h-3 w-3" />
                                <span>{kegiatan.participants.length} peserta</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Tidak ada kegiatan pada tanggal ini
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kategori Kegiatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Sidang</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Rapat</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Kunjungan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Acara</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                  <span className="text-sm">Lainnya</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Kalender;
