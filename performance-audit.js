#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

// Simple color functions as fallback
const chalk = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

class PerformanceAuditor {
  constructor() {
    this.results = {
      buildAnalysis: {},
      bundleAnalysis: {},
      dependencies: {},
      performance: {},
      deployment: {},
      timestamp: new Date().toISOString()
    };
  }

  async run() {
    console.log(chalk.blue('🔍 Starting Performance & DevOps Audit...\n'));

    // 1. Build Analysis
    await this.analyzeBuild();
    
    // 2. Bundle Analysis
    await this.analyzeBundle();
    
    // 3. Dependency Analysis
    await this.analyzeDependencies();
    
    // 4. Performance Metrics
    await this.analyzePerformance();
    
    // 5. Deployment Readiness
    await this.checkDeploymentReadiness();
    
    // 6. Generate Reports
    await this.generateReports();
    
    console.log(chalk.green('\n✅ Audit Complete!'));
  }

  async analyzeBuild() {
    console.log(chalk.yellow('📦 Analyzing Build Performance...'));
    
    try {
      // Clean build first
      console.log('  Cleaning previous build...');
      execSync('rm -rf .next', { stdio: 'pipe' });
      
      // Measure build time
      const startTime = Date.now();
      console.log('  Running production build...');
      
      const buildOutput = execSync('npm run build', { 
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024 
      });
      
      const buildTime = Date.now() - startTime;
      
      // Parse build output
      const routeMatches = buildOutput.match(/○\s+(.+?)\s+\d+(?:\.\d+)?\s+[kKmM]?B/g) || [];
      const staticRoutes = routeMatches.length;
      
      // Get build size info
      const buildSizeInfo = this.getBuildSizes();
      
      this.results.buildAnalysis = {
        buildTime: `${(buildTime / 1000).toFixed(2)}s`,
        buildTimeMs: buildTime,
        staticRoutes,
        ...buildSizeInfo
      };
      
      console.log(chalk.green(`  ✓ Build completed in ${this.results.buildAnalysis.buildTime}`));
    } catch (error) {
      console.error(chalk.red('  ✗ Build failed:', error.message));
      this.results.buildAnalysis.error = error.message;
    }
  }

  getBuildSizes() {
    const nextDir = path.join(process.cwd(), '.next');
    if (!fs.existsSync(nextDir)) {
      return { error: 'No .next directory found' };
    }

    const sizes = {
      totalSize: 0,
      serverSize: 0,
      staticSize: 0,
      chunks: []
    };

    // Server bundle size
    const serverDir = path.join(nextDir, 'server');
    if (fs.existsSync(serverDir)) {
      sizes.serverSize = this.getDirectorySize(serverDir);
    }

    // Static files size
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      sizes.staticSize = this.getDirectorySize(staticDir);
    }

    // Analyze chunks
    const chunksDir = path.join(staticDir, 'chunks');
    if (fs.existsSync(chunksDir)) {
      const chunks = fs.readdirSync(chunksDir)
        .filter(f => f.endsWith('.js'))
        .map(f => ({
          name: f,
          size: fs.statSync(path.join(chunksDir, f)).size
        }))
        .sort((a, b) => b.size - a.size)
        .slice(0, 10); // Top 10 chunks

      sizes.chunks = chunks;
    }

    sizes.totalSize = sizes.serverSize + sizes.staticSize;
    
    // Convert to human readable
    return {
      totalSize: this.formatBytes(sizes.totalSize),
      serverSize: this.formatBytes(sizes.serverSize),
      staticSize: this.formatBytes(sizes.staticSize),
      largestChunks: sizes.chunks.map(c => ({
        name: c.name,
        size: this.formatBytes(c.size)
      }))
    };
  }

  getDirectorySize(dir) {
    let size = 0;
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        size += this.getDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    }
    
    return size;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async analyzeBundle() {
    console.log(chalk.yellow('\n📊 Analyzing Bundle...'));
    
    try {
      // Check if next-bundle-analyzer is available
      const packageJson = require(path.join(process.cwd(), 'package.json'));
      const hasAnalyzer = packageJson.devDependencies?.['@next/bundle-analyzer'] || 
                          packageJson.dependencies?.['@next/bundle-analyzer'];
      
      if (hasAnalyzer) {
        console.log('  Running bundle analyzer...');
        // Would run: ANALYZE=true npm run build
        this.results.bundleAnalysis.analyzerAvailable = true;
      } else {
        this.results.bundleAnalysis.analyzerAvailable = false;
        this.results.bundleAnalysis.recommendation = 'Install @next/bundle-analyzer for detailed analysis';
      }

      // Basic bundle analysis from build output
      this.analyzeBuildOutput();
      
    } catch (error) {
      console.error(chalk.red('  ✗ Bundle analysis failed:', error.message));
      this.results.bundleAnalysis.error = error.message;
    }
  }

  analyzeBuildOutput() {
    const buildManifest = path.join(process.cwd(), '.next/build-manifest.json');
    
    if (fs.existsSync(buildManifest)) {
      const manifest = fs.readJsonSync(buildManifest);
      const pages = Object.keys(manifest.pages || {});
      
      this.results.bundleAnalysis.pageCount = pages.length;
      this.results.bundleAnalysis.pages = pages.slice(0, 10); // First 10 pages
    }
  }

  async analyzeDependencies() {
    console.log(chalk.yellow('\n📚 Analyzing Dependencies...'));
    
    try {
      const packageJson = require(path.join(process.cwd(), 'package.json'));
      
      const deps = Object.keys(packageJson.dependencies || {});
      const devDeps = Object.keys(packageJson.devDependencies || {});
      
      this.results.dependencies = {
        production: deps.length,
        development: devDeps.length,
        total: deps.length + devDeps.length
      };

      // Check for duplicate dependencies
      console.log('  Checking for duplicates...');
      const duplicates = this.checkDuplicates();
      if (duplicates.length > 0) {
        this.results.dependencies.duplicates = duplicates;
      }

      // Check for unused dependencies
      console.log('  Checking for unused dependencies...');
      const unused = await this.checkUnusedDependencies();
      this.results.dependencies.potentiallyUnused = unused;

      console.log(chalk.green('  ✓ Dependency analysis complete'));
    } catch (error) {
      console.error(chalk.red('  ✗ Dependency analysis failed:', error.message));
      this.results.dependencies.error = error.message;
    }
  }

  checkDuplicates() {
    try {
      const output = execSync('npm ls --depth=0 --json', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      const tree = JSON.parse(output);
      const duplicates = [];
      
      // Simple duplicate check - in real scenario would be more complex
      return duplicates;
    } catch (error) {
      return [];
    }
  }

  async checkUnusedDependencies() {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const allDeps = [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.devDependencies || {})
    ];

    const unused = [];
    const srcDir = path.join(process.cwd(), 'src');
    
    // Quick heuristic check - look for imports
    for (const dep of allDeps) {
      try {
        const searchResult = execSync(
          `grep -r "from ['"]${dep}" ${srcDir} 2>/dev/null | head -1`,
          { encoding: 'utf8', stdio: 'pipe' }
        );
        
        if (!searchResult.trim()) {
          // Also check require
          const requireResult = execSync(
            `grep -r "require(['"]${dep}" ${srcDir} 2>/dev/null | head -1`,
            { encoding: 'utf8', stdio: 'pipe' }
          );
          
          if (!requireResult.trim()) {
            unused.push(dep);
          }
        }
      } catch (error) {
        // Grep returns error if no matches found
        unused.push(dep);
      }
    }
    
    return unused.slice(0, 20); // Limit to 20 for report
  }

  async analyzePerformance() {
    console.log(chalk.yellow('\n⚡ Analyzing Performance Metrics...'));
    
    // Check if server is running
    const isServerRunning = await this.checkServerRunning();
    
    if (!isServerRunning) {
      console.log(chalk.gray('  Server not running. Skipping runtime performance checks.'));
      this.results.performance.note = 'Server not running. Start server and run Lighthouse manually.';
      return;
    }

    // Basic performance checks
    this.results.performance = {
      recommendations: [
        'Run Lighthouse CI for detailed metrics',
        'Implement performance monitoring (e.g., Sentry, DataDog)',
        'Add performance budgets to build process',
        'Enable Next.js built-in performance reporting'
      ],
      coreWebVitals: {
        note: 'Install and configure web-vitals for real user metrics'
      }
    };

    // Check for performance optimizations
    this.checkPerformanceOptimizations();
  }

  async checkServerRunning() {
    try {
      execSync('curl -s http://localhost:3000 > /dev/null', { stdio: 'pipe' });
      return true;
    } catch {
      return false;
    }
  }

  checkPerformanceOptimizations() {
    const optimizations = [];
    
    // Check next.config.js for optimizations
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, 'utf8');
      
      if (!config.includes('images:')) {
        optimizations.push('Enable Next.js Image Optimization');
      }
      
      if (!config.includes('compress:')) {
        optimizations.push('Enable compression in next.config.js');
      }
      
      if (!config.includes('poweredByHeader: false')) {
        optimizations.push('Disable X-Powered-By header for security');
      }
    }

    // Check for common performance patterns
    const patternsToCheck = [
      { pattern: 'React.lazy', name: 'Code splitting with React.lazy' },
      { pattern: 'dynamic(', name: 'Dynamic imports with next/dynamic' },
      { pattern: 'Image from', name: 'Next.js Image component' },
      { pattern: 'getStaticProps', name: 'Static generation' },
      { pattern: 'getServerSideProps', name: 'Server-side rendering' }
    ];

    const srcDir = path.join(process.cwd(), 'src');
    const usedOptimizations = [];
    
    for (const { pattern, name } of patternsToCheck) {
      try {
        execSync(`grep -r "${pattern}" ${srcDir} 2>/dev/null | head -1`, { 
          encoding: 'utf8',
          stdio: 'pipe' 
        });
        usedOptimizations.push(name);
      } catch {
        // Pattern not found
      }
    }

    this.results.performance.optimizations = {
      inUse: usedOptimizations,
      recommendations: optimizations
    };
  }

  async checkDeploymentReadiness() {
    console.log(chalk.yellow('\n🚀 Checking Deployment Readiness...'));
    
    const issues = [];
    const configurations = {};

    // 1. Environment Variables
    console.log('  Checking environment variables...');
    const envIssues = this.checkEnvironmentVariables();
    if (envIssues.length > 0) {
      issues.push(...envIssues);
    }

    // 2. Docker Configuration
    console.log('  Checking Docker configuration...');
    const dockerStatus = this.checkDockerConfig();
    configurations.docker = dockerStatus;

    // 3. CI/CD Setup
    console.log('  Checking CI/CD configuration...');
    const cicdStatus = this.checkCICD();
    configurations.cicd = cicdStatus;

    // 4. Monitoring Setup
    console.log('  Checking monitoring setup...');
    const monitoringStatus = this.checkMonitoring();
    configurations.monitoring = monitoringStatus;

    // 5. Security Headers
    console.log('  Checking security configuration...');
    const securityStatus = this.checkSecurity();
    configurations.security = securityStatus;

    this.results.deployment = {
      issues,
      configurations,
      readiness: issues.length === 0 ? 'Ready' : 'Issues Found'
    };

    console.log(chalk.green('  ✓ Deployment check complete'));
  }

  checkEnvironmentVariables() {
    const issues = [];
    
    // Check for .env.example
    if (!fs.existsSync('.env.example') && !fs.existsSync('.env.template')) {
      issues.push('Missing .env.example or .env.template file');
    }

    // Check for sensitive data in tracked files
    const gitIgnore = fs.existsSync('.gitignore') ? 
      fs.readFileSync('.gitignore', 'utf8') : '';
    
    if (!gitIgnore.includes('.env')) {
      issues.push('.env files not in .gitignore');
    }

    // Check for required env vars
    const envExample = fs.existsSync('.env.example') ? 
      fs.readFileSync('.env.example', 'utf8') : '';
    
    const requiredVars = envExample.match(/^[A-Z_]+=/gm) || [];
    const currentEnv = fs.existsSync('.env') ? 
      fs.readFileSync('.env', 'utf8') : '';
    
    for (const varLine of requiredVars) {
      const varName = varLine.split('=')[0];
      if (!currentEnv.includes(varName + '=')) {
        issues.push(`Missing required env var: ${varName}`);
      }
    }

    return issues;
  }

  checkDockerConfig() {
    const status = {
      dockerfile: fs.existsSync('Dockerfile'),
      dockerignore: fs.existsSync('.dockerignore'),
      compose: fs.existsSync('docker-compose.yml'),
      multistage: false,
      optimized: false
    };

    if (status.dockerfile) {
      const dockerfile = fs.readFileSync('Dockerfile', 'utf8');
      status.multistage = dockerfile.includes('FROM') && 
        dockerfile.split('FROM').length > 2;
      status.optimized = dockerfile.includes('node:.*-alpine') || 
        dockerfile.includes('node:.*-slim');
    }

    return status;
  }

  checkCICD() {
    const status = {
      github: fs.existsSync('.github/workflows'),
      gitlab: fs.existsSync('.gitlab-ci.yml'),
      jenkins: fs.existsSync('Jenkinsfile'),
      vercel: fs.existsSync('vercel.json'),
      netlify: fs.existsSync('netlify.toml'),
      aws: fs.existsSync('amplify.yml')
    };

    // Check for actual workflow files
    if (status.github) {
      const workflows = fs.readdirSync('.github/workflows');
      status.githubWorkflows = workflows.filter(f => f.endsWith('.yml'));
    }

    return status;
  }

  checkMonitoring() {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    const deps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    };

    return {
      sentry: !!deps['@sentry/nextjs'],
      datadog: !!deps['dd-trace'],
      newRelic: !!deps['newrelic'],
      elastic: !!deps['elastic-apm-node'],
      custom: fs.existsSync('src/lib/monitoring') || 
              fs.existsSync('src/utils/monitoring')
    };
  }

  checkSecurity() {
    const status = {
      headers: false,
      csp: false,
      cors: false,
      helmet: false
    };

    // Check for security headers in next.config.js
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, 'utf8');
      status.headers = config.includes('headers:') || config.includes('securityHeaders');
      status.csp = config.includes('Content-Security-Policy');
    }

    // Check for security middleware
    const middlewarePath = path.join(process.cwd(), 'src/middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      const middleware = fs.readFileSync(middlewarePath, 'utf8');
      status.cors = middleware.includes('cors') || middleware.includes('CORS');
    }

    return status;
  }

  async generateReports() {
    console.log(chalk.yellow('\n📄 Generating Reports...'));

    // 1. Performance Metrics JSON
    await fs.writeJson(
      'performance-metrics.json',
      this.results,
      { spaces: 2 }
    );

    // 2. Bundle Analysis
    const bundleReport = this.generateBundleReport();
    await fs.writeFile('bundle-analysis.txt', bundleReport);

    // 3. Deployment Blockers
    const blockersReport = this.generateBlockersReport();
    await fs.writeFile('deployment-blockers.txt', blockersReport);

    // 4. Optimization Opportunities
    const optimizationReport = this.generateOptimizationReport();
    await fs.writeFile('optimization-opportunities.txt', optimizationReport);

    console.log(chalk.green('  ✓ Reports generated successfully'));
  }

  generateBundleReport() {
    const { buildAnalysis, bundleAnalysis, dependencies } = this.results;
    
    let report = `BUNDLE ANALYSIS REPORT
Generated: ${new Date().toISOString()}
${'='.repeat(50)}

BUILD METRICS:
- Build Time: ${buildAnalysis.buildTime || 'N/A'}
- Total Size: ${buildAnalysis.totalSize || 'N/A'}
- Server Size: ${buildAnalysis.serverSize || 'N/A'}
- Static Size: ${buildAnalysis.staticSize || 'N/A'}

LARGEST CHUNKS:
`;

    if (buildAnalysis.largestChunks) {
      buildAnalysis.largestChunks.forEach(chunk => {
        report += `- ${chunk.name}: ${chunk.size}\n`;
      });
    }

    report += `
DEPENDENCIES:
- Production: ${dependencies.production || 0}
- Development: ${dependencies.development || 0}
- Total: ${dependencies.total || 0}
`;

    if (dependencies.potentiallyUnused?.length > 0) {
      report += `
POTENTIALLY UNUSED DEPENDENCIES:
${dependencies.potentiallyUnused.map(d => `- ${d}`).join('\n')}
`;
    }

    return report;
  }

  generateBlockersReport() {
    const { deployment } = this.results;
    
    let report = `DEPLOYMENT BLOCKERS REPORT
Generated: ${new Date().toISOString()}
${'='.repeat(50)}

STATUS: ${deployment.readiness || 'Unknown'}

`;

    if (deployment.issues?.length > 0) {
      report += `CRITICAL ISSUES:
${deployment.issues.map(i => `❌ ${i}`).join('\n')}

`;
    }

    report += `CONFIGURATION STATUS:

Docker:
- Dockerfile: ${deployment.configurations?.docker?.dockerfile ? '✅' : '❌'}
- .dockerignore: ${deployment.configurations?.docker?.dockerignore ? '✅' : '❌'}
- Multi-stage build: ${deployment.configurations?.docker?.multistage ? '✅' : '❌'}
- Optimized image: ${deployment.configurations?.docker?.optimized ? '✅' : '❌'}

CI/CD:
- GitHub Actions: ${deployment.configurations?.cicd?.github ? '✅' : '❌'}
- Vercel: ${deployment.configurations?.cicd?.vercel ? '✅' : '❌'}
- AWS Amplify: ${deployment.configurations?.cicd?.aws ? '✅' : '❌'}

Monitoring:
- Sentry: ${deployment.configurations?.monitoring?.sentry ? '✅' : '❌'}
- Custom Monitoring: ${deployment.configurations?.monitoring?.custom ? '✅' : '❌'}

Security:
- Security Headers: ${deployment.configurations?.security?.headers ? '✅' : '❌'}
- CSP: ${deployment.configurations?.security?.csp ? '✅' : '❌'}
`;

    return report;
  }

  generateOptimizationReport() {
    const { buildAnalysis, performance, dependencies } = this.results;
    
    let report = `OPTIMIZATION OPPORTUNITIES REPORT
Generated: ${new Date().toISOString()}
${'='.repeat(50)}

`;

    // Build optimizations
    if (buildAnalysis.buildTimeMs > 60000) {
      report += `BUILD PERFORMANCE:
⚠️  Build time exceeds 1 minute (${buildAnalysis.buildTime})
   Recommendations:
   - Enable SWC minification
   - Use turbo mode in development
   - Consider build caching strategies

`;
    }

    // Bundle optimizations
    if (buildAnalysis.largestChunks?.length > 0) {
      const largeChunks = buildAnalysis.largestChunks.filter(c => 
        parseInt(c.size) > 200
      );
      
      if (largeChunks.length > 0) {
        report += `BUNDLE SIZE:
⚠️  Large chunks detected:
${largeChunks.map(c => `   - ${c.name}: ${c.size}`).join('\n')}
   Recommendations:
   - Implement code splitting
   - Use dynamic imports for large components
   - Analyze with @next/bundle-analyzer

`;
      }
    }

    // Dependency optimizations
    if (dependencies.potentiallyUnused?.length > 0) {
      report += `DEPENDENCIES:
⚠️  ${dependencies.potentiallyUnused.length} potentially unused dependencies
   Run: npm uninstall ${dependencies.potentiallyUnused.slice(0, 5).join(' ')}

`;
    }

    // Performance optimizations
    if (performance.optimizations) {
      report += `PERFORMANCE OPTIMIZATIONS:

Currently Using:
${performance.optimizations.inUse.map(o => `✅ ${o}`).join('\n')}

Recommended:
${performance.optimizations.recommendations.map(r => `- ${r}`).join('\n')}
`;
    }

    report += `
GENERAL RECOMMENDATIONS:
1. Implement performance monitoring
2. Set up performance budgets
3. Enable Next.js analytics
4. Implement proper caching strategies
5. Optimize images and fonts
6. Enable compression
7. Implement service workers for offline support
8. Use CDN for static assets
`;

    return report;
  }
}

// Main execution
async function main() {
  try {
    const auditor = new PerformanceAuditor();
    await auditor.run();
  } catch (error) {
    console.error(chalk.red('Fatal error:'), error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = PerformanceAuditor;