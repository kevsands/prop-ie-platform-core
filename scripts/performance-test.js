#!/usr/bin/env node

/**
 * Performance testing script for the prop-ie-aws-app
 * Tests loading times, image optimization, and mobile performance
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../performance-reports');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function runPerformanceTests() {
  console.log('🚀 Starting performance tests...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Test 1: Desktop Performance
    console.log('📊 Testing desktop performance...');
    const desktopResults = await testPagePerformance(browser, BASE_URL, 'desktop');
    
    // Test 2: Mobile Performance
    console.log('📱 Testing mobile performance...');
    const mobileResults = await testPagePerformance(browser, BASE_URL, 'mobile');
    
    // Test 3: Search Page Performance
    console.log('🔍 Testing search page performance...');
    const searchResults = await testPagePerformance(browser, `${BASE_URL}/properties/search`, 'desktop');
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      tests: {
        desktop: desktopResults,
        mobile: mobileResults,
        search: searchResults
      }
    };
    
    // Save report
    const reportPath = path.join(OUTPUT_DIR, `performance-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('\n📊 Performance Test Results:');
    console.log(`Desktop Load Time: ${desktopResults.loadTime}ms`);
    console.log(`Mobile Load Time: ${mobileResults.loadTime}ms`);
    console.log(`Search Page Load Time: ${searchResults.loadTime}ms`);
    console.log(`\n📄 Full report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await browser.close();
  }
}

async function testPagePerformance(browser, url, deviceType) {
  const page = await browser.newPage();
  
  try {
    // Set device type
    if (deviceType === 'mobile') {
      await page.setViewport({ width: 375, height: 667 });
      await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15');
    } else {
      await page.setViewport({ width: 1920, height: 1080 });
    }
    
    // Enable performance monitoring
    await page.tracing.start({ path: `${OUTPUT_DIR}/trace-${deviceType}-${Date.now()}.json` });
    
    const startTime = Date.now();
    
    // Navigate to page and wait for network idle
    await page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    const loadTime = Date.now() - startTime;
    
    // Get performance metrics
    const metrics = await page.metrics();
    
    // Check for images and count them
    const imageCount = await page.$$eval('img', imgs => imgs.length);
    
    // Get largest contentful paint
    const lcp = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          resolve(lastEntry ? lastEntry.startTime : 0);
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Timeout after 5 seconds
        setTimeout(() => resolve(0), 5000);
      });
    });
    
    await page.tracing.stop();
    
    return {
      url,
      deviceType,
      loadTime,
      imageCount,
      largestContentfulPaint: lcp,
      metrics: {
        JSHeapUsedSize: metrics.JSHeapUsedSize,
        JSHeapTotalSize: metrics.JSHeapTotalSize,
        FirstMeaningfulPaint: metrics.FirstMeaningfulPaint,
        DOMContentLoaded: metrics.DOMContentLoaded
      }
    };
    
  } finally {
    await page.close();
  }
}

// Run tests if script is called directly
if (require.main === module) {
  runPerformanceTests().catch(console.error);
}

module.exports = { runPerformanceTests };