// codebase-audit.js
// Run with: node codebase-audit.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  // Directories to scan
  directories: ['src', 'app', 'components', 'pages', 'services', 'hooks', 'utils'],
  // File extensions to process
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  // Patterns to look for that might indicate duplication
  duplicationPatterns: [
    { name: 'Property Components', pattern: /property/i },
    { name: 'Project Components', pattern: /project/i },
    { name: 'User Authentication', pattern: /(auth|login|register|signup)/i },
    { name: 'API Calls', pattern: /(api\.|fetch|axios|http)/i },
    { name: 'Data Hooks', pattern: /use[A-Z]/i },
    { name: 'Form Components', pattern: /form/i },
    { name: 'List/Grid Views', pattern: /(list|grid)/i },
    { name: 'Modals/Dialogs', pattern: /(modal|dialog)/i },
    { name: 'Navigation Components', pattern: /(nav|menu|sidebar)/i },
  ],
  // Naming conventions to check for consistency
  namingConventions: [
    { type: 'component', pattern: /^[A-Z][A-Za-z0-9]*(\.[jt]sx?)?$/, description: 'Components should start with uppercase' },
    { type: 'hook', pattern: /^use[A-Z][A-Za-z0-9]*(\.[jt]s?)?$/, description: 'Hooks should start with "use" followed by uppercase' },
    { type: 'util', pattern: /^[a-z][A-Za-z0-9]*(\.[jt]s?)?$/, description: 'Utilities should start with lowercase' },
    { type: 'context', pattern: /Context(\.[jt]sx?)?$/, description: 'Context files should end with "Context"' },
  ],
  // Folder structure expectations
  folderStructure: {
    'components': 'UI components',
    'pages': 'Page components or route handlers',
    'hooks': 'Custom React hooks',
    'services': 'API services and data fetching',
    'utils': 'Utility functions',
    'contexts': 'React contexts',
    'types': 'TypeScript types and interfaces',
    'styles': 'CSS, SCSS, or style-related files',
    'assets': 'Static assets like images',
    'api': 'API endpoints or handlers',
  },
  // Import patterns to check for consistent usage
  importPatterns: [
    { name: 'React', pattern: /import React/i },
    { name: 'React Hooks', pattern: /import {[^}]*use[A-Z][^}]*} from ['"]react['"]/i },
    { name: 'Next.js', pattern: /import [^;]*? from ['"]next[\/'"]/i },
    { name: 'Icons', pattern: /import [^;]*? from ['"]react-icons[\/'"]/i },
    { name: 'Components', pattern: /import [^;]*? from ['"][\.\/]*components[\/'"]/i },
    { name: 'Hooks', pattern: /import [^;]*? from ['"][\.\/]*hooks[\/'"]/i },
    { name: 'Services', pattern: /import [^;]*? from ['"][\.\/]*services[\/'"]/i },
    { name: 'Types', pattern: /import [^;]*? from ['"][\.\/]*types[\/'"]/i },
  ],
  // Styling approaches to check for consistent usage
  stylingApproaches: [
    { name: 'Tailwind CSS', pattern: /className=['"](flex|grid|p-|m-|text-|bg-)/i },
    { name: 'CSS Modules', pattern: /import [^;]*? from ['"][^'"]*\.module\.css['"]/i },
    { name: 'Styled Components', pattern: /(styled\.|createGlobalStyle|css`)/i },
    { name: 'Emotion', pattern: /(css\(|styled\(|jsx`)/i },
    { name: 'Inline Styles', pattern: /style={{/i },
  ],
};

// Results storage
const results = {
  fileCount: 0,
  totalLinesOfCode: 0,
  folderStructure: {},
  potentialDuplications: {},
  namingConventionViolations: [],
  importUsage: {},
  stylingUsage: {},
  largeFiles: [],
  componentStructures: {},
};

// Helper function to recursively get all files
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.existsSync(dirPath) ? fs.readdirSync(dirPath) : [];

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (config.extensions.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Process each file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const directory = path.dirname(filePath);
  const lines = content.split('\n');
  
  results.fileCount++;
  results.totalLinesOfCode += lines.length;
  
  // Check for large files
  if (lines.length > 300) {
    results.largeFiles.push({ filePath, lineCount: lines.length });
  }
  
  // Track folder structure
  const folderName = directory.split(path.sep)[0];
  if (!results.folderStructure[folderName]) {
    results.folderStructure[folderName] = 0;
  }
  results.folderStructure[folderName]++;
  
  // Check for potential duplications
  config.duplicationPatterns.forEach(({ name, pattern }) => {
    if (pattern.test(content)) {
      if (!results.potentialDuplications[name]) {
        results.potentialDuplications[name] = [];
      }
      results.potentialDuplications[name].push(filePath);
    }
  });
  
  // Check naming conventions
  config.namingConventions.forEach(({ type, pattern, description }) => {
    if (
      (type === 'component' && /components|pages/.test(directory)) ||
      (type === 'hook' && /hooks/.test(directory)) ||
      (type === 'util' && /utils/.test(directory)) ||
      (type === 'context' && /contexts?/.test(directory))
    ) {
      if (!pattern.test(fileName)) {
        results.namingConventionViolations.push({
          filePath,
          type,
          description,
          fileName
        });
      }
    }
  });
  
  // Check import patterns
  config.importPatterns.forEach(({ name, pattern }) => {
    if (pattern.test(content)) {
      if (!results.importUsage[name]) {
        results.importUsage[name] = 0;
      }
      results.importUsage[name]++;
    }
  });
  
  // Check styling approaches
  config.stylingApproaches.forEach(({ name, pattern }) => {
    if (pattern.test(content)) {
      if (!results.stylingUsage[name]) {
        results.stylingUsage[name] = 0;
      }
      results.stylingUsage[name]++;
    }
  });
  
  // Extract component structure
  if (/\.(jsx|tsx)$/.test(filePath)) {
    const componentName = fileName.replace(/\.(jsx|tsx)$/, '');
    const propsMatch = content.match(/interface\s+(\w+Props)/);
    const propsName = propsMatch ? propsMatch[1] : null;
    
    const stateMatches = content.match(/useState/g);
    const effectMatches = content.match(/useEffect/g);
    const refMatches = content.match(/useRef/g);
    const contextMatches = content.match(/useContext/g);
    const reducerMatches = content.match(/useReducer/g);
    const customHookMatches = content.match(/use[A-Z]\w+/g);
    
    const hooks = {
      state: stateMatches?.length || 0,
      effect: effectMatches?.length || 0,
      ref: refMatches?.length || 0,
      context: contextMatches?.length || 0,
      reducer: reducerMatches?.length || 0,
      custom: customHookMatches?.filter(hook => !['useState', 'useEffect', 'useRef', 'useContext', 'useReducer'].includes(hook)) || []
    };
    
    results.componentStructures[filePath] = {
      componentName,
      propsName,
      hooks,
      lineCount: lines.length
    };
  }
}

// Run the audit
function runAudit() {
  console.log('Running codebase audit...');
  
  // Get all files to analyze
  let allFiles = [];
  config.directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      allFiles = allFiles.concat(getAllFiles(dir));
    }
  });
  
  console.log(`Found ${allFiles.length} files to analyze.`);
  
  // Process each file
  allFiles.forEach(processFile);
  
  // Analyze component similarity
  const componentSimilarity = analyzeComponentSimilarity();
  
  // Analyze file dependencies
  const dependencyGraph = analyzeFileDependencies(allFiles);
  
  // Generate report
  generateReport(componentSimilarity, dependencyGraph);
}

// Analyze component similarity
function analyzeComponentSimilarity() {
  const componentPairs = [];
  const components = Object.entries(results.componentStructures);
  
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const [pathA, compA] = components[i];
      const [pathB, compB] = components[j];
      
      // Calculate similarity score based on hooks usage
      const hooksA = compA.hooks;
      const hooksB = compB.hooks;
      
      const score = (
        (Math.min(hooksA.state, hooksB.state) / Math.max(hooksA.state, hooksB.state, 1)) +
        (Math.min(hooksA.effect, hooksB.effect) / Math.max(hooksA.effect, hooksB.effect, 1)) +
        (Math.min(hooksA.ref, hooksB.ref) / Math.max(hooksA.ref, hooksB.ref, 1)) +
        (Math.min(hooksA.context, hooksB.context) / Math.max(hooksA.context, hooksB.context, 1)) +
        (Math.min(hooksA.reducer, hooksB.reducer) / Math.max(hooksA.reducer, hooksB.reducer, 1))
      ) / 5;
      
      if (score > 0.7) { // Only report high similarity
        componentPairs.push({
          componentA: pathA,
          componentB: pathB,
          similarityScore: score.toFixed(2)
        });
      }
    }
  }
  
  return componentPairs.sort((a, b) => b.similarityScore - a.similarityScore);
}

// Analyze file dependencies
function analyzeFileDependencies(files) {
  const dependencies = {};
  
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    const importMatches = content.matchAll(/import\s+[^;]*?\s+from\s+['"]([^'"]*)['"]/g);
    const currentDir = path.dirname(file);
    
    dependencies[file] = [];
    
    for (const match of importMatches) {
      const importPath = match[1];
      
      // Skip external modules
      if (!importPath.startsWith('.')) continue;
      
      // Resolve the absolute path
      let resolvedPath = path.resolve(currentDir, importPath);
      
      // Handle directory imports by looking for index files
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        for (const ext of config.extensions) {
          const indexPath = path.join(resolvedPath, `index${ext}`);
          if (fs.existsSync(indexPath)) {
            resolvedPath = indexPath;
            break;
          }
        }
      } 
      // Handle imports without extensions
      else if (!fs.existsSync(resolvedPath)) {
        let found = false;
        for (const ext of config.extensions) {
          const pathWithExt = `${resolvedPath}${ext}`;
          if (fs.existsSync(pathWithExt)) {
            resolvedPath = pathWithExt;
            found = true;
            break;
          }
        }
        
        // Skip if we can't resolve the path
        if (!found) continue;
      }
      
      dependencies[file].push(resolvedPath);
    }
  });
  
  return dependencies;
}

// Generate a markdown report
function generateReport(componentSimilarity, dependencyGraph) {
  let report = `# Codebase Audit Report\n\n`;
  
  // General stats
  report += `## General Statistics\n\n`;
  report += `- Total files: ${results.fileCount}\n`;
  report += `- Total lines of code: ${results.totalLinesOfCode}\n\n`;
  
  // Folder structure
  report += `## Folder Structure\n\n`;
  report += `| Folder | File Count | Expected Content |\n`;
  report += `|--------|------------|------------------|\n`;
  
  Object.entries(results.folderStructure).sort((a, b) => b[1] - a[1]).forEach(([folder, count]) => {
    const expectedContent = config.folderStructure[folder] || 'Unknown purpose';
    report += `| ${folder} | ${count} | ${expectedContent} |\n`;
  });
  
  report += `\n`;
  
  // Evaluate missing recommended folders
  const missingFolders = Object.keys(config.folderStructure).filter(folder => 
    !Object.keys(results.folderStructure).includes(folder)
  );
  
  if (missingFolders.length > 0) {
    report += `### Missing Recommended Folders\n\n`;
    missingFolders.forEach(folder => {
      report += `- \`${folder}\`: ${config.folderStructure[folder]}\n`;
    });
    report += `\n`;
  }
  
  // Potential duplications
  report += `## Potential Duplications\n\n`;
  
  Object.entries(results.potentialDuplications).forEach(([pattern, files]) => {
    report += `### ${pattern} (${files.length} files)\n\n`;
    
    if (files.length > 10) {
      report += `> **Warning**: High number of files matching this pattern, suggesting potential duplication of functionality.\n\n`;
    }
    
    files.forEach(file => {
      report += `- \`${file}\`\n`;
    });
    
    report += `\n`;
  });
  
  // Similar components
  report += `## Similar Components\n\n`;
  
  if (componentSimilarity.length === 0) {
    report += `No significantly similar components found.\n\n`;
  } else {
    report += `The following component pairs have high similarity scores, suggesting potential duplication:\n\n`;
    
    report += `| Component A | Component B | Similarity Score |\n`;
    report += `|------------|-------------|------------------|\n`;
    
    componentSimilarity.forEach(({ componentA, componentB, similarityScore }) => {
      report += `| \`${componentA}\` | \`${componentB}\` | ${similarityScore} |\n`;
    });
    
    report += `\n`;
  }
  
  // Naming convention violations
  report += `## Naming Convention Violations\n\n`;
  
  if (results.namingConventionViolations.length === 0) {
    report += `No naming convention violations found.\n\n`;
  } else {
    report += `| File | Type | Issue |\n`;
    report += `|------|------|-------|\n`;
    
    results.namingConventionViolations.forEach(({ filePath, type, description }) => {
      report += `| \`${filePath}\` | ${type} | ${description} |\n`;
    });
    
    report += `\n`;
  }
  
  // Import usage
  report += `## Import Patterns Usage\n\n`;
  
  report += `| Import Pattern | Count |\n`;
  report += `|---------------|-------|\n`;
  
  Object.entries(results.importUsage).sort((a, b) => b[1] - a[1]).forEach(([pattern, count]) => {
    report += `| ${pattern} | ${count} |\n`;
  });
  
  report += `\n`;
  
  // Styling approaches
  report += `## Styling Approaches\n\n`;
  
  report += `| Styling Approach | Count |\n`;
  report += `|-----------------|-------|\n`;
  
  Object.entries(results.stylingUsage).sort((a, b) => b[1] - a[1]).forEach(([approach, count]) => {
    report += `| ${approach} | ${count} |\n`;
  });
  
  report += `\n`;
  
  if (Object.keys(results.stylingUsage).length > 1) {
    report += `> **Warning**: Multiple styling approaches detected. Consider standardizing on a single approach.\n\n`;
  }
  
  // Large files
  report += `## Large Files (>300 lines)\n\n`;
  
  if (results.largeFiles.length === 0) {
    report += `No excessively large files found.\n\n`;
  } else {
    report += `| File | Line Count |\n`;
    report += `|------|------------|\n`;
    
    results.largeFiles.sort((a, b) => b.lineCount - a.lineCount).forEach(({ filePath, lineCount }) => {
      report += `| \`${filePath}\` | ${lineCount} |\n`;
    });
    
    report += `\n`;
    
    report += `> **Note**: Large files may be candidates for refactoring into smaller, more focused components or modules.\n\n`;
  }
  
  // Circular dependencies
  report += `## Circular Dependencies\n\n`;
  
  const circularDeps = findCircularDependencies(dependencyGraph);
  
  if (circularDeps.length === 0) {
    report += `No circular dependencies found.\n\n`;
  } else {
    report += `The following circular dependencies were detected:\n\n`;
    
    circularDeps.forEach((cycle, index) => {
      report += `### Cycle ${index + 1}\n\n`;
      cycle.forEach((file, i) => {
        if (i < cycle.length - 1) {
          report += `\`${file}\` → `;
        } else {
          report += `\`${file}\`\n\n`;
        }
      });
    });
    
    report += `> **Warning**: Circular dependencies can lead to issues with code maintenance and testing. Consider refactoring to break these cycles.\n\n`;
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  const recommendations = [];
  
  // Multiple styling approaches
  if (Object.keys(results.stylingUsage).length > 1) {
    recommendations.push(`- Standardize on a single styling approach. Currently using: ${Object.keys(results.stylingUsage).join(', ')}`);
  }
  
  // Missing folders
  if (missingFolders.length > 0) {
    recommendations.push(`- Consider adding the following recommended folders: ${missingFolders.join(', ')}`);
  }
  
  // Potential duplications
  const highDuplicationPatterns = Object.entries(results.potentialDuplications)
    .filter(([_, files]) => files.length > 10)
    .map(([pattern, _]) => pattern);
    
  if (highDuplicationPatterns.length > 0) {
    recommendations.push(`- Review potential duplications in: ${highDuplicationPatterns.join(', ')}`);
  }
  
  // Similar components
  if (componentSimilarity.length > 0) {
    recommendations.push(`- Review similar components to identify opportunities for consolidation`);
  }
  
  // Circular dependencies
  if (circularDeps.length > 0) {
    recommendations.push(`- Refactor code to break circular dependencies`);
  }
  
  // Large files
  if (results.largeFiles.length > 0) {
    recommendations.push(`- Consider refactoring large files (>300 lines) into smaller, more focused components or modules`);
  }
  
  if (recommendations.length === 0) {
    report += `No significant issues found. The codebase appears to be well-structured.\n`;
  } else {
    recommendations.forEach(recommendation => {
      report += `${recommendation}\n`;
    });
  }
  
  // Write report to file
  fs.writeFileSync('codebase-audit-report.md', report);
  console.log('Audit complete! Report written to codebase-audit-report.md');
}

// Find circular dependencies in the dependency graph
function findCircularDependencies(dependencyGraph) {
  const visited = new Set();
  const recursionStack = new Set();
  const cycles = [];
  
  function dfs(node, path = []) {
    if (recursionStack.has(node)) {
      // Found a cycle
      const cycleStart = path.indexOf(node);
      cycles.push([...path.slice(cycleStart), node]);
      return;
    }
    
    if (visited.has(node)) return;
    
    visited.add(node);
    recursionStack.add(node);
    path.push(node);
    
    const dependencies = dependencyGraph[node] || [];
    dependencies.forEach(dep => {
      dfs(dep, [...path]);
    });
    
    recursionStack.delete(node);
  }
  
  Object.keys(dependencyGraph).forEach(node => {
    if (!visited.has(node)) {
      dfs(node);
    }
  });
  
  return cycles;
}

// Run the audit
runAudit();