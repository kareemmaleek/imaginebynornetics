/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: "/assets/uploads/:path*",
        destination: "/api/assets/uploads/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
