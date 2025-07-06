'use client';

import React, { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calculator, 
  Target, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  CreditCard,
  Receipt,
  Building,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  RefreshCw,
  Settings,
  Filter,
  Zap,
  Clock,
  Users,
  Briefcase,
  FileText,
  Phone,
  Mail,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface ExternalFirm {
  id: string;
  name: string;
  type: 'architect' | 'engineer' | 'consultant' | 'contractor' | 'solicitor' | 'surveyor';
  contactPerson: string;
  email: string;
  phone: string;
  services: string[];
  currentContracts: number;
  totalPaid: number;
  outstandingInvoices: number;
  rating: number;
  lastEngagement: Date;
}

interface ProjectCost {
  id: string;
  category: 'design' | 'construction' | 'professional' | 'marketing' | 'admin' | 'financing';
  subcategory: string;
  description: string;
  budgetAmount: number;
  actualAmount: number;
  committedAmount: number;
  supplier: string;
  phase: string;
  dueDate: Date;
  status: 'planned' | 'committed' | 'in_progress' | 'completed' | 'overdue';
  paymentTerms: string;
  approvedBy: string;
}

interface CashFlowEvent {
  id: string;
  date: Date;
  type: 'inflow' | 'outflow';
  category: string;
  amount: number;
  description: string;
  source: string;
  status: 'scheduled' | 'confirmed' | 'completed';
  linkedCostId?: string;
}

interface EnhancedFinancialManagementProps {
  projectId: string;
  units: any[];
  totalRevenue: number;
  averageUnitPrice: number;
}

export default function EnhancedFinancialManagement({ 
  projectId,
  units, 
  totalRevenue, 
  averageUnitPrice
}: EnhancedFinancialManagementProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'costs' | 'teams' | 'cashflow' | 'milestones'>('overview');
  const [selectedFirm, setSelectedFirm] = useState<ExternalFirm | null>(null);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showFirmModal, setShowFirmModal] = useState(false);

  // Mock data for external firms - In production, this would come from API
  const externalFirms: ExternalFirm[] = [
    {
      id: 'firm-1',
      name: 'O\'Connor Architecture',
      type: 'architect',
      contactPerson: 'Sarah O\'Connor',
      email: 'sarah@oconnor-arch.ie',
      phone: '+353 21 123 4567',
      services: ['Architectural Design', 'Planning Applications', 'Building Regulations'],
      currentContracts: 3,
      totalPaid: 125000,
      outstandingInvoices: 2,
      rating: 4.8,
      lastEngagement: new Date('2025-06-14')
    },
    {
      id: 'firm-2',
      name: 'Meegan Builders Ltd',
      type: 'contractor',
      contactPerson: 'Patrick Meegan',
      email: 'p.meegan@meeganbuilders.ie',
      phone: '+353 21 456 7890',
      services: ['Main Contractor', 'Construction Management', 'Site Supervision'],
      currentContracts: 1,
      totalPaid: 2850000,
      outstandingInvoices: 5,
      rating: 4.9,
      lastEngagement: new Date('2025-06-15')
    },
    {
      id: 'firm-3',
      name: 'Murphy Engineering',
      type: 'engineer',
      contactPerson: 'David Murphy',
      email: 'david@murphyeng.ie',
      phone: '+353 21 789 0123',
      services: ['Structural Engineering', 'MEP Design', 'Project Management'],
      currentContracts: 2,
      totalPaid: 185000,
      outstandingInvoices: 1,
      rating: 4.7,
      lastEngagement: new Date('2025-06-13')
    },
    {
      id: 'firm-4',
      name: 'Brady Legal Services',
      type: 'solicitor',
      contactPerson: 'Thomas Brady',
      email: 'thomas@bradylegal.ie',
      phone: '+353 21 234 5679',
      services: ['Property Law', 'Contract Review', 'Conveyancing'],
      currentContracts: 1,
      totalPaid: 45000,
      outstandingInvoices: 0,
      rating: 4.6,
      lastEngagement: new Date('2025-06-12')
    }
  ];

  // Mock project costs data
  const projectCosts: ProjectCost[] = [
    {
      id: 'cost-1',
      category: 'design',
      subcategory: 'Architectural Services',
      description: 'Phase 1 Architectural Design and Planning',
      budgetAmount: 150000,
      actualAmount: 125000,
      committedAmount: 150000,
      supplier: 'O\'Connor Architecture',
      phase: 'Design',
      dueDate: new Date('2025-07-01'),
      status: 'in_progress',
      paymentTerms: '30% upfront, 40% at planning, 30% completion',
      approvedBy: 'Project Director'
    },
    {
      id: 'cost-2',
      category: 'construction',
      subcategory: 'Main Contract',
      description: 'Full construction contract - Blocks A, B, C',
      budgetAmount: 3200000,
      actualAmount: 2850000,
      committedAmount: 3200000,
      supplier: 'Meegan Builders Ltd',
      phase: 'Construction',
      dueDate: new Date('2025-08-30'),
      status: 'in_progress',
      paymentTerms: 'Monthly valuations, 5% retention',
      approvedBy: 'Board of Directors'
    },
    {
      id: 'cost-3',
      category: 'professional',
      subcategory: 'Engineering Services',
      description: 'Structural and MEP engineering design',
      budgetAmount: 200000,
      actualAmount: 185000,
      committedAmount: 200000,
      supplier: 'Murphy Engineering',
      phase: 'Design',
      dueDate: new Date('2025-06-30'),
      status: 'completed',
      paymentTerms: 'Net 30 days',
      approvedBy: 'Technical Director'
    },
    {
      id: 'cost-4',
      category: 'professional',
      subcategory: 'Legal Services',
      description: 'Contract reviews and property law services',
      budgetAmount: 75000,
      actualAmount: 45000,
      committedAmount: 60000,
      supplier: 'Brady Legal Services',
      phase: 'Legal',
      dueDate: new Date('2025-09-30'),
      status: 'in_progress',
      paymentTerms: 'Hourly rate, monthly invoicing',
      approvedBy: 'Project Manager'
    }
  ];

  // Calculate financial metrics
  const financialMetrics = useMemo(() => {
    const totalBudget = projectCosts.reduce((sum, cost) => sum + cost.budgetAmount, 0);
    const totalActual = projectCosts.reduce((sum, cost) => sum + cost.actualAmount, 0);
    const totalCommitted = projectCosts.reduce((sum, cost) => sum + cost.committedAmount, 0);
    
    const costByCategory = projectCosts.reduce((acc, cost) => {
      acc[cost.category] = (acc[cost.category] || 0) + cost.actualAmount;
      return acc;
    }, {} as Record<string, number>);

    const projectedRevenue = units.length * averageUnitPrice || 4800000; // fallback
    const grossProfit = projectedRevenue - totalCommitted;
    const grossMargin = (grossProfit / projectedRevenue) * 100;

    return {
      totalBudget,
      totalActual,
      totalCommitted,
      costByCategory,
      projectedRevenue,
      grossProfit,
      grossMargin,
      budgetVariance: totalBudget - totalActual,
      commitmentUtilization: (totalCommitted / totalBudget) * 100
    };
  }, [projectCosts, units, averageUnitPrice]);

  // Cash flow projection data
  const cashFlowData = [
    { month: 'Jan', inflow: 0, outflow: 450000, net: -450000 },
    { month: 'Feb', inflow: 150000, outflow: 680000, net: -530000 },
    { month: 'Mar', inflow: 320000, outflow: 590000, net: -270000 },
    { month: 'Apr', inflow: 580000, outflow: 720000, net: -140000 },
    { month: 'May', inflow: 750000, outflow: 650000, net: 100000 },
    { month: 'Jun', inflow: 920000, outflow: 580000, net: 340000 },
    { month: 'Jul', inflow: 1200000, outflow: 720000, net: 480000 }
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      design: '#3B82F6',
      construction: '#EF4444', 
      professional: '#10B981',
      marketing: '#F59E0B',
      admin: '#8B5CF6',
      financing: '#06B6D4'
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Financial Management Center</h2>
            <p className="text-blue-100">Real-time project costs, team management, and cash flow monitoring</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Budget Utilization</div>
            <div className="text-2xl font-bold">{financialMetrics.commitmentUtilization.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Quick Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-xl font-bold text-gray-900">€{(financialMetrics.totalBudget / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calculator size={20} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Actual Spent</p>
              <p className="text-xl font-bold text-red-600">€{(financialMetrics.totalActual / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <CreditCard size={20} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Projected Profit</p>
              <p className="text-xl font-bold text-green-600">€{(financialMetrics.grossProfit / 1000000).toFixed(1)}M</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gross Margin</p>
              <p className="text-xl font-bold text-purple-600">{financialMetrics.grossMargin.toFixed(1)}%</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-6">
          {[
            { id: 'overview', label: 'Financial Overview', icon: BarChart3 },
            { id: 'costs', label: 'Project Costs', icon: Receipt },
            { id: 'teams', label: 'External Teams', icon: Users },
            { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp },
            { id: 'milestones', label: 'Financial Milestones', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Breakdown Chart */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Breakdown by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={Object.entries(financialMetrics.costByCategory).map(([category, amount]) => ({
                    name: category.charAt(0).toUpperCase() + category.slice(1),
                    value: amount,
                    fill: getCategoryColor(category)
                  }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={(entry) => `${entry.name}: €${(entry.value / 1000000).toFixed(1)}M`}
                />
                <Tooltip formatter={(value) => [`€${(Number(value) / 1000000).toFixed(1)}M`, '']} />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          {/* Budget vs Actual */}
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget vs Actual Performance</h3>
            <div className="space-y-4">
              {Object.entries(financialMetrics.costByCategory).map(([category, actual]) => {
                const budget = projectCosts
                  .filter(cost => cost.category === category)
                  .reduce((sum, cost) => sum + cost.budgetAmount, 0);
                const variance = ((actual - budget) / budget) * 100;
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{category}</span>
                      <span className={variance > 0 ? 'text-red-600' : 'text-green-600'}>
                        {variance > 0 ? '+' : ''}{variance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${Math.min((actual / budget) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>€{(actual / 1000).toFixed(0)}k spent</span>
                      <span>€{(budget / 1000).toFixed(0)}k budget</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'costs' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Project Cost Management</h3>
            <button
              onClick={() => setShowCostModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Cost
            </button>
          </div>

          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actual</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {projectCosts.map((cost) => (
                    <tr key={cost.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3`} style={{ backgroundColor: getCategoryColor(cost.category) }} />
                          <span className="text-sm font-medium text-gray-900 capitalize">{cost.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{cost.description}</div>
                        <div className="text-sm text-gray-500">{cost.subcategory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cost.supplier}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{cost.budgetAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">€{cost.actualAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cost.status)}`}>
                          {cost.status.charAt(0).toUpperCase() + cost.status.slice(1).replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={16} />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit3 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teams' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">External Team Management</h3>
            <button
              onClick={() => setShowFirmModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Firm
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {externalFirms.map((firm) => (
              <div key={firm.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{firm.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">{firm.type}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium">{firm.rating}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={14} />
                    <span>{firm.contactPerson}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span>{firm.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <span>{firm.phone}</span>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Total Paid</span>
                        <div className="font-medium">€{(firm.totalPaid / 1000).toFixed(0)}k</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Outstanding</span>
                        <div className="font-medium text-red-600">{firm.outstandingInvoices}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setSelectedFirm(firm)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                    >
                      View Details
                    </button>
                    <button className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cashflow' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow Projection</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={cashFlowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis formatter={(value) => `€${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [`€${(Number(value) / 1000000).toFixed(1)}M`, '']} />
                <Area type="monotone" dataKey="inflow" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="outflow" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                <Line type="monotone" dataKey="net" stroke="#3B82F6" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4">Next 30 Days</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expected Inflows</span>
                  <span className="font-medium text-green-600">€1.2M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Scheduled Outflows</span>
                  <span className="font-medium text-red-600">€580k</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Net Position</span>
                    <span className="font-bold text-blue-600">€620k</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4">Outstanding Payments</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Meegan Builders</span>
                  <span className="font-medium text-red-600">€285k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">O'Connor Architecture</span>
                  <span className="font-medium text-red-600">€25k</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Murphy Engineering</span>
                  <span className="font-medium text-red-600">€15k</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-gray-900 mb-4">Cash Flow Health</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">Good</div>
                <div className="text-sm text-gray-600">Positive trend with healthy reserves</div>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-800">
                    <strong>€2.1M</strong> available credit facility
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Financial & Construction Milestones</h3>
            
            <div className="space-y-6">
              {[
                {
                  title: 'Project Funding Secured',
                  description: 'Initial development funding and construction loan approved',
                  amount: '€3.5M',
                  date: '2024-01-15',
                  status: 'completed',
                  progress: 100
                },
                {
                  title: 'Foundation Milestone Payment',
                  description: 'Foundation work completed - Meegan Builders payment released',
                  amount: '€850k',
                  date: '2024-06-30',
                  status: 'completed',
                  progress: 100
                },
                {
                  title: 'Break-even Point Reached',
                  description: '60% of units sold - project operational break-even achieved',
                  amount: '€2.9M',
                  date: '2025-06-15',
                  status: 'completed',
                  progress: 100
                },
                {
                  title: 'Structural Completion Payment',
                  description: 'All buildings weathertight - major construction milestone',
                  amount: '€1.2M',
                  date: '2025-08-15',
                  status: 'in_progress',
                  progress: 75
                },
                {
                  title: 'Pre-completion Sales Target',
                  description: '85% of units sold before practical completion',
                  amount: '€4.1M',
                  date: '2025-10-01',
                  status: 'planned',
                  progress: 25
                },
                {
                  title: 'Practical Completion',
                  description: 'All units completed and ready for handover',
                  amount: '€500k',
                  date: '2025-12-15',
                  status: 'planned',
                  progress: 0
                }
              ].map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-600' :
                      milestone.status === 'in_progress' ? 'bg-blue-100 text-blue-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {milestone.status === 'completed' ? <CheckCircle size={20} /> :
                       milestone.status === 'in_progress' ? <Clock size={20} /> :
                       <Calendar size={20} />}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{milestone.amount}</div>
                        <div className="text-sm text-gray-500">{new Date(milestone.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                    
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              milestone.status === 'completed' ? 'bg-green-500' :
                              milestone.status === 'in_progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`}
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">{milestone.progress}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}