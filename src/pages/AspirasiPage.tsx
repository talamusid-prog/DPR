import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { MessageSquare, Send, ArrowLeft, User, Mail, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { createAspirasi } from "@/lib/aspirasiService";
import { showSuccess, showError, showWarning } from "@/lib/sweetAlert";

const AspirasiPage = () => {
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kategori: "",
    aspirasi: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim() || !formData.email.trim() || !formData.kategori.trim() || !formData.aspirasi.trim()) {
      showWarning("Semua field wajib diisi.");
      return;
    }

    try {
      const ok = await createAspirasi({
        nama: formData.nama.trim(),
        email: formData.email.trim(),
        kategori: formData.kategori.trim(),
        aspirasi: formData.aspirasi.trim(),
      });
      if (ok) {
        showSuccess("Aspirasi berhasil dikirim. Terima kasih!");
        setFormData({ nama: "", email: "", kategori: "", aspirasi: "" });
      } else {
        showError("Gagal mengirim aspirasi. Coba lagi nanti.");
      }
    } catch (err) {
      console.error(err);
      showError("Terjadi kesalahan saat mengirim aspirasi.");
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">

      {/* Form Section */}
      <div className="bg-gradient-to-br from-background to-muted">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-primary bg-clip-text text-transparent">Sampaikan Aspirasi Anda</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Suara Anda penting untuk kemajuan daerah. Mari bersama-sama membangun masa depan yang lebih baik.
            </p>
          </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informasi Pribadi
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                    placeholder="Masukkan email Anda"
                  />
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Tag className="w-5 h-5 text-primary" />
                Kategori Aspirasi
              </h3>
              
              <div>
                <label htmlFor="kategori" className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Kategori *
                </label>
                <select
                  id="kategori"
                  name="kategori"
                  value={formData.kategori}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                >
                  <option value="">Pilih kategori aspirasi</option>
                  <option value="pendidikan">Pendidikan</option>
                  <option value="kesehatan">Kesehatan</option>
                  <option value="infrastruktur">Infrastruktur</option>
                  <option value="ekonomi">Ekonomi & UMKM</option>
                  <option value="sosial">Sosial & Budaya</option>
                  <option value="lingkungan">Lingkungan</option>
                  <option value="pemuda">Pemuda & Olahraga</option>
                  <option value="perempuan">Perempuan & Anak</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>
            </div>

            {/* Aspiration Content */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Aspirasi Anda
              </h3>
              
              <div>
                <label htmlFor="aspirasi" className="block text-sm font-medium text-gray-700 mb-2">
                  Tuliskan Aspirasi Anda *
                </label>
                <textarea
                  id="aspirasi"
                  name="aspirasi"
                  value={formData.aspirasi}
                  onChange={handleInputChange}
                  required
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tuliskan aspirasi, saran, atau masukan Anda untuk kemajuan daerah. Jelaskan dengan detail dan berikan solusi yang konstruktif..."
                ></textarea>
                <p className="text-sm text-gray-500 mt-2">
                  Minimal 50 karakter. Jelaskan dengan detail dan berikan solusi yang konstruktif.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-base px-8 py-3 rounded-[30px] flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Kirim Aspirasi
              </Button>
              <Link to="/">
                <Button 
                  type="button"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-base px-8 py-3 rounded-[30px] flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-2">Informasi Penting</h4>
            <p className="text-sm text-blue-800">
              Aspirasi yang Anda kirim akan ditinjau dan dipertimbangkan untuk program pembangunan daerah. 
              Kami akan merespons aspirasi Anda berdasarkan kriteria yang telah ditetapkan.
            </p>
          </div>
        </div>
        </div>
      </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default AspirasiPage;
