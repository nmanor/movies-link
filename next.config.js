/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['www.themoviedb.org', 'upload.wikimedia.org', 'image.tmdb.org'],
  },
};

module.exports = nextConfig;
