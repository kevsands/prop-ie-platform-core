'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Template category interface
interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// Document template interface
interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  format: 'DOCX' | 'PDF' | 'EXCEL';
  downloadPath: string;
  updatedAt: string;
  popular?: boolean;
}

export default function DocumentTemplatesPage() {
  const [selectedCategorysetSelectedCategory] = useState<string | null>(null);
  const [searchQuerysetSearchQuery] = useState('');

  // Template categories
  const categories: TemplateCategory[] = [
    {
      id: 'purchase',
      name: 'Purchase Agreements',
      description: 'Templates for property purchase transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'legal',
      name: 'Legal Documentation',
      description: 'Legal forms and declarations for property transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      id: 'letting',
      name: 'Letting & Rental',
      description: 'Templates for rental agreements and leases',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'reports',
      name: 'Reports & Inspections',
      description: 'Templates for property reports and inspections',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      description: 'Financial templates for property transactions',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'compliance',
      name: 'Compliance & Regulations',
      description: 'Templates for regulatory compliance',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  // Document templates
  const templates: DocumentTemplate[] = [
    {
      id: 'purchase-agreement',
      title: 'Property Purchase Agreement',
      description: 'Standard purchase agreement for residential properties in Ireland',
      categoryId: 'purchase',
      format: 'DOCX',
      downloadPath: '/templates/purchase-agreement.docx',
      updatedAt: 'March 15, 2024',
      popular: true
    },
    {
      id: 'sales-contract',
      title: 'Contract for Sale',
      description: 'Comprehensive contract for sale document with standard clauses',
      categoryId: 'purchase',
      format: 'DOCX',
      downloadPath: '/templates/contract-for-sale.docx',
      updatedAt: 'February 28, 2024'
    },
    {
      id: 'mortgage-deed',
      title: 'Mortgage Deed',
      description: 'Standard mortgage deed format for property financing',
      categoryId: 'purchase',
      format: 'PDF',
      downloadPath: '/templates/mortgage-deed.pdf',
      updatedAt: 'April 2, 2024'
    },
    {
      id: 'statutory-declaration',
      title: 'Statutory Declaration Template',
      description: 'Template for statutory declarations required in property transactions',
      categoryId: 'legal',
      format: 'DOCX',
      downloadPath: '/templates/statutory-declaration.docx',
      updatedAt: 'March 22, 2024'
    },
    {
      id: 'family-law-declaration',
      title: 'Family Law Declaration',
      description: 'Declaration related to family law matters affecting property',
      categoryId: 'legal',
      format: 'PDF',
      downloadPath: '/templates/family-law-declaration.pdf',
      updatedAt: 'January 17, 2024'
    },
    {
      id: 'tenancy-agreement',
      title: 'Residential Tenancy Agreement',
      description: 'Standard residential tenancy agreement compliant with RTB requirements',
      categoryId: 'letting',
      format: 'DOCX',
      downloadPath: '/templates/tenancy-agreement.docx',
      updatedAt: 'April 10, 2024',
      popular: true
    },
    {
      id: 'condition-report',
      title: 'Property Condition Report',
      description: 'Detailed template for documenting property condition at start/end of tenancy',
      categoryId: 'reports',
      format: 'DOCX',
      downloadPath: '/templates/condition-report.docx',
      updatedAt: 'March 5, 2024'
    },
    {
      id: 'snag-list',
      title: 'New Home Snag List',
      description: 'Comprehensive checklist for inspecting new build properties',
      categoryId: 'reports',
      format: 'EXCEL',
      downloadPath: '/templates/snag-list.xlsx',
      updatedAt: 'April 1, 2024',
      popular: true
    },
    {
      id: 'rental-income-tracker',
      title: 'Rental Income Tracker',
      description: 'Spreadsheet for tracking rental income and expenses for tax purposes',
      categoryId: 'financial',
      format: 'EXCEL',
      downloadPath: '/templates/rental-income-tracker.xlsx',
      updatedAt: 'February 12, 2024'
    },
    {
      id: 'gdpr-compliance',
      title: 'GDPR Compliance Documentation',
      description: 'Templates for GDPR compliance in property business',
      categoryId: 'compliance',
      format: 'PDF',
      downloadPath: '/templates/gdpr-compliance.pdf',
      updatedAt: 'January 30, 2024'
    },
    {
      id: 'aml-checklist',
      title: 'Anti-Money Laundering Checklist',
      description: 'Checklist for AML compliance in property transactions',
      categoryId: 'compliance',
      format: 'PDF',
      downloadPath: '/templates/aml-checklist.pdf',
      updatedAt: 'March 18, 2024'
    }
  ];

  // Filter templates based on selected category and search query
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory ? template.categoryId === selectedCategory : true;
    const matchesSearch = searchQuery 
      ? template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        template.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Get popular templates
  const popularTemplates = templates.filter(template => template.popular);

  // Format badge based on file type
  const getFormatBadgeClasses = (format: string) => {
    switch (format) {
      case 'DOCX':
        return 'bg-blue-100 text-blue-800';
      case 'PDF':
        return 'bg-red-100 text-red-800';
      case 'EXCEL':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/resources" className="text-gray-500 hover:text-gray-700">
              Resources
            </Link>
          </li>
          <li className="flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </li>
          <li>
            <span className="text-gray-900 font-medium">Document Templates</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Document Templates
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Access our library of professionally drafted property-related document templates.
        </p>
      </header>

      {/* Search and category filter */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-[#2B5273] focus:border-[#2B5273]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <select
              className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:ring-[#2B5273] focus:border-[#2B5273] bg-white"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Document categories */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Document Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === selectedCategory ? null : category.id)}
              className={`flex items-start p-6 rounded-lg text-left transition-all hover:shadow-md ${
                category.id === selectedCategory 
                  ? 'bg-[#2B5273] text-white shadow-md'
                  : 'bg-white shadow'
              }`}
            >
              <div className={`p-2 rounded-md mr-4 ${
                category.id === selectedCategory 
                  ? 'bg-white/20' 
                  : 'bg-blue-50 text-[#2B5273]'
              }`}>
                {category.icon}
              </div>
              <div>
                <h3 className={`text-lg font-medium ${
                  category.id === selectedCategory ? 'text-white' : 'text-gray-900'
                }`}>
                  {category.name}
                </h3>
                <p className={`mt-1 text-sm ${
                  category.id === selectedCategory ? 'text-white/80' : 'text-gray-500'
                }`}>
                  {category.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Popular templates */}
      {!selectedCategory && !searchQuery && (
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getFormatBadgeClasses(template.format)}`}>
                      {template.format}
                    </span>
                    <span className="text-xs text-gray-500">
                      Updated: {template.updatedAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                  <a
                    href={template.downloadPath}
                    download
                    className="inline-flex items-center text-[#2B5273] font-medium hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Template
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All templates or filtered templates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {selectedCategory
            ? `${categories.find(c => c.id === selectedCategory)?.name} Templates`
            : searchQuery
              ? 'Search Results'
              : 'All Templates'}
        </h2>

        {filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No templates found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div className="mt-6">
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(''); }
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${getFormatBadgeClasses(template.format)}`}>
                      {template.format}
                    </span>
                    <span className="text-xs text-gray-500">
                      Updated: {template.updatedAt}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{template.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {categories.find(c => c.id === template.categoryId)?.name}
                    </span>
                    <a
                      href={template.downloadPath}
                      download
                      className="inline-flex items-center text-[#2B5273] font-medium hover:underline"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Template
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legal disclaimer */}
      <div className="mt-16 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Legal Disclaimer</h3>
        <p className="text-sm text-gray-600">
          These document templates are provided for informational purposes only and do not constitute legal advice. 
          The templates should be reviewed and adapted by qualified legal professionals to ensure they meet your specific 
          requirements and comply with current laws and regulations. PropIE does not accept any responsibility for any 
          loss which may arise from reliance on information or templates provided on this website.
        </p>
      </div>

      {/* Need legal help CTA */}
      <div className="mt-10 bg-[#2B5273] text-white p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4 mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Need professional legal assistance?</h3>
            <p className="text-white/80">
              Our network of property solicitors can help with document preparation, conveyancing, and legal advice.
            </p>
          </div>
          <div className="md:w-1/4 text-center">
            <Link 
              href="/contact"
              className="inline-block bg-white text-[#2B5273] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Find a Solicitor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 