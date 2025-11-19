"use client";

import Header from './components/Header';
import Hero from './components/Hero';
import RecentActivity from './components/RecentActivity'; 
import QuickLinkCard from './components/QuickLinkCard';
import ScheduleItem from './components/ScheduleItem';
import OfficerCard from './components/OfficerCard';
import { useAuth } from './context/authcontext';
import Link from 'next/link';

// ... (Bagian Data Tiruan / Mock Data TETAP SAMA, tidak perlu diubah) ...
// ... (Pastikan mockOfficers, mockSchedules, dll tetap ada di sini) ...

// --- DATA TIRUAN (Hanya copy bagian variable konstanta saja jika belum ada) ---
const mockOfficers = [
    { name: 'Bpk. H. Ahmad', position: 'Ketua RT 007', imageUrl: 'https://placehold.co/96x96/666/white?text=Ahmad' },
    { name: 'Bpk. Budi Santoso', position: 'Wakil Ketua RT', imageUrl: 'https://placehold.co/96x96/666/white?text=Budi' },
    { name: 'Ibu Siti Aminah', position: 'Sekretaris', imageUrl: 'https://placehold.co/96x96/666/white?text=Siti' },
    { name: 'Ibu Wati', position: 'Bendahara', imageUrl: 'https://placehold.co/96x96/666/white?text=Wati' },
];

const IconPlaceholder = ({ size = 24 }: { size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const mockSchedules = [
    { id: 's1', date: '25', day: 'JUL', title: 'Siskamling Warga Blok A', description: 'Blok A (Bpk. Ahmad, Bpk. Budi, dst)', icon: <IconPlaceholder /> },
    { id: 's2', date: '26', day: 'JUL', title: 'Siskamling Warga Blok B', description: 'Blok B (Bpk. Candra, Bpk. Dedi, dst)', icon: <IconPlaceholder /> },
];

const WalletIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>);
const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);


export default function HomePage() {
  const { user, loading } = useAuth();

  return (
    // Tambahkan 'pb-20' agar konten paling bawah tidak tertutup Navbar Mobile
    <div className="min-h-screen bg-gray-100 pb-20 md:pb-0">
      
      <Header />
      <Hero />

      <main className="relative z-10 max-w-6xl mx-auto p-4 md:p-6 space-y-8 -mt-16">

        {/* Bagian "Bayar Iuran" */}
        {user && !loading && (
          <Link href="/bayar-iuran" className="block w-full mb-6">
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

        {/* --- ID #recent-activity --- */}
        <div id="recent-activity" className="scroll-mt-24">
            <RecentActivity />
        </div>

        {/* --- ID #quick-menu --- */}
        <section id="quick-menu" className="mt-8 scroll-mt-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4 px-2 border-l-4 border-green-600">Menu Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        {/* --- ID #schedule --- */}
        <section id="schedule" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-600 px-2">Jadwal Kegiatan</h2>
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

        {/* --- ID #officers --- */}
        <section id="officers" className="scroll-mt-24">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-600 px-2">Pengurus RT 007</h2>
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

      <footer className="text-center p-6 mt-8 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} RT 007 Griya Mulya Asri. All rights reserved.</p>
      </footer>
    </div>
  );
}