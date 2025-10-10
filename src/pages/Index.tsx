import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArtikelTerbaru from "@/components/ArtikelTerbaru";
import LayananAspirasi from "@/components/LayananAspirasi";
import Blog from "@/components/Blog";
// Gallery component removed - using Blog component instead
import Process from "@/components/Process";
import PricingHero from "@/components/PricingHero";
import WhyWebsite from "@/components/WhyWebsite";
import WebsiteTypes from "@/components/WebsiteTypes";
import AnggotaKomunitas from "@/components/Testimonials";
import Footer from "@/components/Footer";
import FloatingChat from "@/components/FloatingChat";
import BackToTop from "@/components/BackToTop";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ArtikelTerbaru />
        <LayananAspirasi />
        <Process />
        <PricingHero />
        <WhyWebsite />
        <WebsiteTypes />
        {/* Gallery component removed */}
        <Blog />
        <AnggotaKomunitas />
      </main>
      <Footer />
      <FloatingChat />
      <BackToTop />
    </div>
  );
};

export default Index;
