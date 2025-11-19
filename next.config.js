/** @type {import('next').NextConfig} */
const nextConfig = {

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Izinkan semua path dari domain ini
      },
    ],
  },

  // ... (mungkin sudah ada konfigurasi lain di sini)
};

module.exports = nextConfig;