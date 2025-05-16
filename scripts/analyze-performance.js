// Next.js Performance Analyzer
// This script analyzes performance patterns, bottlenecks, and optimization opportunities

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  rootDir: process.cwd(),
  srcDir: path.join(process.cwd(), 'src'),
  appDir: path.join(process.cwd(), 'src/app'),
  componentsDir: path.join(process.cwd(), 'src/components'),
  excludeDirs: ['node_modules', '.next', '.git', 'out', 'dist'],
  knownBottlenecks: [
    'CustomizationPage',
    'BuyerDashboard',
  ],
  largeBundleThreshold: 100 * 1024, // 100KB
  largeComponentThreshold: 300, // 300 lines
};

// Main analysis function
async function analyzePerformance() {
  console.log('🔍 Starting Next.js Performance Analysis...\n');

  try {
    // 1. Analyze component optimization
    console.log('🧩 Analyzing component optimization...');
    const componentOptimization = analyzeComponentOptimization();
    printComponentOptimizationSummary(componentOptimization);

    // 2. Check for known bottlenecks
    console.log('\n🚧 Checking for known bottlenecks...');
    const bottlenecks = findKnownBottlenecks();
    printBottlenecksSummary(bottlenecks);

    // 3. Analyze caching implementation
    console.log('\n💾 Analyzing caching implementation...');
    const cachingAnalysis = analyzeCachingImplementation();
    printCachingAnalysisSummary(cachingAnalysis);

    // 4. Check code splitting and lazy loading
    console.log('\n📦 Checking code splitting and lazy loading...');
    const codeSplittingAnalysis = analyzeCodeSplitting();
    printCodeSplittingAnalysisSummary(codeSplittingAnalysis);

    // 5. Analyze API data fetching
    console.log('\n🔄 Analyzing API data fetching patterns...');
    const apiFetchingAnalysis = analyzeApiFetching();
    printApiFetchingAnalysisSummary(apiFetchingAnalysis);

    // 6. Generate recommendations
    console.log('\n🛠️ Generating performance recommendations...');
    generateRecommendations({
      componentOptimization,
      bottlenecks,
      cachingAnalysis,
      codeSplittingAnalysis,
      apiFetchingAnalysis
    });

  } catch (error) {
    console.error('Error during analysis:', error);
  }
}

// Analyze component optimization
function analyzeComponentOptimization() {
  let totalComponents = 0;
  let memoizedComponents = 0;
  let useMemoUsage = 0;
  let useCallbackUsage = 0;
  let largeComponents = [];
  
  function searchDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          searchDirectory(itemPath);
        } else if (
          item.match(/\.(jsx|tsx)$/) && 
          !item.includes('.test.') && 
          !item.includes('.spec.')
        ) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          const lines = content.split('\n');
          
          // Check if it's a component
          if (
            (content.includes('export default function') || 
             content.includes('export function') || 
             content.includes('export const')) &&
            content.includes('return (')
          ) {
            totalComponents++;
            
            // Check for memoization
            if (content.includes('React.memo') || content.includes('memo(')) {
              memoizedComponents++;
            }
            
            // Check for useMemo usage
            const useMemoMatches = content.match(/useMemo\(/g);
            if (useMemoMatches) {
              useMemoUsage += useMemoMatches.length;
            }
            
            // Check for useCallback usage
            const useCallbackMatches = content.match(/useCallback\(/g);
            if (useCallbackMatches) {
              useCallbackUsage += useCallbackMatches.length;
            }
            
            // Check for large components
            if (lines.length > config.largeComponentThreshold) {
              largeComponents.push({
                path: itemPath.replace(config.rootDir, ''),
                name: path.basename(itemPath, path.extname(itemPath)),
                lineCount: lines.length
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing components in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.componentsDir);
  searchDirectory(config.appDir);
  
  // Sort large components by line count
  largeComponents.sort((a, b) => b.lineCount - a.lineCount);
  
  return {
    totalComponents,
    memoizedComponents,
    memoizationRate: totalComponents > 0 ? (memoizedComponents / totalComponents) : 0,
    useMemoUsage,
    useCallbackUsage,
    largeComponents
  };
}

// Print component optimization summary
function printComponentOptimizationSummary(optimization) {
  console.log(`Found ${optimization.totalComponents} components total`);
  console.log(`Memoized components: ${optimization.memoizedComponents} (${Math.round(optimization.memoizationRate * 100)}%)`);
  console.log(`useMemo usage: ${optimization.useMemoUsage} instances`);
  console.log(`useCallback usage: ${optimization.useCallbackUsage} instances`);
  
  if (optimization.largeComponents.length > 0) {
    console.log(`\nLarge components (> ${config.largeComponentThreshold} lines):`);
    optimization.largeComponents.slice(0, 5).forEach(component => {
      console.log(`- ${component.name} (${component.lineCount} lines): ${component.path}`);
    });
    
    if (optimization.largeComponents.length > 5) {
      console.log(`  ... and ${optimization.largeComponents.length - 5} more large components`);
    }
  }
}

// Find known bottlenecks
function findKnownBottlenecks() {
  const foundBottlenecks = [];
  
  function searchDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          searchDirectory(itemPath);
        } else if (
          item.match(/\.(jsx|tsx)$/) && 
          !item.includes('.test.') && 
          !item.includes('.spec.')
        ) {
          // Check if this is a known bottleneck
          const componentName = path.basename(itemPath, path.extname(itemPath));
          
          if (config.knownBottlenecks.includes(componentName) || 
              config.knownBottlenecks.some(name => componentName.includes(name))) {
            
            // Read file content
            const content = fs.readFileSync(itemPath, 'utf8');
            const lines = content.split('\n');
            
            // Check for potential issues
            const issues = [];
            
            // Check for excessive state
            const stateMatches = content.match(/useState\(/g);
            const stateCount = stateMatches ? stateMatches.length : 0;
            
            if (stateCount > 5) {
              issues.push(`Excessive state usage (${stateCount} useState calls)`);
            }
            
            // Check for large render methods
            const returnIndex = lines.findIndex(line => line.trim().startsWith('return ('));
            if (returnIndex !== -1) {
              const renderLines = lines.length - returnIndex;
              if (renderLines > 100) {
                issues.push(`Large render method (${renderLines} lines)`);
              }
            }
            
            // Check for expensive operations
            if (content.includes('map(') && !content.includes('useMemo')) {
              issues.push('Unmemoized list rendering');
            }
            
            // Check for nested maps
            if (content.includes('.map(') && content.includes('.map(', content.indexOf('.map(') + 5)) {
              issues.push('Nested mapping operations');
            }
            
            foundBottlenecks.push({
              path: itemPath.replace(config.rootDir, ''),
              name: componentName,
              lineCount: lines.length,
              issues
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error finding bottlenecks in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.componentsDir);
  searchDirectory(config.appDir);
  
  return foundBottlenecks;
}

// Print bottlenecks summary
function printBottlenecksSummary(bottlenecks) {
  if (bottlenecks.length === 0) {
    console.log('No known bottlenecks found');
    return;
  }
  
  console.log(`Found ${bottlenecks.length} known bottlenecks:`);
  
  bottlenecks.forEach(bottleneck => {
    console.log(`\n- ${bottleneck.name} (${bottleneck.lineCount} lines): ${bottleneck.path}`);
    
    if (bottleneck.issues.length > 0) {
      console.log('  Issues:');
      bottleneck.issues.forEach(issue => {
        console.log(`  • ${issue}`);
      });
    } else {
      console.log('  No specific issues identified');
    }
  });
}

// Analyze caching implementation
function analyzeCachingImplementation() {
  let safeCacheUsage = 0;
  let dataCacheUsage = 0;
  let tanstackQueryUsage = 0;
  let useSWRUsage = 0;
  let amplifyApiCacheUsage = 0;
  let customCacheImplementations = [];
  
  function searchDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          searchDirectory(itemPath);
        } else if (
          item.match(/\.(js|jsx|ts|tsx)$/) && 
          !item.includes('.test.') && 
          !item.includes('.spec.')
        ) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for caching implementations
          if (content.includes('safeCache')) {
            safeCacheUsage++;
          }
          
          if (content.includes('dataCache')) {
            dataCacheUsage++;
          }
          
          if (content.includes('useQuery') || content.includes('QueryClient')) {
            tanstackQueryUsage++;
          }
          
          if (content.includes('useSWR')) {
            useSWRUsage++;
          }
          
          if (content.includes('API.graphql') && content.includes('cachePolicy')) {
            amplifyApiCacheUsage++;
          }
          
          // Check for custom cache implementations
          if (
            (content.includes('cache') || content.includes('Cache')) &&
            (content.includes('class') || content.includes('function')) &&
            (content.includes('get(') || content.includes('set(') || content.includes('delete('))
          ) {
            customCacheImplementations.push({
              path: itemPath.replace(config.rootDir, ''),
              name: path.basename(itemPath, path.extname(itemPath))
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing caching in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  return {
    safeCacheUsage,
    dataCacheUsage,
    tanstackQueryUsage,
    useSWRUsage,
    amplifyApiCacheUsage,
    customCacheImplementations,
    totalCacheImplementations: safeCacheUsage + dataCacheUsage + tanstackQueryUsage + 
                              useSWRUsage + amplifyApiCacheUsage + customCacheImplementations.length
  };
}

// Print caching analysis summary
function printCachingAnalysisSummary(analysis) {
  console.log(`Total cache implementations: ${analysis.totalCacheImplementations}`);
  console.log(`- safeCache usage: ${analysis.safeCacheUsage}`);
  console.log(`- dataCache usage: ${analysis.dataCacheUsage}`);
  console.log(`- TanStack Query usage: ${analysis.tanstackQueryUsage}`);
  console.log(`- SWR usage: ${analysis.useSWRUsage}`);
  console.log(`- Amplify API cache usage: ${analysis.amplifyApiCacheUsage}`);
  
  if (analysis.customCacheImplementations.length > 0) {
    console.log(`\nCustom cache implementations: ${analysis.customCacheImplementations.length}`);
    analysis.customCacheImplementations.forEach(implementation => {
      console.log(`- ${implementation.name}: ${implementation.path}`);
    });
  }
}

// Analyze code splitting
function analyzeCodeSplitting() {
  let dynamicImports = 0;
  let lazyComponents = 0;
  let nextDynamicUsage = 0;
  let suspenseUsage = 0;
  let largeComponents = [];
  
  function searchDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          searchDirectory(itemPath);
        } else if (
          item.match(/\.(js|jsx|ts|tsx)$/) && 
          !item.includes('.test.') && 
          !item.includes('.spec.')
        ) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for dynamic imports
          if (content.includes('import(')) {
            dynamicImports++;
          }
          
          // Check for React.lazy usage
          if (content.includes('React.lazy') || content.includes('lazy(')) {
            lazyComponents++;
          }
          
          // Check for Next.js dynamic imports
          if (content.includes('dynamic(') || content.includes('next/dynamic')) {
            nextDynamicUsage++;
          }
          
          // Check for Suspense usage
          if (content.includes('<Suspense') || content.includes('React.Suspense')) {
            suspenseUsage++;
          }
          
          // Check for potentially large components that could be split
          if (
            (content.includes('export default function') || 
             content.includes('export function') || 
             content.includes('export const')) &&
            !content.includes('dynamic(') &&
            !content.includes('React.lazy') &&
            !content.includes('lazy(') &&
            fs.statSync(itemPath).size > config.largeBundleThreshold
          ) {
            largeComponents.push({
              path: itemPath.replace(config.rootDir, ''),
              name: path.basename(itemPath, path.extname(itemPath)),
              size: fs.statSync(itemPath).size
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing code splitting in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  // Sort large components by size
  largeComponents.sort((a, b) => b.size - a.size);
  
  return {
    dynamicImports,
    lazyComponents,
    nextDynamicUsage,
    suspenseUsage,
    largeComponents
  };
}

// Print code splitting analysis summary
function printCodeSplittingAnalysisSummary(analysis) {
  console.log('Code splitting usage:');
  console.log(`- Dynamic imports: ${analysis.dynamicImports}`);
  console.log(`- React.lazy components: ${analysis.lazyComponents}`);
  console.log(`- Next.js dynamic imports: ${analysis.nextDynamicUsage}`);
  console.log(`- Suspense boundaries: ${analysis.suspenseUsage}`);
  
  if (analysis.largeComponents.length > 0) {
    console.log(`\nLarge components that could benefit from code splitting (> ${config.largeBundleThreshold / 1024}KB):`);
    analysis.largeComponents.slice(0, 5).forEach(component => {
      console.log(`- ${component.name} (${Math.round(component.size / 1024)}KB): ${component.path}`);
    });
    
    if (analysis.largeComponents.length > 5) {
      console.log(`  ... and ${analysis.largeComponents.length - 5} more large components`);
    }
  }
}

// Analyze API data fetching
function analyzeApiFetching() {
  let serverFetchCount = 0;
  let clientFetchCount = 0;
  let useSWRCount = 0;
  let useQueryCount = 0;
  let fetchWithEffectCount = 0;
  let amplifyAPICount = 0;
  let prefetchingCount = 0;
  let parallelFetchCount = 0;
  
  function searchDirectory(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          searchDirectory(itemPath);
        } else if (
          item.match(/\.(js|jsx|ts|tsx)$/) && 
          !item.includes('.test.') && 
          !item.includes('.spec.')
        ) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check if it's a server component (no 'use client' directive)
          const isServerComponent = !content.includes("'use client'") && !content.includes('"use client"');
          
          // Check for fetch calls
          if (content.includes('fetch(')) {
            if (isServerComponent) {
              serverFetchCount++;
            } else {
              clientFetchCount++;
            }
          }
          
          // Check for data fetching patterns
          if (content.includes('useSWR(')) {
            useSWRCount++;
          }
          
          if (content.includes('useQuery(')) {
            useQueryCount++;
          }
          
          // Check for fetch in useEffect
          if (content.includes('useEffect') && content.includes('fetch(')) {
            fetchWithEffectCount++;
          }
          
          // Check for Amplify API usage
          if (content.includes('API.graphql(') || content.includes('API.get(') || content.includes('API.post(')) {
            amplifyAPICount++;
          }
          
          // Check for prefetching
          if (content.includes('prefetch') || content.includes('Prefetch') || 
              content.includes('preloadQuery') || content.includes('prefetchQuery')) {
            prefetchingCount++;
          }
          
          // Check for parallel data fetching
          if (content.includes('Promise.all') && 
              (content.includes('fetch(') || content.includes('API.') || content.includes('serverFetch'))) {
            parallelFetchCount++;
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing API fetching in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  return {
    serverFetchCount,
    clientFetchCount,
    useSWRCount,
    useQueryCount,
    fetchWithEffectCount,
    amplifyAPICount,
    prefetchingCount,
    parallelFetchCount,
    totalFetchCount: serverFetchCount + clientFetchCount + useSWRCount + 
                     useQueryCount + amplifyAPICount
  };
}

// Print API fetching analysis summary
function printApiFetchingAnalysisSummary(analysis) {
  console.log('API fetching patterns:');
  console.log(`- Server-side fetch: ${analysis.serverFetchCount}`);
  console.log(`- Client-side fetch: ${analysis.clientFetchCount}`);
  console.log(`- useSWR hooks: ${analysis.useSWRCount}`);
  console.log(`- useQuery hooks: ${analysis.useQueryCount}`);
  console.log(`- useEffect fetch: ${analysis.fetchWithEffectCount}`);
  console.log(`- Amplify API calls: ${analysis.amplifyAPICount}`);
  
  console.log('\nFetch optimizations:');
  console.log(`- Data prefetching: ${analysis.prefetchingCount}`);
  console.log(`- Parallel data fetching: ${analysis.parallelFetchCount}`);
}

// Generate performance recommendations
function generateRecommendations(results) {
  const recommendations = [];
  
  // Analyze component optimization recommendations
  if (results.componentOptimization.memoizationRate < 0.3 && results.componentOptimization.totalComponents > 10) {
    recommendations.push({
      category: 'Component Optimization',
      title: 'Increase component memoization',
      description: `Only ${Math.round(results.componentOptimization.memoizationRate * 100)}% of components are memoized. Consider using React.memo for pure components to prevent unnecessary re-renders.`,
      priority: 'High',
      effort: 'Medium'
    });
  }
  
  if (results.componentOptimization.largeComponents.length > 0) {
    recommendations.push({
      category: 'Component Optimization',
      title: 'Break down large components',
      description: `Found ${results.componentOptimization.largeComponents.length} large components. Break them into smaller, focused components for better maintainability and performance.`,
      priority: 'High',
      effort: 'Medium',
      examples: results.componentOptimization.largeComponents.slice(0, 3).map(c => c.path)
    });
  }
  
  // Analyze bottleneck recommendations
  if (results.bottlenecks.length > 0) {
    recommendations.push({
      category: 'Known Bottlenecks',
      title: 'Optimize identified bottlenecks',
      description: `Address known performance bottlenecks in ${results.bottlenecks.map(b => b.name).join(', ')}.`,
      priority: 'Critical',
      effort: 'High',
      examples: results.bottlenecks.map(b => b.path)
    });
    
    // Check for specific issues in bottlenecks
    const hasExcessiveState = results.bottlenecks.some(b => b.issues.some(i => i.includes('Excessive state')));
    if (hasExcessiveState) {
      recommendations.push({
        category: 'State Management',
        title: 'Consolidate component state',
        description: 'Some components have excessive useState calls. Consider consolidating related state or using useReducer for complex state logic.',
        priority: 'Medium',
        effort: 'Medium'
      });
    }
    
    const hasLargeRender = results.bottlenecks.some(b => b.issues.some(i => i.includes('Large render method')));
    if (hasLargeRender) {
      recommendations.push({
        category: 'Rendering',
        title: 'Simplify render methods',
        description: 'Some components have very large render methods. Extract parts into separate components or helper functions.',
        priority: 'Medium',
        effort: 'Medium'
      });
    }
  }
  
  // Analyze caching recommendations
  if (results.cachingAnalysis.totalCacheImplementations < 10 && results.apiFetchingAnalysis.totalFetchCount > 20) {
    recommendations.push({
      category: 'Data Caching',
      title: 'Implement more data caching',
      description: 'The application has many data fetching operations but limited caching. Implement TanStack Query or SWR for client-side data caching.',
      priority: 'High',
      effort: 'Medium'
    });
  }
  
  // Analyze code splitting recommendations
  if (results.codeSplittingAnalysis.nextDynamicUsage < 5 && results.codeSplittingAnalysis.largeComponents.length > 0) {
    recommendations.push({
      category: 'Code Splitting',
      title: 'Implement dynamic imports for large components',
      description: 'Several large components could benefit from code splitting. Use Next.js dynamic imports to reduce initial bundle size.',
      priority: 'High',
      effort: 'Low',
      examples: results.codeSplittingAnalysis.largeComponents.slice(0, 3).map(c => c.path)
    });
  }
  
  // Analyze API fetching recommendations
  if (results.apiFetchingAnalysis.prefetchingCount < 3 && results.apiFetchingAnalysis.totalFetchCount > 15) {
    recommendations.push({
      category: 'Data Fetching',
      title: 'Implement data prefetching',
      description: 'The application has many data fetching operations but limited prefetching. Implement prefetching for critical data to improve perceived performance.',
      priority: 'Medium',
      effort: 'Medium'
    });
  }
  
  if (results.apiFetchingAnalysis.parallelFetchCount < 2 && 
      results.apiFetchingAnalysis.serverFetchCount + results.apiFetchingAnalysis.clientFetchCount > 10) {
    recommendations.push({
      category: 'Data Fetching',
      title: 'Parallelize data fetching',
      description: 'Several components perform sequential data fetching. Use Promise.all to fetch data in parallel and reduce loading times.',
      priority: 'Medium',
      effort: 'Low'
    });
  }
  
  if (results.apiFetchingAnalysis.serverFetchCount < results.apiFetchingAnalysis.clientFetchCount) {
    recommendations.push({
      category: 'Data Fetching',
      title: 'Move fetch calls to server components',
      description: 'Many fetch operations are performed on the client side. Move data fetching to server components where possible to reduce client-side JS and improve initial load time.',
      priority: 'Medium',
      effort: 'Medium'
    });
  }
  
  // Print recommendations
  console.log(`Generated ${recommendations.length} performance recommendations:`);
  
  // Group by priority
  const criticalRecs = recommendations.filter(r => r.priority === 'Critical');
  const highRecs = recommendations.filter(r => r.priority === 'High');
  const mediumRecs = recommendations.filter(r => r.priority === 'Medium');
  
  // Print critical recommendations
  if (criticalRecs.length > 0) {
    console.log('\n🔴 CRITICAL PRIORITY:');
    criticalRecs.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title} [${rec.category}]`);
      console.log(`   ${rec.description}`);
      if (rec.examples) {
        console.log(`   Examples: ${rec.examples.join(', ')}`);
      }
      console.log(`   Effort: ${rec.effort}`);
    });
  }
  
  // Print high recommendations
  if (highRecs.length > 0) {
    console.log('\n🟠 HIGH PRIORITY:');
    highRecs.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title} [${rec.category}]`);
      console.log(`   ${rec.description}`);
      if (rec.examples) {
        console.log(`   Examples: ${rec.examples.join(', ')}`);
      }
      console.log(`   Effort: ${rec.effort}`);
    });
  }
  
  // Print medium recommendations
  if (mediumRecs.length > 0) {
    console.log('\n🟡 MEDIUM PRIORITY:');
    mediumRecs.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.title} [${rec.category}]`);
      console.log(`   ${rec.description}`);
      if (rec.examples) {
        console.log(`   Examples: ${rec.examples.join(', ')}`);
      }
      console.log(`   Effort: ${rec.effort}`);
    });
  }
}

// Run the analysis
analyzePerformance();