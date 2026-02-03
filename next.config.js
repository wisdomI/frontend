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
    domains: ['localhost', 'your-domain.com', 'res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
    // OPTIMIZED: Enable lazy loading by default and optimize for fast rendering
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // OPTIMIZED: Enable SWCMinification for faster builds
  swcMinify: true,
  // OPTIMIZED: Enable experimental optimizations
  experimental: {
    optimizePackageImports: ['@heroicons/react/24/solid'],
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
            // Azure endpoints commented out - using Render backend only
            // https://eventhub-asgpata8c3aeapgu.westeurope-01.azurewebsites.net
            // https://eventhub-asgpata8c3aeapgu.westeurope-01.azurewebsites.net/api/v1
            // wss://eventhub-asgpata8c3aeapgu.westeurope-01.azurewebsites.net
            value: "connect-src 'self' http://localhost:3000 http://localhost:3001 https://localhost:3000 https://localhost:3001 ws://localhost:3000 ws://localhost:3001 wss://localhost:3000 wss://localhost:3001 https://backend-a3nd.onrender.com https://backend-a3nd.onrender.com/api/v1 wss://backend-a3nd.onrender.com",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig