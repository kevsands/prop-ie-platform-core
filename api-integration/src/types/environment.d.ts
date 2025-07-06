// Create a types/environment.d.ts file for environment variables
declare namespace NodeJS {
    interface ProcessEnv {
      USE_KAFKA: string;
      KAFKA_HOSTS: string;
      SERVICE_NAME: string;
      PROPERTY_SERVICE_URL: string;
      SERVICE_API_KEY: string;
      INTERNAL_API_URL: string;
      // Add other environment variables used in your application
    }
  }
  
  // Fix MongoDB client usage in src/lib/mongodb.ts
  import { MongoClient } from 'mongodb';
  
  let client: MongoClient | null = null;
  
  export async function connectToDatabase() {
    if (client) return client;
    
    try {
      // Use the static connect method
      client = await MongoClient.connect(process.env.MONGODB_URI || '');
      return client;
    } catch (error) {
      console.error('Failed to connect to database', error);
      throw error;
    }
  }
  
  export async function getDatabase() {
    const client = await connectToDatabase();
    return client.db(process.env.MONGODB_DB || 'propertydev');
  }
  
  export async function closeDatabase() {
    if (client) {
      await client.close();
      client = null;
    }
  }