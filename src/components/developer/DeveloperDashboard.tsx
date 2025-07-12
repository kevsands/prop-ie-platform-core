'use client';

import { useEffect, useState } from 'react';
import { useDevelopments, useSales } from '@/hooks/api-hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart,
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { 
  Building, 
  Briefcase, 
  CreditCard, 
  UserCheck, 
  Users, 
  FileText, 
  ChevronRight, 
  Calculator,
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  Euro,
  ArrowUpDown,
  Receipt,
  Target
} from 'lucide-react';
import Link from 'next/link';

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 2 },
  { name: 'Feb', value: 5 },
  { name: 'Mar', value: 7 },
  { name: 'Apr', value: 4 },
  { name: 'May', value: 9 },
  { name: 'Jun', value: 11 },
  { name: 'Jul', value: 13 },
  { name: 'Aug', value: 8 },
  { name: 'Sep', value: 6 },
  { name: 'Oct', value: 10 },
  { name: 'Nov', value: 12 },
  { name: 'Dec', value: 15 },
];

const statusData = [
  { name: 'Available', value: 30, color: '#4ade80' },
  { name: 'Reserved', value: 15, color: '#facc15' },
  { name: 'Sold', value: 25, color: '#3b82f6' },
  { name: 'Under Offer', value: 10, color: '#ec4899' },
];

const COLORS = ['#4ade80', '#facc15', '#3b82f6', '#ec4899'];

// QS Cost Management Data Interfaces
interface QSValuation {
  id: string;
  valuationNumber: number;
  period: string;
  amount: number;
  status: 'draft' | 'submitted' | 'certified' | 'paid';
  dueDate: Date;
  certifiedBy?: string;
  retentionAmount: number;
  netAmount: number;
}

interface BOQSection {
  code: string;
  title: string;
  budgetAmount: number;
  actualAmount: number;
  variance: number;
  completionPercentage: number;
  status: 'on_track' | 'over_budget' | 'under_budget';
}

interface ContractVariation {
  id: string;
  variationNumber: string;
  description: string;
  type: 'addition' | 'omission' | 'substitution';
  amount: number;
  status: 'proposed' | 'approved' | 'rejected';
  impact: 'low' | 'medium' | 'high';
  submittedDate: Date;
}

interface CashFlowData {
  period: string;
  plannedCertification: number;
  actualCertification: number;
  plannedPayment: number;
  actualPayment: number;
  cumulativeCertified: number;
  retentionHeld: number;
}

// Sample QS data for the dashboard
const qsCostData = {
  totalContractValue: 28500000,
  certifiedToDate: 18720000,
  retentionHeld: 937000,
  outstandingAmount: 1150000,
  forecastFinal: 28745500,
  costVariance: -0.86,
  contingencyUsed: 456000,
  contingencyRemaining: 826500,
  currentValuations: [
    {
      id: 'val_001',
      valuationNumber: 12,
      period: 'June 2025',
      amount: 1150000,
      status: 'certified' as const,
      dueDate: new Date('2025-07-16'),
      certifiedBy: 'Sarah O\'Brien RIAI',
      retentionAmount: 57500,
      netAmount: 1092500
    },
    {
      id: 'val_002',
      valuationNumber: 11,
      period: 'May 2025',
      amount: 950000,
      status: 'paid' as const,
      dueDate: new Date('2025-06-15'),
      certifiedBy: 'Sarah O\'Brien RIAI',
      retentionAmount: 47500,
      netAmount: 902500
    }
  ] as QSValuation[],
  boqSections: [
    {
      code: '01',
      title: 'Preliminaries',
      budgetAmount: 1567500,
      actualAmount: 1567500,
      variance: 0,
      completionPercentage: 100,
      status: 'on_track' as const
    },
    {
      code: '02',
      title: 'Substructure',
      budgetAmount: 3200000,
      actualAmount: 3273600,
      variance: 2.3,
      completionPercentage: 100,
      status: 'over_budget' as const
    },
    {
      code: '03',
      title: 'Superstructure',
      budgetAmount: 12500000,
      actualAmount: 11875000,
      variance: -5.0,
      completionPercentage: 65,
      status: 'under_budget' as const
    },
    {
      code: '04',
      title: 'Finishes',
      budgetAmount: 6800000,
      actualAmount: 0,
      variance: 0,
      completionPercentage: 0,
      status: 'on_track' as const
    }
  ] as BOQSection[],
  variations: [
    {
      id: 'var_001',
      variationNumber: 'VO-001',
      description: 'Additional insulation specification',
      type: 'addition' as const,
      amount: 25000,
      status: 'approved' as const,
      impact: 'low' as const,
      submittedDate: new Date('2025-06-15')
    },
    {
      id: 'var_002',
      variationNumber: 'VO-002',
      description: 'Enhanced energy performance requirements',
      type: 'addition' as const,
      amount: 45000,
      status: 'proposed' as const,
      impact: 'medium' as const,
      submittedDate: new Date('2025-07-01')
    }
  ] as ContractVariation[],
  cashFlow: [
    {
      period: 'Jan 2025',
      plannedCertification: 1200000,
      actualCertification: 1150000,
      plannedPayment: 1140000,
      actualPayment: 1092500,
      cumulativeCertified: 8500000,
      retentionHeld: 425000
    },
    {
      period: 'Feb 2025',
      plannedCertification: 1300000,
      actualCertification: 1250000,
      plannedPayment: 1235000,
      actualPayment: 1187500,
      cumulativeCertified: 9750000,
      retentionHeld: 487500
    },
    {
      period: 'Mar 2025',
      plannedCertification: 1400000,
      actualCertification: 1420000,
      plannedPayment: 1330000,
      actualPayment: 1349000,
      cumulativeCertified: 11170000,
      retentionHeld: 558500
    },
    {
      period: 'Apr 2025',
      plannedCertification: 1500000,
      actualCertification: 1480000,
      plannedPayment: 1425000,
      actualPayment: 1406000,
      cumulativeCertified: 12650000,
      retentionHeld: 632500
    },
    {
      period: 'May 2025',
      plannedCertification: 1100000,
      actualCertification: 1200000,
      plannedPayment: 1045000,
      actualPayment: 1140000,
      cumulativeCertified: 13850000,
      retentionHeld: 692500
    },
    {
      period: 'Jun 2025',
      plannedCertification: 1200000,
      actualCertification: 1150000,
      plannedPayment: 1140000,
      actualPayment: 1092500,
      cumulativeCertified: 15000000,
      retentionHeld: 750000
    }
  ] as CashFlowData[]
};

export default function DeveloperDashboard() {
  // Use React Query hooks to fetch data
  const { data: developments, isLoading: isLoadingDevelopments } = useDevelopments({
    limit: 5
  });

  const [projectMetrics, setProjectMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUnits: 0,
    soldUnits: 0,
    availableUnits: 0,
    reservedUnits: 0
  });

  // Calculate project metrics from developments data
  useEffect(() => {
    if (developments?.data) {
      const totalProjects = developments.data.length;
      const activeProjects = developments.data.filter(d => d.status === 'CONSTRUCTION').length;
      const completedProjects = developments.data.filter(d => d.status === 'COMPLETED').length;
      
      const totalUnits = developments.data.reduce((acc, dev) => acc + dev.totalUnits, 0);
      const soldUnits = developments.data.reduce((acc, dev) => acc + dev.soldUnits, 0);
      const availableUnits = developments.data.reduce((acc, dev) => acc + dev.availableUnits, 0);
      const reservedUnits = developments.data.reduce((acc, dev) => acc + dev.reservedUnits, 0);
      
      setProjectMetrics({
        totalProjects,
        activeProjects,
        completedProjects,
        totalUnits,
        soldUnits,
        availableUnits,
        reservedUnits
      });
    }
  }, [developments]);

  // QS utility functions
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'certified':
      case 'paid':
      case 'approved':
      case 'on_track':
        return 'bg-green-100 text-green-800';
      case 'submitted':
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'over_budget':
        return 'bg-red-100 text-red-800';
      case 'under_budget':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVarianceColor = (variance: number): string => {
    if (variance > 5) return 'text-red-600';
    if (variance < -2) return 'text-green-600';
    return 'text-gray-600';
  };

  const getImpactColor = (impact: string): string => {
    switch (impact) {
      case 'high':
        return 'text-red-600 border-red-200';
      case 'medium':
        return 'text-yellow-600 border-yellow-200';
      case 'low':
        return 'text-green-600 border-green-200';
      default:
        return 'text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Developer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your developer dashboard. Monitor project progress, sales, and team activity.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.totalProjects}</p>
              )}
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.activeProjects}</p>
              )}
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.totalUnits}</p>
              )}
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sold Units</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.soldUnits}</p>
              )}
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <UserCheck className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">QS Certified</p>
              <p className="text-2xl font-bold">{formatCurrency(qsCostData.certifiedToDate)}</p>
            </div>
            <div className="bg-orange-100 p-2 rounded-full">
              <Calculator className="h-5 w-5 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="cost-management">Cost Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sales Trends */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Monthly unit sales across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" name="Units Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Unit Status Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Unit Status Distribution</CardTitle>
                <CardDescription>Current status of all units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Growth</CardTitle>
              <CardDescription>Year-to-date sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} name="Units Sold" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Planning', value: 2 },
                        { name: 'Construction', value: 3 },
                        { name: 'Completed', value: 4 },
                        { name: 'Sold Out', value: 1 },
                      ]}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Projects" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity & Alerts</CardTitle>
                <CardDescription>Latest project updates and cost management alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* QS Cost Alert */}
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">QS Valuation Pending</p>
                      <p className="text-xs text-muted-foreground">Valuation #12 awaiting approval - {formatCurrency(qsCostData.currentValuations[0]?.amount || 0)}</p>
                      <p className="text-xs text-muted-foreground">Due: {qsCostData.currentValuations[0]?.dueDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* BOQ Variance Alert */}
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="bg-red-100 p-2 rounded-full">
                      <Calculator className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">BOQ Over Budget</p>
                      <p className="text-xs text-muted-foreground">Substructure section 2.3% over budget</p>
                      <p className="text-xs text-muted-foreground">Review required</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Building className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New project milestone</p>
                      <p className="text-xs text-muted-foreground">Riverside Manor - Phase 2 started</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Document uploaded</p>
                      <p className="text-xs text-muted-foreground">Planning permission - Fitzgerald Gardens</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New team member</p>
                      <p className="text-xs text-muted-foreground">Sarah Smith joined the team</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Cost Management Tab */}
        <TabsContent value="cost-management" className="space-y-4">
          {/* QS Financial Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contract Value</p>
                    <p className="text-2xl font-bold">{formatCurrency(qsCostData.totalContractValue)}</p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Total project value</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Certified to Date</p>
                    <p className="text-2xl font-bold">{formatCurrency(qsCostData.certifiedToDate)}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">
                    {((qsCostData.certifiedToDate / qsCostData.totalContractValue) * 100).toFixed(1)}% of contract
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                    <p className="text-2xl font-bold">{formatCurrency(qsCostData.outstandingAmount)}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Awaiting payment</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Cost Variance</p>
                    <p className={`text-2xl font-bold ${getVarianceColor(qsCostData.costVariance)}`}>
                      {qsCostData.costVariance >= 0 ? '+' : ''}{qsCostData.costVariance.toFixed(1)}%
                    </p>
                  </div>
                  <TrendingUp className={`h-8 w-8 ${qsCostData.costVariance >= 0 ? 'text-red-600' : 'text-green-600'}`} />
                </div>
                <div className="mt-2">
                  <p className="text-xs text-muted-foreground">Budget variance</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current QS Valuations */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Valuations</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/developer/quantity-surveyor">
                      <Calculator className="h-4 w-4 mr-2" />
                      View Full QS Dashboard
                    </Link>
                  </Button>
                </div>
                <CardDescription>Recent quantity surveyor valuations and certifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qsCostData.currentValuations.map((valuation) => (
                    <div key={valuation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">Valuation #{valuation.valuationNumber}</h4>
                          <p className="text-sm text-muted-foreground">{valuation.period}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(valuation.status)}>
                            {valuation.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Gross Amount</p>
                          <p className="font-medium">{formatCurrency(valuation.amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Net Payment</p>
                          <p className="font-medium text-green-600">{formatCurrency(valuation.netAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Retention</p>
                          <p className="font-medium text-yellow-600">{formatCurrency(valuation.retentionAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Payment Due</p>
                          <p className="font-medium">{valuation.dueDate.toLocaleDateString()}</p>
                        </div>
                      </div>

                      {valuation.certifiedBy && (
                        <div className="mt-3 text-xs text-muted-foreground">
                          Certified by: {valuation.certifiedBy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* BOQ Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle>BOQ Status Overview</CardTitle>
                <CardDescription>Bill of quantities progress and variance analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qsCostData.boqSections.map((section) => (
                    <div key={section.code} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{section.code} - {section.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Budget: {formatCurrency(section.budgetAmount)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(section.status)} variant="outline">
                          {section.status.replace('_', ' ')}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{section.completionPercentage}%</span>
                        </div>
                        <Progress value={section.completionPercentage} className="h-2" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Actual Cost</p>
                          <p className="font-medium">{formatCurrency(section.actualAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Variance</p>
                          <p className={`font-medium ${getVarianceColor(section.variance)}`}>
                            {section.variance >= 0 ? '+' : ''}{section.variance.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contract Variations and Cash Flow */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Variations */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Variations</CardTitle>
                <CardDescription>Recent variation orders and their impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qsCostData.variations.map((variation) => (
                    <div key={variation.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{variation.variationNumber}</h4>
                          <p className="text-sm text-muted-foreground">{variation.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={
                            variation.type === 'addition' ? 'bg-red-100 text-red-800' :
                            variation.type === 'omission' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {variation.type}
                          </Badge>
                          <Badge className={getStatusColor(variation.status)}>
                            {variation.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className={`font-medium ${variation.type === 'addition' ? 'text-red-600' : 'text-green-600'}`}>
                            {variation.type === 'addition' ? '+' : '-'}{formatCurrency(Math.abs(variation.amount))}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Impact</p>
                          <Badge variant="outline" className={getImpactColor(variation.impact)}>
                            {variation.impact}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-3 text-xs text-muted-foreground">
                        Submitted: {variation.submittedDate.toLocaleDateString()}
                      </div>
                    </div>
                  ))}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Net Variation Impact:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(qsCostData.variations.reduce((sum, v) => 
                          sum + (v.type === 'addition' ? v.amount : -v.amount), 0
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Status */}
            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Status</CardTitle>
                <CardDescription>Recent payment performance and retention status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Cash Flow Summary */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground">Retention Held</p>
                      <p className="font-bold text-yellow-600">{formatCurrency(qsCostData.retentionHeld)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Contingency Remaining</p>
                      <p className="font-bold text-blue-600">{formatCurrency(qsCostData.contingencyRemaining)}</p>
                    </div>
                  </div>

                  {/* Recent Cash Flow */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Recent Payment Performance</h4>
                    {qsCostData.cashFlow.slice(-3).map((period) => (
                      <div key={period.period} className="border rounded p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{period.period}</span>
                          <span className="text-sm text-muted-foreground">
                            {formatCurrency(period.actualCertification)} certified
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Planned</p>
                            <p>{formatCurrency(period.plannedCertification)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Actual</p>
                            <p className={
                              period.actualCertification >= period.plannedCertification ? 
                              'text-green-600' : 'text-red-600'
                            }>
                              {formatCurrency(period.actualCertification)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/developer/quantity-surveyor">
                      <Receipt className="h-4 w-4 mr-2" />
                      View Full QS Reports
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>QS Quick Actions</CardTitle>
              <CardDescription>Direct access to quantity surveyor functions and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="outline" className="flex flex-col h-20 justify-center" asChild>
                  <Link href="/developer/quantity-surveyor">
                    <Calculator className="h-6 w-6 mb-2" />
                    <span className="text-sm">QS Dashboard</span>
                  </Link>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 justify-center" asChild>
                  <Link href="/developer/quantity-surveyor?tab=valuations">
                    <CheckCircle className="h-6 w-6 mb-2" />
                    <span className="text-sm">Approve Valuations</span>
                  </Link>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 justify-center" asChild>
                  <Link href="/developer/quantity-surveyor?tab=boq-variances">
                    <ArrowUpDown className="h-6 w-6 mb-2" />
                    <span className="text-sm">Review BOQ Changes</span>
                  </Link>
                </Button>
                <Button variant="outline" className="flex flex-col h-20 justify-center" asChild>
                  <Link href="/developer/quantity-surveyor?tab=reports">
                    <FileText className="h-6 w-6 mb-2" />
                    <span className="text-sm">Cost Reports</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Projects section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/developer/projects">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isLoadingDevelopments ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full rounded-md mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between gap-2 mt-4">
                      <Skeleton className="h-9 w-1/2" />
                      <Skeleton className="h-9 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            developments?.data.slice(0, 3).map((development) => (
              <Card key={development.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{development.name}</CardTitle>
                  <CardDescription>{development.location.city}, {development.location.county}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-24 mb-4">
                    {development.images && development.images.length > 0 ? (
                      <img
                        src={development.images[0]}
                        alt={development.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted rounded-md text-muted-foreground text-sm">
                        No image available
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                      {development.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {development.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Units</p>
                      <p className="font-medium">{development.totalUnits}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{development.availableUnits}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" asChild className="flex-1">
                      <Link href={`/developer/projects/${development.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/developer/projects/${development.id}/units`}>
                        Manage Units
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}