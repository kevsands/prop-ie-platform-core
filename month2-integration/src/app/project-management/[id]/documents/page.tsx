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
import { 
  ArrowLeft,
  FileText,
  Upload,
  Filter,
  Download,
  Search,
  Check,
  AlertCircle,
  Clock,
  Trash,
  FolderOpen
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data
const mockDocuments = [
  {
    id: 'doc-001',
    name: 'Title Deeds',
    description: 'Original title deeds and land registry documentation',
    category: 'legal',
    status: 'approved',
    uploadedBy: 'John Smith',
    uploadedAt: '2023-07-21T10:30:00Z',
    fileSize: 2456789,
    fileType: 'application/pdf',
    url: '/documents/title-deeds.pdf',
    version: 1,
  },
  {
    id: 'doc-002',
    name: 'Planning Permission',
    description: 'Planning permission documentation and conditions',
    category: 'planning',
    status: 'approved',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2023-07-22T14:20:00Z',
    fileSize: 3541234,
    fileType: 'application/pdf',
    url: '/documents/planning-permission.pdf',
    version: 2,
  },
  {
    id: 'doc-003',
    name: 'Building Regulations Compliance',
    description: 'Documentation showing compliance with building regulations',
    category: 'technical',
    status: 'in-review',
    uploadedBy: 'Michael Brown',
    uploadedAt: '2023-08-05T09:15:00Z',
    fileSize: 4102562,
    fileType: 'application/pdf',
    url: '/documents/building-regs.pdf',
    version: 1,
  },
  {
    id: 'doc-004',
    name: 'Property Brochure',
    description: 'Marketing brochure for Fitzgerald Gardens',
    category: 'marketing',
    status: 'approved',
    uploadedBy: 'Emily Wong',
    uploadedAt: '2023-06-15T11:45:00Z',
    fileSize: 8957123,
    fileType: 'application/pdf',
    url: '/documents/fitzgerald-gardens-brochure.pdf',
    version: 3,
  },
  {
    id: 'doc-005',
    name: 'New Home Warranty',
    description: 'Home structural warranty documentation',
    category: 'legal',
    status: 'approved',
    uploadedBy: 'John Smith',
    uploadedAt: '2023-07-30T16:40:00Z',
    fileSize: 1254871,
    fileType: 'application/pdf',
    url: '/documents/warranty.pdf',
    version: 1,
  },
  {
    id: 'doc-006',
    name: 'Management Company Information',
    description: 'Details about property management company and service charges',
    category: 'legal',
    status: 'in-review',
    uploadedBy: 'Sarah Johnson',
    uploadedAt: '2023-08-10T11:30:00Z',
    fileSize: 2145789,
    fileType: 'application/pdf',
    url: '/documents/management-company.pdf',
    version: 2,
  },
  {
    id: 'doc-007',
    name: 'Energy Performance Certificate',
    description: 'Energy efficiency rating documentation',
    category: 'technical',
    status: 'rejected',
    uploadedBy: 'Michael Brown',
    uploadedAt: '2023-08-01T13:45:00Z',
    fileSize: 845123,
    fileType: 'application/pdf',
    url: '/documents/epc.pdf',
    version: 1,
  },
  {
    id: 'doc-008',
    name: 'Sale Contract Template',
    description: 'Standard contract for unit sales',
    category: 'legal',
    status: 'approved',
    uploadedBy: 'Legal Team',
    uploadedAt: '2023-07-15T14:30:00Z',
    fileSize: 1352487,
    fileType: 'application/pdf',
    url: '/documents/sale-contract.pdf',
    version: 4,
  },
  {
    id: 'doc-009',
    name: 'Site Plan',
    description: 'Detailed site plan with plot numbers',
    category: 'planning',
    status: 'approved',
    uploadedBy: 'Development Team',
    uploadedAt: '2023-06-20T09:30:00Z',
    fileSize: 4521453,
    fileType: 'application/pdf',
    url: '/documents/site-plan.pdf',
    version: 2,
  },
  {
    id: 'doc-010',
    name: 'Construction Schedule',
    description: 'Detailed construction timeline',
    category: 'planning',
    status: 'in-review',
    uploadedBy: 'Project Manager',
    uploadedAt: '2023-08-12T10:15:00Z',
    fileSize: 1258456,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: '/documents/construction-schedule.xlsx',
    version: 3,
  }
];

// Mock projects
const mockProjects = {
  'proj-001': {
    id: 'proj-001',
    name: 'Fitzgerald Gardens'
  },
  'proj-002': {
    id: 'proj-002',
    name: 'Riverside Manor'
  },
  'proj-003': {
    id: 'proj-003',
    name: 'Ballymakenny View'
  }
};

export default function ProjectDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.id as string;
  
  // Get project details or redirect if not found
  const project = mockProjects[projectId as keyof typeof mockProjects];
  if (!project) {
    router.push('/project-management');
    return null;
  }
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'in-review':
        return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" /> In Review</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };
  
  // Filter documents
  const filteredDocuments = mockDocuments.filter(doc => {
    // Search query filter
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link href={`/project-management/${projectId}`} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Project
        </Link>
        
        <div className="flex justify-between items-center mt-2">
          <div>
            <h1 className="text-3xl font-bold">Project Documents</h1>
            <p className="text-gray-500 mt-1">{project.name}</p>
          </div>
          
          <Link href={`/project-management/${projectId}/documents/upload`}>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Filter Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="legal">Legal</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Documents</CardTitle>
              <CardDescription>
                {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'} found
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <FolderOpen className="mr-2 h-4 w-4" />
                Manage Folders
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Version</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map(doc => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-gray-500 truncate max-w-[250px]">{doc.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{doc.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(doc.status)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">{formatDate(doc.uploadedAt)}</p>
                      <p className="text-gray-500">{doc.uploadedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatFileSize(doc.fileSize)}
                  </TableCell>
                  <TableCell>
                    v{doc.version}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Link href={doc.url}>
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/project-management/${projectId}/documents/${doc.id}`}>
                        <Button size="sm">
                          <Check className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredDocuments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-gray-300 mb-3" />
                      <p className="text-gray-500">No documents found matching your filters</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                        setSearchQuery('');
                        setCategoryFilter('all');
                        setStatusFilter('all');
                      }}>
                        Clear Filters
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-gray-500">
            Showing {filteredDocuments.length} of {mockDocuments.length} documents
          </p>
          <Button variant="outline">
            Load More
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 