"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, orderBy, query } from 'firebase/firestore';
import Link from 'next/link';
import AdminHeader from '@/app/components/AdminHeader'; // Import Header Baru
import { Plus, Trash2, Eye, Calendar, Search } from 'lucide-react';

export default function AdminActivityList() {
  // Gunakan any sementara agar tidak error typescript strict
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data Realtime
  useEffect(() => {
    const q = query(collection(db, "activities"), orderBy("created_at", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dataList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setActivities(dataList);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Yakin ingin menghapus kegiatan "${title}"?`)) {
      try {
        await deleteDoc(doc(db, "activities", id));
      } catch (error) {
        console.error("Gagal menghapus:", error);
        alert("Gagal menghapus data.");
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Memuat data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Khusus Admin */}
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Daftar Kegiatan Desa</h2>
            <p className="text-gray-500 text-sm mt-1">Kelola semua berita dan dokumentasi kegiatan di sini.</p>
          </div>
          <Link 
            href="/admin/kegiatan/tambah" 
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition flex items-center gap-2"
          >
            <Plus size={20} />
            Tambah Kegiatan
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {activities.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Thumbnail</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Info Kegiatan</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Tanggal</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activities.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition group">
                      <td className="px-6 py-4 w-24 align-top">
                        <div className="w-20 h-20 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden relative">
                          {/* Menggunakan img tag biasa agar support link eksternal tanpa config */}
                          <img 
                            src={item.image || '/images/hero-bg.jpg'} 
                            alt="Thumb" 
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/images/hero-bg.jpg'; }}
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top">
                        <h3 className="text-base font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1 mb-2">{item.excerpt}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200 font-mono">
                            ID: {item.slug || item.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 align-top pt-5">
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} className="text-emerald-500" />
                          {item.date}
                        </div>
                      </td>
                      <td className="px-6 py-4 align-top text-center">
                        <div className="flex justify-center gap-2 pt-2">
                          {/* Link Preview */}
                          <Link 
                            href={`/activity/${item.slug || item.id}`}
                            target="_blank"
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                            title="Preview"
                          >
                            <Eye size={16} />
                          </Link>
                          {/* Tombol Hapus */}
                          <button 
                            onClick={() => handleDelete(item.id, item.title)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-400 flex flex-col items-center">
              <Search size={48} className="text-gray-200 mb-4" />
              <p className="mb-4">Belum ada data kegiatan.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}