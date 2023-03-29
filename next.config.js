/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['www.themoviedb.org', 'upload.wikimedia.org', 'image.tmdb.org', 'lh3.googleusercontent.com'],
    unoptimized: true,
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  ...nextConfig,
});
