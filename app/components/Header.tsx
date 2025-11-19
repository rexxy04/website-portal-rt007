"use client";

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { useAuth } from '../context/authcontext';
import { auth } from '../lib/firebase';

export default function Header() {
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    // Navbar kita buat 'sticky' (menempel di atas) dan 'z-50' (di atas segalanya)
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      
      {/* INI YANG DIUBAH: max-w-6xl */}
      <div className="max-w-6xl mx-auto px-4 py-3">
        
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-green-700">
            GMA
          </Link>

          {/* Navigasi - (Mobile: Hamburger, Desktop: Tombol) */}
          <div className="flex items-center gap-4">
            
            {/* Navigasi Desktop (Login/Logout) */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
              ) : user ? (
                <>
                  <span className="text-sm">Halo, {user.email?.split('@')[0]}</span>
                  <button 
                    onClick={handleLogout} 
                    className="px-3 py-1 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-semibold hover:bg-green-700 transition-colors">
                    Login
                  </button>
                </Link>
              )}
            </div>

            {/* Tombol Hamburger Menu (Hanya tampil di mobile: md:hidden) */}
            <button className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            
          </div>
        </div>
      </div>
    </header>
  );
}