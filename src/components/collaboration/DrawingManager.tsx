"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Upload, Download, Eye, MessageSquare, Clock, CheckCircle, AlertTriangle, Plus } from 'lucide-react';
import { DialogDrawing } from '@/types/collaboration';
import { collaborationService } from '@/lib/collaboration';

interface DrawingManagerProps {
  projectId: string;
}

export const DrawingManager: React.FC<DrawingManagerProps> = ({ projectId }) => {
  const [drawingssetDrawings] = useState<DialogDrawing[]>([]);
  const [filteredDrawingssetFilteredDrawings] = useState<DialogDrawing[]>([]);
  const [filtersetFilter] = useState<string>('all');
  const [searchTermsetSearchTerm] = useState('');
  const [loadingsetLoading] = useState(true);
  const [selectedDrawingsetSelectedDrawing] = useState<DialogDrawing | null>(null);
  const [uploadModalOpensetUploadModalOpen] = useState(false);

  useEffect(() => {
    fetchDrawings();
  }, [projectId]);

  useEffect(() => {
    filterDrawings();
  }, [drawings, filtersearchTerm]);

  const fetchDrawings = async () => {
    try {
      setLoading(true);
      const data = await collaborationService.getDrawings(projectId);
      setDrawings(data);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  const filterDrawings = () => {
    let filtered = [...drawings];

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(drawing => drawing.status === filter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(drawing => 
        drawing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drawing.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredDrawings(filtered);
  };

  const handleUpload = async (file: File) => {
    // Mock upload implementation

    // In a real implementation, this would upload to S3 and create a database record
    setUploadModalOpen(false);
    fetchDrawings(); // Refresh the list
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />\n  );
      case 'pending_review':
        return <Clock className="h-4 w-4 text-yellow-500" />\n  );
      case 'needs_revision':
        return <AlertTriangle className="h-4 w-4 text-red-500" />\n  );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending_review':
        return 'warning';
      case 'needs_revision':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Drawing Manager</h1>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Drawing
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search drawings..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
                <SelectItem value="needs_revision">Needs Revision</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Drawing Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrawings.map((drawing: any) => (
            <Card key={drawing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{drawing.name}</CardTitle>
                  <Badge variant={getStatusColor(drawing.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(drawing.status)}
                      <span className="capitalize">{drawing.status.replace('_', ' ')}</span>
                    </div>
                  </Badge>
                </div>
                <CardDescription>{drawing.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Version {drawing.version}</span>
                    <span>{new Date(drawing.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedDrawing(drawing)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Comments
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Sheet open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Upload New Drawing</SheetTitle>
            <SheetDescription>
              Upload a new drawing file to the project
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="drawing-name">Drawing Name</Label>
              <Input id="drawing-name" placeholder="Enter drawing name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drawing-description">Description</Label>
              <Input id="drawing-description" placeholder="Optional description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="drawing-file">Select File</Label>
              <Input 
                id="drawing-file" 
                type="file" 
                accept=".pdf,.dwg,.dxf,.png,.jpg"
                onChange={(e: any) => {
                  const file = e.target.files?.[0];
                  if (file) handleUpload(file);
                }
              />
              <p className="text-sm text-gray-500">
                Accepted formats: PDF, DWG, DXF, PNG, JPG
              </p>
            </div>
            <Button className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Drawing
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Drawing Preview Modal */}
      {selectedDrawing && (
        <Sheet open={!!selectedDrawing} onOpenChange={() => setSelectedDrawing(null)}>
          <SheetContent className="sm:max-w-2xl">
            <SheetHeader>
              <SheetTitle>{selectedDrawing.name}</SheetTitle>
              <SheetDescription>
                Version {selectedDrawing.version} • Uploaded by {selectedDrawing.uploadedBy}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Drawing preview would appear here</p>
              </div>
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Details</h3>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Status:</dt>
                      <dd>
                        <Badge variant={getStatusColor(selectedDrawing.status)}>
                          {selectedDrawing.status.replace('_', ' ')}
                        </Badge>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Uploaded:</dt>
                      <dd>{new Date(selectedDrawing.createdAt).toLocaleString()}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Size:</dt>
                      <dd>2.4 MB</dd>
                    </div>
                  </dl>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
};