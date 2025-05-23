import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Bell, 
  Building2, 
  UserCircle, 
  FileText, 
  Home, 
  LayoutDashboard, 
  Layers, 
  LogOut, 
  MessageSquare, 
  Settings, 
  Users 
} from 'lucide-react';

import { AppShell } from '../components/layout/AppShell';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { DropdownMenuItem } from '../components/ui/dropdown-menu';
import { Badge } from '../components/ui/badge';
import { ChartWrapper } from '../components/ui/chart-wrapper';
import { MetricCard } from '../components/ui/metric-card';

const meta: Meta<typeof AppShell> = {
  title: 'Layout/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen'},
  tags: ['autodocs']};

export default meta;
type Story = StoryObj<typeof AppShell>\n  );
// Sample metrics data
const metricTrendData = Array.from({ length: 7 }, (_i) => ({
  value: 10 + Math.random() * 50}));

// Sample chart data
const barChartData = [
  { name: 'Jan', revenue: 12000, expenses: 8000, profit: 4000 },
  { name: 'Feb', revenue: 15000, expenses: 10000, profit: 5000 },
  { name: 'Mar', revenue: 18000, expenses: 12000, profit: 6000 },
  { name: 'Apr', revenue: 21000, expenses: 13000, profit: 8000 },
  { name: 'May', revenue: 23000, expenses: 14000, profit: 9000 },
  { name: 'Jun', revenue: 26000, expenses: 16000, profit: 10000 }];

// Custom header with search
const CustomHeader = () => (
  <div className="flex w-full items-center gap-4">
    <div className="relative w-full max-w-sm">
      <Input
        placeholder="Search properties, projects..."
        className="pl-8"
      />
      <div className="absolute left-2.5 top-2.5 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.3-4.3"></path>
        </svg>
      </div>
    </div>
    <div className="ml-auto flex items-center gap-2">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
          3
        </span>
      </Button>
      <Button variant="ghost" size="icon">
        <MessageSquare className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

// Custom footer content
const CustomFooter = () => (
  <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
    <div>© 2023 PropIE. All rights reserved.</div>
    <div className="flex gap-4">
      <a href="#" className="hover:text-foreground">Privacy Policy</a>
      <a href="#" className="hover:text-foreground">Terms of Service</a>
      <a href="#" className="hover:text-foreground">Contact</a>
    </div>
  </div>
);

// Custom profile actions
const CustomProfileActions = () => (
  <>
    <DropdownMenuItem asChild>
      <a href="#" className="flex items-center">
        <Users className="mr-2 h-4 w-4" />
        <span>Manage Team</span>
      </a>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <a href="#" className="flex items-center">
        <FileText className="mr-2 h-4 w-4" />
        <span>Documents</span>
      </a>
    </DropdownMenuItem>
  </>
);

// Custom logo
const CustomLogo = () => (
  <div className="flex items-center gap-2">
    <Building2 className="h-6 w-6 text-primary" />
    <span className="text-xl font-bold">PropIE AWS Platform</span>
  </div>
);

// Default example with placeholder content
export const Default: Story = {
  render: () => (
    <AppShell>
      <div className="container py-6">
        <div className="mb-6 space-y-1">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your property management dashboard.
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€123,456</div>
                <p className="text-xs text-muted-foreground">+25% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Properties Sold</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">+8% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">+2 new this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">186</div>
                <p className="text-xs text-muted-foreground">+12 this month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )};

// Enhanced dashboard with advanced UI components
export const EnhancedDashboard: Story = {
  render: () => (
    <AppShell
      headerContent={<CustomHeader />}
      footerContent={<CustomFooter />}
      profileActions={<CustomProfileActions />}
      logoContent={<CustomLogo />}
    >
      <div className="container py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, John! Here's your development overview.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">Export</Button>
            <Button>New Project</Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Metrics Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Revenue"
              value="€234,567"
              subtitle="Monthly revenue"
              trendValue={12.5}
              trendLabel="vs last month"
              trendData={metricTrendData}
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

          {/* Charts Row */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
                <CardDescription>Financial overview for the last 6 months</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartWrapper
                  data={barChartData}
                  type="bar"
                  series={[
                    { dataKey: 'revenue', name: 'Revenue' },
                    { dataKey: 'expenses', name: 'Expenses' },
                    { dataKey: 'profit', name: 'Profit' }]}
                  xAxisKey="name"
                  height={300}
                  formatYAxis={(value) => `€${value / 1000}k`}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Properties Overview</CardTitle>
                <CardDescription>Status distribution across your portfolio</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                    <div className="text-sm">For Sale (42)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="text-sm">Sold (28)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="text-sm">Reserved (15)</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                    <div className="text-sm">Off Market (7)</div>
                  </div>
                  <div className="mt-6">
                    <Badge variant="outline" className="mb-2">Total Properties</Badge>
                    <p className="text-3xl font-bold">92</p>
                  </div>
                </div>
                <div className="aspect-square w-40 rounded-full border-8 border-blue-500 flex items-center justify-center relative">
                  <div className="absolute inset-0 rounded-full border-8 border-green-500 border-t-transparent border-r-transparent border-b-transparent"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-yellow-500 border-t-transparent border-r-transparent border-l-transparent"></div>
                  <div className="absolute inset-0 rounded-full border-8 border-gray-300 border-t-transparent border-l-transparent border-b-transparent"></div>
                  <div className="text-sm font-semibold">Portfolio</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities & Upcoming */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Your team's activity over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                <div className="space-y-4">
                  {Array.from({ length: 6 }).map((_i) => (
                    <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        {[<Home />, <Users />, <FileText />, <MessageSquare />][i % 4]}
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {[
                            "New property listed", 
                            "Client meeting scheduled", 
                            "Contract signed", 
                            "New inquiry received",
                            "Property viewing scheduled",
                            "Price adjustment approved"
                          ][i % 6]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            "John Doe added a new property in Dublin",
                            "Meeting with Sarah Johnson on Thursday at 2pm",
                            "Contract signed for Property #12345",
                            "New inquiry for Property #67890",
                            "Property viewing scheduled for tomorrow at 10am",
                            "Price adjustment for Property #45678 approved"
                          ][i % 6]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {["1 hour ago", "3 hours ago", "Yesterday", "2 days ago", "3 days ago", "4 days ago"][i % 6]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Schedule for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent className="max-h-80 overflow-auto">
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_i) => (
                    <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                      <div className="grid gap-1 text-center">
                        <p className="text-xs text-muted-foreground">
                          {["Mon", "Tue", "Wed", "Thu"][i]}
                        </p>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border">
                          <p className="text-base tabular-nums">{[12, 13, 1415][i]}</p>
                        </div>
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">
                          {[
                            "Property Viewing",
                            "Team Meeting",
                            "Client Consultation",
                            "Site Inspection"
                          ][i]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {[
                            "12:00 PM - 123 Main St, Dublin",
                            "2:00 PM - Conference Room A",
                            "10:30 AM - Smith Family",
                            "3:30 PM - FitzGerald Gardens Site"
                          ][i]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )};

// Mobile and responsive variants
export const MobileVariant: Story = {
  render: () => (
    <AppShell
      defaultCollapsed={true}
      headerContent={<CustomHeader />}
    >
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>Your property management dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <p>This is an example of a mobile-friendly dashboard.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_i) => (
                  <div key={i} className="flex gap-4 border-b pb-4 last:border-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      {[<Home />, <Users />, <FileText />][i]}
                    </div>
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {[
                          "New property listed", 
                          "Client meeting scheduled", 
                          "Contract signed"
                        ][i]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {["1 hour ago", "3 hours ago", "Yesterday"][i]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )};

// Without sidebar
export const WithoutSidebar: Story = {
  render: () => (
    <AppShell
      showSidebar={false}
      logoContent={<CustomLogo />}
    >
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Welcome to PropIE</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>About Our Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Welcome to the PropIE AWS Platform, your comprehensive property
                development management solution. This example shows a layout
                without a sidebar, which is perfect for landing pages, marketing
                sites, or public-facing areas of your application.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                <li>Comprehensive property management</li>
                <li>Real-time analytics and reporting</li>
                <li>Document management system</li>
                <li>Team collaboration tools</li>
                <li>Client portal and communication</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  )};

// Compact layout with collapsed sidebar
export const CompactLayout: Story = {
  render: () => (
    <AppShell
      defaultCollapsed={true}
      collapsible={false}
      collapsedSidebarWidth="60px"
      mainNavHeight="3.5rem"
      footerHeight="2.5rem"
      footerContent={<div className="text-xs text-muted-foreground text-center w-full">© 2023 PropIE</div>}
    >
      <div className="container py-4">
        <h2 className="text-xl font-bold mb-4">Compact Dashboard</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="Revenue"
            value="€234K"
            trendValue={12.5}
            variant="default"
          />
          
          <MetricCard
            title="Customers"
            value="1,234"
            trendValue={-3.2}
            variant="outline"
          />
          
          <MetricCard
            title="Properties"
            value="48"
            trendValue={8.7}
            variant="info"
          />
          
          <MetricCard
            title="Conversion"
            value="3.6%"
            trendValue={0.8}
            variant="success"
          />
        </div>
      </div>
    </AppShell>
  )};