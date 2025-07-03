'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building2,
  FileText as FileContract,
  ClipboardList,
  PoundSterling,
  Shield,
  Users,
  Calendar,
  Tag,
  BookOpen,
  Settings,
  Archive,
  Share2
} from 'lucide-react';

// Document template categories with Irish property development focus
const TEMPLATE_CATEGORIES = {
  rfp: {
    id: 'rfp',
    name: 'Request for Proposals',
    description: 'RFP templates for contractor, consultant, and supplier selection',
    icon: <ClipboardList className="w-5 h-5" />,
    color: 'blue',
    subcategories: [
      'Main Contractor RFP',
      'Subcontractor RFP', 
      'Professional Services RFP',
      'Supplier RFP',
      'Specialist Trade RFP'
    ]
  },
  quote: {
    id: 'quote',
    name: 'Quotes & Estimates',
    description: 'Quote templates and cost estimation documents',
    icon: <PoundSterling className="w-5 h-5" />,
    color: 'green',
    subcategories: [
      'Preliminary Cost Estimate',
      'Detailed Quote Request',
      'Material Supply Quote',
      'Service Provider Quote',
      'Variation Order Quote'
    ]
  },
  authorization: {
    id: 'authorization',
    name: 'Authorizations',
    description: 'Various authorization documents and permissions',
    icon: <Shield className="w-5 h-5" />,
    color: 'purple',
    subcategories: [
      'Planning Permission Application',
      'Building Control Application', 
      'Fire Safety Certificate',
      'Disability Access Certificate',
      'Environmental Authorizations'
    ]
  },
  legal_contract: {
    id: 'legal_contract',
    name: 'Legal Contracts',
    description: 'Sale contracts and legal agreements',
    icon: <FileContract className="w-5 h-5" />,
    color: 'red',
    subcategories: [
      'Contract for Sale of Houses',
      'Contract for Sale of Apartments',
      'Off-Plan Sale Contract',
      'Reservation Agreement',
      'Completion Agreement'
    ]
  },
  legal_agreement: {
    id: 'legal_agreement',
    name: 'Building Agreements',
    description: 'Construction and development agreements',
    icon: <Building2 className="w-5 h-5" />,
    color: 'amber',
    subcategories: [
      'Main Building Contract',
      'Subcontract Agreement',
      'Consultant Appointment',
      'Joint Venture Agreement',
      'Development Agreement'
    ]
  }
};

// Sample templates with Irish property development focus
const SAMPLE_TEMPLATES = [
  {
    id: '1',
    name: 'Main Contractor RFP - Residential Development',
    category: 'rfp',
    subcategory: 'Main Contractor RFP',
    description: 'Comprehensive RFP template for selecting main contractors for residential developments in Ireland',
    status: 'active',
    version: '2.1',
    lastUpdated: '2025-01-15',
    createdBy: 'System Administrator',
    usageCount: 45,
    fileSize: '2.4 MB',
    requiredFields: ['Project Details', 'Scope of Works', 'Timeline', 'Insurance Requirements', 'CIRI Registration'],
    estimatedCompletionTime: '30-45 minutes'
  },
  {
    id: '2', 
    name: 'Contract for Sale - New House',
    category: 'legal_contract',
    subcategory: 'Contract for Sale of Houses',
    description: 'Standard sale contract template compliant with Irish property law for new build houses',
    status: 'active',
    version: '1.8',
    lastUpdated: '2025-01-10',
    createdBy: 'Legal Team',
    usageCount: 127,
    fileSize: '1.8 MB',
    requiredFields: ['Vendor Details', 'Purchaser Details', 'Property Description', 'Purchase Price', 'Conditions'],
    estimatedCompletionTime: '20-30 minutes'
  },
  {
    id: '3',
    name: 'Planning Permission Application',
    category: 'authorization', 
    subcategory: 'Planning Permission Application',
    description: 'Complete planning application template for Irish local authorities',
    status: 'active',
    version: '3.0',
    lastUpdated: '2024-12-20',
    createdBy: 'Planning Consultant',
    usageCount: 23,
    fileSize: '3.1 MB',
    requiredFields: ['Site Details', 'Development Description', 'Supporting Documents', 'Public Notices'],
    estimatedCompletionTime: '60-90 minutes'
  },
  {
    id: '4',
    name: 'M&E Services Quote Request',
    category: 'quote',
    subcategory: 'Service Provider Quote',
    description: 'Detailed quote request template for mechanical and electrical services',
    status: 'active',
    version: '1.5',
    lastUpdated: '2025-01-05',
    createdBy: 'Project Manager',
    usageCount: 67,
    fileSize: '1.2 MB',
    requiredFields: ['Project Specifications', 'Service Requirements', 'Timeline', 'Quality Standards'],
    estimatedCompletionTime: '25-35 minutes'
  },
  {
    id: '5',
    name: 'RIAI Blue Form - Main Contract',
    category: 'legal_agreement',
    subcategory: 'Main Building Contract',
    description: 'Official RIAI Blue Form template for main building contracts',
    status: 'active',
    version: '2024.1',
    lastUpdated: '2024-11-30',
    createdBy: 'RIAI',
    usageCount: 89,
    fileSize: '2.8 MB',
    requiredFields: ['Contract Details', 'Scope of Works', 'Contract Sum', 'Time Provisions', 'Payment Terms'],
    estimatedCompletionTime: '45-60 minutes'
  }
];

interface EnterpriseDocumentTemplateManagerProps {
  projectId?: string;
  onTemplateSelect?: (template: any) => void;
  showCreateButton?: boolean;
  compactMode?: boolean;
}

export default function EnterpriseDocumentTemplateManager({
  projectId,
  onTemplateSelect,
  showCreateButton = true,
  compactMode = false
}: EnterpriseDocumentTemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('rfp');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [templates, setTemplates] = useState(SAMPLE_TEMPLATES);
  const [loading, setLoading] = useState(false);

  // Filter and sort templates
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.subcategory.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || template.status === filterStatus;
    
    return matchesCategory && matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.name.localeCompare(b.name);
      case 'usage': return b.usageCount - a.usageCount;
      case 'updated': return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      case 'category': return a.category.localeCompare(b.category);
      default: return 0;
    }
  });

  const getCategoryColor = (categoryId: string) => {
    const category = TEMPLATE_CATEGORIES[categoryId as keyof typeof TEMPLATE_CATEGORIES];
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800',
      green: 'bg-green-50 border-green-200 text-green-800', 
      purple: 'bg-purple-50 border-purple-200 text-purple-800',
      red: 'bg-red-50 border-red-200 text-red-800',
      amber: 'bg-amber-50 border-amber-200 text-amber-800'
    };
    return colors[category?.color as keyof typeof colors] || colors.blue;
  };

  const handleTemplateAction = (action: string, template: any) => {
    switch (action) {
      case 'use':
        if (onTemplateSelect) {
          onTemplateSelect(template);
        }
        break;
      case 'preview':
        // Open template preview modal
        console.log('Preview template:', template.id);
        break;
      case 'edit':
        // Open template editor
        console.log('Edit template:', template.id);
        break;
      case 'duplicate':
        // Duplicate template
        console.log('Duplicate template:', template.id);
        break;
      case 'delete':
        // Delete template with confirmation
        if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
          setTemplates(prev => prev.filter(t => t.id !== template.id));
        }
        break;
    }
  };

  const formatFileSize = (bytes: string) => {
    return bytes; // Already formatted in sample data
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${compactMode ? 'p-4' : 'p-6'}`}>
      {/* Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Enterprise Document Templates</h2>
            <p className="text-gray-600 mt-1">
              Professional templates for Irish property development projects
            </p>
          </div>
          {showCreateButton && (
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Import Template
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Create Template
              </button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search templates by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="usage">Sort by Usage</option>
              <option value="updated">Sort by Updated</option>
              <option value="category">Sort by Category</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-currentColor rounded-sm"></div>
                  <div className="bg-currentColor rounded-sm"></div>
                  <div className="bg-currentColor rounded-sm"></div>
                  <div className="bg-currentColor rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-400'}`}
              >
                <div className="w-4 h-4 flex flex-col gap-0.5">
                  <div className="bg-currentColor h-0.5 rounded"></div>
                  <div className="bg-currentColor h-0.5 rounded"></div>
                  <div className="bg-currentColor h-0.5 rounded"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            All Categories ({templates.length})
          </button>
          {Object.values(TEMPLATE_CATEGORIES).map(category => {
            const count = templates.filter(t => t.category === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.id
                    ? getCategoryColor(category.id)
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category.icon}
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Display */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading templates...</span>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms or filters.' : 'No templates available in this category.'}
          </p>
          {showCreateButton && (
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              Create First Template
            </button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              className={`border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 ${
                viewMode === 'list' ? 'p-4' : 'p-6'
              }`}
            >
              {viewMode === 'grid' ? (
                // Grid View
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]?.icon}
                      <div>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                          {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]?.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">v{template.version}</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Subcategory:</span>
                      <span className="font-medium">{template.subcategory}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Used:</span>
                      <span className="font-medium">{template.usageCount} times</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Est. Time:</span>
                      <span className="font-medium">{template.estimatedCompletionTime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Updated:</span>
                      <span className="font-medium">{formatDate(template.lastUpdated)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTemplateAction('use', template)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => handleTemplateAction('preview', template)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleTemplateAction('edit', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleTemplateAction('duplicate', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleTemplateAction('delete', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // List View
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center gap-2">
                      {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]?.icon}
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(template.category)}`}>
                        {TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES]?.name}
                      </span>
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.subcategory} • Used {template.usageCount} times • {template.estimatedCompletionTime}</p>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm text-gray-500">v{template.version}</div>
                      <div className="text-xs text-gray-400">{formatDate(template.lastUpdated)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleTemplateAction('use', template)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Use Template
                    </button>
                    <button
                      onClick={() => handleTemplateAction('preview', template)}
                      className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="relative group">
                      <button className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                        <button
                          onClick={() => handleTemplateAction('edit', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Edit className="w-3 h-3" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleTemplateAction('duplicate', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                        >
                          <Copy className="w-3 h-3" />
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleTemplateAction('delete', template)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {!compactMode && (
        <div className="mt-8 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{templates.length}</div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{templates.filter(t => t.status === 'active').length}</div>
              <div className="text-sm text-gray-600">Active Templates</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(TEMPLATE_CATEGORIES).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">{templates.reduce((sum, t) => sum + t.usageCount, 0)}</div>
              <div className="text-sm text-gray-600">Total Usage</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}