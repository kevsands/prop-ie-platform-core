'use client';

import React, { useState } from 'react';
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
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Download,
  FileCheck,
  XCircle,
  InfoIcon
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock project data
const mockProjects = {
  'proj-001': {
    id: 'proj-001',
    name: 'Fitzgerald Gardens',
    slpComponents: [
      {
        id: 'slp-001',
        name: 'Title Deeds',
        description: 'Original title deeds and land registry documentation',
        required: true,
        status: 'approved',
        uploadedBy: 'John Smith',
        uploadedAt: '2023-07-21T10:30:00Z',
        reviewedBy: 'Legal Team',
        reviewedAt: '2023-07-25T15:45:00Z',
        documentId: 'doc-001',
        documentUrl: '/documents/title-deeds.pdf',
        notes: 'All title documentation is in order and verified.'
      },
      {
        id: 'slp-002',
        name: 'Planning Permission',
        description: 'Planning permission documentation and conditions',
        required: true,
        status: 'approved',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2023-07-22T14:20:00Z',
        reviewedBy: 'Planning Dept',
        reviewedAt: '2023-07-26T11:30:00Z',
        documentId: 'doc-002',
        documentUrl: '/documents/planning-permission.pdf',
        notes: 'Planning permission granted with standard conditions.'
      },
      {
        id: 'slp-003',
        name: 'Building Regulations Compliance',
        description: 'Documentation showing compliance with building regulations',
        required: true,
        status: 'in-review',
        uploadedBy: 'Michael Brown',
        uploadedAt: '2023-08-05T09:15:00Z',
        reviewedBy: null,
        reviewedAt: null,
        documentId: 'doc-003',
        documentUrl: '/documents/building-regs.pdf',
        notes: 'Under review by building control officer.'
      },
      {
        id: 'slp-004',
        name: 'Property Searches',
        description: 'Local authority, water, and environmental searches',
        required: true,
        status: 'pending',
        uploadedBy: null,
        uploadedAt: null,
        reviewedBy: null,
        reviewedAt: null,
        documentId: null,
        documentUrl: null,
        notes: 'Searches to be conducted when plot boundaries are finalized.'
      },
      {
        id: 'slp-005',
        name: 'New Home Warranty',
        description: 'Home structural warranty documentation',
        required: true,
        status: 'approved',
        uploadedBy: 'John Smith',
        uploadedAt: '2023-07-30T16:40:00Z',
        reviewedBy: 'Warranty Provider',
        reviewedAt: '2023-08-02T10:20:00Z',
        documentId: 'doc-005',
        documentUrl: '/documents/warranty.pdf',
        notes: '10-year structural warranty confirmed.'
      },
      {
        id: 'slp-006',
        name: 'Management Company Information',
        description: 'Details about property management company and service charges',
        required: true,
        status: 'in-review',
        uploadedBy: 'Sarah Johnson',
        uploadedAt: '2023-08-10T11:30:00Z',
        reviewedBy: null,
        reviewedAt: null,
        documentId: 'doc-006',
        documentUrl: '/documents/management-company.pdf',
        notes: 'Service charge schedule still pending final review.'
      },
      {
        id: 'slp-007',
        name: 'Energy Performance Certificate',
        description: 'Energy efficiency rating documentation',
        required: true,
        status: 'rejected',
        uploadedBy: 'Michael Brown',
        uploadedAt: '2023-08-01T13:45:00Z',
        reviewedBy: 'Certification Body',
        reviewedAt: '2023-08-04T09:30:00Z',
        documentId: 'doc-007',
        documentUrl: '/documents/epc.pdf',
        notes: 'EPC assessment needs to be redone as it does not include recent building modifications.'
      },
      {
        id: 'slp-008',
        name: 'Sale Contract Template',
        description: 'Standard contract for unit sales',
        required: true,
        status: 'approved',
        uploadedBy: 'Legal Team',
        uploadedAt: '2023-07-15T14:30:00Z',
        reviewedBy: 'Legal Director',
        reviewedAt: '2023-07-18T16:45:00Z',
        documentId: 'doc-008',
        documentUrl: '/documents/sale-contract.pdf',
        notes: 'Approved standard template for all unit sales.'
      }
    ]
  }
};

// Get the status counts
const getStatusCounts = (components) => {
  return components.reduce((counts, component) => {
    counts[component.status] = (counts[component.status] || 0) + 1;
    return counts;
  }, {});
};

// Calculate progress percentage
const calculateProgress = (components) => {
  if (components.length === 0) return 0;
  
  const approved = components.filter(c => c.status === 'approved').length;
  return Math.round((approved / components.length) * 100);
};

export default function ProjectSLPPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Get project details or redirect if not found
  const project = mockProjects[projectId as keyof typeof mockProjects];
  if (!project) {
    router.push('/project-management');
    return null;
  }
  
  const progress = calculateProgress(project.slpComponents);
  const statusCounts = getStatusCounts(project.slpComponents);
  
  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Filter components
  const filteredComponents = activeFilter === 'all' 
    ? project.slpComponents 
    : project.slpComponents.filter(component => component.status === activeFilter);
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="success" className="flex items-center"><Check className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'in-review':
        return <Badge variant="warning" className="flex items-center"><Clock className="h-3 w-3 mr-1" /> In Review</Badge>;
      case 'rejected':
        return <Badge variant="destructive" className="flex items-center"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/project-management/${projectId}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </Link>
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-3xl font-bold">Seller's Legal Pack (SLP)</h1>
            <p className="text-gray-500 mt-1">{project.name}</p>
          </div>
          
          <div className="space-x-2">
            <Link href={`/project-management/${projectId}/slp/generate-report`}>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </Link>
            <Link href={`/project-management/${projectId}/slp/add-document`}>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Add Document
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* SLP Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>SLP Completion</CardTitle>
            <CardDescription>Overall progress of the Seller's Legal Pack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{progress}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-3 bg-green-50 border border-green-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-green-700">{statusCounts.approved || 0}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
              </Card>
              <Card className="p-3 bg-amber-50 border border-amber-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-amber-700">{statusCounts['in-review'] || 0}</p>
                  <p className="text-xs text-amber-600">In Review</p>
                </div>
              </Card>
              <Card className="p-3 bg-red-50 border border-red-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-red-700">{statusCounts.rejected || 0}</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </Card>
              <Card className="p-3 bg-gray-50 border border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700">{statusCounts.pending || 0}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>SLP Information</CardTitle>
            <CardDescription>About the Seller's Legal Pack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-md">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-700">What is a Seller's Legal Pack?</p>
                <p className="text-blue-600 mt-1">
                  A Seller's Legal Pack (SLP) contains all the legal and technical information about 
                  a property development that buyers' solicitors need to review.
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">
                Complete SLPs lead to faster sales completions and fewer legal queries.
                Ensure all required components are approved before marketing units.
              </p>
            </div>
            
            <div className="pt-4">
              <Link href="/resources/slp-guidelines" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                <FileText className="h-4 w-4 mr-1" />
                View SLP Guidelines
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* SLP Components List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>SLP Components</CardTitle>
              <CardDescription>Legal documents required for the property sale</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant={activeFilter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button 
                variant={activeFilter === 'approved' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('approved')}
              >
                Approved
              </Button>
              <Button 
                variant={activeFilter === 'in-review' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('in-review')}
              >
                In Review
              </Button>
              <Button 
                variant={activeFilter === 'rejected' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('rejected')}
              >
                Rejected
              </Button>
              <Button 
                variant={activeFilter === 'pending' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('pending')}
              >
                Pending
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComponents.map(component => (
                <TableRow key={component.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{component.name}</p>
                      <p className="text-sm text-gray-500">{component.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(component.status)}
                  </TableCell>
                  <TableCell>
                    {component.uploadedBy ? (
                      <div className="text-sm">
                        <p>{component.uploadedBy}</p>
                        <p className="text-gray-500">{formatDate(component.uploadedAt)}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Not uploaded</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {component.reviewedBy ? (
                      <div className="text-sm">
                        <p>{component.reviewedBy}</p>
                        <p className="text-gray-500">{formatDate(component.reviewedAt)}</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">Not reviewed</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      {component.documentId ? (
                        <Link href={component.documentUrl || '#'}>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/project-management/${projectId}/slp/${component.id}/upload`}>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-1" />
                            Upload
                          </Button>
                        </Link>
                      )}
                      <Link href={`/project-management/${projectId}/slp/${component.id}`}>
                        <Button size="sm">
                          <FileCheck className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredComponents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">No {activeFilter !== 'all' ? activeFilter : ''} SLP components found</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Export SLP Status</Button>
          <Link href={`/project-management/${projectId}/slp/templates`}>
            <Button variant="outline">View Document Templates</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 