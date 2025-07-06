// dependencies-analyzer.js
// Run with: node dependencies-analyzer.js

const fs = require('fs');
const path = require('path');
const madge = require('madge');
const { exec } = require('child_process');

// Configuration
const config = {
  // Root directory to analyze
  rootDir: '.',
  // File to start the analysis from (entry point)
  entryPoint: null, // Will be auto-detected if null
  // Output file name for the dependency graph visualization
  outputGraphFile: 'dependency-graph.svg',
  // Extensions to include
  extensions: ['js', 'jsx', 'ts', 'tsx'],
  // Exclude patterns
  excludeRegExp: [
    'node_modules',
    '.next',
    'build',
    'dist',
    'coverage',
    '.git'
  ],
  // Whether to analyze circular dependencies
  analyzeCircular: true,
  // Whether to analyze unused files/exports
  analyzeUnused: true,
  // Whether to generate a visual graph
  generateGraph: true
};

// Find potential entry points
function findEntryPoints() {
  const entryPoints = [];
  
  // Common Next.js entry points
  const nextEntryPoints = [
    'pages/index.js',
    'pages/index.tsx',
    'pages/_app.js',
    'pages/_app.tsx',
    'app/page.js',
    'app/page.tsx',
    'app/layout.js',
    'app/layout.tsx',
    'src/pages/index.js',
    'src/pages/index.tsx',
    'src/pages/_app.js',
    'src/pages/_app.tsx',
    'src/app/page.js',
    'src/app/page.tsx',
    'src/app/layout.js',
    'src/app/layout.tsx'
  ];
  
  // Common React entry points
  const reactEntryPoints = [
    'src/index.js',
    'src/index.tsx',
    'src/App.js',
    'src/App.tsx',
    'index.js',
    'index.tsx',
    'App.js',
    'App.tsx'
  ];
  
  // Check Next.js entry points first
  for (const entry of nextEntryPoints) {
    const entryPath = path.join(config.rootDir, entry);
    if (fs.existsSync(entryPath)) {
      entryPoints.push(entryPath);
    }
  }
  
  // If no Next.js entry points found, check React entry points
  if (entryPoints.length === 0) {
    for (const entry of reactEntryPoints) {
      const entryPath = path.join(config.rootDir, entry);
      if (fs.existsSync(entryPath)) {
        entryPoints.push(entryPath);
      }
    }
  }
  
  return entryPoints;
}

// Detect potential packages.json duplications
function analyzePackageJsonDuplication() {
  return new Promise((resolve, reject) => {
    exec('npm ls --json', (error, stdout) => {
      if (error && error.code !== 1) {
        // npm ls exits with code 1 if there are peer dependency issues, which we can ignore
        console.warn('Warning: npm ls returned an error, results may be incomplete');
      }
      
      try {
        const dependencies = JSON.parse(stdout);
        const depsMap = new Map();
        
        // Function to recursively process dependencies
        function processDeps(deps, path = []) {
          if (!deps || !deps.dependencies) return;
          
          Object.entries(deps.dependencies).forEach(([name, info]) => {
            const version = info.version;
            if (!version) return;
            
            const key = `${name}`;
            if (!depsMap.has(key)) {
              depsMap.set(key, []);
            }
            
            depsMap.get(key).push({
              version,
              path: [...path, name].join(' > ')
            });
            
            processDeps(info, [...path, name]);
          });
        }
        
        processDeps(dependencies);
        
        // Find duplicated versions
        const duplications = [];
        depsMap.forEach((entries, name) => {
          const versions = new Set(entries.map(e => e.version));
          if (versions.size > 1) {
            duplications.push({
              name,
              versions: entries.map(e => ({ version: e.version, path: e.path }))
            });
          }
        });
        
        resolve(duplications);
      } catch (err) {
        reject(err);
      }
    });
  });
}

// Compare package.json with actual imports
function comparePackageWithImports(dependencyGraph) {
  return new Promise((resolve, reject) => {
    try {
      // Read package.json
      const packageJsonPath = path.join(config.rootDir, 'package.json');
      if (!fs.existsSync(packageJsonPath)) {
        resolve({
          unusedDependencies: [],
          missingDependencies: []
        });
        return;
      }
      
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      const declaredDependencies = new Set([
        ...Object.keys(packageJson.dependencies || {}),
        ...Object.keys(packageJson.devDependencies || {})
      ]);
      
      // Get all imports from the dependency graph
      const usedDependencies = new Set();
      const missingDependencies = new Set();
      
      Object.values(dependencyGraph).forEach(deps => {
        deps.forEach(dep => {
          // Only consider external dependencies (not relative imports)
          if (!dep.startsWith('.') && !dep.startsWith('/')) {
            // Extract package name from import
            const packageName = dep.split('/')[0];
            if (packageName.startsWith('@')) {
              // Scoped package
              const scopedPackage = dep.split('/').slice(0, 2).join('/');
              usedDependencies.add(scopedPackage);
              if (!declaredDependencies.has(scopedPackage)) {
                missingDependencies.add(scopedPackage);
              }
            } else {
              usedDependencies.add(packageName);
              if (!declaredDependencies.has(packageName)) {
                missingDependencies.add(packageName);
              }
            }
          }
        });
      });
      
      // Find unused declared dependencies
      const unusedDependencies = [...declaredDependencies].filter(dep => 
        !usedDependencies.has(dep) && 
        !dep.includes('eslint') && 
        !dep.includes('prettier') && 
        !dep.includes('babel') &&
        !dep.includes('webpack') &&
        !dep.includes('typescript') &&
        !dep.includes('jest') &&
        !dep.includes('test')
      );
      
      resolve({
        unusedDependencies,
        missingDependencies: [...missingDependencies]
      });
    } catch (err) {
      reject(err);
    }
  });
}

// Generate code paths report
function generateCodePathsReport(dependencyGraph) {
  // Reverse the graph to find what files import each file
  const reversedGraph = {};
  
  Object.entries(dependencyGraph).forEach(([file, dependencies]) => {
    dependencies.forEach(dep => {
      if (!reversedGraph[dep]) {
        reversedGraph[dep] = [];
      }
      reversedGraph[dep].push(file);
    });
  });
  
  // Find leaf components (not imported by any other file)
  const leafComponents = Object.keys(dependencyGraph).filter(file => 
    !reversedGraph[file] || reversedGraph[file].length === 0
  );
  
  // Find heavily imported files (imported by many other files)
  const importCount = {};
  Object.keys(reversedGraph).forEach(file => {
    importCount[file] = (reversedGraph[file] || []).length;
  });
  
  const heavilyImported = Object.entries(importCount)
    .filter(([_, count]) => count > 5)
    .sort((a, b) => b[1] - a[1])
    .map(([file, count]) => ({ file, count }));
  
  // Find isolated modules (not importing or imported by others)
  const isolatedModules = Object.keys(dependencyGraph).filter(file => 
    (dependencyGraph[file] || []).length === 0 && 
    (!reversedGraph[file] || reversedGraph[file].length === 0)
  );
  
  return {
    leafComponents,
    heavilyImported,
    isolatedModules,
    reversedGraph
  };
}

// Main function
async function analyzeDependencies() {
  console.log('Analyzing dependencies...');
  
  // Auto-detect entry point if not specified
  if (!config.entryPoint) {
    const entryPoints = findEntryPoints();
    if (entryPoints.length > 0) {
      config.entryPoint = entryPoints[0];
      console.log(`Auto-detected entry point: ${config.entryPoint}`);
    } else {
      console.log('No specific entry point detected, analyzing all files');
    }
  }
  
  // Configure madge options
  const madgeOptions = {
    fileExtensions: config.extensions,
    excludeRegExp: config.excludeRegExp,
    baseDir: config.rootDir
  };
  
  try {
    // Create a dependency graph
    const dependencyResult = await madge(
      config.entryPoint || config.rootDir, 
      madgeOptions
    );
    
    const dependencyGraph = dependencyResult.obj();
    
    // Analyze circular dependencies
    let circularDependencies = [];
    if (config.analyzeCircular) {
      circularDependencies = dependencyResult.circular();
      console.log(`Found ${circularDependencies.length} circular dependencies`);
    }
    
    // Generate graph visualization
    if (config.generateGraph) {
      await dependencyResult.svg({
        fontSize: '12px',
        fontName: 'Arial',
        nodeShape: 'box',
        nodeStyle: 'rounded',
        rankdir: 'LR',
      }).then(output => {
        fs.writeFileSync(config.outputGraphFile, output);
        console.log(`Dependency graph written to ${config.outputGraphFile}`);
      });
    }
    
    // Analyze unused files/exports
    let unusedFiles = [];
    if (config.analyzeUnused && config.entryPoint) {
      unusedFiles = await dependencyResult.orphans();
      console.log(`Found ${unusedFiles.length} unused files`);
    }
    
    // Analyze package.json duplications
    const packageDuplications = await analyzePackageJsonDuplication();
    console.log(`Found ${packageDuplications.length} duplicated packages`);
    
    // Compare package.json with actual imports
    const packageComparison = await comparePackageWithImports(dependencyGraph);
    console.log(`Found ${packageComparison.unusedDependencies.length} unused declared dependencies`);
    console.log(`Found ${packageComparison.missingDependencies.length} missing dependencies`);
    
    // Generate code paths report
    const codePathsReport = generateCodePathsReport(dependencyGraph);
    console.log(`Found ${codePathsReport.leafComponents.length} leaf components`);
    console.log(`Found ${codePathsReport.heavilyImported.length} heavily imported files`);
    console.log(`Found ${codePathsReport.isolatedModules.length} isolated modules`);
    
    // Generate final report
    generateReport({
      dependencyGraph,
      circularDependencies,
      unusedFiles,
      packageDuplications,
      packageComparison,
      codePathsReport
    });
    
  } catch (error) {
    console.error('Error analyzing dependencies:', error);
  }
}

// Generate a detailed report
function generateReport(data) {
  const {
    dependencyGraph,
    circularDependencies,
    unusedFiles,
    packageDuplications,
    packageComparison,
    codePathsReport
  } = data;
  
  let report = `# Dependencies and Code Paths Analysis Report\n\n`;
  
  // General stats
  report += `## General Statistics\n\n`;
  report += `- Total files analyzed: ${Object.keys(dependencyGraph).length}\n`;
  report += `- Circular dependencies found: ${circularDependencies.length}\n`;
  report += `- Unused files: ${unusedFiles.length}\n`;
  report += `- Duplicated packages: ${packageDuplications.length}\n`;
  report += `- Unused declared dependencies: ${packageComparison.unusedDependencies.length}\n`;
  report += `- Missing dependencies: ${packageComparison.missingDependencies.length}\n\n`;
  
  // Circular dependencies
  report += `## Circular Dependencies\n\n`;
  
  if (circularDependencies.length === 0) {
    report += `No circular dependencies found.\n\n`;
  } else {
    report += `The following circular dependencies were detected:\n\n`;
    
    circularDependencies.forEach((cycle, index) => {
      report += `### Cycle ${index + 1}\n\n`;
      cycle.forEach((file, i) => {
        if (i < cycle.length - 1) {
          report += `\`${file}\` → `;
        } else {
          report += `\`${file}\`\n\n`;
        }
      });
    });
    
    report += `> **Warning**: Circular dependencies can lead to issues with code maintenance, testing, and bundle size. Consider refactoring to break these cycles.\n\n`;
  }
  
  // Unused files
  report += `## Unused Files\n\n`;
  
  if (unusedFiles.length === 0) {
    report += `No unused files found.\n\n`;
  } else {
    report += `The following files are not imported by any other file (starting from the entry point):\n\n`;
    
    unusedFiles.forEach(file => {
      report += `- \`${file}\`\n`;
    });
    
    report += `\n> **Note**: Some of these files might be used dynamically or via non-standard imports that couldn't be detected.\n\n`;
  }
  
  // Package duplications
  report += `## Duplicated Packages\n\n`;
  
  if (packageDuplications.length === 0) {
    report += `No package duplications found.\n\n`;
  } else {
    report += `The following packages have multiple versions installed:\n\n`;
    
    packageDuplications.forEach(({ name, versions }) => {
      report += `### ${name}\n\n`;
      
      versions.forEach(({ version, path }) => {
        report += `- Version \`${version}\` via \`${path}\`\n`;
      });
      
      report += `\n`;
    });
    
    report += `> **Warning**: Duplicate packages can increase bundle size and potentially cause unexpected behavior.\n\n`;
  }
  
  // Package.json analysis
  report += `## Package.json Analysis\n\n`;
  
  if (packageComparison.unusedDependencies.length > 0) {
    report += `### Unused Declared Dependencies\n\n`;
    report += `The following dependencies are declared in package.json but not imported in the code:\n\n`;
    
    packageComparison.unusedDependencies.forEach(dep => {
      report += `- \`${dep}\`\n`;
    });
    
    report += `\n> **Note**: Some of these might be used indirectly or in scripts not analyzed.\n\n`;
  }
  
  if (packageComparison.missingDependencies.length > 0) {
    report += `### Missing Dependencies\n\n`;
    report += `The following dependencies are imported in the code but not declared in package.json:\n\n`;
    
    packageComparison.missingDependencies.forEach(dep => {
      report += `- \`${dep}\`\n`;
    });
    
    report += `\n`;
  }
  
  // Code paths analysis
  report += `## Code Paths Analysis\n\n`;
  
  // Heavily imported files
  report += `### Heavily Imported Files\n\n`;
  
  if (codePathsReport.heavilyImported.length === 0) {
    report += `No files are imported by many other files.\n\n`;
  } else {
    report += `The following files are imported by many other files and may be core utilities or shared components:\n\n`;
    report += `| File | Import Count |\n`;
    report += `|------|-------------|\n`;
    
    codePathsReport.heavilyImported.forEach(({ file, count }) => {
      report += `| \`${file}\` | ${count} |\n`;
    });
    
    report += `\n`;
  }
  
  // Isolated modules
  report += `### Isolated Modules\n\n`;
  
  if (codePathsReport.isolatedModules.length === 0) {
    report += `No isolated modules found.\n\n`;
  } else {
    report += `The following modules neither import nor are imported by other files (they might be unused or dynamically imported):\n\n`;
    
    codePathsReport.isolatedModules.forEach(file => {
      report += `- \`${file}\`\n`;
    });
    
    report += `\n`;
  }
  
  // Leaf components
  report += `### Leaf Components\n\n`;
  
  if (codePathsReport.leafComponents.length === 0) {
    report += `No leaf components found.\n\n`;
  } else {
    report += `The following files are imported by other files but don't import any project files themselves:\n\n`;
    
    // Too many to list them all
    if (codePathsReport.leafComponents.length > 20) {
      report += `Found ${codePathsReport.leafComponents.length} leaf components (showing first 20):\n\n`;
      codePathsReport.leafComponents.slice(0, 20).forEach(file => {
        report += `- \`${file}\`\n`;
      });
      report += `- ... and ${codePathsReport.leafComponents.length - 20} more\n`;
    } else {
      codePathsReport.leafComponents.forEach(file => {
        report += `- \`${file}\`\n`;
      });
    }
    
    report += `\n`;
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  const recommendations = [];
  
  if (circularDependencies.length > 0) {
    recommendations.push(`- Refactor code to eliminate circular dependencies`);
  }
  
  if (unusedFiles.length > 0) {
    recommendations.push(`- Review and potentially remove unused files to reduce bundle size`);
  }
  
  if (packageDuplications.length > 0) {
    recommendations.push(`- Resolve package duplications using npm/yarn dedupe or by updating dependencies`);
  }
  
  if (packageComparison.unusedDependencies.length > 0) {
    recommendations.push(`- Review and potentially remove unused dependencies from package.json`);
  }
  
  if (packageComparison.missingDependencies.length > 0) {
    recommendations.push(`- Add missing dependencies to package.json`);
  }
  
  if (codePathsReport.heavilyImported.length > 0) {
    recommendations.push(`- Consider reviewing heavily imported files for optimization opportunities`);
  }
  
  if (recommendations.length === 0) {
    report += `No significant issues found. The dependency structure appears to be well-managed.\n`;
  } else {
    recommendations.forEach(recommendation => {
      report += `${recommendation}\n`;
    });
  }
  
  // Write report to file
  fs.writeFileSync('dependencies-analysis-report.md', report);
  console.log('Dependencies analysis complete! Report written to dependencies-analysis-report.md');
}

// Run the analysis
analyzeDependencies().catch(error => {
  console.error('Error running dependency analysis:', error);
});