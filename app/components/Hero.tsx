import Image from 'next/image';

export default function Hero() {
  return (
    // Kita set tinggi ke 80vh
    <div className="relative w-full h-80 md:h-[80vh] text-white overflow-hidden">
      
      {/* 1. Gambar Latar Belakang & Overlay (Tidak berubah) */}
      <Image
        src="/images/hero-bg.jpg" 
        alt="Latar belakang Perumahan Griya Mulya Asri"
        fill={true}
        className="object-cover z-0"
        priority
        onError={(e) => {
          const parent = e.currentTarget.parentElement;
          if (parent) {
            parent.style.backgroundColor = '#22543d';
          }
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

      {/* 3. Konten Teks */}
      <div className="relative z-20 flex flex-col justify-center items-center w-full h-full text-center p-4">
        
        <h1 className="text-3xl md:text-5xl font-bold">
          <span className="
            text-[#D3ECCD] 
            [-webkit-text-stroke:2px_#06923E]
            [-webkit-text-stroke-linejoin:round]
          ">
            Website Resmi
          </span>

          {/* Teks "Griya Mulya Asri" (Ini tidak berubah) */}
          <span className="block mt-1 text-green-700 font-black drop-shadow-lg">
            Griya Mulya Asri
          </span>
        </h1>
        
        {/* Sub-Teks (Ini tidak berubah) */}
        <p className="text-sm md:text-base mt-3 font-extrabold text-green-700 drop-shadow-lg">
          Kelurahan Pai, Kecamatan Biringkanaya <br />
          RT 007 / RW 008
        </p>
      </div>
    </div>
  );
}