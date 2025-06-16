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
import { ArrowLeft } from 'lucide-react';
import { Check } from 'lucide-react';
import { Clock } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { FileText } from 'lucide-react';
import { Upload } from 'lucide-react';
import { Download } from 'lucide-react';
import { FileCheck } from 'lucide-react';
import { XCircle } from 'lucide-react';
import { InfoIcon } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow} from "@/components/ui/table";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SLPComponent {
  id: string;
  name: string;
  description: string;
  required: boolean;
  status: string;
  uploadedBy: string | null;
  uploadedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  documentId: string | null;
  documentUrl: string | null;
  notes: string | null;
}

interface SLPData {
  components: SLPComponent[];
  progress: {
    totalComponents: number;
    approvedComponents: number;
    progressPercentage: number;
    componentsbyStatus: Record<string, number>
  );
  };
}

export default function ProjectSLPPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const projectId = params?.id as string;
  const [activeFiltersetActiveFilter] = useState('all');

  // React Query for fetching SLP data
  const { data: slpData, isLoading, isError } = useQuery<SLPData>({
    queryKey: ['slp', projectId],
    queryFn: async () => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/slp/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch SLP data');
      }

      return response.json();
    },
    enabled: !!projectId && isAuthenticated,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load SLP data. Using mock data instead.",
        variant: "destructive"
      });
    },
    // Fallback data in case of error
    placeholderData: {
      components: getMockComponents(),
      progress: getMockProgress()
    }
  });

  // Mutation for updating component status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ componentId, status }: { componentId: string; status: string }) => {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/slp/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'updateStatus',
          data: {
            componentId,
            status,
            updatedBy: user?.id || 'unknown',
            notes: `Status updated to ${status}`
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update component status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slp', projectId] });
      toast({
        title: "Success",
        description: "Component status updated successfully.");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update component status.",
        variant: "destructive"
      });
    }
  });

  // Mutation for uploading documents
  const uploadDocumentMutation = useMutation({
    mutationFn: async ({ componentId, file }: { componentId: string; file: File }) => {
      // In a real implementation, you would upload the file to S3 or similar
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`/api/slp/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'uploadDocument',
          data: {
            componentId,
            documentId: `doc-${Date.now()}`,
            documentUrl: `/documents/${file.name}`,
            uploadedBy: user?.id || 'unknown'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['slp', projectId] });
      toast({
        title: "Success",
        description: "Document uploaded successfully.");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload document.",
        variant: "destructive"
      });
    }
  });

  // Loading state
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  // Error state or no data
  if (isError || !slpData) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Unable to load SLP data</h2>
          <p className="mt-2 text-gray-600">Please try again later.</p>
          <Button 
            onClick={() => router.push('/project-management')}
            className="mt-4"
          >
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const { components, progress } = slpData;
  const statusCounts = getStatusCounts(components);

  // Filter components
  const filteredComponents = activeFilter === 'all' 
    ? components 
    : components.filter((component: SLPComponent) => component.status === activeFilter);

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
            <p className="text-gray-500 mt-1">Project ID: {projectId}</p>
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
                <span className="text-sm font-medium">{progress.progressPercentage}% Complete</span>
              </div>
              <Progress value={progress.progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <Card className="p-3 bg-green-50 border border-green-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-green-700">{statusCounts.APPROVED || 0}</p>
                  <p className="text-xs text-green-600">Approved</p>
                </div>
              </Card>
              <Card className="p-3 bg-amber-50 border border-amber-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-amber-700">{statusCounts.IN_REVIEW || 0}</p>
                  <p className="text-xs text-amber-600">In Review</p>
                </div>
              </Card>
              <Card className="p-3 bg-red-50 border border-red-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-red-700">{statusCounts.REJECTED || 0}</p>
                  <p className="text-xs text-red-600">Rejected</p>
                </div>
              </Card>
              <Card className="p-3 bg-gray-50 border border-gray-100">
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700">{statusCounts.PENDING || 0}</p>
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
                variant={activeFilter === 'APPROVED' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('APPROVED')}
              >
                Approved
              </Button>
              <Button 
                variant={activeFilter === 'IN_REVIEW' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('IN_REVIEW')}
              >
                In Review
              </Button>
              <Button 
                variant={activeFilter === 'REJECTED' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('REJECTED')}
              >
                Rejected
              </Button>
              <Button 
                variant={activeFilter === 'PENDING' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setActiveFilter('PENDING')}
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
              {filteredComponents.map((component: SLPComponent) => (
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
                        <label>
                          <input
                            type="file"
                            onChange={(e: any) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                uploadDocumentMutation.mutate({ componentId: component.id, file });
                              }
                            }
                            className="hidden"
                            disabled={uploadDocumentMutation.isLoading}
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            asChild
                            disabled={uploadDocumentMutation.isLoading}
                          >
                            <span>
                              <Upload className="h-4 w-4 mr-1" />
                              {uploadDocumentMutation.isLoading ? 'Uploading...' : 'Upload'}
                            </span>
                          </Button>
                        </label>
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
                      <p className="text-gray-500">No {activeFilter !== 'all' ? activeFilter.toLowerCase() : ''} SLP components found</p>
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

// Helper functions
function getStatusCounts(components: SLPComponent[]) {
  return components.reduce((counts: Record<string, number>, component: SLPComponent) => {
    counts[component.status] = (counts[component.status] || 0) + 1;
    return counts;
  }, {});
}

function formatDate(dateString: string | null) {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'APPROVED':
      return <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center"><Check className="h-3 w-3 mr-1" /> Approved</Badge>
  );
    case 'IN_REVIEW':
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center"><Clock className="h-3 w-3 mr-1" /> In Review</Badge>
  );
    case 'REJECTED':
      return <Badge variant="destructive" className="flex items-center"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>
  );
    case 'PENDING':
    default:
      return <Badge variant="outline" className="flex items-center"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>
  );
  }
}

// Mock data fallback functions
function getMockComponents(): SLPComponent[] {
  return [
    {
      id: 'slp-001',
      name: 'Title Deeds',
      description: 'Original title deeds and land registry documentation',
      required: true,
      status: 'APPROVED',
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
      status: 'APPROVED',
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
      status: 'IN_REVIEW',
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
      status: 'PENDING',
      uploadedBy: null,
      uploadedAt: null,
      reviewedBy: null,
      reviewedAt: null,
      documentId: null,
      documentUrl: null,
      notes: 'Searches to be conducted when plot boundaries are finalized.'
    }
  ];
}

function getMockProgress() {
  return {
    totalComponents: 8,
    approvedComponents: 2,
    progressPercentage: 25,
    componentsbyStatus: {
      APPROVED: 2,
      IN_REVIEW: 1,
      REJECTED: 0,
      PENDING: 5,
      UPLOADED: 0
    }
  };
}