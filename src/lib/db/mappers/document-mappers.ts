import { Document, DocumentType, DocumentStatus, DocumentCategory } from '@/types/document';
import { Prisma, Document as PrismaDocument } from '@prisma/client';

export function mapPrismaDocumentToDocument(prismaDoc: PrismaDocument & {
  previousVersions?: { id: string }[];
  signatures?: { signerId: string }[];
}): Document {
  return {
    id: prismaDoc.id,
    name: prismaDoc.name,
    description: prismaDoc.description || undefined,
    type: prismaDoc.type as DocumentType,
    status: prismaDoc.status as DocumentStatus,
    category: prismaDoc.category as DocumentCategory,
    fileUrl: prismaDoc.fileUrl,
    fileType: prismaDoc.fileType,
    fileSize: prismaDoc.fileSize,
    uploadedBy: prismaDoc.uploadedById,
    uploadedByName: prismaDoc.uploadedByName || undefined,
    uploadDate: prismaDoc.uploadDate,
    lastModified: prismaDoc.uploadDate,
    expiryDate: prismaDoc.expiryDate || undefined,
    tags: prismaDoc.tags,
    version: prismaDoc.version,
    previousVersions: prismaDoc.previousVersions?.map(v => v.id) || [],
    metadata: prismaDoc.metadata as Record<string, any>,
    signatureRequired: prismaDoc.signatureRequired,
    signedBy: prismaDoc.signatures?.map(s => s.signerId) || [],
    signatureStatus: prismaDoc.signatureStatus as Document['signatureStatus'] || 'unsigned',
    organizationId: prismaDoc.organizationId || undefined
  };
}

export function mapDocumentToPrismaDocument(doc: Omit<Document, 'id'>): Prisma.DocumentCreateInput {
  return {
    name: doc.name,
    description: doc.description,
    type: doc.type,
    status: doc.status,
    category: doc.category,
    fileUrl: doc.fileUrl,
    fileType: doc.fileType,
    fileSize: doc.fileSize,
    uploadedBy: { connect: { id: doc.uploadedBy } },
    uploadedByName: doc.uploadedByName,
    uploadDate: doc.uploadDate,
    expiryDate: doc.expiryDate,
    tags: doc.tags,
    version: doc.version,
    previousVersions: {
      create: doc.previousVersions?.map(id => ({
        id,
        versionNumber: 1,
        fileUrl: doc.fileUrl,
        createdBy: { connect: { id: doc.uploadedBy } },
        size: doc.fileSize
      })) || []
    },
    metadata: doc.metadata as Prisma.JsonObject,
    signatureRequired: doc.signatureRequired,
    signatures: {
      create: doc.signedBy?.map(id => ({
        signerId: id,
        signatureMethod: 'click_to_sign',
        signatureDate: new Date()
      })) || []
    },
    signatureStatus: doc.signatureStatus,
    organizationId: doc.organizationId
  };
} 