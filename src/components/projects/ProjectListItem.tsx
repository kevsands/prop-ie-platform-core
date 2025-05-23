'use client';

// components/projects/ProjectListItem.tsx
import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { IconType } from 'react-icons';

interface ProjectListItemProps {
  project: {
    id: string;
    slug: string;
    name: string;
    address: string;
    status: string;
    unitsCount?: number;
    soldUnitsCount?: number;
    startDate?: string;
    completionDate?: string;
  };
  orgSlug: string;
  onSelect: () => void;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project, orgSlug, onSelect }) => {
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
    <tr
      className="hover:bg-gray-50 cursor-pointer"
      onClick={onSelect}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{project.name}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-600">{project.address}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(project.status)}`}>
          {project.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {project.unitsCount !== undefined ? (
          <span>
            {project.soldUnitsCount !== undefined ? `${project.soldUnitsCount} / ` : ''}
            {project.unitsCount} units
          </span>
        ) : (
          <span>-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
        {project.startDate && project.completionDate ? (
          <span>
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.completionDate).toLocaleDateString()}
          </span>
        ) : project.startDate ? (
          <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
        ) : project.completionDate ? (
          <span>Due: {new Date(project.completionDate).toLocaleDateString()}</span>
        ) : (
          <span>-</span>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Link
          href={`/${orgSlug}/projects/${project.slug}`}
          className="text-[#2B5273] hover:text-[#1E3142] flex items-center justify-end"
          onClick={(e: any) => e.stopPropagation()}
        >
          Details <FiArrowRight className="ml-1" />
        </Link>
      </td>
    </tr>
  );
};

export default ProjectListItem;