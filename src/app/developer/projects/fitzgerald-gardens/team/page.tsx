'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  ArrowLeft,
  Calendar,
  MapPin,
  Award,
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Edit,
  CheckCircle,
  Eye,
  Briefcase,
  Target
} from 'lucide-react';
import Link from 'next/link';

export default function FitzgeraldGardensTeamPage() {
  const [activeTabsetActiveTab] = useState('overview');
  const [searchTermsetSearchTerm] = useState('');
  const [selectedRolesetSelectedRole] = useState('all');

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: 'Project Manager',
      department: 'Management',
      email: 'sarah.chen@company.ie',
      phone: '+353 1 234 5678',
      status: 'active',
      avatar: null,
      joinDate: '2024-08-15',
      lastActive: '2025-06-15T14:30:00Z',
      location: 'Dublin Office',
      specializations: ['Project Management', 'Planning', 'Stakeholder Management'],
      currentTasks: 8,
      completedTasks: 45,
      workload: 85,
      certifications: ['PMP', 'PRINCE2'],
      yearsExperience: 12,
      projects: ['Fitzgerald Gardens', 'Phoenix Park Residences'],
      emergencyContact: '+353 87 123 4567'
    },
    {
      id: 2,
      name: 'Michael Burke',
      role: 'Site Manager',
      department: 'Construction',
      email: 'michael.burke@company.ie',
      phone: '+353 1 234 5679',
      status: 'active',
      avatar: null,
      joinDate: '2024-09-01',
      lastActive: '2025-06-15T16:45:00Z',
      location: 'Fitzgerald Gardens Site',
      specializations: ['Site Management', 'Safety Compliance', 'Quality Control'],
      currentTasks: 12,
      completedTasks: 38,
      workload: 95,
      certifications: ['CSCS', 'IOSH', 'First Aid'],
      yearsExperience: 15,
      projects: ['Fitzgerald Gardens'],
      emergencyContact: '+353 87 234 5678'
    },
    {
      id: 3,
      name: 'Emma Walsh',
      role: 'Marketing Lead',
      department: 'Sales & Marketing',
      email: 'emma.walsh@company.ie',
      phone: '+353 1 234 5680',
      status: 'active',
      avatar: null,
      joinDate: '2024-07-10',
      lastActive: '2025-06-15T13:20:00Z',
      location: 'Dublin Office',
      specializations: ['Digital Marketing', 'Content Creation', 'Brand Management'],
      currentTasks: 6,
      completedTasks: 52,
      workload: 70,
      certifications: ['Google Analytics', 'HubSpot'],
      yearsExperience: 8,
      projects: ['Fitzgerald Gardens', 'Dun Laoghaire Waterfront'],
      emergencyContact: '+353 87 345 6789'
    },
    {
      id: 4,
      name: 'David O\'Connor',
      role: 'Safety Officer',
      department: 'Health & Safety',
      email: 'david.oconnor@company.ie',
      phone: '+353 1 234 5681',
      status: 'busy',
      avatar: null,
      joinDate: '2024-06-01',
      lastActive: '2025-06-15T12:15:00Z',
      location: 'Fitzgerald Gardens Site',
      specializations: ['Safety Management', 'Risk Assessment', 'Training'],
      currentTasks: 15,
      completedTasks: 67,
      workload: 100,
      certifications: ['NEBOSH', 'IOSH', 'Risk Assessment'],
      yearsExperience: 20,
      projects: ['Fitzgerald Gardens', 'Galway Bay Development'],
      emergencyContact: '+353 87 456 7890'
    },
    {
      id: 5,
      name: 'Lisa Zhang',
      role: 'Financial Controller',
      department: 'Finance',
      email: 'lisa.zhang@company.ie',
      phone: '+353 1 234 5682',
      status: 'away',
      avatar: null,
      joinDate: '2024-05-15',
      lastActive: '2025-06-14T17:30:00Z',
      location: 'Dublin Office',
      specializations: ['Financial Planning', 'Budget Management', 'Cost Control'],
      currentTasks: 4,
      completedTasks: 78,
      workload: 60,
      certifications: ['ACCA', 'CPA'],
      yearsExperience: 14,
      projects: ['Fitzgerald Gardens', 'Cork City Centre'],
      emergencyContact: '+353 87 567 8901'
    },
    {
      id: 6,
      name: 'James Murphy',
      role: 'Quality Inspector',
      department: 'Quality Assurance',
      email: 'james.murphy@company.ie',
      phone: '+353 1 234 5683',
      status: 'offline',
      avatar: null,
      joinDate: '2024-10-01',
      lastActive: '2025-06-13T15:45:00Z',
      location: 'Fitzgerald Gardens Site',
      specializations: ['Quality Control', 'Building Standards', 'Compliance'],
      currentTasks: 9,
      completedTasks: 23,
      workload: 80,
      certifications: ['Building Control Inspector', 'Quality Management'],
      yearsExperience: 10,
      projects: ['Fitzgerald Gardens'],
      emergencyContact: '+353 87 678 9012'
    }
  ];

  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.status === 'active').length,
    averageWorkload: Math.round(teamMembers.reduce((accmember) => acc + member.workload0) / teamMembers.length),
    totalTasks: teamMembers.reduce((accmember) => acc + member.currentTasks0),
    completedTasks: teamMembers.reduce((accmember) => acc + member.completedTasks0)
  };

  const departments = [
    { name: 'Management', count: 1, color: 'bg-blue-100 text-blue-800' },
    { name: 'Construction', count: 1, color: 'bg-orange-100 text-orange-800' },
    { name: 'Sales & Marketing', count: 1, color: 'bg-purple-100 text-purple-800' },
    { name: 'Health & Safety', count: 1, color: 'bg-red-100 text-red-800' },
    { name: 'Finance', count: 1, color: 'bg-green-100 text-green-800' },
    { name: 'Quality Assurance', count: 1, color: 'bg-yellow-100 text-yellow-800' }
  ];

  const upcomingMeetings = [
    { title: 'Weekly Project Review', date: '2025-06-16', time: '10:00', attendees: ['Sarah Chen', 'Michael Burke', 'David O\'Connor'] },
    { title: 'Safety Training Session', date: '2025-06-18', time: '14:00', attendees: ['All Site Staff'] },
    { title: 'Marketing Campaign Review', date: '2025-06-19', time: '15:30', attendees: ['Emma Walsh', 'Sarah Chen'] },
    { title: 'Financial Review Q2', date: '2025-06-20', time: '11:00', attendees: ['Lisa Zhang', 'Sarah Chen'] }
  ];

  const recentActivity = [
    { user: 'Michael Burke', action: 'completed safety inspection', target: 'Phase 2 Foundation', time: '2 hours ago' },
    { user: 'Emma Walsh', action: 'updated marketing materials', target: 'Unit Availability', time: '4 hours ago' },
    { user: 'David O\'Connor', action: 'filed incident report', target: 'Minor Safety Issue', time: '6 hours ago' },
    { user: 'Lisa Zhang', action: 'approved budget revision', target: 'Phase 3 Materials', time: '1 day ago' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-400';
      case 'busy': return 'bg-yellow-400';
      case 'away': return 'bg-orange-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getWorkloadColor = (workload) => {
    if (workload>= 90) return 'text-red-600';
    if (workload>= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || member.department === selectedRole;
    return matchesSearch && matchesRole;
  });

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
                <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
                <p className="text-sm text-gray-500">Fitzgerald Gardens - Team Members & Collaboration</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                Team Chat
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Team Overview' },
                { key: 'members', label: 'Team Members' },
                { key: 'departments', label: 'Departments' },
                { key: 'schedule', label: 'Schedule & Meetings' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Team Stats */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Members</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats.totalMembers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Now</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats.activeMembers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Target className="w-8 h-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Avg Workload</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats.averageWorkload}%</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats.totalTasks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Award className="w-8 h-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{teamStats.completedTasks}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Departments Overview */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Team by Department</h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4">
                      {departments.map((deptindex) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium text-gray-900">{dept.name}</p>
                            <p className="text-sm text-gray-500">{dept.count} member{dept.count !== 1 ? 's' : ''}</p>
                          </div>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${dept.color}`}>
                            {dept.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activityindex) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">{activity.user}</span> {activity.action} <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search team members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Departments</option>
                      {departments.map((dept) => (
                        <option key={dept.name} value={dept.name}>{dept.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium text-gray-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-900">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-xs text-gray-500">{member.department}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{member.phone}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{member.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span>{member.currentTasks} active tasks</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Workload</span>
                        <span className={`font-medium ${getWorkloadColor(member.workload)}`}>{member.workload}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            member.workload>= 90 ? 'bg-red-600' :
                            member.workload>= 75 ? 'bg-yellow-600' :
                            'bg-green-600'
                          }`}
                          style={ width: `${member.workload}%` }
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Departments Tab */}
        {activeTab === 'departments' && (
          <div className="space-y-6">
            {departments.map((deptindex) => {
              const deptMembers = teamMembers.filter(member => member.department === dept.name);
              return (
                <div key={index} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-medium text-gray-900">{dept.name}</h2>
                        <p className="text-sm text-gray-500">{deptMembers.length} team member{deptMembers.length !== 1 ? 's' : ''}</p>
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dept.color}`}>
                        {deptMembers.length} member{deptMembers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {deptMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-700">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.name}</p>
                              <p className="text-sm text-gray-600">{member.role}</p>
                              <p className="text-xs text-gray-500">{member.yearsExperience} years experience</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">{member.currentTasks} tasks</p>
                              <p className={`text-xs ${getWorkloadColor(member.workload)}`}>{member.workload}% workload</p>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
                <p className="text-sm text-gray-500 mt-1">Team meetings and scheduled events</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {upcomingMeetings.map((meetingindex) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-8 h-8 text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">{meeting.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span>{meeting.date}</span>
                            <span>{meeting.time}</span>
                            <span>{Array.isArray(meeting.attendees) ? meeting.attendees.join(', ') : meeting.attendees}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                          Join
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}