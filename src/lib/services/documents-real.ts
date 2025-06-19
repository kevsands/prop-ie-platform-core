/**
 * Real Documents Service for database operations
 * CRITICAL: Supports €2M+ active sales transactions
 * Handles legal documents, contracts, KYC, HTB, and compliance documents
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { DocumentType, DocumentStatus, DocumentCategory } from '@/types/document';

const { Database } = sqlite3;

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

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
};

export type UpdateDocumentInput = {
  title?: string;
  description?: string;
  type?: string;
  tags?: string[];
  isPublic?: boolean;
  expiryDate?: Date;
};

// Helper to generate IDs
const generateId = () => 'doc_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

/**
 * Real documents service with SQLite database operations
 * Handles enterprise-grade document management for property transactions
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
  }): Promise<{
    documents: Document[];
    total: number;
  }> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      let query = 'SELECT * FROM documents';
      const params: any[] = [];
      const conditions: string[] = [];
      
      if (filters?.ownerId) {
        conditions.push('ownerId = ?');
        params.push(filters.ownerId);
      }
      
      if (filters?.ownerType) {
        conditions.push('ownerType = ?');
        params.push(filters.ownerType);
      }
      
      if (filters?.type) {
        conditions.push('type = ?');
        params.push(filters.type);
      }
      
      if (filters?.uploadedBy) {
        conditions.push('uploadedBy = ?');
        params.push(filters.uploadedBy);
      }
      
      if (filters?.isPublic !== undefined) {
        conditions.push('isPublic = ?');
        params.push(filters.isPublic ? 1 : 0);
      }
      
      if (filters?.search) {
        conditions.push('(title LIKE ? OR description LIKE ?)');
        const searchPattern = `%${filters.search}%`;
        params.push(searchPattern, searchPattern);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY createdAt DESC';
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
      
      // First get the total count
      let countQuery = 'SELECT COUNT(*) as total FROM documents';
      const countParams = params.slice(0, -2); // Remove LIMIT and OFFSET from count query
      
      if (conditions.length > 0) {
        countQuery += ' WHERE ' + conditions.join(' AND ');
      }
      
      db.get(countQuery, countParams, (err, countResult: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to count documents: ' + err.message));
          return;
        }
        
        // Then get the documents
        db.all(query, params, (err, rows: any[]) => {
          db.close();
          if (err) {
            reject(new Error('Failed to fetch documents: ' + err.message));
            return;
          }
          
          const documents = rows.map(row => ({
            ...row,
            isPublic: !!row.isPublic,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
          }));
          
          resolve({
            documents,
            total: countResult.total
          });
        });
      });
    });
  },

  /**
   * Get a single document by ID
   */
  getDocumentById: async (id: string): Promise<Document | null> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get('SELECT * FROM documents WHERE id = ?', [id], (err, row: any) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch document: ' + err.message));
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        resolve({
          ...row,
          isPublic: !!row.isPublic,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
          expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
        });
      });
    });
  },

  /**
   * Create a new document
   */
  createDocument: async (documentData: CreateDocumentInput): Promise<Document> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const docId = generateId();
      const now = new Date().toISOString();
      const tagsData = JSON.stringify(documentData.tags || []);
      
      const insertQuery = `
        INSERT INTO documents (
          id, title, description, type, url, mimeType, size, uploadedBy, 
          ownerId, ownerType, tagsData, version, isPublic, expiryDate, 
          createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(insertQuery, [
        docId,
        documentData.title,
        documentData.description || null,
        documentData.type,
        documentData.url,
        documentData.mimeType || null,
        documentData.size || null,
        documentData.uploadedBy,
        documentData.ownerId || null,
        documentData.ownerType || null,
        tagsData,
        1, // Initial version
        documentData.isPublic ? 1 : 0,
        documentData.expiryDate ? documentData.expiryDate.toISOString() : null,
        now,
        now
      ], function(err) {
        if (err) {
          db.close();
          reject(new Error('Failed to create document: ' + err.message));
          return;
        }
        
        // Return the created document
        db.get('SELECT * FROM documents WHERE id = ?', [docId], (err, row: any) => {
          db.close();
          if (err) {
            reject(new Error('Failed to retrieve created document: ' + err.message));
            return;
          }
          
          resolve({
            ...row,
            isPublic: !!row.isPublic,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
          });
        });
      });
    });
  },

  /**
   * Update an existing document
   */
  updateDocument: async (id: string, updateData: UpdateDocumentInput): Promise<Document | null> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const updateFields: string[] = [];
      const params: any[] = [];
      
      if (updateData.title !== undefined) {
        updateFields.push('title = ?');
        params.push(updateData.title);
      }
      if (updateData.description !== undefined) {
        updateFields.push('description = ?');
        params.push(updateData.description);
      }
      if (updateData.type !== undefined) {
        updateFields.push('type = ?');
        params.push(updateData.type);
      }
      if (updateData.tags !== undefined) {
        updateFields.push('tagsData = ?');
        params.push(JSON.stringify(updateData.tags));
      }
      if (updateData.isPublic !== undefined) {
        updateFields.push('isPublic = ?');
        params.push(updateData.isPublic ? 1 : 0);
      }
      if (updateData.expiryDate !== undefined) {
        updateFields.push('expiryDate = ?');
        params.push(updateData.expiryDate ? updateData.expiryDate.toISOString() : null);
      }
      
      updateFields.push('updatedAt = ?');
      params.push(new Date().toISOString());
      params.push(id);
      
      const updateQuery = `UPDATE documents SET ${updateFields.join(', ')} WHERE id = ?`;
      
      db.run(updateQuery, params, function(err) {
        if (err) {
          db.close();
          reject(new Error('Failed to update document: ' + err.message));
          return;
        }
        
        if (this.changes === 0) {
          db.close();
          resolve(null);
          return;
        }
        
        // Return updated document
        db.get('SELECT * FROM documents WHERE id = ?', [id], (err, row: any) => {
          db.close();
          if (err) {
            reject(new Error('Failed to retrieve updated document: ' + err.message));
            return;
          }
          
          resolve(row ? {
            ...row,
            isPublic: !!row.isPublic,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
            expiryDate: row.expiryDate ? new Date(row.expiryDate) : undefined,
          } : null);
        });
      });
    });
  },

  /**
   * Delete a document
   */
  deleteDocument: async (id: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.run('DELETE FROM documents WHERE id = ?', [id], function(err) {
        db.close();
        if (err) {
          reject(new Error('Failed to delete document: ' + err.message));
          return;
        }
        
        resolve(this.changes > 0);
      });
    });
  },

  /**
   * Get documents by owner (user, property, sale, HTB claim, etc.)
   */
  getDocumentsByOwner: async (ownerId: string, ownerType: string): Promise<Document[]> => {
    const result = await documentsService.getDocuments({
      ownerId,
      ownerType
    });
    return result.documents;
  },

  /**
   * Create a new version of an existing document
   */
  createDocumentVersion: async (documentId: string, versionData: {
    url: string;
    uploadedBy: string;
    changeNotes?: string;
  }): Promise<DocumentVersion> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      // First get current max version
      db.get('SELECT MAX(version) as maxVersion FROM document_versions WHERE documentId = ?', 
        [documentId], (err, result: any) => {
          if (err) {
            db.close();
            reject(new Error('Failed to get document versions: ' + err.message));
            return;
          }
          
          const newVersion = (result?.maxVersion || 0) + 1;
          const versionId = generateId();
          const now = new Date().toISOString();
          
          // Insert new version
          const insertVersion = `
            INSERT INTO document_versions (
              id, documentId, version, url, uploadedBy, uploadedAt, changeNotes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.run(insertVersion, [
            versionId,
            documentId,
            newVersion,
            versionData.url,
            versionData.uploadedBy,
            now,
            versionData.changeNotes || null
          ], function(err) {
            if (err) {
              db.close();
              reject(new Error('Failed to create document version: ' + err.message));
              return;
            }
            
            // Update main document version and URL
            db.run(
              'UPDATE documents SET version = ?, url = ?, updatedAt = ? WHERE id = ?',
              [newVersion, versionData.url, now, documentId],
              function(err) {
                if (err) {
                  db.close();
                  reject(new Error('Failed to update document: ' + err.message));
                  return;
                }
                
                // Return the created version
                db.get('SELECT * FROM document_versions WHERE id = ?', [versionId], (err, row: any) => {
                  db.close();
                  if (err) {
                    reject(new Error('Failed to retrieve created version: ' + err.message));
                    return;
                  }
                  
                  resolve({
                    ...row,
                    uploadedAt: new Date(row.uploadedAt)
                  });
                });
              }
            );
          });
        });
    });
  },

  /**
   * Get all versions of a document
   */
  getDocumentVersions: async (documentId: string): Promise<DocumentVersion[]> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.all(
        'SELECT * FROM document_versions WHERE documentId = ? ORDER BY version DESC',
        [documentId],
        (err, rows: any[]) => {
          db.close();
          if (err) {
            reject(new Error('Failed to fetch document versions: ' + err.message));
            return;
          }
          
          const versions = rows.map(row => ({
            ...row,
            uploadedAt: new Date(row.uploadedAt)
          }));
          
          resolve(versions);
        }
      );
    });
  }
};

export default documentsService;