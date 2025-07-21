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
  // Disable output file tracing to avoid micromatch stack overflow
  output: 'standalone',
  outputFileTracing: false,
  // Exclude relay deps from the server bundle
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, 'react-relay', 'relay-runtime'];
    }
    return config;
  }
};

module.exports = nextConfig; 