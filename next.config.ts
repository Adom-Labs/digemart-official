import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Warning: This allows production builds during testing periods, must be rmoved before going to production
    ignoreDuringBuilds: true,
  },
  experimental: {
    browserDebugInfoInTerminal: false,
  },
  compiler: {
    removeConsole: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
