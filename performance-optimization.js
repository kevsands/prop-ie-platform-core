#!/usr/bin/env node
// Performance optimization

const fs = require('fs');
const path = require('path');

console.log('Implementing performance optimizations...\n');

// 1. Create performance monitoring hook
const performanceHook = `
import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const renderStartTime = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const renderEndTime = performance.now();
    const renderDuration = renderEndTime - renderStartTime.current;

    if (renderCount.current > 1) {
      console.log(\`Performance: \${componentName} rendered \${renderCount.current} times, last render took \${renderDuration.toFixed(2)}ms\`);
    }

    renderStartTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};
`;

fs.writeFileSync(path.join('src', 'hooks', 'usePerformanceMonitor.tsx'), performanceHook);
console.log('✅ Created performance monitoring hook');

// 2. Image optimization component
const optimizedImage = `
'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 800,
  height = 600,
  className = '',
  priority = false
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={\`relative \${className}\`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
        onLoadingComplete={() => setLoading(false)}
        className={className}
      />
    </div>
  );
};
`;

fs.writeFileSync(path.join('src', 'components', 'ui', 'optimized-image.tsx'), optimizedImage);
console.log('✅ Created optimized image component');

// 3. Create caching service
const cacheService = `
class CacheService {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    const expiry = Date.now() + ttl;
    this.cache.set(key, { data, expiry });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now > value.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const cacheService = new CacheService();
`;

fs.writeFileSync(path.join('src', 'services', 'cacheService.ts'), cacheService);
console.log('✅ Created cache service');

// 4. Debounce utility
const debounceUtil = `
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
`;

fs.writeFileSync(path.join('src', 'utils', 'performance-utils.ts'), debounceUtil);
console.log('✅ Created performance utilities');

// 5. Virtual scrolling example
const virtualScroll = `
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualList<T>({ items, height, itemHeight, renderItem }: VirtualListProps<T>) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: \`\${height}px\`,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: \`\${rowVirtualizer.getTotalSize()}px\`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: \`\${virtualItem.size}px\`,
              transform: \`translateY(\${virtualItem.start}px)\`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join('src', 'components', 'ui', 'virtual-list.tsx'), virtualScroll);
console.log('✅ Created virtual scrolling component');

// 6. Web Worker example
const workerExample = `
// worker.ts
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'HEAVY_COMPUTATION':
      const result = performHeavyComputation(data);
      self.postMessage({ type: 'COMPUTATION_RESULT', result });
      break;
  }
});

function performHeavyComputation(data: any) {
  // Heavy computation logic
  return data;
}

// useWorker.ts
export const useWorker = () => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(new URL('./worker.ts', import.meta.url));
    
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const runComputation = (data: any) => {
    workerRef.current?.postMessage({ type: 'HEAVY_COMPUTATION', data });
  };

  return { runComputation };
};
`;

fs.writeFileSync(path.join('src', 'workers', 'example.ts'), workerExample);
console.log('✅ Created web worker example');

// 7. Performance config
const performanceConfig = `
export const performanceConfig = {
  // Lazy loading thresholds
  lazyLoadThreshold: '50px',
  
  // Debounce delays
  searchDebounceDelay: 300,
  resizeDebounceDelay: 150,
  
  // Cache TTLs
  apiCacheTTL: 5 * 60 * 1000, // 5 minutes
  staticCacheTTL: 24 * 60 * 60 * 1000, // 24 hours
  
  // Batch sizes
  defaultBatchSize: 20,
  maxBatchSize: 100,
  
  // Performance marks
  marks: {
    appStart: 'app-start',
    firstPaint: 'first-paint',
    interactive: 'interactive',
  },
};
`;

fs.writeFileSync(path.join('src', 'config', 'performance.ts'), performanceConfig);
console.log('✅ Created performance configuration');

console.log('\nPerformance optimizations complete!');
console.log('Monitor performance with Chrome DevTools and Lighthouse.');