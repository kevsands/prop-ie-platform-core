/**
 * Feature Flag System
 * 
 * This module provides a feature flag system for controlled rollout of new features.
 * It supports different types of feature flags:
 * - Boolean flags (enable/disable)
 * - Percentage rollout (gradual release to users)
 * - User segment targeting (e.g., by role, email domain, etc.)
 * - Environment-specific flags
 */

import { getCurrentUser } from 'aws-amplify/auth';

/**
 * Feature flag configuration type
 */
export type FeatureFlagConfig = 
  | BooleanFeatureFlag 
  | PercentageFeatureFlag 
  | UserSegmentFeatureFlag
  | EnvironmentFeatureFlag;

/**
 * Simple boolean feature flag (on/off)
 */
interface BooleanFeatureFlag {
  type: 'boolean';
  enabled: boolean;
  description?: string;
}

/**
 * Percentage rollout feature flag (gradual rollout)
 */
interface PercentageFeatureFlag {
  type: 'percentage';
  percentage: number;  // 0-100
  seed?: string;       // Optional seed for consistent hashing
  description?: string;
}

/**
 * User segment targeting feature flag
 */
interface UserSegmentFeatureFlag {
  type: 'userSegment';
  segments: UserSegment[];
  defaultEnabled: boolean;
  description?: string;
}

/**
 * Environment-specific feature flag
 */
interface EnvironmentFeatureFlag {
  type: 'environment';
  environments: {
    [key: string]: boolean;  // e.g., dev: true, prod: false
  };
  description?: string;
}

/**
 * User segment definition
 */
interface UserSegment {
  segmentName: string;
  segmentType: 'role' | 'email' | 'domain' | 'id' | 'property';
  segmentValue: string | string[];
  enabled: boolean;
}

/**
 * Current environment
 */
export const ENVIRONMENT = 
  process.env.NEXT_PUBLIC_ENVIRONMENT || 
  process.env.NODE_ENV || 
  'development';

/**
 * Default feature flags configuration
 * This can be overridden by server-side configuration
 */
const DEFAULT_FEATURE_FLAGS: Record<string, FeatureFlagConfig> = {
  // Boolean feature flags
  'enable-mfa': {
    type: 'boolean',
    enabled: true,
    description: 'Enable multi-factor authentication'
  },

  // Environment-specific feature flags
  'advanced-security': {
    type: 'environment',
    environments: {
      development: true,
      test: true,
      staging: true,
      production: true
    },
    description: 'Enable advanced security features'
  },

  // Percentage rollout feature flags
  'new-dashboard': {
    type: 'percentage',
    percentage: 25,
    seed: 'dashboard-2025-04',
    description: 'New dashboard UI'
  },

  // User segment targeting feature flags
  'api-rate-limiting': {
    type: 'userSegment',
    segments: [
      {
        segmentName: 'developers',
        segmentType: 'role',
        segmentValue: ['admin', 'developer'],
        enabled: false // Developers are exempt from rate limiting
      },
      {
        segmentName: 'internal-users',
        segmentType: 'domain',
        segmentValue: 'prop-ie.com',
        enabled: false
      }
    ],
    defaultEnabled: true, // Rate limiting is on by default
    description: 'API rate limiting rules'
  },

  // Default feature flags for control flow
  'enable-session-fingerprinting': {
    type: 'environment',
    environments: {
      development: true,
      test: true,
      staging: true,
      production: true
    },
    description: 'Enable session fingerprinting for security'
  },

  'enable-session-recording': {
    type: 'environment',
    environments: {
      development: false,
      test: true,
      staging: true,
      production: true
    },
    description: 'Enable session recording for debugging and user experience analysis'
  },

  'enable-audit-logging': {
    type: 'environment',
    environments: {
      development: true,
      test: true,
      staging: true,
      production: true
    },
    description: 'Enable comprehensive audit logging'
  }
};

/**
 * Server-provided feature flags (will be populated from API)
 */
let serverFeatureFlags: Record<string, FeatureFlagConfig> = {};

/**
 * Cache of evaluated feature flags for the current user
 */
const evaluatedFlagsCache: Record<string, boolean> = {};

/**
 * Last time the feature flags were fetched from the server
 */
let lastFetchTime = 0;
const FETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

/**
 * Initialize feature flags
 */
export async function initializeFeatureFlags(): Promise<void> {
  try {
    if (typeof window === 'undefined') {
      // Server-side initialization
      return;
    }

    // Reset cache
    Object.keys(evaluatedFlagsCache).forEach(key => {
      delete evaluatedFlagsCache[key];
    });

    // Fetch feature flags from server if we haven't fetched recently
    if (Date.now() - lastFetchTime> FETCH_INTERVAL) {
      await fetchFeatureFlagsFromServer();
    }
  } catch (error) {

  }
}

/**
 * Fetch feature flags from server
 */
async function fetchFeatureFlagsFromServer(): Promise<void> {
  try {
    // Make API request to fetch current feature flags
    // This would typically be an authenticated endpoint that returns
    // user-specific feature flag configurations

    // For now, we'll use a mock implementation
    const response = await fetch('/api/feature-flags').catch(() => null);

    if (response && response.ok) {
      const data = await response.json();
      serverFeatureFlags = data.featureFlags || {};
      lastFetchTime = Date.now();
    }
  } catch (error) {

  }
}

/**
 * Check if a feature flag is enabled
 */
export async function isFeatureEnabled(featureName: string): Promise<boolean> {
  // Check cache first
  if (evaluatedFlagsCache[featureName] !== undefined) {
    return evaluatedFlagsCache[featureName];
  }

  // Get feature flag configuration
  const flagConfig = serverFeatureFlags[featureName] || DEFAULT_FEATURE_FLAGS[featureName];

  if (!flagConfig) {
    // If flag doesn't exist, default to disabled
    evaluatedFlagsCache[featureName] = false;
    return false;
  }

  // Evaluate the feature flag based on its type
  const isEnabled = await evaluateFeatureFlag(flagConfig);

  // Cache the result
  evaluatedFlagsCache[featureName] = isEnabled;

  return isEnabled;
}

/**
 * Evaluate a feature flag based on its configuration
 */
async function evaluateFeatureFlag(flagConfig: FeatureFlagConfig): Promise<boolean> {
  switch (flagConfig.type) {
    case 'boolean':
      return flagConfig.enabled;

    case 'environment':
      return !!flagConfig.environments[ENVIRONMENT];

    case 'percentage':
      return evaluatePercentageFlag(flagConfig);

    case 'userSegment':
      return evaluateUserSegmentFlag(flagConfig);

    default:
      return false;
  }
}

/**
 * Evaluate a percentage rollout feature flag
 */
async function evaluatePercentageFlag(flag: PercentageFeatureFlag): Promise<boolean> {
  try {
    const user = await getCurrentUser().catch(() => null);
    const userId = user?.userId || 'anonymous';

    // Create a hash based on user ID and optional seed
    const seed = flag.seed || 'default-seed';
    const hash = simpleHash(`${seed}-${userId}`);

    // Convert hash to a percentage (0-100)
    const userPercentile = hash % 100;

    // Check if user falls within the rollout percentage
    return userPercentile <flag.percentage;
  } catch (error) {

    return false;
  }
}

/**
 * Evaluate a user segment feature flag
 */
async function evaluateUserSegmentFlag(flag: UserSegmentFeatureFlag): Promise<boolean> {
  try {
    const user = await getCurrentUser().catch(() => null);

    if (!user) {
      return flag.defaultEnabled;
    }

    // Get user attributes
    const userId = user.userId;
    const userEmail = user.email || '';
    const userDomain = userEmail.split('@')[1] || '';

    // Get custom attributes
    const attributes = await fetch('/api/user/attributes')
      .then(res => res.json())
      .catch(() => ({}));

    const userRole = attributes.role || '';

    // Check if user matches any segment
    for (const segment of flag.segments) {
      let isMatch = false;

      switch (segment.segmentType) {
        case 'role':
          isMatch = Array.isArray(segment.segmentValue)
            ? segment.segmentValue.includes(userRole)
            : segment.segmentValue === userRole;
          break;

        case 'email':
          isMatch = Array.isArray(segment.segmentValue)
            ? segment.segmentValue.includes(userEmail)
            : segment.segmentValue === userEmail;
          break;

        case 'domain':
          isMatch = Array.isArray(segment.segmentValue)
            ? segment.segmentValue.includes(userDomain)
            : userDomain.endsWith(segment.segmentValue as string);
          break;

        case 'id':
          isMatch = Array.isArray(segment.segmentValue)
            ? segment.segmentValue.includes(userId)
            : segment.segmentValue === userId;
          break;

        case 'property':
          if (typeof segment.segmentValue === 'string') {
            const [propertyvalue] = segment.segmentValue.split(':');
            isMatch = attributes[property] === value;
          }
          break;
      }

      if (isMatch) {
        return segment.enabled;
      }
    }

    // If no segment matched, return default
    return flag.defaultEnabled;
  } catch (error) {

    return flag.defaultEnabled;
  }
}

/**
 * Simple hashing function for percentage rollout
 */
function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i <input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash <<5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * React hook for using feature flags in components
 */
export function useFeatureFlag(featureName: string, defaultValue = false): boolean {
  const [isEnabledsetIsEnabled] = React.useState<boolean>(defaultValue);

  React.useEffect(() => {
    let isMounted = true;

    isFeatureEnabled(featureName).then(enabled => {
      if (isMounted) {
        setIsEnabled(enabled);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [featureName]);

  return isEnabled;
}

/**
 * Get all feature flags for administrative purposes
 */
export async function getAllFeatureFlags(): Promise<Record<string, { config: FeatureFlagConfig, enabled: boolean }>> {
  const allFlags = { ...DEFAULT_FEATURE_FLAGS, ...serverFeatureFlags };
  const result: Record<string, { config: FeatureFlagConfig, enabled: boolean }> = {};

  for (const [nameconfig] of Object.entries(allFlags)) {
    const enabled = await evaluateFeatureFlag(config);
    result[name] = { config, enabled };
  }

  return result;
}

// Initialize feature flags on module load (client-side only)
if (typeof window !== 'undefined') {
  initializeFeatureFlags().catch(console.error);
}