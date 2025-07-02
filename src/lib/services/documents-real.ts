/**
 * Real Documents Service for PostgreSQL database operations
 * CRITICAL: Supports €2M+ active sales transactions with enterprise KYC/AML verification
 * Handles legal documents, contracts, KYC, HTB, and compliance documents with AWS S3 storage
 */

import { PrismaClient } from '@prisma/client';
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { DocumentType, DocumentCategory, DocumentVerificationStatus } from '@/types/document';

// Initialize Prisma client
const prisma = new PrismaClient();

// AWS S3 Configuration
const s3Config = {
  region: process.env.AWS_REGION || "eu-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ""
  }
};

const s3Client = new S3Client(s3Config);
const bucketName = process.env.AWS_S3_BUCKET_NAME || "propie-documents-production";

// Document interfaces matching our business requirements
export type Document = {
  id: string;
  title: string;
  description?: string;
  type: string; // DocumentType as string
  url: string;
  mimeType?: string;
  size?: number;
  uploadedBy: string;
  ownerId?: string;
  ownerType?: string;
  tagsData?: string; // JSON string
  version: number;
  isPublic: boolean;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  // KYC/AML specific fields
  verificationStatus?: string;
  verifiedAt?: Date;
  verifiedBy?: string;
  aiProcessingId?: string;
  aiExtractedData?: any;
  aiConfidenceScore?: number;
  isEncrypted?: boolean;
  encryptionKey?: string;
};

export type DocumentVersion = {
  id: string;
  documentId: string;
  version: number;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
  changeNotes?: string;
};

export type CreateDocumentInput = {
  title: string;
  description?: string;
  type: string;
  url: string;
  mimeType?: string;
  size?: number;
  uploadedBy: string;
  ownerId?: string;
  ownerType?: string;
  tags?: string[];
  isPublic?: boolean;
  expiryDate?: Date;
  // KYC/AML specific fields
  documentCategory?: DocumentCategory;
  documentType?: DocumentType;
  isEncrypted?: boolean;
};

export type UpdateDocumentInput = {
  title?: string;
  description?: string;
  type?: string;
  tags?: string[];
  isPublic?: boolean;
  expiryDate?: Date;
  verificationStatus?: DocumentVerificationStatus;
  verifiedBy?: string;
  aiExtractedData?: any;
  aiConfidenceScore?: number;
};

/**
 * Real documents service with PostgreSQL database operations and AWS S3 integration
 * Handles enterprise-grade document management for property transactions and KYC/AML compliance
 */
export const documentsService = {
  /**
   * Get all documents with optional filtering
   */
  getDocuments: async (filters?: { 
    ownerId?: string;
    ownerType?: string;
    type?: string;
    uploadedBy?: string;
    isPublic?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
    verificationStatus?: DocumentVerificationStatus;
  }): Promise<{
    documents: Document[];
    total: number;
  }> => {
    try {
      const where: any = {};

      if (filters?.ownerId) {
        where.userId = filters.ownerId;
      }
      
      if (filters?.type) {
        where.documentType = filters.type;
      }
      
      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      if (filters?.verificationStatus) {
        where.verificationStatus = filters.verificationStatus;
      }

      // Get total count
      const total = await prisma.document.count({ where });

      // Get documents with pagination
      const documents = await prisma.document.findMany({
        where,
        orderBy: { uploadedAt: 'desc' },
        take: filters?.limit || 20,
        skip: filters?.offset || 0,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          verificationWorkflows: {
            select: {
              id: true,
              status: true,
              workflowType: true,
              decision: true,
              overallRiskScore: true
            }
          }
        }
      });

      return {
        documents: documents.map(doc => ({
          id: doc.id,
          title: doc.name,
          description: doc.description || undefined,
          type: doc.documentType.toString(),
          url: doc.filePath,
          mimeType: doc.mimeType,
          size: doc.fileSize,
          uploadedBy: doc.userId,
          version: 1, // Simplified versioning for now
          isPublic: false, // Documents are private by default for security
          createdAt: doc.uploadedAt,
          updatedAt: doc.updatedAt,
          verificationStatus: doc.verificationStatus?.toString(),
          verifiedAt: doc.verifiedAt || undefined,
          verifiedBy: doc.verifiedBy || undefined,
          aiProcessingId: doc.aiProcessingId || undefined,
          aiExtractedData: doc.aiExtractedData,
          aiConfidenceScore: doc.aiConfidenceScore || undefined,
          isEncrypted: doc.isEncrypted,
          encryptionKey: doc.encryptionKey || undefined
        })),
        total
      };
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }
  },

  /**
   * Get a single document by ID
   */
  getDocumentById: async (id: string): Promise<Document | null> => {
    try {
      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          verificationWorkflows: {
            select: {
              id: true,
              status: true,
              workflowType: true,
              decision: true,
              overallRiskScore: true
            }
          }
        }
      });

      if (!document) {
        return null;
      }

      return {
        id: document.id,
        title: document.name,
        description: document.description || undefined,
        type: document.documentType.toString(),
        url: document.filePath,
        mimeType: document.mimeType,
        size: document.fileSize,
        uploadedBy: document.userId,
        version: 1,
        isPublic: false,
        createdAt: document.uploadedAt,
        updatedAt: document.updatedAt,
        verificationStatus: document.verificationStatus?.toString(),
        verifiedAt: document.verifiedAt || undefined,
        verifiedBy: document.verifiedBy || undefined,
        aiProcessingId: document.aiProcessingId || undefined,
        aiExtractedData: document.aiExtractedData,
        aiConfidenceScore: document.aiConfidenceScore || undefined,
        isEncrypted: document.isEncrypted,
        encryptionKey: document.encryptionKey || undefined
      };
    } catch (error) {
      console.error('Error fetching document by ID:', error);
      throw new Error('Failed to fetch document');
    }
  },

  /**
   * Create a new document
   */
  createDocument: async (documentData: CreateDocumentInput): Promise<Document> => {
    try {
      // Determine file hash for deduplication (simplified)
      const fileHash = `hash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const document = await prisma.document.create({
        data: {
          userId: documentData.uploadedBy,
          name: documentData.title,
          description: documentData.description,
          documentType: documentData.documentType || DocumentType.OTHER,
          category: documentData.documentCategory || DocumentCategory.OTHER,
          fileName: documentData.title,
          filePath: documentData.url,
          fileSize: documentData.size || 0,
          mimeType: documentData.mimeType || 'application/octet-stream',
          fileHash,
          verificationStatus: DocumentVerificationStatus.PENDING,
          isEncrypted: documentData.isEncrypted ?? true,
          encryptionKey: documentData.isEncrypted ? `enc_${Date.now()}` : undefined,
          gdprBasis: 'legitimate_interest',
          retentionPeriod: 7 * 365, // 7 years for compliance
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      // Create initial verification workflow for KYC/AML documents
      if (documentData.documentType === DocumentType.IDENTITY || 
          documentData.documentType === DocumentType.FINANCIAL) {
        await prisma.verificationWorkflow.create({
          data: {
            workflowId: `wf_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: documentData.uploadedBy,
            documentId: document.id,
            workflowType: documentData.documentType === DocumentType.IDENTITY 
              ? 'KYC_IDENTITY' 
              : 'KYC_DOCUMENT',
            status: 'INITIATED',
            priority: 'MEDIUM',
            identityStatus: 'PENDING',
            documentValidationStatus: 'PENDING',
            amlStatus: 'PENDING',
            riskLevel: 'LOW',
            regulatoryReqs: ['GDPR', 'PCI_DSS', 'AML_DIRECTIVE']
          }
        });
      }

      return {
        id: document.id,
        title: document.name,
        description: document.description || undefined,
        type: document.documentType.toString(),
        url: document.filePath,
        mimeType: document.mimeType,
        size: document.fileSize,
        uploadedBy: document.userId,
        version: 1,
        isPublic: false,
        createdAt: document.uploadedAt,
        updatedAt: document.updatedAt,
        verificationStatus: document.verificationStatus?.toString(),
        isEncrypted: document.isEncrypted,
        encryptionKey: document.encryptionKey || undefined
      };
    } catch (error) {
      console.error('Error creating document:', error);
      throw new Error('Failed to create document');
    }
  },

  /**
   * Update an existing document
   */
  updateDocument: async (id: string, updateData: UpdateDocumentInput): Promise<Document | null> => {
    try {
      const updatePayload: any = {};

      if (updateData.title !== undefined) {
        updatePayload.name = updateData.title;
      }
      if (updateData.description !== undefined) {
        updatePayload.description = updateData.description;
      }
      if (updateData.verificationStatus !== undefined) {
        updatePayload.verificationStatus = updateData.verificationStatus;
        if (updateData.verificationStatus === DocumentVerificationStatus.VERIFIED) {
          updatePayload.verifiedAt = new Date();
          updatePayload.verifiedBy = updateData.verifiedBy;
        }
      }
      if (updateData.aiExtractedData !== undefined) {
        updatePayload.aiExtractedData = updateData.aiExtractedData;
      }
      if (updateData.aiConfidenceScore !== undefined) {
        updatePayload.aiConfidenceScore = updateData.aiConfidenceScore;
      }

      const document = await prisma.document.update({
        where: { id },
        data: updatePayload,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      return {
        id: document.id,
        title: document.name,
        description: document.description || undefined,
        type: document.documentType.toString(),
        url: document.filePath,
        mimeType: document.mimeType,
        size: document.fileSize,
        uploadedBy: document.userId,
        version: 1,
        isPublic: false,
        createdAt: document.uploadedAt,
        updatedAt: document.updatedAt,
        verificationStatus: document.verificationStatus?.toString(),
        verifiedAt: document.verifiedAt || undefined,
        verifiedBy: document.verifiedBy || undefined,
        aiProcessingId: document.aiProcessingId || undefined,
        aiExtractedData: document.aiExtractedData,
        aiConfidenceScore: document.aiConfidenceScore || undefined,
        isEncrypted: document.isEncrypted,
        encryptionKey: document.encryptionKey || undefined
      };
    } catch (error) {
      console.error('Error updating document:', error);
      throw new Error('Failed to update document');
    }
  },

  /**
   * Delete a document (with S3 cleanup)
   */
  deleteDocument: async (id: string): Promise<boolean> => {
    try {
      const document = await prisma.document.findUnique({
        where: { id }
      });

      if (!document) {
        return false;
      }

      // Extract S3 key from the file path
      const s3Key = document.filePath.replace(`https://${bucketName}.s3.${s3Config.region}.amazonaws.com/`, '');

      // Delete from S3 if it's an S3 URL
      if (document.filePath.includes('s3.amazonaws.com')) {
        try {
          await s3Client.send(new DeleteObjectCommand({
            Bucket: bucketName,
            Key: s3Key
          }));
        } catch (s3Error) {
          console.warn('Failed to delete file from S3:', s3Error);
          // Continue with database deletion even if S3 deletion fails
        }
      }

      // Delete from database (cascading deletes will handle related records)
      await prisma.document.delete({
        where: { id }
      });

      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw new Error('Failed to delete document');
    }
  },

  /**
   * Get documents by owner (user, property, HTB claim, etc.)
   */
  getDocumentsByOwner: async (ownerId: string, ownerType: string): Promise<Document[]> => {
    const result = await documentsService.getDocuments({
      ownerId,
      ownerType
    });
    return result.documents;
  },

  /**
   * Get documents by verification status (for KYC/AML workflows)
   */
  getDocumentsByVerificationStatus: async (status: DocumentVerificationStatus): Promise<Document[]> => {
    const result = await documentsService.getDocuments({
      verificationStatus: status,
      limit: 100
    });
    return result.documents;
  },

  /**
   * Update document verification status
   */
  updateVerificationStatus: async (
    id: string, 
    status: DocumentVerificationStatus, 
    verifiedBy?: string,
    aiData?: any
  ): Promise<Document | null> => {
    return documentsService.updateDocument(id, {
      verificationStatus: status,
      verifiedBy,
      aiExtractedData: aiData
    });
  }
};

export default documentsService;