"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiHome, FiCalendar, FiUser, FiInfo } from 'react-icons/fi';
import type { IconBaseProps } from 'react-icons';

interface ProjectBasicInfoProps {
  onSubmit: (data: ProjectBasicInfoData) => void;
  initialData?: ProjectBasicInfoData;
}

export interface ProjectBasicInfoData {
  name: string;
  location: string;
  type: string;
  estimatedStartDate: string;
  estimatedCompletionDate: string;
  projectManager: string;
  description: string;
}

const projectTypes = [
  { id: 'residential', name: 'Residential' },
  { id: 'commercial', name: 'Commercial' },
  { id: 'mixed', name: 'Mixed Use' },
  { id: 'industrial', name: 'Industrial' },
  { id: 'infrastructure', name: 'Infrastructure' }
];

const ProjectBasicInfo: React.FC<ProjectBasicInfoProps> = ({ onSubmit, initialData }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectBasicInfoData>({
    defaultValues: initialData || {
      name: '',
      location: '',
      type: 'residential',
      estimatedStartDate: '',
      estimatedCompletionDate: '',
      projectManager: '',
      description: ''
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Project Basic Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiHome({ className: "text-gray-400" })}
              </div>
              <input
                id="name"
                type="text"
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                placeholder="Enter project name"
                {...register('name', { required: 'Project name is required' })}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Project Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiMapPin({ className: "text-gray-400" })}
              </div>
              <input
                id="location"
                type="text"
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.location ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                placeholder="Enter project location"
                {...register('location', { required: 'Location is required' })}
              />
            </div>
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              Project Type*
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiHome({ className: "text-gray-400" })}
              </div>
              <select
                id="type"
                className={`pl-10 w-full py-2 px-3 border ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]`}
                {...register('type', { required: 'Project type is required' })}
              >
                {projectTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Project Manager */}
          <div>
            <label htmlFor="projectManager" className="block text-sm font-medium text-gray-700 mb-1">
              Project Manager
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiUser({ className: "text-gray-400" })}
              </div>
              <input
                id="projectManager"
                type="text"
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                placeholder="Enter project manager name"
                {...register('projectManager')}
              />
            </div>
          </div>

          {/* Estimated Start Date */}
          <div>
            <label htmlFor="estimatedStartDate" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiCalendar({ className: "text-gray-400" })}
              </div>
              <input
                id="estimatedStartDate"
                type="date"
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                {...register('estimatedStartDate')}
              />
            </div>
          </div>

          {/* Estimated Completion Date */}
          <div>
            <label htmlFor="estimatedCompletionDate" className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Completion Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {FiCalendar({ className: "text-gray-400" })}
              </div>
              <input
                id="estimatedCompletionDate"
                type="date"
                className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
                {...register('estimatedCompletionDate')}
              />
            </div>
          </div>
        </div>

        {/* Project Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Project Description
          </label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              {FiInfo({ className: "text-gray-400" })}
            </div>
            <textarea
              id="description"
              rows={4}
              className="pl-10 w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B5273]"
              placeholder="Enter project description"
              {...register('description')}
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-[#2B5273] text-white rounded-md hover:bg-[#1E3142] transition-colors"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectBasicInfo;