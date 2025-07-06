# Asset Configuration and Library Integration Guide

This guide provides detailed solutions for fixing image path errors, CSS loading issues, and library integration problems in your Next.js 15.3 App Router application.

## 1. Fixing Image Path 404 Errors

### Public Directory Structure

Your image paths should follow this structure:
```
/public
  /images
    /fitzgerald-gardens
      hero.jpeg
      2bed-apartment.jpeg
      ...
    /developments
      /Ballymakenny-View
        hero.jpg
        ...
```

### Configuring Next.js for Images

Update `next.config.js` with proper image configuration:

```javascript
// next.config.js
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
}
```

### Using Next.js Image Component

Always use the Image component with error handling:

```tsx
import Image from 'next/image';

<Image
  src={mainImage || '/images/placeholder-property.jpg'}
  alt={`Exterior view of ${displayName}`}
  fill
  style={{ objectFit: "cover" }}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  onError={(e) => {
    // Fallback to placeholder on error
    const target = e.target as HTMLImageElement;
    target.src = '/images/placeholder-property.jpg';
  }}
/>
```

### Check Common Path Issues

Common issues to check:
1. Case sensitivity: `hero.jpg` vs `Hero.jpg`
2. File extensions: `.jpeg` vs `.jpg`
3. Directory structure: Make sure paths match exactly
4. Deployment platform configs: Some platforms require additional config

## 2. Fixing CSS 404 Errors

### Global CSS in App Router

1. Ensure your `globals.css` is in the right location:

```
src/
  app/
    globals.css   <- Place here
    layout.tsx
```

2. Import it correctly in the root layout:

```tsx
// src/app/layout.tsx
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### Configure Tailwind

Ensure your `tailwind.config.ts` has the correct paths:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
```

### PostCSS Configuration

Create `postcss.config.mjs` with the right plugins:

```javascript
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 3. Library Integration Issues

### React Query v5+

The correct React Query v5+ setup:

```tsx
// src/components/QueryClientWrapper.tsx
'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export function QueryClientWrapper({ children }: { children: React.ReactNode }) {
  const [showDevtools, setShowDevtools] = React.useState(false);

  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setShowDevtools(true);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
```

### AWS Amplify v6+

Correct AWS Amplify v6+ configuration:

```tsx
// src/lib/amplify-client.ts
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, getCurrentUser, signOut, signIn } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import config from "@/aws-exports";

let isAmplifyConfigured = false;

export function configureAmplify() {
  if (typeof window !== 'undefined' && !isAmplifyConfigured) {
    Amplify.configure(config, { ssr: true });
    isAmplifyConfigured = true;
  }
}

// Client-side component using Amplify
export function ClientComponent() {
  React.useEffect(() => {
    configureAmplify();
  }, []);
  
  // Your component code
}
```

### Framer Motion

Correct Framer Motion v11+ usage:

```tsx
// src/components/AnimatedLayout.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
```

## 4. Package.json Library Versions

Ensure your `package.json` has compatible library versions:

```json
{
  "dependencies": {
    "@aws-amplify/api": "^6.3.11",
    "@aws-amplify/auth": "^6.12.4",
    "aws-amplify": "^6.14.4",
    "@tanstack/react-query": "^5.75.1",
    "@tanstack/react-query-devtools": "^5.75.1",
    "framer-motion": "^11.18.2",
    "next": "^15.3.1",
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  }
}
```

## 5. Using Proper Public Paths During Development and Production

For local development vs production deployment:

```tsx
// Helper function to get correct image path
function getImagePath(path: string) {
  // Handle absolute URLs
  if (path.startsWith('http')) return path;
  
  // For relative paths, ensure they start with /
  return path.startsWith('/') ? path : `/${path}`;
}

// Usage
<Image 
  src={getImagePath(property.image)} 
  alt={property.name} 
  width={300} 
  height={200}
/>
```

## Troubleshooting Guide

### CSS Issues
- Check the browser console for specific file paths that are 404ing
- Verify that the file exists exactly at that path
- Check for import order in layout.tsx
- Make sure postcss.config.mjs is correctly configured

### Image Issues
- Use the browser network tab to see which exact image URLs are failing
- Check case sensitivity of paths
- Ensure the files are actually in your public directory
- Try using absolute paths with domain

### Library Issues
- Check compatibility between React version and your libraries
- Use explicit imports rather than namespace imports
- Wrap library components with error boundaries
- Check for client-side vs server-side usage errors

By following these detailed configurations and fixes, you should resolve all the asset path and library integration issues in your Next.js 15.3 application.