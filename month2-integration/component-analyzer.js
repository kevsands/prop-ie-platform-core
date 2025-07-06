// component-analyzer.js
// Run with: node component-analyzer.js

const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Configuration
const config = {
  // Directories to scan for components
  componentDirs: ['src/components', 'components', 'app', 'pages', 'src/app', 'src/pages'],
  // File extensions to process
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  // Features to analyze
  features: {
    hooks: true,
    props: true,
    stateManagement: true,
    sideEffects: true,
    rendering: true,
    patterns: true
  }
};

// Results storage
const results = {
  components: [],
  totalComponents: 0,
  componentsByType: {
    functional: 0,
    class: 0,
    page: 0
  },
  hookUsage: {},
  propTypes: {},
  stateManagement: {
    useState: 0,
    useReducer: 0,
    mobx: 0,
    redux: 0,
    context: 0,
    recoil: 0,
    zustand: 0,
    jotai: 0
  },
  renderingPatterns: {
    conditionalRendering: 0,
    listRendering: 0,
    fragmentUsage: 0,
    portalUsage: 0
  },
  commonPatterns: {
    hoc: 0,
    render_props: 0,
    compound_components: 0,
    custom_hooks: 0
  }
};

// Helper function to recursively get all component files
function getAllComponentFiles() {
  const componentFiles = [];
  
  function processDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
        processDirectory(entryPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (config.extensions.includes(ext)) {
          componentFiles.push(entryPath);
        }
      }
    }
  }
  
  // Process each configured component directory
  config.componentDirs.forEach(dir => {
    processDirectory(dir);
  });
  
  return componentFiles;
}

// Parse a component file and extract information
function analyzeComponentFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const isTypeScript = filePath.endsWith('.ts') || filePath.endsWith('.tsx');
    
    // Parse the file using Babel
    const ast = babel.parse(content, {
      sourceType: 'module',
      plugins: [
        'jsx',
        isTypeScript && 'typescript',
        'classProperties',
        'objectRestSpread'
      ].filter(Boolean)
    });
    
    // Component analysis results
    const componentInfo = {
      filePath,
      fileName: path.basename(filePath),
      componentName: getComponentNameFromPath(filePath),
      type: 'unknown', // Will be set to 'functional', 'class', or 'page'
      hooks: [],
      props: [],
      stateVars: [],
      effectDependencies: [],
      renderingPatterns: {
        conditionalRendering: false,
        listRendering: false,
        fragmentUsage: false
      },
      imports: []
    };
    
    // Track found components in this file
    let componentsFound = 0;
    
    // Visit the AST nodes to extract information
    traverse(ast, {
      // Track imports
      ImportDeclaration(path) {
        const importSource = path.node.source.value;
        componentInfo.imports.push(importSource);
        
        // Check for UI library imports
        if (importSource.includes('material-ui') || 
            importSource.includes('@mui') ||
            importSource.includes('antd') ||
            importSource.includes('react-bootstrap') ||
            importSource.includes('@chakra-ui') ||
            importSource.includes('@mantine') ||
            importSource.includes('tailwind')) {
          componentInfo.uiLibrary = importSource;
        }
        
        // Check for state management
        if (importSource === 'redux' || importSource.includes('react-redux')) {
          results.stateManagement.redux++;
        } else if (importSource === 'mobx' || importSource.includes('mobx-react')) {
          results.stateManagement.mobx++;
        } else if (importSource === 'recoil') {
          results.stateManagement.recoil++;
        } else if (importSource === 'zustand') {
          results.stateManagement.zustand++;
        } else if (importSource === 'jotai') {
          results.stateManagement.jotai++;
        }
      },
      
      // Detect functional components
      FunctionDeclaration(path) {
        if (isReactComponent(path)) {
          componentsFound++;
          componentInfo.type = 'functional';
          componentInfo.componentName = path.node.id.name;
          analyzeComponent(path, componentInfo);
        }
      },
      
      // Detect functional components (arrow functions)
      VariableDeclarator(path) {
        if (path.node.init && 
            (path.node.init.type === 'ArrowFunctionExpression' || 
             path.node.init.type === 'FunctionExpression') &&
            path.node.id.type === 'Identifier' &&
            isReactComponent(path)) {
          componentsFound++;
          componentInfo.type = 'functional';
          componentInfo.componentName = path.node.id.name;
          analyzeComponent(path.get('init'), componentInfo);
        }
      },
      
      // Detect class components
      ClassDeclaration(path) {
        if (isReactClassComponent(path)) {
          componentsFound++;
          componentInfo.type = 'class';
          componentInfo.componentName = path.node.id.name;
          analyzeClassComponent(path, componentInfo);
        }
      },
      
      // Detect hooks
      CallExpression(path) {
        if (path.node.callee.type === 'Identifier' && 
            path.node.callee.name.startsWith('use')) {
          const hookName = path.node.callee.name;
          
          // Add to component hooks
          if (!componentInfo.hooks.includes(hookName)) {
            componentInfo.hooks.push(hookName);
          }
          
          // Update global stats
          if (!results.hookUsage[hookName]) {
            results.hookUsage[hookName] = 0;
          }
          results.hookUsage[hookName]++;
          
          // Special handling for specific hooks
          if (hookName === 'useState') {
            results.stateManagement.useState++;
            
            // Try to extract state variable name
            if (path.parent.type === 'VariableDeclarator' &&
                path.parent.id.type === 'ArrayPattern' &&
                path.parent.id.elements[0]) {
              const stateName = path.parent.id.elements[0].name;
              componentInfo.stateVars.push(stateName);
            }
          } else if (hookName === 'useReducer') {
            results.stateManagement.useReducer++;
          } else if (hookName === 'useContext') {
            results.stateManagement.context++;
          } else if (hookName === 'useEffect' || hookName === 'useLayoutEffect') {
            // Try to extract dependencies
            if (path.node.arguments.length > 1 && 
                path.node.arguments[1].type === 'ArrayExpression') {
              const deps = path.node.arguments[1].elements
                .filter(el => el && el.type === 'Identifier')
                .map(el => el.name);
              componentInfo.effectDependencies.push(...deps);
            }
          }
        }
      },
      
      // Detect JSX and rendering patterns
      JSXElement(path) {
        // Detect conditional rendering
        if (path.parent.type === 'ConditionalExpression' || 
            path.parent.type === 'LogicalExpression') {
          componentInfo.renderingPatterns.conditionalRendering = true;
          results.renderingPatterns.conditionalRendering++;
        }
        
        // Detect list rendering
        if (path.parent.type === 'CallExpression' && 
            path.parent.callee.type === 'MemberExpression' && 
            path.parent.callee.property.name === 'map') {
          componentInfo.renderingPatterns.listRendering = true;
          results.renderingPatterns.listRendering++;
        }
      },
      
      // Detect Fragment usage
      JSXFragment() {
        componentInfo.renderingPatterns.fragmentUsage = true;
        results.renderingPatterns.fragmentUsage++;
      },
      
      // Also detect React.Fragment
      JSXOpeningElement(path) {
        if (path.node.name.type === 'JSXIdentifier' && path.node.name.name === 'Fragment' ||
            (path.node.name.type === 'JSXMemberExpression' && 
             path.node.name.object.name === 'React' && 
             path.node.name.property.name === 'Fragment')) {
          componentInfo.renderingPatterns.fragmentUsage = true;
          results.renderingPatterns.fragmentUsage++;
        }
      }
    });
    
    // Check if this is a page component
    const isPageComponent = filePath.includes('/pages/') || 
                          filePath.includes('/app/') ||
                          filePath.match(/\/page\.[jt]sx?$/);
    
    if (isPageComponent) {
      componentInfo.type = 'page';
      results.componentsByType.page++;
    } else if (componentInfo.type === 'functional') {
      results.componentsByType.functional++;
    } else if (componentInfo.type === 'class') {
      results.componentsByType.class++;
    }
    
    // Only add if we found at least one component
    if (componentsFound > 0) {
      results.components.push(componentInfo);
      results.totalComponents += componentsFound;
      return componentInfo;
    }
    
    return null;
  } catch (error) {
    console.error(`Error analyzing file ${filePath}:`, error);
    return null;
  }
}

// Helper to determine if a node is a React component
function isReactComponent(path) {
  // Check if it returns JSX
  let returnsJSX = false;
  let hasJSXParam = false;
  
  // For function declarations, check the params
  if (path.node.params && path.node.params.length > 0) {
    // Check if first param is called props, or destructured props
    const firstParam = path.node.params[0];
    if (firstParam.type === 'Identifier' && 
        (firstParam.name === 'props' || firstParam.name === 'context')) {
      hasJSXParam = true;
    } else if (firstParam.type === 'ObjectPattern') {
      // Destructured props
      hasJSXParam = true;
    }
  }
  
  // Check return value
  if (path.node.body && path.node.body.type === 'BlockStatement') {
    // Find return statements
    path.traverse({
      ReturnStatement(returnPath) {
        if (returnPath.node.argument && 
            (returnPath.node.argument.type === 'JSXElement' || 
             returnPath.node.argument.type === 'JSXFragment')) {
          returnsJSX = true;
        }
      }
    });
  } else if (path.node.body && 
           (path.node.body.type === 'JSXElement' || 
            path.node.body.type === 'JSXFragment')) {
    // Implicit return in arrow function
    returnsJSX = true;
  }
  
  return returnsJSX || hasJSXParam;
}

// Helper to determine if a class is a React component
function isReactClassComponent(path) {
  let extendsReact = false;
  
  if (path.node.superClass) {
    if (path.node.superClass.type === 'Identifier' && 
        (path.node.superClass.name === 'Component' || 
         path.node.superClass.name === 'PureComponent')) {
      extendsReact = true;
    } else if (path.node.superClass.type === 'MemberExpression' && 
              path.node.superClass.object.name === 'React' && 
              (path.node.superClass.property.name === 'Component' || 
               path.node.superClass.property.name === 'PureComponent')) {
      extendsReact = true;
    }
  }
  
  let hasRenderMethod = false;
  if (path.node.body && path.node.body.type === 'ClassBody') {
    const methods = path.node.body.body;
    for (const method of methods) {
      if (method.type === 'ClassMethod' && 
          method.key.name === 'render') {
        hasRenderMethod = true;
        break;
      }
    }
  }
  
  return extendsReact || hasRenderMethod;
}

// Analyze a functional component
function analyzeComponent(path, componentInfo) {
  // Extract props information
  if (path.node.params && path.node.params.length > 0) {
    const propsParam = path.node.params[0];
    
    if (propsParam.type === 'ObjectPattern') {
      // Destructured props
      propsParam.properties.forEach(prop => {
        if (prop.type === 'ObjectProperty' && prop.key.type === 'Identifier') {
          componentInfo.props.push(prop.key.name);
        } else if (prop.type === 'RestElement' && prop.argument.type === 'Identifier') {
          componentInfo.props.push(`...${prop.argument.name}`);
        }
      });
    }
  }
  
  // Check for Higher Order Components
  if (path.parent && path.parent.type === 'CallExpression') {
    results.commonPatterns.hoc++;
  }
  
  // Check for render props pattern
  path.traverse({
    MemberExpression(memberPath) {
      if (memberPath.node.property.name === 'children' && 
          memberPath.parent.type === 'CallExpression') {
        results.commonPatterns.render_props++;
      }
    }
  });
}

// Analyze a class component
function analyzeClassComponent(path, componentInfo) {
  // Extract props from propTypes if available
  path.traverse({
    ClassProperty(propPath) {
      if (propPath.node.key.name === 'propTypes' && 
          propPath.node.value.type === 'ObjectExpression') {
        propPath.node.value.properties.forEach(prop => {
          if (prop.key && prop.key.type === 'Identifier') {
            componentInfo.props.push(prop.key.name);
          }
        });
      }
    }
  });
  
  // Extract state
  path.traverse({
    ClassProperty(propPath) {
      if (propPath.node.key.name === 'state' && 
          propPath.node.value.type === 'ObjectExpression') {
        propPath.node.value.properties.forEach(prop => {
          if (prop.key && prop.key.type === 'Identifier') {
            componentInfo.stateVars.push(prop.key.name);
          }
        });
      }
    }
  });
}

// Extract component name from file path
function getComponentNameFromPath(filePath) {
  const baseName = path.basename(filePath, path.extname(filePath));
  return baseName === 'index' ? path.basename(path.dirname(filePath)) : baseName;
}

// Generate report on component analysis
function generateReport() {
  let report = `# React Component Analysis Report\n\n`;
  
  // General stats
  report += `## General Statistics\n\n`;
  report += `- Total components analyzed: ${results.totalComponents}\n`;
  report += `- Functional components: ${results.componentsByType.functional}\n`;
  report += `- Class components: ${results.componentsByType.class}\n`;
  report += `- Page components: ${results.componentsByType.page}\n\n`;
  
  // Hook usage
  report += `## Hook Usage\n\n`;
  report += `| Hook | Usage Count |\n`;
  report += `|------|-------------|\n`;
  
  Object.entries(results.hookUsage)
    .sort((a, b) => b[1] - a[1])
    .forEach(([hook, count]) => {
      report += `| ${hook} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // State management
  report += `## State Management\n\n`;
  report += `| Approach | Usage Count |\n`;
  report += `|----------|-------------|\n`;
  
  Object.entries(results.stateManagement)
    .sort((a, b) => b[1] - a[1])
    .forEach(([approach, count]) => {
      if (count > 0) {
        report += `| ${approach} | ${count} |\n`;
      }
    });
  
  report += `\n`;
  
  // Rendering patterns
  report += `## Rendering Patterns\n\n`;
  report += `| Pattern | Usage Count |\n`;
  report += `|---------|-------------|\n`;
  
  Object.entries(results.renderingPatterns)
    .sort((a, b) => b[1] - a[1])
    .forEach(([pattern, count]) => {
      const formattedPattern = pattern.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      report += `| ${formattedPattern} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // Component design patterns
  report += `## Component Design Patterns\n\n`;
  report += `| Pattern | Usage Count |\n`;
  report += `|---------|-------------|\n`;
  
  Object.entries(results.commonPatterns)
    .sort((a, b) => b[1] - a[1])
    .forEach(([pattern, count]) => {
      const formattedPattern = pattern.replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
        
      report += `| ${formattedPattern} | ${count} |\n`;
    });
  
  report += `\n`;
  
  // Component details
  report += `## Component Details\n\n`;
  
  results.components.forEach(component => {
    report += `### ${component.componentName} (${component.type})\n\n`;
    report += `- File: \`${component.filePath}\`\n`;
    report += `- Hooks: ${component.hooks.length > 0 ? component.hooks.join(', ') : 'None'}\n`;
    report += `- Props: ${component.props.length > 0 ? component.props.join(', ') : 'None'}\n`;
    report += `- State Variables: ${component.stateVars.length > 0 ? component.stateVars.join(', ') : 'None'}\n`;
    report += `- Effect Dependencies: ${component.effectDependencies.length > 0 ? component.effectDependencies.join(', ') : 'None'}\n`;
    
    const patterns = [];
    if (component.renderingPatterns.conditionalRendering) patterns.push('Conditional Rendering');
    if (component.renderingPatterns.listRendering) patterns.push('List Rendering');
    if (component.renderingPatterns.fragmentUsage) patterns.push('Fragment Usage');
    
    report += `- Rendering Patterns: ${patterns.length > 0 ? patterns.join(', ') : 'None'}\n`;
    
    if (component.uiLibrary) {
      report += `- UI Library: ${component.uiLibrary}\n`;
    }
    
    report += `\n`;
  });
  
  // Find similar components
  report += `## Potentially Similar Components\n\n`;
  
  const similarComponents = findSimilarComponents();
  
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
      report += `  - \`${componentA.filePath}\`\n`;
      report += `  - \`${componentB.filePath}\`\n\n`;
    });
  }
  
  // Potential issues
  report += `## Potential Issues\n\n`;
  
  // Check for large components
  const largeComponents = results.components
    .filter(comp => comp.hooks.length > 5 || comp.stateVars.length > 5 || comp.props.length > 10)
    .sort((a, b) => {
      const sizeA = (a.hooks.length + a.stateVars.length + a.props.length);
      const sizeB = (b.hooks.length + b.stateVars.length + b.props.length);
      return sizeB - sizeA;
    });
  
  if (largeComponents.length > 0) {
    report += `### Large Components\n\n`;
    report += `The following components may be too large and could benefit from being broken down:\n\n`;
    
    largeComponents.slice(0, 10).forEach(comp => {
      report += `- **${comp.componentName}** (${comp.type})\n`;
      report += `  - ${comp.hooks.length} hooks, ${comp.stateVars.length} state variables, ${comp.props.length} props\n`;
      report += `  - File: \`${comp.filePath}\`\n\n`;
    });
  }
  
  // Check for inconsistent component organization
  report += `### Component Organization\n\n`;
  
  const pageComponents = results.components.filter(comp => comp.type === 'page');
  const pageComponentsWithManyProps = pageComponents.filter(comp => comp.props.length > 5);
  
  if (pageComponentsWithManyProps.length > 0) {
    report += `The following page components have many props and might need to be restructured:\n\n`;
    
    pageComponentsWithManyProps.forEach(comp => {
      report += `- **${comp.componentName}** (${comp.props.length} props)\n`;
      report += `  - File: \`${comp.filePath}\`\n\n`;
    });
  }
  
  // Check for inconsistent hook usage
  const componentsWithoutDeps = results.components.filter(comp => 
    comp.hooks.includes('useEffect') && comp.effectDependencies.length === 0
  );
  
  if (componentsWithoutDeps.length > 0) {
    report += `### Components with useEffect and no dependencies\n\n`;
    report += `The following components use useEffect without specified dependencies, which might lead to unnecessary renders:\n\n`;
    
    componentsWithoutDeps.forEach(comp => {
      report += `- **${comp.componentName}**\n`;
      report += `  - File: \`${comp.filePath}\`\n\n`;
    });
  }
  
  // Recommendations
  report += `## Recommendations\n\n`;
  
  const recommendations = [];
  
  // Check for class components
  if (results.componentsByType.class > 0) {
    recommendations.push(`- Consider migrating remaining class components (${results.componentsByType.class}) to functional components with hooks.`);
  }
  
  // Check for mixed state management
  const stateApproaches = Object.entries(results.stateManagement)
    .filter(([_, count]) => count > 0)
    .map(([approach, _]) => approach);
    
  if (stateApproaches.length > 1) {
    recommendations.push(`- Consider standardizing state management. Currently using multiple approaches: ${stateApproaches.join(', ')}`);
  }
  
  // Check for large components
  if (largeComponents.length > 0) {
    recommendations.push(`- Refactor large components into smaller, more focused components.`);
  }
  
  // Check for missing effect dependencies
  if (componentsWithoutDeps.length > 0) {
    recommendations.push(`- Review useEffect hooks without dependency arrays.`);
  }
  
  // Check for similar components
  if (similarComponents.length > 0) {
    recommendations.push(`- Review similar components for potential consolidation.`);
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

// Find similar components based on hooks, props, and patterns
function findSimilarComponents() {
  const similarPairs = [];
  
  for (let i = 0; i < results.components.length; i++) {
    for (let j = i + 1; j < results.components.length; j++) {
      const compA = results.components[i];
      const compB = results.components[j];
      
      // Skip different component types
      if (compA.type !== compB.type) continue;
      
      const reasons = [];
      let similarityScore = 0;
      
      // Check for similar hooks
      const commonHooks = compA.hooks.filter(hook => compB.hooks.includes(hook));
      if (commonHooks.length > 0 && 
          commonHooks.length / Math.max(compA.hooks.length, compB.hooks.length) > 0.7) {
        similarityScore += 0.3;
        reasons.push(`Similar hooks (${commonHooks.join(', ')})`);
      }
      
      // Check for similar props
      const commonProps = compA.props.filter(prop => compB.props.includes(prop));
      if (commonProps.length > 0 && 
          commonProps.length / Math.max(compA.props.length, compB.props.length) > 0.7) {
        similarityScore += 0.3;
        reasons.push(`Similar props (${commonProps.join(', ')})`);
      }
      
      // Check for similar rendering patterns
      const patternA = compA.renderingPatterns;
      const patternB = compB.renderingPatterns;
      
      if (patternA.conditionalRendering === patternB.conditionalRendering &&
          patternA.listRendering === patternB.listRendering &&
          patternA.fragmentUsage === patternB.fragmentUsage) {
        similarityScore += 0.2;
        reasons.push('Similar rendering patterns');
      }
      
      // Check for similar state variables
      const commonStateVars = compA.stateVars.filter(state => compB.stateVars.includes(state));
      if (commonStateVars.length > 0 && 
          commonStateVars.length / Math.max(compA.stateVars.length, compB.stateVars.length) > 0.7) {
        similarityScore += 0.2;
        reasons.push(`Similar state variables (${commonStateVars.join(', ')})`);
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

// Main function to run the analysis
async function analyzeComponents() {
  console.log('Analyzing React components...');
  
  // Get all component files
  const componentFiles = getAllComponentFiles();
  console.log(`Found ${componentFiles.length} potential component files.`);
  
  // Analyze each file
  componentFiles.forEach(file => {
    analyzeComponentFile(file);
  });
  
  console.log(`Analyzed ${results.totalComponents} components.`);
  
  // Generate the report
  const report = generateReport();
  
  // Write the report to a file
  fs.writeFileSync('component-analysis-report.md', report);
  console.log('Component analysis complete! Report written to component-analysis-report.md');
}

// Run the analysis
analyzeComponents().catch(error => {
  console.error('Error running component analysis:', error);
});