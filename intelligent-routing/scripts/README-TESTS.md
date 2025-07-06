# Platform Functionality Test Suite

This directory contains test scripts to verify the core functionality of the platform.

## Available Tests

### 1. Database Connectivity Test
Tests Prisma database connection and basic model operations.

```bash
node scripts/test-database-connectivity.js
```

**Requirements:**
- PostgreSQL database running
- `DATABASE_URL` environment variable set

### 2. JWT Token Test
Tests JWT token generation, validation, and expiration handling.

```bash
node scripts/test-jwt-tokens.js
```

**Requirements:**
- None (uses default test secrets)

### 3. Core Functionality Test
Tests authentication flow, API endpoints, and SLP service.

```bash
node scripts/test-core-functionality.js
```

**Requirements:**
- Development server running (`npm run dev`)
- API available at `http://localhost:3000`

### 4. Run All Tests
Master test runner that executes all tests in sequence.

```bash
node scripts/run-all-tests.js
```

## Quick Start

1. **Setup Environment**
   ```bash
   # Set database URL
   export DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
   
   # Start development server
   npm run dev
   ```

2. **Run All Tests**
   ```bash
   node scripts/run-all-tests.js
   ```

3. **Run Individual Tests**
   ```bash
   # Test database only
   node scripts/test-database-connectivity.js
   
   # Test JWT only
   node scripts/test-jwt-tokens.js
   
   # Test API functionality
   node scripts/test-core-functionality.js
   ```

## Test Results

Each test script provides:
- ✅ Pass/fail status for each test
- 📊 Summary statistics
- 💡 Recommendations for failures

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `API_URL`: API base URL (default: http://localhost:3000)
- `JWT_SECRET`: JWT signing secret (optional)
- `JWT_REFRESH_SECRET`: Refresh token secret (optional)

## Adding New Tests

To add a new test:

1. Create a new test script in the `scripts` directory
2. Follow the existing pattern with test methods
3. Add the test to `run-all-tests.js` configuration
4. Update this README

## Troubleshooting

### Database Tests Failing
- Check `DATABASE_URL` is set correctly
- Ensure PostgreSQL is running
- Verify database schema is up to date

### API Tests Failing
- Ensure development server is running
- Check API is accessible at configured URL
- Verify authentication endpoints are working

### JWT Tests Failing
- Check JWT secrets are configured
- Verify token expiration settings