import Image from 'next/image';

// Tentukan props untuk komponen
type OfficerCardProps = {
  name: string;
  position: string;
  imageUrl: string; // Path ke gambar, misal: "/images/profil-pak-rt.jpg"
};

export default function OfficerCard({ name, position, imageUrl }: OfficerCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 text-center border border-gray-100">
      
      {/* Placeholder Gambar Profil */}
      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3 border-4 border-green-600 shadow-md">
        <Image
          src={imageUrl}
          alt={`Foto profil ${name}`}
          width={96} // harus sama dengan w-24 * h-24
          height={96}
          unoptimized={true}
          className="object-cover w-full h-full"
          // Error handler jika gambar gagal dimuat
          onError={(e) => {
            // Ganti dengan placeholder default jika gambar tidak ada
            e.currentTarget.src = 'https://placehold.co/96x96/e0e0e0/757575?text=Foto';
          }}
        />
      </div>
      
      {/* Info Pengurus */}
      <h3 className="font-bold text-base text-gray-900 truncate">{name}</h3>
      <p className="text-sm text-green-700 font-semibold">{position}</p>
      
    </div>
  );
}