'use client';

import React, { useState } from 'react';
import { 
  Calculator, 
  BarChart3,
  Plus, 
  Search, 
  Filter,
  Save,
  Upload,
  Download,
  RefreshCw,
  Building2,
  DollarSign,
  TrendingUp,
  FileText,
  PieChart,
  LineChart,
  Eye,
  Edit3,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Settings,
  Share2,
  Archive
} from 'lucide-react';
import DynamicBillOfQuantitiesBuilder from './DynamicBillOfQuantitiesBuilder';
import DynamicFinancialTracker from './DynamicFinancialTracker';

// Dynamic document types available
const DYNAMIC_DOCUMENT_TYPES = {
  bill_of_quantities: {
    name: 'Bill of Quantities',
    description: 'Interactive BOQ with real-time calculations and cost tracking',
    icon: <Calculator className="w-5 h-5" />,
    color: 'green',
    complexity: 'High',
    features: ['Real-time calculations', 'Category management', 'Irish construction standards', 'Export capabilities']
  },
  financial_tracker: {
    name: 'Financial Tracker',
    description: 'Dynamic financial monitoring with analytics and cash flow tracking',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'blue',
    complexity: 'High',
    features: ['Real-time analytics', 'Multi-currency support', 'Performance metrics', 'Visual dashboards']
  },
  profit_loss_tracker: {
    name: 'Profit & Loss Tracker',
    description: 'Dynamic P&L statements with automated calculations',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'purple',
    complexity: 'Medium',
    features: ['Automated P&L', 'Monthly/quarterly reports', 'Variance analysis', 'Trend monitoring']
  },
  invoice_statement: {
    name: 'Invoice Statement Generator',
    description: 'Dynamic invoice generation with payment tracking',
    icon: <FileText className="w-5 h-5" />,
    color: 'amber',
    complexity: 'Medium',
    features: ['Template generation', 'Payment tracking', 'Irish VAT compliance', 'Client management']
  }
};

// Sample existing documents for demonstration
const SAMPLE_DOCUMENTS = [
  {
    id: 'boq-fitzgerald-gardens',
    type: 'bill_of_quantities',
    title: 'Fitzgerald Gardens - Main Contract BOQ',
    projectName: 'Fitzgerald Gardens',
    lastModified: '2025-07-01T10:30:00Z',
    status: 'active',
    totalValue: 5200000,
    currency: 'EUR',
    itemCount: 156,
    categories: 8,
    completion: 68
  },
  {
    id: 'financial-ballymakenny',
    type: 'financial_tracker',
    title: 'Ballymakenny View Financial Tracker',
    projectName: 'Ballymakenny View',
    lastModified: '2025-06-30T15:45:00Z',
    status: 'active',
    totalValue: 7600000,
    currency: 'EUR',
    entriesCount: 89,
    profitMargin: 22.5,
    completion: 95
  },
  {
    id: 'boq-ellwood-final',
    type: 'bill_of_quantities',
    title: 'Ellwood Development - Final BOQ',
    projectName: 'Ellwood',
    lastModified: '2025-06-15T09:15:00Z',
    status: 'completed',
    totalValue: 18500000,
    currency: 'EUR',
    itemCount: 234,
    categories: 12,
    completion: 100
  }
];

interface DynamicDocumentManagerProps {
  onSave?: (documentData: any) => void;
  projectId?: string;
}

export default function DynamicDocumentManager({
  onSave,
  projectId
}: DynamicDocumentManagerProps) {
  const [activeView, setActiveView] = useState<'overview' | 'create' | 'edit'>('overview');
  const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [documents, setDocuments] = useState(SAMPLE_DOCUMENTS);
  const [editingDocument, setEditingDocument] = useState<any>(null);

  const handleCreateDocument = (type: string) => {
    setSelectedDocumentType(type);
    setActiveView('create');
  };

  const handleEditDocument = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    setEditingDocument(document);
    setSelectedDocumentType(document?.type || '');
    setActiveView('edit');
  };

  const handleSaveDocument = (documentData: any) => {
    console.log('Saving document:', documentData);
    
    // Update documents list
    if (editingDocument) {
      setDocuments(prev => prev.map(doc => 
        doc.id === editingDocument.id 
          ? { ...doc, ...documentData, lastModified: new Date().toISOString() }
          : doc
      ));
    } else {
      const newDocument = {
        id: `doc-${Date.now()}`,
        type: selectedDocumentType,
        title: documentData.boqTitle || documentData.trackerTitle || 'New Document',
        projectName: documentData.projectName || 'Untitled Project',
        lastModified: new Date().toISOString(),
        status: 'active',
        totalValue: documentData.totals?.grandTotal || documentData.financialSummary?.netProfit || 0,
        currency: documentData.currency || documentData.baseCurrency || 'EUR',
        itemCount: documentData.itemCount || documentData.entryCount || 0,
        ...documentData
      };
      setDocuments(prev => [...prev, newDocument]);
    }

    if (onSave) {
      onSave(documentData);
    }

    // Return to overview
    setActiveView('overview');
    setEditingDocument(null);
  };

  const handleCancelEdit = () => {
    setActiveView('overview');
    setEditingDocument(null);
    setSelectedDocumentType('');
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('en-IE', {
      style: 'currency',
      currency
    }).format(amount);
  };

  const getDocumentTypeInfo = (type: string) => {
    return DYNAMIC_DOCUMENT_TYPES[type] || {
      name: 'Unknown Type',
      icon: <FileText className="w-5 h-5" />,
      color: 'gray'
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (activeView === 'create' || activeView === 'edit') {
    if (selectedDocumentType === 'bill_of_quantities') {
      return (
        <DynamicBillOfQuantitiesBuilder
          onSave={handleSaveDocument}
          onCancel={handleCancelEdit}
          projectId={projectId}
          existingBOQ={editingDocument}
        />
      );
    } else if (selectedDocumentType === 'financial_tracker') {
      return (
        <DynamicFinancialTracker
          onSave={handleSaveDocument}
          onCancel={handleCancelEdit}
          projectId={projectId}
          existingTracker={editingDocument}
        />
      );
    }
  }

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dynamic Document System</h1>
                <p className="text-gray-600">Interactive financial documents with real-time calculations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  Create Dynamic Document
                </button>
                <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 w-72">
                  {Object.entries(DYNAMIC_DOCUMENT_TYPES).map(([key, docType]) => (
                    <button
                      key={key}
                      onClick={() => handleCreateDocument(key)}
                      className="flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 w-full transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${docType.color}-100`}>
                        {docType.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{docType.name}</div>
                        <div className="text-sm text-gray-600">{docType.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Search and Filters */}
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
            
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Document Types Overview */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Document Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(DYNAMIC_DOCUMENT_TYPES).map(([key, docType]) => (
              <div key={key} className={`bg-${docType.color}-50 border border-${docType.color}-200 rounded-xl p-6 cursor-pointer hover:shadow-md transition-shadow`}
                   onClick={() => handleCreateDocument(key)}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-${docType.color}-100 rounded-lg flex items-center justify-center`}>
                    {docType.icon}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${docType.color}-100 text-${docType.color}-800`}>
                    {docType.complexity}
                  </span>
                </div>
                
                <h4 className={`font-semibold text-${docType.color}-900 mb-2`}>{docType.name}</h4>
                <p className={`text-sm text-${docType.color}-700 mb-3`}>{docType.description}</p>
                
                <div className="space-y-1">
                  {docType.features.map((feature, index) => (
                    <div key={index} className={`text-xs text-${docType.color}-600 flex items-center gap-1`}>
                      <CheckCircle className="w-3 h-3" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Existing Documents */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dynamic Documents</h3>
            <span className="text-sm text-gray-600">{filteredDocuments.length} documents</span>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {filteredDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h4 className="font-medium text-gray-900 mb-2">No Dynamic Documents Found</h4>
                <p className="text-gray-600 mb-4">Create your first dynamic document to get started with real-time financial tracking.</p>
                <button
                  onClick={() => handleCreateDocument('bill_of_quantities')}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create Bill of Quantities
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Document</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Project</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Value</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-900">Last Modified</th>
                      <th className="px-6 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc, index) => {
                      const docType = getDocumentTypeInfo(doc.type);
                      return (
                        <tr key={doc.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 bg-${docType.color}-100 rounded-lg flex items-center justify-center`}>
                                {docType.icon}
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{doc.title}</div>
                                <div className="text-sm text-gray-600">
                                  {doc.itemCount || doc.entriesCount || 0} items
                                  {doc.categories && ` • ${doc.categories} categories`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-gray-900">{docType.name}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{doc.projectName}</div>
                            {doc.completion && (
                              <div className="text-xs text-gray-600">{doc.completion}% complete</div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(doc.totalValue, doc.currency)}
                            </div>
                            {doc.profitMargin && (
                              <div className="text-xs text-green-600">
                                {doc.profitMargin}% margin
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(doc.lastModified).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditDocument(doc.id)}
                                className="text-indigo-600 hover:text-indigo-800"
                                title="Edit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                className="text-blue-600 hover:text-blue-800"
                                title="View"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                className="text-green-600 hover:text-green-800"
                                title="Download"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}