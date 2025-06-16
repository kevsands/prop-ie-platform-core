#!/usr/bin/env node

/**
 * Database Health Check Script
 * Validates database connection and performance
 */

const { PrismaClient } = require('@prisma/client');

async function checkDatabaseHealth() {
  console.log('🔍 Starting database health check...\n');
  
  const prisma = new PrismaClient();
  const results = {
    connection: false,
    basicQuery: false,
    tableCount: 0,
    responseTime: 0,
    errors: []
  };

  try {
    // Test 1: Basic Connection
    console.log('1. Testing database connection...');
    const startTime = Date.now();
    await prisma.$connect();
    results.connection = true;
    console.log('   ✅ Database connection successful');

    // Test 2: Basic Query
    console.log('2. Testing basic query execution...');
    const testResult = await prisma.$queryRaw`SELECT 1 as test`;
    results.basicQuery = true;
    results.responseTime = Date.now() - startTime;
    console.log(`   ✅ Basic query successful (${results.responseTime}ms)`);

    // Test 3: Schema Validation
    console.log('3. Validating database schema...');
    try {
      // Try to count tables by querying a known table
      const userCount = await prisma.user.count();
      console.log(`   ✅ Schema validation successful (found ${userCount} users)`);
    } catch (error) {
      console.log('   ⚠️  Schema validation warning:', error.message);
      results.errors.push(`Schema: ${error.message}`);
    }

    // Test 4: Performance Check
    console.log('4. Running performance check...');
    const perfStart = Date.now();
    await prisma.$queryRaw`SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'`;
    const perfTime = Date.now() - perfStart;
    console.log(`   ✅ Performance check completed (${perfTime}ms)`);

  } catch (error) {
    console.log(`   ❌ Database error: ${error.message}`);
    results.errors.push(error.message);
  } finally {
    await prisma.$disconnect();
  }

  // Results Summary
  console.log('\n📊 Health Check Results:');
  console.log('========================');
  console.log(`Connection: ${results.connection ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Basic Query: ${results.basicQuery ? '✅ OK' : '❌ FAILED'}`);
  console.log(`Response Time: ${results.responseTime}ms ${results.responseTime < 1000 ? '✅' : '⚠️'}`);
  
  if (results.errors.length > 0) {
    console.log('\n⚠️ Issues Found:');
    results.errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('\n🎉 All health checks passed!');
  }

  // Return exit code based on critical errors
  const criticalErrors = results.errors.filter(error => 
    !error.includes('Schema') && !error.includes('warning')
  );
  
  process.exit(criticalErrors.length > 0 ? 1 : 0);
}

checkDatabaseHealth().catch(error => {
  console.error('💥 Health check failed:', error);
  process.exit(1);
});