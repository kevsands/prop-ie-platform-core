# PropIE AWS Component Library

This document provides an overview of the component library designed for the PropIE AWS platform. The component library provides a consistent set of UI components, layouts, and patterns to build feature-rich dashboards and user interfaces.

## Table of Contents

1. [Getting Started](#getting-started)
2. [UI Components](#ui-components)
   - [Button System](#button-system)
   - [Form Components](#form-components)
   - [Card System](#card-system)
   - [Data Tables](#data-tables)
   - [Charts & Visualization](#charts--visualization)
3. [Layout Components](#layout-components)
   - [Application Shell](#application-shell)
   - [Dashboard Grid](#dashboard-grid)
4. [Dashboard Widgets](#dashboard-widgets)
   - [Metric Cards](#metric-cards)
   - [Stat Widgets](#stat-widgets)
   - [Progress Widgets](#progress-widgets)
   - [List Widgets](#list-widgets)
5. [GraphQL Integration](#graphql-integration)
   - [GraphQL Provider](#graphql-provider)
   - [Data Hooks](#data-hooks)
   - [Component Integration](#component-integration)
6. [Usage Examples](#usage-examples)
7. [Theming & Customization](#theming--customization)
8. [Accessibility](#accessibility)

## Getting Started

The component library is built on top of several key technologies:

- React 18 with TypeScript
- Next.js 15 App Router
- Tailwind CSS for styling
- shadcn/ui as the base component library
- Framer Motion for animations
- Recharts for data visualization
- React Query and GraphQL for data fetching

To start using the components:

```jsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content here...</p>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

## UI Components

### Button System

The button system provides a comprehensive set of button variants for different use cases:

```jsx
import { Button } from "@/components/ui/button";

// Basic button
<Button>Default Button</Button>

// Button variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="info">Info</Button>
<Button variant="subtle">Subtle</Button>
<Button variant="brand">Brand</Button>

// Button sizes
<Button size="default">Default Size</Button>
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>
<Button size="icon">Icon</Button>
<Button size="icon-sm">Small Icon</Button>
<Button size="icon-lg">Large Icon</Button>

// Full-width button
<Button fullWidth>Full Width Button</Button>

// Loading state
<Button isLoading>Loading</Button>
<Button isLoading loadingText="Submitting...">Submit</Button>

// With icons
<Button leftIcon={<MailIcon />}>Email</Button>
<Button rightIcon={<ArrowRight />}>Next</Button>
```

### Form Components

The FormFieldComponent provides a unified API for form controls:

```jsx
import { FormFieldComponent } from "@/components/ui/form-field";

// In a form context
<FormFieldComponent
  form={form}
  name="email"
  label="Email Address"
  type="email"
  placeholder="your.email@example.com"
  required
  autoComplete="email"
/>

// Different field types
<FormFieldComponent form={form} name="fullName" type="text" label="Full Name" />
<FormFieldComponent form={form} name="bio" type="textarea" label="Bio" rows={4} />
<FormFieldComponent form={form} name="agreeToTerms" type="checkbox" label="I agree to the terms" />
<FormFieldComponent form={form} name="notificationsEnabled" type="switch" label="Enable notifications" />
<FormFieldComponent
  form={form}
  name="country"
  type="select"
  label="Country"
  options={[
    { label: "United States", value: "us" },
    { label: "United Kingdom", value: "uk" },
    { label: "Canada", value: "ca" },
  ]}
/>
<FormFieldComponent
  form={form}
  name="role"
  type="radio"
  label="Role"
  options={[
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
    { label: "Guest", value: "guest" },
  ]}
/>

// With icons, help text, and more
<FormFieldComponent
  form={form}
  name="password"
  type="password"
  label="Password"
  leadingIcon={<LockIcon />}
  help="Password must be at least 8 characters"
  required
/>
```

### Card System

The card system offers versatile options for content containers:

```jsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardMedia,
  CardBadge 
} from "@/components/ui/card";

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card with media
<Card>
  <CardMedia
    src="/images/property.jpg"
    alt="Property"
    ratio="video"
  />
  <CardHeader>
    <CardTitle>Featured Property</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Beautiful property in Dublin.</p>
  </CardContent>
</Card>

// Card with badge
<Card className="relative">
  <CardBadge variant="success" position="top-right">
    New
  </CardBadge>
  <CardContent>
    <p>Card with badge</p>
  </CardContent>
</Card>

// Card variants
<Card variant="default">Default Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="outline">Outline Card</Card>
<Card variant="filled">Filled Card</Card>
<Card variant="ghost">Ghost Card</Card>
<Card variant="interactive">Interactive Card</Card>
<Card variant="success">Success Card</Card>
<Card variant="warning">Warning Card</Card>
<Card variant="danger">Danger Card</Card>
<Card variant="info">Info Card</Card>
```

### Data Tables

The DataTable component provides advanced table functionality:

```jsx
import { DataTable } from "@/components/ui/data-table";

// Define your columns
const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("status")}</Badge>,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm">View</Button>
    ),
  },
];

// Use the data table
<DataTable
  columns={columns}
  data={data}
  searchColumn="name"
  searchPlaceholder="Search properties..."
  pagination={true}
  pageSize={10}
  onRowClick={(row) => handleRowClick(row)}
/>
```

### Charts & Visualization

The ChartWrapper component provides a unified API for various chart types:

```jsx
import { ChartWrapper } from "@/components/ui/chart-wrapper";

// Bar Chart
<ChartWrapper
  data={data}
  type="bar"
  series={[
    { dataKey: "revenue", name: "Revenue" },
    { dataKey: "expenses", name: "Expenses" },
    { dataKey: "profit", name: "Profit" },
  ]}
  xAxisKey="name"
  height={300}
  formatYAxis={(value) => `$${value / 1000}k`}
/>

// Line Chart
<ChartWrapper
  data={data}
  type="line"
  series={[
    { dataKey: "sales", name: "Sales" },
    { dataKey: "leads", name: "Leads", yAxisId: "right" },
  ]}
  xAxisKey="date"
  showDots={true}
  secondaryYAxis={true}
/>

// Area Chart
<ChartWrapper
  data={data}
  type="area"
  series={[
    { dataKey: "residential", name: "Residential" },
    { dataKey: "commercial", name: "Commercial" },
    { dataKey: "industrial", name: "Industrial" },
  ]}
  xAxisKey="month"
  stacked={true}
/>

// Pie Chart
<ChartWrapper
  data={data}
  type="pie"
  series={[{ dataKey: "value" }]}
  xAxisKey="name"
  height={300}
/>

// Composed Chart (multiple chart types)
<ChartWrapper
  data={data}
  type="composed"
  series={[
    { dataKey: "revenue", name: "Revenue", type: "bar" },
    { dataKey: "expenses", name: "Expenses", type: "bar" },
    { dataKey: "profit", name: "Profit", type: "line" },
  ]}
  xAxisKey="name"
  showDots={true}
/>
```

## Layout Components

### Application Shell

The AppShell component provides a consistent application layout with navigation:

```jsx
import { AppShell } from "@/components/layout/AppShell";

// Basic usage
<AppShell>
  <main>
    <h1>Dashboard</h1>
    {/* Your content here */}
  </main>
</AppShell>

// With custom navigation and settings
<AppShell
  mainNavItems={[
    { title: "Home", href: "/" },
    { title: "Properties", href: "/properties" },
    { title: "About", href: "/about" },
  ]}
  sidebarNavGroups={[
    {
      title: "General",
      items: [
        { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { title: "Properties", href: "/properties", icon: Building2 },
      ],
    },
    {
      title: "Management",
      items: [
        { title: "Team", href: "/team", icon: Users },
        { title: "Documents", href: "/documents", icon: FileText },
      ],
    },
  ]}
  profile={{
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
  }}
  headerContent={customHeaderContent}
  footerContent={customFooterContent}
>
  {/* Page content */}
</AppShell>
```

### Dashboard Grid

The DashboardGrid system helps you create flexible dashboard layouts:

```jsx
import { DashboardGrid, DashboardItem } from "@/components/dashboard/DashboardGrid";

<DashboardGrid columns={4} gap="md">
  <DashboardItem title="Sales Overview" colSpan={2}>
    {/* Widget content */}
  </DashboardItem>
  
  <DashboardItem title="Revenue" colSpan={1}>
    {/* Widget content */}
  </DashboardItem>
  
  <DashboardItem title="Users" colSpan={1}>
    {/* Widget content */}
  </DashboardItem>
  
  <DashboardItem title="Recent Activity" colSpan={4}>
    {/* Widget content */}
  </DashboardItem>
</DashboardGrid>
```

## Dashboard Widgets

### Metric Cards

```jsx
import { MetricCard } from "@/components/ui/metric-card";

<MetricCard
  title="Total Revenue"
  value="€234,567"
  subtitle="Monthly revenue"
  icon={DollarSign}
  trendValue={12.5}
  trendLabel="vs last month"
  trendData={trendData}
/>
```

### Stat Widgets

```jsx
import { StatWidget } from "@/components/dashboard/widgets/StatWidget";

<StatWidget
  title="Total Revenue"
  value="€234,567"
  description="Monthly revenue"
  icon={DollarSign}
  trend={{
    value: 12.5,
    positive: true,
    label: "vs last month",
  }}
  variant="success"
/>
```

### Progress Widgets

```jsx
import { ProgressWidget } from "@/components/dashboard/widgets/ProgressWidget";

<ProgressWidget
  title="Sales Target"
  value={680000}
  maxValue={1000000}
  target={800000}
  showTargetIndicator
  primaryLabel="€680K / €1M"
  secondaryLabel="Target: €800K"
  description="Year-to-date sales"
  icon={DollarSign}
  status="inProgress"
  barColor="success"
/>
```

### List Widgets

```jsx
import { ListWidget } from "@/components/dashboard/widgets/ListWidget";

<ListWidget
  title="Recent Activities"
  description="Latest events from your properties"
  items={[
    {
      id: '1',
      title: 'New Property Listed',
      description: 'John Doe added a new property in Dublin',
      icon: Home,
      timestamp: '1 hour ago',
    },
    // More items...
  ]}
  onItemClick={(id) => console.log('Item clicked', id)}
  variant="default"
  footerAction={{
    label: "View All",
    onClick: () => console.log("View all clicked"),
  }}
/>
```

## GraphQL Integration

The component library is designed to work seamlessly with GraphQL data sources through React Query integration. This section covers setting up GraphQL integration with our components.

### GraphQL Provider

The GraphQLProvider component sets up React Query and provides utility functions for working with GraphQL data:

```jsx
import { GraphQLProvider } from "@/components/ui/GraphQLProvider";

// In your root layout
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GraphQLProvider>
          {children}
        </GraphQLProvider>
      </body>
    </html>
  );
}
```

### Data Hooks

The component library provides custom hooks for fetching data from GraphQL:

```jsx
import { useGraphQLQuery, useGraphQLMutation } from "@/hooks/useGraphQL";

// Basic GraphQL query hook
function useDevelopmentData(developmentId) {
  return useGraphQLQuery(
    ['development', developmentId],
    `query GetDevelopment($id: ID!) {
      getDevelopment(id: $id) {
        id
        name
        description
        location
        status
      }
    }`,
    { id: developmentId }
  );
}

// Financial data hooks
import { 
  useFinancialMetrics, 
  useCashFlowData, 
  useBudgetVsActualData 
} from "@/hooks/useFinancialData";

function FinancialMetrics({ developmentId }) {
  const { data, isLoading, error } = useFinancialMetrics(developmentId);
  
  // Use the data in your components
  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  
  return (
    <FinancialMetricCard
      title="ROI"
      value={data.roi.value}
      percentageChange={data.roi.percentageChange}
      isPositiveTrend={true}
      suffix="%"
    />
  );
}
```

### Component Integration

Financial components with GraphQL integration:

```jsx
import { FinancialChartGraphQL } from "@/components/finance/FinancialChartGraphQL";
import { FinancialMetricCardGraphQL } from "@/components/finance/FinancialMetricCardGraphQL";
import { CashFlowSummaryGraphQL } from "@/components/finance/CashFlowSummaryGraphQL";
import { BudgetVsActualGraphQL } from "@/components/finance/BudgetVsActualGraphQL";

// GraphQL-aware component usage
function DevelopmentFinancialDashboard({ developmentId }) {
  return (
    <DashboardGrid>
      {/* Financial metrics using GraphQL */}
      <DashboardItem colSpan={1}>
        <FinancialMetricCardGraphQL
          developmentId={developmentId}
          metricPath="roi"
          title="Return on Investment"
          suffix="%"
        />
      </DashboardItem>
      
      <DashboardItem colSpan={1}>
        <FinancialMetricCardGraphQL
          developmentId={developmentId}
          metricPath="profitMargin"
          title="Profit Margin"
          suffix="%"
        />
      </DashboardItem>
      
      {/* Cash flow using GraphQL */}
      <DashboardItem colSpan={2} rowSpan={2}>
        <CashFlowSummaryGraphQL
          developmentId={developmentId}
          timeRange="month"
        />
      </DashboardItem>
      
      {/* Budget vs Actual using GraphQL */}
      <DashboardItem colSpan={2} rowSpan={2}>
        <BudgetVsActualGraphQL
          developmentId={developmentId}
        />
      </DashboardItem>
      
      {/* Financial chart using GraphQL */}
      <DashboardItem colSpan={4}>
        <FinancialChartGraphQL
          developmentId={developmentId}
          title="Financial Trends"
          metricsToDisplay={["roi", "profitMargin"]}
          chartType="line"
        />
      </DashboardItem>
    </DashboardGrid>
  );
}
```

Data Table with GraphQL integration:

```jsx
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { DataTable } from "@/components/ui/data-table";

function DevelopmentsTable() {
  // GraphQL query for developments
  const { data, isLoading } = useGraphQLQuery(
    ['developments'],
    `query ListDevelopments {
      listDevelopments {
        items {
          id
          name
          location
          status
          units
          createdAt
        }
      }
    }`
  );
  
  // Define table columns
  const columns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("status")}</Badge>,
    },
    {
      accessorKey: "units",
      header: "Units",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm">View</Button>
      ),
    },
  ];
  
  return (
    <DataTable
      columns={columns}
      data={data?.listDevelopments?.items || []}
      loading={isLoading}
      pagination={true}
      pageSize={10}
    />
  );
}
```

## Usage Examples

### Property Dashboard

```jsx
function PropertyDashboard() {
  return (
    <AppShell>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Property Dashboard</h1>
        
        <DashboardGrid>
          <DashboardItem colSpan={1}>
            <MetricCard
              title="Total Revenue"
              value="€234,567"
              subtitle="Monthly revenue"
              trendValue={12.5}
              trendLabel="vs last month"
              trendData={metricTrendData}
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
          
          <DashboardItem colSpan={2} rowSpan={2} title="Revenue Overview">
            <ChartWrapper
              data={chartData}
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
          
          {/* More dashboard items... */}
        </DashboardGrid>
      </div>
    </AppShell>
  );
}
```

### Financial Dashboard with GraphQL

```jsx
function FinancialDashboardWithGraphQL({ developmentId }) {
  // Fetch data using custom hooks
  const { 
    data: metricsData, 
    isLoading: isLoadingMetrics 
  } = useFinancialMetrics(developmentId);
  
  const { 
    data: cashFlowData, 
    isLoading: isLoadingCashFlow 
  } = useCashFlowData(developmentId, 'month');
  
  const { 
    data: budgetData, 
    isLoading: isLoadingBudget 
  } = useBudgetVsActualData(developmentId);

  return (
    <AppShell>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
        
        <DashboardGrid>
          {/* Financial metrics */}
          <DashboardItem colSpan={1}>
            <FinancialMetricCard
              title="ROI"
              value={metricsData?.roi?.value || 0}
              previousValue={metricsData?.roi?.previousValue}
              percentageChange={metricsData?.roi?.percentageChange}
              isPositiveTrend={true}
              suffix="%"
              isLoading={isLoadingMetrics}
              trendData={metricsData?.trendData?.roi}
            />
          </DashboardItem>
          
          <DashboardItem colSpan={1}>
            <FinancialMetricCard
              title="Profit Margin"
              value={metricsData?.profitMargin?.value || 0}
              previousValue={metricsData?.profitMargin?.previousValue}
              percentageChange={metricsData?.profitMargin?.percentageChange}
              isPositiveTrend={true}
              suffix="%"
              isLoading={isLoadingMetrics}
              trendData={metricsData?.trendData?.profitMargin}
            />
          </DashboardItem>
          
          {/* Cash Flow Summary */}
          <DashboardItem colSpan={2} rowSpan={2}>
            {cashFlowData ? (
              <CashFlowSummaryCard
                inflows={cashFlowData.inflows}
                outflows={cashFlowData.outflows}
                netCashFlow={cashFlowData.netCashFlow}
                cashFlowData={cashFlowData.cashFlowData}
                inflowCategories={cashFlowData.inflowCategories}
                outflowCategories={cashFlowData.outflowCategories}
                isLoading={isLoadingCashFlow}
              />
            ) : (
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Cash Flow Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-40 flex items-center justify-center">
                    <LoadingSpinner />
                  </div>
                </CardContent>
              </Card>
            )}
          </DashboardItem>
          
          {/* More dashboard items... */}
        </DashboardGrid>
      </div>
    </AppShell>
  );
}
```

## Theming & Customization

The component library uses Tailwind CSS for styling and supports theming through Tailwind's theme configuration:

```js
// tailwind.config.js
module.exports = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Additional theme colors...
        
        // Chart colors
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      // Other theme extensions...
    },
  },
};
```

## Accessibility

The component library is designed with accessibility in mind:

- All components support keyboard navigation
- Form components have appropriate ARIA attributes
- Interactive elements have proper focus states
- Color contrast meets WCAG guidelines
- Screen reader support through appropriate aria roles and labels

Example of accessibility features in a form field:

```jsx
<FormFieldComponent
  form={form}
  name="email"
  label="Email Address"
  type="email"
  required
  aria-describedby="email-help"
  help="We'll never share your email with anyone else."
/>
```

---

For more detailed documentation on specific components, refer to the component stories and examples in the codebase. For information on integrating components with GraphQL data, see the examples in the `/src/examples` directory.