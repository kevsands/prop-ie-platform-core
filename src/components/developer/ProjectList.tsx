'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import Link from "next/link";
import { formatDistance } from "date-fns";
import { ArrowUpDown, ChevronRight } from 'lucide-react';
import { DeveloperProject, ProjectStatus } from "@/types/dashboard";

export interface ProjectListProps {
  projects: DeveloperProject[];
  className?: string;
  title?: string;
  description?: string;
  emptyMessage?: string;
}

export function ProjectList({ 
  projects, 
  className = '',
  title = 'Projects',
  description,
  emptyMessage = 'No projects found'
}: ProjectListProps): React.ReactElement {
  const [sortField, setSortField] = useState<keyof DeveloperProject>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle column header click for sorting
  const handleSort = (field: keyof DeveloperProject) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort projects based on current sort settings
  const sortedProjects = projects && projects.length > 0 
    ? [...projects].sort((a, b) => {
        const valueA = a[sortField];
        const valueB = b[sortField];
        
        // Handle string comparison
        if (typeof valueA === 'string' && typeof valueB === 'string') {
          return sortDirection === 'asc' 
            ? valueA.localeCompare(valueB) 
            : valueB.localeCompare(valueA);
        }
        
        // Handle number comparison
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return sortDirection === 'asc' 
            ? valueA - valueB 
            : valueB - valueA;
        }
        
        return 0;
      })
    : [];
  
  if (!projects?.length) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Name
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('completionPercentage')}>
                <div className="flex items-center">
                  Completion
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                <div className="flex items-center">
                  Location
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('propertyCount')}>
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
            {sortedProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link 
                    href={`/developer/projects/${project.id}`}
                    className="text-primary hover:underline"
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
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${project.completionPercentage}%` }}
                      />
                    </div>
                    <span className="ml-2 text-xs text-muted-foreground">
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
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/developer/projects/${project.id}`}>
                      View
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}