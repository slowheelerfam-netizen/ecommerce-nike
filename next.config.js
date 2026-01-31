/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/image',
        search: '?url=*',
      },
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'stockx-assets.imgix.net' },
      { protocol: 'https', hostname: 'images.stockx.com' },
      { protocol: 'https', hostname: 'stockx.com' },
      { protocol: 'https', hostname: 'image.goat.com' },
      { protocol: 'https', hostname: 'goat.com' },
      { protocol: 'https', hostname: 'static.nike.com' },
      { protocol: 'https', hostname: 'secure-images.nike.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },
};

module.exports = nextConfig;
