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

  // KONFIGURASI MENU NAVIGASI
  const navItems = [
    // 1. Ke Halaman Baru (Gunakan <Link>)
    { 
      name: 'Aktivitas', 
      href: '/activity', // Mengarah ke /app/activity/page.tsx
      type: 'page',      // Penanda tipe link
      icon: <ActivityIcon /> 
    },
    // 2. Ke Anchor di Home (Gunakan <a> dengan awalan /#)
    { 
      name: 'Menu Cepat', 
      href: '/#quick-menu', // Tambahkan '/' agar bisa diakses dari halaman lain
      type: 'anchor',
      icon: <GridIcon /> 
    },
    { 
      name: 'Jadwal', 
      href: '/#schedule', 
      type: 'anchor',
      icon: <CalendarIcon /> 
    },
    { 
      name: 'Pengurus', 
      href: '/#officers', 
      type: 'anchor',
      icon: <UsersIcon /> 
    },
  ];

  return (
    <>
      {/* --- 1. HEADER DESKTOP --- */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md shadow-sm hidden md:block transition-all">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-green-700 tracking-tighter">
              GMA
            </Link>

            {/* Navigasi Desktop */}
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => {
                // LOGIKA HYBRID:
                // Jika tipe 'page', pakai <Link> (Navigasi cepat Next.js)
                // Jika tipe 'anchor', pakai <a> (Agar scroll akurat dan tidak spam server log)
                if (item.type === 'page') {
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-green-700 hover:underline underline-offset-4 transition-colors"
                    >
                      {item.name}
                    </Link>
                  );
                } else {
                  return (
                    <a 
                      key={item.name}
                      href={item.href}
                      className="text-sm font-medium text-gray-600 hover:text-green-700 hover:underline underline-offset-4 transition-colors cursor-pointer"
                    >
                      {item.name}
                    </a>
                  );
                }
              })}
            </nav>

            {/* User / Login */}
            <div className="flex items-center gap-4">
              {loading ? (
                <div className="text-sm text-gray-500">...</div>
              ) : user ? (
                <>
                  <span className="text-sm font-medium hidden lg:block">Halo, {user.email?.split('@')[0]}</span>
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-1.5 bg-red-100 text-red-600 rounded-full text-xs font-bold hover:bg-red-200 transition-colors"
                  >
                    Keluar
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="px-5 py-2 bg-green-600 text-white rounded-full text-sm font-bold hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- 2. HEADER MOBILE (Logo Only) --- */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm shadow-sm md:hidden px-4 py-3 flex justify-between items-center">
         <Link href="/" className="text-xl font-bold text-green-700">GMA</Link>
         {!loading && !user && (
            <Link href="/login" className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Login
            </Link>
         )}
         {user && (
            <button onClick={handleLogout} className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full">
              Keluar
            </button>
         )}
      </header>

      {/* --- 3. BOTTOM NAVIGATION BAR (Mobile) --- */}
      <nav className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          
           {/* Tombol Home */}
           <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-green-600 focus:text-green-600">
            <HomeIcon />
            <span className="text-[10px] mt-1 font-medium">Beranda</span>
          </Link>

          {/* Nav Items Mapping */}
          {navItems.map((item) => {
            // Logika Hybrid yang sama untuk Mobile
            const commonClasses = "flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-green-600 focus:text-green-600";
            
            if (item.type === 'page') {
              return (
                <Link key={item.name} href={item.href} className={commonClasses}>
                  {item.icon}
                  <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </Link>
              );
            } else {
              return (
                <a key={item.name} href={item.href} className={commonClasses}>
                  {item.icon}
                  <span className="text-[10px] mt-1 font-medium">{item.name}</span>
                </a>
              );
            }
          })}

        </div>
      </nav>
    </>
  );
}

// --- ICON COMPONENTS (Tetap Sama) ---
function HomeIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)
}
function ActivityIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>)
}
function GridIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>)
}
function CalendarIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>)
}
function UsersIcon() {
  return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>)
}