# API Integration Requirements for Irish Systems

## Overview
This document details the technical requirements for integrating with Irish government and financial systems to complete the platform's Ireland-specific features.

## 1. Property Price Register (PPR) API

### Endpoint Requirements
```yaml
Base URL: https://api.propertypriceregister.ie/v1
Authentication: API Key
Rate Limits: 1000 requests/hour
Response Format: JSON
```

### Required Endpoints
```typescript
// Search property sales
GET /sales/search
Query Parameters:
  - county: string (required)
  - dateFrom: string (YYYY-MM-DD)
  - dateTo: string (YYYY-MM-DD)
  - priceMin: number
  - priceMax: number
  - propertyType: 'new' | 'second-hand'
  
// Get specific sale details  
GET /sales/{saleId}

// Submit new sale (post-completion)
POST /sales/submit
Body: {
  address: Address,
  price: number,
  saleDate: string,
  propertyType: string,
  buyerType: string
}
```

### Integration Architecture
```typescript
// services/ireland/ppr-service.ts
export class PPRService {
  private apiKey: string;
  private baseUrl: string;
  private cache: CacheManager;
  
  async searchSales(params: PPRSearchParams): Promise<SaleRecord[]> {
    const cacheKey = this.getCacheKey(params);
    const cached = await this.cache.get(cacheKey);
    
    if (cached) return cached;
    
    const response = await this.apiClient.get('/sales/search', {
      headers: { 'X-API-Key': this.apiKey },
      params
    });
    
    await this.cache.set(cacheKey, response.data, 3600); // 1 hour cache
    return response.data;
  }
}
```

## 2. Revenue Online Service (ROS) Integration

### Authentication Requirements
```yaml
Type: Digital Certificate
Certificate Format: X.509
Authentication: OAuth 2.0 + Certificate
Environment: 
  - Test: https://test-ros.revenue.ie
  - Production: https://ros.revenue.ie
```

### Required APIs
```typescript
// HTB Claim Submission
POST /api/v1/htb/claims
Headers:
  - Authorization: Bearer {token}
  - X-Certificate: {base64_cert}
Body: {
  claimant: {
    ppsn: string,
    name: string,
    dateOfBirth: string
  },
  property: {
    address: Address,
    purchasePrice: number,
    vendorDetails: VendorInfo
  },
  taxReturns: TaxReturn[]
}

// Tax Clearance Verification
GET /api/v1/tax-clearance/{accessCode}
Response: {
  valid: boolean,
  expiryDate: string,
  holder: {
    name: string,
    taxNumber: string
  }
}

// Stamp Duty Return
POST /api/v1/stamp-duty/returns
Body: {
  transaction: TransactionDetails,
  calculation: StampDutyCalc,
  payment: PaymentDetails
}
```

### Security Implementation
```typescript
// lib/ireland/revenue-client.ts
export class RevenueClient {
  private certificate: Buffer;
  private privateKey: Buffer;
  
  constructor() {
    this.certificate = fs.readFileSync(process.env.ROS_CERT_PATH);
    this.privateKey = fs.readFileSync(process.env.ROS_KEY_PATH);
  }
  
  async authenticate(): Promise<string> {
    const assertion = await this.createClientAssertion();
    
    const response = await axios.post(`${ROS_BASE_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: assertion,
      scope: 'htb stamp_duty tax_clearance'
    });
    
    return response.data.access_token;
  }
}
```

## 3. Land Registry Integration

### Access Requirements
```yaml
System: landdirect.ie
Authentication: SAML 2.0
Account Type: Professional User
Monthly Fee: €150 + per-transaction costs
```

### API Capabilities
```typescript
interface LandRegistryAPI {
  // Folio Search
  searchFolio(params: {
    county: string;
    folio: string;
  }): Promise<FolioDetails>;
  
  // Title Documents
  downloadTitle(folioRef: string): Promise<Buffer>;
  
  // Dealing Submission
  submitDealing(dealing: {
    type: 'TRANSFER' | 'CHARGE' | 'DISCHARGE';
    parties: Party[];
    consideration: number;
    documents: Document[];
  }): Promise<DealingReference>;
  
  // Status Tracking
  trackDealing(reference: string): Promise<DealingStatus>;
}
```

### Implementation Example
```typescript
// services/ireland/land-registry.ts
export class LandRegistryService {
  private samlClient: SAMLClient;
  
  async searchTitle(address: string): Promise<TitleInfo> {
    const session = await this.samlClient.login();
    
    try {
      // First, search by address to find folio
      const searchResult = await this.api.post('/search/address', {
        address,
        sessionId: session.id
      });
      
      if (!searchResult.folios.length) {
        throw new Error('No folio found for address');
      }
      
      // Get full folio details
      const folio = await this.api.get(`/folio/${searchResult.folios[0].id}`, {
        headers: { 'X-Session-ID': session.id }
      });
      
      return this.mapToTitleInfo(folio);
    } finally {
      await this.samlClient.logout(session);
    }
  }
}
```

## 4. Irish Banking APIs

### AIB API Requirements
```yaml
API Type: Open Banking (PSD2)
Standard: Berlin Group NextGenPSD2
Authentication: OAuth 2.0 + eIDAS Certificate
Base URL: https://api.aib.ie/v1
```

### Bank of Ireland Requirements
```yaml
API Type: Open Banking + Partner API
Authentication: OAuth 2.0 + API Key
Sandbox: https://sandbox-api.bankofireland.com
Production: https://api.bankofireland.com
```

### Common Banking Endpoints
```typescript
interface IrishBankingAPI {
  // Account Information
  getAccounts(consent: string): Promise<Account[]>;
  getBalance(accountId: string): Promise<Balance>;
  getTransactions(accountId: string, dateFrom: string): Promise<Transaction[]>;
  
  // Payment Initiation
  initiatePayment(payment: {
    debtorAccount: string;
    creditorAccount: string;
    amount: Money;
    reference: string;
  }): Promise<PaymentId>;
  
  // Mortgage Specific (Partner APIs)
  submitApplication(application: MortgageApplication): Promise<ApplicationRef>;
  getDecision(applicationRef: string): Promise<MortgageDecision>;
  uploadDocuments(applicationRef: string, documents: File[]): Promise<void>;
}
```

### Integration Pattern
```typescript
// services/banking/irish-bank-adapter.ts
export abstract class IrishBankAdapter {
  abstract async authenticate(credentials: BankCredentials): Promise<Session>;
  abstract async getAccounts(session: Session): Promise<Account[]>;
  abstract async initiatePayment(session: Session, payment: Payment): Promise<string>;
}

export class AIBAdapter extends IrishBankAdapter {
  async authenticate(credentials: BankCredentials): Promise<Session> {
    // AIB-specific OAuth flow
    const token = await this.oauthClient.getToken({
      client_id: process.env.AIB_CLIENT_ID,
      client_secret: process.env.AIB_CLIENT_SECRET,
      certificate: this.getEIDASCertificate()
    });
    
    return { token, bankId: 'AIB' };
  }
}

export class BOIAdapter extends IrishBankAdapter {
  // Bank of Ireland implementation
}
```

## 5. PSRA License Verification

### Access Method
Since PSRA doesn't provide a public API, we'll implement web scraping with fallback to manual verification.

```typescript
// services/ireland/psra-scraper.ts
export class PSRAVerificationService {
  private browser: Browser;
  
  async verifyLicense(licenseNumber: string): Promise<PSRALicense | null> {
    const page = await this.browser.newPage();
    
    try {
      await page.goto('https://www.psr.ie/en/PSRA/Search/');
      
      // Fill search form
      await page.type('#LicenceNumber', licenseNumber);
      await page.click('#SearchButton');
      
      // Wait for results
      await page.waitForSelector('.search-results', { timeout: 10000 });
      
      // Extract license details
      const license = await page.evaluate(() => {
        const nameEl = document.querySelector('.licensee-name');
        const statusEl = document.querySelector('.license-status');
        const expiryEl = document.querySelector('.expiry-date');
        
        if (!nameEl) return null;
        
        return {
          name: nameEl.textContent?.trim(),
          status: statusEl.textContent?.trim(),
          expiryDate: expiryEl.textContent?.trim()
        };
      });
      
      return license;
    } catch (error) {
      // Fallback to manual verification queue
      await this.queueManualVerification(licenseNumber);
      return null;
    } finally {
      await page.close();
    }
  }
}
```

## 6. Eircode API

### Official API Access
```yaml
Provider: Eircode/An Post
Cost: €3,500/year base + usage
Format: REST API
Authentication: API Key
```

### Endpoints
```typescript
interface EircodeAPI {
  // Lookup address by Eircode
  GET /addresses/{eircode}
  Response: {
    eircode: string,
    address: {
      line1: string,
      line2?: string,
      line3?: string,
      county: string,
      country: 'Ireland'
    },
    coordinates: {
      latitude: number,
      longitude: number
    }
  }
  
  // Find Eircode by address
  POST /addresses/search
  Body: {
    addressLine: string,
    county?: string
  }
  Response: {
    matches: Array<{
      eircode: string,
      address: Address,
      matchScore: number
    }>
  }
}
```

## 7. Homebond Integration

### API Requirements
```yaml
Type: SOAP/XML (Legacy) + REST (New)
Authentication: Username/Password + IP Whitelist
Environment:
  - UAT: https://uat-api.homebond.ie
  - Production: https://api.homebond.ie
```

### Key Operations
```typescript
interface HomebondAPI {
  // Register new development
  registerDevelopment(details: {
    developer: DeveloperInfo,
    site: SiteDetails,
    units: number,
    planningRef: string
  }): Promise<DevelopmentId>;
  
  // Register individual unit
  registerUnit(unit: {
    developmentId: string,
    houseType: string,
    plot: string,
    price: number
  }): Promise<UnitRegistration>;
  
  // Generate warranty certificate
  generateCertificate(unitId: string): Promise<Buffer>; // PDF
  
  // Submit claim
  submitClaim(claim: {
    unitId: string,
    defectType: string,
    description: string,
    photos: string[]
  }): Promise<ClaimReference>;
}
```

## Error Handling Strategy

### Resilience Patterns
```typescript
// lib/ireland/resilient-client.ts
export class ResilientAPIClient {
  private circuitBreaker: CircuitBreaker;
  private retryPolicy: RetryPolicy;
  private cache: CacheManager;
  
  async request<T>(
    config: RequestConfig
  ): Promise<T> {
    // Check circuit breaker
    if (this.circuitBreaker.isOpen()) {
      // Try fallback
      return this.getFallback(config);
    }
    
    try {
      // Attempt request with retry
      const response = await this.retryPolicy.execute(
        () => this.httpClient.request(config)
      );
      
      this.circuitBreaker.recordSuccess();
      return response.data;
      
    } catch (error) {
      this.circuitBreaker.recordFailure();
      
      // Log to monitoring
      this.monitor.logAPIError({
        service: config.service,
        error: error.message,
        timestamp: new Date()
      });
      
      // Try cache or fallback
      const cached = await this.cache.get(config.cacheKey);
      if (cached) return cached;
      
      throw new IntegrationError(
        `${config.service} unavailable`,
        error
      );
    }
  }
}
```

## Monitoring & Compliance

### Metrics to Track
```typescript
interface APIMetrics {
  service: string;
  endpoint: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
  success: boolean;
  errorType?: string;
}

// Compliance tracking
interface ComplianceLog {
  service: string;
  operation: string;
  user: string;
  timestamp: Date;
  dataAccessed: string[];
  legalBasis: string;
  retentionPeriod: number;
}
```

## Security Requirements

### API Key Management
```yaml
Storage: AWS Secrets Manager
Rotation: Every 90 days
Access: IAM Role-based
Encryption: AES-256
```

### Certificate Management
```yaml
Storage: AWS Certificate Manager
Format: PEM/PKCS12
Validation: Daily health check
Expiry Alerts: 30, 14, 7 days
```

### Data Protection
```typescript
// Encryption for sensitive data
export class SensitiveDataHandler {
  private kms: AWS.KMS;
  
  async encrypt(data: any, context: string): Promise<string> {
    const key = await this.kms.generateDataKey({
      KeyId: process.env.KMS_KEY_ID,
      KeySpec: 'AES_256'
    }).promise();
    
    const encrypted = this.cipher.encrypt(
      JSON.stringify(data),
      key.Plaintext
    );
    
    return Buffer.concat([
      key.CiphertextBlob,
      encrypted
    ]).toString('base64');
  }
}
```

## Testing Strategy

### Mock Services
```typescript
// tests/mocks/irish-services.ts
export const mockPPRService = {
  searchSales: jest.fn().mockResolvedValue([
    {
      address: '123 Test St, Dublin',
      price: 350000,
      saleDate: '2024-01-15',
      propertyType: 'new'
    }
  ])
};

export const mockRevenueService = {
  verifyTaxClearance: jest.fn().mockResolvedValue({
    valid: true,
    expiryDate: '2025-12-31'
  })
};
```

### Integration Tests
```yaml
Environment: Docker Compose
Services:
  - Mock PPR API
  - Mock Revenue Service
  - Mock Bank APIs
  - Redis Cache
  - PostgreSQL
```

## Implementation Timeline

### Phase 1 (Weeks 1-4)
- Set up API client framework
- Implement resilience patterns
- Create mock services
- Security infrastructure

### Phase 2 (Weeks 5-8)
- PPR integration
- Revenue basics (tax clearance)
- PSRA verification

### Phase 3 (Weeks 9-12)
- Banking integrations
- Land Registry
- Homebond

### Phase 4 (Weeks 13-16)
- Error handling refinement
- Performance optimization
- Full integration testing
- Documentation