#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// Get package name from command line
const packageName = process.argv[2];

if (!packageName) {
  console.error('Please provide a package name.');
  console.error('Usage: node analyze-package.js <package-name>');
  process.exit(1);
}

// Check for suspicious patterns
const suspiciousPatterns = [
  /eval\s*\(/g,
  /Function\s*\(/g,
  /setTimeout\s*\(\s*["'`]/g,
  /setInterval\s*\(\s*["'`]/g,
  /document\.write/g,
  /document\.location/g,
  /innerHTML\s*=/g,
  /outerHTML\s*=/g,
  /insertAdjacentHTML/g,
  /localStorage/g,
  /sessionStorage/g,
  /navigator\.sendBeacon/g,
  /fetch\s*\(\s*["'`]/g,
  /XMLHttpRequest/g,
  /require\s*\(\s*["'`][^"'`]*[+,.]/g,
  /import\s*\(\s*["'`][^"'`]*[+,.]/g,
  /\bshell\b/g,
  /\bexec\b/g,
  /\bspawn\b/g,
  /\bchild_process\b/g,
  /https?:\/\/(?!registry\.npmjs\.org|github\.com|unpkg\.com|jsdelivr\.net).+/g,
  /\.install\b/g,
  /\.postinstall\b/g,
  /\.preinstall\b/g,
  /atob\(/g,
  /btoa\(/g
];

// Download and analyze package
async function analyzePackage() {
  console.log(`Analyzing package: ${packageName}\n`);
  
  try {
    // Get package information from npm
    const packageInfo = await getPackageInfo(packageName);
    displayPackageInfo(packageInfo);
    
    // Install package to temp directory
    const tempDir = path.join(process.cwd(), 'temp-package-analysis');
    prepareDirectory(tempDir);
    installPackageToTemp(packageName, tempDir);
    
    // Analyze package files
    await analyzePackageFiles(tempDir);
    
    // Check GitHub activity
    if (packageInfo.repository && packageInfo.repository.url) {
      await checkGitHubActivity(packageInfo.repository.url);
    }
    
    // Clean up
    cleanupDirectory(tempDir);
    
    console.log('\nAnalysis complete!');
  } catch (error) {
    console.error(`Error analyzing package: ${error.message}`);
    process.exit(1);
  }
}

// Get package info from npm registry
function getPackageInfo(packageName) {
  return new Promise((resolve, reject) => {
    https.get(`https://registry.npmjs.org/${packageName}`, (resp) => {
      let data = '';
      
      resp.on('data', (chunk) => {
        data += chunk;
      });
      
      resp.on('end', () => {
        try {
          const packageInfo = JSON.parse(data);
          if (packageInfo.error) {
            reject(new Error(packageInfo.error));
            return;
          }
          resolve(packageInfo);
        } catch (e) {
          reject(new Error(`Failed to parse package info: ${e.message}`));
        }
      });
      
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch package info: ${err.message}`));
    });
  });
}

// Display package information
function displayPackageInfo(packageInfo) {
  const latestVersion = packageInfo['dist-tags'] ? packageInfo['dist-tags'].latest : 'unknown';
  const versionInfo = packageInfo.versions && packageInfo.versions[latestVersion] ? packageInfo.versions[latestVersion] : {};
  
  console.log('Package Information:');
  console.log(`- Name: ${packageInfo.name}`);
  console.log(`- Version: ${latestVersion}`);
  console.log(`- Description: ${versionInfo.description || 'No description'}`);
  console.log(`- Homepage: ${versionInfo.homepage || 'No homepage'}`);
  console.log(`- License: ${versionInfo.license || 'No license information'}`);
  console.log(`- Author: ${typeof versionInfo.author === 'object' ? versionInfo.author.name : versionInfo.author || 'Unknown'}`);
  
  // Check for install scripts
  const scripts = versionInfo.scripts || {};
  const installScripts = Object.keys(scripts).filter(script => 
    ['install', 'preinstall', 'postinstall'].includes(script)
  );
  
  if (installScripts.length > 0) {
    console.log('\n⚠️ WARNING: Package contains install scripts:');
    installScripts.forEach(script => {
      console.log(`- ${script}: ${scripts[script]}`);
    });
  }
  
  // Check dependencies
  const deps = { 
    ...versionInfo.dependencies || {}, 
    ...versionInfo.devDependencies || {},
    ...versionInfo.peerDependencies || {}
  };
  
  console.log(`\nDependencies: ${Object.keys(deps).length}`);
  if (Object.keys(deps).length > 20) {
    console.log('⚠️ WARNING: Large number of dependencies');
  }
}

// Prepare temp directory
function prepareDirectory(dir) {
  if (fs.existsSync(dir)) {
    execSync(`rm -rf ${dir}`);
  }
  fs.mkdirSync(dir, { recursive: true });
}

// Install package to temp directory
function installPackageToTemp(packageName, dir) {
  console.log(`\nInstalling ${packageName} to temporary directory for analysis...`);
  execSync(`cd ${dir} && npm init -y && npm install ${packageName} --no-save`, { stdio: 'pipe' });
}

// Analyze package files
async function analyzePackageFiles(dir) {
  console.log('\nAnalyzing package files...');
  
  const packagePath = path.join(dir, 'node_modules', packageName);
  if (!fs.existsSync(packagePath)) {
    console.log('Package directory not found. Checking for scoped package...');
    
    // Try to find the package in node_modules (might be a scoped package)
    const nodeModules = path.join(dir, 'node_modules');
    const scopedPackages = fs.readdirSync(nodeModules)
      .filter(item => item.startsWith('@') && fs.statSync(path.join(nodeModules, item)).isDirectory())
      .flatMap(scope => {
        const scopeDir = path.join(nodeModules, scope);
        return fs.readdirSync(scopeDir)
          .map(pkg => ({ name: `${scope}/${pkg}`, path: path.join(scopeDir, pkg) }));
      });
    
    const matchingPackage = scopedPackages.find(pkg => pkg.name === packageName);
    if (!matchingPackage) {
      throw new Error(`Could not find installed package: ${packageName}`);
    }
    
    analyzeDirectory(matchingPackage.path);
  } else {
    analyzeDirectory(packagePath);
  }
}

// Analyze a directory recursively
function analyzeDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  // Read package.json first
  const packageJsonPath = path.join(dir, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for suspicious scripts
      const scripts = packageJson.scripts || {};
      Object.entries(scripts).forEach(([name, script]) => {
        if (['install', 'preinstall', 'postinstall', 'prepublish', 'prepare'].includes(name)) {
          console.log(`⚠️ Found ${name} script: ${script}`);
          
          // Check script content for suspicious patterns
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(script)) {
              console.log(`🚨 ALERT: Suspicious pattern in ${name} script: ${pattern}`);
            }
          });
        }
      });
    } catch (error) {
      console.error(`Error reading package.json: ${error.message}`);
    }
  }
  
  // Find JavaScript files
  const jsFileExtensions = ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx'];
  
  function scanDir(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        scanDir(fullPath);
      } else if (entry.isFile() && jsFileExtensions.includes(path.extname(entry.name).toLowerCase())) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          
          // Check for suspicious patterns
          suspiciousPatterns.forEach(pattern => {
            pattern.lastIndex = 0; // Reset regex state
            
            let match;
            while ((match = pattern.exec(content)) !== null) {
              console.log(`🚨 Suspicious pattern in ${fullPath.replace(dir, '')}: ${pattern}`);
              console.log(`   Context: "${content.substring(Math.max(0, match.index - 40), match.index + match[0].length + 40)}"`);
            }
          });
        } catch (error) {
          console.error(`Could not read file ${fullPath}: ${error.message}`);
        }
      }
    }
  }
  
  try {
    scanDir(dir);
  } catch (error) {
    console.error(`Error scanning directory ${dir}: ${error.message}`);
  }
}

// Extract GitHub info from repository URL
function extractGitHubInfo(repoUrl) {
  // Handle different URL formats
  let match;
  
  if (repoUrl.includes('github.com')) {
    // Regular GitHub URL
    match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/\.]+)/);
  } else if (repoUrl.startsWith('git+https://')) {
    // git+https:// URL
    match = repoUrl.match(/git\+https:\/\/github\.com\/([^\/]+)\/([^\/\.]+)/);
  } else if (repoUrl.startsWith('git:')) {
    // git: URL
    match = repoUrl.match(/git:\/\/github\.com\/([^\/]+)\/([^\/\.]+)/);
  } else if (repoUrl.startsWith('github:')) {
    // github: shorthand
    match = repoUrl.match(/github:([^\/]+)\/([^\/\.]+)/);
  }
  
  if (match) {
    return {
      owner: match[1],
      repo: match[2].replace('.git', '')
    };
  }
  
  return null;
}

// Check GitHub activity
async function checkGitHubActivity(repoUrl) {
  console.log('\nChecking GitHub activity...');
  
  const githubInfo = extractGitHubInfo(repoUrl);
  if (!githubInfo) {
    console.log(`Could not extract GitHub info from URL: ${repoUrl}`);
    return;
  }
  
  const { owner, repo } = githubInfo;
  
  // Get repository info
  try {
    const repoData = await fetchGitHubAPI(`https://api.github.com/repos/${owner}/${repo}`);
    
    console.log('GitHub Repository Information:');
    console.log(`- Stars: ${repoData.stargazers_count}`);
    console.log(`- Forks: ${repoData.forks_count}`);
    console.log(`- Open Issues: ${repoData.open_issues_count}`);
    console.log(`- Last Updated: ${new Date(repoData.updated_at).toLocaleDateString()}`);
    
    // Check for warning signs
    const lastUpdated = new Date(repoData.updated_at);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    if (lastUpdated < sixMonthsAgo) {
      console.log('⚠️ WARNING: Repository has not been updated in over 6 months.');
    }
    
    if (repoData.stargazers_count < 50) {
      console.log('⚠️ WARNING: Repository has fewer than 50 stars.');
    }
    
    // Get recent commits
    const commitsData = await fetchGitHubAPI(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`);
    
    console.log('\nRecent Commits:');
    commitsData.slice(0, 5).forEach((commit, i) => {
      console.log(`- ${new Date(commit.commit.author.date).toLocaleDateString()}: ${commit.commit.message.split('\n')[0]}`);
    });
    
  } catch (error) {
    console.error(`Error fetching GitHub data: ${error.message}`);
  }
}

// Fetch data from GitHub API
function fetchGitHubAPI(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Package-Analyzer'
      }
    };
    
    https.get(url, options, (resp) => {
      let data = '';
      
      resp.on('data', (chunk) => {
        data += chunk;
      });
      
      resp.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          if (jsonData.message && jsonData.message.includes('API rate limit exceeded')) {
            reject(new Error('GitHub API rate limit exceeded. Try again later.'));
            return;
          }
          resolve(jsonData);
        } catch (e) {
          reject(new Error(`Failed to parse GitHub API response: ${e.message}`));
        }
      });
      
    }).on('error', (err) => {
      reject(new Error(`Failed to fetch from GitHub API: ${err.message}`));
    });
  });
}

// Clean up temporary directory
function cleanupDirectory(dir) {
  if (fs.existsSync(dir)) {
    execSync(`rm -rf ${dir}`);
  }
}

// Run the analysis
analyzePackage().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});