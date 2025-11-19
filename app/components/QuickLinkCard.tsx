import Link from 'next/link';
import { ReactNode } from 'react'; // ReactNode digunakan agar kita bisa memasukkan SVG/Icon

// Tentukan props untuk komponen
type QuickLinkCardProps = {
  title: string;
  description: string;
  href: string;
  icon: ReactNode; // Kita akan passing komponen SVG icon di sini
};

export default function QuickLinkCard({ title, description, href, icon }: QuickLinkCardProps) {
  return (
    // Kita bungkus semua dengan <Link> agar bisa diklik
    <Link 
      href={href} 
      className="block bg-white rounded-xl shadow-lg p-4 text-center transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl border border-gray-100"
    >
      {/* Icon */}
      <div className="flex justify-center items-center mb-2 text-green-600">
        {/* 'icon' prop akan dirender di sini */}
        {icon}
      </div>
      
      {/* Teks */}
      <h3 className="font-bold text-sm text-gray-900 tracking-tight">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </Link>
  );
}