/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification
  swcMinify: true,
  // Disable Babel
  experimental: {
    forceSwcTransforms: true,
  },
  // Configure webpack to handle large files
  webpack: (config, { isServer }) => {
    // Increase the size limit for large files
    config.performance = {
      ...config.performance,
      maxAssetSize: 1000000,
      maxEntrypointSize: 1000000,
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://metamask-sdk.api.cx.metamask.io;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              connect-src 'self' https://metamask-sdk.api.cx.metamask.io https://*.infura.io https://*.alchemy.com;
              img-src 'self' data: https:;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 