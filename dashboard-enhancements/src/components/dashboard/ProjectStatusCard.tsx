"use client";

import React from 'react';
import Link from 'next/link';

interface ProjectStatus {
  id: string;
  name: string;
  progress: number;
  status: string;
  category: string;
  dueDate?: string;
  image?: string;
}

interface ProjectStatusCardProps {
  project: ProjectStatus;
  orgSlug?: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ 
  project, 
  orgSlug = 'prop' 
}) => {
  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planning': return 'bg-purple-100 text-purple-800';
      case 'in progress': 
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'under construction': 
      case 'under_construction': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'on hold': 
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format the due date if it exists
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-IE', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Get category badge color
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'residential': return 'bg-indigo-100 text-indigo-800';
      case 'commercial': return 'bg-teal-100 text-teal-800';
      case 'mixed-use': 
      case 'mixed_use': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-pink-100 text-pink-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Project Image (if available) */}
      {project.image && (
        <div className="relative h-32 overflow-hidden">
          <img 
            src={project.image} 
            alt={project.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${getCategoryColor(project.category)}`}>
              {project.category}
            </span>
          </div>
        </div>
      )}
      
      {/* Project Details */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {project.name}
          </h3>
          <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="h-2.5 rounded-full bg-blue-600" 
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Due Date (if available) */}
        {project.dueDate && (
          <div className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Due:</span> {formatDueDate(project.dueDate)}
          </div>
        )}
        
        {/* Link to Project Details */}
        <Link 
          href={`/${orgSlug}/projects/${project.id}`}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Details
          <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default ProjectStatusCard;