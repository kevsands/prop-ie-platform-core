// src/app/api/test-postgresql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

/**
 * Simple PostgreSQL test endpoint
 */
export async function GET(request: NextRequest) {
  try {
    const pool = new Pool({
      host: 'localhost',
      port: 5432,
      database: 'propie_dev',
      user: 'postgres',
      password: 'postgres',
      ssl: false,
    });

    const result = await pool.query(`
      SELECT 
        id, 
        email, 
        first_name, 
        last_name, 
        roles, 
        status,
        created_at
      FROM users 
      WHERE deleted_at IS NULL 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    await pool.end();

    return NextResponse.json({
      success: true,
      message: 'PostgreSQL connection successful',
      users: result.rows,
      connectionInfo: {
        database: 'propie_dev',
        host: 'localhost',
        port: 5432,
        userCount: result.rows.length
      }
    });

  } catch (error: any) {
    console.error('PostgreSQL test error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'PostgreSQL connection failed', 
        details: error.message 
      },
      { status: 500 }
    );
  }
}