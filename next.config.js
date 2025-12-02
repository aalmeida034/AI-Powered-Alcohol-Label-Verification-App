/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,  // Enable App Router
  },
  // Tell Vercel to use src/app as the root
  basePath: '',  // No base path needed
  trailingSlash: false,
  // If your app/ is in src/, add this (Vercel-specific)
  distDir: '.next',
  // Optional: For Vercel serverless
  output: 'standalone',
};

module.exports = nextConfig;