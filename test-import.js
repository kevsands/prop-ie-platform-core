// This is a simple test file to validate our import fix
console.log('Testing SecurityMonitor import from security module');

try {
  // Use CommonJS require
  const fs = require('fs');
  
  // Check if security-exports.ts contains SecurityMonitor export
  const securityExportsContent = fs.readFileSync('./src/lib/security/security-exports.ts', 'utf8');
  const hasSecurityMonitorExport = securityExportsContent.includes("export { default as SecurityMonitor }");
  console.log('SecurityMonitor exported in security-exports.ts:', hasSecurityMonitorExport);
  
  // Check if security/index.ts re-exports SecurityMonitor
  const securityIndexContent = fs.readFileSync('./src/lib/security/index.ts', 'utf8');
  const indexExportsSecurityMonitor = securityIndexContent.includes("export { SecurityMonitor } from './security-exports';");
  console.log('SecurityMonitor re-exported in security/index.ts:', indexExportsSecurityMonitor);
  
  // Check if the files that import SecurityMonitor now use the correct path
  const checkImportPath = (filePath, expectedImport) => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasCorrectImport = content.includes(expectedImport);
      console.log(`${filePath} uses correct import:`, hasCorrectImport);
      return hasCorrectImport;
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err.message);
      return false;
    }
  };
  
  // Check imports in the files we modified
  const appWrapperImport = checkImportPath(
    './src/components/AppWrapper.tsx', 
    "import { SecurityMonitor } from '@/lib/security';"
  );
  
  const securityDashboardImport = checkImportPath(
    './src/app/dashboard/security/SecurityDashboardClient.tsx',
    "import { SecurityMonitor } from '@/lib/security';"
  );
  
  const developerLayoutImport = checkImportPath(
    './src/app/developer/layout.tsx',
    "import { SecurityMonitor } from '@/lib/security';"
  );
  
  // Final result
  const allCorrect = hasSecurityMonitorExport && 
                     indexExportsSecurityMonitor && 
                     appWrapperImport && 
                     securityDashboardImport && 
                     developerLayoutImport;
  
  console.log('\nFix successfully applied:', allCorrect ? 'YES' : 'NO');
  
} catch (error) {
  console.error('Error during import test:', error);
}