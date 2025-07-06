// components/dashboard/ProjectStatusCard.tsx
import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface ProjectStatusCardProps {
  project: {
    id: string;
    slug: string;
    name: string;
    status: string;
    unitsCount: number;
    soldUnitsCount: number;
    reservedUnitsCount: number;
    lastActivityDate?: string;
  };
  orgSlug: string;
}

const ProjectStatusCard: React.FC<ProjectStatusCardProps> = ({ project, orgSlug }) => {
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
  
  const salesPercentage = Math.round((project.soldUnitsCount / project.unitsCount) * 100);
  const reservedPercentage = Math.round((project.reservedUnitsCount / project.unitsCount) * 100);
  const availablePercentage = 100 - salesPercentage - reservedPercentage;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
            {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>
        <Link 
          href={`/${orgSlug}/projects/${project.slug}`}
          className="text-[#2B5273] hover:text-[#1E3142] text-sm font-medium flex items-center"
        >
          Details <FiArrowRight className="ml-1" />
        </Link>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Sales Status</span>
          <span>{project.soldUnitsCount} sold, {project.reservedUnitsCount} reserved, {project.unitsCount - project.soldUnitsCount - project.reservedUnitsCount} available</span>
        </div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${salesPercentage}%` }}
          ></div>
          <div 
            className="bg-yellow-500 h-full" 
            style={{ width: `${reservedPercentage}%` }}
          ></div>
          <div 
            className="bg-gray-200 h-full" 
            style={{ width: `${availablePercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
        <span>Total Units: {project.unitsCount}</span>
        {project.lastActivityDate && (
          <span>Last Activity: {new Date(project.lastActivityDate).toLocaleDateString()}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectStatusCard;