'use client';

import React from 'react';

import { useState } from 'react';
import { 
  FileText,
  Folder,
  Download,
  Upload,
  Search,
  Filter,
  Clock,
  Users,
  Lock,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  Share2,
  GitBranch,
  History,
  FolderPlus,
  FileImage,
  FilePlus,
  Shield,
  X
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'folder' | 'file';
  mimeType?: string;
  size?: number;
  modified: string;
  modifiedBy: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'archived';
  tags: string[];
  sharedWith: string[];
  isLocked?: boolean;
  lockOwner?: string;
  parentId?: string;
}

export default function DocumentsPage() {
  const [searchTermsetSearchTerm] = useState('');
  const [viewModesetViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFoldersetSelectedFolder] = useState('root');
  const [selectedFilessetSelectedFiles] = useState<string[]>([]);
  const [showUploadModalsetShowUploadModal] = useState(false);
  const [showVersionHistorysetShowVersionHistory] = useState<string | null>(null);

  // Mock data for demonstration
  const [documents] = useState<Document[]>([
    {
      id: '1',
      name: 'Project Plans',
      type: 'folder',
      modified: '2024-01-15',
      modifiedBy: 'Emma Thompson',
      version: '-',
      status: 'approved',
      tags: [],
      sharedWith: ['team']},
    {
      id: '2',
      name: 'Contracts',
      type: 'folder',
      modified: '2024-01-14',
      modifiedBy: 'Michael Chen',
      version: '-',
      status: 'approved',
      tags: ['legal'],
      sharedWith: ['legal-team']},
    {
      id: '3',
      name: 'Riverside Heights Master Plan.pdf',
      type: 'file',
      mimeType: 'application/pdf',
      size: 15728640,
      modified: '2024-01-16',
      modifiedBy: 'Sarah O\'Brien',
      version: '3.2',
      status: 'approved',
      tags: ['masterplan', 'riverside'],
      sharedWith: ['team', 'contractors'],
      parentId: '1'},
    {
      id: '4',
      name: 'Building Contract - Phase 1.docx',
      type: 'file',
      mimeType: 'application/docx',
      size: 524288,
      modified: '2024-01-16',
      modifiedBy: 'John Murphy',
      version: '2.1',
      status: 'review',
      tags: ['contract', 'phase1'],
      sharedWith: ['legal-team'],
      isLocked: true,
      lockOwner: 'John Murphy',
      parentId: '2'},
    {
      id: '5',
      name: 'Site Survey Results.xlsx',
      type: 'file',
      mimeType: 'application/xlsx',
      size: 2097152,
      modified: '2024-01-15',
      modifiedBy: 'Emma Thompson',
      version: '1.0',
      status: 'approved',
      tags: ['survey', 'data'],
      sharedWith: ['team'],
      parentId: 'root'}]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(ki)).toFixed(2)) + ' ' + sizes[i];
  };

  const UploadModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Upload Documents</h3>
          <button
            onClick={() => setShowUploadModal(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Drag and drop files here or click to browse</p>
          <p className="text-sm text-gray-500">Support for PDF, DOC, DOCX, XLS, XLSX, JPG, PNG up to 50MB</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Select Files
          </button>
        </div>

        {/* Upload settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination Folder</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Root</option>
              <option>Project Plans</option>
              <option>Contracts</option>
              <option>Reports</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              placeholder="Add tags separated by commas"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Share With</label>
            <div className="space-y-2">
              {['Entire Team', 'Project Managers', 'Legal Team', 'Contractors'].map(group => (
                <label key={group} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">{group}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="text-sm">Require approval before publishing</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex space-x-3">
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Upload Files
          </button>
        </div>
      </div>
    </div>
  );

  const VersionHistoryModal = ({ documentId }: { documentId: string }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Version History</h3>
          <button
            onClick={() => setShowVersionHistory(null)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { version: '3.2', date: '2024-01-16', author: 'Sarah O\'Brien', changes: 'Updated floor plans for Block C', current: true },
            { version: '3.1', date: '2024-01-14', author: 'Michael Chen', changes: 'Added landscaping details' },
            { version: '3.0', date: '2024-01-10', author: 'Sarah O\'Brien', changes: 'Major revision - new layout' },
            { version: '2.5', date: '2024-01-05', author: 'Emma Thompson', changes: 'Updated parking arrangements' },
            { version: '2.0', date: '2023-12-20', author: 'Michael Chen', changes: 'Incorporated client feedback' }].map((version: any) => (
            <div key={version.version} className={`p-4 rounded-lg border ${version.current ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className={`font-medium ${version.current ? 'text-blue-600' : ''}`}>
                    Version {version.version}
                  </span>
                  {version.current && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Current</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-blue-600 hover:underline">Download</button>
                  {!version.current && (
                    <button className="text-sm text-blue-600 hover:underline">Restore</button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{version.changes}</p>
              <p className="text-xs text-gray-500">By {version.author} on {version.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Version-controlled document storage and sharing</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <FolderPlus className="w-4 h-4" />
            <span>New Folder</span>
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-2xl font-bold text-gray-900">8.4 GB</p>
            </div>
            <Folder className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">7</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Types</option>
              <option>PDF</option>
              <option>Word</option>
              <option>Excel</option>
              <option>Images</option>
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Status</option>
              <option>Draft</option>
              <option>Review</option>
              <option>Approved</option>
              <option>Archived</option>
            </select>

            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
              >
                <FileText className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Table */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {documents.map((doc: any) => (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedFiles.includes(doc.id)}
                      onChange={(e: any) => {
                        if (e.target.checked) {
                          setSelectedFiles([...selectedFiles, doc.id]);
                        } else {
                          setSelectedFiles(selectedFiles.filter(id => id !== doc.id));
                        }
                      }
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {doc.type === 'folder' ? (
                        <Folder className="w-5 h-5 text-blue-600 mr-3" />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <button className="text-sm font-medium text-gray-900 hover:text-blue-600">
                            {doc.name}
                          </button>
                          {doc.isLocked && (
                            <Lock className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        {doc.size && (
                          <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <p className="text-gray-900">{doc.modified}</p>
                      <p className="text-gray-500">by {doc.modifiedBy}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => setShowVersionHistory(doc.id)}
                      className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>{doc.version}</span>
                      {doc.type === 'file' && <GitBranch className="w-3 h-3" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                      doc.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                      doc.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {doc.tags.slice(0).map(tag => (
                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {tag}
                        </span>
                      ))}
                      {doc.tags.length> 2 && (
                        <span className="text-xs text-gray-500">+{doc.tags.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-gray-400 hover:text-gray-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showUploadModal && <UploadModal />}
      {showVersionHistory && <VersionHistoryModal documentId={showVersionHistory} />}
    </div>
  );
}