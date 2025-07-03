import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useS3Upload, UploadedFile, UploadProgress } from '@/hooks/useS3Upload';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface FileUploadDropzoneProps {
  projectId?: string;
  documentCategory?: string;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedFileTypes?: string[];
  onFilesUploaded?: (files: UploadedFile[]) => void;
  className?: string;
}

const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/zip',
];

export function FileUploadDropzone({
  projectId,
  documentCategory,
  maxFiles = 10,
  maxFileSize = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes = DEFAULT_ACCEPTED_TYPES,
  onFilesUploaded,
  className = '',
}: FileUploadDropzoneProps) {
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [completedUploads, setCompletedUploads] = useState<UploadedFile[]>([]);
  
  const {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    error,
    deleteFile,
  } = useS3Upload({
    projectId,
    documentCategory,
    onSuccess: (file: UploadedFile) => {
      setCompletedUploads(prev => {
        const updated = [...prev, file];
        onFilesUploaded?.(updated);
        return updated;
      });
    },
    onError: (error: Error) => {
      console.error('Upload error:', error);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Validate file count
      if (completedUploads.length + acceptedFiles.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Validate file sizes and types
      const validFiles = acceptedFiles.filter(file => {
        if (file.size > maxFileSize) {
          alert(`File ${file.name} is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB`);
          return false;
        }
        if (!acceptedFileTypes.includes(file.type)) {
          alert(`File type ${file.type} is not supported for ${file.name}`);
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setUploadQueue(validFiles);
        uploadMultipleFiles(validFiles);
      }
    },
    [acceptedFileTypes, completedUploads.length, maxFiles, maxFileSize, uploadMultipleFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles,
    maxSize: maxFileSize,
    disabled: isUploading,
  });

  const removeCompletedFile = async (file: UploadedFile) => {
    try {
      await deleteFile(file.key);
      setCompletedUploads(prev => {
        const updated = prev.filter(f => f.key !== file.key);
        onFilesUploaded?.(updated);
        return updated;
      });
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.includes('pdf')) return '📄';
    if (contentType.includes('word') || contentType.includes('document')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('zip')) return '🗜️';
    return '📁';
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
          }
          ${isUploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          or click to select files
        </p>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          <p>Maximum {maxFiles} files, up to {maxFileSize / (1024 * 1024)}MB each</p>
          <p>Supported: PDF, Word, Excel, Images, Text, ZIP</p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && progress && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Uploading files...
            </span>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {progress.percentage}%
            </span>
          </div>
          <Progress value={progress.percentage} className="h-2" />
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            {formatFileSize(progress.loaded)} of {formatFileSize(progress.total)}
          </p>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Uploaded Files List */}
      {completedUploads.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Uploaded Files ({completedUploads.length})
          </h3>
          <div className="space-y-2">
            {completedUploads.map((file) => (
              <div
                key={file.key}
                className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getFileIcon(file.contentType)}</span>
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      {file.fileName}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-green-600 dark:text-green-400">
                      <span>{formatFileSize(file.fileSize)}</span>
                      <Badge variant="secondary" className="text-xs">
                        {documentCategory || 'Document'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompletedFile(file)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadDropzone;