#!/usr/bin/env node

/**
 * Create Remaining Test Accounts
 * 
 * This script creates the remaining Luke test accounts with valid roles and email formats
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// Create PostgreSQL connection pool  
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Additional roles that exist in the database
const additionalRoles = [
  { role: 'project_manager', email: 'luke@projectmanager.com', displayName: 'Project Manager' },
  { role: 'quantity_surveyor', email: 'luke@quantitysurveyor.com', displayName: 'Quantity Surveyor' },
  { role: 'legal', email: 'luke@legal.com', displayName: 'Legal' }
];

async function createRemainingAccounts() {
  console.log('🚀 Creating remaining Luke test accounts...');
  
  const client = await pool.connect();
  
  try {
    // Hash the password once
    const hashedPassword = await bcrypt.hash('test12345', 12);
    console.log('🔐 Password hashed successfully');

    const createdAccounts = [];

    for (const roleInfo of additionalRoles) {
      const { role, email, displayName } = roleInfo;
      
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
          displayName,
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

    console.log('\n🎉 Additional account creation completed!');
    console.log(`✅ Successfully created ${createdAccounts.length} additional accounts`);
    
    if (createdAccounts.length > 0) {
      console.log('\n📋 Additional Created Accounts:');
      createdAccounts.forEach(account => {
        console.log(`   • ${account.email} - ${account.firstName} ${account.lastName} (${account.role})`);
      });
    }

    // Test database connection and show total
    const countResult = await client.query('SELECT COUNT(*) as count FROM users');
    console.log(`\n📊 Total users in database: ${countResult.rows[0].count}`);

    // Show all Luke accounts
    const lukeResult = await client.query(`
      SELECT email, first_name, last_name, roles 
      FROM users 
      WHERE email LIKE 'luke@%' 
      ORDER BY email
    `);
    
    console.log(`\n👤 All Luke test accounts (${lukeResult.rows.length} total):`);
    lukeResult.rows.forEach(user => {
      console.log(`   • ${user.email} - ${user.first_name} ${user.last_name} (${user.roles[0]})`);
    });

  } catch (error) {
    console.error('💥 Fatal error creating additional accounts:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the script
if (require.main === module) {
  createRemainingAccounts()
    .then(() => {
      console.log('\n🚀 Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createRemainingAccounts };