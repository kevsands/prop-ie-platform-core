/**
 * @type {import('next').NextConfig}
 * 
 * Consolidated Next.js configuration file.
 * Optimized for AWS Amplify v6 compatibility and Next.js 15.3.1.
 */

import { fileURLToPath } from 'url';
import { dirname, resolve, join } from 'path';

// Setup directory paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use createRequire for CommonJS module compatibility
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Load bundle analyzer conditionally
const withBundleAnalyzer = process.env.ANALYZE === 'true'
  ? require('@next/bundle-analyzer')({ enabled: true })
  : (config) => config;

// Environment-specific configuration
const environment = process.env.NODE_ENV || 'development';

/**
 * Determine if we're running in a specific environment
 * @param {'production'|'staging'|'development'|'test'} env - The environment to check
 * @returns {boolean} - Whether we're running in that environment
 */
const isEnv = (env) => environment === env;

// Base configuration for all environments
const baseConfig = {
  // External packages that should be bundled for server components
  serverExternalPackages: [
    'aws-crt',
    '@aws-crypto',
    '@aws-sdk',
  ],
  
  // Experimental options for Next.js
  experimental: {
    // Enable CSS optimization
    optimizeCss: true,
    
    // Enable memory optimizations for workers
    memoryBasedWorkersCount: true,
    
    // Modern optimizations for tree shaking
    optimizePackageImports: [
      '@headlessui/react',
      '@heroicons/react',
      '@radix-ui/react-icons',
      'date-fns',
      'lodash',
      'react-hook-form',
      'framer-motion',
      'lucide-react',
      'react-icons',
      'recharts',
    ],
    
    // Server actions for form processing
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  
  // Disable ESLint and TypeScript type checking during build
  // These should be run separately for better performance
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Add external packages that need transpilation
  transpilePackages: [
    'react-chartjs-2',
    'chart.js',
  ],
  
  // Configure redirects for legacy routes
  redirects: async () => {
    return [
      // Auth-related redirects
      {
        source: '/auth/login',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/auth/register',
        destination: '/register',
        permanent: true,
      },
      {
        source: '/auth/forgot-password',
        destination: '/forgot-password',
        permanent: true,
      },
      // Properties-related redirects
      {
        source: '/properties/:id',
        destination: '/properties/:id',
        permanent: true,
      },
    ];
  },
  
  // Images configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  
  // Security headers configuration
  headers: async () => {
    // No strict headers in development
    if (isEnv('development')) {
      return [];
    }
    
    // Production security headers
    return [
      {
        source: '/(.*)',
        headers: [
          // Basic security headers
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Content Security Policy
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://*.amazonaws.com; img-src 'self' data: https: blob:; style-src 'self' 'unsafe-inline'; font-src 'self' data:; object-src 'none';",
          },
        ],
      },
    ];
  },
  
  // Public asset prefix based on environment
  assetPrefix: isEnv('production') ? undefined : '',
  
  // Custom webpack configuration
  webpack: (config, { dev, isServer, nextRuntime }) => {
    // Skip certain configurations for edge runtime
    if (nextRuntime === 'edge') {
      return config;
    }
    
    // Set up path aliases
    config.resolve.alias['@'] = join(process.cwd(), 'src');
    
    // Fix for issues with React versions
    config.resolve.alias['react-dom'] = resolve(process.cwd(), 'node_modules/react-dom');
    
    // Only apply optimizations in production builds
    if (!dev && !isServer) {
      // Enable module concatenation for better tree shaking
      config.optimization.concatenateModules = true;
      
      // Ensure React is properly tree-shaken
      config.resolve.alias['react/jsx-runtime'] = resolve(process.cwd(), 'node_modules/react/jsx-runtime');
      
      // Add a splitChunks configuration for better code splitting
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            name: 'framework',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            // Only bundle React once
            enforce: true,
          },
          // AWS Amplify group to properly bundle it
          amplify: {
            test: /[\\/]node_modules[\\/](aws-amplify|@aws-amplify)[\\/]/,
            name: 'amplify',
            priority: 35,
            reuseExistingChunk: true,
          },
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              try {
                // Get the name. E.g. node_modules/packageName/sub/path
                // or node_modules/packageName
                const match = module.context ? module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                ) : null;
                
                const packageName = match && match[1] ? match[1] : 'vendor';
                
                // Bundle larger libraries separately for better caching
                return `npm.${packageName.replace('@', '')}`;
              } catch (e) {
                return 'vendor'; // Fallback to vendor chunk for any errors
              }
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: false,
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
      };
    }
    
    // Fix AWS Amplify issues
    config.resolve.alias = {
      ...config.resolve.alias,
      './runtimeConfig': './runtimeConfig.browser',
    };
    
    // Make AWS Amplify work better with browser polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
    };
    
    // Add the buffer to the providePlugin
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );
    
    return config;
  },
  
  // Increase serverless function memory limit
  serverRuntimeConfig: {
    PROJECT_ROOT: process.cwd(),
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production
  compiler: {
    // Remove console.log in production
    removeConsole: isEnv('production') ? {
      exclude: ['error', 'warn']
    } : false
  },
  
  // Environment variables available at build time
  env: {
    APP_VERSION: process.env.npm_package_version || '0.0.0',
    BUILD_ID: new Date().toISOString(),
    NODE_ENV: environment,
  },
};

// Environment-specific configurations
const envConfig = {
  development: {
    // Development-specific overrides
    reactStrictMode: true,
    swcMinify: false, // Disable minification for faster builds in development
  },
  production: {
    // Production-specific overrides
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
  },
  staging: {
    // Staging-specific overrides
    swcMinify: true,
    compress: true,
    poweredByHeader: false,
  },
  test: {
    // Test-specific overrides
    reactStrictMode: true,
    swcMinify: false,
  },
};

// Merge base config with environment-specific config
const nextConfig = {
  ...baseConfig,
  ...(envConfig[environment] || {}),
};

// Export config with bundle analyzer wrapper
export default withBundleAnalyzer(nextConfig);