"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Data Gambar & Kegiatan (Menggunakan file yang Anda sebutkan)
const slides = [
  {
    id: 1,
    title: "Kegiatan WPP 1",
    description: "Dokumentasi kegiatan warga di area WPP 1.",
    image: "/images/wpp1.png", 
    link: "/kegiatan/wpp-1"
  },
  {
    id: 2,
    title: "Kunjungan Wil-House",
    description: "Kunjungan rutin dan pemeriksaan fasilitas.",
    image: "/images/wil-house.png",
    link: "/kegiatan/wil-house"
  },
  {
    id: 3,
    title: "Kegiatan WPP 2",
    description: "Gotong royong membersihkan lingkungan WPP 2.",
    image: "/images/wpp2.jpg",
    link: "/kegiatan/wpp-2"
  }
];

export default function RecentActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Logika Ganti Otomatis setiap 2 Detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // 2000ms = 2 detik

    return () => clearInterval(interval); // Bersihkan timer saat komponen unmount
  }, []);

  // Fungsi untuk klik dot manual
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
        // KITA UBAH:
    // pt-24 (6rem) -> Untuk Mobile. (6rem padding - 4rem margin negatif = 2rem jarak bersih)
    // md:pt-32 (8rem) -> Untuk Desktop. Biar desktop makin lega.
    <section className="w-full max-w-6xl mx-auto px-4 pb-8 pt-24 md:pt-32">
      
      {/* Judul Section */}
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 drop-shadow-sm">
          Aktivitas Terbaru
        </h2>
        <p className="text-gray-500 text-sm">
          Kegiatan dan momen berharga di lingkungan kita
        </p>
      </div>

      {/* --- 1. MAIN SLIDER (Carousel) --- */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
        
        {/* Link Pembungkus agar bisa diklik */}
        <Link href={slides[currentIndex].link} className="block w-full h-full relative">
          
          {/* Gambar Background */}
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            // Pastikan class transition ini ada agar animasi smooth
            className="object-cover transition-all duration-700 ease-in-out transform hover:scale-105"
            priority
          />
          
          {/* Overlay Gradient Hitam (Agar teks terbaca) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Teks di atas Slider */}
          <div className="absolute bottom-8 left-6 right-6 text-white">
            <h3 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
              {slides[currentIndex].title}
            </h3>
            <p className="text-sm md:text-base opacity-90 line-clamp-2 drop-shadow-sm">
              {slides[currentIndex].description}
            </p>
          </div>
        </Link>

        {/* Dots Navigation (Indikator Titik) */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                currentIndex === index 
                  ? "bg-green-500 w-8" // Indikator aktif lebih panjang
                  : "bg-white/50 w-2 hover:bg-white"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* --- 2. GRID KARTU KECIL DI BAWAHNYA --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {slides.map((item) => (
          <Link href={item.link} key={item.id} className="group">
            <div className="relative h-32 md:h-40 rounded-xl overflow-hidden shadow-md bg-black">
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
              />
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                <h4 className="text-white font-bold text-sm md:text-lg drop-shadow-md group-hover:scale-105 transition-transform">
                  {item.title}
                </h4>
              </div>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}