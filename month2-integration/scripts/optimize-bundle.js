#!/usr/bin/env node

/**
 * Bundle Optimization Script
 * 
 * This script analyzes the application bundle and provides optimization recommendations.
 * It identifies:
 * - Large modules and dependencies
 * - Duplicate modules
 * - Unused dependencies
 * - Optimization opportunities for code splitting and dynamic imports
 * 
 * Usage:
 *   node scripts/optimize-bundle.js
 * 
 * Requirements:
 *   1. Run a build with ANALYZE=true first:
 *      ANALYZE=true npm run build
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// Config
const LARGE_MODULE_THRESHOLD = 50 * 1024; // 50KB
const DUPLICATE_SIZE_THRESHOLD = 20 * 1024; // 20KB
const BUNDLE_STATS_PATH = path.join(process.cwd(), '.next/analyze/client.json');
const SERVER_STATS_PATH = path.join(process.cwd(), '.next/analyze/server.json');

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function findLargeModules(stats, threshold = LARGE_MODULE_THRESHOLD) {
  const largeModules = [];
  
  function processModule(module, path = []) {
    const size = module.size || 0;
    const name = module.name || 'unnamed';
    
    // Skip certain modules that we can't optimize
    if (name.includes('webpack/runtime') || name.includes('webpack-chunk-loading')) {
      return;
    }
    
    if (size > threshold) {
      largeModules.push({
        name,
        size,
        path: [...path, name].join(' > ')
      });
    }
    
    if (module.modules) {
      module.modules.forEach(childModule => {
        processModule(childModule, [...path, name]);
      });
    }
  }
  
  stats.chunks.forEach(chunk => {
    if (chunk.modules) {
      chunk.modules.forEach(module => {
        processModule(module);
      });
    }
  });
  
  return largeModules.sort((a, b) => b.size - a.size);
}

function findDuplicateModules(stats) {
  const moduleMap = new Map();
  const duplicates = [];
  
  function processModule(module, chunkId) {
    const name = module.name;
    
    if (!name || name.includes('webpack/runtime')) {
      return;
    }
    
    if (!moduleMap.has(name)) {
      moduleMap.set(name, { 
        size: module.size, 
        chunks: [chunkId],
        isNPM: name.includes('node_modules')
      });
    } else {
      const info = moduleMap.get(name);
      if (!info.chunks.includes(chunkId)) {
        info.chunks.push(chunkId);
      }
    }
    
    if (module.modules) {
      module.modules.forEach(childModule => {
        processModule(childModule, chunkId);
      });
    }
  }
  
  stats.chunks.forEach(chunk => {
    if (chunk.modules) {
      chunk.modules.forEach(module => {
        processModule(module, chunk.id);
      });
    }
  });
  
  // Find modules in multiple chunks
  for (const [name, info] of moduleMap.entries()) {
    if (info.chunks.length > 1 && info.size > DUPLICATE_SIZE_THRESHOLD) {
      duplicates.push({
        name,
        size: info.size,
        chunks: info.chunks,
        totalDuplicatedSize: info.size * (info.chunks.length - 1),
        isNPM: info.isNPM
      });
    }
  }
  
  return duplicates.sort((a, b) => b.totalDuplicatedSize - a.totalDuplicatedSize);
}

function analyzeAmplifyUsage(stats) {
  const amplifyModules = [];
  
  function findAmplifyModules(module, path = []) {
    const name = module.name || 'unnamed';
    
    if (name.includes('node_modules/aws-amplify') || name.includes('@aws-amplify')) {
      amplifyModules.push({
        name: name.split('node_modules/')[1] || name,
        size: module.size || 0,
        path: [...path, name].join(' > ')
      });
    }
    
    if (module.modules) {
      module.modules.forEach(childModule => {
        findAmplifyModules(childModule, [...path, name]);
      });
    }
  }
  
  stats.chunks.forEach(chunk => {
    if (chunk.modules) {
      chunk.modules.forEach(module => {
        findAmplifyModules(module);
      });
    }
  });
  
  return amplifyModules.sort((a, b) => b.size - a.size);
}

function findCodeSplittingOpportunities(largeModules, duplicates) {
  const opportunities = [];
  
  // Look for large npm packages that could be code split
  const largeNpmModules = largeModules
    .filter(m => m.name.includes('node_modules/') && m.size > LARGE_MODULE_THRESHOLD)
    .filter(m => {
      // Filter out modules that aren't good candidates for code splitting
      const name = m.name.split('node_modules/')[1]?.split('/')[0] || '';
      
      // Skip core runtime modules or UI libraries
      const coreModules = ['react', 'react-dom', 'next', 'scheduler', '@swc', 'webpack'];
      return !coreModules.some(core => name.includes(core));
    });
    
  largeNpmModules.forEach(module => {
    const name = module.name.split('node_modules/')[1]?.split('/')[0] || module.name;
    
    opportunities.push({
      type: 'code-splitting',
      module: name,
      size: module.size,
      recommendation: `Use dynamic import for ${name} (${formatSize(module.size)})`
    });
  });
  
  // Identify duplicate chunks that could be extracted
  duplicates
    .filter(d => d.totalDuplicatedSize > LARGE_MODULE_THRESHOLD)
    .forEach(duplicate => {
      opportunities.push({
        type: 'duplicate',
        module: duplicate.name,
        size: duplicate.totalDuplicatedSize,
        recommendation: `Extract ${duplicate.name.split('node_modules/')[1] || duplicate.name} into a shared chunk`
      });
    });
    
  return opportunities.sort((a, b) => b.size - a.size);
}

function generateOptimizationReport(clientStats, serverStats) {
  const report = {
    clientBundle: {
      totalSize: clientStats.totalSize,
      largeModules: findLargeModules(clientStats),
      duplicateModules: findDuplicateModules(clientStats),
      amplifyModules: analyzeAmplifyUsage(clientStats)
    },
    serverBundle: {
      totalSize: serverStats.totalSize,
      largeModules: findLargeModules(serverStats),
      amplifyModules: analyzeAmplifyUsage(serverStats)
    },
    optimizationOpportunities: []
  };
  
  // Find client optimization opportunities
  const clientOpportunities = findCodeSplittingOpportunities(
    report.clientBundle.largeModules,
    report.clientBundle.duplicateModules
  );
  
  // Find server optimization opportunities
  const serverOpportunities = findCodeSplittingOpportunities(
    report.serverBundle.largeModules,
    []
  );
  
  // Combine and deduplicate opportunities
  const allOpportunities = [...clientOpportunities, ...serverOpportunities];
  const moduleSet = new Set();
  
  report.optimizationOpportunities = allOpportunities
    .filter(opportunity => {
      if (moduleSet.has(opportunity.module)) {
        return false;
      }
      moduleSet.add(opportunity.module);
      return true;
    })
    .slice(0, 20); // Top 20 opportunities
  
  return report;
}

function printReport(report) {
  console.log('\n' + chalk.bold.blue('=== Bundle Optimization Report ==='));
  
  // Print client bundle stats
  console.log('\n' + chalk.bold('Client Bundle Size: ') + formatSize(report.clientBundle.totalSize));
  
  // Print top 10 large modules
  console.log('\n' + chalk.bold.yellow('Top 10 Largest Modules:'));
  report.clientBundle.largeModules.slice(0, 10).forEach((module, i) => {
    console.log(`${i + 1}. ${chalk.cyan(module.name.split('node_modules/')[1] || module.name)} - ${formatSize(module.size)}`);
  });
  
  // Print Amplify usage
  const totalAmplifySize = report.clientBundle.amplifyModules.reduce((sum, m) => sum + m.size, 0);
  console.log('\n' + chalk.bold.yellow('AWS Amplify Usage:'));
  console.log(`Total Amplify size: ${formatSize(totalAmplifySize)} (${(totalAmplifySize / report.clientBundle.totalSize * 100).toFixed(2)}% of bundle)`);
  
  report.clientBundle.amplifyModules.slice(0, 8).forEach((module, i) => {
    console.log(`${i + 1}. ${chalk.cyan(module.name)} - ${formatSize(module.size)}`);
  });
  
  // Print optimization opportunities
  console.log('\n' + chalk.bold.green('Optimization Opportunities:'));
  report.optimizationOpportunities.forEach((opportunity, i) => {
    console.log(`${i + 1}. ${chalk.cyan(opportunity.recommendation)} - Could save up to ${formatSize(opportunity.size)}`);
  });
  
  // Print summary of recommendations
  console.log('\n' + chalk.bold.blue('=== Recommendations Summary ==='));
  console.log(chalk.yellow('1. Code Splitting:'));
  console.log('   - Use dynamic imports for large components and heavy dependencies');
  console.log('   - Lazy load non-critical features using React.lazy()');
  
  console.log(chalk.yellow('\n2. AWS Amplify Optimization:'));
  console.log('   - Use specific imports from aws-amplify submodules instead of the main package');
  console.log('   - Only import features you need (Auth, API, etc.)');
  
  console.log(chalk.yellow('\n3. Duplicate Code Elimination:'));
  console.log('   - Extract common code into shared modules');
  console.log('   - Use webpack\'s optimization.splitChunks in next.config.js');
  
  console.log(chalk.yellow('\n4. Tree Shaking:'));
  console.log('   - Use proper ES modules syntax for better tree shaking');
  console.log('   - Avoid side effects in modules to enable better optimization');
  
  // Write full report to a JSON file
  const reportPath = path.join(process.cwd(), 'bundle-optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nFull report written to: ${reportPath}`);
}

// Main execution
async function main() {
  // Check if the bundle stats exist
  if (!fs.existsSync(BUNDLE_STATS_PATH) || !fs.existsSync(SERVER_STATS_PATH)) {
    console.error(chalk.red('Error: Bundle stats files not found. Run build with ANALYZE=true first.'));
    console.error(`Expected files at:\n- ${BUNDLE_STATS_PATH}\n- ${SERVER_STATS_PATH}`);
    console.error('\nRun: ANALYZE=true npm run build');
    process.exit(1);
  }
  
  // Load and parse the stats files
  const clientStats = JSON.parse(fs.readFileSync(BUNDLE_STATS_PATH, 'utf8'));
  const serverStats = JSON.parse(fs.readFileSync(SERVER_STATS_PATH, 'utf8'));
  
  // Generate the optimization report
  const report = generateOptimizationReport(clientStats, serverStats);
  
  // Print the report
  printReport(report);
}

main().catch(error => {
  console.error(chalk.red('Error generating optimization report:'), error);
  process.exit(1);
});