"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Image from 'next/image';

// Ikon Copy
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

export default function PaymentPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [copied, setCopied] = useState('');

  // PROTEKSI HALAMAN: Redirect ke login jika belum login
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fungsi Copy ke Clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // DATA MOCK REKENING
  const bankAccounts = [
    { bank: 'BCA', number: '1234567890', name: 'Bpk. Bendahara RT' },
    { bank: 'Mandiri', number: '0987654321000', name: 'Bpk. Bendahara RT' },
    { bank: 'Dana / GoPay', number: '081234567890', name: 'RT 007 GMA' },
  ];

  // Pesan WA Otomatis
  const waMessage = `Halo Bendahara RT 007, saya ${user.email?.split('@')[0]} ingin konfirmasi pembayaran iuran bulanan sebesar Rp 50.000. Berikut bukti transfernya:`;
  const waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="max-w-2xl mx-auto px-4 mt-8">
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pembayaran Iuran</h1>

        {/* 1. KARTU TAGIHAN AKTIF */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-bl-xl">
            BELUM LUNAS
          </div>
          
          <p className="text-gray-500 text-sm mb-1">Tagihan Bulan Ini</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">November 2024</h2>
          
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl font-bold text-green-600">Rp 50.000</span>
            <span className="text-gray-400 text-sm mb-2">/ bulan</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl text-blue-800 text-sm flex gap-3 items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <p>
              Mohon lakukan pembayaran sebelum tanggal <strong>10 November</strong> untuk kelancaran operasional RT.
            </p>
          </div>
        </div>

        {/* 2. INFO REKENING TRANSFER */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏦</span> Transfer Manual
          </h3>
          
          <div className="space-y-4">
            {bankAccounts.map((acc) => (
              <div key={acc.bank} className="border border-gray-200 rounded-xl p-4 flex justify-between items-center hover:border-green-400 transition-colors">
                <div>
                  <p className="font-bold text-gray-800">{acc.bank}</p>
                  <p className="text-sm text-gray-500">{acc.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-lg text-gray-700">{acc.number}</p>
                  <button 
                    onClick={() => handleCopy(acc.number, acc.bank)}
                    className="text-xs text-green-600 font-bold flex items-center justify-end gap-1 hover:underline mt-1"
                  >
                    {copied === acc.bank ? 'Tersalin!' : (
                      <>
                        <CopyIcon /> Salin
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TOMBOL KONFIRMASI WA */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-3">Sudah melakukan transfer?</p>
          <a 
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Konfirmasi Pembayaran via WA
          </a>
        </div>

        {/* 4. RIWAYAT PEMBAYARAN (Mock) */}
        <div className="mt-10">
          <h3 className="font-bold text-gray-800 mb-4">Riwayat Pembayaran</h3>
          <div className="space-y-3">
            {[
              { month: 'Oktober 2024', status: 'Lunas', date: '05 Okt 2024' },
              { month: 'September 2024', status: 'Lunas', date: '02 Sep 2024' },
              { month: 'Agustus 2024', status: 'Lunas', date: '10 Agu 2024' },
            ].map((history, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                <div>
                  <p className="font-bold text-gray-700">{history.month}</p>
                  <p className="text-xs text-gray-400">{history.date}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-full">
                  {history.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}