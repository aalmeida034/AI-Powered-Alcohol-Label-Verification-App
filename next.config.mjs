import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    // This tells Vercel to look in src/app/
    appDir: true,
  },
  // Critical for Vercel
  distDir: '.next',
  output: 'standalone',
};

export default nextConfig;