#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const sbomPath = path.join(process.cwd(), 'sbom.json');
const minimumComponents = 10; // Minimum number of components expected

// Generate SBOM if it doesn't exist
if (!fs.existsSync(sbomPath)) {
  console.log('Generating SBOM...');
  try {
    execSync('npx @cyclonedx/cyclonedx-npm --output sbom.json', { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to generate SBOM:', error.message);
    process.exit(1);
  }
}

// Read and validate SBOM
try {
  const sbomContent = JSON.parse(fs.readFileSync(sbomPath, 'utf8'));
  
  // Check SBOM format
  if (!sbomContent.bomFormat || !sbomContent.components) {
    console.error('Invalid SBOM format. Missing required fields.');
    process.exit(1);
  }
  
  // Check component count
  if (sbomContent.components.length < minimumComponents) {
    console.error(`SBOM contains only ${sbomContent.components.length} components, expected at least ${minimumComponents}.`);
    process.exit(1);
  }
  
  // Check for suspicious packages
  const suspiciousPatterns = [
    /coaufu/i,
    /malicious/i,
    /suspic/i
  ];
  
  const suspiciousComponents = sbomContent.components.filter(component => 
    suspiciousPatterns.some(pattern => 
      pattern.test(component.name) || 
      (component.description && pattern.test(component.description))
    )
  );
  
  if (suspiciousComponents.length > 0) {
    console.error('⚠️ WARNING: Potentially suspicious components found in SBOM:');
    suspiciousComponents.forEach(component => {
      console.error(`- ${component.name}@${component.version}: ${component.description || 'No description'}`);
    });
    // Don't exit with error, just warn
  }
  
  // Check for components with high-risk packages
  const highRiskPackages = [
    'event-stream',
    'colors',
    'ua-parser-js',
    'coa',
    'rc',
    'faker',
    'loadash',
    'bb-lock',
    'eslint-scope'
  ];
  
  const highRiskComponents = sbomContent.components.filter(component =>
    highRiskPackages.some(pkg => component.name === pkg || component.name.endsWith(`/${pkg}`))
  );
  
  if (highRiskComponents.length > 0) {
    console.error('⚠️ WARNING: High-risk packages found in SBOM (previously involved in supply chain attacks):');
    highRiskComponents.forEach(component => {
      console.error(`- ${component.name}@${component.version}: ${component.description || 'No description'}`);
    });
    // Don't exit with error, just warn
  }
  
  console.log(`✅ SBOM validation successful. Contains ${sbomContent.components.length} components.`);
  console.log(`SBOM last generated: ${new Date().toISOString()}`);
  
  // Update SBOM metadata
  sbomContent.metadata = {
    ...sbomContent.metadata,
    lastChecked: new Date().toISOString()
  };
  
  fs.writeFileSync(sbomPath, JSON.stringify(sbomContent, null, 2));
  
} catch (error) {
  console.error('Error validating SBOM:', error.message);
  process.exit(1);
}