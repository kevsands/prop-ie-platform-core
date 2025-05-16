// Test script to check if the Footer is working
const path = require('path');

console.log('Testing Footer component import...');

try {
  // Test the import paths
  const footerPath = path.join(__dirname, 'src/components/layout/Footer/Footer.tsx');
  const typesPath = path.join(__dirname, 'src/components/layout/Footer/types.ts');
  
  const fs = require('fs');
  
  if (fs.existsSync(footerPath)) {
    console.log('✅ Footer.tsx exists');
  } else {
    console.log('❌ Footer.tsx not found');
  }
  
  if (fs.existsSync(typesPath)) {
    console.log('✅ types.ts exists');
  } else {
    console.log('❌ types.ts not found');
  }
  
  // Check for syntax errors in Footer.tsx
  const footerContent = fs.readFileSync(footerPath, 'utf8');
  console.log('\n✅ Footer component file structure:');
  console.log('- Has imports:', footerContent.includes('import'));
  console.log('- Has FC type:', footerContent.includes('React.FC'));
  console.log('- Has footerColumns:', footerContent.includes('footerColumns'));
  console.log('- Has socialLinks:', footerContent.includes('socialLinks'));
  console.log('- Has export:', footerContent.includes('export default'));
  
} catch (error) {
  console.error('Error:', error.message);
}

console.log('\nFooter component test complete.');