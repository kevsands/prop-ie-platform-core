/**
 * Professional Coordination Hub
 * Comprehensive coordination system for managing all professionals involved in property transactions
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Users,
  Building2,
  Gavel,
  Calculator,
  Shield,
  MessageSquare,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Star,
  Award,
  Target,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Bell,
  Info,
  Zap,
  TrendingUp,
  MapPin,
  Briefcase,
  CreditCard,
  Home,
  Key,
  Clipboard,
  AlertCircle
} from 'lucide-react';

export interface Professional {
  id: string;
  type: 'estate_agent' | 'solicitor' | 'mortgage_broker' | 'surveyor' | 'engineer' | 'architect' | 'project_manager';
  name: string;
  firm: string;
  email: string;
  phone: string;
  address: string;
  regNumber?: string;
  specializations: string[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  status: 'active' | 'busy' | 'unavailable';
  availability: {
    nextAvailable: Date;
    workingHours: string;
    preferredContact: 'email' | 'phone' | 'both';
  };
  fees: {
    consultationFee?: number;
    hourlyRate?: number;
    fixedFee?: number;
    currency: string;
  };
  portfolio: {
    completedProjects: number;
    yearsExperience: number;
    certifications: string[];
  };
}

export interface CoordinationTask {
  id: string;
  title: string;
  description: string;
  type: 'document_review' | 'inspection' | 'meeting' | 'approval' | 'payment' | 'communication';
  assignedTo: string[];
  createdBy: string;
  dueDate: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  propertyId?: string;
  clientId?: string;
  documents: TaskDocument[];
  comments: TaskComment[];
  dependencies: string[];
  estimatedDuration: number; // minutes
  actualDuration?: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskDocument {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
  signed: boolean;
  reviewed: boolean;
}

export interface TaskComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: Date;
  type: 'comment' | 'status_update' | 'file_attachment';
  attachments?: string[];
}

export interface TransactionTimeline {
  id: string;
  propertyId: string;
  stages: TransactionStage[];
  currentStage: string;
  overallProgress: number;
  estimatedCompletion: Date;
  issues: TransactionIssue[];
  milestones: TransactionMilestone[];
  involvedProfessionals: string[];
}

export interface TransactionStage {
  id: string;
  name: string;
  description: string;
  order: number;
  status: 'upcoming' | 'active' | 'completed' | 'delayed' | 'blocked';
  assignedProfessionals: string[];
  tasks: string[];
  startDate?: Date;
  endDate?: Date;
  dependencies: string[];
  deliverables: string[];
}

export interface TransactionIssue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'legal' | 'financial' | 'technical' | 'administrative';
  raisedBy: string;
  assignedTo: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface TransactionMilestone {
  id: string;
  name: string;
  description: string;
  targetDate: Date;
  actualDate?: Date;
  status: 'upcoming' | 'achieved' | 'delayed' | 'at_risk';
  importance: 'low' | 'medium' | 'high' | 'critical';
}

interface ProfessionalCoordinationHubProps {
  propertyId?: string;
  transactionId?: string;
  userRole?: 'buyer' | 'seller' | 'developer' | 'admin';
  onTaskAssign?: (task: CoordinationTask, professional: Professional) => void;
  onProfessionalInvite?: (professional: Professional) => void;
  className?: string;
}

const MOCK_PROFESSIONALS: Professional[] = [
  {
    id: 'sol-001',
    type: 'solicitor',
    name: 'Sarah Murphy',
    firm: 'Murphy & Associates Solicitors',
    email: 'sarah@murphysolicitors.ie',
    phone: '+353 1 234 5678',
    address: 'Dublin 2',
    regNumber: 'SOL123456',
    specializations: ['Property Law', 'Conveyancing', 'First Time Buyers'],
    rating: 4.8,
    reviewCount: 127,
    verified: true,
    status: 'active',
    availability: {
      nextAvailable: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      workingHours: '9:00 AM - 6:00 PM',
      preferredContact: 'email'
    },
    fees: {
      consultationFee: 150,
      fixedFee: 1200,
      currency: 'EUR'
    },
    portfolio: {
      completedProjects: 450,
      yearsExperience: 12,
      certifications: ['Law Society of Ireland', 'Property & Construction Law']
    }
  },
  {
    id: 'mb-001',
    type: 'mortgage_broker',
    name: 'David O\'Brien',
    firm: 'Premier Mortgage Solutions',
    email: 'david@premiermortgage.ie',
    phone: '+353 1 345 6789',
    address: 'Dublin 4',
    regNumber: 'MB987654',
    specializations: ['First Time Buyers', 'Investment Properties', 'Commercial Mortgages'],
    rating: 4.9,
    reviewCount: 203,
    verified: true,
    status: 'active',
    availability: {
      nextAvailable: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      workingHours: '9:00 AM - 7:00 PM',
      preferredContact: 'both'
    },
    fees: {
      consultationFee: 0,
      hourlyRate: 80,
      currency: 'EUR'
    },
    portfolio: {
      completedProjects: 680,
      yearsExperience: 8,
      certifications: ['Central Bank Authorization', 'QFA Qualification']
    }
  },
  {
    id: 'surv-001',
    type: 'surveyor',
    name: 'Michael Collins',
    firm: 'Collins Property Surveys',
    email: 'michael@collinssurveys.ie',
    phone: '+353 1 456 7890',
    address: 'Dublin 6',
    regNumber: 'SURV567890',
    specializations: ['Structural Surveys', 'Valuations', 'New Build Inspections'],
    rating: 4.7,
    reviewCount: 89,
    verified: true,
    status: 'busy',
    availability: {
      nextAvailable: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      workingHours: '8:00 AM - 5:00 PM',
      preferredContact: 'phone'
    },
    fees: {
      fixedFee: 450,
      currency: 'EUR'
    },
    portfolio: {
      completedProjects: 320,
      yearsExperience: 15,
      certifications: ['RICS Chartered Surveyor', 'SCSI Member']
    }
  }
];

const MOCK_TASKS: CoordinationTask[] = [
  {
    id: 'task-001',
    title: 'Property Title Search',
    description: 'Conduct comprehensive title search and prepare report',
    type: 'document_review',
    assignedTo: ['sol-001'],
    createdBy: 'buyer-001',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'in_progress',
    priority: 'high',
    documents: [],
    comments: [],
    dependencies: [],
    estimatedDuration: 240,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'task-002',
    title: 'Mortgage Application Processing',
    description: 'Submit and track mortgage application with preferred lender',
    type: 'approval',
    assignedTo: ['mb-001'],
    createdBy: 'buyer-001',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'high',
    documents: [],
    comments: [],
    dependencies: ['task-001'],
    estimatedDuration: 480,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date()
  }
];

export default function ProfessionalCoordinationHub({
  propertyId,
  transactionId,
  userRole = 'buyer',
  onTaskAssign,
  onProfessionalInvite,
  className = ''
}: ProfessionalCoordinationHubProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [professionals, setProfessionals] = useState<Professional[]>(MOCK_PROFESSIONALS);
  const [tasks, setTasks] = useState<CoordinationTask[]>(MOCK_TASKS);
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProfessionalModal, setShowProfessionalModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Target },
    { id: 'professionals', name: 'Professionals', icon: Users },
    { id: 'tasks', name: 'Tasks', icon: Clipboard },
    { id: 'timeline', name: 'Timeline', icon: Calendar },
    { id: 'communications', name: 'Messages', icon: MessageSquare }
  ];

  const professionalTypes = [
    { id: 'all', name: 'All Professionals', icon: Users },
    { id: 'solicitor', name: 'Solicitors', icon: Gavel },
    { id: 'mortgage_broker', name: 'Mortgage Brokers', icon: Calculator },
    { id: 'surveyor', name: 'Surveyors', icon: Home },
    { id: 'estate_agent', name: 'Estate Agents', icon: Building2 },
    { id: 'engineer', name: 'Engineers', icon: Shield }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'overdue': return 'text-red-600 bg-red-50 border-red-200';
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'busy': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'unavailable': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'low': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const filteredProfessionals = professionals.filter(prof => {
    const matchesType = filterType === 'all' || prof.type === filterType;
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prof.specializations.some(spec => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTransactionStats = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const overdueTasks = tasks.filter(t => t.status === 'overdue').length;
    const activeProfessionals = professionals.filter(p => p.status === 'active').length;
    
    return {
      progress: Math.round((completedTasks / totalTasks) * 100),
      totalTasks,
      completedTasks,
      overdueTasks,
      activeProfessionals
    };
  };

  const renderOverviewTab = () => {
    const stats = getTransactionStats();
    
    return (
      <div className="space-y-6">
        {/* Progress Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Transaction Progress</h3>
              <p className="text-blue-100">
                {stats.completedTasks} of {stats.totalTasks} tasks completed
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.progress}%</div>
              <div className="text-sm text-blue-100">Complete</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Professionals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeProfessionals}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks - stats.completedTasks}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdueTasks}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <MessageSquare className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white border rounded-lg">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' :
                    task.status === 'overdue' ? 'bg-red-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      Assigned to {professionals.find(p => p.id === task.assignedTo[0])?.name || 'Unknown'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Professional Team */}
        <div className="bg-white border rounded-lg">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Your Professional Team</h3>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {professionals.slice(0, 4).map((professional) => (
                <div key={professional.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <User size={20} className="text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{professional.name}</h4>
                    <p className="text-sm text-gray-600">{professional.firm}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{professional.rating}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(professional.status)}`}>
                    {professional.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProfessionalsTab = () => (
    <div className="space-y-6">
      {/* Header with Search and Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search professionals..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            {professionalTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowProfessionalModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Professional
        </button>
      </div>

      {/* Professionals Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfessionals.map((professional) => (
          <div
            key={professional.id}
            className="bg-white border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedProfessional(professional.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{professional.name}</h3>
                  <p className="text-gray-600 text-sm">{professional.firm}</p>
                </div>
              </div>
              {professional.verified && (
                <CheckCircle size={20} className="text-green-600" />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900 capitalize">
                  {professional.type.replace('_', ' ')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-gray-900">
                    {professional.rating} ({professional.reviewCount})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Experience:</span>
                <span className="text-sm font-medium text-gray-900">
                  {professional.portfolio.yearsExperience} years
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(professional.status)}`}>
                  {professional.status}
                </span>
              </div>

              {professional.fees.fixedFee && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Fee:</span>
                  <span className="text-sm font-medium text-gray-900">
                    €{professional.fees.fixedFee}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                  <MessageSquare size={14} />
                  Message
                </button>
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <Plus size={14} />
                  Assign Task
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTasksTab = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <button
          onClick={() => setShowTaskModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Task
        </button>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border rounded-lg p-6 hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {professionals.find(p => p.id === task.assignedTo[0])?.name || 'Unassigned'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    Due {task.dueDate.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {task.estimatedDuration} min
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:text-blue-600">
                  <Edit size={16} />
                </button>
                <button className="p-2 text-gray-600 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {task.dependencies.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-orange-600 mb-3">
                <AlertCircle size={14} />
                <span>Depends on {task.dependencies.length} other task(s)</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t">
              <div className="text-sm text-gray-500">
                Created {task.createdAt.toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                {task.status !== 'completed' && (
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700">
                    Mark Complete
                  </button>
                )}
                <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Users className="text-white" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Professional Coordination Hub</h2>
            <p className="text-gray-600 text-sm">Manage all professionals involved in your property transaction</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-purple-600 text-purple-600 bg-purple-50'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-medium">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'professionals' && renderProfessionalsTab()}
        {activeTab === 'tasks' && renderTasksTab()}
        {activeTab === 'timeline' && (
          <div className="text-center py-12">
            <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Transaction Timeline</h3>
            <p className="text-gray-600">Visual timeline coming soon</p>
          </div>
        )}
        {activeTab === 'communications' && (
          <div className="text-center py-12">
            <MessageSquare size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Communications</h3>
            <p className="text-gray-600">Integrated messaging system coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}