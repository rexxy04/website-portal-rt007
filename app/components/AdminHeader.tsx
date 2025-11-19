"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/app/lib/firebase'; // Pastikan auth diexport dari firebase.ts
import { LayoutDashboard, ExternalLink, LogOut, Image as ImageIcon, Wallet } from 'lucide-react';

export default function AdminHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1. Proses Logout Firebase
      await signOut(auth);
      
      // 2. Redirect ke Halaman Utama (Public)
      router.push('/'); 
      
      // Opsional: Refresh halaman agar state bersih
      router.refresh();
      
    } catch (error) {
      console.error("Gagal logout:", error);
      alert("Terjadi kesalahan saat logout");
    }
  };

  return (
    <header className="bg-slate-900 text-white shadow-md mb-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">Panel Admin</h1>
              <p className="text-xs text-slate-400">Portal Desa Digital</p>
            </div>
          </div>
          
          {/* Menu Kanan */}
          <div className="flex items-center gap-6">
            
            {/* Link Kegiatan */}
            <Link 
              href="/admin/kegiatan" 
              className="text-slate-300 hover:text-emerald-400 font-medium text-sm flex items-center gap-2 transition"
            >
              <ImageIcon size={16} />
              <span className="hidden md:inline">Kegiatan</span>
            </Link>

            {/* Link Keuangan */}
            <Link 
              href="/admin/keuangan" 
              className="text-slate-300 hover:text-emerald-400 font-medium text-sm flex items-center gap-2 transition"
            >
              <Wallet size={16} />
              <span className="hidden md:inline">Keuangan</span>
            </Link>
            
            <div className="h-5 w-px bg-slate-700 mx-2 hidden md:block"></div>
            
            {/* Link ke Web Utama */}
            <Link 
              href="/" 
              target="_blank" 
              className="hidden md:flex items-center gap-2 text-slate-300 hover:text-white transition text-sm group"
            >
              <ExternalLink size={16} className="group-hover:-translate-y-0.5 transition-transform" />
              Lihat Website
            </Link>
            
            {/* Tombol Keluar (Sekarang Berfungsi) */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 px-3 py-2 rounded-lg transition text-sm"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}