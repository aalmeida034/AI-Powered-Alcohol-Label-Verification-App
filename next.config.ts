import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",        // Critical for Vercel serverless
  distDir: ".next",            // Default build folder
  
};

export default nextConfig;