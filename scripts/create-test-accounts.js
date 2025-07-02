#!/usr/bin/env node

/**
 * Create Test Accounts in PostgreSQL Database
 * 
 * This script creates 16 Luke test accounts with different roles
 * for testing the authentication system with PostgreSQL.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create PostgreSQL connection pool  
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// All the roles we want to create test accounts for
const testRoles = [
  'buyer',
  'developer', 
  'agent',
  'solicitor',
  'admin',
  'investor',
  'architect',
  'engineer',
  'contractor',
  'project_manager',
  'quantity_surveyor',
  'mortgage_broker',
  'financial_advisor',
  'insurance_broker',
  'surveyor',
  'valuer',
  'property_manager'
];

async function createTestAccounts() {
  console.log('🚀 Creating Luke test accounts in PostgreSQL database...');
  
  const client = await pool.connect();
  
  try {
    // Hash the password once
    const hashedPassword = await bcrypt.hash('test12345', 12);
    console.log('🔐 Password hashed successfully');

    const createdAccounts = [];

    for (const role of testRoles) {
      const email = `luke@${role}.com`;
      
      try {
        // Check if user already exists
        const existingResult = await client.query(
          'SELECT id, email FROM users WHERE email = $1',
          [email.toLowerCase()]
        );

        if (existingResult.rows.length > 0) {
          console.log(`⚠️  User ${email} already exists, skipping...`);
          continue;
        }

        // Create the user using the actual database schema
        const insertResult = await client.query(`
          INSERT INTO users (
            cognito_user_id, email, first_name, last_name, 
            password_hash, status, roles, 
            created_at, updated_at, last_active_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), NOW()
          ) RETURNING id, email, first_name, last_name, roles
        `, [
          `luke-${role}-${Date.now()}`, // cognito_user_id (required)
          email.toLowerCase(),
          'Luke',
          role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
          hashedPassword,
          'active', // Use lowercase status as per enum
          `{${role}}`, // PostgreSQL array format
        ]);

        const user = insertResult.rows[0];
        
        createdAccounts.push({
          id: user.id,
          email: user.email,
          role: role,
          firstName: user.first_name,
          lastName: user.last_name
        });

        console.log(`✅ Created user: ${email} (Role: ${role})`);

      } catch (userError) {
        console.error(`❌ Error creating user ${email}:`, userError.message);
      }
    }

    console.log('\n🎉 Test account creation completed!');
    console.log(`✅ Successfully created ${createdAccounts.length} accounts`);
    
    console.log('\n📋 Created Accounts Summary:');
    createdAccounts.forEach(account => {
      console.log(`   • ${account.email} - ${account.firstName} ${account.lastName} (${account.role})`);
    });

    console.log('\n🔑 Login Details:');
    console.log('   Email: luke@[role].com (e.g., luke@buyer.com)');
    console.log('   Password: test12345');
    console.log('   Database: PostgreSQL at localhost:5555 (Prisma Studio)');

    // Test database connection
    const countResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n📊 Total users in database: ${countResult.rows[0].count}`);

  } catch (error) {
    console.error('💥 Fatal error creating test accounts:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  createTestAccounts()
    .then(() => {
      console.log('\n🚀 Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createTestAccounts };