/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  experimental: {
    // Enable modern bundling optimizations
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
  },

  // Server external packages
  serverExternalPackages: ['express-rate-limit'],

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
  },

  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.stripe.com',
      }
    ]
  },

  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Handle Node.js modules for client-side
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        net: false,
        tls: false,
        fs: false,
        path: false,
        os: false,
      }
    }

    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }

    // Optimize chunks
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            // Vendor chunk for stable dependencies
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
            },
            // UI components chunk
            ui: {
              test: /[\\/]components[\\/]ui[\\/]/,
              name: 'ui',
              priority: 20,
              reuseExistingChunk: true,
            },
            // Dashboard widgets chunk
            widgets: {
              test: /[\\/]components[\\/](dashboard-widgets|widgets)[\\/]/,
              name: 'widgets',
              priority: 30,
              reuseExistingChunk: true,
            },
            // Common utilities
            common: {
              test: /[\\/]lib[\\/]/,
              name: 'common',
              priority: 5,
              reuseExistingChunk: true,
              minChunks: 2,
            }
          }
        }
      }
    }

    // Performance optimizations for production
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
    }

    return config
  },

  // Headers for performance and security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Cache static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          // Preload critical resources
          {
            key: 'Link',
            value: '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          // API caching
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          // Long-term caching for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Redirects for performance
  async redirects() {
    return [
      // Redirect trailing slashes
      {
        source: '/:path*/',
        destination: '/:path*',
        permanent: true,
      },
    ]
  },

  // Output configuration
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable strict mode
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    // Type checking during build
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    // Run ESLint during build
    ignoreDuringBuilds: false,
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

// Bundle analyzer configuration
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer(nextConfig)
} else {
  module.exports = nextConfig
}
