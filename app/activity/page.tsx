import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header'; // Sesuaikan path jika perlu

// --- DATA KEGIATAN (Disesuaikan dengan nama file gambar Anda) ---
const activitiesList = [
  {
    slug: 'wpp-1',
    title: "Kegiatan Seru Warga WPP 1",
    date: "15 November 2024",
    // FIX: Menggunakan format .png sesuai request
    image: "/images/wpp1.png", 
    excerpt: "Kegiatan kerja bakti rutin bulanan untuk menjaga kebersihan dan keindahan lingkungan perumahan WPP 1."
  },
  {
    slug: 'wil-house',
    title: "Kunjungan Rutin Wil-House",
    date: "20 November 2024",
    // FIX: Menggunakan format .png sesuai request
    image: "/images/wil-house.png",
    excerpt: "Pemeriksaan rutin fasilitas umum dan keamanan di area Wil-House untuk memastikan kenyamanan warga."
  },
  {
    slug: 'wpp-2',
    title: "Gotong Royong WPP 2",
    date: "10 Desember 2024",
    // FIX: Menggunakan format .jpg sesuai request
    image: "/images/wpp2.jpg",
    excerpt: "Membersihkan saluran air untuk mencegah banjir saat musim hujan tiba di area WPP 2."
  }
];

export default function ActivitiesIndexPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 mt-6">
        
        {/* Judul Halaman */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">
            Arsip Kegiatan Warga
          </h1>
          <p className="text-gray-500">
            Kumpulan dokumentasi dan cerita dari lingkungan RT 007
          </p>
        </div>

        {/* Grid Daftar Kegiatan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activitiesList.map((item) => (
            <Link 
              href={`/activity/${item.slug}`} // Link ke folder [slug]
              key={item.slug} 
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              {/* Gambar Thumbnail */}
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Konten Kartu */}
              <div className="p-5">
                <p className="text-xs font-bold text-orange-500 mb-2 uppercase tracking-wider">
                  {item.date}
                </p>
                <h2 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {item.excerpt}
                </p>
                <div className="mt-4 text-green-600 text-sm font-medium flex items-center gap-1">
                  Baca Selengkapnya
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </main>
    </div>
  );
}