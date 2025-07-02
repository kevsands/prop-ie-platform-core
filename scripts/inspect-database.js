#!/usr/bin/env node

/**
 * Inspect PostgreSQL Database Structure
 * 
 * This script connects to PostgreSQL and shows the actual table structure
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');

async function inspectDatabase() {
  console.log('🔍 Inspecting PostgreSQL database structure...');
  console.log('📋 DATABASE_URL:', process.env.DATABASE_URL);
  
  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Test connection
    const client = await pool.connect();
    console.log('✅ Connected to PostgreSQL successfully');

    // Get all tables
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    console.log('\n📊 Tables in database:');
    tablesResult.rows.forEach(row => {
      console.log(`   • ${row.table_name}`);
    });

    // If users table exists, show its structure
    const userTableExists = tablesResult.rows.some(row => row.table_name === 'users');
    
    if (userTableExists) {
      console.log('\n🧑‍💼 Users table structure:');
      const columnsResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `);

      columnsResult.rows.forEach(row => {
        console.log(`   • ${row.column_name} (${row.data_type}) ${row.is_nullable === 'NO' ? 'NOT NULL' : 'NULLABLE'} ${row.column_default ? `DEFAULT ${row.column_default}` : ''}`);
      });

      // Show some sample data
      const sampleResult = await client.query('SELECT * FROM users LIMIT 3');
      console.log(`\n📋 Sample users (${sampleResult.rows.length} rows):`);
      sampleResult.rows.forEach((row, index) => {
        console.log(`   ${index + 1}. ${row.email || row.id} - ${JSON.stringify(row).substring(0, 100)}...`);
      });
    } else {
      console.log('\n❌ Users table does not exist');
    }

    client.release();
  } catch (error) {
    console.error('❌ Database inspection failed:', error.message);
  } finally {
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  inspectDatabase()
    .then(() => {
      console.log('\n🚀 Database inspection completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { inspectDatabase };