// This file contains configuration settings for the Next.js application, allowing customization of the build process and server behavior.

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['ipfs.io', 'your-image-domain.com'], // Add any image domains you will be using
  },
  env: {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_ALCHEMY_ENDPOINT: process.env.NEXT_PUBLIC_ALCHEMY_ENDPOINT,
    NEXT_PUBLIC_NFT_ADDRESS: process.env.NEXT_PUBLIC_NFT_ADDRESS,
    IPFS_NODE: process.env.IPFS_NODE,
  },
};

module.exports = nextConfig;