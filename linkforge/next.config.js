/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  },
  async rewrites() {
    return [
      { source: '/@:slug', destination: '/p/:slug' }
    ];
  }
};

module.exports = nextConfig;

