// simple-component-analyzer.js
// This version doesn't require additional dependencies

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Directories to scan for components
  componentDirs: ['src/components', 'components', 'app', 'pages', 'src/app', 'src/pages'],
  // File extensions to process
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  // Exclusion patterns
  exclude: ['node_modules', '.next', 'out', 'build', 'dist', '.git', 'coverage']
};

// Results storage
const results = {
  componentFiles: [],
  totalFiles: 0,
  byExtension: {},
  byDirectory: {},
  largeFiles: [],
  potentialDuplicates: [],
  usagePatterns: {
    hooks: {},
    imports: {},
    styling: {
      tailwind: 0,
      cssModules: 0,
      styledComponents: 0,
      sass: 0,
      emotion: 0,
      inlineStyles: 0
    }
  }
};

// Helper function to recursively get all component files
function getAllComponentFiles() {
  const componentFiles = [];
  
  function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(dirPath, entry.name);
        
        // Skip excluded directories
        if (entry.isDirectory()) {
          if (config.exclude.some(exclude => entry.name.includes(exclude))) continue;
          processDirectory(entryPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (config.extensions.includes(ext)) {
            componentFiles.push(entryPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
  }
  
  // Process each configured component directory
  config.componentDirs.forEach(dir => {
    processDirectory(dir);
  });
  
  return componentFiles;
}

// Basic content analysis using regex patterns
function analyzeComponentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fileStats = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const dirName = path.dirname(filePath);
    const componentName = getComponentNameFromPath(filePath);
    const lineCount = content.split('\n').length;
    
    // Track file extensions
    if (!results.byExtension[ext]) {
      results.byExtension[ext] = 0;
    }
    results.byExtension[ext]++;
    
    // Track directories
    const baseDir = dirName.split(path.sep)[0];
    if (!results.byDirectory[baseDir]) {
      results.byDirectory[baseDir] = 0;
    }
    results.byDirectory[baseDir]++;
    
    // Check for large files
    if (lineCount > 300) {
      results.largeFiles.push({
        filePath,
        lineCount,
        sizeKB: Math.round(fileStats.size / 1024)
      });
    }
    
    // Basic component info
    const componentInfo = {
      filePath,
      fileName: path.basename(filePath),
      componentName,
      lineCount,
      sizeKB: Math.round(fileStats.size / 1024),
      hooks: findHooks(content),
      imports: findImports(content),
      jsxElements: countMatches(content, /<[A-Z][A-Za-z0-9]*(\.|\s|\n|\/|>)/g),
      props: findProps(content)
    };
    
    // Analyze styling approaches
    if (content.includes('className=') && 
        /className=["'][^"']*(?:flex|grid|p-|m-|text-|bg-)/i.test(content)) {
      results.usagePatterns.styling.tailwind++;
      componentInfo.styling = 'Tailwind CSS';
    } else if (content.includes('.module.css') || content.includes('.module.scss')) {
      results.usagePatterns.styling.cssModules++;
      componentInfo.styling = 'CSS Modules';
    } else if (content.includes('styled.') || content.includes('createGlobalStyle') || content.includes('css`')) {
      results.usagePatterns.styling.styledComponents++;
      componentInfo.styling = 'Styled Components';
    } else if (content.includes('.scss') || content.includes('.sass')) {
      results.usagePatterns.styling.sass++;
      componentInfo.styling = 'SASS/SCSS';
    } else if (content.includes('css(') || content.includes('jsx`')) {
      results.usagePatterns.styling.emotion++;
      componentInfo.styling = 'Emotion';
    } else if (content.includes('style={{')) {
      results.usagePatterns.styling.inlineStyles++;
      componentInfo.styling = 'Inline Styles';
    }
    
    // Track hook usage
    componentInfo.hooks.forEach(hook => {
      if (!results.usagePatterns.hooks[hook]) {
        results.usagePatterns.hooks[hook] = 0;
      }
      results.usagePatterns.hooks[hook]++;
    });
    
    return componentInfo;
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    return null;
  }
}

// Helper to find React hooks in a component
function findHooks(content) {
  const hooks = [];
  const hookPattern = /\b(use[A-Z][a-zA-Z0-9]*)\s*\(/g;
  let match;
  
  while ((match = hookPattern.exec(content)) !== null) {
    if (!hooks.includes(match[1])) {
      hooks.push(match[1]);
    }
  }
  
  return hooks;
}

// Helper to find imports in a component
function findImports(content) {
  const imports = [];
  const importPattern = /import\s+(?:{[^}]*}|\w+|\*\s+as\s+\w+)\s+from\s+['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importPattern.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Helper to find component props
function findProps(content) {
  const props = [];
  
  // Find destructured props in function parameters
  const propsPattern = /function\s+\w+\s*\(\s*{\s*([^}]*)\s*}\s*\)/g;
  const arrowPropsPattern = /const\s+\w+\s*=\s*\(\s*{\s*([^}]*)\s*}\s*\)\s*=>/g;
  
  let match;
  while ((match = propsPattern.exec(content)) !== null) {
    const propsText = match[1];
    const propsList = propsText.split(',').map(p => p.trim());
    props.push(...propsList);
  }
  
  while ((match = arrowPropsPattern.exec(content)) !== null) {
    const propsText = match[1];
    const propsList = propsText.split(',').map(p => p.trim());
    props.push(...propsList);
  }
  
  return props.filter(p => p); // Remove empty strings
}

// Helper to extract component name from file path
function getComponentNameFromPath(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  return baseName === 'index' ? path.basename(path.dirname(filePath)) : baseName;
}

// Helper to count regex matches
function countMatches(content, regex) {
  let count = 0;
  let match;
  while ((match = regex.exec(content)) !== null) {
    count++;
  }
  return count;
}

// Find potential duplicate components based on simple similarity measures
function findSimilarComponents(components) {
  const similarPairs = [];
  
  for (let i = 0; i < components.length; i++) {
    for (let j = i + 1; j < components.length; j++) {
      const compA = components[i];
      const compB = components[j];
      
      const reasons = [];
      let similarityScore = 0;
      
      // Compare hooks
      const commonHooks = compA.hooks.filter(hook => compB.hooks.includes(hook));
      if (commonHooks.length >= 2) {  // At least 2 hooks in common
        const hookSimilarity = commonHooks.length / Math.max(compA.hooks.length, compB.hooks.length, 1);
        if (hookSimilarity > 0.7) {
          similarityScore += 0.3;
          reasons.push(`Similar hooks (${commonHooks.join(', ')})`);
        }
      }
      
      // Compare props
      const commonProps = compA.props.filter(prop => compB.props.includes(prop));
      if (commonProps.length >= 2) {  // At least 2 props in common
        const propSimilarity = commonProps.length / Math.max(compA.props.length, compB.props.length, 1);
        if (propSimilarity > 0.5) {
          similarityScore += 0.3;
          reasons.push(`Similar props (${commonProps.join(', ')})`);
        }
      }
      
      // Compare imports
      const commonImports = compA.imports.filter(imp => compB.imports.includes(imp));
      if (commonImports.length >= 3) {  // At least 3 imports in common
        const importSimilarity = commonImports.length / Math.max(compA.imports.length, compB.imports.length, 1);
        if (importSimilarity > 0.5) {
          similarityScore += 0.2;
          reasons.push(`Similar imports (${commonImports.length} in common)`);
        }
      }
      
      // Compare component complexity
      const sizeDiff = Math.abs(compA.lineCount - compB.lineCount) / Math.max(compA.lineCount, compB.lineCount);
      if (sizeDiff < 0.3) {  // Size difference less than 30%
        similarityScore += 0.1;
        reasons.push(`Similar size (${compA.lineCount} vs ${compB.lineCount} lines)`);
      }
      
      // Compare JSX element count
      const jsxDiff = Math.abs(compA.jsxElements - compB.jsxElements) / Math.max(compA.jsxElements, compB.jsxElements, 1);
      if (jsxDiff < 0.3 && compA.jsxElements > 0 && compB.jsxElements > 0) {
        similarityScore += 0.1;
        reasons.push(`Similar JSX complexity (${compA.jsxElements} vs ${compB.jsxElements} elements)`);
      }
      
      // Only include if similarity score is high enough
      if (similarityScore >= 0.5) {
        similarPairs.push({
          componentA: compA,
          componentB: compB,
          similarityScore,
          reasons
        });
      }
    }
  }
  
  return similarPairs.sort((a, b) => b.similarityScore - a.similarityScore);
}

// Find files with common naming patterns
function findFilesByPattern(components) {
  const patterns = {
    list: components.filter(c => c.componentName.toLowerCase().includes('list')),
    card: components.filter(c => c.componentName.toLowerCase().includes('card')),
    modal: components.filter(c => c.componentName.toLowerCase().includes('modal')),
    form: components.filter(c => c.componentName.toLowerCase().includes('form')),
    button: components.filter(c => c.componentName.toLowerCase().includes('button')),
    input: components.filter(c => c.componentName.toLowerCase().includes('input')),
    page: components.filter(c => c.componentName.toLowerCase().includes('page')),
    view: components.filter(c => c.componentName.toLowerCase().includes('view')),
    container: components.filter(c => c.componentName.toLowerCase().includes('container')),
    provider: components.filter(c => c.componentName.toLowerCase().includes('provider')),
    property: components.filter(c => c.componentName.toLowerCase().includes('property')),
    project: components.filter(c => c.componentName.toLowerCase().includes('project')),
  };
  
  // Filter out patterns with fewer than 2 components
  return Object.fromEntries(
    Object.entries(patterns)
      .filter(([_, components]) => components.length >= 2)
  );
}

// Generate report on component analysis
function generateReport(components) {
  let report = `# React Component Analysis Report\n\n`;
  
  // General stats
  report += `## General Statistics\n\n`;
  report += `- Total files analyzed: ${results.totalFiles}\n`;
  report += `- Total component files: ${components.length}\n\n`;
  
  // File extensions
  report += `## File Extensions\n\n`;
  report += `| Extension | Count |\n`;
  report += `|-----------|-------|\n`;
  
  Object.entries(results.byExtension)
    .sort((a, b) => b[1] - a[1])
    .forEach(([ext, count]) => {
      report += `| ${ext} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // Top-level directories
  report += `## Directory Structure\n\n`;
  report += `| Directory | Count |\n`;
  report += `|-----------|-------|\n`;
  
  Object.entries(results.byDirectory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([dir, count]) => {
      report += `| ${dir} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // Hook usage
  report += `## Hook Usage\n\n`;
  
  if (Object.keys(results.usagePatterns.hooks).length === 0) {
    report += `No React hooks detected.\n\n`;
  } else {
    report += `| Hook | Usage Count |\n`;
    report += `|------|-------------|\n`;
    
    Object.entries(results.usagePatterns.hooks)
      .sort((a, b) => b[1] - a[1])
      .forEach(([hook, count]) => {
        report += `| ${hook} | ${count} |\n`;
      });
    
    report += `\n`;
  }
  
  // Styling approaches
  report += `## Styling Approaches\n\n`;
  report += `| Approach | Usage Count |\n`;
  report += `|----------|-------------|\n`;
  
  Object.entries(results.usagePatterns.styling)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .forEach(([approach, count]) => {
      const formattedName = approach.replace(/([A-Z])/g, ' $1').trim();
      report += `| ${formattedName} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // Large files
  report += `## Large Files (>300 lines)\n\n`;
  
  if (results.largeFiles.length === 0) {
    report += `No excessively large files found.\n\n`;
  } else {
    report += `| File | Line Count | Size (KB) |\n`;
    report += `|------|------------|----------|\n`;
    
    results.largeFiles
      .sort((a, b) => b.lineCount - a.lineCount)
      .forEach(({ filePath, lineCount, sizeKB }) => {
        report += `| \`${filePath}\` | ${lineCount} | ${sizeKB} |\n`;
      });
    
    report += `\n`;
    
    report += `> **Note**: Large files may be candidates for refactoring into smaller, more focused components.\n\n`;
  }
  
  // File patterns
  const patternGroups = findFilesByPattern(components);
  
  report += `## Common Component Patterns\n\n`;
  
  if (Object.keys(patternGroups).length === 0) {
    report += `No common naming patterns detected.\n\n`;
  } else {
    Object.entries(patternGroups).forEach(([pattern, components]) => {
      const patternName = pattern.charAt(0).toUpperCase() + pattern.slice(1);
      report += `### ${patternName} Components (${components.length})\n\n`;
      
      components.forEach(component => {
        report += `- \`${component.filePath}\` (${component.lineCount} lines)\n`;
      });
      
      report += `\n`;
    });
  }
  
  // Similar components
  const similarComponents = findSimilarComponents(components);
  
  report += `## Potentially Similar Components\n\n`;
  
  if (similarComponents.length === 0) {
    report += `No significantly similar components found.\n\n`;
  } else {
    similarComponents.forEach(({ componentA, componentB, similarityScore, reasons }) => {
      report += `### ${componentA.componentName} & ${componentB.componentName}\n\n`;
      report += `- Similarity Score: ${similarityScore.toFixed(2)}\n`;
      report += `- Reasons:\n`;
      reasons.forEach(reason => {
        report += `  - ${reason}\n`;
      });
      report += `- Files:\n`;
      report += `  - \`${componentA.filePath}\` (${componentA.lineCount} lines)\n`;
      report += `  - \`${componentB.filePath}\` (${componentB.lineCount} lines)\n\n`;
    });
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  const recommendations = [];
  
  // Check for mixed styling approaches
  const stylingApproaches = Object.entries(results.usagePatterns.styling)
    .filter(([_, count]) => count > 0)
    .map(([approach, _]) => approach);
    
  if (stylingApproaches.length > 1) {
    recommendations.push(`- Consider standardizing styling approaches. Currently using: ${stylingApproaches.map(a => a.replace(/([A-Z])/g, ' $1').trim()).join(', ')}`);
  }
  
  // Check for large files
  if (results.largeFiles.length > 0) {
    recommendations.push(`- Refactor large files (${results.largeFiles.length} files over 300 lines) into smaller, more focused components`);
  }
  
  // Check for potentially similar components
  if (similarComponents.length > 0) {
    recommendations.push(`- Review similar components (${similarComponents.length} pairs found) for potential consolidation`);
  }
  
  // Check for component patterns
  const manyPatternGroups = Object.entries(patternGroups)
    .filter(([_, components]) => components.length > 5);
    
  if (manyPatternGroups.length > 0) {
    manyPatternGroups.forEach(([pattern, components]) => {
      const patternName = pattern.charAt(0).toUpperCase() + pattern.slice(1);
      recommendations.push(`- Consider creating a shared abstract ${patternName} component to reduce duplication across the ${components.length} ${pattern} components`);
    });
  }
  
  if (recommendations.length === 0) {
    report += `No significant issues found. The component architecture appears to be well-structured.\n`;
  } else {
    recommendations.forEach(recommendation => {
      report += `${recommendation}\n`;
    });
  }
  
  return report;
}

// Main function to run the analysis
async function analyzeComponents() {
  console.log('Analyzing React components...');
  
  // Get all component files
  const componentFiles = getAllComponentFiles();
  results.totalFiles = componentFiles.length;
  console.log(`Found ${componentFiles.length} potential component files.`);
  
  // Analyze each file
  const analyzedComponents = [];
  componentFiles.forEach(file => {
    const result = analyzeComponentFile(file);
    if (result) {
      analyzedComponents.push(result);
    }
  });
  
  results.componentFiles = analyzedComponents;
  console.log(`Successfully analyzed ${analyzedComponents.length} files.`);
  
  // Generate the report
  const report = generateReport(analyzedComponents);
  
  // Write the report to a file
  fs.writeFileSync('component-analysis-report.md', report);
  console.log('Component analysis complete! Report written to component-analysis-report.md');
}

// Run the analysis
analyzeComponents().catch(error => {
  console.error('Error running component analysis:', error);
});