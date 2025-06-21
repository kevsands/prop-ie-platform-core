import { getPool, query, transaction, prisma } from './connection';
import { getMigrationManager } from './migrations';
import { userDb } from './operations/userDb';
import { developmentDb } from './operations/developmentDb';
import { unitDb } from './operations/unitDb';
import { documentDb } from './operations/documentDb';
import * as mappers from './mappers';

// Export database interface
export {
  // Connection and utilities
  getPool,
  query,
  transaction,
  prisma,

  // Database operations
  userDb,
  developmentDb,
  unitDb,
  documentDb,

  // Mappers for data conversion
  mappers,

  // Migration manager
  getMigrationManager
};

// Initialize migrations on startup (if in server environment)
if (typeof window === 'undefined') {
  import('./migrations').then(({ getMigrationManager }) => {
    const pool = getPool();
    const migrationManager = getMigrationManager(pool);

    // Apply migrations
    migrationManager.runMigrations()
      .then(appliedMigrations => {
        if (appliedMigrations.length > 0) {
          console.log(`Applied ${appliedMigrations.length} database migrations`);
        }

        // Only generate seed data in development environment
        if (process.env.NODE_ENV === 'development') {
          return migrationManager.generateSeedData();
        }
      })
      .catch(error => {
        console.error('Migration error:', error);
      });
  }).catch(error => {
    console.error('Failed to initialize database migrations:', error);
  });
}

// Default export
export default {
  getPool,
  query,
  transaction,
  prisma,
  userDb,
  developmentDb,
  unitDb
};