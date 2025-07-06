'use client';

import React, { useState } from 'react';
import { 
  Receipt, 
  Plus, 
  Filter, 
  Search, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  X, 
  Calendar, 
  DollarSign, 
  FileText, 
  Building, 
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ClipboardList,
  Euro,
  CreditCard,
  TrendingUp,
  Users,
  Calculator
} from 'lucide-react';

interface Invoice {
  id: string;
  invoiceNumber: string;
  provider: string;
  providerEmail: string;
  providerPhone?: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'approved' | 'overdue' | 'draft';
  type: string;
  description: string;
  category: 'design' | 'construction' | 'legal' | 'consulting' | 'materials' | 'other';
  vatAmount?: number;
  netAmount: number;
  attachments?: string[];
  approvedBy?: string;
  approvedDate?: string;
  paymentMethod?: string;
  notes?: string;
}

interface FeeProposal {
  id: string;
  title: string;
  provider: string;
  totalAmount: number;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  submittedDate: string;
  reviewDate?: string;
  description: string;
  breakdownItems: {
    description: string;
    quantity: number;
    rate: number;
    total: number;
  }[];
  terms: string;
  validUntil: string;
}

interface ProfessionalAppointment {
  id: string;
  professional: string;
  company: string;
  role: string;
  appointmentType: 'architect' | 'engineer' | 'solicitor' | 'consultant' | 'surveyor';
  appointmentDate: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  fee: number;
  description: string;
  duration: number; // in hours
  location: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  followUpRequired?: boolean;
}

interface InvoiceManagementProps {
  projectName: string;
  initialInvoices?: Invoice[];
  initialProposals?: FeeProposal[];
  initialAppointments?: ProfessionalAppointment[];
}

export default function InvoiceManagement({ 
  projectName, 
  initialInvoices = [], 
  initialProposals = [], 
  initialAppointments = [] 
}: InvoiceManagementProps) {
  const [activeTab, setActiveTab] = useState<'invoices' | 'proposals' | 'appointments'>('invoices');
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [proposals, setProposals] = useState<FeeProposal[]>(initialProposals);
  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const statusColors = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-blue-100 text-blue-800',
    overdue: 'bg-red-100 text-red-800',
    draft: 'bg-gray-100 text-gray-800',
    submitted: 'bg-blue-100 text-blue-800',
    under_review: 'bg-purple-100 text-purple-800',
    rejected: 'bg-red-100 text-red-800',
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-amber-100 text-amber-800'
  };

  const categoryColors = {
    design: 'bg-blue-100 text-blue-800',
    construction: 'bg-orange-100 text-orange-800',
    legal: 'bg-purple-100 text-purple-800',
    consulting: 'bg-green-100 text-green-800',
    materials: 'bg-yellow-100 text-yellow-800',
    other: 'bg-gray-100 text-gray-800'
  };

  const appointmentTypeColors = {
    architect: 'bg-blue-100 text-blue-800',
    engineer: 'bg-green-100 text-green-800',
    solicitor: 'bg-purple-100 text-purple-800',
    consultant: 'bg-amber-100 text-amber-800',
    surveyor: 'bg-indigo-100 text-indigo-800'
  };

  const getStats = () => {
    const invoiceStats = {
      total: invoices.reduce((sum, inv) => sum + inv.amount, 0),
      paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0),
      pending: invoices.filter(inv => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0),
      overdue: invoices.filter(inv => inv.status === 'overdue').length,
      count: invoices.length
    };

    const proposalStats = {
      total: proposals.reduce((sum, prop) => sum + prop.totalAmount, 0),
      approved: proposals.filter(prop => prop.status === 'approved').length,
      pending: proposals.filter(prop => prop.status === 'under_review').length,
      count: proposals.length
    };

    const appointmentStats = {
      scheduled: appointments.filter(app => app.status === 'scheduled').length,
      completed: appointments.filter(app => app.status === 'completed').length,
      totalFees: appointments.filter(app => app.status === 'completed').reduce((sum, app) => sum + app.fee, 0),
      count: appointments.length
    };

    return { invoiceStats, proposalStats, appointmentStats };
  };

  const stats = getStats();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || invoice.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         proposal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.professional.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         appointment.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const tabs = [
    { id: 'invoices', label: 'Invoice Management', icon: Receipt, count: invoices.length },
    { id: 'proposals', label: 'Fee Proposals', icon: FileText, count: proposals.length },
    { id: 'appointments', label: 'Professional Appointments', icon: Calendar, count: appointments.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Financial Management</h3>
          <p className="text-sm text-gray-600">{projectName} - Invoices, Fee Proposals & Professional Appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Report
          </button>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={16} />
            Create New
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Receipt size={20} className="text-blue-600" />
            <span className="font-medium text-blue-800">Total Invoices</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">€{stats.invoiceStats.total.toLocaleString()}</p>
          <p className="text-sm text-gray-600">{stats.invoiceStats.count} invoices</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium text-green-800">Paid</span>
          </div>
          <p className="text-2xl font-bold text-green-600">€{stats.invoiceStats.paid.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Completed payments</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={20} className="text-amber-600" />
            <span className="font-medium text-amber-800">Pending</span>
          </div>
          <p className="text-2xl font-bold text-amber-600">€{stats.invoiceStats.pending.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Awaiting payment</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={20} className="text-purple-600" />
            <span className="font-medium text-purple-800">Appointments</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.appointmentStats.scheduled}</p>
          <p className="text-sm text-gray-600">Scheduled meetings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            {activeTab === 'invoices' && (
              <>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="overdue">Overdue</option>
              </>
            )}
            {activeTab === 'proposals' && (
              <>
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </>
            )}
            {activeTab === 'appointments' && (
              <>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
              </>
            )}
          </select>
          {activeTab === 'invoices' && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="design">Design</option>
              <option value="construction">Construction</option>
              <option value="legal">Legal</option>
              <option value="consulting">Consulting</option>
              <option value="materials">Materials</option>
              <option value="other">Other</option>
            </select>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg border shadow-sm">
        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                        <div className="text-sm text-gray-500">{invoice.type}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{invoice.provider}</div>
                        <div className="text-sm text-gray-500">{invoice.providerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[invoice.category]}`}>
                        {invoice.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      €{invoice.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[invoice.status]}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Download size={16} />
                        </button>
                        <button className="text-green-600 hover:text-green-900">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'proposals' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProposals.map((proposal) => (
                <div key={proposal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{proposal.title}</h4>
                      <p className="text-sm text-gray-600">{proposal.provider}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[proposal.status]}`}>
                      {proposal.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Amount</span>
                      <span className="font-semibold text-gray-900">€{proposal.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Submitted</span>
                      <span className="text-sm text-gray-900">{new Date(proposal.submittedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Valid Until</span>
                      <span className="text-sm text-gray-900">{new Date(proposal.validUntil).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{proposal.description}</p>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                      Review
                    </button>
                    <button className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div className="p-6">
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.professional}</h4>
                        <p className="text-sm text-gray-600">{appointment.role} at {appointment.company}</p>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {appointment.duration}h
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {appointment.location}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[appointment.status]}`}>
                        {appointment.status}
                      </span>
                      <div className="mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${appointmentTypeColors[appointment.appointmentType]}`}>
                          {appointment.appointmentType}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{appointment.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {appointment.contactEmail}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={14} />
                        {appointment.contactPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-semibold text-gray-900">€{appointment.fee.toLocaleString()}</span>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          View Details
                        </button>
                        <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                          Reschedule
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty States */}
        {((activeTab === 'invoices' && filteredInvoices.length === 0) ||
          (activeTab === 'proposals' && filteredProposals.length === 0) ||
          (activeTab === 'appointments' && filteredAppointments.length === 0)) && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'invoices' && <Receipt size={24} className="text-gray-400" />}
              {activeTab === 'proposals' && <FileText size={24} className="text-gray-400" />}
              {activeTab === 'appointments' && <Calendar size={24} className="text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {activeTab} found
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by creating your first {activeTab.slice(0, -1)}.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create {activeTab.slice(0, -1)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}