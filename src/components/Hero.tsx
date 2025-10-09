import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section id="home" className="pt-4 lg:pt-8 lg:mt-0 pb-56 sm:pb-48 lg:pb-24 min-h-[85vh] sm:min-h-[75vh] lg:min-h-auto gradient-primary relative overflow-hidden">
      {/* Grid lines background */}
      <div className="grid-background" />
      
      <div className="max-w-6xl mx-auto px-4 relative" style={{ zIndex: 1 }}>
        <div className="grid lg:grid-cols-3 gap-12 items-end">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-8 mt-8 sm:mt-12 lg:mt-20">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md border-2 border-white text-white text-xs sm:text-sm lg:text-base font-medium rounded-full shadow-lg">
                  Official Website
                </div>
                <h1 className="text-5xl sm:text-4xl lg:text-7xl font-bold text-white leading-none lg:leading-tight">
                  <span className="text-white">
                    Dr. Ir. H. AGUS AMBO DJIWA, M.P.

                  </span>
                  <br />
                  <span className="text-5xl sm:text-4xl lg:text-7xl font-bold text-white">
                    <span className="text-white">
                      
                    </span>
                  </span>
                </h1>
                <p className="text-lg lg:text-xl text-white/90 leading-relaxed">
                  Anggota DPR-RI periode 2024-2029
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start mb-32 lg:mb-0">
              <Link to="/aspirasi">
                <Button 
                  size="default" 
                  className="bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 hover:shadow-glow transition-all duration-300 text-base px-6 py-3 rounded-[30px] flex items-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Kirim Aspirasi
                </Button>
              </Link>
            </div>
          </div>

          {/* Empty div for grid spacing */}
          <div className="lg:col-span-1"></div>
        </div>
      </div>
      
      {/* Image positioned outside grid */}
      <div className="absolute -bottom-8 sm:-bottom-6 md:-bottom-4 lg:bottom-0 left-0 lg:left-[60vw] lg:transform lg:-translate-x-1/4 z-10">
        <img
          src="/jasa1.png"
          alt="Pemuda NTB Pasangkayu"
          className="w-full h-auto scale-60 sm:scale-65 md:scale-70 lg:scale-85 lg:w-auto lg:max-h-[65vh] xl:max-h-[70vh] lg:object-contain"
        />
      </div>
    </section>
  );
};

export default Hero;