'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
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
  MessagesSquare,
  Images
} from 'lucide-react';
// import ProjectOverview from '@/components/dashboard/ProjectOverview';

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id: projectId } = await params;

  return <ProjectPageClient projectId={projectId} />\n  );
}

// Dynamically import the MediaManager component to reduce initial page load
const MediaManager = dynamic(() => import('@/components/media/MediaManager'), {
  loading: () => <div className="p-12 text-center">Loading Media Manager...</div>,
  ssr: false
});

function ProjectPageClient({ projectId }: { projectId: string }) {
  // Active tab state
  const [activeTabsetActiveTab] = useState<string>('overview');

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

          {/* Tab buttons */}
          <div className="flex space-x-2 overflow-x-auto border-b border-gray-200 pb-2">
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'overview' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Overview
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'units' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('units')}
            >
              <Building className="h-4 w-4 mr-2" />
              Units
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'media' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('media')}
            >
              <Images className="h-4 w-4 mr-2" />
              Media
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'documents' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'team' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('team')}
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'finance' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('finance')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Finance
            </button>
            <button 
              className={`flex items-center px-3 py-2 rounded-md font-medium ${
                activeTab === 'site-plan' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab('site-plan')}
            >
              <Map className="h-4 w-4 mr-2" />
              Site Plan
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
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
        )}

        {/* Media Tab Content */}
        {activeTab === 'media' && (
          <div className="bg-white border rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Project Media</h2>
                <div className="text-sm text-gray-500">
                  Manage development images, floor plans, and brochures
                </div>
              </div>
            </div>

            <div className="p-6">
              <MediaManager
                categories={[
                  { id: 'development-images', name: 'Development Images', files: [] },
                  { id: 'floor-plans', name: 'Floor Plans', files: [] },
                  { id: 'brochures', name: 'Brochures', files: [] },
                  { id: 'site-photos', name: 'Site Photos', files: [] }
                ]}
                onAddMedia={(filescategoryId: any) => {

                  // In a real app, you would call an API to save the files
                }
                onRemoveMedia={(fileIdcategoryId: any) => {

                  // In a real app, you would call an API to delete the file
                }
                maxFiles={50}
                maxSizeInMB={20}
                title=""
              />
            </div>
          </div>
        )}

        {/* Units Tab Content */}
        {activeTab === 'units' && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Project Units</h2>
            <div className="bg-amber-100 p-4 rounded-md text-amber-800">
              <p className="font-medium">Units management will be implemented soon</p>
              <p className="text-sm">This tab will allow you to manage all units in the development.</p>
            </div>
          </div>
        )}

        {/* Documents Tab Content */}
        {activeTab === 'documents' && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Project Documents</h2>
            <div className="bg-amber-100 p-4 rounded-md text-amber-800">
              <p className="font-medium">Documents management will be implemented soon</p>
              <p className="text-sm">This tab will allow you to manage all documents related to the development.</p>
            </div>
          </div>
        )}

        {/* Other tabs can be added in a similar way */}
        {(activeTab === 'team' || activeTab === 'finance' || activeTab === 'site-plan') && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            <div className="bg-amber-100 p-4 rounded-md text-amber-800">
              <p className="font-medium">This feature will be implemented soon</p>
              <p className="text-sm">The {activeTab} management functionality is currently under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};