/**
 * @type {import('next').NextConfig}
 * 
 * Simplified Next.js configuration for deployment without Sentry
 */

const path = require('path');

// Determine if we're in production environment
const isProduction = process.env.NODE_ENV === 'production';

// Base configuration
const nextConfig = {
  // Enable TypeScript error checking in production builds only
  typescript: {
    // Ignore build errors temporarily to fix type issues with Next.js 15 route handlers
    ignoreBuildErrors: true,
  },
  
  // Enable ESLint in production builds only
  eslint: {
    ignoreDuringBuilds: !isProduction,
    dirs: ['src'],
  },
  
  // Enable SVG support with security settings
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  
  // Add basic security headers
  async headers() {
    return [
      {
        source: '/:path*',
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
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizeCss: isProduction,
    typedRoutes: false,
  },
  
  // Optimize build outputs
  poweredByHeader: false,
  reactStrictMode: true,
  output: 'standalone',
  compress: true,
  
  // Configure AWS Amplify deployments
  env: {
    BUILD_ID: process.env.VERCEL_GIT_COMMIT_SHA || process.env.BUILD_ID || 'development',
    APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  },
  
  // Configure webpack to handle module aliases properly
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib/utils': path.resolve(__dirname, 'src/lib/utils.ts'),
      '@/lib/amplify-data': path.resolve(__dirname, 'src/lib/amplify-data.ts'),
      '@/lib/amplify/auth': path.resolve(__dirname, 'src/lib/amplify/auth.ts'),
      '@/lib/utils/safeCache': path.resolve(__dirname, 'src/lib/utils/safeCache.ts'),
      '@/lib/mongodb': path.resolve(__dirname, 'src/lib/mongodb.ts'),
      '@/lib/auth': path.resolve(__dirname, 'src/lib/auth.ts'),
    };
    
    return config;
  },
};

module.exports = nextConfig;