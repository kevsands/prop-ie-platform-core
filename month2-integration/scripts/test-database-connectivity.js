#!/usr/bin/env node

/**
 * Database Connectivity Test Script
 * Tests Prisma database connection and basic operations
 */

const { PrismaClient } = require('@prisma/client');
const chalk = require('chalk');

class DatabaseTester {
  constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn']
    });
    this.results = {
      passed: [],
      failed: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red
    };
    console.log(colors[type](`[${type.toUpperCase()}] ${message}`));
  }

  async test(name, testFn) {
    try {
      await testFn();
      this.results.passed.push(name);
      this.log(`${name} - PASSED`, 'success');
    } catch (error) {
      this.results.failed.push({ name, error: error.message });
      this.log(`${name} - FAILED: ${error.message}`, 'error');
    }
  }

  async testConnection() {
    await this.test('Database Connection', async () => {
      const result = await this.prisma.$queryRaw`SELECT 1 as test`;
      if (!result || result.length === 0) {
        throw new Error('Failed to execute test query');
      }
      this.log('Database connection successful', 'info');
    });
  }

  async testUserModel() {
    await this.test('User Model', async () => {
      const userCount = await this.prisma.user.count();
      this.log(`Found ${userCount} users in database`, 'info');
      
      // Test user query
      const users = await this.prisma.user.findMany({
        take: 5,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true
        }
      });
      
      this.log(`Retrieved ${users.length} users`, 'info');
    });
  }

  async testDevelopmentModel() {
    await this.test('Development Model', async () => {
      const developmentCount = await this.prisma.development.count();
      this.log(`Found ${developmentCount} developments in database`, 'info');
    });
  }

  async testProjectModel() {
    await this.test('Project Model', async () => {
      const projectCount = await this.prisma.project.count();
      this.log(`Found ${projectCount} projects in database`, 'info');
    });
  }

  async testTransaction() {
    await this.test('Database Transaction', async () => {
      // Test a transaction without actually committing
      await this.prisma.$transaction(async (tx) => {
        const testUser = await tx.user.create({
          data: {
            email: `test-transaction-${Date.now()}@example.com`,
            firstName: 'Test',
            lastName: 'Transaction',
            roles: ['BUYER']
          }
        });
        
        this.log(`Created test user in transaction: ${testUser.id}`, 'info');
        
        // Rollback by throwing an error
        throw new Error('Intentional rollback - transaction test successful');
      }).catch(error => {
        if (error.message.includes('Intentional rollback')) {
          this.log('Transaction rollback successful', 'info');
        } else {
          throw error;
        }
      });
    });
  }

  async testSchemaValidation() {
    await this.test('Schema Validation', async () => {
      // Test required fields
      try {
        await this.prisma.user.create({
          data: {} // Missing required fields
        });
        throw new Error('Schema validation should have failed');
      } catch (error) {
        if (error.code === 'P2002' || error.code === 'P2003' || error.message.includes('required')) {
          this.log('Schema validation working correctly', 'info');
        } else {
          throw error;
        }
      }
    });
  }

  async run() {
    console.log(chalk.bold('\n🗄️  Database Connectivity Test\n'));
    
    try {
      await this.testConnection();
      await this.testUserModel();
      await this.testDevelopmentModel();
      await this.testProjectModel();
      await this.testTransaction();
      await this.testSchemaValidation();
    } catch (error) {
      this.log(`Critical error: ${error.message}`, 'error');
    } finally {
      await this.prisma.$disconnect();
    }

    // Results summary
    console.log(chalk.bold('\n📊 Test Results\n'));
    
    console.log(chalk.green(`✅ Passed: ${this.results.passed.length}`));
    this.results.passed.forEach(test => {
      console.log(chalk.green(`   ✓ ${test}`));
    });

    if (this.results.failed.length > 0) {
      console.log(chalk.red(`\n❌ Failed: ${this.results.failed.length}`));
      this.results.failed.forEach(({ name, error }) => {
        console.log(chalk.red(`   ✗ ${name}: ${error}`));
      });
    }

    const total = this.results.passed.length + this.results.failed.length;
    const successRate = (this.results.passed.length / total * 100).toFixed(1);
    
    console.log(chalk.bold(`\n📈 Success Rate: ${successRate}%\n`));

    process.exit(this.results.failed.length > 0 ? 1 : 0);
  }
}

// Main execution
async function main() {
  console.log(chalk.gray('Checking environment...'));
  
  if (!process.env.DATABASE_URL) {
    console.error(chalk.red('\n❌ DATABASE_URL environment variable not set\n'));
    console.log(chalk.yellow('Set DATABASE_URL to your PostgreSQL connection string:'));
    console.log(chalk.gray('export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"'));
    process.exit(1);
  }

  const tester = new DatabaseTester();
  await tester.run();
}

// Command line options
if (process.argv.includes('--help')) {
  console.log(chalk.bold('Database Connectivity Test'));
  console.log('\nUsage: node test-database-connectivity.js');
  console.log('\nThis script tests Prisma database connectivity and basic operations.');
  console.log('\nRequired Environment Variables:');
  console.log('  DATABASE_URL - PostgreSQL connection string');
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`\n❌ Unhandled error: ${error.message}\n`));
  process.exit(1);
});