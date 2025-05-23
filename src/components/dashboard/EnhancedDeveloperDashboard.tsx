"use client";

import React from "react";

/**
 * Simplified stub implementation of the EnhancedDeveloperDashboard
 * 
 * This provides basic dashboard UI without complex functionality.
 */
interface EnhancedDeveloperDashboardProps {
  userId: string;
}

export function EnhancedDeveloperDashboard({ userId }: EnhancedDeveloperDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Developer Dashboard</h2>
          <p className="text-gray-600">Overview of your development projects and sales</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded flex items-center gap-2">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6"></path>
              <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
              <path d="M3 12a9 9 0 0 0 15 6.7L21 16"></path>
              <path d="M21 22v-6h-6"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border rounded-md">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Timeframe:</span>
            <select className="text-sm border rounded p-1">
              <option>This Month</option>
              <option>This Quarter</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <select className="text-sm border rounded p-1">
              <option>All</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Projects</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
              <svg className="h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="14" x2="23" y2="14"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="14" x2="4" y2="14"></line>
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <span>+2 vs last month</span>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Available Properties</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="bg-indigo-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
              <svg className="h-5 w-5 text-indigo-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sales</p>
              <p className="text-2xl font-bold">€4.5M</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full h-10 w-10 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-green-600 flex items-center">
            <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              <polyline points="16 7 22 7 22 13"></polyline>
            </svg>
            <span>+12% vs last month</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Projects List */}
        <div className="bg-white border rounded-lg p-5 shadow-sm col-span-1 md:row-span-2">
          <h3 className="text-lg font-medium mb-4">Active Projects</h3>
          <div className="space-y-4">
            <div className="divide-y">
              {[
                { id: '1', name: 'Riverside Manor', location: 'Dublin', propertyCount: 24, completionPercentage: 68 },
                { id: '2', name: 'Fitzgerald Gardens', location: 'Cork', propertyCount: 16, completionPercentage: 42 },
                { id: '3', name: 'Ballymakenny View', location: 'Drogheda', propertyCount: 32, completionPercentage: 89 }
              ].map((project: any) => (
                <div key={project.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{project.name}</h3>
                    <p className="text-sm text-gray-500">{project.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{project.propertyCount} units</div>
                    <div className="text-xs text-gray-500">{project.completionPercentage}% complete</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full py-2 border rounded text-sm text-gray-700 hover:bg-gray-50">
              View All Projects
            </button>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Project Progress</h3>
          <div className="space-y-3">
            {[
              { id: '1', name: 'Riverside Manor', progress: 68, status: 'on_track', phase: 'Construction', endDate: '2025-12-01' },
              { id: '2', name: 'Fitzgerald Gardens', progress: 42, status: 'delayed', phase: 'Foundation', endDate: '2026-03-15' }
            ].map((project: any) => (
              <div key={project.id} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className="text-xs">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={
                      project.status === 'on_track' ? "h-2 rounded-full bg-green-500" :
                      project.status === 'delayed' ? "h-2 rounded-full bg-amber-500" :
                      "h-2 rounded-full bg-gray-400"
                    }
                    style={ width: `${project.progress}%` }
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{project.phase}</span>
                  <span>{new Date(project.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Overview */}
        <div className="bg-white border rounded-lg p-5 shadow-sm">
          <h3 className="text-lg font-medium mb-4">Financial Overview</h3>
          <div className="space-y-3">
            {[
              { key: 'revenue', label: 'Total Revenue', formattedValue: '€8.2M', change: 15, changeDirection: 'up' },
              { key: 'costs', label: 'Construction Costs', formattedValue: '€3.7M', change: 7, changeDirection: 'up' },
              { key: 'profit', label: 'Projected Profit', formattedValue: '€4.5M', change: 22, changeDirection: 'up' }
            ].map((metric: any) => (
              <div key={metric.key} className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-sm">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{metric.formattedValue}</span>
                  {metric.change && metric.change !== 0 && (
                    <span className={
                      metric.changeDirection === 'up' ? "text-xs px-1.5 py-0.5 rounded bg-green-100 text-green-700" :
                      "text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700"
                    }>
                      {metric.changeDirection === 'up' ? '+' : ''}
                      {metric.change}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}