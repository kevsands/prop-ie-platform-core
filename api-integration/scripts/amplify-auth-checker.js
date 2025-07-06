// AWS Amplify v6 Auth Integration Checker
// This script analyzes your Amplify authentication implementation for best practices and potential issues

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  rootDir: process.cwd(),
  srcDir: path.join(process.cwd(), 'src'),
  amplifyDir: path.join(process.cwd(), 'src/lib/amplify'),
  excludeDirs: ['node_modules', '.next', '.git', 'out', 'dist'],
  checkPatterns: {
    amplifyImport: /import\s+.*\s+from\s+['"]aws-amplify['"]/,
    oldAmplifyImport: /import\s+.*\s+from\s+['"]@aws-amplify\/[^'"]+['"]/,
    v6Import: /import\s+.*\s+from\s+['"]aws-amplify\/[^'"]+['"]/,
    authImport: /import\s+.*\s+from\s+['"]aws-amplify\/auth['"]/,
    authServerImport: /import\s+.*\s+from\s+['"]aws-amplify\/auth\/server['"]/,
    signIn: /signIn\s*\(/,
    signUp: /signUp\s*\(/,
    signOut: /signOut\s*\(/,
    confirmSignUp: /confirmSignUp\s*\(/,
    getCurrentUser: /getCurrentUser\s*\(/,
    fetchUserAttributes: /fetchUserAttributes\s*\(/,
    fetchAuthSession: /fetchAuthSession\s*\(/,
    amplifyConfig: /Amplify\.configure\s*\(/,
    cognitoConfig: /\b(userPoolId|userPoolWebClientId|identityPoolId)\b/,
    tokenStorage: /\b(localStorage|sessionStorage)\.setItem\s*\([^)]*token/,
    tokenHandling: /\b(accessToken|idToken|refreshToken)\b/,
    errorHandling: /(try\s*{[^}]*signIn|signUp|signOut|confirmSignUp)[^}]*catch\s*\(/s,
    mfaHandling: /\b(MFA|multi-factor|challengeName|TOTP|SMS_MFA)\b/i,
    userAttributes: /\b(attributes|userAttributes|profile)\b/
  }
};

// Main analysis function
async function analyzeAmplifyAuth() {
  console.log('🔍 Starting AWS Amplify Auth Integration analysis...\n');

  try {
    // 1. Check Amplify dependencies
    console.log('📦 Checking Amplify dependencies...');
    const dependencies = checkAmplifyDependencies();
    printDependencyStatus(dependencies);

    // 2. Find Amplify configuration
    console.log('\n⚙️ Looking for Amplify configuration...');
    const configFiles = findAmplifyConfig();
    console.log(`Found ${configFiles.length} configuration files.`);
    configFiles.forEach(file => console.log(`- ${file.path}`));

    // 3. Analyze Auth implementation
    console.log('\n🔐 Analyzing Auth implementation...');
    const authImplementation = analyzeAuthImplementation();
    printAuthImplementationSummary(authImplementation);

    // 4. Check authentication patterns
    console.log('\n🔍 Checking authentication patterns...');
    const authPatterns = checkAuthPatterns();
    printAuthPatternsSummary(authPatterns);

    // 5. Check for security best practices
    console.log('\n🛡️ Checking security best practices...');
    const securityCheck = checkSecurityBestPractices();
    printSecurityCheckSummary(securityCheck);

    // 6. Generate recommendations
    console.log('\n🛠️ Generating recommendations...');
    generateRecommendations({
      dependencies,
      configFiles,
      authImplementation,
      authPatterns,
      securityCheck
    });

  } catch (error) {
    console.error('Error during analysis:', error);
  }
}

// Check Amplify dependencies in package.json
function checkAmplifyDependencies() {
  let packageJson;
  try {
    packageJson = JSON.parse(fs.readFileSync(path.join(config.rootDir, 'package.json'), 'utf8'));
  } catch (error) {
    console.error('Error reading package.json:', error);
    return {
      hasAmplify: false,
      version: null,
      dependencies: [],
      devDependencies: []
    };
  }

  const dependencies = [];
  const devDependencies = [];

  // Check dependencies
  if (packageJson.dependencies) {
    for (const [name, version] of Object.entries(packageJson.dependencies)) {
      if (name === 'aws-amplify' || name.startsWith('@aws-amplify/')) {
        dependencies.push({ name, version });
      }
    }
  }

  // Check devDependencies
  if (packageJson.devDependencies) {
    for (const [name, version] of Object.entries(packageJson.devDependencies)) {
      if (name === 'aws-amplify' || name.startsWith('@aws-amplify/')) {
        devDependencies.push({ name, version });
      }
    }
  }

  // Determine if using Amplify v6
  const mainVersion = dependencies.find(dep => dep.name === 'aws-amplify')?.version || '';
  const isV6 = mainVersion.startsWith('6');

  return {
    hasAmplify: dependencies.length > 0,
    isV6: isV6,
    version: mainVersion,
    dependencies,
    devDependencies
  };
}

// Print dependency status
function printDependencyStatus(dependencies) {
  if (!dependencies.hasAmplify) {
    console.log('❌ AWS Amplify package not found in dependencies');
    return;
  }

  console.log(`✅ AWS Amplify version: ${dependencies.version}`);
  
  if (dependencies.isV6) {
    console.log('✅ Using Amplify v6');
  } else {
    console.log('⚠️ Not using Amplify v6 - consider upgrading');
  }

  console.log('\nAmplify dependencies:');
  dependencies.dependencies.forEach(dep => {
    console.log(`- ${dep.name}: ${dep.version}`);
  });

  if (dependencies.devDependencies.length > 0) {
    console.log('\nAmplify dev dependencies:');
    dependencies.devDependencies.forEach(dep => {
      console.log(`- ${dep.name}: ${dep.version}`);
    });
  }
}

// Find Amplify configuration files
function findAmplifyConfig() {
  const configFiles = [];

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
          
          // Check for Amplify configuration
          if (
            content.includes('Amplify.configure') ||
            content.includes('amplifyConfig') ||
            (content.includes('aws-exports') && content.includes('import'))
          ) {
            // Extract relevant configuration details
            let authConfig = null;
            
            if (content.includes('userPoolId') || content.includes('userPoolWebClientId')) {
              // Try to extract Cognito configuration
              const userPoolMatch = content.match(/userPoolId['"]*\s*:\s*['"]([^'"]+)['"]/);
              const clientIdMatch = content.match(/userPoolWebClientId['"]*\s*:\s*['"]([^'"]+)['"]/);
              
              if (userPoolMatch || clientIdMatch) {
                authConfig = {
                  userPoolId: userPoolMatch ? userPoolMatch[1] : 'undefined',
                  clientId: clientIdMatch ? clientIdMatch[1] : 'undefined'
                };
              }
            }
            
            configFiles.push({
              path: itemPath.replace(config.rootDir, ''),
              hasAuthConfig: !!authConfig,
              authConfig
            });
          }
        }
      }
    } catch (error) {
      console.error(`Error searching directory ${directory}:`, error);
    }
  }

  searchDirectory(config.srcDir);
  return configFiles;
}

// Analyze Auth implementation
function analyzeAuthImplementation() {
  let authFiles = [];
  let authComponents = [];
  let customAuthImplementation = false;
  let useServerComponents = false;
  
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
          
          // Check if it's an auth-related file
          if (
            (content.match(config.checkPatterns.authImport) || 
             content.match(config.checkPatterns.authServerImport)) &&
            (content.match(config.checkPatterns.signIn) || 
             content.match(config.checkPatterns.signUp) || 
             content.match(config.checkPatterns.signOut) || 
             content.match(config.checkPatterns.getCurrentUser))
          ) {
            authFiles.push({
              path: itemPath.replace(config.rootDir, ''),
              isServerComponent: content.includes('auth/server') || !content.includes("'use client'")
            });
            
            if (content.includes('auth/server') || content.includes('fetchAuthSession(contextSpec)')) {
              useServerComponents = true;
            }
            
            if (content.includes('class Auth') || content.includes('const Auth =')) {
              customAuthImplementation = true;
            }
          }
          
          // Check if it's an auth-related component
          if (
            (content.includes('login') || 
             content.includes('register') || 
             content.includes('signup') || 
             content.includes('auth')) &&
            (content.includes('export default function') || 
             content.includes('export function') || 
             content.includes('export const'))
          ) {
            // Check if it's a React component
            if (
              content.includes('return (') && 
              (content.includes('<div') || 
               content.includes('<form') || 
               content.includes('<>'))
            ) {
              authComponents.push({
                path: itemPath.replace(config.rootDir, ''),
                isClientComponent: content.includes("'use client'")
              });
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error analyzing auth implementation in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  return {
    authFiles,
    authComponents,
    customAuthImplementation,
    useServerComponents
  };
}

// Print Auth implementation summary
function printAuthImplementationSummary(implementation) {
  console.log(`Found ${implementation.authFiles.length} auth implementation files`);
  console.log(`Found ${implementation.authComponents.length} auth-related components`);
  
  if (implementation.customAuthImplementation) {
    console.log('✅ Using custom Auth implementation wrapper');
  } else {
    console.log('ℹ️ Using direct Amplify Auth methods');
  }
  
  if (implementation.useServerComponents) {
    console.log('✅ Using server component integration');
  } else {
    console.log('ℹ️ No server component Auth integration detected');
  }
  
  if (implementation.authFiles.length > 0) {
    console.log('\nAuth implementation files:');
    implementation.authFiles.slice(0, 5).forEach(file => {
      console.log(`- ${file.path}${file.isServerComponent ? ' (server)' : ''}`);
    });
    if (implementation.authFiles.length > 5) {
      console.log(`  ... and ${implementation.authFiles.length - 5} more files`);
    }
  }
}

// Check authentication patterns
function checkAuthPatterns() {
  let signInUsage = 0;
  let signUpUsage = 0;
  let signOutUsage = 0;
  let getCurrentUserUsage = 0;
  let fetchUserAttributesUsage = 0;
  let fetchAuthSessionUsage = 0;
  let useAuthHook = false;
  let authContext = false;
  let errorHandling = 0;
  let mfaSupport = false;
  
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
          
          // Check authentication patterns
          if (content.match(config.checkPatterns.signIn)) {
            signInUsage++;
          }
          
          if (content.match(config.checkPatterns.signUp)) {
            signUpUsage++;
          }
          
          if (content.match(config.checkPatterns.signOut)) {
            signOutUsage++;
          }
          
          if (content.match(config.checkPatterns.getCurrentUser)) {
            getCurrentUserUsage++;
          }
          
          if (content.match(config.checkPatterns.fetchUserAttributes)) {
            fetchUserAttributesUsage++;
          }
          
          if (content.match(config.checkPatterns.fetchAuthSession)) {
            fetchAuthSessionUsage++;
          }
          
          if (content.includes('useAuth') || content.includes('function useAuth')) {
            useAuthHook = true;
          }
          
          if (content.includes('AuthContext') || content.includes('AuthProvider')) {
            authContext = true;
          }
          
          if (content.match(config.checkPatterns.errorHandling)) {
            errorHandling++;
          }
          
          if (content.match(config.checkPatterns.mfaHandling)) {
            mfaSupport = true;
          }
        }
      }
    } catch (error) {
      console.error(`Error checking auth patterns in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  return {
    signInUsage,
    signUpUsage,
    signOutUsage,
    getCurrentUserUsage,
    fetchUserAttributesUsage,
    fetchAuthSessionUsage,
    useAuthHook,
    authContext,
    errorHandling,
    mfaSupport
  };
}

// Print Auth patterns summary
function printAuthPatternsSummary(patterns) {
  console.log('Auth method usage:');
  console.log(`- signIn: ${patterns.signInUsage} occurrences`);
  console.log(`- signUp: ${patterns.signUpUsage} occurrences`);
  console.log(`- signOut: ${patterns.signOutUsage} occurrences`);
  console.log(`- getCurrentUser: ${patterns.getCurrentUserUsage} occurrences`);
  console.log(`- fetchUserAttributes: ${patterns.fetchUserAttributesUsage} occurrences`);
  console.log(`- fetchAuthSession: ${patterns.fetchAuthSessionUsage} occurrences`);
  
  console.log('\nAuth patterns:');
  console.log(`- useAuth hook: ${patterns.useAuthHook ? '✅' : '❌'}`);
  console.log(`- AuthContext: ${patterns.authContext ? '✅' : '❌'}`);
  console.log(`- Error handling: ${patterns.errorHandling} occurrences`);
  console.log(`- MFA support: ${patterns.mfaSupport ? '✅' : '❌'}`);
}

// Check security best practices
function checkSecurityBestPractices() {
  let tokenStorageInsecure = 0;
  let tokenStorageSecure = 0;
  let csrfProtection = false;
  let xssProtection = false;
  let inputValidation = 0;
  let securityErrorHandling = 0;
  
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
          
          // Check token storage practices
          if (content.match(/localStorage\.setItem\([^)]*token/i) || 
              content.match(/sessionStorage\.setItem\([^)]*token/i)) {
            tokenStorageInsecure++;
          }
          
          if (content.includes('HttpOnly') && content.includes('cookie')) {
            tokenStorageSecure++;
          }
          
          // Check for CSRF protection
          if (content.includes('csrf') || content.includes('CSRF') || 
              content.includes('xsrf') || content.includes('XSRF')) {
            csrfProtection = true;
          }
          
          // Check for XSS protection
          if (content.includes('sanitize') || content.includes('escape') || 
              content.includes('DOMPurify') || content.includes('Content-Security-Policy')) {
            xssProtection = true;
          }
          
          // Check for input validation
          if (content.includes('validate') || content.includes('validator') || 
              content.includes('zod') || content.includes('schema.parse')) {
            inputValidation++;
          }
          
          // Check for security-specific error handling
          if ((content.includes('security') || content.includes('auth')) && 
              content.includes('try') && content.includes('catch')) {
            securityErrorHandling++;
          }
        }
      }
    } catch (error) {
      console.error(`Error checking security practices in ${directory}:`, error);
    }
  }
  
  searchDirectory(config.srcDir);
  
  return {
    tokenStorageInsecure,
    tokenStorageSecure,
    csrfProtection,
    xssProtection,
    inputValidation,
    securityErrorHandling
  };
}

// Print security check summary
function printSecurityCheckSummary(security) {
  console.log('Token storage:');
  if (security.tokenStorageInsecure > 0) {
    console.log(`⚠️ Found ${security.tokenStorageInsecure} instances of potentially insecure token storage`);
  } else {
    console.log('✅ No insecure token storage detected');
  }
  
  if (security.tokenStorageSecure > 0) {
    console.log(`✅ Found ${security.tokenStorageSecure} instances of secure token storage`);
  }
  
  console.log('\nSecurity protections:');
  console.log(`- CSRF protection: ${security.csrfProtection ? '✅' : '❌'}`);
  console.log(`- XSS protection: ${security.xssProtection ? '✅' : '❌'}`);
  console.log(`- Input validation: ${security.inputValidation > 0 ? '✅' : '❌'} (${security.inputValidation} instances)`);
  console.log(`- Security error handling: ${security.securityErrorHandling > 0 ? '✅' : '❌'} (${security.securityErrorHandling} instances)`);
}

// Generate recommendations
function generateRecommendations(results) {
  const recommendations = [];
  
  // Dependency recommendations
  if (!results.dependencies.isV6) {
    recommendations.push('Upgrade to AWS Amplify v6 for improved modular imports and better tree-shaking.');
  }
  
  // Auth implementation recommendations
  if (!results.authImplementation.customAuthImplementation) {
    recommendations.push('Consider implementing a custom Auth wrapper to centralize authentication logic and error handling.');
  }
  
  if (!results.authImplementation.useServerComponents) {
    recommendations.push('Implement server-side authentication for improved security and Next.js App Router integration.');
  }
  
  // Auth patterns recommendations
  if (!results.authPatterns.useAuthHook) {
    recommendations.push('Create a useAuth hook for easier authentication state management in components.');
  }
  
  if (!results.authPatterns.authContext) {
    recommendations.push('Implement AuthContext for global authentication state management.');
  }
  
  if (results.authPatterns.errorHandling < 3) {
    recommendations.push('Improve error handling for authentication operations.');
  }
  
  if (!results.authPatterns.mfaSupport) {
    recommendations.push('Add Multi-Factor Authentication support for improved security.');
  }
  
  // Security recommendations
  if (results.securityCheck.tokenStorageInsecure > 0) {
    recommendations.push('Replace localStorage/sessionStorage token storage with HttpOnly cookies or a more secure approach.');
  }
  
  if (!results.securityCheck.csrfProtection) {
    recommendations.push('Implement CSRF protection for authentication and sensitive operations.');
  }
  
  if (!results.securityCheck.xssProtection) {
    recommendations.push('Add XSS protection through input sanitization and Content-Security-Policy.');
  }
  
  if (results.securityCheck.inputValidation < 5) {
    recommendations.push('Enhance input validation for all user inputs, especially in authentication forms.');
  }
  
  // Print recommendations
  if (recommendations.length === 0) {
    console.log('✅ No recommendations - your AWS Amplify auth implementation looks good!');
  } else {
    console.log(`Found ${recommendations.length} recommendations for improving your AWS Amplify auth implementation:`);
    recommendations.forEach((recommendation, index) => {
      console.log(`${index + 1}. ${recommendation}`);
    });
  }
}

// Run the analysis
analyzeAmplifyAuth();