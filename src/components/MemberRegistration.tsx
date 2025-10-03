import React, { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const MemberRegistration: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Here you would typically send the data to your backend
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    } catch (error) {
      setSubmitError('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-2xl font-semibold text-green-700 mb-3">Pendaftaran Berhasil!</h2>
        <p className="text-green-600 mb-4">
          Terima kasih telah mendaftar sebagai anggota. Kami akan menghubungi Anda segera.
        </p>
        <button
          onClick={() => setSubmitSuccess(false)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Daftar Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {submitError && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nama lengkap Anda"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan alamat email Anda"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
            Nomor Telepon
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan nomor telepon Anda"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Alamat
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Masukkan alamat lengkap Anda"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          } transition duration-200`}
        >
          {isSubmitting ? 'Mengirim...' : 'Daftar Sekarang'}
        </button>
      </form>
    </div>
  );
};

export default MemberRegistration;