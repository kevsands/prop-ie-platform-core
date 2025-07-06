'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, FileText, Users, Building, PanelTop } from 'lucide-react';

// Mock project data
const mockProjects = [
  {
    id: 'proj-001',
    name: 'Fitzgerald Gardens',
    description: 'Modern residential development in Drogheda with 120 units',
    status: 'active',
    unitsTotal: 120,
    unitsSold: 45,
    unitsReserved: 12,
    location: 'Drogheda, County Louth',
    developerId: 'dev-001',
    developerName: 'Greenfield Developments Ltd',
    createdAt: '2023-06-15T10:30:00Z',
    lastUpdated: '2023-12-01T14:22:00Z'
  },
  {
    id: 'proj-002',
    name: 'Riverside Manor',
    description: 'Luxury waterfront apartments with scenic river views',
    status: 'active',
    unitsTotal: 80,
    unitsSold: 30,
    unitsReserved: 8,
    location: 'Dundalk, County Louth',
    developerId: 'dev-001',
    developerName: 'Greenfield Developments Ltd',
    createdAt: '2023-08-20T09:15:00Z',
    lastUpdated: '2023-11-28T16:45:00Z'
  },
  {
    id: 'proj-003',
    name: 'Ballymakenny View',
    description: 'Family homes with excellent community amenities',
    status: 'planning',
    unitsTotal: 95,
    unitsSold: 0,
    unitsReserved: 0,
    location: 'Drogheda, County Louth',
    developerId: 'dev-001',
    developerName: 'Greenfield Developments Ltd',
    createdAt: '2023-10-05T11:20:00Z',
    lastUpdated: '2023-12-02T10:30:00Z'
  }
];

export default function ProjectManagementPage() {
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter projects based on active tab
  const filteredProjects = activeTab === 'all' 
    ? mockProjects 
    : mockProjects.filter(project => project.status === activeTab);
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Link href="/project-management/create-project">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Projects Overview</CardTitle>
              <CardDescription>
                {activeTab === 'all' ? 'Manage all development projects' : 
                 `Manage projects with status: ${activeTab}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Units</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map(project => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.location}</TableCell>
                      <TableCell>
                        <Badge variant={project.status === 'active' ? 'default' : 
                                      project.status === 'planning' ? 'secondary' : 'outline'}>
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {project.unitsSold}/{project.unitsTotal} sold
                        {project.unitsReserved > 0 && `, ${project.unitsReserved} reserved`}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/project-management/${project.id}`}>
                            <Button variant="outline" size="sm">
                              <PanelTop className="h-4 w-4 mr-1" />
                              Dashboard
                            </Button>
                          </Link>
                          <Link href={`/project-management/${project.id}/documents`}>
                            <Button variant="outline" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Documents
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Document Templates</CardTitle>
            <CardDescription>Manage SLP document templates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center mb-2">24</p>
            <p className="text-center text-muted-foreground">Templates available</p>
          </CardContent>
          <CardFooter>
            <Link href="/project-management/templates" className="w-full">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                View Templates
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Team Management</CardTitle>
            <CardDescription>Manage project teams</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center mb-2">12</p>
            <p className="text-center text-muted-foreground">Team members</p>
          </CardContent>
          <CardFooter>
            <Link href="/project-management/teams" className="w-full">
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Manage Teams
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Unit Management</CardTitle>
            <CardDescription>Configure and manage property units</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center mb-2">295</p>
            <p className="text-center text-muted-foreground">Units across all projects</p>
          </CardContent>
          <CardFooter>
            <Link href="/project-management/units" className="w-full">
              <Button variant="outline" className="w-full">
                <Building className="mr-2 h-4 w-4" />
                Manage Units
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Project Analytics</CardTitle>
            <CardDescription>View project performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-center mb-2">3</p>
            <p className="text-center text-muted-foreground">Active projects</p>
          </CardContent>
          <CardFooter>
            <Link href="/project-management/analytics" className="w-full">
              <Button variant="outline" className="w-full">
                <PanelTop className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
} 