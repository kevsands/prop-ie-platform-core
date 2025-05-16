# PropIE AWS Component Usage Guide

This guide provides practical examples and best practices for using the PropIE AWS component library to build consistent, accessible, and responsive user interfaces.

## Table of Contents

1. [Introduction](#introduction)
2. [Common Patterns](#common-patterns)
3. [Dashboard Construction](#dashboard-construction)
4. [Form Creation](#form-creation)
5. [Data Visualization](#data-visualization)
6. [Responsive Design](#responsive-design)
7. [Performance Considerations](#performance-considerations)
8. [Accessibility Guidelines](#accessibility-guidelines)
9. [GraphQL Data Integration](#graphql-data-integration)

## Introduction

The PropIE AWS component library is designed to provide a consistent set of UI components for building property management and development interfaces. This guide will help you understand how to effectively use these components in various scenarios.

## Common Patterns

### Application Layout

Use the `AppShell` component as the foundation for your application layout:

```tsx
// src/app/[route]/layout.tsx
import { AppShell } from "@/components/layout/AppShell";
import { mainNavItems, sidebarNavGroups } from "@/config/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell
      mainNavItems={mainNavItems}
      sidebarNavGroups={sidebarNavGroups}
      profile={{
        name: "John Doe",
        email: "john.doe@example.com",
        role: "Administrator",
      }}
    >
      {children}
    </AppShell>
  );
}
```

### Page Structure

Structure your pages with consistent headers and actions:

```tsx
// src/app/properties/page.tsx
export default function PropertiesPage() {
  return (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">
            Manage your property portfolio.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Property</Button>
        </div>
      </div>
      
      {/* Page content */}
    </div>
  );
}
```

## Dashboard Construction

### Creating a Dashboard with Grid Layout

Use the `DashboardGrid` and `DashboardItem` components to create flexible dashboard layouts:

```tsx
import { DashboardGrid, DashboardItem } from "@/components/dashboard/DashboardGrid";
import { MetricCard } from "@/components/ui/metric-card";
import { ListWidget } from "@/components/dashboard/widgets/ListWidget";
import { ChartWrapper } from "@/components/ui/chart-wrapper";

export default function Dashboard() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <DashboardGrid>
        {/* KPI Row - 4 metrics in a row */}
        <DashboardItem colSpan={1}>
          <MetricCard
            title="Total Revenue"
            value="€234,567"
            subtitle="Monthly revenue"
            trendValue={12.5}
            trendLabel="vs last month"
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1}>
          <MetricCard
            title="Properties"
            value="48"
            subtitle="Total properties"
            trendValue={8.7}
            trendLabel="growth"
            trendColor="success"
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1}>
          <MetricCard
            title="Occupancy Rate"
            value="94.2%"
            subtitle="Current occupancy"
            trendValue={2.3}
            trendLabel="vs last month"
            trendColor="success"
          />
        </DashboardItem>
        
        <DashboardItem colSpan={1}>
          <MetricCard
            title="Maintenance"
            value="€12,450"
            subtitle="Monthly expenses"
            trendValue={-3.2}
            trendLabel="vs last month"
            trendColor="danger"
          />
        </DashboardItem>
        
        {/* Charts Row - 2 charts side by side */}
        <DashboardItem colSpan={2} rowSpan={2} title="Revenue Overview">
          <ChartWrapper
            data={revenueData}
            type="bar"
            series={[
              { dataKey: 'revenue', name: 'Revenue' },
              { dataKey: 'expenses', name: 'Expenses' },
              { dataKey: 'profit', name: 'Profit' },
            ]}
            xAxisKey="name"
            height={300}
            formatYAxis={(value) => `€${value / 1000}k`}
          />
        </DashboardItem>
        
        <DashboardItem colSpan={2} rowSpan={2} title="Sales Performance">
          <ChartWrapper
            data={salesData}
            type="line"
            series={[
              { dataKey: 'sales', name: 'Sales' },
              { dataKey: 'leads', name: 'Leads', yAxisId: 'right' },
            ]}
            xAxisKey="date"
            height={300}
            showDots={true}
            secondaryYAxis={true}
          />
        </DashboardItem>
        
        {/* Full-width activity feed */}
        <DashboardItem colSpan={4} title="Recent Activities">
          <ListWidget
            items={activityItems}
            onItemClick={(id) => handleActivityClick(id)}
            footerAction={{
              label: "View All",
              onClick: () => router.push('/activities'),
            }}
          />
        </DashboardItem>
      </DashboardGrid>
    </div>
  );
}
```

### Widget Best Practices

1. **Use the right widget for the data**: Choose appropriate widgets based on the type of data you're displaying.
   - Use `MetricCard` or `StatWidget` for KPIs and key metrics
   - Use `ProgressWidget` for tracking goals and progress
   - Use `ListWidget` for activities, events, and list data
   - Use `ChartWrapper` for data visualization

2. **Consistent sizing**: Use the column and row span consistently for similar types of data.

3. **Meaningful titles and descriptions**: Always provide clear titles and, when appropriate, descriptions.

4. **Interactive elements**: Make widgets interactive when it makes sense (e.g., clicking a widget to view more details).

## Form Creation

### Creating Forms with FormFieldComponent

Use the `FormFieldComponent` with react-hook-form for form creation:

```tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { FormFieldComponent } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

// Form schema
const formSchema = z.object({
  propertyName: z.string().min(2, "Property name is required"),
  propertyType: z.string().min(1, "Property type is required"),
  address: z.string().min(5, "Address is required"),
  price: z.coerce.number().positive("Price must be positive"),
  bedrooms: z.coerce.number().int().positive(),
  bathrooms: z.coerce.number().positive(),
  description: z.string().optional(),
  features: z.array(z.string()).optional(),
  isActive: z.boolean().default(true),
});

export default function PropertyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyName: "",
      propertyType: "",
      address: "",
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      description: "",
      features: [],
      isActive: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Handle form submission
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Property</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldComponent
                form={form}
                name="propertyName"
                label="Property Name"
                type="text"
                required
              />
              
              <FormFieldComponent
                form={form}
                name="propertyType"
                label="Property Type"
                type="select"
                required
                options={[
                  { label: "Apartment", value: "apartment" },
                  { label: "House", value: "house" },
                  { label: "Townhouse", value: "townhouse" },
                  { label: "Commercial", value: "commercial" },
                ]}
              />
              
              <FormFieldComponent
                form={form}
                name="price"
                label="Price (€)"
                type="number"
                min={0}
                required
              />
              
              <div className="grid grid-cols-2 gap-2">
                <FormFieldComponent
                  form={form}
                  name="bedrooms"
                  label="Bedrooms"
                  type="number"
                  min={0}
                />
                
                <FormFieldComponent
                  form={form}
                  name="bathrooms"
                  label="Bathrooms"
                  type="number"
                  min={0}
                  step={0.5}
                />
              </div>
              
              <FormFieldComponent
                form={form}
                name="address"
                label="Address"
                type="textarea"
                rows={3}
                className="md:col-span-2"
                required
              />
              
              <FormFieldComponent
                form={form}
                name="description"
                label="Description"
                type="textarea"
                rows={4}
                className="md:col-span-2"
              />
              
              <FormFieldComponent
                form={form}
                name="isActive"
                label="List as active property"
                type="switch"
                className="md:col-span-2"
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline">Cancel</Button>
              <Button type="submit">Save Property</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

## Data Visualization

### Displaying Data Tables

Use the `DataTable` component for displaying tabular data:

```tsx
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";

// Define your columns
const columns = [
  {
    accessorKey: "id",
    header: "ID",
    enableSorting: false,
    size: 80,
  },
  {
    accessorKey: "propertyName",
    header: "Property",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      return `€${row.getValue("price").toLocaleString()}`;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge
          variant={
            status === "Active" ? "success" :
            status === "Pending" ? "warning" :
            status === "Sold" ? "default" :
            "outline"
          }
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const property = row.original;
      return (
        <div className="flex gap-2">
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

export default function PropertiesPage() {
  const [data, setData] = useState([]);
  
  // Fetch data...
  
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Properties</h1>
      
      <DataTable
        columns={columns}
        data={data}
        searchColumn="propertyName"
        searchPlaceholder="Search properties..."
        pagination={true}
        pageSize={10}
        onRowClick={(row) => router.push(`/properties/${row.id}`)}
        loading={loading}
        emptyStateMessage={
          <div className="text-center py-8">
            <h3 className="text-lg font-medium">No properties found</h3>
            <p className="text-muted-foreground">Add your first property to get started.</p>
            <Button className="mt-4">Add Property</Button>
          </div>
        }
      />
    </div>
  );
}
```

### Creating Charts

Use the `ChartWrapper` component for data visualization:

```tsx
import { ChartWrapper } from "@/components/ui/chart-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Sample data
const salesData = [
  { month: "Jan", sales: 32000, target: 30000 },
  { month: "Feb", sales: 28000, target: 30000 },
  { month: "Mar", sales: 34000, target: 32000 },
  { month: "Apr", sales: 42000, target: 35000 },
  { month: "May", sales: 38000, target: 36000 },
  { month: "Jun", sales: 50000, target: 40000 },
];

export default function SalesChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartWrapper
          data={salesData}
          type="composed"
          series={[
            { dataKey: "sales", name: "Sales", type: "bar" },
            { dataKey: "target", name: "Target", type: "line" },
          ]}
          xAxisKey="month"
          height={300}
          formatYAxis={(value) => `€${value / 1000}k`}
          showDots={true}
        />
      </CardContent>
    </Card>
  );
}
```

## Responsive Design

The component library is built with responsive design in mind. Here are some tips for creating responsive interfaces:

### Responsive Dashboard Layout

Use column spans that adapt to screen size:

```tsx
<DashboardGrid>
  {/* On mobile: full width, on tablet: half width, on desktop: quarter width */}
  <DashboardItem colSpan={1}>
    <MetricCard title="Revenue" value="€234,567" />
  </DashboardItem>
  
  {/* On mobile and tablet: full width, on desktop: half width */}
  <DashboardItem colSpan={2}>
    <ChartWrapper
      data={data}
      type="bar"
      series={[{ dataKey: "value", name: "Value" }]}
      xAxisKey="name"
    />
  </DashboardItem>
  
  {/* Always full width */}
  <DashboardItem colSpan={4}>
    <ListWidget title="Activities" items={activities} />
  </DashboardItem>
</DashboardGrid>
```

### Responsive Form Layout

Use grid layouts that adapt to screen size:

```tsx
<form className="space-y-4">
  {/* Single column on mobile, two columns on larger screens */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <FormFieldComponent form={form} name="firstName" label="First Name" />
    <FormFieldComponent form={form} name="lastName" label="Last Name" />
  </div>
  
  {/* Always full width */}
  <FormFieldComponent form={form} name="address" label="Address" type="textarea" />
  
  {/* Three columns on desktop, two on tablet, one on mobile */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <FormFieldComponent form={form} name="city" label="City" />
    <FormFieldComponent form={form} name="state" label="State" />
    <FormFieldComponent form={form} name="zipCode" label="Zip Code" />
  </div>
</form>
```

## Performance Considerations

1. **Lazy Loading**: Use lazy loading for dashboard widgets that are not immediately visible.

2. **Pagination**: Always use pagination for large data sets.

3. **Optimized Charts**: Limit the number of data points in charts and avoid too many series.

4. **Memo Components**: Use React.memo for expensive components:

```tsx
import React from "react";

const ExpensiveWidget = React.memo(function ExpensiveWidget({ data }) {
  // Complex rendering logic
  return <div>...</div>;
});
```

5. **Virtualization**: For very large lists, consider using virtualization:

```tsx
import { useVirtualizer } from "@tanstack/react-virtual";

function VirtualizedList({ items }) {
  const parentRef = React.useRef(null);
  
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });
  
  return (
    <div 
      ref={parentRef} 
      className="h-[400px] overflow-auto"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Accessibility Guidelines

Follow these guidelines to ensure your interfaces are accessible:

1. **Provide meaningful labels**: Always include descriptive labels for form fields.

```tsx
<FormFieldComponent
  form={form}
  name="email"
  label="Email Address"
  type="email"
  required
/>
```

2. **Use appropriate ARIA attributes**: For complex interactions, use ARIA attributes.

```tsx
<Button
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={toggleMenu}
>
  Options
</Button>
```

3. **Ensure sufficient color contrast**: Use the built-in color palette which meets WCAG guidelines.

4. **Support keyboard navigation**: Make sure all interactive elements are accessible via keyboard.

5. **Provide alternative text**: Always include alt text for images.

```tsx
<img src="/images/property.jpg" alt="3-bedroom house with garden in Dublin" />
```

6. **Use semantic HTML**: Leverage the semantic HTML provided by the components.

7. **Test with screen readers**: Regularly test your interfaces with screen readers.

## GraphQL Data Integration

The component library is designed to work seamlessly with GraphQL data sources. This section covers how to integrate components with GraphQL queries.

### Setting Up GraphQL Provider

Use the `GraphQLProvider` to set up React Query and provide utility functions:

```tsx
import { GraphQLProvider } from '@/components/ui/GraphQLProvider';

export default function RootLayout({ children }) {
  return (
    <GraphQLProvider>
      {children}
    </GraphQLProvider>
  );
}
```

### Using Custom GraphQL Hooks

The component library provides custom hooks for fetching data:

```tsx
import { useFinancialMetrics } from '@/hooks/useFinancialData';

function ROIMetricCard({ developmentId }) {
  const { data, isLoading, error } = useFinancialMetrics(developmentId);
  
  return (
    <FinancialMetricCard
      title="Return on Investment"
      value={data?.roi?.value || 0}
      previousValue={data?.roi?.previousValue}
      percentageChange={data?.roi?.percentageChange}
      isPositiveTrend={true}
      suffix="%"
      isLoading={isLoading}
    />
  );
}
```

### Document Management with GraphQL

The document management components integrate with GraphQL using custom hooks to fetch and manipulate document data:

```tsx
import { 
  useDocuments, 
  useDocumentCategories, 
  useDocumentStats,
  useDocumentUpload
} from '@/hooks/useDocuments';
import { DocumentManager } from '@/components/document';

function DocumentsPage({ projectId }) {
  // Use GraphQL hooks to fetch document data
  const { data, isLoading, error } = useDocuments({
    projectId,
    status: ['APPROVED', 'PENDING_REVIEW']
  });
  
  // Fetch document categories
  const { data: categories } = useDocumentCategories(projectId);
  
  // Fetch document statistics
  const { data: stats } = useDocumentStats(projectId);
  
  // Use the all-in-one document manager component
  return (
    <DocumentManager
      projectId={projectId}
      enableUpload={true}
      showStats={true}
    />
  );
}
```

The document hooks are powered by GraphQL queries and mutations that are defined in:
- `src/lib/graphql/documents/queries.ts`
- `src/lib/graphql/documents/mutations.ts`

For complete examples, see the `document-graphql-integration.tsx` example file.
```

### Data-Aware Dashboard Components

Dashboard components can be connected directly to GraphQL data sources:

```tsx
import { 
  useFinancialMetrics, 
  useCashFlowData, 
  useBudgetVsActualData 
} from '@/hooks/useFinancialData';

function FinancialDashboard({ developmentId }) {
  const { data: metricsData, isLoading: isLoadingMetrics } = useFinancialMetrics(developmentId);
  const { data: cashFlowData, isLoading: isLoadingCashFlow } = useCashFlowData(developmentId);
  const { data: budgetData, isLoading: isLoadingBudget } = useBudgetVsActualData(developmentId);
  
  return (
    <DashboardGrid>
      {/* Financial metrics */}
      <DashboardItem colSpan={1}>
        <FinancialMetricCard
          title="ROI"
          value={metricsData?.roi?.value || 0}
          percentageChange={metricsData?.roi?.percentageChange}
          isPositiveTrend={true}
          suffix="%"
          isLoading={isLoadingMetrics}
        />
      </DashboardItem>
      
      {/* Cash flow summary */}
      <DashboardItem colSpan={2} rowSpan={2}>
        <CashFlowSummaryCard
          inflows={cashFlowData?.inflows}
          outflows={cashFlowData?.outflows}
          netCashFlow={cashFlowData?.netCashFlow}
          cashFlowData={cashFlowData?.cashFlowData}
          isLoading={isLoadingCashFlow}
        />
      </DashboardItem>
      
      {/* Budget vs Actual */}
      <DashboardItem colSpan={2} rowSpan={2}>
        <BudgetVsActualCard
          totalBudget={budgetData?.totalBudget}
          totalActual={budgetData?.totalActual}
          totalVariance={budgetData?.totalVariance}
          totalVariancePercentage={budgetData?.totalVariancePercentage}
          categories={budgetData?.categories}
          isLoading={isLoadingBudget}
        />
      </DashboardItem>
    </DashboardGrid>
  );
}
```

### Type-Safe GraphQL Integration

Use the TypeScript interfaces defined in `src/types/components/data-interfaces.ts` to ensure type safety:

```tsx
import type { 
  FinancialMetricProps, 
  CashFlowSummaryDashboardProps 
} from '@/types/finance/dashboard';
import type { 
  FinancialMetricResponse 
} from '@/types/components/data-interfaces';

// Type-safe transformation of GraphQL data to component props
const transformMetricData = (
  response: FinancialMetricResponse
): FinancialMetricProps => {
  return {
    value: response.value,
    previousValue: response.previousValue,
    percentageChange: response.percentageChange,
    isPositiveTrend: response.trend === 'up',
    trendData: response.trendData?.map(point => ({
      date: point.date,
      value: point.value,
      isProjected: point.isProjected
    }))
  };
};
```

### Best Practices for GraphQL Integration

1. **Separation of concerns**: Keep data fetching logic separate from UI components.

2. **Custom hooks**: Create custom hooks for each data requirement.

3. **Loading states**: Always handle loading states in components:

```tsx
{isLoading ? (
  <MetricCard title="Loading..." value="--" loading />
) : (
  <MetricCard title="ROI" value={`${data.value}%`} />
)}
```

4. **Error handling**: Implement consistent error handling:

```tsx
{error ? (
  <ErrorCard message="Failed to load data" retryAction={refetch} />
) : (
  <YourComponent data={data} />
)}
```

5. **Caching strategy**: Use React Query's caching capabilities:

```tsx
const { data } = useFinancialMetrics(developmentId, {
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 30 * 60 * 1000, // 30 minutes
});
```

---

By following this guide, you can create consistent, accessible, and performant interfaces for the PropIE AWS platform that integrate seamlessly with GraphQL data sources.