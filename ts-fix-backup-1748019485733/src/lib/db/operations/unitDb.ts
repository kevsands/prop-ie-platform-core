import { query } from '../connection';

/**
 * Unit database operations
 */
export const unitDb = {
  /**
   * Get unit by ID
   * @param id Unit ID
   * @returns Unit or null if not found
   */
  async getById(id: string): Promise<any> {
    const result = await query(`
      SELECT u.*, d.* 
      FROM units u
      LEFT JOIN developments d ON u.development_id = d.id
      WHERE u.id = $1
    `, [id]);

    return result.rows[0] || null;
  },

  /**
   * Get units by development ID
   * @param developmentId Development ID
   * @param filters Additional filters
   * @returns Array of units
   */
  async getByDevelopment(developmentId: string, filters?: any): Promise<any[]> {
    let whereClause = 'u.development_id = $1';
    const params: any[] = [developmentId];
    let paramIndex = 2;

    if (filters) {
      if (filters.status) {
        whereClause += ` AND u.status = $${paramIndex++}`;
        params.push(filters.status);
      }

      if (filters.type) {
        whereClause += ` AND u.type = $${paramIndex++}`;
        params.push(filters.type);
      }

      if (filters.minBedrooms !== undefined) {
        whereClause += ` AND u.bedrooms>= $${paramIndex++}`;
        params.push(filters.minBedrooms);
      }

      if (filters.maxBedrooms !== undefined) {
        whereClause += ` AND u.bedrooms <= $${paramIndex++}`;
        params.push(filters.maxBedrooms);
      }

      if (filters.isAvailable) {
        whereClause += ` AND u.status IN ('AVAILABLE', 'UNDER_CONSTRUCTION')`;
      }
    }

    const result = await query(`
      SELECT u.*, d.name AS development_name
      FROM units u
      LEFT JOIN developments d ON u.development_id = d.id
      WHERE ${whereClause}
      ORDER BY u.unit_number ASC
    `, params);

    return result.rows;
  },

  /**
   * List units with filtering
   * @param options Filter options including development ID, status, etc.
   * @returns List of units with pagination info
   */
  async list(options: any = {}): Promise<{units: any[], totalCount: number}> {
    const { 
      developmentId, status, type, minBedrooms, maxBedrooms, 
      minPrice, maxPrice, limit = 20, offset = 0 
    } = options;

    let whereClause = '1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (developmentId) {
      whereClause += ` AND u.development_id = $${paramIndex++}`;
      params.push(developmentId);
    }

    if (status) {
      whereClause += ` AND u.status = $${paramIndex++}`;
      params.push(status);
    }

    if (type) {
      whereClause += ` AND u.type = $${paramIndex++}`;
      params.push(type);
    }

    if (minBedrooms !== undefined) {
      whereClause += ` AND u.bedrooms>= $${paramIndex++}`;
      params.push(minBedrooms);
    }

    if (maxBedrooms !== undefined) {
      whereClause += ` AND u.bedrooms <= $${paramIndex++}`;
      params.push(maxBedrooms);
    }

    if (minPrice !== undefined) {
      whereClause += ` AND u.current_price>= $${paramIndex++}`;
      params.push(minPrice);
    }

    if (maxPrice !== undefined) {
      whereClause += ` AND u.current_price <= $${paramIndex++}`;
      params.push(maxPrice);
    }

    // Count total matching units
    const countResult = await query(`
      SELECT COUNT(*) AS total
      FROM units u
      WHERE ${whereClause}
    `, params);

    const totalCount = parseInt(countResult.rows[0]?.total || '0');

    // Get units with pagination
    params.push(limit);
    params.push(offset);

    const result = await query(`
      SELECT u.*, d.name as development_name, d.id as development_id
      FROM units u
      LEFT JOIN developments d ON u.development_id = d.id
      WHERE ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, params);

    return {
      units: result.rows,
      totalCount
    };
  },

  /**
   * Create a new unit
   * @param unitData Unit data
   * @returns Created unit
   */
  async create(unitData: any): Promise<any> {
    const { 
      development_id, name, unit_number, description, type, status,
      floor_number, bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
      parking_spaces, base_price, current_price, deposit_amount, deposit_percentage,
      floor_plan_url, main_image_url, gallery_images, features, energy_rating,
      is_featured, is_customizable, customization_deadline
    } = unitData;

    const result = await query(`
      INSERT INTO units (
        development_id, name, unit_number, description, type, status,
        floor_number, bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
        parking_spaces, base_price, current_price, deposit_amount, deposit_percentage,
        floor_plan_url, main_image_url, gallery_images, features, energy_rating,
        is_featured, is_customizable, customization_deadline
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24, $25
      ) RETURNING *
    `, [
      development_id, name, unit_number, description, type, status,
      floor_number, bedrooms, bathrooms, total_area, indoor_area, outdoor_area,
      parking_spaces, base_price, current_price, deposit_amount, deposit_percentage,
      floor_plan_url, main_image_url, gallery_images, features, energy_rating,
      is_featured, is_customizable, customization_deadline
    ]);

    return result.rows[0];
  },

  /**
   * Update a unit
   * @param id Unit ID
   * @param unitData Unit data to update
   * @returns Updated unit
   */
  async update(id: string, unitData: any): Promise<any> {
    const keys = Object.keys(unitData);
    const values = Object.values(unitData);

    if (keys.length === 0) {
      return this.getById(id);
    }

    const setClause = keys.map((keyi) => `${key} = $${i + 2}`).join(', ');
    const queryText = `UPDATE units SET ${setClause} WHERE id = $1 RETURNING *`;

    const result = await query(queryText, [id, ...values]);
    return result.rows[0];
  },

  /**
   * Get rooms for a unit
   * @param unitId Unit ID
   * @returns Array of rooms
   */
  async getRooms(unitId: string): Promise<any[]> {
    const result = await query(
      'SELECT * FROM unit_rooms WHERE unit_id = $1',
      [unitId]
    );

    return result.rows;
  },

  /**
   * Get customization options for a unit
   * @param unitId Unit ID
   * @param categoryFilter Optional category filter
   * @returns Array of customization options
   */
  async getCustomizationOptions(unitId: string, categoryFilter?: string): Promise<any[]> {
    let queryText = 'SELECT * FROM unit_customization_options WHERE unit_id = $1';
    const params = [unitId];

    if (categoryFilter) {
      queryText += ' AND category = $2';
      params.push(categoryFilter);
    }

    queryText += ' ORDER BY category, name';

    const result = await query(queryTextparams);
    return result.rows;
  }
};

export default unitDb;