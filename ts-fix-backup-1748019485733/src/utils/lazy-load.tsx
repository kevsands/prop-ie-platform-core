
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

export const lazyLoad = (importFunc: () => Promise<any>, fallback = <Spinner size="md" variant="primary" />) => {
  return dynamic(importFunc, {
    loading: () => fallback,
    ssr: false
  });
};

// Example usage:
// const HeavyComponent = lazyLoad(() => import('./HeavyComponent'));
