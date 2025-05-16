'use client';

import React from 'react';
import { Building, CreditCard, Home, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import { ArrowUpDown, ChevronRight } from 'lucide-react';

// Define simplified Card components for local use
const Card = ({ className = "", children }) => (
  <div className={`rounded-lg border bg-white shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardContent = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Simple table components
const Table = ({ className = "", children, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props}>
      {children}
    </table>
  </div>
);

const TableHeader = ({ children, ...props }) => (
  <thead className="[&_tr]:border-b" {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, ...props }) => (
  <tbody className="[&_tr:last-child]:border-0" {...props}>
    {children}
  </tbody>
);

const TableRow = ({ className = "", children, ...props }) => (
  <tr className={`border-b transition-colors hover:bg-gray-50 ${className}`} {...props}>
    {children}
  </tr>
);

const TableHead = ({ className = "", children, ...props }) => (
  <th className={`h-10 px-2 text-left align-middle font-medium text-gray-500 ${className}`} {...props}>
    {children}
  </th>
);

const TableCell = ({ className = "", children, ...props }) => (
  <td className={`p-2 align-middle ${className}`} {...props}>
    {children}
  </td>
);

// Simple ProjectList component
const ProjectList = ({ projects, title, description }) => {
  if (!projects?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-6">No projects found</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Completion
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Location
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Properties
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link 
                    href={`/developer/projects/${project.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {project.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' ? 'bg-green-100 text-green-800' :
                      project.status === 'Planning' ? 'bg-blue-100 text-blue-800' :
                      project.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {project.status}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-gray-500">
                      {project.completionPercentage}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>{project.location}</TableCell>
                <TableCell>{project.propertyCount}</TableCell>
                <TableCell>
                  {formatDistance(new Date(project.lastUpdated), new Date(), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Link 
                    href={`/developer/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-8 px-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    View
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default function Page(): React.ReactElement {
  // Enhanced mock data for testing that matches the ProjectList component's needs
  const mockData = {
    activeProjects: 5,
    propertiesAvailable: 27,
    totalSales: 14560000,
    projects: [
      { 
        id: '1', 
        name: 'Fitzgerald Gardens', 
        status: 'Active', 
        completionPercentage: 65,
        location: 'Dublin',
        propertyCount: 32,
        lastUpdated: new Date(2023, 4, 15).toISOString()
      },
      { 
        id: '2', 
        name: 'Riverside Manor', 
        status: 'Planning', 
        completionPercentage: 10,
        location: 'Cork',
        propertyCount: 18,
        lastUpdated: new Date(2023, 5, 22).toISOString()
      },
      { 
        id: '3', 
        name: 'Ballymakenny View', 
        status: 'Construction', 
        completionPercentage: 45,
        location: 'Drogheda',
        propertyCount: 24,
        lastUpdated: new Date(2023, 6, 8).toISOString()
      }
    ]
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Developer Dashboard</h1>
        <p className="text-gray-600">Manage your development projects and monitor progress</p>
      </div>

      {/* KPI widgets row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Active Projects */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
              <div className="p-2 rounded-full bg-blue-100">
                <Building className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold mr-2">{mockData.activeProjects}</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+5.2%</span>
            </div>
          </CardContent>
        </Card>

        {/* Properties Available */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500">Properties Available</h3>
              <div className="p-2 rounded-full bg-green-100">
                <Home className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold">{mockData.propertiesAvailable}</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Sales */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <div className="p-2 rounded-full bg-indigo-100">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold mr-2">£{(mockData.totalSales / 1000000).toFixed(1)}M</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+8.5%</span>
            </div>
          </CardContent>
        </Card>

        {/* Revenue */}
        <Card className="border shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
              <div className="p-2 rounded-full bg-purple-100">
                <CreditCard className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-semibold mr-2">£12.4M</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+3.2%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Simple tabs navigation */}
      <div className="border-b mb-6">
        <div className="flex space-x-6">
          <button className="px-4 py-2 border-b-2 border-blue-600 text-blue-600 font-medium">Overview</button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Projects</button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Sales</button>
          <button className="px-4 py-2 text-gray-500 hover:text-gray-700">Financial</button>
        </div>
      </div>

      {/* Projects List */}
      <div className="mb-6">
        <ProjectList 
          projects={mockData.projects}
          title="Active Development Projects"
          description="Monitor and manage your current development projects"
        />
      </div>

      {/* Quick Links */}
      <Card className="border">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link 
              href="/developer/projects/new" 
              className="border rounded-md p-3 hover:bg-gray-50 flex items-center justify-center"
            >
              Create New Project
            </Link>
            <Link 
              href="/developer/documents" 
              className="border rounded-md p-3 hover:bg-gray-50 flex items-center justify-center"
            >
              View Documents
            </Link>
            <Link 
              href="/developer/htb" 
              className="border rounded-md p-3 hover:bg-gray-50 flex items-center justify-center"
            >
              Help-to-Buy Management
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}