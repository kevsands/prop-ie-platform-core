# Component GraphQL Integration Examples

This directory contains examples showing how to integrate the UI component library with GraphQL data sources.

## Overview

These examples demonstrate how to:

1. Connect UI components to GraphQL queries and mutations
2. Use custom hooks for data fetching
3. Implement dashboard layouts with dynamic data
4. Handle loading and error states
5. Transform GraphQL responses to component props

## Files

- `component-graphql-integration.tsx`: Shows basic integration of financial components with GraphQL data
- `dashboard-layout-integration.tsx`: Demonstrates a complete dashboard with grid layout and data fetching
- `document-graphql-integration.tsx`: Shows document management integration with GraphQL
- `../hooks/useFinancialData.ts`: Custom hooks for fetching financial data from GraphQL
- `../hooks/useDocuments.ts`: Custom hooks for document management with GraphQL

## Component Integration Pattern

The recommended pattern for integrating components with GraphQL data is:

1. Define GraphQL queries in a separate file or alongside the component
2. Create custom hooks that use `useGraphQLQuery` or `useGraphQLMutation`
3. Use these hooks in your components to fetch data
4. Transform the GraphQL responses to match component prop interfaces
5. Handle loading and error states appropriately

### Example:

```tsx
// 1. Define your GraphQL query
const GET_FINANCIAL_METRICS = /* GraphQL */ `
  query GetFinancialMetrics($developmentId: ID!) {
    getDevelopmentFinancialMetrics(developmentId: $developmentId) {
      roi {
        value
        previousValue
        percentageChange
      }
    }
  }
`;

// 2. Create a custom hook
function useFinancialMetrics(developmentId: string) {
  return useGraphQLQuery(
    ['financialMetrics', developmentId],
    GET_FINANCIAL_METRICS,
    { developmentId }
  );
}

// 3. Use the hook in your component
function FinancialDashboard({ developmentId }) {
  const { data, isLoading, error } = useFinancialMetrics(developmentId);
  
  // 4. Handle loading state
  if (isLoading) return <LoadingState />;
  
  // 5. Handle error state
  if (error) return <ErrorState error={error} />;
  
  // 6. Transform and use the data
  const roi = data?.getDevelopmentFinancialMetrics?.roi;
  
  return (
    <FinancialMetricCard
      title="ROI"
      value={roi.value}
      previousValue={roi.previousValue}
      percentageChange={roi.percentageChange}
    />
  );
}
```

## Component Prop Interfaces

The component prop interfaces are defined in `src/types/components/data-interfaces.ts`. These interfaces ensure type safety between the GraphQL schema and UI components.

## Dashboard Layout

The `DashboardGrid` component provides a flexible grid system for building dashboard layouts. It accepts children that can span multiple columns and rows.

Example usage:

```tsx
<DashboardGrid>
  <DashboardGrid.Item cols={1} rows={1}>
    <MetricCard title="ROI" value="12%" />
  </DashboardGrid.Item>
  
  <DashboardGrid.Item cols={2} rows={2}>
    <FinancialChart title="Trends" data={chartData} />
  </DashboardGrid.Item>
</DashboardGrid>
```

## Integration with Coder 4's GraphQL Implementation

These examples are designed to work with the GraphQL implementation from Coder 4. They use:

1. The same type definitions
2. Compatible query structure
3. Appropriate error handling

Be sure to coordinate with Coder 4 to ensure that the GraphQL schema matches the expected types in these examples.

## Best Practices

1. **Separate Data Fetching from Presentation**: Use custom hooks for data fetching
2. **Handle Loading States**: Always provide a good loading experience
3. **Error Handling**: Gracefully handle errors
4. **Caching**: Use React Query's caching capabilities
5. **Type Safety**: Ensure your component props match the GraphQL schema
6. **Reusable Fragments**: Use GraphQL fragments for shared type definitions