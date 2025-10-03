import React from 'react';
import MemberRegistration from '../components/MemberRegistration';
import { Helmet } from 'react-helmet-async';

const Registration = () => {
  return (
    <>
      <Helmet>
        <title>Pendaftaran Anggota IKKBG - Ikatan Keluarga Besar Gorontalo</title>
        <meta name="description" content="Formulir pendaftaran anggota Ikatan Keluarga Besar Gorontalo (IKKBG) Pasangkayu" />
      </Helmet>
      
      <div className="container mx-auto py-12 px-4">
        <MemberRegistration />
      </div>
    </>
  );
};

export default Registration;