"use client";

// Impor komponen-komponen baru kita
import Header from '../components/Header'; // Navbar baru kita
import Hero from '../components/Hero';     // Hero section baru kita

// Impor komponen-komponen lama yang masih kita pakai
import ActivityCard from '../components/ActivityCard';
import QuickLinkCard from '../components/QuickLinkCard';
import ScheduleItem from '../components/ScheduleItem';
import OfficerCard from '../components/OfficerCard';

import { useAuth } from '../context/authcontext';
import Link from 'next/link';

// ... (Semua 'mockData' dan 'Icon' Anda tetap sama di sini) ...
// --- DATA TIRUAN (MOCK DATA) ---
const mockActivities = [
  { id: '1', title: 'Kerja Bakti Bulanan - Persiapan 17an', date: '10 Juli 2024' },
  { id: '2', title: 'Rapat RT Bulanan (Online)', date: '5 Juli 2024' },
  { id: '3', title: 'Pengumpulan Dana Qurban Idul Adha', date: '1 Juli 2024' },
];
const mockOfficers = [
  { name: 'Bpk. H. Ahmad', position: 'Ketua RT 007', imageUrl: '/images/pak-rt.jpg' },
  { name: 'Bpk. Budi Santoso', position: 'Wakil Ketua RT', imageUrl: '/images/pak-wakil.jpg' },
  { name: 'Ibu Siti Aminah', position: 'Sekretaris', imageUrl: '/images/bu-sekretaris.jpg' },
  { name: 'Ibu Wati', position: 'Bendahara', imageUrl: '/images/bu-bendahara.jpg' },
];
// ... (IconPlaceholder, WalletIcon, UsersIcon, mockSchedules, dll.) ...
const IconPlaceholder = ({ size = 24 }: { size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);
const mockSchedules = [
  { 
    id: 's1', 
    date: '25', 
    day: 'JUL', 
    title: 'Siskamling Warga Blok A', 
    description: 'Blok A (Bpk. Ahmad, Bpk. Budi, dst)', 
    icon: <IconPlaceholder /> 
  },
  { 
    id: 's2', 
    date: '26', 
    day: 'JUL', 
    title: 'Siskamling Warga Blok B', 
    description: 'Blok B (Bpk. Candra, Bpk. Dedi, dst)', 
    icon: <IconPlaceholder /> 
  },
];
const WalletIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
  </svg>
);
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

// --- KOMPONEN UTAMA HOMEPAGE ---
export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      
      {/* 1. Header (Navbar baru kita) */}
      <Header />

      {/* 2. Hero Section (Gambar Latar baru kita) */}
      <Hero />

      {/* 3. Konten Utama */}
      {/* PERHATIKAN INI:
        -mt-16: Margin atas negatif untuk menarik konten ke atas
                agar tumpang tindih (overlap) dengan Hero section.
        relative z-10: Agar konten ini ada di atas Hero.
      */}
      <main className="relative z-10 max-w-4xl mx-auto p-4 md:p-6 space-y-8 -mt-16">

        {/* Bagian "Bayar Iuran" (Tidak berubah) */}
        {user && !loading && (
          <Link href="/bayar-iuran" className="block w-full">
            <div className="flex items-center justify-between p-4 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700 transition-colors">
              <div>
                <h2 className="font-bold text-lg">Pembayaran Iuran</h2>
                <p className="text-sm opacity-90">Cek status dan bayar iuran bulanan Anda.</p>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </Link>
        )}

        {/* 3. Bagian Aktivitas Terbaru (Tidak berubah) */}
        <section>
          <ActivityCard activities={mockActivities} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <QuickLinkCard 
              title="Bayar Iuran"
              description="Akses fitur iuran warga"
              href={user ? "/bayar-iuran" : "/login"}
              icon={<WalletIcon />}
            />
            <QuickLinkCard 
              title="Data Warga"
              description="Lihat direktori warga"
              href="/data-warga"
              icon={<UsersIcon />}
            />
            <QuickLinkCard 
              title="Lapor Darurat"
              description="Hubungi petugas RT"
              href="/lapor-darurat"
              icon={<IconPlaceholder />}
            />
          </div>
        </section>

        {/* 4. Bagian Jadwal Kegiatan (Tidak berubah) */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Jadwal Kegiatan</h2>
          <ul className="space-y-3">
            {mockSchedules.map(item => (
              <ScheduleItem 
                key={item.id}
                date={item.date}
                day={item.day}
                title={item.title}
                description={item.description}
                icon={item.icon}
              />
            ))}
          </ul>
        </section>

        {/* 5. Bagian Pengurus RT (Tidak berubah) */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Pengurus RT 007</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockOfficers.map(officer => (
              <OfficerCard 
                key={officer.name}
                name={officer.name}
                position={officer.position}
                imageUrl={officer.imageUrl}
              />
            ))}
          </div>
        </section>

      </main>

      {/* Footer Sederhana (Tidak berubah) */}
      <footer className="text-center p-6 mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} RT 007 Griya Mulya Asri. All rights reserved.</p>
      </footer>
    </div>
  );
}