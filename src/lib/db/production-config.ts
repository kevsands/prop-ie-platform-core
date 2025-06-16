/**
 * Production Database Configuration
 * Optimized settings for AWS RDS PostgreSQL in production
 */

export interface ProductionDatabaseConfig {
  url: string;
  shadowUrl?: string;
  connectionLimit: number;
  connectionTimeout: number;
  idleTimeout: number;
  ssl: boolean;
  poolMin: number;
  poolMax: number;
}

/**
 * Get production database configuration from environment
 */
export function getProductionDatabaseConfig(): ProductionDatabaseConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Validate required production environment variables
  if (isProduction) {
    const requiredVars = ['DATABASE_URL'];
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length> 0) {
      throw new Error(`Missing required production environment variables: ${missing.join(', ')}`);
    }
  }

  return {
    url: process.env.DATABASE_URL || 'postgresql://postgres@localhost:5432/prop_ie_db',
    shadowUrl: process.env.SHADOW_DATABASE_URL,
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '100', 10),
    connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT || '10000', 10),
    idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    ssl: process.env.DB_SSL === 'true' || isProduction,
    poolMin: parseInt(process.env.DB_POOL_MIN || '5', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '20', 10)
  };
}

/**
 * Get optimized Prisma client configuration for production
 */
export function getPrismaConfig() {
  const config = getProductionDatabaseConfig();
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    log: isProduction ? ['error'] : ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: config.url
      }
    },
    // Connection pool settings for production
    __internal: {
      engine: {
        endpoint: config.url,
        requestTimeout: config.connectionTimeout
      }
    }
  };
}

/**
 * Validate database connection health
 */
export async function validateDatabaseConnection() {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient(getPrismaConfig());
  
  try {
    // Test basic connection
    await prisma.$connect();
    
    // Test query execution
    await prisma.$queryRaw`SELECT 1 as test`;
    
    console.log('✅ Database connection validated successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection validation failed:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Production database configuration for AWS RDS
 */
export const AWS_RDS_CONFIG = {
  // Recommended settings for AWS RDS PostgreSQL
  statement_timeout: '30s',
  idle_in_transaction_session_timeout: '5min',
  log_min_duration_statement: '1s',
  
  // Connection settings
  max_connections: 100,
  shared_preload_libraries: 'pg_stat_statements',
  
  // Performance settings
  effective_cache_size: '3GB',
  shared_buffers: '1GB',
  maintenance_work_mem: '256MB',
  checkpoint_completion_target: 0.9,
  wal_buffers: '16MB',
  default_statistics_target: 100,
  random_page_cost: 1.1,
  effective_io_concurrency: 200
};