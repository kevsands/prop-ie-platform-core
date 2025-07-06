'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building, ArrowRight, Clock, CalendarDays, AlertTriangle, MapPin, Home } from 'lucide-react';
import { Project, ProjectPhase, ProjectMilestone, ProjectTeamMember, ProjectBudget, ProjectRisk } from '@/types/project';
import { DevelopmentStatus } from '@/types/graphql';
import { Location, Address } from '@/types/location';
import { Document } from '@/types/document';

// Define interfaces for our components
interface CardProps {
  className?: string;
  children: React.ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  className?: string;
  asChild?: boolean;
  children: React.ReactNode;
}

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  children: React.ReactNode;
}

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  className?: string;
}

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// Define a local formatDate function with proper typing
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Define Card components with proper types
const Card = ({ className = "", children }: CardProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: CardProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: CardProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: CardProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: CardProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter = ({ className = "", children }: CardProps) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Define Button component with proper types
const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  asChild = false,
  children,
  ...props 
}: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
    
  const variantStyles: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
    
  const sizeStyles: Record<string, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
  };
    
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Define Badge component with proper types
const Badge = ({ variant = "default", className = "", children }: BadgeProps) => {
  const variantStyles: Record<string, string> = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "bg-transparent border border-gray-300 text-gray-700",
  };
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Define Progress component with proper types
const Progress = ({ value = 0, className = "", ...props }: ProgressProps) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`} {...props}>
      <div 
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

// Define Tabs components with proper types
const TabsContext = React.createContext<TabsContextType | null>(null);

const Tabs = ({ defaultValue, children, className = "", ...props }: TabsProps) => {
  const [value, setValue] = React.useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = ({ children, className = "", ...props }: CardProps) => {
  return (
    <div 
      className={`inline-flex items-center rounded-lg bg-gray-100 p-1 ${className}`}
      role="tablist"
      {...props}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({ value, children, className = "", ...props }: TabsTriggerProps) => {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  
  const isActive = context.value === value;
  
  return (
    <button
      role="tab"
      type="button"
      data-state={isActive ? "active" : "inactive"}
      className={`
        px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center whitespace-nowrap rounded-md
        ${isActive ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"}
        ${className}
      `}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className = "", ...props }: TabsContentProps) => {
  const context = React.useContext(TabsContext);
  if (!context) return null;
  
  if (context.value !== value) return null;
  
  return (
    <div
      role="tabpanel"
      data-state={context.value === value ? "active" : "inactive"}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

const ProjectsPage = () => {
  // Projects data query
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      // In production, fetch from API
      // For demo purposes, we'll return mock data
      return {
        active: [
          {
            id: 'fitzgerald-gardens',
            name: 'Fitzgerald Gardens',
            description: 'A modern residential development in Drogheda',
            developerId: 'dev-1',
            location: {
              address: {
                addressLine1: 'Fitzgerald Gardens',
                city: 'Drogheda',
                county: 'Co. Louth',
                postalCode: 'A92 XXXX',
                country: 'Ireland',
                formattedAddress: 'Drogheda, Co. Louth'
              },
              coordinates: { lat: 53.7179, lng: -6.3561 }
            },
            status: DevelopmentStatus.CONSTRUCTION as const,
            startDate: new Date('2023-01-01'),
            estimatedCompletionDate: new Date('2024-06-30'),
            phases: [],
            milestones: [
              {
                id: 'milestone-1',
                name: 'Phase 1 Handover',
                date: new Date('2023-10-15'),
                isCompleted: true,
                type: 'handover'
              }
            ],
            team: [],
            documents: [],
            salesInfo: {
              launchDate: new Date('2023-03-01'),
              salesTarget: 45,
              reservationsCount: 32,
              salesCount: 32
            },
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-10-15')
          }
        ],
        completed: [
          {
            id: 'oakwood-residences',
            name: 'Oakwood Residences',
            description: 'Completed residential development in Swords',
            developerId: 'dev-1',
            location: {
              address: {
                addressLine1: 'Oakwood Residences',
                city: 'Swords',
                county: 'Co. Dublin',
                postalCode: 'K67 XXXX',
                country: 'Ireland',
                formattedAddress: 'Swords, Co. Dublin'
              },
              coordinates: { lat: 53.4597, lng: -6.2181 }
            },
            status: DevelopmentStatus.COMPLETED as const,
            startDate: new Date('2022-01-01'),
            estimatedCompletionDate: new Date('2023-06-30'),
            actualCompletionDate: new Date('2023-06-30'),
            phases: [],
            milestones: [],
            team: [],
            documents: [],
            salesInfo: {
              launchDate: new Date('2022-03-01'),
              salesTarget: 15,
              reservationsCount: 15,
              salesCount: 15
            },
            createdAt: new Date('2022-01-01'),
            updatedAt: new Date('2023-06-30')
          }
        ],
        planned: [
          {
            id: 'harbour-heights',
            name: 'Harbour Heights',
            description: 'Planned residential development in Bettystown',
            developerId: 'dev-1',
            location: {
              address: {
                addressLine1: 'Harbour Heights',
                city: 'Bettystown',
                county: 'Co. Meath',
                postalCode: 'A92 XXXX',
                country: 'Ireland',
                formattedAddress: 'Bettystown, Co. Meath'
              },
              coordinates: { lat: 53.7000, lng: -6.2500 }
            },
            status: DevelopmentStatus.PLANNING as const,
            startDate: new Date('2024-01-01'),
            estimatedCompletionDate: new Date('2025-12-31'),
            phases: [],
            milestones: [
              {
                id: 'milestone-1',
                name: 'Submit Planning Application',
                date: new Date('2023-12-15'),
                isCompleted: false,
                type: 'planning_permission'
              }
            ],
            team: [],
            documents: [],
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-10-15')
          }
        ]
      };
    }
  });

  // Function to render project card
  const renderProjectCard = (project: Project) => {
    const nextMilestone = project.milestones.find(m => !m.isCompleted);
    const isDelayed = nextMilestone && new Date(nextMilestone.date) < new Date() && project.status !== DevelopmentStatus.COMPLETED;
    const progress = project.phases.length > 0 
      ? Math.round(project.phases.reduce((acc, phase) => acc + phase.progress, 0) / project.phases.length)
      : 0;
    
    return (
      <Card key={project.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{project.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{project.location.address.formattedAddress}</span>
              </CardDescription>
            </div>
            <Badge variant={
              project.status === DevelopmentStatus.CONSTRUCTION ? 'default' :
              project.status === DevelopmentStatus.PLANNING ? 'outline' :
              project.status === DevelopmentStatus.COMPLETED ? 'secondary' : 'outline'
            }>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-3">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-slate-500">Units Sold</div>
              <div className="text-lg font-semibold">
                {project.salesInfo?.salesCount || 0}/{project.salesInfo?.salesTarget || 0}
              </div>
              <div className="text-xs text-slate-500">
                {project.salesInfo?.salesTarget ? Math.round((project.salesInfo.salesCount || 0) / project.salesInfo.salesTarget * 100) : 0}% sold
              </div>
            </div>
            
            {nextMilestone ? (
              <div className="space-y-1">
                <div className="text-sm text-slate-500">Next Milestone</div>
                <div className="text-sm font-medium line-clamp-1">
                  {nextMilestone.name}
                </div>
                <div className={`text-xs flex items-center gap-1 ${
                  isDelayed ? 'text-red-500' : 'text-slate-500'
                }`}>
                  {isDelayed ? (
                    <>
                      <AlertTriangle className="h-3 w-3" />
                      Delayed
                    </>
                  ) : (
                    <>
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(nextMilestone.date.toISOString())}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm text-slate-500">Status</div>
                <div className="text-sm font-medium">Completed</div>
                <div className="text-xs text-green-500 flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  All units delivered
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Link href={`/developer/project/${project.id}`} className="w-full">
            <Button variant="ghost" size="sm" className="w-full">
              View Project Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <Button>
          <Building className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="planned">Planned</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.active.map((project: Project) => renderProjectCard(project))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.completed.map((project: Project) => renderProjectCard(project))}
          </div>
        </TabsContent>

        <TabsContent value="planned">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.planned.map((project: Project) => renderProjectCard(project))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectsPage;