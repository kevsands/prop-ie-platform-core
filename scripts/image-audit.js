#!/usr/bin/env node

/**
 * Image Audit Script for Prop.ie Platform
 * Analyzes images and suggests optimization opportunities
 */

const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../public/images');
const OUTPUT_FILE = path.join(__dirname, '../image-audit-report.json');

// File size thresholds (in bytes)
const THRESHOLDS = {
  HERO_IMAGE_MAX: 1024 * 1024, // 1MB for hero images
  PROPERTY_IMAGE_MAX: 512 * 1024, // 512KB for property images
  THUMBNAIL_MAX: 100 * 1024, // 100KB for thumbnails
};

async function runImageAudit() {
  console.log('🔍 Starting image audit...');
  
  const auditResults = {
    timestamp: new Date().toISOString(),
    totalImages: 0,
    totalSize: 0,
    issues: [],
    recommendations: [],
    summary: {}
  };

  try {
    // Recursively scan image directory
    const images = await scanDirectory(IMAGE_DIR);
    
    auditResults.totalImages = images.length;
    auditResults.totalSize = images.reduce((sum, img) => sum + img.size, 0);
    
    // Analyze each image
    for (const image of images) {
      analyzeImage(image, auditResults);
    }
    
    // Generate summary
    generateSummary(auditResults);
    
    // Save report
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(auditResults, null, 2));
    
    // Display results
    displayResults(auditResults);
    
  } catch (error) {
    console.error('❌ Image audit failed:', error);
  }
}

async function scanDirectory(dir) {
  const images = [];
  
  function scanRecursive(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanRecursive(fullPath);
      } else if (isImageFile(item)) {
        const relativePath = path.relative(IMAGE_DIR, fullPath);
        images.push({
          name: item,
          path: relativePath,
          fullPath: fullPath,
          size: stat.size,
          extension: path.extname(item).toLowerCase(),
          category: categorizeImage(relativePath)
        });
      }
    }
  }
  
  scanRecursive(dir);
  return images;
}

function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg'];
  return imageExtensions.includes(path.extname(filename).toLowerCase());
}

function categorizeImage(relativePath) {
  const pathLower = relativePath.toLowerCase();
  
  if (pathLower.includes('hero')) return 'hero';
  if (pathLower.includes('thumbnail') || pathLower.includes('thumb')) return 'thumbnail';
  if (pathLower.includes('gallery')) return 'gallery';
  if (pathLower.includes('floor') || pathLower.includes('plan')) return 'floorplan';
  return 'property';
}

function analyzeImage(image, auditResults) {
  const { size, category, name, path: imagePath } = image;
  
  // Check file size against thresholds
  let threshold;
  switch (category) {
    case 'hero':
      threshold = THRESHOLDS.HERO_IMAGE_MAX;
      break;
    case 'thumbnail':
      threshold = THRESHOLDS.THUMBNAIL_MAX;
      break;
    default:
      threshold = THRESHOLDS.PROPERTY_IMAGE_MAX;
  }
  
  if (size > threshold) {
    auditResults.issues.push({
      type: 'oversized',
      severity: size > threshold * 2 ? 'high' : 'medium',
      image: imagePath,
      currentSize: formatBytes(size),
      threshold: formatBytes(threshold),
      category: category,
      reduction: Math.round(((size - threshold) / size) * 100)
    });
  }
  
  // Check for format optimization opportunities
  if (image.extension === '.png' && category !== 'floorplan') {
    auditResults.recommendations.push({
      type: 'format',
      image: imagePath,
      suggestion: 'Convert PNG to WebP/AVIF for better compression',
      potentialSaving: '60-80%'
    });
  }
  
  if (image.extension === '.jpg' && size > 200 * 1024) {
    auditResults.recommendations.push({
      type: 'compression',
      image: imagePath,
      suggestion: 'Optimize JPEG compression and consider WebP format',
      potentialSaving: '30-50%'
    });
  }
}

function generateSummary(auditResults) {
  const issues = auditResults.issues;
  const totalSavings = issues.reduce((sum, issue) => {
    // Estimate potential savings
    const currentSize = auditResults.totalSize;
    return sum + (currentSize * (issue.reduction / 100));
  }, 0);
  
  auditResults.summary = {
    totalImages: auditResults.totalImages,
    totalSize: formatBytes(auditResults.totalSize),
    issuesFound: issues.length,
    highPriorityIssues: issues.filter(i => i.severity === 'high').length,
    estimatedSavings: formatBytes(totalSavings),
    recommendations: auditResults.recommendations.length
  };
}

function displayResults(auditResults) {
  const { summary, issues, recommendations } = auditResults;
  
  console.log('\n📊 Image Audit Results:');
  console.log(`Total Images: ${summary.totalImages}`);
  console.log(`Total Size: ${summary.totalSize}`);
  console.log(`Issues Found: ${summary.issuesFound}`);
  console.log(`High Priority Issues: ${summary.highPriorityIssues}`);
  console.log(`Estimated Savings: ${summary.estimatedSavings}`);
  
  if (issues.length > 0) {
    console.log('\n🚨 Issues Found:');
    issues.slice(0, 5).forEach(issue => {
      console.log(`  • ${issue.image}: ${issue.currentSize} (${issue.severity} priority)`);
    });
    if (issues.length > 5) {
      console.log(`  ... and ${issues.length - 5} more issues`);
    }
  }
  
  if (recommendations.length > 0) {
    console.log('\n💡 Recommendations:');
    recommendations.slice(0, 3).forEach(rec => {
      console.log(`  • ${rec.type}: ${rec.suggestion}`);
    });
  }
  
  console.log(`\n📄 Full report saved to: ${OUTPUT_FILE}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run audit if script is called directly
if (require.main === module) {
  runImageAudit().catch(console.error);
}

module.exports = { runImageAudit };