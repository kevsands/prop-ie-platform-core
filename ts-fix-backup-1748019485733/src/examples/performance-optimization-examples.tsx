/**
 * Performance Optimization Examples
 * 
 * This file demonstrates how to use the optimized utilities for:
 * - Enhanced caching with deduplication
 * - React Query with persistent cache and optimistic updates
 * - Centralized API client
 * - Real-time data subscriptions
 */

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiCache, cacheFactory, CACHE_DURATION, deduplicate } from '../utils/performance/enhancedCache';
import { queryClient, QUERY_KEYS, createOptimisticHelpers } from '../utils/queryClient';
import { apiClient, CACHE_TAGS } from '../utils/apiClient';
import { useSubscription } from '../utils/subscriptionManager';

// Example interfaces
interface Property {
  id: string;
  name: string;
  price: number;
  description: string;
  status: 'available' | 'pending' | 'sold';
}

interface User {
  id: string;
  name: string;
  email: string;
}

/**
 * Example 1: Enhanced Cache Usage
 * Demonstrates the enhanced cache with deduplication and size limiting
 */
export function EnhancedCacheExample() {
  const [datasetData] = useState<Property[] | null>(null);
  const [loadingsetLoading] = useState(false);
  const [cacheStatssetCacheStats] = useState<any>(null);
  
  // Function to fetch data with caching
  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Use the cache's getOrFetch to avoid redundant network requests
      const result = await apiCache.getOrFetch<Property[]>(
        'properties:all',
        async () => {
          // Simulate API call
          const response = await fetch('/api/properties');
          if (!response.ok) throw new Error('Network error');
          return response.json();
        },
        CACHE_DURATION.MEDIUM, // Cache for 5 minutes
        [CACHE_TAGS.PROPERTIES] // Add cache tags for invalidation
      );
      
      setData(result);
      // Get cache statistics
      setCacheStats(apiCache.getStats());
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to invalidate cache
  const invalidateCache = () => {
    apiCache.invalidateByTag(CACHE_TAGS.PROPERTIES);
    setCacheStats(apiCache.getStats());
  };
  
  useEffect(() => {
    fetchProperties();
  }, []);
  
  return (
    <div>
      <h2>Enhanced Cache Example</h2>
      <button onClick={fetchProperties} disabled={loading}>
        {loading ? 'Loading...' : 'Refresh Data'}
      </button>
      <button onClick={invalidateCache}>Invalidate Cache</button>
      
      {cacheStats && (
        <div>
          <h3>Cache Stats</h3>
          <pre>{JSON.stringify(cacheStats, null2)}</pre>
        </div>
      )}
      
      {data && (
        <ul>
          {data.map(property: any => (
            <li key={property.id}>
              {property.name} - ${property.price} ({property.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 2: React Query with Optimistic Updates
 * Demonstrates using React Query with the optimized client
 */
export function ReactQueryExample() {
  // Query for fetching properties
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES],
    queryFn: async () => {
      const response = await apiClient.get<Property[]>('/properties', {}, {
        cacheTags: [CACHE_TAGS.PROPERTIES],
        cacheTtl: CACHE_DURATION.MEDIUM
      });
      return response;
    }
  });
  
  // Get optimistic helpers for the properties query
  const helpers = createOptimisticHelpers<Property>([QUERY_KEYS.PROPERTIES]);
  
  // Mutation for updating a property
  const { mutate, isPending } = useMutation({
    mutationFn: async (updatedProperty: Partial<Property> & { id: string }) => {
      return apiClient.patch<Property>(`/properties/${updatedProperty.id}`, updatedProperty, {
        cacheTags: [CACHE_TAGS.PROPERTIES]
      });
    },
    // Use onMutate for optimistic updates
    onMutate: async (newProperty: any) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
      
      // Snapshot the previous value
      const previousProperties = helpers.getCurrentData();
      
      // Optimistically update to the new value
      helpers.updateItem('id', newProperty.id, newProperty: any);
      
      // Return the snapshot
      return { previousProperties };
    },
    // If an error occurs, revert to the previous state
    onError: (err: any, newProperty: any, context: any) => {
      helpers.resetToPreviousState(context?.previousProperties);
    },
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
    }
  });
  
  // Function to mark a property as sold
  const markAsSold = (id: string) => {
    mutate({ id, status: 'sold' });
  };
  
  return (
    <div>
      <h2>React Query with Optimistic Updates</h2>
      <button onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refresh Data'}
      </button>
      
      {data && (
        <ul>
          {data.map(property: any => (
            <li key={property.id}>
              {property.name} - ${property.price} ({property.status})
              {property.status !== 'sold' && (
                <button 
                  onClick={() => markAsSold(property.id)}
                  disabled={isPending}
                >
                  Mark as Sold
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 3: Deduplication for Concurrent API Calls
 * Demonstrates request deduplication
 */
export function RequestDeduplicationExample() {
  const [userssetUsers] = useState<User[]>([]);
  const [loadingsetLoading] = useState(false);
  const [statssetStats] = useState({ calls: 0, deduped: 0 });
  
  // Wrapped fetch function with deduplication
  const fetchUserById = deduplicate(async (id: string): Promise<User> => {
    // Track calls for demonstration
    setStats(prev => ({ ...prev, calls: prev.calls + 1 }));
    
    // Simulate API call
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) throw new Error('Network error');
    return response.json();
  });
  
  // Function to fetch multiple users concurrently (with potential duplicates)
  const fetchUsers = async () => {
    setLoading(true);
    setStats({ calls: 0, deduped: 0 });
    
    try {
      // Intentionally fetch same IDs multiple times to demonstrate deduplication
      const userIds = ['user1', 'user2', 'user1', 'user3', 'user2'];
      const dedupedIds = [...new Set(userIds)]; // For stats only
      
      // Fetch all users concurrently
      const results = await Promise.all(userIds.map(id => fetchUserById(id)));
      
      setUsers(results);
      setStats(prev => ({ 
        calls: prev.calls,
        deduped: userIds.length - prev.calls // Calculate deduped requests
      }));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Request Deduplication Example</h2>
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Users (with duplicates)'}
      </button>
      
      <div>
        <p>Total requests initiated: 5</p>
        <p>Actual network requests: {stats.calls}</p>
        <p>Deduplicated requests: {stats.deduped}</p>
      </div>
      
      {users.length> 0 && (
        <ul>
          {users.map((userindex) => (
            <li key={index}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 4: Real-time Subscriptions
 * Demonstrates the subscription manager
 */
export function RealTimeSubscriptionExample() {
  // Subscribe to property status changes
  const { 
    data: propertyUpdates,
    status,
    isActive,
    pause,
    resume
  } = useSubscription<Property>({
    topic: 'property:status:updates',
    // Only show available properties
    filter: (property: any) => property.status === 'available',
    // Update React Query cache when new data arrives
    queryKeys: [[QUERY_KEYS.PROPERTIES]],
    // Invalidate cache tags
    cacheTags: [CACHE_TAGS.PROPERTIES],
    // Batch updates to reduce re-renders
    batchUpdates: true,
    batchInterval: 500
  });
  
  return (
    <div>
      <h2>Real-time Subscription Example</h2>
      <div>Status: {status}</div>
      
      <div>
        <button onClick={pause} disabled={!isActive}>Pause Updates</button>
        <button onClick={resume} disabled={isActive}>Resume Updates</button>
      </div>
      
      {propertyUpdates && (
        <div>
          <h3>Latest Update</h3>
          <pre>{JSON.stringify(propertyUpdates, null2)}</pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: Combining All Optimizations
 * Shows how all techniques work together
 */
export function ComprehensiveExample() {
  const [userCache] = useState(() => 
    cacheFactory.createUserCache('current-user')
  );
  
  // Track requests
  const [requestCountsetRequestCount] = useState(0);
  
  // Step 1: Fetch user data with cache
  const { data: user } = useQuery({
    queryKey: [QUERY_KEYS.USER_PROFILE],
    queryFn: async () => {
      setRequestCount(prev => prev + 1);
      
      // Try to get from cache first
      const cached = userCache.get<User>('current-user');
      if (cached) return cached;
      
      // Fetch and cache
      const response = await apiClient.get<User>('/users/me', {}, {
        cacheTags: [CACHE_TAGS.USER],
        deduplicate: true
      });
      
      userCache.set('current-user', response, CACHE_DURATION.SHORT);
      return response;
    },
    staleTime: CACHE_DURATION.SHORT
  });
  
  // Step 2: Fetch properties with optimistic updates
  const { 
    data: properties, 
    isLoading: propertiesLoading 
  } = useQuery({
    queryKey: [QUERY_KEYS.PROPERTIES, user?.id],
    queryFn: async () => {
      setRequestCount(prev => prev + 1);
      
      return apiClient.get<Property[]>('/properties', {
        userId: user?.id
      }, {
        cacheTags: [CACHE_TAGS.PROPERTIES, CACHE_TAGS.USER],
        deduplicate: true
      });
    },
    enabled: !!user?.id, // Only run when user ID is available
    staleTime: CACHE_DURATION.MEDIUM
  });
  
  // Step 3: Subscribe to real-time updates for these properties
  const { isActive: subscriptionActive } = useSubscription<Property>({
    topic: `user:${user?.id}:property:updates`,
    queryKeys: [[QUERY_KEYS.PROPERTIES, user?.id]],
    cacheTags: [CACHE_TAGS.PROPERTIES],
    batchUpdates: true,
    filter: (update) => {
      // Only handle updates for properties we're showing
      return properties?.some(p: any => p.id === update.id) || false;
    }
  });
  
  return (
    <div>
      <h2>Comprehensive Optimization Example</h2>
      <div>Total API Requests: {requestCount}</div>
      <div>Subscription Active: {subscriptionActive ? 'Yes' : 'No'}</div>
      
      {user && (
        <div>
          <h3>Current User</h3>
          <p>{user.name} ({user.email})</p>
        </div>
      )}
      
      <h3>Properties</h3>
      {propertiesLoading ? (
        <p>Loading properties...</p>
      ) : (
        <ul>
          {properties?.map(property: any => (
            <li key={property.id}>
              {property.name} - ${property.price} ({property.status})
            </li>
          ))}
        </ul>
      )}
      
      {/* Cache and performance stats would go here */}
    </div>
  );
}

/**
 * Main Demo Component
 */
export default function PerformanceOptimizationDemo() {
  return (
    <div>
      <h1>Performance Optimization Examples</h1>
      <EnhancedCacheExample />
      <hr />
      <ReactQueryExample />
      <hr />
      <RequestDeduplicationExample />
      <hr />
      <RealTimeSubscriptionExample />
      <hr />
      <ComprehensiveExample />
    </div>
  );
}