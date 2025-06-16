/**
 * Generate Secure Secrets for PROP.ie Production
 * 
 * Run this script to generate secure random secrets for production deployment.
 */

const crypto = require('crypto');

function generateSecureSecret(length = 64) {
  return crypto.randomBytes(length).toString('base64url');
}

function generateSecrets() {
  const secrets = {
    NEXTAUTH_SECRET: generateSecureSecret(64),
    JWT_SECRET: generateSecureSecret(64),
    // Additional secrets for production
    ENCRYPTION_KEY: generateSecureSecret(32),
    API_SECRET_KEY: generateSecureSecret(48),
  };

  console.log('🔐 Generated Secure Secrets for PROP.ie Production');
  console.log('================================================');
  console.log('');
  console.log('Add these to your .env.local or .env.production:');
  console.log('');
  
  Object.entries(secrets).forEach(([key, value]) => {
    console.log(`${key}="${value}"`);
  });
  
  console.log('');
  console.log('⚠️  SECURITY WARNING:');
  console.log('- Store these secrets securely');
  console.log('- Do not commit them to git');
  console.log('- Use different secrets for each environment');
  console.log('- Regenerate secrets if compromised');
  console.log('');
  
  return secrets;
}

// Generate and display secrets
generateSecrets();

module.exports = { generateSecureSecret, generateSecrets };