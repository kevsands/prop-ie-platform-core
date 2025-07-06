'use client';

import React, { useState, useMemo } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Download,
  Upload,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  User,
  Building,
  Award,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Mail,
  Bell
} from 'lucide-react';

interface ComplianceItem {
  id: string;
  type: 'certification' | 'insurance' | 'license' | 'training';
  title: string;
  description: string;
  assignee: string;
  company: string;
  status: 'valid' | 'expiring' | 'expired' | 'pending';
  issueDate: string;
  expiryDate: string;
  renewalRequired: boolean;
  documentUrl?: string;
  issuingAuthority: string;
  category: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  autoRenewal: boolean;
  cost?: number;
  notes?: string;
}

export default function CompliancePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('expiry');

  // Mock compliance data - in production this would come from the API
  const complianceItems: ComplianceItem[] = useMemo(() => [
    {
      id: '1',
      type: 'certification',
      title: 'CIF Membership',
      description: 'Construction Industry Federation Membership',
      assignee: 'Michael Murphy',
      company: 'Murphy Construction Ltd',
      status: 'valid',
      issueDate: '2024-01-15',
      expiryDate: '2025-01-15',
      renewalRequired: true,
      issuingAuthority: 'Construction Industry Federation',
      category: 'Professional Membership',
      criticality: 'high',
      autoRenewal: true,
      cost: 850,
      notes: 'Annual renewal required'
    },
    {
      id: '2',
      type: 'insurance',
      title: 'Public Liability Insurance',
      description: 'Comprehensive public liability coverage',
      assignee: 'Sarah O\'Brien',
      company: 'Elite Electrical Services',
      status: 'expiring',
      issueDate: '2024-08-15',
      expiryDate: '2024-08-15',
      renewalRequired: true,
      issuingAuthority: 'AXA Insurance',
      category: 'Insurance',
      criticality: 'critical',
      autoRenewal: false,
      cost: 2400,
      notes: 'Expires in 2 months - renewal required'
    },
    {
      id: '3',
      type: 'license',
      title: 'RECI Electrical License',
      description: 'Register of Electrical Contractors of Ireland',
      assignee: 'Sarah O\'Brien',
      company: 'Elite Electrical Services',
      status: 'valid',
      issueDate: '2023-06-01',
      expiryDate: '2026-06-01',
      renewalRequired: false,
      issuingAuthority: 'RECI',
      category: 'Professional License',
      criticality: 'critical',
      autoRenewal: false,
      cost: 150
    },
    {
      id: '4',
      type: 'training',
      title: 'SafePass Training',
      description: 'Construction safety awareness training',
      assignee: 'James Kelly',
      company: 'Kelly Plumbing & Heating',
      status: 'expired',
      issueDate: '2020-03-10',
      expiryDate: '2024-03-10',
      renewalRequired: true,
      issuingAuthority: 'SOLAS',
      category: 'Safety Training',
      criticality: 'high',
      autoRenewal: false,
      cost: 120,
      notes: 'Renewal overdue - training required'
    },
    {
      id: '5',
      type: 'certification',
      title: 'RIAI Membership',
      description: 'Royal Institute of the Architects of Ireland',
      assignee: 'David Lynch',
      company: 'Lynch Architectural Services',
      status: 'valid',
      issueDate: '2023-01-01',
      expiryDate: '2025-12-31',
      renewalRequired: true,
      issuingAuthority: 'RIAI',
      category: 'Professional Membership',
      criticality: 'critical',
      autoRenewal: true,
      cost: 600
    },
    {
      id: '6',
      type: 'insurance',
      title: 'Professional Indemnity',
      description: 'Professional indemnity insurance coverage',
      assignee: 'David Lynch',
      company: 'Lynch Architectural Services',
      status: 'valid',
      issueDate: '2024-01-01',
      expiryDate: '2025-01-01',
      renewalRequired: true,
      issuingAuthority: 'FBD Insurance',
      category: 'Insurance',
      criticality: 'critical',
      autoRenewal: true,
      cost: 1800
    },
    {
      id: '7',
      type: 'certification',
      title: 'Horticulture Certification',
      description: 'Professional landscaping certification',
      assignee: 'Emma Thompson',
      company: 'Thompson Landscaping',
      status: 'pending',
      issueDate: '2024-05-01',
      expiryDate: '2027-05-01',
      renewalRequired: false,
      issuingAuthority: 'Irish Institute of Horticulture',
      category: 'Professional Certification',
      criticality: 'medium',
      autoRenewal: false,
      cost: 300,
      notes: 'Application submitted, awaiting approval'
    }
  ], []);

  const categories = [
    'all',
    'Professional Membership',
    'Professional License',
    'Professional Certification',
    'Insurance',
    'Safety Training'
  ];

  const statuses = [
    'all',
    'valid',
    'expiring',
    'expired',
    'pending'
  ];

  const filteredItems = useMemo(() => {
    return complianceItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'expiry':
          return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
        case 'criticality':
          const criticalityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return criticalityOrder[b.criticality] - criticalityOrder[a.criticality];
        case 'status':
          const statusOrder = { expired: 4, expiring: 3, pending: 2, valid: 1 };
          return statusOrder[b.status] - statusOrder[a.status];
        default:
          return 0;
      }
    });
  }, [complianceItems, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-100 text-green-800';
      case 'expiring':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certification':
        return Award;
      case 'insurance':
        return Shield;
      case 'license':
        return FileText;
      case 'training':
        return User;
      default:
        return FileText;
    }
  };

  const complianceStats = useMemo(() => {
    const total = complianceItems.length;
    const valid = complianceItems.filter(item => item.status === 'valid').length;
    const expiring = complianceItems.filter(item => item.status === 'expiring').length;
    const expired = complianceItems.filter(item => item.status === 'expired').length;
    const pending = complianceItems.filter(item => item.status === 'pending').length;
    
    return { total, valid, expiring, expired, pending };
  }, [complianceItems]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE');
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Compliance Tracking</h1>
            <p className="text-orange-100 text-lg">
              Monitor certifications, licenses, and insurance across all team members
            </p>
            <div className="flex items-center mt-4 space-x-6">
              <div className="flex items-center">
                <CheckCircle className="mr-2" size={20} />
                <span className="font-medium">{complianceStats.valid} Valid</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={20} />
                <span className="font-medium">{complianceStats.expiring} Expiring</span>
              </div>
              <div className="flex items-center">
                <AlertTriangle className="mr-2" size={20} />
                <span className="font-medium">{complianceStats.expired} Expired</span>
              </div>
            </div>
          </div>
          <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors flex items-center">
            <Plus className="mr-2" size={20} />
            Add Compliance Item
          </button>
        </div>
      </div>

      {/* Compliance Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Valid</p>
              <p className="text-2xl font-bold text-green-600">{complianceStats.valid}</p>
            </div>
            <CheckCircle className="text-green-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expiring Soon</p>
              <p className="text-2xl font-bold text-yellow-600">{complianceStats.expiring}</p>
            </div>
            <Clock className="text-yellow-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Expired</p>
              <p className="text-2xl font-bold text-red-600">{complianceStats.expired}</p>
            </div>
            <AlertTriangle className="text-red-500" size={32} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-blue-600">{complianceStats.pending}</p>
            </div>
            <RefreshCw className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search compliance items, assignees, or companies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {statuses.map(status => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="expiry">Sort by Expiry</option>
            <option value="criticality">Sort by Criticality</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Compliance Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Compliance Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {filteredItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            const daysUntilExpiry = getDaysUntilExpiry(item.expiryDate);
            
            return (
              <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg bg-gray-100 ${getCriticalityColor(item.criticality)}`}>
                      <TypeIcon size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        <span className={`text-xs font-medium ${getCriticalityColor(item.criticality)}`}>
                          {item.criticality.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{item.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Assignee:</span>
                          <p className="font-medium">{item.assignee}</p>
                          <p className="text-gray-500">{item.company}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Issue Date:</span>
                          <p className="font-medium">{formatDate(item.issueDate)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiry Date:</span>
                          <p className="font-medium">{formatDate(item.expiryDate)}</p>
                          {item.status === 'expiring' && daysUntilExpiry > 0 && (
                            <p className="text-yellow-600 text-xs">({daysUntilExpiry} days left)</p>
                          )}
                          {item.status === 'expired' && (
                            <p className="text-red-600 text-xs">(Expired {Math.abs(daysUntilExpiry)} days ago)</p>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">Authority:</span>
                          <p className="font-medium">{item.issuingAuthority}</p>
                          {item.cost && (
                            <p className="text-gray-500 text-xs">€{item.cost}</p>
                          )}
                        </div>
                      </div>
                      {item.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                          <p className="text-sm text-yellow-800">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
                      <Eye size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors">
                      <Bell size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredItems.length} of {complianceItems.length} compliance items
          </p>
          <div className="flex space-x-2">
            <button className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center">
              <Upload className="mr-2" size={16} />
              Import
            </button>
            <button className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors flex items-center">
              <Download className="mr-2" size={16} />
              Export
            </button>
            <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center">
              <Bell className="mr-2" size={16} />
              Send Reminders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}