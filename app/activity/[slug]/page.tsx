import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '../../components/Header'; // Sesuaikan path import jika struktur folder berbeda

// --- DATA MOCK DETAIL (Path gambar disesuaikan) ---
const activitiesData: Record<string, any> = {
  'wpp-1': {
    title: "Kegiatan Seru Warga WPP 1",
    date: "15 November 2024",
    location: "Lapangan Kompleks WPP 1",
    // FIX: format .png
    image: "/images/wpp1.png", 
    description: [
      "Kegiatan kerja bakti rutin bulanan untuk menjaga kebersihan dan keindahan lingkungan perumahan. Seluruh warga berpartisipasi aktif dalam membersihkan area taman, jalan, dan fasilitas umum.",
      "Selain membersihkan lingkungan, kegiatan ini juga menjadi ajang silaturahmi antar warga yang jarang bertemu karena kesibukan masing-masing."
    ],
    // Gallery contoh (mix gambar)
    gallery: ["/images/wpp1.png", "/images/wil-house.png", "/images/wpp2.jpg"] 
  },
  'wil-house': {
    title: "Kunjungan Rutin Wil-House",
    date: "20 November 2024",
    location: "Gedung Wil-House",
    // FIX: format .png
    image: "/images/wil-house.png",
    description: [
      "Pemeriksaan rutin fasilitas umum dan keamanan di area Wil-House. Tim pengurus memastikan semua CCTV dan gerbang berfungsi dengan baik.",
      "Diskusi santai juga dilakukan untuk membahas rencana perbaikan pos keamanan bulan depan."
    ],
    gallery: ["/images/wil-house.png", "/images/wpp1.png"]
  },
  'wpp-2': {
    title: "Gotong Royong WPP 2",
    date: "10 Desember 2024",
    location: "Taman WPP 2",
    // FIX: format .jpg
    image: "/images/wpp2.jpg",
    description: [
      "Membersihkan saluran air untuk mencegah banjir saat musim hujan tiba. Bapak-bapak sangat antusias mengangkat sedimen lumpur.",
      "Ibu-ibu menyiapkan konsumsi berupa gorengan dan kopi hangat untuk menyemangati para warga yang bekerja bakti."
    ],
    gallery: ["/images/wpp2.jpg", "/images/wpp1.png", "/images/wil-house.png"]
  }
};

// --- KOMPONEN UTAMA ---
// Pastikan menggunakan 'export default' untuk menghindari error Runtime
export default async function ActivityDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const activity = activitiesData[slug];

  // Jika data tidak ditemukan, tampilkan 404 Not Found
  if (!activity) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 mt-6">
        
        {/* --- HERO SECTION --- */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg">
          <Image
            src={activity.image}
            alt={activity.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          
          {/* Judul di Kiri Bawah */}
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
              {activity.title}
            </h1>
          </div>
        </div>

        {/* --- INFO CARDS (Tanggal & Lokasi) --- */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Card Tanggal */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-600">
              {/* Icon Calendar */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tanggal</p>
              <p className="text-sm font-bold text-gray-800">{activity.date}</p>
            </div>
          </div>

          {/* Card Lokasi */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-600">
              {/* Icon Location */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lokasi</p>
              <p className="text-sm font-bold text-gray-800">{activity.location}</p>
            </div>
          </div>
        </div>

        {/* --- KONTEN TEKS --- */}
        <div className="mt-8 space-y-6">
          {activity.description.map((paragraph: string, index: number) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {index === 0 ? "Tentang Kegiatan" : "Detail Pelaksanaan"}
              </h2>
              <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                {paragraph}
              </p>
            </div>
          ))}
        </div>

        {/* --- GALERI FOTO --- */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Galeri Foto</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {activity.gallery.map((imgSrc: string, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 shadow-sm">
                <Image
                  src={imgSrc}
                  alt={`Dokumentasi ${idx + 1}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}