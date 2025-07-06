'use client';

import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  DollarSign, 
  FileText, 
  Settings, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload,
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Edit, 
  Trash2,
  Phone, 
  Mail, 
  MapPin,
  Building2,
  Target,
  Star,
  Award,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  BookOpen,
  Clipboard,
  CheckSquare,
  AlertCircle,
  X,
  ChevronDown,
  ChevronRight,
  PaperclipIcon,
  MessageSquare,
  Bell,
  Flag,
  Hash,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  MoreHorizontal,
  UserPlus,
  FileCheck,
  Send
} from 'lucide-react';

export default function DeveloperTendersPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedTender, setSelectedTender] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  // Tender categories
  const tenderCategories = [
    { id: 'construction', name: 'Construction', icon: Building2, color: 'orange' },
    { id: 'design', name: 'Design & Architecture', icon: BookOpen, color: 'blue' },
    { id: 'engineering', name: 'Engineering', icon: Zap, color: 'yellow' },
    { id: 'professional', name: 'Professional Services', icon: Users, color: 'green' },
    { id: 'specialist', name: 'Specialist Trades', icon: Award, color: 'purple' },
    { id: 'materials', name: 'Materials & Supply', icon: Clipboard, color: 'gray' }
  ];

  // Projects
  const projects = [
    { id: 'fitzgerald', name: 'Fitzgerald Gardens', phase: 'Construction', value: '€14.2M' },
    { id: 'ellwood', name: 'Ellwood', phase: 'Design Development', value: '€26.8M' },
    { id: 'ballymakenny', name: 'Ballymakenny View', phase: 'Final Phase', value: '€28.5M' }
  ];

  // Comprehensive tender data
  const tenders = [
    {
      id: 'TEN-2025-001',
      title: 'Main Construction Contract - Fitzgerald Gardens',
      project: 'fitzgerald',
      category: 'construction',
      description: 'Complete construction services for 42-unit residential development including all trades, materials, and project management',
      status: 'evaluation',
      priority: 'critical',
      budget: 8500000,
      estimatedValue: 8200000,
      submissions: 8,
      deadline: '2025-01-15',
      publishDate: '2024-11-01',
      evaluationDate: '2025-01-20',
      awardDate: '2025-02-01',
      startDate: '2025-02-15',
      duration: '18 months',
      location: 'Cork, Ireland',
      responsiblePerson: 'Sarah O\'Connor',
      evaluationTeam: ['Sarah O\'Connor', 'Michael Walsh', 'Patrick Murphy'],
      requirements: {
        prequalification: ['Valid Tax Clearance', 'Insurance €10M+', 'Previous experience €5M+ projects'],
        technical: ['Detailed methodology', 'Health & Safety plan', 'Quality assurance procedures'],
        financial: ['Audited accounts 3 years', 'Bank guarantee capability', 'Cash flow projections'],
        legal: ['Company registration', 'Professional indemnity', 'Contract compliance']
      },
      evaluationCriteria: {
        technical: { weight: 60, maxScore: 100 },
        commercial: { weight: 30, maxScore: 100 },
        experience: { weight: 10, maxScore: 100 }
      },
      stage: 'RFT', // RFI, RFQ, RFT, Award, Contract
      bondRequired: true,
      bondPercentage: 10,
      retentionPercentage: 5
    },
    {
      id: 'TEN-2025-002',
      title: 'Architectural Services - Ellwood Phase 2',
      project: 'ellwood',
      category: 'design',
      description: 'Complete architectural design services for detailed design development and construction documentation',
      status: 'active',
      priority: 'high',
      budget: 450000,
      estimatedValue: 420000,
      submissions: 12,
      deadline: '2025-02-28',
      publishDate: '2024-12-01',
      evaluationDate: '2025-03-10',
      awardDate: '2025-03-20',
      startDate: '2025-04-01',
      duration: '12 months',
      location: 'Dublin, Ireland',
      responsiblePerson: 'Jennifer Ryan',
      evaluationTeam: ['Jennifer Ryan', 'Thomas Clarke', 'Rachel Murphy'],
      requirements: {
        prequalification: ['RIAI membership', 'Professional indemnity €5M+', 'Relevant experience'],
        technical: ['Portfolio submission', 'Design methodology', 'BIM capability'],
        financial: ['Financial stability evidence', 'Fee structure', 'Resource allocation'],
        legal: ['Professional registration', 'Contract terms acceptance', 'IP assignment']
      },
      evaluationCriteria: {
        technical: { weight: 50, maxScore: 100 },
        commercial: { weight: 25, maxScore: 100 },
        experience: { weight: 25, maxScore: 100 }
      },
      stage: 'RFT',
      bondRequired: false,
      bondPercentage: 0,
      retentionPercentage: 3
    },
    {
      id: 'TEN-2025-003',
      title: 'Landscaping & External Works - Ballymakenny View',
      project: 'ballymakenny',
      category: 'specialist',
      description: 'Complete landscaping, external works, car parking, and site infrastructure for final phase completion',
      status: 'draft',
      priority: 'medium',
      budget: 380000,
      estimatedValue: 365000,
      submissions: 0,
      deadline: '2025-03-15',
      publishDate: '2025-01-20',
      evaluationDate: '2025-03-25',
      awardDate: '2025-04-05',
      startDate: '2025-04-15',
      duration: '8 months',
      location: 'Drogheda, Ireland',
      responsiblePerson: 'Paul McGrath',
      evaluationTeam: ['Paul McGrath', 'Michael Byrne', 'Sharon Kelly'],
      requirements: {
        prequalification: ['Landscaping certification', 'Insurance €3M+', 'Safety record'],
        technical: ['Landscape design capability', 'Plant knowledge', 'Maintenance schedules'],
        financial: ['Working capital evidence', 'Supplier agreements', 'Cost breakdowns'],
        legal: ['Contractor registration', 'Environmental compliance', 'Warranty provisions']
      },
      evaluationCriteria: {
        technical: { weight: 40, maxScore: 100 },
        commercial: { weight: 35, maxScore: 100 },
        experience: { weight: 25, maxScore: 100 }
      },
      stage: 'RFI',
      bondRequired: true,
      bondPercentage: 5,
      retentionPercentage: 5
    },
    {
      id: 'TEN-2025-004',
      title: 'MEP Design Services - Ellwood',
      project: 'ellwood',
      category: 'engineering',
      description: 'Mechanical, Electrical, and Plumbing design services including NZEB compliance and smart home integration',
      status: 'awarded',
      priority: 'high',
      budget: 280000,
      estimatedValue: 265000,
      submissions: 6,
      deadline: '2024-12-15',
      publishDate: '2024-10-01',
      evaluationDate: '2024-12-20',
      awardDate: '2025-01-10',
      startDate: '2025-01-20',
      duration: '10 months',
      location: 'Dublin, Ireland',
      responsiblePerson: 'Thomas Clarke',
      evaluationTeam: ['Thomas Clarke', 'Jennifer Ryan', 'Alan McCarthy'],
      awardedTo: 'Clarke Engineering Group',
      awardValue: 265000,
      requirements: {
        prequalification: ['Chartered engineer status', 'NZEB experience', 'Smart building expertise'],
        technical: ['Sustainability focus', 'BIM coordination', 'System integration'],
        financial: ['Resource allocation', 'Value engineering', 'Lifecycle costs'],
        legal: ['Professional standards', 'Performance guarantees', 'Coordination protocols']
      },
      evaluationCriteria: {
        technical: { weight: 55, maxScore: 100 },
        commercial: { weight: 25, maxScore: 100 },
        experience: { weight: 20, maxScore: 100 }
      },
      stage: 'Contract',
      bondRequired: false,
      bondPercentage: 0,
      retentionPercentage: 3
    }
  ];

  // Comprehensive contact database
  const contacts = [
    {
      id: 'CON-001',
      company: 'Murphy Construction Ltd',
      contactPerson: 'Patrick Murphy',
      role: 'Managing Director',
      email: 'pmurphy@murphycon.ie',
      phone: '+353 21 456 7890',
      mobile: '+353 87 123 4567',
      address: '45 Industrial Estate, Cork, Ireland',
      website: 'www.murphycon.ie',
      categories: ['construction'],
      specialties: ['Residential', 'Commercial', 'Civil Works'],
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      insurance: 12000000,
      turnover: 25000000,
      employees: 85,
      establishedYear: 1995,
      rating: 4.8,
      previousProjects: 12,
      currentProjects: 3,
      financialRating: 'A+',
      riskAssessment: 'Low',
      preferredSupplier: true,
      blacklisted: false,
      notes: 'Excellent track record on residential projects. Strong safety culture. Reliable delivery.',
      lastContact: '2024-12-10',
      relationship: 'Strategic Partner',
      keyContacts: [
        { name: 'Patrick Murphy', role: 'Managing Director', phone: '+353 87 123 4567', email: 'pmurphy@murphycon.ie' },
        { name: 'Mary Murphy', role: 'Finance Director', phone: '+353 87 234 5678', email: 'mmurphy@murphycon.ie' },
        { name: 'John O\'Sullivan', role: 'Operations Manager', phone: '+353 87 345 6789', email: 'josullivan@murphycon.ie' }
      ],
      documents: ['Tax Clearance', 'Insurance Certificate', 'Safety Statement', 'Quality Manual'],
      performance: {
        qualityScore: 95,
        timelinessScore: 92,
        costManagement: 88,
        safetyRecord: 98,
        clientSatisfaction: 94
      }
    },
    {
      id: 'CON-002',
      company: 'Ryan + Associates Architects',
      contactPerson: 'Jennifer Ryan',
      role: 'Principal Architect',
      email: 'jennifer@ryanarc.ie',
      phone: '+353 1 234 5678',
      mobile: '+353 86 123 4567',
      address: '12 Georgian Square, Dublin 2, Ireland',
      website: 'www.ryanarc.ie',
      categories: ['design'],
      specialties: ['Residential', 'Mixed-Use', 'Sustainable Design'],
      certifications: ['RIAI', 'RIBA', 'LEED AP'],
      insurance: 8000000,
      turnover: 3500000,
      employees: 22,
      establishedYear: 2008,
      rating: 4.9,
      previousProjects: 45,
      currentProjects: 8,
      financialRating: 'A',
      riskAssessment: 'Very Low',
      preferredSupplier: true,
      blacklisted: false,
      notes: 'Award-winning sustainable design practice. Excellent BIM capabilities. Strong collaboration.',
      lastContact: '2024-12-08',
      relationship: 'Preferred Partner',
      keyContacts: [
        { name: 'Jennifer Ryan', role: 'Principal Architect', phone: '+353 86 123 4567', email: 'jennifer@ryanarc.ie' },
        { name: 'David Walsh', role: 'Senior Architect', phone: '+353 86 234 5678', email: 'dwalsh@ryanarc.ie' },
        { name: 'Sarah Kelly', role: 'Project Architect', phone: '+353 86 345 6789', email: 'skelly@ryanarc.ie' }
      ],
      documents: ['Professional Indemnity', 'RIAI Certificate', 'Portfolio', 'BIM Protocol'],
      performance: {
        qualityScore: 98,
        timelinessScore: 95,
        costManagement: 91,
        safetyRecord: 95,
        clientSatisfaction: 97
      }
    },
    {
      id: 'CON-003',
      company: 'Green Landscapes Ltd',
      contactPerson: 'Paul McGrath',
      role: 'Director',
      email: 'paul@greenlands.ie',
      phone: '+353 41 456 7890',
      mobile: '+353 87 456 7890',
      address: '8 Nursery Road, Drogheda, Ireland',
      website: 'www.greenlands.ie',
      categories: ['specialist'],
      specialties: ['Landscaping', 'Horticulture', 'Irrigation'],
      certifications: ['ALCI', 'Bord Bia', 'Organic Certification'],
      insurance: 4000000,
      turnover: 1800000,
      employees: 15,
      establishedYear: 2012,
      rating: 4.6,
      previousProjects: 28,
      currentProjects: 5,
      financialRating: 'B+',
      riskAssessment: 'Low',
      preferredSupplier: false,
      blacklisted: false,
      notes: 'Specialist in sustainable landscaping. Good local knowledge. Competitive pricing.',
      lastContact: '2024-11-25',
      relationship: 'Regular Supplier',
      keyContacts: [
        { name: 'Paul McGrath', role: 'Director', phone: '+353 87 456 7890', email: 'paul@greenlands.ie' },
        { name: 'Anne McGrath', role: 'Design Manager', phone: '+353 87 567 8901', email: 'anne@greenlands.ie' }
      ],
      documents: ['Insurance Certificate', 'Tax Clearance', 'Plant Health Certificate'],
      performance: {
        qualityScore: 88,
        timelinessScore: 85,
        costManagement: 92,
        safetyRecord: 89,
        clientSatisfaction: 87
      }
    }
  ];

  // Sub-task templates for different tender types
  const subTaskTemplates = {
    construction: [
      { category: 'Prequalification', tasks: ['Verify tax clearance', 'Check insurance coverage', 'Validate safety record', 'Confirm financial capacity'] },
      { category: 'Technical Evaluation', tasks: ['Review methodology', 'Assess resource allocation', 'Evaluate quality procedures', 'Check health & safety plan'] },
      { category: 'Commercial Evaluation', tasks: ['Price analysis', 'Value engineering review', 'Cash flow assessment', 'Risk evaluation'] },
      { category: 'Legal Review', tasks: ['Contract compliance', 'Insurance validation', 'Bond arrangements', 'Warranty provisions'] },
      { category: 'Reference Checks', tasks: ['Contact previous clients', 'Verify project claims', 'Check performance history', 'Validate certifications'] }
    ],
    design: [
      { category: 'Portfolio Review', tasks: ['Assess design quality', 'Check relevant experience', 'Evaluate innovation', 'Review sustainability approach'] },
      { category: 'Technical Capability', tasks: ['BIM competency', 'Software proficiency', 'Team qualifications', 'Resource availability'] },
      { category: 'Professional Standards', tasks: ['Verify registrations', 'Check indemnity insurance', 'Confirm CPD compliance', 'Validate awards'] },
      { category: 'Collaboration Assessment', tasks: ['Communication skills', 'Team integration', 'Coordination ability', 'Problem-solving approach'] }
    ],
    engineering: [
      { category: 'Technical Expertise', tasks: ['Specialized knowledge', 'Innovation capability', 'Problem-solving approach', 'Technology adoption'] },
      { category: 'Regulatory Compliance', tasks: ['Standards compliance', 'Code knowledge', 'Certification status', 'Regulatory relationships'] },
      { category: 'Integration Capability', tasks: ['Coordination skills', 'BIM proficiency', 'System integration', 'Interdisciplinary working'] },
      { category: 'Sustainability Focus', tasks: ['Environmental expertise', 'Energy efficiency', 'Sustainable systems', 'NZEB experience'] }
    ]
  };

  // Status configuration
  const statusConfig = {
    draft: { icon: Edit, color: 'text-gray-600', bg: 'bg-gray-100', label: 'Draft' },
    active: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Active' },
    evaluation: { icon: BarChart3, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Evaluation' },
    awarded: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Awarded' },
    cancelled: { icon: X, color: 'text-red-600', bg: 'bg-red-100', label: 'Cancelled' }
  };

  // Priority configuration
  const priorityConfig = {
    critical: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Critical', icon: AlertTriangle },
    high: { color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', label: 'High', icon: Flag },
    medium: { color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Medium', icon: Target },
    low: { color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Low', icon: CheckSquare }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getFilteredTenders = () => {
    return tenders.filter(tender => {
      if (filterStatus !== 'all' && tender.status !== filterStatus) return false;
      if (filterProject !== 'all' && tender.project !== filterProject) return false;
      if (filterCategory !== 'all' && tender.category !== filterCategory) return false;
      return true;
    });
  };

  const tabs = [
    { id: 'active', label: 'Active Tenders', count: tenders.filter(t => t.status === 'active').length },
    { id: 'evaluation', label: 'Under Evaluation', count: tenders.filter(t => t.status === 'evaluation').length },
    { id: 'draft', label: 'Draft', count: tenders.filter(t => t.status === 'draft').length },
    { id: 'awarded', label: 'Awarded', count: tenders.filter(t => t.status === 'awarded').length },
    { id: 'all', label: 'All Tenders', count: tenders.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tender Management</h1>
          <p className="text-gray-600 mt-1">
            Complete tender lifecycle management with granular task tracking, contact management, and multi-project coordination
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowContactModal(true)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Users size={16} />
            Manage Contacts
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Data
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus size={16} />
            New Tender
          </button>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(tenders.reduce((sum, t) => sum + t.budget, 0))}
              </p>
            </div>
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Across {tenders.length} tenders
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tenders</p>
              <p className="text-2xl font-bold text-blue-600">{tenders.filter(t => t.status === 'active').length}</p>
            </div>
            <Clock size={24} className="text-blue-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {tenders.filter(t => t.status === 'evaluation').length} under evaluation
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Submissions</p>
              <p className="text-2xl font-bold text-purple-600">{tenders.reduce((sum, t) => sum + t.submissions, 0)}</p>
            </div>
            <FileText size={24} className="text-purple-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Avg {Math.round(tenders.reduce((sum, t) => sum + t.submissions, 0) / tenders.length)} per tender
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contacts</p>
              <p className="text-2xl font-bold text-orange-600">{contacts.length}</p>
            </div>
            <Users size={24} className="text-orange-600" />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            {contacts.filter(c => c.preferredSupplier).length} preferred suppliers
          </div>
        </div>
      </div>

      {/* Filters & Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <nav className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Filters */}
        <div className="p-4 border-b">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-gray-500" />
              <select 
                value={filterProject} 
                onChange={(e) => setFilterProject(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>{project.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              >
                <option value="all">All Categories</option>
                {tenderCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tenders..." 
                className="border border-gray-300 rounded-md px-3 py-1 text-sm w-[250px]"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <BarChart3 size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FileText size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tender Content */}
      <div className="space-y-6">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {getFilteredTenders().map((tender) => {
              const project = projects.find(p => p.id === tender.project);
              const category = tenderCategories.find(c => c.id === tender.category);
              const status = statusConfig[tender.status];
              const priority = priorityConfig[tender.priority];
              const daysRemaining = getDaysRemaining(tender.deadline);

              return (
                <div key={tender.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{tender.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="text-blue-600 font-medium">{tender.id}</span>
                          <span>•</span>
                          <span>{project?.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <status.icon size={12} />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <category.icon size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{category?.name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <DollarSign size={16} className="text-green-600" />
                          <span className="font-medium text-green-600">{formatCurrency(tender.budget)}</span>
                        </div>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${priority.bg} ${priority.color} ${priority.border} border`}>
                          <priority.icon size={12} />
                          {priority.label}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>Due: {formatDate(tender.deadline)}</span>
                        </div>
                        <div className={`font-medium ${daysRemaining < 7 ? 'text-red-600' : daysRemaining < 14 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {daysRemaining} days left
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span>{tender.submissions} submissions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users size={16} />
                          <span>{tender.responsiblePerson}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-600">Stage: {tender.stage}</span>
                        <span className="text-xs text-gray-600">
                          {tender.stage === 'RFI' ? '25%' : tender.stage === 'RFQ' ? '50%' : tender.stage === 'RFT' ? '75%' : '100%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            tender.stage === 'RFI' ? 'bg-yellow-500' :
                            tender.stage === 'RFQ' ? 'bg-blue-500' :
                            tender.stage === 'RFT' ? 'bg-purple-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: tender.stage === 'RFI' ? '25%' : 
                                   tender.stage === 'RFQ' ? '50%' : 
                                   tender.stage === 'RFT' ? '75%' : '100%' 
                          }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                          <FileText size={16} />
                        </button>
                      </div>
                      <button 
                        onClick={() => setSelectedTender(tender)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tender</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getFilteredTenders().map((tender) => {
                    const project = projects.find(p => p.id === tender.project);
                    const category = tenderCategories.find(c => c.id === tender.category);
                    const status = statusConfig[tender.status];
                    const priority = priorityConfig[tender.priority];
                    const daysRemaining = getDaysRemaining(tender.deadline);

                    return (
                      <tr key={tender.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{tender.title}</div>
                            <div className="text-sm text-gray-500">{tender.id}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{project?.name}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <category.icon size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-900">{category?.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color} w-fit`}>
                            <status.icon size={12} />
                            {status.label}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(tender.budget)}</td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{formatDate(tender.deadline)}</div>
                          <div className={`text-xs ${daysRemaining < 7 ? 'text-red-600' : daysRemaining < 14 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {daysRemaining} days
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{tender.submissions}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 text-gray-400 hover:text-blue-600">
                              <Eye size={14} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-green-600">
                              <Edit size={14} />
                            </button>
                            <button 
                              onClick={() => setSelectedTender(tender)}
                              className="p-1 text-gray-400 hover:text-purple-600"
                            >
                              <Briefcase size={14} />
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
      </div>

      {/* Detailed Tender Management Modal */}
      {selectedTender && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedTender.title}</h2>
                  <p className="text-gray-600">{selectedTender.id} • {projects.find(p => p.id === selectedTender.project)?.name}</p>
                </div>
                <button 
                  onClick={() => setSelectedTender(null)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Requirements Checklist */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Requirements Checklist</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedTender.requirements).map(([category, requirements]) => (
                        <div key={category}>
                          <h4 className="font-medium text-gray-800 capitalize mb-2">{category}</h4>
                          <div className="space-y-2">
                            {requirements.map((req, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-gray-300" />
                                <span className="text-sm text-gray-700">{req}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sub-tasks */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Sub-tasks & Activities</h3>
                    <div className="space-y-4">
                      {subTaskTemplates[selectedTender.category]?.map((taskGroup, groupIndex) => (
                        <div key={groupIndex}>
                          <h4 className="font-medium text-blue-800 mb-2">{taskGroup.category}</h4>
                          <div className="space-y-2">
                            {taskGroup.tasks.map((task, taskIndex) => (
                              <div key={taskIndex} className="flex items-center justify-between p-2 bg-white rounded border">
                                <div className="flex items-center gap-2">
                                  <input type="checkbox" className="rounded border-gray-300" />
                                  <span className="text-sm text-gray-700">{task}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <select className="text-xs border rounded px-2 py-1">
                                    <option>Unassigned</option>
                                    <option>Sarah O'Connor</option>
                                    <option>Michael Walsh</option>
                                    <option>Patrick Murphy</option>
                                  </select>
                                  <input type="date" className="text-xs border rounded px-2 py-1" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Evaluation Criteria */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Evaluation Criteria</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedTender.evaluationCriteria).map(([criterion, details]) => (
                        <div key={criterion} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div>
                            <span className="font-medium text-gray-800 capitalize">{criterion}</span>
                            <span className="text-sm text-gray-600 ml-2">({details.weight}% weight)</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            Max Score: {details.maxScore}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tender Details */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Tender Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Budget:</span>
                        <span className="font-medium">{formatCurrency(selectedTender.budget)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Estimated Value:</span>
                        <span className="font-medium">{formatCurrency(selectedTender.estimatedValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedTender.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="font-medium">{selectedTender.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bond Required:</span>
                        <span className="font-medium">{selectedTender.bondRequired ? `${selectedTender.bondPercentage}%` : 'No'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retention:</span>
                        <span className="font-medium">{selectedTender.retentionPercentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Key Dates</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Published:</span>
                        <span className="font-medium">{formatDate(selectedTender.publishDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deadline:</span>
                        <span className="font-medium text-red-600">{formatDate(selectedTender.deadline)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Evaluation:</span>
                        <span className="font-medium">{formatDate(selectedTender.evaluationDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Award:</span>
                        <span className="font-medium">{formatDate(selectedTender.awardDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">{formatDate(selectedTender.startDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Evaluation Team</h3>
                    <div className="space-y-2">
                      {selectedTender.evaluationTeam.map((member, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Users size={16} className="text-gray-500" />
                          <span className="text-sm text-gray-700">{member}</span>
                        </div>
                      ))}
                    </div>
                    <button className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      <UserPlus size={16} className="inline mr-2" />
                      Add Member
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="bg-white border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                        <Send size={16} />
                        Send Clarification
                      </button>
                      <button className="w-full px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                        <FileCheck size={16} />
                        Generate Report
                      </button>
                      <button className="w-full px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 flex items-center justify-center gap-2">
                        <Download size={16} />
                        Export Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Management Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="border-b p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Contact Management</h2>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {contacts.map((contact) => (
                  <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{contact.company}</h3>
                        <p className="text-sm text-gray-600">{contact.contactPerson}</p>
                        <p className="text-xs text-gray-500">{contact.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {contact.preferredSupplier && (
                          <Star size={16} className="text-yellow-500 fill-current" />
                        )}
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={i < Math.floor(contact.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-gray-500" />
                        <span className="text-gray-700">{contact.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        <span className="text-gray-700">{contact.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building2 size={14} className="text-gray-500" />
                        <span className="text-gray-700">{contact.specialties.join(', ')}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t">
                      <div className="flex justify-between text-xs text-gray-600 mb-2">
                        <span>Performance</span>
                        <span>{contact.performance.qualityScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-green-500 h-1 rounded-full" 
                          style={{ width: `${contact.performance.qualityScore}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        contact.riskAssessment === 'Low' ? 'bg-green-100 text-green-800' :
                        contact.riskAssessment === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {contact.riskAssessment} Risk
                      </span>
                      <button 
                        onClick={() => setSelectedContact(contact)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}