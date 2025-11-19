"use client";

import { useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';
import AdminHeader from '../components/AdminHeader'; // <--- Header Khusus Admin
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (userProfile?.role !== 'admin') {
        alert("Maaf, Anda tidak memiliki akses admin.");
        router.push('/');
      }
    }
  }, [user, userProfile, loading, router]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-gray-500">Memeriksa akses...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header Admin */}
      <AdminHeader />
      
      <div className="max-w-6xl mx-auto px-4 py-8 mt-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-emerald-600 mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Panel Admin RT 007</h1>
          <p className="text-gray-600">Selamat datang, <span className="font-bold text-emerald-600">{userProfile?.nama || user?.email}</span>.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Menu 1: Kelola Kegiatan */}
          <Link href="/admin/kegiatan" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full border border-transparent hover:border-emerald-200">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600 font-bold text-xl group-hover:scale-110 transition-transform">
                📢
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-emerald-600 transition-colors">Kelola Kegiatan</h3>
              <p className="text-sm text-gray-500">Update berita & kegiatan desa.</p>
            </div>
          </Link>

          {/* Menu 2: Keuangan / Iuran (BARU) */}
          <Link href="/admin/keuangan" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full border border-transparent hover:border-emerald-500">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600 font-bold text-xl group-hover:scale-110 transition-transform">
                💰
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-emerald-600 transition-colors">Keuangan Warga</h3>
              <p className="text-sm text-gray-500">Cek iuran & status pembayaran.</p>
            </div>
          </Link>

          {/* Menu 3: Data Warga */}
          <Link href="/admin/warga" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full border border-transparent hover:border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600 font-bold text-xl group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">Data Warga</h3>
              <p className="text-sm text-gray-500">Database penduduk RT 007.</p>
            </div>
          </Link>

          {/* Menu 4: Laporan Masuk */}
          <Link href="/admin/laporan" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer h-full border border-transparent hover:border-red-200">
               <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600 font-bold text-xl group-hover:scale-110 transition-transform">
                🚨
              </div>
              <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-red-600 transition-colors">Laporan</h3>
              <p className="text-sm text-gray-500">Aduan & laporan darurat.</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}