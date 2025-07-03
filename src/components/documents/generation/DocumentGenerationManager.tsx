'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Download,
  Eye,
  Settings,
  Loader,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  BarChart3,
  Filter,
  Search,
  Plus,
  RefreshCw,
  FileImage,
  Calendar,
  User,
  Tag,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  Grid
} from 'lucide-react';

// ================================================================================
// INTERFACES
// ================================================================================

interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  templateType: 'pdf' | 'word' | 'html' | 'excel';
  placeholders: TemplatePlaceholder[];
  previewImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TemplatePlaceholder {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'table' | 'list' | 'signature';
  required: boolean;
  defaultValue?: any;
  description?: string;
}

interface GenerationRequest {
  templateId: string;
  outputFormat: 'pdf' | 'word' | 'html' | 'excel';
  data: { [key: string]: any };
  options: GenerationOptions;
  projectId?: string;
  workflowId?: string;
}

interface GenerationOptions {
  watermark?: {
    text: string;
    opacity: number;
    position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  };
  password?: string;
  permissions?: {
    allowPrint: boolean;
    allowCopy: boolean;
    allowEdit: boolean;
    allowAnnotations: boolean;
  };
  compression?: boolean;
  quality?: 'low' | 'medium' | 'high';
  includeMetadata?: boolean;
}

interface GenerationResult {
  success: boolean;
  documentId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  generationTime: number;
  metadata: any;
}

interface GenerationAnalytics {
  totalGenerations: number;
  successfulGenerations: number;
  averageGenerationTime: number;
  formatDistribution: { [format: string]: number };
  recentGenerations: any[];
}

interface DocumentGenerationManagerProps {
  projectId?: string;
  workflowId?: string;
  onDocumentGenerated?: (result: GenerationResult) => void;
  showAnalytics?: boolean;
}

// ================================================================================
// MOCK DATA
// ================================================================================

const MOCK_TEMPLATES: DocumentTemplate[] = [
  {
    id: 'template_1',
    name: 'Property Purchase Agreement',
    category: 'Legal Documents',
    description: 'Standard property purchase agreement template for residential properties',
    templateType: 'pdf',
    placeholders: [
      { key: 'buyer_name', label: 'Buyer Full Name', type: 'text', required: true },
      { key: 'seller_name', label: 'Seller Full Name', type: 'text', required: true },
      { key: 'property_address', label: 'Property Address', type: 'text', required: true },
      { key: 'purchase_price', label: 'Purchase Price', type: 'number', required: true },
      { key: 'closing_date', label: 'Closing Date', type: 'date', required: true },
      { key: 'deposit_amount', label: 'Deposit Amount', type: 'number', required: true }
    ],
    isActive: true,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-06-20T14:30:00Z'
  },
  {
    id: 'template_2',
    name: 'Building Permit Application',
    category: 'Planning Documents',
    description: 'Building permit application for new construction projects',
    templateType: 'word',
    placeholders: [
      { key: 'applicant_name', label: 'Applicant Name', type: 'text', required: true },
      { key: 'property_address', label: 'Property Address', type: 'text', required: true },
      { key: 'project_description', label: 'Project Description', type: 'text', required: true },
      { key: 'estimated_cost', label: 'Estimated Cost', type: 'number', required: true },
      { key: 'proposed_start_date', label: 'Proposed Start Date', type: 'date', required: true },
      { key: 'architect_name', label: 'Architect Name', type: 'text', required: false }
    ],
    isActive: true,
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-06-15T11:45:00Z'
  },
  {
    id: 'template_3',
    name: 'Monthly Progress Report',
    category: 'Project Reports',
    description: 'Monthly construction progress report template',
    templateType: 'excel',
    placeholders: [
      { key: 'project_name', label: 'Project Name', type: 'text', required: true },
      { key: 'reporting_period', label: 'Reporting Period', type: 'text', required: true },
      { key: 'completion_percentage', label: 'Completion Percentage', type: 'number', required: true },
      { key: 'milestone_data', label: 'Milestone Data', type: 'table', required: true },
      { key: 'issues_list', label: 'Issues and Challenges', type: 'list', required: false },
      { key: 'next_month_plan', label: 'Next Month Plan', type: 'text', required: true }
    ],
    isActive: true,
    createdAt: '2025-01-20T16:00:00Z',
    updatedAt: '2025-06-25T09:15:00Z'
  },
  {
    id: 'template_4',
    name: 'HTB Claim Submission',
    category: 'Financial Documents',
    description: 'Help to Buy claim submission form',
    templateType: 'pdf',
    placeholders: [
      { key: 'developer_name', label: 'Developer Name', type: 'text', required: true },
      { key: 'development_name', label: 'Development Name', type: 'text', required: true },
      { key: 'unit_address', label: 'Unit Address', type: 'text', required: true },
      { key: 'sale_price', label: 'Sale Price', type: 'number', required: true },
      { key: 'htb_amount', label: 'HTB Amount', type: 'number', required: true },
      { key: 'completion_date', label: 'Completion Date', type: 'date', required: true },
      { key: 'solicitor_signature', label: 'Solicitor Signature', type: 'signature', required: true }
    ],
    isActive: true,
    createdAt: '2025-03-10T14:00:00Z',
    updatedAt: '2025-06-30T16:20:00Z'
  }
];

// ================================================================================
// MAIN COMPONENT
// ================================================================================

export default function DocumentGenerationManager({
  projectId,
  workflowId,
  onDocumentGenerated,
  showAnalytics = true
}: DocumentGenerationManagerProps) {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(MOCK_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    quality: 'high',
    compression: true,
    includeMetadata: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentGenerations, setRecentGenerations] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<GenerationAnalytics | null>(null);
  const [currentView, setCurrentView] = useState<'templates' | 'form' | 'analytics' | 'results'>('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Load analytics on component mount
  useEffect(() => {
    if (showAnalytics) {
      loadAnalytics();
    }
  }, []);

  // ================================================================================
  // DATA LOADING FUNCTIONS
  // ================================================================================

  const loadAnalytics = async () => {
    try {
      const params = new URLSearchParams({ action: 'analytics' });
      if (projectId) params.append('projectId', projectId);

      const response = await axios.get(`/api/documents/generate?${params.toString()}`);
      setAnalytics(response.data.data);
    } catch (error: any) {
      console.error('Error loading analytics:', error);
    }
  };

  // ================================================================================
  // GENERATION FUNCTIONS
  // ================================================================================

  const generateDocument = async (outputFormat: 'pdf' | 'word' | 'html' | 'excel') => {
    if (!selectedTemplate) return;

    try {
      setIsGenerating(true);

      const generationRequest: GenerationRequest = {
        templateId: selectedTemplate.id,
        outputFormat,
        data: formData,
        options: generationOptions,
        projectId,
        workflowId
      };

      const response = await axios.post('/api/documents/generate', generationRequest);
      const result: GenerationResult = response.data.data;

      // Add to recent generations
      setRecentGenerations(prev => [
        {
          ...result,
          templateName: selectedTemplate.name,
          generatedAt: new Date(),
          outputFormat
        },
        ...prev.slice(0, 9) // Keep last 10
      ]);

      // Refresh analytics
      await loadAnalytics();

      // Callback
      if (onDocumentGenerated) {
        onDocumentGenerated(result);
      }

      // Show success message
      alert(`✅ Document generated successfully!\n\nFile: ${result.fileName}\nGeneration Time: ${result.generationTime}ms`);

      // Switch to results view
      setCurrentView('results');

    } catch (error: any) {
      console.error('Error generating document:', error);
      const errorMessage = error.response?.data?.message || error.message;
      alert(`❌ Generation Failed\n\n${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // ================================================================================
  // UTILITY FUNCTIONS
  // ================================================================================

  const handleTemplateSelect = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    
    // Initialize form data with default values
    const initialData: { [key: string]: any } = {};
    template.placeholders.forEach(placeholder => {
      if (placeholder.defaultValue !== undefined) {
        initialData[placeholder.key] = placeholder.defaultValue;
      }
    });
    setFormData(initialData);
    
    setCurrentView('form');
  };

  const handleFormDataChange = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!selectedTemplate) return false;

    for (const placeholder of selectedTemplate.placeholders) {
      if (placeholder.required && (!formData[placeholder.key] || formData[placeholder.key] === '')) {
        alert(`❌ Validation Error\n\n${placeholder.label} is required.`);
        return false;
      }
    }
    return true;
  };

  const renderPlaceholderInput = (placeholder: TemplatePlaceholder) => {
    const value = formData[placeholder.key] || '';

    switch (placeholder.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFormDataChange(placeholder.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${placeholder.label.toLowerCase()}`}
            required={placeholder.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleFormDataChange(placeholder.key, parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${placeholder.label.toLowerCase()}`}
            required={placeholder.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFormDataChange(placeholder.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={placeholder.required}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={placeholder.key}
                checked={value === true}
                onChange={() => handleFormDataChange(placeholder.key, true)}
                className="text-blue-600"
              />
              Yes
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={placeholder.key}
                checked={value === false}
                onChange={() => handleFormDataChange(placeholder.key, false)}
                className="text-blue-600"
              />
              No
            </label>
          </div>
        );

      case 'list':
        return (
          <textarea
            value={Array.isArray(value) ? value.join('\n') : value}
            onChange={(e) => handleFormDataChange(placeholder.key, e.target.value.split('\n').filter(item => item.trim()))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Enter one item per line"
            required={placeholder.required}
          />
        );

      case 'table':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleFormDataChange(placeholder.key, parsed);
              } catch {
                handleFormDataChange(placeholder.key, e.target.value);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            rows={6}
            placeholder="Enter JSON data or plain text"
            required={placeholder.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFormDataChange(placeholder.key, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={`Enter ${placeholder.label.toLowerCase()}`}
            required={placeholder.required}
          />
        );
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText className="w-4 h-4 text-red-600" />;
      case 'word': return <FileText className="w-4 h-4 text-blue-600" />;
      case 'html': return <FileText className="w-4 h-4 text-orange-600" />;
      case 'excel': return <FileText className="w-4 h-4 text-green-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory && template.isActive;
  });

  const categories = [...new Set(templates.map(t => t.category))];

  // ================================================================================
  // RENDER FUNCTIONS
  // ================================================================================

  const renderTemplateSelection = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Document Templates</h3>
            <p className="text-gray-600">Choose a template to generate documents</p>
          </div>
          <div className="flex items-center gap-3">
            {showAnalytics && (
              <button
                onClick={() => setCurrentView('analytics')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            )}
            <button
              onClick={() => setCurrentView('results')}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={recentGenerations.length === 0}
            >
              <Grid className="w-4 h-4" />
              Recent ({recentGenerations.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template)}
              className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 bg-${template.templateType === 'pdf' ? 'red' : template.templateType === 'word' ? 'blue' : template.templateType === 'excel' ? 'green' : 'orange'}-100 rounded-lg flex items-center justify-center`}>
                  {getFormatIcon(template.templateType)}
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                  {template.templateType.toUpperCase()}
                </span>
              </div>

              <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {template.category}
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {template.placeholders.length} fields
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600 mt-2">No templates found</p>
            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    );
  };

  const renderGenerationForm = () => {
    if (!selectedTemplate) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => setCurrentView('templates')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              ← Back to Templates
            </button>
            <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
            <p className="text-gray-600">{selectedTemplate.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Document Data</h4>
              <div className="space-y-4">
                {selectedTemplate.placeholders.map((placeholder) => (
                  <div key={placeholder.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {placeholder.label}
                      {placeholder.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderPlaceholderInput(placeholder)}
                    {placeholder.description && (
                      <p className="text-xs text-gray-500 mt-1">{placeholder.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Generation Options */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Generation Options</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quality</label>
                  <select
                    value={generationOptions.quality || 'high'}
                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, quality: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="compression"
                    checked={generationOptions.compression || false}
                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, compression: e.target.checked }))}
                    className="text-blue-600"
                  />
                  <label htmlFor="compression" className="text-sm text-gray-700">Enable compression</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="metadata"
                    checked={generationOptions.includeMetadata || false}
                    onChange={(e) => setGenerationOptions(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                    className="text-blue-600"
                  />
                  <label htmlFor="metadata" className="text-sm text-gray-700">Include metadata</label>
                </div>
              </div>
            </div>

            {/* Generate Buttons */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Generate Document</h4>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => validateForm() && generateDocument('pdf')}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : getFormatIcon('pdf')}
                  PDF
                </button>
                <button
                  onClick={() => validateForm() && generateDocument('word')}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : getFormatIcon('word')}
                  Word
                </button>
                <button
                  onClick={() => validateForm() && generateDocument('html')}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : getFormatIcon('html')}
                  HTML
                </button>
                <button
                  onClick={() => validateForm() && generateDocument('excel')}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isGenerating ? <Loader className="w-4 h-4 animate-spin" /> : getFormatIcon('excel')}
                  Excel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalytics = () => {
    if (!analytics) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Generation Analytics</h3>
          <button
            onClick={() => setCurrentView('templates')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Templates
          </button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.totalGenerations}</div>
                <div className="text-sm text-gray-600">Total Generated</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.successfulGenerations}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{((analytics.successfulGenerations / analytics.totalGenerations) * 100).toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{analytics.averageGenerationTime}s</div>
                <div className="text-sm text-gray-600">Avg Generation Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Format Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Format Distribution</h4>
          <div className="space-y-4">
            {Object.entries(analytics.formatDistribution).map(([format, count]) => (
              <div key={format} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getFormatIcon(format)}
                  <span className="font-medium capitalize">{format}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / analytics.totalGenerations) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Recent Generations</h3>
          <button
            onClick={() => setCurrentView('templates')}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Back to Templates
          </button>
        </div>

        {recentGenerations.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto text-gray-400" />
            <p className="text-gray-600 mt-2">No documents generated yet</p>
            <p className="text-sm text-gray-500">Generate your first document to see it here</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {recentGenerations.map((generation, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      {getFormatIcon(generation.outputFormat)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{generation.fileName}</h4>
                      <p className="text-sm text-gray-600">Template: {generation.templateName}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {generation.generatedAt.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {generation.generationTime}ms
                        </span>
                        <span className="flex items-center gap-1">
                          <FileImage className="w-3 h-3" />
                          {(generation.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <a
                      href={generation.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </a>
                    <a
                      href={generation.fileUrl}
                      download={generation.fileName}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ================================================================================
  // MAIN RENDER
  // ================================================================================

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Generation</h1>
                <p className="text-gray-600">Real-time PDF, Word, HTML & Excel generation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentView === 'templates' && renderTemplateSelection()}
        {currentView === 'form' && renderGenerationForm()}
        {currentView === 'analytics' && renderAnalytics()}
        {currentView === 'results' && renderResults()}
      </div>
    </div>
  );
}