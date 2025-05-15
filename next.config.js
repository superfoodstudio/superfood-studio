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
      'superfoodstudio.mypinata.cloud',
      'ipfs.io'
    ],
  },
  // Fix for Vercel deployment - use standalone but keep file tracing
  output: 'standalone',
  // Exclude relay deps from the server bundle
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'react-relay', 'relay-runtime'];
    }
    return config;
  }
};

module.exports = nextConfig; 