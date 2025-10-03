import React from 'react';
import MemberRegistration from '../components/MemberRegistration';
import { Helmet } from 'react-helmet-async';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";

const Registration = () => {
  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Pendaftaran Anggota IKKBG - Ikatan Keluarga Besar Gorontalo</title>
        <meta name="description" content="Formulir pendaftaran anggota Ikatan Keluarga Besar Gorontalo (IKKBG) Pasangkayu" />
      </Helmet>
      
      <Header />
      <main>
        <div className="container mx-auto py-12 px-4">
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