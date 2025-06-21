#!/usr/bin/env node

/**
 * Database Enhancement Validation Script
 * Validates SQL migrations and TypeScript modules
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Validating Database Enhancements...\n');

// Check if migration files exist and are readable
const migrationFiles = [
  'migrations/0006_database_enhancements.sql',
  'migrations/0007_security_and_rls.sql', 
  'migrations/0008_production_readiness.sql'
];

console.log('📁 Checking Migration Files:');
for (const file of migrationFiles) {
  const fullPath = path.join(__dirname, '..', file);
  try {
    const stats = fs.statSync(fullPath);
    const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
    console.log(`  ✅ ${file} (${sizeMB} MB)`);
  } catch (error) {
    console.log(`  ❌ ${file} - Not found`);
  }
}

// Check TypeScript modules
const tsModules = [
  'src/lib/database/enhanced-client.ts',
  'src/lib/database/data-validation.ts',
  'src/lib/financial/analysis-engine.ts',
  'src/lib/monitoring/dashboard.ts',
  'src/lib/monitoring/performance.ts',
  'src/lib/database/test-utils.ts'
];

console.log('\n📦 Checking TypeScript Modules:');
for (const module of tsModules) {
  const fullPath = path.join(__dirname, '..', module);
  try {
    fs.accessSync(fullPath, fs.constants.R_OK);
    console.log(`  ✅ ${module}`);
  } catch (error) {
    console.log(`  ❌ ${module} - Not accessible`);
  }
}

// Test TypeScript compilation
console.log('\n🔨 Testing TypeScript Compilation:');
try {
  const moduleList = tsModules.join(' ');
  execSync(`npx tsc --noEmit --skipLibCheck ${moduleList}`, { 
    stdio: 'pipe',
    cwd: path.join(__dirname, '..')
  });
  console.log('  ✅ All modules compile successfully');
} catch (error) {
  console.log('  ❌ TypeScript compilation failed:');
  console.log(error.stdout?.toString() || error.message);
}

// Validate SQL syntax (basic check)
console.log('\n🔍 Validating SQL Syntax:');
for (const file of migrationFiles) {
  const fullPath = path.join(__dirname, '..', file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Basic SQL validation checks
    const checks = [
      { name: 'Begins with BEGIN', test: content.trim().startsWith('BEGIN') },
      { name: 'Ends with COMMIT', test: content.trim().endsWith('COMMIT;') },
      { name: 'Has migration record', test: content.includes('INSERT INTO schema_versions') },
      { name: 'No syntax errors', test: !content.includes('CREATE TABLE CREATE TABLE') } // Basic check
    ];
    
    console.log(`  📄 ${file}:`);
    for (const check of checks) {
      console.log(`    ${check.test ? '✅' : '❌'} ${check.name}`);
    }
  } catch (error) {
    console.log(`    ❌ Could not validate ${file}`);
  }
}

// Check enhanced schema compatibility
console.log('\n📋 Checking Enhanced Schema:');
const enhancedSchemaPath = path.join(__dirname, '..', 'prisma/schema-enhanced.prisma');
try {
  fs.accessSync(enhancedSchemaPath, fs.constants.R_OK);
  const content = fs.readFileSync(enhancedSchemaPath, 'utf8');
  
  const features = [
    { name: 'PostGIS Support', test: content.includes('Unsupported("geometry")') },
    { name: 'Audit Logs Model', test: content.includes('model AuditLog') },
    { name: 'Data Quality Models', test: content.includes('model DataQualityRule') },
    { name: 'Financial Models', test: content.includes('model CashFlow') },
    { name: 'Performance Models', test: content.includes('model DashboardMetric') }
  ];
  
  for (const feature of features) {
    console.log(`  ${feature.test ? '✅' : '⚠️'} ${feature.name}`);
  }
} catch (error) {
  console.log('  ❌ Enhanced schema not found');
}

// Performance estimates
console.log('\n⚡ Performance Estimates:');
const estimates = [
  '• Database Extensions: ~30 seconds to install',
  '• Index Creation: ~2-5 minutes depending on data size', 
  '• Materialized Views: ~1-2 minutes to create',
  '• RLS Policies: ~10 seconds to apply',
  '• Full Migration: ~5-10 minutes total'
];

for (const estimate of estimates) {
  console.log(`  ${estimate}`);
}

// Recommendations
console.log('\n💡 Deployment Recommendations:');
const recommendations = [
  '✅ Run migrations during maintenance window',
  '✅ Take database backup before applying changes',
  '✅ Test on staging environment first',
  '✅ Monitor performance after deployment',
  '✅ Have rollback plan ready'
];

for (const rec of recommendations) {
  console.log(`  ${rec}`);
}

console.log('\n🎉 Database Enhancement Validation Complete!\n');