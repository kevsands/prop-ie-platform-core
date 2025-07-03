import { useState, useCallback } from 'react';
import axios from 'axios';

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadedFile {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: Date;
}

export interface UseS3UploadOptions {
  projectId?: string;
  documentCategory?: string;
  onProgress?: (progress: UploadProgress) => void;
  onSuccess?: (file: UploadedFile) => void;
  onError?: (error: Error) => void;
}

export interface UseS3UploadReturn {
  uploadFile: (file: File) => Promise<UploadedFile>;
  uploadMultipleFiles: (files: File[]) => Promise<UploadedFile[]>;
  isUploading: boolean;
  progress: UploadProgress | null;
  error: string | null;
  uploadedFiles: UploadedFile[];
  deleteFile: (key: string) => Promise<void>;
  getDownloadUrl: (key: string, expiresIn?: number) => Promise<string>;
}

export function useS3Upload(options: UseS3UploadOptions = {}): UseS3UploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const { projectId, documentCategory, onProgress, onSuccess, onError } = options;

  const uploadFile = useCallback(async (file: File): Promise<UploadedFile> => {
    setIsUploading(true);
    setError(null);
    setProgress({ loaded: 0, total: file.size, percentage: 0 });

    try {
      // Step 1: Get presigned upload URL
      const presignedResponse = await axios.get('/api/files/upload', {
        params: {
          fileName: file.name,
          contentType: file.type,
          projectId,
          documentCategory,
        },
      });

      const { uploadUrl, key } = presignedResponse.data.data;

      // Step 2: Upload file directly to S3
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progressData = {
              loaded: progressEvent.loaded,
              total: progressEvent.total,
              percentage: Math.round((progressEvent.loaded / progressEvent.total) * 100),
            };
            setProgress(progressData);
            onProgress?.(progressData);
          }
        },
      });

      // Step 3: Confirm upload with backend
      const confirmResponse = await axios.post('/api/files/upload', {
        action: 'confirm',
        key,
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        projectId,
        documentCategory,
      });

      const uploadedFile = confirmResponse.data.data;
      setUploadedFiles(prev => [...prev, uploadedFile]);
      onSuccess?.(uploadedFile);
      
      return uploadedFile;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Upload failed';
      setError(errorMessage);
      onError?.(new Error(errorMessage));
      throw new Error(errorMessage);
    } finally {
      setIsUploading(false);
      setProgress(null);
    }
  }, [projectId, documentCategory, onProgress, onSuccess, onError]);

  const uploadMultipleFiles = useCallback(async (files: File[]): Promise<UploadedFile[]> => {
    const uploadedFiles: UploadedFile[] = [];
    
    for (const file of files) {
      try {
        const uploadedFile = await uploadFile(file);
        uploadedFiles.push(uploadedFile);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        // Continue with other files even if one fails
      }
    }
    
    return uploadedFiles;
  }, [uploadFile]);

  const deleteFile = useCallback(async (key: string): Promise<void> => {
    try {
      await axios.delete('/api/files/upload', {
        params: { key },
      });
      
      setUploadedFiles(prev => prev.filter(file => file.key !== key));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Delete failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  const getDownloadUrl = useCallback(async (key: string, expiresIn = 3600): Promise<string> => {
    try {
      const response = await axios.get('/api/files/download', {
        params: { key, expiresIn },
      });
      
      return response.data.data.downloadUrl;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'Failed to get download URL';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    uploadFile,
    uploadMultipleFiles,
    isUploading,
    progress,
    error,
    uploadedFiles,
    deleteFile,
    getDownloadUrl,
  };
}

export default useS3Upload;