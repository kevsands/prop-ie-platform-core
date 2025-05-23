#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixFramerMotionImports(content) {
  // Pattern 1: Fix imports from 'framer-motion/dist/framer-motion'
  content = content.replace(
    /import\s*{\s*AnimatePresence\s*}\s*from\s*['"]framer-motion\/dist\/framer-motion['"]/g,
    "import { AnimatePresence } from 'framer-motion'"
  );
  
  // Pattern 2: If AnimatePresence is imported separately, merge it with motion import
  // First check if there's already a motion import
  const motionImportRegex = /import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"]/;
  const animatePresenceImportRegex = /import\s*{\s*AnimatePresence\s*}\s*from\s*['"]framer-motion['"]/;
  
  if (motionImportRegex.test(content) && animatePresenceImportRegex.test(content)) {
    // Remove the separate AnimatePresence import
    content = content.replace(animatePresenceImportRegex, '');
    // Add AnimatePresence to the motion import
    content = content.replace(
      /import\s*{\s*motion\s*}\s*from\s*['"]framer-motion['"]/,
      "import { motion, AnimatePresence } from 'framer-motion'"
    );
  }
  
  // Pattern 3: Fix multiple imports that already include AnimatePresence
  content = content.replace(
    /import\s*{\s*([^}]*AnimatePresence[^}]*)\s*}\s*from\s*['"]framer-motion\/dist\/framer-motion['"]/g,
    "import { $1 } from 'framer-motion'"
  );
  
  return content;
}

async function processFiles() {
  const srcDir = path.join(__dirname, 'src');
  const files = glob.sync('**/*.{js,jsx,ts,tsx}', { cwd: srcDir });
  
  let fixedCount = 0;
  
  for (const file of files) {
    const filePath = path.join(srcDir, file);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      content = fixFramerMotionImports(content);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nFixed ${fixedCount} files.`);
}

processFiles().catch(console.error);