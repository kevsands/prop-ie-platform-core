/**
 * Real HTB Service for database operations
 * Works with SQLite database for Help to Buy claims
 */

import sqlite3 from 'sqlite3';
import path from 'path';
import { HTBClaim, HTBDocument, HTBNote, HTBClaimStatus, HTBStatusUpdate } from '@/types/htb';

const { Database } = sqlite3;

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

// Create HTB tables if they don't exist
const initHTBTables = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new Database(dbPath);
    
    // Create HTB claims table
    const createClaimsTable = `
      CREATE TABLE IF NOT EXISTS htb_claims (
        id TEXT PRIMARY KEY,
        buyerId TEXT NOT NULL,
        developerId TEXT,
        propertyId TEXT NOT NULL,
        propertyPrice REAL NOT NULL,
        propertyAddress TEXT,
        status TEXT NOT NULL DEFAULT 'INITIATED',
        requestedAmount REAL NOT NULL,
        approvedAmount REAL,
        drawdownAmount REAL,
        accessCode TEXT,
        accessCodeExpiryDate TEXT,
        claimCode TEXT,
        claimCodeExpiryDate TEXT,
        applicationDate TEXT NOT NULL,
        lastUpdatedDate TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create HTB documents table
    const createDocumentsTable = `
      CREATE TABLE IF NOT EXISTS htb_documents (
        id TEXT PRIMARY KEY,
        claimId TEXT NOT NULL,
        url TEXT NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        uploadedBy TEXT NOT NULL,
        uploadedAt TEXT NOT NULL,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (claimId) REFERENCES htb_claims (id)
      )
    `;
    
    // Create HTB notes table
    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS htb_notes (
        id TEXT PRIMARY KEY,
        claimId TEXT NOT NULL,
        content TEXT NOT NULL,
        isPrivate BOOLEAN DEFAULT false,
        createdBy TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (claimId) REFERENCES htb_claims (id)
      )
    `;
    
    // Create HTB status history table
    const createStatusHistoryTable = `
      CREATE TABLE IF NOT EXISTS htb_status_history (
        id TEXT PRIMARY KEY,
        claimId TEXT NOT NULL,
        previousStatus TEXT,
        newStatus TEXT NOT NULL,
        updatedBy TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (claimId) REFERENCES htb_claims (id)
      )
    `;
    
    db.serialize(() => {
      db.run(createClaimsTable);
      db.run(createDocumentsTable);
      db.run(createNotesTable);
      db.run(createStatusHistoryTable, (err) => {
        db.close();
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

// Helper to generate IDs
const generateId = () => 'htb_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

/**
 * Real HTB service with SQLite database operations
 */
export const htbService = {
  /**
   * Initialize HTB tables
   */
  init: async (): Promise<void> => {
    await initHTBTables();
  },

  /**
   * Create a new HTB claim
   */
  createClaim: async (claimData: {
    buyerId: string;
    propertyId: string;
    propertyPrice: number;
    requestedAmount: number;
    propertyAddress?: string;
    developerId?: string;
  }): Promise<HTBClaim> => {
    await initHTBTables(); // Ensure tables exist
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const claimId = generateId();
      const now = new Date().toISOString();
      const statusId = generateId();
      
      db.serialize(() => {
        // Insert main claim record
        const insertClaim = `
          INSERT INTO htb_claims (
            id, buyerId, developerId, propertyId, propertyPrice, propertyAddress,
            status, requestedAmount, applicationDate, lastUpdatedDate, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertClaim, [
          claimId,
          claimData.buyerId,
          claimData.developerId || null,
          claimData.propertyId,
          claimData.propertyPrice,
          claimData.propertyAddress || null,
          HTBClaimStatus.INITIATED,
          claimData.requestedAmount,
          now,
          now,
          now,
          now
        ], function(err) {
          if (err) {
            db.close();
            reject(new Error('Failed to create HTB claim: ' + err.message));
            return;
          }
          
          // Insert initial status history
          const insertStatus = `
            INSERT INTO htb_status_history (
              id, claimId, previousStatus, newStatus, updatedBy, updatedAt, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.run(insertStatus, [
            statusId,
            claimId,
            null,
            HTBClaimStatus.INITIATED,
            claimData.buyerId,
            now,
            'HTB claim initiated'
          ], function(err) {
            if (err) {
              db.close();
              reject(new Error('Failed to create status history: ' + err.message));
              return;
            }
            
            // Return the created claim with full data
            htbService.getClaimById(claimId).then(claim => {
              db.close();
              if (claim) {
                resolve(claim);
              } else {
                reject(new Error('Failed to retrieve created claim'));
              }
            }).catch(err => {
              db.close();
              reject(err);
            });
          });
        });
      });
    });
  },

  /**
   * Get claim by ID
   */
  getClaimById: async (claimId: string): Promise<HTBClaim | null> => {
    await initHTBTables();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      // Get main claim data
      db.get('SELECT * FROM htb_claims WHERE id = ?', [claimId], (err, claim: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to fetch claim: ' + err.message));
          return;
        }
        
        if (!claim) {
          db.close();
          resolve(null);
          return;
        }
        
        // Get related data
        const getDocuments = new Promise<HTBDocument[]>((resolve, reject) => {
          db.all('SELECT * FROM htb_documents WHERE claimId = ?', [claimId], (err, docs: any[]) => {
            if (err) reject(err);
            else resolve(docs || []);
          });
        });
        
        const getNotes = new Promise<HTBNote[]>((resolve, reject) => {
          db.all('SELECT * FROM htb_notes WHERE claimId = ?', [claimId], (err, notes: any[]) => {
            if (err) reject(err);
            else resolve(notes || []);
          });
        });
        
        const getStatusHistory = new Promise<HTBStatusUpdate[]>((resolve, reject) => {
          db.all('SELECT * FROM htb_status_history WHERE claimId = ? ORDER BY updatedAt', [claimId], (err, history: any[]) => {
            if (err) reject(err);
            else resolve(history || []);
          });
        });
        
        Promise.all([getDocuments, getNotes, getStatusHistory])
          .then(([documents, notes, statusHistory]) => {
            db.close();
            
            const htbClaim: HTBClaim = {
              id: claim.id,
              buyerId: claim.buyerId,
              developerId: claim.developerId,
              propertyId: claim.propertyId,
              propertyPrice: claim.propertyPrice,
              propertyAddress: claim.propertyAddress,
              status: claim.status as HTBClaimStatus,
              requestedAmount: claim.requestedAmount,
              approvedAmount: claim.approvedAmount,
              drawdownAmount: claim.drawdownAmount,
              accessCode: claim.accessCode || '',
              accessCodeExpiryDate: claim.accessCodeExpiryDate,
              claimCode: claim.claimCode,
              claimCodeExpiryDate: claim.claimCodeExpiryDate,
              applicationDate: claim.applicationDate,
              lastUpdatedDate: claim.lastUpdatedDate,
              documents,
              notes,
              statusHistory
            };
            
            resolve(htbClaim);
          })
          .catch(err => {
            db.close();
            reject(new Error('Failed to fetch claim details: ' + err.message));
          });
      });
    });
  },

  /**
   * Get claims by buyer ID
   */
  getBuyerClaims: async (buyerId: string): Promise<HTBClaim[]> => {
    await initHTBTables();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.all('SELECT id FROM htb_claims WHERE buyerId = ? ORDER BY applicationDate DESC', [buyerId], async (err, claims: any[]) => {
        db.close();
        
        if (err) {
          reject(new Error('Failed to fetch buyer claims: ' + err.message));
          return;
        }
        
        if (!claims || claims.length === 0) {
          resolve([]);
          return;
        }
        
        try {
          // Get full claim data for each claim
          const fullClaims = await Promise.all(
            claims.map(claim => htbService.getClaimById(claim.id))
          );
          
          resolve(fullClaims.filter(claim => claim !== null) as HTBClaim[]);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  /**
   * Get claims by developer ID
   */
  getDeveloperClaims: async (developerId: string): Promise<HTBClaim[]> => {
    await initHTBTables();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.all('SELECT id FROM htb_claims WHERE developerId = ? ORDER BY applicationDate DESC', [developerId], async (err, claims: any[]) => {
        db.close();
        
        if (err) {
          reject(new Error('Failed to fetch developer claims: ' + err.message));
          return;
        }
        
        if (!claims || claims.length === 0) {
          resolve([]);
          return;
        }
        
        try {
          const fullClaims = await Promise.all(
            claims.map(claim => htbService.getClaimById(claim.id))
          );
          
          resolve(fullClaims.filter(claim => claim !== null) as HTBClaim[]);
        } catch (error) {
          reject(error);
        }
      });
    });
  },

  /**
   * Update claim status
   */
  updateClaimStatus: async (
    claimId: string, 
    newStatus: HTBClaimStatus, 
    updatedBy: string, 
    notes?: string
  ): Promise<HTBClaim | null> => {
    await initHTBTables();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      const now = new Date().toISOString();
      
      // First get current status
      db.get('SELECT status FROM htb_claims WHERE id = ?', [claimId], (err, claim: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to fetch current status: ' + err.message));
          return;
        }
        
        if (!claim) {
          db.close();
          resolve(null);
          return;
        }
        
        const previousStatus = claim.status;
        
        db.serialize(() => {
          // Update claim status
          db.run(
            'UPDATE htb_claims SET status = ?, lastUpdatedDate = ?, updatedAt = ? WHERE id = ?',
            [newStatus, now, now, claimId]
          );
          
          // Add status history entry
          const statusId = generateId();
          db.run(
            `INSERT INTO htb_status_history (
              id, claimId, previousStatus, newStatus, updatedBy, updatedAt, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [statusId, claimId, previousStatus, newStatus, updatedBy, now, notes || ''],
            function(err) {
              if (err) {
                db.close();
                reject(new Error('Failed to update status: ' + err.message));
                return;
              }
              
              // Return updated claim
              htbService.getClaimById(claimId).then(updatedClaim => {
                db.close();
                resolve(updatedClaim);
              }).catch(err => {
                db.close();
                reject(err);
              });
            }
          );
        });
      });
    });
  },

  /**
   * Add document to claim
   */
  addDocument: async (documentData: {
    claimId: string;
    url: string;
    name: string;
    type: string;
    uploadedBy: string;
  }): Promise<HTBDocument> => {
    await initHTBTables();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const docId = generateId();
      const now = new Date().toISOString();
      
      const insertDoc = `
        INSERT INTO htb_documents (
          id, claimId, url, name, type, uploadedBy, uploadedAt, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      db.run(insertDoc, [
        docId,
        documentData.claimId,
        documentData.url,
        documentData.name,
        documentData.type,
        documentData.uploadedBy,
        now,
        now
      ], function(err) {
        if (err) {
          db.close();
          reject(new Error('Failed to add document: ' + err.message));
          return;
        }
        
        // Return the created document
        db.get('SELECT * FROM htb_documents WHERE id = ?', [docId], (err, doc: any) => {
          db.close();
          if (err) {
            reject(new Error('Failed to retrieve created document: ' + err.message));
            return;
          }
          
          resolve(doc);
        });
      });
    });
  }
};

export default htbService;