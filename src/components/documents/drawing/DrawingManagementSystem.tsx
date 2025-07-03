'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Layers, 
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit3,
  Trash2,
  Copy,
  Share2,
  Archive,
  RotateCcw,
  Grid,
  List,
  Calendar,
  User,
  Building2,
  Ruler,
  Zap,
  TreePine,
  Hammer,
  CheckCircle,
  AlertTriangle,
  Clock,
  Star,
  Tag,
  FolderOpen,
  FileText,
  Image,
  Settings
} from 'lucide-react';

// Drawing categories for Irish construction
const DRAWING_CATEGORIES = {
  architectural: {
    name: 'Architectural Drawings',
    description: 'Building design, floor plans, elevations, sections',
    icon: <Building2 className="w-5 h-5" />,
    color: 'blue',
    subcategories: [
      'Site Plans (A0xx)',
      'Floor Plans (A1xx)', 
      'Elevations (A2xx)',
      'Sections (A3xx)',
      'Details (A9xx)'
    ]
  },
  structural: {
    name: 'Structural Drawings',
    description: 'Foundation plans, framing, structural details',
    icon: <Hammer className="w-5 h-5" />,
    color: 'gray',
    subcategories: [
      'Foundation Plans (S1xx)',
      'Framing Plans (S2xx)',
      'Structural Details (S9xx)'
    ]
  },
  civil: {
    name: 'Civil Engineering',
    description: 'Site infrastructure, drainage, roads',
    icon: <Ruler className="w-5 h-5" />,
    color: 'green',
    subcategories: [
      'Site Survey (C0xx)',
      'Site Layout (C1xx)',
      'Drainage (C2xx)',
      'Roads & Parking (C3xx)'
    ]
  },
  mechanical: {
    name: 'Mechanical & Electrical',
    description: 'HVAC, plumbing, electrical systems',
    icon: <Zap className="w-5 h-5" />,
    color: 'yellow',
    subcategories: [
      'Electrical Plans (E1xx)',
      'Mechanical Plans (M1xx)',
      'Plumbing Plans (P1xx)',
      'Fire Safety (FS1xx)'
    ]
  },
  landscape: {
    name: 'Landscape Architecture',
    description: 'Landscaping, external works, planting',
    icon: <TreePine className="w-5 h-5" />,
    color: 'green',
    subcategories: [
      'Landscape Plans (L1xx)',
      'Planting Plans (L2xx)',
      'External Works (L3xx)'
    ]
  }
};

// Drawing types and phases
const DRAWING_PHASES = {
  concept: { name: 'Concept Design', prefix: 'CD', color: 'purple' },
  preliminary: { name: 'Preliminary Design', prefix: 'PD', color: 'blue' },
  detailed: { name: 'Detailed Design', prefix: 'DD', color: 'indigo' },
  construction: { name: 'Construction', prefix: 'CD', color: 'green' },
  as_built: { name: 'As-Built', prefix: 'AB', color: 'gray' }
};

// Sample drawing data
const SAMPLE_DRAWINGS = [
  {
    id: 'dwg-001',
    number: 'A101',
    title: 'Ground Floor Plan',
    category: 'architectural',
    subcategory: 'Floor Plans (A1xx)',
    phase: 'construction',
    version: '1.3',
    status: 'approved',
    scale: '1:100',
    size: 'A1',
    drawnBy: 'Cork Architecture Partners',
    checkedBy: 'Senior Architect',
    approvedBy: 'Planning Authority',
    dateCreated: '2025-06-15T09:00:00Z',
    dateRevised: '2025-07-01T14:30:00Z',
    projectId: 'fitzgerald-gardens',
    fileFormat: 'dwg',
    fileSize: 2500000,
    revisions: [
      { version: '1.3', date: '2025-07-01T14:30:00Z', description: 'Updated kitchen layouts per client feedback' },
      { version: '1.2', date: '2025-06-28T11:15:00Z', description: 'Structural engineer comments incorporated' },
      { version: '1.1', date: '2025-06-20T16:45:00Z', description: 'Planning authority requirements added' }
    ],
    tags: ['ground-floor', 'residential', 'approved'],
    linkedDocuments: ['A201', 'S101'],
    notes: 'Approved for construction. All planning conditions satisfied.'
  },
  {
    id: 'dwg-002',
    number: 'S102',
    title: 'Foundation Plan',
    category: 'structural',
    subcategory: 'Foundation Plans (S1xx)',
    phase: 'construction',
    version: '2.1',
    status: 'approved',
    scale: '1:50',
    size: 'A1',
    drawnBy: 'Murphy & Associates Engineers',
    checkedBy: 'Structural Engineer',
    approvedBy: 'Building Control',
    dateCreated: '2025-06-10T10:30:00Z',
    dateRevised: '2025-07-02T09:15:00Z',
    projectId: 'fitzgerald-gardens',
    fileFormat: 'dwg',
    fileSize: 1800000,
    revisions: [
      { version: '2.1', date: '2025-07-02T09:15:00Z', description: 'Foundation depths adjusted for ground conditions' },
      { version: '2.0', date: '2025-06-25T13:20:00Z', description: 'Geotechnical report recommendations incorporated' }
    ],
    tags: ['foundation', 'structural', 'approved'],
    linkedDocuments: ['A101', 'C101'],
    notes: 'Foundation design approved by Building Control. Ready for construction.'
  },
  {
    id: 'dwg-003',
    number: 'E101',
    title: 'Electrical Layout - Ground Floor',
    category: 'mechanical',
    subcategory: 'Electrical Plans (E1xx)',
    phase: 'detailed',
    version: '1.0',
    status: 'under_review',
    scale: '1:100',
    size: 'A1',
    drawnBy: 'Electrical Consultants Ltd',
    checkedBy: 'Electrical Engineer',
    approvedBy: null,
    dateCreated: '2025-07-01T11:00:00Z',
    dateRevised: null,
    projectId: 'fitzgerald-gardens',
    fileFormat: 'dwg',
    fileSize: 1200000,
    revisions: [],
    tags: ['electrical', 'ground-floor', 'review'],
    linkedDocuments: ['A101', 'M101'],
    notes: 'Under review by ESB Networks for connection approval.'
  },
  {
    id: 'dwg-004',
    number: 'L101',
    title: 'Landscape Master Plan',
    category: 'landscape',
    subcategory: 'Landscape Plans (L1xx)',
    phase: 'preliminary',
    version: '0.3',
    status: 'draft',
    scale: '1:200',
    size: 'A0',
    drawnBy: 'Green Spaces Landscape Architects',
    checkedBy: 'Landscape Architect',
    approvedBy: null,
    dateCreated: '2025-06-20T15:30:00Z',
    dateRevised: '2025-06-28T10:45:00Z',
    projectId: 'fitzgerald-gardens',
    fileFormat: 'dwg',
    fileSize: 3200000,
    revisions: [
      { version: '0.3', date: '2025-06-28T10:45:00Z', description: 'Tree species selection updated for Irish climate' },
      { version: '0.2', date: '2025-06-25T14:20:00Z', description: 'Planning feedback incorporated' }
    ],
    tags: ['landscape', 'master-plan', 'draft'],
    linkedDocuments: ['A001', 'C201'],
    notes: 'Awaiting final approval from planning authority landscape consultant.'
  }
];

// Schedule of accommodation template
const ACCOMMODATION_SCHEDULE_TEMPLATE = {
  'fitzgerald-gardens': {
    projectName: 'Fitzgerald Gardens',
    totalUnits: 15,
    totalGFA: 1650, // sqm
    totalSiteArea: 8000, // sqm
    units: [
      {
        unitNumber: '1-01',
        unitType: '2-bed apartment',
        floor: 'Ground',
        bedrooms: 2,
        bathrooms: 2,
        livingAreas: 1,
        floorArea: 85.5,
        balconyArea: 12.0,
        storageArea: 3.5,
        totalArea: 101.0,
        parkingSpaces: 1,
        orientation: 'South-West'
      },
      {
        unitNumber: '1-02',
        unitType: '3-bed apartment',
        floor: 'Ground',
        bedrooms: 3,
        bathrooms: 2,
        livingAreas: 1,
        floorArea: 105.2,
        balconyArea: 15.0,
        storageArea: 4.0,
        totalArea: 124.2,
        parkingSpaces: 2,
        orientation: 'South'
      },
      {
        unitNumber: '2-01',
        unitType: '2-bed apartment',
        floor: 'First',
        bedrooms: 2,
        bathrooms: 2,
        livingAreas: 1,
        floorArea: 85.5,
        balconyArea: 12.0,
        storageArea: 3.5,
        totalArea: 101.0,
        parkingSpaces: 1,
        orientation: 'South-West'
      },
      {
        unitNumber: 'PH-01',
        unitType: '3-bed penthouse',
        floor: 'Third',
        bedrooms: 3,
        bathrooms: 2,
        livingAreas: 1,
        floorArea: 120.8,
        balconyArea: 25.0,
        storageArea: 5.0,
        totalArea: 150.8,
        parkingSpaces: 2,
        orientation: 'South-East'
      }
    ]
  }
};

interface DrawingManagementSystemProps {
  onClose?: () => void;
  onSave?: (data: any) => void;
  projectId?: string;
}

export default function DrawingManagementSystem({
  onClose,
  onSave,
  projectId
}: DrawingManagementSystemProps) {
  const [activeTab, setActiveTab] = useState<'drawings' | 'schedule' | 'revisions' | 'coordination'>('drawings');
  const [drawings, setDrawings] = useState<any[]>([]);
  const [coordinationMatrix, setCoordinationMatrix] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedDrawings, setSelectedDrawings] = useState<string[]>([]);

  // Load drawings when component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      loadDrawings();
      if (activeTab === 'coordination') {
        loadCoordinationMatrix();
      }
    }
  }, [projectId, activeTab]);

  const loadDrawings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/documents/drawings', {
        params: {
          projectId: projectId,
          category: filterCategory !== 'all' ? filterCategory : undefined
        }
      });
      setDrawings(response.data.data);
    } catch (error) {
      console.error('Error loading drawings:', error);
      setDrawings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoordinationMatrix = async () => {
    try {
      const response = await axios.get('/api/documents/drawings', {
        params: {
          projectId: projectId,
          action: 'coordination'
        }
      });
      setCoordinationMatrix(response.data.data);
    } catch (error) {
      console.error('Error loading coordination matrix:', error);
      setCoordinationMatrix(null);
    }
  };

  const createDrawing = async (drawingData: any) => {
    try {
      const response = await axios.post('/api/documents/drawings', {
        ...drawingData,
        projectId: projectId,
        createdBy: 'current-user-id' // Replace with actual user ID
      });
      
      // Refresh drawings list
      await loadDrawings();
      
      if (onSave) {
        onSave(response.data.data);
      }
    } catch (error) {
      console.error('Error creating drawing:', error);
      alert('Failed to create drawing. Please try again.');
    }
  };

  const createRevision = async (drawingId: string, revisionData: any) => {
    try {
      const response = await axios.post('/api/documents/drawings', {
        action: 'createRevision',
        drawingId: drawingId,
        ...revisionData,
        revisedBy: 'current-user-id' // Replace with actual user ID
      });
      
      // Refresh drawings list
      await loadDrawings();
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating revision:', error);
      alert('Failed to create revision. Please try again.');
      throw error;
    }
  };

  const filteredDrawings = drawings.filter(drawing => {
    const matchesSearch = drawing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         drawing.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || drawing.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || drawing.status === filterStatus;
    const matchesProject = !projectId || drawing.projectId === projectId;
    return matchesSearch && matchesCategory && matchesStatus && matchesProject;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'under_review': return 'bg-amber-100 text-amber-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'superseded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'under_review': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'draft': return <Edit3 className="w-4 h-4 text-gray-600" />;
      case 'rejected': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'superseded': return <Archive className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const accommodationSchedule = projectId ? ACCOMMODATION_SCHEDULE_TEMPLATE[projectId] : null;

  return (
    <div className="max-w-7xl mx-auto bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Drawing Management System</h1>
                <p className="text-gray-600">Comprehensive drawing and accommodation schedule management</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Upload className="w-4 h-4" />
                Upload Drawings
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                <Plus className="w-4 h-4" />
                New Drawing Set
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex items-center gap-6 mt-4">
            {[
              { id: 'drawings', label: 'Technical Drawings', icon: <Layers className="w-4 h-4" /> },
              { id: 'schedule', label: 'Schedule of Accommodation', icon: <Building2 className="w-4 h-4" /> },
              { id: 'revisions', label: 'Revision Management', icon: <RotateCcw className="w-4 h-4" /> },
              { id: 'coordination', label: 'Drawing Coordination', icon: <Share2 className="w-4 h-4" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Technical Drawings Tab */}
        {activeTab === 'drawings' && (
          <div className="space-y-6">
            {/* Filters and Search */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search drawings..."
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {Object.entries(DRAWING_CATEGORIES).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="under_review">Under Review</option>
                <option value="draft">Draft</option>
              </select>
              
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawing Categories Overview */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Drawing Categories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Object.entries(DRAWING_CATEGORIES).map(([key, category]) => {
                  const categoryDrawings = drawings.filter(d => d.category === key);
                  return (
                    <div 
                      key={key} 
                      className={`bg-${category.color}-50 border border-${category.color}-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => setFilterCategory(key)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                          {category.icon}
                        </div>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full bg-${category.color}-100 text-${category.color}-800`}>
                          {categoryDrawings.length}
                        </span>
                      </div>
                      <h4 className={`font-medium text-${category.color}-900 mb-1`}>{category.name}</h4>
                      <p className={`text-xs text-${category.color}-700`}>{category.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Drawings List/Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Technical Drawings ({filteredDrawings.length})
                </h3>
                {selectedDrawings.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{selectedDrawings.length} selected</span>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-800">
                      <Archive className="w-3 h-3" />
                      Archive
                    </button>
                  </div>
                )}
              </div>

              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredDrawings.map(drawing => {
                    const category = DRAWING_CATEGORIES[drawing.category];
                    const phase = DRAWING_PHASES[drawing.phase];
                    return (
                      <div key={drawing.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className={`w-10 h-10 bg-${category.color}-100 rounded-lg flex items-center justify-center`}>
                            {category.icon}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            {getStatusIcon(drawing.status)}
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{drawing.number}</h4>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">v{drawing.version}</span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{drawing.title}</p>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drawing.status)}`}>
                              {drawing.status.replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded bg-${phase.color}-100 text-${phase.color}-800`}>
                              {phase.name}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-1 text-xs text-gray-600 mb-3">
                          <div>Scale: {drawing.scale} • Size: {drawing.size}</div>
                          <div>Format: {drawing.fileFormat.toUpperCase()} • {formatFileSize(drawing.fileSize)}</div>
                          <div>By: {drawing.drawnBy}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            {new Date(drawing.dateRevised || drawing.dateCreated).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="text-blue-600 hover:text-blue-800">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-green-600 hover:text-green-800">
                              <Download className="w-4 h-4" />
                            </button>
                            <button className="text-indigo-600 hover:text-indigo-800">
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Drawing</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Category</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Version</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Modified</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDrawings.map((drawing, index) => {
                        const category = DRAWING_CATEGORIES[drawing.category];
                        return (
                          <tr key={drawing.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <div className={`w-8 h-8 bg-${category.color}-100 rounded flex items-center justify-center`}>
                                  {category.icon}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{drawing.number}</div>
                                  <div className="text-sm text-gray-600">{drawing.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{category.name}</td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-medium">v{drawing.version}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drawing.status)}`}>
                                {getStatusIcon(drawing.status)}
                                <span className="ml-1">{drawing.status.replace('_', ' ')}</span>
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">
                              {new Date(drawing.dateRevised || drawing.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="text-green-600 hover:text-green-800">
                                  <Download className="w-4 h-4" />
                                </button>
                                <button className="text-indigo-600 hover:text-indigo-800">
                                  <Edit3 className="w-4 h-4" />
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
        )}

        {/* Schedule of Accommodation Tab */}
        {activeTab === 'schedule' && accommodationSchedule && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Schedule of Accommodation</h3>
                <p className="text-gray-600">{accommodationSchedule.projectName}</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Schedule
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Edit3 className="w-4 h-4" />
                  Edit Schedule
                </button>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <h4 className="font-semibold text-indigo-900 mb-4">Project Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{accommodationSchedule.totalUnits}</div>
                  <div className="text-sm text-gray-600">Total Units</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{accommodationSchedule.totalGFA.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total GFA (m²)</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{accommodationSchedule.totalSiteArea.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Site Area (m²)</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">{(accommodationSchedule.totalGFA / accommodationSchedule.totalSiteArea * 100).toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Plot Ratio</div>
                </div>
              </div>
            </div>

            {/* Unit Schedule Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h4 className="font-semibold text-gray-900">Unit Schedule</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Unit</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Floor</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Beds</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Baths</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Floor Area (m²)</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Balcony (m²)</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total (m²)</th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-900">Parking</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Orientation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accommodationSchedule.units.map((unit, index) => (
                      <tr key={unit.unitNumber} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium text-gray-900">{unit.unitNumber}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{unit.unitType}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{unit.floor}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{unit.bedrooms}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{unit.bathrooms}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{unit.floorArea}</td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">{unit.balconyArea}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-900">{unit.totalArea}</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-900">{unit.parkingSpaces}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{unit.orientation}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-indigo-50">
                    <tr>
                      <td colSpan={5} className="px-4 py-3 text-right font-semibold text-indigo-900">Totals:</td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-900">
                        {accommodationSchedule.units.reduce((sum, unit) => sum + unit.floorArea, 0).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-900">
                        {accommodationSchedule.units.reduce((sum, unit) => sum + unit.balconyArea, 0).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-indigo-900">
                        {accommodationSchedule.units.reduce((sum, unit) => sum + unit.totalArea, 0).toFixed(1)}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-900">
                        {accommodationSchedule.units.reduce((sum, unit) => sum + unit.parkingSpaces, 0)}
                      </td>
                      <td className="px-4 py-3"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Unit Type Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['2-bed apartment', '3-bed apartment', '3-bed penthouse'].map(unitType => {
                const units = accommodationSchedule.units.filter(u => u.unitType === unitType);
                const avgArea = units.length > 0 ? units.reduce((sum, u) => sum + u.totalArea, 0) / units.length : 0;
                
                return (
                  <div key={unitType} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h5 className="font-semibold text-gray-900 mb-3">{unitType}</h5>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Units:</span>
                        <div className="font-medium">{units.length}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Area:</span>
                        <div className="font-medium">{avgArea.toFixed(1)} m²</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Area:</span>
                        <div className="font-medium">{units.reduce((sum, u) => sum + u.totalArea, 0).toFixed(1)} m²</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Parking:</span>
                        <div className="font-medium">{units.reduce((sum, u) => sum + u.parkingSpaces, 0)} spaces</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Revision Management Tab */}
        {activeTab === 'revisions' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Revision Management</h3>
            
            <div className="space-y-4">
              {drawings.filter(d => d.revisions.length > 0).map(drawing => (
                <div key={drawing.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{drawing.number} - {drawing.title}</h4>
                      <p className="text-sm text-gray-600">Current version: {drawing.version}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drawing.status)}`}>
                        {drawing.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {drawing.revisions.map((revision, index) => (
                      <div key={revision.version} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === 0 ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {revision.version}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-gray-900">Version {revision.version}</div>
                            <div className="text-sm text-gray-600">{new Date(revision.date).toLocaleDateString()}</div>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{revision.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Download className="w-4 h-4" />
                          </button>
                          {index !== 0 && (
                            <button className="text-purple-600 hover:text-purple-800">
                              <RotateCcw className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Drawing Coordination Tab */}
        {activeTab === 'coordination' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Drawing Coordination</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-4">Cross-Reference Matrix</h4>
              <p className="text-blue-800 mb-4">
                This matrix shows the relationships and dependencies between different drawing sets.
                Ensure all linked drawings are coordinated before finalizing designs.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drawings.filter(d => d.linkedDocuments.length > 0).map(drawing => (
                  <div key={drawing.id} className="bg-white rounded-lg p-4">
                    <div className="font-medium text-gray-900 mb-2">{drawing.number} - {drawing.title}</div>
                    <div className="text-sm text-gray-600 mb-2">Linked to:</div>
                    <div className="space-y-1">
                      {drawing.linkedDocuments.map(linkedDoc => (
                        <div key={linkedDoc} className="flex items-center gap-2">
                          <Share2 className="w-3 h-3 text-blue-600" />
                          <span className="text-sm text-blue-700">{linkedDoc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}