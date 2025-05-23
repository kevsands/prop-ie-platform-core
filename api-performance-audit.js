#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class APIPerformanceAuditor {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      apiRoutes: [],
      databaseQueries: [],
      performanceIssues: [],
      optimizations: []
    };
  }

  async run() {
    console.log('🔍 Starting API & Database Performance Audit...\n');

    // 1. Analyze API routes
    await this.analyzeAPIRoutes();
    
    // 2. Check database configuration
    await this.analyzeDatabaseConfig();
    
    // 3. Analyze query patterns
    await this.analyzeQueryPatterns();
    
    // 4. Check caching implementation
    await this.analyzeCaching();
    
    // 5. Generate performance recommendations
    this.generateRecommendations();
    
    console.log('\n✅ API Performance Audit Complete!');
  }

  async analyzeAPIRoutes() {
    console.log('📡 Analyzing API Routes...');
    
    const apiDir = path.join(process.cwd(), 'src/app/api');
    if (!fs.existsSync(apiDir)) {
      console.log('  No API directory found');
      return;
    }
    
    const routes = this.scanAPIRoutes(apiDir);
    
    // Analyze each route
    for (const route of routes) {
      const analysis = await this.analyzeRoute(route);
      this.results.apiRoutes.push(analysis);
    }
    
    console.log(`  Found ${routes.length} API routes`);
  }

  scanAPIRoutes(dir, basePath = '') {
    const routes = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        routes.push(...this.scanAPIRoutes(fullPath, path.join(basePath, item)));
      } else if (item === 'route.ts' || item === 'route.js') {
        routes.push({
          path: basePath || '/',
          file: fullPath,
          endpoint: `/api${basePath}`
        });
      }
    }
    
    return routes;
  }

  async analyzeRoute(route) {
    const content = fs.readFileSync(route.file, 'utf8');
    const analysis = {
      endpoint: route.endpoint,
      methods: [],
      issues: [],
      hasErrorHandling: false,
      hasValidation: false,
      hasAuthentication: false,
      hasRateLimit: false,
      hasCaching: false,
      databaseCalls: 0
    };
    
    // Check HTTP methods
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    methods.forEach(method => {
      if (content.includes(`export async function ${method}`) || 
          content.includes(`export function ${method}`)) {
        analysis.methods.push(method);
      }
    });
    
    // Check for common patterns
    analysis.hasErrorHandling = content.includes('try') && content.includes('catch');
    analysis.hasValidation = content.includes('zod') || content.includes('joi') || 
                            content.includes('yup') || content.includes('validate');
    analysis.hasAuthentication = content.includes('getServerSession') || 
                                content.includes('auth') || content.includes('token');
    analysis.hasRateLimit = content.includes('rateLimit') || content.includes('rate-limit');
    analysis.hasCaching = content.includes('cache') || content.includes('Cache');
    
    // Count database calls
    const dbPatterns = ['prisma', 'findMany', 'findUnique', 'create', 'update', 'delete', 'query'];
    dbPatterns.forEach(pattern => {
      const matches = content.match(new RegExp(pattern, 'g'));
      if (matches) {
        analysis.databaseCalls += matches.length;
      }
    });
    
    // Identify issues
    if (!analysis.hasErrorHandling) {
      analysis.issues.push('Missing error handling');
    }
    
    if (!analysis.hasValidation && analysis.methods.includes('POST')) {
      analysis.issues.push('Missing input validation for POST requests');
    }
    
    if (analysis.databaseCalls > 3) {
      analysis.issues.push(`High number of database calls (${analysis.databaseCalls})`);
    }
    
    if (!analysis.hasCaching && analysis.methods.includes('GET')) {
      analysis.issues.push('No caching for GET requests');
    }
    
    return analysis;
  }

  async analyzeDatabaseConfig() {
    console.log('\n🗄️  Analyzing Database Configuration...');
    
    const prismaSchema = path.join(process.cwd(), 'prisma/schema.prisma');
    if (!fs.existsSync(prismaSchema)) {
      console.log('  No Prisma schema found');
      return;
    }
    
    const schema = fs.readFileSync(prismaSchema, 'utf8');
    
    // Check for indexes
    const models = schema.match(/model\s+(\w+)\s*{[^}]+}/g) || [];
    const indexAnalysis = [];
    
    models.forEach(modelBlock => {
      const modelName = modelBlock.match(/model\s+(\w+)/)[1];
      const indexes = modelBlock.match(/@@index/g) || [];
      const uniqueIndexes = modelBlock.match(/@@unique/g) || [];
      const relations = modelBlock.match(/@relation/g) || [];
      
      indexAnalysis.push({
        model: modelName,
        indexes: indexes.length,
        uniqueIndexes: uniqueIndexes.length,
        relations: relations.length,
        hasCreatedAt: modelBlock.includes('createdAt'),
        hasUpdatedAt: modelBlock.includes('updatedAt')
      });
    });
    
    this.results.databaseQueries = indexAnalysis;
    
    // Check for performance issues
    indexAnalysis.forEach(model => {
      if (model.relations > 0 && model.indexes === 0) {
        this.results.performanceIssues.push({
          type: 'Missing Index',
          model: model.model,
          issue: 'Model has relations but no indexes'
        });
      }
    });
    
    console.log(`  Analyzed ${models.length} database models`);
  }

  async analyzeQueryPatterns() {
    console.log('\n🔍 Analyzing Query Patterns...');
    
    const srcDir = path.join(process.cwd(), 'src');
    
    // Common N+1 query patterns
    const n1Patterns = [
      { pattern: 'for.*await.*findUnique', name: 'Potential N+1 in loop with findUnique' },
      { pattern: 'map.*await.*prisma', name: 'Potential N+1 with map and await' },
      { pattern: 'forEach.*await.*find', name: 'Potential N+1 in forEach' }
    ];
    
    const queryIssues = [];
    
    // Scan for patterns
    n1Patterns.forEach(({ pattern, name }) => {
      try {
        const result = execSync(
          `grep -r "${pattern}" ${srcDir} --include="*.ts" --include="*.tsx" 2>/dev/null || true`,
          { encoding: 'utf8', maxBuffer: 5 * 1024 * 1024 }
        );
        
        if (result.trim()) {
          const files = result.trim().split('\n').map(line => line.split(':')[0]);
          const uniqueFiles = [...new Set(files)];
          
          queryIssues.push({
            issue: name,
            occurrences: files.length,
            files: uniqueFiles.slice(0, 5) // First 5 files
          });
        }
      } catch (error) {
        // Ignore grep errors
      }
    });
    
    // Check for missing includes
    try {
      const includeCheck = execSync(
        `grep -r "findMany\\|findFirst\\|findUnique" ${srcDir} --include="*.ts" -A 2 | grep -v "include" | head -20`,
        { encoding: 'utf8', stdio: 'pipe' }
      );
      
      if (includeCheck.trim()) {
        queryIssues.push({
          issue: 'Missing include statements',
          recommendation: 'Use include to fetch related data in single query'
        });
      }
    } catch {
      // No issues found
    }
    
    this.results.performanceIssues.push(...queryIssues);
    
    console.log(`  Found ${queryIssues.length} query pattern issues`);
  }

  async analyzeCaching() {
    console.log('\n💾 Analyzing Caching Implementation...');
    
    const cacheAnalysis = {
      hasRedis: false,
      hasMemoryCache: false,
      hasCDN: false,
      hasAPICache: false,
      recommendations: []
    };
    
    // Check package.json for cache libraries
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    cacheAnalysis.hasRedis = !!allDeps['redis'] || !!allDeps['ioredis'] || !!allDeps['@vercel/kv'];
    cacheAnalysis.hasMemoryCache = !!allDeps['node-cache'] || !!allDeps['lru-cache'];
    
    // Check for cache implementation
    const srcDir = path.join(process.cwd(), 'src');
    
    try {
      const cacheUsage = execSync(
        `grep -r "cache\\|Cache" ${srcDir} --include="*.ts" --include="*.tsx" | wc -l`,
        { encoding: 'utf8' }
      );
      
      cacheAnalysis.hasAPICache = parseInt(cacheUsage.trim()) > 5;
    } catch {
      // No cache usage found
    }
    
    // Check next.config.js for CDN/caching headers
    if (fs.existsSync('next.config.js')) {
      const config = fs.readFileSync('next.config.js', 'utf8');
      cacheAnalysis.hasCDN = config.includes('Cache-Control') || 
                            config.includes('stale-while-revalidate');
    }
    
    // Generate recommendations
    if (!cacheAnalysis.hasRedis && !cacheAnalysis.hasMemoryCache) {
      cacheAnalysis.recommendations.push('Implement caching layer (Redis or in-memory cache)');
    }
    
    if (!cacheAnalysis.hasCDN) {
      cacheAnalysis.recommendations.push('Configure CDN caching headers for static assets');
    }
    
    if (!cacheAnalysis.hasAPICache) {
      cacheAnalysis.recommendations.push('Implement API response caching for GET requests');
    }
    
    this.results.caching = cacheAnalysis;
    
    console.log('  Caching analysis complete');
  }

  generateRecommendations() {
    console.log('\n📋 Generating Recommendations...');
    
    const recommendations = [];
    
    // API route recommendations
    const routesWithIssues = this.results.apiRoutes.filter(r => r.issues.length > 0);
    if (routesWithIssues.length > 0) {
      recommendations.push({
        category: 'API Security',
        priority: 'High',
        issue: `${routesWithIssues.length} API routes have security/performance issues`,
        action: 'Add error handling, validation, and authentication to API routes'
      });
    }
    
    // Database recommendations
    const modelsWithoutIndexes = this.results.databaseQueries.filter(m => 
      m.relations > 0 && m.indexes === 0
    );
    if (modelsWithoutIndexes.length > 0) {
      recommendations.push({
        category: 'Database Performance',
        priority: 'High',
        issue: `${modelsWithoutIndexes.length} models need indexes`,
        action: 'Add indexes to foreign key columns and frequently queried fields'
      });
    }
    
    // Query pattern recommendations
    const n1Issues = this.results.performanceIssues.filter(i => 
      i.issue && i.issue.includes('N+1')
    );
    if (n1Issues.length > 0) {
      recommendations.push({
        category: 'Query Optimization',
        priority: 'High',
        issue: 'Potential N+1 query problems detected',
        action: 'Use Prisma include/select to fetch related data efficiently'
      });
    }
    
    // Caching recommendations
    if (this.results.caching?.recommendations.length > 0) {
      this.results.caching.recommendations.forEach(rec => {
        recommendations.push({
          category: 'Caching',
          priority: 'Medium',
          issue: rec,
          action: 'Implement caching to reduce database load'
        });
      });
    }
    
    // General recommendations
    recommendations.push(
      {
        category: 'Monitoring',
        priority: 'Medium',
        issue: 'API performance monitoring',
        action: 'Implement APM (Application Performance Monitoring) for API routes'
      },
      {
        category: 'Rate Limiting',
        priority: 'High',
        issue: 'API rate limiting',
        action: 'Implement rate limiting to prevent abuse'
      },
      {
        category: 'Database',
        priority: 'Medium',
        issue: 'Connection pooling',
        action: 'Configure Prisma connection pool for optimal performance'
      }
    );
    
    this.results.optimizations = recommendations;
    
    // Save results
    fs.writeJsonSync('api-performance-analysis.json', this.results, { spaces: 2 });
    
    console.log(`  Generated ${recommendations.length} recommendations`);
    console.log('  Results saved to api-performance-analysis.json');
  }
}

// Main execution
async function main() {
  try {
    const auditor = new APIPerformanceAuditor();
    await auditor.run();
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = APIPerformanceAuditor;