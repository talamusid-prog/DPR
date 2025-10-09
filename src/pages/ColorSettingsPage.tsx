import { Helmet } from 'react-helmet-async';
import ColorSettings from '@/components/ColorSettings';

const ColorSettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Pengaturan Warna - Dewan</title>
        <meta name="description" content="Kustomisasi warna dan tema aplikasi sesuai preferensi Anda" />
        <meta name="keywords" content="pengaturan warna, tema, kustomisasi, desain" />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <ColorSettings />
      </div>
    </>
  );
};

export default ColorSettingsPage;
