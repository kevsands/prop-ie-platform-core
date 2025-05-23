import { asyncSafeCache } from '@/lib/utils/safeCache';
import { persistentCache as dataCache } from '@/lib/cache/dataCache';
import { AuditSeverity } from './auditLogger';

/**
 * Type representing a security event
 */
export interface SecurityEvent {
  id: string;
  timestamp: number;
  category: string;
  action: string;
  severity: AuditSeverity;
  userId: string;
  resource: string;
  resourceId?: string;
  description: string;
  status: 'success' | 'failure';
  ipAddress: string;
}

/**
 * Type representing security metrics/stats
 */
export interface SecurityStats {
  usersMfaEnabled: number;
  totalUsers: number;
  activeBlockedIPs: number;
  totalSecurityEvents: number;
  criticalEvents: number;
  warningEvents: number;
  avgRiskScore: number;
  securityScore: number;
}

/**
 * Type representing a feature flag
 */
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

/**
 * Options for fetching security events
 */
export interface SecurityEventOptions {
  limit?: number;
  offset?: number;
  severity?: AuditSeverity | AuditSeverity[];
  category?: string;
  startDate?: Date | number;
  endDate?: Date | number;
  status?: 'success' | 'failure';
}

/**
 * Fetch security events with caching
 * 
 * This function fetches security events for a user and caches the results
 * with a TTL to improve performance while ensuring data freshness.
 * 
 * @param userId The user ID to fetch events for
 * @param options Options for filtering events
 * @returns A promise that resolves to an array of security events
 */
export const getSecurityEvents = asyncSafeCache(async (
  userId: string, 
  options: SecurityEventOptions = {}
): Promise<SecurityEvent[]> => {
  const cacheKey = `security_events:${userId}:${JSON.stringify(options)}`;

  // Check cache first
  const cached = dataCache.get<SecurityEvent[]>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch data
    const queryParams = new URLSearchParams();
    if (options.limit) queryParams.append('limit', options.limit.toString());
    if (options.offset) queryParams.append('offset', options.offset.toString());
    if (options.category) queryParams.append('category', options.category);
    if (options.status) queryParams.append('status', options.status);
    if (options.startDate) queryParams.append('startDate', options.startDate.toString());
    if (options.endDate) queryParams.append('endDate', options.endDate.toString());

    // Handle severity filter
    if (options.severity) {
      if (Array.isArray(options.severity)) {
        options.severity.forEach(sev => queryParams.append('severity', sev.toString()));
      } else {
        queryParams.append('severity', options.severity.toString());
      }
    }

    const response = await fetch(`/api/security/events/${userId}?${queryParams.toString()}`, {
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to fetch security events: ${response.status}`);
    }

    const data = await response.json();

    // Cache with 5-minute TTL
    const typedData = data as SecurityEvent[];
    dataCache.set(cacheKey, typedData, 5 * 60 * 1000);

    return typedData;
  } catch (error) {

    // Return empty array on error
    return [];
  }
});

/**
 * Fetch security stats with caching
 * 
 * @returns A promise that resolves to security stats
 */
export const getSecurityStats = asyncSafeCache(async (): Promise<SecurityStats> => {
  const cacheKey = 'security_stats';

  // Check cache first
  const cached = dataCache.get<SecurityStats>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch data
    const response = await fetch('/api/security/stats', {
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to fetch security stats: ${response.status}`);
    }

    const data = await response.json();

    // Cache with 15-minute TTL (stats change less frequently)
    const typedData = data as SecurityStats;
    dataCache.set(cacheKey, typedData, 15 * 60 * 1000);

    return typedData;
  } catch (error) {

    // Return default stats on error
    return {
      usersMfaEnabled: 0,
      totalUsers: 0,
      activeBlockedIPs: 0,
      totalSecurityEvents: 0,
      criticalEvents: 0,
      warningEvents: 0,
      avgRiskScore: 0,
      securityScore: 0};
  }
});

/**
 * Fetch feature flags with caching
 * 
 * @returns A promise that resolves to an array of feature flags
 */
export const getFeatureFlags = asyncSafeCache(async (): Promise<FeatureFlag[]> => {
  const cacheKey = 'security_feature_flags';

  // Check cache first
  const cached = dataCache.get<FeatureFlag[]>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch data
    const response = await fetch('/api/security/features', {
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to fetch feature flags: ${response.status}`);
    }

    const data = await response.json();

    // Cache with 30-minute TTL (flags change infrequently)
    const typedData = data as FeatureFlag[];
    dataCache.set(cacheKey, typedData, 30 * 60 * 1000);

    return typedData;
  } catch (error) {

    // Return empty array on error
    return [];
  }
});

/**
 * Toggle a feature flag with cache invalidation
 * 
 * @param flagId The ID of the flag to toggle
 * @param enabled The new enabled state
 * @returns A promise that resolves to the updated feature flag
 */
export const toggleFeatureFlag = async (
  flagId: string, 
  enabled: boolean
): Promise<FeatureFlag> => {
  try {
    // Update the flag
    const response = await fetch(`/api/security/features/${flagId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'},
      body: JSON.stringify({ enabled })});

    if (!response.ok) {
      throw new Error(`Failed to toggle feature flag: ${response.status}`);
    }

    const updatedFlag = await response.json();

    // Invalidate the feature flags cache
    dataCache.delete('security_feature_flags');

    return updatedFlag as FeatureFlag;
  } catch (error) {

    throw error;
  }
};

/**
 * Interface for MFA setup data
 */
export interface MFASetupData {
  secret: string;
  qrCodeUrl: string;
  recoveryCodes?: string[];
  methods: string[];
  enabled: boolean;
  preferredMethod?: string;
}

/**
 * Get MFA setup data for a user with caching
 * 
 * @param userId The user ID to get MFA setup for
 * @returns A promise that resolves to MFA setup data
 */
export const getMFASetupData = asyncSafeCache(async (userId: string): Promise<MFASetupData> => {
  const cacheKey = `mfa_setup:${userId}`;

  // Check cache first
  const cached = dataCache.get<MFASetupData>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch data
    const response = await fetch(`/api/security/mfa/${userId}/setup`, {
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to fetch MFA setup data: ${response.status}`);
    }

    const data = await response.json();

    // Cache with 5-minute TTL
    const typedData = data as MFASetupData;
    dataCache.set(cacheKey, typedData, 5 * 60 * 1000);

    return typedData;
  } catch (error) {

    throw error;
  }
});

/**
 * Interface for trusted device data
 */
export interface TrustedDevice {
  id: string;
  name: string;
  browser: string;
  os: string;
  lastUsed: number;
  trusted: boolean;
  current: boolean;
  ip?: string;
  location?: string;
}

/**
 * Get trusted devices for a user with caching
 * 
 * @param userId The user ID to get trusted devices for
 * @returns A promise that resolves to an array of trusted devices
 */
export const getTrustedDevices = asyncSafeCache(async (userId: string): Promise<TrustedDevice[]> => {
  const cacheKey = `trusted_devices:${userId}`;

  // Check cache first
  const cached = dataCache.get<TrustedDevice[]>(cacheKey);
  if (cached) return cached;

  try {
    // Fetch data
    const response = await fetch(`/api/security/devices/${userId}`, {
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to fetch trusted devices: ${response.status}`);
    }

    const data = await response.json();

    // Cache with 5-minute TTL
    const typedData = data as TrustedDevice[];
    dataCache.set(cacheKey, typedData, 5 * 60 * 1000);

    return typedData;
  } catch (error) {

    return []; // Return empty array on error
  }
});

/**
 * Remove a trusted device
 * 
 * @param userId The user ID
 * @param deviceId The device ID to remove
 * @returns A promise that resolves when the device is removed
 */
export const removeTrustedDevice = async (userId: string, deviceId: string) => {
  try {
    // Remove the device
    const response = await fetch(`/api/security/devices/${userId}/${deviceId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'});

    if (!response.ok) {
      throw new Error(`Failed to remove trusted device: ${response.status}`);
    }

    // Invalidate the trusted devices cache
    dataCache.delete(`trusted_devices:${userId}`);

    return true;
  } catch (error) {

    throw error;
  }
};

export default {
  getSecurityEvents,
  getSecurityStats,
  getFeatureFlags,
  toggleFeatureFlag,
  getMFASetupData,
  getTrustedDevices,
  removeTrustedDevice
};