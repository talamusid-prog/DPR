import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { Calendar, MapPin, GraduationCap, Award, Users, BookOpen } from "lucide-react";

const ProfilPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-9">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background to-muted py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                Profil
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-4">
                <span className="gradient-primary bg-clip-text text-transparent">
                  Dr. Ir. H. AGUS AMBO DJIWA, M.P.

                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Anggota DPR-RI Dapil Sulawesi Barat periode 2024-2029
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
                      alt="Dr. Dr. Ir. H. AGUS AMBO DJIWA, M.P.
, " 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Dr. Ir. H. AGUS AMBO DJIWA, M.P.

                  </h2>
                  <p className="text-primary font-medium mb-4">
                    Anggota DPR RI Dapil Sulawesi Barat
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Fraksi Partai Demokrasi Indonesia Perjuangan (PDI-P)
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
                      Dr. Ir. H. AGUS AMBO DJIWA, M.P.
 (lahir 17 Agustus 1966) adalah Bupati Pasangkayu petahana yang kembali menjabat pada tahun 2015 lalu. Sebelum menjabat sebagai Bupati, ia menjabat sebagai Wakil ketua DPRD Kabupaten Mamuju Utara (2005) dan menjadi Wakil Bupati Mamuju Utara pada periode 2005-2010 berpasangan dengan Abdullah Rasyid.
                    </p>
                    <p>
                      Pada Pilkada 2010, ia terpilih menjadi sebagai Bupati Mamuju Utara berpasangan dengan Muhammad Saal untuk periode 2010-2015. Selanjutnya, pada Pilkada 9 Desember 2015 Agus Ambo Djiwa kembali terpilih bersama Muhammad Saal untuk periode 2015-2020.
                    </p>
                    <p>
                      Pada pemilihan legislatif periode 2024-2029 Agus Ambo Djiwa terpilih sebagai dewan perwakilan rakyat republik indonesia (DPR RI) dapil Sulawesi Barat melalui partai demokrasi indonesia perjuangan (PDI-P).
                    </p>
                    <p>
                      Agus Ambo Djiwa merupakan salah satu Bupati berprestasi yang menerima berbagai penghargaan terkait kepemimpinannya.
                    </p>
                  </div>
                </div>

                {/* Pendidikan */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <GraduationCap className="w-6 h-6 text-primary" />
                    Riwayat Pendidikan
                  </h3>
                  
                  {/* Pendidikan Formal */}
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Pendidikan Formal</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Strata Dua (S2) - Magister Pertanian
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Program Studi Sistem-sistem Pertanian, Konsentrasi Perencanaan dan Kebijakan Pembangunan Pertanian
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Universitas Hasanuddin Makassar • 2006
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Strata Satu (S1) - Insinyur Pertanian
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Jurusan Sosial Ekonomi Pertanian, Fakultas Pertanian
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Universitas Muslim Indonesia-Ujung Pandang • 1995
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            SMA Negeri 4 Palu
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Sekolah Menengah Atas
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sulawesi Tengah • 1986
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            SMP Al-Haerat Palu
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Sekolah Menengah Pertama
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sulawesi Tengah • 1983
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            SD Negeri 2 Donggala
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Sekolah Dasar
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Sulawesi Tengah • 1980
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pendidikan Non Formal */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Pendidikan Non Formal</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Leadership Transformation in Indonesia
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Executive Education Program
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Harvard Kennedy School, Amerika Serikat • 2012
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Orientasi Kepemimpinan dan Penyelenggaraan Pemerintahan Daerah (OKPPD)
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Program Orientasi Kepemimpinan
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Indonesia • 2011
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Award className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900 mb-1">
                            Pendidikan LEMHANAS
                          </h5>
                          <p className="text-gray-600 mb-1">
                            Lembaga Ketahanan Nasional
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Indonesia • 2008
                          </p>
                        </div>
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
                          Anggota DPR RI Dapil Sulawesi Barat
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Fraksi Partai Demokrasi Indonesia Perjuangan (PDI-P)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Periode 2024 - 2029
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Bupati Pasangkayu
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Periode 2015 - 2020
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Berpasangan dengan Muhammad Saal
                        </p>
                        <p className="text-sm text-primary font-medium mt-2">
                          Terpilih kembali pada Pilkada 9 Desember 2015
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Bupati Mamuju Utara
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Periode 2010 - 2015
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Berpasangan dengan Muhammad Saal
                        </p>
                        <p className="text-sm text-primary font-medium mt-2">
                          Terpilih pada Pilkada 2010
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Wakil Bupati Mamuju Utara
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Periode 2005 - 2010
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Berpasangan dengan Abdullah Rasyid
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Wakil Ketua DPRD Kabupaten Mamuju Utara
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Tahun 2005
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Awal karir politik
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Karier dan Organisasi */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-primary" />
                    Karier dan Organisasi
                  </h3>
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Organisasi Ekonomi & Bisnis</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua HIPMI Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2004-2007</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua KADIN Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2005-2010</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Organisasi Pemuda & Sosial</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua KNPI Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2005-2010</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua BNN Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">-</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Organisasi Olahraga</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua PENCAB PSSI Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2006-2011</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Wakil Ketua PSSI Provinsi Sulawesi Barat</h5>
                              <p className="text-xs text-muted-foreground">2013-2017</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua KONI Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2006-2011, 2010-2015</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-gray-800 mb-3">Organisasi Politik & Pendidikan</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua DPC PDI-P Kabupaten Mamuju Utara</h5>
                              <p className="text-xs text-muted-foreground">2003-2006, 2007-2012</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua DPD PDI-P Provinsi Sulawesi Barat</h5>
                              <p className="text-xs text-muted-foreground">2012-Sekarang</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 text-sm">Ketua Yayasan STIT DDI Pasangkayu</h5>
                              <p className="text-xs text-muted-foreground">-</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Penghargaan */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-primary" />
                    Penghargaan
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Indonesian Must Important Development Award
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Penghargaan Pengembangan Terpenting Indonesia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2005
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Satyalancana Wira Karya dan Satyalancana Pembangunan
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Tanda Kehormatan dari Pemerintah
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2008
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Indonesian Leader Government Award
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Penghargaan Kepemimpinan Pemerintahan Indonesia
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2010
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Penghargaan Peningkatan Pembangunan Bidang Pertanian
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Oleh Menteri Pertanian RI
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2011
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Penghargaan Peningkatan Produksi Beras di atas 5%
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Oleh Presiden RI Dr. H. Susilo Bambang Yudhoyono
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2010 dan 2012
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-200">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Award className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          Manggala Karya Penyuluhan Keluarga Berencana
                        </h4>
                        <p className="text-gray-600 mb-1">
                          Penghargaan Bidang Keluarga Berencana
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Tahun 2013
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
