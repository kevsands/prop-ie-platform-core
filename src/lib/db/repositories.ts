import { query, transaction } from './connection';
import { userDb } from './operations/userDb';
import { developmentDb } from './operations/developmentDb';
import { unitDb } from './operations/unitDb';
import * as mappers from './mappers';
import { userCache, developmentCache, unitCache, salesCache, documentCache, financeCache } from './cache';
import { logger } from '../security/auditLogger';
import {
  User,
  Development,
  Unit,
  Sale,
  Document,
  DevelopmentFinance,
  Budget,
  CashFlow,
  CustomizationOption,
  CustomizationSelection,
  Transaction,
  PaginatedResult,
  DevelopmentFilter,
  UnitFilter,
  SaleFilter,
  DocumentFilter,
  TransactionFilter
} from './types';

// Import the DocumentRepository and FinancialRepository directly from their files
import { DocumentRepository } from './repositories/document-repository';
import { FinancialRepository } from './repositories/financial-repository';

import { z } from 'zod'; // Add zod for runtime type validation
import { sanitizeSqlIdentifier, sanitizeSqlValue, sanitizeSqlQuery } from '../security/sqlSanitizer';
import { rateLimiter } from '../security/rateLimiter';
import { logAuditEvent } from '../security/auditLogger';

// Add these utility functions at the top of the file after imports
const VALID_TABLE_NAMES = new Set([
  'users',
  'developments',
  'units',
  'sales',
  'documents',
  'finance',
  'transactions',
  'customizations',
  'rooms'
]);

function validateTableName(tableName: string): void {
  if (!VALID_TABLE_NAMES.has(tableName)) {
    throw new Error(`Invalid table name: ${tableName}`);
  }
}

function validateColumnName(columnName: string): void {
  // Only allow alphanumeric characters and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(columnName)) {
    throw new Error(`Invalid column name: ${columnName}`);
  }
}

function validateColumnNames(columnNames: string[]): void {
  columnNames.forEach(validateColumnName);
}

// Add input validation schemas
const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10)
});

const idSchema = z.string().uuid();

// Add query sanitization function
function sanitizeQuery(query: string, params: any[]): { query: string; params: any[] } {
  // Remove comments
  query = query.replace(/--.*$/gm, '');
  
  // Remove multiple spaces
  query = query.replace(/\s+/g, ' ').trim();
  
  // Ensure parameters are properly escaped
  params = params.map(param => {
    if (typeof param === 'string') {
      return sanitizeSqlIdentifier(param);
    }
    return param;
  });

  return { query, params };
}

// Add rate limiting configuration
const RATE_LIMITS = {
  findById: { max: 100, windowMs: 60000 }, // 100 requests per minute
  findAll: { max: 50, windowMs: 60000 },   // 50 requests per minute
  create: { max: 20, windowMs: 60000 },    // 20 requests per minute
  update: { max: 20, windowMs: 60000 },    // 20 requests per minute
  delete: { max: 10, windowMs: 60000 }     // 10 requests per minute
};

/**
 * Repository pattern implementation for PropIE AWS database
 * Provides type-safe, domain-specific database access with caching
 */

/**
 * Base repository class with common CRUD operations
 */
export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  protected abstract cacheNamespace: string;
  protected abstract mapToEntity(row: Record<string, unknown>): T;
  protected abstract mapToDatabaseRecord(entity: T): any;

  protected async validateTableName(): Promise<void> {
    const sanitized = sanitizeSqlIdentifier(this.tableName);
    if (sanitized !== this.tableName) {
      throw new Error(`Invalid table name: ${this.tableName}`);
    }
  }

  protected async validateInput<T>(schema: z.ZodSchema<T>, data: unknown): Promise<T> {
    try {
      return await schema.parseAsync(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  protected async checkRateLimit(operation: keyof typeof RATE_LIMITS, userId: string): Promise<void> {
    const { max, windowMs } = RATE_LIMITS[operation];
    const key = `${this.tableName}:${operation}:${userId}`;
    
    const allowed = await rateLimiter.check(keymaxwindowMs);
    if (!allowed) {
      throw new Error(`Rate limit exceeded for ${operation} operation`);
    }
  }

  /**
   * Find entity by ID
   * @param id Entity ID
   * @returns Entity or null if not found
   */
  async findById(id: string, userId: string): Promise<T | null> {
    await this.validateTableName();
    await this.validateInput(idSchemaid);
    await this.checkRateLimit('findById', userId);

    const query = sanitizeSqlQuery(`
      SELECT * FROM ${sanitizeSqlIdentifier(this.tableName)}
      WHERE id = ${sanitizeSqlValue(id)}
      LIMIT 1
    `);

    const result = await query(query);
    const row = result.rows[0];

    if (!row) {
      return null;
    }

    logAuditEvent('findById', this.tableName, userId, 'success', { id });
    return this.mapToEntity(row);
  }

  /**
   * Find all entities with optional pagination
   * @param page Page number (1-based)
   * @param pageSize Number of items per page
   * @returns Paginated result with entities
   */
  async findAll(userId: string, options: { page?: number; limit?: number } = {}): Promise<T[]> {
    await this.validateTableName();
    const { page, limit } = await this.validateInput(paginationSchemaoptions);
    await this.checkRateLimit('findAll', userId);

    const offset = (page - 1) * limit;
    const query = sanitizeSqlQuery(`
      SELECT * FROM ${sanitizeSqlIdentifier(this.tableName)}
      ORDER BY created_at DESC
      LIMIT ${sanitizeSqlValue(limit)}
      OFFSET ${sanitizeSqlValue(offset)}
    `);

    const result = await query(query);
    const rows = result.rows;

    logAuditEvent('findAll', this.tableName, userId, 'success', { page, limit });
    return rows.map(row => this.mapToEntity(row));
  }

  /**
   * Create a new entity
   * @param entity Entity to create
   * @returns Created entity
   */
  async create(data: Partial<T>, userId: string): Promise<T> {
    await this.validateTableName();
    await this.checkRateLimit('create', userId);

    const columns = Object.keys(data);
    const values = Object.values(data);

    const query = sanitizeSqlQuery(`
      INSERT INTO ${sanitizeSqlIdentifier(this.tableName)}
      (${columns.map(col => sanitizeSqlIdentifier(col)).join(', ')})
      VALUES (${values.map(val => sanitizeSqlValue(val)).join(', ')})
      RETURNING *
    `);

    const result = await query(query);
    const row = result.rows[0];

    logAuditEvent('create', this.tableName, userId, 'success', { data });
    return this.mapToEntity(row);
  }

  /**
   * Update an entity
   * @param id Entity ID
   * @param entity Entity data to update
   * @returns Updated entity
   */
  async update(id: string, data: Partial<T>, userId: string): Promise<T> {
    await this.validateTableName();
    await this.validateInput(idSchemaid);
    await this.checkRateLimit('update', userId);

    const updates = Object.entries(data)
      .map(([keyvalue]) => `${sanitizeSqlIdentifier(key)} = ${sanitizeSqlValue(value)}`)
      .join(', ');

    const query = sanitizeSqlQuery(`
      UPDATE ${sanitizeSqlIdentifier(this.tableName)}
      SET ${updates}
      WHERE id = ${sanitizeSqlValue(id)}
      RETURNING *
    `);

    const result = await query(query);
    const row = result.rows[0];

    if (!row) {
      throw new Error(`Entity not found with id: ${id}`);
    }

    logAuditEvent('update', this.tableName, userId, 'success', { id, data });
    return this.mapToEntity(row);
  }

  /**
   * Delete an entity
   * @param id Entity ID
   * @returns True if entity was deleted, false if not found
   */
  async delete(id: string, userId: string): Promise<void> {
    await this.validateTableName();
    await this.validateInput(idSchemaid);
    await this.checkRateLimit('delete', userId);

    const query = sanitizeSqlQuery(`
      DELETE FROM ${sanitizeSqlIdentifier(this.tableName)}
      WHERE id = ${sanitizeSqlValue(id)}
    `);

    const result = await query(query);

    if (result.rowCount === 0) {
      throw new Error(`Entity not found with id: ${id}`);
    }

    logAuditEvent('delete', this.tableName, userId, 'success', { id });
  }

  /**
   * Invalidate cache for an entity
   * @param id Entity ID
   */
  protected invalidateCache(id: string): void {
    let cache: any;

    switch (this.cacheNamespace) {
      case 'users': cache = userCache; break;
      case 'developments': cache = developmentCache; break;
      case 'units': cache = unitCache; break;
      case 'sales': cache = salesCache; break;
      case 'documents': cache = documentCache; break;
      case 'finance': cache = financeCache; break;
      default: return;
    }

    if (cache) {
      const cacheKey = `${this.cacheNamespace}:id:${id}`;
      cache.invalidate(cacheKey, []);
    }
  }
}

/**
 * User repository for managing user data
 */
class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';
  protected cacheNamespace = 'users';

  /**
   * Map database user record to User entity
   * @param dbRecord Database user record
   * @returns User entity
   */
  protected mapToEntity(dbRecord: any): User {
    return mappers.mapUser(dbRecord);
  }

  /**
   * Map User entity to database record
   * @param user User entity
   * @returns Database user record
   */
  protected mapToDatabaseRecord(user: User): any {
    return mappers.mapUserToDb(user);
  }

  /**
   * Find user by email
   * @param email User email
   * @returns User or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    await this.checkRateLimit('findById', email);
    
    // Validate email format
    const validatedEmail = await this.validateInput(z.string().email(), email);

    const cacheKey = `${this.cacheNamespace}:email:${validatedEmail}`;
    const cached = userCache.get<User>(cacheKey, []);

    if (cached) {
      return cached;
    }

    try {
      const dbUser = await userDb.getByEmail(validatedEmail);

      if (!dbUser) {
        return null;
      }

      const user = this.mapToEntity(dbUser);

      // Store in cache
      userCache.set(cacheKey, [], user);

      return user;
    } catch (error) {
      logAuditEvent('findByEmail', this.tableName, email, 'error', { error });
      throw error;
    }
  }

  /**
   * Get user permissions
   * @param userId User ID
   * @returns Array of permission names
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const cacheKey = `${this.cacheNamespace}:permissions:${userId}`;
    const cached = userCache.get<string[]>(cacheKey, []);

    if (cached) {
      return cached;
    }

    try {
      const permissions = await userDb.getPermissions(userId);

      // Store in cache
      userCache.set(cacheKey, [], permissions);

      return permissions;
    } catch (error) {
      logAuditEvent('getUserPermissions', this.tableName, userId, 'error', { error });
      throw error;
    }
  }

  /**
   * Invalidate user permissions cache
   * @param userId User ID
   */
  invalidatePermissionsCache(userId: string): void {
    const cacheKey = `${this.cacheNamespace}:permissions:${userId}`;
    userCache.invalidate(cacheKey, []);
  }
}

/**
 * Development repository for managing development data
 */
class DevelopmentRepository extends BaseRepository<Development> {
  protected tableName = 'developments';
  protected cacheNamespace = 'developments';

  /**
   * Map database development record to Development entity
   * @param dbRecord Database development record
   * @returns Development entity
   */
  protected mapToEntity(dbRecord: any): Development {
    return mappers.mapDevelopment(dbRecord);
  }

  /**
   * Map Development entity to database record
   * @param development Development entity
   * @returns Database development record
   */
  protected mapToDatabaseRecord(development: Development): any {
    return mappers.mapDevelopmentToDb(development);
  }

  /**
   * Find developments with filtering
   * @param filters Development filters
   * @param page Page number (1-based)
   * @param pageSize Number of items per page
   * @returns Paginated result with developments
   */
  async findByFilters(filters: DevelopmentFilter, page: number = 1, pageSize: number = 20): Promise<PaginatedResult<Development>> {
    try {
      const filteredDevelopments = await developmentDb.getAll(filters, pageSize, (page - 1) * pageSize);

      // Get total count with the same filters
      const countQuery = await query(
        'SELECT COUNT(*) FROM developments WHERE developer_id = $1 OR status = $2 OR name ILIKE $3',
        [
          filters.developerId || '',
          filters.status || '',
          filters.name ? `%${filters.name}%` : ''
        ]
      );

      const total = parseInt(countQuery.rows[0].count);
      const totalPages = Math.ceil(total / pageSize);

      const developments = filteredDevelopments.map(dev => this.mapToEntity(dev));

      return {
        items: developments,
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      logAuditEvent('findByFilters', this.tableName, filters, 'error', { error });
      throw error;
    }
  }

  /**
   * Find developments by developer ID
   * @param developerId Developer user ID
   * @returns Array of developments
   */
  async findByDeveloperId(developerId: string): Promise<Development[]> {
    const cacheKey = `${this.cacheNamespace}:developer:${developerId}`;
    const cached = developmentCache.get<Development[]>(cacheKey, []);

    if (cached) {
      return cached;
    }

    try {
      const developments = await developmentDb.getAll({ developerId });

      const mappedDevelopments = developments.map(dev => this.mapToEntity(dev));

      // Store in cache
      developmentCache.set(cacheKey, [], mappedDevelopments);

      return mappedDevelopments;
    } catch (error) {
      logAuditEvent('findByDeveloperId', this.tableName, developerId, 'error', { error });
      throw error;
    }
  }

  /**
   * Get development timelines
   * @param developmentId Development ID
   * @returns Array of timeline objects
   */
  async getTimelines(developmentId: string): Promise<any[]> {
    const cacheKey = `${this.cacheNamespace}:timelines:${developmentId}`;
    const cached = developmentCache.get<any[]>(cacheKey, []);

    if (cached) {
      return cached;
    }

    try {
      const timelines = await developmentDb.getTimelines(developmentId);

      // Store in cache
      developmentCache.set(cacheKey, [], timelines);

      return timelines;
    } catch (error) {
      logAuditEvent('getTimelines', this.tableName, developmentId, 'error', { error });
      throw error;
    }
  }
}

/**
 * Unit repository for managing unit data
 */
class UnitRepository extends BaseRepository<Unit> {
  protected tableName = 'units';
  protected cacheNamespace = 'units';

  /**
   * Map database unit record to Unit entity
   * @param dbRecord Database unit record
   * @returns Unit entity
   */
  protected mapToEntity(dbRecord: any): Unit {
    return mappers.mapUnit(dbRecord);
  }

  /**
   * Map Unit entity to database record
   * @param unit Unit entity
   * @returns Database unit record
   */
  protected mapToDatabaseRecord(unit: Unit): any {
    return mappers.mapUnitToDb(unit);
  }

  /**
   * Find units by development ID
   * @param developmentId Development ID
   * @param filters Unit filters
   * @returns Array of units
   */
  async findByDevelopment(developmentId: string, filters?: UnitFilter): Promise<Unit[]> {
    this.validateTableName();
    try {
      const result = await query(
        'SELECT * FROM ?? WHERE development_id = $1',
        [this.tableNamedevelopmentId]
      );
      return result.rows.map((row: Record<string, unknown>) => this.mapToEntity(row));
    } catch (error) {
      logAuditEvent('findByDevelopment', this.tableName, { developmentId, filters }, 'error', { error });
      throw error;
    }
  }

  /**
   * Get rooms for a unit
   * @param unitId Unit ID
   * @returns Array of room objects
   */
  async getRooms(unitId: string): Promise<any[]> {
    const cacheKey = `${this.cacheNamespace}:rooms:${unitId}`;
    const cached = unitCache.get<any[]>(cacheKey, []);

    if (cached) {
      return cached;
    }

    try {
      const rooms = await unitDb.getRooms(unitId);

      // Store in cache
      unitCache.set(cacheKey, [], rooms);

      return rooms;
    } catch (error) {
      logAuditEvent('getRooms', this.tableName, unitId, 'error', { error });
      throw error;
    }
  }

  /**
   * Get customization options for a unit
   * @param unitId Unit ID
   * @param categoryFilter Optional category filter
   * @returns Array of customization options
   */
  async getCustomizationOptions(unitId: string, categoryFilter?: string): Promise<CustomizationOption[]> {
    this.validateTableName();
    try {
      const result = await query(
        'SELECT * FROM customizations WHERE unit_id = $1 AND ($2::text IS NULL OR category = $2)',
        [unitIdcategoryFilter]
      );
      return result.rows.map((row: Record<string, unknown>) => this.mapToEntity(row));
    } catch (error) {
      logAuditEvent('getCustomizationOptions', this.tableName, { unitId, categoryFilter }, 'error', { error });
      throw error;
    }
  }
}

// Create singleton instances
export const userRepository = new UserRepository();
export const developmentRepository = new DevelopmentRepository();
export const unitRepository = new UnitRepository();
export const documentRepository = new DocumentRepository();
export const financialRepository = new FinancialRepository();

// Export repository classes
export {
  BaseRepository,
  UserRepository,
  DevelopmentRepository,
  UnitRepository,
  DocumentRepository,
  FinancialRepository
};

// Export default with all repository instances
export default {
  userRepository,
  developmentRepository,
  unitRepository,
  documentRepository,
  financialRepository
};