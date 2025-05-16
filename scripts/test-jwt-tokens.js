#!/usr/bin/env node

/**
 * JWT Token Testing Script
 * Tests JWT token generation, validation, and expiration
 */

const jwt = require('jsonwebtoken');
const chalk = require('chalk');

class JWTTester {
  constructor() {
    this.results = {
      passed: [],
      failed: []
    };
    this.secret = process.env.JWT_SECRET || 'test-secret';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
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

  generateToken(payload, options = {}) {
    return jwt.sign(payload, this.secret, {
      expiresIn: '1h',
      ...options
    });
  }

  generateRefreshToken(payload, options = {}) {
    return jwt.sign(payload, this.refreshSecret, {
      expiresIn: '7d',
      ...options
    });
  }

  async testTokenGeneration() {
    await this.test('Token Generation', async () => {
      const payload = {
        userId: 'test-user-123',
        email: 'test@example.com',
        role: 'buyer',
        permissions: ['read', 'write']
      };

      const token = this.generateToken(payload);
      const refreshToken = this.generateRefreshToken({ userId: payload.userId });

      if (!token || token.split('.').length !== 3) {
        throw new Error('Invalid token format');
      }

      if (!refreshToken || refreshToken.split('.').length !== 3) {
        throw new Error('Invalid refresh token format');
      }

      this.log('Access token generated successfully', 'info');
      this.log('Refresh token generated successfully', 'info');

      // Store for later tests
      this.testToken = token;
      this.testRefreshToken = refreshToken;
    });
  }

  async testTokenValidation() {
    await this.test('Token Validation', async () => {
      if (!this.testToken) {
        throw new Error('No test token available');
      }

      const decoded = jwt.verify(this.testToken, this.secret);

      if (!decoded.userId || decoded.userId !== 'test-user-123') {
        throw new Error('Token payload incorrect');
      }

      if (!decoded.email || decoded.email !== 'test@example.com') {
        throw new Error('Token email incorrect');
      }

      this.log(`Token validated - User: ${decoded.email}, Role: ${decoded.role}`, 'info');
    });
  }

  async testExpiredToken() {
    await this.test('Expired Token Handling', async () => {
      const payload = {
        userId: 'test-user-expired',
        email: 'expired@example.com'
      };

      // Generate token that expired 1 hour ago
      const expiredToken = jwt.sign(payload, this.secret, {
        expiresIn: '-1h'
      });

      try {
        jwt.verify(expiredToken, this.secret);
        throw new Error('Expired token should not validate');
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          this.log('Expired token correctly rejected', 'info');
        } else {
          throw error;
        }
      }
    });
  }

  async testInvalidSignature() {
    await this.test('Invalid Signature Detection', async () => {
      const payload = {
        userId: 'test-user-invalid',
        email: 'invalid@example.com'
      };

      const token = jwt.sign(payload, 'wrong-secret');

      try {
        jwt.verify(token, this.secret);
        throw new Error('Token with invalid signature should not validate');
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          this.log('Invalid signature correctly detected', 'info');
        } else {
          throw error;
        }
      }
    });
  }

  async testTokenDecoding() {
    await this.test('Token Decoding (without verification)', async () => {
      if (!this.testToken) {
        throw new Error('No test token available');
      }

      const decoded = jwt.decode(this.testToken);

      if (!decoded || !decoded.userId) {
        throw new Error('Token decoding failed');
      }

      this.log(`Token decoded: ${JSON.stringify(decoded, null, 2)}`, 'info');
    });
  }

  async testRefreshTokenFlow() {
    await this.test('Refresh Token Flow', async () => {
      if (!this.testRefreshToken) {
        throw new Error('No refresh token available');
      }

      // Verify refresh token
      const decoded = jwt.verify(this.testRefreshToken, this.refreshSecret);

      if (!decoded.userId) {
        throw new Error('Refresh token missing userId');
      }

      // Generate new access token
      const newAccessToken = this.generateToken({
        userId: decoded.userId,
        email: 'refreshed@example.com',
        role: 'buyer',
        permissions: ['read', 'write']
      });

      const newDecoded = jwt.verify(newAccessToken, this.secret);

      if (newDecoded.userId !== decoded.userId) {
        throw new Error('New token userId mismatch');
      }

      this.log('Refresh token flow successful', 'info');
    });
  }

  async testTokenExpiration() {
    await this.test('Token Expiration Times', async () => {
      const shortToken = this.generateToken({ userId: 'test' }, { expiresIn: '1m' });
      const longToken = this.generateToken({ userId: 'test' }, { expiresIn: '24h' });

      const shortDecoded = jwt.decode(shortToken);
      const longDecoded = jwt.decode(longToken);

      const now = Math.floor(Date.now() / 1000);
      const shortExp = shortDecoded.exp - now;
      const longExp = longDecoded.exp - now;

      this.log(`Short token expires in: ${shortExp} seconds`, 'info');
      this.log(`Long token expires in: ${Math.floor(longExp / 3600)} hours`, 'info');

      if (shortExp > 65 || shortExp < 55) {
        throw new Error('Short token expiration incorrect');
      }

      if (longExp > 86500 || longExp < 86300) {
        throw new Error('Long token expiration incorrect');
      }
    });
  }

  async run() {
    console.log(chalk.bold('\n🔐 JWT Token Testing\n'));
    
    if (this.secret === 'test-secret') {
      this.log('Using test secret (not for production)', 'warning');
    }

    await this.testTokenGeneration();
    await this.testTokenValidation();
    await this.testExpiredToken();
    await this.testInvalidSignature();
    await this.testTokenDecoding();
    await this.testRefreshTokenFlow();
    await this.testTokenExpiration();

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
  const tester = new JWTTester();
  await tester.run();
}

// Command line options
if (process.argv.includes('--help')) {
  console.log(chalk.bold('JWT Token Testing'));
  console.log('\nUsage: node test-jwt-tokens.js');
  console.log('\nThis script tests JWT token generation, validation, and expiration.');
  console.log('\nOptional Environment Variables:');
  console.log('  JWT_SECRET - Secret for signing tokens (default: test-secret)');
  console.log('  JWT_REFRESH_SECRET - Secret for refresh tokens (default: test-refresh-secret)');
  process.exit(0);
}

main().catch(error => {
  console.error(chalk.red(`\n❌ Test error: ${error.message}\n`));
  process.exit(1);
});