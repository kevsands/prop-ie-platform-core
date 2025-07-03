'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Package, 
  Target,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Eye,
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Plus,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Award,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area } from 'recharts';

/**
 * Enterprise PROP Choice Analytics & Insights Dashboard
 * Comprehensive business intelligence, performance monitoring, and predictive analytics
 * Advanced reporting, customer insights, and market intelligence
 */

interface AnalyticsData {
  project: any;
  kpis: any;
  revenueAnalytics: any;
  packagePerformance: any;
  buyerAnalytics: any;
  marketIntelligence: any;
  predictiveAnalytics: any;
  operationalMetrics: any;
  financialAnalytics: any;
}

const PropChoiceAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [view, setView] = useState('overview');

  // Load analytics data
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe, view]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('projectId', 'proj_fitzgerald_gardens');
      params.append('timeframe', timeframe);
      params.append('view', view);

      const response = await fetch(`/api/developer/prop-choice/analytics?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setAnalyticsData(result.data);
      }
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading analytics data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PROP Choice Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights and performance analytics for {analyticsData?.project?.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <CustomReportDialog />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Revenue"
          value={formatCurrency(analyticsData?.kpis?.revenue?.total || 0)}
          change={analyticsData?.kpis?.revenue?.growth || 0}
          target={analyticsData?.kpis?.revenue?.target}
          icon={DollarSign}
          color="green"
        />
        
        <KPICard
          title="Conversion Rate"
          value={formatPercentage(analyticsData?.kpis?.conversionRate?.overall || 0)}
          change={analyticsData?.kpis?.conversionRate?.change || 0}
          target={analyticsData?.kpis?.conversionRate?.target}
          icon={Target}
          color="blue"
        />

        <KPICard
          title="Avg Order Value"
          value={formatCurrency(analyticsData?.kpis?.averageOrderValue?.current || 0)}
          change={analyticsData?.kpis?.averageOrderValue?.growth || 0}
          icon={Package}
          color="purple"
        />

        <KPICard
          title="Customer Satisfaction"
          value={`${analyticsData?.kpis?.customerSatisfaction?.score || 0}/5`}
          change={analyticsData?.kpis?.customerSatisfaction?.nps || 0}
          icon={Star}
          color="orange"
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewDashboard data={analyticsData} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueAnalytics data={analyticsData?.revenueAnalytics} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceAnalytics 
            packageData={analyticsData?.packagePerformance}
            operationalData={analyticsData?.operationalMetrics}
          />
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <CustomerAnalytics data={analyticsData?.buyerAnalytics} />
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <MarketIntelligence data={analyticsData?.marketIntelligence} />
        </TabsContent>

        <TabsContent value="predictive" className="space-y-6">
          <PredictiveAnalytics data={analyticsData?.predictiveAnalytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// KPI Card Component
const KPICard: React.FC<{
  title: string;
  value: string;
  change?: number;
  target?: number;
  icon: any;
  color: string;
}> = ({ title, value, change, target, icon: Icon, color }) => {
  const getColorClasses = (color: string) => {
    const colors = {
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            
            <div className="flex items-center space-x-2 mt-1">
              {change !== undefined && (
                <div className={`flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
                </div>
              )}
              
              {target && (
                <div className="text-xs text-gray-500">
                  Target: {typeof target === 'number' ? (target > 100 ? formatCurrency(target) : `${target}%`) : target}
                </div>
              )}
            </div>
          </div>
          
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Overview Dashboard Component
const OverviewDashboard: React.FC<{ data: any }> = ({ data }) => {
  const monthlyData = data?.revenueAnalytics?.monthlyTrend || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Package Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.packagePerformance?.popularPackages?.slice(0, 5).map((pkg: any, index: number) => (
              <div key={pkg.packageId} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{pkg.name}</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>{pkg.orders} orders</span>
                    <span>•</span>
                    <span>{formatPercentage(pkg.conversionRate)} conversion</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(pkg.revenue)}</p>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-3 w-3 mr-1" />
                    <span className="text-xs">{pkg.averageRating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Customer Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Age Distribution</p>
              {Object.entries(data?.buyerAnalytics?.demographics?.ageGroups || {}).map(([age, info]: [string, any]) => (
                <div key={age} className="flex justify-between items-center mb-1">
                  <span className="text-sm">{age}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={info.percentage} className="w-16 h-2" />
                    <span className="text-xs text-gray-500">{info.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InsightCard
              type="opportunity"
              title="Premium Package Growth"
              description="Premium packages show 15% higher conversion rates and 43% better margins"
              icon={Lightbulb}
              color="green"
            />
            
            <InsightCard
              type="warning"
              title="Supply Chain Risk"
              description="Premier Kitchens approaching capacity limits. May impact Q4 deliveries"
              icon={AlertTriangle}
              color="amber"
            />
            
            <InsightCard
              type="trend"
              title="Smart Home Demand"
              description="Smart home packages showing 45% month-over-month growth"
              icon={Zap}
              color="blue"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Revenue Analytics Component
const RevenueAnalytics: React.FC<{ data: any }> = ({ data }) => {
  const revenueByCategory = Object.entries(data?.revenueByCategory || {}).map(([category, info]: [string, any]) => ({
    name: category.replace('_', ' ').toUpperCase(),
    value: info.revenue,
    percentage: info.percentage
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Category */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={revenueByCategory}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {revenueByCategory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Margin Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Margin Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Gross Margin</span>
                <span className="font-medium">{data?.marginAnalysis?.grossMargin}%</span>
              </div>
              <Progress value={data?.marginAnalysis?.grossMargin} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span>Net Margin</span>
                <span className="font-medium">{data?.marginAnalysis?.netMargin}%</span>
              </div>
              <Progress value={data?.marginAnalysis?.netMargin} className="h-2" />
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm font-medium mb-2">Margin by Package</p>
              {Object.entries(data?.marginAnalysis?.marginByPackage || {}).map(([pkg, margin]: [string, any]) => (
                <div key={pkg} className="flex justify-between items-center py-1">
                  <span className="text-sm capitalize">{pkg}</span>
                  <span className="text-sm font-medium">{margin}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Revenue Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue & AOV Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsLineChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" />
              <Line yAxisId="right" type="monotone" dataKey="aov" stroke="#ff7300" strokeWidth={2} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Performance Analytics Component
const PerformanceAnalytics: React.FC<{ packageData: any; operationalData: any }> = ({ packageData, operationalData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Package Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Package Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {packageData?.popularPackages?.map((pkg: any) => (
              <div key={pkg.packageId} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{pkg.name}</h4>
                  <Badge variant="outline">{pkg.orders} orders</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Conversion Rate</p>
                    <p className="font-medium text-green-600">{pkg.conversionRate}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Revenue</p>
                    <p className="font-medium">{formatCurrency(pkg.revenue)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Margin</p>
                    <p className="font-medium">{pkg.marginPercent}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Lead Time</p>
                    <p className="font-medium">{pkg.leadTime} days</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operational Efficiency */}
      <Card>
        <CardHeader>
          <CardTitle>Operational Efficiency</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">{operationalData?.efficiency?.orderProcessingTime}</p>
                <p className="text-sm text-gray-600">Avg Processing Time (days)</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">{operationalData?.efficiency?.deliveryTime}</p>
                <p className="text-sm text-gray-600">Avg Delivery Time (days)</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Resource Utilization</p>
              {Object.entries(operationalData?.resourceUtilization || {}).map(([resource, utilization]: [string, any]) => (
                <div key={resource} className="flex justify-between items-center mb-2">
                  <span className="text-sm capitalize">{resource.replace(/([A-Z])/g, ' $1')}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={utilization} className="w-20 h-2" />
                    <span className="text-sm font-medium">{utilization}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="font-medium mb-2">Quality Metrics</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Defect Rate</span>
                  <span className="text-red-600">{operationalData?.qualityMetrics?.defectRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Return Rate</span>
                  <span className="text-red-600">{operationalData?.qualityMetrics?.returnRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Satisfaction Score</span>
                  <span className="text-green-600">{operationalData?.qualityMetrics?.satisfactionScore}/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Complaints</span>
                  <span className="text-amber-600">{operationalData?.qualityMetrics?.customerComplaints}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends & Insights */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Package Trends & Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-medium text-green-600 mb-2">Emerging Trends</p>
              <div className="space-y-1">
                {packageData?.packageTrends?.emerging?.map((trend: string) => (
                  <Badge key={trend} variant="outline" className="mr-1 mb-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {trend.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-red-600 mb-2">Declining</p>
              <div className="space-y-1">
                {packageData?.packageTrends?.declining?.map((trend: string) => (
                  <Badge key={trend} variant="outline" className="mr-1 mb-1">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    {trend.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <p className="font-medium text-blue-600 mb-2">Most Customized</p>
              <div className="space-y-1">
                {packageData?.customizationAnalysis?.mostCustomized?.map((item: string) => (
                  <Badge key={item} variant="outline" className="mr-1 mb-1">
                    {item.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Customer Analytics Component
const CustomerAnalytics: React.FC<{ data: any }> = ({ data }) => {
  const selectionJourney = data?.selectionJourney?.dropOffPoints || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Age Groups</p>
              {Object.entries(data?.demographics?.ageGroups || {}).map(([age, info]: [string, any]) => (
                <div key={age} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{age}</span>
                    <span>{info.percentage}%</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>AOV: {formatCurrency(info.aov)}</span>
                    <span>Conv: {info.conversionRate}%</span>
                  </div>
                  <Progress value={info.percentage} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Journey */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Journey Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">{data?.selectionJourney?.averageTimeToDecision}</p>
                <p className="text-sm text-gray-600">Days to Decision</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">{data?.selectionJourney?.averagePageViews}</p>
                <p className="text-sm text-gray-600">Avg Page Views</p>
              </div>
            </div>

            <div>
              <p className="font-medium mb-2">Drop-off Points</p>
              {selectionJourney.map((point: any, index: number) => (
                <div key={point.stage} className="mb-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{point.stage.replace('_', ' ')}</span>
                    <span className="text-red-600">{point.dropRate}%</span>
                  </div>
                  <Progress value={100 - point.dropRate} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-medium mb-2">Top Features</p>
              {data?.preferences?.topFeatures?.slice(0, 5).map((feature: any) => (
                <div key={feature.feature} className="flex justify-between items-center mb-2">
                  <span className="text-sm capitalize">{feature.feature.replace('_', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={feature.demand} className="w-16 h-2" />
                    <span className="text-xs">{feature.demand}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="font-medium mb-2">Style Preferences</p>
              {Object.entries(data?.preferences?.stylePreferences || {}).map(([style, percentage]: [string, any]) => (
                <div key={style} className="flex justify-between items-center mb-1">
                  <span className="text-sm capitalize">{style.replace('_', ' ')}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversion Factors */}
      <Card>
        <CardHeader>
          <CardTitle>Conversion Factors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data?.selectionJourney?.conversionFactors || {}).map(([factor, info]: [string, any]) => (
              <div key={factor} className="border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium capitalize">{factor.replace('_', ' ')}</span>
                  <Badge variant="outline">{info.usage}% usage</Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Impact on conversion:</span>
                  <span className="font-medium text-green-600">+{info.impact}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Market Intelligence Component
const MarketIntelligence: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Competitive Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Landscape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data?.competitiveAnalysis?.competitorComparison?.map((competitor: any) => (
                <div key={competitor.competitor} className="border rounded p-4">
                  <h4 className="font-medium mb-2">{competitor.competitor}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Market Share</span>
                      <span className="font-medium">{competitor.marketShare}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Price</span>
                      <span className="font-medium">{formatCurrency(competitor.avgPrice)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rating</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-500 mr-1" />
                        <span className="font-medium">{competitor.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-green-600 mb-2">Growth Segments</p>
                <div className="space-y-1">
                  {data?.marketTrends?.growthSegments?.map((segment: string) => (
                    <Badge key={segment} variant="outline" className="mr-1 mb-1 text-green-600">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {segment.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-red-600 mb-2">Declining Segments</p>
                <div className="space-y-1">
                  {data?.marketTrends?.decliningSegments?.map((segment: string) => (
                    <Badge key={segment} variant="outline" className="mr-1 mb-1 text-red-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {segment.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium text-blue-600 mb-2">Emerging Technologies</p>
                <div className="space-y-1">
                  {data?.marketTrends?.emergingTechnologies?.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="mr-1 mb-1 text-blue-600">
                      <Zap className="h-3 w-3 mr-1" />
                      {tech.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium mb-2">Price Elasticity</p>
                <p className="text-2xl font-bold text-center text-blue-600">
                  {data?.pricingIntelligence?.priceElasticity}
                </p>
                <p className="text-sm text-gray-600 text-center">Demand sensitivity to price changes</p>
              </div>

              <div>
                <p className="font-medium mb-2">Optimal Price Points</p>
                {Object.entries(data?.pricingIntelligence?.optimalPricePoints || {}).map(([tier, prices]: [string, any]) => (
                  <div key={tier} className="mb-2">
                    <p className="text-sm font-medium capitalize">{tier}</p>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Min: {formatCurrency(prices.min)}</span>
                      <span className="font-medium">Optimal: {formatCurrency(prices.optimal)}</span>
                      <span>Max: {formatCurrency(prices.max)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Predictive Analytics Component
const PredictiveAnalytics: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="space-y-6">
      {/* Demand Forecasting */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Demand Forecasting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <p className="text-3xl font-bold text-blue-600">
                  {data?.demandForecasting?.nextQuarter?.expectedOrders}
                </p>
                <p className="text-sm text-gray-600">Expected Orders Next Quarter</p>
                <p className="text-xs text-gray-500 mt-1">
                  Range: {data?.demandForecasting?.nextQuarter?.confidenceInterval?.[0]} - {data?.demandForecasting?.nextQuarter?.confidenceInterval?.[1]}
                </p>
              </div>

              <div>
                <p className="font-medium mb-2">Seasonal Patterns</p>
                {Object.entries(data?.demandForecasting?.seasonalPatterns || {}).map(([quarter, info]: [string, any]) => (
                  <div key={quarter} className="mb-2 p-2 border rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{quarter}</span>
                      <Badge variant={
                        info.demand === 'peak' ? 'default' :
                        info.demand === 'high' ? 'secondary' :
                        info.demand === 'moderate' ? 'outline' : 'outline'
                      }>
                        {info.demand}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Factors: {info.factors?.join(', ')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Lifetime Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(data?.customerLifetimeValue?.averageCLV || 0)}
                </p>
                <p className="text-sm text-gray-600">Average Customer Lifetime Value</p>
              </div>

              <div>
                <p className="font-medium mb-2">CLV by Segment</p>
                {Object.entries(data?.customerLifetimeValue?.segmentCLV || {}).map(([segment, clv]: [string, any]) => (
                  <div key={segment} className="flex justify-between items-center mb-2">
                    <span className="text-sm capitalize">{segment.replace('_', ' ')}</span>
                    <span className="font-medium">{formatCurrency(clv)}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="font-bold">{(data?.customerLifetimeValue?.retentionProbability * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-600">Retention Rate</p>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <p className="font-bold">{(data?.customerLifetimeValue?.upsellPotential * 100).toFixed(0)}%</p>
                  <p className="text-xs text-gray-600">Upsell Potential</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="font-medium mb-3">Churn Risk Distribution</p>
              {Object.entries(data?.riskAnalysis?.churnRisk || {}).map(([risk, percentage]: [string, any]) => (
                <div key={risk} className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{risk.replace('Risk', ' Risk')}</span>
                    <span>{percentage}%</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={`h-2 ${
                      risk === 'highRisk' ? 'text-red-600' :
                      risk === 'mediumRisk' ? 'text-yellow-600' : 'text-green-600'
                    }`} 
                  />
                </div>
              ))}
            </div>

            <div>
              <p className="font-medium mb-3">Supplier Risks</p>
              {data?.riskAnalysis?.supplierRisks?.map((risk: any, index: number) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <p className="font-medium text-sm">{risk.supplier}</p>
                  <p className="text-xs text-gray-600 capitalize">{risk.risk.replace('_', ' ')}</p>
                  <div className="flex items-center mt-1">
                    <Progress value={risk.probability * 100} className="flex-1 h-1 mr-2" />
                    <span className="text-xs">{(risk.probability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="font-medium mb-3">Market Risks</p>
              {data?.riskAnalysis?.marketRisks?.map((risk: any, index: number) => (
                <div key={index} className="mb-2 p-2 border rounded">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm capitalize">{risk.risk.replace('_', ' ')}</p>
                    <Badge variant={risk.impact === 'high' ? 'destructive' : risk.impact === 'medium' ? 'secondary' : 'outline'}>
                      {risk.impact}
                    </Badge>
                  </div>
                  <div className="flex items-center">
                    <Progress value={risk.probability * 100} className="flex-1 h-1 mr-2" />
                    <span className="text-xs">{(risk.probability * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Insight Card Component
const InsightCard: React.FC<{
  type: 'opportunity' | 'warning' | 'trend';
  title: string;
  description: string;
  icon: any;
  color: string;
}> = ({ type, title, description, icon: Icon, color }) => {
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    amber: 'border-amber-200 bg-amber-50',
    blue: 'border-blue-200 bg-blue-50'
  };

  const iconColors = {
    green: 'text-green-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600'
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 mt-0.5 ${iconColors[color as keyof typeof iconColors]}`} />
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Custom Report Dialog Component
const CustomReportDialog: React.FC = () => {
  const [reportConfig, setReportConfig] = useState({
    name: '',
    type: 'financial',
    metrics: [] as string[],
    schedule: 'monthly'
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Custom Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Custom Report</DialogTitle>
          <DialogDescription>
            Configure a custom analytics report with specific metrics and scheduling
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="reportName">Report Name</Label>
            <Input 
              id="reportName"
              value={reportConfig.name}
              onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Monthly Revenue Analysis"
            />
          </div>

          <div>
            <Label htmlFor="reportType">Report Type</Label>
            <Select 
              value={reportConfig.type} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="financial">Financial</SelectItem>
                <SelectItem value="operational">Operational</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="market">Market</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Metrics to Include</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {['Revenue', 'Conversion Rate', 'AOV', 'Customer Satisfaction', 'Margin Analysis', 'Package Performance'].map(metric => (
                <div key={metric} className="flex items-center space-x-2">
                  <Checkbox 
                    checked={reportConfig.metrics.includes(metric)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setReportConfig(prev => ({
                          ...prev,
                          metrics: [...prev.metrics, metric]
                        }));
                      } else {
                        setReportConfig(prev => ({
                          ...prev,
                          metrics: prev.metrics.filter(m => m !== metric)
                        }));
                      }
                    }}
                  />
                  <Label className="text-sm">{metric}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="schedule">Schedule</Label>
            <Select 
              value={reportConfig.schedule} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, schedule: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            Create Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropChoiceAnalytics;