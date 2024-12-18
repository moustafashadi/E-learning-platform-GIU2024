// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:3000/auth/:path*", // Proxy to Nest.js backend
      },
    ];
  },
};

export default nextConfig;
