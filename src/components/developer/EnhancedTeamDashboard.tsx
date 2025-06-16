'use client';

import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  MoreVertical, 
  Badge, 
  Briefcase, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  UserCheck,
  Search,
  Filter,
  Download,
  X,
  Plus,
  Building,
  MessageSquare,
  Video,
  Star,
  Award,
  Target,
  TrendingUp,
  Activity,
  FileText,
  Zap,
  Shield,
  Settings
} from 'lucide-react';
import { realDataService } from '@/services/RealDataService';
import { fitzgeraldGardensConfig } from '@/data/fitzgerald-gardens-config';

interface EnhancedTeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'busy';
  department: 'design' | 'construction' | 'sales' | 'management';
  specialties: string[];
  currentTasks: number;
  completedTasks: number;
  joinDate: Date;
  lastActivity: Date;
  location: string;
  hourlyRate?: number;
  performance: {
    rating: number;
    completionRate: number;
    responseTime: number; // hours
    collaboration: number;
  };
  workload: {
    current: number;
    capacity: number;
    upcomingDeadlines: number;
  };
  isRealContact: boolean;
}

interface Task {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  category: string;
  description: string;
  estimatedHours: number;
  actualHours?: number;
}

export default function EnhancedTeamDashboard() {
  const [viewMode, setViewMode] = useState<'overview' | 'members' | 'tasks' | 'performance'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<EnhancedTeamMember | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);

  // Get real data and enhance with additional information
  const config = fitzgeraldGardensConfig;
  const realTeamMembers = realDataService.getRealTeamMembers();

  // Enhance team members with additional enterprise data
  const enhancedTeamMembers: EnhancedTeamMember[] = useMemo(() => {
    const realMembers: EnhancedTeamMember[] = realTeamMembers.map(member => ({
      ...member,
      specialties: member.role === 'Lead Architect' ? ['Residential Design', 'Planning Applications', 'BIM Modeling'] :
                  member.role === 'Site Manager' ? ['Site Management', 'Health & Safety', 'Quality Control'] :
                  ['General Management'],
      hourlyRate: member.role === 'Lead Architect' ? 85 :
                  member.role === 'Site Manager' ? 75 : 65,
      performance: {
        rating: 4.2 + Math.random() * 0.8,
        completionRate: 85 + Math.random() * 15,
        responseTime: 2 + Math.random() * 4,
        collaboration: 80 + Math.random() * 20
      },
      workload: {
        current: Math.floor(Math.random() * 30) + 10,
        capacity: 40,
        upcomingDeadlines: Math.floor(Math.random() * 5) + 1
      },
      isRealContact: true
    }));

    // Add template team members for a complete team structure
    const templateMembers: EnhancedTeamMember[] = [
      {
        id: 'member-template-1',
        name: 'Michael Walsh',
        role: 'Structural Engineer',
        company: 'Walsh Engineering',
        email: 'mwalsh@walsheng.ie',
        phone: '+353 21 234 5678',
        status: 'active',
        department: 'design',
        specialties: ['Structural Analysis', 'Foundation Design', 'Building Regulations'],
        currentTasks: 3,
        completedTasks: 12,
        joinDate: new Date('2024-02-01'),
        lastActivity: new Date('2025-06-14'),
        location: 'Cork, Ireland',
        hourlyRate: 95,
        performance: {
          rating: 4.6,
          completionRate: 92,
          responseTime: 1.5,
          collaboration: 88
        },
        workload: {
          current: 25,
          capacity: 40,
          upcomingDeadlines: 2
        },
        isRealContact: false
      },
      {
        id: 'member-template-2',
        name: 'Emma Kelly',
        role: 'Interior Designer',
        company: 'Kelly Interiors',
        email: 'emma@kellyint.ie',
        phone: '+353 21 345 6789',
        status: 'busy',
        department: 'design',
        specialties: ['Interior Design', 'Space Planning', 'Material Selection'],
        currentTasks: 6,
        completedTasks: 18,
        joinDate: new Date('2024-03-10'),
        lastActivity: new Date('2025-06-13'),
        location: 'Cork, Ireland',
        hourlyRate: 65,
        performance: {
          rating: 4.4,
          completionRate: 89,
          responseTime: 3.2,
          collaboration: 85
        },
        workload: {
          current: 35,
          capacity: 40,
          upcomingDeadlines: 4
        },
        isRealContact: false
      },
      {
        id: 'member-template-3',
        name: 'David Ryan',
        role: 'Project Manager',
        company: 'Ryan Build Ltd',
        email: 'dryan@ryanbuild.ie',
        phone: '+353 21 567 8901',
        status: 'active',
        department: 'management',
        specialties: ['Project Management', 'Schedule Planning', 'Cost Control'],
        currentTasks: 8,
        completedTasks: 25,
        joinDate: new Date('2024-01-20'),
        lastActivity: new Date('2025-06-14'),
        location: 'Cork, Ireland',
        hourlyRate: 80,
        performance: {
          rating: 4.7,
          completionRate: 94,
          responseTime: 2.1,
          collaboration: 92
        },
        workload: {
          current: 32,
          capacity: 45,
          upcomingDeadlines: 3
        },
        isRealContact: false
      }
    ];

    return [...realMembers, ...templateMembers];
  }, [realTeamMembers]);

  // Generate realistic tasks for the project
  const projectTasks: Task[] = useMemo(() => [
    {
      id: 'task-1',
      title: 'Structural Framework Review Phase 2',
      assignee: 'Michael Walsh',
      status: 'in_progress',
      priority: 'high',
      dueDate: new Date('2025-06-20'),
      category: 'Engineering',
      description: 'Review and approve structural plans for Phase 2 construction',
      estimatedHours: 16,
      actualHours: 8
    },
    {
      id: 'task-2',
      title: 'Interior Design Specifications',
      assignee: 'Emma Kelly',
      status: 'in_progress',
      priority: 'medium',
      dueDate: new Date('2025-06-25'),
      category: 'Design',
      description: 'Finalize interior design specifications for show units',
      estimatedHours: 24,
      actualHours: 12
    },
    {
      id: 'task-3',
      title: 'Safety Compliance Audit',
      assignee: 'Patrick Murphy',
      status: 'todo',
      priority: 'critical',
      dueDate: new Date('2025-06-18'),
      category: 'Safety',
      description: 'Conduct monthly safety compliance audit and documentation',
      estimatedHours: 8
    },
    {
      id: 'task-4',
      title: 'Project Timeline Update',
      assignee: 'David Ryan',
      status: 'review',
      priority: 'high',
      dueDate: new Date('2025-06-17'),
      category: 'Management',
      description: 'Update project timeline based on current progress',
      estimatedHours: 4,
      actualHours: 4
    },
    {
      id: 'task-5',
      title: 'Architectural Drawing Revisions',
      assignee: 'Sarah O\'Connor',
      status: 'completed',
      priority: 'medium',
      dueDate: new Date('2025-06-10'),
      category: 'Architecture',
      description: 'Revise architectural drawings based on client feedback',
      estimatedHours: 12,
      actualHours: 10
    }
  ], []);

  // Filter team members
  const filteredMembers = useMemo(() => {
    return enhancedTeamMembers.filter(member => {
      const matchesSearch = searchTerm === '' || 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.company.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      
      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [enhancedTeamMembers, searchTerm, departmentFilter, statusFilter]);

  // Calculate team statistics
  const teamStats = useMemo(() => {
    const total = enhancedTeamMembers.length;
    const active = enhancedTeamMembers.filter(m => m.status === 'active').length;
    const busy = enhancedTeamMembers.filter(m => m.status === 'busy').length;
    const avgRating = enhancedTeamMembers.reduce((sum, m) => sum + m.performance.rating, 0) / total;
    const avgCompletion = enhancedTeamMembers.reduce((sum, m) => sum + m.performance.completionRate, 0) / total;
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const overdueTasks = projectTasks.filter(t => t.dueDate < new Date() && t.status !== 'completed').length;
    
    return {
      total,
      active,
      busy,
      avgRating,
      avgCompletion,
      totalTasks,
      completedTasks,
      overdueTasks
    };
  }, [enhancedTeamMembers, projectTasks]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-amber-100 text-amber-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'design': return 'text-purple-600';
      case 'construction': return 'text-blue-600';
      case 'sales': return 'text-green-600';
      case 'management': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enhanced Team Dashboard</h2>
          <p className="text-gray-600">Real-time team collaboration for {config.projectName}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['overview', 'members', 'tasks', 'performance'].map((mode) => (
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
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        </div>
      </div>

      {/* Team Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Team</p>
              <p className="text-2xl font-bold text-gray-900">{teamStats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{teamStats.active} active members</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Rating</p>
              <p className="text-2xl font-bold text-green-600">{teamStats.avgRating.toFixed(1)}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Average performance</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Task Completion</p>
              <p className="text-2xl font-bold text-green-600">{teamStats.avgCompletion.toFixed(0)}%</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Average completion rate</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Tasks</p>
              <p className="text-2xl font-bold text-blue-600">{teamStats.totalTasks - teamStats.completedTasks}</p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">{teamStats.completedTasks} completed</p>
        </div>

        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue Tasks</p>
              <p className="text-2xl font-bold text-red-600">{teamStats.overdueTasks}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Require attention</p>
        </div>
      </div>

      {/* Search and Filters */}
      {(viewMode === 'members' || viewMode === 'overview') && (
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              <option value="design">Design</option>
              <option value="construction">Construction</option>
              <option value="sales">Sales</option>
              <option value="management">Management</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="busy">Busy</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      )}

      {/* Overview Dashboard */}
      {viewMode === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Key Team Members */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Team Members</h3>
            <div className="space-y-4">
              {filteredMembers.filter(m => m.isRealContact).map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{member.name}</h4>
                      <Badge className="w-3 h-3 text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-600">{member.role} • {member.company}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                      <span className="text-xs text-gray-500">{member.currentTasks} active tasks</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{member.performance.rating.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Tasks</h3>
            <div className="space-y-3">
              {projectTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'completed' ? 'bg-green-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' :
                    task.status === 'review' ? 'bg-purple-500' : 'bg-gray-400'
                  }`}></div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">Assigned to {task.assignee}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      {task.dueDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Members View */}
      {viewMode === 'members' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role & Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Workload
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium text-gray-900">{member.name}</div>
                            {member.isRealContact && <Badge className="w-3 h-3 text-blue-600" />}
                          </div>
                          <div className="text-sm text-gray-500">{member.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                      <div className="text-sm text-gray-500">{member.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{member.performance.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500">{member.performance.completionRate.toFixed(0)}% completion</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.workload.current}/{member.workload.capacity}h</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${(member.workload.current / member.workload.capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <Phone className="w-4 h-4" />
                        <MessageSquare className="w-4 h-4" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tasks View */}
      {viewMode === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                <Plus size={16} />
                Add Task
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['todo', 'in_progress', 'review', 'completed'].map((status) => {
                const statusTasks = projectTasks.filter(t => t.status === status);
                return (
                  <div key={status} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3 capitalize">{status.replace('_', ' ')}</h4>
                    <div className="space-y-3">
                      {statusTasks.map((task) => (
                        <div key={task.id} className="bg-white p-3 rounded-lg border">
                          <div className="flex items-start justify-between mb-2">
                            <h5 className="font-medium text-gray-900 text-sm">{task.title}</h5>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                          <div className="text-xs text-gray-500">
                            <div>Assigned: {task.assignee}</div>
                            <div>Due: {task.dueDate.toLocaleDateString()}</div>
                            <div>Est: {task.estimatedHours}h {task.actualHours && `• Actual: ${task.actualHours}h`}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Performance View */}
      {viewMode === 'performance' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
            <div className="space-y-4">
              {enhancedTeamMembers
                .sort((a, b) => b.performance.rating - a.performance.rating)
                .slice(0, 5)
                .map((member, index) => (
                  <div key={member.id} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="font-semibold">{member.performance.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-gray-500">{member.performance.completionRate.toFixed(0)}% completion</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Workload</h3>
            <div className="space-y-4">
              {enhancedTeamMembers.map((member) => {
                const workloadPercentage = (member.workload.current / member.workload.capacity) * 100;
                return (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      <span className="text-sm text-gray-600">{member.workload.current}/{member.workload.capacity}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          workloadPercentage > 90 ? 'bg-red-500' :
                          workloadPercentage > 75 ? 'bg-amber-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(workloadPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}