import { Check } from "lucide-react";

const MengapaBergabung = () => {
  const reasons = [
    {
      text: "Bergabung dengan komunitas membantu ",
      highlight: "mengembangkan potensi diri"
    },
    {
      text: "Memiliki jaringan yang kuat untuk ",
      highlight: "masa depan yang lebih baik"
    },
    {
      text: "Belajar dari sesama pemuda yang ",
      highlight: "berprestasi dan berpengalaman"
    },
    {
      text: "Berkontribusi nyata dalam ",
      highlight: "pelestarian budaya daerah"
    },
    
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 -mt-16 lg:mt-0">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side - Text Content */}
          <div className="text-gray-800 order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 lg:mb-8">
              Inilah Mengapa Kamu Harus{" "}
              <span className="gradient-primary bg-clip-text text-transparent">Bergabung dengan Komunitas</span>{" "}
              Sekarang Juga
            </h2>
            
            <div className="space-y-3 lg:space-y-4">
              {reasons.map((reason, index) => (
                <div key={index} className="flex items-start gap-3 lg:gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
                  </div>
                  <p className="text-gray-600 text-sm lg:text-base leading-relaxed">
                    {reason.text}
                    <span className="text-primary font-semibold">
                      {reason.highlight}
                    </span>
                    {index === 0 && " dan soft skills yang dibutuhkan"}
                    {index === 1 && " dalam karir dan kehidupan"}
                    {index === 2 && " di berbagai bidang"}
                    {index === 3 && " dan pembangunan masyarakat"}
                    {index === 4 && " untuk meningkatkan kemampuan"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="order-1 lg:order-2 mb-4 lg:mb-0">
            <img
              src="/jasa2.png"
              alt="Komunitas Pemuda NTB"
              className="w-4/5 h-auto rounded-lg mx-auto"
            />
          </div>
         </div>
       </div>
     </section>
   );
 };

export default MengapaBergabung;
