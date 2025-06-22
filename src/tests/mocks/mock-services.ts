/**
 * Mock Irish Government Services for Enterprise Testing
 * Provides realistic mock responses for Revenue.ie, Land Registry, PSRA, etc.
 */

import { MockServer } from './mock-server';

let mockServer: MockServer | null = null;

export async function setupMockServices(): Promise<void> {
  mockServer = new MockServer();
  await mockServer.start();
  
  // Mock Revenue.ie HTB service
  mockServer.addRoute('POST', '/api/revenue/htb/register', (req, res) => {
    const { ppsNumber, annualIncome, propertyValue } = req.body;
    
    // Simulate HTB eligibility check
    const eligible = annualIncome <= 75000 && propertyValue <= 500000;
    const benefit = eligible ? Math.min(30000, propertyValue * 0.05) : 0;
    
    res.json({
      success: true,
      data: {
        ppsNumber,
        eligible,
        maxBenefit: benefit,
        applicationId: `HTB-${Date.now()}`,
        status: 'approved',
        conditions: eligible ? [
          'First-time buyer requirement',
          'Must be used as primary residence',
          'Property value under €500,000'
        ] : ['Eligibility criteria not met']
      }
    });
  });
  
  // Mock Land Registry service
  mockServer.addRoute('GET', '/api/landregistry/folio/:folioNumber', (req, res) => {
    const { folioNumber } = req.params;
    
    res.json({
      success: true,
      data: {
        folioNumber,
        property: {
          address: '123 Mock Street, Dublin 1',
          description: 'Apartment in multi-storey building',
          registeredOwner: 'John Doe',
          burdens: [],
          dealings: [
            {
              type: 'Transfer',
              date: '2023-01-15',
              consideration: '€350,000'
            }
        ],
        titleType: 'Freehold',
        mapReference: 'OS123456'
        }
      }
    });
  });
  
  // Mock PSRA license verification
  mockServer.addRoute('GET', '/api/psra/license/:licenseNumber', (req, res) => {
    const { licenseNumber } = req.params;
    
    const validLicenses = ['PSRA001234', 'PSRA005678', 'PSRA009012'];
    const isValid = validLicenses.includes(licenseNumber);
    
    res.json({
      success: true,
      data: {
        licenseNumber,
        valid: isValid,
        status: isValid ? 'Active' : 'Invalid',
        holder: isValid ? {
          name: 'Mock Estate Agency Ltd',
          address: '456 Business Street, Dublin 2',
          licenseType: 'Property Services Provider',
          expiryDate: '2025-12-31'
        } : null
      }
    });
  });
  
  // Mock planning authority service
  mockServer.addRoute('POST', '/api/planning/application', (req, res) => {
    const { applicationType, propertyAddress, description } = req.body;
    
    res.json({
      success: true,
      data: {
        applicationId: `PL-${Date.now()}`,
        referenceNumber: `24/${Math.floor(Math.random() * 10000)}`,
        status: 'Submitted',
        submittedDate: new Date().toISOString(),
        estimatedDecisionDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          application: 65,
          newspaper: 54,
          total: 119
        },
        nextSteps: [
          'Public notice period (4 weeks)',
          'Third party submissions review',
          'Planning officer assessment',
          'Decision notification'
        ]
      }
    });
  });
  
  // Mock Building Control service
  mockServer.addRoute('POST', '/api/buildingcontrol/commencement', (req, res) => {
    const { projectId, startDate, principalContractor } = req.body;
    
    res.json({
      success: true,
      data: {
        noticeId: `CN-${Date.now()}`,
        projectId,
        submittedDate: new Date().toISOString(),
        acknowledgmentDate: new Date().toISOString(),
        status: 'Acknowledged',
        validityPeriod: '3 years from commencement',
        conditions: [
          'BCAR Assigned Certifier must be appointed',
          'Fire Safety Certificate must be obtained',
          'All works must comply with Building Regulations'
        ]
      }
    });
  });
  
  console.log('✅ Mock Irish government services started on port 4000');
}

export async function cleanupMockServices(): Promise<void> {
  if (mockServer) {
    await mockServer.stop();
    mockServer = null;
    console.log('✅ Mock services stopped');
  }
}