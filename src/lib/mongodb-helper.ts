// src/lib/mongodb-helper.ts
import { MongoClient, Db, Collection, ObjectId } from 'mongodb';

/**
 * Base document interface for MongoDB documents
 */
export interface IDocument {
  _id?: string | ObjectId;
  [key: string]: unknown;
}

/**
 * MongoDB Query type
 */
export type MongoQuery<T> = Record<string, any>
  );
/**
 * MongoDB Update type
 */
export type MongoUpdate<T> = Record<string, any> | Partial<T>
  );
/**
 * MongoDB Operation type for bulk writes
 */
export interface MongoBulkOperation {
  insertOne?: { document: unknown };
  updateOne?: { 
    filter: Record<string, any>
  );
    update: Record<string, any>
  );
    upsert?: boolean;
  };
  deleteOne?: { filter: Record<string, any> };
  replaceOne?: {
    filter: Record<string, any>
  );
    replacement: unknown;
    upsert?: boolean;
  };
}

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'property_db';

// Connection cache
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/**
 * Connect to MongoDB
 */
export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  // If we have cached connections, return them
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Otherwise, create new connections
  const client = await MongoClient.connect(uri);
  const db = client.db(dbName);

  // Cache connections
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

/**
 * Get a MongoDB collection
 */
export async function getCollection<T extends IDocument>(
  collectionName: string
): Promise<Collection<T>> {
  const { db } = await connectToDatabase();
  return db.collection<T>(collectionName);
}

/**
 * Close MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

/**
 * Type-safe wrapper for common MongoDB operations
 */
export const mongodb = {
  // Get all documents from a collection
  findAll: async <T extends IDocument>(
    collectionName: string, 
    query: MongoQuery<T> = {}
  ): Promise<T[]> => {
    const collection = await getCollection<T>(collectionName);
    return collection.find(query).toArray();
  },

  // Get a single document from a collection
  findOne: async <T extends IDocument>(
    collectionName: string, 
    query: MongoQuery<T> = {}
  ): Promise<T | null> => {
    const collection = await getCollection<T>(collectionName);
    return collection.findOne(query);
  },

  // Insert a document into a collection
  insertOne: async <T extends IDocument>(
    collectionName: string, 
    document: Omit<T, '_id'>
  ): Promise<T> => {
    const collection = await getCollection<T>(collectionName);
    const result = await collection.insertOne(document as unknown as T);
    return { ...document, _id: result.insertedId } as T;
  },

  // Update a document in a collection
  updateOne: async <T extends IDocument>(
    collectionName: string, 
    query: MongoQuery<T>, 
    update: MongoUpdate<T>
  ): Promise<T | null> => {
    const collection = await getCollection<T>(collectionName);

    // Ensure update has $set if it's a direct object update
    const updateDoc = update && !Object.keys(update).some(k => k.startsWith('$'))
      ? { $set: update }
      : update;

    const result = await collection.findOneAndUpdate(
      query,
      updateDoc as any,
      { returnDocument: 'after' } as any
    );

    return result as T | null;
  },

  // Delete a document from a collection
  deleteOne: async <T extends IDocument>(
    collectionName: string, 
    query: MongoQuery<T>
  ): Promise<boolean> => {
    const collection = await getCollection<T>(collectionName);
    const result = await collection.deleteOne(query as any);
    return result.deletedCount === 1;
  },

  // Perform an aggregation
  aggregate: async <T extends IDocument, R = T>(
    collectionName: string, 
    pipeline: object[]
  ): Promise<R[]> => {
    const collection = await getCollection<T>(collectionName);
    return collection.aggregate<R>(pipeline).toArray();
  },

  // Perform a bulk write operation
  bulkWrite: async <T extends IDocument>(
    collectionName: string, 
    operations: MongoBulkOperation[]
  ): Promise<{
    insertedCount: number;
    matchedCount: number;
    modifiedCount: number;
    deletedCount: number;
    upsertedCount: number;
    upsertedIds: { [key: number]: ObjectId };
  }> => {
    const collection = await getCollection<T>(collectionName);
    const result = await collection.bulkWrite(operations as any);

    return {
      insertedCount: result.insertedCount,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      deletedCount: result.deletedCount,
      upsertedCount: result.upsertedCount,
      upsertedIds: result.upsertedIds
    };
  }
};

export default mongodb;