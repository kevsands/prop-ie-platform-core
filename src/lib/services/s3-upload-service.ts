import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// S3 Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || 'prop-ie-documents';
const PRESIGNED_URL_EXPIRY = 3600; // 1 hour

export interface FileUploadResult {
  key: string;
  url: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  uploadedAt: Date;
}

export interface PresignedUploadUrl {
  uploadUrl: string;
  key: string;
  fileName: string;
  expiresIn: number;
}

export class S3UploadService {
  /**
   * Generate presigned URL for client-side file upload
   */
  static async generatePresignedUploadUrl(
    fileName: string,
    contentType: string,
    projectId?: string,
    documentCategory?: string
  ): Promise<PresignedUploadUrl> {
    try {
      // Generate unique key with folder structure
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = fileName.split('.').pop();
      const baseName = fileName.replace(/\.[^/.]+$/, '');
      
      const key = this.generateFileKey({
        projectId,
        documentCategory,
        fileName: `${baseName}-${timestamp}-${randomId}.${fileExtension}`,
      });

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: contentType,
        Metadata: {
          originalFileName: fileName,
          uploadedAt: new Date().toISOString(),
          projectId: projectId || '',
          documentCategory: documentCategory || '',
        },
      });

      const uploadUrl = await getSignedUrl(s3Client, command, {
        expiresIn: PRESIGNED_URL_EXPIRY,
      });

      return {
        uploadUrl,
        key,
        fileName,
        expiresIn: PRESIGNED_URL_EXPIRY,
      };
    } catch (error) {
      console.error('Error generating presigned upload URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  /**
   * Generate presigned URL for file download
   */
  static async generatePresignedDownloadUrl(
    key: string,
    expiresIn: number = 3600
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error generating presigned download URL:', error);
      throw new Error('Failed to generate download URL');
    }
  }

  /**
   * Direct server-side file upload
   */
  static async uploadFile(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string,
    projectId?: string,
    documentCategory?: string
  ): Promise<FileUploadResult> {
    try {
      const key = this.generateFileKey({
        projectId,
        documentCategory,
        fileName,
      });

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        Metadata: {
          originalFileName: fileName,
          uploadedAt: new Date().toISOString(),
          projectId: projectId || '',
          documentCategory: documentCategory || '',
        },
      });

      await s3Client.send(command);

      const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'eu-west-1'}.amazonaws.com/${key}`;

      return {
        key,
        url,
        fileName,
        fileSize: fileBuffer.length,
        contentType,
        uploadedAt: new Date(),
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }
  }

  /**
   * Delete file from S3
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(command);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Generate organized file key with folder structure
   */
  private static generateFileKey({
    projectId,
    documentCategory,
    fileName,
  }: {
    projectId?: string;
    documentCategory?: string;
    fileName: string;
  }): string {
    const parts = ['documents'];
    
    if (projectId) {
      parts.push('projects', projectId);
    }
    
    if (documentCategory) {
      parts.push(documentCategory.toLowerCase().replace(/[^a-z0-9]/g, '-'));
    }
    
    // Add year/month for better organization
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    parts.push(year.toString(), month);
    
    parts.push(fileName);
    
    return parts.join('/');
  }

  /**
   * Get file metadata from S3
   */
  static async getFileMetadata(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(command);
      
      return {
        key,
        contentType: response.ContentType,
        contentLength: response.ContentLength,
        lastModified: response.LastModified,
        metadata: response.Metadata,
      };
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error('Failed to get file metadata');
    }
  }

  /**
   * Validate file for upload
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = [
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
      'application/dwg', // AutoCAD
      'application/dxf', // AutoCAD Exchange Format
    ];

    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `File size exceeds maximum limit of ${maxFileSize / (1024 * 1024)}MB`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { isValid: true };
  }
}

export default S3UploadService;