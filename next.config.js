/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for undici module parsing error
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }
    
    // Handle private class fields syntax
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    })
    
    // Fix for styled-jsx module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'styled-jsx': require.resolve('styled-jsx'),
    }
    
    return config
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' http://localhost:3000 http://localhost:3001 https://localhost:3000 https://localhost:3001 ws://localhost:3000 ws://localhost:3001 wss://localhost:3000 wss://localhost:3001 https://backend-a3nd.onrender.com wss://backend-a3nd.onrender.com",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig