'use client';

import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Copy,
  Check,
  Building2,
  Home,
  Calculator,
  Users,
  Truck,
  Wrench
} from 'lucide-react';

interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  type: 'RECEIVABLE' | 'PAYABLE';
  category: string;
  icon: any;
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    category: string;
  }[];
  defaultTerms: string;
  paymentTerms: number; // days
}

const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'construction-receivable',
    name: 'Construction Services - Receivable',
    description: 'For billing construction services to clients',
    type: 'RECEIVABLE',
    category: 'Construction',
    icon: Building2,
    lineItems: [
      {
        description: 'Foundation work',
        quantity: 1,
        unitPrice: 75000,
        category: 'Construction'
      },
      {
        description: 'Structural framework',
        quantity: 1,
        unitPrice: 50000,
        category: 'Construction'
      }
    ],
    defaultTerms: 'Payment due within 30 days of invoice date. Late payments subject to 1.5% monthly interest.',
    paymentTerms: 30
  },
  {
    id: 'planning-fees',
    name: 'Planning & Development Fees',
    description: 'Council fees, permits, and development charges',
    type: 'PAYABLE',
    category: 'Planning',
    icon: FileText,
    lineItems: [
      {
        description: 'Planning application fee',
        quantity: 1,
        unitPrice: 12000,
        category: 'Planning'
      },
      {
        description: 'Development contribution levy',
        quantity: 1,
        unitPrice: 30000,
        category: 'Levies'
      }
    ],
    defaultTerms: 'Payment required within 14 days to avoid penalties.',
    paymentTerms: 14
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    description: 'Architects, engineers, consultants',
    type: 'PAYABLE',
    category: 'Professional',
    icon: Users,
    lineItems: [
      {
        description: 'Architectural design services',
        quantity: 1,
        unitPrice: 25000,
        category: 'Design'
      },
      {
        description: 'Structural engineering',
        quantity: 1,
        unitPrice: 15000,
        category: 'Engineering'
      }
    ],
    defaultTerms: 'Payment within 30 days of invoice date.',
    paymentTerms: 30
  },
  {
    id: 'unit-sales',
    name: 'Unit Sales Invoice',
    description: 'For selling individual property units',
    type: 'RECEIVABLE',
    category: 'Sales',
    icon: Home,
    lineItems: [
      {
        description: 'Property deposit',
        quantity: 1,
        unitPrice: 50000,
        category: 'Sales'
      },
      {
        description: 'Legal fees',
        quantity: 1,
        unitPrice: 2500,
        category: 'Legal'
      }
    ],
    defaultTerms: 'Deposit due on signing. Balance due on completion.',
    paymentTerms: 7
  },
  {
    id: 'materials-supplies',
    name: 'Materials & Supplies',
    description: 'Building materials and equipment',
    type: 'PAYABLE',
    category: 'Materials',
    icon: Truck,
    lineItems: [
      {
        description: 'Concrete supply',
        quantity: 100,
        unitPrice: 150,
        category: 'Materials'
      },
      {
        description: 'Steel reinforcement',
        quantity: 50,
        unitPrice: 200,
        category: 'Materials'
      }
    ],
    defaultTerms: 'Net 30 days. 2% discount if paid within 10 days.',
    paymentTerms: 30
  },
  {
    id: 'maintenance-services',
    name: 'Maintenance Services',
    description: 'Ongoing maintenance and repairs',
    type: 'PAYABLE',
    category: 'Maintenance',
    icon: Wrench,
    lineItems: [
      {
        description: 'Monthly maintenance service',
        quantity: 1,
        unitPrice: 5000,
        category: 'Maintenance'
      },
      {
        description: 'Emergency repairs',
        quantity: 1,
        unitPrice: 2000,
        category: 'Repairs'
      }
    ],
    defaultTerms: 'Payment due monthly in advance.',
    paymentTerms: 30
  }
];

interface InvoiceTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: InvoiceTemplate) => void;
}

export default function InvoiceTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate
}: InvoiceTemplateModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', ...Array.from(new Set(INVOICE_TEMPLATES.map(t => t.category)))];
  
  const filteredTemplates = INVOICE_TEMPLATES.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const typeMatch = selectedType === 'all' || template.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const handleSelectTemplate = (template: InvoiceTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <FileText className="mr-3 text-blue-600" size={24} />
              Invoice Templates
            </h2>
            <p className="text-gray-600 mt-1">
              Choose from pre-configured invoice templates for common scenarios
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="RECEIVABLE">Receivables</option>
                <option value="PAYABLE">Payables</option>
              </select>
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => {
              const IconComponent = template.icon;
              const totalAmount = template.lineItems.reduce((sum, item) => 
                sum + (item.quantity * item.unitPrice), 0
              );

              return (
                <div 
                  key={template.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleSelectTemplate(template)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        template.type === 'RECEIVABLE' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        <IconComponent size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          template.type === 'RECEIVABLE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {template.type === 'RECEIVABLE' ? 'Receivable' : 'Payable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {template.description}
                  </p>

                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="text-gray-500">Items: </span>
                      <span className="text-gray-900">{template.lineItems.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Est. Total: </span>
                      <span className="font-medium text-gray-900">€{totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Payment Terms: </span>
                      <span className="text-gray-900">{template.paymentTerms} days</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="text-xs text-gray-500 mb-2">Line Items Preview:</div>
                    <div className="space-y-1">
                      {template.lineItems.slice(0, 2).map((item, index) => (
                        <div key={index} className="text-xs text-gray-600 flex justify-between">
                          <span className="truncate mr-2">{item.description}</span>
                          <span className="font-medium">€{item.unitPrice.toLocaleString()}</span>
                        </div>
                      ))}
                      {template.lineItems.length > 2 && (
                        <div className="text-xs text-gray-400">
                          +{template.lineItems.length - 2} more item{template.lineItems.length > 3 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    className="w-full mt-4 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTemplate(template);
                    }}
                  >
                    <Copy size={16} className="mr-2" />
                    Use Template
                  </button>
                </div>
              );
            })}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600">Try adjusting your filters to see more templates</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}