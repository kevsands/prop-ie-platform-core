'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Pause,
  Building2,
  DollarSign,
  FileText,
  Gavel,
  Hammer,
  PaintBucket,
  TrendingUp,
  Users,
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Target,
  BarChart3,
  CreditCard,
  Receipt,
  Shield,
  Zap,
  Home,
  MapPin,
  BookOpen
} from 'lucide-react';

export default function DeveloperTimelinePage() {
  const [activeView, setActiveView] = useState('gantt');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState(new Set(['construction', 'sales']));

  // Timeline categories with colors and icons
  const timelineCategories = [
    { id: 'design', name: 'Design Phase', icon: PaintBucket, color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200', textColor: 'text-blue-700' },
    { id: 'construction', name: 'Construction', icon: Hammer, color: 'orange', bgColor: 'bg-orange-50', borderColor: 'border-orange-200', textColor: 'text-orange-700' },
    { id: 'sales', name: 'Sales & Marketing', icon: TrendingUp, color: 'green', bgColor: 'bg-green-50', borderColor: 'border-green-200', textColor: 'text-green-700' },
    { id: 'financial', name: 'Financial', icon: DollarSign, color: 'purple', bgColor: 'bg-purple-50', borderColor: 'border-purple-200', textColor: 'text-purple-700' },
    { id: 'regulatory', name: 'Regulatory', icon: Shield, color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200', textColor: 'text-red-700' },
    { id: 'legal', name: 'Legal', icon: Gavel, color: 'gray', bgColor: 'bg-gray-50', borderColor: 'border-gray-200', textColor: 'text-gray-700' }
  ];

  // Project data
  const projects = [
    { id: 'fitzgerald', name: 'Fitzgerald Gardens', status: 'active', completion: 68 },
    { id: 'ellwood', name: 'Ellwood', status: 'active', completion: 45 },
    { id: 'ballymakenny', name: 'Ballymakenny View', status: 'active', completion: 82 }
  ];

  // Comprehensive timeline data
  const timelineItems = [
    // DESIGN PHASE
    {
      id: 'des-001',
      project: 'fitzgerald',
      category: 'design',
      title: 'Planning Application Submission',
      description: 'Submit comprehensive planning application with all required documentation',
      startDate: '2024-02-01',
      endDate: '2024-02-15',
      status: 'completed',
      priority: 'critical',
      dependencies: [],
      assignee: 'Sarah O\'Connor (O\'Connor Architecture)',
      cost: 25000,
      vatAmount: 5000,
      progress: 100
    },
    {
      id: 'des-002',
      project: 'fitzgerald',
      category: 'design',
      title: 'Planning Permission Approval',
      description: 'Await planning permission decision from Cork County Council',
      startDate: '2024-02-15',
      endDate: '2024-04-15',
      status: 'completed',
      priority: 'critical',
      dependencies: ['des-001'],
      assignee: 'Cork County Council',
      cost: 0,
      vatAmount: 0,
      progress: 100
    },
    {
      id: 'des-003',
      project: 'ellwood',
      category: 'design',
      title: 'Architectural Design Development',
      description: 'Detailed architectural drawings and specifications',
      startDate: '2024-03-01',
      endDate: '2024-05-30',
      status: 'in-progress',
      priority: 'high',
      dependencies: [],
      assignee: 'Jennifer Ryan (Ryan + Associates)',
      cost: 45000,
      vatAmount: 9000,
      progress: 75
    },

    // CONSTRUCTION
    {
      id: 'con-001',
      project: 'fitzgerald',
      category: 'construction',
      title: 'Site Preparation & Demolition',
      description: 'Clear site, demolish existing structures, soil testing',
      startDate: '2024-04-20',
      endDate: '2024-05-15',
      status: 'completed',
      priority: 'critical',
      dependencies: ['des-002'],
      assignee: 'Murphy Construction',
      cost: 125000,
      vatAmount: 25000,
      progress: 100
    },
    {
      id: 'con-002',
      project: 'fitzgerald',
      category: 'construction',
      title: 'Foundation & Basement Construction',
      description: 'Excavation, foundation work, basement structure',
      startDate: '2024-05-15',
      endDate: '2024-08-30',
      status: 'completed',
      priority: 'critical',
      dependencies: ['con-001'],
      assignee: 'Murphy Construction',
      cost: 485000,
      vatAmount: 97000,
      progress: 100
    },
    {
      id: 'con-003',
      project: 'fitzgerald',
      category: 'construction',
      title: 'Structural Frame Construction',
      description: 'Steel/concrete frame, floors, roof structure',
      startDate: '2024-08-30',
      endDate: '2024-12-15',
      status: 'in-progress',
      priority: 'critical',
      dependencies: ['con-002'],
      assignee: 'Murphy Construction',
      cost: 850000,
      vatAmount: 170000,
      progress: 85
    },
    {
      id: 'con-004',
      project: 'ballymakenny',
      category: 'construction',
      title: 'Final Finishes & Handover Prep',
      description: 'Interior finishes, landscaping, snagging, handover documentation',
      startDate: '2025-05-01',
      endDate: '2025-06-30',
      status: 'in-progress',
      priority: 'high',
      dependencies: [],
      assignee: 'Byrne Construction Group',
      cost: 245000,
      vatAmount: 49000,
      progress: 70
    },

    // SALES & MARKETING
    {
      id: 'sal-001',
      project: 'fitzgerald',
      category: 'sales',
      title: 'Marketing Launch',
      description: 'Website launch, brochures, advertising campaign',
      startDate: '2024-06-01',
      endDate: '2024-06-30',
      status: 'completed',
      priority: 'high',
      dependencies: ['des-002'],
      assignee: 'Marketing Team',
      cost: 35000,
      vatAmount: 7000,
      progress: 100
    },
    {
      id: 'sal-002',
      project: 'fitzgerald',
      category: 'sales',
      title: 'Phase 1 Sales Target (50%)',
      description: 'Achieve 50% sales milestone for early cash flow',
      startDate: '2024-06-01',
      endDate: '2024-12-31',
      status: 'in-progress',
      priority: 'critical',
      dependencies: ['sal-001'],
      assignee: 'Sales Team',
      cost: 0,
      vatAmount: 0,
      progress: 60
    },
    {
      id: 'sal-003',
      project: 'ellwood',
      category: 'sales',
      title: 'Show Apartment Completion',
      description: 'Complete and stage show apartments for viewing',
      startDate: '2025-03-01',
      endDate: '2025-04-15',
      status: 'pending',
      priority: 'high',
      dependencies: [],
      assignee: 'Alan McCarthy (McCarthy Interiors)',
      cost: 65000,
      vatAmount: 13000,
      progress: 0
    },

    // FINANCIAL
    {
      id: 'fin-001',
      project: 'fitzgerald',
      category: 'financial',
      title: 'Construction Loan Drawdown 1',
      description: 'First major drawdown for site works and foundations',
      startDate: '2024-05-01',
      endDate: '2024-05-01',
      status: 'completed',
      priority: 'critical',
      dependencies: ['con-001'],
      assignee: 'Finance Team',
      cost: 0,
      vatAmount: 0,
      progress: 100,
      amount: 2500000
    },
    {
      id: 'fin-002',
      project: 'fitzgerald',
      category: 'financial',
      title: 'VAT Return Q2 2024',
      description: 'Quarterly VAT return filing with construction input credits',
      startDate: '2024-07-19',
      endDate: '2024-07-19',
      status: 'completed',
      priority: 'high',
      dependencies: [],
      assignee: 'Accounting Firm',
      cost: 2500,
      vatAmount: 500,
      progress: 100,
      vatReturn: 45000
    },
    {
      id: 'fin-003',
      project: 'fitzgerald',
      category: 'financial',
      title: 'Revenue Recognition Milestone 1',
      description: 'First revenue recognition based on construction progress',
      startDate: '2024-12-31',
      endDate: '2024-12-31',
      status: 'pending',
      priority: 'high',
      dependencies: ['con-003'],
      assignee: 'Finance Team',
      cost: 0,
      vatAmount: 0,
      progress: 0,
      revenue: 4200000
    },
    {
      id: 'fin-004',
      project: 'ellwood',
      category: 'financial',
      title: 'Cash Flow Critical Point',
      description: 'Maximum cash outflow period - monitor liquidity carefully',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      status: 'upcoming',
      priority: 'critical',
      dependencies: [],
      assignee: 'CFO',
      cost: 0,
      vatAmount: 0,
      progress: 0,
      cashOutflow: 3500000
    },

    // REGULATORY
    {
      id: 'reg-001',
      project: 'fitzgerald',
      category: 'regulatory',
      title: 'Building Control Approval',
      description: 'Submit construction drawings for building control approval',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      status: 'completed',
      priority: 'critical',
      dependencies: ['des-002'],
      assignee: 'Building Control Officer',
      cost: 12000,
      vatAmount: 2400,
      progress: 100
    },
    {
      id: 'reg-002',
      project: 'fitzgerald',
      category: 'regulatory',
      title: 'Fire Safety Certificate',
      description: 'Obtain fire safety certificate from local authority',
      startDate: '2024-09-01',
      endDate: '2024-10-15',
      status: 'completed',
      priority: 'critical',
      dependencies: ['con-002'],
      assignee: 'Fire Safety Consultant',
      cost: 8500,
      vatAmount: 1700,
      progress: 100
    },
    {
      id: 'reg-003',
      project: 'ballymakenny',
      category: 'regulatory',
      title: 'Completion Certificates',
      description: 'Obtain completion certificates for all units',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      status: 'in-progress',
      priority: 'critical',
      dependencies: ['con-004'],
      assignee: 'Building Control',
      cost: 15000,
      vatAmount: 3000,
      progress: 40
    },
    {
      id: 'reg-004',
      project: 'ellwood',
      category: 'regulatory',
      title: 'NZEB Certification',
      description: 'Nearly Zero Energy Building certification for compliance',
      startDate: '2025-08-01',
      endDate: '2025-09-15',
      status: 'pending',
      priority: 'high',
      dependencies: [],
      assignee: 'SEAI Assessor',
      cost: 25000,
      vatAmount: 5000,
      progress: 0
    },

    // LEGAL
    {
      id: 'leg-001',
      project: 'fitzgerald',
      category: 'legal',
      title: 'Unit Sales Contracts Preparation',
      description: 'Prepare standard unit sale contracts and legal documentation',
      startDate: '2024-05-01',
      endDate: '2024-05-30',
      status: 'completed',
      priority: 'high',
      dependencies: ['des-002'],
      assignee: 'Legal Team',
      cost: 15000,
      vatAmount: 3000,
      progress: 100
    },
    {
      id: 'leg-002',
      project: 'ballymakenny',
      category: 'legal',
      title: 'Final Unit Closings',
      description: 'Complete legal closings for remaining 32 units',
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      status: 'pending',
      priority: 'critical',
      dependencies: ['reg-003'],
      assignee: 'Solicitors',
      cost: 45000,
      vatAmount: 9000,
      progress: 0
    },
    {
      id: 'leg-003',
      project: 'ellwood',
      category: 'legal',
      title: 'Management Company Setup',
      description: 'Establish apartment management company and transfer',
      startDate: '2025-10-01',
      endDate: '2025-11-30',
      status: 'pending',
      priority: 'medium',
      dependencies: [],
      assignee: 'Legal Team',
      cost: 12000,
      vatAmount: 2400,
      progress: 0
    }
  ];

  // Filter timeline items
  const filteredItems = timelineItems.filter(item => {
    if (selectedProject !== 'all' && item.project !== selectedProject) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    return true;
  });

  // Group items by category
  const groupedItems = timelineCategories.reduce((acc, category) => {
    acc[category.id] = filteredItems.filter(item => item.category === category.id);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  // Status configuration
  const statusConfig = {
    completed: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' },
    'in-progress': { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' },
    pending: { icon: Pause, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Pending' },
    upcoming: { icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Upcoming' },
    overdue: { icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100', label: 'Overdue' },
    cancelled: { icon: X, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Cancelled' }
  };

  // Priority configuration
  const priorityConfig = {
    critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical' },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High' },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Medium' },
    low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Low' }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timeline Management</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive project timeline tracking across design, construction, sales, financial, regulatory, and legal phases
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Timeline
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            Add Milestone
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Milestones</p>
              <p className="text-2xl font-bold text-gray-900">{timelineItems.length}</p>
            </div>
            <Target size={24} className="text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Items</p>
              <p className="text-2xl font-bold text-red-600">
                {timelineItems.filter(item => item.priority === 'critical').length}
              </p>
            </div>
            <AlertTriangle size={24} className="text-red-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {timelineItems.filter(item => item.status === 'completed').length}
              </p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Investment</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(timelineItems.reduce((sum, item) => sum + (item.cost || 0), 0))}
              </p>
            </div>
            <DollarSign size={24} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 min-w-[200px]">
            <Building2 size={16} className="text-gray-500" />
            <select 
              value={selectedProject} 
              onChange={(e) => setSelectedProject(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 min-w-[180px]">
            <Filter size={16} className="text-gray-500" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Categories</option>
              {timelineCategories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 min-w-[150px]">
            <Clock size={16} className="text-gray-500" />
            <select 
              value={selectedStatus} 
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="upcoming">Upcoming</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Search size={16} className="text-gray-500" />
            <input 
              type="text" 
              placeholder="Search milestones..." 
              className="border border-gray-300 rounded-md px-3 py-1 text-sm w-[200px]"
            />
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'gantt', label: 'Timeline View', icon: BarChart3 },
              { id: 'list', label: 'List View', icon: FileText },
              { id: 'calendar', label: 'Calendar View', icon: Calendar }
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeView === view.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <view.icon size={16} />
                {view.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Timeline Content */}
        <div className="p-6">
          {activeView === 'gantt' && (
            <div className="space-y-6">
              {timelineCategories.map((category) => {
                const categoryItems = groupedItems[category.id] || [];
                if (categoryItems.length === 0) return null;

                const isExpanded = expandedCategories.has(category.id);

                return (
                  <div key={category.id} className={`border rounded-lg ${category.borderColor}`}>
                    <button
                      onClick={() => toggleCategoryExpansion(category.id)}
                      className={`w-full flex items-center justify-between p-4 ${category.bgColor} hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center gap-3">
                        <category.icon size={20} className={category.textColor} />
                        <h3 className={`font-semibold ${category.textColor}`}>
                          {category.name} ({categoryItems.length})
                        </h3>
                      </div>
                      {isExpanded ? (
                        <ChevronDown size={20} className={category.textColor} />
                      ) : (
                        <ChevronRight size={20} className={category.textColor} />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 space-y-3">
                        {categoryItems.map((item) => {
                          const StatusIcon = statusConfig[item.status as keyof typeof statusConfig]?.icon || Clock;
                          const status = statusConfig[item.status as keyof typeof statusConfig];
                          const priority = priorityConfig[item.priority as keyof typeof priorityConfig];

                          return (
                            <div key={item.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-gray-900">{item.title}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color} ${priority.border} border`}>
                                      {priority.label}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                    <span>📅 {formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                                    <span>👤 {item.assignee}</span>
                                    {item.cost > 0 && <span>💰 {formatCurrency(item.cost)}</span>}
                                    {item.vatAmount > 0 && <span>🧾 VAT: {formatCurrency(item.vatAmount)}</span>}
                                    {item.amount && <span>💳 Amount: {formatCurrency(item.amount)}</span>}
                                    {item.revenue && <span>📈 Revenue: {formatCurrency(item.revenue)}</span>}
                                    {item.cashOutflow && <span>💸 Outflow: {formatCurrency(item.cashOutflow)}</span>}
                                    {item.vatReturn && <span>🔄 VAT Return: {formatCurrency(item.vatReturn)}</span>}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status?.bg} ${status?.color}`}>
                                    <StatusIcon size={12} />
                                    {status?.label}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <button className="p-1 text-gray-400 hover:text-blue-600">
                                      <Eye size={14} />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-green-600">
                                      <Edit size={14} />
                                    </button>
                                    <button className="p-1 text-gray-400 hover:text-red-600">
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="mt-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs text-gray-600">Progress</span>
                                  <span className="text-xs text-gray-600">{item.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      item.status === 'completed' ? 'bg-green-500' :
                                      item.status === 'in-progress' ? 'bg-blue-500' :
                                      'bg-gray-400'
                                    }`}
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                              </div>

                              {/* Dependencies */}
                              {item.dependencies.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                  <div className="text-xs text-gray-600">
                                    <span className="font-medium">Dependencies:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {item.dependencies.map((depId) => {
                                        const dep = timelineItems.find(t => t.id === depId);
                                        return dep ? (
                                          <span key={depId} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                            {dep.title}
                                          </span>
                                        ) : null;
                                      })}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeView === 'list' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Milestone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredItems.map((item) => {
                      const project = projects.find(p => p.id === item.project);
                      const category = timelineCategories.find(c => c.id === item.category);
                      const StatusIcon = statusConfig[item.status as keyof typeof statusConfig]?.icon || Clock;
                      const status = statusConfig[item.status as keyof typeof statusConfig];
                      const priority = priorityConfig[item.priority as keyof typeof priorityConfig];

                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4">
                            <div>
                              <div className="font-medium text-gray-900 text-sm">{item.title}</div>
                              <div className="text-gray-500 text-xs">{item.assignee}</div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{project?.name}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              {category && <category.icon size={16} className={category.textColor} />}
                              <span className="text-sm text-gray-900">{category?.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status?.bg} ${status?.color} w-fit`}>
                              <StatusIcon size={12} />
                              {status?.label}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color} ${priority.border} border`}>
                              {priority.label}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">{formatDate(item.endDate)}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    item.status === 'completed' ? 'bg-green-500' :
                                    item.status === 'in-progress' ? 'bg-blue-500' :
                                    'bg-gray-400'
                                  }`}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-600">{item.progress}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            {item.cost > 0 ? formatCurrency(item.cost) : '-'}
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-1">
                              <button className="p-1 text-gray-400 hover:text-blue-600">
                                <Eye size={14} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-green-600">
                                <Edit size={14} />
                              </button>
                              <button className="p-1 text-gray-400 hover:text-red-600">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeView === 'calendar' && (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
              <p className="text-gray-600 mb-4">
                Interactive calendar view showing all milestones, deadlines, and critical dates across all projects and categories.
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Launch Calendar View
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign size={20} className="text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Financial Timeline Summary</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total Project Costs</span>
              <span className="font-medium">{formatCurrency(timelineItems.reduce((sum, item) => sum + (item.cost || 0), 0))}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Total VAT Liability</span>
              <span className="font-medium">{formatCurrency(timelineItems.reduce((sum, item) => sum + (item.vatAmount || 0), 0))}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Expected Revenue</span>
              <span className="font-medium text-green-600">{formatCurrency(timelineItems.reduce((sum, item) => sum + (item.revenue || 0), 0))}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">VAT Returns Expected</span>
              <span className="font-medium text-blue-600">{formatCurrency(timelineItems.reduce((sum, item) => sum + (item.vatReturn || 0), 0))}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Critical Milestones</h3>
          </div>
          <div className="space-y-3">
            {timelineItems
              .filter(item => item.priority === 'critical' && item.status !== 'completed')
              .slice(0, 5)
              .map((item) => {
                const project = projects.find(p => p.id === item.project);
                const category = timelineCategories.find(c => c.id === item.category);
                return (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex-1">
                      <h4 className="font-medium text-red-900 text-sm">{item.title}</h4>
                      <p className="text-red-700 text-xs">{project?.name} • {category?.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-red-900 text-sm font-medium">{formatDate(item.endDate)}</div>
                      <div className="text-red-700 text-xs">{item.progress}% complete</div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}