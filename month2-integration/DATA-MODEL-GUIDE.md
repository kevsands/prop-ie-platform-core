# Data Model and Library Integration Guide

This guide explains how to properly manage data models and library integrations in the Next.js 15.3 App Router application.

## Table of Contents
1. [Complete Data Models](#complete-data-models)
2. [Safely Handling Undefined Properties](#safely-handling-undefined-properties)
3. [Library Configuration](#library-configuration)
4. [Asset Path Configuration](#asset-path-configuration)
5. [Global CSS in App Router](#global-css-in-app-router)

## Complete Data Models

### Using the Type System Correctly

Our application uses TypeScript interfaces defined in `src/types/models.ts` to ensure consistency. Always import types from this centralized location:

```typescript
import { Property, Development, SafeProperty } from '@/types/models';
import { PropertyStatus, PropertyType } from '@/types/enums';
```

### Required Properties for Property

The Property interface requires these fields:

```typescript
// Minimal required fields
interface MinimalProperty {
  id: string;
  name: string;
  slug: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  developmentId: string;
  developmentName: string;
}
```

### Required Properties for Development

The Development interface requires these fields:

```typescript
// Minimal required fields
interface MinimalDevelopment {
  id: string;
  name: string;
  slug: string;
  description: string;
  location: string;
  image: string;
  status: string | DevelopmentStatus;
  statusColor: string;
  priceRange: string;
  availabilityStatus: string;
  bedrooms: number[];
}
```

## Safely Handling Undefined Properties

### Using SafeProperty and SafeDevelopment Types

For legacy data that might be missing required fields, use the `SafeProperty` and `SafeDevelopment` types:

```typescript
import { SafeProperty, isCompleteProperty } from '@/types/models';

// This accepts partial property data
function DisplayProperty({ property }: { property: SafeProperty }) {
  // Check if it has all required fields
  if (isCompleteProperty(property)) {
    // Safe to use all properties
    return <div>{property.developmentName} - {property.price}</div>;
  }
  
  // Fallback rendering for incomplete data
  return <div>{property.id} - {property.name}</div>;
}
```

### Defensive Property Access

When accessing potentially missing properties, use optional chaining and provide fallbacks:

```typescript
// In components
const displayName = property.title || property.name || 'Unnamed Property';
const mainImage = property.image || (property.images?.length > 0 ? property.images[0] : '/placeholder.jpg');
const displayArea = property.floorArea || property.area || 0;
```

### Mock Data Example

Use the `mock-models.ts` file for complete examples:

```typescript
// Example usage
import { mockProperties, mockDevelopments } from '@/data/mock-models';
import { ensureCompleteProperty } from '@/data/mock-models';

// Fill in missing properties automatically
const completeProperty = ensureCompleteProperty(incompleteData);
```

## Library Configuration

### React Query v5+ Configuration

The correct imports for React Query v5+:

```typescript
// Correct imports
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Creating the client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});
```

### AWS Amplify v6+ Configuration

The correct imports for AWS Amplify v6+:

```typescript
// Core imports
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, getCurrentUser, signOut, signIn } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';

// Configure Amplify (client-side only)
if (typeof window !== 'undefined') {
  Amplify.configure(config, { ssr: true });
}

// Getting API client
const apiClient = generateClient();
```

### Framer Motion Configuration

The correct imports for Framer Motion v11+:

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Example usage
<AnimatePresence mode="wait">
  <motion.div
    key={route}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

## Asset Path Configuration

### Configuring Public Directory

The `next.config.js` file should include:

```javascript
const nextConfig = {
  // Images configuration for correct image loading
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Setup public directory properly for assets
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
}
```

### Image Paths

Always use relative paths from the `/public` directory:

```jsx
// Correct image paths
<Image src="/images/fitzgerald-gardens/hero.jpeg" alt="Hero" />

// For dynamic paths
<Image 
  src={property.image || '/images/placeholder-property.jpg'} 
  alt={property.name}
  onError={(e) => {
    const target = e.target as HTMLImageElement;
    target.src = '/images/placeholder-property.jpg';
  }}
/>
```

## Global CSS in App Router

### Setting Up Global CSS

1. Place your `globals.css` file in the `src/app` directory
2. Import it in your root layout:

```tsx
// src/app/layout.tsx
import React from "react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
```

### Tailwind Configuration

For Tailwind CSS, make sure `tailwind.config.ts` includes:

```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  // ...other config
} satisfies Config;

export default config;
```

This completes the guide for properly managing data models and library integrations in the Next.js App Router application.