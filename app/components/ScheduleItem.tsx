import { ReactNode } from 'react';

// Tentukan props untuk komponen
type ScheduleItemProps = {
  date: string; // Teks untuk tanggal, misal: "25 JUL"
  day: string; // Teks untuk hari, misal: "MINGGU"
  title: string;
  description: string;
  icon: ReactNode; // Ikon untuk kegiatan
};

export default function ScheduleItem({ date, day, title, description, icon }: ScheduleItemProps) {
  return (
    // Container satu baris
    <li className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
      
      {/* Bagian Tanggal */}
      <div className="flex-shrink-0 flex flex-col items-center justify-center w-14 h-14 bg-green-600 text-white rounded-lg shadow">
        <span className="text-lg font-bold leading-none">{date}</span>
        <span className="text-xs font-semibold uppercase">{day}</span>
      </div>

      {/* Bagian Info Kegiatan */}
      <div className="flex-grow">
        <h3 className="font-semibold text-sm text-gray-900 tracking-tight">{title}</h3>
        <p className="text-xs text-gray-500">{description}</p>
      </div>

      {/* Bagian Ikon (di sisi kanan) */}
      <div className="flex-shrink-0 text-gray-400">
        {icon}
      </div>
    </li>
  );
}