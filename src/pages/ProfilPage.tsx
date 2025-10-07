import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Calendar, MapPin, GraduationCap, Award, Users, BookOpen } from "lucide-react";

const ProfilPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                Profil
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                <span className="gradient-primary bg-clip-text text-transparent">
                  Haerul Hadi, S.Pd., M.H.
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Anggota DPR RI Komisi IX - Fraksi Partai NasDem
              </p>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Profile Image & Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-lg p-8 text-center sticky top-24">
                  <div className="w-48 h-48 mx-auto mb-8 rounded-full overflow-hidden border-4 border-primary/30 shadow-lg">
                    <img 
                      src="/profile.png" 
                      alt="Haerul Hadi, S.Pd., M.H." 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Haerul Hadi, S.Pd., M.H.
                  </h2>
                  <p className="text-primary font-medium mb-4">
                    Anggota DPR RI Komisi IX
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Fraksi Partai NasDem
                  </p>
                </div>
              </div>

              {/* Detailed Profile */}
              <div className="lg:col-span-2 space-y-8">
                {/* Biografi */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-primary" />
                    Biografi
                  </h3>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
                    <p>
                      Haerul Hadi dilahirkan di Jakarta pada 31 Mei 1978.
                    </p>
                    <p>
                      Haerul mendapatkan gelar Sarjana Pendidikan dari Fakultas Pendidikan Universitas Indonesia pada tahun 2001. Selanjutnya, pada tahun 2005 mendapatkan beasiswa Chevening Award dari Pemerintah Inggris untuk menempuh S2 di School of Development Studies di University Of East Anglia, di Norwich, Inggris, dan berhasil mendapatkan gelar Master of Arts pada tahun 2007.
                    </p>
                    <p>
                      Haerul merupakan satu dari 45 tokoh nasional yang mendeklarasikan berdirinya Ormas Nasional Demokrat yang diinisiasi oleh Bapak Surya Paloh, pada 1 Februari 2010, di Istora Senayan, Jakarta.
                    </p>
                    <p>
                      Aktivis Mahasiswa 1998 ini telah banyak dipercaya mengemban jabatan strategis baik di internal Partai NasDem maupun di keorganisasian lainnya.
                    </p>
                  </div>
                </div>

                {/* Pendidikan */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Riwayat Pendidikan
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Master of Arts (M.A.)
                        </h4>
                        <p className="text-gray-600 mb-1">
                          School of Development Studies, University of East Anglia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Norwich, Inggris • 2005 - 2007
                        </p>
                        <p className="text-sm text-primary font-medium mt-2">
                          Beasiswa Chevening Award dari Pemerintah Inggris
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Sarjana Pendidikan (S.Pd.)
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Fakultas Pendidikan, Universitas Indonesia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Jakarta, Indonesia • 1997 - 2001
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Karir Politik */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Karir Politik
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Anggota DPR RI Komisi IX
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Fraksi Partai NasDem
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Periode 2019 - 2024
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Pendiri Ormas Nasional Demokrat
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Salah satu dari 45 tokoh nasional pendiri
                        </p>
                        <p className="text-sm text-muted-foreground">
                          1 Februari 2010, Istora Senayan, Jakarta
                        </p>
                        <p className="text-sm text-primary font-medium mt-2">
                          Diinisiasi oleh Bapak Surya Paloh
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Aktivis Mahasiswa 1998
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Gerakan Reformasi Indonesia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Era Reformasi
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Kontak */}
                <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Hubungi Saya
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Untuk aspirasi, saran, atau pertanyaan terkait program pembangunan daerah
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a 
                      href="/aspirasi"
                      className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-base px-6 py-3 rounded-[30px] flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-5 h-5" />
                      Kirim Aspirasi
                    </a>
                    <a 
                      href="/kalender"
                      className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-base px-6 py-3 rounded-[30px] flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      Lihat Jadwal
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default ProfilPage;
