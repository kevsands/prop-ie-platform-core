'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Download,
  ExternalLink,
  File,
  Image,
  FileText,
  Video,
  Archive,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react';

interface FilePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
  };
}

export function FilePreview({ isOpen, onClose, file }: FilePreviewProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const isImage = file.fileType.startsWith('image/');
  const isPdf = file.fileType === 'application/pdf';
  const isVideo = file.fileType.startsWith('video/');
  const isText = file.fileType === 'text/plain';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (isImage) return <Image size={24} className="text-blue-500" />;
    if (isPdf) return <FileText size={24} className="text-red-500" />;
    if (isVideo) return <Video size={24} className="text-purple-500" />;
    if (file.fileType.includes('zip') || file.fileType.includes('archive')) {
      return <Archive size={24} className="text-yellow-500" />;
    }
    return <File size={24} className="text-gray-500" />;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.fileName;
    link.click();
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <p className="font-semibold">{file.fileName}</p>
                <p className="text-sm text-gray-500 font-normal">
                  {formatFileSize(file.fileSize)} • {file.fileType}
                </p>
              </div>
            </DialogTitle>
            <div className="flex items-center gap-2">
              {isImage && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRotate}
                  >
                    <RotateCw size={16} />
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download size={16} className="mr-1" />
                Download
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {isImage ? (
            <div className="flex justify-center items-center min-h-[400px] bg-gray-50 rounded-lg">
              <img
                src={file.url}
                alt={file.fileName}
                className="max-w-full max-h-full object-contain transition-transform"
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`
                }}
              />
            </div>
          ) : isPdf ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <iframe
                src={file.url}
                className="w-full h-[500px] border-0"
                title={file.fileName}
              />
            </div>
          ) : isVideo ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <video
                src={file.url}
                controls
                className="w-full max-h-[500px]"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : isText ? (
            <div className="bg-gray-50 rounded-lg p-4">
              <iframe
                src={file.url}
                className="w-full h-[400px] border-0"
                title={file.fileName}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              {getFileIcon()}
              <p className="text-lg font-medium text-gray-700 mt-4 mb-2">
                Preview not available
              </p>
              <p className="text-sm text-gray-500 mb-6 text-center">
                This file type cannot be previewed in the browser.
                <br />
                Download the file to view its contents.
              </p>
              <Button onClick={handleDownload} className="bg-blue-600 hover:bg-blue-700">
                <Download size={16} className="mr-2" />
                Download File
              </Button>
            </div>
          )}
        </div>

        {/* File Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>Uploaded: {new Date().toLocaleString()}</span>
            <span>•</span>
            <span>Shared in developer conversation</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(file.url, '_blank')}
            >
              <ExternalLink size={16} className="mr-1" />
              Open in New Tab
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              <X size={16} className="mr-1" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}