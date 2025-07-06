"use client";

import React, { useState } from 'react';
import { FiGrid, FiList, FiPlus, FiSearch, FiFilter } from 'react-icons/fi';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

// Define types for our project data
interface Project {
  id: string;
  name: string;
  address: string;
  slug: string;
  status: string;
  units: {
    total: number;
    sold: number;
  };
  timeline: {
    start: string;
    estimated_completion: string;
  };
  thumbnail?: string;
}

// Mock ProjectCard component
const ProjectCard = ({ 
  project, 
  orgSlug, 
  onSelect 
}: { 
  project: Project; 
  orgSlug: string; 
  onSelect: () => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'pre-construction':
        return 'bg-purple-100 text-purple-800';
      case 'construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'sales':
        return 'bg-cyan-100 text-cyan-800';
      case 'post-completion':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={onSelect}>
      <div className="h-48 bg-gray-200 relative">
        {project.thumbnail ? (
          <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#2B5273] mb-1">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{project.address}</p>
        <div className="flex justify-between text-sm">
          <div>
            <span className="text-gray-500">Units: </span>
            <span className="font-medium">{project.units.sold}/{project.units.total}</span>
          </div>
          <div>
            <span className="text-gray-500">Completion: </span>
            <span className="font-medium">{new Date(project.timeline.estimated_completion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock ProjectListItem component
const ProjectListItem = ({ 
  project, 
  orgSlug, 
  onSelect 
}: { 
  project: Project; 
  orgSlug: string; 
  onSelect: () => void;
}) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'pre-construction':
        return 'bg-purple-100 text-purple-800';
      case 'construction':
        return 'bg-yellow-100 text-yellow-800';
      case 'marketing':
        return 'bg-green-100 text-green-800';
      case 'sales':
        return 'bg-cyan-100 text-cyan-800';
      case 'post-completion':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 cursor-pointer" onClick={onSelect}>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-[#2B5273]">{project.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{project.address}</div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(project.status)}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1).replace('-', ' ')}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">{project.units.sold}/{project.units.total}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600">
          {new Date(project.timeline.start).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
          {new Date(project.timeline.estimated_completion).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </div>
      </td>
    </tr>
  );
};

// Mock useProjects hook with properly typed error
interface ProjectsHookResult {
  projects: Project[];
  isLoading: boolean;
  error: Error | null; // Properly typed error to include message property
}

const useProjects = (orgSlug: string): ProjectsHookResult => {
  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Oceanview Residences',
      address: 'Dublin, Ireland',
      slug: 'oceanview-residences',
      status: 'construction',
      units: {
        total: 24,
        sold: 16
      },
      timeline: {
        start: '2024-03-01',
        estimated_completion: '2025-08-30'
      },
      thumbnail: '/images/projects/oceanview.jpg'
    },
    // Other projects...
  ];

  return {
    projects: mockProjects,
    isLoading: false,
    error: null
  };
};

// Mock usePermissions hook
const usePermissions = () => {
  return {
    hasPermission: (resource: string, action: string) => {
      // For demo purposes, we'll allow all permissions
      return true;
    }
  };
};

export default function ProjectsPage() {
  const params = useParams();
  const router = useRouter();
  // Safe access to orgSlug with type assertion
  const orgSlug = typeof params?.orgSlug === 'string' ? params.orgSlug : 'prop';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { projects, isLoading, error } = useProjects(orgSlug);
  const { hasPermission } = usePermissions();
  
  const canCreateProject = hasPermission('projects', 'create');
  
  // Filter projects based on search and status
  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        project.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }) || [];
  
  if (isLoading) return <div className="p-10 text-center">Loading projects...</div>;
  // Now TypeScript knows that error can have a message property when it's not null
  if (error) return <div className="p-10 text-center text-red-600">Error loading projects: {error.message}</div>;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Rest of your component... */}
    </div>
  );
}