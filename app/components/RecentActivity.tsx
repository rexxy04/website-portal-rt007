"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '../lib/firebase';
import { collection, getDocs, limit, query } from 'firebase/firestore';

export default function RecentActivity() {
  const [slides, setSlides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // FETCH DATA DARI FIRESTORE
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        // Ambil 3 kegiatan saja
        const q = query(collection(db, "activities"), limit(3));
        const querySnapshot = await getDocs(q);
        
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Pastikan link mengarah ke halaman detail dinamis
          link: `/activity/${doc.id}` 
        }));
        
        setSlides(data);
      } catch (error) {
        console.error("Error fetching recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  // Logika Ganti Otomatis
  useEffect(() => {
    if (slides.length === 0) return; // Jangan jalankan jika data kosong

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); 

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Tampilan Loading
  if (loading) {
    return (
      <section className="w-full max-w-6xl mx-auto px-4 pb-8 pt-24 md:pt-32">
         <div className="w-full h-64 md:h-96 bg-gray-200 rounded-2xl animate-pulse"></div>
      </section>
    );
  }

  // Jika tidak ada data
  if (slides.length === 0) return null;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 pb-8 pt-24 md:pt-32">
      
      <div className="text-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-green-700 drop-shadow-sm">
          Aktivitas Terbaru
        </h2>
        <p className="text-gray-500 text-sm">
          Kegiatan dan momen berharga di lingkungan kita
        </p>
      </div>

      {/* MAIN SLIDER */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl group bg-gray-200">
        <Link href={slides[currentIndex].link} className="block w-full h-full relative">
          <Image
            src={slides[currentIndex].image || '/images/hero-bg.jpg'}
            // --- PERBAIKAN 1 (Line 84) ---
            // Menambahkan "|| 'Kegiatan Warga'" sebagai cadangan jika title kosong/loading
            alt={slides[currentIndex].title || 'Kegiatan Warga'}
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
              {slides[currentIndex].excerpt || slides[currentIndex].description?.[0] || 'Klik untuk melihat detail'}
            </p>
          </div>
        </Link>

        {/* Dots */}
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

      {/* GRID KARTU KECIL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {slides.map((item) => (
          <Link href={item.link} key={item.id} className="group">
            <div className="relative h-32 md:h-40 rounded-xl overflow-hidden shadow-md bg-black">
              <Image 
                src={item.image || '/images/hero-bg.jpg'} 
                // --- PERBAIKAN 2 (Line 124) ---
                // Menambahkan fallback string juga di sini
                alt={item.title || 'Thumbnail Kegiatan'} 
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