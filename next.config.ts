import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    browserDebugInfoInTerminal: true,
  },
  images: {
    domains: ["images.unsplash.com", "loremflickr.com"],
  },
};

export default nextConfig;
