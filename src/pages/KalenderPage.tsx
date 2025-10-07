import Header from "@/components/Header";
import KalenderKegiatan from "@/components/KalenderKegiatan";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

const KalenderPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <KalenderKegiatan />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default KalenderPage;
