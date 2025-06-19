/**
 * Production User Service with AWS Cognito Integration
 * 
 * This service provides real user management operations using AWS Cognito
 * as the authentication provider and the database for user profile data.
 * 
 * Features:
 * - AWS Cognito user pool integration
 * - Role-based access control
 * - KYC status management
 * - User preferences and metadata
 * - Database-backed user profiles
 */

import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import { User, UserRole, UserStatus, KYCStatus, UserPreferences, UserSummary } from '@/types/core/user';
import { AuthUser } from '@/types/amplify/auth';
import sqlite3 from 'sqlite3';
import { join } from 'path';

const { Database } = sqlite3;

// Database connection
const dbPath = join(process.cwd(), 'dev.db');

/**
 * Initialize users table if it doesn't exist
 */
const initUsersTable = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const db = new Database(dbPath);
    
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        cognitoUserId TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        phone TEXT,
        roles TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        kycStatus TEXT NOT NULL DEFAULT 'not_started',
        organization TEXT,
        position TEXT,
        avatar TEXT,
        preferences TEXT,
        metadata TEXT,
        created TEXT NOT NULL,
        lastActive TEXT NOT NULL,
        lastLogin TEXT,
        updatedAt TEXT NOT NULL
      )
    `, (err) => {
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
 * Input types for user operations
 */
export interface CreateUserInput {
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
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  roles?: UserRole[];
  status?: UserStatus;
  kycStatus?: KYCStatus;
  organization?: string;
  position?: string;
  avatar?: string;
  preferences?: UserPreferences;
  metadata?: Record<string, any>;
}

/**
 * Production User Service
 */
export const userService = {
  /**
   * Get current authenticated user with enhanced profile data
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // In development mode with mock auth, return mock user
      if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
        return {
          id: 'dev-user-123',
          email: 'dev@prop.ie',
          firstName: 'Development',
          lastName: 'User',
          phone: '+353 1 234 5678',
          roles: [UserRole.DEVELOPER, UserRole.ADMIN],
          status: UserStatus.ACTIVE,
          kycStatus: KYCStatus.APPROVED,
          organization: 'PROP.ie Development',
          position: 'Full Stack Developer',
          avatar: '/images/avatars/dev-user.png',
          preferences: {
            notifications: { email: true, sms: false, push: true },
            theme: 'dark',
            language: 'en',
            timezone: 'Europe/Dublin'
          },
          created: new Date('2024-01-01'),
          lastActive: new Date(),
          lastLogin: new Date(),
          metadata: { source: 'development', version: '1.0' }
        };
      }

      // Get Cognito user
      const cognitoUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (!cognitoUser.userId) {
        return null;
      }

      // Get user profile from database
      const dbUser = await userService.getUserByCognitoId(cognitoUser.userId);
      
      if (!dbUser) {
        // User exists in Cognito but not in our database
        // This might happen during migration or if there's a sync issue
        console.warn(`User ${cognitoUser.userId} exists in Cognito but not in database`);
        return null;
      }

      // Update last active timestamp
      await userService.updateLastActive(dbUser.id);

      return dbUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      
      // In development, fallback to mock user to keep development flowing
      if (process.env.NODE_ENV === 'development') {
        return {
          id: 'fallback-user-123',
          email: 'fallback@prop.ie',
          firstName: 'Fallback',
          lastName: 'User',
          phone: '+353 1 234 5678',
          roles: [UserRole.BUYER],
          status: UserStatus.ACTIVE,
          kycStatus: KYCStatus.NOT_STARTED,
          created: new Date(),
          lastActive: new Date(),
          preferences: {
            notifications: { email: true, sms: false, push: true },
            theme: 'light',
            language: 'en',
            timezone: 'Europe/Dublin'
          }
        };
      }
      
      return null;
    }
  },

  /**
   * Get user by Cognito user ID
   */
  getUserByCognitoId: async (cognitoUserId: string): Promise<User | null> => {
    await initUsersTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get(
        'SELECT * FROM users WHERE cognitoUserId = ?',
        [cognitoUserId],
        (err, row: any) => {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          resolve(userService.mapRowToUser(row));
        }
      );
    });
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User | null> => {
    await initUsersTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get(
        'SELECT * FROM users WHERE id = ?',
        [id],
        (err, row: any) => {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          resolve(userService.mapRowToUser(row));
        }
      );
    });
  },

  /**
   * Get user by email
   */
  getUserByEmail: async (email: string): Promise<User | null> => {
    await initUsersTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row: any) => {
          db.close();
          
          if (err) {
            reject(err);
            return;
          }

          if (!row) {
            resolve(null);
            return;
          }

          resolve(userService.mapRowToUser(row));
        }
      );
    });
  },

  /**
   * Get all users with optional filtering
   */
  getUsers: async (filters?: {
    role?: UserRole;
    status?: UserStatus;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    users: User[];
    total: number;
  }> => {
    await initUsersTable();
    
    let whereClause = '';
    let params: any[] = [];
    
    if (filters) {
      const conditions: string[] = [];
      
      if (filters.role) {
        conditions.push('roles LIKE ?');
        params.push(`%"${filters.role}"%`);
      }
      
      if (filters.status) {
        conditions.push('status = ?');
        params.push(filters.status);
      }
      
      if (filters.search) {
        conditions.push('(firstName LIKE ? OR lastName LIKE ? OR email LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }
      
      if (conditions.length > 0) {
        whereClause = ' WHERE ' + conditions.join(' AND ');
      }
    }

    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      // Get total count
      db.get(
        `SELECT COUNT(*) as total FROM users${whereClause}`,
        params,
        (err, countRow: any) => {
          if (err) {
            db.close();
            reject(err);
            return;
          }

          const total = countRow.total;
          
          // Get paginated results
          let query = `SELECT * FROM users${whereClause} ORDER BY created DESC`;
          
          if (filters?.limit) {
            query += ` LIMIT ${filters.limit}`;
            if (filters?.offset) {
              query += ` OFFSET ${filters.offset}`;
            }
          }
          
          db.all(query, params, (err, rows: any[]) => {
            db.close();
            
            if (err) {
              reject(err);
              return;
            }

            const users = rows.map(row => userService.mapRowToUser(row));
            resolve({ users, total });
          });
        }
      );
    });
  },

  /**
   * Create a new user (called after Cognito registration)
   */
  createUser: async (userData: CreateUserInput): Promise<User> => {
    await initUsersTable();
    
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.run(`
        INSERT INTO users (
          id, cognitoUserId, email, firstName, lastName, phone, roles, status, 
          kycStatus, organization, position, preferences, metadata, created, 
          lastActive, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId,
        userData.cognitoUserId,
        userData.email,
        userData.firstName,
        userData.lastName,
        userData.phone || null,
        JSON.stringify(userData.roles),
        UserStatus.PENDING,
        KYCStatus.NOT_STARTED,
        userData.organization || null,
        userData.position || null,
        userData.preferences ? JSON.stringify(userData.preferences) : null,
        userData.metadata ? JSON.stringify(userData.metadata) : null,
        now,
        now,
        now
      ], function(err) {
        if (err) {
          db.close();
          reject(err);
          return;
        }

        // Fetch the created user
        db.get(
          'SELECT * FROM users WHERE id = ?',
          [userId],
          (err, row: any) => {
            db.close();
            
            if (err) {
              reject(err);
              return;
            }

            resolve(userService.mapRowToUser(row));
          }
        );
      });
    });
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, userData: UpdateUserInput): Promise<User | null> => {
    await initUsersTable();
    
    const updateFields: string[] = [];
    const params: any[] = [];
    
    if (userData.firstName !== undefined) {
      updateFields.push('firstName = ?');
      params.push(userData.firstName);
    }
    
    if (userData.lastName !== undefined) {
      updateFields.push('lastName = ?');
      params.push(userData.lastName);
    }
    
    if (userData.phone !== undefined) {
      updateFields.push('phone = ?');
      params.push(userData.phone);
    }
    
    if (userData.roles !== undefined) {
      updateFields.push('roles = ?');
      params.push(JSON.stringify(userData.roles));
    }
    
    if (userData.status !== undefined) {
      updateFields.push('status = ?');
      params.push(userData.status);
    }
    
    if (userData.kycStatus !== undefined) {
      updateFields.push('kycStatus = ?');
      params.push(userData.kycStatus);
    }
    
    if (userData.organization !== undefined) {
      updateFields.push('organization = ?');
      params.push(userData.organization);
    }
    
    if (userData.position !== undefined) {
      updateFields.push('position = ?');
      params.push(userData.position);
    }
    
    if (userData.avatar !== undefined) {
      updateFields.push('avatar = ?');
      params.push(userData.avatar);
    }
    
    if (userData.preferences !== undefined) {
      updateFields.push('preferences = ?');
      params.push(userData.preferences ? JSON.stringify(userData.preferences) : null);
    }
    
    if (userData.metadata !== undefined) {
      updateFields.push('metadata = ?');
      params.push(userData.metadata ? JSON.stringify(userData.metadata) : null);
    }
    
    updateFields.push('updatedAt = ?');
    params.push(new Date().toISOString());
    
    params.push(id); // For WHERE clause
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.run(
        `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`,
        params,
        function(err) {
          if (err) {
            db.close();
            reject(err);
            return;
          }

          if (this.changes === 0) {
            db.close();
            resolve(null);
            return;
          }

          // Fetch the updated user
          db.get(
            'SELECT * FROM users WHERE id = ?',
            [id],
            (err, row: any) => {
              db.close();
              
              if (err) {
                reject(err);
                return;
              }

              resolve(row ? userService.mapRowToUser(row) : null);
            }
          );
        }
      );
    });
  },

  /**
   * Update user's last active timestamp
   */
  updateLastActive: async (id: string): Promise<void> => {
    await initUsersTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.run(
        'UPDATE users SET lastActive = ? WHERE id = ?',
        [new Date().toISOString(), id],
        (err) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  /**
   * Update user's last login timestamp
   */
  updateLastLogin: async (id: string): Promise<void> => {
    await initUsersTable();
    
    return new Promise((resolve, reject) => {
      const db = new Database(dbPath);
      
      db.run(
        'UPDATE users SET lastLogin = ? WHERE id = ?',
        [new Date().toISOString(), id],
        (err) => {
          db.close();
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (role: UserRole): Promise<UserSummary[]> => {
    const { users } = await userService.getUsers({ role });
    
    return users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      avatar: user.avatar,
      roles: user.roles
    }));
  },

  /**
   * Check if user has specific role
   */
  hasRole: async (userId: string, role: UserRole): Promise<boolean> => {
    const user = await userService.getUserById(userId);
    return user ? user.roles.includes(role) : false;
  },

  /**
   * Helper function to map database row to User interface
   */
  mapRowToUser: (row: any): User => {
    return {
      id: row.id,
      email: row.email,
      firstName: row.firstName,
      lastName: row.lastName,
      phone: row.phone,
      roles: JSON.parse(row.roles),
      status: row.status as UserStatus,
      kycStatus: row.kycStatus as KYCStatus,
      organization: row.organization,
      position: row.position,
      avatar: row.avatar,
      preferences: row.preferences ? JSON.parse(row.preferences) : undefined,
      created: new Date(row.created),
      lastActive: new Date(row.lastActive),
      lastLogin: row.lastLogin ? new Date(row.lastLogin) : undefined,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    };
  }
};

export default userService;