import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3000/auth/:path*", // Proxy to Nest.js backend
      },
      {
        source: "/api/:path*",
        destination: "http://localhost:3000/api/:path*", // Proxy to Nest.js backend
      },
    ];
  },
};

export default nextConfig;