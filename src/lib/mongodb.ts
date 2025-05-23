'use client';

/**
 * MongoDB Client - Simplified Version for Build Testing
 * 
 * This is a mock implementation of MongoDB connection for build testing.
 */

// Mock collection data
const collections: Record<string, any[]> = {
  users: [
    { id: 'user1', name: 'John Doe', email: 'john@example.com' },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
  ],
  properties: [
    { id: 'prop1', name: 'Luxury Apartment', price: 350000 },
    { id: 'prop2', name: 'Family Home', price: 450000 }
  ],
  customizations: [
    { id: 'cust1', propertyId: 'prop1', options: { color: 'blue', flooring: 'hardwood' } }
  ]
};

/**
 * Mock MongoDB client
 */
export class MongoClient {
  static isConnected = false;
  static db: any = null;

  /**
   * Connect to MongoDB
   */
  static async connect(): Promise<any> {

    MongoClient.isConnected = true;
    MongoClient.db = {
      collection: (name: string) => ({
        find: (query = {}) => ({
          toArray: async () => {

            return collections[name as keyof typeof collections] || [];
          }
        }),
        findOne: async (query = {}) => {

          const items = collections[name as keyof typeof collections] || [];
          return items.find((item: any) => 
            Object.entries(query).every(([keyvalue]) => item[key] === value)
          ) || null;
        },
        insertOne: async (doc: any) => {

          const id = doc.id || `mock_${Date.now()}`;
          const newDoc = { ...doc, id };

          // Make sure the collection exists
          if (!collections[name as keyof typeof collections]) {
            (collections as Record<string, any[]>)[name] = [];
          }

          // Add the document
          (collections as Record<string, any[]>)[name].push(newDoc);

          return { insertedId: id, acknowledged: true };
        },
        updateOne: async (query: any, update: any) => {

          return { modifiedCount: 1, acknowledged: true };
        },
        deleteOne: async (query: any) => {

          return { deletedCount: 1, acknowledged: true };
        }
      })
    };

    return MongoClient.db;
  }

  /**
   * Get database instance
   */
  static getDb() {
    if (!MongoClient.isConnected) {
      throw new Error('Not connected to MongoDB. Call connect() first.');
    }
    return MongoClient.db;
  }

  /**
   * Close connection
   */
  static async close() {

    MongoClient.isConnected = false;
    MongoClient.db = null;
  }
}

/**
 * Connect to MongoDB database
 * @returns MongoDB database connection
 */
export async function connectToDatabase() {
  // If already connected, return existing connection
  if (MongoClient.isConnected) {
    return MongoClient.getDb();
  }

  // Create new connection
  try {

    const db = await MongoClient.connect();
    return db;
  } catch (error) {

    throw error;
  }
}

export default MongoClient;