'use client';

import { useEffect, useState } from 'react';
import { useDevelopments, useSales } from '@/hooks/api-hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { 
  BarChart,
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { Building, Briefcase, CreditCard, UserCheck, Users, FileText, ChevronRight } from 'lucide-react';
import Link from 'next/link';

// Sample data for charts
const salesData = [
  { name: 'Jan', value: 2 },
  { name: 'Feb', value: 5 },
  { name: 'Mar', value: 7 },
  { name: 'Apr', value: 4 },
  { name: 'May', value: 9 },
  { name: 'Jun', value: 11 },
  { name: 'Jul', value: 13 },
  { name: 'Aug', value: 8 },
  { name: 'Sep', value: 6 },
  { name: 'Oct', value: 10 },
  { name: 'Nov', value: 12 },
  { name: 'Dec', value: 15 },
];

const statusData = [
  { name: 'Available', value: 30, color: '#4ade80' },
  { name: 'Reserved', value: 15, color: '#facc15' },
  { name: 'Sold', value: 25, color: '#3b82f6' },
  { name: 'Under Offer', value: 10, color: '#ec4899' },
];

const COLORS = ['#4ade80', '#facc15', '#3b82f6', '#ec4899'];

export default function DeveloperDashboard() {
  // Use React Query hooks to fetch data
  const { data: developments, isLoading: isLoadingDevelopments } = useDevelopments({
    limit: 5
  });

  const [projectMetrics, setProjectMetrics] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUnits: 0,
    soldUnits: 0,
    availableUnits: 0,
    reservedUnits: 0
  });

  // Calculate project metrics from developments data
  useEffect(() => {
    if (developments?.data) {
      const totalProjects = developments.data.length;
      const activeProjects = developments.data.filter(d => d.status === 'CONSTRUCTION').length;
      const completedProjects = developments.data.filter(d => d.status === 'COMPLETED').length;
      
      const totalUnits = developments.data.reduce((acc, dev) => acc + dev.totalUnits, 0);
      const soldUnits = developments.data.reduce((acc, dev) => acc + dev.soldUnits, 0);
      const availableUnits = developments.data.reduce((acc, dev) => acc + dev.availableUnits, 0);
      const reservedUnits = developments.data.reduce((acc, dev) => acc + dev.reservedUnits, 0);
      
      setProjectMetrics({
        totalProjects,
        activeProjects,
        completedProjects,
        totalUnits,
        soldUnits,
        availableUnits,
        reservedUnits
      });
    }
  }, [developments]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">Developer Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your developer dashboard. Monitor project progress, sales, and team activity.
        </p>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.totalProjects}</p>
              )}
            </div>
            <div className="bg-primary/10 p-2 rounded-full">
              <Building className="h-5 w-5 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.activeProjects}</p>
              )}
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <Briefcase className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Units</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.totalUnits}</p>
              )}
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Sold Units</p>
              {isLoadingDevelopments ? (
                <Skeleton className="h-7 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold">{projectMetrics.soldUnits}</p>
              )}
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <UserCheck className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Sales Trends */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Monthly unit sales across all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" name="Units Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Unit Status Distribution */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Unit Status Distribution</CardTitle>
                <CardDescription>Current status of all units</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Growth</CardTitle>
              <CardDescription>Year-to-date sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#3b82f6" activeDot={{ r: 8 }} name="Units Sold" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle>Project Status</CardTitle>
                <CardDescription>Current status of all projects</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={[
                        { name: 'Planning', value: 2 },
                        { name: 'Construction', value: 3 },
                        { name: 'Completed', value: 4 },
                        { name: 'Sold Out', value: 1 },
                      ]}
                      margin={{ top: 20, right: 30, left: 30, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" name="Projects" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Building className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New project milestone</p>
                      <p className="text-xs text-muted-foreground">Riverside Manor - Phase 2 started</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Document uploaded</p>
                      <p className="text-xs text-muted-foreground">Planning permission - Fitzgerald Gardens</p>
                      <p className="text-xs text-muted-foreground">3 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Users className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New team member</p>
                      <p className="text-xs text-muted-foreground">Sarah Smith joined the team</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Projects section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Projects</h2>
          <Button variant="outline" size="sm" asChild>
            <Link href="/developer/projects">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {isLoadingDevelopments ? (
            Array(3).fill(0).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full rounded-md mb-2" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex justify-between gap-2 mt-4">
                      <Skeleton className="h-9 w-1/2" />
                      <Skeleton className="h-9 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            developments?.data.slice(0, 3).map((development) => (
              <Card key={development.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{development.name}</CardTitle>
                  <CardDescription>{development.location.city}, {development.location.county}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-24 mb-4">
                    {development.images && development.images.length > 0 ? (
                      <img
                        src={development.images[0]}
                        alt={development.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-muted rounded-md text-muted-foreground text-sm">
                        No image available
                      </div>
                    )}
                    <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                      {development.status}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {development.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground">Units</p>
                      <p className="font-medium">{development.totalUnits}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className="font-medium">{development.availableUnits}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default" size="sm" asChild className="flex-1">
                      <Link href={`/developer/projects/${development.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/developer/projects/${development.id}/units`}>
                        Manage Units
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}