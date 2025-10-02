import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section id="home" className="pt-8 lg:pt-16 lg:mt-0 pb-60 lg:pb-32 bg-gradient-to-br from-background to-muted relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12 items-end">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-6xl font-bold text-secondary leading-none lg:leading-tight">
                <span className="gradient-primary bg-clip-text text-transparent">
                  Menjaga Warisan
                </span>
                <br />
                <span className="gradient-primary bg-clip-text text-transparent">
                  Membangun Masa Depan
                </span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
              Komunitas yang menghubungkan akar budaya dengan semangat inovasi, menjadikan pemuda sebagai motor perubahan.
              </p>
            </div>

            <div className="hidden lg:flex flex-col sm:flex-row gap-6 items-center mb-32 lg:mb-0">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-lg px-8 rounded-[30px]"
              >
                Gabung Sekarang
              </Button>
              
            </div>
          </div>

          {/* Empty div for grid spacing */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
      
      {/* Image positioned outside grid */}
      <div className="absolute -bottom-20 lg:bottom-0 left-0 lg:left-[60vw] lg:transform lg:-translate-x-1/6 z-10">
        <img
          src="/jasa1.png"
          alt="Jasa Website Development"
          className="w-full h-auto lg:w-auto lg:max-h-[65vh] lg:object-contain"
        />
      </div>

    </section>
  );
};

export default Hero;