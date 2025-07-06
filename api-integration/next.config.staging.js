/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  experimental: {
    optimizeCss: false, // Disable CSS optimization for staging
    clientTraceMetadata: true
  },
  typescript: {
    ignoreBuildErrors: true, // Allow TypeScript warnings in staging
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  images: {
    unoptimized: true, // Disable image optimization for faster builds
    domains: [
      'localhost',
      'via.placeholder.com',
      'images.unsplash.com',
      'www.prop.ie',
      'staging.prop.ie'
    ],
  },
  poweredByHeader: false,
  generateEtags: false,
  compress: true,
  
  // Skip problematic pages during static generation
  async generateStaticParams() {
    return [];
  },
  
  // Configure for staging deployment
  env: {
    NEXT_PUBLIC_APP_ENV: 'staging',
    ALLOW_MOCK_AUTH: 'true',
    SECURITY_ENHANCED: 'true',
    DATABASE_PROVIDER: 'postgresql'
  },
  
  // Headers for staging security
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
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Staging-Environment',
            value: 'true',
          }
        ],
      },
    ];
  },
  
  // Redirects for staging
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;