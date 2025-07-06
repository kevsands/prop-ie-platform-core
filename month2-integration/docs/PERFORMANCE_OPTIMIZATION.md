# Performance Optimization Guide

This guide explains the performance optimization features implemented in the application, including caching strategies, request deduplication, and subscription handling for real-time data.

## Table of Contents

1. [Enhanced Caching](#enhanced-caching)
2. [React Query Configuration](#react-query-configuration)
3. [Centralized API Client](#centralized-api-client)
4. [Real-time Subscriptions](#real-time-subscriptions)
5. [Best Practices](#best-practices)
6. [Performance Monitoring](#performance-monitoring)

## Enhanced Caching

The application uses a comprehensive caching system with various strategies to optimize performance.

### EnhancedCache

The `EnhancedCache` utility (`src/utils/performance/enhancedCache.ts`) provides advanced caching capabilities:

```typescript
import { apiCache, CACHE_DURATION } from '../utils/performance/enhancedCache';

// Store data in cache
apiCache.set('user:profile', userData, CACHE_DURATION.MEDIUM, ['user']);

// Retrieve data (returns undefined if not in cache or expired)
const cachedUser = apiCache.get('user:profile');

// Get or fetch data (with deduplication of concurrent calls)
const data = await apiCache.getOrFetch(
  'properties:listing',
  async () => {
    // This fetch function will only be called if data isn't in cache
    const response = await fetch('/api/properties');
    return response.json();
  },
  CACHE_DURATION.MEDIUM, // Cache TTL 
  ['properties'] // Cache tags for invalidation
);

// Invalidate cache by tag
apiCache.invalidateByTag('properties');
```

### Cache Factories

The `cacheFactory` provides specialized caches for different data types:

```typescript
import { cacheFactory } from '../utils/performance/enhancedCache';

// Create specialized caches
const apiCache = cacheFactory.createApiCache();
const uiStateCache = cacheFactory.createUiStateCache();
const resourceCache = cacheFactory.createResourceCache();
const userCache = cacheFactory.createUserCache('user-123');
```

### Function Result Caching

Use the `enhancedSafeCache` and `enhancedAsyncCache` utilities to cache function results:

```typescript
import { enhancedAsyncCache } from '../utils/performance/enhancedCache';

// Cache expensive async function results
const fetchUserData = enhancedAsyncCache(
  async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  { 
    cacheTTL: 300000, // 5 minutes 
    deduplicate: true // Deduplicate concurrent calls
  }
);
```

### Request Deduplication

The `deduplicate` utility prevents redundant API calls:

```typescript
import { deduplicate } from '../utils/performance/enhancedCache';

// Create a function that deduplicates concurrent calls with the same parameters
const fetchData = deduplicate(
  async (id: string) => {
    const response = await fetch(`/api/data/${id}`);
    return response.json();
  },
  {
    getKey: (id) => `data_${id}`, // Optional custom key function
    ttl: 5000 // How long to deduplicate (ms)
  }
);

// These two calls will only result in ONE network request
const [data1, data2] = await Promise.all([
  fetchData('123'),
  fetchData('123')
]);
```

## React Query Configuration

The application uses React Query for data fetching with an optimized configuration.

### Query Client Setup

The `queryClient.ts` module provides a pre-configured client:

```typescript
import { queryClient, QUERY_KEYS, STALE_TIMES } from '../utils/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../utils/apiClient';

// Use pre-defined query keys and stale times
const { data, isLoading } = useQuery({
  queryKey: [QUERY_KEYS.PROPERTIES],
  queryFn: () => apiClient.get('/properties'),
  staleTime: STALE_TIMES.PROPERTIES
});
```

### Optimistic Updates

The `createOptimisticHelpers` utility makes optimistic updates easy:

```typescript
import { createOptimisticHelpers } from '../utils/queryClient';
import { useMutation } from '@tanstack/react-query';

// Get helpers for a specific query
const helpers = createOptimisticHelpers([QUERY_KEYS.PROPERTIES]);

// Use in mutation
const { mutate } = useMutation({
  mutationFn: (property) => apiClient.put(`/properties/${property.id}`, property),
  onMutate: async (newProperty) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.PROPERTIES] });
    
    // Snapshot the previous value
    const previousProperties = helpers.getCurrentData();
    
    // Optimistically update
    helpers.updateItem('id', newProperty.id, newProperty);
    
    return { previousProperties };
  },
  onError: (err, newProperty, context) => {
    // Revert on error
    helpers.resetToPreviousState(context?.previousProperties);
  }
});
```

### Persistent Cache

React Query's cache is automatically persisted to `localStorage` for offline support and faster loads:

```typescript
// No special code needed - persistence is built into the queryClient
// To force a fresh fetch, use the refetchQueries method:
queryClient.refetchQueries({ queryKey: [QUERY_KEYS.USER], type: 'active' });
```

## Centralized API Client

The `apiClient` utility centralizes all API requests with advanced features.

### Basic Usage

```typescript
import { apiClient, CACHE_TAGS } from '../utils/apiClient';

// GET request
const properties = await apiClient.get('/properties', { limit: 10 });

// POST request
const newProperty = await apiClient.post('/properties', {
  name: 'New Property',
  price: 500000
});

// PUT request
await apiClient.put(`/properties/${id}`, updatedData);

// DELETE request
await apiClient.delete(`/properties/${id}`);
```

### Advanced Features

```typescript
// Request with caching, tags, and deduplication
const properties = await apiClient.get('/properties', 
  { type: 'residential' },
  {
    cacheTtl: 300000, // 5 minutes
    cacheTags: [CACHE_TAGS.PROPERTIES],
    deduplicate: true,
    timeout: 5000, // 5 seconds
    retries: 2 // Retry twice on failure
  }
);

// Batch multiple requests
const [properties, users] = await apiClient.batchGet([
  { path: '/properties', params: { limit: 10 } },
  { path: '/users', params: { active: true } }
]);

// Invalidate cache
apiClient.invalidateByTags([CACHE_TAGS.PROPERTIES]);
```

### Error Handling

```typescript
import { apiClient, ApiErrorType } from '../utils/apiClient';

try {
  const data = await apiClient.get('/properties');
} catch (error) {
  if (error.type === ApiErrorType.AUTH) {
    // Handle authentication error
  } else if (error.type === ApiErrorType.NETWORK) {
    // Handle network error
  }
}
```

## Real-time Subscriptions

The `subscriptionManager` provides efficient handling of WebSocket subscriptions.

### Basic Usage

```typescript
import { useSubscription } from '../utils/subscriptionManager';

// Hook usage in a component
function PropertyUpdates() {
  const { 
    data,         // Latest data received
    status,       // Connection status
    isLoading,    // True while connecting
    isActive,     // True when subscription is active
    pause,        // Function to pause subscription
    resume,       // Function to resume subscription
    unsubscribe   // Function to unsubscribe completely
  } = useSubscription({
    topic: 'property:updates',
    
    // Optional client-side filter
    filter: (data) => data.status === 'available',
    
    // Optional data transformer
    transform: (data) => ({
      ...data,
      formattedPrice: new Intl.NumberFormat().format(data.price)
    }),
    
    // Auto-update React Query cache
    queryKeys: [[QUERY_KEYS.PROPERTIES]],
    
    // Auto-invalidate cache tags
    cacheTags: [CACHE_TAGS.PROPERTIES],
    
    // Batch updates to reduce re-renders
    batchUpdates: true,
    batchInterval: 200
  });
  
  // Rest of your component...
}
```

### Advanced Control

For more complex scenarios, you can access the manager directly:

```typescript
import { useSubscription } from '../utils/subscriptionManager';

// Get the manager instance
const manager = useSubscription.manager;

// Get subscription statistics
const stats = manager.getStats();

// Update auth token (e.g., after user login)
manager.updateAuthToken(newToken);

// Clean up all subscriptions
manager.destroy();
```

## Best Practices

### Selecting the Right Cache Duration

Choose appropriate cache durations based on data volatility:

- **Very Short (10s)**: Highly dynamic data that changes frequently
- **Short (1m)**: User-specific data that changes occasionally
- **Medium (5m)**: Entity data that changes infrequently
- **Long (30m)**: Data that rarely changes during a session
- **Very Long (2h)**: Reference data that changes very rarely
- **Day (24h)**: Static content like configuration data

### Effective Cache Invalidation

Rather than using time-based expiration alone, implement proper cache invalidation:

1. **Use Cache Tags**: Tag related data for targeted invalidation
2. **Invalidate on Mutations**: Always invalidate relevant caches after mutation operations
3. **Selective Invalidation**: Only invalidate affected items, not entire caches

```typescript
// After creating a new property
await apiClient.post('/properties', newProperty);

// Invalidate only property caches, not everything
apiClient.invalidateByTags([CACHE_TAGS.PROPERTIES]);
```

### Optimizing Real-time Data

For real-time subscriptions:

1. **Use Client-side Filtering**: Reduce unnecessary component renders
2. **Batch Updates**: Use batchUpdates option for frequently changing data
3. **Pause Inactive Subscriptions**: Pause subscriptions for inactive tabs or components
4. **Limit Subscription Scope**: Subscribe to specific entities, not broad topics

## Performance Monitoring

Monitor the performance of your cache and API requests:

```typescript
// Get cache statistics
const cacheStats = apiCache.getStats();
console.log(cacheStats);

// Get subscription statistics
const subscriptionStats = useSubscription.manager.getStats();
console.log(subscriptionStats);
```

The application also includes automatic performance tracking, providing insights into:

- Cache hit/miss rates
- API response times
- Render performance
- Subscription efficiency

View these metrics in the Performance Dashboard in the admin section of the application.

## Example Usage Patterns

Check `/src/examples/performance-optimization-examples.tsx` for comprehensive examples of how to use these features together effectively.
EOL < /dev/null