/**
 * Document Service
 * Business logic and data access for document management
 */

import { documentDb } from '@/lib/db';
import { mapPrismaDocumentToDocument } from '@/lib/db/mappers';
import { Document, DocumentStatus, DocumentType, DocumentCategory } from '@/types/core/document';

export class DocumentService {
  /**
   * Get a document by ID
   * @param id Document ID
   * @returns The document or null if not found
   */
  async getDocumentById(id: string): Promise<Document | null> {
    const prismaDocument = await documentDb.getById(id);
    if (!prismaDocument) return null;
    return mapPrismaDocumentToDocument(prismaDocument);
  }
  
  /**
   * List documents with filtering
   * @param options Filter options
   * @returns List of documents with pagination info
   */
  async listDocuments(options?: {
    developmentId?: string;
    unitId?: string;
    saleId?: string;
    uploadedById?: string;
    type?: DocumentType;
    category?: DocumentCategory;
    status?: DocumentStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    documents: Document[];
    totalCount: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page = 1, limit = 50, ...filterOptions } = options || {};
    const offset = (page - 1) * limit;
    
    // Convert enum values to strings for the database
    const dbOptions = {
      ...filterOptions,
      type: filterOptions.type?.toString(),
      category: filterOptions.category?.toString(),
      status: filterOptions.status?.toString(),
      limit,
      offset
    };
    
    const result = await documentDb.list(dbOptions);
    
    return {
      documents: result.documents.map(mapPrismaDocumentToDocument),
      totalCount: result.totalCount,
      page,
      totalPages: Math.ceil(result.totalCount / limit),
      limit
    };
  }
  
  /**
   * Upload a new document
   * @param data Document upload data
   * @returns The created document
   */
  async uploadDocument(data: {
    name: string;
    description?: string;
    type: DocumentType;
    category: DocumentCategory;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedById: string;
    uploadedByName?: string;
    tags?: string[];
    expiryDate?: Date;
    developmentId?: string;
    unitId?: string;
    saleId?: string;
    relatedTo?: any;
  }): Promise<Document> {
    // Convert enum values to strings for the database
    const dbData = {
      ...data,
      type: data.type.toString(),
      category: data.category.toString()
    };
    
    const prismaDocument = await documentDb.create(dbData);
    return mapPrismaDocumentToDocument(prismaDocument);
  }
  
  /**
   * Update document status
   * @param id Document ID
   * @param status New status
   * @param userId User making the change
   * @returns The updated document
   */
  async updateDocumentStatus(
    id: string,
    status: DocumentStatus,
    userId: string
  ): Promise<Document> {
    const document = await this.getDocumentById(id);
    if (!document) {
      throw new Error(`Document with ID ${id} not found`);
    }
    
    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes
    document.status = status;
    
    return document;
  }
  
  /**
   * Create a new document version
   * @param documentId Original document ID
   * @param data New version data
   * @returns The updated document
   */
  async createDocumentVersion(
    documentId: string,
    data: {
      fileUrl: string;
      fileSize: number;
      createdById: string;
      notes?: string;
      changes?: string;
    }
  ): Promise<Document> {
    const document = await this.getDocumentById(documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found`);
    }
    
    // In a real implementation, this would update the database
    // This is a placeholder for demonstration purposes
    document.version += 1;
    
    return document;
  }
  
  /**
   * Generate a pre-signed upload URL
   * This would typically integrate with cloud storage like S3
   * @param fileName File name
   * @param fileType File MIME type
   * @returns Upload URL and final file URL
   */
  async generateUploadUrl(
    fileName: string,
    fileType: string
  ): Promise<{
    uploadUrl: string;
    fileUrl: string;
    expiresIn: number;
  }> {
    // In a real implementation, this would generate a pre-signed URL
    // This is a placeholder for demonstration purposes
    
    // Generate a unique file path
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const filePath = `uploads/${timestamp}-${uniqueId}-${fileName}`;
    
    return {
      uploadUrl: `https://example.com/upload?file=${filePath}`,
      fileUrl: `https://example.com/files/${filePath}`,
      expiresIn: 3600 // 1 hour
    };
  }
  
  /**
   * Get document templates
   * @param type Optional document type to filter
   * @param category Optional document category to filter
   * @returns List of document templates
   */
  async getDocumentTemplates(
    type?: DocumentType,
    category?: DocumentCategory
  ): Promise<{
    id: string;
    name: string;
    description?: string;
    type: DocumentType;
    category: DocumentCategory;
    thumbnailUrl?: string;
  }[]> {
    // In a real implementation, this would query the database
    // This is a placeholder for demonstration purposes
    return [
      {
        id: '1',
        name: 'Sales Contract',
        description: 'Standard sales contract template',
        type: DocumentType.CONTRACT,
        category: DocumentCategory.SALE
      },
      {
        id: '2',
        name: 'Reservation Form',
        description: 'Property reservation form',
        type: DocumentType.AGREEMENT,
        category: DocumentCategory.SALE
      },
      {
        id: '3',
        name: 'Welcome Pack',
        description: 'New buyer welcome information',
        type: DocumentType.MARKETING,
        category: DocumentCategory.PROPERTY
      }
    ];
  }
}

export default new DocumentService();