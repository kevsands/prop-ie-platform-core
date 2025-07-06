'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit3,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  Euro,
  Calendar,
  Building2,
  User,
  Loader2,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { useInvoices, useInvoiceSummary, Invoice } from '@/hooks/useInvoices';
import InvoiceCreateModal from '@/components/developer/InvoiceCreateModal';
import InvoiceDetailModal from '@/components/developer/InvoiceDetailModal';
import InvoiceTemplateModal from '@/components/developer/InvoiceTemplateModal';
import InvoicePDFPreview from '@/components/developer/InvoicePDFPreview';
import ExternalInvoiceIntegration from '@/components/developer/ExternalInvoiceIntegration';

/**
 * Enterprise Invoices Management Dashboard
 * 
 * Comprehensive invoice management system for PROP.ie developers
 * providing complete visibility and control over all financial invoicing.
 * 
 * Features:
 * - Invoice creation, tracking, and management
 * - Multi-project invoice organization
 * - Payment status monitoring and automation
 * - Vendor and client invoice segregation
 * - Integration with financial control systems
 * - Automated payment reminders and collections
 */

export default function DeveloperInvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [showExternalTab, setShowExternalTab] = useState(false);
  const [externalInvoiceData, setExternalInvoiceData] = useState<any>(null);

  // Use real data from the API
  const { 
    invoices, 
    loading, 
    error, 
    pagination,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    recordPayment,
    refetch 
  } = useInvoices({
    status: statusFilter,
    type: typeFilter,
    search: searchTerm,
    page: currentPage,
    limit: 10
  });

  const { summary, loading: summaryLoading } = useInvoiceSummary();

  const handleCreateInvoice = async (invoiceData: any) => {
    try {
      await createInvoice(invoiceData);
      setShowCreateModal(false);
      setExternalInvoiceData(null);
      refetch(); // Refresh the list
    } catch (error) {
      throw error; // Let the modal handle the error
    }
  };

  const handleAddExternalInvoice = (invoiceData: any) => {
    setExternalInvoiceData(invoiceData);
    setShowCreateModal(true);
    setShowExternalTab(false);
  };

  const handleViewInvoice = async (invoice: Invoice) => {
    try {
      // Fetch full invoice details
      const fullInvoice = await getInvoice(invoice.id);
      setSelectedInvoice(fullInvoice);
      setShowDetailModal(true);
    } catch (error) {
      alert('Failed to load invoice details');
    }
  };

  const handleUpdateInvoice = async (id: string, data: Partial<Invoice>) => {
    try {
      await updateInvoice(id, data);
      refetch(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  const handleRecordPayment = async (invoiceId: string, paymentData: any) => {
    try {
      await recordPayment(invoiceId, paymentData);
      refetch(); // Refresh the list
    } catch (error) {
      throw error;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid': return 'text-green-700 bg-green-50 border-green-200';
      case 'sent': return 'text-blue-700 bg-blue-50 border-blue-200';
      case 'overdue': return 'text-red-700 bg-red-50 border-red-200';
      case 'draft': return 'text-gray-700 bg-gray-50 border-gray-200';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-200';
      case 'partially_paid': return 'text-orange-700 bg-orange-50 border-orange-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'paid': return <CheckCircle size={16} />;
      case 'sent': return <Clock size={16} />;
      case 'overdue': return <AlertCircle size={16} />;
      case 'draft': return <Edit3 size={16} />;
      case 'cancelled': return <Trash2 size={16} />;
      case 'partially_paid': return <Clock size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice(id);
      } catch (err) {
        alert('Failed to delete invoice');
      }
    }
  };

  const handleSelectInvoice = (invoiceId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvoices(prev => [...prev, invoiceId]);
    } else {
      setSelectedInvoices(prev => prev.filter(id => id !== invoiceId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedInvoices(invoices.map(inv => inv.id));
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedInvoices.length === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}?`)) {
      return;
    }

    setBulkActionLoading(true);
    try {
      await Promise.all(selectedInvoices.map(id => deleteInvoice(id)));
      setSelectedInvoices([]);
      alert(`Successfully deleted ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}`);
    } catch (err) {
      alert('Failed to delete some invoices');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    if (selectedInvoices.length === 0) return;

    setBulkActionLoading(true);
    try {
      await Promise.all(selectedInvoices.map(id => updateInvoice(id, { status: newStatus as any })));
      setSelectedInvoices([]);
      alert(`Successfully updated ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''} to ${newStatus}`);
    } catch (err) {
      alert('Failed to update some invoices');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkExport = async () => {
    if (selectedInvoices.length === 0) return;

    setBulkActionLoading(true);
    try {
      // Get selected invoices data
      const selectedInvoicesData = invoices.filter(inv => selectedInvoices.includes(inv.id));
      
      // Create CSV content
      const csvHeader = 'Invoice Number,Client Name,Project,Amount,Status,Issue Date,Due Date,Type\n';
      const csvRows = selectedInvoicesData.map(inv => 
        `"${inv.number}","${inv.clientName}","${inv.project?.name || inv.development?.name || 'No Project'}","€${inv.totalAmount.toLocaleString()}","${inv.status}","${new Date(inv.issueDate).toLocaleDateString()}","${new Date(inv.dueDate).toLocaleDateString()}","${inv.type}"`
      ).join('\n');
      
      const csvContent = csvHeader + csvRows;
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `invoices_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSelectedInvoices([]);
      alert(`Successfully exported ${selectedInvoices.length} invoice${selectedInvoices.length > 1 ? 's' : ''}`);
    } catch (err) {
      alert('Failed to export invoices');
    } finally {
      setBulkActionLoading(false);
    }
  };

  if (loading && !invoices.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={refetch}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} />
                Invoice Management
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive financial invoice tracking across all developments and operations
              </p>
              
              {/* Tab Navigation */}
              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => setShowExternalTab(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !showExternalTab 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  All Invoices
                </button>
                <button
                  onClick={() => setShowExternalTab(true)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    showExternalTab 
                      ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  External Teams
                </button>
              </div>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowTemplateModal(true)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <FileText size={18} className="mr-2" />
                Templates
              </button>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus size={18} className="mr-2" />
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {showExternalTab ? (
          /* External Invoice Management */
          <ExternalInvoiceIntegration onAddExternalInvoice={handleAddExternalInvoice} />
        ) : (
          <>
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receivables</p>
                {summaryLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-green-600">
                    €{summary?.overview.totalReceivables.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Euro className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Payables</p>
                {summaryLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-red-600">
                    €{summary?.overview.totalPayables.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Euro className="text-red-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Amount</p>
                {summaryLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-orange-600">
                    €{summary?.overview.totalOverdue.toLocaleString() || '0'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                {summaryLoading ? (
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <p className="text-2xl font-bold text-blue-600">
                    {summary?.overview.totalInvoices || 0}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search invoices..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="receivable">Receivables</option>
              <option value="payable">Payables</option>
            </select>

            <button 
              onClick={handleBulkExport}
              disabled={selectedInvoices.length === 0}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={18} className="mr-2" />
              Export{selectedInvoices.length > 0 ? ` (${selectedInvoices.length})` : ''}
            </button>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedInvoices.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-blue-700 font-medium">
                  {selectedInvoices.length} invoice{selectedInvoices.length > 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => setSelectedInvoices([])}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Clear selection
                </button>
              </div>
              
              <div className="flex items-center space-x-2">
                {bulkActionLoading && <Loader2 className="animate-spin" size={16} />}
                
                <div className="relative">
                  <button
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
                    disabled={bulkActionLoading}
                  >
                    <MoreVertical size={16} className="mr-1" />
                    Actions
                  </button>
                  
                  {showBulkActions && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                      <div className="py-1">
                        <button
                          onClick={() => {
                            handleBulkStatusUpdate('SENT');
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                        >
                          <Clock size={16} className="mr-2 text-blue-500" />
                          Mark as Sent
                        </button>
                        <button
                          onClick={() => {
                            handleBulkStatusUpdate('PAID');
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                        >
                          <CheckCircle size={16} className="mr-2 text-green-500" />
                          Mark as Paid
                        </button>
                        <button
                          onClick={() => {
                            handleBulkStatusUpdate('CANCELLED');
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                        >
                          <X size={16} className="mr-2 text-gray-500" />
                          Mark as Cancelled
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            handleBulkExport();
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center"
                        >
                          <Download size={16} className="mr-2 text-blue-500" />
                          Export Selected
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            handleBulkDelete();
                            setShowBulkActions(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center text-red-600"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete Selected
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 w-12">
                    <input
                      type="checkbox"
                      checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Invoice #</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Client/Vendor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Project</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Due Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading && !invoices.length ? (
                  // Loading skeleton
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-4 px-6">
                        <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                        <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-6 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="h-5 bg-gray-200 rounded-full animate-pulse"></div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-6 w-6 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : invoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-500">
                      <FileText className="mx-auto mb-4" size={48} />
                      <p className="text-lg font-medium">No invoices found</p>
                      <p>Create your first invoice to get started</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr key={invoice.id} className={`border-b hover:bg-gray-50 ${
                      selectedInvoices.includes(invoice.id) ? 'bg-blue-50' : ''
                    }`}>
                      <td className="py-4 px-6">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onChange={(e) => handleSelectInvoice(invoice.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900">{invoice.number}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <User className="mr-2 text-gray-400" size={16} />
                          <div>
                            <div className="font-medium text-gray-900">{invoice.clientName}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {invoice.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Building2 className="mr-2 text-blue-400" size={16} />
                          <span className="text-gray-900">
                            {invoice.project?.name || invoice.development?.name || 'No Project'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`font-semibold ${
                          invoice.type === 'RECEIVABLE' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          €{invoice.totalAmount.toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1 capitalize">{invoice.status.toLowerCase().replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <Calendar className="mr-2 text-gray-400" size={16} />
                          <span className="text-gray-900">
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.type === 'RECEIVABLE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {invoice.type === 'RECEIVABLE' ? 'Receivable' : 'Payable'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewInvoice(invoice)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} className="text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                            <Edit3 size={16} className="text-gray-500" />
                          </button>
                          <button 
                            onClick={() => {
                              setPreviewInvoice(invoice);
                              setShowPDFPreview(true);
                            }}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            title="Preview PDF"
                          >
                            <Download size={16} className="text-gray-500" />
                          </button>
                          <button 
                            onClick={() => handleDelete(invoice.id)}
                            className="p-1 hover:bg-red-100 rounded transition-colors"
                            title="Delete Invoice"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-4 border-t flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = Math.max(1, Math.min(pagination.pages - 4, currentPage - 2)) + i;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 border rounded-lg text-sm font-medium ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 bg-white hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                  disabled={currentPage === pagination.pages}
                  className="px-3 py-2 border rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Template Modal */}
        <InvoiceTemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={(template) => {
            // Pre-populate create modal with template data
            setSelectedTemplate(template);
            setShowCreateModal(true);
            setShowTemplateModal(false);
          }}
        />

        {/* Create Invoice Modal */}
        <InvoiceCreateModal
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate(null);
            setExternalInvoiceData(null);
          }}
          onSave={handleCreateInvoice}
          templateData={selectedTemplate || externalInvoiceData}
        />

        {/* Invoice Detail Modal */}
        <InvoiceDetailModal
          invoice={selectedInvoice}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onUpdate={handleUpdateInvoice}
          onDelete={async (id: string) => {
            await deleteInvoice(id);
            setShowDetailModal(false);
            setSelectedInvoice(null);
          }}
          onRecordPayment={handleRecordPayment}
        />

        {/* PDF Preview Modal */}
        <InvoicePDFPreview
          invoice={previewInvoice!}
          isOpen={showPDFPreview}
          onClose={() => {
            setShowPDFPreview(false);
            setPreviewInvoice(null);
          }}
        />
          </>
        )}
      </div>
    </div>
  );
}