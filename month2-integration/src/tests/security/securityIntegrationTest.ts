import { SecurityService } from '../../lib/security/security-exports';

/**
 * Integration test for security module imports and functionality
 * This file verifies that all imports are correctly resolved and the security module works as expected
 */

// Test initialization
async function testSecurityInitialization() {
  try {
    const initialized = await SecurityService.initialize();
    console.log('Security module initialization:', initialized ? 'SUCCESS' : 'FAILED');
    return initialized;
  } catch (error) {
    console.error('Security initialization error:', error);
    return false;
  }
}

// Test input validation
function testInputValidation() {
  const validInput = { name: 'Test User', email: 'test@example.com' };
  const invalidInput = { name: '<script>alert("XSS")</script>', email: 'not-an-email' };
  
  try {
    const validResult = SecurityService.validateInput(validInput);
    const invalidResult = SecurityService.validateInput(invalidInput);
    
    console.log('Valid input validation:', validResult ? 'PASSED' : 'FAILED');
    console.log('Invalid input validation:', !invalidResult ? 'PASSED' : 'FAILED');
    
    return validResult && !invalidResult;
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
}

// Test HTML sanitization
function testHTMLSanitization() {
  const unsafeHTML = '<script>alert("XSS")</script><p>Content</p>';
  
  try {
    const sanitized = SecurityService.sanitizeHTML(unsafeHTML);
    const scriptRemoved = !sanitized.includes('<script>');
    
    console.log('HTML sanitization:', scriptRemoved ? 'PASSED' : 'FAILED');
    console.log('Sanitized output:', sanitized);
    
    return scriptRemoved;
  } catch (error) {
    console.error('Sanitization error:', error);
    return false;
  }
}

// Test URL safety check
function testURLSafety() {
  const safeURL = 'https://example.com/page';
  const unsafeURL = 'javascript:alert("XSS")';
  
  try {
    const safeResult = SecurityService.isURLSafe(safeURL);
    const unsafeResult = SecurityService.isURLSafe(unsafeURL);
    
    console.log('Safe URL check:', safeResult ? 'PASSED' : 'FAILED');
    console.log('Unsafe URL check:', !unsafeResult ? 'PASSED' : 'FAILED');
    
    return safeResult && !unsafeResult;
  } catch (error) {
    console.error('URL safety check error:', error);
    return false;
  }
}

// Test error handling
function testErrorHandling() {
  const testError = new Error('Test error');
  
  try {
    SecurityService.handleError(testError);
    console.log('Error handling: PASSED');
    return true;
  } catch (error) {
    console.error('Error handling test failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('--- SECURITY MODULE INTEGRATION TESTS ---');
  
  const initResult = await testSecurityInitialization();
  const validationResult = testInputValidation();
  const sanitizationResult = testHTMLSanitization();
  const urlSafetyResult = testURLSafety();
  const errorHandlingResult = testErrorHandling();
  
  const allTests = [
    initResult,
    validationResult,
    sanitizationResult,
    urlSafetyResult,
    errorHandlingResult
  ];
  
  const passedTests = allTests.filter(result => result).length;
  const totalTests = allTests.length;
  
  console.log(`\nTEST SUMMARY: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('✅ All security module integration tests PASSED');
    return true;
  } else {
    console.log('❌ Some security module integration tests FAILED');
    return false;
  }
}

// Export the test runner
export { runTests };

// Auto-run tests if this file is executed directly
if (require.main === module) {
  runTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test execution error:', error);
      process.exit(1);
    });
}