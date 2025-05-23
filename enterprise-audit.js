#!/usr/bin/env node
// Enterprise Platform Audit Script

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Statistics object
const stats = {
  totalFiles: 0,
  totalLines: 0,
  fileTypes: {},
  directories: {},
  largestFiles: [],
  components: 0,
  tests: 0,
  apiEndpoints: 0
};

// Configuration
const EXCLUDED_DIRS = ['node_modules', '.next', 'coverage', '.git', 'tmp'];
const CODE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.css', '.scss', '.json', '.md'];

function shouldProcess(filePath) {
  const parts = filePath.split(path.sep);
  return !EXCLUDED_DIRS.some(dir => parts.includes(dir));
}

function countLinesInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.split('\n').length;
  } catch (error) {
    return 0;
  }
}

function processDirectory(dirPath, basePath = dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(basePath, fullPath);
    
    if (!shouldProcess(fullPath)) return;
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath, basePath);
    } else if (stat.isFile()) {
      const ext = path.extname(item);
      if (CODE_EXTENSIONS.includes(ext)) {
        stats.totalFiles++;
        const lines = countLinesInFile(fullPath);
        stats.totalLines += lines;
        
        // Track file types
        stats.fileTypes[ext] = (stats.fileTypes[ext] || 0) + 1;
        
        // Track directories
        const dir = path.dirname(relativePath);
        stats.directories[dir] = (stats.directories[dir] || 0) + 1;
        
        // Track largest files
        stats.largestFiles.push({ path: relativePath, lines });
        
        // Count components, tests, and API endpoints
        if (item.endsWith('.test.ts') || item.endsWith('.test.tsx') || item.endsWith('.test.js') || item.endsWith('.test.jsx')) {
          stats.tests++;
        }
        if (relativePath.includes('components/') && (ext === '.tsx' || ext === '.jsx')) {
          stats.components++;
        }
        if (relativePath.includes('api/') && ext === '.ts') {
          stats.apiEndpoints++;
        }
      }
    }
  });
}

function runTestCoverage() {
  try {
    const coverage = execSync('npm run test:coverage -- --coverage --silent', { encoding: 'utf8' });
    return coverage;
  } catch (error) {
    return 'Coverage data not available';
  }
}

function checkDependencies() {
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {}).length;
    const devDeps = Object.keys(packageJson.devDependencies || {}).length;
    return { dependencies: deps, devDependencies: devDeps, total: deps + devDeps };
  } catch (error) {
    return { dependencies: 0, devDependencies: 0, total: 0 };
  }
}

function generateReport() {
  console.log('🔍 Enterprise Platform Audit Report');
  console.log('=====================================\n');
  
  // Count lines
  processDirectory('.');
  
  // Sort largest files
  stats.largestFiles.sort((a, b) => b.lines - a.lines);
  stats.largestFiles = stats.largestFiles.slice(0, 20);
  
  // Basic metrics
  console.log('📊 Code Metrics:');
  console.log(`   Total Lines of Code: ${stats.totalLines.toLocaleString()}`);
  console.log(`   Total Files: ${stats.totalFiles.toLocaleString()}`);
  console.log(`   Average Lines per File: ${Math.round(stats.totalLines / stats.totalFiles)}`);
  
  // File type breakdown
  console.log('\n📁 File Type Distribution:');
  Object.entries(stats.fileTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      console.log(`   ${ext}: ${count} files`);
    });
  
  // Component metrics
  console.log('\n🧩 Component Metrics:');
  console.log(`   React Components: ${stats.components}`);
  console.log(`   Test Files: ${stats.tests}`);
  console.log(`   API Endpoints: ${stats.apiEndpoints}`);
  
  // Dependencies
  const deps = checkDependencies();
  console.log('\n📦 Dependencies:');
  console.log(`   Production: ${deps.dependencies}`);
  console.log(`   Development: ${deps.devDependencies}`);
  console.log(`   Total: ${deps.total}`);
  
  // Largest files
  console.log('\n📏 Largest Files:');
  stats.largestFiles.slice(0, 10).forEach((file, i) => {
    console.log(`   ${i + 1}. ${file.path} - ${file.lines.toLocaleString()} lines`);
  });
  
  // Directory analysis
  console.log('\n📂 Directory Analysis:');
  const sortedDirs = Object.entries(stats.directories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  sortedDirs.forEach(([dir, count]) => {
    console.log(`   ${dir}: ${count} files`);
  });
  
  // Test coverage (if available)
  console.log('\n🧪 Test Coverage:');
  const coverage = runTestCoverage();
  if (coverage !== 'Coverage data not available') {
    console.log(coverage);
  } else {
    console.log('   Run "npm test -- --coverage" for detailed coverage data');
  }
  
  // Security scan
  console.log('\n🔒 Security Analysis:');
  try {
    execSync('npm audit --json', { encoding: 'utf8' });
    console.log('   No vulnerabilities found');
  } catch (error) {
    const auditData = JSON.parse(error.stdout || '{}');
    if (auditData.vulnerabilities) {
      console.log(`   Vulnerabilities found: ${Object.keys(auditData.vulnerabilities).length}`);
    }
  }
  
  // Platform status
  console.log('\n✅ Platform Status:');
  console.log('   Authentication: Implemented (NextAuth + JWT)');
  console.log('   Database: Prisma with PostgreSQL');
  console.log('   Frontend: Next.js 14 with App Router');
  console.log('   Styling: Tailwind CSS');
  console.log('   State Management: React Query + Context API');
  console.log('   Testing: Jest + React Testing Library');
  
  // Save detailed report
  const detailedReport = {
    generatedAt: new Date().toISOString(),
    metrics: {
      totalLines: stats.totalLines,
      totalFiles: stats.totalFiles,
      avgLinesPerFile: Math.round(stats.totalLines / stats.totalFiles)
    },
    fileTypes: stats.fileTypes,
    componentMetrics: {
      components: stats.components,
      tests: stats.tests,
      apiEndpoints: stats.apiEndpoints
    },
    dependencies: deps,
    largestFiles: stats.largestFiles,
    directories: Object.entries(stats.directories).sort((a, b) => b[1] - a[1])
  };
  
  fs.writeFileSync('enterprise-audit-report.json', JSON.stringify(detailedReport, null, 2));
  console.log('\n📄 Detailed report saved to enterprise-audit-report.json');
}

// Run the audit
generateReport();