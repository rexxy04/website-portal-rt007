"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Data Gambar & Kegiatan
const slides = [
  {
    id: 1,
    title: "Kegiatan WPP 1",
    description: "Dokumentasi kegiatan warga di area WPP 1.",
    // FIX: Format gambar .png sesuai request
    image: "/images/wpp1.png", 
    // FIX: Link diarahkan ke folder '/activity/' (bukan '/kegiatan/')
    link: "/activity/wpp-1"
  },
  {
    id: 2,
    title: "Kunjungan Wil-House",
    description: "Kunjungan rutin dan pemeriksaan fasilitas.",
    // FIX: Format gambar .png sesuai request
    image: "/images/wil-house.png",
    // FIX: Link diarahkan ke folder '/activity/'
    link: "/activity/wil-house"
  },
  {
    id: 3,
    title: "Kegiatan WPP 2",
    description: "Gotong royong membersihkan lingkungan WPP 2.",
    // FIX: Format gambar .jpg sesuai request
    image: "/images/wpp2.jpg",
    // FIX: Link diarahkan ke folder '/activity/'
    link: "/activity/wpp-2"
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
    }, 2000); 

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    // Padding disesuaikan agar tidak tertutup header mobile
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
        
        <Link href={slides[currentIndex].link} className="block w-full h-full relative">
          
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title}
            fill
            className="object-cover transition-all duration-700 ease-in-out transform hover:scale-105"
            priority
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          <div className="absolute bottom-8 left-6 right-6 text-white">
            <h3 className="text-xl md:text-3xl font-bold mb-2 drop-shadow-md">
              {slides[currentIndex].title}
            </h3>
            <p className="text-sm md:text-base opacity-90 line-clamp-2 drop-shadow-sm">
              {slides[currentIndex].description}
            </p>
          </div>
        </Link>

        {/* Dots Navigation */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ease-in-out ${
                currentIndex === index 
                  ? "bg-green-500 w-8" 
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