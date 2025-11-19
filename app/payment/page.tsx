"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

// Ikon Copy
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

interface PaymentHistory {
  id: string;
  userId: string;
  userName: string;
  month: string;
  amount: number;
  status: 'Lunas' | 'Pending' | 'Gagal';
  date: any;
  method: string;
}

export default function PaymentPage() {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState('');
  
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [isCurrentMonthPaid, setIsCurrentMonthPaid] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  const currentMonthName = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }); // Contoh: November 2024

  // PROTEKSI HALAMAN
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // FETCH DATA REAL (Dari Firestore)
  useEffect(() => {
    if (user) {
      const fetchPayments = async () => {
        try {
          // Query: Ambil semua pembayaran milik user yang sedang login
          const q = query(collection(db, "payments"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          
          const fetchedData: PaymentHistory[] = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as PaymentHistory[];

          // Sort Descending (Terbaru diatas) berdasarkan timestamp
          fetchedData.sort((a, b) => b.date.seconds - a.date.seconds);
          setPaymentHistory(fetchedData);

          // Cek apakah User sudah membayar tagihan bulan ini dengan status 'Lunas'
          const paidThisMonth = fetchedData.some(
            p => p.month === currentMonthName && p.status === 'Lunas'
          );
          setIsCurrentMonthPaid(paidThisMonth);

        } catch (error) {
          console.error("Error fetching payments:", error);
        } finally {
          setDataLoading(false);
        }
      };
      fetchPayments();
    }
  }, [user, currentMonthName]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Data Rekening Transfer
  const bankAccounts = [
    { bank: 'BCA', number: '1234567890', name: 'Bpk. Bendahara RT' },
    { bank: 'Mandiri', number: '0987654321000', name: 'Bpk. Bendahara RT' },
    { bank: 'Dana / GoPay', number: '081234567890', name: 'RT 007 GMA' },
  ];

  // Link WhatsApp Otomatis
  const waMessage = `Halo Bendahara, saya ${userProfile?.nama || user.email} konfirmasi iuran bulan ${currentMonthName}.`;
  const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <Header />

      <main className="max-w-2xl mx-auto px-4 mt-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Pembayaran Iuran</h1>
        </div>

        {/* 1. KARTU TAGIHAN (Visualisasi Lunas/Belum) */}
        <div className={`bg-white rounded-2xl shadow-sm border p-6 mb-6 relative overflow-hidden transition-colors
          ${isCurrentMonthPaid ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-white'}
        `}>
          <div className={`absolute top-0 right-0 text-xs font-bold px-4 py-1.5 rounded-bl-xl
            ${isCurrentMonthPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}
          `}>
            {isCurrentMonthPaid ? 'SUDAH LUNAS' : 'BELUM LUNAS'}
          </div>
          
          <p className="text-gray-500 text-sm mb-1">Tagihan Bulan Ini</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4 capitalize">{currentMonthName}</h2>
          
          <div className="flex items-end gap-2 mb-6">
            <span className={`text-4xl font-bold ${isCurrentMonthPaid ? 'text-emerald-600' : 'text-gray-800'}`}>
              Rp 50.000
            </span>
            <span className="text-gray-400 text-sm mb-2">/ bulan</span>
          </div>

          {!isCurrentMonthPaid ? (
            <div className="bg-red-50 p-4 rounded-xl text-red-800 text-sm flex gap-3 items-start border border-red-100">
              <div className="mt-0.5">⚠️</div>
              <p>
                Anda belum membayar iuran bulan ini. Mohon segera lakukan pembayaran.
              </p>
            </div>
          ) : (
             <div className="bg-emerald-100 p-4 rounded-xl text-emerald-800 text-sm flex gap-3 items-start">
              <div className="mt-0.5">✅</div>
              <p>Terima kasih! Kewajiban Anda bulan ini sudah selesai.</p>
            </div>
          )}
        </div>

        {/* 2. INFO REKENING (Hanya muncul jika belum lunas) */}
        {!isCurrentMonthPaid && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🏦</span> Transfer Manual
            </h3>
            
            <div className="space-y-4">
              {bankAccounts.map((acc) => (
                <div key={acc.bank} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-emerald-400 transition-colors group">
                  <div>
                    <p className="font-bold text-gray-800">{acc.bank}</p>
                    <p className="text-sm text-gray-500">{acc.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-lg text-gray-700 group-hover:text-emerald-600 transition">{acc.number}</p>
                    <button onClick={() => handleCopy(acc.number, acc.bank)} className="text-xs text-emerald-600 font-bold flex items-center justify-end gap-1 hover:underline mt-1 w-full">
                      {copied === acc.bank ? 'Tersalin!' : <><CopyIcon /> Salin</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <a href={waLink} target="_blank" className="block w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 shadow-lg transition-all">
                Konfirmasi via WhatsApp
              </a>
            </div>
          </div>
        )}

        {/* 3. RIWAYAT PEMBAYARAN */}
        <div className="mt-10">
          <h3 className="font-bold text-gray-800 mb-4 text-lg">Riwayat Pembayaran</h3>
          
          {dataLoading ? (
            <div className="text-center py-8 text-gray-400">Memuat riwayat...</div>
          ) : paymentHistory.length > 0 ? (
            <div className="space-y-3">
              {paymentHistory.map((history) => (
                <div key={history.id} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition">
                  <div>
                    <p className="font-bold text-gray-700 capitalize">{history.month}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(history.date.seconds * 1000).toLocaleDateString('id-ID')} • {history.method}
                    </p>
                  </div>
                  <div className="text-right">
                    {/* Badge Status Dinamis */}
                     <span className={`px-3 py-1 text-xs font-bold rounded-full
                        ${history.status === 'Lunas' ? 'bg-emerald-100 text-emerald-600' : 
                          history.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 
                          'bg-red-100 text-red-600'}
                     `}>
                      {history.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-dashed border-gray-300 text-center text-gray-400">
              <p>Belum ada riwayat pembayaran.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}