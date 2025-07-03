'use client';

import React, { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Upload,
  File,
  Image,
  FileText,
  X,
  AlertCircle,
  CheckCircle2,
  Paperclip,
  Camera,
  Video,
  Archive
} from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: UploadedFile[], message?: string) => Promise<void>;
  conversationId: string;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
}

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
  uploadProgress: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
}

export function FileUploadModal({
  isOpen,
  onClose,
  onUpload,
  conversationId,
  maxFileSize = 10, // 10MB default
  allowedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt', '.zip', '.dwg']
}: FileUploadModalProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = [];

    fileList.forEach((file) => {
      // Validate file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB.`);
        return;
      }

      // Validate file type
      const isValidType = allowedTypes.some(type => {
        if (type.includes('*')) {
          return file.type.startsWith(type.replace('*', ''));
        }
        return file.type === type || file.name.toLowerCase().endsWith(type);
      });

      if (!isValidType) {
        alert(`File type not supported: ${file.type}`);
        return;
      }

      const uploadedFile: UploadedFile = {
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadProgress: 0,
        uploadStatus: 'pending'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles(prev => prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, preview: e.target?.result as string }
              : f
          ));
        };
        reader.readAsDataURL(file);
      }

      newFiles.push(uploadedFile);
    });

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      // Simulate upload progress for each file
      const uploadPromises = files.map(async (file) => {
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, uploadStatus: 'uploading' }
            : f
        ));

        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.id === file.id 
              ? { ...f, uploadProgress: progress }
              : f
          ));
        }

        // Simulate successful upload
        const uploadedUrl = URL.createObjectURL(file.file);
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, uploadStatus: 'completed', url: uploadedUrl }
            : f
        ));

        return { ...file, url: uploadedUrl };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      await onUpload(uploadedFiles, message.trim() || undefined);

      // Reset form
      setFiles([]);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setFiles(prev => prev.map(f => ({ ...f, uploadStatus: 'error' })));
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image size={16} className="text-blue-500" />;
    if (type.includes('pdf')) return <FileText size={16} className="text-red-500" />;
    if (type.includes('video/')) return <Video size={16} className="text-purple-500" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive size={16} className="text-yellow-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Paperclip size={20} className="text-blue-600" />
            Upload Files
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              Drop files here or click to browse
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Maximum file size: {maxFileSize}MB
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              accept={allowedTypes.join(',')}
              className="hidden"
              id="file-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="bg-white"
            >
              <Upload size={16} className="mr-2" />
              Choose Files
            </Button>
          </div>

          {/* Supported File Types */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Supported file types:</h4>
            <div className="flex flex-wrap gap-2">
              {[
                { type: 'Images', icon: <Image size={14} />, color: 'text-blue-600' },
                { type: 'PDF', icon: <FileText size={14} />, color: 'text-red-600' },
                { type: 'Documents', icon: <File size={14} />, color: 'text-green-600' },
                { type: 'CAD Files', icon: <File size={14} />, color: 'text-purple-600' },
                { type: 'Archives', icon: <Archive size={14} />, color: 'text-yellow-600' }
              ].map((item, index) => (
                <div key={index} className={`flex items-center gap-1 text-xs ${item.color}`}>
                  {item.icon}
                  <span>{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-700">Selected Files ({files.length})</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {file.preview ? (
                      <img src={file.preview} alt={file.name} className="w-10 h-10 object-cover rounded" />
                    ) : (
                      <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      
                      {file.uploadStatus === 'uploading' && (
                        <Progress value={file.uploadProgress} className="mt-1" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {file.uploadStatus === 'completed' && (
                        <CheckCircle2 size={16} className="text-green-500" />
                      )}
                      {file.uploadStatus === 'error' && (
                        <AlertCircle size={16} className="text-red-500" />
                      )}
                      {!uploading && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 hover:bg-gray-100 rounded-full"
                        >
                          <X size={16} className="text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message with your files..."
              rows={3}
              className="mt-1"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={uploading}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {uploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload {files.length} file{files.length !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}