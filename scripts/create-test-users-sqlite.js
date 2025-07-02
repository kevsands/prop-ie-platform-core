const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const TEST_USERS = [
  { email: 'luke@buyer.com', role: 'buyer', firstName: 'Luke', lastName: 'Buyer' },
  { email: 'luke@developer.com', role: 'developer', firstName: 'Luke', lastName: 'Developer' },
  { email: 'luke@solicitor.com', role: 'solicitor', firstName: 'Luke', lastName: 'Solicitor' },
  { email: 'luke@agent.com', role: 'agent', firstName: 'Luke', lastName: 'Agent' },
  { email: 'luke@admin.com', role: 'admin', firstName: 'Luke', lastName: 'Admin' },
  { email: 'luke@investor.com', role: 'investor', firstName: 'Luke', lastName: 'Investor' },
  { email: 'luke@architect.com', role: 'architect', firstName: 'Luke', lastName: 'Architect' },
  { email: 'luke@engineer.com', role: 'engineer', firstName: 'Luke', lastName: 'Engineer' },
  { email: 'luke@contractor.com', role: 'contractor', firstName: 'Luke', lastName: 'Contractor' },
  { email: 'luke@project-manager.com', role: 'project_manager', firstName: 'Luke', lastName: 'ProjectManager' },
  { email: 'luke@quantity-surveyor.com', role: 'quantity_surveyor', firstName: 'Luke', lastName: 'QuantitySurveyor' },
  { email: 'luke@mortgage-broker.com', role: 'mortgage_broker', firstName: 'Luke', lastName: 'MortgageBroker' },
  { email: 'luke@financial-advisor.com', role: 'financial_advisor', firstName: 'Luke', lastName: 'FinancialAdvisor' },
  { email: 'luke@surveyor.com', role: 'surveyor', firstName: 'Luke', lastName: 'Surveyor' },
  { email: 'luke@valuer.com', role: 'valuer', firstName: 'Luke', lastName: 'Valuer' },
  { email: 'luke@property-manager.com', role: 'property_manager', firstName: 'Luke', lastName: 'PropertyManager' }
];

const PASSWORD = 'test12345';

async function createTestUsers() {
  console.log('🚀 Creating test user accounts...');
  
  try {
    // Hash the password once
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(PASSWORD, saltRounds);
    console.log('🔐 Password hashed successfully');

    // Connect to SQLite database
    const dbPath = path.join(__dirname, '../prisma/dev.db');
    const db = new sqlite3.Database(dbPath);

    // Wrap database operations in promises
    const dbRun = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
          if (err) reject(err);
          else resolve(this);
        });
      });
    };

    const dbGet = (sql, params) => {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    };

    for (const userData of TEST_USERS) {
      try {
        // Check if user already exists
        const existingUser = await dbGet(
          'SELECT * FROM User WHERE email = ?',
          [userData.email]
        );

        if (existingUser) {
          console.log(`⏭️  User ${userData.email} already exists, skipping...`);
          continue;
        }

        // Create new user
        const userId = randomUUID();
        const now = Date.now();
        
        await dbRun(
          `INSERT INTO User (id, email, firstName, lastName, password, roleData, status, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            userId,
            userData.email,
            userData.firstName,
            userData.lastName,
            hashedPassword,
            JSON.stringify([userData.role]),
            'ACTIVE',
            now,
            now
          ]
        );

        console.log(`✅ Created user: ${userData.email} (${userData.role}) - ID: ${userId}`);
      } catch (userError) {
        console.error(`❌ Failed to create user ${userData.email}:`, userError.message);
      }
    }

    // Close database connection
    db.close();

    console.log('🎉 Test user creation completed!');
    console.log(`📋 All accounts use password: ${PASSWORD}`);
    console.log('\n📝 Test Accounts Created:');
    console.log('────────────────────────────────────────');
    
    TEST_USERS.forEach(user => {
      console.log(`• ${user.email.padEnd(25)} → ${user.role} role`);
    });
    
    console.log('────────────────────────────────────────');
    console.log('🔐 Use these credentials to test the login system');
    
  } catch (error) {
    console.error('❌ Error creating test users:', error);
  }
}

createTestUsers();