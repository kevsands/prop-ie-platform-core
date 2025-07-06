/**
 * Real Sales/Transaction Service for database operations
 * CRITICAL: Manages €2M+ active property sales and transactions
 * Handles complete transaction lifecycle from enquiry to completion
 */

import sqlite3 from 'sqlite3';
import path from 'path';

const { Database } = sqlite3;

const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

// Sale statuses representing the transaction lifecycle
export enum SaleStatus {
  ENQUIRY = 'ENQUIRY',
  VIEWING = 'VIEWING', 
  OFFER = 'OFFER',
  OFFER_ACCEPTED = 'OFFER_ACCEPTED',
  RESERVATION = 'RESERVATION',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  CONTRACT_SIGNED = 'CONTRACT_SIGNED',
  MORTGAGE_APPROVED = 'MORTGAGE_APPROVED',
  COMPLETION_SCHEDULED = 'COMPLETION_SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

// Sale interfaces matching our business requirements
export type Sale = {
  id: string;
  unitId: string;
  buyerId: string;
  agentId?: string;
  status: string;
  agreedPrice?: number;
  deposit?: number;
  mortgageAmount?: number;
  enquiryDate: Date;
  reservationDate?: Date;
  contractDate?: Date;
  completionDate?: Date;
  notes?: string;
  metadata?: string; // JSON string
  tagsData?: string; // JSON string
  createdAt: Date;
  updatedAt: Date;
};

export type SaleStatusHistory = {
  id: string;
  saleId: string;
  previousStatus?: string;
  newStatus: string;
  updatedBy: string;
  updatedAt: Date;
  notes?: string;
};

export type CreateSaleInput = {
  unitId: string;
  buyerId: string;
  agentId?: string;
  agreedPrice?: number;
  deposit?: number;
  mortgageAmount?: number;
  notes?: string;
  metadata?: Record<string, any>;
  tags?: string[];
};

export type UpdateSaleInput = {
  status?: string;
  agreedPrice?: number;
  deposit?: number;
  mortgageAmount?: number;
  reservationDate?: Date;
  contractDate?: Date;
  completionDate?: Date;
  notes?: string;
  metadata?: Record<string, any>;
  tags?: string[];
};

// Helper to generate IDs
const generateId = () => 'sale_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);

// Create sale status history table if it doesn't exist
const initSaleStatusHistoryTable = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new Database(dbPath);
    
    const createStatusHistoryTable = `
      CREATE TABLE IF NOT EXISTS sale_status_history (
        id TEXT PRIMARY KEY,
        saleId TEXT NOT NULL,
        previousStatus TEXT,
        newStatus TEXT NOT NULL,
        updatedBy TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (saleId) REFERENCES sales (id)
      )
    `;
    
    db.run(createStatusHistoryTable, (err) => {
      db.close();
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

/**
 * Real sales service with SQLite database operations
 * Handles enterprise-grade transaction management for property sales
 */
export const salesService = {
  /**
   * Get all sales with optional filtering
   */
  getSales: async (filters?: { 
    status?: string;
    buyerId?: string;
    unitId?: string;
    agentId?: string;
    developmentId?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
    offset?: number;
  }): Promise<{
    sales: Sale[];
    total: number;
  }> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      let query = 'SELECT s.* FROM sales s';
      const params: any[] = [];
      const conditions: string[] = [];
      
      // Join with units table if filtering by development
      if (filters?.developmentId) {
        query += ' JOIN units u ON s.unitId = u.id';
        conditions.push('u.developmentId = ?');
        params.push(filters.developmentId);
      }
      
      if (filters?.status) {
        conditions.push('s.status = ?');
        params.push(filters.status);
      }
      
      if (filters?.buyerId) {
        conditions.push('s.buyerId = ?');
        params.push(filters.buyerId);
      }
      
      if (filters?.unitId) {
        conditions.push('s.unitId = ?');
        params.push(filters.unitId);
      }
      
      if (filters?.agentId) {
        conditions.push('s.agentId = ?');
        params.push(filters.agentId);
      }
      
      if (filters?.minPrice) {
        conditions.push('s.agreedPrice >= ?');
        params.push(filters.minPrice);
      }
      
      if (filters?.maxPrice) {
        conditions.push('s.agreedPrice <= ?');
        params.push(filters.maxPrice);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY s.createdAt DESC';
      
      // Count query
      let countQuery = 'SELECT COUNT(*) as total FROM sales s';
      if (filters?.developmentId) {
        countQuery += ' JOIN units u ON s.unitId = u.id';
      }
      if (conditions.length > 0) {
        countQuery += ' WHERE ' + conditions.join(' AND ');
      }
      
      if (filters?.limit) {
        query += ' LIMIT ?';
        params.push(filters.limit);
        
        if (filters?.offset) {
          query += ' OFFSET ?';
          params.push(filters.offset);
        }
      }
      
      // Get count first
      const countParams = params.slice(0, conditions.length);
      db.get(countQuery, countParams, (err, countResult: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to count sales: ' + err.message));
          return;
        }
        
        // Then get sales
        db.all(query, params, (err, rows: any[]) => {
          db.close();
          if (err) {
            reject(new Error('Failed to fetch sales: ' + err.message));
            return;
          }
          
          const sales = rows.map(row => ({
            ...row,
            enquiryDate: new Date(row.enquiryDate),
            reservationDate: row.reservationDate ? new Date(row.reservationDate) : undefined,
            contractDate: row.contractDate ? new Date(row.contractDate) : undefined,
            completionDate: row.completionDate ? new Date(row.completionDate) : undefined,
            createdAt: new Date(row.createdAt),
            updatedAt: new Date(row.updatedAt),
          }));
          
          resolve({
            sales,
            total: countResult.total
          });
        });
      });
    });
  },

  /**
   * Get a single sale by ID
   */
  getSaleById: async (id: string): Promise<Sale | null> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get('SELECT * FROM sales WHERE id = ?', [id], (err, row: any) => {
        db.close();
        if (err) {
          reject(new Error('Failed to fetch sale: ' + err.message));
          return;
        }
        
        if (!row) {
          resolve(null);
          return;
        }
        
        resolve({
          ...row,
          enquiryDate: new Date(row.enquiryDate),
          reservationDate: row.reservationDate ? new Date(row.reservationDate) : undefined,
          contractDate: row.contractDate ? new Date(row.contractDate) : undefined,
          completionDate: row.completionDate ? new Date(row.completionDate) : undefined,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        });
      });
    });
  },

  /**
   * Create a new sale
   */
  createSale: async (saleData: CreateSaleInput): Promise<Sale> => {
    await initSaleStatusHistoryTable(); // Ensure status history table exists
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const saleId = generateId();
      const now = new Date().toISOString();
      const statusHistoryId = generateId();
      
      const metadata = JSON.stringify(saleData.metadata || {});
      const tagsData = JSON.stringify(saleData.tags || []);
      
      db.serialize(() => {
        // Insert main sale record
        const insertSale = `
          INSERT INTO sales (
            id, unitId, buyerId, agentId, status, agreedPrice, deposit, 
            mortgageAmount, enquiryDate, notes, metadata, tagsData, 
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        db.run(insertSale, [
          saleId,
          saleData.unitId,
          saleData.buyerId,
          saleData.agentId || null,
          SaleStatus.ENQUIRY,
          saleData.agreedPrice || null,
          saleData.deposit || null,
          saleData.mortgageAmount || null,
          now,
          saleData.notes || null,
          metadata,
          tagsData,
          now,
          now
        ], function(err) {
          if (err) {
            db.close();
            reject(new Error('Failed to create sale: ' + err.message));
            return;
          }
          
          // Insert initial status history
          const insertStatus = `
            INSERT INTO sale_status_history (
              id, saleId, previousStatus, newStatus, updatedBy, updatedAt, notes
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
          `;
          
          db.run(insertStatus, [
            statusHistoryId,
            saleId,
            null,
            SaleStatus.ENQUIRY,
            saleData.buyerId,
            now,
            'Sale inquiry initiated'
          ], function(err) {
            if (err) {
              db.close();
              reject(new Error('Failed to create status history: ' + err.message));
              return;
            }
            
            // Return the created sale
            salesService.getSaleById(saleId).then(sale => {
              db.close();
              if (sale) {
                resolve(sale);
              } else {
                reject(new Error('Failed to retrieve created sale'));
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
   * Update an existing sale
   */
  updateSale: async (id: string, updateData: UpdateSaleInput, updatedBy: string): Promise<Sale | null> => {
    await initSaleStatusHistoryTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      // First get current sale to check for status changes
      db.get('SELECT status FROM sales WHERE id = ?', [id], (err, currentSale: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to fetch current sale: ' + err.message));
          return;
        }
        
        if (!currentSale) {
          db.close();
          resolve(null);
          return;
        }
        
        const updateFields: string[] = [];
        const params: any[] = [];
        
        if (updateData.status !== undefined) {
          updateFields.push('status = ?');
          params.push(updateData.status);
        }
        if (updateData.agreedPrice !== undefined) {
          updateFields.push('agreedPrice = ?');
          params.push(updateData.agreedPrice);
        }
        if (updateData.deposit !== undefined) {
          updateFields.push('deposit = ?');
          params.push(updateData.deposit);
        }
        if (updateData.mortgageAmount !== undefined) {
          updateFields.push('mortgageAmount = ?');
          params.push(updateData.mortgageAmount);
        }
        if (updateData.reservationDate !== undefined) {
          updateFields.push('reservationDate = ?');
          params.push(updateData.reservationDate ? updateData.reservationDate.toISOString() : null);
        }
        if (updateData.contractDate !== undefined) {
          updateFields.push('contractDate = ?');
          params.push(updateData.contractDate ? updateData.contractDate.toISOString() : null);
        }
        if (updateData.completionDate !== undefined) {
          updateFields.push('completionDate = ?');
          params.push(updateData.completionDate ? updateData.completionDate.toISOString() : null);
        }
        if (updateData.notes !== undefined) {
          updateFields.push('notes = ?');
          params.push(updateData.notes);
        }
        if (updateData.metadata !== undefined) {
          updateFields.push('metadata = ?');
          params.push(JSON.stringify(updateData.metadata));
        }
        if (updateData.tags !== undefined) {
          updateFields.push('tagsData = ?');
          params.push(JSON.stringify(updateData.tags));
        }
        
        updateFields.push('updatedAt = ?');
        const now = new Date().toISOString();
        params.push(now);
        params.push(id);
        
        const updateQuery = `UPDATE sales SET ${updateFields.join(', ')} WHERE id = ?`;
        
        db.serialize(() => {
          // Update sale
          db.run(updateQuery, params, function(err) {
            if (err) {
              db.close();
              reject(new Error('Failed to update sale: ' + err.message));
              return;
            }
            
            if (this.changes === 0) {
              db.close();
              resolve(null);
              return;
            }
            
            // If status changed, add status history entry
            if (updateData.status && updateData.status !== currentSale.status) {
              const statusId = generateId();
              const insertStatus = `
                INSERT INTO sale_status_history (
                  id, saleId, previousStatus, newStatus, updatedBy, updatedAt, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?)
              `;
              
              db.run(insertStatus, [
                statusId,
                id,
                currentSale.status,
                updateData.status,
                updatedBy,
                now,
                updateData.notes || `Status updated to ${updateData.status}`
              ], function(err) {
                if (err) {
                  console.warn('Failed to create status history:', err.message);
                  // Don't fail the whole operation for status history
                }
                
                // Return updated sale
                salesService.getSaleById(id).then(updatedSale => {
                  db.close();
                  resolve(updatedSale);
                }).catch(err => {
                  db.close();
                  reject(err);
                });
              });
            } else {
              // No status change, just return updated sale
              salesService.getSaleById(id).then(updatedSale => {
                db.close();
                resolve(updatedSale);
              }).catch(err => {
                db.close();
                reject(err);
              });
            }
          });
        });
      });
    });
  },

  /**
   * Get sale status history
   */
  getSaleStatusHistory: async (saleId: string): Promise<SaleStatusHistory[]> => {
    await initSaleStatusHistoryTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.all(
        'SELECT * FROM sale_status_history WHERE saleId = ? ORDER BY updatedAt DESC',
        [saleId],
        (err, rows: any[]) => {
          db.close();
          if (err) {
            reject(new Error('Failed to fetch status history: ' + err.message));
            return;
          }
          
          const history = rows.map(row => ({
            ...row,
            updatedAt: new Date(row.updatedAt)
          }));
          
          resolve(history);
        }
      );
    });
  },

  /**
   * Get sales by buyer ID
   */
  getSalesByBuyerId: async (buyerId: string): Promise<Sale[]> => {
    const result = await salesService.getSales({ buyerId });
    return result.sales;
  },

  /**
   * Get sales by development ID
   */
  getSalesByDevelopmentId: async (developmentId: string): Promise<Sale[]> => {
    const result = await salesService.getSales({ developmentId });
    return result.sales;
  },

  /**
   * Get sales summary statistics
   */
  getSalesSummary: async (): Promise<{
    totalSales: number;
    totalValue: number;
    completedSales: number;
    completedValue: number;
    activeSales: number;
    statusBreakdown: Record<string, number>;
  }> => {
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      const summaryQuery = `
        SELECT 
          COUNT(*) as totalSales,
          SUM(COALESCE(agreedPrice, 0)) as totalValue,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completedSales,
          SUM(CASE WHEN status = 'COMPLETED' THEN COALESCE(agreedPrice, 0) ELSE 0 END) as completedValue,
          SUM(CASE WHEN status NOT IN ('COMPLETED', 'CANCELLED', 'EXPIRED') THEN 1 ELSE 0 END) as activeSales
        FROM sales
      `;
      
      db.get(summaryQuery, [], (err, summary: any) => {
        if (err) {
          db.close();
          reject(new Error('Failed to get sales summary: ' + err.message));
          return;
        }
        
        // Get status breakdown
        db.all('SELECT status, COUNT(*) as count FROM sales GROUP BY status', [], (err, statusRows: any[]) => {
          db.close();
          if (err) {
            reject(new Error('Failed to get status breakdown: ' + err.message));
            return;
          }
          
          const statusBreakdown: Record<string, number> = {};
          statusRows.forEach(row => {
            statusBreakdown[row.status] = row.count;
          });
          
          resolve({
            totalSales: summary.totalSales || 0,
            totalValue: summary.totalValue || 0,
            completedSales: summary.completedSales || 0,
            completedValue: summary.completedValue || 0,
            activeSales: summary.activeSales || 0,
            statusBreakdown
          });
        });
      });
    });
  },

  /**
   * Update sale status with comprehensive status history tracking
   */
  updateSaleStatus: async (id: string, statusUpdate: {
    status: SaleStatus;
    previousStatus?: SaleStatus;
    updatedById: string;
    notes?: string;
    timelineUpdates?: Record<string, Date>;
  }): Promise<Sale | null> => {
    return salesService.updateSale(id, { 
      status: statusUpdate.status,
      notes: statusUpdate.notes 
    }, statusUpdate.updatedById);
  },

  /**
   * Update deposit information for a sale
   */
  updateDeposit: async (saleId: string, depositData: {
    initialAmount: number;
    initialAmountPercentage: number;
    initialPaidDate?: Date;
    balanceAmount: number;
    balanceDueDate?: Date;
    balancePaidDate?: Date;
    totalPaid: number;
    status: SaleStatus;
    paymentMethod?: string;
    receiptDocumentIds?: string[];
  }): Promise<any> => {
    // For now, update the sale with deposit info in metadata
    const metadata = {
      deposit: depositData
    };
    
    return salesService.updateSale(saleId, { 
      deposit: depositData.totalPaid,
      metadata 
    }, 'system');
  },

  /**
   * Add a note to a sale
   */
  addNote: async (noteData: {
    saleId: string;
    authorId: string;
    content: string;
    isPrivate?: boolean;
    category?: string;
  }): Promise<any> => {
    // For now, add note to sale notes field
    const existingSale = await salesService.getSaleById(noteData.saleId);
    if (!existingSale) {
      throw new Error('Sale not found');
    }
    
    const existingNotes = existingSale.notes || '';
    const timestamp = new Date().toISOString();
    const newNote = `\n[${timestamp}] ${noteData.authorId}: ${noteData.content}`;
    
    return salesService.updateSale(noteData.saleId, {
      notes: existingNotes + newNote
    }, noteData.authorId);
  },

  /**
   * Create or update a task for a sale
   */
  upsertTask: async (taskData: {
    id?: string;
    saleId: string;
    title: string;
    description: string;
    dueDate: Date;
    status: string;
    priority: string;
    assignedToId: string;
    createdById: string;
    notifyBeforeDays?: number;
  }): Promise<any> => {
    // For now, add task info to sale metadata
    const existingSale = await salesService.getSaleById(taskData.saleId);
    if (!existingSale) {
      throw new Error('Sale not found');
    }
    
    const metadata = existingSale.metadata ? JSON.parse(existingSale.metadata) : {};
    if (!metadata.tasks) {
      metadata.tasks = [];
    }
    
    const task = {
      id: taskData.id || 'task_' + Date.now().toString(36),
      title: taskData.title,
      description: taskData.description,
      dueDate: taskData.dueDate.toISOString(),
      status: taskData.status,
      priority: taskData.priority,
      assignedToId: taskData.assignedToId,
      createdById: taskData.createdById,
      createdAt: new Date().toISOString()
    };
    
    if (taskData.id) {
      // Update existing task
      const taskIndex = metadata.tasks.findIndex((t: any) => t.id === taskData.id);
      if (taskIndex >= 0) {
        metadata.tasks[taskIndex] = { ...metadata.tasks[taskIndex], ...task };
      }
    } else {
      // Add new task
      metadata.tasks.push(task);
    }
    
    await salesService.updateSale(taskData.saleId, { metadata }, taskData.createdById);
    return task;
  },

  /**
   * Delete a sale (soft delete)
   */
  deleteSale: async (id: string, updatedById: string, reason: string): Promise<Sale | null> => {
    return salesService.updateSale(id, {
      status: SaleStatus.CANCELLED,
      notes: `Sale cancelled: ${reason}`
    }, updatedById);
  }
};

export default salesService;