'use client';

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Building, 
  FileText, 
  Home, 
  FileCheck, 
  Users, 
  CalendarDays, 
  ArrowLeft,
  Edit,
  MapPin,
  User,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';

// Mock project data
const mockProjects = {
  'proj-001': {
    id: 'proj-001',
    name: 'Fitzgerald Gardens',
    description: 'Modern residential development in Drogheda with 120 units featuring a mix of 2, 3, and 4 bedroom houses and apartments. The development includes community gardens, playground areas, and sustainable design elements.',
    status: 'active',
    unitsTotal: 120,
    unitsByType: {
      'apartment-1bed': 25,
      'apartment-2bed': 35,
      'house-3bed': 40,
      'house-4bed': 20
    },
    unitsSold: 45,
    unitsReserved: 12,
    location: 'Drogheda, County Louth',
    address: 'Ballymakenny Road, Drogheda, Co. Louth, A92 HD67',
    coordinates: { lat: 53.714, lng: -6.351 },
    developerId: 'dev-001',
    developerName: 'Greenfield Developments Ltd',
    createdAt: '2023-06-15T10:30:00Z',
    startDate: '2023-07-01T00:00:00Z',
    completionDate: '2025-06-30T00:00:00Z',
    lastUpdated: '2023-12-01T14:22:00Z',
    slpStatus: 'in-progress',
    slpProgress: 75,
    documentsTotal: 48,
    documentsApproved: 36,
    documentsReview: 8,
    documentsPending: 4,
    teamMembers: 8,
    salesAgents: ['Dublin Homes', 'County Properties'],
    solicitors: ['Legal Eagles LLP', 'Smith & Jones Solicitors'],
    events: [
      { id: 'ev-001', title: 'Phase 1 Launch', date: '2023-09-15T10:00:00Z', type: 'launch' },
      { id: 'ev-002', title: 'Open House Weekend', date: '2023-10-21T09:00:00Z', type: 'marketing' },
      { id: 'ev-003', title: 'Phase 2 Construction Start', date: '2024-01-15T08:00:00Z', type: 'construction' }
    ]
  },
  'proj-002': {
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
  'proj-003': {
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
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  // Get project details or redirect if not found
  const project = mockProjects[projectId];
  if (!project) {
    // In a real app, you'd use useEffect for this
    router.push('/project-management');
    return null;
  }

  // Calculate progress percentages
  const salesProgress = Math.round((project.unitsSold / project.unitsTotal) * 100);
  const reservationProgress = Math.round((project.unitsReserved / project.unitsTotal) * 100);
  const availableProgress = Math.round(((project.unitsTotal - project.unitsSold - project.unitsReserved) / project.unitsTotal) * 100);

  // Format dates
  const formatDate = (dateString: any) => {
    if (!dateString: any) return 'N/A';
    return new Date(dateString: any).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href="/project-management" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Link>

        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <div className="flex items-center mt-1 text-gray-500">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{project.location}</span>

              <span className="mx-2">•</span>

              <User className="h-4 w-4 mr-1" />
              <span>Developer: {project.developerName}</span>

              {project.status && (
                <>
                  <span className="mx-2">•</span>
                  <Badge variant={project.status === 'active' ? 'default' : 
                                  project.status === 'planning' ? 'secondary' : 'outline'}>
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Badge>
                </>
              )}
            </div>
          </div>

          <Link href={`/project-management/${projectId}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Project Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Key details about {project.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">{project.description}</p>

            {project.address && (
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-700">{project.address}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h3 className="font-semibold mb-1">Project Timeline</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Created</span>
                    <span>{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Start Date</span>
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Expected Completion</span>
                    <span>{formatDate(project.completionDate)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated</span>
                    <span>{formatDate(project.lastUpdated)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Unit Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Total Units</span>
                    <span className="font-medium">{project.unitsTotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sold Units</span>
                    <span className="text-green-600 font-medium">{project.unitsSold}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Reserved Units</span>
                    <span className="text-amber-600 font-medium">{project.unitsReserved}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Available Units</span>
                    <span className="font-medium">{project.unitsTotal - project.unitsSold - project.unitsReserved}</span>
                  </div>
                </div>
              </div>
            </div>

            {project.unitsByType && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Units by Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(project.unitsByType).map(([typecount]) => (
                    <Card key={type} className="p-3 bg-gray-50 border">
                      <div className="text-center">
                        <p className="text-xl font-semibold">{count}</p>
                        <p className="text-xs text-gray-500 capitalize">{type.replace('-', ' ')}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Status Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Project Status</CardTitle>
            <CardDescription>Current status and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* SLP Status */}
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="font-semibold text-sm">SLP Completion</h3>
                <span className="text-sm font-medium">{project.slpProgress}%</span>
              </div>
              <Progress value={project.slpProgress} className="h-2" />
              <div className="flex justify-between items-center mt-2">
                <Badge variant="outline" className="flex items-center">
                  <FileCheck className="h-3 w-3 mr-1" />
                  <span className="text-xs">{project.slpProgress <100 ? 'In Progress' : 'Complete'}</span>
                </Badge>
                <Link href={`/project-management/${projectId}/slp`} className="text-xs text-blue-600 hover:text-blue-800">
                  View SLP Details
                </Link>
              </div>
            </div>

            {/* Sales Status */}
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-3">Unit Status</h3>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
                      Sold
                    </span>
                    <span>{salesProgress}% ({project.unitsSold} units)</span>
                  </div>
                  <Progress value={salesProgress} className="h-1.5 bg-gray-100" indicatorColor="bg-green-600" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-amber-600" />
                      Reserved
                    </span>
                    <span>{reservationProgress}% ({project.unitsReserved} units)</span>
                  </div>
                  <Progress value={reservationProgress} className="h-1.5 bg-gray-100" indicatorColor="bg-amber-500" />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="flex items-center">
                      <Home className="h-3 w-3 mr-1 text-blue-600" />
                      Available
                    </span>
                    <span>{availableProgress}% ({project.unitsTotal - project.unitsSold - project.unitsReserved} units)</span>
                  </div>
                  <Progress value={availableProgress} className="h-1.5 bg-gray-100" indicatorColor="bg-blue-500" />
                </div>
              </div>
            </div>

            {/* Document Status */}
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Document Status</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 p-2 rounded-md">
                  <p className="text-xl font-semibold text-green-700">{project.documentsApproved}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-md">
                  <p className="text-xl font-semibold text-amber-700">{project.documentsReview}</p>
                  <p className="text-xs text-amber-600">In Review</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-md">
                  <p className="text-xl font-semibold text-gray-700">{project.documentsPending}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center pt-2">
            <Link href={`/project-management/${projectId}/dashboard`} className="w-full">
              <Button variant="default" className="w-full">
                <BarChart className="mr-2 h-4 w-4" />
                Full Dashboard
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="units" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="units">
            <Building className="h-4 w-4 mr-2" />
            Units
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="team">
            <Users className="h-4 w-4 mr-2" />
            Team
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <CalendarDays className="h-4 w-4 mr-2" />
            Timeline
          </TabsTrigger>
        </TabsList>

        <TabsContent value="units">
          <Card>
            <CardHeader>
              <CardTitle>Property Units</CardTitle>
              <CardDescription>Manage units for {project.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
                <Link href={`/project-management/${projectId}/units/create`}>
                  <Button size="sm">Add Unit</Button>
                </Link>
              </div>

              <div className="text-center py-12">
                <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Unit Management Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  The unit management interface is currently under development. 
                  Soon you'll be able to manage all property units here.
                </p>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline">
                Import Units
              </Button>
              <Button variant="outline">
                Export Units
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Project Documents</CardTitle>
              <CardDescription>Manage documents for {project.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
                <Link href={`/project-management/${projectId}/documents/upload`}>
                  <Button size="sm">Upload Document</Button>
                </Link>
              </div>

              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Document Management Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  The document management interface is currently under development. 
                  Soon you'll be able to manage all project documents here.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/project-management/${projectId}/documents`} className="w-full">
                <Button variant="outline" className="w-full">View All Documents</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
              <CardDescription>Manage team members for {project.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
                <Link href={`/project-management/${projectId}/team/invite`}>
                  <Button size="sm">Invite Member</Button>
                </Link>
              </div>

              <div className="text-center py-12">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-2">Team Management Coming Soon</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  The team management interface is currently under development. 
                  Soon you'll be able to manage all team members here.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/project-management/${projectId}/team`} className="w-full">
                <Button variant="outline" className="w-full">View All Team Members</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Key milestones and events for {project.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-6">
                <div className="space-x-2">
                  <Button variant="outline" size="sm">Filter</Button>
                  <Button variant="outline" size="sm">Sort</Button>
                </div>
                <Link href={`/project-management/${projectId}/events/create`}>
                  <Button size="sm">Add Event</Button>
                </Link>
              </div>

              {project.events && project.events.length> 0 ? (
                <div className="space-y-6">
                  {project.events.map((event: React.ChangeEvent<HTMLInputElement>) => (
                    <div key={event.id} className="flex items-start space-x-4">
                      <div className="bg-gray-100 rounded-full p-2 mt-1">
                        <CalendarDays className="h-5 w-5 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Events Yet</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    There are no events or milestones added for this project yet.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Link href={`/project-management/${projectId}/timeline`} className="w-full">
                <Button variant="outline" className="w-full">View Full Timeline</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 