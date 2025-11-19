"use client";

import { 
    createContext, 
    useContext, 
    useEffect, 
    useState, 
    ReactNode 
} from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

// Menggunakan path yang benar berdasarkan struktur folder Anda
// (dari app/context/ ke app/lib/)
import { auth } from '../lib/firebase'; 

// Tipe untuk data yang akan ada di context
type AuthContextType = {
    user: User | null;
    loading: boolean;
};

// Membuat Context dengan nilai default
const AuthContext = createContext<AuthContextType>({ 
    user: null, 
    loading: true 
});

// 
// INI ADALAH EXPORT 'AuthProvider' YANG DICARI
// 
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Listener ini akan terpanggil setiap kali status auth berubah
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
        // Pengguna sedang login
        setUser(user);
        } else {
        // Pengguna logout
        setUser(null);
        }
      // Selesai loading, kita sudah tahu status loginnya
        setLoading(false);
    });

    // Cleanup listener saat komponen di-unmount
    return () => unsubscribe();
  }, []); // [] berarti useEffect ini hanya berjalan sekali saat mount

    const value = {
    user,
    loading,
    };

  // Kita "bungkus" children (seluruh aplikasi kita) dengan Provider ini
  // Kita hanya tampilkan children jika loading sudah selesai
    return (
    <AuthContext.Provider value={value}>
        {!loading && children}
    </AuthContext.Provider>
    );
};

// 
// INI ADALAH EXPORT 'useAuth'
// 
export const useAuth = () => {
    return useContext(AuthContext);
};