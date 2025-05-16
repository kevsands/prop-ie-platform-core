'use client';

import React, { useState, ReactNode } from 'react';
import { 
  Building, 
  Filter, 
  Search, 
  CalendarRange, 
  DownloadCloud, 
  Pencil,
  PieChart, 
  BarChart4,
  DollarSign,
  Users
} from 'lucide-react';

// Simplified UI Components
interface CommonProps {
  className?: string;
  children: ReactNode;
}

const Card = ({ className = "", children }: CommonProps) => (
  <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ className = "", children }: CommonProps) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ className = "", children }: CommonProps) => (
  <h3 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ className = "", children }: CommonProps) => (
  <p className={`text-sm text-gray-500 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ className = "", children }: CommonProps) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

// Button component inline
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  className?: string;
  children: ReactNode;
}

const Button = ({ 
  variant = "default", 
  size = "default", 
  className = "", 
  children,
  ...props 
}: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md font-medium transition-colors";
    
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "hover:bg-gray-100 text-gray-700",
  };
    
  const sizeStyles = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
  };
    
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant as keyof typeof variantStyles]} ${sizeStyles[size as keyof typeof sizeStyles]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Input component inline
const Input = ({ className = "", ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors ${className}`}
    {...props}
  />
);

// Simplified Select components (simplified to be non-functional for build testing)
const Select = ({ children }: { children: ReactNode }) => (
  <div className="relative inline-block w-full">
    {children}
  </div>
);

const SelectTrigger = ({ className = "", children }: CommonProps) => (
  <button className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ${className}`}>
    {children}
  </button>
);

const SelectValue = ({ placeholder }: { placeholder: string }) => (
  <span className="placeholder">{placeholder}</span>
);

const SelectContent = ({ children }: { children: ReactNode }) => (
  <div className="hidden">
    {children}
  </div>
);

const SelectItem = ({ value, children }: { value: string; children: ReactNode }) => (
  <div className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm">
    {children}
  </div>
);

// Simplified SalesProgressTracker component
const SalesProgressTracker = ({ projectId }: { projectId: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Progress - {projectId}</CardTitle>
        <CardDescription>
          Sales metrics and progress tracking for this development
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Total Units Sold</span>
              <span className="font-medium">24 / 40</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full" 
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Reserved</span>
              <span className="font-medium">7 units</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full" 
                style={{ width: "17.5%" }}
              ></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Available</span>
              <span className="font-medium">9 units</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-green-600 h-full" 
                style={{ width: "22.5%" }}
              ></div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h4 className="font-medium mb-2">Active Leads</h4>
            <div className="border rounded-md p-4 text-center text-slate-500">
              Lead management simplified for build testing
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Sample project data
const DEMO_PROJECTS = [
  { id: 'proj1', name: 'Fitzgerald Gardens' },
  { id: 'proj2', name: 'Ballymakenny View' },
  { id: 'proj3', name: 'Riverside Manor' },
];

/**
 * Developer Sales Dashboard Page - Simplified for build testing
 */
export default function DeveloperSalesPage() {
  // Alert about simplified version
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Simplified alert */}
      <div className="bg-amber-100 p-4 rounded-md mb-4 text-amber-800">
        <h3 className="font-semibold mb-1">Simplified Page</h3>
        <p>This is a simplified sales dashboard implementation for build testing. Full functionality will be restored later.</p>
      </div>
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sales Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Track sales activity and manage leads across your developments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select>
            <SelectTrigger className="w-[240px]">
              <Building className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {DEMO_PROJECTS.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search units or leads..."
              className="pl-9 w-[240px]"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <Button variant="outline" size="sm">
            <DownloadCloud className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
              <Building className="h-4 w-4 text-blue-500" />
              Total Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <div className="text-sm text-slate-500 mt-1">
              Across 3 developments
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
              <DollarSign className="h-4 w-4 text-green-500" />
              Total Sales Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€28.5M</div>
            <div className="text-sm text-slate-500 mt-1">
              <span className="text-green-600">+12.3%</span> vs last quarter
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
              <BarChart4 className="h-4 w-4 text-amber-500" />
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <div className="text-sm text-slate-500 mt-1">
              <span className="text-green-600">+2.1%</span> vs last quarter
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4 text-purple-500" />
              Active Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78</div>
            <div className="text-sm text-slate-500 mt-1">
              <span className="text-amber-600">18</span> need follow-up
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Sales tracker for demo project */}
      <SalesProgressTracker projectId="Fitzgerald Gardens" />
    </div>
  );
}