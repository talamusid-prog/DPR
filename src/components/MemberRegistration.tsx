import { useState } from 'react';
import { Users, Send } from 'lucide-react';
import { registrationSchema, validateForm, sanitizeInput } from '@/lib/validation';

const MemberRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthdate: '',
    gender: '',
    education: '',
    occupation: '',
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Sanitasi input
    const sanitizedValue = sanitizeInput(value, 500);
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }));

    // Clear error untuk field yang sedang diedit
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      // Validasi form
      const validation = validateForm(registrationSchema, formData);
      
      if (!validation.success) {
        setErrors(validation.errors || {});
        return;
      }

      // Simulasi pengiriman data (ganti dengan API call yang sesungguhnya)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', validation.data);
      alert('Pendaftaran berhasil dikirim!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        birthdate: '',
        gender: '',
        education: '',
        occupation: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Terjadi kesalahan saat mengirim pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <Users className="w-4 h-4" />
          Pendaftaran Anggota
        </div>
        <h2 className="text-3xl font-bold text-secondary mb-4">
          Formulir Pendaftaran Relawan bAGUS
        </h2>
        <p className="text-muted-foreground">
          Silakan lengkapi formulir di bawah ini untuk mendaftar sebagai anggota Relawan baGUS
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="contoh@email.com"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Nomor Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="08xxxxxxxxxx"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Jenis Kelamin <span className="text-red-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Pilih Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="education" className="block text-sm font-medium text-gray-700">
              Pendidikan Terakhir
            </label>
            <select
              id="education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">Pilih Pendidikan Terakhir</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
              <option value="SMA/SMK">SMA/SMK</option>
              <option value="D3">D3</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
              <option value="S3">S3</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
              Pekerjaan
            </label>
            <input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Masukkan pekerjaan"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Alamat <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Masukkan alamat lengkap"
          ></textarea>
        </div>

        <div className="flex justify-center pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mengirim...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Kirim Pendaftaran
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberRegistration;