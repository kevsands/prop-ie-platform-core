import { prisma } from '../connection';
import { Document, DocumentStatus, DocumentType, DocumentCategory } from '@/types/document';
import { Prisma } from '@prisma/client';
import { mapDocumentToPrismaDocument, mapPrismaDocumentToDocument } from '../mappers/document-mappers';

export const documentDb = {
  async create(document: Omit<Document, 'id'>): Promise<Document> {
    const prismaDoc = await prisma.document.create({
      data: mapDocumentToPrismaDocument(document),
      include: {
        previousVersions: true,
        signatures: true
      }
    });
    return mapPrismaDocumentToDocument(prismaDoc);
  },

  async findById(id: string): Promise<Document | null> {
    const prismaDoc = await prisma.document.findUnique({
      where: { id },
      include: {
        previousVersions: true,
        signatures: true
      }
    });
    return prismaDoc ? mapPrismaDocumentToDocument(prismaDoc) : null;
  },

  async update(id: string, data: Partial<Document>): Promise<Document> {
    const updateData: Prisma.DocumentUpdateInput = {
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      category: data.category,
      fileUrl: data.fileUrl,
      fileType: data.fileType,
      fileSize: data.fileSize,
      uploadedBy: data.uploadedBy ? { connect: { id: data.uploadedBy } } : undefined,
      uploadedByName: data.uploadedByName,
      expiryDate: data.expiryDate,
      tags: data.tags,
      version: data.version,
      metadata: data.metadata as Prisma.JsonObject,
      signatureRequired: data.signatureRequired,
      signatureStatus: data.signatureStatus,
      organizationId: data.organizationId
    };

    if (data.previousVersions) {
      updateData.previousVersions = {
        create: data.previousVersions.map(id => ({
          id,
          versionNumber: 1,
          fileUrl: data.fileUrl || '',
          createdBy: { connect: { id: data.uploadedBy || '' } },
          size: data.fileSize || 0
        }))
      };
    }

    if (data.signedBy) {
      updateData.signatures = {
        create: data.signedBy.map(id => ({
          signerId: id,
          signatureMethod: 'click_to_sign',
          signatureDate: new Date()
        }))
      };
    }

    const prismaDoc = await prisma.document.update({
      where: { id },
      data: updateData,
      include: {
        previousVersions: true,
        signatures: true
      }
    });
    return mapPrismaDocumentToDocument(prismaDoc);
  },

  async delete(id: string): Promise<void> {
    await prisma.document.delete({
      where: { id }
    });
  },

  async findMany(filter: {
    types?: DocumentType[];
    statuses?: DocumentStatus[];
    categories?: DocumentCategory[];
    uploadedBy?: string;
    search?: string;
  }): Promise<Document[]> {
    const where: Prisma.DocumentWhereInput = {};

    if (filter.types?.length) {
      where.type = { in: filter.types };
    }
    if (filter.statuses?.length) {
      where.status = { in: filter.statuses };
    }
    if (filter.categories?.length) {
      where.category = { in: filter.categories };
    }
    if (filter.uploadedBy) {
      where.uploadedById = filter.uploadedBy;
    }
    if (filter.search) {
      where.OR = [
        { name: { contains: filter.search, mode: 'insensitive' } },
        { description: { contains: filter.search, mode: 'insensitive' } }
      ];
    }

    const prismaDocs = await prisma.document.findMany({
      where,
      include: {
        previousVersions: true,
        signatures: true
      }
    });
    return prismaDocs.map(mapPrismaDocumentToDocument);
  },

  async updateStatus(id: string, status: DocumentStatus): Promise<Document> {
    const prismaDoc = await prisma.document.update({
      where: { id },
      data: { status },
      include: {
        previousVersions: true,
        signatures: true
      }
    });
    return mapPrismaDocumentToDocument(prismaDoc);
  }
}; 