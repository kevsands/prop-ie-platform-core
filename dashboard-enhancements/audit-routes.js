/**
 * Next.js Route Auditor
 * 
 * This script scans your Next.js project to identify:
 * 1. Dynamic route conflicts (same path with different parameter names)
 * 2. Components using dynamic route parameters
 * 3. Mock data usage
 * 
 * Usage:
 * node audit-routes.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd(); // Current directory
const ROUTE_DIRS = [
  path.join(PROJECT_ROOT, 'app'),
  path.join(PROJECT_ROOT, 'pages'),
  path.join(PROJECT_ROOT, 'src/app'),
  path.join(PROJECT_ROOT, 'src/pages')
];
const COMPONENT_DIRS = [
  path.join(PROJECT_ROOT, 'src/components'),
  path.join(PROJECT_ROOT, 'components')
];

// Results storage
const dynamicRoutes = {};
const routeUsages = {};
const mockDataFiles = [];
const mockDataUsages = [];

// Helper function to check if path exists
function pathExists(p) {
  try {
    fs.accessSync(p);
    return true;
  } catch (err) {
    return false;
  }
}

// Scan for dynamic routes
function scanForDynamicRoutes(dir, relativePath = '') {
  if (!pathExists(dir)) return;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.join(relativePath, item.name);
    
    if (item.isDirectory()) {
      // Check if this is a dynamic route folder
      if (item.name.startsWith('[') && item.name.endsWith(']')) {
        const paramName = item.name.slice(1, -1);
        const routeBase = relativePath;
        
        if (!dynamicRoutes[routeBase]) {
          dynamicRoutes[routeBase] = [];
        }
        
        dynamicRoutes[routeBase].push({
          path: relPath,
          paramName,
          fullPath
        });
      }
      
      // Continue recursion
      scanForDynamicRoutes(fullPath, relPath);
    } else {
      // Check if this is a dynamic route file (.js, .jsx, .ts, .tsx)
      const ext = path.extname(item.name);
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext) && item.name.includes('[') && item.name.includes(']')) {
        const paramMatch = item.name.match(/\[([^\]]+)\]/);
        if (paramMatch) {
          const paramName = paramMatch[1];
          const routeBase = relativePath;
          
          if (!dynamicRoutes[routeBase]) {
            dynamicRoutes[routeBase] = [];
          }
          
          dynamicRoutes[routeBase].push({
            path: relPath,
            paramName,
            fullPath
          });
        }
      }
    }
  }
}

// Scan for code using route parameters
function scanForRouteUsages(dir, relativePath = '') {
  if (!pathExists(dir)) return;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    const relPath = path.join(relativePath, item.name);
    
    if (item.isDirectory()) {
      // Continue recursion
      scanForRouteUsages(fullPath, relPath);
    } else {
      // Check for component files (.js, .jsx, .ts, .tsx)
      const ext = path.extname(item.name);
      if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for common parameter access patterns
          const usesIdParam = content.match(/params\.id|params\['id'\]|\$\{[^}]*\.id\}|\[id\]/g);
          const usesSlugParam = content.match(/params\.slug|params\['slug'\]|\$\{[^}]*\.slug\}|\[slug\]/g);
          
          if (usesIdParam || usesSlugParam) {
            routeUsages[relPath] = {
              fullPath,
              params: []
            };
            
            if (usesIdParam) routeUsages[relPath].params.push('id');
            if (usesSlugParam) routeUsages[relPath].params.push('slug');
          }
          
          // Check for mock data
          const hasMockData = 
            content.includes('mockDevelopments') || 
            content.includes('mockProperties') || 
            content.includes('MOCK_DATA') ||
            content.includes('mock data') || 
            (content.includes('mock') && content.includes('export const'));
            
          if (hasMockData) {
            mockDataUsages.push({
              path: relPath,
              fullPath
            });
          }
          
          // Check if file is a mock data file
          if (
            item.name.toLowerCase().includes('mock') || 
            item.name.toLowerCase().includes('dummy') || 
            item.name.toLowerCase().includes('fixtures')
          ) {
            mockDataFiles.push({
              path: relPath,
              fullPath
            });
          }
        } catch (err) {
          console.error(`Error reading file ${fullPath}:`, err.message);
        }
      }
    }
  }
}

// Find conflicts in dynamic routes
function findRouteConflicts() {
  const conflicts = [];
  
  Object.keys(dynamicRoutes).forEach(routeBase => {
    const routes = dynamicRoutes[routeBase];
    if (routes.length > 1) {
      // Check if there are different param names
      const paramNames = new Set(routes.map(r => r.paramName));
      if (paramNames.size > 1) {
        conflicts.push({
          routeBase,
          routes,
          paramNames: Array.from(paramNames)
        });
      }
    }
  });
  
  return conflicts;
}

// Main execution
console.log('🔍 Scanning Next.js project for routing analysis...');

// Scan route directories
ROUTE_DIRS.forEach(dir => {
  const dirName = path.basename(dir);
  if (pathExists(dir)) {
    console.log(`Scanning ${dirName} directory...`);
    scanForDynamicRoutes(dir);
  }
});

// Scan component directories
COMPONENT_DIRS.forEach(dir => {
  const dirName = path.basename(dir);
  if (pathExists(dir)) {
    console.log(`Scanning ${dirName} directory...`);
    scanForRouteUsages(dir);
  }
});

// Analyze results
const conflicts = findRouteConflicts();

// Report dynamic routes
console.log('\n📊 Dynamic Routes:');
Object.keys(dynamicRoutes).forEach(routeBase => {
  console.log(`\nRoute base: ${routeBase}`);
  dynamicRoutes[routeBase].forEach(route => {
    console.log(`  - Parameter: [${route.paramName}], Path: ${route.path}`);
  });
});

// Report conflicts
console.log('\n⚠️ Route Conflicts:');
if (conflicts.length === 0) {
  console.log('No route conflicts found.');
} else {
  conflicts.forEach(conflict => {
    console.log(`\nConflict in route base: ${conflict.routeBase}`);
    console.log(`Different parameter names used: ${conflict.paramNames.join(', ')}`);
    console.log('Routes:');
    conflict.routes.forEach(route => {
      console.log(`  - ${route.path} (uses '${route.paramName}')`);
    });
  });
}

// Report param usages
console.log('\n🔗 Route Parameter Usages:');
if (Object.keys(routeUsages).length === 0) {
  console.log('No explicit parameter usages found in components.');
} else {
  Object.keys(routeUsages).forEach(filePath => {
    const usage = routeUsages[filePath];
    console.log(`\nFile: ${filePath}`);
    console.log(`Parameters used: ${usage.params.join(', ')}`);
  });
}

// Report mock data
console.log('\n🧪 Mock Data:');
console.log('\nMock Data Files:');
if (mockDataFiles.length === 0) {
  console.log('No dedicated mock data files found.');
} else {
  mockDataFiles.forEach(file => {
    console.log(`  - ${file.path}`);
  });
}

console.log('\nFiles Using Mock Data:');
if (mockDataUsages.length === 0) {
  console.log('No files using mock data were found.');
} else {
  mockDataUsages.forEach(usage => {
    console.log(`  - ${usage.path}`);
  });
}

// Provide recommendations
console.log('\n🚀 Recommendations:');

if (conflicts.length > 0) {
  console.log('\n1. Fix Route Conflicts:');
  conflicts.forEach(conflict => {
    // Determine most used parameter name to recommend
    const paramCounts = {};
    conflict.paramNames.forEach(name => {
      paramCounts[name] = conflict.routes.filter(r => r.paramName === name).length;
    });
    
    const [mostUsedParam, count] = Object.entries(paramCounts).sort((a, b) => b[1] - a[1])[0];
    
    console.log(`   - For route '${conflict.routeBase}', standardize on parameter name '${mostUsedParam}'`);
    conflict.routes.forEach(route => {
      if (route.paramName !== mostUsedParam) {
        console.log(`     Change '${route.path}' to use '[${mostUsedParam}]' instead of '[${route.paramName}]'`);
      }
    });
  });
}

// Recommendations for mock data
if (mockDataUsages.length > 0) {
  console.log('\n2. Mock Data Strategy:');
  console.log('   - Create a service layer to abstract data fetching:');
  console.log('     * src/services/api.ts - For real API calls');
  console.log('     * src/services/mockApi.ts - For mock implementations');
  console.log('   - Use environment variables to toggle between mock and real data');
  console.log('   - Implement a consistent interface for both real and mock data services');
}

console.log('\n✅ Route audit complete!');