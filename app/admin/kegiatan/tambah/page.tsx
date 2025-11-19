"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/app/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import AdminHeader from '@/app/components/AdminHeader'; // Header Admin Baru
import Link from 'next/link';
import Swal from 'sweetalert2';
import { ArrowLeft, Plus, X } from 'lucide-react';

export default function AddActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State Form Data (termasuk gallery array)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    date: '',
    location: '',
    image: '/images/hero-bg.jpg',
    gallery: [] as string[], // <--- Array untuk menyimpan banyak foto
    excerpt: '',
    description: ''
  });

  // State untuk input sementara galeri
  const [tempGalleryUrl, setTempGalleryUrl] = useState('');

  // Handle Change Input Biasa
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Logic auto-slug dari Title
    if (name === 'title' && !formData.slug) {
      const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, title: value, slug: autoSlug }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // --- Logic Tambah Foto ke Galeri ---
  const handleAddGalleryPhoto = () => {
    if (!tempGalleryUrl.trim()) return;
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, tempGalleryUrl] }));
    setTempGalleryUrl('');
  };

  // --- Logic Hapus Foto dari Galeri ---
  const handleRemoveGalleryPhoto = (idx: number) => {
    setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== idx) }));
  };

  // --- Submit Form ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.title || !formData.slug || !formData.date) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Judul, Slug, dan Tanggal wajib diisi!', customClass: { popup: 'rounded-2xl' } });
      setLoading(false);
      return;
    }

    try {
      const docRef = doc(db, "activities", formData.slug);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        Swal.fire({ icon: 'warning', title: 'Slug Terpakai', text: 'Mohon ubah judul atau slug agar unik.', customClass: { popup: 'rounded-2xl' } });
        setLoading(false);
        return;
      }

      const dataToSave = {
        ...formData,
        // Memecah deskripsi menjadi array paragraf
        description: formData.description.split('\n').filter(p => p.trim() !== ''),
        // Simpan array galeri
        gallery: formData.gallery,
        created_at: new Date().toISOString()
      };

      await setDoc(docRef, dataToSave);

      await Swal.fire({
        title: 'Berhasil!',
        text: 'Kegiatan baru telah disimpan.',
        icon: 'success',
        confirmButtonColor: '#10b981',
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-lg' }
      });

      router.push('/admin/kegiatan');

    } catch (err) {
      console.error("Error:", err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Gagal menyimpan data.', customClass: { popup: 'rounded-2xl' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Header Admin */}
      <AdminHeader />
      
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/kegiatan" className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 text-gray-600 font-bold transition">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Tambah Kegiatan Baru</h1>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Judul & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Judul Kegiatan</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Contoh: Kerja Bakti" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slug URL</label>
                <input type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="kerja-bakti" className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-500 font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>

            {/* Tanggal & Lokasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tanggal</label>
                <input type="text" name="date" value={formData.date} onChange={handleChange} placeholder="20 Oktober 2024" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Lokasi</label>
                <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Lapangan Desa" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
            </div>

            {/* Gambar Utama */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Path Gambar Utama</label>
              <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="/images/foto.jpg" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            {/* --- INPUT GALERI --- */}
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 mb-3">Galeri Dokumentasi (Opsional)</label>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text"
                  value={tempGalleryUrl}
                  onChange={(e) => setTempGalleryUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGalleryPhoto())}
                  placeholder="Paste link URL atau path lokal..."
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
                <button type="button" onClick={handleAddGalleryPhoto} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-2">
                  <Plus size={18} /> Add
                </button>
              </div>
              
              {/* Preview Galeri */}
              {formData.gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.gallery.map((url, idx) => (
                    <div key={idx} className="relative group h-24 bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
                      {/* Menggunakan img biasa agar tidak error next.config */}
                      <img src={url} alt="galeri" className="w-full h-full object-cover" onError={(e) => (e.target as HTMLImageElement).src = '/images/hero-bg.jpg'} />
                      <button type="button" onClick={() => handleRemoveGalleryPhoto(idx)} className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <div className="bg-red-500 p-1 rounded-full text-white"><X size={14} /></div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Konten */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan</label>
              <textarea name="excerpt" rows={2} value={formData.excerpt} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Deskripsi Lengkap</label>
              <textarea name="description" rows={6} value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg disabled:opacity-70">
                {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
              </button>
            </div>

          </form>
        </div>
      </main>
    </div>
  );
}