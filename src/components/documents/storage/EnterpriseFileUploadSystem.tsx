'use client';

import React, { useState, useRef, useCallback } from 'react';
import { FileUploadDropzone } from '@/components/enterprise/FileUploadDropzone';
import { UploadedFile } from '@/hooks/useS3Upload';
import { 
  Upload, 
  File,
  Image,
  FileText,
  Download,
  Trash2,
  Eye,
  Plus,
  Search,
  Filter,
  Folder,
  FolderOpen,
  Upload as CloudUpload,
  CheckCircle,
  AlertCircle,
  Clock,
  MoreVertical,
  Share2,
  Copy,
  Move,
  Star,
  Lock,
  Unlock,
  RefreshCw,
  Settings,
  Grid,
  List,
  SortAsc,
  Archive,
  Tag
} from 'lucide-react';

// File type configurations for Irish property development
const FILE_CATEGORIES = {
  planning: {
    name: 'Planning Documents',
    icon: <FileText className="w-4 h-4" />,
    color: 'blue',
    allowedTypes: ['pdf', 'doc', 'docx', 'dwg', 'jpg', 'png'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Planning applications, drawings, reports'
  },
  legal: {
    name: 'Legal Documents',
    icon: <FileText className="w-4 h-4" />,
    color: 'purple',
    allowedTypes: ['pdf', 'doc', 'docx'],
    maxSize: 25 * 1024 * 1024, // 25MB
    description: 'Contracts, agreements, legal correspondence'
  },
  financial: {
    name: 'Financial Documents',
    icon: <FileText className="w-4 h-4" />,
    color: 'green',
    allowedTypes: ['pdf', 'xlsx', 'xls', 'csv'],
    maxSize: 20 * 1024 * 1024, // 20MB
    description: 'Invoices, BOQs, financial statements'
  },
  drawings: {
    name: 'Technical Drawings',
    icon: <Image className="w-4 h-4" />,
    color: 'amber',
    allowedTypes: ['dwg', 'dxf', 'pdf', 'jpg', 'png', 'tiff'],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: 'Architectural, structural, M&E drawings'
  },
  photos: {
    name: 'Site Photos',
    icon: <Image className="w-4 h-4" />,
    color: 'pink',
    allowedTypes: ['jpg', 'jpeg', 'png', 'heic', 'raw'],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: 'Progress photos, site documentation'
  },
  certificates: {
    name: 'Certificates & Compliance',
    icon: <Star className="w-4 h-4" />,
    color: 'red',
    allowedTypes: ['pdf', 'jpg', 'png'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: 'Building control, fire safety, compliance certificates'
  },
  reports: {
    name: 'Reports & Studies',
    icon: <FileText className="w-4 h-4" />,
    color: 'indigo',
    allowedTypes: ['pdf', 'doc', 'docx'],
    maxSize: 30 * 1024 * 1024, // 30MB
    description: 'Engineering reports, feasibility studies, assessments'
  }
};

// Sample uploaded files for demonstration
const SAMPLE_FILES = [
  {
    id: 'file-1',
    name: 'Planning_Application_FitzgeraldGardens.pdf',
    category: 'planning',
    size: 2500000,
    type: 'pdf',
    uploadedAt: '2025-07-01T09:30:00Z',
    uploadedBy: 'Planning Team',
    projectId: 'fitzgerald-gardens',
    status: 'uploaded',
    version: '1.0',
    tags: ['planning', 'application', 'fitzgerald-gardens'],
    shared: true,
    starred: false
  },
  {
    id: 'file-2',
    name: 'RIAI_Blue_Form_Contract_BallymakenneyView.pdf',
    category: 'legal',
    size: 850000,
    type: 'pdf',
    uploadedAt: '2025-06-30T14:15:00Z',
    uploadedBy: 'Legal Team',
    projectId: 'ballymakenny-view',
    status: 'uploaded',
    version: '2.1',
    tags: ['contract', 'riai', 'blue-form'],
    shared: false,
    starred: true
  },
  {
    id: 'file-3',
    name: 'BOQ_MainContract_Ellwood_Final.xlsx',
    category: 'financial',
    size: 1200000,
    type: 'xlsx',
    uploadedAt: '2025-06-25T11:45:00Z',
    uploadedBy: 'Quantity Surveyor',
    projectId: 'ellwood',
    status: 'uploaded',
    version: '3.0',
    tags: ['boq', 'final', 'main-contract'],
    shared: true,
    starred: false
  },
  {
    id: 'file-4',
    name: 'Architectural_Plans_Level1.dwg',
    category: 'drawings',
    size: 15000000,
    type: 'dwg',
    uploadedAt: '2025-07-02T08:20:00Z',
    uploadedBy: 'Architect',
    projectId: 'fitzgerald-gardens',
    status: 'processing',
    version: '1.2',
    tags: ['architecture', 'level-1', 'plans'],
    shared: true,
    starred: false
  }
];

interface FileItem {
  id: string;
  name: string;
  category: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  projectId: string;
  status: 'uploading' | 'processing' | 'uploaded' | 'error';
  version: string;
  tags: string[];
  shared: boolean;
  starred: boolean;
  progress?: number;
}

interface EnterpriseFileUploadSystemProps {
  projectId?: string;
  onFileUpload?: (files: any[]) => void;
  onFileSelect?: (file: any) => void;
  maxFiles?: number;
  allowedCategories?: string[];
  documentCategory?: string;
}

export default function EnterpriseFileUploadSystem({
  projectId,
  onFileUpload,
  onFileSelect,
  maxFiles = 50,
  allowedCategories = Object.keys(FILE_CATEGORIES),
  documentCategory = 'general'
}: EnterpriseFileUploadSystemProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size' | 'type'>('date');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter and sort files
  const filteredAndSortedFiles = files
    .filter(file => {
      const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
      const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesProject = !projectId || file.projectId === projectId;
      return matchesCategory && matchesSearch && matchesProject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      }
    });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = async (fileList: File[]) => {
    if (fileList.length + files.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsUploading(true);
    
    const newFiles: FileItem[] = fileList.map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      category: detectFileCategory(file.name, file.type),
      size: file.size,
      type: file.name.split('.').pop()?.toLowerCase() || 'unknown',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      projectId: projectId || 'general',
      status: 'uploading',
      version: '1.0',
      tags: generateFileTags(file.name, file.type),
      shared: false,
      starred: false,
      progress: 0
    }));

    // Add files to list immediately
    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    for (const newFile of newFiles) {
      await simulateUpload(newFile.id);
    }

    if (onFileUpload) {
      onFileUpload(newFiles);
    }

    setIsUploading(false);
  };

  const simulateUpload = async (fileId: string) => {
    return new Promise<void>((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, status: 'uploaded', progress: 100 }
              : file
          ));
          resolve();
        } else {
          setFiles(prev => prev.map(file => 
            file.id === fileId 
              ? { ...file, progress }
              : file
          ));
        }
      }, 100);
    });
  };

  const detectFileCategory = (filename: string, mimeType: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'heic', 'raw'].includes(extension || '')) return 'photos';
    if (['dwg', 'dxf'].includes(extension || '') || filename.toLowerCase().includes('plan')) return 'drawings';
    if (['xlsx', 'xls', 'csv'].includes(extension || '') || filename.toLowerCase().includes('boq')) return 'financial';
    if (filename.toLowerCase().includes('contract') || filename.toLowerCase().includes('legal')) return 'legal';
    if (filename.toLowerCase().includes('planning') || filename.toLowerCase().includes('application')) return 'planning';
    if (filename.toLowerCase().includes('certificate') || filename.toLowerCase().includes('compliance')) return 'certificates';
    if (filename.toLowerCase().includes('report') || filename.toLowerCase().includes('study')) return 'reports';
    
    return 'planning'; // Default category
  };

  const generateFileTags = (filename: string, mimeType: string): string[] => {
    const tags: string[] = [];
    const lowerName = filename.toLowerCase();
    
    if (lowerName.includes('fitzgerald')) tags.push('fitzgerald-gardens');
    if (lowerName.includes('ballymakenny')) tags.push('ballymakenny-view');
    if (lowerName.includes('ellwood')) tags.push('ellwood');
    if (lowerName.includes('planning')) tags.push('planning');
    if (lowerName.includes('contract')) tags.push('contract');
    if (lowerName.includes('boq')) tags.push('boq');
    if (lowerName.includes('riai')) tags.push('riai');
    if (lowerName.includes('final')) tags.push('final');
    if (lowerName.includes('draft')) tags.push('draft');
    
    return tags;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string, category: string) => {
    if (['jpg', 'jpeg', 'png', 'gif', 'heic'].includes(type)) return <Image className="w-8 h-8" />;
    if (['pdf'].includes(type)) return <FileText className="w-8 h-8" />;
    if (['doc', 'docx'].includes(type)) return <FileText className="w-8 h-8" />;
    if (['xlsx', 'xls', 'csv'].includes(type)) return <FileText className="w-8 h-8" />;
    if (['dwg', 'dxf'].includes(type)) return <Image className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'uploading': return <CloudUpload className="w-4 h-4 text-blue-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const toggleFileStar = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId 
        ? { ...file, starred: !file.starred }
        : file
    ));
  };

  const deleteFiles = (fileIds: string[]) => {
    setFiles(prev => prev.filter(file => !fileIds.includes(file.id)));
    setSelectedFiles([]);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CloudUpload className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Enterprise File Storage</h1>
                <p className="text-gray-600">Secure document storage and management for Irish property development</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                <Upload className="w-4 h-4" />
                Upload Files
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Folder className="w-4 h-4" />
                New Folder
              </button>
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
                placeholder="Search files..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {allowedCategories.map(category => {
                const categoryInfo = FILE_CATEGORIES[category];
                return (
                  <option key={category} value={category}>
                    {categoryInfo.name}
                  </option>
                );
              })}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
              <option value="size">Sort by Size</option>
              <option value="type">Sort by Type</option>
            </select>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Selected Files Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                {selectedFiles.length} file(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-blue-700 hover:text-blue-900">
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-blue-700 hover:text-blue-900">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-sm text-blue-700 hover:text-blue-900">
                  <Move className="w-3 h-3" />
                  Move
                </button>
                <button 
                  onClick={() => deleteFiles(selectedFiles)}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* AWS S3 File Upload Integration */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cloud File Upload</h3>
          <FileUploadDropzone
            projectId={projectId}
            documentCategory={documentCategory}
            onFilesUploaded={(newFiles) => {
              setUploadedFiles(prev => [...prev, ...newFiles]);
              // Convert S3 files to internal format for compatibility
              const convertedFiles = newFiles.map(file => ({
                id: file.key,
                name: file.fileName,
                type: file.contentType,
                size: file.fileSize,
                category: documentCategory,
                uploadedAt: file.uploadedAt.toISOString(),
                uploadedBy: 'Current User',
                status: 'uploaded',
                url: file.url,
                projectId: projectId || 'general'
              }));
              setFiles(prev => [...prev, ...convertedFiles]);
              if (onFileUpload) {
                onFileUpload(convertedFiles);
              }
            }}
            maxFiles={maxFiles}
            maxFileSize={100 * 1024 * 1024} // 100MB
          />
        </div>

        {/* File Categories Overview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">File Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(FILE_CATEGORIES).map(([key, category]) => {
              const categoryFiles = files.filter(file => file.category === key);
              return (
                <div 
                  key={key} 
                  className={`bg-${category.color}-50 border border-${category.color}-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                      {category.icon}
                    </div>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full bg-${category.color}-100 text-${category.color}-800`}>
                      {categoryFiles.length}
                    </span>
                  </div>
                  <h4 className={`font-medium text-${category.color}-900 mb-1`}>{category.name}</h4>
                  <p className={`text-xs text-${category.color}-700`}>{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Files Display */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Files ({filteredAndSortedFiles.length})
            </h3>
            <span className="text-sm text-gray-600">
              Total size: {formatFileSize(filteredAndSortedFiles.reduce((sum, file) => sum + file.size, 0))}
            </span>
          </div>

          {filteredAndSortedFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">No files found</h4>
              <p className="text-gray-600">Upload some files to get started.</p>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                : 'space-y-2'
            }`}>
              {filteredAndSortedFiles.map(file => {
                const categoryInfo = FILE_CATEGORIES[file.category];
                const isSelected = selectedFiles.includes(file.id);
                
                if (viewMode === 'grid') {
                  return (
                    <div
                      key={file.id}
                      className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => onFileSelect?.(file)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`w-12 h-12 bg-${categoryInfo.color}-100 rounded-lg flex items-center justify-center text-${categoryInfo.color}-600`}>
                          {getFileIcon(file.type, file.category)}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleFileSelection(file.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFileStar(file.id);
                            }}
                            className={`${file.starred ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-500`}
                          >
                            <Star className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 text-sm mb-1 truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {formatFileSize(file.size)} • {file.type.toUpperCase()}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {getStatusIcon(file.status)}
                          <span className="text-xs text-gray-600">v{file.version}</span>
                        </div>
                        {file.shared && <Share2 className="w-3 h-3 text-gray-400" />}
                      </div>
                      
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={file.id}
                      className={`bg-white border rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer ${
                        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                      }`}
                      onClick={() => onFileSelect?.(file)}
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFileSelection(file.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                        
                        <div className={`w-8 h-8 bg-${categoryInfo.color}-100 rounded flex items-center justify-center text-${categoryInfo.color}-600`}>
                          {getFileIcon(file.type, file.category)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">{file.name}</h4>
                          <p className="text-xs text-gray-600">
                            {formatFileSize(file.size)} • {file.type.toUpperCase()} • {new Date(file.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="text-xs text-gray-600">v{file.version}</span>
                          {file.starred && <Star className="w-4 h-4 text-yellow-500" />}
                          {file.shared && <Share2 className="w-4 h-4 text-gray-400" />}
                        </div>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle more actions
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <div className="mt-2 ml-12">
                          <div className="bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-blue-600 h-1 rounded-full transition-all"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}