/**
 * Test script for Customizations API
 * 
 * This script demonstrates how to use the Customizations API with transaction support
 * for creating customization selections for a unit sale.
 */

const fetch = require('node-fetch');
const { v4: uuidv4 } = require('uuid');

// Base URL - update as needed
const BASE_URL = 'http://localhost:3000/api';

/**
 * Helper function to make API requests
 */
async function callApi(endpoint, method = 'GET', body = null, headers = {}) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      status: response.status,
      data
    };
  } catch (error) {
    console.error(`API Error: ${error.message}`);
    return {
      status: 500,
      data: { error: error.message }
    };
  }
}

/**
 * Test getting all customizations for a unit
 */
async function testGetCustomizationsByUnit(unitId) {
  console.log(`\nTesting GET /api/customizations?unitId=${unitId}`);
  const result = await callApi(`/customizations?unitId=${unitId}`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Test getting all customizations for a sale
 */
async function testGetCustomizationsBySale(saleId) {
  console.log(`\nTesting GET /api/customizations?saleId=${saleId}`);
  const result = await callApi(`/customizations?saleId=${saleId}`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Test creating a customization package with selections
 */
async function testCreateCustomization(saleId, unitId, authToken) {
  console.log('\nTesting POST /api/customizations (with transaction support)');
  
  const customizationData = {
    saleId,
    unitId,
    selections: [
      {
        customizationOptionId: 'option-1', // Replace with valid ID
        color: 'Slate Gray',
        material: 'Engineered Hardwood',
        quantity: 1,
        additionalCost: 2500
      },
      {
        customizationOptionId: 'option-2', // Replace with valid ID
        color: 'Arctic White',
        material: 'Quartz',
        quantity: 1,
        additionalCost: 3500
      },
      {
        customizationOptionId: 'option-3', // Replace with valid ID
        material: 'Brushed Nickel',
        quantity: 6,
        additionalCost: 1200
      }
    ]
  };
  
  const result = await callApi('/customizations', 'POST', customizationData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result;
}

/**
 * Test updating a customization package
 */
async function testUpdateCustomization(packageId, authToken) {
  console.log(`\nTesting PUT /api/customizations (packageId: ${packageId})`);
  
  const updateData = {
    customizationPackageId: packageId,
    status: 'APPROVED',
    selections: [
      {
        id: 'selection-1', // Replace with valid ID
        color: 'Charcoal Gray',
        notes: 'Changed from Slate Gray to Charcoal Gray'
      },
      {
        id: 'selection-2', // Replace with valid ID
        additionalCost: 4000,
        notes: 'Upgraded to premium material'
      }
    ]
  };
  
  const result = await callApi('/customizations', 'PUT', updateData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result;
}

/**
 * Run all tests
 */
async function runTests() {
  try {
    // Get authentication token (simplified for testing)
    // In a real scenario, you would implement proper auth
    const authToken = 'test-auth-token';
    
    // For testing, we can use hardcoded IDs
    const unitId = 'unit-123456'; // Replace with a valid ID
    const saleId = 'sale-123456'; // Replace with a valid ID
    
    // Run tests
    await testGetCustomizationsByUnit(unitId);
    await testGetCustomizationsBySale(saleId);
    
    // Create a new customization package with selections using transaction support
    const createResult = await testCreateCustomization(saleId, unitId, authToken);
    
    if (createResult.status === 201 && createResult.data.data.customizationPackage.id) {
      const packageId = createResult.data.data.customizationPackage.id;
      
      // Test updating the customization package
      await testUpdateCustomization(packageId, authToken);
    }
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();