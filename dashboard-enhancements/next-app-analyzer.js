// Next.js App Analyzer
// This script analyzes a Next.js project to identify issues, audit code quality, and suggest improvements
const fs = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

// Configuration
const config = {
  rootDir: process.cwd(),
  appDir: path.join(process.cwd(), 'src/app'),
  componentsDir: path.join(process.cwd(), 'src/components'),
  libDir: path.join(process.cwd(), 'src/lib'),
  excludeDirs: ['node_modules', '.next', '.git', 'out', 'dist'],
  maxComponentLines: 300,
  maxFunctionLines: 50,
  maxComplexity: 10
};

// Main analysis function
async function analyzeApp() {
  console.log('🔍 Starting PropIE AWS App analysis...\n');

  try {
    // 1. Project structure analysis
    console.log('📂 Analyzing project structure...');
    const projectStructure = analyzeProjectStructure();
    console.log(`Found ${projectStructure.fileCount} files in the project.`);
    console.log(`Top-level directories: ${projectStructure.topLevelDirs.join(', ')}\n`);

    // 2. Component analysis
    console.log('🧩 Analyzing React components...');
    const componentAnalysis = await analyzeComponents();
    console.log(`Analyzed ${componentAnalysis.totalComponents} components.`);
    console.log(`Found ${componentAnalysis.largeComponents.length} large components (> ${config.maxComponentLines} lines).`);
    console.log(`Client/Server component ratio: ${componentAnalysis.clientComponentCount}/${componentAnalysis.serverComponentCount}\n`);

    // 3. AWS Amplify usage analysis
    console.log('☁️ Analyzing AWS Amplify usage...');
    const amplifyAnalysis = await analyzeAmplifyUsage();
    console.log(`Found ${amplifyAnalysis.amplifyImports} Amplify imports.`);
    console.log(`Authentication usage: ${amplifyAnalysis.authUsage ? 'Yes' : 'No'}`);
    console.log(`API usage: ${amplifyAnalysis.apiUsage ? 'Yes' : 'No'}`);
    console.log(`Storage usage: ${amplifyAnalysis.storageUsage ? 'Yes' : 'No'}\n`);

    // 4. Performance analysis
    console.log('⚡ Analyzing performance patterns...');
    const performanceAnalysis = await analyzePerformance();
    console.log(`Found ${performanceAnalysis.memoizationCount} memoized components.`);
    console.log(`Found ${performanceAnalysis.lazyLoadCount} lazy-loaded components.`);
    console.log(`Found ${performanceAnalysis.cachingImplementations} caching implementations.\n`);

    // 5. Security analysis
    console.log('🔒 Analyzing security patterns...');
    const securityAnalysis = await analyzeSecurity();
    console.log(`Authentication checks: ${securityAnalysis.authCheckCount}`);
    console.log(`Input validation count: ${securityAnalysis.inputValidationCount}`);
    console.log(`Content security implementation: ${securityAnalysis.cspImplemented ? 'Yes' : 'No'}\n`);

    // 6. TypeScript errors
    console.log('�� Checking TypeScript errors...');
    const tsErrors = await checkTypeScriptErrors();
    console.log(`Found ${tsErrors.totalErrors} TypeScript errors.\n`);

    // Generate report
    generateReport({
      projectStructure,
      componentAnalysis,
      amplifyAnalysis,
      performanceAnalysis,
      securityAnalysis,
      tsErrors
    });

  } catch (error) {
    console.error('Error during analysis:', error);
  }
}

// Analyze project structure
function analyzeProjectStructure() {
  const fileCount = countFiles(config.rootDir);
  const topLevelDirs = fs.readdirSync(config.rootDir)
    .filter(item => 
      fs.statSync(path.join(config.rootDir, item)).isDirectory() && 
      !config.excludeDirs.includes(item));

  return {
    fileCount,
    topLevelDirs
  };
}

// Count files recursively
function countFiles(directory) {
  let count = 0;
  const items = fs.readdirSync(directory);
  
  for (const item of items) {
    const itemPath = path.join(directory, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    
    if (isDirectory && !config.excludeDirs.includes(item)) {
      count += countFiles(itemPath);
    } else if (!isDirectory) {
      count++;
    }
  }
  
  return count;
}

// Analyze React components
async function analyzeComponents() {
  let totalComponents = 0;
  let clientComponentCount = 0;
  let serverComponentCount = 0;
  let largeComponents = [];
  
  // Function to analyze component files
  async function analyzeComponentFiles(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          await analyzeComponentFiles(itemPath);
        } else if (item.match(/\.(jsx|tsx)$/)) {
          totalComponents++;
          
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          const lines = content.split('\n');
          
          // Check if it's a client component
          if (content.includes("'use client'") || content.includes('"use client"')) {
            clientComponentCount++;
          } else {
            serverComponentCount++;
          }
          
          // Check for large components
          if (lines.length > config.maxComponentLines) {
            largeComponents.push({
              path: itemPath,
              lineCount: lines.length
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing components in ${directory}:`, error);
    }
  }
  
  // Analyze components in app and components directories
  await analyzeComponentFiles(config.appDir);
  await analyzeComponentFiles(config.componentsDir);
  
  return {
    totalComponents,
    clientComponentCount,
    serverComponentCount,
    largeComponents
  };
}

// Analyze AWS Amplify usage
async function analyzeAmplifyUsage() {
  let amplifyImports = 0;
  let authUsage = false;
  let apiUsage = false;
  let storageUsage = false;
  
  // Function to check Amplify usage in files
  async function checkAmplifyUsage(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          await checkAmplifyUsage(itemPath);
        } else if (item.match(/\.(js|jsx|ts|tsx)$/)) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check Amplify imports
          if (content.includes('aws-amplify') || content.includes('@aws-amplify')) {
            amplifyImports++;
            
            // Check specific Amplify services
            if (content.includes('amplify/auth') || content.includes('Auth.')) {
              authUsage = true;
            }
            if (content.includes('amplify/api') || content.includes('API.')) {
              apiUsage = true;
            }
            if (content.includes('amplify/storage') || content.includes('Storage.')) {
              storageUsage = true;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing Amplify usage in ${directory}:`, error);
    }
  }
  
  // Check Amplify usage across the project
  await checkAmplifyUsage(config.rootDir);
  
  return {
    amplifyImports,
    authUsage,
    apiUsage,
    storageUsage
  };
}

// Analyze performance patterns
async function analyzePerformance() {
  let memoizationCount = 0;
  let lazyLoadCount = 0;
  let cachingImplementations = 0;
  
  // Function to check performance patterns in files
  async function checkPerformancePatterns(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          await checkPerformancePatterns(itemPath);
        } else if (item.match(/\.(js|jsx|ts|tsx)$/)) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for memoization
          if (content.includes('React.memo') || content.includes('useMemo') || 
              content.includes('useCallback') || content.includes('memo(')) {
            memoizationCount++;
          }
          
          // Check for lazy loading
          if (content.includes('React.lazy') || content.includes('lazy(') || 
              content.includes('dynamic(') || content.includes('next/dynamic')) {
            lazyLoadCount++;
          }
          
          // Check for caching implementations
          if (content.includes('useQuery') || content.includes('QueryClient') || 
              content.includes('safeCache') || content.includes('dataCache') ||
              content.includes('asyncSafeCache') || content.includes('serverCache')) {
            cachingImplementations++;
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing performance patterns in ${directory}:`, error);
    }
  }
  
  // Check performance patterns across the project
  await checkPerformancePatterns(config.rootDir);
  
  return {
    memoizationCount,
    lazyLoadCount,
    cachingImplementations
  };
}

// Analyze security patterns
async function analyzeSecurity() {
  let authCheckCount = 0;
  let inputValidationCount = 0;
  let cspImplemented = false;
  
  // Function to check security patterns in files
  async function checkSecurityPatterns(directory) {
    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const isDirectory = fs.statSync(itemPath).isDirectory();
        
        if (isDirectory && !config.excludeDirs.includes(item)) {
          await checkSecurityPatterns(itemPath);
        } else if (item.match(/\.(js|jsx|ts|tsx)$/)) {
          // Read file content
          const content = fs.readFileSync(itemPath, 'utf8');
          
          // Check for authentication checks
          if (content.includes('isAuthenticated') || content.includes('requireAuth') || 
              content.includes('useAuth') || content.includes('getServerUser') ||
              content.includes('getCurrentUser') || content.includes('authContext')) {
            authCheckCount++;
          }
          
          // Check for input validation
          if (content.includes('validate') || content.includes('zodResolver') || 
              content.includes('sanitize') || content.includes('useForm') ||
              content.includes('validateInput') || content.includes('schema.parse')) {
            inputValidationCount++;
          }
          
          // Check for CSP implementation
          if (content.includes('Content-Security-Policy') || content.includes('contentSecurityPolicy') || 
              content.includes('CSP') && content.includes('headers')) {
            cspImplemented = true;
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing security patterns in ${directory}:`, error);
    }
  }
  
  // Check security patterns across the project
  await checkSecurityPatterns(config.rootDir);
  
  return {
    authCheckCount,
    inputValidationCount,
    cspImplemented
  };
}

// Check TypeScript errors
async function checkTypeScriptErrors() {
  let totalErrors = 0;
  let errorsByFile = [];
  
  try {
    // Run TypeScript compiler to check for errors
    const { stdout, stderr } = await exec('npx tsc --noEmit');
    
    // Parse TypeScript errors
    if (stderr) {
      const errors = stderr.split('\n').filter(line => line.includes('error TS'));
      totalErrors = errors.length;
      
      // Group errors by file
      const fileErrors = {};
      errors.forEach(error => {
        const match = error.match(/^(.+)\((\d+),(\d+)\): error TS(\d+): (.+)$/);
        if (match) {
          const [, file, line, column, code, message] = match;
          if (!fileErrors[file]) {
            fileErrors[file] = [];
          }
          fileErrors[file].push({ line: parseInt(line), column: parseInt(column), code, message });
        }
      });
      
      // Convert to array
      errorsByFile = Object.entries(fileErrors).map(([file, errors]) => ({
        file,
        errors
      }));
    }
  } catch (error) {
    // TypeScript errors are in stdout/stderr, but exec throws an error
    if (error.stdout || error.stderr) {
      const errorOutput = error.stdout || error.stderr;
      const errors = errorOutput.split('\n').filter(line => line.includes('error TS'));
      totalErrors = errors.length;
      
      // Group errors by file
      const fileErrors = {};
      errors.forEach(error => {
        const match = error.match(/^(.+)\((\d+),(\d+)\): error TS(\d+): (.+)$/);
        if (match) {
          const [, file, line, column, code, message] = match;
          if (!fileErrors[file]) {
            fileErrors[file] = [];
          }
          fileErrors[file].push({ line: parseInt(line), column: parseInt(column), code, message });
        }
      });
      
      // Convert to array
      errorsByFile = Object.entries(fileErrors).map(([file, errors]) => ({
        file,
        errors
      }));
    } else {
      console.error('Error running TypeScript compiler:', error);
    }
  }
  
  return {
    totalErrors,
    errorsByFile
  };
}

// Generate analysis report
function generateReport(analysisResults) {
  console.log('\n📊 PropIE AWS App Analysis Report\n');
  console.log('==================================');
  
  // Project structure
  console.log('\n📂 Project Structure:');
  console.log(`- Total files: ${analysisResults.projectStructure.fileCount}`);
  console.log(`- Top-level directories: ${analysisResults.projectStructure.topLevelDirs.join(', ')}`);
  
  // Component analysis
  console.log('\n🧩 Component Analysis:');
  console.log(`- Total components: ${analysisResults.componentAnalysis.totalComponents}`);
  console.log(`- Client components: ${analysisResults.componentAnalysis.clientComponentCount}`);
  console.log(`- Server components: ${analysisResults.componentAnalysis.serverComponentCount}`);
  
  if (analysisResults.componentAnalysis.largeComponents.length > 0) {
    console.log('\n⚠️ Large Components:');
    analysisResults.componentAnalysis.largeComponents.forEach(component => {
      console.log(`- ${component.path.replace(config.rootDir, '')} (${component.lineCount} lines)`);
    });
  }
  
  // AWS Amplify analysis
  console.log('\n☁️ AWS Amplify Usage:');
  console.log(`- Amplify imports: ${analysisResults.amplifyAnalysis.amplifyImports}`);
  console.log(`- Authentication: ${analysisResults.amplifyAnalysis.authUsage ? '✅' : '❌'}`);
  console.log(`- API: ${analysisResults.amplifyAnalysis.apiUsage ? '✅' : '❌'}`);
  console.log(`- Storage: ${analysisResults.amplifyAnalysis.storageUsage ? '✅' : '❌'}`);
  
  // Performance analysis
  console.log('\n⚡ Performance Patterns:');
  console.log(`- Memoization usage: ${analysisResults.performanceAnalysis.memoizationCount}`);
  console.log(`- Lazy loading: ${analysisResults.performanceAnalysis.lazyLoadCount}`);
  console.log(`- Caching implementations: ${analysisResults.performanceAnalysis.cachingImplementations}`);
  
  // Security analysis
  console.log('\n🔒 Security Patterns:');
  console.log(`- Authentication checks: ${analysisResults.securityAnalysis.authCheckCount}`);
  console.log(`- Input validation: ${analysisResults.securityAnalysis.inputValidationCount}`);
  console.log(`- Content Security Policy: ${analysisResults.securityAnalysis.cspImplemented ? '✅' : '❌'}`);
  
  // TypeScript errors
  console.log('\n📋 TypeScript Errors:');
  console.log(`- Total errors: ${analysisResults.tsErrors.totalErrors}`);
  
  if (analysisResults.tsErrors.errorsByFile && analysisResults.tsErrors.errorsByFile.length > 0) {
    console.log('\n⚠️ Files with TypeScript errors:');
    analysisResults.tsErrors.errorsByFile.slice(0, 5).forEach(fileError => {
      console.log(`- ${fileError.file.replace(config.rootDir, '')} (${fileError.errors.length} errors)`);
    });
    if (analysisResults.tsErrors.errorsByFile.length > 5) {
      console.log(`  ... and ${analysisResults.tsErrors.errorsByFile.length - 5} more files with errors`);
    }
  }
  
  // Recommendations
  console.log('\n🛠️ Recommendations:');
  
  if (analysisResults.tsErrors.totalErrors > 0) {
    console.log('- Fix TypeScript errors to improve code quality and prevent runtime issues.');
  }
  
  if (analysisResults.componentAnalysis.largeComponents.length > 0) {
    console.log('- Refactor large components into smaller, more focused components for better maintainability.');
  }
  
  if (!analysisResults.securityAnalysis.cspImplemented) {
    console.log('- Implement Content Security Policy to enhance application security.');
  }
  
  if (analysisResults.performanceAnalysis.memoizationCount < analysisResults.componentAnalysis.totalComponents * 0.1) {
    console.log('- Increase memoization usage to prevent unnecessary re-renders.');
  }
  
  if (analysisResults.performanceAnalysis.lazyLoadCount < 5) {
    console.log('- Implement more lazy loading for large components to improve initial load time.');
  }
  
  console.log('\n==================================');
  console.log('\n📝 Report generated successfully.');
}

// Run the analysis
analyzeApp();