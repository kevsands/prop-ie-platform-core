# Prefetching Guide for App Router

This guide explains how prefetching is implemented in our Next.js application using App Router.

## What is Prefetching?

Prefetching is a technique to preload future navigations before the user clicks on a link. This improves performance by making subsequent page loads feel instantaneous.

Next.js App Router has built-in support for prefetching through:

1. Automatic prefetching for visible `<Link>` components
2. Manual prefetching using `router.prefetch()`

## 1. Link Component Prefetching

By default, Next.js prefetches all `<Link>` components in the viewport. You can control this behavior with the `prefetch` prop:

```tsx
// Always prefetch, regardless of viewport visibility
<Link href="/properties/123" prefetch={true}>
  View Property
</Link>

// Never prefetch
<Link href="/properties/123" prefetch={false}>
  View Property
</Link>
```

### Implementation in Our Codebase

We've implemented prefetching in key components:

#### PropertyCard Component

```tsx
<Link 
  href={`/properties/${property.id}`} 
  prefetch={true}
  className="group block bg-white rounded-lg shadow-md overflow-hidden"
>
  Property Details
</Link>
```

This ensures property detail pages are prefetched when cards are in the viewport, improving the browsing experience when users are looking at property listings.

## 2. Programmatic Prefetching

For more complex scenarios, we use `router.prefetch()` to programmatically prefetch pages:

```tsx
import { useRouter } from 'next/navigation';

// Inside a component
const router = useRouter();

// Prefetch a specific route
router.prefetch('/properties/123');
```

### Implementation in Our Codebase

#### HomePage Component

We prefetch featured properties and developments:

```tsx
// Component to handle programmatic prefetching of featured properties
const PrefetchFeaturedProperties = () => {
  useEffect(() => {
    // Featured property and development IDs
    const featuredPropertyIds = ['prop-1', 'prop-2', 'prop-3', 'prop-4'];
    const featuredDevelopmentIds = ['dev-1', 'dev-2'];
    
    // Prefetch property detail pages
    featuredPropertyIds.forEach(id => {
      router.prefetch(`/properties/${id}`);
    });
    
    // Prefetch development detail pages
    featuredDevelopmentIds.forEach(id => {
      router.prefetch(`/developments/${id}`);
    });
  }, []);
  
  return null;
};
```

#### DevelopmentDetail Component

We prefetch related developments and unit pages:

```tsx
// Prefetch related/similar developments and units
useEffect(() => {
  if (development) {
    // Prefetch similar developments
    const similarDevelopments = mockDevelopments
      .filter(dev => 
        dev.id !== developmentId && 
        (dev.location === development.location || dev.type === development.type)
      )
      .slice(0, 3);
    
    // Prefetch similar development pages
    similarDevelopments.forEach(dev => {
      router.prefetch(`/developments/${dev.id}`);
    });
    
    // Prefetch unit pages for the current development
    if (development.units && development.units.length > 0) {
      development.units.slice(0, 5).forEach(unit => {
        router.prefetch(`/projects/${developmentId}/units/${unit.id}`);
      });
    }
  }
}, [developmentId, development, router]);
```

## 3. Best Practices

1. **Selective Prefetching**: 
   - Don't prefetch everything—focus on likely next pages
   - Limit to 3-5 most probable navigation paths

2. **Progressive Prefetching**:
   - Prefetch critical paths first, then less critical ones
   - Stagger prefetching to avoid network congestion

3. **User Behavior Based**:
   - Analyze user journeys to determine which pages to prefetch
   - Prioritize high-conversion paths (e.g., product → checkout)

4. **Device & Network Awareness**:
   - Consider using `navigator.connection` to adjust prefetching strategy based on connection quality
   - Reduce or disable prefetching on slow connections or data-saving mode

## 4. Implementation Guidelines

### When to Use `prefetch={true}`

- Primary CTAs and navigation elements
- Important property or development links
- High-traffic, likely-to-click links

### When to Use Programmatic Prefetching

- For dynamically determined routes
- When prefetching needs to be conditional
- For prefetching multiple related pages at once

### When to Avoid Prefetching

- Rarely visited pages
- Very large pages with many resources
- User-specific pages that require fresh data

## 5. Future Enhancements

1. **Intelligent Prefetching**:
   - Implement machine learning to predict which pages users are likely to visit next
   - Adjust prefetching based on user behavior analytics

2. **Data Prefetching**:
   - Use React Query or SWR to prefetch not just routes but API data
   - Prefetch common API calls to have data ready before navigation

3. **Partial Prefetching**:
   - Consider implementing partial prefetching for large pages
   - Prefetch critical parts first, then the rest on demand

## Conclusion

Prefetching significantly improves perceived performance by making navigations feel instantaneous. By strategically implementing prefetching in our application, we ensure users have a smooth, responsive experience while navigating through properties and developments.