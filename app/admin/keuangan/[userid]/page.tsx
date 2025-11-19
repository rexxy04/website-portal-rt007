"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import AdminHeader from '@/app/components/AdminHeader';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { ArrowLeft, CheckCircle, XCircle, Clock, User, Calendar, CreditCard, AlertTriangle } from 'lucide-react';

export default function CitizenFinanceDetail() {
  const params = useParams();
  
  // --- LOGIC PENGAMBILAN ID YANG LEBIH KUAT ---
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Coba ambil dari params (userId / id / slug)
    let id = '';
    if (params?.userId) id = params.userId as string;
    else if (params?.id) id = params.id as string;
    
    // Fallback: Ambil paksa dari URL browser jika params gagal
    if (!id && typeof window !== 'undefined') {
      const segments = window.location.pathname.split('/');
      id = segments[segments.length - 1];
    }

    console.log("Detected User ID:", id); // Cek di Console Browser (F12)
    setUserId(id);
  }, [params]);
  // -------------------------------------------

  const [userData, setUserData] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate 5 nama bulan terakhir
  const last5Months = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  });
  const currentMonth = last5Months[0];

  // Fetch Data Realtime
  useEffect(() => {
    if (!userId) return; // Tunggu sampai userId terdeteksi

    setLoading(true);
    
    const q = query(collection(db, "payments"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataList = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as any));
      
      setPayments(dataList);

      if (dataList.length > 0) {
        setUserData({
          name: dataList[0].userName,
          email: dataList[0].email
        });
      } else {
        // Jika data kosong, set default tanpa error
        setUserData({ name: 'Belum Ada Data', email: '-' });
      }
      setLoading(false);
      setErrorMsg(''); // Reset error jika berhasil
    }, (err) => {
      console.error("Gagal ambil data:", err);
      setErrorMsg("Gagal mengambil data dari database.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // ACC PEMBAYARAN
  const handleMarkAsPaid = async (month: string) => {
    const result = await Swal.fire({
      title: 'Verifikasi Pembayaran?',
      text: `Tandai iuran bulan ${month} sebagai LUNAS?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, Verifikasi!',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    const existingPayment = payments.find((p: any) => p.month === month);

    try {
      if (existingPayment) {
        await updateDoc(doc(db, "payments", existingPayment.id), {
          status: 'Lunas',
          method: 'Tunai / Verifikasi Admin',
          date: Timestamp.now()
        });
      } else {
        await addDoc(collection(db, "payments"), {
          userId: userId,
          userName: userData?.name || "Warga",
          email: userData?.email || "-",
          month: month,
          amount: 50000,
          status: 'Lunas',
          method: 'Tunai / Verifikasi Admin',
          date: Timestamp.now()
        });
      }

      await Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        timer: 1500,
        showConfirmButton: false
      });

    } catch (error) {
      Swal.fire('Error', 'Gagal menyimpan data', 'error');
    }
  };

  // TAMPILAN LOADING / ERROR
  if (loading && !errorMsg) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-500">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-4"></div>
      <p>Memuat data ID: <span className="font-mono text-xs">{userId || '...'}</span></p>
    </div>
  );

  if (errorMsg) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-gray-600">
      <div className="bg-white p-8 rounded-xl shadow-sm text-center max-w-md border border-red-100">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="font-bold text-lg mb-2 text-red-600">Gagal Memuat Data</h3>
        <p className="text-sm text-gray-500 mb-6">{errorMsg}</p>
        <p className="text-xs text-gray-400 mb-6 font-mono bg-gray-100 p-2 rounded">Target ID: {userId}</p>
        <Link href="/admin/keuangan" className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-900 transition">
          Kembali ke Daftar
        </Link>
      </div>
    </div>
  );

  const currentMonthPayment = payments.find((p: any) => p.month === currentMonth);
  const isCurrentPaid = currentMonthPayment?.status === 'Lunas';

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
      <AdminHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6">
        <Link href="/admin/keuangan" className="inline-flex items-center text-gray-500 hover:text-emerald-600 mb-6 text-sm font-medium transition group">
          <ArrowLeft size={18} className="mr-1 group-hover:-translate-x-1 transition-transform" /> Kembali ke Daftar Keuangan
        </Link>

        {/* Profil Warga */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border-4 border-white shadow-sm">
              <User size={40} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{userData?.name || 'Memuat Nama...'}</h1>
              <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono select-all">{userData?.email || '-'}</span>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400 text-xs font-mono">ID: {userId.substring(0, 8)}...</span>
              </p>
            </div>
          </div>
          
          {/* Status Card */}
          <div className={`px-8 py-4 rounded-xl border flex flex-col items-center min-w-[220px] shadow-sm
            ${isCurrentPaid ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}
          `}>
            <span className="text-[10px] font-bold uppercase tracking-widest mb-2 text-gray-500">Tagihan {currentMonth}</span>
            {isCurrentPaid ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-xl animate-in zoom-in">
                <CheckCircle size={24} className="text-emerald-500" /> LUNAS
              </div>
            ) : (
              <div className="flex items-center gap-2 text-rose-600 font-bold text-xl animate-in zoom-in">
                <XCircle size={24} className="text-rose-500" /> BELUM BAYAR
              </div>
            )}
          </div>
        </div>

        {/* Tabel Riwayat */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">Riwayat Pembayaran</h3>
              <p className="text-xs text-gray-500 mt-1">Memantau status 5 bulan terakhir.</p>
            </div>
            <CreditCard className="text-gray-300" />
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Metode</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {last5Months.map((month) => {
                  const paymentData = payments.find((p: any) => p.month === month);
                  const status = paymentData ? paymentData.status : 'Belum Bayar';
                  const isLunas = status === 'Lunas';

                  return (
                    <tr key={month} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-5 font-medium text-gray-800 flex items-center gap-3">
                        <Calendar size={16} className="text-gray-400" />
                        {month}
                      </td>
                      <td className="px-6 py-5">
                        {isLunas ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle size={14} /> Lunas
                          </span>
                        ) : paymentData ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <Clock size={14} /> {status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            <XCircle size={14} /> Belum Bayar
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {paymentData?.method || '-'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        {!isLunas ? (
                          <button 
                            onClick={() => handleMarkAsPaid(month)}
                            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm shadow-emerald-200 hover:bg-emerald-700 hover:shadow-emerald-300 transition active:scale-95"
                          >
                            Verifikasi Lunas
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 italic flex justify-end items-center gap-1">
                            <CheckCircle size={12} /> Terverifikasi
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}