/**
 * Test script for Units API
 * 
 * This script demonstrates how to use the Units API endpoints with transaction support
 * for creating units with associated documents.
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
 * Test getting all units
 */
async function testGetUnits() {
  console.log('Testing GET /api/units');
  const result = await callApi('/units');
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Test filtering units
 */
async function testFilterUnits(developmentId) {
  console.log(`\nTesting GET /api/units?developmentId=${developmentId}`);
  const result = await callApi(`/units?developmentId=${developmentId}&minBedrooms=2&maxPrice=500000`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Test getting a specific unit
 */
async function testGetUnitById(id) {
  console.log(`\nTesting GET /api/units?id=${id}`);
  const result = await callApi(`/units?id=${id}`);
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  return result;
}

/**
 * Test creating a unit with associated documents (transaction)
 */
async function testCreateUnitWithDocuments(developmentId, authToken) {
  console.log('\nTesting POST /api/units (with transaction support)');
  
  const unitData = {
    name: `Test Unit ${Math.floor(Math.random() * 1000)}`,
    developmentId,
    type: 'DETACHED',
    size: 120,
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    parkingSpaces: 1,
    basePrice: 350000,
    status: 'AVAILABLE',
    berRating: 'A2',
    features: ['Garden', 'Underfloor Heating', 'Solar Panels'],
    primaryImage: '/images/properties/test-unit.jpg',
    images: ['/images/properties/test-unit.jpg', '/images/properties/test-unit-2.jpg'],
    
    // Associated documents to be created in the same transaction
    documents: [
      {
        title: 'Floor Plan',
        description: 'Detailed floor plan for the unit',
        type: 'FLOOR_PLAN',
        category: 'TECHNICAL',
        status: 'ACTIVE',
        fileUrl: '/documents/floor-plan.pdf',
        fileType: 'application/pdf',
        size: 1024 * 1024, // 1MB
        version: 1,
      },
      {
        title: 'Site Layout',
        description: 'Site layout showing the unit location',
        type: 'SITE_PLAN',
        category: 'TECHNICAL',
        status: 'ACTIVE',
        fileUrl: '/documents/site-layout.pdf',
        fileType: 'application/pdf',
        size: 2 * 1024 * 1024, // 2MB
        version: 1,
      }
    ]
  };
  
  const result = await callApi('/units', 'POST', unitData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result;
}

/**
 * Test updating a unit
 */
async function testUpdateUnit(id, authToken) {
  console.log(`\nTesting PUT /api/units?id=${id}`);
  
  const updateData = {
    status: 'RESERVED',
    basePrice: 375000,
    updatedAt: new Date().toISOString()
  };
  
  const result = await callApi(`/units?id=${id}`, 'PUT', updateData, {
    'Authorization': `Bearer ${authToken}`
  });
  
  console.log(`Status: ${result.status}`);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result;
}

/**
 * Test deleting a unit
 */
async function testDeleteUnit(id, authToken) {
  console.log(`\nTesting DELETE /api/units?id=${id}`);
  
  const result = await callApi(`/units?id=${id}`, 'DELETE', null, {
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
    
    // For testing, we can use a hardcoded development ID
    const developmentId = 'dev-123456'; // Replace with a valid ID
    
    // Run tests
    await testGetUnits();
    await testFilterUnits(developmentId);
    
    // Create a new unit with documents using transaction support
    const createResult = await testCreateUnitWithDocuments(developmentId, authToken);
    
    if (createResult.status === 201 && createResult.data.id) {
      const unitId = createResult.data.id;
      
      // Test getting the created unit
      await testGetUnitById(unitId);
      
      // Test updating the unit
      await testUpdateUnit(unitId, authToken);
      
      // Test deleting the unit
      // Note: This will fail if there are associated sales
      await testDeleteUnit(unitId, authToken);
    }
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Error running tests:', error);
  }
}

// Run the tests
runTests();