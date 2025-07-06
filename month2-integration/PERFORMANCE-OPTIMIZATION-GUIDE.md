# Performance Optimization Guide

This guide explains how to use the performance analysis tools and implement the recommended optimizations for improving application performance.

## Analysis Tools

### Performance Analyzer

The project includes a comprehensive performance analysis tool that scans your codebase for potential performance bottlenecks and optimization opportunities.

```bash
npm run analyze-performance
```

This tool analyzes:
- Component optimization (memoization, large components)
- Known performance bottlenecks
- Caching implementation
- Code splitting and lazy loading
- API data fetching patterns

### Bundle Analysis

To analyze your JavaScript bundle size:

```bash
npm run analyze-bundle
```

### Performance Testing

Run Lighthouse tests on your local development server:

```bash
npm run performance:test
```

Run performance tests in CI environment:

```bash
npm run performance:ci
```

## Common Optimization Techniques

### 1. Component Optimization

#### Memoize Pure Components

Use `React.memo` for components that render often but don't change their props frequently:

```tsx
import { memo } from 'react';

const MyComponent = ({ prop1, prop2 }) => {
  // Component logic
};

export default memo(MyComponent);
```

#### Use useMemo for Expensive Calculations

```tsx
import { useMemo } from 'react';

const MyComponent = ({ data }) => {
  const processedData = useMemo(() => {
    // Expensive calculation
    return data.map(item => /* complex transformation */);
  }, [data]);
  
  return <div>{processedData.map(item => <div key={item.id}>{item.name}</div>)}</div>;
};
```

#### Use useCallback for Event Handlers

```tsx
import { useCallback } from 'react';

const MyComponent = () => {
  const handleClick = useCallback(() => {
    // Event handling logic
  }, []);
  
  return <button onClick={handleClick}>Click me</button>;
};
```

### 2. Code Splitting and Lazy Loading

#### Dynamic Imports with Next.js

```tsx
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false // If component is not needed for first render
});

export default function MyPage() {
  return (
    <div>
      <LazyComponent />
    </div>
  );
}
```

#### React.lazy with Suspense

```tsx
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./HeavyComponent'));

export default function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Data Fetching Optimization

#### Move Fetch Calls to Server Components

```tsx
// page.tsx (Server Component)
import { fetchData } from '@/lib/api';
import ClientComponent from './client-component';

export default async function Page() {
  const data = await fetchData();
  
  return <ClientComponent data={data} />;
}
```

#### Implement Data Caching with TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['myData'],
    queryFn: async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{data.map(item => <div key={item.id}>{item.name}</div>)}</div>;
}
```

#### Parallel Data Fetching

```tsx
async function fetchAllData() {
  const [userData, productData, orderData] = await Promise.all([
    fetch('/api/users').then(res => res.json()),
    fetch('/api/products').then(res => res.json()),
    fetch('/api/orders').then(res => res.json())
  ]);
  
  return { userData, productData, orderData };
}
```

### 4. Implement Prefetching for Critical Routes

```tsx
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Navigation() {
  const router = useRouter();
  
  const handleMouseEnter = () => {
    router.prefetch('/dashboard');
  };
  
  return (
    <div onMouseEnter={handleMouseEnter}>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
```

### 5. Optimize Large Components

Break down large components into smaller, focused components:

```tsx
// Before
function LargeComponent() {
  // Lots of state and logic
  
  return (
    <div>
      {/* Hundreds of lines of JSX */}
    </div>
  );
}

// After
function LargeComponent() {
  return (
    <div>
      <Header />
      <MainContent />
      <Sidebar />
      <Footer />
    </div>
  );
}

function Header() { /* Focused component logic */ }
function MainContent() { /* Focused component logic */ }
function Sidebar() { /* Focused component logic */ }
function Footer() { /* Focused component logic */ }
```

## Performance Best Practices

1. **Eliminate Render Blocking Resources**: Use `next/script` with strategy="afterInteractive" or strategy="lazyOnload".

2. **Optimize Images**: Use Next.js Image component with proper sizing and formats.

3. **Implement Virtualization** for long lists with libraries like `react-virtualized` or `react-window`.

4. **Use Pagination** for large data sets instead of loading everything at once.

5. **Optimize Font Loading** with `next/font` which implements best practices like preloading and self-hosting.

6. **Consolidate State Management** - Use `useReducer` for complex state management instead of multiple `useState` calls.

7. **Implement Proper Error Boundaries** to prevent entire app crashes.

8. **Monitor Real User Metrics** using tools like Google Analytics, Lighthouse CI, or custom monitoring tools.

## Known Bottlenecks

Based on our analysis, the following components have known performance issues:

1. `CustomizationPage` - Excessive state usage and unmemoized list rendering
2. `BuyerDashboard` - Large render methods and nested mapping operations

## Additional Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [React Performance Optimization](https://reactjs.org/docs/optimizing-performance.html)
- [Web Vitals](https://web.dev/vitals/)