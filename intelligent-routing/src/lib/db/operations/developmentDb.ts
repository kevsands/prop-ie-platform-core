import { query, transaction } from '../connection';

/**
 * Development database operations
 */
export const developmentDb = {
  /**
   * Get development by ID
   * @param id Development ID
   * @returns Development or null if not found
   */
  async getById(id: string): Promise<any> {
    const result = await query(`
      SELECT d.*, l.* 
      FROM developments d
      LEFT JOIN locations l ON d.location_id = l.id
      WHERE d.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  },
  
  /**
   * Get developments with filters
   * @param filters Filter options
   * @param limit Maximum number of results
   * @param offset Pagination offset
   * @returns Array of developments
   */
  async getAll(filters: any = {}, limit = 20, offset = 0): Promise<any[]> {
    let whereClause = '1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (filters.developer_id || filters.developerId) {
      whereClause += ` AND d.developer_id = $${paramIndex++}`;
      params.push(filters.developer_id || filters.developerId);
    }
    
    if (filters.status) {
      whereClause += ` AND d.status = $${paramIndex++}`;
      params.push(filters.status);
    }
    
    if (filters.name) {
      whereClause += ` AND d.name ILIKE $${paramIndex++}`;
      params.push(`%${filters.name}%`);
    }
    
    params.push(limit);
    params.push(offset);
    
    const result = await query(`
      SELECT d.*, l.*
      FROM developments d
      LEFT JOIN locations l ON d.location_id = l.id
      WHERE ${whereClause}
      ORDER BY d.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `, params);
    
    return result.rows;
  },
  
  /**
   * Create a new development
   * @param developmentData Development data
   * @returns Created development
   */
  async create(developmentData: any): Promise<any> {
    return transaction(async (client) => {
      // Create location if provided
      let locationId = null;
      if (developmentData.location) {
        const locationResult = await client.query(`
          INSERT INTO locations (
            address_line_1, address_line_2, city, county, state, postal_code, country
          ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        `, [
          developmentData.location.address_line_1,
          developmentData.location.address_line_2,
          developmentData.location.city,
          developmentData.location.county,
          developmentData.location.state,
          developmentData.location.postal_code,
          developmentData.location.country
        ]);
        
        locationId = locationResult.rows[0].id;
      }
      
      // Create development
      const { 
        name, code, description, status, developer_id, 
        total_units, available_units, build_start_date, build_end_date,
        sales_start_date, estimated_completion_date
      } = developmentData;
      
      const developmentResult = await client.query(`
        INSERT INTO developments (
          name, code, description, status, developer_id, location_id,
          total_units, available_units, build_start_date, build_end_date,
          sales_start_date, estimated_completion_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *
      `, [
        name, code, description, status, developer_id, locationId,
        total_units, available_units, build_start_date, build_end_date,
        sales_start_date, estimated_completion_date
      ]);
      
      return developmentResult.rows[0];
    });
  },
  
  /**
   * Update a development
   * @param id Development ID
   * @param developmentData Development data to update
   * @returns Updated development
   */
  async update(id: string, developmentData: any): Promise<any> {
    return transaction(async (client) => {
      // Update location if provided
      if (developmentData.location) {
        const development = await this.getById(id);
        if (development.location_id) {
          // Update existing location
          const locationKeys = Object.keys(developmentData.location);
          const locationValues = Object.values(developmentData.location);
          
          if (locationKeys.length > 0) {
            const setClause = locationKeys.map((key, i) => `${key} = $${i + 2}`).join(', ');
            await client.query(
              `UPDATE locations SET ${setClause} WHERE id = $1`,
              [development.location_id, ...locationValues]
            );
          }
        } else if (Object.keys(developmentData.location).length > 0) {
          // Create new location
          const locationResult = await client.query(`
            INSERT INTO locations (
              address_line_1, address_line_2, city, county, state, postal_code, country
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
          `, [
            developmentData.location.address_line_1,
            developmentData.location.address_line_2,
            developmentData.location.city,
            developmentData.location.county,
            developmentData.location.state,
            developmentData.location.postal_code,
            developmentData.location.country
          ]);
          
          developmentData.location_id = locationResult.rows[0].id;
        }
        
        // Remove location from developmentData to avoid duplication
        delete developmentData.location;
      }
      
      // Update development
      const keys = Object.keys(developmentData);
      const values = Object.values(developmentData);
      
      if (keys.length === 0) {
        return this.getById(id);
      }
      
      const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
      const queryText = `UPDATE developments SET ${setClause} WHERE id = $1 RETURNING *`;
      
      const result = await client.query(queryText, [id, ...values]);
      return result.rows[0];
    });
  },
  
  /**
   * Get development timelines
   * @param developmentId Development ID
   * @returns Array of timelines
   */
  async getTimelines(developmentId: string): Promise<any[]> {
    const result = await query(
      'SELECT * FROM development_timelines WHERE development_id = $1 ORDER BY start_date ASC',
      [developmentId]
    );
    
    return result.rows;
  }
};

export default developmentDb;