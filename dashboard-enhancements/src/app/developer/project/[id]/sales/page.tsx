'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Building, ArrowLeft } from 'lucide-react';

/**
 * Simplified Project Sales Page for build testing
 */
export default function ProjectSalesPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  // Mock project data
  const projectData = {
    id: projectId,
    name: 'Fitzgerald Gardens',
    description: 'Luxury residential development with 45 units',
    location: 'Drogheda, Co. Louth'
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              {projectData.name} Sales
            </h1>
            <Link 
              href={`/developer/project/${projectId}`}
              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 ml-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Project
            </Link>
          </div>
          <p className="text-gray-500 mt-1">
            {projectData.location}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option value="all-time">All Time</option>
            <option value="30-days">Last 30 Days</option>
            <option value="90-days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          
          <button className="border rounded-md px-3 py-2 text-sm bg-white hover:bg-gray-50">
            Export
          </button>
          
          <button className="border rounded-md px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700">
            Update Status
          </button>
        </div>
      </div>

      {/* Simplified Sales Progress Tracker */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-medium mb-4">Sales Progress</h2>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Sales Progress
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                65%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">45</div>
            <div className="text-sm text-gray-500">Total Units</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">29</div>
            <div className="text-sm text-gray-500">Units Sold</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">8</div>
            <div className="text-sm text-gray-500">Reserved</div>
          </div>
          <div className="border rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">8</div>
            <div className="text-sm text-gray-500">Available</div>
          </div>
        </div>
        
        <div className="text-center text-gray-500 py-4 bg-gray-50 rounded-lg border">
          Detailed sales data and interactive charts will be loaded here in the full implementation
        </div>
      </div>
      
      <div className="bg-amber-100 p-3 rounded-md text-amber-800">
        Note: UI components temporarily simplified for build testing - full functionality will be restored later.
      </div>
    </div>
  );
}