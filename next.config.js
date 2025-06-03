/** @type {import('next').NextConfig} */
const nextConfig = {
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