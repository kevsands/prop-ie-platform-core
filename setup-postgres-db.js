#!/usr/bin/env node

const { Client } = require('pg');

async function createDatabases() {
  // Connect to default postgres database first
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');

    // Create main database
    try {
      await client.query('CREATE DATABASE prop_ie_db');
      console.log('✅ Created database: prop_ie_db');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('Database prop_ie_db already exists');
      } else {
        throw error;
      }
    }

    // Create shadow database
    try {
      await client.query('CREATE DATABASE prop_ie_db_shadow');
      console.log('✅ Created database: prop_ie_db_shadow');
    } catch (error) {
      if (error.code === '42P04') {
        console.log('Database prop_ie_db_shadow already exists');
      } else {
        throw error;
      }
    }

    console.log('\n✨ PostgreSQL databases ready!');
    console.log('Make sure to update your DATABASE_URL in .env.local:');
    console.log('DATABASE_URL=postgresql://postgres:password@localhost:5432/prop_ie_db');
    console.log('SHADOW_DATABASE_URL=postgresql://postgres:password@localhost:5432/prop_ie_db_shadow');
    
  } catch (error) {
    console.error('Error setting up databases:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabases();