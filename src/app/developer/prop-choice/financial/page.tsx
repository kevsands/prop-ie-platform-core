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
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Banknote,
  Receipt,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  RefreshCw,
  Download,
  Plus,
  Settings,
  Activity,
  Target,
  PieChart,
  BarChart3,
  Calculator,
  Shield,
  Percent,
  Building,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ExternalLink
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie, AreaChart, Area } from 'recharts';

/**
 * Enterprise Financial Integration Dashboard
 * Comprehensive financial management, ERP integration, and revenue tracking
 * Real-time financial monitoring and automated accounting workflows
 */

interface FinancialData {
  project: any;
  integrationStatus: any;
  realtimeMetrics: any;
  revenueTracking: any;
  paymentProcessing: any;
  taxManagement: any;
  commissionTracking: any;
  financialReporting: any;
  budgetManagement: any;
  systemHealth: any;
}

const FinancialIntegration: React.FC = () => {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');
  const [view, setView] = useState('overview');

  // Load financial data
  useEffect(() => {
    fetchFinancialData();
  }, [timeframe, view]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('projectId', 'proj_fitzgerald_gardens');
      params.append('timeframe', timeframe);
      params.append('view', view);

      const response = await fetch(`/api/developer/prop-choice/financial-integration?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setFinancialData(result.data);
      }
    } catch (error) {
      console.error('Failed to load financial data:', error);
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
        <span className="ml-2">Loading financial data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Integration</h1>
          <p className="text-gray-600 mt-2">
            Real-time financial management and ERP integration for {financialData?.project?.name}
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
          <Button variant="outline" size="sm" onClick={fetchFinancialData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Now
          </Button>
          <FinancialReportDialog />
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Real-time Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <FinancialKPICard
          title="Year to Date Revenue"
          value={formatCurrency(financialData?.realtimeMetrics?.yearToDateRevenue || 0)}
          change={12.4}
          icon={DollarSign}
          color="green"
        />
        
        <FinancialKPICard
          title="Month to Date"
          value={formatCurrency(financialData?.realtimeMetrics?.monthToDateRevenue || 0)}
          change={8.7}
          icon={TrendingUp}
          color="blue"
        />

        <FinancialKPICard
          title="Cash Flow"
          value={formatCurrency(financialData?.realtimeMetrics?.cashFlow?.netFlow || 0)}
          change={financialData?.realtimeMetrics?.cashFlow?.netFlow > 0 ? 15.2 : -5.3}
          icon={Banknote}
          color="purple"
        />

        <FinancialKPICard
          title="Pending Invoices"
          value={formatCurrency(financialData?.realtimeMetrics?.pendingInvoices || 0)}
          change={-12.1}
          icon={Receipt}
          color="orange"
        />
      </div>

      {/* Integration Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            System Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialData?.integrationStatus?.connectedSystems?.map((system: any) => (
              <IntegrationStatusCard key={system.systemId} system={system} />
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <span className="font-medium text-green-900">All Systems Connected</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                Last sync: {new Date(financialData?.integrationStatus?.lastFullReconciliation || '').toLocaleTimeString()}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Financial Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tax">Tax & Compliance</TabsTrigger>
          <TabsTrigger value="reporting">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <OverviewDashboard data={financialData} />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <RevenueTracking data={financialData?.revenueTracking} />
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentProcessing 
            paymentData={financialData?.paymentProcessing}
            commissionData={financialData?.commissionTracking}
          />
        </TabsContent>

        <TabsContent value="tax" className="space-y-6">
          <TaxCompliance data={financialData?.taxManagement} />
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <FinancialReporting 
            reportingData={financialData?.financialReporting}
            budgetData={financialData?.budgetManagement}
          />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <IntegrationSettings 
            systems={financialData?.integrationStatus?.connectedSystems}
            health={financialData?.systemHealth}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Financial KPI Card Component
const FinancialKPICard: React.FC<{
  title: string;
  value: string;
  change?: number;
  icon: any;
  color: string;
}> = ({ title, value, change, icon: Icon, color }) => {
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
            
            {change !== undefined && (
              <div className={`flex items-center mt-1 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {change >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                <span className="text-xs font-medium">{Math.abs(change).toFixed(1)}%</span>
                <span className="text-xs text-gray-500 ml-1">vs last period</span>
              </div>
            )}
          </div>
          
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Integration Status Card Component
const IntegrationStatusCard: React.FC<{ system: any }> = ({ system }) => {
  const getStatusColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'fair': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium">{system.systemName}</h4>
        <Badge className={getStatusColor(system.syncHealth)}>
          {system.syncHealth}
        </Badge>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Data Accuracy</span>
          <span className="font-medium">{system.dataAccuracy}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Last Sync</span>
          <span className="font-medium">
            {new Date(system.lastSync).toLocaleTimeString()}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Modules</span>
          <span className="font-medium">{system.enabledModules.length}</span>
        </div>
      </div>

      <div className="mt-3 flex space-x-1">
        {system.enabledModules.slice(0, 3).map((module: string) => (
          <Badge key={module} variant="outline" className="text-xs">
            {module.replace('_', ' ')}
          </Badge>
        ))}
        {system.enabledModules.length > 3 && (
          <Badge variant="outline" className="text-xs">
            +{system.enabledModules.length - 3}
          </Badge>
        )}
      </div>
    </div>
  );
};

// Overview Dashboard Component
const OverviewDashboard: React.FC<{ data: any }> = ({ data }) => {
  const monthlyData = data?.revenueTracking?.monthlyTrend || [];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Area type="monotone" dataKey="revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(data?.revenueTracking?.revenueByCategory || {}).map(([category, info]: [string, any]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium capitalize">{category.replace('_', ' ')}</span>
                    <span className="text-sm text-gray-600">{info.percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={info.percentage} className="h-2" />
                </div>
                <div className="ml-4 text-right">
                  <p className="font-medium">{formatCurrency(info.revenue)}</p>
                  <div className={`flex items-center text-xs ${info.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {info.growth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {Math.abs(info.growth).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded">
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data?.realtimeMetrics?.cashFlow?.inflow || 0)}
                </p>
                <p className="text-sm text-gray-600">Inflow</p>
              </div>
              <div className="p-3 bg-red-50 rounded">
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(data?.realtimeMetrics?.cashFlow?.outflow || 0)}
                </p>
                <p className="text-sm text-gray-600">Outflow</p>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data?.realtimeMetrics?.cashFlow?.netFlow || 0)}
                </p>
                <p className="text-sm text-gray-600">Net Flow</p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <h4 className="font-medium mb-2">Outstanding Amounts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pending Invoices</span>
                  <span className="font-medium text-amber-600">
                    {formatCurrency(data?.realtimeMetrics?.pendingInvoices || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Overdue Invoices</span>
                  <span className="font-medium text-red-600">
                    {formatCurrency(data?.realtimeMetrics?.overdueInvoices || 0)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax Liability</span>
                  <span className="font-medium text-purple-600">
                    {formatCurrency(data?.realtimeMetrics?.taxLiability || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={Receipt}
              label="Generate Invoice"
              description="Create new invoice"
              onClick={() => console.log('Generate invoice')}
            />
            <QuickActionButton
              icon={RefreshCw}
              label="Sync All Systems"
              description="Update all integrations"
              onClick={() => console.log('Sync systems')}
            />
            <QuickActionButton
              icon={FileText}
              label="Monthly Report"
              description="Generate P&L report"
              onClick={() => console.log('Generate report')}
            />
            <QuickActionButton
              icon={Calculator}
              label="Tax Calculation"
              description="Calculate VAT/Tax"
              onClick={() => console.log('Calculate tax')}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Revenue Tracking Component
const RevenueTracking: React.FC<{ data: any }> = ({ data }) => {
  const revenueByUnitType = Object.entries(data?.revenueByUnitType || {}).map(([type, info]: [string, any]) => ({
    name: type,
    revenue: info.revenue,
    units: info.units,
    avgRevenue: info.avgRevenue
  }));

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue by Unit Type */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Unit Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={revenueByUnitType}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, revenue }) => `${name}: ${formatCurrency(revenue)}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="revenue"
              >
                {revenueByUnitType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Revenue Details */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xl font-bold text-blue-600">{formatCurrency(data?.totalRevenue || 0)}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xl font-bold text-green-600">
                  {data?.monthlyTrend?.length || 0}
                </p>
                <p className="text-sm text-gray-600">Months Tracked</p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-xl font-bold text-purple-600">
                  {data?.monthlyTrend?.reduce((sum: number, month: any) => sum + month.transactions, 0) || 0}
                </p>
                <p className="text-sm text-gray-600">Total Transactions</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Revenue by Unit Type Details</h4>
              {revenueByUnitType.map((unit) => (
                <div key={unit.name} className="mb-3 p-3 border rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium capitalize">{unit.name}</span>
                    <span className="text-sm text-gray-600">{unit.units} units</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-medium">{formatCurrency(unit.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg per Unit</span>
                    <span className="font-medium">{formatCurrency(unit.avgRevenue)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Revenue & Transaction Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.monthlyTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="revenue" fill="#8884d8" name="Revenue" />
              <Bar yAxisId="right" dataKey="transactions" fill="#82ca9d" name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Payment Processing Component
const PaymentProcessing: React.FC<{ paymentData: any; commissionData: any }> = ({ paymentData, commissionData }) => {
  const paymentMethods = Object.entries(paymentData?.paymentMethods || {}).map(([method, info]: [string, any]) => ({
    method: method.replace('_', ' ').toUpperCase(),
    amount: info.amount,
    percentage: info.percentage,
    transactions: info.transactions
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Methods Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div key={method.method} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{method.method}</span>
                    <span className="text-sm text-gray-600">{method.transactions} transactions</span>
                  </div>
                  <Progress value={method.percentage} className="h-2" />
                </div>
                <div className="ml-4 text-right">
                  <p className="font-medium">{formatCurrency(method.amount)}</p>
                  <p className="text-sm text-gray-600">{method.percentage.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Timeline Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(paymentData?.paymentTimeline || {}).map(([timeline, info]: [string, any]) => (
              <div key={timeline} className="flex items-center justify-between">
                <span className="capitalize text-sm font-medium">
                  {timeline.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-2">
                  <Progress 
                    value={info.percentage} 
                    className={`w-20 h-2 ${
                      timeline === 'paid_on_time' ? 'text-green-600' :
                      timeline === 'paid_late' ? 'text-yellow-600' : 'text-red-600'
                    }`} 
                  />
                  <span className="text-sm font-medium">{info.percentage.toFixed(1)}%</span>
                  <span className="text-sm text-gray-600">{formatCurrency(info.amount)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-2">Processing Fees</h4>
            <div className="text-center p-3 bg-red-50 rounded">
              <p className="text-xl font-bold text-red-600">
                {formatCurrency(paymentData?.processingFees?.totalFees || 0)}
              </p>
              <p className="text-sm text-gray-600">Total Processing Fees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission Tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Commission Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(commissionData?.totalCommissionsPaid || 0)}
                </p>
                <p className="text-sm text-gray-600">Paid Commissions</p>
              </div>
              <div className="p-3 bg-amber-50 rounded">
                <p className="text-xl font-bold text-amber-600">
                  {formatCurrency(Object.values(commissionData?.pendingCommissions || {}).reduce((sum: number, amount: any) => sum + amount, 0))}
                </p>
                <p className="text-sm text-gray-600">Pending Commissions</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Commission by Partner Type</h4>
              {Object.entries(commissionData?.commissionByPartner || {}).map(([partner, info]: [string, any]) => (
                <div key={partner} className="mb-2 p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium capitalize">{partner.replace('_', ' ')}</span>
                    <span className="text-sm text-gray-600">{info.orders} orders</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{info.percentage}% rate</span>
                    <span className="font-medium">{formatCurrency(info.amount)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <p className="text-sm text-gray-600">
                Next payment run: {new Date(commissionData?.nextPaymentRun || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cash Flow Projection */}
      <Card>
        <CardHeader>
          <CardTitle>Cash Flow Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(paymentData?.cashFlowProjection || {}).map(([period, amount]: [string, any]) => (
              <div key={period} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="font-medium capitalize">{period.replace('_', ' ')}</span>
                <span className="text-lg font-bold text-green-600">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Tax & Compliance Component
const TaxCompliance: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* VAT Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="h-5 w-5 mr-2" />
            VAT Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(data?.vatSummary?.totalVatCollected || 0)}
              </p>
              <p className="text-sm text-gray-600">Total VAT Collected</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">VAT by Rate</h4>
              {Object.entries(data?.vatSummary?.vatByRate || {}).map(([rate, info]: [string, any]) => (
                <div key={rate} className="mb-2 p-2 border rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {rate.replace('_', ' ').replace('standard', 'Standard')} Rate
                    </span>
                    <span className="font-medium">{formatCurrency(info.amount)}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Base amount: {formatCurrency(info.baseAmount)}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t">
              <div className="flex justify-between text-sm">
                <span>VAT Registration No.</span>
                <span className="font-mono">{data?.vatSummary?.vatRegistrationNumber}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Next VAT Return</span>
                <span className="font-medium text-red-600">
                  {new Date(data?.vatSummary?.nextVatReturn || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Corporate Tax */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="h-5 w-5 mr-2" />
            Corporate Tax
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-green-50 rounded">
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(data?.corporateTax?.estimatedTaxableProfit || 0)}
                </p>
                <p className="text-xs text-gray-600">Taxable Profit</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded">
                <p className="text-lg font-bold text-red-600">
                  {formatCurrency(data?.corporateTax?.estimatedTaxLiability || 0)}
                </p>
                <p className="text-xs text-gray-600">Tax Liability</p>
              </div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded">
              <p className="text-sm text-gray-600">Corporate Tax Rate</p>
              <p className="text-xl font-bold">{(data?.corporateTax?.corporateTaxRate * 100).toFixed(1)}%</p>
              <p className="text-xs text-gray-500">Irish trading income rate</p>
            </div>

            <div className="pt-3 border-t text-sm">
              <div className="flex justify-between">
                <span>Tax Year</span>
                <span className="font-medium">{data?.corporateTax?.taxYear}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Next Filing Date</span>
                <span className="font-medium text-red-600">
                  {new Date(data?.corporateTax?.nextFilingDate || '').toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Status */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(data?.complianceStatus || {}).filter(([key]) => key.includes('Compliance')).map(([type, status]: [string, any]) => (
              <div key={type} className="text-center p-4 border rounded">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 ${
                  status === 'current' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {status === 'current' ? 
                    <CheckCircle className="h-6 w-6 text-green-600" /> : 
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  }
                </div>
                <h4 className="font-medium">{type.replace('Compliance', ' Tax').replace(/([A-Z])/g, ' $1').trim()}</h4>
                <p className={`text-sm ${status === 'current' ? 'text-green-600' : 'text-red-600'}`}>
                  {status === 'current' ? 'Current' : 'Overdue'}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded">
              <h4 className="font-medium mb-1">Last Audit</h4>
              <p className="text-sm text-gray-600">
                {new Date(data?.complianceStatus?.lastAudit || '').toLocaleDateString()}
              </p>
            </div>
            <div className="p-3 border rounded">
              <h4 className="font-medium mb-1">Next Audit Due</h4>
              <p className="text-sm text-gray-600">
                {new Date(data?.complianceStatus?.nextAuditDue || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Financial Reporting Component
const FinancialReporting: React.FC<{ reportingData: any; budgetData: any }> = ({ reportingData, budgetData }) => {
  return (
    <div className="space-y-6">
      {/* Profit & Loss */}
      <Card>
        <CardHeader>
          <CardTitle>Profit & Loss Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Revenue & Costs</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Revenue</span>
                  <span className="font-medium">{formatCurrency(reportingData?.profitAndLoss?.revenue || 0)}</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>Cost of Sales</span>
                  <span>({formatCurrency(reportingData?.profitAndLoss?.costOfSales || 0)})</span>
                </div>
                <div className="flex justify-between font-medium text-green-600 border-t pt-2">
                  <span>Gross Profit</span>
                  <span>{formatCurrency(reportingData?.profitAndLoss?.grossProfit || 0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Gross Margin</span>
                  <span>{reportingData?.profitAndLoss?.grossMargin}%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Operating Expenses</h4>
              <div className="space-y-2">
                {Object.entries(reportingData?.profitAndLoss?.operatingExpenses || {}).filter(([key]) => key !== 'total').map(([expense, amount]: [string, any]) => (
                  <div key={expense} className="flex justify-between text-red-600">
                    <span className="capitalize">{expense.replace(/([A-Z])/g, ' $1')}</span>
                    <span>({formatCurrency(amount)})</span>
                  </div>
                ))}
                <div className="flex justify-between font-medium text-blue-600 border-t pt-2">
                  <span>EBITDA</span>
                  <span>{formatCurrency(reportingData?.profitAndLoss?.ebitda || 0)}</span>
                </div>
                <div className="flex justify-between font-bold text-green-600 border-t pt-2">
                  <span>Net Profit</span>
                  <span>{formatCurrency(reportingData?.profitAndLoss?.netProfit || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget vs Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Budget Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span>Revenue Progress</span>
                  <span>{budgetData?.annualBudget?.currentProgress?.revenueProgress}%</span>
                </div>
                <Progress value={budgetData?.annualBudget?.currentProgress?.revenueProgress} className="h-3" />
                <div className="text-xs text-gray-500 mt-1">
                  Target: {formatCurrency(budgetData?.annualBudget?.revenueTarget || 0)}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Cost Management</span>
                  <span>{budgetData?.annualBudget?.currentProgress?.costProgress}%</span>
                </div>
                <Progress value={budgetData?.annualBudget?.currentProgress?.costProgress} className="h-3" />
                <div className="text-xs text-gray-500 mt-1">
                  Budget: {formatCurrency(budgetData?.annualBudget?.costTarget || 0)}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span>Profit Achievement</span>
                  <span>{budgetData?.annualBudget?.currentProgress?.profitProgress}%</span>
                </div>
                <Progress value={budgetData?.annualBudget?.currentProgress?.profitProgress} className="h-3" />
                <div className="text-xs text-gray-500 mt-1">
                  Target: {formatCurrency(budgetData?.annualBudget?.profitTarget || 0)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Financial Ratios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(reportingData?.keyRatios || {}).map(([ratio, value]: [string, any]) => (
                <div key={ratio} className="text-center p-3 bg-gray-50 rounded">
                  <p className="text-lg font-bold text-blue-600">
                    {typeof value === 'number' ? (ratio.includes('Ratio') ? `${value.toFixed(1)}:1` : `${value.toFixed(1)}%`) : value}
                  </p>
                  <p className="text-xs text-gray-600 capitalize">
                    {ratio.replace(/([A-Z])/g, ' $1')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Integration Settings Component
const IntegrationSettings: React.FC<{ systems: any[]; health: any }> = ({ systems, health }) => {
  return (
    <div className="space-y-6">
      {/* System Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle>System Health Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <p className="text-2xl font-bold text-blue-600">{health?.dataQuality?.completeness}%</p>
              <p className="text-sm text-gray-600">Data Completeness</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <p className="text-2xl font-bold text-green-600">{health?.dataQuality?.accuracy}%</p>
              <p className="text-sm text-gray-600">Accuracy</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <p className="text-2xl font-bold text-purple-600">{health?.performanceMetrics?.averageApiResponseTime}ms</p>
              <p className="text-sm text-gray-600">Avg Response Time</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <p className="text-2xl font-bold text-orange-600">{health?.performanceMetrics?.uptime}%</p>
              <p className="text-sm text-gray-600">System Uptime</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Systems */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Connected Systems</CardTitle>
            <IntegrationDialog />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systems?.map((system) => (
              <div key={system.systemId} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{system.systemName}</h4>
                    <p className="text-sm text-gray-600 capitalize">{system.systemType.replace('_', ' ')}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge className={system.status === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {system.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Sync</p>
                    <p className="font-medium">{new Date(system.lastSync).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Data Accuracy</p>
                    <p className="font-medium">{system.dataAccuracy}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Health</p>
                    <p className="font-medium capitalize">{system.syncHealth}</p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-1">Enabled Modules</p>
                  <div className="flex flex-wrap gap-1">
                    {system.enabledModules.map((module: string) => (
                      <Badge key={module} variant="outline" className="text-xs">
                        {module.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton: React.FC<{
  icon: any;
  label: string;
  description: string;
  onClick: () => void;
}> = ({ icon: Icon, label, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
    >
      <Icon className="h-6 w-6 text-blue-600 mb-2" />
      <h4 className="font-medium">{label}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
};

// Financial Report Dialog Component
const FinancialReportDialog: React.FC = () => {
  const [reportConfig, setReportConfig] = useState({
    type: 'revenue',
    period: 'monthly',
    format: 'pdf'
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Financial Report</DialogTitle>
          <DialogDescription>
            Create a custom financial report with specific parameters
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
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
                <SelectItem value="revenue">Revenue Report</SelectItem>
                <SelectItem value="profit_loss">Profit & Loss</SelectItem>
                <SelectItem value="cash_flow">Cash Flow</SelectItem>
                <SelectItem value="commission">Commission Report</SelectItem>
                <SelectItem value="tax">Tax Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="period">Period</Label>
            <Select 
              value={reportConfig.period} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, period: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annual">Annual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="format">Format</Label>
            <Select 
              value={reportConfig.format} 
              onValueChange={(value) => setReportConfig(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button className="w-full">
            Generate Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Integration Dialog Component
const IntegrationDialog: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Integration
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Financial Integration</DialogTitle>
          <DialogDescription>
            Connect a new financial system or service
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>System Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select system type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="erp">ERP System</SelectItem>
                <SelectItem value="accounting">Accounting Software</SelectItem>
                <SelectItem value="payment_processor">Payment Processor</SelectItem>
                <SelectItem value="banking">Banking API</SelectItem>
                <SelectItem value="tax_system">Tax System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="systemName">System Name</Label>
            <Input id="systemName" placeholder="e.g., Sage X3, QuickBooks, Stripe" />
          </div>

          <div>
            <Label htmlFor="apiEndpoint">API Endpoint</Label>
            <Input id="apiEndpoint" placeholder="https://api.example.com" />
          </div>

          <div>
            <Label htmlFor="apiKey">API Key</Label>
            <Input id="apiKey" type="password" placeholder="Enter API key" />
          </div>

          <Button className="w-full">
            Connect System
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper functions
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount);

export default FinancialIntegration;