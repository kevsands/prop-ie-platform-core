'use client';

import React from 'react';
import { Building, CreditCard, Home, TrendingUp, Calendar, BarChart3, FileText, Shield, ArrowUpDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistance } from 'date-fns';

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
                  <div>
                    <Link 
                      href={`/developer/projects/${project.id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      {project.name}
                    </Link>
                    {project.phase && (
                      <div className="text-xs text-gray-500 mt-1">{project.phase}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'Active' || project.status === 'Now Selling' ? 'bg-green-100 text-green-800' :
                      project.status === 'Launching Soon' ? 'bg-blue-100 text-blue-800' :
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
                <TableCell>
                  <div>
                    <div className="font-medium">{project.propertyCount} units</div>
                    {project.sold !== undefined && (
                      <div className="text-xs text-gray-500">
                        {project.sold} sold • {project.reserved} reserved • {project.available} available
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm">{formatDistance(new Date(project.lastUpdated), new Date(), { addSuffix: true })}</div>
                    {project.totalValue && (
                      <div className="text-xs text-gray-500">{project.totalValue}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Link 
                    href={`/developer/projects/${project.id}`}
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-8 px-3 border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  >
                    Manage
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
  // Enhanced mock data for Prop Ireland's three flagship developments
  const mockData = {
    activeProjects: 3,
    propertiesAvailable: 127,
    totalSales: 47500000, // €47.5M across all three developments
    projects: [
      { 
        id: 'fitzgerald-gardens', 
        name: 'Fitzgerald Gardens', 
        status: 'Active', 
        completionPercentage: 85,
        location: 'Drogheda, Co. Louth',
        propertyCount: 97,
        lastUpdated: new Date(2025, 5, 13).toISOString(),
        sold: 12,
        reserved: 15,
        available: 70,
        totalValue: '€31.2M',
        phase: 'Phase 3 - Final Release'
      },
      { 
        id: 'ballymakenny-view', 
        name: 'Ballymakenny View', 
        status: 'Launching Soon', 
        completionPercentage: 95,
        location: 'Ballymakenny, Drogheda',
        propertyCount: 45,
        lastUpdated: new Date(2025, 5, 10).toISOString(),
        sold: 0,
        reserved: 8,
        available: 37,
        totalValue: '€18.5M',
        phase: 'Phase 1 - Pre-Launch'
      },
      { 
        id: 'ellwood', 
        name: 'Ellwood', 
        status: 'Now Selling', 
        completionPercentage: 75,
        location: 'Celbridge, Co. Kildare',
        propertyCount: 63,
        lastUpdated: new Date(2025, 5, 12).toISOString(),
        sold: 18,
        reserved: 12,
        available: 33,
        totalValue: '€29.8M',
        phase: 'Phase 2 - Premium Release'
      }
    ]
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Prop Ireland - Developer Dashboard</h1>
        <p className="text-gray-600">Manage your flagship developments: Fitzgerald Gardens, Ballymakenny View & Ellwood</p>
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
              <span className="text-2xl font-semibold mr-2">€{(mockData.totalSales / 1000000).toFixed(1)}M</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+15.2%</span>
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
              <span className="text-2xl font-semibold mr-2">€12.4M</span>
              <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full">+18.7%</span>
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
          title="Prop Ireland Flagship Developments"
          description="Monitor and manage Fitzgerald Gardens, Ballymakenny View & Ellwood"
        />
      </div>

      {/* Sales Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="border">
          <CardHeader>
            <CardTitle>Monthly Sales Performance</CardTitle>
            <p className="text-sm text-gray-500">Units sold across all developments</p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {/* Placeholder for chart */}
              <div className="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                  <p className="text-blue-600 font-medium">Sales Trending Up 15.2%</p>
                  <p className="text-sm text-gray-500">47 units sold this quarter</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Development Status Overview</CardTitle>
            <p className="text-sm text-gray-500">Current status of all three developments</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Fitzgerald Gardens (85%)</span>
                <span className="text-xs text-green-600">Active - Final Release</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ballymakenny View (95%)</span>
                <span className="text-xs text-blue-600">Launching Soon</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ellwood (75%)</span>
                <span className="text-xs text-green-600">Now Selling</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/developer/dashboard" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Advanced Dashboard</p>
                  <p className="text-xs text-gray-500">Enterprise analytics</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/developer/htb" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">HTB Management</p>
                  <p className="text-xs text-gray-500">Process claims</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/developer/sales" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sales Analytics</p>
                  <p className="text-xs text-gray-500">View performance</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/developer/documents" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Documents</p>
                  <p className="text-xs text-gray-500">Manage files</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/developer/finance" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="font-medium">Financial Dashboard</p>
                  <p className="text-xs text-gray-500">Full financial suite</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="border hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <Link href="/admin" className="block">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Admin Portal</p>
                  <p className="text-xs text-gray-500">Enterprise admin tools</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}