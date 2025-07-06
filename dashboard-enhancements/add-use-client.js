// Script to add 'use client' directive to React component files
const fs = require('fs');
const path = require('path');
const directories = [path.join(__dirname, 'src/components'), path.join(__dirname, 'src/context'), path.join(__dirname, 'src/app')];
const extensions = ['.js', '.jsx', '.ts', '.tsx'];

function needsUseClientDirective(content) {
  if (content.trim().startsWith("'use client'") || content.trim().startsWith('"use client"')) return false;
  const clientPatterns = [
    /useState\(/, /useEffect\(/, /useContext\(/, /useRef\(/, /useCallback\(/, 
    /useMemo\(/, /useReducer\(/, /useRouter\(/, /onClick=/, /onChange=/, 
    /onSubmit=/, /window\./, /document\./, /localStorage\./, /sessionStorage\./, 
    /navigator\./, /fetch\(/
  ];
  return clientPatterns.some(pattern => pattern.test(content));
}

function addUseClientDirective(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (needsUseClientDirective(content)) {
      console.log(`Adding 'use client' directive to ${filePath}`);
      const updatedContent = "'use client';\n\n" + content;
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

function processDirectory(directory) {
  let modifiedCount = 0;
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        if (file !== 'node_modules' && file !== '.next') {
          modifiedCount += processDirectory(filePath);
        }
      } else if (stats.isFile() && extensions.includes(path.extname(file))) {
        if (addUseClientDirective(filePath)) {
          modifiedCount++;
        }
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directory}:`, error);
  }
  return modifiedCount;
}

let totalModified = 0;
console.log('Starting to add \'use client\' directives...');

for (const directory of directories) {
  if (fs.existsSync(directory)) {
    console.log(`Processing directory: ${directory}`);
    totalModified += processDirectory(directory);
  } else {
    console.log(`Directory not found: ${directory}`);
  }
}

console.log(`Completed! Added 'use client' directive to ${totalModified} files.`);
