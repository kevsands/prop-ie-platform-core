// project-structure-visualizer.js
// Run with: node project-structure-visualizer.js

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Root directory to start scanning (current directory by default)
  rootDir: '.',
  // Directories to exclude from scanning
  excludeDirs: ['node_modules', '.git', '.next', 'out', 'build', 'dist', 'coverage'],
  // File extensions to include in the visualization
  includeExtensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss', '.json'],
  // Max depth to scan
  maxDepth: 5,
  // Whether to output file sizes
  showFileSizes: true,
  // Minimum file size to show (in bytes)
  minFileSize: 0
};

// Map to store directory statistics
const directoryStats = new Map();

// Get human readable file size
function getReadableFileSize(size) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let fileSize = size;
  let unitIndex = 0;
  
  while (fileSize >= 1024 && unitIndex < units.length - 1) {
    fileSize /= 1024;
    unitIndex++;
  }
  
  return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
}

// Create ASCII tree representation of the directory structure
function createDirectoryTree(dir, prefix = '', isLast = true, depth = 0) {
  if (depth > config.maxDepth) return '';
  
  const base = path.basename(dir);
  const newPrefix = prefix + (isLast ? '    ' : '│   ');
  
  // Skip excluded directories
  if (config.excludeDirs.includes(base) && dir !== config.rootDir) {
    return `${prefix}${isLast ? '└── ' : '├── '}${base} (excluded)\n`;
  }
  
  let result = '';
  if (dir !== config.rootDir) {
    // Get directory stats if we've calculated them
    const stats = directoryStats.get(dir);
    const sizeInfo = stats && config.showFileSizes ? ` (${getReadableFileSize(stats.totalSize)}, ${stats.fileCount} files)` : '';
    result = `${prefix}${isLast ? '└── ' : '├── '}${base}${sizeInfo}\n`;
  }
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // Process directories first, then files
    const dirs = entries.filter(entry => entry.isDirectory());
    const files = entries.filter(entry => entry.isFile());
    
    // Process directories
    dirs.forEach((entry, idx) => {
      const isLastDir = idx === dirs.length - 1 && files.length === 0;
      const entryPath = path.join(dir, entry.name);
      result += createDirectoryTree(entryPath, newPrefix, isLastDir, depth + 1);
    });
    
    // Process files
    files.forEach((entry, idx) => {
      const entryPath = path.join(dir, entry.name);
      const ext = path.extname(entry.name);
      
      // Skip files with extensions not in the include list
      if (!config.includeExtensions.includes(ext)) return;
      
      try {
        const stats = fs.statSync(entryPath);
        
        // Skip files smaller than the minimum size
        if (stats.size < config.minFileSize) return;
        
        const sizeInfo = config.showFileSizes ? ` (${getReadableFileSize(stats.size)})` : '';
        result += `${newPrefix}${idx === files.length - 1 ? '└── ' : '├── '}${entry.name}${sizeInfo}\n`;
      } catch (err) {
        // Ignore errors when getting file stats
      }
    });
  } catch (err) {
    result += `${newPrefix}Error reading directory: ${err.message}\n`;
  }
  
  return result;
}

// Calculate directory statistics
function calculateDirectoryStats(dir) {
  // Skip excluded directories
  if (config.excludeDirs.includes(path.basename(dir)) && dir !== config.rootDir) {
    return { totalSize: 0, fileCount: 0 };
  }
  
  let totalSize = 0;
  let fileCount = 0;
  
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    // Calculate stats for each entry
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        // Recursively calculate stats for subdirectories
        const subDirStats = calculateDirectoryStats(entryPath);
        totalSize += subDirStats.totalSize;
        fileCount += subDirStats.fileCount;
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        
        // Only count files with included extensions
        if (config.includeExtensions.includes(ext)) {
          try {
            const stats = fs.statSync(entryPath);
            totalSize += stats.size;
            fileCount++;
          } catch (err) {
            // Ignore errors when getting file stats
          }
        }
      }
    }
    
    // Store stats for this directory
    directoryStats.set(dir, { totalSize, fileCount });
    
    return { totalSize, fileCount };
  } catch (err) {
    return { totalSize: 0, fileCount: 0 };
  }
}

// Function to summarize project structure by file types
function summarizeFileTypes() {
  const fileTypeCounts = {};
  const fileTypeSizes = {};
  
  function processDirectory(dir) {
    // Skip excluded directories
    if (config.excludeDirs.includes(path.basename(dir)) && dir !== config.rootDir) {
      return;
    }
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Recursively process subdirectories
          processDirectory(entryPath);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          
          // Count only included extensions
          if (config.includeExtensions.includes(ext)) {
            // Initialize counters for this extension if needed
            if (!fileTypeCounts[ext]) {
              fileTypeCounts[ext] = 0;
              fileTypeSizes[ext] = 0;
            }
            
            fileTypeCounts[ext]++;
            
            try {
              const stats = fs.statSync(entryPath);
              fileTypeSizes[ext] += stats.size;
            } catch (err) {
              // Ignore errors when getting file stats
            }
          }
        }
      }
    } catch (err) {
      // Ignore errors reading directories
    }
  }
  
  // Start processing from the root directory
  processDirectory(config.rootDir);
  
  // Sort file types by count
  const sortedFileTypes = Object.keys(fileTypeCounts).sort((a, b) => 
    fileTypeCounts[b] - fileTypeCounts[a]
  );
  
  let summary = "# File Type Summary\n\n";
  summary += "| Extension | Count | Total Size |\n";
  summary += "|-----------|-------|------------|\n";
  
  sortedFileTypes.forEach(ext => {
    summary += `| ${ext || '(no extension)'} | ${fileTypeCounts[ext]} | ${getReadableFileSize(fileTypeSizes[ext])} |\n`;
  });
  
  return summary;
}

// Function to summarize folder sizes
function summarizeFolderSizes() {
  // Get top-level directories
  const rootEntries = fs.readdirSync(config.rootDir, { withFileTypes: true });
  const topDirs = rootEntries
    .filter(entry => entry.isDirectory() && !config.excludeDirs.includes(entry.name))
    .map(entry => path.join(config.rootDir, entry.name));
  
  // Sort directories by size
  const sortedDirs = topDirs.sort((a, b) => {
    const statsA = directoryStats.get(a) || { totalSize: 0 };
    const statsB = directoryStats.get(b) || { totalSize: 0 };
    return statsB.totalSize - statsA.totalSize;
  });
  
  let summary = "# Folder Size Summary\n\n";
  summary += "| Folder | File Count | Total Size |\n";
  summary += "|--------|------------|------------|\n";
  
  sortedDirs.forEach(dir => {
    const stats = directoryStats.get(dir) || { totalSize: 0, fileCount: 0 };
    const dirName = path.basename(dir);
    summary += `| ${dirName} | ${stats.fileCount} | ${getReadableFileSize(stats.totalSize)} |\n`;
  });
  
  return summary;
}

// Main function
function visualizeProjectStructure() {
  console.log("Analyzing project structure...");
  
  // First calculate directory statistics
  calculateDirectoryStats(config.rootDir);
  
  // Generate the ASCII tree
  const tree = createDirectoryTree(config.rootDir);
  
  // Generate file type summary
  const fileTypeSummary = summarizeFileTypes();
  
  // Generate folder size summary
  const folderSizeSummary = summarizeFolderSizes();
  
  // Create the complete report
  const report = `# Project Structure Visualization

## Directory Tree
\`\`\`
${tree}
\`\`\`

${folderSizeSummary}

${fileTypeSummary}

## Potential Issues to Look For

1. **Duplicate Features**: Look for similar directories in different parts of the codebase, which might indicate duplicated functionality.

2. **File Organization Inconsistencies**: Check if similar files are organized differently across the codebase.

3. **Oversized Folders/Files**: Large folders or files may indicate a need for better decomposition.

4. **Naming Inconsistencies**: Look for inconsistent naming patterns.

5. **Mixed Patterns**: Different architectural patterns mixed together may indicate inconsistent development.

## Next Steps

1. Run a more detailed analysis with the codebase audit script.
2. Review large directories and files first for potential refactoring.
3. Check for duplicated functionality across different parts of the application.
4. Establish coding standards and organization patterns if they don't exist.
`;

  // Write the report to a file
  fs.writeFileSync('project-structure-report.md', report);
  console.log("Project structure visualization complete! See project-structure-report.md for details.");
}

// Run the visualizer
visualizeProjectStructure();