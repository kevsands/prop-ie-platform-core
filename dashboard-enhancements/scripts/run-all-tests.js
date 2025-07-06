#!/usr/bin/env node

/**
 * Master Test Runner
 * Executes all platform functionality tests
 */

const { spawn } = require('child_process');
const chalk = require('chalk');
const path = require('path');

class TestRunner {
  constructor() {
    this.tests = [
      {
        name: 'Database Connectivity',
        script: 'test-database-connectivity.js',
        description: 'Tests Prisma database connection and models',
        requiresServer: false
      },
      {
        name: 'JWT Tokens',
        script: 'test-jwt-tokens.js',
        description: 'Tests JWT token generation and validation',
        requiresServer: false
      },
      {
        name: 'Core Functionality',
        script: 'test-core-functionality.js',
        description: 'Tests authentication, API routes, and services',
        requiresServer: true
      }
    ];
    this.results = [];
  }

  log(message, type = 'info') {
    const colors = {
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
      header: chalk.bold.cyan
    };
    console.log(colors[type](message));
  }

  async runTest(test) {
    return new Promise((resolve) => {
      this.log(`\n📋 Running: ${test.name}`, 'header');
      this.log(test.description, 'info');
      
      const scriptPath = path.join(__dirname, test.script);
      const child = spawn('node', [scriptPath], {
        env: { ...process.env },
        stdio: 'inherit'
      });

      child.on('exit', (code) => {
        const result = {
          name: test.name,
          success: code === 0,
          exitCode: code
        };
        this.results.push(result);
        
        if (code === 0) {
          this.log(`\n✅ ${test.name} - PASSED`, 'success');
        } else {
          this.log(`\n❌ ${test.name} - FAILED (exit code: ${code})`, 'error');
        }
        
        resolve(result);
      });

      child.on('error', (error) => {
        this.log(`\n❌ ${test.name} - ERROR: ${error.message}`, 'error');
        this.results.push({
          name: test.name,
          success: false,
          error: error.message
        });
        resolve({ success: false });
      });
    });
  }

  async checkPrerequisites() {
    this.log('\n🔍 Checking Prerequisites', 'header');
    
    // Check if server is running (for tests that require it)
    const serverRunning = await this.isServerRunning();
    if (!serverRunning) {
      this.log('Server not running - some tests may be skipped', 'warning');
    }

    // Check database URL
    if (!process.env.DATABASE_URL) {
      this.log('DATABASE_URL not set - database tests will fail', 'warning');
    }

    return { serverRunning };
  }

  async isServerRunning() {
    try {
      const axios = require('axios');
      const response = await axios.get('http://localhost:3000/api/health', {
        timeout: 1000
      }).catch(() => null);
      return response !== null;
    } catch {
      return false;
    }
  }

  async run() {
    console.log(chalk.bold.cyan('\n🧪 Platform Test Suite Runner\n'));
    console.log(chalk.gray('This will run all platform functionality tests'));
    console.log(chalk.gray('━'.repeat(50)));

    const { serverRunning } = await this.checkPrerequisites();

    for (const test of this.tests) {
      if (test.requiresServer && !serverRunning) {
        this.log(`\n⏭️  Skipping: ${test.name} (requires server)`, 'warning');
        this.results.push({
          name: test.name,
          success: false,
          skipped: true,
          reason: 'Server not running'
        });
        continue;
      }

      await this.runTest(test);
    }

    this.printSummary();
  }

  printSummary() {
    console.log(chalk.bold.cyan('\n📊 Test Summary\n'));
    console.log(chalk.gray('━'.repeat(50)));

    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success && !r.skipped).length;
    const skipped = this.results.filter(r => r.skipped).length;
    const total = this.results.length;

    // Individual results
    this.results.forEach(result => {
      const icon = result.success ? '✅' : result.skipped ? '⏭️' : '❌';
      const color = result.success ? 'green' : result.skipped ? 'yellow' : 'red';
      const status = result.success ? 'PASSED' : result.skipped ? 'SKIPPED' : 'FAILED';
      
      console.log(chalk[color](`${icon} ${result.name} - ${status}`));
      if (result.skipped) {
        console.log(chalk.gray(`   Reason: ${result.reason}`));
      }
    });

    console.log(chalk.gray('\n━'.repeat(50)));
    console.log(chalk.green(`✅ Passed: ${passed}`));
    console.log(chalk.red(`❌ Failed: ${failed}`));
    console.log(chalk.yellow(`⏭️  Skipped: ${skipped}`));
    console.log(chalk.blue(`📊 Total: ${total}`));
    
    const successRate = total > 0 ? ((passed / (total - skipped)) * 100).toFixed(1) : 0;
    console.log(chalk.bold(`\n📈 Success Rate: ${successRate}% (excluding skipped)\n`));

    // Recommendations
    if (failed > 0 || skipped > 0) {
      console.log(chalk.bold.yellow('💡 Recommendations:\n'));
      
      if (skipped > 0) {
        console.log(chalk.yellow('• Start the development server with: npm run dev'));
      }
      
      if (!process.env.DATABASE_URL) {
        console.log(chalk.yellow('• Set DATABASE_URL environment variable'));
      }
      
      console.log(chalk.yellow('• Check individual test logs for specific errors'));
      console.log(chalk.yellow('• Run tests individually for detailed output\n'));
    }

    process.exit(failed > 0 ? 1 : 0);
  }
}

// Main execution
async function main() {
  if (process.argv.includes('--help')) {
    console.log(chalk.bold('Platform Test Runner'));
    console.log('\nUsage: node run-all-tests.js [options]');
    console.log('\nOptions:');
    console.log('  --help     Show this help message');
    console.log('\nThis script runs all platform functionality tests:');
    console.log('  • Database connectivity');
    console.log('  • JWT token operations');
    console.log('  • Core functionality (requires server)');
    console.log('\nPrerequisites:');
    console.log('  • DATABASE_URL environment variable set');
    console.log('  • Development server running (for API tests)');
    process.exit(0);
  }

  const runner = new TestRunner();
  await runner.run();
}

main().catch(error => {
  console.error(chalk.red(`\n❌ Runner error: ${error.message}\n`));
  process.exit(1);
});