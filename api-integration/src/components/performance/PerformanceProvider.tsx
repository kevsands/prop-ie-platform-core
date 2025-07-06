'use client';

import React, { useEffect, createContext, useContext, useState } from 'react';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { preloadCriticalRoutes } from '@/lib/performance/lazy-loader';

interface PerformanceContextValue {
  metrics: any;
  resources: any;
  isOnline: boolean;
  networkInfo: any;
  memoryInfo: any;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

export function usePerformance() {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}

export default function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const { metrics, resources, getNetworkInfo, getMemoryUsage } = usePerformanceOptimization();
  const [isOnline, setIsOnline] = useState(true);
  const [networkInfo, setNetworkInfo] = useState<any>(null);
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    // Monitor online status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    // Monitor network information
    const updateNetworkInfo = () => setNetworkInfo(getNetworkInfo());
    updateNetworkInfo();
    
    // Monitor memory usage
    const updateMemoryInfo = () => setMemoryInfo(getMemoryUsage());
    updateMemoryInfo();
    const memoryInterval = setInterval(updateMemoryInfo, 10000); // Check every 10 seconds

    // Preload critical routes based on user behavior
    preloadCriticalRoutes();

    // Report Web Vitals to analytics
    if ('web-vitals' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
      });
    }

    // Enable Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const lazyImage = entry.target as HTMLImageElement;
            if (lazyImage.dataset.src) {
              lazyImage.src = lazyImage.dataset.src;
              lazyImage.classList.add('loaded');
              imageObserver.unobserve(lazyImage);
            }
          }
        });
      });

      // Observe all lazy images
      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach((img) => imageObserver.observe(img));
    }

    // Prefetch visible links
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const links = document.querySelectorAll('a[href^="/"]');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const link = entry.target as HTMLAnchorElement;
              const href = link.getAttribute('href');
              if (href && !link.dataset.prefetched) {
                // Prefetch the route
                fetch(href, { method: 'HEAD' });
                link.dataset.prefetched = 'true';
              }
            }
          });
        });

        links.forEach((link) => observer.observe(link));
      });
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      clearInterval(memoryInterval);
    };
  }, [getNetworkInfo, getMemoryUsage]);

  // Log performance warnings
  useEffect(() => {
    if (metrics) {
      // Check for poor performance
      if (metrics.lcp > 2500) {
        console.warn('Poor LCP detected:', metrics.lcp);
      }
      if (metrics.fid > 100) {
        console.warn('Poor FID detected:', metrics.fid);
      }
      if (metrics.cls > 0.1) {
        console.warn('Poor CLS detected:', metrics.cls);
      }
    }
  }, [metrics]);

  // Monitor memory usage and warn if high
  useEffect(() => {
    if (memoryInfo && memoryInfo.usedJSHeapSize) {
      const usage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
      if (usage > 0.9) {
        console.warn('High memory usage detected:', `${(usage * 100).toFixed(2)}%`);
      }
    }
  }, [memoryInfo]);

  return (
    <PerformanceContext.Provider value={{ metrics, resources, isOnline, networkInfo, memoryInfo }}>
      {children}
    </PerformanceContext.Provider>
  );
}