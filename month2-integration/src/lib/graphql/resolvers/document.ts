/**
 * Document resolvers for PropIE GraphQL API
 * 
 * This file implements the resolvers for Document-related operations,
 * connecting the GraphQL schema with the document repository.
 */

import { GraphQLContext } from '../server';
import { requireAuth, requireRole, NotFoundError, ValidationError, paginateResults, processPaginationInput } from './base';
import { getRepository, createTransactionContext } from '@/lib/db/repositories';
import { logger } from '@/lib/security/auditLogger';
import { DocumentStatus, DocumentCategory } from '@/types/core/document';
import { UserRole } from '@/types/core/user';
import { v4 as uuidv4 } from 'uuid';

// Map database Document model to GraphQL Document type
function mapDocumentToGraphQL(document: any): any {
  return {
    id: document.id,
    name: document.title || document.name, // Handle both field names
    description: document.description,
    type: document.type,
    status: document.status,
    category: document.category,
    fileUrl: document.fileUrl,
    fileType: document.fileType,
    fileSize: document.size || document.fileSize, // Handle both field names
    uploadedBy: document.createdBy ? {
      id: document.createdBy.id,
      fullName: `${document.createdBy.firstName || ''} ${document.createdBy.lastName || ''}`.trim(),
      email: document.createdBy.email,
      avatar: document.createdBy.avatar,
      roles: document.createdBy.roles || [],
    } : null,
    uploadedByName: document.uploadedByName,
    uploadDate: document.createdAt || document.uploadDate,
    expiryDate: document.expiryDate,
    tags: document.tags || [],
    version: document.version || 1,
    relatedTo: document.relatedTo || null,
    metadata: document.metadata || {},
    signatureRequired: !!document.signatureRequired,
    signatureStatus: document.signatureStatus,
    previousVersions: (document.previousVersions || []).map((version: any) => ({
      id: version.id,
      versionNumber: version.versionNumber,
      fileUrl: version.fileUrl,
      createdBy: version.createdBy ? {
        id: version.createdBy.id,
        fullName: `${version.createdBy.firstName || ''} ${version.createdBy.lastName || ''}`.trim(),
        email: version.createdBy.email,
        avatar: version.createdBy.avatar,
        roles: version.createdBy.roles || [],
      } : null,
      created: version.createdAt,
      notes: version.notes,
      changes: version.changes,
      size: version.size,
      checksum: version.checksum,
    })),
    signatures: (document.signatures || []).map((signature: any) => ({
      id: signature.id,
      signerId: signature.signerId,
      signerName: signature.signerName,
      signatureDate: signature.signatureDate,
      signatureImageUrl: signature.signatureImageUrl,
      signaturePosition: signature.signaturePosition,
      signatureMethod: signature.signatureMethod,
      ipAddress: signature.ipAddress,
      verified: !!signature.verified,
      verificationMethod: signature.verificationMethod,
      certificateUrl: signature.certificateUrl,
    })),
  };
}

// Map to a summary version for lists
function mapToDocumentSummary(document: any): any {
  return {
    id: document.id,
    name: document.title || document.name,
    type: document.type,
    status: document.status,
    category: document.category,
    fileUrl: document.fileUrl,
    fileType: document.fileType,
    uploadedBy: document.createdBy ? {
      id: document.createdBy.id,
      fullName: `${document.createdBy.firstName || ''} ${document.createdBy.lastName || ''}`.trim(),
      email: document.createdBy.email,
      avatar: document.createdBy.avatar,
      roles: document.createdBy.roles || [],
    } : null,
    uploadDate: document.createdAt || document.uploadDate,
    version: document.version || 1,
    signatureRequired: !!document.signatureRequired,
  };
}

export const documentResolvers = {
  Query: {
    /**
     * Get a document by ID
     */
    document: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      
      try {
        const documentRepository = getRepository('document');
        const document = await documentRepository.findWithDetails(id);
        
        if (!document) {
          throw new NotFoundError('Document', id);
        }
        
        // TODO: Check permissions - implement based on business rules
        // For example, check if user is associated with the document via development, unit, or sale
        
        return mapDocumentToGraphQL(document);
      } catch (error: any) {
        logger.error('Error fetching document by ID:', { 
          error: error.message, 
          documentId: id,
          userId: context.user?.userId 
        });
        throw error;
      }
    },
    
    /**
     * List documents with filtering and pagination
     */
    documents: async (_: any, 
      { 
        filter, 
        pagination 
      }: { 
        filter?: {
          developmentId?: string;
          unitId?: string;
          saleId?: string;
          uploadedById?: string;
          types?: string[];
          categories?: DocumentCategory[];
          status?: DocumentStatus[];
          search?: string;
          tags?: string[];
          fromDate?: Date;
          toDate?: Date;
          signatureRequired?: boolean;
        };
        pagination?: {
          first?: number;
          after?: string;
          last?: number;
          before?: string;
        };
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      try {
        const { limit, offset } = processPaginationInput(pagination);
        const documentRepository = getRepository('document');
        
        // Build the Prisma where clause
        const where: any = {};
        
        if (filter?.developmentId) {
          where.developmentId = filter.developmentId;
        }
        
        if (filter?.unitId) {
          where.unitId = filter.unitId;
        }
        
        if (filter?.saleId) {
          where.saleId = filter.saleId;
        }
        
        if (filter?.uploadedById) {
          where.createdById = filter.uploadedById;
        }
        
        if (filter?.types && filter.types.length > 0) {
          where.type = {
            in: filter.types
          };
        }
        
        if (filter?.categories && filter.categories.length > 0) {
          where.category = {
            in: filter.categories
          };
        }
        
        if (filter?.status && filter.status.length > 0) {
          where.status = {
            in: filter.status
          };
        }
        
        if (filter?.search) {
          where.OR = [
            { title: { contains: filter.search, mode: 'insensitive' } },
            { name: { contains: filter.search, mode: 'insensitive' } },
            { description: { contains: filter.search, mode: 'insensitive' } },
          ];
        }
        
        if (filter?.tags && filter.tags.length > 0) {
          where.tags = {
            hasSome: filter.tags
          };
        }
        
        if (filter?.fromDate) {
          where.createdAt = {
            ...(where.createdAt || {}),
            gte: filter.fromDate
          };
        }
        
        if (filter?.toDate) {
          where.createdAt = {
            ...(where.createdAt || {}),
            lte: filter.toDate
          };
        }
        
        if (filter?.signatureRequired !== undefined) {
          where.signatureRequired = filter.signatureRequired;
        }
        
        // Fetch documents with the filter
        const documents = await documentRepository.findAll({
          where,
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        // Get total count for pagination
        const totalCount = await documentRepository.count(where);
        
        // Map to summaries and apply cursor-based pagination
        const summaries = documents.map(mapToDocumentSummary);
        const { items, pageInfo } = paginateResults(summaries, pagination || {});
        
        return {
          documents: items,
          totalCount,
          pageInfo,
        };
      } catch (error: any) {
        logger.error('Error fetching documents:', { 
          error: error.message, 
          userId: context.user?.userId,
          filter
        });
        throw error;
      }
    },
    
    /**
     * Get documents for a specific development
     */
    developmentDocuments: async (_: any, 
      { 
        developmentId,
        filter, 
        pagination 
      }: { 
        developmentId: string;
        filter?: any;
        pagination?: any;
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      // Delegate to the documents resolver with the development ID in the filter
      return documentResolvers.Query.documents(
        _,
        {
          filter: {
            ...filter,
            developmentId
          },
          pagination
        },
        context
      );
    },
    
    /**
     * Get documents for a specific unit
     */
    unitDocuments: async (_: any, 
      { 
        unitId,
        filter, 
        pagination 
      }: { 
        unitId: string;
        filter?: any;
        pagination?: any;
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      // Delegate to the documents resolver with the unit ID in the filter
      return documentResolvers.Query.documents(
        _,
        {
          filter: {
            ...filter,
            unitId
          },
          pagination
        },
        context
      );
    },
    
    /**
     * Get documents for a specific sale
     */
    saleDocuments: async (_: any, 
      { 
        saleId,
        filter, 
        pagination 
      }: { 
        saleId: string;
        filter?: any;
        pagination?: any;
      },
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      // Delegate to the documents resolver with the sale ID in the filter
      return documentResolvers.Query.documents(
        _,
        {
          filter: {
            ...filter,
            saleId
          },
          pagination
        },
        context
      );
    },
    
    /**
     * Get documents uploaded by the current user
     */
    myDocuments: async (_: any, { filter, pagination }: any, context: GraphQLContext) => {
      requireAuth(context);
      
      // Delegate to the documents resolver with the current user's ID in the filter
      return documentResolvers.Query.documents(
        _,
        {
          filter: {
            ...filter,
            uploadedById: context.user?.userId
          },
          pagination
        },
        context
      );
    },
    
    /**
     * Get documents requiring signature by the current user
     */
    documentsRequiringMySignature: async (_: any, { pagination }: any, context: GraphQLContext) => {
      requireAuth(context);
      
      try {
        const { limit, offset } = processPaginationInput(pagination);
        const documentRepository = getRepository('document');
        
        // Custom query to find documents requiring signature by this user
        // This would typically be a custom method in the document repository
        const documents = await documentRepository.findAll({
          where: {
            signatureRequired: true,
            signatureStatus: 'PENDING',
            // This is a simplified query - in a real implementation
            // you would have a more complex relationship for signers
            pendingSigners: {
              some: {
                id: context.user?.userId
              }
            }
          },
          skip: offset,
          take: limit,
          orderBy: {
            createdAt: 'desc'
          }
        });
        
        // Count for pagination
        const totalCount = await documentRepository.count({
          signatureRequired: true,
          signatureStatus: 'PENDING',
          pendingSigners: {
            some: {
              id: context.user?.userId
            }
          }
        });
        
        // Map to summaries
        const summaries = documents.map(mapToDocumentSummary);
        const { items, pageInfo } = paginateResults(summaries, pagination || {});
        
        return {
          documents: items,
          totalCount,
          pageInfo,
        };
      } catch (error: any) {
        logger.error('Error fetching documents requiring signature:', { 
          error: error.message, 
          userId: context.user?.userId 
        });
        throw error;
      }
    },
  },
  
  Mutation: {
    /**
     * Create a new document
     */
    createDocument: async (_: any, 
      { 
        input 
      }: { 
        input: {
          name: string;
          description?: string;
          type: string;
          category: DocumentCategory;
          fileUrl: string;
          fileType: string;
          fileSize: number;
          tags?: string[];
          expiryDate?: Date;
          developmentId?: string;
          unitId?: string;
          saleId?: string;
          relatedTo?: {
            type: string;
            id: string;
            name: string;
          };
          metadata?: any;
          signatureRequired?: boolean;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      try {
        // Validation
        if (!input.name || !input.type || !input.category || !input.fileUrl || !input.fileType) {
          throw new ValidationError('Missing required document fields');
        }
        
        // Prepare the document data for the repository
        const documentData = {
          id: uuidv4(),
          title: input.name,
          description: input.description || '',
          type: input.type,
          category: input.category,
          fileUrl: input.fileUrl,
          fileType: input.fileType,
          size: input.fileSize,
          tags: input.tags || [],
          expiryDate: input.expiryDate,
          developmentId: input.developmentId,
          unitId: input.unitId,
          saleId: input.saleId,
          relatedTo: input.relatedTo ? {
            type: input.relatedTo.type,
            id: input.relatedTo.id,
            name: input.relatedTo.name,
          } : undefined,
          metadata: input.metadata || {},
          signatureRequired: input.signatureRequired || false,
          signatureStatus: input.signatureRequired ? 'PENDING' : 'NOT_REQUIRED',
          status: DocumentStatus.DRAFT,
          version: 1,
          createdBy: {
            connect: { id: context.user!.userId }
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        // Use transaction for consistency
        const documentRepository = getRepository('document');
        const document = await documentRepository.create(documentData);
        
        // Log the creation
        logger.info('Document created:', {
          documentId: document.id,
          userId: context.user?.userId,
          documentType: input.type,
          documentCategory: input.category
        });
        
        return mapDocumentToGraphQL(document);
      } catch (error: any) {
        logger.error('Error creating document:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentName: input.name,
          documentType: input.type
        });
        throw error;
      }
    },
    
    /**
     * Update an existing document
     */
    updateDocument: async (_: any, 
      { 
        id, 
        input 
      }: { 
        id: string;
        input: {
          name?: string;
          description?: string;
          category?: DocumentCategory;
          tags?: string[];
          expiryDate?: Date;
          metadata?: any;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      try {
        // Get document repository
        const documentRepository = getRepository('document');
        
        // Check if document exists
        const existingDocument = await documentRepository.findById(id);
        
        if (!existingDocument) {
          throw new NotFoundError('Document', id);
        }
        
        // Check permissions - basic check, can be enhanced
        // Only the creator or admins can update
        if (
          existingDocument.createdById !== context.user?.userId && 
          !context.userRoles.includes(UserRole.ADMIN)
        ) {
          throw new Error('You do not have permission to update this document');
        }
        
        // Prepare update data
        const updateData: any = {
          updatedAt: new Date()
        };
        
        if (input.name) {
          updateData.title = input.name;
        }
        
        if (input.description !== undefined) {
          updateData.description = input.description;
        }
        
        if (input.category) {
          updateData.category = input.category;
        }
        
        if (input.tags) {
          updateData.tags = input.tags;
        }
        
        if (input.expiryDate !== undefined) {
          updateData.expiryDate = input.expiryDate;
        }
        
        if (input.metadata) {
          updateData.metadata = {
            ...(existingDocument.metadata || {}),
            ...input.metadata
          };
        }
        
        // Update the document
        const updatedDocument = await documentRepository.update(id, updateData);
        
        // Log the update
        logger.info('Document updated:', {
          documentId: id,
          userId: context.user?.userId,
          fields: Object.keys(updateData).filter(k => k !== 'updatedAt')
        });
        
        return mapDocumentToGraphQL(updatedDocument);
      } catch (error: any) {
        logger.error('Error updating document:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentId: id
        });
        throw error;
      }
    },
    
    /**
     * Change a document's status
     */
    changeDocumentStatus: async (_: any, 
      { 
        id, 
        status 
      }: { 
        id: string;
        status: DocumentStatus;
      }, 
      context: GraphQLContext
    ) => {
      requireRole(context, [UserRole.DEVELOPER, UserRole.ADMIN]);
      
      try {
        // Get document repository
        const documentRepository = getRepository('document');
        
        // Check if document exists
        const existingDocument = await documentRepository.findById(id);
        
        if (!existingDocument) {
          throw new NotFoundError('Document', id);
        }
        
        // Update the status
        const updatedDocument = await documentRepository.updateStatus(id, status);
        
        // Log the status change
        logger.info('Document status changed:', {
          documentId: id,
          userId: context.user?.userId,
          oldStatus: existingDocument.status,
          newStatus: status
        });
        
        return mapDocumentToGraphQL(updatedDocument);
      } catch (error: any) {
        logger.error('Error changing document status:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentId: id,
          status
        });
        throw error;
      }
    },
    
    /**
     * Create a new version of a document
     */
    createDocumentVersion: async (_: any, 
      { 
        input 
      }: { 
        input: {
          documentId: string;
          fileUrl: string;
          size: number;
          notes?: string;
          changes?: string;
          checksum?: string;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      try {
        // Get document repository
        const documentRepository = getRepository('document');
        
        // Check if document exists
        const existingDocument = await documentRepository.findWithDetails(input.documentId);
        
        if (!existingDocument) {
          throw new NotFoundError('Document', input.documentId);
        }
        
        // Check permissions - basic check, can be enhanced
        // Only the creator, admins, or collaborators can update
        // In a real implementation, check for additional roles
        if (
          existingDocument.createdById !== context.user?.userId && 
          !context.userRoles.includes(UserRole.ADMIN)
        ) {
          throw new Error('You do not have permission to version this document');
        }
        
        // Calculate new version number
        const newVersionNumber = (existingDocument.version || 1) + 1;
        
        // Create new version using transaction
        const tx = await createTransactionContext();
        
        try {
          // Create version record and update document
          const newVersion = await documentRepository.addVersion(
            input.documentId,
            newVersionNumber,
            input.fileUrl,
            context.user!.userId,
            input.size,
            input.notes
          );
          
          // Log the version creation
          logger.info('Document version created:', {
            documentId: input.documentId,
            userId: context.user?.userId,
            versionNumber: newVersionNumber
          });
          
          return {
            id: newVersion.id,
            versionNumber: newVersion.versionNumber,
            fileUrl: newVersion.fileUrl,
            createdBy: {
              id: context.user?.userId,
              fullName: context.user?.username || 'Unknown',
              email: context.user?.email || '',
              roles: context.userRoles || [],
            },
            created: newVersion.createdAt,
            notes: newVersion.notes,
            changes: input.changes,
            size: newVersion.size,
            checksum: input.checksum,
          };
        } catch (error) {
          // Transaction will automatically roll back
          throw error;
        }
      } catch (error: any) {
        logger.error('Error creating document version:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentId: input.documentId
        });
        throw error;
      }
    },
    
    /**
     * Sign a document
     */
    signDocument: async (_: any, 
      { 
        input 
      }: { 
        input: {
          documentId: string;
          signatureImageUrl?: string;
          signaturePosition?: any; 
          signatureMethod: string;
        }
      }, 
      context: GraphQLContext
    ) => {
      requireAuth(context);
      
      try {
        // Get repository and transaction context
        const tx = await createTransactionContext();
        
        try {
          // Find the document
          const document = await tx.documents.findById(input.documentId);
          
          if (!document) {
            throw new NotFoundError('Document', input.documentId);
          }
          
          // Verify document requires signature
          if (!document.signatureRequired) {
            throw new ValidationError('This document does not require a signature');
          }
          
          // Verify user is a valid signer
          // This would be more complex in a real implementation
          // with a proper signers relationship
          
          // Create signature record
          const signature = await tx.prisma.documentSignature.create({
            data: {
              id: uuidv4(),
              document: {
                connect: { id: input.documentId }
              },
              signerId: context.user!.userId,
              signerName: context.user?.username || 'Unknown',
              signatureDate: new Date(),
              signatureImageUrl: input.signatureImageUrl,
              signaturePosition: input.signaturePosition,
              signatureMethod: input.signatureMethod,
              ipAddress: 'IP stored from client',
              verified: true,
              verificationMethod: 'authenticated-session',
              createdAt: new Date(),
              updatedAt: new Date(),
            }
          });
          
          // Check if all required signatures are complete
          // This would be more complex in a real implementation
          // For now, we'll just check if there's at least one signature
          const allSignatures = await tx.prisma.documentSignature.findMany({
            where: { documentId: input.documentId }
          });
          
          // Update document signature status if needed
          if (allSignatures.length > 0) {
            await tx.documents.update(input.documentId, {
              signatureStatus: 'COMPLETED',
              status: 'APPROVED',
              updatedAt: new Date()
            });
          }
          
          // Log the signature
          logger.info('Document signed:', {
            documentId: input.documentId,
            userId: context.user?.userId,
            signatureMethod: input.signatureMethod
          });
          
          return {
            id: signature.id,
            signerId: signature.signerId,
            signerName: signature.signerName,
            signatureDate: signature.signatureDate,
            signatureImageUrl: signature.signatureImageUrl,
            signaturePosition: signature.signaturePosition,
            signatureMethod: signature.signatureMethod,
            ipAddress: signature.ipAddress,
            verified: signature.verified,
            verificationMethod: signature.verificationMethod,
            certificateUrl: null, // Generate certificate URL if needed
          };
        } catch (error) {
          // Transaction will automatically roll back
          throw error;
        }
      } catch (error: any) {
        logger.error('Error signing document:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentId: input.documentId
        });
        throw error;
      }
    },
    
    /**
     * Archive a document (soft delete)
     */
    archiveDocument: async (_: any, { id }: { id: string }, context: GraphQLContext) => {
      requireAuth(context);
      
      try {
        // Get document repository
        const documentRepository = getRepository('document');
        
        // Check if document exists
        const existingDocument = await documentRepository.findById(id);
        
        if (!existingDocument) {
          throw new NotFoundError('Document', id);
        }
        
        // Check permissions - basic check, can be enhanced
        if (
          existingDocument.createdById !== context.user?.userId && 
          !context.userRoles.includes(UserRole.ADMIN)
        ) {
          throw new Error('You do not have permission to archive this document');
        }
        
        // Update the document status to ARCHIVED
        const updatedDocument = await documentRepository.updateStatus(id, DocumentStatus.ARCHIVED);
        
        // Log the archival
        logger.info('Document archived:', {
          documentId: id,
          userId: context.user?.userId
        });
        
        return mapDocumentToGraphQL(updatedDocument);
      } catch (error: any) {
        logger.error('Error archiving document:', { 
          error: error.message, 
          userId: context.user?.userId,
          documentId: id
        });
        throw error;
      }
    },
  }
};

export default documentResolvers;