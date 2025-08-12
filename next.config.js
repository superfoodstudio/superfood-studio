/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  compiler: {
    // Enable the use of the Babel plugin
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: [
      'images.unsplash.com',
      'gateway.pinata.cloud',
      'ipfs.io'
    ],
  },
  // Vercel deployment configuration  
  output: 'standalone'
};

module.exports = nextConfig; 