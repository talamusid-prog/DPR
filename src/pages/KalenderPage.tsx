import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Kalender from '../components/Kalender';

const KalenderPage = () => {
  return (
    <>
      <Helmet>
        <title>Kalender Kegiatan - DPRD NTB</title>
        <meta name="description" content="Jadwal kegiatan dan agenda DPRD NTB" />
        <meta name="keywords" content="kalender, kegiatan, agenda, DPRD, NTB" />
      </Helmet>
      
      <div className="min-h-screen">
        <Header />
        
        <main>
          <Kalender />
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default KalenderPage;