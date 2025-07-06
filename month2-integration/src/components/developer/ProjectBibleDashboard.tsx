'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  RefreshCw, 
  Settings, 
  Filter, 
  Search,
  Eye,
  Edit,
  Trash2,
  Plus,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
  Building,
  DollarSign,
  Target,
  Database,
  FileSpreadsheet,
  FilePlus,
  BookOpen,
  Layers,
  MapPin,
  Award,
  Briefcase,
  Home,
  Activity,
  Zap,
  Star,
  Globe,
  Shield,
  Archive,
  Share2,
  Printer,
  Clipboard,
  CheckSquare,
  AlertTriangle,
  Info
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
import { ProjectBibleData, ProjectBibleExport, DocumentTemplate } from '@/types/projectBible';
import { projectBibleService } from '@/services/ProjectBibleService';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';

interface ProjectBibleDashboardProps {
  projectId: string;
}

interface SectionStatus {
  sectionId: string;
  name: string;
  status: 'complete' | 'in-progress' | 'not-started' | 'outdated';
  lastUpdated: Date;
  completeness: number;
  criticalIssues: number;
  owner: string;
}

interface DocumentGenerationTask {
  taskId: string;
  documentType: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  progress: number;
  estimatedTime?: number;
  fileSize?: number;
  downloadUrl?: string;
  error?: string;
}

export default function ProjectBibleDashboard({ projectId }: ProjectBibleDashboardProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'sections' | 'documents' | 'export' | 'import'>('overview');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [projectBible, setProjectBible] = useState<ProjectBibleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [generationTasks, setGenerationTasks] = useState<DocumentGenerationTask[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Load project bible data
  const loadProjectBible = useCallback(async () => {
    setIsLoading(true);
    try {
      const bible = await projectBibleService.getProjectBible(projectId);
      setProjectBible(bible);
    } catch (error) {
      console.error('Error loading project bible:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Load data on component mount
  React.useEffect(() => {
    loadProjectBible();
  }, [loadProjectBible]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    try {
      const bible = await projectBibleService.importExcelData(file, projectId);
      setProjectBible(bible);
      setUploadFile(null);
    } catch (error) {
      console.error('Error importing file:', error);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Generate document export
  const handleDocumentGeneration = useCallback(async (
    format: 'pdf' | 'excel' | 'word', 
    sections: string[]
  ) => {
    const taskId = `task-${Date.now()}`;
    const newTask: DocumentGenerationTask = {
      taskId,
      documentType: `Project Bible (${format.toUpperCase()})`,
      status: 'queued',
      progress: 0,
      estimatedTime: 30000 // 30 seconds
    };

    setGenerationTasks(prev => [...prev, newTask]);

    try {
      // Update task to generating
      setGenerationTasks(prev => 
        prev.map(t => t.taskId === taskId ? { ...t, status: 'generating', progress: 25 } : t)
      );

      const exportOptions: ProjectBibleExport = {
        format,
        sections,
        includeGraphics: true,
        includeRawData: false,
        confidentialityLevel: 'commercial'
      };

      // Simulate generation progress
      setTimeout(() => {
        setGenerationTasks(prev => 
          prev.map(t => t.taskId === taskId ? { ...t, progress: 75 } : t)
        );
      }, 15000);

      const blob = await projectBibleService.generateProjectBible(projectId, exportOptions);
      
      // Create download URL
      const downloadUrl = URL.createObjectURL(blob);
      
      setGenerationTasks(prev => 
        prev.map(t => t.taskId === taskId ? { 
          ...t, 
          status: 'completed', 
          progress: 100,
          fileSize: blob.size,
          downloadUrl 
        } : t)
      );

    } catch (error) {
      console.error('Error generating document:', error);
      setGenerationTasks(prev => 
        prev.map(t => t.taskId === taskId ? { 
          ...t, 
          status: 'failed', 
          error: error.message 
        } : t)
      );
    }
  }, [projectId]);

  // Calculate section statuses
  const sectionStatuses: SectionStatus[] = useMemo(() => {
    if (!projectBible) return [];

    return [
      {
        sectionId: 'summary',
        name: 'Project Summary',
        status: 'complete',
        lastUpdated: projectBible.lastUpdated,
        completeness: 95,
        criticalIssues: 0,
        owner: 'Project Manager'
      },
      {
        sectionId: 'soa',
        name: 'Schedule of Accommodations',
        status: 'complete',
        lastUpdated: projectBible.scheduleOfAccommodations.lastUpdated,
        completeness: 88,
        criticalIssues: 2,
        owner: 'Lead Architect'
      },
      {
        sectionId: 'programme',
        name: 'Programme Roadmap',
        status: 'in-progress',
        lastUpdated: projectBible.programmeRoadmap.lastUpdated,
        completeness: 72,
        criticalIssues: 1,
        owner: 'Project Manager'
      },
      {
        sectionId: 'milestones',
        name: 'Milestone Checklist',
        status: 'in-progress',
        lastUpdated: projectBible.milestoneChecklist.lastUpdated,
        completeness: 65,
        criticalIssues: 3,
        owner: 'Site Manager'
      },
      {
        sectionId: 'appointments',
        name: 'Appointments & Fees',
        status: 'complete',
        lastUpdated: projectBible.appointmentsAndFees.lastUpdated,
        completeness: 92,
        criticalIssues: 0,
        owner: 'Commercial Manager'
      },
      {
        sectionId: 'sales',
        name: 'Sales Tracker',
        status: 'complete',
        lastUpdated: projectBible.salesTracker.lastUpdated,
        completeness: 98,
        criticalIssues: 0,
        owner: 'Sales Director'
      },
      {
        sectionId: 'team',
        name: 'Team Structure',
        status: 'complete',
        lastUpdated: projectBible.teamStructure.lastUpdated,
        completeness: 85,
        criticalIssues: 1,
        owner: 'HR Manager'
      },
      {
        sectionId: 'documents',
        name: 'Document Library',
        status: 'in-progress',
        lastUpdated: projectBible.documentLibrary.lastUpdated,
        completeness: 45,
        criticalIssues: 5,
        owner: 'Document Controller'
      }
    ];
  }, [projectBible]);

  // Filter sections
  const filteredSections = useMemo(() => {
    return sectionStatuses.filter(section => {
      const matchesSearch = searchTerm === '' || 
        section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.owner.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || section.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    });
  }, [sectionStatuses, searchTerm, filterStatus]);

  // Calculate overall metrics
  const overallMetrics = useMemo(() => {
    if (sectionStatuses.length === 0) return null;

    const avgCompleteness = sectionStatuses.reduce((sum, s) => sum + s.completeness, 0) / sectionStatuses.length;
    const totalIssues = sectionStatuses.reduce((sum, s) => sum + s.criticalIssues, 0);
    const completeSections = sectionStatuses.filter(s => s.status === 'complete').length;
    const upToDateSections = sectionStatuses.filter(s => {
      const daysSinceUpdate = (new Date().getTime() - s.lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceUpdate <= 7;
    }).length;

    return {
      avgCompleteness,
      totalIssues,
      completeSections,
      upToDateSections,
      totalSections: sectionStatuses.length
    };
  }, [sectionStatuses]);

  // Generate progress chart data
  const progressChartData = useMemo(() => {
    return sectionStatuses.map(section => ({
      name: section.name.split(' ')[0], // Abbreviate for chart
      completeness: section.completeness,
      issues: section.criticalIssues,
      color: section.status === 'complete' ? '#10B981' : 
             section.status === 'in-progress' ? '#F59E0B' : '#EF4444'
    }));
  }, [sectionStatuses]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not-started': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'outdated': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle size={16} className="text-green-600" />;
      case 'in-progress': return <Clock size={16} className="text-yellow-600" />;
      case 'not-started': return <AlertCircle size={16} className="text-gray-600" />;
      case 'outdated': return <AlertTriangle size={16} className="text-red-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'queued': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !projectBible) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading project bible...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Project Bible Dashboard</h2>
              <p className="text-gray-600">Comprehensive project documentation & management</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'sections', 'documents', 'export', 'import'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 rounded text-sm transition-colors capitalize ${
                  viewMode === mode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          
          <button 
            onClick={loadProjectBible}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Overview Dashboard */}
      {viewMode === 'overview' && overallMetrics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Completeness</p>
                  <p className="text-3xl font-bold text-blue-600">{overallMetrics.avgCompleteness.toFixed(0)}%</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 size={24} className="text-blue-600" />
                </div>
              </div>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${overallMetrics.avgCompleteness}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Complete Sections</p>
                  <p className="text-3xl font-bold text-green-600">
                    {overallMetrics.completeSections}/{overallMetrics.totalSections}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {((overallMetrics.completeSections / overallMetrics.totalSections) * 100).toFixed(0)}% of sections
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Critical Issues</p>
                  <p className={`text-3xl font-bold ${overallMetrics.totalIssues > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {overallMetrics.totalIssues}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  overallMetrics.totalIssues > 0 ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  {overallMetrics.totalIssues > 0 ? 
                    <AlertTriangle size={24} className="text-red-600" /> :
                    <Shield size={24} className="text-green-600" />
                  }
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Require attention</p>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Up to Date</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {overallMetrics.upToDateSections}/{overallMetrics.totalSections}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock size={24} className="text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Updated this week</p>
            </div>
          </div>

          {/* Progress Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Completeness</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={progressChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'completeness' ? `${value}%` : value,
                      name === 'completeness' ? 'Completeness' : 'Issues'
                    ]}
                  />
                  <Bar dataKey="completeness" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Section Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={[
                      { name: 'Complete', value: sectionStatuses.filter(s => s.status === 'complete').length, color: '#10B981' },
                      { name: 'In Progress', value: sectionStatuses.filter(s => s.status === 'in-progress').length, color: '#F59E0B' },
                      { name: 'Not Started', value: sectionStatuses.filter(s => s.status === 'not-started').length, color: '#6B7280' },
                      { name: 'Outdated', value: sectionStatuses.filter(s => s.status === 'outdated').length, color: '#EF4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''}
                  >
                    {[
                      { name: 'Complete', value: sectionStatuses.filter(s => s.status === 'complete').length, color: '#10B981' },
                      { name: 'In Progress', value: sectionStatuses.filter(s => s.status === 'in-progress').length, color: '#F59E0B' },
                      { name: 'Not Started', value: sectionStatuses.filter(s => s.status === 'not-started').length, color: '#6B7280' },
                      { name: 'Outdated', value: sectionStatuses.filter(s => s.status === 'outdated').length, color: '#EF4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity & Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Updates</h3>
              <div className="space-y-3">
                {sectionStatuses
                  .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
                  .slice(0, 5)
                  .map((section) => (
                    <div key={section.sectionId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      {getStatusIcon(section.status)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{section.name}</h4>
                        <p className="text-sm text-gray-600">
                          Updated {Math.floor((new Date().getTime() - section.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))} days ago by {section.owner}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">{section.completeness}%</div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Issues</h3>
              <div className="space-y-3">
                {sectionStatuses
                  .filter(s => s.criticalIssues > 0)
                  .sort((a, b) => b.criticalIssues - a.criticalIssues)
                  .map((section) => (
                    <div key={section.sectionId} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <AlertTriangle size={16} className="text-red-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{section.name}</h4>
                        <p className="text-sm text-red-600">
                          {section.criticalIssues} critical issue{section.criticalIssues !== 1 ? 's' : ''} requiring attention
                        </p>
                      </div>
                      <button className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700">
                        Resolve
                      </button>
                    </div>
                  ))}
                {sectionStatuses.filter(s => s.criticalIssues > 0).length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-green-500 mx-auto mb-2" />
                    <p className="text-gray-600">No critical issues found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sections Management */}
      {viewMode === 'sections' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="complete">Complete</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
                <option value="outdated">Outdated</option>
              </select>
            </div>
          </div>

          {/* Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSections.map((section) => (
              <div key={section.sectionId} className="bg-white rounded-lg border hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{section.name}</h3>
                      <p className="text-sm text-gray-600">Owner: {section.owner}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(section.status)}`}>
                      {section.status.replace('-', ' ')}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Completeness</span>
                        <span className="text-sm text-gray-600">{section.completeness}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all ${
                            section.completeness >= 90 ? 'bg-green-500' :
                            section.completeness >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${section.completeness}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Updated</span>
                      <span className="text-gray-900">
                        {Math.floor((new Date().getTime() - section.lastUpdated.getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                    </div>

                    {section.criticalIssues > 0 && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                        <AlertTriangle size={14} className="text-red-600" />
                        <span className="text-sm text-red-800">
                          {section.criticalIssues} critical issue{section.criticalIssues !== 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                    <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center justify-center gap-1">
                      <Eye size={14} />
                      View
                    </button>
                    <button className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50 flex items-center justify-center gap-1">
                      <Edit size={14} />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Export */}
      {viewMode === 'export' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Export Options */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Project Bible</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { format: 'pdf', icon: FileText, label: 'PDF' },
                      { format: 'excel', icon: FileSpreadsheet, label: 'Excel' },
                      { format: 'word', icon: FilePlus, label: 'Word' }
                    ].map(({ format, icon: Icon, label }) => (
                      <button
                        key={format}
                        onClick={() => handleDocumentGeneration(format as any, ['all'])}
                        className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 flex flex-col items-center gap-2 transition-colors"
                      >
                        <Icon size={24} className="text-gray-600" />
                        <span className="text-sm font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {sectionStatuses.map((section) => (
                      <label key={section.sectionId} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{section.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(section.status)}`}>
                          {section.status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <button
                    onClick={() => handleDocumentGeneration('pdf', sectionStatuses.map(s => s.sectionId))}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <Download size={16} />
                    Generate Complete Project Bible
                  </button>
                </div>
              </div>
            </div>

            {/* Generation Status */}
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Generation Status</h3>
              
              {generationTasks.length === 0 ? (
                <div className="text-center py-8">
                  <Archive className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">No export tasks yet</p>
                  <p className="text-sm text-gray-500">Generate a document to see progress here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generationTasks.map((task) => (
                    <div key={task.taskId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.documentType}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.status === 'generating' || task.status === 'queued' ? (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-600">{task.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all"
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                          {task.estimatedTime && (
                            <p className="text-xs text-gray-500 mt-1">
                              Estimated time: {Math.floor(task.estimatedTime / 1000)}s
                            </p>
                          )}
                        </div>
                      ) : task.status === 'completed' ? (
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {task.fileSize && `File size: ${(task.fileSize / 1024 / 1024).toFixed(1)} MB`}
                          </div>
                          {task.downloadUrl && (
                            <a
                              href={task.downloadUrl}
                              download
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center gap-1"
                            >
                              <Download size={14} />
                              Download
                            </a>
                          )}
                        </div>
                      ) : task.status === 'failed' ? (
                        <div className="text-sm text-red-600">
                          Error: {task.error}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Import Data */}
      {viewMode === 'import' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Project Data</h3>
            
            <div className="space-y-6">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Project Bible Excel File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setUploadFile(file);
                    }}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">Excel files (.xlsx, .xls) up to 10MB</p>
                  </label>
                </div>
                
                {uploadFile && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet size={16} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">{uploadFile.name}</span>
                        <span className="text-xs text-blue-600">
                          ({(uploadFile.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFileUpload(uploadFile)}
                          disabled={isLoading}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                        >
                          {isLoading ? <RefreshCw size={14} className="animate-spin" /> : <Upload size={14} />}
                          Import
                        </button>
                        <button
                          onClick={() => setUploadFile(null)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Import Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Sync with External Systems</h4>
                  <p className="text-sm text-gray-600 mb-3">Connect with project management tools</p>
                  <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Globe size={16} />
                    Connect
                  </button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Auto-Generate from Config</h4>
                  <p className="text-sm text-gray-600 mb-3">Create bible from existing project data</p>
                  <button 
                    onClick={loadProjectBible}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    Generate
                  </button>
                </div>

                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Import from Template</h4>
                  <p className="text-sm text-gray-600 mb-3">Use predefined project templates</p>
                  <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 flex items-center justify-center gap-2">
                    <Clipboard size={16} />
                    Templates
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}