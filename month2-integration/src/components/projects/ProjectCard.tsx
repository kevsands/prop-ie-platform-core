'use client';

// components/projects/ProjectCard.tsx
import React from 'react';
import Link from 'next/link';
import { FiHome, FiArrowRight } from 'react-icons/fi';
import { FeatherIcon } from '@/components/ui/feather-icon';

interface ProjectCardProps {
  project: {
    id: string;
    slug: string;
    name: string;
    address: string;
    status: string;
    unitsCount?: number;
    soldUnitsCount?: number;
    imageUrl?: string;
  };
  orgSlug: string;
  onSelect: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, orgSlug, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning':
        return 'bg-yellow-100 text-yellow-800';
      case 'pre-construction':
        return 'bg-orange-100 text-orange-800';
      case 'construction':
        return 'bg-blue-100 text-blue-800';
      case 'marketing':
        return 'bg-purple-100 text-purple-800';
      case 'sales':
        return 'bg-green-100 text-green-800';
      case 'post-completion':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onSelect}
    >
      <div className="h-40 bg-gray-200 relative">
        {project.imageUrl ? (
          <img 
            src={project.imageUrl} 
            alt={project.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FeatherIcon icon={FiHome} className="h-12 w-12 text-gray-400" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{project.address}</p>
        
        {project.unitsCount !== undefined && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {project.soldUnitsCount} / {project.unitsCount} units sold
            </span>
            <Link 
              href={`/${orgSlug}/projects/${project.slug}`}
              className="text-blue-600 hover:text-blue-800 flex items-center"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
              <FeatherIcon icon={FiArrowRight} className="ml-1 h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;