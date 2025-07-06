'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
// Temporarily comment out problematic imports for build testing
// import { 
//   Tabs, 
//   TabsContent, 
//   TabsList, 
//   TabsTrigger 
// } from '@/components/ui/tabs';
import { 
  Building, 
  LayoutDashboard, 
  FileText, 
  Users, 
  CreditCard, 
  Map,
  Calendar,
  Settings,
  MessagesSquare
} from 'lucide-react';
// import ProjectOverview from '@/components/dashboard/ProjectOverview';

const ProjectPage = () => {
  const params = useParams();
  const projectId = params.id as string;
  
  // Project data query
  const { data: projectData, isLoading } = useQuery({
    queryKey: ['project-details', projectId],
    queryFn: async () => {
      // In production, fetch from API
      // For demo purposes, we'll return mock data
      return {
        id: projectId,
        name: 'Fitzgerald Gardens',
        description: 'Luxury residential development with 45 units',
        location: 'Drogheda, Co. Louth'
      };
    },
    enabled: !!projectId
  });

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-6">
        {/* Project header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-slate-800">
              {projectData?.name || 'Project Details'}
            </h1>
          </div>
          
          {/* Tab buttons - simplified for build testing */}
          <div className="flex space-x-2 overflow-x-auto border-b border-gray-200 pb-2">
            <button className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md font-medium">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Building className="h-4 w-4 mr-2" />
              Units
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Users className="h-4 w-4 mr-2" />
              Team
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <CreditCard className="h-4 w-4 mr-2" />
              Finance
            </button>
            <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">
              <Map className="h-4 w-4 mr-2" />
              Site Plan
            </button>
          </div>
        </div>

        {/* Simplified project overview */}
        <div className="bg-white border rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Project Overview</h2>
            <div className="bg-amber-100 px-3 py-1 rounded-md text-amber-800 text-sm">
              Simplified View
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-2">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Project Name</p>
                      <p>{projectData?.name || 'Fitzgerald Gardens'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p>{projectData?.location || 'Drogheda, Co. Louth'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p>In Construction</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Completion</p>
                      <p>65% Complete</p>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Project Description</h3>
                  <p className="text-gray-600">{projectData?.description || 'Luxury residential development with 45 units featuring modern amenities and sustainable design principles.'}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Total Units</p>
                    <p className="text-2xl font-semibold">45</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Units Sold</p>
                    <p className="text-2xl font-semibold">32</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Units Available</p>
                    <p className="text-2xl font-semibold">13</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-100 p-4 rounded-md mt-6 text-amber-800">
            <p className="font-medium">Temporarily simplified for build testing</p>
            <p className="text-sm">The complete project overview with interactive components will be restored later.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;