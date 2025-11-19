"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/app/lib/firebase';
import { useAuth } from '@/app/context/authcontext';
import Image from 'next/image'; 

interface FirebaseError extends Error {
  code?: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/'); 
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCredential.user;

      const docRef = doc(db, "users", loggedUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'admin') {
          router.push('/admin'); 
        } else {
          router.push('/'); 
        }
      } else {
        router.push('/');
      }

    } catch (err: unknown) { 
      const firebaseErr = err as FirebaseError;
      
      // Baris console.error DIHAPUS agar console bersih
      
      switch (firebaseErr.code) {
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Email atau password salah. Silakan coba lagi.');
          break;
        case 'auth/too-many-requests':
          setError('Terlalu banyak percobaan login gagal. Tunggu beberapa saat.');
          break;
        case 'auth/user-disabled':
          setError('Akun ini telah dinonaktifkan oleh admin.');
          break;
        default:
          setError('Gagal login. Periksa koneksi internet Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        
        <div className="bg-emerald-600 p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
             <span className="text-3xl">🏠</span> 
          </div>
          <h2 className="text-2xl font-bold text-white">Portal Warga</h2>
          <p className="text-emerald-100 text-sm">RT 007 / RW 005</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Alert Error UI (Akan tetap muncul untuk user) */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition shadow-lg
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'}
              `}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Belum punya akun? <span className="text-emerald-600 font-bold cursor-pointer hover:underline">Hubungi Ketua RT</span>
          </div>
        </div>
      </div>
    </div>
  );
}