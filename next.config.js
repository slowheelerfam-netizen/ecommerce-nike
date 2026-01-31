/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.nike.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.stockx.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.goat.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stockx.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'stockx.imgix.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
