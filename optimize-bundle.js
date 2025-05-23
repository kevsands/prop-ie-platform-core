#!/usr/bin/env node
// Optimize bundle size

const fs = require('fs');
const path = require('path');

console.log('Optimizing bundle size...\n');

// 1. Update next.config.js for better optimization
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      '@mui/icons-material',
      'lodash',
      'react-icons',
      '@tanstack/react-query',
      'date-fns'
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    domains: ['localhost', 'prop-ie.com'],
    formats: ['image/webp'],
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Optimize chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 10,
          },
          common: {
            minChunks: 2,
            priority: -10,
            reuseExistingChunk: true,
          },
        },
      },
    };

    // Tree shaking
    config.optimization.usedExports = true;
    config.optimization.sideEffects = false;

    // Bundle analyzer in development
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: './analyze.html',
          openAnalyzer: true,
        })
      );
    }

    return config;
  },
};

module.exports = nextConfig;
`;

fs.writeFileSync('next.config.js', nextConfig);
console.log('✅ Updated next.config.js for optimization');

// 2. Create component lazy loading utility
const lazyLoadUtil = `
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export const lazyLoad = (importFunc: () => Promise<any>, fallback = <LoadingSpinner />) => {
  return dynamic(importFunc, {
    loading: () => fallback,
    ssr: false
  });
};

// Example usage:
// const HeavyComponent = lazyLoad(() => import('./HeavyComponent'));
`;

const utilsDir = path.join('src', 'utils');
fs.writeFileSync(path.join(utilsDir, 'lazy-load.tsx'), lazyLoadUtil);
console.log('✅ Created lazy loading utility');

// 3. Update imports to use tree shaking
const treeShakeImports = `
// Before: import _ from 'lodash';
// After: import { debounce } from 'lodash/debounce';

// Before: import * as Icons from 'react-icons/fi';
// After: import { FiHome, FiUser } from 'react-icons/fi';

// Before: import moment from 'moment';
// After: import { format } from 'date-fns';
`;

fs.writeFileSync('OPTIMIZATION_GUIDE.md', treeShakeImports);
console.log('✅ Created optimization guide');

// 4. Create bundle analysis script
const analyzeScript = `
{
  "scripts": {
    "analyze": "ANALYZE=true npm run build",
    "analyze:server": "BUNDLE_ANALYZE=server npm run build",
    "analyze:browser": "BUNDLE_ANALYZE=browser npm run build"
  }
}
`;

// Update package.json scripts
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
packageJson.scripts.analyze = "ANALYZE=true npm run build";
packageJson.scripts["analyze:server"] = "BUNDLE_ANALYZE=server npm run build";
packageJson.scripts["analyze:browser"] = "BUNDLE_ANALYZE=browser npm run build";

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ Added bundle analysis scripts');

// 5. Create code splitting example
const codeSplitExample = `
'use client';

import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// Lazy load heavy components
const PropertyViewer = lazy(() => import('@/components/property/PropertyViewer'));
const Analytics = lazy(() => import('@/components/analytics/Dashboard'));

export default function OptimizedPage() {
  return (
    <div>
      <Suspense fallback={<LoadingSpinner />}>
        <PropertyViewer />
      </Suspense>
      
      <Suspense fallback={<div>Loading analytics...</div>}>
        <Analytics />
      </Suspense>
    </div>
  );
}
`;

fs.writeFileSync(path.join('src', 'examples', 'optimized-page.tsx'), codeSplitExample);
console.log('✅ Created code splitting example');

console.log('\nBundle optimization complete!');
console.log('Run "npm run analyze" to see bundle analysis.');