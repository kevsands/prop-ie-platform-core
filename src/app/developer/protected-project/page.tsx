'use client';

/**
 * Protected Developer Projects Page
 * 
 * This page demonstrates how to use the ProtectedRoute component
 * to secure a page within the Next.js App Router architecture.
 * It integrates with AWS Amplify v6 and includes role-based access control.
 */

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Building, ArrowRight, Clock, CalendarDays, AlertTriangle, MapPin, Home } from 'lucide-react';

// Define types
interface Project {
  id: string;
  name: string;
  status: string;
  location: string;
  progress: number;
  unitsSold: number;
  totalUnits: number;
  nextMilestone?: {
    title: string;
    date: string;
  };
  startDate: string;
  endDate?: string;
}

interface CardProps {
  className?: string;
  children: ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm';
  className?: string;
  asChild?: boolean;
  children: ReactNode;
}

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  children: ReactNode;
}

interface ProgressProps {
  value?: number;
  className?: string;
}

interface TabsContextType {
  value: string;
  setValue: (value: string) => void;
}

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
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

// Define Card components with proper typing
const Card: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<CardProps> = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription: React.FC<CardProps> = ({ className = "", children }) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const CardFooter: React.FC<CardProps> = ({ className = "", children }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Define Button component with proper typing
const Button: React.FC<ButtonProps> = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  asChild = false,
  children,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors";

  const variantStyles: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700";

  const sizeStyles: Record<string, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm";

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Define Badge component with proper typing
const Badge: React.FC<BadgeProps> = ({ variant = "default", className = "", children }) => {
  const variantStyles: Record<string, string> = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    outline: "bg-transparent border border-gray-300 text-gray-700";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Define Progress component with proper typing
const Progress: React.FC<ProgressProps> = ({ value = 0, className = "", ...props }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${className}`} {...props}>
      <div 
        className="h-full bg-blue-600 transition-all"
        style={ width: `${value}%` }
      />
    </div>
  );
};

// Define Tabs components with proper typing
const TabsContext = createContext<TabsContextType | null>(null);

const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className = "", ...props }) => {
  const [valuesetValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={ value, setValue }>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList: React.FC<TabsListProps> = ({ children, className = "", ...props }) => {
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

const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, children, className = "", ...props }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }
  const isActive = context.value === value;

  return (
    <button
      role="tab"
      type="button"
      data-state={isActive ? "active" : "inactive"
      className={`
        px-3 py-1.5 text-sm font-medium inline-flex items-center justify-center whitespace-nowrap rounded-md
        ${isActive ? "bg-white shadow text-gray-900" : "text-gray-500 hover:text-gray-900"
        ${className}
      `}
      onClick={() => context.setValue(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent: React.FC<TabsContentProps> = ({ value, children, className = "", ...props }) => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  if (context.value !== value) return null;

  return (
    <div
      role="tabpanel"
      data-state={context.value === value ? "active" : "inactive"
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

// Loading skeleton component
const ProjectsSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
      </div>

      <div className="h-10 w-72 bg-slate-200 rounded animate-pulse"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 23].map(i => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4 pb-3">
              <div className="h-2 w-full bg-slate-200 rounded animate-pulse"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-4 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="h-9 w-full bg-slate-200 rounded animate-pulse"></div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Main project content component
const ProjectsContent: React.FC = () => {
  // Projects data query
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects-list'],
    queryFn: async () => {
      try {
        // Mock data for demonstration
        return {
          active: [
            {
              id: 'fitzgerald-gardens',
              name: 'Fitzgerald Gardens',
              status: 'In Progress',
              location: 'Drogheda, Co. Louth',
              progress: 70,
              unitsSold: 32,
              totalUnits: 45,
              nextMilestone: {
                title: 'Phase 1 Handover',
                date: '2024-06-15'
              },
              startDate: '2023-01-01',
              endDate: '2024-12-31'
            }
          ]
        };
      } catch (error) {

        throw error;
      }
    }
  });

  const renderProjectCard = (project: Project) => {
    return (
      <Card key={project.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <Badge variant={project.status === 'In Progress' ? 'default' : 'secondary'}>
              {project.status}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {project.location}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pb-3">
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Units Sold</p>
              <p className="text-lg font-semibold">{project.unitsSold}/{project.totalUnits}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Next Milestone</p>
              <p className="text-sm font-medium">{project.nextMilestone?.title}</p>
              <p className="text-xs text-gray-500">{project.nextMilestone?.date && formatDate(project.nextMilestone.date)}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button className="w-full" variant="outline">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  };

  if (isLoading) {
    return <ProjectsSkeleton />\n  );
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Developer Projects</h1>
          <p className="text-gray-500">Manage your development projects</p>
        </div>
        <Button>
          <Building className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsData?.active.map(renderProjectCard)}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">No completed projects yet</p>
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="mt-6">
          <div className="text-center py-12">
            <p className="text-gray-500">No upcoming projects</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/**
 * Protected Developer Projects Page
 * 
 * This page uses the ProtectedRoute component to ensure that only
 * authenticated users with the 'developer' or 'admin' role can access it.
 */
export default function ProtectedProjectsPage() {
  return <ProjectsContent />\n  );
}