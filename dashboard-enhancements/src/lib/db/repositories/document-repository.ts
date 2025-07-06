import { PrismaClient } from '@prisma/client';
import type { Document } from '@prisma/client';
import { Prisma } from '.prisma/client';
import { BaseRepository } from './base-repository';
import { prisma } from '../index';

type DocumentCreateInput = Prisma.DocumentCreateInput;
type DocumentUpdateInput = Prisma.DocumentUpdateInput;

/**
 * Repository for managing Document entities
 */
export class DocumentRepository extends BaseRepository<Document, DocumentCreateInput, DocumentUpdateInput> {
  protected model: any;

  constructor(prismaClient: PrismaClient = prisma) {
    super(prismaClient);
    this.model = this.prisma.document;
  }

  /**
   * Find documents by user (KYC documents)
   */
  async findKycDocumentsByUserId(userId: string): Promise<Document[]> {
    return this.model.findMany({
      where: {
        kycUsers: {
          some: {
            id: userId
          }
        }
      },
    });
  }

  /**
   * Find documents by development ID
   */
  async findByDevelopmentId(developmentId: string): Promise<Document[]> {
    return this.model.findMany({
      where: { developmentId },
    });
  }

  /**
   * Find documents by unit ID
   */
  async findByUnitId(unitId: string): Promise<Document[]> {
    return this.model.findMany({
      where: { unitId },
    });
  }

  /**
   * Find documents by sale ID
   */
  async findBySaleId(saleId: string): Promise<Document[]> {
    return this.model.findMany({
      where: { saleId },
    });
  }

  /**
   * Find documents by entity type and ID
   */
  async findByEntity(entityType: string, entityId: string, filters?: any): Promise<Document[]> {
    const where: any = {
      entityType,
      entityId,
    };

    // Apply any additional filters
    if (filters) {
      Object.assign(where, filters);
    }

    return this.model.findMany({
      where,
      include: {
        uploadedBy: true,
        previousVersions: true,
      },
    });
  }

  /**
   * Find document with versions and workflow
   */
  async findWithDetails(id: string): Promise<Document | null> {
    return this.model.findUnique({
      where: { id },
      include: {
        previousVersions: true,
        workflow: {
          include: {
            history: {
              include: {
                approvals: true,
              }
            }
          }
        },
        signatures: true,
      },
    });
  }

  /**
   * Find documents by type
   */
  async findByType(type: string): Promise<Document[]> {
    return this.model.findMany({
      where: { type },
    });
  }

  /**
   * Find documents by category
   */
  async findByCategory(category: string): Promise<Document[]> {
    return this.model.findMany({
      where: { category },
    });
  }

  /**
   * Find documents by status
   */
  async findByStatus(status: string): Promise<Document[]> {
    return this.model.findMany({
      where: { status },
    });
  }

  /**
   * Update document status
   */
  async updateStatus(id: string, status: string): Promise<Document> {
    return this.model.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  /**
   * Add a document version
   */
  async addVersion(
    documentId: string, 
    versionNumber: number, 
    fileUrl: string, 
    createdById: string, 
    size: number, 
    notes?: string
  ): Promise<any> {
    // Update the document with new version number
    await this.model.update({
      where: { id: documentId },
      data: {
        version: versionNumber,
        fileUrl: fileUrl,
      },
    });

    // Create a version record
    return this.prisma.documentVersion.create({
      data: {
        document: {
          connect: { id: documentId },
        },
        versionNumber: versionNumber - 1, // Store the previous version number
        fileUrl: fileUrl,
        createdBy: {
          connect: { id: createdById },
        },
        size,
        notes,
      },
    });
  }
}