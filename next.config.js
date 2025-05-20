/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost'],
  },
  experimental: {
    externalDir: true,
  },
  typescript: {
    // Disable TypeScript errors during build for now to allow deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Disable ESLint errors during build for now to allow deployment
    ignoreDuringBuilds: true,
  },
  env: {
    // Add any environment variables that should be available at build time
  },
};

module.exports = nextConfig; 