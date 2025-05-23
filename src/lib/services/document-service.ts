/**
 * Document Service
 * 
 * This service provides a higher-level API for document management operations
 * using the repository pattern for data access.
 */
import { getRepository, createTransactionContext } from '@/lib/db/repositories';
import { logger } from '@/lib/security/auditLogger';
import { Document } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Document input types
export interface DocumentCreateInput {
  title: string;
  description?: string;
  type: string;
  category: string;
  fileUrl: string;
  fileType: string;
  size?: number;
  status?: string;
  tags?: string[];
  metadata?: Record<string, any>\n  );
  expiryDate?: Date;
  signatureRequired?: boolean;
  developmentId?: string;
  unitId?: string;
  saleId?: string;
  createdBy: string;
}

export interface DocumentUpdateInput {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  tags?: string[];
  metadata?: Record<string, any>\n  );
  expiryDate?: Date;
  signatureRequired?: boolean;
}

export interface DocumentVersionInput {
  documentId: string;
  fileUrl: string;
  size: number;
  notes?: string;
  changes?: string;
  checksum?: string;
  createdBy: string;
}

export interface DocumentSignatureInput {
  documentId: string;
  signerId: string;
  signerName: string;
  signatureImageUrl?: string;
  signaturePosition?: Record<string, any>\n  );
  signatureMethod: string;
  ipAddress?: string;
}

export interface DocumentFilterOptions {
  developmentId?: string;
  unitId?: string;
  saleId?: string;
  createdBy?: string;
  type?: string | string[];
  category?: string | string[];
  status?: string | string[];
  search?: string;
  tags?: string[];
  fromDate?: Date;
  toDate?: Date;
  signatureRequired?: boolean;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

class DocumentService {
  /**
   * Create a new document
   */
  async createDocument(data: DocumentCreateInput): Promise<Document> {
    try {
      const documentRepository = getRepository('document');

      // Prepare document data
      const documentData = {
        id: uuidv4(),
        title: data.title,
        description: data.description || '',
        type: data.type,
        category: data.category,
        status: data.status || 'DRAFT',
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        size: data.size || 0,
        version: 1,
        tags: data.tags || [],
        metadata: data.metadata || {},
        expiryDate: data.expiryDate,
        signatureRequired: data.signatureRequired || false,
        signatureStatus: data.signatureRequired ? 'PENDING' : 'NOT_REQUIRED',
        developmentId: data.developmentId,
        unitId: data.unitId,
        saleId: data.saleId,
        createdBy: {
          connect: { id: data.createdBy }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const document = await documentRepository.create(documentData);

      logger.info('Document created:', {
        documentId: document.id,
        userId: data.createdBy,
        title: data.title,
        type: data.type
      });

      return document;
    } catch (error: any) {
      logger.error('Failed to create document:', { 
        error: error.message, 
        stack: error.stack,
        title: data.title,
        userId: data.createdBy
      });
      throw error;
    }
  }

  /**
   * Retrieve a document by ID with all details
   */
  async getDocumentById(id: string): Promise<Document | null> {
    try {
      const documentRepository = getRepository('document');
      return await documentRepository.findWithDetails(id);
    } catch (error: any) {
      logger.error('Failed to retrieve document:', { 
        error: error.message, 
        documentId: id 
      });
      throw error;
    }
  }

  /**
   * Get a list of documents based on filters
   */
  async getDocuments(filters: DocumentFilterOptions = {}): Promise<{
    documents: Document[];
    total: number;
  }> {
    try {
      const documentRepository = getRepository('document');

      // Build the where clause for Prisma
      const where: any = {};

      if (filters.developmentId) {
        where.developmentId = filters.developmentId;
      }

      if (filters.unitId) {
        where.unitId = filters.unitId;
      }

      if (filters.saleId) {
        where.saleId = filters.saleId;
      }

      if (filters.createdBy) {
        where.createdById = filters.createdBy;
      }

      if (filters.type) {
        if (Array.isArray(filters.type)) {
          where.type = { in: filters.type };
        } else {
          where.type = filters.type;
        }
      }

      if (filters.category) {
        if (Array.isArray(filters.category)) {
          where.category = { in: filters.category };
        } else {
          where.category = filters.category;
        }
      }

      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = { in: filters.status };
        } else {
          where.status = filters.status;
        }
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }];
      }

      if (filters.tags && filters.tags.length> 0) {
        where.tags = {
          hasSome: filters.tags
        };
      }

      if (filters.fromDate) {
        where.createdAt = {
          ...(where.createdAt || {}),
          gte: filters.fromDate
        };
      }

      if (filters.toDate) {
        where.createdAt = {
          ...(where.createdAt || {}),
          lte: filters.toDate
        };
      }

      if (filters.signatureRequired !== undefined) {
        where.signatureRequired = filters.signatureRequired;
      }

      // Set up ordering
      const orderBy: any = {};
      const field = filters.orderBy || 'createdAt';
      const direction = filters.orderDirection || 'desc';
      orderBy[field] = direction;

      // Set pagination defaults
      const limit = filters.limit || 50;
      const offset = filters.offset || 0;

      // Fetch documents
      const documents = await documentRepository.findAll({
        where,
        skip: offset,
        take: limit,
        orderBy
      });

      // Get total count
      const total = await documentRepository.count(where);

      return { documents, total };
    } catch (error: any) {
      logger.error('Failed to retrieve documents:', { 
        error: error.message, 
        filters 
      });
      throw error;
    }
  }

  /**
   * Update a document
   */
  async updateDocument(id: string, data: DocumentUpdateInput): Promise<Document> {
    try {
      const documentRepository = getRepository('document');

      // Check if document exists
      const existingDocument = await documentRepository.findById(id);
      if (!existingDocument) {
        throw new Error(`Document not found: ${id}`);
      }

      // Prepare update data
      const updateData: any = {
        updatedAt: new Date()
      };

      if (data.title !== undefined) updateData.title = data.title;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.category !== undefined) updateData.category = data.category;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.tags !== undefined) updateData.tags = data.tags;
      if (data.expiryDate !== undefined) updateData.expiryDate = data.expiryDate;
      if (data.signatureRequired !== undefined) updateData.signatureRequired = data.signatureRequired;

      if (data.metadata !== undefined) {
        updateData.metadata = {
          ...(existingDocument.metadata || {}),
          ...data.metadata
        };
      }

      // Update document
      const updatedDocument = await documentRepository.update(idupdateData);

      logger.info('Document updated:', {
        documentId: id,
        fields: Object.keys(updateData).filter(k => k !== 'updatedAt')
      });

      return updatedDocument;
    } catch (error: any) {
      logger.error('Failed to update document:', { 
        error: error.message, 
        documentId: id 
      });
      throw error;
    }
  }

  /**
   * Update document status
   */
  async updateDocumentStatus(id: string, status: string): Promise<Document> {
    try {
      const documentRepository = getRepository('document');

      // Check if document exists
      const existingDocument = await documentRepository.findById(id);
      if (!existingDocument) {
        throw new Error(`Document not found: ${id}`);
      }

      // Update status
      const updatedDocument = await documentRepository.updateStatus(idstatus);

      logger.info('Document status updated:', {
        documentId: id,
        oldStatus: existingDocument.status,
        newStatus: status
      });

      return updatedDocument;
    } catch (error: any) {
      logger.error('Failed to update document status:', { 
        error: error.message, 
        documentId: id,
        status
      });
      throw error;
    }
  }

  /**
   * Create a new document version
   */
  async createDocumentVersion(data: DocumentVersionInput): Promise<any> {
    try {
      const documentRepository = getRepository('document');

      // Check if document exists
      const existingDocument = await documentRepository.findWithDetails(data.documentId);
      if (!existingDocument) {
        throw new Error(`Document not found: ${data.documentId}`);
      }

      // Calculate new version number
      const newVersionNumber = (existingDocument.version || 1) + 1;

      // Create new version using transaction
      const tx = await createTransactionContext();

      try {
        // Create version record and update document
        const newVersion = await documentRepository.addVersion(
          data.documentId,
          newVersionNumber,
          data.fileUrl,
          data.createdBy,
          data.size,
          data.notes
        );

        logger.info('Document version created:', {
          documentId: data.documentId,
          userId: data.createdBy,
          versionNumber: newVersionNumber
        });

        return newVersion;
      } catch (error) {
        // Transaction will automatically roll back
        throw error;
      }
    } catch (error: any) {
      logger.error('Failed to create document version:', { 
        error: error.message, 
        documentId: data.documentId,
        userId: data.createdBy
      });
      throw error;
    }
  }

  /**
   * Sign a document
   */
  async signDocument(data: DocumentSignatureInput): Promise<any> {
    try {
      // Use transaction to ensure consistency
      const tx = await createTransactionContext();

      // Find the document
      const document = await tx.documents.findById(data.documentId);

      if (!document) {
        throw new Error(`Document not found: ${data.documentId}`);
      }

      // Verify document requires signature
      if (!document.signatureRequired) {
        throw new Error('This document does not require a signature');
      }

      // Create signature record
      const signature = await tx.prisma.documentSignature.create({
        data: {
          id: uuidv4(),
          document: {
            connect: { id: data.documentId }
          },
          signerId: data.signerId,
          signerName: data.signerName,
          signatureDate: new Date(),
          signatureImageUrl: data.signatureImageUrl,
          signaturePosition: data.signaturePosition,
          signatureMethod: data.signatureMethod,
          ipAddress: data.ipAddress || null,
          verified: true,
          verificationMethod: 'authenticated-session',
          createdAt: new Date(),
          updatedAt: new Date()}
      });

      // Check if all required signatures are complete
      // This would be more complex in a real implementation
      const allSignatures = await tx.prisma.documentSignature.findMany({
        where: { documentId: data.documentId }
      });

      // Update document signature status if needed
      if (allSignatures.length> 0) {
        await tx.documents.update(data.documentId, {
          signatureStatus: 'COMPLETED',
          status: 'APPROVED',
          updatedAt: new Date()
        });
      }

      logger.info('Document signed:', {
        documentId: data.documentId,
        signerId: data.signerId,
        method: data.signatureMethod
      });

      return signature;
    } catch (error: any) {
      logger.error('Failed to sign document:', { 
        error: error.message, 
        documentId: data.documentId,
        signerId: data.signerId
      });
      throw error;
    }
  }

  /**
   * Archive a document (soft delete)
   */
  async archiveDocument(id: string): Promise<Document> {
    try {
      return await this.updateDocumentStatus(id, 'ARCHIVED');
    } catch (error: any) {
      logger.error('Failed to archive document:', { 
        error: error.message, 
        documentId: id 
      });
      throw error;
    }
  }

  /**
   * Get documents by entity type and ID
   */
  async getDocumentsByEntity(entityType: string, entityId: string): Promise<Document[]> {
    try {
      let documents: Document[] = [];
      const documentRepository = getRepository('document');

      switch (entityType) {
        case 'development':
          documents = await documentRepository.findByDevelopmentId(entityId);
          break;
        case 'unit':
          documents = await documentRepository.findByUnitId(entityId);
          break;
        case 'sale':
          documents = await documentRepository.findBySaleId(entityId);
          break;
        case 'user':
          documents = await documentRepository.findKycDocumentsByUserId(entityId);
          break;
        default:
          throw new Error(`Unsupported entity type: ${entityType}`);
      }

      return documents;
    } catch (error: any) {
      logger.error('Failed to get documents by entity:', { 
        error: error.message, 
        entityType,
        entityId
      });
      throw error;
    }
  }
}

// Export a singleton instance
export const documentService = new DocumentService();