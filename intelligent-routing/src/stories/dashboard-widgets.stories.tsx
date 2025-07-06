import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  AlertCircle, 
  BarChart3, 
  Building2, 
  Calendar, 
  CheckCheck, 
  Clock, 
  DollarSign, 
  Edit, 
  Home, 
  InfoIcon, 
  Layers, 
  MoreHorizontal, 
  Percent, 
  Trash2, 
  Truck, 
  Users, 
  Wrench 
} from 'lucide-react';

import { StatWidget } from '../components/dashboard/widgets/StatWidget';
import { ProgressWidget } from '../components/dashboard/widgets/ProgressWidget';
import { ListWidget, ListItem } from '../components/dashboard/widgets/ListWidget';
import { MetricCard } from '../components/ui/metric-card';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';

const meta: Meta = {
  title: 'Dashboard/Widgets',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-md mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;

// Sample metric trend data
const metricTrendData = Array.from({ length: 7 }, (_, i) => ({
  value: 10 + Math.random() * 50,
}));

// Sample list data
const listItems: ListItem[] = [
  {
    id: '1',
    title: 'New Property Listed',
    description: 'John Doe added a new property in Dublin',
    icon: Home,
    timestamp: '1 hour ago',
    actions: [
      { label: 'View', onClick: (id) => console.log('View', id) },
      { label: 'Edit', onClick: (id) => console.log('Edit', id), icon: Edit },
      { label: 'Delete', onClick: (id) => console.log('Delete', id), icon: Trash2 },
    ],
  },
  {
    id: '2',
    title: 'Maintenance Request',
    description: 'Plumbing issue at 123 Main Street',
    icon: Wrench,
    status: 'Urgent',
    statusColor: 'danger',
    timestamp: '3 hours ago',
    actions: [
      { label: 'View', onClick: (id) => console.log('View', id) },
      { label: 'Assign', onClick: (id) => console.log('Assign', id) },
    ],
  },
  {
    id: '3',
    title: 'Contract Signed',
    description: 'Sarah Johnson signed a new lease agreement',
    icon: CheckCheck,
    status: 'Completed',
    statusColor: 'success',
    timestamp: 'Yesterday',
    actions: [
      { label: 'View Contract', onClick: (id) => console.log('View', id) },
    ],
  },
  {
    id: '4',
    title: 'Property Viewing Scheduled',
    description: 'Property viewing for 456 Oak Avenue',
    icon: Calendar,
    status: 'Upcoming',
    statusColor: 'info',
    timestamp: 'Tomorrow at 10:00 AM',
    actions: [
      { label: 'View', onClick: (id) => console.log('View', id) },
      { label: 'Reschedule', onClick: (id) => console.log('Reschedule', id) },
      { label: 'Cancel', onClick: (id) => console.log('Cancel', id) },
    ],
  },
];

// Stat Widget Stories
export const BasicStatWidget: StoryObj = {
  render: () => (
    <StatWidget
      title="Total Revenue"
      value="€234,567"
      description="Monthly revenue"
      icon={DollarSign}
    />
  ),
};

export const StatWidgetWithTrend: StoryObj = {
  render: () => (
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
    />
  ),
};

export const StatWidgetVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <StatWidget
        title="Total Revenue"
        value="€234,567"
        icon={DollarSign}
        trend={{ value: 12.5, positive: true }}
        variant="default"
      />
      <StatWidget
        title="New Customers"
        value="1,234"
        icon={Users}
        trend={{ value: 3.2, positive: false }}
        variant="outline"
      />
      <StatWidget
        title="Properties"
        value="48"
        icon={Building2}
        trend={{ value: 8.7, positive: true }}
        variant="success"
      />
      <StatWidget
        title="Pending Maintenance"
        value="7"
        icon={Wrench}
        trend={{ value: 2.8, positive: false }}
        variant="warning"
      />
      <StatWidget
        title="Overdue Payments"
        value="3"
        icon={AlertCircle}
        trend={{ value: 1.2, positive: false }}
        variant="danger"
      />
      <StatWidget
        title="Property Viewings"
        value="15"
        icon={Calendar}
        trend={{ value: 5.4, positive: true }}
        variant="info"
      />
    </div>
  ),
};

export const StatWidgetClickable: StoryObj = {
  render: () => (
    <StatWidget
      title="Total Revenue"
      value="€234,567"
      description="Click for details"
      icon={DollarSign}
      trend={{ value: 12.5, positive: true }}
      onClick={() => alert("Widget clicked!")}
    />
  ),
};

export const StatWidgetLoading: StoryObj = {
  render: () => (
    <StatWidget
      title="Total Revenue"
      value="€234,567"
      description="Monthly revenue"
      icon={DollarSign}
      loading={true}
    />
  ),
};

// Progress Widget Stories
export const BasicProgressWidget: StoryObj = {
  render: () => (
    <ProgressWidget
      title="Project Completion"
      value={65}
      maxValue={100}
      icon={Layers}
      description="FitzGerald Gardens development"
    />
  ),
};

export const ProgressWidgetWithStatus: StoryObj = {
  render: () => (
    <ProgressWidget
      title="Project Completion"
      value={65}
      maxValue={100}
      icon={Layers}
      description="FitzGerald Gardens development"
      status="inProgress"
      primaryLabel="65% Complete"
    />
  ),
};

export const ProgressWidgetColors: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <ProgressWidget
        title="Default Progress"
        value={65}
        maxValue={100}
        barColor="default"
        primaryLabel="65% Complete"
      />
      <ProgressWidget
        title="Success Progress"
        value={85}
        maxValue={100}
        barColor="success"
        status="completed"
        primaryLabel="85% Complete"
      />
      <ProgressWidget
        title="Warning Progress"
        value={45}
        maxValue={100}
        barColor="warning"
        status="inProgress"
        primaryLabel="45% Complete"
      />
      <ProgressWidget
        title="Danger Progress"
        value={25}
        maxValue={100}
        barColor="danger"
        status="blocked"
        primaryLabel="25% Complete"
      />
      <ProgressWidget
        title="Info Progress"
        value={50}
        maxValue={100}
        barColor="info"
        status="inProgress"
        primaryLabel="50% Complete"
      />
    </div>
  ),
};

export const ProgressWidgetSizes: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <ProgressWidget
        title="Small Progress Bar"
        value={75}
        size="sm"
        primaryLabel="75% Complete"
      />
      <ProgressWidget
        title="Medium Progress Bar"
        value={75}
        size="md"
        primaryLabel="75% Complete"
      />
      <ProgressWidget
        title="Large Progress Bar"
        value={75}
        size="lg"
        primaryLabel="75% Complete"
      />
    </div>
  ),
};

export const ProgressWidgetWithTarget: StoryObj = {
  render: () => (
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
    />
  ),
};

// List Widget Stories
export const BasicListWidget: StoryObj = {
  render: () => (
    <ListWidget
      title="Recent Activities"
      items={listItems}
      onItemClick={(id) => console.log('Item clicked', id)}
    />
  ),
};

export const ListWidgetWithActions: StoryObj = {
  render: () => (
    <ListWidget
      title="Recent Activities"
      description="Latest events from your properties"
      items={listItems}
      onItemClick={(id) => console.log('Item clicked', id)}
      actions={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Refresh</DropdownMenuItem>
            <DropdownMenuItem>Mark all as read</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      footerAction={{
        label: "View All",
        onClick: () => console.log("View all clicked"),
      }}
    />
  ),
};

export const ListWidgetVariants: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-2">Default Variant</h3>
        <ListWidget
          title="Activities"
          items={listItems.slice(0, 2)}
          variant="default"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Compact Variant</h3>
        <ListWidget
          title="Activities"
          items={listItems.slice(0, 2)}
          variant="compact"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Card Variant</h3>
        <ListWidget
          title="Activities"
          items={listItems.slice(0, 2)}
          variant="card"
        />
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Separated Variant</h3>
        <ListWidget
          title="Activities"
          items={listItems.slice(0, 2)}
          variant="separated"
        />
      </div>
    </div>
  ),
};

export const ListWidgetEmpty: StoryObj = {
  render: () => (
    <ListWidget
      title="Recent Activities"
      items={[]}
      emptyState={
        <div className="text-center">
          <InfoIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-2 text-sm font-medium">No activities</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Activities will appear here when available.
          </p>
        </div>
      }
    />
  ),
};

export const ListWidgetLoading: StoryObj = {
  render: () => (
    <ListWidget
      title="Recent Activities"
      items={[]}
      loading={true}
      loadingItemCount={3}
    />
  ),
};

// Metric Card Stories
export const BasicMetricCard: StoryObj = {
  render: () => (
    <MetricCard
      title="Total Revenue"
      value="€234,567"
      subtitle="Monthly revenue"
      icon={DollarSign}
      trendValue={12.5}
      trendLabel="vs last month"
      trendData={metricTrendData}
    />
  ),
};

export const MetricCardVariants: StoryObj = {
  render: () => (
    <div className="space-y-4">
      <MetricCard
        title="Total Revenue"
        value="€234,567"
        subtitle="Monthly revenue"
        trendValue={12.5}
        trendLabel="vs last month"
      />
      
      <MetricCard
        title="New Customers"
        value="1,234"
        subtitle="Last 30 days"
        trendValue={-3.2}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="danger"
      />
      
      <MetricCard
        title="Properties Sold"
        value="48"
        subtitle="Last 30 days"
        trendValue={8.7}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="success"
      />
      
      <MetricCard
        title="Conversion Rate"
        value="3.6%"
        subtitle="Visits to sales"
        trendValue={0.8}
        trendLabel="vs last month"
        trendData={metricTrendData}
        trendColor="warning"
      />
    </div>
  ),
};

// Widget Composition Examples
export const DashboardWidgetsGrid: StoryObj = {
  render: () => (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatWidget
          title="Monthly Revenue"
          value="€234,567"
          trend={{ value: 12.5, positive: true, label: "vs last month" }}
          icon={DollarSign}
        />
        
        <StatWidget
          title="Occupancy Rate"
          value="94.2%"
          trend={{ value: 2.3, positive: true, label: "vs last month" }}
          icon={Percent}
        />
        
        <StatWidget
          title="Active Properties"
          value="48"
          trend={{ value: 8.7, positive: true, label: "growth" }}
          icon={Building2}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <ProgressWidget
          title="Sales Target"
          value={680000}
          maxValue={1000000}
          target={800000}
          showTargetIndicator
          primaryLabel="€680K / €1M"
          secondaryLabel="Target: €800K"
          description="Year-to-date sales"
          status="inProgress"
        />
        
        <ProgressWidget
          title="Project Completion"
          value={65}
          maxValue={100}
          description="FitzGerald Gardens development"
          status="inProgress"
          primaryLabel="65% Complete"
          secondaryLabel="Est. completion: Dec 2023"
          barColor="success"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <ListWidget
            title="Recent Activities"
            description="Latest events from your properties"
            items={listItems}
            onItemClick={(id) => console.log('Item clicked', id)}
            footerAction={{
              label: "View All",
              onClick: () => console.log("View all clicked"),
            }}
          />
        </div>
        
        <MetricCard
          title="Conversion Rate"
          value="3.6%"
          subtitle="Website visitors to leads"
          trendValue={0.8}
          trendLabel="vs last month"
          trendData={metricTrendData}
          trendColor="success"
          headerAction={<BarChart3 className="h-4 w-4 text-green-500" />}
        />
      </div>
    </div>
  ),
};