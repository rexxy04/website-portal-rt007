import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Membaca environment variables dari file .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

/* Inisialisasi Firebase
Ini menggunakan pola "singleton" untuk mencegah inisialisasi berulang
di environtment Next.js (karena Hot Module Replacement) */

const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi service Firebase yang akan digunakan
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

// Ekspor service agar bisa diimpor di file lain
export { app, auth, db };