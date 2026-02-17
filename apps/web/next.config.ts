import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.puter.com',
      },
      {
        protocol: 'https',
        hostname: '**.puter.site',
      },
    ],
  },
};

export default nextConfig;
