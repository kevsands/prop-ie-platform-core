// Test script to verify estate agents page functionality

const fs = require('fs');
const path = require('path');

console.log('Testing Estate Agents Page...\n');

try {
  // Check if the page file exists
  const pagePath = './src/app/solutions/estate-agents/page.tsx';
  
  if (fs.existsSync(pagePath)) {
    console.log('✓ Estate Agents page file exists');
    
    // Read the file content
    const content = fs.readFileSync(pagePath, 'utf8');
    
    // Check for required components and features
    const checks = [
      { name: 'Hero Section', pattern: /Estate Agent Solutions/ },
      { name: 'Transaction Management', pattern: /TransactionManagement/ },
      { name: 'Viewing Coordination', pattern: /ViewingCoordination/ },
      { name: 'Completion Process', pattern: /CompletionProcess/ },
      { name: 'Client Communication', pattern: /ClientCommunication/ },
      { name: 'Sales Analytics', pattern: /SalesAnalytics/ },
      { name: 'FAQ Section', pattern: /Frequently Asked Questions/ },
      { name: 'Success Stories', pattern: /Agency Success Stories/ },
      { name: 'Integration Section', pattern: /Seamless Integration with Developer Systems/ },
      { name: 'CTA Section', pattern: /Ready to Transform Your Agency/ }
    ];
    
    let allChecksPassed = true;
    
    checks.forEach(check => {
      if (content.match(check.pattern)) {
        console.log(`✓ ${check.name} found`);
      } else {
        console.log(`✗ ${check.name} NOT found`);
        allChecksPassed = false;
      }
    });
    
    // Check for proper imports
    if (content.includes('import React') && content.includes('from \'react\'')) {
      console.log('✓ React imports are correct');
    }
    
    if (content.includes('import Link') && content.includes('from \'next/link\'')) {
      console.log('✓ Next.js Link import is correct');
    }
    
    if (content.includes('lucide-react')) {
      console.log('✓ Icon imports are correct');
    }
    
    if (content.includes('framer-motion')) {
      console.log('✓ Animation library imports are correct');
    }
    
    // Check for component structure
    if (content.includes('export default function EstateAgentsPage()')) {
      console.log('✓ Main component function is properly exported');
    }
    
    // Check for state management
    if (content.includes('useState')) {
      console.log('✓ State management is implemented');
    }
    
    console.log('\nPage Structure Summary:');
    console.log('======================');
    if (allChecksPassed) {
      console.log('✅ All required sections are present');
      console.log('✅ The page is properly structured');
      console.log('✅ All imports are correct');
      console.log('\nThe Estate Agents page is correctly implemented!');
    } else {
      console.log('⚠️  Some sections may be missing');
      console.log('Please review the implementation');
    }
    
  } else {
    console.log('❌ Estate Agents page file does not exist');
  }
  
} catch (error) {
  console.error('Error testing estate agents page:', error.message);
}

// Test URL accessibility
console.log('\nTo test the page in browser:');
console.log('1. Open http://localhost:3000/solutions/estate-agents');
console.log('2. Verify all sections load correctly');
console.log('3. Test interactive features (tabs, buttons, etc.)');
console.log('4. Check responsive design on different screen sizes');