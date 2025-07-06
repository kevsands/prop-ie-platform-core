/**
 * PostgreSQL User Service for PROP.ie Authentication
 * 
 * This service connects to the migrated PostgreSQL database and provides
 * authentication functionality compatible with the enterprise schema.
 */

import { Pool } from 'pg';
import { User, UserRole, UserStatus, KYCStatus, UserPreferences } from '@/types/core/user';

// Database connection pool
let pool: Pool | null = null;

/**
 * Initialize PostgreSQL connection pool
 */
function getPool(): Pool {
  if (!pool) {
    const config = {
      host: process.env.PG_HOST || 'localhost',
      port: parseInt(process.env.PG_PORT || '5432'),
      database: process.env.PG_DATABASE || 'propie_dev',
      user: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASSWORD || 'postgres',
      ssl: process.env.PG_SSL === 'true' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
    
    console.log('[PostgreSQL Service] Initializing connection pool with config:', {
      host: config.host,
      port: config.port,
      database: config.database,
      user: config.user,
      ssl: config.ssl
    });
    
    pool = new Pool(config);
  }
  return pool;
}

/**
 * Map PostgreSQL row to User interface
 */
function mapRowToUser(row: any): User {
  // Handle PostgreSQL array format for roles
  let roles: UserRole[] = ['buyer' as UserRole]; // default
  if (row.roles) {
    if (Array.isArray(row.roles)) {
      roles = row.roles;
    } else if (typeof row.roles === 'string') {
      // PostgreSQL returns arrays as strings like "{buyer}" or "{buyer,developer}"
      if (row.roles.startsWith('{') && row.roles.endsWith('}')) {
        const roleString = row.roles.slice(1, -1); // Remove { and }
        roles = roleString.split(',').map(role => role.trim() as UserRole);
      } else {
        try {
          roles = JSON.parse(row.roles);
        } catch (e) {
          roles = [row.roles as UserRole];
        }
      }
    }
  }

  // Handle preferences JSON
  let preferences = {};
  if (row.preferences) {
    if (typeof row.preferences === 'object') {
      preferences = row.preferences;
    } else if (typeof row.preferences === 'string') {
      try {
        preferences = JSON.parse(row.preferences);
      } catch (e) {
        preferences = {};
      }
    }
  }

  // Handle metadata JSON
  let metadata = {};
  if (row.metadata) {
    if (typeof row.metadata === 'object') {
      metadata = row.metadata;
    } else if (typeof row.metadata === 'string') {
      try {
        metadata = JSON.parse(row.metadata);
      } catch (e) {
        metadata = {};
      }
    }
  }

  return {
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    phone: row.phone,
    roles: roles,
    status: row.status as UserStatus,
    kycStatus: row.kyc_status as KYCStatus,
    organization: row.organization,
    position: row.position,
    avatar: row.avatar,
    preferences: preferences,
    created: new Date(row.created_at),
    lastActive: new Date(row.last_active_at),
    lastLogin: row.last_login_at ? new Date(row.last_login_at) : undefined,
    metadata: metadata
  };
}

/**
 * PostgreSQL User Service
 */
export const userServicePostgreSQL = {
  /**
   * Get user by email
   */
  getUserByEmail: async (email: string): Promise<User | null> => {
    const client = getPool();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL',
        [email.toLowerCase().trim()]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    const client = getPool();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL',
        [id]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Get user by Cognito User ID
   */
  getUserByCognitoId: async (cognitoUserId: string): Promise<User | null> => {
    const client = getPool();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE cognito_user_id = $1 AND deleted_at IS NULL',
        [cognitoUserId]
      );
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error getting user by Cognito ID:', error);
      throw new Error('Failed to get user');
    }
  },

  /**
   * Create a new user
   */
  createUser: async (userData: {
    cognitoUserId: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    roles: UserRole[];
    organization?: string;
    position?: string;
    preferences?: UserPreferences;
    metadata?: Record<string, any>;
  }): Promise<User> => {
    const client = getPool();
    
    try {
      const result = await client.query(`
        INSERT INTO users (
          cognito_user_id, email, first_name, last_name, phone,
          roles, status, kyc_status, organization, position,
          preferences, metadata, created_at, updated_at, last_active_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW(), NOW()
        ) RETURNING *
      `, [
        userData.cognitoUserId,
        userData.email.toLowerCase().trim(),
        userData.firstName,
        userData.lastName,
        userData.phone || null,
        userData.roles,
        UserStatus.PENDING,
        KYCStatus.NOT_STARTED,
        userData.organization || null,
        userData.position || null,
        userData.preferences ? JSON.stringify(userData.preferences) : '{}',
        userData.metadata ? JSON.stringify(userData.metadata) : '{}'
      ]);
      
      return mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  },

  /**
   * Update user's last login timestamp
   */
  updateLastLogin: async (id: string): Promise<void> => {
    const client = getPool();
    
    try {
      await client.query(
        'UPDATE users SET last_login_at = NOW(), last_active_at = NOW() WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
      throw new Error('Failed to update last login');
    }
  },

  /**
   * Update user's last active timestamp
   */
  updateLastActive: async (id: string): Promise<void> => {
    const client = getPool();
    
    try {
      await client.query(
        'UPDATE users SET last_active_at = NOW() WHERE id = $1',
        [id]
      );
    } catch (error) {
      console.error('Error updating last active:', error);
      throw new Error('Failed to update last active');
    }
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (role: UserRole): Promise<User[]> => {
    const client = getPool();
    
    try {
      const result = await client.query(
        'SELECT * FROM users WHERE $1 = ANY(roles) AND deleted_at IS NULL ORDER BY created_at DESC',
        [role]
      );
      
      return result.rows.map(mapRowToUser);
    } catch (error) {
      console.error('Error getting users by role:', error);
      throw new Error('Failed to get users by role');
    }
  },

  /**
   * Check if user has specific role
   */
  hasRole: async (userId: string, role: UserRole): Promise<boolean> => {
    const user = await userServicePostgreSQL.getUserById(userId);
    return user ? user.roles.includes(role) : false;
  },

  /**
   * Get all users with filtering
   */
  getUsers: async (filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ users: User[]; total: number }> => {
    const client = getPool();
    
    try {
      let whereClause = 'WHERE deleted_at IS NULL';
      const params: any[] = [];
      let paramIndex = 1;
      
      if (filters) {
        if (filters.role) {
          whereClause += ` AND $${paramIndex} = ANY(roles)`;
          params.push(filters.role);
          paramIndex++;
        }
        
        if (filters.status) {
          whereClause += ` AND status = $${paramIndex}`;
          params.push(filters.status);
          paramIndex++;
        }
        
        if (filters.search) {
          whereClause += ` AND (first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
          params.push(`%${filters.search}%`);
          paramIndex++;
        }
      }
      
      // Get total count
      const countResult = await client.query(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].total);
      
      // Get paginated results
      let query = `SELECT * FROM users ${whereClause} ORDER BY created_at DESC`;
      
      if (filters?.limit) {
        query += ` LIMIT $${paramIndex}`;
        params.push(filters.limit);
        paramIndex++;
        
        if (filters?.offset) {
          query += ` OFFSET $${paramIndex}`;
          params.push(filters.offset);
        }
      }
      
      const result = await client.query(query, params);
      const users = result.rows.map(mapRowToUser);
      
      return { users, total };
    } catch (error) {
      console.error('Error getting users:', error);
      throw new Error('Failed to get users');
    }
  },

  /**
   * Test database connection
   */
  testConnection: async (): Promise<boolean> => {
    const client = getPool();
    
    try {
      const result = await client.query('SELECT NOW() as server_time, COUNT(*) as user_count FROM users WHERE deleted_at IS NULL');
      console.log('PostgreSQL connection test successful:', result.rows[0]);
      return true;
    } catch (error) {
      console.error('PostgreSQL connection test failed:', error);
      return false;
    }
  }
};

export default userServicePostgreSQL;