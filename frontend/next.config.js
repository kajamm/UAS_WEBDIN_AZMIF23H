const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tentukan root directory untuk tracing (menghindari warning multiple lockfiles)
  outputFileTracingRoot: path.join(__dirname, '../'),

  // Konfigurasi Next.js
  reactStrictMode: true,

  // Environment variables yang bisa diakses di client-side
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  },
};

module.exports = nextConfig;
