"use client";

import React, { useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { collection, addDoc, Timestamp, getDocs, query, where, writeBatch } from 'firebase/firestore';
import Link from 'next/link';

// DATA TARGET
const TARGET_USERS = [
  { email: 'satu@mail.com', pass: 'namex777', name: 'Warga Satu' },
  { email: 'dua@mail.com', pass: 'namex777', name: 'Warga Dua' },
  { email: 'tiga@mail.com', pass: 'namex777', name: 'Warga Tiga' },
  { email: 'empat@mail.com', pass: 'namex777', name: 'Warga Empat' },
  { email: 'lima@mail.com', pass: '@mail.com', name: 'Warga Lima' },
];

const STATUS_OPTIONS = ['Lunas', 'Pending', 'Belum Bayar'];
const METHOD_OPTIONS = ['Transfer BCA', 'GoPay', 'Tunai', 'Transfer Mandiri'];

export default function SeederPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const generateRandomPayment = () => {
    const randomStatus = STATUS_OPTIONS[Math.floor(Math.random() * STATUS_OPTIONS.length)];
    return {
      amount: 50000,
      status: randomStatus,
      method: randomStatus === 'Belum Bayar' ? '-' : METHOD_OPTIONS[Math.floor(Math.random() * METHOD_OPTIONS.length)],
    };
  };

  const handleSeeding = async () => {
    if (!confirm("PERINGATAN: Proses ini akan melogout akun Anda saat ini. Lanjutkan?")) return;
    
    setIsProcessing(true);
    setLogs([]);
    setProgress(0);

    try {
      // 1. Logout dulu biar bersih
      await signOut(auth);
      addLog("Memulai proses... Admin Logout.");

      for (let i = 0; i < TARGET_USERS.length; i++) {
        const target = TARGET_USERS[i];
        addLog(`--- Memproses User ${i + 1}: ${target.email} ---`);

        let userCredential;
        let uid;

        // 2. Coba Register atau Login
        try {
          addLog(`Mencoba mendaftarkan ${target.email}...`);
          userCredential = await createUserWithEmailAndPassword(auth, target.email, target.pass);
          addLog("User baru berhasil dibuat.");
        } catch (err: any) {
          if (err.code === 'auth/email-already-in-use') {
             addLog("Email sudah ada, mencoba login...");
             userCredential = await signInWithEmailAndPassword(auth, target.email, target.pass);
             addLog("Berhasil login ke akun eksisting.");
          } else {
            throw err;
          }
        }

        const user = userCredential.user;
        uid = user.uid;

        // Update Profile Name biar cantik di Admin Panel
        await updateProfile(user, { displayName: target.name });

        // 3. Hapus Data Pembayaran Lama (Opsional - Biar gak duplikat parah)
        // Note: Di real production hati-hati pakai delete batch client side
        const q = query(collection(db, "payments"), where("userId", "==", uid));
        const snapshot = await getDocs(q);
        const batch = writeBatch(db);
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        addLog(`Membersihkan ${snapshot.size} data lama...`);

        // 4. Generate 5 Bulan Terakhir
        for (let j = 0; j < 5; j++) {
          const d = new Date();
          d.setMonth(d.getMonth() - j);
          const monthName = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
          
          const randomData = generateRandomPayment();

          await addDoc(collection(db, "payments"), {
            userId: uid,
            userName: target.name,
            email: target.email,
            month: monthName,
            amount: randomData.amount,
            status: randomData.status,
            method: randomData.method,
            date: Timestamp.now() // Tanggal transaksi dibuat sekarang
          });
        }
        addLog(`Berhasil inject data 5 bulan untuk ${target.name}`);
        
        // Update Progress Bar
        setProgress(((i + 1) / TARGET_USERS.length) * 100);
        
        // Logout user ini untuk lanjut ke user berikutnya
        await signOut(auth);
      }

      addLog("✅ SEMUA SELESAI! Silakan login kembali sebagai Admin.");

    } catch (error: any) {
      console.error(error);
      addLog(`❌ ERROR FATAL: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-emerald-400">🛠️ DATABASE SEEDER TOOL</h1>
          <Link href="/login" className="text-sm text-gray-400 hover:text-white underline">
            Kembali ke Login
          </Link>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Target Operasi:</h2>
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-1">
            {TARGET_USERS.map((u, idx) => (
              <li key={idx}>
                <span className="text-emerald-300">{u.email}</span> 
                <span className="text-gray-500"> (Pass: {u.pass})</span>
              </li>
            ))}
          </ul>

          <div className="bg-yellow-900/30 border border-yellow-700/50 p-4 rounded-lg mb-6 text-yellow-200 text-sm">
            ⚠️ <strong>PERHATIAN:</strong> Script ini akan memaksa <strong>Logout</strong> akun admin Anda, 
            membuat akun-akun di atas, mengisi data pembayaran palsu, lalu logout kembali.
          </div>

          <button
            onClick={handleSeeding}
            disabled={isProcessing}
            className={`w-full py-4 rounded-lg font-bold text-lg transition
              ${isProcessing 
                ? 'bg-gray-600 cursor-wait' 
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/50'}
            `}
          >
            {isProcessing ? 'SEDANG MEMPROSES...' : 'MULAI SEEDING DATA 🚀'}
          </button>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="w-full bg-gray-700 rounded-full h-4 mb-6 overflow-hidden">
            <div 
              className="bg-emerald-500 h-4 transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Log Terminal */}
        <div className="bg-black rounded-xl p-4 h-64 overflow-y-auto border border-gray-700 font-mono text-sm shadow-inner">
          {logs.length === 0 ? (
            <span className="text-gray-600 italic">Menunggu perintah...</span>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="mb-1 border-b border-gray-800 pb-1 last:border-0">
                <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.includes('ERROR') ? 'text-red-400' : log.includes('---') ? 'text-yellow-400 font-bold' : 'text-emerald-300'}>
                  {log}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}