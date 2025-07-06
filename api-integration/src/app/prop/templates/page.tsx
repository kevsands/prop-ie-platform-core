"use client";

import React, { useState } from 'react';
import { FiFileText, FiPlus, FiEdit2, FiTrash2, FiCopy, FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';
import { useParams } from 'next/navigation';

// Define DocumentTemplate interface for type safety
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags?: string[];
  usageCount: number;
  updatedAt: string;
}

// Mock implementation of useDocumentTemplates hook
// Do not export this hook to avoid TypeScript index signature errors
const useDocumentTemplates = (orgSlug: string) => {
  const mockTemplates: DocumentTemplate[] = [
    {
      id: "1",
      name: "Sales Contract",
      description: "Standard contract for property sales",
      category: "sales",
      tags: ["contract", "legal", "sales"],
      usageCount: 24,
      updatedAt: "2025-03-15T10:30:00Z"
    },
    {
      id: "2",
      name: "Reservation Agreement",
      description: "Agreement for property reservations",
      category: "sales",
      tags: ["agreement", "reservation"],
      usageCount: 18,
      updatedAt: "2025-02-20T14:45:00Z"
    },
    {
      id: "3",
      name: "Marketing Brochure Template",
      description: "Template for project marketing materials",
      category: "marketing",
      tags: ["brochure", "marketing"],
      usageCount: 12,
      updatedAt: "2025-03-05T09:15:00Z"
    },
    {
      id: "4",
      name: "Construction Schedule",
      description: "Template for construction timeline planning",
      category: "construction",
      tags: ["schedule", "timeline", "planning"],
      usageCount: 8,
      updatedAt: "2025-01-22T11:30:00Z"
    },
    {
      id: "5",
      name: "Property Handover Checklist",
      description: "Checklist for property handover process",
      category: "handover",
      tags: ["checklist", "handover"],
      usageCount: 15,
      updatedAt: "2025-02-10T16:20:00Z"
    }
  ];

  return {
    templates: mockTemplates,
    isLoading: false,
    error: null as Error | null
  };
};

// Mock implementation of usePermissions hook
export const usePermissions = () => {
  return {
    hasPermission: (resource: string, action: string): boolean => {
      // For demo purposes, always return true
      return true;
    }
  };
};

export default function DocumentTemplatesPage() {
  // Explicitly type params to include orgSlug
  const params = useParams() as { orgSlug: string };
  const { orgSlug } = params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  const { templates, isLoading, error } = useDocumentTemplates(orgSlug);
  const { hasPermission } = usePermissions();
  
  const canCreateTemplate = hasPermission('templates', 'create');
  const canEditTemplate = hasPermission('templates', 'update');
  const canDeleteTemplate = hasPermission('templates', 'delete');
  
  // Filter templates based on search and category
  const filteredTemplates = templates?.filter((template: DocumentTemplate) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  }) || [];
  
  const categories = [
    { id: 'sales', name: 'Sales Documents' },
    { id: 'legal', name: 'Legal Documents' },
    { id: 'marketing', name: 'Marketing Materials' },
    { id: 'construction', name: 'Construction Documents' },
    { id: 'handover', name: 'Handover Documents' },
  ];
  
  if (isLoading) return <div className="p-10 text-center">Loading document templates...</div>;
  if (error) return <div className="p-10 text-center text-red-600">Error loading templates: {error.message}</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#2B5273]">Document Templates</h1>
          <p className="text-gray-600">Create and manage templates for automatic document generation</p>
        </div>
        {canCreateTemplate && (
          <Link 
            href={`/${orgSlug}/templates/new`}
            className="px-4 py-2 flex items-center bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
          >
            <FiPlus className="mr-2" /> New Template
          </Link>
        )}
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Templates List */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">No templates found matching your criteria.</p>
          {canCreateTemplate && (
            <Link 
              href={`/${orgSlug}/templates/new`}
              className="px-4 py-2 inline-flex items-center bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
            >
              <FiPlus className="mr-2" /> Create your first template
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: DocumentTemplate) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <FiFileText className="h-8 w-8 text-[#2B5273] mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                      <p className="text-sm text-gray-500">{categories.find(c => c.id === template.category)?.name}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canEditTemplate && (
                      <Link href={`/${orgSlug}/templates/${template.id}/edit`} className="text-gray-500 hover:text-[#2B5273]">
                        <FiEdit2 />
                      </Link>
                    )}
                    <Link href={`/${orgSlug}/templates/${template.id}/duplicate`} className="text-gray-500 hover:text-[#2B5273]">
                      <FiCopy />
                    </Link>
                    {canDeleteTemplate && (
                      <button className="text-gray-500 hover:text-red-600">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-600">{template.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags?.map((tag: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Used in </span>
                      <span className="font-medium">{template.usageCount} projects</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Last updated </span>
                      <span className="font-medium">{new Date(template.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Link 
                    href={`/${orgSlug}/templates/${template.id}`}
                    className="w-full flex justify-center items-center px-4 py-2 border border-[#2B5273] text-[#2B5273] rounded-md hover:bg-blue-50 transition-colors"
                  >
                    View Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}