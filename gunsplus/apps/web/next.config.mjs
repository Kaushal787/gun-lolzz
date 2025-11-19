/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@gunsplus/db'],
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },
  async rewrites() {
    // Example: forward /api/backend/* to external API if needed
    const API_URL = process.env.API_URL;
    if (!API_URL) return [];
    return [
      {
        source: '/api/backend/:path*',
        destination: `${API_URL}/:path*`
      }
    ];
  }
};

export default nextConfig;
