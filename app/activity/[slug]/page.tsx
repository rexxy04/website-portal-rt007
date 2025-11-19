import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '../../components/Header';
import { db } from '../../lib/firebase'; // Import DB
import { doc, getDoc } from 'firebase/firestore'; // Import fungsi single document

// Tipe Props untuk Next.js 15
type Props = {
  params: Promise<{ slug: string }>
}

export default async function ActivityDetailPage({ params }: Props) {
  // 1. Ambil slug dari URL
  const { slug } = await params;

  // 2. Fetch data SATU dokumen dari Firestore berdasarkan slug
  const docRef = doc(db, "activities", slug);
  const docSnap = await getDoc(docRef);

  // 3. Jika dokumen tidak ditemukan di database, tampilkan 404
  if (!docSnap.exists()) {
    return notFound();
  }

  // 4. Ambil datanya
  const activity = docSnap.data();

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />

      <main className="max-w-3xl mx-auto px-4 mt-6">
        
        {/* --- HERO SECTION --- */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-lg bg-gray-200">
          <Image
            src={activity.image || '/images/hero-bg.jpg'}
            alt={activity.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight drop-shadow-md">
              {activity.title}
            </h1>
          </div>
        </div>

        {/* --- INFO CARDS --- */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {/* Tanggal */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-600">
              📅
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Tanggal</p>
              <p className="text-sm font-bold text-gray-800">{activity.date}</p>
            </div>
          </div>

          {/* Lokasi */}
          <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 text-orange-600">
              📍
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Lokasi</p>
              <p className="text-sm font-bold text-gray-800">{activity.location || 'Lingkungan RT'}</p>
            </div>
          </div>
        </div>

        {/* --- KONTEN TEKS --- */}
        <div className="mt-8 space-y-6">
          {/* Cek apakah description ada dan berbentuk array */}
          {Array.isArray(activity.description) ? (
            activity.description.map((paragraph: string, index: number) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {index === 0 ? "Tentang Kegiatan" : "Detail Pelaksanaan"}
                </h2>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base text-justify">
                  {paragraph}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">{activity.description}</p>
          )}
        </div>

        {/* --- GALERI FOTO --- */}
        {activity.gallery && activity.gallery.length > 0 && (
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
        )}

      </main>
    </div>
  );
}