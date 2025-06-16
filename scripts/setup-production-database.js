#!/usr/bin/env node

/**
 * Production Database Setup Script
 * Sets up AWS RDS PostgreSQL for production deployment
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execPromise(command, options = {}) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  try {
    // Check if Prisma CLI is available
    await execPromise('npx prisma --version');
    log('✅ Prisma CLI is available', 'green');
    
    // Check if Node.js version is compatible
    const nodeVersion = process.version;
    log(`✅ Node.js version: ${nodeVersion}`, 'green');
    
    // Check if environment files exist
    const prodEnvPath = path.join(process.cwd(), '.env.production');
    if (fs.existsSync(prodEnvPath)) {
      log('✅ Production environment file found', 'green');
    } else {
      throw new Error('Production environment file (.env.production) not found');
    }
    
    // Check if schema file exists
    const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');
    if (fs.existsSync(schemaPath)) {
      log('✅ Prisma schema file found', 'green');
    } else {
      throw new Error('Prisma schema file not found');
    }
    
    return true;
  } catch (error) {
    log(`❌ Prerequisite check failed: ${error.message}`, 'red');
    return false;
  }
}

async function validateDatabaseConnection() {
  log('🔗 Validating database connection...', 'blue');
  
  try {
    // Test database connection using Prisma
    const { stdout } = await execPromise('npx prisma db pull --preview-feature --force');
    log('✅ Database connection validated', 'green');
    return true;
  } catch (error) {
    log('❌ Database connection failed:', 'red');
    log(`Error: ${error.stderr || error.error?.message}`, 'red');
    
    // Provide helpful troubleshooting tips
    log('\n💡 Troubleshooting tips:', 'yellow');
    log('1. Verify your DATABASE_URL in .env.production', 'yellow');
    log('2. Ensure your AWS RDS instance is running and accessible', 'yellow');
    log('3. Check security group settings allow connections on port 5432', 'yellow');
    log('4. Verify your database credentials are correct', 'yellow');
    
    return false;
  }
}

async function runMigrations() {
  log('🚀 Running database migrations...', 'blue');
  
  try {
    // Deploy migrations to production database
    const { stdout } = await execPromise('npx prisma migrate deploy');
    log('✅ Database migrations completed successfully', 'green');
    log(stdout, 'cyan');
    return true;
  } catch (error) {
    log('❌ Migration failed:', 'red');
    log(`Error: ${error.stderr || error.error?.message}`, 'red');
    return false;
  }
}

async function generatePrismaClient() {
  log('🔧 Generating Prisma client...', 'blue');
  
  try {
    const { stdout } = await execPromise('npx prisma generate');
    log('✅ Prisma client generated successfully', 'green');
    return true;
  } catch (error) {
    log('❌ Prisma client generation failed:', 'red');
    log(`Error: ${error.stderr || error.error?.message}`, 'red');
    return false;
  }
}

async function seedDatabase() {
  log('🌱 Seeding database (optional)...', 'blue');
  
  const seedPath = path.join(process.cwd(), 'prisma', 'seed.ts');
  if (!fs.existsSync(seedPath)) {
    log('⚠️  No seed file found, skipping database seeding', 'yellow');
    return true;
  }
  
  try {
    const { stdout } = await execPromise('npx prisma db seed');
    log('✅ Database seeded successfully', 'green');
    return true;
  } catch (error) {
    log('⚠️  Database seeding failed (this is optional):', 'yellow');
    log(`Error: ${error.stderr || error.error?.message}`, 'yellow');
    return true; // Don't fail the whole process for seeding
  }
}

async function verifySetup() {
  log('✅ Verifying database setup...', 'blue');
  
  try {
    // Run a simple query to verify everything works
    const testScript = `
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      async function test() {
        try {
          await prisma.$connect();
          const result = await prisma.$queryRaw\`SELECT 1 as test\`;
          console.log('Database connection successful');
          await prisma.$disconnect();
          process.exit(0);
        } catch (error) {
          console.error('Database test failed:', error);
          process.exit(1);
        }
      }
      
      test();
    `;
    
    fs.writeFileSync('/tmp/db-test.js', testScript);
    await execPromise('node /tmp/db-test.js');
    
    log('✅ Database setup verification completed', 'green');
    return true;
  } catch (error) {
    log('❌ Database setup verification failed:', 'red');
    log(`Error: ${error.stderr || error.error?.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🚀 Starting Production Database Setup', 'magenta');
  log('=====================================', 'magenta');
  
  const steps = [
    { name: 'Prerequisites Check', fn: checkPrerequisites },
    { name: 'Database Connection Validation', fn: validateDatabaseConnection },
    { name: 'Prisma Client Generation', fn: generatePrismaClient },
    { name: 'Database Migrations', fn: runMigrations },
    { name: 'Database Seeding', fn: seedDatabase },
    { name: 'Setup Verification', fn: verifySetup }
  ];
  
  let allSuccessful = true;
  
  for (const step of steps) {
    log(`\n📋 ${step.name}`, 'cyan');
    log('─'.repeat(50), 'cyan');
    
    const success = await step.fn();
    if (!success) {
      allSuccessful = false;
      if (step.name !== 'Database Seeding') { // Seeding is optional
        log(`\n❌ Setup failed at: ${step.name}`, 'red');
        process.exit(1);
      }
    }
  }
  
  if (allSuccessful) {
    log('\n🎉 Production database setup completed successfully!', 'green');
    log('=====================================', 'green');
    log('\n📋 Next steps:', 'blue');
    log('1. Update your production DATABASE_URL with real credentials', 'blue');
    log('2. Configure AWS RDS security groups for your application', 'blue');
    log('3. Set up database monitoring and backups', 'blue');
    log('4. Test your application with the production database', 'blue');
  } else {
    log('\n⚠️  Setup completed with warnings', 'yellow');
  }
}

// Handle CLI arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  log('Production Database Setup Script', 'blue');
  log('Usage: node scripts/setup-production-database.js [options]', 'blue');
  log('\nOptions:', 'blue');
  log('  --help, -h    Show this help message', 'blue');
  log('  --skip-seed   Skip database seeding step', 'blue');
  process.exit(0);
}

// Run the main setup process
main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});