// Verify App Script for Prop.ie Demo
// This script checks if all the key routes are working before the demo

const http = require('http');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds timeout

// Key routes to check
const ROUTES = [
  { path: '/', name: 'Home Page' },
  { path: '/properties', name: 'Property Listings' },
  { path: '/developments', name: 'Development Projects' },
  { path: '/transaction-flow', name: 'Transaction Flow' },
  { path: '/kyc-verification', name: 'KYC Verification' },
  { path: '/buyer/htb/calculator', name: 'Help-to-Buy Calculator' },
  { path: '/developers/projects', name: 'Developer Projects' },
  { path: '/agents/listings', name: 'Agent Listings' },
  { path: '/solicitors/cases', name: 'Solicitor Cases' },
  { path: '/buyer', name: 'Buyer Dashboard' }
];

// Check if server is running
function isServerRunning() {
  try {
    // Try to make a request to the base URL
    http.get(BASE_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Server is running at', BASE_URL);
        return true;
      } else {
        console.log('❌ Server responded with status code:', res.statusCode);
        return false;
      }
    }).on('error', (err) => {
      console.log('❌ Server is not running. Error:', err.message);
      return false;
    });
  } catch (error) {
    console.log('❌ Error checking server status:', error);
    return false;
  }
}

// Check a single route
function checkRoute(route) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${route.path}`, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${route.name} (${route.path}) is working`);
        resolve(true);
      } else {
        console.log(`❌ ${route.name} (${route.path}) responded with status code: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (err) => {
      console.log(`❌ Error accessing ${route.name} (${route.path}): ${err.message}`);
      resolve(false);
    });

    req.setTimeout(TIMEOUT, () => {
      console.log(`❌ Timeout accessing ${route.name} (${route.path})`);
      req.abort();
      resolve(false);
    });
  });
}

// Check all routes
async function checkAllRoutes() {
  console.log('\n🔍 Checking key routes...');
  let allRoutesWorking = true;
  let failedRoutes = [];

  for (const route of ROUTES) {
    const isWorking = await checkRoute(route);
    if (!isWorking) {
      allRoutesWorking = false;
      failedRoutes.push(route);
    }
  }

  console.log('\n📊 Results Summary:');
  if (allRoutesWorking) {
    console.log('✅ All routes are working!');
  } else {
    console.log('❌ Some routes are not working:');
    failedRoutes.forEach(route => {
      console.log(`   - ${route.name} (${route.path})`);
    });
  }

  return allRoutesWorking;
}

// Main function
async function main() {
  console.log('🚀 Starting Prop.ie demo verification script');
  
  // Check if Next.js server is running
  if (!isServerRunning()) {
    console.log('\n❓ Do you want to start the Next.js server? (Y/n)');
    process.stdin.once('data', (data) => {
      const input = data.toString().trim().toLowerCase();
      if (input === 'y' || input === '') {
        console.log('\n🚀 Starting Next.js server...');
        try {
          // Using spawn to start server in background
          const { spawn } = require('child_process');
          const server = spawn('npm', ['run', 'dev'], {
            cwd: path.resolve(__dirname),
            stdio: 'inherit',
            detached: true
          });
          
          // Wait for server to start
          console.log('⏳ Waiting for server to start...');
          setTimeout(() => {
            checkAllRoutes().then(allWorking => {
              if (allWorking) {
                console.log('\n✅ Prop.ie is ready for the demo!');
              } else {
                console.log('\n⚠️ Some routes are not working. Please fix the issues before the demo.');
              }
            });
          }, 5000);
        } catch (error) {
          console.log('❌ Error starting Next.js server:', error);
        }
      } else {
        console.log('❌ Server not running. Verification canceled.');
        process.exit(1);
      }
    });
  } else {
    const allWorking = await checkAllRoutes();
    if (allWorking) {
      console.log('\n✅ Prop.ie is ready for the demo!');
    } else {
      console.log('\n⚠️ Some routes are not working. Please fix the issues before the demo.');
    }
  }
}

// Run the script
main(); 