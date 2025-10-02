import { CreditCard, QrCode, Shield, Users } from "lucide-react";

const KTA = () => {

     return (
     <section className="py-16 bg-gray-50">
       <div className="max-w-6xl mx-auto px-4 -mt-16 lg:mt-0">
         <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
             <CreditCard className="w-4 h-4" />
             Kartu Tanda Anggota Digital
           </div>
           <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
             <span className="gradient-primary bg-clip-text text-transparent">KTA Digital</span>{" "}
             Komunitas Pemuda NTB
           </h2>
         </div>

         <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
           {/* Left Side - KTA Card */}
           <div className="order-2 lg:order-1">
             <div className="relative max-w-sm mx-auto">
               {/* Card Container */}
               <div className="gradient-primary rounded-2xl p-6 text-white shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                 {/* Card Header */}
                 <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                     <Users className="w-5 h-5" />
                     <span className="text-sm font-medium">KOMUNITAS PEMUDA</span>
                   </div>
                   <Shield className="w-6 h-6" />
                 </div>
                 
                 {/* Member Info */}
                 <div className="mb-4">
                   <h3 className="text-lg font-bold mb-1">AHMAD RIZKI PRATAMA</h3>
                   <p className="text-sm opacity-90">No. Anggota: KPD-2024-001</p>
                   <p className="text-sm opacity-90">Wilayah: Kota Magelang</p>
                 </div>
                 
                 {/* QR Code Area */}
                 <div className="flex items-center justify-between">
                   <div>
                     <p className="text-xs opacity-75">Berlaku hingga</p>
                     <p className="text-sm font-semibold">31 Des 2025</p>
                   </div>
                   <div className="bg-white p-2 rounded-lg">
                     <QrCode className="w-8 h-8 text-gray-800" />
                   </div>
                 </div>
               </div>
             </div>
           </div>
           
           {/* Right Side - Description */}
           <div className="order-1 lg:order-2">
             <h3 className="text-2xl font-bold text-gray-800 mb-6">
               Kartu Tanda Anggota Digital
             </h3>
             <div className="space-y-4 text-gray-600 leading-relaxed">
               <p>
                 Tanda pengenal elektronik yang dirancang khusus untuk anggota . 
                 Menggantikan format fisik konvensional, kartu ini memungkinkan anggota untuk dengan mudah 
                 mengakses identitas keanggotaan mereka melalui perangkat digital seperti ponsel.
               </p>
             </div>
           </div>
         </div>

         <div className="text-center mt-16">
           <div className="bg-white rounded-2xl p-8 shadow-lg border border-primary/20">
             <h3 className="text-xl font-bold text-gray-800 mb-6">
               Cara Mendapatkan KTA Digital
             </h3>
             <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-sm">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold">1</div>
                 <div className="text-left">
                   <p className="font-semibold text-gray-800">Daftar Anggota</p>
                   <p className="text-gray-600">Isi formulir pendaftaran</p>
                 </div>
               </div>
               <div className="hidden md:block text-gray-400 text-2xl">→</div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold">2</div>
                 <div className="text-left">
                   <p className="font-semibold text-gray-800">Verifikasi Data</p>
                   <p className="text-gray-600">Upload dokumen pendukung</p>
                 </div>
               </div>
               <div className="hidden md:block text-gray-400 text-2xl">→</div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center text-white font-bold">3</div>
                 <div className="text-left">
                   <p className="font-semibold text-gray-800">Terima KTA</p>
                   <p className="text-gray-600">Download kartu digital</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>
  );
};

export default KTA;
