import React from 'react';
import MemberRegistration from '../components/MemberRegistration.tsx';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingChat from '../components/FloatingChat';
import BackToTop from '../components/BackToTop';

const Registration: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Helmet>
        <title>Pendaftaran Anggota IKKBG Pasangkayu</title>
        <meta name="description" content="Formulir pendaftaran anggota IKKBG Pasangkayu. Daftar sekarang untuk mendapatkan KTA digital." />
      </Helmet>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Pendaftaran Anggota</h1>
            <p className="text-gray-600 mt-2">Isi formulir di bawah ini untuk mendaftar sebagai anggota IKKBG Pasangkayu</p>
          </div>
          
          <MemberRegistration />
        </div>
      </main>
      
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default Registration;