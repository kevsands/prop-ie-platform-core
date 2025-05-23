'use client';

import React, { useState, useRef, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger} from '@/components/ui/popover';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Printer,
  Share2,
  MessageSquare,
  Highlighter,
  Type,
  Square,
  Circle,
  PenTool,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  FileText,
  Settings
} from 'lucide-react';
import { Document as DocumentType } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';

interface Annotation {
  id: string;
  type: 'highlight' | 'text' | 'drawing' | 'shape';
  page: number;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
  };
  content?: string;
  color?: string;
  author: string;
  timestamp: Date;
}

interface DocumentViewerProps {
  document: DocumentType;
  onClose: () => void;
  onSave?: (annotations: Annotation[]) => Promise<void>\n  );
  enableAnnotations?: boolean;
  enableWatermark?: boolean;
  enableDownloadProtection?: boolean;
  watermarkText?: string;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onSave,
  enableAnnotations = true,
  enableWatermark = false,
  enableDownloadProtection = false,
  watermarkText = 'CONFIDENTIAL'
}) => {
  const [currentPagesetCurrentPage] = useState(1);
  const [totalPagessetTotalPages] = useState(1);
  const [zoomLevelsetZoomLevel] = useState(100);
  const [rotationsetRotation] = useState(0);
  const [annotationssetAnnotations] = useState<Annotation[]>([]);
  const [selectedToolsetSelectedTool] = useState<string | null>(null);
  const [isFullscreensetIsFullscreen] = useState(false);
  const [showAnnotationssetShowAnnotations] = useState(true);
  const [isProtectedsetIsProtected] = useState(enableDownloadProtection);
  const [selectedAnnotationsetSelectedAnnotation] = useState<string | null>(null);

  const viewerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mock PDF rendering (in production, use PDF.js or similar)
  React.useEffect(() => {
    // Simulate loading PDF and getting page count
    setTotalPages(10); // Mock value
  }, [document]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1050));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage>= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownload = async () => {
    if (isProtected) {
      alert('This document is protected and cannot be downloaded.');
      return;
    }

    // In production, implement actual download logic

  };

  const handlePrint = () => {
    if (isProtected) {
      // Apply watermark for printing
      window.print();
    } else {
      window.print();
    }
  };

  const handleShare = async () => {
    // In production, implement sharing logic

  };

  const addAnnotation = (annotation: Omit<Annotation, 'id' | 'timestamp'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: `ann-${Date.now()}`,
      timestamp: new Date()
    };
    setAnnotations(prev => [...prevnewAnnotation]);
  };

  const updateAnnotation = (id: string, updates: Partial<Annotation>) => {
    setAnnotations(prev => 
      prev.map(ann => ann.id === id ? { ...ann, ...updates } : ann)
    );
  };

  const deleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const handleSaveAnnotations = async () => {
    if (onSave) {
      await onSave(annotations);
    }
  };

  const renderWatermark = () => {
    if (!enableWatermark) return null;

    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform rotate-45 opacity-10">
            <p className="text-6xl font-bold text-gray-500 select-none">
              {watermarkText}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderAnnotations = () => {
    if (!showAnnotations) return null;

    return annotations
      .filter(ann => ann.page === currentPage)
      .map(annotation => (
        <div
          key={annotation.id}
          className={cn(
            "absolute border-2 cursor-pointer",
            selectedAnnotation === annotation.id ? "border-primary" : "border-transparent",
            annotation.type === 'highlight' && "bg-yellow-200 opacity-30"
          )}
          style={
            left: `${annotation.position.x}%`,
            top: `${annotation.position.y}%`,
            width: annotation.position.width ? `${annotation.position.width}%` : 'auto',
            height: annotation.position.height ? `${annotation.position.height}%` : 'auto'}
          onClick={() => setSelectedAnnotation(annotation.id)}
        >
          {annotation.type === 'text' && (
            <div className="bg-yellow-100 p-2 rounded shadow-md">
              <p className="text-xs">{annotation.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                {annotation.author} • {new Date(annotation.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      ));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="border-b bg-gray-50 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{document.name}</h3>
              {isProtected && (
                <Badge variant="secondary">
                  <Lock className="h-3 w-3 mr-1" />
                  Protected
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* View Controls */}
              <div className="flex items-center space-x-1 border-r pr-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoomLevel <= 50}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm w-12 text-center">{zoomLevel}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoomLevel>= 200}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRotate}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Annotation Tools */}
              {enableAnnotations && (
                <div className="flex items-center space-x-1 border-r pr-2">
                  <Button
                    variant={selectedTool === 'highlight' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedTool('highlight')}
                  >
                    <Highlighter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'text' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedTool('text')}
                  >
                    <Type className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={selectedTool === 'draw' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setSelectedTool('draw')}
                  >
                    <PenTool className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAnnotations(!showAnnotations)}
                  >
                    {showAnnotations ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDownload}
                  disabled={isProtected}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                {enableAnnotations && annotations.length> 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSaveAnnotations}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Document Viewer */}
          <div className="flex-1 relative bg-gray-100 overflow-auto" ref={viewerRef}>
            <div 
              className="relative mx-auto my-8 bg-white shadow-lg"
              style={
                width: `${8.5 * (zoomLevel / 100)}in`,
                minHeight: `${11 * (zoomLevel / 100)}in`,
                transform: `rotate(${rotation}deg)`,
                transformOrigin: 'center'}
            >
              {/* Watermark */}
              {renderWatermark()}

              {/* Document Content (Mock) */}
              <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Document Preview</h1>
                <p className="text-gray-600 mb-4">
                  This is a preview of page {currentPage} of {totalPages}.
                </p>
                <p className="text-sm text-gray-500">
                  Document Type: {document.type}<br />
                  Category: {document.category}<br />
                  Status: {document.status}<br />
                  Version: {document.version}
                </p>
              </div>

              {/* Annotations Layer */}
              <div className="absolute inset-0 pointer-events-none">
                {renderAnnotations()}
              </div>

              {/* Canvas for drawing annotations */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
                style={ display: selectedTool === 'draw' ? 'block' : 'none' }
              />
            </div>
          </div>

          {/* Sidebar */}
          {enableAnnotations && (
            <div className="w-80 border-l bg-white">
              <Tabs defaultValue="comments" className="h-full">
                <TabsList className="w-full rounded-none">
                  <TabsTrigger value="comments" className="flex-1">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value="info" className="flex-1">
                    <FileText className="h-4 w-4 mr-2" />
                    Info
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="comments" className="p-4 h-full">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {annotations.filter(ann => ann.type === 'text').map(annotation => (
                        <div key={annotation.id} className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">{annotation.author}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteAnnotation(annotation.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-sm">{annotation.content}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Page {annotation.page} • {new Date(annotation.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="info" className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Document Details</h4>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-gray-500">File Size</dt>
                          <dd>{(document.fileSize / 1024 / 1024).toFixed(2)} MB</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Upload Date</dt>
                          <dd>{new Date(document.uploadDate).toLocaleDateString()}</dd>
                        </div>
                        <div>
                          <dt className="text-gray-500">Uploaded By</dt>
                          <dd>{document.uploadedBy.name}</dd>
                        </div>
                        {document.expiryDate && (
                          <div>
                            <dt className="text-gray-500">Expiry Date</dt>
                            <dd>{new Date(document.expiryDate).toLocaleDateString()}</dd>
                          </div>
                        )}
                      </dl>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Security Settings</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Download Protection</span>
                          <Badge variant={isProtected ? "default" : "secondary">
                            {isProtected ? "Enabled" : "Disabled"
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Watermark</span>
                          <Badge variant={enableWatermark ? "default" : "secondary">
                            {enableWatermark ? "Enabled" : "Disabled"
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>

        {/* Footer with page navigation */}
        <div className="border-t bg-gray-50 px-4 py-2">
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={currentPage}
                onChange={(e) => handlePageChange(parseInt(e.target.value) || 1)}
                className="w-16 text-center"
                min="1"
                max={totalPages}
              />
              <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;