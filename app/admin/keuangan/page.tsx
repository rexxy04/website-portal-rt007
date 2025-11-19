"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import AdminHeader from '@/app/components/AdminHeader';
import { Search, Wallet, Calendar, CheckCircle, Eye, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AdminFinancePage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // FETCH SEMUA PEMBAYARAN
  useEffect(() => {
    const q = query(collection(db, "payments"), orderBy("date", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPayments(dataList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching payments:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filter Pencarian
  const filteredPayments = payments.filter(p => 
    p.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung Total Pemasukan
  const totalRevenue = payments
    .filter(p => p.status === 'Lunas')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat data keuangan...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Header Halaman */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wallet className="text-emerald-600" />
            Monitoring Keuangan Warga
          </h2>
          <p className="text-gray-500 text-sm mt-1">Pantau semua pembayaran iuran warga secara realtime.</p>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-emerald-100">
            <p className="text-sm text-gray-500 mb-1">Total Pemasukan (Lunas)</p>
            <h3 className="text-2xl font-bold text-emerald-600">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100">
            <p className="text-sm text-gray-500 mb-1">Total Transaksi</p>
            <h3 className="text-2xl font-bold text-blue-600">{payments.length}</h3>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-t-2xl border-b border-gray-100 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari nama warga atau bulan..." 
            className="flex-1 outline-none text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Tabel Data */}
        <div className="bg-white rounded-b-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Nama Warga</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Bulan Tagihan</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Jumlah</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Metode</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPayments.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition group">
                    
                    {/* Kolom Nama Warga (Link ke Detail) */}
                    <td className="px-6 py-4">
                      <Link href={`/admin/keuangan/${item.userId}`} className="flex items-center gap-3 group-hover:opacity-80">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                          {item.userName ? item.userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm group-hover:text-emerald-600 transition underline-offset-2 group-hover:underline">
                            {item.userName || 'Tanpa Nama'}
                          </p>
                          <p className="text-xs text-gray-400">{item.email}</p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {item.month}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 ml-6">
                         {item.date?.seconds ? new Date(item.date.seconds * 1000).toLocaleDateString('id-ID') : '-'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-700">
                      Rp {item.amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.method || 'Transfer'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold
                        ${item.status === 'Lunas' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}
                      `}>
                        {item.status === 'Lunas' && <CheckCircle size={12} />}
                        {item.status}
                      </span>
                    </td>
                    
                    {/* Tombol Aksi (Link ke Detail) */}
                    <td className="px-6 py-4 text-center">
                      <Link 
                        href={`/admin/keuangan/${item.userId}`} 
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition border border-blue-100"
                        title="Lihat Detail & Verifikasi"
                      >
                        <Eye size={16} />
                      </Link>
                    </td>
                  </tr>
                ))}
                
                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400 italic">
                      Tidak ada data pembayaran ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}