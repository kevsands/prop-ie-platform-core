# Performance Optimizations for PropIE AWS App

This document provides a quick reference for the performance optimizations implemented in the PropIE AWS application.

## Quick Start

### 1. Using Safe Cache

```typescript
import { safeCache } from '@/utils/performance/safeCache';

// Create a cached function
const getCachedData = safeCache((id: string) => {
  // Expensive operation
  return expensiveOperation(id);
});

// Use like a normal function
const result = getCachedData('123');
```

### 2. Using Data Cache with TTL

```typescript
import { dataCache } from '@/lib/cache/dataCache';

// Set data with 5-minute TTL
dataCache.set('user:123', userData, 5 * 60 * 1000);

// Get data
const userData = dataCache.get('user:123');

// Get or fetch
const data = await dataCache.getOrSetAsync(
  'api:endpoint',
  () => fetch('/api/endpoint').then(res => res.json()),
  60 * 1000 // 1-minute TTL
);
```

### 3. Lazy Loading Components

```typescript
import { createLoadable } from '@/utils/code-splitting';

// Create loadable component
const LazyComponent = createLoadable(
  () => import('./HeavyComponent'),
  <LoadingFallback />
);

// Use in your component
function App() {
  return <LazyComponent prop1="value" />;
}

// Preload component when user hovers
const handleHover = () => {
  LazyComponent.preload();
};
```

### 4. Memoizing Components

```typescript
import { withMemo } from '@/utils/performance/withMemo';

// Simple memoization
const MemoizedComponent = withMemo(MyComponent);

// Advanced memoization
const OptimizedComponent = withMemo(MyComponent, {
  includeProps: ['id', 'name'], // Only re-render when these change
  trackPerformance: true,
  logRenders: process.env.NODE_ENV === 'development'
});
```

### 5. Performance Monitoring

```typescript
import { usePerformance } from '@/utils/performance';

function MyComponent() {
  const { measureRender } = usePerformance('MyComponent');
  
  // Track render performance
  measureRender();
  
  return <div>Content</div>;
}
```

### 6. Virtualizing Lists

```typescript
import { VirtualizedList } from '@/components/performance/VirtualizedList';

function MyList({ items }) {
  return (
    <VirtualizedList
      items={items}
      itemHeight={50}
      height={400}
      width="100%"
      renderItem={(item, index, style) => (
        <div style={style}>
          {item.name}
        </div>
      )}
    />
  );
}
```

## Bundle Analysis

Run the bundle analyzer:

```bash
npm run analyze-bundle
```

View the report at:
- Visual report: `.next/analyze/client.html`
- JSON report: `bundle-report.json`

## Performance Dashboard

Enable the performance dashboard in development:

```tsx
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';

function App() {
  return (
    <>
      {/* Your app */}
      {process.env.NODE_ENV === 'development' && (
        <PerformanceMonitor position="bottom-right" />
      )}
    </>
  );
}
```

## Key Files and Utilities

### Core Performance Utilities

| File | Description |
|------|-------------|
| `/src/utils/performance/safeCache.ts` | Safe caching utilities that work across React versions |
| `/src/lib/cache/dataCache.ts` | Advanced data cache with TTL support |
| `/src/utils/code-splitting.ts` | Code splitting and lazy loading utilities |
| `/src/utils/performance/index.ts` | Performance monitoring and metrics collection |
| `/src/utils/performance/withMemo.ts` | Enhanced memoization utilities |
| `/src/utils/performance/optimizeComponent.tsx` | Component optimization utilities |

### Performance Components

| Component | Description |
|-----------|-------------|
| `VirtualizedList` | Efficiently render large lists |
| `PerformanceMonitor` | Real-time performance monitoring dashboard |
| `OptimizedComponent` | Component wrapper with performance tracking |

### Scripts and Configuration

| File | Description |
|------|-------------|
| `/scripts/analyze-bundle.sh` | Script to analyze bundle size |
| `/scripts/generate-bundle-report.js` | Generate bundle analysis report |
| `/next.config.js` | Next.js configuration with performance optimizations |

## Testing Performance

Ensure you test performance regularly:

1. **Analyze Bundle Size**: `npm run analyze-bundle`
2. **Profile Rendering**: Use React DevTools Profiler
3. **Measure Load Times**: Use Lighthouse or WebPageTest
4. **Check for Jank**: Monitor for frame drops and layout shifts

## Full Documentation

For complete documentation, see:
- [Performance Optimization Guide](./docs/PERFORMANCE_OPTIMIZATION.md)
- [React's Performance Documentation](https://reactjs.org/docs/optimizing-performance.html)
- [Next.js Performance Documentation](https://nextjs.org/docs/pages/building-your-application/optimizing)