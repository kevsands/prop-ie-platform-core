'use client';

import React, { useState } from 'react';
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Eye, 
  FolderOpen, 
  File, 
  ArrowLeft,
  MoreHorizontal,
  ExternalLink,
  Cloud,
  HardDrive,
  Calendar,
  User,
  FileText,
  Image,
  FileSpreadsheet,
  FileCode,
  Archive
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensDocumentsPage() {
  const [activeTabsetActiveTab] = useState('all');
  const [searchTermsetSearchTerm] = useState('');
  const [selectedItemssetSelectedItems] = useState([]);

  const documents = [
    {
      id: 1,
      name: 'Planning Application Final Submission.pdf',
      type: 'pdf',
      size: '15.2 MB',
      modified: '2025-06-15T10:30:00Z',
      modifiedBy: 'Sarah Chen',
      category: 'Planning',
      source: 'dropbox',
      path: '/Planning/Submissions/',
      tags: ['planning', 'council', 'final'],
      permissions: 'view_edit',
      isShared: true
    },
    {
      id: 2,
      name: 'Architectural Drawings - Phase 2.dwg',
      type: 'cad',
      size: '45.8 MB',
      modified: '2025-06-14T16:45:00Z',
      modifiedBy: 'Michael Burke',
      category: 'Design',
      source: 'sharepoint',
      path: '/Design/Architectural/',
      tags: ['architecture', 'phase2', 'drawings'],
      permissions: 'view_only',
      isShared: false
    },
    {
      id: 3,
      name: 'Site Photos - Week 24.zip',
      type: 'archive',
      size: '128.5 MB',
      modified: '2025-06-13T09:15:00Z',
      modifiedBy: 'David O\'Connor',
      category: 'Construction',
      source: 'dropbox',
      path: '/Construction/Photos/',
      tags: ['photos', 'site', 'week24'],
      permissions: 'view_edit',
      isShared: true
    },
    {
      id: 4,
      name: 'Financial Report Q2 2025.xlsx',
      type: 'spreadsheet',
      size: '2.1 MB',
      modified: '2025-06-12T14:20:00Z',
      modifiedBy: 'Emma Walsh',
      category: 'Finance',
      source: 'sharepoint',
      path: '/Finance/Reports/',
      tags: ['finance', 'q2', 'report'],
      permissions: 'view_only',
      isShared: false
    },
    {
      id: 5,
      name: 'Safety Inspection Checklist.docx',
      type: 'document',
      size: '856 KB',
      modified: '2025-06-11T11:30:00Z',
      modifiedBy: 'David O\'Connor',
      category: 'Safety',
      source: 'dropbox',
      path: '/Safety/Inspections/',
      tags: ['safety', 'inspection', 'checklist'],
      permissions: 'view_edit',
      isShared: true
    },
    {
      id: 6,
      name: 'Marketing Brochure v3.pdf',
      type: 'pdf',
      size: '8.9 MB',
      modified: '2025-06-10T13:45:00Z',
      modifiedBy: 'Emma Walsh',
      category: 'Marketing',
      source: 'sharepoint',
      path: '/Marketing/Brochures/',
      tags: ['marketing', 'brochure', 'v3'],
      permissions: 'view_edit',
      isShared: true
    }
  ];

  const folders = [
    { name: 'Planning', count: 23, source: 'dropbox', modified: '2025-06-15' },
    { name: 'Design', count: 67, source: 'sharepoint', modified: '2025-06-14' },
    { name: 'Construction', count: 145, source: 'dropbox', modified: '2025-06-13' },
    { name: 'Finance', count: 34, source: 'sharepoint', modified: '2025-06-12' },
    { name: 'Safety', count: 28, source: 'dropbox', modified: '2025-06-11' },
    { name: 'Marketing', count: 19, source: 'sharepoint', modified: '2025-06-10' },
    { name: 'Legal', count: 12, source: 'dropbox', modified: '2025-06-09' },
    { name: 'HR', count: 8, source: 'sharepoint', modified: '2025-06-08' }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FileText className="w-8 h-8 text-red-500" />\n  );
      case 'document': return <FileText className="w-8 h-8 text-blue-500" />\n  );
      case 'spreadsheet': return <FileSpreadsheet className="w-8 h-8 text-green-500" />\n  );
      case 'image': return <Image className="w-8 h-8 text-purple-500" />\n  );
      case 'cad': return <FileCode className="w-8 h-8 text-orange-500" />\n  );
      case 'archive': return <Archive className="w-8 h-8 text-gray-500" />\n  );
      default: return <File className="w-8 h-8 text-gray-500" />\n  );
    }
  };

  const getSourceIcon = (source) => {
    if (source === 'dropbox') {
      return <Cloud className="w-4 h-4 text-blue-600" />\n  );
    }
    return <HardDrive className="w-4 h-4 text-orange-600" />\n  );
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'dropbox' && doc.source === 'dropbox') ||
                      (activeTab === 'sharepoint' && doc.source === 'sharepoint') ||
                      (activeTab === 'shared' && doc.isShared);
    return matchesSearch && matchesTab;
  });

  const handleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...previd]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link href="/developer/projects/fitzgerald-gardens" 
                    className="flex items-center text-gray-500 hover:text-gray-700">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Project
              </Link>
              <div className="border-l border-gray-300 pl-4">
                <h1 className="text-2xl font-bold text-gray-900">Document Repository</h1>
                <p className="text-sm text-gray-500">Fitzgerald Gardens - Dropbox & SharePoint Integration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Download Selected
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Folders */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Folders</h2>
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  {folders.map((folderindex) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{folder.name}</p>
                          <div className="flex items-center space-x-2">
                            {getSourceIcon(folder.source)}
                            <span className="text-xs text-gray-500">{folder.count} files</span>
                          </div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Storage Info */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium text-gray-900">Storage</h2>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Cloud className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">Dropbox</span>
                    </div>
                    <span className="text-xs text-gray-500">1.2 GB / 5 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={ width: '24%' } />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <HardDrive className="w-4 h-4 text-orange-600" />
                      <span className="text-sm font-medium">SharePoint</span>
                    </div>
                    <span className="text-xs text-gray-500">8.7 GB / 25 GB</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-600 h-2 rounded-full" style={ width: '35%' } />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex space-x-1">
                    {[
                      { key: 'all', label: 'All Documents', count: documents.length },
                      { key: 'dropbox', label: 'Dropbox', count: documents.filter(d => d.source === 'dropbox').length },
                      { key: 'sharepoint', label: 'SharePoint', count: documents.filter(d => d.source === 'sharepoint').length },
                      { key: 'shared', label: 'Shared', count: documents.filter(d => d.isShared).length },
                    ].map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Document List */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium text-gray-900">
                    Documents ({filteredDocuments.length})
                  </h2>
                  {selectedItems.length> 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{selectedItems.length} selected</span>
                      <button className="text-sm text-blue-600 hover:text-blue-500">Download</button>
                      <button className="text-sm text-blue-600 hover:text-blue-500">Share</button>
                    </div>
                  )}
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(doc.id)}
                        onChange={() => handleSelectItem(doc.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                          {getSourceIcon(doc.source)}
                          {doc.isShared && <Share2 className="w-4 h-4 text-green-500" />}
                        </div>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">{doc.size}</span>
                          <span className="text-xs text-gray-500">
                            Modified {new Date(doc.modified).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">by {doc.modifiedBy}</span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {doc.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          {doc.tags.map((tagindex) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-700">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'Upload your first document to get started.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}