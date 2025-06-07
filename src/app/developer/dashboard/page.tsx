"use client";

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Calendar,
  DollarSign,
  Plus,
  Eye,
  Edit,
  BarChart3,
  Download,
  RefreshCw,
  Activity,
  ShoppingCart,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useWebSocket } from '@/hooks/useWebSocket';
import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function DeveloperDashboard() {
  const [selectedDevelopment, setSelectedDevelopment] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [refreshing, setRefreshing] = useState(false);
  const [comparisonPeriod, setComparisonPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');

  // WebSocket for real-time updates
  const { isConnected, lastMessage } = useWebSocket('/api/websocket/developer-analytics');

  const { data: developments, isLoading, refetch: refetchDevelopments } = useQuery({
    queryKey: ['developer-developments'],
    queryFn: async () => {
      const response = await fetch('/api/developments?developer=current');
      if (!response.ok) throw new Error('Failed to fetch developments');
      return response.json();
    }
  });

  const { data: analytics, refetch: refetchAnalytics } = useQuery({
    queryKey: ['developer-analytics', dateRangecomparisonPeriod],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (dateRange?.from) params.append('from', dateRange.from.toISOString());
      if (dateRange?.to) params.append('to', dateRange.to.toISOString());
      params.append('comparison', comparisonPeriod);

      const response = await fetch(`/api/analytics/developer?${params}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    },
    refetchInterval: 60000 // Refresh every minute
  });

  const { data: salesFunnel } = useQuery({
    queryKey: ['sales-funnel', selectedDevelopment],
    queryFn: async () => {
      const params = selectedDevelopment ? `?development=${selectedDevelopment}` : '';
      const response = await fetch(`/api/analytics/sales-funnel${params}`);
      if (!response.ok) throw new Error('Failed to fetch sales funnel');
      return response.json();
    }
  });

  const { data: propertyPerformance } = useQuery({
    queryKey: ['property-performance', selectedDevelopment],
    queryFn: async () => {
      const params = selectedDevelopment ? `?development=${selectedDevelopment}` : '';
      const response = await fetch(`/api/analytics/property-performance${params}`);
      if (!response.ok) throw new Error('Failed to fetch property performance');
      return response.json();
    }
  });

  const { data: recentActivities } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/activities?limit=10');
      if (!response.ok) throw new Error('Failed to fetch activities');
      return response.json();
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  // Handle real-time updates
  useEffect(() => {
    if (lastMessage) {
      // Update analytics data based on WebSocket message
      refetchAnalytics();
      refetchDevelopments();
    }
  }, [lastMessage, refetchAnalytics, refetchDevelopments]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchDevelopments(),
      refetchAnalytics()
    ]);
    setRefreshing(false);
  };

  const handleExport = async (type: 'pdf' | 'excel' | 'csv') => {
    const params = new URLSearchParams();
    params.append('format', type);
    if (dateRange?.from) params.append('from', dateRange.from.toISOString());
    if (dateRange?.to) params.append('to', dateRange.to.toISOString());

    const response = await fetch(`/api/analytics/export?${params}`);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `developer-analytics-${format(new Date(), 'yyyy-MM-dd')}.${type}`;
      a.click();
    }
  };

  if (isLoading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your property developments</p>
          </div>
          <Button asChild>
            <Link href="/developer/developments/new">
              <Plus className="mr-2 h-4 w-4" />
              New Development
            </Link>
          </Button>
        </div>

        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              className="w-[300px]"
            />
            <Select value={comparisonPeriod} onValueChange={(value: any) => setComparisonPeriod(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Comparison period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Daily</SelectItem>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('excel')}>
              <Download className="mr-2 h-4 w-4" />
              Export Excel
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <div className={cn(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
              <span className="text-muted-foreground">
                {isConnected ? "Live" : "Offline"
              </span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€{analytics?.totalSales?.toLocaleString() || 0}</div>
              <div className="flex items-center text-xs">
                {analytics?.salesChange > 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  analytics?.salesChange > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(analytics?.salesChange || 0)}%
                </span>
                <span className="ml-1 text-muted-foreground">vs last {comparisonPeriod}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                €{analytics?.totalRevenue?.toLocaleString() || 0}
              </div>
              <div className="flex items-center text-xs">
                {analytics?.revenueChange > 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  analytics?.revenueChange > 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(analytics?.revenueChange || 0)}%
                </span>
                <span className="ml-1 text-muted-foreground">vs last {comparisonPeriod}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.conversionRate || 0}%</div>
              <Progress value={analytics?.conversionRate || 0} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {analytics?.conversions || 0} of {analytics?.totalLeads || 0} leads
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time to Sale</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.avgTimeToSale || 0} days</div>
              <div className="flex items-center text-xs">
                {analytics?.timeToSaleChange < 0 ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-600" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                )}
                <span className={cn(
                  "font-medium",
                  analytics?.timeToSaleChange < 0 ? "text-green-600" : "text-red-600"
                )}>
                  {Math.abs(analytics?.timeToSaleChange || 0)} days
                </span>
                <span className="ml-1 text-muted-foreground">vs last {comparisonPeriod}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sales Funnel & Recent Activities */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Sales Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesFunnel?.stages || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6">
                    {salesFunnel?.stages?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${220 - index * 30}, 70%, 50%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Recent Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentActivities?.activities?.slice(0, 5).map((activity: any, index: number) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(activity.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="developments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="developments">Developments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Developments Tab */}
          <TabsContent value="developments" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {developments?.map((dev: any) => (
                <Card key={dev.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => setSelectedDevelopment(dev.id)}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{dev.name}</CardTitle>
                        <p className="text-sm text-gray-600">{dev.location}</p>
                      </div>
                      <Badge variant={dev.status === 'active' ? 'success' : 'secondary'}>
                        {dev.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Total Units:</span>
                        <span className="font-medium">{dev.totalUnits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Available:</span>
                        <span className="font-medium">{dev.availableUnits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Reserved:</span>
                        <span className="font-medium">{dev.reservedUnits}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Sold:</span>
                        <span className="font-medium">{dev.soldUnits}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/developer/developments/${dev.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/developer/developments/${dev.id}/edit`}>
                          <Edit className="mr-1 h-3 w-3" />
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Transaction list would go here */}
                  <div className="text-center py-8 text-gray-500">
                    Transaction list coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Development Documents</CardTitle>
                  <Button size="sm">
                    <Plus className="mr-1 h-3 w-3" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document list would go here */}
                  <div className="text-center py-8 text-gray-500">
                    Document management coming soon...
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            {/* Revenue & Sales Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.revenueData || []}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value: any) => `€${value.toLocaleString()}`} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sales by Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.salesByDevelopment || []}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analytics?.salesByDevelopment?.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `€${value.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Property Performance */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Property Performance</CardTitle>
                  <Select value={selectedDevelopment || "all"} onValueChange={setSelectedDevelopment}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="All Developments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Developments</SelectItem>
                      {developments?.map((dev: any) => (
                        <SelectItem key={dev.id} value={dev.id}>{dev.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Top Performing Properties */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Top Performing Properties</h4>
                    <div className="space-y-2">
                      {propertyPerformance?.topProperties?.map((property: any, index: number) => (
                        <div key={property.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">#{index + 1}</span>
                            <div>
                              <p className="font-medium">{property.name}</p>
                              <p className="text-xs text-muted-foreground">{property.development}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">€{property.price.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">{property.views} views</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Heat Map Placeholder */}
                  <div>
                    <h4 className="text-sm font-medium mb-3">Unit Interest Heat Map</h4>
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Interactive heat map visualization</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cash Flow</p>
                    <p className="text-2xl font-bold">€{analytics?.cashFlow?.toLocaleString() || 0}</p>
                    <LineChart width={100} height={40} data={analytics?.cashFlowTrend || []}>
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding Payments</p>
                    <p className="text-2xl font-bold">€{analytics?.outstandingPayments?.toLocaleString() || 0}</p>
                    <Progress value={analytics?.paymentCollectionRate || 0} className="mt-2" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Projected Revenue</p>
                    <p className="text-2xl font-bold">€{analytics?.projectedRevenue?.toLocaleString() || 0}</p>
                    <p className="text-xs text-muted-foreground">Next 90 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}