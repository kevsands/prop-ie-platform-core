// src/lib/supplierApi.ts
import axios from 'axios';
import { connectToDatabase } from './mongodb';

// Stock level interface
export interface StockLevel {
  available: boolean;
  quantity?: number;
  leadTime?: number; // in days
  updatedAt: Date;
}

// Supplier interface
export interface Supplier {
  id: string;
  name: string;
  apiEndpoint?: string;
  apiKey?: string;
}

// Cache for supplier information
const supplierCache = new Map<string, Supplier>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cacheTimestamps = new Map<string, number>();

/**
 * Get a supplier by ID with caching
 */
export async function getSupplier(supplierId: string): Promise<Supplier | null> {
  // Check cache first
  if (
    supplierCache.has(supplierId) &&
    cacheTimestamps.get(supplierId)! > Date.now() - CACHE_TTL
  ) {
    return supplierCache.get(supplierId) || null;
  }
  
  // Get from database
  try {
    const { db } = await connectToDatabase();
    const supplier = await db.collection('suppliers').findOne({ _id: supplierId });
    
    if (!supplier) {
      return null;
    }
    
    const supplierData: Supplier = {
      id: supplier._id.toString(),
      name: supplier.name,
      apiEndpoint: supplier.apiEndpoint,
      apiKey: supplier.apiKey,
    };
    
    // Update cache
    supplierCache.set(supplierId, supplierData);
    cacheTimestamps.set(supplierId, Date.now());
    
    return supplierData;
  } catch (error) {
    console.error(`Error fetching supplier ${supplierId}:`, error);
    return null;
  }
}

/**
 * Get stock levels from suppliers
 */
export async function getSupplierStockLevels(
  itemIds: string[]
): Promise<Record<string, StockLevel>> {
  const result: Record<string, StockLevel> = {};
  
  if (!itemIds.length) {
    return result;
  }
  
  try {
    const { db } = await connectToDatabase();
    
    // Get supplier item mappings
    const supplierItems = await db
      .collection('supplierItems')
      .find({ itemId: { $in: itemIds } })
      .toArray();
    
    // Group by supplier
    const supplierItemMap: Record<string, { itemId: string; supplierItemCode: string }[]> = {};
    
    supplierItems.forEach(item => {
      const supplierId = item.supplierId.toString();
      
      if (!supplierItemMap[supplierId]) {
        supplierItemMap[supplierId] = [];
      }
      
      supplierItemMap[supplierId].push({
        itemId: item.itemId,
        supplierItemCode: item.supplierItemCode,
      });
    });
    
    // Query each supplier
    const queryPromises = Object.entries(supplierItemMap).map(
      async ([supplierId, items]) => {
        const supplier = await getSupplier(supplierId);
        
        if (!supplier) {
          return;
        }
        
        // Use supplier API if available
        if (supplier.apiEndpoint) {
          try {
            const response = await axios.post(
              `${supplier.apiEndpoint}/stock`,
              {
                items: items.map(item => item.supplierItemCode),
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${supplier.apiKey}`,
                },
                timeout: 5000,
              }
            );
            
            const stockData = response.data;
            
            // Process response
            items.forEach(item => {
              if (
                stockData[item.supplierItemCode] &&
                typeof stockData[item.supplierItemCode].available === 'boolean'
              ) {
                result[item.itemId] = {
                  available: stockData[item.supplierItemCode].available,
                  quantity: stockData[item.supplierItemCode].quantity,
                  leadTime: stockData[item.supplierItemCode].leadTime,
                  updatedAt: new Date(),
                };
              }
            });
          } catch (error) {
            console.error(`Failed to get stock from supplier ${supplier.name}:`, error);
            // Fall back to database cache
          }
        }
        
        // Get cached stock levels from database if needed
        const itemsNotProcessed = items.filter(
          item => !result[item.itemId]
        );
        
        if (itemsNotProcessed.length > 0) {
          const stockRecords = await db
            .collection('supplierStockLevels')
            .find({
              supplierId,
              supplierItemCode: {
                $in: itemsNotProcessed.map(item => item.supplierItemCode),
              },
            })
            .toArray();
          
          // Create map of stock records
          const stockMap: Record<string, any> = {};
          stockRecords.forEach(record => {
            stockMap[record.supplierItemCode] = record;
          });
          
          // Process remaining items
          itemsNotProcessed.forEach(item => {
            if (stockMap[item.supplierItemCode]) {
              result[item.itemId] = {
                available: stockMap[item.supplierItemCode].available,
                quantity: stockMap[item.supplierItemCode].quantity,
                leadTime: stockMap[item.supplierItemCode].leadTime,
                updatedAt: new Date(stockMap[item.supplierItemCode].updatedAt),
              };
            } else {
              // No stock info available, assume available with no data
              result[item.itemId] = {
                available: true,
                updatedAt: new Date(),
              };
            }
          });
        }
      }
    );
    
    await Promise.all(queryPromises);
    
    // Fill in any missing items with default values
    itemIds.forEach(itemId => {
      if (!result[itemId]) {
        result[itemId] = {
          available: true,
          updatedAt: new Date(),
        };
      }
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching stock levels:', error);
    
    // Return default values on error
    return itemIds.reduce((acc, itemId) => {
      acc[itemId] = {
        available: true,
        updatedAt: new Date(),
      };
      return acc;
    }, {} as Record<string, StockLevel>);
  }
}

/**
 * Update local stock level cache
 */
export async function updateStockLevelCache(
  supplierId: string,
  items: { supplierItemCode: string; available: boolean; quantity?: number; leadTime?: number }[]
): Promise<void> {
  try {
    const { db } = await connectToDatabase();
    
    // Bulk operations
    const operations = items.map(item => ({
      updateOne: {
        filter: {
          supplierId,
          supplierItemCode: item.supplierItemCode,
        },
        update: {
          $set: {
            available: item.available,
            quantity: item.quantity,
            leadTime: item.leadTime,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));
    
    await db.collection('supplierStockLevels').bulkWrite(operations);
  } catch (error) {
    console.error(`Error updating stock cache for supplier ${supplierId}:`, error);
  }
}