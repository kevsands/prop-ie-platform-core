const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = colors.green) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, colors.cyan);
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✓ ${description} completed`, colors.green);
  } catch (error) {
    log(`✗ ${description} failed`, colors.red);
    console.error(error);
    process.exit(1);
  }
}

async function setupDatabase() {
  log('\n🚀 Setting up Prop.ie database...', colors.bright + colors.magenta);

  // Check if .env exists
  if (!fs.existsSync('.env')) {
    log('\n⚠️  .env file not found. Creating from .env.example...', colors.yellow);
    fs.copyFileSync('.env.example', '.env');
    log('✓ .env file created. Please update it with your database credentials.', colors.green);
    process.exit(0);
  }

  // Generate Prisma client
  runCommand(
    'npx prisma generate --schema=./prisma/schema-slp.prisma',
    'Generating Prisma client'
  );

  // Create database if it doesn't exist
  log('\nCreating database (if it doesn\'t exist)...', colors.cyan);
  const dbUrl = process.env.DATABASE_URL || '';
  const dbName = dbUrl.split('/').pop()?.split('?')[0] || 'prop_ie_db';
  
  try {
    // This will create the database if it doesn't exist
    execSync(`createdb ${dbName}`, { stdio: 'ignore' });
    log(`✓ Database '${dbName}' created or already exists`, colors.green);
  } catch (error) {
    // Database might already exist, which is fine
    log(`Database '${dbName}' already exists`, colors.yellow);
  }

  // Run migrations
  runCommand(
    'npx prisma migrate dev --schema=./prisma/schema-slp.prisma --name initial_setup',
    'Running database migrations'
  );

  // Seed the database with initial data
  log('\nSeeding database with initial data...', colors.cyan);
  runCommand(
    'node scripts/seed-database.js',
    'Seeding database'
  );

  log('\n✅ Database setup completed successfully!', colors.bright + colors.green);
  log('\nNext steps:', colors.bright);
  log('1. Update your .env file with your database credentials', colors.yellow);
  log('2. Run "npm run dev" to start the development server', colors.yellow);
  log('3. Visit http://localhost:3000 to see the application', colors.yellow);
}

// Run the setup
setupDatabase().catch(error => {
  log('\n❌ Database setup failed:', colors.red);
  console.error(error);
  process.exit(1);
});
