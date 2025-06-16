'use client';

import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit, 
  Trash2, 
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
  Building
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive' | 'busy';
  joinDate: string;
  lastActivity: string;
  specialties: string[];
  currentTasks: number;
  completedTasks: number;
  location: string;
  hourlyRate?: number;
  department: 'design' | 'construction' | 'management';
}

interface TeamManagementProps {
  projectName: string;
  initialTeamMembers?: TeamMember[];
}

export default function TeamManagement({ projectName, initialTeamMembers = [] }: TeamManagementProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<'all' | 'design' | 'construction' | 'management'>('all');
  const [newMember, setNewMember] = useState({
    name: '',
    role: '',
    company: '',
    email: '',
    phone: '',
    department: 'design' as 'design' | 'construction' | 'management',
    specialties: '',
    location: '',
    hourlyRate: ''
  });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    busy: 'bg-amber-100 text-amber-800'
  };

  const departmentColors = {
    design: 'bg-blue-100 text-blue-800',
    construction: 'bg-orange-100 text-orange-800',
    management: 'bg-purple-100 text-purple-800'
  };

  const departmentIcons = {
    design: Badge,
    construction: Briefcase,
    management: Building
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || member.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const handleAddMember = () => {
    if (newMember.name && newMember.role && newMember.email) {
      const member: TeamMember = {
        id: `member-${Date.now()}`,
        name: newMember.name,
        role: newMember.role,
        company: newMember.company || 'Independent',
        email: newMember.email,
        phone: newMember.phone,
        status: 'active',
        joinDate: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        specialties: newMember.specialties.split(',').map(s => s.trim()).filter(Boolean),
        currentTasks: 0,
        completedTasks: 0,
        location: newMember.location,
        hourlyRate: newMember.hourlyRate ? parseFloat(newMember.hourlyRate) : undefined,
        department: newMember.department
      };
      
      setTeamMembers([...teamMembers, member]);
      setNewMember({
        name: '',
        role: '',
        company: '',
        email: '',
        phone: '',
        department: 'design',
        specialties: '',
        location: '',
        hourlyRate: ''
      });
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    setSelectedMember(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'busy':
        return <Clock size={16} className="text-amber-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getDepartmentStats = () => {
    const stats = {
      design: teamMembers.filter(m => m.department === 'design').length,
      construction: teamMembers.filter(m => m.department === 'construction').length,
      management: teamMembers.filter(m => m.department === 'management').length,
      total: teamMembers.length,
      active: teamMembers.filter(m => m.status === 'active').length
    };
    return stats;
  };

  const stats = getDepartmentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Team Management</h3>
          <p className="text-sm text-gray-600">{projectName} - Manage design and construction teams</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download size={16} />
            Export Team
          </button>
          <button 
            onClick={() => setShowAddMember(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} className="text-blue-600" />
            <span className="font-medium text-blue-800">Total Team</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Badge size={20} className="text-blue-600" />
            <span className="font-medium text-blue-800">Design</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats.design}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={20} className="text-orange-600" />
            <span className="font-medium text-orange-800">Construction</span>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.construction}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Building size={20} className="text-purple-600" />
            <span className="font-medium text-purple-800">Management</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats.management}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} className="text-green-600" />
            <span className="font-medium text-green-800">Active</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-500" />
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            <option value="design">Design Team</option>
            <option value="construction">Construction Team</option>
            <option value="management">Management</option>
          </select>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const DepartmentIcon = departmentIcons[member.department];
          return (
            <div key={member.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">{member.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                      <p className="text-xs text-gray-500">{member.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(member.status)}
                    <button 
                      onClick={() => setSelectedMember(member)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <MoreVertical size={16} className="text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Status and Department */}
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[member.status]}`}>
                    {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${departmentColors[member.department]}`}>
                    <DepartmentIcon size={12} className="inline mr-1" />
                    {member.department}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone size={14} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  {member.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={14} />
                      <span>{member.location}</span>
                    </div>
                  )}
                </div>

                {/* Specialties */}
                {member.specialties.length > 0 && (
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {specialty}
                        </span>
                      ))}
                      {member.specialties.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                          +{member.specialties.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{member.currentTasks}</p>
                    <p className="text-xs text-gray-600">Current Tasks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{member.completedTasks}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Add Team Member</h3>
                <button 
                  onClick={() => setShowAddMember(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={newMember.role}
                    onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Senior Architect"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={newMember.company}
                    onChange={(e) => setNewMember({...newMember, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Acme Architecture Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => setNewMember({...newMember, department: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="design">Design Team</option>
                    <option value="construction">Construction Team</option>
                    <option value="management">Management</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newMember.phone}
                    onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+353 21 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newMember.location}
                    onChange={(e) => setNewMember({...newMember, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dublin, Ireland"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate (€)</label>
                  <input
                    type="number"
                    value={newMember.hourlyRate}
                    onChange={(e) => setNewMember({...newMember, hourlyRate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="75"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={newMember.specialties}
                  onChange={(e) => setNewMember({...newMember, specialties: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Residential Design, Planning Applications, Building Regulations"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button 
                onClick={() => setShowAddMember(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Team Member Details</h3>
                <button 
                  onClick={() => setSelectedMember(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-xl font-medium">{selectedMember.name.charAt(0)}</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{selectedMember.name}</h4>
                <p className="text-gray-600">{selectedMember.role}</p>
                <p className="text-sm text-gray-500">{selectedMember.company}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Department</span>
                  <span className="font-medium">{selectedMember.department}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[selectedMember.status]}`}>
                    {selectedMember.status}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Current Tasks</span>
                  <span className="font-medium">{selectedMember.currentTasks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Completed Tasks</span>
                  <span className="font-medium">{selectedMember.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-gray-600">Join Date</span>
                  <span className="font-medium">{new Date(selectedMember.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button 
                onClick={() => handleRemoveMember(selectedMember.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Remove
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Edit size={16} />
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}