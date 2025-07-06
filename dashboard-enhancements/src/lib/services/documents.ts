import { eq, and, desc, like } from "drizzle-orm";
import { documents } from "@/lib/db/schema";
import { initializeDb } from "@/lib/db/schema";
import { v4 as uuidv4 } from "uuid";

export type DocumentCreateInput = {
  title: string;
  type: string;
  url: string;
  propertyId: string;
  uploadedBy: string;
  status?: string;
  metadata?: Record<string, any>;
  category?: string;
  entityType?: string;
  entityId?: string;
};

export type DocumentUpdateInput = Partial<DocumentCreateInput> & {
  id: string;
};

export type DocumentQueryOptions = {
  propertyId?: string;
  userId?: string;
  type?: string;
  category?: string;
  status?: string;
  entityType?: string;
  entityId?: string;
  searchTerm?: string;
  limit?: number;
  offset?: number;
};

const db = initializeDb();

export class DocumentsService {
  /**
   * Create a new document
   */
  async createDocument(data: DocumentCreateInput) {
    const documentId = uuidv4();
    const now = new Date();
    
    try {
      const newDocument = await db
        .insert(documents)
        .values({
          id: documentId,
          title: data.title,
          type: data.type,
          url: data.url,
          propertyId: data.propertyId,
          uploadedBy: data.uploadedBy,
          status: data.status || "active",
          createdAt: now,
          updatedAt: now,
        })
        .returning();
      
      return newDocument[0];
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error("Failed to create document");
    }
  }

  /**
   * Get a document by ID
   */
  async getDocumentById(id: string) {
    try {
      const document = await db.select().from(documents).where(eq(documents.id, id));
      return document[0] || null;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw new Error("Failed to fetch document");
    }
  }

  /**
   * Update a document
   */
  async updateDocument(data: DocumentUpdateInput) {
    const { id, ...updateData } = data;
    const now = new Date();
    
    try {
      const updatedDocument = await db
        .update(documents)
        .set({
          ...updateData,
          updatedAt: now,
        })
        .where(eq(documents.id, id))
        .returning();
      
      return updatedDocument[0];
    } catch (error) {
      console.error("Error updating document:", error);
      throw new Error("Failed to update document");
    }
  }

  /**
   * Delete a document
   */
  async deleteDocument(id: string) {
    try {
      const deletedDocument = await db
        .delete(documents)
        .where(eq(documents.id, id))
        .returning();
      
      return deletedDocument[0];
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error("Failed to delete document");
    }
  }

  /**
   * List documents with filtering options
   */
  async listDocuments(options: DocumentQueryOptions = {}) {
    const {
      propertyId,
      userId,
      type,
      category,
      status,
      entityType,
      entityId,
      searchTerm,
      limit = 100,
      offset = 0,
    } = options;

    try {
      let query = db.select().from(documents);
      
      // Apply filters
      const conditions = [];
      
      if (propertyId) {
        conditions.push(eq(documents.propertyId, propertyId));
      }
      
      if (userId) {
        conditions.push(eq(documents.uploadedBy, userId));
      }
      
      if (type) {
        conditions.push(eq(documents.type, type));
      }
      
      if (status) {
        conditions.push(eq(documents.status, status));
      }
      
      if (searchTerm) {
        conditions.push(like(documents.title, `%${searchTerm}%`));
      }
      
      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
      
      // Apply pagination
      query = query.limit(limit).offset(offset).orderBy(desc(documents.createdAt));
      
      const results = await query;
      return results;
    } catch (error) {
      console.error("Error listing documents:", error);
      throw new Error("Failed to list documents");
    }
  }

  /**
   * Soft delete a document (mark as inactive)
   */
  async softDeleteDocument(id: string) {
    try {
      const updatedDocument = await db
        .update(documents)
        .set({
          status: "inactive",
          updatedAt: new Date(),
        })
        .where(eq(documents.id, id))
        .returning();
      
      return updatedDocument[0];
    } catch (error) {
      console.error("Error soft deleting document:", error);
      throw new Error("Failed to soft delete document");
    }
  }

  /**
   * Get documents by entity (user, development, sale, etc.)
   */
  async getDocumentsByEntity(entityType: string, entityId: string) {
    try {
      // This is a placeholder - in a real implementation, you'd add
      // entityType and entityId columns to the documents table
      const entityDocuments = await this.listDocuments({
        propertyId: entityType === 'property' ? entityId : undefined,
        userId: entityType === 'user' ? entityId : undefined,
      });
      
      return entityDocuments;
    } catch (error) {
      console.error(`Error fetching documents for ${entityType}:`, error);
      throw new Error(`Failed to fetch documents for ${entityType}`);
    }
  }
}

// Export a singleton instance
export const documentsService = new DocumentsService();