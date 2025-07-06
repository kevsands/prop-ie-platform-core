'use client';

import React, { useState, useMemo } from 'react';
import { 
  Euro,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Calculator,
  Receipt,
  CreditCard,
  Users,
  Building,
  Target,
  BarChart3,
  Calendar,
  FileText,
  Download,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Shield,
  Award,
  Settings
} from 'lucide-react';

// Financial control interfaces
interface CostCategory {
  id: string;
  name: string;
  budgeted: number;
  actual: number;
  committed: number;
  variance: number;
  percentageOfTotal: number;
  status: 'on-budget' | 'over-budget' | 'under-budget' | 'at-risk';
  trend: 'up' | 'down' | 'stable';
}

interface PaymentSchedule {
  id: string;
  recipient: string;
  amount: number;
  dueDate: string;
  category: string;
  project: string;
  status: 'scheduled' | 'paid' | 'overdue' | 'disputed';
  invoiceRef: string;
  description: string;
}

interface CashFlowProjection {
  month: string;
  inflow: number;
  outflow: number;
  netFlow: number;
  cumulativeBalance: number;
  confidence: number;
}

interface ProjectFinancials {
  id: string;
  name: string;
  totalBudget: number;
  spent: number;
  committed: number;
  remaining: number;
  profitMargin: number;
  roi: number;
  stage: string;
  costPerformanceIndex: number;
  schedulePerformanceIndex: number;
}

interface EnterpriseFinancialControlProps {
  mode?: 'overview' | 'project_specific';
  projectId?: string;
}

export default function EnterpriseFinancialControlSystem({ 
  mode = 'overview', 
  projectId 
}: EnterpriseFinancialControlProps) {
  const [activeView, setActiveView] = useState<'dashboard' | 'budgets' | 'payments' | 'cashflow' | 'compliance'>('dashboard');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('quarter');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  // Sample data - in production this would come from API
  const costCategories: CostCategory[] = [
    {
      id: 'land',
      name: 'Land Costs',
      budgeted: 8500000,
      actual: 8350000,
      committed: 8350000,
      variance: -1.8,
      percentageOfTotal: 42.5,
      status: 'under-budget',
      trend: 'stable'
    },
    {
      id: 'bonds',
      name: 'Bonds & Levies',
      budgeted: 750000,
      actual: 785000,
      committed: 785000,
      variance: 4.7,
      percentageOfTotal: 3.9,
      status: 'over-budget',
      trend: 'up'
    },
    {
      id: 'connections',
      name: 'Connections & Utilities',
      budgeted: 450000,
      actual: 420000,
      committed: 440000,
      variance: -6.7,
      percentageOfTotal: 2.1,
      status: 'under-budget',
      trend: 'down'
    },
    {
      id: 'professional',
      name: 'Professional Costs',
      budgeted: 2000000,
      actual: 1850000,
      committed: 1920000,
      variance: -7.5,
      percentageOfTotal: 9.3,
      status: 'under-budget',
      trend: 'stable'
    },
    {
      id: 'construction',
      name: 'Construction Costs',
      budgeted: 6800000,
      actual: 4200000,
      committed: 6500000,
      variance: -4.4,
      percentageOfTotal: 32.2,
      status: 'on-budget',
      trend: 'up'
    },
    {
      id: 'financing',
      name: 'Financing Costs',
      budgeted: 1200000,
      actual: 980000,
      committed: 1150000,
      variance: -18.3,
      percentageOfTotal: 4.9,
      status: 'under-budget',
      trend: 'down'
    },
    {
      id: 'marketing',
      name: 'Marketing Costs',
      budgeted: 300000,
      actual: 265000,
      committed: 285000,
      variance: -11.7,
      percentageOfTotal: 1.4,
      status: 'under-budget',
      trend: 'stable'
    }
  ];

  const projectFinancials: ProjectFinancials[] = [
    {
      id: 'fitzgerald-gardens',
      name: 'Fitzgerald Gardens',
      totalBudget: 12500000,
      spent: 9750000,
      committed: 11800000,
      remaining: 700000,
      profitMargin: 18.5,
      roi: 22.3,
      stage: 'Construction',
      costPerformanceIndex: 1.06,
      schedulePerformanceIndex: 1.12
    },
    {
      id: 'ellwood',
      name: 'Ellwood Development',
      totalBudget: 15200000,
      spent: 3800000,
      committed: 8900000,
      remaining: 6300000,
      profitMargin: 21.2,
      roi: 26.8,
      stage: 'Planning',
      costPerformanceIndex: 1.03,
      schedulePerformanceIndex: 0.96
    },
    {
      id: 'ballymakenny',
      name: 'Ballymakenny View',
      totalBudget: 8900000,
      spent: 4000000,
      committed: 6200000,
      remaining: 2700000,
      profitMargin: 19.8,
      roi: 24.1,
      stage: 'Pre-Sales',
      costPerformanceIndex: 1.09,
      schedulePerformanceIndex: 1.07
    }
  ];

  const upcomingPayments: PaymentSchedule[] = [
    {
      id: '1',
      recipient: 'Murphy Construction Ltd',
      amount: 485000,
      dueDate: '2025-06-20',
      category: 'Construction Costs',
      project: 'Fitzgerald Gardens',
      status: 'scheduled',
      invoiceRef: 'INV-2025-0847',
      description: 'Foundation completion milestone payment'
    },
    {
      id: '2',
      recipient: 'O\'Brien Engineering',
      amount: 65000,
      dueDate: '2025-06-22',
      category: 'Professional Costs',
      project: 'Ellwood Development',
      status: 'scheduled',
      invoiceRef: 'INV-2025-0851',
      description: 'Structural engineering Phase 2'
    },
    {
      id: '3',
      recipient: 'ESB Networks',
      amount: 125000,
      dueDate: '2025-06-18',
      category: 'Connections & Utilities',
      project: 'Ballymakenny View',
      status: 'overdue',
      invoiceRef: 'INV-2025-0823',
      description: 'Electrical connection works'
    },
    {
      id: '4',
      recipient: 'Kelly Architecture',
      amount: 95000,
      dueDate: '2025-06-25',
      category: 'Professional Costs',
      project: 'Fitzgerald Gardens',
      status: 'scheduled',
      invoiceRef: 'INV-2025-0856',
      description: 'Architectural services milestone 4'
    }
  ];

  const cashFlowProjections: CashFlowProjection[] = [
    { month: 'Jun 2025', inflow: 2850000, outflow: 2640000, netFlow: 210000, cumulativeBalance: 1850000, confidence: 95 },
    { month: 'Jul 2025', inflow: 3200000, outflow: 2950000, netFlow: 250000, cumulativeBalance: 2100000, confidence: 92 },
    { month: 'Aug 2025', inflow: 2100000, outflow: 3150000, netFlow: -1050000, cumulativeBalance: 1050000, confidence: 89 },
    { month: 'Sep 2025', inflow: 4800000, outflow: 2850000, netFlow: 1950000, cumulativeBalance: 3000000, confidence: 87 },
    { month: 'Oct 2025', inflow: 2650000, outflow: 3200000, netFlow: -550000, cumulativeBalance: 2450000, confidence: 84 },
    { month: 'Nov 2025', inflow: 3900000, outflow: 2750000, netFlow: 1150000, cumulativeBalance: 3600000, confidence: 82 }
  ];

  const totalBudget = costCategories.reduce((sum, cat) => sum + cat.budgeted, 0);
  const totalActual = costCategories.reduce((sum, cat) => sum + cat.actual, 0);
  const totalCommitted = costCategories.reduce((sum, cat) => sum + cat.committed, 0);
  const overallVariance = ((totalActual - totalBudget) / totalBudget) * 100;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Enterprise Financial Control</h1>
            <p className="text-emerald-100 text-lg">
              Comprehensive financial management across all developments and team operations
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <Euro className="mr-2" size={20} />
                <span className="font-medium">€{(totalBudget / 1000000).toFixed(1)}M Total Budget</span>
              </div>
              <div className="flex items-center">
                <Building className="mr-2" size={20} />
                <span className="font-medium">{projectFinancials.length} Active Projects</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2" size={20} />
                <span className="font-medium">7 Cost Categories</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">
              {overallVariance > 0 ? '+' : ''}{overallVariance.toFixed(1)}%
            </div>
            <div className="text-emerald-200">
              {overallVariance < 0 ? 'Under Budget' : 'Over Budget'}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'dashboard', label: 'Financial Dashboard', icon: BarChart3 },
            { id: 'budgets', label: 'Budget Control', icon: Calculator },
            { id: 'payments', label: 'Payment Management', icon: CreditCard },
            { id: 'cashflow', label: 'Cash Flow Analysis', icon: TrendingUp },
            { id: 'compliance', label: 'Financial Compliance', icon: Shield }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeView === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Financial Dashboard */}
      {activeView === 'dashboard' && (
        <div className="space-y-6">
          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Euro size={20} className="text-emerald-600" />
                <span className="font-medium text-emerald-800">Total Portfolio Value</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600">€{(totalBudget / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">Across {projectFinancials.length} projects</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-blue-600" />
                <span className="font-medium text-blue-800">Average ROI</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {(projectFinancials.reduce((sum, p) => sum + p.roi, 0) / projectFinancials.length).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600">Portfolio average</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Calculator size={20} className="text-purple-600" />
                <span className="font-medium text-purple-800">Cost Performance</span>
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {(projectFinancials.reduce((sum, p) => sum + p.costPerformanceIndex, 0) / projectFinancials.length).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">CPI index</p>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={20} className="text-orange-600" />
                <span className="font-medium text-orange-800">Upcoming Payments</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">
                €{(upcomingPayments.filter(p => p.status === 'scheduled').reduce((sum, p) => sum + p.amount, 0) / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">Next 30 days</p>
            </div>
          </div>

          {/* Cost Category Breakdown */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Category Analysis</h3>
            <div className="space-y-4">
              {costCategories.map((category) => (
                <div key={category.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'under-budget' ? 'bg-green-100 text-green-800' :
                        category.status === 'over-budget' ? 'bg-red-100 text-red-800' :
                        category.status === 'at-risk' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {category.variance > 0 ? '+' : ''}{category.variance.toFixed(1)}%
                      </span>
                      {category.trend === 'up' && <TrendingUp size={16} className="text-red-500" />}
                      {category.trend === 'down' && <TrendingDown size={16} className="text-green-500" />}
                      {category.trend === 'stable' && <Activity size={16} className="text-gray-500" />}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Budgeted:</span>
                      <div className="font-medium">€{category.budgeted.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Actual:</span>
                      <div className="font-medium">€{category.actual.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Committed:</span>
                      <div className="font-medium">€{category.committed.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">% of Total:</span>
                      <div className="font-medium">{category.percentageOfTotal.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Budget Utilization</span>
                      <span className="text-xs text-gray-700">{((category.actual / category.budgeted) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category.variance < -5 ? 'bg-green-500' :
                          category.variance > 5 ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((category.actual / category.budgeted) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Financial Overview */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Financial Performance</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {projectFinancials.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                      {project.stage}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Budget:</span>
                      <span className="font-medium">€{(project.totalBudget / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Spent:</span>
                      <span className="font-medium">€{(project.spent / 1000000).toFixed(1)}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium text-green-600">{project.roi}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">CPI:</span>
                      <span className={`font-medium ${
                        project.costPerformanceIndex > 1 ? 'text-green-600' : 
                        project.costPerformanceIndex < 0.95 ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {project.costPerformanceIndex.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Budget Progress</span>
                      <span className="text-xs text-gray-700">
                        {((project.spent / project.totalBudget) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${Math.min((project.spent / project.totalBudget) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Budget Control System */}
      {activeView === 'budgets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Advanced Budget Control</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export Budget
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                <Plus size={16} />
                Create Budget
              </button>
            </div>
          </div>

          {/* Budget vs Actual Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Performance Summary</h3>
              <div className="space-y-4">
                {costCategories.slice(0, 4).map((category) => (
                  <div key={category.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{category.name}</span>
                      <span className={`text-sm font-medium ${
                        category.variance < 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {category.variance > 0 ? '+' : ''}{category.variance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      €{category.actual.toLocaleString()} / €{category.budgeted.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category.variance < -5 ? 'bg-green-500' :
                          category.variance > 5 ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((category.actual / category.budgeted) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Alerts & Recommendations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-sm font-medium text-red-900">Over Budget Alert</span>
                  </div>
                  <p className="text-sm text-red-700">
                    Bonds & Levies category is 4.7% over budget. Review upcoming commitments.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={16} className="text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-900">Budget Risk</span>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Construction costs trending upward. Monitor Q3 expenditure closely.
                  </p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-sm font-medium text-green-900">Savings Opportunity</span>
                  </div>
                  <p className="text-sm text-green-700">
                    Professional costs 7.5% under budget. Consider reallocating to marketing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Management System */}
      {activeView === 'payments' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} />
                Filter Payments
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                <Plus size={16} />
                Schedule Payment
              </button>
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Payments</h3>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{payment.recipient}</h4>
                      <p className="text-sm text-gray-600">{payment.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Invoice: {payment.invoiceRef}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">€{payment.amount.toLocaleString()}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        payment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <span className="text-gray-600">Due Date:</span>
                      <div className="font-medium">{new Date(payment.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <div className="font-medium">{payment.category}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Project:</span>
                      <div className="font-medium">{payment.project}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-700 transition-colors">
                      Process Payment
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                      View Invoice
                    </button>
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors">
                      Edit Schedule
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cash Flow Analysis */}
      {activeView === 'cashflow' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Cash Flow Analysis</h2>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>Next 6 Months</option>
                <option>Next 12 Months</option>
                <option>Current Year</option>
              </select>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                <BarChart3 size={16} />
                Generate Forecast
              </button>
            </div>
          </div>

          {/* Cash Flow Projections */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">6-Month Cash Flow Projection</h3>
            <div className="space-y-4">
              {cashFlowProjections.map((projection, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{projection.month}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {projection.confidence}% confidence
                      </span>
                      <span className={`font-bold ${
                        projection.netFlow > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        €{Math.abs(projection.netFlow).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Inflow:</span>
                      <div className="font-medium text-green-600">€{projection.inflow.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Outflow:</span>
                      <div className="font-medium text-red-600">€{projection.outflow.toLocaleString()}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Net Flow:</span>
                      <div className={`font-medium ${
                        projection.netFlow > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {projection.netFlow > 0 ? '+' : ''}€{projection.netFlow.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Balance:</span>
                      <div className="font-medium">€{projection.cumulativeBalance.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Financial Compliance */}
      {activeView === 'compliance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Financial Compliance & Audit Trail</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download size={16} />
                Export Audit Report
              </button>
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-2">
                <Shield size={16} />
                Run Compliance Check
              </button>
            </div>
          </div>

          {/* Compliance Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Shield size={20} className="text-green-600" />
                <h3 className="font-semibold text-gray-900">Compliance Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Financial Controls:</span>
                  <span className="text-green-600 font-medium">✓ Compliant</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audit Trail:</span>
                  <span className="text-green-600 font-medium">✓ Complete</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tax Compliance:</span>
                  <span className="text-green-600 font-medium">✓ Up to Date</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documentation:</span>
                  <span className="text-yellow-600 font-medium">⚠ Review Required</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Receipt size={20} className="text-blue-600" />
                <h3 className="font-semibold text-gray-900">Invoice Management</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Processed:</span>
                  <span className="font-medium">247 invoices</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Matched:</span>
                  <span className="text-green-600 font-medium">98.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="text-orange-600 font-medium">8 items</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Disputes:</span>
                  <span className="text-red-600 font-medium">2 active</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={20} className="text-purple-600" />
                <h3 className="font-semibold text-gray-900">Payment Performance</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">On-Time Rate:</span>
                  <span className="text-green-600 font-medium">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Avg Payment Time:</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Early Payment:</span>
                  <span className="text-blue-600 font-medium">12.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Late Payment:</span>
                  <span className="text-red-600 font-medium">5.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}