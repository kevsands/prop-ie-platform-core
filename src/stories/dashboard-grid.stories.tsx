import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BarChart3, Building2, Layers, LayoutDashboard, LineChart, MoreHorizontal, Users } from 'lucide-react';

import { DashboardGrid, DashboardItem } from '../components/dashboard/DashboardGrid';
import { MetricCard } from '../components/ui/metric-card';
import { Button } from '../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ChartWrapper } from '../components/ui/chart-wrapper';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';

const meta: Meta<typeof DashboardGrid> = {
  title: 'Dashboard/DashboardGrid',
  component: DashboardGrid,
  parameters: {
    layout: 'fullscreen'},
  tags: ['autodocs']};

export default meta;
type Story = StoryObj<typeof DashboardGrid>
  );
// Sample chart data
const barChartData = [
  { name: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
  { name: 'Feb', revenue: 15000, expenses: 10000, profit: 5000 },
  { name: 'Mar', revenue: 18000, expenses: 12000, profit: 6000 },
  { name: 'Apr', revenue: 21000, expenses: 13000, profit: 8000 },
  { name: 'May', revenue: 23000, expenses: 14000, profit: 9000 },
  { name: 'Jun', revenue: 26000, expenses: 16000, profit: 10000 }];

const lineChartData = [
  { date: 'Week 1', sales: 120, visitors: 450, leads: 23 },
  { date: 'Week 2', sales: 150, visitors: 520, leads: 27 },
  { date: 'Week 3', sales: 180, visitors: 600, leads: 31 },
  { date: 'Week 4', sales: 220, visitors: 650, leads: 35 },
  { date: 'Week 5', sales: 250, visitors: 700, leads: 40 },
  { date: 'Week 6', sales: 280, visitors: 750, leads: 45 }];

// Sample metric trend data
const metricTrendData = Array.from({ length: 7 }, (_i: any) => ({
  value: 10 + Math.random() * 50}));

// Team members for team widget
const teamMembers = [
  { name: 'John Doe', role: 'Sales Manager', avatar: '' },
  { name: 'Sarah Smith', role: 'Property Agent', avatar: '' },
  { name: 'David Lee', role: 'Customer Support', avatar: '' },
  { name: 'Emily Chen', role: 'Marketing', avatar: '' }];

// Simple example with equal-width items
export const Simple: Story = {
  render: () => (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardGrid>
        <DashboardItem title="Sales">
          <div className="h-40 flex items-center justify-center">
            <p>Sales Widget Content</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Analytics">
          <div className="h-40 flex items-center justify-center">
            <p>Analytics Widget Content</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Users">
          <div className="h-40 flex items-center justify-center">
            <p>Users Widget Content</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Reports">
          <div className="h-40 flex items-center justify-center">
            <p>Reports Widget Content</p>
          </div>
        </DashboardItem>
      </DashboardGrid>
    </div>
  )};

// Dashboard with various column spans
export const DifferentColSpans: Story = {
  render: () => (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardGrid>
        <DashboardItem colSpan={2} title="Revenue">
          <div className="h-40 flex items-center justify-center">
            <p>Revenue Overview (Spans 2 columns)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Users">
          <div className="h-40 flex items-center justify-center">
            <p>User Stats</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Properties">
          <div className="h-40 flex items-center justify-center">
            <p>Property Stats</p>
          </div>
        </DashboardItem>
        
        <DashboardItem colSpan={4} title="Recent Activity">
          <div className="h-40 flex items-center justify-center">
            <p>Activity Feed (Spans full width)</p>
          </div>
        </DashboardItem>
      </DashboardGrid>
    </div>
  )};

// Dashboard with mixed column and row spans
export const MixedSpans: Story = {
  render: () => (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <DashboardGrid>
        <DashboardItem colSpan={2} rowSpan={2} title="Analytics Dashboard">
          <div className="h-full flex items-center justify-center">
            <p>Main Analytics Dashboard (2x2)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Key Metrics">
          <div className="h-40 flex items-center justify-center">
            <p>Key Metrics (1x1)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Revenue">
          <div className="h-40 flex items-center justify-center">
            <p>Revenue (1x1)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem colSpan={2} title="User Activity">
          <div className="h-40 flex items-center justify-center">
            <p>User Activity (2x1)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Tasks">
          <div className="h-40 flex items-center justify-center">
            <p>Tasks (1x1)</p>
          </div>
        </DashboardItem>
        
        <DashboardItem title="Notifications">
          <div className="h-40 flex items-center justify-center">
            <p>Notifications (1x1)</p>
          </div>
        </DashboardItem>
      </DashboardGrid>
    </div>
  )};

// Real-world property management dashboard
export const PropertyManagementDashboard: Story = {
  render: () => (
    <div className="container py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Property Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your property portfolio and performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Export</Button>
          <Button>Add Property</Button>
        </div>
      </div>
      
      <DashboardGrid>
        {/* KPI Row */}
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
            trendData={metricTrendData}
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
            trendData={metricTrendData}
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
            trendData={metricTrendData}
            trendColor="danger"
          />
        </DashboardItem>
        
        {/* Revenue Chart */}
        <DashboardItem 
          colSpan={2} 
          rowSpan={2} 
          title="Revenue Overview"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                <DropdownMenuItem>Last 90 days</DropdownMenuItem>
                <DropdownMenuItem>Last 12 months</DropdownMenuItem>
                <DropdownMenuItem>Export data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          <ChartWrapper
            data={barChartData}
            type="bar"
            series={[
              { dataKey: 'revenue', name: 'Revenue' },
              { dataKey: 'expenses', name: 'Expenses' },
              { dataKey: 'profit', name: 'Profit' }]}
            xAxisKey="name"
            height={300}
            formatYAxis={(value: any) => `€${value / 1000}k`}
          />
        </DashboardItem>
        
        {/* Sales Performance */}
        <DashboardItem 
          colSpan={2}
          rowSpan={2}
          title="Sales Performance"
          actions={
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Weekly view</DropdownMenuItem>
                <DropdownMenuItem>Monthly view</DropdownMenuItem>
                <DropdownMenuItem>Export data</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          }
        >
          <ChartWrapper
            data={lineChartData}
            type="line"
            series={[
              { dataKey: 'sales', name: 'Sales' },
              { dataKey: 'leads', name: 'Leads', yAxisId: 'right' }]}
            xAxisKey="date"
            height={300}
            showDots={true}
            secondaryYAxis={true}
          />
        </DashboardItem>
        
        {/* Property Distribution */}
        <DashboardItem 
          colSpan={2}
          title="Property Types"
        >
          <div className="flex justify-between items-center h-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <div className="text-sm">Residential (60%)</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <div className="text-sm">Commercial (25%)</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                <div className="text-sm">Industrial (10%)</div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                <div className="text-sm">Land (5%)</div>
              </div>
            </div>
            
            <div className="aspect-square w-36 rounded-full border-8 border-blue-500 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent border-b-transparent"></div>
              <div className="absolute inset-0 rounded-full border-8 border-amber-500 border-t-transparent border-r-transparent border-l-transparent"></div>
              <div className="absolute inset-0 rounded-full border-8 border-purple-500 border-l-transparent border-r-transparent border-b-transparent"></div>
              <div className="text-sm font-semibold">Portfolio</div>
            </div>
          </div>
        </DashboardItem>
        
        {/* Team Widget */}
        <DashboardItem
          colSpan={2}
          title="Team"
        >
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">Team members</div>
            <div className="space-y-3">
              {teamMembers.map((memberi: any) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>
                      {member.name
                        .split(" ")
                        .map((n: any) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DashboardItem>
        
        {/* Recent Activities */}
        <DashboardItem
          colSpan={4}
          title="Recent Activities"
        >
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_i: any) => (
              <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {[<LayoutDashboard />, <Building2 />, <Users />, <Layers />][i % 4]}
                </div>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    {[
                      "New property listed", 
                      "Maintenance request completed", 
                      "New tenant signed", 
                      "Rent payment received"
                    ][i % 4]}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {[
                      "John Doe added a new apartment in Dublin", 
                      "Plumbing issue fixed at 123 Main St", 
                      "Emily Watson signed a 12-month lease", 
                      "€1,250 received from tenant at 456 Oak Ave"
                    ][i % 4]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {["1 hour ago", "3 hours ago", "Yesterday", "2 days ago"][i % 4]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </DashboardItem>
      </DashboardGrid>
    </div>
  )};

// Dashboard with removable widgets
export const RemovableWidgets: Story = {
  render: () => {
    // Use local state to track visible widgets
    const [widgetssetWidgets] = React.useState([
      { id: 'widget-1', title: 'Revenue', visible: true },
      { id: 'widget-2', title: 'Users', visible: true },
      { id: 'widget-3', title: 'Properties', visible: true },
      { id: 'widget-4', title: 'Tasks', visible: true }]);
    
    const handleRemove = (id: string) => {
      setWidgets(widgets.map(widget => 
        widget.id === id ? { ...widget, visible: false } : widget
      ));
    };
    
    const resetWidgets = () => {
      setWidgets(widgets.map(widget => ({ ...widget, visible: true })));
    };
    
    return (
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Removable Widgets Demo</h1>
          <Button onClick={resetWidgets}>Reset All Widgets</Button>
        </div>
        
        <DashboardGrid>
          {widgets.map((widget: any) => (
            widget.visible && (
              <DashboardItem 
                key={widget.id}
                id={widget.id}
                title={widget.title}
                removable
                onRemove={() => handleRemove(widget.id)}
              >
                <div className="h-40 flex items-center justify-center">
                  <p>{widget.title} Content</p>
                </div>
              </DashboardItem>
            )
          ))}
        </DashboardGrid>
      </div>
    );
  };

// Dashboard with different column configurations
export const DifferentColumnCounts: Story = {
  render: () => (
    <div className="space-y-12 py-6">
      <div className="container">
        <h2 className="text-xl font-bold mb-4">2-Column Layout</h2>
        <DashboardGrid columns={2}>
          <DashboardItem title="Widget 1">
            <div className="h-32 flex items-center justify-center">
              <p>Content 1</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget 2">
            <div className="h-32 flex items-center justify-center">
              <p>Content 2</p>
            </div>
          </DashboardItem>
        </DashboardGrid>
      </div>
      
      <div className="container">
        <h2 className="text-xl font-bold mb-4">3-Column Layout</h2>
        <DashboardGrid columns={3}>
          <DashboardItem title="Widget 1">
            <div className="h-32 flex items-center justify-center">
              <p>Content 1</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget 2">
            <div className="h-32 flex items-center justify-center">
              <p>Content 2</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget 3">
            <div className="h-32 flex items-center justify-center">
              <p>Content 3</p>
            </div>
          </DashboardItem>
        </DashboardGrid>
      </div>
      
      <div className="container">
        <h2 className="text-xl font-bold mb-4">6-Column Layout</h2>
        <DashboardGrid columns={6}>
          <DashboardItem title="Widget 1">
            <div className="h-32 flex items-center justify-center">
              <p>Content 1</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget 2">
            <div className="h-32 flex items-center justify-center">
              <p>Content 2</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget A" colSpan={2}>
            <div className="h-32 flex items-center justify-center">
              <p>Spans 2 columns</p>
            </div>
          </DashboardItem>
          <DashboardItem title="Widget B" colSpan={2}>
            <div className="h-32 flex items-center justify-center">
              <p>Spans 2 columns</p>
            </div>
          </DashboardItem>
        </DashboardGrid>
      </div>
    </div>
  )};