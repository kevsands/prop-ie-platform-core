/**
 * Database Connection Module
 * Provides connection to database and Prisma client
 */

import { PrismaClient } from '@prisma/client';
import { Pool, PoolClient } from 'pg';

// Create a PrismaClient instance
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: getConnectionUrl()
      }
    }
  });
};

// Avoid instantiating multiple instances of PrismaClient in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Singleton pool instance for legacy code
let pool: Pool | null = null;

/**
 * Get PostgreSQL connection URL from environment variables
 */
function getConnectionUrl(): string {
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const database = process.env.POSTGRES_DB || 'propie_test';
  const user = process.env.POSTGRES_USER || 'postgres';
  const password = process.env.POSTGRES_PASSWORD || 'postgres';
  const ssl = process.env.POSTGRES_SSL === 'true';

  let url = `postgresql://${user}:${password}@${host}:${port}/${database}`;
  if (ssl) {
    url += '?sslmode=require';
  }
  return url;
}

/**
 * Gets a database connection pool
 * @deprecated Use prisma client instead 
 */
export function getPool(): Pool {
  console.warn('Connection pool usage is deprecated, use Prisma client instead');
  
  if (!pool) {
    pool = new Pool({
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      database: process.env.POSTGRES_DB || 'propie_test',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      max: parseInt(process.env.POSTGRES_POOL_MAX || '5', 10),
      idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '10000', 10),
      connectionTimeoutMillis: parseInt(process.env.POSTGRES_CONNECT_TIMEOUT || '1000', 10),
      ssl: process.env.POSTGRES_SSL === 'true' ? { rejectUnauthorized: false } : undefined
    });
  }

  return pool;
}

/**
 * Executes a database query
 * @deprecated Use prisma client instead
 */
export async function query(queryText: string, params: any[] = []): Promise<any> {
  console.warn('Direct query usage is deprecated, use Prisma client instead');
  
  const pool = getPool();
  
  // Retry on connection errors
  let retries = 3;
  let lastError: any;
  
  while (retries > 0) {
    try {
      const result = await pool.query(queryText, params);
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Only retry on connection errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        retries--;
        // Wait 100ms before retrying
        await new Promise(resolve => setTimeout(resolve, 100));
      } else {
        throw error;
      }
    }
  }
  
  throw lastError;
}

/**
 * Executes a database transaction
 * @deprecated Use prisma.$transaction instead
 */
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  console.warn('Direct transaction usage is deprecated, use Prisma.$transaction instead');
  
  const pool = getPool();
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default {
  prisma,
  query,
  transaction,
  getPool
};