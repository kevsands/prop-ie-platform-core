'use client';

/**
 * Feature Flag Component
 * 
 * This component provides a clean way to conditionally render UI elements
 * based on feature flags. It supports both client and server components.
 */

import React, { useState, useEffect } from 'react';
import { isFeatureEnabled } from '@/lib/features/featureFlags';

interface FeatureFlagProps {
  name: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Feature Flag component that conditionally renders content
 * based on whether a feature flag is enabled or not.
 * 
 * @example
 * <FeatureFlag name="new-dashboard">
 *   <NewDashboard />
 * </FeatureFlag>
 * 
 * @example
 * <FeatureFlag name="advanced-analytics" fallback={<BasicAnalytics />}>
 *   <AdvancedAnalytics />
 * </FeatureFlag>
 */
export function FeatureFlag({ name, fallback = null, children }: FeatureFlagProps) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    let isMounted = true;
    
    async function checkFeatureFlag() {
      try {
        const isEnabled = await isFeatureEnabled(name);
        if (isMounted) {
          setEnabled(isEnabled);
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Error checking feature flag '${name}':`, err);
          setError(err instanceof Error ? err : new Error(String(err)));
          setEnabled(false); // Default to disabled on error
        }
      }
    }
    
    checkFeatureFlag();
    
    return () => {
      isMounted = false;
    };
  }, [name]);
  
  // Show nothing while loading to avoid flashes of content
  if (enabled === null && !error) {
    return null;
  }
  
  // Show fallback on error or when feature is disabled
  if (error || !enabled) {
    return <>{fallback}</>;
  }
  
  // Show actual content when feature is enabled
  return <>{children}</>;
}

/**
 * Feature Flag component that only renders in specific environments
 * 
 * @example
 * <EnvironmentFlag environments={['development', 'staging']}>
 *   <DebugPanel />
 * </EnvironmentFlag>
 */
export function EnvironmentFlag({ 
  environments, 
  children, 
  fallback = null 
}: { 
  environments: string[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  const currentEnv = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'development';
  
  if (environments.includes(currentEnv)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
}

export default FeatureFlag;