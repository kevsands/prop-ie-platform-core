"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FiHome, 
  FiUsers, 
  FiMap, 
  FiBarChart2, 
  FiCalendar, 
  FiPlus, 
  FiMoreVertical, 
  FiUserPlus,
  FiSearch,
  FiFilter
} from 'react-icons/fi';

// Define the interfaces
interface Project {
  id: string;
  name: string;
  location: string;
  totalUnits: number;
  availableUnits: number;
  completionDate: string;
  status: 'planning' | 'construction' | 'selling' | 'completed';
  image: string;
  agents: Agent[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

// Mock data using only images that exist in the project
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Fitzgerald Gardens',
    location: 'Dublin 15, Ireland',
    totalUnits: 45,
    availableUnits: 12,
    completionDate: '2023-09-30',
    status: 'selling',
    image: '/images/developments/fitzgerald-gardens/main.jpg',
    agents: [
      {
        id: 'a1',
        name: 'James Doyle',
        email: 'james.doyle@example.com',
        phone: '087-123-4567',
        company: 'Dublin Realty'
      }
    ]
  },
  {
    id: '2',
    name: 'Ballymakenny View',
    location: 'Drogheda, Co. Louth',
    totalUnits: 65,
    availableUnits: 30,
    completionDate: '2024-03-15',
    status: 'construction',
    image: '/images/developments/Ballymakenny-View/main.jpg',
    agents: []
  },
  {
    id: '3',
    name: 'Riverside Manor',
    location: 'Cork City, Ireland',
    totalUnits: 38,
    availableUnits: 0,
    completionDate: '2022-11-10',
    status: 'completed',
    image: '/images/developments/riverside-manor/main.jpg',
    agents: [
      {
        id: 'a2',
        name: 'Mary O\'Sullivan',
        email: 'mary.osullivan@example.com',
        phone: '085-987-6543',
        company: 'Cork Property Group'
      }
    ]
  }
];

export default function DeveloperProjects() {
  const [showInviteModalsetShowInviteModal] = useState(false);
  const [selectedProjectsetSelectedProject] = useState<Project | null>(null);
  const [statusFiltersetStatusFilter] = useState<'all' | Project['status']>('all');
  const [searchTermsetSearchTerm] = useState('');

  // Handle opening the invite agent modal
  const handleInviteAgent = (project: Project) => {
    setSelectedProject(project);
    setShowInviteModal(true);
  };

  // Filter projects by status and search term
  const filteredProjects = mockProjects.filter(project => {
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesSearch = 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      project.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status label and color
  const getStatusInfo = (status: Project['status']) => {
    switch (status) {
      case 'planning':
        return { label: 'Planning', color: 'bg-blue-100 text-blue-800' };
      case 'construction':
        return { label: 'Under Construction', color: 'bg-yellow-100 text-yellow-800' };
      case 'selling':
        return { label: 'Selling', color: 'bg-green-100 text-green-800' };
      case 'completed':
        return { label: 'Completed', color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="mt-1 text-sm text-gray-500">
            {filteredProjects.length} projects found
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3">
          <Link
            href="/developers/projects/new"
            className="px-4 py-2 bg-[#2B5273] text-white rounded-md flex items-center"
          >
            <FiPlus className="mr-2" />
            New Project
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 pr-4 py-2 border rounded-md w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | Project['status'])}
          className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-48"
        >
          <option value="all">All Statuses</option>
          <option value="planning">Planning</option>
          <option value="construction">Construction</option>
          <option value="selling">Selling</option>
          <option value="completed">Completed</option>
        </select>
        <FiFilter className="absolute left-3 top-3 text-gray-400 hidden sm:block" style={ marginLeft: '15px', marginTop: '45px' } />
      </div>

      <div className="grid gap-6">
        {filteredProjects.map(project => {
          const statusInfo = getStatusInfo(project.status);

          return (
            <div 
              key={project.id} 
              className="bg-white rounded-lg shadow overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 h-48 md:h-auto relative">
                <img 
                  src={project.image} 
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-[#2B5273] mb-1">{project.name}</h2>
                    <p className="text-gray-600 text-sm mb-4">{project.location}</p>
                  </div>

                  <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-100">
                      <FiMoreVertical />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500 text-sm">Total Units</p>
                    <p className="font-medium">{project.totalUnits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Available</p>
                    <p className="font-medium">{project.availableUnits}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Completion</p>
                    <p className="font-medium">{formatDate(project.completionDate)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Sales Agent</p>
                    <p className="font-medium">
                      {project.agents.length> 0 
                        ? project.agents[0].name 
                        : 'None assigned'}
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                  <Link
                    href={`/developers/projects/${project.id}`}
                    className="px-4 py-2 bg-[#2B5273] text-white rounded-md flex items-center text-sm"
                  >
                    <FiBarChart2 className="mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href={`/developers/projects/${project.id}/units`}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center text-sm"
                  >
                    <FiHome className="mr-2" />
                    Units
                  </Link>
                  <Link
                    href={`/developers/projects/${project.id}/sales`}
                    className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md flex items-center text-sm"
                  >
                    <FiUsers className="mr-2" />
                    Buyers
                  </Link>
                  <button
                    onClick={() => handleInviteAgent(project)}
                    className="px-4 py-2 bg-white border border-[#2B5273] text-[#2B5273] rounded-md flex items-center text-sm"
                  >
                    <FiUserPlus className="mr-2" />
                    {project.agents.length> 0 ? 'Change Agent' : 'Invite Agent'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Invite Agent Modal */}
      {showInviteModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Invite Agent</h2>
            <p className="mb-4">
              <span className="font-medium">Project:</span> {selectedProject.name}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agent Email
              </label>
              <input
                type="email"
                className="w-full border rounded-md p-2"
                placeholder="agent@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                className="w-full border rounded-md p-2 h-24"
                placeholder="Add a personal message..."
              ></textarea>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert("Invitation sent!");
                  setShowInviteModal(false);
                }
                className="px-4 py-2 bg-[#2B5273] text-white rounded-md"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 