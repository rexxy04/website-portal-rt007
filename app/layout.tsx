import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/authcontext"; 

const poppins = Poppins({
  subsets: ["latin"],
  display: 'swap', // Opsi performa
  weight: ["400", "500", "700", "900"]
});

export const metadata: Metadata = {
  title: "Portal RT 007",
  description: "Sistem Informasi Portal RT 007",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={poppins.className}>
      
      {/* 4. Hapus className dari <body> agar 'mewarisi' dari <html> */}
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}