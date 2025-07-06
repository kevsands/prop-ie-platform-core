import { query } from '../connection';

/**
 * User database operations
 */
export const userDb = {
  /**
   * Get user by ID
   * @param id User ID
   * @returns User or null if not found
   */
  async getById(id: string): Promise<any> {
    const result = await query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0] || null;
  },
  
  /**
   * Get user by email
   * @param email User email
   * @returns User or null if not found
   */
  async getByEmail(email: string): Promise<any> {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0] || null;
  },
  
  /**
   * Create a new user
   * @param userData User data
   * @returns Created user
   */
  async create(userData: any): Promise<any> {
    const { email, first_name, last_name, phone, role, status } = userData;
    
    const result = await query(
      'INSERT INTO users (email, first_name, last_name, phone, role, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [email, first_name, last_name, phone, role, status]
    );
    
    return result.rows[0];
  },
  
  /**
   * Update a user
   * @param id User ID
   * @param userData User data to update
   * @returns Updated user
   */
  async update(id: string, userData: any): Promise<any> {
    const keys = Object.keys(userData);
    const values = Object.values(userData);
    
    if (keys.length === 0) {
      return this.getById(id);
    }
    
    const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
    const queryText = `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`;
    
    const result = await query(queryText, [id, ...values]);
    return result.rows[0];
  },
  
  /**
   * Get user permissions
   * @param userId User ID
   * @returns Array of permissions
   */
  async getPermissions(userId: string): Promise<string[]> {
    // Get role-based permissions
    const roleResult = await query(`
      SELECT p.name 
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN users u ON rp.role = u.role
      WHERE u.id = $1
    `, [userId]);
    
    const rolePermissions = roleResult.rows.map(row => row.name);
    
    // Get user-specific permission overrides
    const userResult = await query(`
      SELECT p.name, up.granted
      FROM permissions p
      JOIN user_permissions up ON p.id = up.permission_id
      WHERE up.user_id = $1
    `, [userId]);
    
    // Apply overrides (add granted permissions, remove non-granted)
    const userPermissions = new Set(rolePermissions);
    for (const row of userResult.rows) {
      if (row.granted) {
        userPermissions.add(row.name);
      } else {
        userPermissions.delete(row.name);
      }
    }
    
    return Array.from(userPermissions);
  },
  
  /**
   * List users with filtering and pagination
   * @param options Filter options
   * @returns List of users with pagination info
   */
  async list(options: any = {}): Promise<{users: any[], totalCount: number}> {
    const { 
      status, role, search, limit = 20, offset = 0
    } = options;
    
    let whereClause = '1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (status) {
      whereClause += ` AND status = $${paramIndex++}`;
      params.push(status);
    }
    
    if (role) {
      whereClause += ` AND role = $${paramIndex++}`;
      params.push(role);
    }
    
    if (search) {
      whereClause += ` AND (
        email ILIKE $${paramIndex} OR
        first_name ILIKE $${paramIndex} OR
        last_name ILIKE $${paramIndex}
      )`;
      // Use the same search term for all three conditions
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    // Count total matching users
    const countResult = await query(`
      SELECT COUNT(*) AS total
      FROM users
      WHERE ${whereClause}
    `, params);
    
    const totalCount = parseInt(countResult.rows[0]?.total || '0');
    
    // Get users with pagination
    params.push(limit);
    params.push(offset);
    
    const result = await query(`
      SELECT *
      FROM users
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, params);
    
    return {
      users: result.rows,
      totalCount
    };
  }
};

export default userDb;